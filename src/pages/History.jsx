import React from 'react';
import { Trash2 } from 'lucide-react';

export default function History({ history, onClear }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">練習紀錄</h1>
        {history.length > 0 && (
          <button
            onClick={() => window.confirm('確定清除所有紀錄嗎？') && onClear()}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-rose-600"
          >
            <Trash2 className="w-4 h-4" /> 清除紀錄
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3">
          <p className="text-sm text-slate-500">還沒有紀錄，完成一次作答後會出現在這裡。</p>
          <a href="#/" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg">
            開始測驗
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((r) => (
            <div key={r.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 truncate">{r.subjectName}</p>
                <p className="text-xs text-slate-500">
                  {r.date}　{r.mode}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xl font-bold text-indigo-600">{r.score} 分</p>
                <p className="text-xs text-slate-400">
                  答對 {r.correct}/{r.scorable}，共 {r.total} 題
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
