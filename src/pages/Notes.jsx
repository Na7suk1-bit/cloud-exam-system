import React, { useState } from 'react';
import { Eye, FileText } from 'lucide-react';
import PdfViewer from '../components/PdfViewer.jsx';

export default function Notes({ subjects }) {
  const [subjectId, setSubjectId] = useState(subjects[0]?.id);
  const [active, setActive] = useState(null);
  const subject = subjects.find((s) => s.id === subjectId) || subjects[0];

  if (!subject) return <p className="text-center text-slate-500 py-20">目前還沒有任何筆記。</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">PDF 筆記</h1>

      <div className="flex flex-wrap gap-2">
        {subjects.map((s) => (
          <button
            key={s.id}
            onClick={() => setSubjectId(s.id)}
            className={`px-3 py-1.5 rounded-lg border text-sm ${
              s.id === subject.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {s.icon} {s.name}
            <span className="ml-1.5 opacity-70">{s.notes.length}</span>
          </button>
        ))}
      </div>

      {subject.notes.length === 0 ? (
        <p className="text-sm text-slate-500 bg-white border border-slate-200 rounded-xl p-8 text-center">這個科目還沒有筆記。</p>
      ) : (
        <div className="space-y-3">
          {subject.notes.map((n) => (
            <div key={n.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="w-8 h-8 text-rose-500 shrink-0" />
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900 truncate">{n.title}</h3>
                  <p className="text-xs text-slate-500 truncate">
                    {n.description ? `${n.description}　` : ''}
                    {n.date}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActive(n)}
                className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-sm font-medium shrink-0"
              >
                <Eye className="w-4 h-4" /> 閱讀
              </button>
            </div>
          ))}
        </div>
      )}

      {active && <PdfViewer note={active} onClose={() => setActive(null)} />}
    </div>
  );
}
