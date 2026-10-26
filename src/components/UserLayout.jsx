import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, History, Shield, User, Sun, Moon } from 'lucide-react';
import Chatroom from './Chatroom';

export default function UserLayout({ children, currentTab = 'home', setCurrentTab }) {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark' ||
      document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const navItems = [
    { id: 'home', label: '刷題測驗', icon: BookOpen },
    { id: 'notes', label: 'PDF 筆記', icon: FileText },
    { id: 'history', label: '測驗紀錄', icon: History },
    { id: 'profile', label: '個人檔案', icon: User },
    { id: 'admin', label: '管理者', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 relative pb-16">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            onClick={() => setCurrentTab && setCurrentTab('home')}
            className="font-extrabold text-xl text-blue-600 dark:text-blue-400 cursor-pointer flex items-center gap-2"
          >
            <BookOpen className="w-6 h-6" />
            <span>雲端刷題系統</span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCurrentTab && setCurrentTab(item.id)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="h-5 w-[1px] bg-gray-200 dark:bg-gray-700 mx-1 sm:mx-2" />

            <button
              type="button"
              onClick={() => setIsDark((prev) => !prev)}
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <Chatroom />
    </div>
  );
}