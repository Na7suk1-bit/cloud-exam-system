export const TYPE_LABEL = { tf: '是非題', mc: '選擇題', essay: '申論/計算題' };

export const uid = (p = 'id') => `${p}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
export const today = () => new Date().toISOString().slice(0, 10);

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------- 作答 session ---------- */
export const makeSession = ({ subjectId, subjectName, mode, questions }) => ({
  subjectId,
  subjectName,
  mode, // 'instant' 練習模式 | 'exam' 模擬測驗
  questions, // 開始時就複製一份，之後 admin 修改題庫不會影響作答中的人
  answers: {},
  essay: {},
  revealed: {},
  index: 0,
  submitted: false,
  startedAt: Date.now(),
});

export const isAnswered = (s, q) =>
  q.type === 'essay' ? !!(s.essay[q.id]?.trim() || s.revealed[q.id]) : s.answers[q.id] !== undefined;

export function grade(session) {
  const scorable = session.questions.filter((q) => q.type !== 'essay');
  const correct = scorable.filter((q) => session.answers[q.id] === q.answer).length;
  const score = scorable.length ? Math.round((correct / scorable.length) * 100) : 100;
  return { score, correct, scorable: scorable.length };
}

/* ---------- 匯入：解析並驗證 AI 產出的 JSON ---------- */
const TF_O = ['o', '○', '〇', 'true', 't', 'yes', '是', '對', '正確'];
const TF_X = ['x', '×', '✕', 'false', 'f', 'no', '否', '錯', '錯誤'];

function normalizeOne(raw, n) {
  const label = `第 ${n} 題`;
  if (!raw || typeof raw !== 'object') return { error: `${label}：不是物件` };

  const type = String(raw.type ?? '').trim().toLowerCase();
  if (!TYPE_LABEL[type]) return { error: `${label}：type 必須是 tf、mc 或 essay（目前是「${raw.type ?? ''}」）` };

  const question = String(raw.question ?? '').trim();
  if (!question) return { error: `${label}：缺少 question（題目文字）` };

  const base = { id: uid('q'), type, question, explanation: String(raw.explanation ?? '').trim() };

  if (type === 'tf') {
    const a = String(raw.answer ?? '').trim().toLowerCase();
    const answer = TF_O.includes(a) ? 'O' : TF_X.includes(a) ? 'X' : null;
    if (!answer) return { error: `${label}：是非題的 answer 必須是 "O" 或 "X"` };
    return { q: { ...base, options: ['O', 'X'], answer } };
  }

  if (type === 'mc') {
    const options = Array.isArray(raw.options) ? raw.options.map((o) => String(o).trim()).filter(Boolean) : [];
    if (options.length < 2) return { error: `${label}：選擇題的 options 至少要 2 個` };
    let answer = String(raw.answer ?? '').trim();
    if (!options.includes(answer)) {
      const idx = /^[A-Za-z]$/.test(answer) ? answer.toUpperCase().charCodeAt(0) - 65 : -1;
      if (idx < 0 || idx >= options.length) return { error: `${label}：answer 必須與其中一個選項文字完全相同` };
      answer = options[idx];
    }
    return { q: { ...base, options, answer } };
  }

  const answer = String(raw.answer ?? '').trim();
  if (!answer) return { error: `${label}：申論/計算題缺少 answer（標準答案）` };
  const keywords = Array.isArray(raw.keywords) ? raw.keywords.map((k) => String(k).trim()).filter(Boolean) : [];
  return { q: { ...base, options: [], answer, keywords } };
}

export function parseQuestionJson(text) {
  const cleaned = String(text ?? '')
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '');
  if (!cleaned) return { questions: [], errors: ['內容是空的，請貼上 JSON 或選擇檔案。'] };

  let data;
  try {
    data = JSON.parse(cleaned);
  } catch (e) {
    return { questions: [], errors: [`JSON 語法錯誤：${e.message}。可以把這段錯誤訊息連同 JSON 貼回 AI，請它修正。`] };
  }
  if (!Array.isArray(data) && Array.isArray(data?.questions)) data = data.questions;
  if (!Array.isArray(data)) return { questions: [], errors: ['最外層必須是陣列，以 [ 開頭、] 結尾。'] };
  if (data.length === 0) return { questions: [], errors: ['陣列是空的，沒有任何題目。'] };

  const questions = [];
  const errors = [];
  data.forEach((raw, i) => {
    const r = normalizeOne(raw, i + 1);
    if (r.error) errors.push(r.error);
    else questions.push(r.q);
  });
  return { questions, errors };
}

/* ---------- 給 AI 的轉檔指令 ---------- */
export const AI_PROMPT = `你是題庫整理助手。請把我「接在最後面」的題目內容，轉換成指定的 JSON 格式。

【輸出規則】
1. 只輸出純 JSON 陣列，不要任何說明文字，也不要加 \`\`\` 程式碼區塊。
2. JSON 內不可有註解，字串內的換行請寫成 \\n。
3. 題目原文請照抄，不要改寫。
4. type 只能是三種：
   - "tf"：是非題。options 固定為 ["O","X"]，answer 只能是 "O" 或 "X"。
   - "mc"：選擇題。options 是選項文字陣列（不要保留 A. B. 前綴），answer 必須和其中一個選項文字「完全相同」。
   - "essay"：申論題或計算題。options 固定為 []，answer 寫完整標準答案，keywords 列出 3～8 個評分用的關鍵字。
5. explanation 寫解析（計算題請寫出計算過程）。原文沒有解析時，請依題意補上簡短解析。
6. 是非題、選擇題不需要 keywords 欄位。

【格式範例】
[
  {
    "type": "tf",
    "question": "CAPM 認為 β 為 1 的證券，其預期報酬率等於市場報酬率。",
    "options": ["O", "X"],
    "answer": "O",
    "explanation": "E(R) = Rf + 1 × (Rm − Rf) = Rm。"
  },
  {
    "type": "mc",
    "question": "二元搜尋樹的最差時間複雜度為何？",
    "options": ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    "answer": "O(n)",
    "explanation": "退化成鏈結串列時需走訪所有節點。"
  },
  {
    "type": "essay",
    "question": "【計算題】Rm=5%、Rf=2%、β=1.5，求預期報酬率。",
    "options": [],
    "answer": "6.5%",
    "explanation": "E(R) = 2% + 1.5 × (5% − 2%) = 6.5%",
    "keywords": ["6.5%", "CAPM", "Rf", "Rm"]
  }
]

【以下是要轉換的題目】
（請把題目貼在這裡）`;

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    document.body.removeChild(ta);
    return ok;
  }
}
