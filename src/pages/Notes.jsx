import React, { useState, useEffect } from 'react';
import { getNotes, getFile } from '../lib/storage';
import { FileText, Eye, ArrowLeft } from 'lucide-react';
import PdfViewer from '../components/PdfViewer';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [activePdfUrl, setActivePdfUrl] = useState('');
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    setNotes(getNotes() || []);
  }, []);

  const handleOpenPdf = async (noteId) => {
    try {
      setLoadingId(noteId);
      const pdfData = await getFile(noteId);
      setLoadingId(null);
      if (pdfData) {
        setActivePdfUrl(pdfData);
      } else {
        alert('無法讀取該 PDF 檔案資料，請嘗試重新上傳。');
      }
    } catch (err) {
      setLoadingId(null);
      console.error('開啟 PDF 失敗:', err);
      alert('讀取 PDF 檔案發生錯誤');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">PDF 筆記中心</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">線上閱讀與複習課程重點筆記</p>
      </div>

      {activePdfUrl ? (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setActivePdfUrl('')}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> 返回筆記列表
          </button>
          <PdfViewer fileUrl={activePdfUrl} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">目前尚無上傳的筆記檔案</p>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 inline-block">
                    {note.subject}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{note.title}</h3>
                  <p className="text-xs text-gray-400">發布日期：{note.date}</p>
                </div>

                <button
                  type="button"
                  disabled={loadingId === note.id}
                  onClick={() => handleOpenPdf(note.id)}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-md shadow-blue-500/20"
                >
                  <Eye className="w-4 h-4" /> {loadingId === note.id ? '載入檔案中...' : '線上閱讀筆記'}
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}