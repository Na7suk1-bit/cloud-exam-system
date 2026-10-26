import React from 'react';
import { BookOpen, ClipboardList, FileText, BarChart3 } from 'lucide-react';

const NAV = [
  { key: '', label: '開始測驗', href: '#/', icon: ClipboardList },
  { key: 'notes', label: 'PDF 筆記', href: '#/notes', icon: FileText },
  { key: 'history', label: '練習紀錄', href: '#/history', icon: BarChart3 },
];

export default function UserLayout({ current, children }) {
  const active = current === 'result' ? '' : current;
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <header className="bg-indigo-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <a href="#/" className="flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-amber-400" />
            <span className="font-bold tracking-wide">線上雲端測驗與筆記系統</span>
          </a>
          <nav className="flex items-center gap-1">
            {NAV.map(({ key, label, href, icon: Icon }) => (
              <a
                key={key}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition ${
                  active === key ? 'bg-indigo-700 text-white' : 'text-indigo-200 hover:bg-indigo-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">{children}</main>

      <footer className="py-6 text-center text-xs text-slate-400">
        <a href="#/admin" className="hover:text-slate-600 underline-offset-2 hover:underline">
          管理員入口
        </a>
      </footer>
    </div>
  );
}
