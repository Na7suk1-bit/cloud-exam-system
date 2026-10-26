import React, { useState, useEffect } from 'react';
import { getNotes, saveNotes, getSubjects, saveFile, deleteFile } from '../../lib/storage';
import { Upload, Trash2, FileText, Plus, Loader2 } from 'lucide-react';

export default function AdminNotes() {
  const [notes, setNotes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const list = await getNotes();
    const subs = getSubjects();
    setNotes(list || []);
    setSubjects(subs || []);
    if (subs.length > 0) {
      setSubject(subs[0].name);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title.trim()) {
      alert('請填寫筆記標題並選擇 PDF 檔案！');
      return;
    }

    setIsUploading(true);
    try {
      let fileUrl = '';
      let storagePath = '';

      const uploaded = await saveFile(file);
      if (typeof uploaded === 'object' && uploaded.fileUrl) {
        fileUrl = uploaded.fileUrl;
        storagePath = uploaded.storagePath || '';
      } else {
        fileUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        storagePath = `local_${Date.now()}`;
      }

      const newNote = {
        id: `note_${Date.now()}`,
        title: title.trim(),
        subject: subject || (subjects[0] ? subjects[0].name : '通用科目'),
        fileUrl,
        storagePath,
        date: new Date().toLocaleDateString(),
      };

      const updatedNotes = [newNote, ...notes];
      setNotes(updatedNotes);
      await saveNotes(updatedNotes);

      setTitle('');
      setFile(null);
      alert('PDF 筆記上傳成功！');
    } catch (err) {
      console.error('上傳失敗:', err);
      alert('上傳發生錯誤，請重新嘗試。');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (note) => {
    if (!window.confirm(`確定要刪除「${note.title}」筆記嗎？`)) return;

    try {
      await deleteFile(note.storagePath || note.id);
      const updated = notes.filter((n) => n.id !== note.id);
      setNotes(updated);
      await saveNotes(updated);
    } catch (err) {
      console.error('刪除失敗:', err);
      alert('刪除失敗');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">PDF 筆記管理</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">上傳與管理提供給學生的課程筆記</p>
      </div>

      <form onSubmit={handleUpload} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 space-y-4">
        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Plus className="w-5 h-5 text-blue-600" /> 上傳新 PDF 筆記
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">筆記標題</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="如：投資學期中考重點整理"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">對應科目 (自動讀取目前設定的科目)</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              {subjects.length === 0 ? (
                <option value="投資學">投資學</option>
              ) : (
                subjects.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">選擇 PDF 檔案</label>
          <input
            type="file"
            accept="application/pdf"
            required
            onChange={(e) => setFile(e.target.files[0] || null)}
            className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors text-sm flex items-center gap-2 shadow-md shadow-blue-500/20"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> 上傳處理中...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" /> 開始上傳 PDF
            </>
          )}
        </button>
      </form>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 space-y-4">
        <h3 className="font-bold text-gray-900 dark:text-white">已上傳筆記列表 ({notes.length})</h3>

        {notes.length === 0 ? (
          <p className="text-gray-400 text-sm py-4 text-center">目前尚無筆記檔案</p>
        ) : (
          <div className="space-y-3">
            {notes.map((n) => (
              <div
                key={n.id}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">{n.title}</h4>
                    <span className="text-xs text-gray-400">{n.subject} • {n.date}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(n)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}