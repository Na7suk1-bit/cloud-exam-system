import React, { useState, useEffect } from 'react';
import { getSubjects, getQuestions, getNotes } from '../../lib/storage';
import { BookOpen, HelpCircle, FileText, CheckCircle } from 'lucide-react';

export default function AdminOverview() {
  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    setSubjects(getSubjects() || []);
    setQuestions(getQuestions() || []);
    setNotes(getNotes() || []);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">系統總覽概況</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">即時監控題庫數量、科目結構與 PDF 筆記</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/40 rounded-xl text-blue-600 dark:text-blue-400">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs text-gray-400">測驗科目數</p>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">{subjects.length}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg flex items-center gap-4">
          <div className="p-3 bg-green-50 dark:bg-green-900/40 rounded-xl text-green-600 dark:text-green-400">
            <HelpCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs text-gray-400">總題庫題目數</p>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">{questions.length}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg flex items-center gap-4">
          <div className="p-3 bg-purple-50 dark:bg-purple-900/40 rounded-xl text-purple-600 dark:text-purple-400">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs text-gray-400">PDF 筆記數量</p>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">{notes.length}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}