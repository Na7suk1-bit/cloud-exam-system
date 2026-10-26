import React, { useState, useEffect } from 'react';
import { getSubjects, getQuestions } from '../lib/storage';
import { BookOpen, Play, Settings2, Shuffle, Eye, HelpCircle } from 'lucide-react';

export default function Home({ onStartQuiz }) {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  
  // 測驗設定選項
  const [showAnswerMode, setShowAnswerMode] = useState('immediate'); // 'immediate' (當下) 或 'after' (之後)
  const [orderMode, setOrderMode] = useState('random'); // 'random' (隨機) 或 'sequential' (順序)
  const [questionTypeFilter, setQuestionTypeFilter] = useState('all'); // 'all', 'choice', 'essay'

  useEffect(() => {
    const loadedSubjects = getSubjects();
    setSubjects(loadedSubjects);
    if (loadedSubjects.length > 0) {
      setSelectedSubject(loadedSubjects[0].id);
    }
  }, []);

  const handleStart = () => {
    if (!selectedSubject) return;
    onStartQuiz({
      subjectId: selectedSubject,
      config: {
        showAnswerMode,
        orderMode,
        questionTypeFilter,
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          雲端刷題測驗系統
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          選擇科目並自訂測驗模式，輕鬆進行高效複習
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-gray-700 space-y-6 transition-colors">
        {/* 科目選擇 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            選擇考試科目
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none font-medium"
          >
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        {/* 測驗模式設定 */}
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-blue-500" />
            測驗模式設定
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. 答案展示 */}
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 space-y-2">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 block uppercase">
                1. 答案顯示時機
              </span>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input
                    type="radio"
                    name="showAnswerMode"
                    value="immediate"
                    checked={showAnswerMode === 'immediate'}
                    onChange={(e) => setShowAnswerMode(e.target.value)}
                    className="text-blue-600"
                  />
                  當下顯示解析
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input
                    type="radio"
                    name="showAnswerMode"
                    value="after"
                    checked={showAnswerMode === 'after'}
                    onChange={(e) => setShowAnswerMode(e.target.value)}
                    className="text-blue-600"
                  />
                  交卷後統一顯示
                </label>
              </div>
            </div>

            {/* 2. 出題順序 */}
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 space-y-2">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 block uppercase">
                2. 出題順序
              </span>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input
                    type="radio"
                    name="orderMode"
                    value="random"
                    checked={orderMode === 'random'}
                    onChange={(e) => setOrderMode(e.target.value)}
                    className="text-blue-600"
                  />
                  隨機抽題
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input
                    type="radio"
                    name="orderMode"
                    value="sequential"
                    checked={orderMode === 'sequential'}
                    onChange={(e) => setOrderMode(e.target.value)}
                    className="text-blue-600"
                  />
                  依序出題
                </label>
              </div>
            </div>

            {/* 3. 題型選擇 */}
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 space-y-2">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 block uppercase">
                3. 題型篩選
              </span>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input
                    type="radio"
                    name="questionTypeFilter"
                    value="all"
                    checked={questionTypeFilter === 'all'}
                    onChange={(e) => setQuestionTypeFilter(e.target.value)}
                    className="text-blue-600"
                  />
                  包含全部題型
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input
                    type="radio"
                    name="questionTypeFilter"
                    value="choice"
                    checked={questionTypeFilter === 'choice'}
                    onChange={(e) => setQuestionTypeFilter(e.target.value)}
                    className="text-blue-600"
                  />
                  僅選擇題
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input
                    type="radio"
                    name="questionTypeFilter"
                    value="essay"
                    checked={questionTypeFilter === 'essay'}
                    onChange={(e) => setQuestionTypeFilter(e.target.value)}
                    className="text-blue-600"
                  />
                  僅申論/計算題
                </label>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleStart}
          disabled={!selectedSubject}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-lg shadow-lg shadow-blue-500/20"
        >
          <Play className="w-5 h-5 fill-current" />
          開始測驗
        </button>
      </div>
    </div>
  );
}