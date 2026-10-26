// src/lib/storage.js
import { supabase, uploadPdfToCloud, deletePdfFromCloud } from './supabase';

const KEYS = {
  CURRENT_USER: 'cloud_exam_current_user',
  ADMIN: 'cloud_exam_admin_auth',
  SESSION: 'cloud_exam_session',
  SUBJECTS: 'cloud_exam_subjects',
  QUESTIONS: 'cloud_exam_questions',
  NOTES: 'cloud_exam_notes',
  HISTORY: 'cloud_exam_history',
};

const defaultSubjectsData = [
  { id: 'sub-1', name: '金融市場與職業道德' },
  { id: 'sub-2', name: '證券商業務員' },
  { id: 'sub-3', name: '期貨商業務員' },
];

const generateRandomUserId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomStr = '';
  for (let i = 0; i < 6; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `user_${randomStr}`;
};

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
  } catch (e) {}
};

// 1. 科目 (Subjects) - 保證同步傳回 Array
export const getSubjects = () => {
  const data = getItem(KEYS.SUBJECTS, null);
  if (!data || !Array.isArray(data) || data.length === 0) {
    setItem(KEYS.SUBJECTS, defaultSubjectsData);
    return defaultSubjectsData;
  }
  return data;
};
export const loadSubjects = getSubjects;
export const saveSubjects = (subs) => {
  setItem(KEYS.SUBJECTS, subs);
  if (supabase) {
    subs.forEach(s => supabase.from('subjects').upsert({ id: s.id, name: s.name }).catch(() => {}));
  }
};

// 2. 題目 (Questions) - 保證同步傳回 Array
export const getQuestions = () => {
  const data = getItem(KEYS.QUESTIONS, []);
  return Array.isArray(data) ? data : [];
};
export const saveQuestions = (qs) => {
  setItem(KEYS.QUESTIONS, qs);
  if (supabase) {
    const formatted = qs.map(q => ({
      id: String(q.id).startsWith('q-') ? undefined : q.id,
      subject_id: q.subjectId,
      type: q.type,
      title: q.title,
      options: q.options || [],
      answer: q.answer,
      explanation: q.explanation,
    }));
    supabase.from('questions').upsert(formatted).catch(() => {});
  }
};

// 3. 筆記 (Notes) - 保證同步傳回 Array
export const getNotes = () => {
  const data = getItem(KEYS.NOTES, []);
  return Array.isArray(data) ? data : [];
};
export const saveNotes = (notes) => {
  setItem(KEYS.NOTES, notes);
  if (supabase && notes.length > 0) {
    const latest = notes[0];
    supabase.from('notes').upsert({
      title: latest.title,
      subject: latest.subject,
      file_url: latest.fileUrl,
      storage_path: latest.storagePath,
    }).catch(() => {});
  }
};

// 4. 歷史紀錄 (Quiz History) - 保證同步傳回 Array
export const loadHistory = () => {
  const data = getItem(KEYS.HISTORY, []);
  return Array.isArray(data) ? data : [];
};
export const getQuizHistory = loadHistory;
export const saveHistory = (h) => setItem(KEYS.HISTORY, h);
export const saveQuizHistory = (record) => {
  const current = loadHistory();
  saveHistory([record, ...current]);
  if (supabase) {
    const user = getCurrentUser();
    supabase.from('quiz_history').insert({
      user_id: user.id,
      subject_id: record.subjectId,
      score: record.score,
      total_questions: record.totalQuestions,
      user_answers: record.userAnswers,
    }).catch(() => {});
  }
};

// 5. 使用者與個人檔案
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
    };
    saveCurrentUser(user);
  }
  return user;
};

export const saveCurrentUser = (user) => {
  setItem(KEYS.CURRENT_USER, user);
  if (supabase) {
    supabase.from('profiles').upsert({
      id: user.id,
      nickname: user.nickname,
      avatar_url: user.avatarGif,
      login_days: user.loginDays || 1,
    }).catch(() => {});
  }
};

export const registerUser = (username, password, nickname, avatarGif) => {
  const newUserId = generateRandomUserId();
  const newUser = {
    id: newUserId,
    username,
    password,
    nickname: nickname || username,
    avatarGif: avatarGif || 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdW1rYmliNmxnNHRtcHVpZnk5OXlyNHRzbmtwdjdrdmppN2J5bXQyZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L1R1tvI9svkIWwpVYr/giphy.gif',
    loginDays: 1,
    lastLoginDate: new Date().toLocaleDateString(),
  };
  saveCurrentUser(newUser);
  return newUser;
};

export const loginUser = (username, password) => {
  return getCurrentUser();
};

// 6. 8 大成就勳章牆
export const getUserAchievements = (historyCount = 0, perfectCount = 0) => {
  const user = getCurrentUser();
  const history = getQuizHistory();
  const hLen = historyCount || history.length;
  const pLen = perfectCount || history.filter(h => Number(h.score) === 100).length;

  return [
    { id: 'login_1', title: '初來乍到', desc: '成功登入並啟動刷題系統', unlocked: true, icon: '🌱' },
    { id: 'login_3', title: '持之以恆', desc: '連續登入達 3 天', unlocked: (user.loginDays || 1) >= 3, icon: '🔥' },
    { id: 'login_7', title: '刷題成癖', desc: '連續登入達 7 天', unlocked: (user.loginDays || 1) >= 7, icon: '⚡' },
    { id: 'quiz_1', title: '初試身手', desc: '完成首次測驗', unlocked: hLen >= 1, icon: '📝' },
    { id: 'quiz_10', title: '題海戰術', desc: '累積完成 10 次測驗', unlocked: hLen >= 10, icon: '📚' },
    { id: 'score_90', title: '名列前茅', desc: '測驗成績達 90 分以上', unlocked: true, icon: '🎯' },
    { id: 'score_100', title: '滿分霸主', desc: '獲得 100 分完美金牌', unlocked: pLen >= 1, icon: '👑' },
    { id: 'chat_sent', title: '熱心學霸', desc: '在線上聊天室發言交流', unlocked: true, icon: '💬' },
  ];
};

// 7. 聊天室數據
export const getChatMessages = () => {
  const data = getItem('cloud_exam_chat_messages', null);
  if (data && Array.isArray(data) && data.length > 0) return data;
  return [
    { id: 'm1', sender: '系統助手', text: '歡迎來到在線刷題聊天室！大家可以自由交流複習心得。', time: '12:00', avatar: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3ZydWl5cmZwMncyeHZwNDRia3p4c2JidnpteWVvNmVrc3B6eDJ1ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26fb8z8D5v0M9N5zW/giphy.gif' }
  ];
};

export const sendChatMessage = (text) => {
  const user = getCurrentUser();
  const msgs = getChatMessages();
  const newMsg = {
    id: `msg_${Date.now()}`,
    sender: user.nickname || '匿名學霸',
    userId: user.id,
    avatar: user.avatarGif,
    text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
  const updated = [...msgs, newMsg];
  setItem('cloud_exam_chat_messages', updated);
  if (supabase) {
    supabase.from('chat_messages').insert({
      user_id: user.id,
      sender: user.nickname || '匿名學霸',
      avatar: user.avatarGif,
      text,
    }).catch(() => {});
  }
  return updated;
};

// 8. 管理者權限
export const loadAdmin = () => getItem(KEYS.ADMIN, false);
export const saveAdmin = (isAdmin) => setItem(KEYS.ADMIN, isAdmin);
export const loadSession = () => getItem(KEYS.SESSION, null);
export const saveSession = (s) => setItem(KEYS.SESSION, s);

export function useAuth() {
  return {
    isAdminLoggedIn: () => loadAdmin(),
    loginAdmin: () => saveAdmin(true),
    logoutAdmin: () => saveAdmin(false),
  };
}

// 9. 檔案處理相容介面
export const saveFile = async (idOrFile, base64Data) => {
  if (idOrFile instanceof File) {
    return await uploadPdfToCloud(idOrFile);
  }
  return { fileUrl: idOrFile, storagePath: idOrFile };
};

export const deleteFile = async (idOrPath) => {
  if (idOrPath) await deletePdfFromCloud(idOrPath);
  return true;
};

export const getFile = async (url) => url;
export const saveFileToFirebase = saveFile;
export const deleteFileFromFirebase = deleteFile;