// 預設資料：第一次開啟、或 admin 按「還原預設資料」時使用
export const SEED_SUBJECTS = [
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
        explanation: '波克夏資產配置中股票約佔 25%，而非 90%。',
      },
      {
        id: 'q2',
        type: 'tf',
        question: '資本資產定價模型 (CAPM) 認為貝他 (β) 係數為 1 之證券的預期報酬率應為市場報酬率。',
        options: ['O', 'X'],
        answer: 'O',
        explanation: '當 β = 1 時，E(R) = Rf + 1 * (Rm - Rf) = Rm (市場報酬率)。',
      },
      {
        id: 'q3',
        type: 'essay',
        question: '【計算題】假設市場報酬率為 5%，無風險利率為 2%，依據 CAPM 計算丙公司股票之貝他 (β) 係數為 1.5 時，其預期報酬率是多少？',
        options: [],
        answer: '6.5%',
        explanation: '計算公式：E(R) = Rf + β * (Rm - Rf) = 2% + 1.5 * (5% - 2%) = 2% + 4.5% = 6.5%',
        keywords: ['6.5%', '2%', '5%', '1.5', 'CAPM', 'Rf', 'Rm'],
      },
      {
        id: 'q4',
        type: 'essay',
        question: '【申論題】請說明股票的「本益比 (P/E Ratio)」與「股息殖利率」的意義，並分析這兩個指標在投資研判上的應用。',
        options: [],
        answer:
          '1. 本益比 (P/E) = 股價 / 每股盈餘 (EPS)，用以衡量市場對公司成長性的期待與估值倍數。高本益比代表高成長預期或高估，低本益比代表價值低估或缺乏成長性。\n2. 股息殖利率 = 每股年股息 / 股價，衡量投資的現金流收益率，適合價值型投資人與保本需求者。\n兩者結合有助於判讀股票屬於「成長型」或「價值型」標的。',
        explanation: '應涵蓋兩者的計算公式、適用投資風格（成長型 vs 價值型）以及代表高/低數值的市場意涵。',
        keywords: ['本益比', 'P/E', 'EPS', '股息殖利率', '成長型', '價值型', '每股盈餘', '現金流'],
      },
    ],
    notes: [
      {
        id: 'n1',
        title: '投資學期中考重點筆記 (考題解析與公式總整理)',
        description: '包含 CAPM、SML 與 CML 差異、高登估值模型詳細說明。',
        source: 'url',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        date: '2026-10-26',
      },
    ],
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
        explanation: '當二元搜尋樹退化成單向鏈結串列 (Skewed Tree) 時，尋找目標節點最差需要遍歷所有 n 個節點，時間複雜度為 O(n)。',
      },
      {
        id: 'cq2',
        type: 'essay',
        question: '【申論題】請解釋 React 中的 Virtual DOM 運作機制與優勢。',
        options: [],
        answer:
          'Virtual DOM 是真實 DOM 的輕量級 JavaScript 記憶體映射。當狀態變更時，React 會建立新的 Virtual DOM 樹，透過 Diffing 演算法比對前後差異，最後僅將變更部分批量更新 (Batch Update) 到真實 DOM，從而減少昂貴的 DOM 操縱開銷。',
        explanation: '回答中應提及「JavaScript 記憶體結構」、「Diffing 演算法」、「 Reconciliation」與「減少真實 DOM 繪製開銷」。',
        keywords: ['Virtual DOM', 'Diffing', 'DOM', 'JavaScript', 'Reconciliation', '開銷', '效能', '記憶體'],
      },
    ],
    notes: [
      {
        id: 'cn1',
        title: '資料 structures & Algorithms 筆記摘要',
        description: '常見 Time/Space Complexity 對照表。',
        source: 'url',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        date: '2026-10-20',
      },
    ],
  },
];
