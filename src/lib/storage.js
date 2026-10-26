import { supabase, uploadPdfToCloud, deletePdfFromCloud } from './supabase';

const KEYS = {
  CURRENT_USER: 'cloud_exam_current_user',
  ADMIN: 'cloud_exam_admin_auth',
};

const generateRandomUserId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomStr = '';
  for (let i = 0; i < 6; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `user_${randomStr}`;
};

// --- 1. 使用者與個人檔案 (Profiles Table) ---
export const getCurrentUser = () => {
  let user = null;
  try {
    const item = localStorage.getItem(KEYS.CURRENT_USER);
    user = item ? JSON.parse(item) : null;
  } catch (e) { }

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
  } catch (e) { }

  // 同步至 Supabase profiles 資料表
  await supabase.from('profiles').upsert({
    id: user.id,
    nickname: user.nickname,
    avatar_url: user.avatarGif,
    login_days: user.loginDays || 1,
  });
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
  return getCurrentUser();
};

// --- 2. 考試科目 (Subjects Table) ---
export const getSubjects = async () => {
  const { data, error } = await supabase.from('subjects').select('*').order('created_at', { ascending: true });
  if (error || !data || data.length === 0) {
    return [
      { id: 'sub-1', name: '金融市場與職業道德' },
      { id: 'sub-2', name: '證券商業務員' },
      { id: 'sub-3', name: '期貨商業務員' },
    ];
  }
  return data;
};
export const loadSubjects = getSubjects;

export const saveSubjects = async (subjects) => {
  for (const s of subjects) {
    await supabase.from('subjects').upsert({ id: s.id, name: s.name });
  }
};

// --- 3. 題庫與問題 (Questions Table) ---
export const getQuestions = async () => {
  const { data, error } = await supabase.from('questions').select('*').order('created_at', { ascending: false });
  if (error || !data) return [];
  return data.map(q => ({
    id: q.id,
    subjectId: q.subject_id,
    type: q.type,
    title: q.title,
    options: q.options || [],
    answer: q.answer,
    explanation: q.explanation,
  }));
};

export const saveQuestions = async (questions) => {
  const formatted = questions.map(q => ({
    id: q.id.startsWith('q-') ? undefined : q.id,
    subject_id: q.subjectId,
    type: q.type,
    title: q.title,
    options: q.options || [],
    answer: q.answer,
    explanation: q.explanation,
  }));
  await supabase.from('questions').upsert(formatted);
};

// --- 4. PDF 筆記 (Notes Table & Supabase Storage) ---
export const getNotes = async () => {
  const { data, error } = await supabase.from('notes').select('*').order('created_at', { ascending: false });
  if (error || !data) return [];
  return data.map(n => ({
    id: n.id,
    title: n.title,
    subject: n.subject,
    fileUrl: n.file_url,
    storagePath: n.storage_path,
    date: new Date(n.created_at).toLocaleDateString(),
  }));
};

export const saveNotes = async (notes) => {
  const latest = notes[0];
  if (latest) {
    await supabase.from('notes').upsert({
      title: latest.title,
      subject: latest.subject,
      file_url: latest.fileUrl,
      storage_path: latest.storagePath,
    });
  }
};

// --- 5. 跨裝置即時聊天室 (Chat Messages Table) ---
export const getChatMessages = async () => {
  const { data, error } = await supabase.from('chat_messages').select('*').order('created_at', { ascending: true }).limit(50);
  if (error || !data) return [];
  return data.map(m => ({
    id: m.id,
    sender: m.sender,
    userId: m.user_id,
    avatar: m.avatar,
    text: m.text,
    time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }));
};

export const sendChatMessage = async (text) => {
  const user = getCurrentUser();
  await supabase.from('chat_messages').insert({
    user_id: user.id,
    sender: user.nickname || '匿名學霸',
    avatar: user.avatarGif,
    text,
  });
  return await getChatMessages();
};

// --- 6. 個人測驗紀錄 (Quiz History Table) ---
export const getQuizHistory = async () => {
  const user = getCurrentUser();
  const { data, error } = await supabase
    .from('quiz_history')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data.map(h => ({
    id: h.id,
    date: new Date(h.created_at).toLocaleString(),
    subjectId: h.subject_id,
    score: h.score,
    totalQuestions: h.total_questions,
    userAnswers: h.user_answers,
  }));
};

export const saveQuizHistory = async (record) => {
  const user = getCurrentUser();
  await supabase.from('quiz_history').insert({
    user_id: user.id,
    subject_id: record.subjectId,
    score: record.score,
    total_questions: record.totalQuestions,
    user_answers: record.userAnswers,
  });
};

// --- 7. 成就計算 ---
export const getUserAchievements = (historyCount = 0, perfectCount = 0) => {
  const user = getCurrentUser();
  return [
    { id: 'login_1', title: '初來乍到', desc: '成功登入並啟動刷題系統', unlocked: true, icon: '🌱' },
    { id: 'login_3', title: '持之以恆', desc: '連續登入達 3 天', unlocked: (user.loginDays || 1) >= 3, icon: '🔥' },
    { id: 'login_7', title: '刷題成癖', desc: '連續登入達 7 天', unlocked: (user.loginDays || 1) >= 7, icon: '⚡' },
    { id: 'quiz_1', title: '初試身手', desc: '完成首次測驗', unlocked: historyCount >= 1, icon: '📝' },
    { id: 'quiz_10', title: '題海戰術', desc: '累積完成 10 次測驗', unlocked: historyCount >= 10, icon: '📚' },
    { id: 'score_100', title: '滿分霸主', desc: '獲得 100 分完美金牌', unlocked: perfectCount >= 1, icon: '👑' },
  ];
};

// Session & Admin 相容匯出
export const loadAdmin = () => {
  try { return localStorage.getItem(KEYS.ADMIN) === 'true'; } catch(e) { return false; }
};
export const saveAdmin = (isAdmin) => {
  try { localStorage.setItem(KEYS.ADMIN, String(isAdmin)); } catch(e) { }
};

export const saveFileToFirebase = uploadPdfToCloud;
export const deleteFileFromFirebase = deletePdfFromCloud;
export const getFile = async (url) => url;
// 管理者驗證相容性介面 (新增這段導出即可修復 AdminLogin.jsx 報錯)
export function useAuth() {
  return {
    isAdminLoggedIn: () => loadAdmin(),
    loginAdmin: () => saveAdmin(true),
    logoutAdmin: () => saveAdmin(false),
  };
}