import React from 'react';
import { RotateCcw, Info } from 'lucide-react';
import { PageTitle, ghostBtn } from './AdminShared.jsx';
import { SEED_SUBJECTS } from '../../lib/seed.js';
import { deleteFile } from '../../lib/storage.js';

export default function AdminOverview({ subjects, setSubjects, notify }) {
  const totalQ = subjects.reduce((n, s) => n + s.questions.length, 0);
  const totalN = subjects.reduce((n, s) => n + s.notes.length, 0);

  const reset = () => {
    if (!window.confirm('這會刪除目前所有科目、題目與已上傳的 PDF，還原成預設範例資料。確定嗎？')) return;
    subjects.forEach((s) => s.notes.forEach((n) => n.fileId && deleteFile(n.fileId)));
    setSubjects(SEED_SUBJECTS);
    notify('已還原預設資料');
  };

  return (
    <div>
      <PageTitle title="總覽" desc={`${subjects.length} 個科目、${totalQ} 題、${totalN} 份筆記`} />

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th className="px-4 py-2 font-medium">科目</th>
              <th className="px-4 py-2 font-medium">是非</th>
              <th className="px-4 py-2 font-medium">選擇</th>
              <th className="px-4 py-2 font-medium">申論</th>
              <th className="px-4 py-2 font-medium">筆記</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((s) => (
              <tr key={s.id} className="border-t border-slate-100">
                <td className="px-4 py-2.5 font-medium text-slate-800">
                  {s.icon} {s.name}
                </td>
                {['tf', 'mc', 'essay'].map((t) => (
                  <td key={t} className="px-4 py-2.5 text-slate-600">
                    {s.questions.filter((q) => q.type === t).length}
                  </td>
                ))}
                <td className="px-4 py-2.5 text-slate-600">{s.notes.length}</td>
              </tr>
            ))}
            {subjects.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  還沒有科目
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex gap-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 text-sm">
        <Info className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-medium">資料目前存在這台電腦的瀏覽器裡</p>
          <p>
            題庫存於 localStorage、PDF 存於 IndexedDB。你在這裡的修改只有這個瀏覽器看得到，學生從別的裝置開啟不會同步，清除瀏覽器資料也會一併消失。
            要讓所有人看到同一份內容，需要接上 Firebase（專案已安裝）或其他後端。
          </p>
        </div>
      </div>

      <div className="mt-6">
        <button onClick={reset} className={ghostBtn}>
          <RotateCcw className="w-4 h-4" /> 還原預設範例資料
        </button>
      </div>
    </div>
  );
}
