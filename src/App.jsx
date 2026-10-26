import React, { useState, useEffect } from 'react';
import { 
  BookOpen, FileText, CheckCircle2, XCircle, RotateCcw, Shuffle, 
  HelpCircle, Sparkles, FolderPlus, Upload, Lock, Unlock, Settings, 
  Eye, Trophy, ArrowRight, BarChart3, Plus, Trash2, Edit, AlertCircle, 
  Check, FileUp, Copy, ExternalLink, RefreshCw
} from 'lucide-react';

// 預設預載資料 (五專/四技 投資學 + 程式設計與演算法)
const INITIAL_SUBJECTS = [
  {
    id: 'inv101',
    name: '投資學 (五專&四技)',
    icon: '📈',
    description: '包含資本資產定價模型 (CAPM)、證券市場線 (SML)、高登模型 (Gordon)、技術分析與風險指標計算。',
    questions: [
      {
        id: 'q1',
        type: 'tf',
        question: '投資名人 巴菲特(Buffett)的波克夏(BRK-A)，其資產配置的投資組合中 90% 是聚焦投資於股票。',
        options: ['O', 'X'],
        answer: 'X',
        explanation: '波克夏資產配置中股票約佔 25%，而非 90%。'
      },
      {
        id: 'q2',
        type: 'tf',
        question: '資本資產定價模型 (CAPM) 認為貝他 (β) 係數為 1 之證券的預期報酬率應為市場報酬率。',
        options: ['O', 'X'],
        answer: 'O',
        explanation: '當 β = 1 時，E(R) = Rf + 1 * (Rm - Rf) = Rm (市場報酬率)。'
      },
      {
        id: 'q3',
        type: 'essay',
        question: '【計算題】假設市場報酬率為 5%，無風險利率為 2%，依據 CAPM 計算丙公司股票之貝他 (β) 係數為 1.5 時，其預期報酬率是多少？',
        options: [],
        answer: '6.5%',
        explanation: '計算公式：E(R) = Rf + β * (Rm - Rf) = 2% + 1.5 * (5% - 2%) = 2% + 4.5% = 6.5%',
        keywords: ['6.5%', '2%', '5%', '1.5', 'CAPM', 'Rf', 'Rm']
      },
      {
        id: 'q4',
        type: 'essay',
        question: '【申論題】請說明股票的「本益比 (P/E Ratio)」與「股息殖利率」的意義，並分析這兩個指標在投資研判上的應用。',
        options: [],
        answer: '1. 本益比 (P/E) = 股價 / 每股盈餘 (EPS)，用以衡量市場對公司成長性的期待與估值倍數。高本益比代表高成長預期或高估，低本益比代表價值低估或缺乏成長性。\n2. 股息殖利率 = 每股年股息 / 股價，衡量投資的現金流收益率，適合價值型投資人與保本需求者。\n兩者結合有助於判讀股票屬於「成長型」或「價值型」標的。',
        explanation: '應涵蓋兩者的計算公式、適用投資風格（成長型 vs 價值型）以及代表高/低數值的市場意涵。',
        keywords: ['本益比', 'P/E', 'EPS', '股息殖利率', '成長型', '價值型', '每股盈餘', '現金流']
      }
    ],
    notes: [
      {
        id: 'n1',
        title: '投資學期中考重點筆記 (考題解析與公式總整理)',
        description: '包含 CAPM、SML 與 CML 差異、高登估值模型詳細說明。',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        type: 'pdf',
        date: '2026-10-26'
      }
    ]
  },
  {
    id: 'cs101',
    name: '程式設計與演算法',
    icon: '💻',
    description: '包含資料結構、時間複雜度分析、前端框架與演算法邏輯。',
    questions: [
      {
        id: 'cq1',
        type: 'mc',
        question: '在二元搜尋樹 (Binary Search Tree) 中，最差時間複雜度 (Worst-case Time Complexity) 為何？',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        answer: 'O(n)',
        explanation: '當二元搜尋樹退化成單向鏈結串列 (Skewed Tree) 時，尋找目標節點最差需要遍歷所有 n 個節點，時間複雜度為 O(n)。'
      },
      {
        id: 'cq2',
        type: 'essay',
        question: '【申論題】請解釋 React 中的 Virtual DOM 運作機制與優勢。',
        options: [],
        answer: 'Virtual DOM 是真實 DOM 的輕量級 JavaScript 記憶體映射。當狀態變更時，React 會建立新的 Virtual DOM 樹，透過 Diffing 演算法比對前後差異，最後僅將變更部分批量更新 (Batch Update) 到真實 DOM，從而減少昂貴的 DOM 操縱開銷。',
        explanation: '回答中應提及「JavaScript 記憶體結構」、「Diffing 演算法」、「 Reconciliation」與「減少真實 DOM 繪製開銷」。',
        keywords: ['Virtual DOM', 'Diffing', 'DOM', 'JavaScript', 'Reconciliation', '開銷', '效能', '記憶體']
      }
    ],
    notes: [
      {
        id: 'cn1',
        title: '資料 structures & Algorithms 筆記摘要',
        description: '常見 Time/Space Complexity 對照表。',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        type: 'pdf',
        date: '2026-10-20'
      }
    ]
  }
];

export default function App() {
  const [subjects, setSubjects] = useState(INITIAL_SUBJECTS);
  const [currentSubjectId, setCurrentSubjectId] = useState('inv101');
  const [activeTab, setActiveTab] = useState('practice');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  
  // 測驗設定與狀態
  const [mode, setMode] = useState('instant'); // 'instant' (當下告訴答案) | 'exam' (測試後複習)
  const [isRandom, setIsRandom] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [essayInputs, setEssayInputs] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [history, setHistory] = useState([]);
  
  // PDF 彈窗
  const [activePdfUrl, setActivePdfUrl] = useState(null);
  
  // 管理員 Modal 狀態
  const [showImportModal, setShowImportModal] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectIcon, setNewSubjectIcon] = useState('📚');
  const [newSubjectDesc, setNewSubjectDesc] = useState('');
  const [newPdfTitle, setNewPdfTitle] = useState('');
  const [newPdfUrl, setNewPdfUrl] = useState('');

  const currentSubject = subjects.find(s => s.id === currentSubjectId) || subjects[0];
  const questions = currentSubject ? currentSubject.questions : [];

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPasswordInput === 'admin123') {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPasswordInput('');
    } else {
      alert('密碼錯誤！(預設密碼為: admin123)');
    }
  };

  const handleAnswerSelect = (qId, option) => {
    if (isSubmitted && mode === 'exam') return;
    setUserAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleEssayChange = (qId, text) => {
    setEssayInputs(prev => ({ ...prev, [qId]: text }));
  };

  const calculateScore = () => {
    let correct = 0;
    let totalScorable = 0;
    questions.forEach(q => {
      if (q.type !== 'essay') {
        totalScorable++;
        if (userAnswers[q.id] === q.answer) correct++;
      }
    });
    return totalScorable > 0 ? Math.round((correct / totalScorable) * 100) : 100;
  };

  const handleSubmitExam = () => {
    setIsSubmitted(true);
    const score = calculateScore();
    const newRecord = {
      id: Date.now(),
      subjectName: currentSubject.name,
      date: new Date().toLocaleString('zh-TW'),
      score: score,
      totalQuestions: questions.length,
      mode: mode === 'instant' ? '練習模式' : '模擬測驗'
    };
    setHistory([newRecord, ...history]);
  };

  const resetPractice = () => {
    setUserAnswers({});
    setEssayInputs({});
    setIsSubmitted(false);
    setCurrentIndex(0);
  };

  const copyAiPrompt = () => {
    const prompt = `請將以下題目轉為標準 JSON 格式（僅輸出純 JSON 陣列）：
[
  {
    "id": "q1",
    "type": "tf", // 題型: tf(是非題), mc(選擇題), essay(申論/計算題)
    "question": "題目文字",
    "options": ["O", "X"], // 選擇題填選項，申論題留空 []
    "answer": "標準答案",
    "explanation": "詳細解析與計算過程",
    "keywords": ["關鍵字1", "關鍵字2"] // 申論題匹配用
  }
]`;
    navigator.clipboard.writeText(prompt);
    alert('已複製 AI 轉檔指令至剪貼簿！');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* 頂部導覽列 */}
      <header className="bg-indigo-900 text-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-7 h-7 text-amber-400" />
            <div>
              <h1 className="text-xl font-bold tracking-wide">線上雲端測驗與筆記系統</h1>
              <p className="text-xs text-indigo-200">Cloud Exam & Study Note Hub</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-xs bg-indigo-800 text-indigo-200 px-3 py-1 rounded-full border border-indigo-700">
              {isAdmin ? '🔓 管理員模式' : '👁️ 學生瀏覽模式'}
            </span>
            {isAdmin ? (
              <button 
                onClick={() => setIsAdmin(false)}
                className="flex items-center space-x-1 text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>退出管理</span>
              </button>
            ) : (
              <button 
                onClick={() => setShowAdminLogin(true)}
                className="flex items-center space-x-1 text-xs bg-indigo-700 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-lg transition"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>管理員登入</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 主要內容區 */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 左側：科目選單與功能頁籤 */}
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">科目選擇</h2>
            <div className="space-y-2">
              {subjects.map(s => (
                <button
                  key={s.id}
                  onClick={() => { setCurrentSubjectId(s.id); resetPractice(); }}
                  className={`w-full text-left p-3 rounded-lg border flex items-center justify-between transition ${
                    currentSubjectId === s.id 
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-medium' 
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{s.icon}</span>
                    <span className="text-sm">{s.name}</span>
                  </div>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                    {s.questions.length} 題
                  </span>
                </button>
              ))}
            </div>

            {isAdmin && (
              <button
                onClick={() => setShowImportModal(true)}
                className="mt-4 w-full flex items-center justify-center space-x-1 border border-dashed border-indigo-400 text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg text-sm font-medium transition"
              >
                <Plus className="w-4 h-4" />
                <span>新增科目 / 匯入題庫</span>
              </button>
            )}
          </div>

          {/* 頁籤切換 */}
          <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 space-y-1">
            <button
              onClick={() => setActiveTab('practice')}
              className={`w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'practice' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>線上題目練習</span>
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'notes' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>PDF 筆記中心</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'history' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>歷史練習紀錄</span>
            </button>
          </div>
        </div>

        {/* 右側：主要操作介面 */}
        <div className="lg:col-span-3">
          {activeTab === 'practice' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
              {/* 控制列 */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">{currentSubject.name}</h2>
                  <p className="text-xs text-slate-500">{currentSubject.description}</p>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <select
                    value={mode}
                    onChange={(e) => { setMode(e.target.value); resetPractice(); }}
                    className="bg-slate-100 border border-slate-300 text-slate-700 px-3 py-1.5 rounded-lg text-xs"
                  >
                    <option value="instant">⚡ 當下告訴答案 (練習模式)</option>
                    <option value="exam">📝 測試後複習 (模擬測驗)</option>
                  </select>
                  <button
                    onClick={resetPractice}
                    className="flex items-center space-x-1 text-slate-600 hover:text-indigo-600 text-xs px-2 py-1 rounded transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>重來</span>
                  </button>
                </div>
              </div>

              {/* 題目清單 */}
              <div className="space-y-6">
                {questions.map((q, idx) => {
                  const userAnswer = userAnswers[q.id];
                  const essayText = essayInputs[q.id] || '';
                  const showFeedback = mode === 'instant' ? !!userAnswer : isSubmitted;
                  
                  return (
                    <div key={q.id} className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
                      <div className="flex items-start justify-between">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-indigo-100 text-indigo-700">
                          第 {idx + 1} 題 ({q.type === 'tf' ? '是非題' : q.type === 'mc' ? '選擇題' : '申論/計算題'})
                        </span>
                      </div>
                      
                      <p className="text-slate-800 font-medium leading-relaxed">{q.question}</p>

                      {/* 是非題 / 選擇題 選項 */}
                      {q.type !== 'essay' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                          {q.options.map(opt => {
                            let btnStyle = "border-slate-200 bg-white hover:bg-slate-100 text-slate-700";
                            if (userAnswer === opt) {
                              btnStyle = "border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold";
                            }
                            if (showFeedback) {
                              if (opt === q.answer) {
                                btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold";
                              } else if (userAnswer === opt && userAnswer !== q.answer) {
                                btnStyle = "border-rose-500 bg-rose-50 text-rose-900";
                              }
                            }

                            return (
                              <button
                                key={opt}
                                onClick={() => handleAnswerSelect(q.id, opt)}
                                className={`p-3 rounded-lg border text-left text-sm transition ${btnStyle}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* 申論 / 計算題 開放式作答框 */}
                      {q.type === 'essay' && (
                        <div className="space-y-3 pt-2">
                          <textarea
                            rows={3}
                            value={essayText}
                            onChange={(e) => handleEssayChange(q.id, e.target.value)}
                            placeholder="在此輸入你的計算過程或答案觀念..."
                            className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          />
                        </div>
                      )}

                      {/* 解析與對比區 */}
                      {showFeedback && (
                        <div className="mt-4 p-4 rounded-lg bg-white border border-slate-200 text-xs space-y-2">
                          {q.type !== 'essay' ? (
                            <>
                              <div className="flex items-center space-x-2 font-semibold">
                                {userAnswer === q.answer ? (
                                  <span className="text-emerald-600 flex items-center space-x-1"><CheckCircle2 className="w-4 h-4"/> <span>回答正確</span></span>
                                ) : (
                                  <span className="text-rose-600 flex items-center space-x-1"><XCircle className="w-4 h-4"/> <span>回答錯誤 (標準答案: {q.answer})</span></span>
                                )}
                              </div>
                              <p className="text-slate-600 leading-relaxed"><strong className="text-slate-700">解析：</strong>{q.explanation}</p>
                            </>
                          ) : (
                            <div className="space-y-3">
                              <div className="font-semibold text-slate-700 border-b pb-1">💡 標準核心解答與觀念對比</div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="p-2.5 bg-slate-50 rounded border">
                                  <span className="font-semibold text-indigo-700">你的作答：</span>
                                  <p className="mt-1 text-slate-700 whitespace-pre-line">{essayText || '(未作答)'}</p>
                                </div>
                                <div className="p-2.5 bg-emerald-50/60 rounded border border-emerald-200">
                                  <span className="font-semibold text-emerald-800">老師核心答案：</span>
                                  <p className="mt-1 text-emerald-950 whitespace-pre-line">{q.answer}</p>
                                </div>
                              </div>
                              {q.keywords && (
                                <div className="pt-1">
                                  <span className="text-slate-500">核心關鍵字匹配：</span>
                                  <div className="flex flex-wrap gap-1.5 mt-1">
                                    {q.keywords.map(kw => {
                                      const matched = essayText.includes(kw);
                                      return (
                                        <span key={kw} className={`px-2 py-0.5 rounded text-[11px] font-medium ${matched ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-100 text-slate-500'}`}>
                                          {matched ? '✓' : '✗'} {kw}
                                        </span>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                              <p className="text-slate-600 border-t pt-2"><strong className="text-slate-700">完整解析：</strong>{q.explanation}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 結算按鈕 */}
              {mode === 'exam' && !isSubmitted && (
                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleSubmitExam}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2.5 rounded-lg shadow transition"
                  >
                    交卷並檢討答案
                  </button>
                </div>
              )}
            </div>
          )}

          {/* PDF 筆記頁籤 */}
          {activeTab === 'notes' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
              <h2 className="text-lg font-bold text-slate-800 mb-4">{currentSubject.name} - 筆記與講義</h2>
              {currentSubject.notes.map(note => (
                <div key={note.id} className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 transition flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-rose-500" />
                    <div>
                      <h3 className="font-semibold text-slate-800">{note.title}</h3>
                      <p className="text-xs text-slate-500">{note.description} • {note.date}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActivePdfUrl(note.url)}
                    className="flex items-center space-x-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>彈出閱讀 PDF</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 歷史紀錄頁籤 */}
          {activeTab === 'history' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
              <h2 className="text-lg font-bold text-slate-800 mb-4">練習歷史紀錄</h2>
              {history.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">尚無測驗紀錄，點擊左側開始練習！</p>
              ) : (
                <div className="space-y-3">
                  {history.map(rec => (
                    <div key={rec.id} className="p-4 rounded-lg border border-slate-200 flex items-center justify-between text-sm">
                      <div>
                        <div className="font-semibold text-slate-800">{rec.subjectName}</div>
                        <div className="text-xs text-slate-500">{rec.date} • {rec.mode}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-indigo-600">{rec.score} 分</span>
                        <div className="text-xs text-slate-400">總題數 {rec.totalQuestions} 題</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* PDF 彈出閱覽視窗 Modal */}
      {activePdfUrl && (
        <div className="fixed inset-0 bg-slate-900/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 bg-slate-800 text-white flex justify-between items-center">
              <span className="text-sm font-semibold">線上 PDF 講義閱讀器</span>
              <button onClick={() => setActivePdfUrl(null)} className="text-slate-300 hover:text-white text-sm">✕ 關閉</button>
            </div>
            <iframe src={activePdfUrl} className="w-full flex-1 border-none" title="PDF Viewer" />
          </div>
        </div>
      )}

      {/* 管理員登入 Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAdminLogin} className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full space-y-4">
            <h3 className="font-bold text-lg text-slate-800">🔑 管理員身分驗證</h3>
            <p className="text-xs text-slate-500">解鎖後即可新增科目、匯入題庫與上傳 PDF 筆記。</p>
            <input
              type="password"
              placeholder="請輸入密碼 (預設 admin123)"
              value={adminPasswordInput}
              onChange={(e) => setAdminPasswordInput(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setShowAdminLogin(false)} className="px-3 py-1.5 text-xs text-slate-600">取消</button>
              <button type="submit" className="px-4 py-1.5 text-xs bg-indigo-600 text-white rounded-lg">登入</button>
            </div>
          </form>
        </div>
      )}

      {/* 管理員匯入中控台 Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-lg text-slate-800">➕ 中控台 - 新增科目與題庫匯入</h3>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            
            <div className="space-y-3">
              <input
                type="text"
                placeholder="科目名稱 (例如：個體經濟學)"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                className="w-full p-2 border rounded text-sm"
              />
              <textarea
                placeholder="JSON 題庫資料 (點擊下方按鈕可複製 AI 轉換 Prompt)"
                rows={6}
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                className="w-full p-2 border rounded text-xs font-mono"
              />
              <button onClick={copyAiPrompt} className="flex items-center space-x-1 text-xs text-indigo-600 hover:underline">
                <Copy className="w-3.5 h-3.5" />
                <span>複製 ChatGPT/Gemini 轉檔指令 (Prompt)</span>
              </button>
            </div>

            <div className="flex justify-end space-x-2 border-t pt-3">
              <button onClick={() => setShowImportModal(false)} className="px-3 py-1.5 text-xs text-slate-600">取消</button>
              <button 
                onClick={() => {
                  if(!newSubjectName) return alert('請填寫科目名稱');
                  try {
                    const parsedQ = importJsonText ? JSON.parse(importJsonText) : [];
                    const newSub = {
                      id: 'custom_' + Date.now(),
                      name: newSubjectName,
                      icon: '📚',
                      description: '自訂匯入科目',
                      questions: parsedQ,
                      notes: []
                    };
                    setSubjects([...subjects, newSub]);
                    setShowImportModal(false);
                    setNewSubjectName('');
                    setImportJsonText('');
                    alert('成功新增科目！');
                  } catch(e) {
                    alert('JSON 格式不正確，請檢查格式。');
                  }
                }}
                className="px-4 py-1.5 text-xs bg-indigo-600 text-white rounded-lg"
              >
                儲存並建立
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}