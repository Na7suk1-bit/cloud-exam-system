import React from 'react';

export const SubjectSelect = ({ subjects, value, onChange, className = '' }) => (
  <select
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    className={`border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-amber-400 focus:outline-none ${className}`}
    aria-label="選擇科目"
  >
    {subjects.map((s) => (
      <option key={s.id} value={s.id}>
        {s.icon} {s.name}
      </option>
    ))}
  </select>
);

export const PageTitle = ({ title, desc, children }) => (
  <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
    <div>
      <h1 className="text-xl font-bold text-slate-900">{title}</h1>
      {desc && <p className="text-sm text-slate-500 mt-1">{desc}</p>}
    </div>
    {children}
  </div>
);

export const NoSubject = () => (
  <p className="bg-white border border-slate-200 rounded-xl p-8 text-center text-sm text-slate-500">
    還沒有任何科目。請先到「科目管理」新增一個科目，或在「匯入題庫」直接建立新科目。
  </p>
);

export const inputCls =
  'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none bg-white';
export const primaryBtn =
  'inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-700 disabled:bg-slate-300 text-white text-sm font-medium px-4 py-2 rounded-lg transition';
export const ghostBtn =
  'inline-flex items-center gap-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm px-3 py-2 rounded-lg transition';
