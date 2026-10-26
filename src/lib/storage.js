import { SEED_SUBJECTS } from './seed.js';

// ⚠️ 這只是前端層級的「門檻」，密碼會跟著程式碼一起送到瀏覽器。
// 正式上線請改用 Firebase Auth（package.json 已有 firebase）或後端驗證。
export const ADMIN_PASSWORD = 'admin123';

const K_SUBJECTS = 'exam.subjects.v2';
const K_HISTORY = 'exam.history.v1';
const K_SESSION = 'exam.session.v1'; // sessionStorage：重新整理後可繼續作答
const K_ADMIN = 'exam.admin.v1'; // sessionStorage：關掉分頁就登出

const read = (store, key, fallback) => {
  try {
    const raw = store.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const write = (store, key, value) => {
  try {
    store.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

export const loadSubjects = () => read(localStorage, K_SUBJECTS, SEED_SUBJECTS);
export const saveSubjects = (v) => write(localStorage, K_SUBJECTS, v);
export const loadHistory = () => read(localStorage, K_HISTORY, []);
export const saveHistory = (v) => write(localStorage, K_HISTORY, v);
export const loadSession = () => read(sessionStorage, K_SESSION, null);
export const saveSession = (v) => {
  if (v === null) sessionStorage.removeItem(K_SESSION);
  else write(sessionStorage, K_SESSION, v);
};
export const loadAdmin = () => sessionStorage.getItem(K_ADMIN) === '1';
export const saveAdmin = (on) => {
  if (on) sessionStorage.setItem(K_ADMIN, '1');
  else sessionStorage.removeItem(K_ADMIN);
};

/* ---------- PDF 檔案：存在 IndexedDB（容量遠大於 localStorage） ---------- */
const DB = 'exam-files';
const STORE = 'pdfs';

const openDb = () =>
  new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

const run = async (mode, fn) => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const req = fn(tx.objectStore(STORE));
    tx.oncomplete = () => resolve(req.result);
    tx.onerror = () => reject(tx.error);
  });
};

export const putFile = (id, blob) => run('readwrite', (s) => s.put(blob, id));
export const getFile = (id) => run('readonly', (s) => s.get(id));
export const deleteFile = (id) => run('readwrite', (s) => s.delete(id)).catch(() => {});
