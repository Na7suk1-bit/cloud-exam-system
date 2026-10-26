import React, { useState, useEffect } from 'react';
import { getSubjects, saveSubjects } from '../../lib/storage';
import { Plus, Trash2, FolderTree, BookOpen } from 'lucide-react';

export default function AdminSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    setSubjects(getSubjects() || []);
  }, []);

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newSubject = {
      id: `sub-${Date.now()}`,
      name: name.trim(),
    };

    const updated = [...subjects, newSubject];
    setSubjects(updated);
    saveSubjects(updated);
    setName('');
  };

  const handleDeleteSubject = (id) => {
    if (confirm('確定要刪除此科目嗎？（相關題目將可能無法對應）')) {
      const updated = subjects.filter((s) => s.id !== id);
      setSubjects(updated);
      saveSubjects(updated);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">考試科目管理</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">新增或刪除測驗系統中的考試科目類別</p>
      </div>

      {/* 新增科目 */}
      <form onSubmit={handleAddSubject} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-md flex gap-4">
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="請輸入新科目名稱 (例如：證券商高級業務員)"
          className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> 新增科目
        </button>
      </form>

      {/* 科目列表 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-md p-6">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <FolderTree className="w-5 h-5 text-blue-500" /> 現有科目列表 ({subjects.length})
        </h3>

        {subjects.length === 0 ? (
          <p className="text-gray-500 text-sm">目前尚無任何科目。</p>
        ) : (
          <div className="space-y-3">
            {subjects.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  <span className="font-bold text-gray-900 dark:text-white">{sub.name}</span>
                  <span className="text-xs text-gray-400">ID: {sub.id}</span>
                </div>
                <button
                  onClick={() => handleDeleteSubject(sub.id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}