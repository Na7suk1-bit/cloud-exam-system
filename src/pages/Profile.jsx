import React, { useState } from 'react';
import { getCurrentUser, saveCurrentUser, getUserAchievements, getQuizHistory, loginUser, registerUser } from '../lib/storage';
import { Trophy, Calendar, CheckCircle, UserPlus, LogIn, Lock, UserCheck, X } from 'lucide-react';

export default function Profile() {
  const [user, setUser] = useState(getCurrentUser());
  const [nickname, setNickname] = useState(user.nickname || '');
  const [avatarGif, setAvatarGif] = useState(user.avatarGif || '');
  const [savedHint, setSavedHint] = useState(false);

  // 帳號登入/註冊 Modal 狀態
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' 或 'register'
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authNickname, setAuthNickname] = useState('');
  const [authError, setAuthError] = useState('');

  const achievements = getUserAchievements();
  const history = getQuizHistory();

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = {
      ...user,
      nickname: nickname.trim(),
      avatarGif: avatarGif.trim(),
    };
    setUser(updated);
    saveCurrentUser(updated);
    setSavedHint(true);
    setTimeout(() => setSavedHint(false), 2000);
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (authMode === 'login') {
        const loggedUser = loginUser(authUsername.trim(), authPassword.trim());
        setUser(loggedUser);
        setNickname(loggedUser.nickname);
        setAvatarGif(loggedUser.avatarGif);
        setShowAuthModal(false);
        alert(`登入成功！歡迎回來，${loggedUser.nickname}`);
      } else {
        const newUser = registerUser(
          authUsername.trim(),
          authPassword.trim(),
          authNickname.trim(),
          avatarGif.trim()
        );
        setUser(newUser);
        setNickname(newUser.nickname);
        setAvatarGif(newUser.avatarGif);
        setShowAuthModal(false);
        alert(`註冊成功！您的 User ID 為: ${newUser.id}`);
      }
      // 重置表單
      setAuthUsername('');
      setAuthPassword('');
      setAuthNickname('');
    } catch (err) {
      setAuthError(err.message || '操作失敗，請重新嘗試');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 個人檔案卡片 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-gray-700 space-y-6 transition-colors">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <img
                src={user.avatarGif}
                alt="GIF Avatar"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-blue-500 shadow-lg"
              />
              <span className="absolute bottom-0 right-0 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white">
                GIF
              </span>
            </div>

            <div className="space-y-1 text-center sm:text-left">
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">{user.nickname}</h1>
              {/* 隨機生成 User ID 展現 */}
              <p className="text-xs text-blue-600 dark:text-blue-400 font-mono font-semibold">
                User ID: <span className="underline">{user.id}</span>
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-2">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> 連續登入: {user.loginDays || 1} 天</span>
                <span className="flex items-center gap-1"><Trophy className="w-3.5 h-3.5" /> 測驗次數: {history.length} 次</span>
              </div>
            </div>
          </div>

          {/* 帳號登入 / 註冊 按鈕 */}
          <button
            type="button"
            onClick={() => {
              setAuthError('');
              setShowAuthModal(true);
            }}
            className="px-4 py-2 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-xl text-sm font-bold transition-all flex items-center gap-2 border border-blue-200 dark:border-blue-700"
          >
            <UserCheck className="w-4 h-4" /> 登入 / 註冊帳號
          </button>
        </div>

        {/* 客製化暱稱與 GIF 頭像 */}
        <form onSubmit={handleSaveProfile} className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">客製個人資料與 GIF 頭像</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">暱稱</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">GIF 頭像網址 (Giphy / 直鏈)</label>
              <input
                type="text"
                value={avatarGif}
                onChange={(e) => setAvatarGif(e.target.value)}
                placeholder="https://media.giphy.com/..."
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-colors">
              保存修改
            </button>
            {savedHint && <span className="text-xs text-green-500 font-bold">✓ 個人檔案修改成功！</span>}
          </div>
        </form>
      </div>

      {/* 豐富的 8 大成就勳章牆 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-gray-700 space-y-4 transition-colors">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" /> 成就勳章牆 ({achievements.filter(a => a.unlocked).length} / {achievements.length})
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col items-center text-center space-y-2 ${
                ach.unlocked
                  ? 'bg-amber-50/60 dark:bg-amber-900/20 border-yellow-300 dark:border-yellow-700 shadow-sm'
                  : 'bg-gray-50 dark:bg-gray-900/40 border-gray-200 dark:border-gray-700 opacity-40 grayscale'
              }`}
            >
              <span className="text-3xl">{ach.icon}</span>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white">{ach.title}</h4>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">{ach.desc}</p>
              {ach.unlocked ? (
                <span className="text-[10px] text-green-600 dark:text-green-400 font-bold flex items-center gap-0.5">
                  <CheckCircle className="w-3 h-3" /> 已解鎖
                </span>
              ) : (
                <span className="text-[10px] text-gray-400">未解鎖</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 學生帳號 登入 / 註冊 Modal 視窗 */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 dark:border-gray-700 relative space-y-6">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* 模式切換 Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setAuthError(''); }}
                className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all flex items-center justify-center gap-2 ${
                  authMode === 'login'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <LogIn className="w-4 h-4" /> 登入已有帳號
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setAuthError(''); }}
                className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all flex items-center justify-center gap-2 ${
                  authMode === 'register'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <UserPlus className="w-4 h-4" /> 註冊新帳號
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">帳號名稱</label>
                <input
                  type="text"
                  required
                  value={authUsername}
                  onChange={(e) => setAuthUsername(e.target.value)}
                  placeholder="請輸入帳號"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">密碼</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="請輸入密碼"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">顯示暱稱</label>
                  <input
                    type="text"
                    value={authNickname}
                    onChange={(e) => setAuthNickname(e.target.value)}
                    placeholder="例如: 考試必勝小華"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {authError && <p className="text-red-500 text-xs">{authError}</p>}

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-sm shadow-md shadow-blue-500/20"
              >
                {authMode === 'login' ? '立即登入' : '完成註冊並登入'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}