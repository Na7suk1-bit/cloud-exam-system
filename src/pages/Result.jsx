import React, { useState } from 'react';
import { getCurrentUser } from '../lib/storage';
import { Award, RotateCcw, Sparkles, X, CheckCircle2, XCircle } from 'lucide-react';

export default function Result({ result, onRestart }) {
  const [showFlexModal, setShowFlexModal] = useState(false);
  const currentUser = getCurrentUser();

  if (!result) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl p-8">
        <p className="text-gray-500 dark:text-gray-400">尚無測驗結果資料。</p>
        <button
          type="button"
          onClick={onRestart}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold"
        >
          返回首頁
        </button>
      </div>
    );
  }

  const { score = 0, totalQuestions = 0, userAnswers = {}, questions = [] } = result;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 頂部成績簡報卡片 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 text-center space-y-4 transition-colors">
        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/40 rounded-full flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400">
          <Award className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">測驗完成！</h1>
        
        <div className="text-5xl font-extrabold text-blue-600 dark:text-blue-400">
          {score} <span className="text-lg font-normal text-gray-500 dark:text-gray-400">分</span>
        </div>
        
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          共作答 {totalQuestions} 題（選擇題自動計分，申論與計算題提供參考解答）
        </p>

        {/* 按鈕區：保留重新測驗，加入炫耀戰績卡 */}
        <div className="flex justify-center items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setShowFlexModal(true)}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-purple-500/30 hover:scale-105 transition-all"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            炫耀戰績卡
          </button>
          
          <button
            type="button"
            onClick={onRestart}
            className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            重新測驗
          </button>
        </div>
      </div>

      {/* 答題明細與對照清單 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-gray-700 space-y-6 transition-colors">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-4">
          作答明細與詳細解析
        </h2>

        <div className="space-y-6">
          {questions.map((q, idx) => {
            const uAns = userAnswers[q.id];
            const isEssayOrCalc = q.type === 'essay' || q.type === 'calculation';
            
            let isCorrect = false;
            if (q.type === 'single') {
              isCorrect = String(uAns || '').trim().toUpperCase() === String(q.answer || '').trim().toUpperCase();
            } else if (q.type === 'multiple') {
              const uArr = Array.isArray(uAns) ? [...uAns].sort().join(',') : (uAns || '');
              const qArr = Array.isArray(q.answer) ? [...q.answer].sort().join(',') : (q.answer || '');
              isCorrect = uArr === qArr;
            }

            return (
              <div
                key={q.id || idx}
                className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-gray-900 dark:text-white text-base">
                    {idx + 1}. {q.title}
                  </h3>
                  {!isEssayOrCalc && (
                    isCorrect ? (
                      <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-bold shrink-0">
                        <CheckCircle2 className="w-5 h-5" /> 正確
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-500 dark:text-red-400 text-sm font-bold shrink-0">
                        <XCircle className="w-5 h-5" /> 錯誤
                      </span>
                    )
                  )}
                </div>

                {/* 您的作答 */}
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold text-gray-500 dark:text-gray-400">您的作答：</span>
                  {isEssayOrCalc ? (
                    <p className="mt-1 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 whitespace-pre-wrap">
                      {uAns || '(未填寫)'}
                    </p>
                  ) : (
                    <span className="ml-1 font-bold">
                      {Array.isArray(uAns) ? uAns.join(', ') : (uAns || '未作答')}
                    </span>
                  )}
                </div>

                {/* 正確答案 / 參考解答 */}
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold text-gray-500 dark:text-gray-400">
                    {isEssayOrCalc ? '參考解答：' : '正確答案：'}
                  </span>
                  <span className="ml-1 font-bold text-blue-600 dark:text-blue-400">
                    {Array.isArray(q.answer) ? q.answer.join(', ') : (q.answer || '無')}
                  </span>
                </div>

                {/* 詳細解析 */}
                {q.explanation && (
                  <div className="text-xs text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700/60">
                    <span className="font-semibold">解析：</span> {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 炫耀戰績 Modal 視窗 */}
      {showFlexModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-indigo-950 border-2 border-yellow-500/50 text-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative text-center space-y-6 animate-in zoom-in-95">
            <button
              type="button"
              onClick={() => setShowFlexModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-2">
              <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase">CLOUD EXAM CHAMPION</span>
              <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">
                刷題榮譽戰績卡
              </h2>
            </div>

            <div className="relative inline-block">
              <img
                src={currentUser.avatarGif}
                alt="GIF Avatar"
                className="w-24 h-24 rounded-full mx-auto border-4 border-yellow-400 object-cover shadow-xl"
              />
              <span className="absolute -bottom-2 right-0 bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full">
                RANK A+
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold">{currentUser.nickname}</h3>
              <p className="text-xs text-gray-400">ID: {currentUser.id}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-1">
              <span className="text-xs text-gray-300">本場獲得分數</span>
              <div className="text-4xl font-black text-yellow-300">{score} PTS</div>
            </div>

            <p className="text-[11px] text-gray-400">快截圖分享至社群朋友圈炫耀您的高分吧！</p>
          </div>
        </div>
      )}
    </div>
  );
}