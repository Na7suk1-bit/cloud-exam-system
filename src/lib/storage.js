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

// ==========================================
// 1. 使用者帳號與個人檔案 (User & Profile)
// ==========================================
export const getCurrentUser = () => {
  let user = null;
  try {
    const item = localStorage.getItem(KEYS.CURRENT_USER);
    user = item ? JSON.parse(item) : null;
  } catch (e) {}

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

export const saveCurrentUser = async (user) => {
  try {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
  } catch (e) {}

  try {
    if (supabase) {
      await supabase.from('profiles').upsert({
        id: user.id,
        nickname: user.nickname,
        avatar_url: user.avatarGif,
        login_days: user.loginDays || 1,
      });
    }
  } catch (e) {
    console.warn('Supabase profile 同步提醒:', e);
  }
};

export const registerUser = async (username, password, nickname, avatarGif) => {
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
  await saveCurrentUser(newUser);
  return newUser;
};

export const loginUser = async (username, password) => {
  try {
    if (supabase) {
      const { data } = await supabase.from('profiles').select('*').eq('id', username).single();
      if (data) {
        const user = {
          id: data.id,
          username: data.id,
          nickname: data.nickname,
          avatarGif: data.avatar_url,
          loginDays: data.login_days || 1,
          lastLoginDate: new Date().toLocaleDateString(),
        };
        await saveCurrentUser(user);
        return user;
      }
    }
  } catch (e) {}
  return getCurrentUser();
};

// ==========================================
// 2. 考試科目 (Subjects)
// ==========================================
export const getSubjects = async () => {
  try {
    if (supabase) {
      const { data, error } = await supabase.from('subjects').select('*').order('created_at', { ascending: true });
      if (!error && data && data.length > 0) return data;
    }
  } catch (e) {}
  
  try {
    const item = localStorage.getItem(KEYS.SUBJECTS);
    if (item) return JSON.parse(item);
  } catch (e) {}
  return defaultSubjectsData;
};

export const loadSubjects = getSubjects;

export const saveSubjects = async (subjects) => {
  try {
    localStorage.setItem(KEYS.SUBJECTS, JSON.stringify(subjects));
  } catch (e) {}

  try {
    if (supabase) {
      for (const s of subjects) {
        await supabase.from('subjects').upsert({ id: s.id, name: s.name });
      }
    }
  } catch (e) {}
};

// ==========================================
// 3. 題目與題庫 (Questions)
// ==========================================
export const getQuestions = async () => {
  try {
    if (supabase) {
      const { data, error } = await supabase.from('questions').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map(q => ({
          id: q.id,
          subjectId: q.subject_id,
          type: q.type,
          title: q.title,
          options: q.options || [],
          answer: q.answer,
          explanation: q.explanation,
        }));
      }
    }
  } catch (e) {}

  try {
    const item = localStorage.getItem(KEYS.QUESTIONS);
    return item ? JSON.parse(item) : [];
  } catch (e) {
    return [];
  }
};

export const saveQuestions = async (questions) => {
  try {
    localStorage.setItem(KEYS.QUESTIONS, JSON.stringify(questions));
  } catch (e) {}

  try {
    if (supabase) {
      const formatted = questions.map(q => ({
        id: String(q.id).startsWith('q-') ? undefined : q.id,
        subject_id: q.subjectId,
        type: q.type,
        title: q.title,
        options: q.options || [],
        answer: q.answer,
        explanation: q.explanation,
      }));
      await supabase.from('questions').upsert(formatted);
    }
  } catch (e) {}
};

// ==========================================
// 4. PDF 筆記中繼資料 (Notes)
// ==========================================
export const getNotes = async () => {
  try {
    if (supabase) {
      const { data, error } = await supabase.from('notes').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map(n => ({
          id: n.id,
          title: n.title,
          subject: n.subject,
          fileUrl: n.file_url,
          storagePath: n.storage_path,
          date: new Date(n.created_at).toLocaleDateString(),
        }));
      }
    }
  } catch (e) {}

  try {
    const item = localStorage.getItem(KEYS.NOTES);
    return item ? JSON.parse(item) : [];
  } catch (e) {
    return [];
  }
};

export const saveNotes = async (notes) => {
  try {
    localStorage.setItem(KEYS.NOTES, JSON.stringify(notes));
  } catch (e) {}

  try {
    if (supabase && notes.length > 0) {
      const latest = notes[0];
      await supabase.from('notes').upsert({
        title: latest.title,
        subject: latest.subject,
        file_url: latest.fileUrl,
        storage_path: latest.storagePath,
      });
    }
  } catch (e) {}
};

// ==========================================
// 5. 即時聊天室數據 (Chat Room)
// ==========================================
export const getChatMessages = async () => {
  try {
    if (supabase) {
      const { data, error } = await supabase.from('chat_messages').select('*').order('created_at', { ascending: true }).limit(50);
      if (!error && data && data.length > 0) {
        return data.map(m => ({
          id: m.id,
          sender: m.sender,
          userId: m.user_id,
          avatar: m.avatar,
          text: m.text,
          time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));
      }
    }
  } catch (e) {}

  return [
    { id: 'm1', sender: '系統助手', text: '歡迎來到在線刷題聊天室！大家可以自由交流複習心得。', time: '12:00', avatar: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3ZydWl5cmZwMncyeHZwNDRia3p4c2JidnpteWVvNmVrc3B6eDJ1ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26fb8z8D5v0M9N5zW/giphy.gif' }
  ];
};

export const sendChatMessage = async (text) => {
  const user = getCurrentUser();
  try {
    if (supabase) {
      await supabase.from('chat_messages').insert({
        user_id: user.id,
        sender: user.nickname || '匿名學霸',
        avatar: user.avatarGif,
        text,
      });
      return await getChatMessages();
    }
  } catch (e) {}

  return [
    {
      id: `msg_${Date.now()}`,
      sender: user.nickname || '匿名學霸',
      userId: user.id,
      avatar: user.avatarGif,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ];
};

// ==========================================
// 6. 個人測驗紀錄 (Quiz History)
// ==========================================
export const loadHistory = async () => {
  const user = getCurrentUser();
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('quiz_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map(h => ({
          id: h.id,
          date: new Date(h.created_at).toLocaleString(),
          subjectId: h.subject_id,
          score: h.score,
          totalQuestions: h.total_questions,
          userAnswers: h.user_answers,
        }));
      }
    }
  } catch (e) {}

  try {
    const item = localStorage.getItem(KEYS.HISTORY);
    return item ? JSON.parse(item) : [];
  } catch (e) {
    return [];
  }
};

export const getQuizHistory = loadHistory;

export const saveHistory = async (history) => {
  try {
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
  } catch (e) {}
};

export const saveQuizHistory = async (record) => {
  const user = getCurrentUser();
  try {
    if (supabase) {
      await supabase.from('quiz_history').insert({
        user_id: user.id,
        subject_id: record.subjectId,
        score: record.score,
        total_questions: record.totalQuestions,
        user_answers: record.userAnswers,
      });
    }
  } catch (e) {}

  const current = await loadHistory();
  await saveHistory([record, ...current]);
};

// ==========================================
// 7. 8 大成就勳章牆指標 (Achievements)
// ==========================================
export const getUserAchievements = (historyCount = 0, perfectCount = 0) => {
  const user = getCurrentUser();
  return [
    { id: 'login_1', title: '初來乍到', desc: '成功登入並啟動刷題系統', unlocked: true, icon: '🌱' },
    { id: 'login_3', title: '持之以恆', desc: '連續登入達 3 天', unlocked: (user.loginDays || 1) >= 3, icon: '🔥' },
    { id: 'login_7', title: '刷題成癖', desc: '連續登入達 7 天', unlocked: (user.loginDays || 1) >= 7, icon: '⚡' },
    { id: 'quiz_1', title: '初試身手', desc: '完成首次測驗', unlocked: historyCount >= 1, icon: '📝' },
    { id: 'quiz_10', title: '題海戰術', desc: '累積完成 10 次測驗', unlocked: historyCount >= 10, icon: '📚' },
    { id: 'score_90', title: '名列前茅', desc: '測驗成績達 90 分以上', unlocked: true, icon: '🎯' },
    { id: 'score_100', title: '滿分霸主', desc: '獲得 100 分完美金牌', unlocked: perfectCount >= 1, icon: '👑' },
    { id: 'chat_sent', title: '熱心學霸', desc: '在線上聊天室發言交流', unlocked: true, icon: '💬' },
  ];
};

// ==========================================
// 8. 管理者權限 (Admin Auth & Session)
// ==========================================
export const loadAdmin = () => {
  try { return localStorage.getItem(KEYS.ADMIN) === 'true'; } catch (e) { return false; }
};

export const saveAdmin = (isAdmin) => {
  try { localStorage.setItem(KEYS.ADMIN, String(isAdmin)); } catch (e) {}
};

export const loadSession = () => {
  try {
    const item = localStorage.getItem(KEYS.SESSION);
    return item ? JSON.parse(item) : null;
  } catch (e) { return null; }
};

export const saveSession = (session) => {
  try { localStorage.setItem(KEYS.SESSION, JSON.stringify(session)); } catch (e) {}
};

export function useAuth() {
  return {
    isAdminLoggedIn: () => loadAdmin(),
    loginAdmin: () => saveAdmin(true),
    logoutAdmin: () => saveAdmin(false),
  };
}

// ==========================================
// 9. PDF 檔案上傳與刪除相容導出 (Storage Compat)
// ==========================================
export const saveFile = async (idOrFile, base64Data) => {
  if (idOrFile instanceof File) {
    return await uploadPdfToCloud(idOrFile);
  }
  return { fileUrl: idOrFile, storagePath: idOrFile };
};

export const deleteFile = async (idOrPath) => {
  if (idOrPath) {
    await deletePdfFromCloud(idOrPath);
  }
  return true;
};

export const getFile = async (url) => url;
export const saveFileToFirebase = saveFile;
export const deleteFileFromFirebase = deleteFile;