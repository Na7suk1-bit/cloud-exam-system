import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { PageTitle, inputCls, primaryBtn, ghostBtn } from './AdminShared.jsx';
import { uid } from '../../lib/questions.js';
import { deleteFile } from '../../lib/storage.js';

const EMPTY = { name: '', icon: '📚', description: '' };

export default function AdminSubjects({ subjects, setSubjects, updateSubject, setAdminSubjectId, notify }) {
  const [draft, setDraft] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [edit, setEdit] = useState(EMPTY);

  const add = (e) => {
    e.preventDefault();
    if (!draft.name.trim()) return notify('請填寫科目名稱', 'err');
    const s = { id: uid('s'), name: draft.name.trim(), icon: draft.icon.trim() || '📚', description: draft.description.trim(), questions: [], notes: [] };
    setSubjects((list) => [...list, s]);
    setAdminSubjectId(s.id);
    setDraft(EMPTY);
    notify('已新增科目');
  };

  const saveEdit = () => {
    if (!edit.name.trim()) return notify('科目名稱不能是空的', 'err');
    updateSubject(editId, (s) => ({ ...s, name: edit.name.trim(), icon: edit.icon.trim() || '📚', description: edit.description.trim() }));
    setEditId(null);
    notify('已儲存');
  };

  const remove = (s) => {
    if (!window.confirm(`刪除「${s.name}」會一併刪除 ${s.questions.length} 題與 ${s.notes.length} 份筆記，無法復原。確定嗎？`)) return;
    s.notes.forEach((n) => n.fileId && deleteFile(n.fileId));
    setSubjects((list) => list.filter((x) => x.id !== s.id));
    notify('已刪除科目');
  };

  return (
    <div>
      <PageTitle title="科目管理" desc="科目是題庫與筆記的分類，學生會在首頁看到這些科目。" />

      <form onSubmit={add} className="bg-white border border-slate-200 rounded-xl p-4 grid gap-3 sm:grid-cols-[4rem_1fr_2fr_auto] items-end mb-6">
        <label className="text-xs text-slate-500">
          圖示
          <input value={draft.icon} onChange={(e) => setDraft({ ...draft, icon: e.target.value })} className={`${inputCls} mt-1 text-center`} maxLength={4} />
        </label>
        <label className="text-xs text-slate-500">
          科目名稱
          <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="例如：個體經濟學" className={`${inputCls} mt-1`} />
        </label>
        <label className="text-xs text-slate-500">
          簡介（選填）
          <input value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className={`${inputCls} mt-1`} />
        </label>
        <button type="submit" className={primaryBtn}>
          <Plus className="w-4 h-4" /> 新增科目
        </button>
      </form>

      <div className="space-y-3">
        {subjects.map((s) =>
          editId === s.id ? (
            <div key={s.id} className="bg-white border border-amber-300 rounded-xl p-4 grid gap-3 sm:grid-cols-[4rem_1fr_2fr_auto] items-center">
              <input value={edit.icon} onChange={(e) => setEdit({ ...edit, icon: e.target.value })} className={`${inputCls} text-center`} maxLength={4} aria-label="圖示" />
              <input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} className={inputCls} aria-label="科目名稱" />
              <input value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} className={inputCls} aria-label="簡介" />
              <div className="flex gap-2">
                <button onClick={saveEdit} className={primaryBtn} aria-label="儲存">
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={() => setEditId(null)} className={ghostBtn} aria-label="取消">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div key={s.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl">{s.icon}</span>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">{s.name}</p>
                  <p className="text-xs text-slate-500 truncate">
                    {s.questions.length} 題・{s.notes.length} 份筆記{s.description ? `　${s.description}` : ''}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => {
                    setEditId(s.id);
                    setEdit({ name: s.name, icon: s.icon, description: s.description || '' });
                  }}
                  className={ghostBtn}
                  aria-label={`編輯 ${s.name}`}
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => remove(s)} className={`${ghostBtn} hover:text-rose-600`} aria-label={`刪除 ${s.name}`}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
