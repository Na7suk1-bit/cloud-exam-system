import React from 'react';
import { LayoutDashboard, Library, Pencil, FileUp, FileText, LogOut, ExternalLink } from 'lucide-react';

const NAV = [
  { key: '', label: '總覽', icon: LayoutDashboard },
  { key: 'subjects', label: '科目管理', icon: Library },
  { key: 'questions', label: '編輯題目', icon: Pencil },
  { key: 'import', label: '匯入題庫', icon: FileUp },
  { key: 'notes', label: 'PDF 筆記', icon: FileText },
];

export default function AdminLayout({ current, onLogout, children }) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 md:flex">
      <aside className="md:w-56 md:min-h-screen bg-slate-900 text-slate-200 md:sticky md:top-0 md:h-screen flex md:flex-col">
        <div className="hidden md:block px-5 py-5 border-b border-slate-800">
          <p className="font-bold text-white">管理後台</p>
          <p className="text-xs text-slate-400 mt-0.5">題庫與筆記維護</p>
        </div>
        <nav className="flex md:flex-col gap-1 p-2 md:p-3 overflow-x-auto flex-1">
          {NAV.map(({ key, label, icon: Icon }) => (
            <a
              key={key}
              href={`#/admin${key ? '/' + key : ''}`}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition ${
                current === key ? 'bg-amber-400 text-slate-900 font-semibold' : 'hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </a>
          ))}
        </nav>
        <div className="hidden md:flex flex-col gap-1 p-3 border-t border-slate-800 text-sm">
          <a href="#/" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800">
            <ExternalLink className="w-4 h-4" /> 前往使用者介面
          </a>
          <button onClick={onLogout} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 text-left">
            <LogOut className="w-4 h-4" /> 登出
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="md:hidden flex justify-between items-center px-4 py-2 bg-slate-800 text-xs text-slate-200">
          <a href="#/">前往使用者介面</a>
          <button onClick={onLogout}>登出</button>
        </div>
        <main className="p-4 md:p-8 max-w-5xl">{children}</main>
      </div>
    </div>
  );
}
