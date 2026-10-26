import React from 'react';
import { LayoutDashboard, HelpCircle, FileText, FolderTree, FileSpreadsheet, LogOut } from 'lucide-react';

export default function AdminLayout({ children, currentSubTab = 'overview', setCurrentSubTab, onLogout }) {
  const tabs = [
    { id: 'overview', label: '總覽概況', icon: LayoutDashboard },
    { id: 'questions', label: '題目管理', icon: HelpCircle },
    { id: 'notes', label: 'PDF 筆記管理', icon: FileText },
    { id: 'subjects', label: '科目管理', icon: FolderTree },
    { id: 'import', label: '批次匯入', icon: FileSpreadsheet },
  ];

  return (
    <div className="space-y-6">
      {/* 管理者次級導覽列 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4 transition-colors">
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCurrentSubTab && setCurrentSubTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-bold'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="px-4 py-2 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors flex items-center gap-1.5"
        >
          <LogOut className="w-4 h-4" />
          <span>退出管理</span>
        </button>
      </div>

      {/* 管理者主內容 */}
      <div>{children}</div>
    </div>
  );
}