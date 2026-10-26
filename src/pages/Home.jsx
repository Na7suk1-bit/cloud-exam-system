import React, { useMemo, useState } from 'react';
import { Zap, ClipboardCheck, Play } from 'lucide-react';
import { shuffle, TYPE_LABEL } from '../lib/questions.js';

const COUNTS = [5, 10, 20, 'all'];

const Card = ({ active, onClick, children, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`text-left rounded-xl border p-4 transition ${
      active ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-slate-200 bg-white hover:border-slate-300'
    } ${className}`}
  >
    {children}
  </button>
);

export default function Home({ subjects, onStart }) {
  const [subjectId, setSubjectId] = useState(subjects[0]?.id);
  const [mode, setMode] = useState('instant');
  const [random, setRandom] = useState(false);
  const [count, setCount] = useState('all');
  const [types, setTypes] = useState({ tf: true, mc: true, essay: true });

  const subject = subjects.find((s) => s.id === subjectId) || subjects[0];
  const pool = useMemo(() => (subject?.questions || []).filter((q) => types[q.type]), [subject, types]);
  const total = count === 'all' ? pool.length : Math.min(count, pool.length);

  if (!subject) {
    return <p className="text-center text-slate-500 py-20">目前還沒有任何科目，請等管理員建立題庫。</p>;
  }

  const typeCount = (t) => subject.questions.filter((q) => q.type === t).length;

  const start = () => {
    const list = (random ? shuffle(pool) : pool).slice(0, total);
    onStart({ subjectId: subject.id, subjectName: subject.name, mode, questions: list });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">選擇題庫與作答方式</h1>
        <p className="text-sm text-slate-500 mt-1">設定完成後按「開始作答」，會直接進入答題畫面。</p>
      </div>

      <section className="space-y-3">
        <h2 className="font-semibold text-slate-700">1. 題庫</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {subjects.map((s) => (
            <Card key={s.id} active={s.id === subject.id} onClick={() => setSubjectId(s.id)}>
              <div className="flex items-start gap-3">
                <span className="text-3xl leading-none">{s.icon}</span>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">{s.name}</p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{s.description}</p>
                  <p className="text-xs text-indigo-700 mt-2">{s.questions.length} 題</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-slate-700">2. 答題方式</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Card active={mode === 'instant'} onClick={() => setMode('instant')}>
            <p className="font-semibold flex items-center gap-2 text-slate-900">
              <Zap className="w-4 h-4 text-amber-500" /> 練習模式
            </p>
            <p className="text-xs text-slate-500 mt-1">每答一題就立刻看到對錯與解析，適合邊做邊學。</p>
          </Card>
          <Card active={mode === 'exam'} onClick={() => setMode('exam')}>
            <p className="font-semibold flex items-center gap-2 text-slate-900">
              <ClipboardCheck className="w-4 h-4 text-indigo-600" /> 模擬測驗
            </p>
            <p className="text-xs text-slate-500 mt-1">全部作答完交卷後才公布成績，並逐題檢討。</p>
          </Card>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 grid gap-5 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2">出題順序</p>
            <div className="flex gap-2">
              {[
                [false, '照順序'],
                [true, '隨機'],
              ].map(([v, label]) => (
                <button
                  key={label}
                  onClick={() => setRandom(v)}
                  className={`px-3 py-1.5 rounded-lg text-sm border ${
                    random === v ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2">題數</p>
            <div className="flex flex-wrap gap-2">
              {COUNTS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCount(c)}
                  className={`px-3 py-1.5 rounded-lg text-sm border ${
                    count === c ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {c === 'all' ? '全部' : c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2">題型</p>
            <div className="space-y-1.5">
              {Object.keys(TYPE_LABEL).map((t) => (
                <label key={t} className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={types[t]}
                    disabled={typeCount(t) === 0}
                    onChange={(e) => setTypes((p) => ({ ...p, [t]: e.target.checked }))}
                    className="rounded border-slate-300"
                  />
                  {TYPE_LABEL[t]}
                  <span className="text-xs text-slate-400">{typeCount(t)}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-4">
        <p className="text-sm text-slate-600">
          {subject.icon} {subject.name}・{mode === 'instant' ? '練習模式' : '模擬測驗'}・
          <span className="font-semibold text-slate-900">{total} 題</span>
        </p>
        <button
          onClick={start}
          disabled={total === 0}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-medium px-6 py-2.5 rounded-lg transition"
        >
          <Play className="w-4 h-4" /> 開始作答
        </button>
      </div>
    </div>
  );
}
