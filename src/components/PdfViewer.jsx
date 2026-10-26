import React, { useEffect, useState } from 'react';
import { ExternalLink, X } from 'lucide-react';
import { getFile } from '../lib/storage.js';

export default function PdfViewer({ note, onClose }) {
  const [src, setSrc] = useState(note.fileId ? null : note.url);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!note.fileId) return undefined;
    let objectUrl;
    getFile(note.fileId)
      .then((blob) => {
        if (!blob) return setError('找不到這份檔案，可能已被清除瀏覽器資料。請聯絡管理員重新上傳。');
        objectUrl = URL.createObjectURL(blob);
        setSrc(objectUrl);
      })
      .catch(() => setError('讀取檔案失敗，請重新整理後再試。'));
    return () => objectUrl && URL.revokeObjectURL(objectUrl);
  }, [note]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-slate-900/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl h-[88vh] rounded-xl shadow-2xl flex flex-col overflow-hidden">
        <div className="px-4 py-3 bg-slate-800 text-white flex items-center justify-between gap-3">
          <span className="text-sm font-semibold truncate">{note.title}</span>
          <div className="flex items-center gap-3 shrink-0">
            {src && (
              <a href={src} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-slate-300 hover:text-white">
                <ExternalLink className="w-3.5 h-3.5" /> 新分頁開啟
              </a>
            )}
            <button onClick={onClose} aria-label="關閉" className="text-slate-300 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        {error ? (
          <p className="p-8 text-sm text-rose-600">{error}</p>
        ) : src ? (
          <iframe src={src} className="w-full flex-1 border-none" title={note.title} />
        ) : (
          <p className="p-8 text-sm text-slate-500">載入中…</p>
        )}
      </div>
    </div>
  );
}
