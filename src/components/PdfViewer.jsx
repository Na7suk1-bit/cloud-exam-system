import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';

export default function PdfViewer({ fileUrl }) {
  const [blobUrl, setBlobUrl] = useState('');

  useEffect(() => {
    if (!fileUrl) return;

    if (fileUrl.startsWith('data:application/pdf')) {
      try {
        const parts = fileUrl.split(',');
        const mime = parts[0].match(/:(.*?);/)[1];
        const bstr = atob(parts[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);

        return () => URL.revokeObjectURL(url);
      } catch (e) {
        console.error('Blob 轉換失敗:', e);
        setBlobUrl(fileUrl);
      }
    } else {
      setBlobUrl(fileUrl);
    }
  }, [fileUrl]);

  if (!fileUrl) {
    return (
      <div className="p-8 text-center text-gray-500 bg-gray-100 dark:bg-gray-800 rounded-2xl">
        目前無有效的 PDF 檔案連結
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end gap-3">
        {blobUrl && (
          <a
            href={blobUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl text-sm font-medium transition-colors inline-flex items-center gap-1.5"
          >
            <ExternalLink className="w-4 h-4" /> 在新分頁開啟 / 下載 PDF
          </a>
        )}
      </div>

      <div className="w-full h-[75vh] bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-xl">
        <iframe
          src={blobUrl}
          title="PDF 筆記預覽"
          className="w-full h-full border-none"
        />
      </div>
    </div>
  );
}