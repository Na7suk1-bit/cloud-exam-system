import React, { useState, useEffect } from 'react';
import { getQuestions, saveQuizHistory } from '../lib/storage';
import { CheckCircle2, XCircle, ArrowRight, ArrowLeft, Send, Eye } from 'lucide-react';

export default function Quiz({ subjectId, config, onFinish }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showAnswerState, setShowAnswerState] = useState({}); // 記錄是否點擊查看答案
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    let list = getQuestions().filter((q) => q.subjectId === subjectId);

    // 1. 題型篩選
    if (config?.questionTypeFilter === 'choice') {
      list = list.filter((q) => q.type === 'single' || q.type === 'multiple');
    } else if (config?.questionTypeFilter === 'essay') {
      list = list.filter((q) => q.type === 'essay' || q.type === 'calculation');
    }

    // 2. 隨機或順序
    if (config?.orderMode === 'random') {
      list = [...list].sort(() => Math.random() - 0.5);
    }

    setQuestions(list);
  }, [subjectId, config]);

  if (questions.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl p-8">
        <p className="text-gray-500 dark:text-gray-400">該科目目前沒有對應設定的題目。</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const isEssayOrCalc = currentQ.type === 'essay' || currentQ.type === 'calculation';

  const handleSelectOption = (optionKey) => {
    if (isSubmitted) return;
    if (currentQ.type === 'multiple') {
      const prev = userAnswers[currentQ.id] || [];
      const updated = prev.includes(optionKey)
        ? prev.filter((k) => k !== optionKey)
        : [...prev, optionKey];
      setUserAnswers({ ...userAnswers, [currentQ.id]: updated });
    } else {
      setUserAnswers({ ...userAnswers, [currentQ.id]: optionKey });
    }
  };

  const handleTextChange = (text) => {
    setUserAnswers({ ...userAnswers, [currentQ.id]: text });
  };

  const toggleShowAnswer = () => {
    setShowAnswerState({
      ...showAnswerState,
      [currentQ.id]: !showAnswerState[currentQ.id],
    });
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    // 計算成績 (申論與計算題不自動評分對錯)
    let score = 0;
    let choiceCount = 0;

    questions.forEach((q) => {
      if (q.type === 'single') {
        choiceCount++;
        if (userAnswers[q.id] === q.answer) score++;
      } else if (q.type === 'multiple') {
        choiceCount++;
        const uAns = (userAnswers[q.id] || []).sort().join(',');
        const qAns = Array.isArray(q.answer) ? q.answer.sort().join(',') : q.answer;
        if (uAns === qAns) score++;
      }
    });

    const finalScore = choiceCount > 0 ? Math.round((score / choiceCount) * 100) : 100;

    const historyRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      subjectId,
      score: finalScore,
      totalQuestions: questions.length,
      userAnswers,
      questions,
    };

    saveQuizHistory(historyRecord);
    onFinish(historyRecord);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 進度條 */}
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 font-medium">
        <span>題目 {currentIndex + 1} / {questions.length}</span>
        <span>題型：{isEssayOrCalc ? '申論 / 計算題 (參考答案)' : '選擇題'}</span>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-gray-700 space-y-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {currentIndex + 1}. {currentQ.title}
        </h2>

        {/* 答題區域 */}
        {isEssayOrCalc ? (
          <div className="space-y-4">
            <textarea
              rows={5}
              value={userAnswers[currentQ.id] || ''}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="請在此輸入您的計算過程或作答內容..."
              className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ) : (
          <div className="space-y-3">
            {currentQ.options?.map((opt, idx) => {
              const optKey = String.fromCharCode(65 + idx); // A, B, C, D
              const isSelected = currentQ.type === 'multiple'
                ? (userAnswers[currentQ.id] || []).includes(optKey)
                : userAnswers[currentQ.id] === optKey;

              return (
                <button
                  key={optKey}
                  onClick={() => handleSelectOption(optKey)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  <span className="font-bold">{optKey}.</span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* 答案與解析展示 (當下顯示模式 或 點擊查看參考答案) */}
        {(config?.showAnswerMode === 'immediate' || isEssayOrCalc) && (
          <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={toggleShowAnswer}
              className="text-sm font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
            >
              <Eye className="w-4 h-4" />
              {showAnswerState[currentQ.id] ? '隱藏參考答案與解析' : '對照參考答案 / 看解析'}
            </button>

            {showAnswerState[currentQ.id] && (
              <div className="mt-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 text-sm space-y-2">
                <p className="font-bold text-gray-800 dark:text-gray-200">
                  參考答案：{Array.isArray(currentQ.answer) ? currentQ.answer.join(', ') : currentQ.answer}
                </p>
                {currentQ.explanation && (
                  <p className="text-gray-600 dark:text-gray-400">
                    解析：{currentQ.explanation}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* 切換按鈕 */}
        <div className="flex justify-between pt-4">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => i - 1)}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 disabled:opacity-30 flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> 上一題
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex((i) => i + 1)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center gap-1"
            >
              下一題 <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold flex items-center gap-1"
            >
              <Send className="w-4 h-4" /> 交卷結算
            </button>
          )}
        </div>
      </div>
    </div>
  );
}