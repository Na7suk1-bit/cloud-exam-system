import React, { useState, useEffect } from 'react';
import { getSubjects, getQuestions, saveQuestions } from '../../lib/storage';
import { Plus, Trash2, HelpCircle } from 'lucide-react';

export default function AdminQuestions() {
  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');

  // 新增題目表單欄位
  const [type, setType] = useState('single');
  const [title, setTitle] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [answer, setAnswer] = useState('');
  const [explanation, setExplanation] = useState('');

  useEffect(() => {
    const subs = getSubjects() || [];
    const qList = getQuestions() || [];
    setSubjects(subs);
    setQuestions(qList);
    if (subs.length > 0) setSelectedSubjectId(subs[0].id);
  }, []);

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!title.trim() || !selectedSubjectId) {
      alert('請填寫完整題目資訊！');
      return;
    }

    const options = (type === 'single' || type === 'multiple') 
      ? [optionA, optionB, optionC, optionD].filter(Boolean)
      : [];

    const newQ = {
      id: `q-${Date.now()}`,
      subjectId: selectedSubjectId,
      type,
      title,
      options,
      answer: answer.trim(),
      explanation: explanation.trim(),
    };

    const updated = [newQ, ...questions];
    setQuestions(updated);
    saveQuestions(updated);

    // 重置
    setTitle('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setAnswer('');
    setExplanation('');
    alert('題目新增成功！');
  };

  const handleDeleteQuestion = (id) => {
    if (confirm('確定要刪除這題嗎？')) {
      const updated = questions.filter((q) => q.id !== id);
      setQuestions(updated);
      saveQuestions(updated);
    }
  };

  const filteredQuestions = questions.filter((q) => q.subjectId === selectedSubjectId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">題庫管理中心</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">管理各考科之單選、複選、申論與計算題庫</p>
      </div>

      {/* 科目選擇器 */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center gap-4">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">選擇管理科目：</label>
        <select
          value={selectedSubjectId}
          onChange={(e) => setSelectedSubjectId(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* 新增題目表單 */}
      <form onSubmit={handleAddQuestion} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-md space-y-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <Plus className="w-5 h-5 text-blue-500" /> 手動建立新題目
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">題目類型</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="single">單選題</option>
              <option value="multiple">複選題</option>
              <option value="essay">申論題</option>
              <option value="calculation">計算題</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">答案 / 參考解答</label>
            <input
              type="text"
              required
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={type === 'single' ? '例如: A' : '請輸入正確答案或對照解答'}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">題目敘述</label>
          <textarea
            required
            rows={3}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="請輸入題目內容..."
            className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {(type === 'single' || type === 'multiple') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input type="text" placeholder="選項 A" value={optionA} onChange={(e) => setOptionA(e.target.value)} className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            <input type="text" placeholder="選項 B" value={optionB} onChange={(e) => setOptionB(e.target.value)} className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            <input type="text" placeholder="選項 C" value={optionC} onChange={(e) => setOptionC(e.target.value)} className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            <input type="text" placeholder="選項 D" value={optionD} onChange={(e) => setOptionD(e.target.value)} className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">題目解析</label>
          <input
            type="text"
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="請輸入詳細解題步驟或補充說明 (選填)"
            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-xl transition-colors">
          新增題目
        </button>
      </form>

      {/* 題目列表 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-md p-6 space-y-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">
          目前該科目題目列表 ({filteredQuestions.length})
        </h3>
        {filteredQuestions.length === 0 ? (
          <p className="text-gray-500 text-sm">該科目尚無題目。</p>
        ) : (
          <div className="space-y-3">
            {filteredQuestions.map((q, idx) => (
              <div key={q.id} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 space-y-2">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-gray-900 dark:text-white">{idx + 1}. {q.title}</span>
                  <button onClick={() => handleDeleteQuestion(q.id)} className="text-red-600 hover:bg-red-50 p-1 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">類型：{q.type} | 答案：{q.answer}</p>
                {q.explanation && <p className="text-xs text-gray-500">解析：{q.explanation}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}