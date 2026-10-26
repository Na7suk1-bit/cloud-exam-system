import React, { useEffect, useState } from 'react';
import { RotateCcw, XCircle, Home as HomeIcon } from 'lucide-react';
import { go } from '../lib/router.js';
import { grade } from '../lib/questions.js';
import { AnswerPanel, TypeBadge } from '../components/QuestionParts.jsx';

export default function Result({ session, onRetry }) {
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!session?.submitted) go('/');
  }, [session]);
  if (!session?.submitted) return null;

  const { score, correct, scorable } = grade(session);
  const essayCount = session.questions.length - scorable;
  const wrong = session.questions.filter((q) => q.type !== 'essay' && session.answers[q.id] !== q.answer);
  const shown = filter === 'wrong' ? wrong : session.questions;
  const tone = score >= 80 ? 'text-emerald-600' : score >= 60 ? 'text-amber-600' : 'text-rose-600';

  return (
    <div className="space-y-8">
      <section className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-2">
        <p className="text-sm text-slate-500">
          {session.subjectName}・{session.mode === 'instant' ? '練習模式' : '模擬測驗'}
        </p>
        <p className={`text-6xl font-bold ${tone}`}>
          {score}
          <span className="text-2xl ml-1">分</span>
        </p>
        <p className="text-sm text-slate-600">
          是非題與選擇題答對 {correct} / {scorable} 題
          {essayCount > 0 && `，另有 ${essayCount} 題申論/計算題不計分，請對照標準答案自行檢討`}
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-4">
          <button onClick={() => onRetry(session.questions)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium">
            <RotateCcw className="w-4 h-4" /> 再做一次
          </button>
          {wrong.length > 0 && (
            <button onClick={() => onRetry(wrong)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium">
              <XCircle className="w-4 h-4" /> 只重做答錯的 {wrong.length} 題
            </button>
          )}
          <a href="#/" className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 hover:bg-slate-50">
            <HomeIcon className="w-4 h-4" /> 回到選題
          </a>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-900">逐題檢討</h2>
          <div className="flex gap-2 text-sm">
            {[
              ['all', `全部 ${session.questions.length}`],
              ['wrong', `答錯 ${wrong.length}`],
            ].map(([k, label]) => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className={`px-3 py-1 rounded-lg border ${filter === k ? 'bg-slate-800 text-white border-slate-800' : 'border-slate-300 text-slate-600'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {shown.length === 0 && <p className="text-sm text-slate-500 text-center py-8">沒有答錯的題目，全部答對！</p>}

        {shown.map((q) => {
          const n = session.questions.indexOf(q) + 1;
          return (
            <article key={q.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-500">第 {n} 題</span>
                <TypeBadge type={q.type} />
              </div>
              <p className="text-slate-900 leading-relaxed whitespace-pre-line">{q.question}</p>
              {q.type === 'mc' && (
                <ol className="text-sm text-slate-600 space-y-0.5">
                  {q.options.map((o, i) => (
                    <li key={o + i}>
                      {String.fromCharCode(65 + i)}. {o}
                    </li>
                  ))}
                </ol>
              )}
              {q.type !== 'essay' && session.answers[q.id] !== undefined && (
                <p className="text-sm text-slate-500">你的答案：{session.answers[q.id]}</p>
              )}
              <AnswerPanel q={q} selected={session.answers[q.id]} essayText={session.essay[q.id] || ''} />
            </article>
          );
        })}
      </section>
    </div>
  );
}
