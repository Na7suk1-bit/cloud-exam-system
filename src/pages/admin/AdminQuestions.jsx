import React, { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Search, X as XIcon } from 'lucide-react';
import Modal from '../../components/Modal.jsx';
import { TypeBadge } from '../../components/QuestionParts.jsx';
import { TYPE_LABEL, uid } from '../../lib/questions.js';
import { NoSubject, PageTitle, SubjectSelect, ghostBtn, inputCls, primaryBtn } from './AdminShared.jsx';

function QuestionForm({ initial, onSave, onCancel }) {
  const [type, setType] = useState(initial?.type || 'mc');
  const [question, setQuestion] = useState(initial?.question || '');
  const [options, setOptions] = useState(initial?.type === 'mc' ? initial.options : ['', '', '', '']);
  const [correct, setCorrect] = useState(initial?.type === 'mc' ? Math.max(0, initial.options.indexOf(initial.answer)) : 0);
  const [tfAnswer, setTfAnswer] = useState(initial?.type === 'tf' ? initial.answer : 'O');
  const [essayAnswer, setEssayAnswer] = useState(initial?.type === 'essay' ? initial.answer : '');
  const [keywords, setKeywords] = useState((initial?.keywords || []).join('、'));
  const [explanation, setExplanation] = useState(initial?.explanation || '');
  const [error, setError] = useState('');

  const removeOption = (i) => {
    setOptions((o) => o.filter((_, j) => j !== i));
    setCorrect((c) => (i === c ? 0 : i < c ? c - 1 : c));
  };

  const save = () => {
    if (!question.trim()) return setError('請填寫題目文字');
    const base = { id: initial?.id || uid('q'), type, question: question.trim(), explanation: explanation.trim() };

    if (type === 'tf') return onSave({ ...base, options: ['O', 'X'], answer: tfAnswer });

    if (type === 'mc') {
      const cleaned = options.map((o) => o.trim());
      if (cleaned.filter(Boolean).length < 2) return setError('選擇題至少要有 2 個選項');
      if (!cleaned[correct]) return setError('標示為正解的選項不能是空白');
      const kept = cleaned.filter(Boolean);
      return onSave({ ...base, options: kept, answer: cleaned[correct] });
    }

    if (!essayAnswer.trim()) return setError('請填寫標準答案');
    const kw = keywords.split(/[,，、\n]/).map((k) => k.trim()).filter(Boolean);
    return onSave({ ...base, options: [], answer: essayAnswer.trim(), keywords: kw });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {Object.entries(TYPE_LABEL).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setType(k)}
            className={`px-3 py-1.5 rounded-lg border text-sm ${type === k ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <label className="block text-sm text-slate-600">
        題目
        <textarea rows={3} value={question} onChange={(e) => setQuestion(e.target.value)} className={`${inputCls} mt-1`} />
      </label>

      {type === 'tf' && (
        <fieldset className="text-sm text-slate-600">
          <legend className="mb-1">正確答案</legend>
          <div className="flex gap-4">
            {['O', 'X'].map((v) => (
              <label key={v} className="flex items-center gap-1.5">
                <input type="radio" name="tf" checked={tfAnswer === v} onChange={() => setTfAnswer(v)} /> {v}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {type === 'mc' && (
        <fieldset className="text-sm text-slate-600 space-y-2">
          <legend className="mb-1">選項（選取圓點表示正解）</legend>
          {options.map((o, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="radio" name="correct" checked={correct === i} onChange={() => setCorrect(i)} aria-label={`選項 ${i + 1} 為正解`} />
              <span className="w-5 text-slate-400">{String.fromCharCode(65 + i)}</span>
              <input value={o} onChange={(e) => setOptions((arr) => arr.map((x, j) => (j === i ? e.target.value : x)))} className={inputCls} />
              {options.length > 2 && (
                <button type="button" onClick={() => removeOption(i)} className="text-slate-400 hover:text-rose-600" aria-label="移除選項">
                  <XIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          {options.length < 8 && (
            <button type="button" onClick={() => setOptions((o) => [...o, ''])} className="text-indigo-700 hover:underline">
              ＋ 新增選項
            </button>
          )}
        </fieldset>
      )}

      {type === 'essay' && (
        <>
          <label className="block text-sm text-slate-600">
            標準答案
            <textarea rows={4} value={essayAnswer} onChange={(e) => setEssayAnswer(e.target.value)} className={`${inputCls} mt-1`} />
          </label>
          <label className="block text-sm text-slate-600">
            評分關鍵字（用頓號或逗號分隔）
            <input value={keywords} onChange={(e) => setKeywords(e.target.value)} className={`${inputCls} mt-1`} />
          </label>
        </>
      )}

      <label className="block text-sm text-slate-600">
        解析
        <textarea rows={3} value={explanation} onChange={(e) => setExplanation(e.target.value)} className={`${inputCls} mt-1`} />
      </label>

      {error && <p className="text-sm text-rose-600">{error}</p>}
      <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
        <button onClick={onCancel} className={ghostBtn}>
          取消
        </button>
        <button onClick={save} className={primaryBtn}>
          儲存題目
        </button>
      </div>
    </div>
  );
}

export default function AdminQuestions({ subjects, subjectId, setAdminSubjectId, updateSubject, notify }) {
  const subject = subjects.find((s) => s.id === subjectId);
  const [editing, setEditing] = useState(null); // null | 'new' | question
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const rows = useMemo(() => {
    if (!subject) return [];
    const kw = search.trim().toLowerCase();
    return subject.questions
      .map((q, i) => ({ q, n: i + 1 }))
      .filter(({ q }) => (typeFilter === 'all' || q.type === typeFilter) && (!kw || q.question.toLowerCase().includes(kw)));
  }, [subject, search, typeFilter]);

  if (!subject) return <NoSubject />;

  const save = (q) => {
    updateSubject(subject.id, (s) => {
      const exists = s.questions.some((x) => x.id === q.id);
      return { ...s, questions: exists ? s.questions.map((x) => (x.id === q.id ? q : x)) : [...s.questions, q] };
    });
    setEditing(null);
    notify('題目已儲存');
  };

  const remove = (q) => {
    if (!window.confirm('確定刪除這一題嗎？')) return;
    updateSubject(subject.id, (s) => ({ ...s, questions: s.questions.filter((x) => x.id !== q.id) }));
    notify('已刪除題目');
  };

  return (
    <div>
      <PageTitle title="編輯題目" desc={`${subject.name} 共 ${subject.questions.length} 題`}>
        <div className="flex gap-2">
          <SubjectSelect subjects={subjects} value={subject.id} onChange={setAdminSubjectId} />
          <button onClick={() => setEditing('new')} className={primaryBtn}>
            <Plus className="w-4 h-4" /> 新增題目
          </button>
        </div>
      </PageTitle>

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1 min-w-[12rem]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜尋題目文字" className={`${inputCls} pl-9`} />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={`${inputCls} w-auto`} aria-label="題型篩選">
          <option value="all">全部題型</option>
          {Object.entries(TYPE_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        {rows.map(({ q, n }) => (
          <div key={q.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3">
            <span className="text-sm text-slate-400 w-7 shrink-0 pt-0.5">{n}</span>
            <div className="min-w-0 flex-1 space-y-1">
              <TypeBadge type={q.type} />
              <p className="text-sm text-slate-900 line-clamp-2 whitespace-pre-line">{q.question}</p>
              <p className="text-xs text-slate-500 truncate">答案：{q.answer}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setEditing(q)} className={ghostBtn} aria-label="編輯題目">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => remove(q)} className={`${ghostBtn} hover:text-rose-600`} aria-label="刪除題目">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {rows.length === 0 && (
          <p className="bg-white border border-slate-200 rounded-xl p-8 text-center text-sm text-slate-500">
            {subject.questions.length === 0 ? '這個科目還沒有題目。可以按「新增題目」，或到「匯入題庫」一次匯入。' : '沒有符合條件的題目。'}
          </p>
        )}
      </div>

      {editing && (
        <Modal title={editing === 'new' ? '新增題目' : '編輯題目'} onClose={() => setEditing(null)} size="max-w-2xl">
          <QuestionForm initial={editing === 'new' ? null : editing} onSave={save} onCancel={() => setEditing(null)} />
        </Modal>
      )}
    </div>
  );
}
