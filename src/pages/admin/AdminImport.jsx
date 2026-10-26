import React, { useState } from 'react';
import { getQuestions, saveQuestions, getSubjects } from '../../lib/storage';
import { FileCode, Upload, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminImport() {
  const [jsonInput, setJsonInput] = useState('');
  const [status, setStatus] = useState(null);

  const handleImport = async () => {
    setStatus(null);
    if (!jsonInput.trim()) {
      setStatus({ type: 'error', message: '請貼上 JSON 題目文字內容！' });
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput.trim());
      if (!Array.isArray(parsed)) {
        throw new Error('JSON 格式必須為陣列 (Array) [ { ... }, { ... } ]');
      }

      // 取得目前的科目，預設對齊第一個科目（如投資學）
      const currentSubjects = getSubjects();
      const defaultSubId = currentSubjects.length > 0 ? currentSubjects[0].id : 'sub-1';

      const validatedQuestions = parsed.map((q, idx) => {
        if (!q.title || q.answer === undefined) {
          throw new Error(`第 ${idx + 1} 題缺少 title (題目) 或 answer (答案)`);
        }

        return {
          id: q.id || `q_${Date.now()}_${idx}`,
          // 強制將 subjectId 對齊至目前有效的科目 ID
          subjectId: defaultSubId,
          type: q.type || 'single',
          title: String(q.title),
          options: Array.isArray(q.options) ? q.options : [],
          answer: Array.isArray(q.answer) ? q.answer : String(q.answer),
          explanation: q.explanation || '',
        };
      });

      // 清除舊不對齊的題目，將新題庫寫入
      await saveQuestions(validatedQuestions);

      setStatus({
        type: 'success',
        message: `成功匯入 ${validatedQuestions.length} 題考題！已成功對齊並綁定至「${
          currentSubjects[0]?.name || '預設科目'
        }」。`,
      });
      setJsonInput('');
    } catch (err) {
      console.error('匯入失敗:', err);
      setStatus({
        type: 'error',
        message: `匯入失敗：${err.message || 'JSON 語法格式有誤'}`,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">批次匯入題庫</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">將 JSON 格式的題庫一次性匯入系統資料庫</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 space-y-4">
        <label className="block font-bold text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <FileCode className="w-5 h-5 text-blue-600" /> 貼上 JSON 題庫資料
        </label>

        <textarea
          rows={14}
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder="請在此貼上 JSON 陣列格式的題庫..."
          className="w-full p-4 text-xs font-mono rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
        />

        {status && (
          <div
            className={`p-4 rounded-xl flex items-center gap-3 text-sm font-bold ${
              status.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
            }`}
          >
            {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span>{status.message}</span>
          </div>
        )}

        <button
          onClick={handleImport}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-sm flex items-center gap-2 shadow-md shadow-blue-500/20"
        >
          <Upload className="w-4 h-4" /> 確認批次匯入
        </button>
      </div>
    </div>
  );
}