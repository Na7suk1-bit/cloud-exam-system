import React, { useState, useEffect } from 'react';
import { getQuizHistory, getSubjects } from '../lib/storage';
import { History as HistoryIcon, Award, Calendar, Trash2 } from 'lucide-react';

export default function History() {
  const [records, setRecords] = useState([]);
  const [subjectsMap, setSubjectsMap] = useState({});

  useEffect(() => {
    const list = getQuizHistory() || [];
    setRecords(list);

    const subs = getSubjects() || [];
    const map = {};
    subs.forEach((s) => {
      map[s.id] = s.name;
    });
    setSubjectsMap(map);
  }, []);

  const handleClearHistory = () => {
    if (confirm('確定要清空所有歷史測驗紀錄嗎？')) {
      localStorage.removeItem('cloud_exam_history');
      setRecords([]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">測驗歷史紀錄</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">檢視過往刷題成績與作答軌跡</p>
        </div>

        {records.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl border border-red-200 dark:border-red-800 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" /> 清空紀錄
          </button>
        )}
      </div>

      {records.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <HistoryIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">尚無測驗歷史紀錄，快去進行一次測驗吧！</p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((item) => {
            const subjectName = subjectsMap[item.subjectId] || '通用科目';
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-md flex flex-wrap items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 inline-block">
                    {subjectName}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{item.score} 分</span>
                    <p className="text-xs text-gray-400">總題數：{item.totalQuestions} 題</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}