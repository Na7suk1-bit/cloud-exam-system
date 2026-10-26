import React, { useEffect } from 'react';
import { ArrowLeft, ArrowRight, Eye, Flag, LogOut } from 'lucide-react';
import { go } from '../lib/router.js';
import { isAnswered } from '../lib/questions.js';
import { AnswerPanel, ChoiceList, TypeBadge } from '../components/QuestionParts.jsx';

export default function Quiz({ session, setSession, onFinish, onExit }) {
  useEffect(() => {
    if (!session) go('/');
    else if (session.submitted) go('/result');
  }, [session]);
  if (!session || session.submitted) return null;

  const { questions, mode, index, answers, essay, revealed } = session;
  const q = questions[index];
  const instant = mode === 'instant';
  const isLast = index === questions.length - 1;
  const patch = (fn) => setSession((s) => ({ ...s, ...fn(s) }));

  const choice = answers[q.id];
  const essayText = essay[q.id] || '';
  const showFeedback = instant && (q.type === 'essay' ? !!revealed[q.id] : choice !== undefined);
  const answeredCount = questions.filter((x) => isAnswered(session, x)).length;

  const select = (opt) => {
    if (instant && choice !== undefined) return; // 練習模式：答了就鎖定
    patch((s) => ({ answers: { ...s.answers, [q.id]: opt } }));
  };
  const jump = (i) => patch(() => ({ index: i }));

  const submit = () => {
    const left = questions.length - answeredCount;
    if (!instant && left > 0 && !window.confirm(`還有 ${left} 題尚未作答，確定要交卷嗎？`)) return;
    onFinish();
  };

  const chipStyle = (x, i) => {
    if (i === index) return 'bg-indigo-600 text-white border-indigo-600';
    if (!isAnswered(session, x)) return 'bg-white text-slate-500 border-slate-300 hover:bg-slate-50';
    if (instant && x.type !== 'essay') {
      return answers[x.id] === x.answer ? 'bg-emerald-100 text-emerald-800 border-emerald-400' : 'bg-rose-100 text-rose-800 border-rose-400';
    }
    return 'bg-indigo-100 text-indigo-800 border-indigo-300';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 truncate">{session.subjectName}</p>
            <p className="text-xs text-slate-500">{instant ? '練習模式' : '模擬測驗'}・已作答 {answeredCount} / {questions.length}</p>
          </div>
          <button
            onClick={() => window.confirm('離開後這次的作答不會被記錄，確定離開嗎？') && onExit()}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600 shrink-0"
          >
            <LogOut className="w-4 h-4" /> 離開
          </button>
        </div>
        <div className="h-1 bg-slate-100">
          <div className="h-1 bg-indigo-600 transition-all" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        <div className="flex flex-wrap gap-1.5" aria-label="題目導覽">
          {questions.map((x, i) => (
            <button
              key={x.id}
              onClick={() => jump(i)}
              aria-label={`第 ${i + 1} 題`}
              aria-current={i === index}
              className={`w-8 h-8 rounded-md border text-xs font-medium transition ${chipStyle(x, i)}`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-500">
              第 {index + 1} / {questions.length} 題
            </span>
            <TypeBadge type={q.type} />
          </div>

          <p className="text-lg leading-relaxed text-slate-900 whitespace-pre-line">{q.question}</p>

          {q.type !== 'essay' ? (
            <ChoiceList q={q} selected={choice} locked={instant && choice !== undefined} showAnswer={showFeedback} onSelect={select} />
          ) : (
            <div className="space-y-3">
              <textarea
                rows={5}
                value={essayText}
                readOnly={showFeedback}
                onChange={(e) => patch((s) => ({ essay: { ...s.essay, [q.id]: e.target.value } }))}
                placeholder="在這裡輸入計算過程或答案觀念…"
                className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none read-only:bg-slate-50"
              />
              {instant && !showFeedback && (
                <button
                  onClick={() => patch((s) => ({ revealed: { ...s.revealed, [q.id]: true } }))}
                  className="flex items-center gap-1.5 text-sm text-indigo-700 hover:text-indigo-900"
                >
                  <Eye className="w-4 h-4" /> 查看標準答案
                </button>
              )}
            </div>
          )}

          {showFeedback && <AnswerPanel q={q} selected={choice} essayText={essayText} />}
        </section>

        <div className="flex items-center justify-between">
          <button
            onClick={() => jump(index - 1)}
            disabled={index === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 hover:bg-white disabled:opacity-40"
          >
            <ArrowLeft className="w-4 h-4" /> 上一題
          </button>
          {isLast ? (
            <button onClick={submit} className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium">
              <Flag className="w-4 h-4" /> {instant ? '完成並看結果' : '交卷'}
            </button>
          ) : (
            <button onClick={() => jump(index + 1)} className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium">
              下一題 <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
        {!isLast && !instant && answeredCount === questions.length && (
          <p className="text-right">
            <button onClick={submit} className="text-sm text-emerald-700 hover:underline">
              全部作答完了，直接交卷
            </button>
          </p>
        )}
      </main>
    </div>
  );
}
