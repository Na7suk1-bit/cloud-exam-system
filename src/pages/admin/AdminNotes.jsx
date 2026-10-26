import React, { useState } from 'react';
import { Eye, FileText, Trash2, Upload } from 'lucide-react';
import PdfViewer from '../../components/PdfViewer.jsx';
import { putFile, deleteFile } from '../../lib/storage.js';
import { NoSubject, PageTitle, SubjectSelect, ghostBtn, inputCls, primaryBtn } from './AdminShared.jsx';
import { today, uid } from '../../lib/questions.js';

const fmtSize = (b) => (b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

export default function AdminNotes({ subjects, subjectId, setAdminSubjectId, updateSubject, notify }) {
  const subject = subjects.find((s) => s.id === subjectId);
  const [source, setSource] = useState('file'); // file | url
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [busy, setBusy] = useState(false);
  const [fileKey, setFileKey] = useState(0);
  const [preview, setPreview] = useState(null);

  if (!subject) return <NoSubject />;

  const pick = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!/\.pdf$/i.test(f.name) && f.type !== 'application/pdf') {
      notify('只能上傳 PDF 檔案', 'err');
      setFileKey((k) => k + 1);
      return;
    }
    setFile(f);
    if (!title) setTitle(f.name.replace(/\.pdf$/i, ''));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return notify('請填寫筆記標題', 'err');
    const base = { id: uid('n'), title: title.trim(), description: desc.trim(), date: today() };
    setBusy(true);
    try {
      if (source === 'file') {
        if (!file) return notify('請先選擇 PDF 檔案', 'err');
        const fileId = uid('file');
        await putFile(fileId, file);
        updateSubject(subject.id, (s) => ({ ...s, notes: [...s.notes, { ...base, source: 'file', fileId, fileName: file.name, size: file.size }] }));
      } else {
        if (!/^https?:\/\//i.test(url.trim())) return notify('網址必須以 http:// 或 https:// 開頭', 'err');
        updateSubject(subject.id, (s) => ({ ...s, notes: [...s.notes, { ...base, source: 'url', url: url.trim() }] }));
      }
      notify('筆記已新增');
      setFile(null);
      setUrl('');
      setTitle('');
      setDesc('');
      setFileKey((k) => k + 1);
    } catch {
      notify('儲存檔案失敗，瀏覽器儲存空間可能不足', 'err');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (n) => {
    if (!window.confirm(`確定刪除「${n.title}」嗎？`)) return;
    if (n.fileId) await deleteFile(n.fileId);
    updateSubject(subject.id, (s) => ({ ...s, notes: s.notes.filter((x) => x.id !== n.id) }));
    notify('已刪除筆記');
  };

  return (
    <div>
      <PageTitle title="PDF 筆記" desc="上傳的筆記會出現在使用者介面的「PDF 筆記」頁。">
        <SubjectSelect subjects={subjects} value={subject.id} onChange={setAdminSubjectId} />
      </PageTitle>

      <form onSubmit={submit} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 mb-6">
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-1.5">
            <input type="radio" checked={source === 'file'} onChange={() => setSource('file')} /> 上傳 PDF 檔
          </label>
          <label className="flex items-center gap-1.5">
            <input type="radio" checked={source === 'url'} onChange={() => setSource('url')} /> 使用 PDF 網址
          </label>
        </div>

        {source === 'file' ? (
          <label className="flex items-center gap-3 border border-dashed border-slate-300 rounded-lg p-4 cursor-pointer hover:bg-slate-50 text-sm text-slate-600">
            <Upload className="w-5 h-5 text-slate-400" />
            {file ? (
              <span className="text-slate-900">
                {file.name}　<span className="text-slate-400">{fmtSize(file.size)}</span>
              </span>
            ) : (
              '點擊選擇 PDF 檔案'
            )}
            <input key={fileKey} type="file" accept="application/pdf,.pdf" onChange={pick} className="hidden" />
          </label>
        ) : (
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…/筆記.pdf" className={inputCls} />
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="筆記標題" className={inputCls} />
          <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="簡介（選填）" className={inputCls} />
        </div>
        <button type="submit" disabled={busy} className={primaryBtn}>
          {busy ? '儲存中…' : '新增筆記'}
        </button>
      </form>

      <div className="space-y-2">
        {subject.notes.map((n) => (
          <div key={n.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <FileText className="w-6 h-6 text-rose-500 shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-slate-900 truncate">{n.title}</p>
                <p className="text-xs text-slate-500 truncate">
                  {n.date}・{n.fileId ? `${n.fileName || 'PDF'} ${n.size ? fmtSize(n.size) : ''}` : '外部網址'}
                  {n.description ? `・${n.description}` : ''}
                </p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setPreview(n)} className={ghostBtn} aria-label="預覽">
                <Eye className="w-4 h-4" />
              </button>
              <button onClick={() => remove(n)} className={`${ghostBtn} hover:text-rose-600`} aria-label="刪除">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {subject.notes.length === 0 && <p className="bg-white border border-slate-200 rounded-xl p-8 text-center text-sm text-slate-500">這個科目還沒有筆記，從上方新增第一份。</p>}
      </div>

      {preview && <PdfViewer note={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}
