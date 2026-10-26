import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { TYPE_LABEL } from '../lib/questions.js';

const TYPE_STYLE = {
  tf: 'bg-sky-100 text-sky-800',
  mc: 'bg-indigo-100 text-indigo-800',
  essay: 'bg-amber-100 text-amber-800',
};

export const TypeBadge = ({ type }) => (
  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${TYPE_STYLE[type]}`}>{TYPE_LABEL[type]}</span>
);

/** 是非題 / 選擇題的選項。showAnswer=true 時標出正解與錯選。 */
export function ChoiceList({ q, selected, locked, showAnswer, onSelect }) {
  return (
    <div className={`grid gap-3 ${q.type === 'tf' ? 'grid-cols-2' : 'grid-cols-1'}`}>
      {q.options.map((opt, i) => {
        let style = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700';
        if (selected === opt) style = 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold';
        if (showAnswer) {
          if (opt === q.answer) style = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
          else if (selected === opt) style = 'border-rose-500 bg-rose-50 text-rose-900';
        }
        return (
          <button
            key={opt + i}
            type="button"
            disabled={locked}
            onClick={() => onSelect(opt)}
            className={`p-3.5 rounded-lg border text-left text-sm transition flex items-start gap-3 disabled:cursor-default ${style} ${
              q.type === 'tf' ? 'justify-center text-base' : ''
            }`}
          >
            {q.type === 'mc' && <span className="font-semibold text-slate-400 w-5 shrink-0">{String.fromCharCode(65 + i)}</span>}
            <span>{opt}</span>
          </button>
        );
      })}
    </div>
  );
}

/** 作答後的解析區塊（練習模式即時顯示、結果頁逐題檢討共用） */
export function AnswerPanel({ q, selected, essayText = '' }) {
  if (q.type !== 'essay') {
    const ok = selected === q.answer;
    return (
      <div className="p-4 rounded-lg bg-white border border-slate-200 text-sm space-y-2">
        {ok ? (
          <p className="text-emerald-700 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> 回答正確
          </p>
        ) : (
          <p className="text-rose-700 font-semibold flex items-center gap-1.5">
            <XCircle className="w-4 h-4" /> {selected === undefined ? '未作答' : '回答錯誤'}，標準答案：{q.answer}
          </p>
        )}
        {q.explanation && (
          <p className="text-slate-600 leading-relaxed">
            <strong className="text-slate-700">解析：</strong>
            {q.explanation}
          </p>
        )}
      </div>
    );
  }

  const text = essayText.toLowerCase();
  return (
    <div className="p-4 rounded-lg bg-white border border-slate-200 text-sm space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-3 bg-slate-50 rounded border border-slate-200">
          <span className="font-semibold text-indigo-700">你的作答</span>
          <p className="mt-1 text-slate-700 whitespace-pre-line">{essayText || '（未作答）'}</p>
        </div>
        <div className="p-3 bg-emerald-50 rounded border border-emerald-200">
          <span className="font-semibold text-emerald-800">標準答案</span>
          <p className="mt-1 text-emerald-950 whitespace-pre-line">{q.answer}</p>
        </div>
      </div>
      {q.keywords?.length > 0 && (
        <div>
          <span className="text-slate-500 text-xs">你的作答命中的關鍵字</span>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {q.keywords.map((kw) => {
              const hit = text.includes(kw.toLowerCase());
              return (
                <span
                  key={kw}
                  className={`px-2 py-0.5 rounded text-xs font-medium border ${
                    hit ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  {hit ? '✓' : '✗'} {kw}
                </span>
              );
            })}
          </div>
        </div>
      )}
      {q.explanation && (
        <p className="text-slate-600 border-t border-slate-200 pt-2 leading-relaxed">
          <strong className="text-slate-700">解析：</strong>
          {q.explanation}
        </p>
      )}
    </div>
  );
}
