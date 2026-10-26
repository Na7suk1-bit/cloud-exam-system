// src/lib/storage.js

const KEYS = {
  SUBJECTS: 'cloud_exam_subjects',
  QUESTIONS: 'cloud_exam_questions',
  HISTORY: 'cloud_exam_history',
  NOTES: 'cloud_exam_notes',
  SESSION: 'cloud_exam_session',
  ADMIN: 'cloud_exam_admin_auth',
  USERS: 'cloud_exam_users',
  CURRENT_USER: 'cloud_exam_current_user',
  CHAT_MESSAGES: 'cloud_exam_chat_messages',
};

// 隨機生成 6 碼大寫英數字 User ID (如: user_K8P2X9)
const generateRandomUserId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomStr = '';
  for (let i = 0; i < 6; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `user_${randomStr}`;
};

const defaultSubjectsData = [
  { id: 'sub-1', name: '金融市場與職業道德' },
  { id: 'sub-2', name: '證券商業務員' },
  { id: 'sub-3', name: '期貨商業務員' },
];

const getItem = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`[Storage Protection]:`, e);
  }
};

// --- 1. 使用者帳號與登入 (Auth & Users) ---
export const getCurrentUser = () => {
  let user = getItem(KEYS.CURRENT_USER, null);
  if (!user) {
    const randomId = generateRandomUserId();
    user = {
      id: randomId,
      username: randomId.toLowerCase(),
      nickname: `學霸_${randomId.slice(-4)}`,
      avatarGif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdW1rYmliNmxnNHRtcHVpZnk5OXlyNHRzbmtwdjdrdmppN2J5bXQyZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L1R1tvI9svkIWwpVYr/giphy.gif',
      loginDays: 1,
      lastLoginDate: new Date().toLocaleDateString(),
      createdDate: new Date().toLocaleDateString(),
    };
    saveCurrentUser(user);
  }
  return user;
};

export const saveCurrentUser = (user) => {
  const today = new Date().toLocaleDateString();
  if (user.lastLoginDate !== today) {
    user.loginDays = (user.loginDays || 0) + 1;
    user.lastLoginDate = today;
  }
  setItem(KEYS.CURRENT_USER, user);
  
  // 同步更新至全域 Users 清單
  const users = getItem(KEYS.USERS, []);
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx !== -1) {
    users[idx] = user;
  } else {
    users.push(user);
  }
  setItem(KEYS.USERS, users);
};

export const registerUser = (username, password, nickname, avatarGif) => {
  const users = getItem(KEYS.USERS, []);
  if (users.some((u) => u.username === username)) {
    throw new Error('該帳號名稱已有人使用！');
  }
  const newUserId = generateRandomUserId();
  const newUser = {
    id: newUserId,
    username,
    password,
    nickname: nickname || username,
    avatarGif: avatarGif || 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdW1rYmliNmxnNHRtcHVpZnk5OXlyNHRzbmtwdjdrdmppN2J5bXQyZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L1R1tvI9svkIWwpVYr/giphy.gif',
    loginDays: 1,
    lastLoginDate: new Date().toLocaleDateString(),
    createdDate: new Date().toLocaleDateString(),
  };
  users.push(newUser);
  setItem(KEYS.USERS, users);
  setItem(KEYS.CURRENT_USER, newUser);
  return newUser;
};

export const loginUser = (username, password) => {
  const users = getItem(KEYS.USERS, []);
  const user = users.find((u) => u.username === username && u.password === password);
  if (!user) {
    throw new Error('帳號或密碼錯誤！');
  }
  saveCurrentUser(user);
  return user;
};

// --- 2. 豐富的 8 大成就指標計算 (Achievements) ---
export const getUserAchievements = () => {
  const user = getCurrentUser();
  const history = getQuizHistory();
  const chatMsgs = getChatMessages();
  
  const totalQuizzes = history.length;
  const perfectScores = history.filter((h) => Number(h.score) === 100).length;
  const highScores = history.filter((h) => Number(h.score) >= 90).length;
  const chatCount = chatMsgs.filter((m) => m.userId === user.id).length;

  return [
    { id: 'login_1', title: '初來乍到', desc: '成功登入並啟動刷題系統', unlocked: true, icon: '🌱' },
    { id: 'login_3', title: '持之以恆', desc: '連續登入達 3 天', unlocked: (user.loginDays || 1) >= 3, icon: '🔥' },
    { id: 'login_7', title: '刷題成癖', desc: '連續登入達 7 天', unlocked: (user.loginDays || 1) >= 7, icon: '⚡' },
    { id: 'quiz_1', title: '初試身手', desc: '完成首次測驗', unlocked: totalQuizzes >= 1, icon: '📝' },
    { id: 'quiz_10', title: '題海戰術', desc: '累積完成 10 次測驗', unlocked: totalQuizzes >= 10, icon: '📚' },
    { id: 'score_90', title: '名列前茅', desc: '測驗成績達 90 分以上', unlocked: highScores >= 1, icon: '🎯' },
    { id: 'score_100', title: '滿分霸主', desc: '獲得 100 分完美金牌', unlocked: perfectScores >= 1, icon: '👑' },
    { id: 'chat_sent', title: '熱心學霸', desc: '在線上聊天室發言交流', unlocked: chatCount >= 1, icon: '💬' },
  ];
};

// --- 3. 聊天室與系統導出 ---
export const getChatMessages = () => {
  return getItem(KEYS.CHAT_MESSAGES, [
    { id: 'm1', sender: '系統助手', text: '歡迎來到在線刷題聊天室！大家可以自由交流複習心得。', time: '12:00', avatar: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3ZydWl5cmZwMncyeHZwNDRia3p4c2JidnpteWVvNmVrc3B6eDJ1ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26fb8z8D5v0M9N5zW/giphy.gif' }
  ]);
};

export const sendChatMessage = (text) => {
  const user = getCurrentUser();
  const messages = getChatMessages();
  const newMsg = {
    id: `msg_${Date.now()}`,
    sender: user.nickname || '匿名學霸',
    userId: user.id,
    avatar: user.avatarGif,
    text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
  const updated = [...messages, newMsg];
  setItem(KEYS.CHAT_MESSAGES, updated);
  window.dispatchEvent(new Event('chat_updated'));
  return updated;
};

// 科目與歷史紀錄導出
export const loadSubjects = () => {
  const data = getItem(KEYS.SUBJECTS, null);
  if (!data || data.length === 0) {
    setItem(KEYS.SUBJECTS, defaultSubjectsData);
    return defaultSubjectsData;
  }
  return data;
};
export const saveSubjects = (subs) => setItem(KEYS.SUBJECTS, subs);
export const getSubjects = loadSubjects;
export const getQuestions = () => getItem(KEYS.QUESTIONS, []);
export const saveQuestions = (qs) => setItem(KEYS.QUESTIONS, qs);
export const loadHistory = () => getItem(KEYS.HISTORY, []);
export const saveHistory = (h) => setItem(KEYS.HISTORY, h);
export const getQuizHistory = loadHistory;
export const saveQuizHistory = (record) => {
  const current = loadHistory();
  saveHistory([record, ...current]);
};
export const getNotes = () => getItem(KEYS.NOTES, []);
export const saveNotes = (notes) => setItem(KEYS.NOTES, notes);
export const loadSession = () => getItem(KEYS.SESSION, null);
export const saveSession = (s) => setItem(KEYS.SESSION, s);
export const loadAdmin = () => getItem(KEYS.ADMIN, false);
export const saveAdmin = (a) => setItem(KEYS.ADMIN, a);

export function useAuth() {
  return {
    isAdminLoggedIn: () => getItem(KEYS.ADMIN, false),
    loginAdmin: () => setItem(KEYS.ADMIN, true),
    logoutAdmin: () => setItem(KEYS.ADMIN, false),
  };
}

// IndexedDB PDF 處理
const DB_NAME = 'CloudExamPDFDB';
const STORE_NAME = 'pdf_files';
const openDB = () => {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = (e) => reject(e.target.error);
  });
};

export const saveFile = async (id, base64) => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(base64, id);
    return true;
  } catch (e) { return false; }
};

export const getFile = async (id) => {
  try {
    const db = await openDB();
    const req = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(id);
    return new Promise((res) => req.onsuccess = () => res(req.result || null));
  } catch (e) { return null; }
};

export const deleteFile = async (id) => {
  try {
    const db = await openDB();
    db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).delete(id);
    return true;
  } catch (e) { return false; }
};

export const saveFileToFirebase = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const fileId = Date.now().toString();
      await saveFile(fileId, reader.result);
      resolve({ fileUrl: fileId, storagePath: fileId });
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

export const deleteFileFromFirebase = async (storagePath) => {
  if (storagePath) await deleteFile(storagePath);
};