import React from 'react';

export default function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div
      role="status"
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-[60] px-4 py-2.5 rounded-lg shadow-lg text-sm text-white ${
        toast.kind === 'err' ? 'bg-rose-600' : 'bg-slate-800'
      }`}
    >
      {toast.msg}
    </div>
  );
}
