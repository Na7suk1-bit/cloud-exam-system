import React, { useState, useEffect } from 'react';
import { getNotes, saveNotes, saveFile, deleteFile } from '../../lib/storage';
import { Upload, Trash2, FileText, Plus, Loader2 } from 'lucide-react';

export default function AdminNotes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setNotes(getNotes() || []);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('請選擇 PDF 格式的檔案！');
      e.target.value = null;
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!title.trim() || !selectedFile) {
      alert('請填寫標題並選擇 PDF 檔案！');
      return;
    }

    try {
      setIsUploading(true);
      const noteId = Date.now().toString();

      // 將 PDF 轉存至 IndexedDB 大容量資料庫
      const reader = new FileReader();
      reader.onload = async () => {
        await saveFile(noteId, reader.result);

        const newNote = {
          id: noteId,
          title: title.trim(),
          subject: subject.trim() || '通用筆記',
          date: new Date().toLocaleDateString(),
        };

        const updated = [newNote, ...notes];
        setNotes(updated);
        saveNotes(updated);

        setTitle('');
        setSubject('');
        setSelectedFile(null);
        setIsUploading(false);
        alert('PDF 筆記上傳成功！');
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error('上傳失敗:', error);
      alert('上傳失敗，請再試一次');
      setIsUploading(false);
    }
  };

  const handleDelete = async (note) => {
    if (confirm(`確定要刪除「${note.title}」嗎？`)) {
      await deleteFile(note.id);
      const updated = notes.filter((n) => n.id !== note.id);
      setNotes(updated);
      saveNotes(updated);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">PDF 筆記管理中心</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">上傳之 PDF 將儲存於本地大容量 IndexedDB 資料庫</p>
      </div>

      <form onSubmit={handleAddNote} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-md space-y-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <Plus className="w-5 h-5 text-blue-500" /> 上傳新筆記
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">筆記標題</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：金融市場與職業道德 精華筆記"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">相關科目</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="例如：金融市場"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">選擇 PDF 檔案</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-xl transition-colors flex items-center gap-2"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> 上傳中...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" /> 確認上傳
            </>
          )}
        </button>
      </form>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-md p-6">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">PDF 筆記列表 ({notes.length})</h3>
        {notes.length === 0 ? (
          <p className="text-gray-500 text-sm">目前無任何筆記檔案。</p>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-red-500" />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{note.title}</h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      科目：{note.subject} | 日期：{note.date}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(note)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}