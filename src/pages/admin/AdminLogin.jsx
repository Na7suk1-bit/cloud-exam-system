import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { ADMIN_PASSWORD } from '../../lib/storage.js';
import { inputCls, primaryBtn } from './AdminShared.jsx';

export default function AdminLogin({ onLogin }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) onLogin();
    else setError('密碼不正確，請再試一次。');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <form onSubmit={submit} className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-amber-500" />
          <h1 className="font-bold text-lg text-slate-900">管理員登入</h1>
        </div>
        <p className="text-sm text-slate-500">登入後可以編輯題目、匯入題庫與上傳 PDF 筆記。</p>
        <input
          type="password"
          autoFocus
          value={pw}
          onChange={(e) => {
            setPw(e.target.value);
            setError('');
          }}
          placeholder="密碼"
          className={inputCls}
        />
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <div className="flex items-center justify-between">
          <a href="#/" className="text-sm text-slate-500 hover:text-slate-800">
            回到使用者介面
          </a>
          <button type="submit" className={primaryBtn}>
            登入
          </button>
        </div>
      </form>
    </div>
  );
}
