import React, { useState } from 'react';
import { Copy, CheckCircle2, AlertTriangle, Upload } from 'lucide-react';
import { AI_PROMPT, copyText, parseQuestionJson, uid } from '../../lib/questions.js';
import { TypeBadge } from '../../components/QuestionParts.jsx';
import { PageTitle, SubjectSelect, ghostBtn, inputCls, primaryBtn } from './AdminShared.jsx';
import { go } from '../../lib/router.js';

export default function AdminImport({ subjects, subjectId, setAdminSubjectId, setSubjects, updateSubject, notify }) {
  const [target, setTarget] = useState(subjects.length ? 'existing' : 'new');
  const [writeMode, setWriteMode] = useState('append'); // append | replace
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('📚');
  const [text, setText] = useState('');
  const [result, setResult] = useState(null); // { questions, errors }

  const target_ok = target === 'new' ? newName.trim().length > 0 : !!subjectId;

  const check = () => setResult(parseQuestionJson(text));

  const readFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const t = await f.text();
    setText(t);
    setResult(parseQuestionJson(t));
    e.target.value = '';
  };

  const copyPrompt = async () => {
    notify((await copyText(AI_PROMPT)) ? '已複製 AI 轉檔指令，貼到 ChatGPT / Gemini / Claude 後接著貼上題目' : '複製失敗，請手動選取文字複製', 'ok');
  };

  const doImport = () => {
    if (!result || result.errors.length || !result.questions.length || !target_ok) return;
    if (target === 'new') {
      const s = { id: uid('s'), name: newName.trim(), icon: newIcon.trim() || '📚', description: '', questions: result.questions, notes: [] };
      setSubjects((list) => [...list, s]);
      setAdminSubjectId(s.id);
    } else {
      if (writeMode === 'replace' && !window.confirm('「取代」會先清空這個科目現有的所有題目，確定嗎？')) return;
      updateSubject(subjectId, (s) => ({ ...s, questions: writeMode === 'replace' ? result.questions : [...s.questions, ...result.questions] }));
    }
    notify(`已匯入 ${result.questions.length} 題`);
    setText('');
    setResult(null);
    go('/admin/questions');
  };

  return (
    <div>
      <PageTitle title="匯入題庫" desc="把題目交給 AI 轉成指定的 JSON 格式，貼上或上傳後檢查，確認沒問題再匯入。" />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 左：匯入表單 */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
            <p className="text-sm font-semibold text-slate-700">匯入到</p>
            <div className="flex gap-4 text-sm">
              <label className="flex items-center gap-1.5">
                <input type="radio" checked={target === 'existing'} disabled={!subjects.length} onChange={() => setTarget('existing')} /> 既有科目
              </label>
              <label className="flex items-center gap-1.5">
                <input type="radio" checked={target === 'new'} onChange={() => setTarget('new')} /> 新科目
              </label>
            </div>
            {target === 'existing' ? (
              <div className="space-y-2">
                <SubjectSelect subjects={subjects} value={subjectId} onChange={setAdminSubjectId} className="w-full" />
                <div className="flex gap-4 text-sm">
                  <label className="flex items-center gap-1.5">
                    <input type="radio" checked={writeMode === 'append'} onChange={() => setWriteMode('append')} /> 加到現有題目後面
                  </label>
                  <label className="flex items-center gap-1.5">
                    <input type="radio" checked={writeMode === 'replace'} onChange={() => setWriteMode('replace')} /> 取代全部題目
                  </label>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <input value={newIcon} onChange={(e) => setNewIcon(e.target.value)} className={`${inputCls} w-16 text-center`} maxLength={4} aria-label="圖示" />
                <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="新科目名稱" className={inputCls} />
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">題庫 JSON</p>
              <label className={`${ghostBtn} cursor-pointer`}>
                <Upload className="w-4 h-4" /> 選擇 .json 檔
                <input type="file" accept=".json,.txt,application/json,text/plain" onChange={readFile} className="hidden" />
              </label>
            </div>
            <textarea
              rows={12}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setResult(null);
              }}
              placeholder="貼上 AI 產出的 JSON 陣列…"
              className={`${inputCls} font-mono text-xs`}
            />
            <button onClick={check} disabled={!text.trim()} className={primaryBtn}>
              檢查格式
            </button>
          </div>

          {result && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
              {result.errors.length > 0 ? (
                <>
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-rose-700">
                    <AlertTriangle className="w-4 h-4" /> 有 {result.errors.length} 個問題，請修正後再檢查
                  </p>
                  <ul className="text-sm text-rose-700 space-y-1 list-disc pl-5 max-h-48 overflow-y-auto">
                    {result.errors.map((er, i) => (
                      <li key={i}>{er}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" /> 格式正確，共 {result.questions.length} 題
                  </p>
                  <ul className="space-y-2 max-h-56 overflow-y-auto">
                    {result.questions.slice(0, 5).map((q, i) => (
                      <li key={q.id} className="text-sm flex items-start gap-2">
                        <span className="text-slate-400 w-5">{i + 1}</span>
                        <TypeBadge type={q.type} />
                        <span className="line-clamp-1 text-slate-700">{q.question}</span>
                      </li>
                    ))}
                    {result.questions.length > 5 && <li className="text-xs text-slate-400">…還有 {result.questions.length - 5} 題</li>}
                  </ul>
                  <button onClick={doImport} disabled={!target_ok} className={primaryBtn}>
                    匯入 {result.questions.length} 題
                  </button>
                  {!target_ok && <p className="text-xs text-rose-600">請先填寫新科目名稱</p>}
                </>
              )}
            </div>
          )}
        </div>

        {/* 右：AI prompt */}
        <aside className="bg-slate-900 text-slate-200 rounded-xl p-4 space-y-3 self-start lg:sticky lg:top-8">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-white">AI 轉檔指令</p>
            <button onClick={copyPrompt} className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 text-sm font-medium px-3 py-1.5 rounded-lg">
              <Copy className="w-4 h-4" /> 複製
            </button>
          </div>
          <ol className="text-xs text-slate-400 list-decimal pl-4 space-y-0.5">
            <li>按「複製」，貼到 ChatGPT、Gemini 或 Claude</li>
            <li>把「（請把題目貼在這裡）」換成你的題目（文字或圖片皆可）</li>
            <li>把 AI 回傳的 JSON 貼到左邊，按「檢查格式」</li>
          </ol>
          <textarea readOnly value={AI_PROMPT} rows={16} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs font-mono text-slate-300 focus:outline-none" />
        </aside>
      </div>
    </div>
  );
}
