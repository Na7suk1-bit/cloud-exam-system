import React, { useCallback, useEffect, useState } from 'react';
import { go, useRoute } from './lib/router.js';
import { grade, makeSession } from './lib/questions.js';
import {
  loadAdmin, loadHistory, loadSession, loadSubjects,
  saveAdmin, saveHistory, saveSession, saveSubjects,
} from './lib/storage.js';

import Toast from './components/Toast.jsx';
import UserLayout from './components/UserLayout.jsx';
import AdminLayout from './components/AdminLayout.jsx';

import Home from './pages/Home.jsx';
import Quiz from './pages/Quiz.jsx';
import Result from './pages/Result.jsx';
import Notes from './pages/Notes.jsx';
import History from './pages/History.jsx';

import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminOverview from './pages/admin/AdminOverview.jsx';
import AdminSubjects from './pages/admin/AdminSubjects.jsx';
import AdminQuestions from './pages/admin/AdminQuestions.jsx';
import AdminImport from './pages/admin/AdminImport.jsx';
import AdminNotes from './pages/admin/AdminNotes.jsx';

/*
 * 路由（hash）：
 *   #/                選題 + 選答題方式
 *   #/quiz            作答
 *   #/result          成績與逐題檢討
 *   #/notes           PDF 筆記
 *   #/history         練習紀錄
 *   #/admin[/...]     管理後台（subjects | questions | import | notes）
 */
export default function App() {
  const path = useRoute();
  const [, root = '', sub = ''] = path.split('/');

  const [subjects, setSubjects] = useState(loadSubjects);
  const [history, setHistory] = useState(loadHistory);
  const [session, setSession] = useState(loadSession);
  const [isAdmin, setIsAdmin] = useState(loadAdmin);
  const [adminSubjectId, setAdminSubjectId] = useState(null);
  const [toast, setToast] = useState(null);

  const notify = useCallback((msg, kind = 'ok') => setToast({ msg, kind, id: Date.now() }), []);
  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!saveSubjects(subjects)) notify('儲存失敗：瀏覽器儲存空間不足', 'err');
  }, [subjects, notify]);
  useEffect(() => {
    saveHistory(history);
  }, [history]);
  useEffect(() => {
    saveSession(session);
  }, [session]);

  const updateSubject = useCallback(
    (id, fn) => setSubjects((list) => list.map((s) => (s.id === id ? fn(s) : s))),
    []
  );

  /* ---------- 作答流程 ---------- */
  const startQuiz = (cfg) => {
    setSession(makeSession(cfg));
    go('/quiz');
  };

  const finishQuiz = () => {
    const done = { ...session, submitted: true };
    const { score, correct, scorable } = grade(done);
    setHistory((h) => [
      {
        id: Date.now(),
        subjectName: done.subjectName,
        date: new Date().toLocaleString('zh-TW'),
        score,
        correct,
        scorable,
        total: done.questions.length,
        mode: done.mode === 'instant' ? '練習模式' : '模擬測驗',
      },
      ...h,
    ]);
    setSession(done);
    go('/result');
  };

  const exitQuiz = () => {
    setSession(null);
    go('/');
  };

  const retry = (questions) => startQuiz({ subjectId: session.subjectId, subjectName: session.subjectName, mode: session.mode, questions });

  /* ---------- 管理後台 ---------- */
  if (root === 'admin') {
    const login = () => {
      saveAdmin(true);
      setIsAdmin(true);
    };
    const logout = () => {
      saveAdmin(false);
      setIsAdmin(false);
      go('/');
    };

    if (!isAdmin) return <AdminLogin onLogin={login} />;

    const adminSubject = subjects.find((s) => s.id === adminSubjectId) || subjects[0];
    const ctx = {
      subjects,
      setSubjects,
      updateSubject,
      subjectId: adminSubject?.id,
      setAdminSubjectId,
      notify,
    };

    const pages = {
      '': <AdminOverview {...ctx} />,
      subjects: <AdminSubjects {...ctx} />,
      questions: <AdminQuestions {...ctx} />,
      import: <AdminImport {...ctx} />,
      notes: <AdminNotes {...ctx} />,
    };

    return (
      <>
        <AdminLayout current={pages[sub] ? sub : ''} onLogout={logout}>
          {pages[sub] || pages['']}
        </AdminLayout>
        <Toast toast={toast} />
      </>
    );
  }

  /* ---------- 作答頁（獨立畫面，不顯示一般導覽列） ---------- */
  if (root === 'quiz') {
    return <Quiz session={session} setSession={setSession} onFinish={finishQuiz} onExit={exitQuiz} />;
  }

  /* ---------- 使用者介面 ---------- */
  let page;
  if (root === 'result') page = <Result session={session} onRetry={retry} />;
  else if (root === 'notes') page = <Notes subjects={subjects} />;
  else if (root === 'history') page = <History history={history} onClear={() => setHistory([])} />;
  else page = <Home subjects={subjects} onStart={startQuiz} />;

  return (
    <>
      <UserLayout current={root}>{page}</UserLayout>
      <Toast toast={toast} />
    </>
  );
}
