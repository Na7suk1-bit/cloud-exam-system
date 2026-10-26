import React, { useState, useEffect } from 'react';
import { getSubjects, getQuestions, saveQuestions } from '../../lib/storage';
import { FileSpreadsheet, Download, Upload } from 'lucide-react';

export default function AdminImport() {
  const [subjects, setSubjects] = useState([]);
  const [jsonInput, setJsonInput] = useState('');
  const [targetSubjectId, setTargetSubjectId] = useState('');

  useEffect(() => {
    const subs = getSubjects() || [];
    setSubjects(subs);
    if (subs.length > 0) setTargetSubjectId(subs[0].id);
  }, []);

  const handleImport = () => {
    if (!jsonInput.trim() || !targetSubjectId) {
      alert('請選擇匯入科目並輸入 JSON 格式內容！');
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) {
        alert('匯入格式必須為陣列 Array ( [ { ... } ] )');
        return;
      }

      const formattedNewQuestions = parsed.map((item, idx) => ({
        id: `q-imp-${Date.now()}-${idx}`,
        subjectId: targetSubjectId,
        type: item.type || 'single',
        title: item.title || '無標題題目',
        options: item.options || [],
        answer: item.answer || '',
        explanation: item.explanation || '',
      }));

      const existing = getQuestions() || [];
      const updated = [...formattedNewQuestions, ...existing];
      saveQuestions(updated);

      setJsonInput('');
      alert(`成功批次匯入 ${formattedNewQuestions.length} 題題目！`);
    } catch (err) {
      alert('JSON 格式解析錯誤，請確認輸入內容是否符合 JSON 規範。');
    }
  };

  const sampleTemplate = JSON.stringify(
    [
      {
        type: 'single',
        title: '範例題目：下列何者非屬金融市場之主要功能？',
        options: ['資金融通', '價格發掘', '提供流動性', '保證投資獲利'],
        answer: 'D',
        explanation: '金融市場無法保證絕對獲利。'
      }
    ],
    null,
    2
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">題目批次匯入</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">貼入 JSON 格式題目資料，即可一次匯入巨量題庫</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">選擇匯入目標科目</label>
          <select
            value={targetSubjectId}
            onChange={(e) => setTargetSubjectId(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">貼入 JSON 題庫資料</label>
          <textarea
            rows={10}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder={`請貼入 JSON 陣列，例如：\n${sampleTemplate}`}
            className="w-full p-4 font-mono text-sm rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleImport}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
        >
          <Upload className="w-5 h-5" /> 開始批次匯入
        </button>
      </div>
    </div>
  );
}