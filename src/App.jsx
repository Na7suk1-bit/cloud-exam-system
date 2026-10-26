import React, { useState } from 'react';
import UserLayout from './components/UserLayout';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import Notes from './pages/Notes';
import History from './pages/History';
import Profile from './pages/Profile';
import AdminLogin from './pages/admin/AdminLogin';
import AdminOverview from './pages/admin/AdminOverview';
import AdminQuestions from './pages/admin/AdminQuestions';
import AdminNotes from './pages/admin/AdminNotes';
import AdminSubjects from './pages/admin/AdminSubjects';
import AdminImport from './pages/admin/AdminImport';
import { loadAdmin, saveAdmin } from './lib/storage';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [adminSubTab, setAdminSubTab] = useState('overview');
  const [isAdmin, setIsAdmin] = useState(() => loadAdmin());
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizResult, setQuizResult] = useState(null);

  const handleAdminLogin = () => {
    setIsAdmin(true);
    saveAdmin(true);
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    saveAdmin(false);
    setCurrentTab('home');
  };

  const handleStartQuiz = (quizData) => {
    setActiveQuiz(quizData);
    setQuizResult(null);
  };

  const handleFinishQuiz = (resultData) => {
    setQuizResult(resultData);
    setActiveQuiz(null);
  };

  const handleRestartQuiz = () => {
    setQuizResult(null);
    setActiveQuiz(null);
  };

  const renderAdminPage = () => {
    switch (adminSubTab) {
      case 'overview':
        return <AdminOverview />;
      case 'questions':
        return <AdminQuestions />;
      case 'notes':
        return <AdminNotes />;
      case 'subjects':
        return <AdminSubjects />;
      case 'import':
        return <AdminImport />;
      default:
        return <AdminOverview />;
    }
  };

  const renderMainContent = () => {
    if (currentTab === 'admin') {
      if (!isAdmin) {
        return <AdminLogin onLoginSuccess={handleAdminLogin} />;
      }
      return (
        <AdminLayout
          currentSubTab={adminSubTab}
          setCurrentSubTab={setAdminSubTab}
          onLogout={handleAdminLogout}
        >
          {renderAdminPage()}
        </AdminLayout>
      );
    }

    if (currentTab === 'notes') return <Notes />;
    if (currentTab === 'history') return <History />;
    if (currentTab === 'profile') return <Profile />;

    if (quizResult) {
      return <Result result={quizResult} onRestart={handleRestartQuiz} />;
    }
    if (activeQuiz) {
      return (
        <Quiz
          subjectId={activeQuiz.subjectId}
          config={activeQuiz.config}
          onFinish={handleFinishQuiz}
        />
      );
    }
    return <Home onStartQuiz={handleStartQuiz} />;
  };

  return (
    <UserLayout
      currentTab={currentTab}
      setCurrentTab={(tab) => {
        setCurrentTab(tab);
        setQuizResult(null);
        setActiveQuiz(null);
      }}
    >
      {renderMainContent()}
    </UserLayout>
  );
}