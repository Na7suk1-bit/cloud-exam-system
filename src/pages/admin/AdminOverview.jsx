import React, { useState, useEffect } from 'react';
import { getSubjects, getQuestions, getNotes, getQuizHistory } from '../../lib/storage';
import { BookOpen, HelpCircle, FileText, History } from 'lucide-react';

export default function AdminOverview() {
  const [stats, setStats] = useState({
    subjectsCount: 0,
    questionsCount: 0,
    notesCount: 0,
    historyCount: 0,
  });

  useEffect(() => {
    try {
      const subjects = getSubjects() || [];
      const questions = getQuestions() || [];
      const notes = getNotes() || [];
      const history = getQuizHistory() || [];

      setStats({
        subjectsCount: Array.isArray(subjects) ? subjects.length : 0,
        questionsCount: Array.isArray(questions) ? questions.length : 0,
        notesCount: Array.isArray(notes) ? notes.length : 0,
        historyCount: Array.isArray(history) ? history.length : 0,
      });
    } catch (e) {
      console.error('Error loading overview stats:', e);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">系統總覽概況</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">查看目前測驗系統的各項數據統計與營運狀態</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-md flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">總科目數</p>
            <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">{stats.subjectsCount}</h3>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/40 rounded-xl text-blue-600 dark:text-blue-400">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-md flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">總題庫數</p>
            <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">{stats.questionsCount}</h3>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-900/40 rounded-xl text-green-600 dark:text-green-400">
            <HelpCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-md flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">PDF 筆記數量</p>
            <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">{stats.notesCount}</h3>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-900/40 rounded-xl text-purple-600 dark:text-purple-400">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-md flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">累計測驗次數</p>
            <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">{stats.historyCount}</h3>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-900/40 rounded-xl text-amber-600 dark:text-amber-400">
            <History className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}