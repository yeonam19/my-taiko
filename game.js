// ═══════════════════════════════════════════════════
// 태고의 달인 - Web Taiko
// ═══════════════════════════════════════════════════

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ─── Config ──────────────────────────────────────
const CONFIG = {
  WIDTH: 960,
  HEIGHT: 580,
  // Lane
  LANE_Y: 280,
  LANE_H: 76,
  DRUM_X: 100,
  DRUM_R: 52,
  // Judgment
  PERFECT_WINDOW: 75,
  GOOD_WINDOW: 140,
  BAD_WINDOW: 200,
  NOTE_R: 22,
  BIG_NOTE_R: 33,
  // Touch drums (left=Ka, center=both, right=Don)
  TDRUM_LX: 155, TDRUM_CX: 480, TDRUM_RX: 805,
  TDRUM_Y: 478,
  TDRUM_OR: 95,
  TDRUM_IR: 55,
  TDRUM_SIDE_R: 70,
  // Mic
  MIC_FFT: 2048,
  MIC_SMOOTH: 0.8,
  MIC_COOLDOWN: 120,
  MIC_LOW_END: 500,
  MIC_HIGH_END: 4000,
};

const NT = { DON: 0, KA: 1, BIG_DON: 2, BIG_KA: 3, ROLL: 4, BALLOON: 5, IMO: 6, KUSUDAMA: 7 };
const ST = { TITLE: 0, SELECT: 1, PLAYING: 2, RESULT: 3, FREE: 4, OPTIONS: 5 };
const DIFFS = ['쉬움', '보통', '어려움', '귀신'];
const DIFF_COLORS = ['#66BB6A', '#FFA726', '#EC407A', '#AB47BC'];
const DIFF_BG = [['#66BB6A','#43A047','#2E7D32'],['#FF7043','#FF5722','#BF360C'],['#EC407A','#D81B60','#880E4F'],['#AB47BC','#8E24AA','#4A148C']];
const SPEED_OPTS = [1, 1.5, 2];

// ─── Songs ───────────────────────────────────────
const SONGS = [
  // ── 쉬움 (Easy) ──
  {
    title: '첫걸음', sub: 'First Step', bpm: 95, dur: 30, speed: 260,
    diff: '쉬움', stars: 1, color: '#4CAF50',
    melody: [261.63,293.66,329.63,349.23,392.00,349.23,329.63,293.66],
    bass: [65.41,49.00,55.00,43.65], melType: 'triangle',
    gogo: [[16,28]],
    pats: [
      [[0,NT.DON],[2,NT.DON]], [[0,NT.DON],[2,NT.KA]], [[0,NT.BIG_DON]],
      [], [[0,NT.KA],[2,NT.KA]], [], [[0,NT.DON]], [],
    ],
  },
  {
    title: '산책', sub: 'Stroll', bpm: 105, dur: 35, speed: 280,
    diff: '쉬움', stars: 2, color: '#66BB6A',
    melody: [329.63,392.00,440.00,392.00,329.63,293.66,261.63,293.66],
    bass: [65.41,55.00,49.00,55.00], melType: 'triangle',
    pats: [
      [[0,NT.DON],[2,NT.DON]], [[0,NT.DON],[1,NT.DON],[2,NT.KA]],
      [[0,NT.DON],[2,NT.KA]], [[0,NT.BIG_DON]], [[0,NT.ROLL,2]],
      [], [[0,NT.KA],[2,NT.DON]], [],
    ],
    gogo: [[20,36]],
  },
  {
    title: '반짝반짝 별', sub: 'Twinkle Star', bpm: 110, dur: 35, speed: 290,
    diff: '쉬움', stars: 3, color: '#81C784',
    melody: [261.63,261.63,392.00,392.00,440.00,440.00,392.00,349.23,
             349.23,329.63,329.63,293.66,293.66,261.63],
    bass: [65.41,49.00,43.65,49.00], melType: 'triangle',
    pats: [
      [[0,NT.DON],[1,NT.DON],[2,NT.DON],[3,NT.DON]],
      [[0,NT.DON],[2,NT.KA]], [[0,NT.DON],[1,NT.DON],[2,NT.KA]],
      [[0,NT.BIG_DON],[2,NT.DON]], [[0,NT.ROLL,2]], [],
    ],
    gogo: [[24,40]],
  },
  {
    title: '호빵맨 마치', sub: 'Anpanman March', bpm: 124, dur: 68, speed: 270,
    diff: '쉬움', stars: 2, color: '#FF8A65',
    mp3: '호빵맨.mp3',
    pats: [
      [[0,NT.DON],[2,NT.DON]], [[0,NT.DON],[2,NT.KA]],
      [[0,NT.DON],[1,NT.DON],[2,NT.DON]], [[0,NT.BIG_DON]],
      [[0,NT.KA],[2,NT.KA]], [], [[0,NT.DON],[2,NT.DON],[3,NT.KA]],
      [[0,NT.DON]], [[0,NT.ROLL,2]], [],
    ],
    gogo: [[40,60],[80,100]],
  },
  // ── 보통 (Normal) ──
  {
    title: '축제장단', sub: 'Festival', bpm: 125, dur: 40, speed: 330,
    diff: '보통', stars: 4, color: '#FF9800',
    melody: [261.63,293.66,329.63,392.00,440.00,392.00,329.63,293.66,
             261.63,293.66,392.00,440.00,523.25,440.00,392.00,329.63],
    bass: [65.41,82.41,98.00,82.41], melType: 'square',
    pats: [
      [[0,NT.DON],[1,NT.DON],[2,NT.DON],[3,NT.DON]],
      [[0,NT.DON],[1,NT.KA],[2,NT.DON],[3,NT.KA]],
      [[0,NT.DON],[0.5,NT.DON],[2,NT.KA],[3,NT.DON]],
      [[0,NT.BIG_DON],[2,NT.BIG_KA]], [[0,NT.ROLL,2],[3,NT.DON]],
      [[0,NT.DON],[1,NT.DON],[2,NT.KA],[3,NT.KA]], [],
      [[0,NT.BALLOON,8]],
    ],
    gogo: [[24,40],[56,72]],
  },
  {
    title: '팝콘', sub: 'Popcorn', bpm: 132, dur: 40, speed: 340,
    diff: '보통', stars: 5, color: '#FFA726',
    melody: [329.63,311.13,329.63,261.63,220.00,174.61,220.00,261.63,
             329.63,311.13,329.63,261.63,220.00,261.63],
    bass: [55.00,65.41,73.42,65.41], melType: 'square',
    pats: [
      [[0,NT.DON],[0.5,NT.DON],[1,NT.KA],[2,NT.DON],[3,NT.KA]],
      [[0,NT.DON],[1,NT.DON],[2,NT.DON],[2.5,NT.DON],[3,NT.KA]],
      [[0,NT.BIG_DON],[2,NT.DON],[2.5,NT.KA],[3,NT.DON]],
      [[0,NT.ROLL,2],[3,NT.DON]], [],
      [[0,NT.KA],[1,NT.DON],[2,NT.KA],[3,NT.DON]],
      [[0,NT.BALLOON,10]],
    ],
    gogo: [[28,44],[60,76]],
  },
  {
    title: '여름바람', sub: 'Summer Wind', bpm: 138, dur: 42, speed: 350,
    diff: '보통', stars: 6, color: '#FFB74D',
    melody: [392.00,440.00,493.88,523.25,587.33,523.25,493.88,440.00,
             392.00,349.23,329.63,349.23,392.00,440.00,392.00,349.23],
    bass: [98.00,82.41,73.42,82.41], melType: 'triangle',
    pats: [
      [[0,NT.DON],[0.5,NT.KA],[1,NT.DON],[2,NT.DON],[3,NT.KA]],
      [[0,NT.DON],[1,NT.DON],[1.5,NT.KA],[2,NT.DON],[3,NT.DON]],
      [[0,NT.BIG_DON],[1,NT.KA],[2,NT.BIG_KA],[3,NT.DON]],
      [[0,NT.DON],[0.5,NT.DON],[1,NT.KA],[1.5,NT.KA],[2,NT.DON],[3,NT.KA]],
      [[0,NT.ROLL,2],[2.5,NT.DON],[3,NT.KA]], [],
      [[0,NT.BALLOON,10]],
    ],
    gogo: [[32,48],[64,80]],
  },
  // ── 어려움 (Hard) ──
  {
    title: '폭풍의 북', sub: 'Storm Drums', bpm: 152, dur: 45, speed: 390,
    diff: '어려움', stars: 7, color: '#E91E63',
    melody: [220.00,261.63,293.66,329.63,349.23,329.63,293.66,261.63,
             220.00,246.94,261.63,329.63,349.23,329.63,261.63,246.94],
    bass: [55.00,36.71,41.20,55.00], melType: 'sawtooth',
    pats: [
      [[0,NT.DON],[0.5,NT.KA],[1,NT.DON],[1.5,NT.KA],[2,NT.DON],[2.5,NT.DON],[3,NT.KA],[3.5,NT.KA]],
      [[0,NT.DON],[0.5,NT.DON],[1,NT.DON],[2,NT.BIG_KA],[3,NT.DON]],
      [[0,NT.DON],[0.67,NT.KA],[1.33,NT.DON],[2,NT.KA],[3,NT.BIG_DON]],
      [[0,NT.ROLL,2],[2.5,NT.DON],[3,NT.KA],[3.5,NT.DON]],
      [[0,NT.BIG_DON],[1,NT.BIG_KA],[2,NT.BIG_DON],[3,NT.BIG_KA]],
      [[0,NT.ROLL,3]],
      [[0,NT.BALLOON,12]], [[0,NT.IMO,2,8]],
    ],
    gogo: [[28,48],[68,92]],
  },
  {
    title: '홍련화', sub: 'Crimson Lotus', bpm: 160, dur: 45, speed: 410,
    diff: '어려움', stars: 8, color: '#EC407A',
    melody: [293.66,349.23,440.00,523.25,587.33,523.25,440.00,349.23,
             293.66,329.63,392.00,440.00,523.25,440.00,392.00,329.63],
    bass: [73.42,55.00,65.41,55.00], melType: 'sawtooth',
    pats: [
      [[0,NT.DON],[0.5,NT.DON],[1,NT.KA],[1.5,NT.DON],[2,NT.DON],[2.5,NT.KA],[3,NT.DON],[3.5,NT.KA]],
      [[0,NT.BIG_DON],[1,NT.DON],[1.5,NT.KA],[2,NT.DON],[2.5,NT.DON],[3,NT.BIG_KA]],
      [[0,NT.DON],[0.25,NT.DON],[0.5,NT.KA],[1,NT.DON],[2,NT.DON],[2.5,NT.KA],[3,NT.DON],[3.5,NT.KA]],
      [[0,NT.ROLL,1.5],[2,NT.DON],[2.5,NT.KA],[3,NT.DON],[3.5,NT.DON]],
      [[0,NT.DON],[0.5,NT.KA],[1,NT.BIG_DON],[2,NT.DON],[2.5,NT.KA],[3,NT.BIG_DON]],
      [[0,NT.BALLOON,12]], [[0,NT.IMO,2,8]],
    ],
    gogo: [[32,52],[72,100]],
  },
  {
    title: '질풍진뢰', sub: 'Lightning Speed', bpm: 168, dur: 48, speed: 420,
    diff: '어려움', stars: 9, color: '#F06292',
    melody: [440.00,493.88,523.25,587.33,659.25,587.33,523.25,493.88,
             440.00,392.00,349.23,392.00,440.00,523.25,440.00,392.00],
    bass: [110.00,82.41,92.50,82.41], melType: 'square',
    pats: [
      [[0,NT.DON],[0.25,NT.KA],[0.5,NT.DON],[1,NT.DON],[1.5,NT.KA],[2,NT.DON],[2.5,NT.DON],[3,NT.KA],[3.5,NT.DON]],
      [[0,NT.DON],[0.5,NT.KA],[1,NT.DON],[1.5,NT.KA],[2,NT.BIG_DON],[3,NT.DON],[3.5,NT.KA]],
      [[0,NT.ROLL,2],[2,NT.DON],[2.25,NT.KA],[2.5,NT.DON],[3,NT.DON],[3.25,NT.KA],[3.5,NT.DON],[3.75,NT.KA]],
      [[0,NT.BIG_DON],[0.5,NT.DON],[1,NT.KA],[1.5,NT.DON],[2,NT.BIG_KA],[2.5,NT.KA],[3,NT.DON],[3.5,NT.DON]],
      [[0,NT.DON],[0.33,NT.KA],[0.67,NT.DON],[1,NT.DON],[1.33,NT.KA],[1.67,NT.DON],[2,NT.BIG_DON],[3,NT.BIG_KA]],
      [[0,NT.IMO,2,10]],
    ],
    gogo: [[36,56],[80,108]],
  },
  // ── 귀신 (Oni / Expert) ──
  {
    title: '귀신 모드', sub: 'Oni Mode', bpm: 180, dur: 50, speed: 450,
    diff: '귀신', stars: 10, color: '#9C27B0',
    melody: [329.63,349.23,369.99,392.00,415.30,440.00,466.16,493.88,
             523.25,493.88,466.16,440.00,415.30,392.00,369.99,349.23],
    bass: [82.41,87.31,92.50,98.00], melType: 'square',
    pats: [
      [[0,NT.DON],[0.25,NT.DON],[0.5,NT.KA],[0.75,NT.DON],[1,NT.KA],[1.25,NT.KA],[1.5,NT.DON],[1.75,NT.KA],
       [2,NT.DON],[2.5,NT.DON],[3,NT.KA],[3.5,NT.DON]],
      [[0,NT.BIG_DON],[0.5,NT.DON],[1,NT.KA],[1.5,NT.DON],[2,NT.BIG_KA],[2.5,NT.KA],[3,NT.DON],[3.5,NT.KA]],
      [[0,NT.ROLL,1.5],[2,NT.DON],[2.25,NT.DON],[2.5,NT.KA],[2.75,NT.DON],[3,NT.KA],[3.25,NT.DON],[3.5,NT.KA],[3.75,NT.DON]],
      [[0,NT.DON],[0.33,NT.KA],[0.67,NT.DON],[1,NT.KA],[1.33,NT.DON],[1.67,NT.KA],[2,NT.BIG_DON],[3,NT.BIG_KA]],
      [[0,NT.ROLL,4]],
      [[0,NT.DON],[0.5,NT.KA],[1,NT.DON],[1.5,NT.KA],[2,NT.DON],[2.25,NT.DON],[2.5,NT.KA],[2.75,NT.KA],
       [3,NT.DON],[3.25,NT.KA],[3.5,NT.DON],[3.75,NT.KA]],
      [[0,NT.KUSUDAMA,20]],
    ],
    gogo: [[32,56],[76,112],[120,140]],
  },
  {
    title: '천본앵', sub: 'Senbonzakura', bpm: 190, dur: 50, speed: 470,
    diff: '귀신', stars: 10, color: '#AB47BC',
    melody: [523.25,493.88,440.00,392.00,349.23,329.63,293.66,329.63,
             349.23,392.00,440.00,493.88,523.25,587.33,523.25,493.88],
    bass: [65.41,82.41,55.00,73.42], melType: 'square',
    pats: [
      [[0,NT.DON],[0.25,NT.KA],[0.5,NT.DON],[0.75,NT.KA],[1,NT.DON],[1.25,NT.DON],[1.5,NT.KA],[1.75,NT.DON],
       [2,NT.KA],[2.25,NT.DON],[2.5,NT.KA],[2.75,NT.DON],[3,NT.DON],[3.25,NT.KA],[3.5,NT.DON],[3.75,NT.KA]],
      [[0,NT.BIG_DON],[0.5,NT.DON],[0.75,NT.DON],[1,NT.KA],[1.5,NT.DON],[2,NT.BIG_KA],[2.5,NT.DON],[2.75,NT.KA],[3,NT.DON],[3.5,NT.KA]],
      [[0,NT.ROLL,2],[2,NT.DON],[2.25,NT.KA],[2.5,NT.DON],[2.75,NT.KA],[3,NT.DON],[3.25,NT.DON],[3.5,NT.KA],[3.75,NT.DON]],
      [[0,NT.DON],[0.25,NT.DON],[0.5,NT.DON],[1,NT.KA],[1.25,NT.KA],[1.5,NT.KA],[2,NT.BIG_DON],[3,NT.BIG_KA]],
      [[0,NT.KUSUDAMA,18]], [[0,NT.BALLOON,15]],
    ],
    gogo: [[36,60],[84,120],[132,148]],
  },
  {
    title: '북의 신', sub: 'God of Taiko', bpm: 200, dur: 55, speed: 500,
    diff: '귀신', stars: 10, color: '#CE93D8',
    melody: [587.33,523.25,493.88,440.00,415.30,392.00,369.99,349.23,
             329.63,349.23,369.99,392.00,415.30,440.00,493.88,523.25],
    bass: [98.00,92.50,87.31,82.41], melType: 'sawtooth',
    pats: [
      [[0,NT.DON],[0.25,NT.DON],[0.5,NT.KA],[0.75,NT.DON],[1,NT.KA],[1.25,NT.DON],[1.5,NT.DON],[1.75,NT.KA],
       [2,NT.DON],[2.25,NT.KA],[2.5,NT.DON],[2.75,NT.DON],[3,NT.KA],[3.25,NT.DON],[3.5,NT.KA],[3.75,NT.DON]],
      [[0,NT.ROLL,1],[1,NT.DON],[1.25,NT.KA],[1.5,NT.DON],[1.75,NT.KA],[2,NT.ROLL,1],[3,NT.DON],[3.25,NT.KA],[3.5,NT.DON],[3.75,NT.KA]],
      [[0,NT.BIG_DON],[0.5,NT.BIG_KA],[1,NT.BIG_DON],[1.5,NT.BIG_KA],[2,NT.DON],[2.25,NT.DON],[2.5,NT.KA],[2.75,NT.DON],
       [3,NT.KA],[3.25,NT.DON],[3.5,NT.KA],[3.75,NT.DON]],
      [[0,NT.ROLL,4]],
      [[0,NT.KUSUDAMA,25]],
    ],
    gogo: [[40,68],[92,132],[148,172]],
  },
];

// ─── Language ────────────────────────────────────
const LANG_JA = {
  '쉬움':'かんたん','보통':'ふつう','어려움':'むずかしい','귀신':'おに',
  '최고':'良','좋아':'可','빗나감':'不可',
  '쿵':'ドン','딱':'カッ',
  '첫걸음':'はじめの一歩','산책':'おさんぽ','반짝반짝 별':'きらきら星',
  '호빵맨 마치':'アンパンマンマーチ',
  '축제장단':'お祭りリズム','팝콘':'ポップコーン','여름바람':'夏の風',
  '폭풍의 북':'嵐の太鼓','홍련화':'紅蓮華','질풍진뢰':'疾風迅雷',
  '귀신 모드':'鬼モード','천본앵':'千本桜','북의 신':'太鼓の神',
  '첫 클리어':'初クリア','첫 클리어!':'初クリア!',
  '풀콤보!':'フルコンボ!','풀콤보 달성!':'フルコンボ達成!',
  '50콤보':'50コンボ','50콤보 달성!':'50コンボ達成!',
  '100콤보':'100コンボ','100콤보 달성!':'100コンボ達成!',
  '10만점':'10万点','10만점 돌파!':'10万点突破!',
  '귀신 퇴치':'鬼退治','귀신 클리어!':'鬼クリア!',
  'S랭크':'Sランク','S랭크 달성!':'Sランク達成!',
  '태고의 달인':'太鼓の達人','태고의 달인 웹 버전':'太鼓の達人 ウェブ版',
  '곡을 선택하세요':'曲を選んでください','자유 모드':'フリーモード',
  '일시정지':'ポーズ','계속하기':'続ける','그만두기':'やめる',
  '결과 발표':'結果発表','클리어!':'クリア!','클리어':'クリア',
  '옵션':'オプション','음량':'音量',
  '타이밍 오프셋':'タイミングオフセット','노트 속도':'ノーツ速度',
  '마이크 입력':'マイク入力','마이크 민감도':'マイク感度',
  '콤보':'コンボ','Max콤보':'Maxコンボ','최대 콤보':'最大コンボ',
  '연타':'連打','연타!':'連打!','정확도':'正確度','혼':'魂',
  '펑!':'パン!','왼손':'左手','오른손':'右手','끝':'終',
  '쿵 (중앙): F / J 키  |  딱 (가장자리): D / K 키':'ドン (中央): F / J キー  |  カッ (フチ): D / K キー',
  '마우스/터치: 북 중앙 = 쿵  |  가장자리 = 딱':'マウス/タッチ: 太鼓の中央 = ドン  |  フチ = カッ',
  'SPACE / ENTER / 클릭으로 시작!':'SPACE / ENTER / クリックでスタート!',
  '자유롭게 북을 쳐보세요!  |  ESC: 돌아가기':'自由に太鼓を叩こう!  |  ESC: 戻る',
};
function T(s) { return (G.lang === 'ja' && LANG_JA[s]) || s; }

// ─── Select Layout ──────────────────────────────
const SEL_LAYOUT = (() => {
  const diffs = ['쉬움', '보통', '어려움', '귀신'];
  const pos = [], hdrs = [];
  let cy = 0;
  for (const d of diffs) {
    hdrs.push({ y: cy, diff: d });
    cy += 28;
    for (let i = 0; i < SONGS.length; i++) {
      if (SONGS[i].diff === d) { pos[i] = cy + 30; cy += 68; }
    }
    cy += 12;
  }
  return { pos, hdrs, totalH: cy };
})();

// ─── High Scores & Achievements ─────────────────
function loadScores() { try { return JSON.parse(localStorage.getItem('taiko_scores')||'{}'); } catch { return {}; } }
function saveScore(title, diff, score, fc, cleared) {
  const sc = loadScores(), k = title+'_'+diff, prev = sc[k] || { score:0, fc:false, cleared:false };
  sc[k] = { score: Math.max(prev.score, score), fc: prev.fc||fc, cleared: prev.cleared||cleared };
  try { localStorage.setItem('taiko_scores', JSON.stringify(sc)); } catch {}
}
function getScore(title, diff) { const sc = loadScores(); return sc[title+'_'+diff] || null; }
function loadAch() { try { return JSON.parse(localStorage.getItem('taiko_ach')||'[]'); } catch { return []; } }
function incPlays() { try { const n = parseInt(localStorage.getItem('taiko_plays')||'0')+1; localStorage.setItem('taiko_plays',n); return n; } catch { return 0; } }
function checkAch() {
  const unlocked = loadAch(), total = G.perf+G.good+G.miss;
  const fc = G.miss===0 && total>0, cleared = G.soul>=70;
  const acc = total>0 ? (G.perf+G.good*0.5)/total*100 : 0;
  const checks = [
    ['first_clear','첫 클리어','첫 클리어!',cleared],
    ['first_fc','풀콤보!','풀콤보 달성!',fc],
    ['combo50','50콤보','50콤보 달성!',G.maxCombo>=50],
    ['combo100','100콤보','100콤보 달성!',G.maxCombo>=100],
    ['score100k','10만점','10만점 돌파!',G.score>=100000],
    ['oni_clear','귀신 퇴치','귀신 클리어!',cleared && G.song && G.song.diff==='귀신'],
    ['rank_s','S랭크','S랭크 달성!',acc>=95 && total>0],
  ];
  for (const [id,name,desc,cond] of checks) {
    if (cond && !unlocked.includes(id)) { unlocked.push(id); G.achQueue.push({name,desc,t:performance.now()}); }
  }
  try { localStorage.setItem('taiko_ach',JSON.stringify(unlocked)); } catch {}
}

// ─── Audio ───────────────────────────────────────
let audioCtx = null, bgmNodes = [], mp3El = null;
function initAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
}
function playDon() {
  if (!audioCtx) return;
  const o = audioCtx.createOscillator(), g = audioCtx.createGain();
  o.type = 'sine'; o.frequency.setValueAtTime(180, audioCtx.currentTime);
  o.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.15);
  g.gain.setValueAtTime(0.8, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
  o.connect(g); g.connect(audioCtx.destination);
  o.start(audioCtx.currentTime); o.stop(audioCtx.currentTime + 0.2);
}
function playKa() {
  if (!audioCtx) return;
  const n = audioCtx.sampleRate * 0.1, buf = audioCtx.createBuffer(1, n, audioCtx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (n * 0.15));
  const s = audioCtx.createBufferSource(); s.buffer = buf;
  const bp = audioCtx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 3000; bp.Q.value = 1.5;
  const g = audioCtx.createGain(); g.gain.setValueAtTime(0.5, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
  s.connect(bp); bp.connect(g); g.connect(audioCtx.destination); s.start(audioCtx.currentTime);
}
function playBGM(song) {
  if (!audioCtx) return;
  // MP3 playback
  if (song.mp3) {
    mp3El = new Audio(song.mp3);
    mp3El.volume = G.optVol * 0.6;
    mp3El.play().catch(() => {});
    return;
  }
  const bd = 60 / song.bpm, tb = Math.floor(song.dur / bd);
  const m = audioCtx.createGain(); m.gain.value = 0.22 * G.optVol; m.connect(audioCtx.destination); bgmNodes.push(m);
  for (let i = 0; i < tb; i++) {
    const t = audioCtx.currentTime + i * bd;
    if (i % 4 === 0 || i % 4 === 2) {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.12);
      g.gain.setValueAtTime(0.7, t); g.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
      o.connect(g); g.connect(m); o.start(t); o.stop(t + 0.15); bgmNodes.push(o);
    }
    if (i % 4 === 1 || i % 4 === 3) {
      const bs = Math.floor(audioCtx.sampleRate * 0.1), buf = audioCtx.createBuffer(1, bs, audioCtx.sampleRate);
      const dd = buf.getChannelData(0); for (let j = 0; j < bs; j++) dd[j] = (Math.random() * 2 - 1) * Math.exp(-j / (bs * 0.2));
      const s = audioCtx.createBufferSource(); s.buffer = buf;
      const hp = audioCtx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1000;
      const g = audioCtx.createGain(); g.gain.setValueAtTime(0.4, t); g.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
      s.connect(hp); hp.connect(g); g.connect(m); s.start(t); bgmNodes.push(s);
    }
    const bo = audioCtx.createOscillator(), bg = audioCtx.createGain();
    bo.type = 'square'; bo.frequency.value = song.bass[i % song.bass.length];
    bg.gain.setValueAtTime(0.12, t); bg.gain.setValueAtTime(0.12, t + bd * 0.8);
    bg.gain.exponentialRampToValueAtTime(0.01, t + bd * 0.95);
    bo.connect(bg); bg.connect(m); bo.start(t); bo.stop(t + bd); bgmNodes.push(bo);
  }
  for (let i = 0; i < tb * 2; i++) {
    const t = audioCtx.currentTime + i * bd / 2, bs = Math.floor(audioCtx.sampleRate * 0.04);
    const buf = audioCtx.createBuffer(1, bs, audioCtx.sampleRate), dd = buf.getChannelData(0);
    for (let j = 0; j < bs; j++) dd[j] = (Math.random() * 2 - 1) * Math.exp(-j / (bs * 0.1));
    const s = audioCtx.createBufferSource(); s.buffer = buf;
    const hp = audioCtx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 6000;
    const g = audioCtx.createGain(); g.gain.setValueAtTime(0.15, t); g.gain.exponentialRampToValueAtTime(0.01, t + 0.04);
    s.connect(hp); hp.connect(g); g.connect(m); s.start(t); bgmNodes.push(s);
  }
  for (let i = 0; i < tb; i++) if (i % 2 === 0) {
    const t = audioCtx.currentTime + i * bd, o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = song.melType || 'triangle'; o.frequency.value = song.melody[Math.floor(i / 2) % song.melody.length];
    g.gain.setValueAtTime(0.1, t); g.gain.setValueAtTime(0.1, t + bd * 1.5);
    g.gain.exponentialRampToValueAtTime(0.01, t + bd * 1.8);
    o.connect(g); g.connect(m); o.start(t); o.stop(t + bd * 2); bgmNodes.push(o);
  }
}
function stopBGM() {
  bgmNodes.forEach(n => { try { n.disconnect(); } catch(e){} }); bgmNodes = [];
  if (mp3El) { mp3El.pause(); mp3El.currentTime = 0; mp3El = null; }
}

// ─── Mic ─────────────────────────────────────────
async function initMic() {
  try {
    initAudio();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    G.micStream = stream;
    const src = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = CONFIG.MIC_FFT;
    analyser.smoothingTimeConstant = CONFIG.MIC_SMOOTH;
    src.connect(analyser);
    G.micAnalyser = analyser;
    G.micData = new Uint8Array(analyser.frequencyBinCount);
    G.micOn = true; G.micPrev = 0;
  } catch (e) { G.micOn = false; }
}
function stopMic() {
  if (G.micStream) { G.micStream.getTracks().forEach(t => t.stop()); G.micStream = null; }
  if (G.micAnalyser) { try { G.micAnalyser.disconnect(); } catch(e){} G.micAnalyser = null; }
  G.micData = null; G.micOn = false; G.micLevel = 0;
}
function toggleMic() { if (G.micOn) stopMic(); else initMic(); }
function processMic() {
  if (!G.micOn || !G.micAnalyser || !G.micData) return;
  const a = G.micAnalyser, d = G.micData;
  a.getByteFrequencyData(d);
  const len = d.length;
  // Overall volume (RMS-like)
  let sum = 0;
  for (let i = 0; i < len; i++) sum += d[i];
  const avg = sum / len;
  G.micLevel = avg;
  // Onset detection: current avg vs slow baseline
  const onset = avg - G.micPrev;
  G.micPrev = avg * 0.08 + G.micPrev * 0.92; // very slow baseline for high sensitivity
  const now = performance.now();
  if (onset > G.micThreshold && now - G.micLastHit > CONFIG.MIC_COOLDOWN) {
    // Frequency analysis: low band vs mid band (ignore dead upper range)
    const sr = audioCtx.sampleRate, binHz = sr / CONFIG.MIC_FFT;
    const lowBin = Math.min(Math.floor(CONFIG.MIC_LOW_END / binHz), len);
    const highBin = Math.min(Math.floor(CONFIG.MIC_HIGH_END / binHz), len);
    let lowE = 0, highE = 0;
    for (let i = 0; i < lowBin; i++) lowE += d[i];
    for (let i = lowBin; i < highBin; i++) highE += d[i];
    lowE /= Math.max(1, lowBin);
    highE /= Math.max(1, highBin - lowBin);
    const isDon = lowE >= highE;
    G.micLastHit = now;
    hit(isDon, 1);
  }
}

// ─── Chart ───────────────────────────────────────
function genChart(song, diffIdx) {
  const notes = [], bd = 60 / song.bpm, tb = Math.floor(song.dur / bd);
  const ndi = DIFFS.indexOf(song.diff);
  const tdi = diffIdx >= 0 ? diffIdx : ndi;
  const densityScale = [0.4, 0.7, 1.0, 1.4];
  const dm = densityScale[tdi] / densityScale[ndi];
  let cb = 8;
  while (cb < tb - 4) {
    const pat = song.pats[Math.floor(Math.random() * song.pats.length)];
    for (const e of pat) {
      if (dm < 1 && Math.random() > dm) continue;
      const time = (cb + e[0]) * bd * 1000;
      if (time >= song.dur * 1000) continue;
      if (e[1] === NT.ROLL) {
        notes.push({ time, end: time + (e[2]||2)*bd*1000, type: NT.ROLL, hits: 0, done: false, hit: false, miss: false });
      } else if (e[1] === NT.BALLOON) {
        notes.push({ time, type: NT.BALLOON, reqHits: e[2]||10, hits: 0, done: false, hit: false, miss: false });
      } else if (e[1] === NT.IMO) {
        notes.push({ time, end: time + (e[2]||2)*bd*1000, type: NT.IMO, reqHits: e[3]||6, hits: 0, nextDon: true, done: false, hit: false, miss: false });
      } else if (e[1] === NT.KUSUDAMA) {
        notes.push({ time, type: NT.KUSUDAMA, reqHits: e[2]||15, hits: 0, done: false, hit: false, miss: false });
      } else {
        notes.push({ time, type: e[1], hit: false, miss: false });
      }
    }
    if (dm > 1 && Math.random() < (dm-1)*0.5) {
      const time = (cb + Math.floor(Math.random()*4) + 0.5) * bd * 1000;
      if (time < song.dur*1000) notes.push({ time, type: Math.random()<0.6?NT.DON:NT.KA, hit: false, miss: false });
    }
    cb += 4;
  }
  return notes.sort((a, b) => a.time - b.time);
}

// ─── State ───────────────────────────────────────
const G = {
  st: ST.TITLE, song: null, sel: 0, selScrl: 0,
  notes: [], t0: 0, elapsed: 0,
  score: 0, combo: 0, maxCombo: 0,
  perf: 0, good: 0, miss: 0, rollHits: 0,
  soul: 0, fx: [], dh: { don: 0, ka: 0 },
  chr: 'idle', chrT: 0, chrJ: 0,
  tb: 0, fn: [], ft0: 0, fhc: 0,
  lanterns: [], petals: [], flowers: [], sparkles: [],
  // Pause
  paused: false, pauseT: 0, pauseSel: 0,
  // GO-GO
  gogo: false, gogoRanges: [],
  // Countdown
  countdown: -1, cdT: 0,
  // Speed & Difficulty
  speedMod: 1, selDiff: 0,
  // Options
  optVol: 1.0, optOffset: 0, optSel: 0,
  // 2P
  twoP: false,
  p2: { score:0, combo:0, maxCombo:0, perf:0, good:0, miss:0, rollHits:0,
        soul:0, chr:'idle', chrT:0, chrJ:0, dh:{don:0,ka:0}, comboMile:0 },
  p2notes: [],
  // Achievements
  achQueue: [],
  // Combo milestone
  comboMile: 0,
  // Mic
  lang: 'ko',
  micOn: false, micStream: null, micAnalyser: null, micData: null,
  micThreshold: 8, micLastHit: 0, micLevel: 0, micPrev: 0,
};

// Init decorations
function initDeco() {
  G.lanterns = [];
  for (let i = 0; i < 6; i++) {
    G.lanterns.push({ x: 80 + i * 160, y: 60 + Math.random() * 30, phase: Math.random() * Math.PI * 2 });
  }
  G.petals = [];
  for (let i = 0; i < 20; i++) {
    G.petals.push({
      x: Math.random() * CONFIG.WIDTH, y: Math.random() * CONFIG.HEIGHT,
      vx: 0.2 + Math.random() * 0.5, vy: 0.4 + Math.random() * 0.7,
      r: 2 + Math.random() * 4, rot: Math.random() * Math.PI * 2,
      rv: 0.02 + Math.random() * 0.03,
    });
  }
  // Decorative flowers
  const fpos = [
    [45,540,48],[915,535,44],[25,200,38],[935,180,35],
    [140,500,30],[820,490,28],[60,370,22],[900,400,24],
    [480,555,20],[300,530,18],[660,540,16],
  ];
  const fcols = ['#FF6D00','#FFD600','#FF1744','#FF9100','#E65100'];
  G.flowers = fpos.map(([x,y,r]) => ({
    x, y, r, n: 8 + Math.floor(Math.random() * 5),
    c: fcols[Math.floor(Math.random() * fcols.length)],
    ph: Math.random() * Math.PI * 2,
  }));
  // Sparkles
  G.sparkles = [];
  for (let i = 0; i < 30; i++) {
    G.sparkles.push({
      x: Math.random() * CONFIG.WIDTH, y: Math.random() * CONFIG.HEIGHT,
      r: 1 + Math.random() * 2.5, ph: Math.random() * Math.PI * 2,
      sp: 0.8 + Math.random() * 2,
    });
  }
}
initDeco();

// ─── Input ───────────────────────────────────────
const keys = {};
function isDon(c) {
  if (c==='KeyF') return 1;
  if (c==='KeyJ') return G.twoP ? 2 : 1;
  return 0;
}
function isKa(c) {
  if (c==='KeyD') return 1;
  if (c==='KeyK') return G.twoP ? 2 : 1;
  return 0;
}

function freeHit(don) {
  if (don) { playDon(); G.dh.don = 8; } else { playKa(); G.dh.ka = 8; }
  G.fhc++;
  const isBig = Math.random() < 0.1;
  G.fn.push({ type: don ? (isBig ? NT.BIG_DON : NT.DON) : (isBig ? NT.BIG_KA : NT.KA), t: performance.now() - G.ft0 });
  G.chr = G.fhc % 10 === 0 ? 'excited' : 'happy'; G.chrT = 15; G.chrJ = 8;
  addParticles(CONFIG.DRUM_X, CONFIG.LANE_Y, don ? '#FF4444' : '#4488FF', 5);
}

function checkComboMile(p) {
  if (p.combo === 50 && p.comboMile < 50) { p.comboMile = 50; addComboMileFx(50); }
  if (p.combo === 100 && p.comboMile < 100) { p.comboMile = 100; addComboMileFx(100); }
}
function addComboMileFx(n) {
  for (let i = 0; i < 30; i++) {
    const a = (i/30)*Math.PI*2;
    G.fx.push({ type:'p', x:CONFIG.DRUM_X, y:CONFIG.LANE_Y,
      vx:Math.cos(a)*(4+Math.random()*4), vy:Math.sin(a)*(4+Math.random()*4),
      color: n>=100?'#FF1744':'#FFD600', life:40, ml:40, r:4+Math.random()*4 });
  }
  G.fx.push({ text:`${n} ${T('콤보')}!`, color: n>=100?'#FF1744':'#FFD600',
    x:CONFIG.WIDTH/2, y:CONFIG.LANE_Y-50, life:60, ml:60 });
}

function hit(don, player) {
  if (player === undefined) player = 1;
  if (G.st === ST.FREE) { freeHit(don); return; }
  if (G.st !== ST.PLAYING || G.paused || G.countdown >= 0) return;
  const p = player===2 ? G.p2 : G;
  const notes = player===2 ? G.p2notes : G.notes;
  if (don) { playDon(); p.dh.don = 8; } else { playKa(); p.dh.ka = 8; }
  const gm = G.gogo ? 1.5 : 1;

  // Roll
  for (const n of notes) {
    if (n.type===NT.ROLL && !n.done && G.elapsed>=n.time-50 && G.elapsed<=n.end+50) {
      n.hits++; p.rollHits++; p.score+=100*gm; p.combo++;
      p.maxCombo=Math.max(p.maxCombo,p.combo); p.soul=Math.min(100,p.soul+0.3);
      p.chr='roll'; p.chrT=15; addParticles(CONFIG.DRUM_X,CONFIG.LANE_Y,'#FFAA00',3);
      checkComboMile(p); return;
    }
  }
  // Balloon (DON only)
  if (don) for (const n of notes) {
    if (n.type===NT.BALLOON && !n.done && G.elapsed>=n.time-50 && G.elapsed<=n.time+4000) {
      n.hits++; p.score+=100*gm;
      if (n.hits>=n.reqHits) { n.done=true; n.hit=true; p.score+=1000*gm;
        addParticles(CONFIG.DRUM_X,CONFIG.LANE_Y,'#FF4444',20);
        G.fx.push({text:T('펑!'),color:'#FF4444',x:CONFIG.DRUM_X,y:CONFIG.LANE_Y-65,life:40,ml:40});
        p.chr='excited'; p.chrT=30; p.chrJ=12;
      } else addParticles(CONFIG.DRUM_X,CONFIG.LANE_Y,'#FF8888',3);
      return;
    }
  }
  // Kusudama (any)
  for (const n of notes) {
    if (n.type===NT.KUSUDAMA && !n.done && G.elapsed>=n.time-50 && G.elapsed<=n.time+5000) {
      n.hits++; p.score+=100*gm;
      if (n.hits>=n.reqHits) { n.done=true; n.hit=true; p.score+=2000*gm;
        addParticles(CONFIG.DRUM_X,CONFIG.LANE_Y,'#FFD600',30);
        G.fx.push({text:T('펑!'),color:'#FFD600',x:CONFIG.DRUM_X,y:CONFIG.LANE_Y-65,life:40,ml:40});
        p.chr='excited'; p.chrT=40; p.chrJ=15;
      } else addParticles(CONFIG.DRUM_X,CONFIG.LANE_Y,'#FFAA00',3);
      return;
    }
  }
  // Imo (alternate DON/KA)
  for (const n of notes) {
    if (n.type===NT.IMO && !n.done && G.elapsed>=n.time-50 && G.elapsed<=n.end+50) {
      if ((don&&n.nextDon)||(!don&&!n.nextDon)) {
        n.hits++; n.nextDon=!n.nextDon; p.score+=100*gm;
        if (n.hits>=n.reqHits) { n.done=true; n.hit=true; p.score+=1000*gm;
          addParticles(CONFIG.DRUM_X,CONFIG.LANE_Y,'#FF8C00',15);
          p.chr='excited'; p.chrT=25; p.chrJ=10;
        } else addParticles(CONFIG.DRUM_X,CONFIG.LANE_Y,don?'#FF4444':'#4488FF',2);
      }
      return;
    }
  }
  // Regular notes
  let best = null, bestD = Infinity;
  for (const n of notes) {
    if (n.hit||n.miss||n.type>=NT.ROLL) continue;
    const d = Math.abs((n.time+G.optOffset)-G.elapsed);
    if (d>CONFIG.BAD_WINDOW) continue;
    const nDon=n.type===NT.DON||n.type===NT.BIG_DON;
    const nKa=n.type===NT.KA||n.type===NT.BIG_KA;
    if ((don&&nDon)||(!don&&nKa)) { if (d<bestD) { bestD=d; best=n; } }
  }
  if (best) {
    best.hit = true; let j = '';
    if (bestD<=CONFIG.PERFECT_WINDOW) {
      j='최고'; p.score+=300*(1+Math.floor(p.combo/10)*0.1)*gm;
      p.perf++; p.combo++; p.soul=Math.min(100,p.soul+2);
      p.chr=p.combo>=30?'excited':'happy'; p.chrT=25; p.chrJ=12;
    } else if (bestD<=CONFIG.GOOD_WINDOW) {
      j='좋아'; p.score+=100*(1+Math.floor(p.combo/10)*0.1)*gm;
      p.good++; p.combo++; p.soul=Math.min(100,p.soul+1);
      p.chr='happy'; p.chrT=20; p.chrJ=6;
    } else {
      j='빗나감'; p.miss++; p.combo=0; p.soul=Math.max(0,p.soul-3);
      p.chr='sad'; p.chrT=40; p.chrJ=0;
    }
    p.maxCombo=Math.max(p.maxCombo,p.combo);
    addJudgeFx(j);
    addParticles(CONFIG.DRUM_X,CONFIG.LANE_Y,j==='최고'?'#FF6600':j==='좋아'?'#FFCC00':'#666',j==='최고'?10:5);
    checkComboMile(p);
  }
}

function addJudgeFx(text) {
  const colors = { '최고': '#FF6600', '좋아': '#FFCC00', '빗나감': '#999' };
  G.fx.push({ text: T(text), color: colors[text], x: CONFIG.DRUM_X, y: CONFIG.LANE_Y - 65, life: 40, ml: 40 });
}
function addParticles(px, py, color, count) {
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    G.fx.push({ type: 'p', x: px, y: py, vx: Math.cos(a) * (2 + Math.random() * 3), vy: Math.sin(a) * (2 + Math.random() * 3), color, life: 20 + Math.random() * 10, ml: 30, r: 3 + Math.random() * 3 });
  }
}

document.addEventListener('keydown', e => {
  if (keys[e.code]) return; keys[e.code] = true;
  if (G.st === ST.TITLE) { if (e.code==='Space'||e.code==='Enter') G.st = ST.SELECT; return; }
  if (G.st === ST.OPTIONS) {
    if (e.code==='ArrowUp') G.optSel = Math.max(0, G.optSel-1);
    if (e.code==='ArrowDown') G.optSel = Math.min(4, G.optSel+1);
    if (e.code==='ArrowLeft'||e.code==='ArrowRight') {
      const dir = e.code==='ArrowRight'?1:-1;
      if (G.optSel===0) G.optVol = Math.max(0, Math.min(1, +(G.optVol+dir*0.1).toFixed(1)));
      if (G.optSel===1) G.optOffset = Math.max(-100, Math.min(100, G.optOffset+dir*5));
      if (G.optSel===2) { const si = SPEED_OPTS.indexOf(G.speedMod); G.speedMod = SPEED_OPTS[(si+dir+3)%3]; }
      if (G.optSel===3) toggleMic();
      if (G.optSel===4) G.micThreshold = Math.max(10, Math.min(80, G.micThreshold+dir*5));
    }
    if (e.code==='Escape') G.st = ST.SELECT;
    return;
  }
  if (G.st === ST.SELECT) {
    if (e.code==='ArrowUp') G.sel = (G.sel-1+SONGS.length) % SONGS.length;
    if (e.code==='ArrowDown') G.sel = (G.sel+1) % SONGS.length;
    if (e.code==='ArrowLeft') G.selDiff = (G.selDiff-1+4) % 4;
    if (e.code==='ArrowRight') G.selDiff = (G.selDiff+1) % 4;
    if (e.code==='Space'||e.code==='Enter') startGame(G.sel);
    if (e.code==='Escape') G.st = ST.TITLE;
    if (e.code==='KeyT') startFree();
    if (e.code==='KeyS') { const si = SPEED_OPTS.indexOf(G.speedMod); G.speedMod = SPEED_OPTS[(si+1)%3]; }
    if (e.code==='Digit2') G.twoP = !G.twoP;
    if (e.code==='KeyO') { G.st = ST.OPTIONS; G.optSel = 0; }
    if (e.code==='KeyM') toggleMic();
    if (e.code==='KeyL') G.lang = G.lang === 'ko' ? 'ja' : 'ko';
    return;
  }
  if (G.st === ST.RESULT) { if (e.code==='Space'||e.code==='Enter') G.st = ST.SELECT; return; }
  if (G.st === ST.FREE) {
    if (e.code==='Escape') { stopBGM(); G.st = ST.SELECT; return; }
    const dp=isDon(e.code), kp=isKa(e.code);
    if (dp) hit(true,dp); if (kp) hit(false,kp); return;
  }
  // PLAYING state
  if (G.paused) {
    if (e.code==='ArrowUp'||e.code==='ArrowDown') G.pauseSel=(G.pauseSel+1)%2;
    if (e.code==='Enter'||e.code==='Space') {
      if (G.pauseSel===0) { G.t0+=performance.now()-G.pauseT; G.paused=false; if(audioCtx)audioCtx.resume(); if(mp3El)mp3El.play(); }
      else { G.paused=false; stopBGM(); if(audioCtx)audioCtx.resume(); G.st=ST.SELECT; }
    }
    if (e.code==='Escape') { G.t0+=performance.now()-G.pauseT; G.paused=false; if(audioCtx)audioCtx.resume(); if(mp3El)mp3El.play(); }
    return;
  }
  if (e.code==='Escape' && G.st===ST.PLAYING) {
    G.paused=true; G.pauseT=performance.now(); G.pauseSel=0;
    if(audioCtx)audioCtx.suspend(); if(mp3El)mp3El.pause(); return;
  }
  const dp=isDon(e.code), kp=isKa(e.code);
  if (dp) hit(true,dp); if (kp) hit(false,kp);
});
document.addEventListener('keyup', e => { keys[e.code] = false; });

function drumHitType(x, y) {
  const dy = y - CONFIG.TDRUM_Y;
  // Left drum (Ka only)
  const distL = Math.sqrt((x - CONFIG.TDRUM_LX) ** 2 + dy ** 2);
  if (distL <= CONFIG.TDRUM_SIDE_R) return 'ka';
  // Right drum (Don only)
  const distR = Math.sqrt((x - CONFIG.TDRUM_RX) ** 2 + dy ** 2);
  if (distR <= CONFIG.TDRUM_SIDE_R) return 'don';
  // Center drum (inner=Don, outer=Ka)
  const distC = Math.sqrt((x - CONFIG.TDRUM_CX) ** 2 + dy ** 2);
  if (distC <= CONFIG.TDRUM_IR) return 'don';
  if (distC <= CONFIG.TDRUM_OR) return 'ka';
  return null;
}
function ptr(e) {
  const r = canvas.getBoundingClientRect();
  const x = (e.clientX - r.left) * (CONFIG.WIDTH / r.width), y = (e.clientY - r.top) * (CONFIG.HEIGHT / r.height);
  if (G.st === ST.TITLE) { G.st = ST.SELECT; return; }
  if (G.st === ST.SELECT) {
    // Free play button
    if (x >= CONFIG.WIDTH / 2 - 110 && x <= CONFIG.WIDTH / 2 + 110 && y >= CONFIG.HEIGHT - 41 && y <= CONFIG.HEIGHT - 9) { startFree(); return; }
    // Song cards (scroll-aware)
    const viewTop = 68, viewBot = CONFIG.HEIGHT - 52;
    if (y >= viewTop && y <= viewBot) {
      const contentY = y - viewTop + G.selScrl;
      for (let i = 0; i < SONGS.length; i++) {
        const sy = SEL_LAYOUT.pos[i];
        if (contentY >= sy - 29 && contentY <= sy + 29 && x >= 120 && x <= 840) {
          if (G.sel === i) startGame(i); else G.sel = i; return;
        }
      }
    }
    return;
  }
  if (G.st === ST.RESULT) { G.st = ST.SELECT; return; }
  if (G.paused) return;
  const ht = drumHitType(x, y);
  if (ht === 'don') hit(true,1); else if (ht === 'ka') hit(false,1);
}
canvas.addEventListener('mousedown', ptr);
canvas.addEventListener('touchstart', e => { e.preventDefault(); for (const t of e.changedTouches) ptr(t); }, { passive: false });
canvas.addEventListener('wheel', e => {
  if (G.st === ST.SELECT) {
    if (e.deltaY > 0) G.sel = Math.min(SONGS.length - 1, G.sel + 1);
    else if (e.deltaY < 0) G.sel = Math.max(0, G.sel - 1);
    e.preventDefault();
  }
}, { passive: false });

// ─── Start ───────────────────────────────────────
function startGame(idx) {
  initAudio(); G.song = SONGS[idx]; G.notes = genChart(G.song, G.selDiff);
  G.score = 0; G.combo = 0; G.maxCombo = 0; G.perf = 0; G.good = 0; G.miss = 0; G.rollHits = 0;
  G.soul = 0; G.fx = []; G.chr = 'idle'; G.chrT = 0; G.chrJ = 0;
  G.paused = false; G.comboMile = 0;
  // GO-GO ranges
  G.gogoRanges = [];
  if (G.song.gogo) { const bms = 60/G.song.bpm*1000; for(const[s,e] of G.song.gogo) G.gogoRanges.push([s*bms,e*bms]); }
  G.gogo = false;
  // Countdown
  G.countdown = 3; G.cdT = performance.now();
  G.st = ST.PLAYING; stopBGM();
  // 2P
  if (G.twoP) {
    G.p2notes = genChart(G.song, G.selDiff);
    G.p2.score=0; G.p2.combo=0; G.p2.maxCombo=0; G.p2.perf=0; G.p2.good=0; G.p2.miss=0;
    G.p2.rollHits=0; G.p2.soul=0; G.p2.chr='idle'; G.p2.chrT=0; G.p2.chrJ=0;
    G.p2.dh={don:0,ka:0}; G.p2.comboMile=0;
  }
}
function startFree() {
  initAudio(); G.song = SONGS[G.sel]; G.fn = []; G.ft0 = performance.now(); G.fhc = 0;
  G.fx = []; G.chr = 'idle'; G.chrT = 0; G.chrJ = 0;
  G.st = ST.FREE; stopBGM(); playBGM(G.song);
}

// ─── Draw Helpers ────────────────────────────────
function drawRoundRect(x, y, w, h, r) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill();
}

// ─── Background ──────────────────────────────────
function drawBG() {
  // Per-difficulty base gradient
  let bgc = ['#FF7043','#FF5722','#BF360C'];
  if ((G.st===ST.PLAYING||G.st===ST.FREE) && G.song) {
    const di = DIFFS.indexOf(G.song.diff);
    if (di >= 0) bgc = DIFF_BG[di];
  }
  const g = ctx.createLinearGradient(0, 0, 0, CONFIG.HEIGHT);
  g.addColorStop(0, bgc[0]); g.addColorStop(0.5, bgc[1]); g.addColorStop(1, bgc[2]);
  ctx.fillStyle = g; ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

  const t = performance.now() / 1000;

  // Warm glow spots
  for (const [cx,cy,r] of [[180,140,200],[780,420,220],[480,280,260]]) {
    const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    rg.addColorStop(0, 'rgba(255,200,50,0.1)'); rg.addColorStop(1, 'rgba(255,200,50,0)');
    ctx.fillStyle = rg; ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  }

  // Flowing ribbons
  ctx.lineWidth = 3;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.strokeStyle = `rgba(255,${180+i*15},${40+i*25},0.12)`;
    for (let x = 0; x <= CONFIG.WIDTH; x += 4) {
      const yy = 80 + i * 110 + Math.sin(x/90 + t*0.4 + i*1.7) * 35 + Math.cos(x/55 + t*0.25 + i) * 18;
      x === 0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy);
    }
    ctx.stroke();
  }

  // Decorative flowers
  for (const f of G.flowers) {
    const fr = f.r + Math.sin(t * 0.7 + f.ph) * 2;
    ctx.save(); ctx.translate(f.x, f.y);
    ctx.rotate(Math.sin(t * 0.2 + f.ph) * 0.04);
    // Outer glow
    const fg = ctx.createRadialGradient(0, 0, fr * 0.3, 0, 0, fr * 1.3);
    fg.addColorStop(0, 'rgba(255,180,50,0.08)'); fg.addColorStop(1, 'rgba(255,180,50,0)');
    ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(0, 0, fr * 1.3, 0, Math.PI * 2); ctx.fill();
    // Petals
    for (let p = 0; p < f.n; p++) {
      const a = (p / f.n) * Math.PI * 2;
      ctx.save(); ctx.rotate(a);
      ctx.fillStyle = f.c; ctx.globalAlpha = 0.55;
      ctx.beginPath(); ctx.ellipse(fr * 0.55, 0, fr * 0.48, fr * 0.22, 0, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 0.3; ctx.fillStyle = '#FFF';
      ctx.beginPath(); ctx.ellipse(fr * 0.4, 0, fr * 0.2, fr * 0.08, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    // Center
    ctx.globalAlpha = 0.75; ctx.fillStyle = '#FFF8E1';
    ctx.beginPath(); ctx.arc(0, 0, fr * 0.22, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 0.5; ctx.fillStyle = '#FFB300';
    ctx.beginPath(); ctx.arc(0, 0, fr * 0.13, 0, Math.PI * 2); ctx.fill();
    ctx.restore(); ctx.globalAlpha = 1;
  }

  // Cherry blossom petals
  for (const p of G.petals) {
    p.x += p.vx; p.y += p.vy; p.rot += p.rv;
    if (p.y > CONFIG.HEIGHT + 10) { p.y = -10; p.x = Math.random() * CONFIG.WIDTH; }
    if (p.x > CONFIG.WIDTH + 10) { p.x = -10; }
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
    ctx.fillStyle = 'rgba(255,183,197,0.45)';
    ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,220,230,0.3)';
    ctx.beginPath(); ctx.ellipse(p.r * 0.2, -p.r * 0.1, p.r * 0.4, p.r * 0.2, 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  // Sparkles
  for (const s of G.sparkles) {
    const a = 0.25 + Math.sin(t * s.sp + s.ph) * 0.25;
    if (a <= 0.02) continue;
    const sr = s.r * (0.7 + Math.sin(t * s.sp + s.ph) * 0.5);
    ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(Math.PI / 4);
    ctx.fillStyle = `rgba(255,255,220,${a})`;
    ctx.fillRect(-sr, -0.6, sr * 2, 1.2);
    ctx.fillRect(-0.6, -sr, 1.2, sr * 2);
    // Diamond center
    ctx.fillStyle = `rgba(255,255,255,${a * 0.8})`;
    ctx.beginPath(); ctx.arc(0, 0, sr * 0.4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  // Lanterns
  for (const l of G.lanterns) {
    const ly = l.y + Math.sin(t + l.phase) * 5;
    ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(l.x, 0); ctx.lineTo(l.x, ly - 15); ctx.stroke();
    // Glow
    const gl = ctx.createRadialGradient(l.x, ly, 4, l.x, ly, 35);
    gl.addColorStop(0, 'rgba(255,100,0,0.18)'); gl.addColorStop(1, 'rgba(255,100,0,0)');
    ctx.fillStyle = gl; ctx.fillRect(l.x - 35, ly - 35, 70, 70);
    // Body
    ctx.fillStyle = '#FF1744';
    ctx.beginPath(); ctx.ellipse(l.x, ly, 14, 18, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#B71C1C'; ctx.lineWidth = 1; ctx.stroke();
    // Bands
    ctx.strokeStyle = '#FFD600'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.ellipse(l.x, ly - 8, 14, 3, 0, 0, Math.PI); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(l.x, ly + 8, 14, 3, 0, Math.PI, Math.PI * 2); ctx.stroke();
    // Inner glow
    const ig = ctx.createRadialGradient(l.x, ly, 2, l.x, ly, 14);
    ig.addColorStop(0, 'rgba(255,200,50,0.25)'); ig.addColorStop(1, 'rgba(255,200,50,0)');
    ctx.fillStyle = ig; ctx.beginPath(); ctx.ellipse(l.x, ly, 14, 18, 0, 0, Math.PI * 2); ctx.fill();
  }
}

// ─── Top Panel ───────────────────────────────────
function drawTopPanel() {
  // Dark panel
  ctx.fillStyle = 'rgba(30,10,0,0.85)';
  ctx.fillRect(0, 0, CONFIG.WIDTH, 55);
  ctx.fillStyle = '#8D6E63'; ctx.fillRect(0, 55, CONFIG.WIDTH, 3);

  // P1 Score
  ctx.fillStyle = '#FFF'; ctx.font = 'bold 26px sans-serif';
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText(String(Math.floor(G.score)).padStart(7, '0'), 15, G.twoP ? 18 : 28);

  // P2 Score
  if (G.twoP) {
    ctx.fillStyle = '#64B5F6'; ctx.font = 'bold 12px sans-serif';
    ctx.fillText('P1', 15, 38);
    ctx.fillStyle = '#EF9A9A'; ctx.font = 'bold 12px sans-serif';
    ctx.fillText('P2', 15, 50);
    ctx.fillStyle = '#EF9A9A'; ctx.font = 'bold 18px sans-serif';
    ctx.fillText(String(Math.floor(G.p2.score)).padStart(7, '0'), 35, 50);
  }

  // GO-GO indicator
  if (G.gogo) {
    ctx.fillStyle = `rgba(255,200,0,${(0.8+Math.sin(performance.now()/120)*0.2).toFixed(2)})`;
    ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('GO-GO! x1.5', CONFIG.WIDTH/2, 28);
  }

  // Speed badge
  if (G.speedMod !== 1) {
    ctx.fillStyle = 'rgba(0,200,255,0.8)'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(`x${G.speedMod}`, CONFIG.WIDTH/2, 46);
  }

  // Song title
  if (G.song) {
    ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = '13px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`${T(G.song.title)} (${T(DIFFS[G.selDiff])})`, CONFIG.WIDTH - 15, 18);
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.font = '11px sans-serif';
    ctx.fillText(`${G.song.bpm} BPM`, CONFIG.WIDTH - 15, 38);
  }
}

// ─── Soul Gauge ──────────────────────────────────
function drawSoulGauge() {
  const gx = 200, gy = 14, gw = 350, gh = 28;

  // Background
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.beginPath(); ctx.roundRect(gx, gy, gw, gh, 5); ctx.fill();

  // Fill
  const fill = G.soul / 100;
  if (fill > 0) {
    ctx.save();
    ctx.beginPath(); ctx.roundRect(gx + 2, gy + 2, gw - 4, gh - 4, 4); ctx.clip();
    const sg = ctx.createLinearGradient(gx, 0, gx + gw * fill, 0);
    if (G.soul >= 70) {
      sg.addColorStop(0, '#FF6D00'); sg.addColorStop(0.5, '#FF1744'); sg.addColorStop(1, '#FF1744');
    } else if (G.soul >= 40) {
      sg.addColorStop(0, '#FFC107'); sg.addColorStop(1, '#FF9800');
    } else {
      sg.addColorStop(0, '#42A5F5'); sg.addColorStop(1, '#1E88E5');
    }
    ctx.fillStyle = sg;
    ctx.fillRect(gx + 2, gy + 2, (gw - 4) * fill, gh - 4);

    // Animated shine
    const shine = (performance.now() / 15) % (gw + 40) - 20;
    const shg = ctx.createLinearGradient(gx + shine - 20, 0, gx + shine + 20, 0);
    shg.addColorStop(0, 'rgba(255,255,255,0)'); shg.addColorStop(0.5, 'rgba(255,255,255,0.15)'); shg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = shg; ctx.fillRect(gx + 2, gy + 2, (gw - 4) * fill, gh - 4);
    ctx.restore();
  }

  // Clear threshold line at 70%
  const tx = gx + 2 + (gw - 4) * 0.7;
  ctx.strokeStyle = G.soul >= 70 ? '#FFD600' : 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(tx, gy); ctx.lineTo(tx, gy + gh); ctx.stroke();

  // 혼 label
  ctx.fillStyle = G.soul >= 70 ? '#FFD600' : '#FFF';
  ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
  ctx.fillText(T('혼'), gx - 6, gy + gh / 2);

  // Clear text
  if (G.soul >= 70) {
    ctx.fillStyle = '#FFD600'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText(T('클리어'), tx + 4, gy + gh / 2);
  }

  // Border
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.roundRect(gx, gy, gw, gh, 5); ctx.stroke();

  // 2P gauge
  if (G.twoP) {
    const g2y = gy + gh + 4, g2h = 14;
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath(); ctx.roundRect(gx, g2y, gw, g2h, 3); ctx.fill();
    const f2 = G.p2.soul / 100;
    if (f2 > 0) {
      const s2 = ctx.createLinearGradient(gx, 0, gx + gw * f2, 0);
      s2.addColorStop(0, '#64B5F6'); s2.addColorStop(1, G.p2.soul >= 70 ? '#EF5350' : '#42A5F5');
      ctx.fillStyle = s2; ctx.beginPath(); ctx.roundRect(gx, g2y, (gw) * f2, g2h, 3); ctx.fill();
    }
    ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    ctx.fillText('P2', gx - 6, g2y + g2h / 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(gx, g2y, gw, g2h, 3); ctx.stroke();
  }
}

// ─── Lane ────────────────────────────────────────
function drawLane() {
  const y = CONFIG.LANE_Y, h = CONFIG.LANE_H;
  const laneTop = y - h / 2, laneBot = y + h / 2;

  // Lane track
  ctx.fillStyle = '#37474F';
  ctx.fillRect(0, laneTop, CONFIG.WIDTH, h);

  // GO-GO glow
  if (G.gogo) {
    const gg = ctx.createLinearGradient(0, laneTop, 0, laneBot);
    gg.addColorStop(0, 'rgba(255,200,0,0.15)'); gg.addColorStop(0.5, 'rgba(255,100,0,0.1)'); gg.addColorStop(1, 'rgba(255,200,0,0.15)');
    ctx.fillStyle = gg; ctx.fillRect(0, laneTop, CONFIG.WIDTH, h);
  }

  // Subtle conveyor lines
  if (G.st === ST.PLAYING && G.song) {
    const beatMs = 60 / G.song.bpm * 1000, px = G.song.speed / 1000 * G.speedMod;
    const first = Math.floor(G.elapsed / beatMs) * beatMs;
    for (let t = first; t < G.elapsed + 3000; t += beatMs) {
      const x = CONFIG.DRUM_X + (t - G.elapsed) * px;
      if (x > CONFIG.DRUM_X + CONFIG.DRUM_R && x < CONFIG.WIDTH) {
        ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x, laneTop); ctx.lineTo(x, laneBot); ctx.stroke();
      }
    }
  }

  // Lane borders
  ctx.fillStyle = '#FFD600'; ctx.fillRect(0, laneTop - 3, CONFIG.WIDTH, 3);
  ctx.fillStyle = '#FFD600'; ctx.fillRect(0, laneBot, CONFIG.WIDTH, 3);

  // ─── Drum face (judgment area) ───
  const dx = CONFIG.DRUM_X, dr = CONFIG.DRUM_R;

  // Drum background panel
  ctx.fillStyle = '#263238';
  ctx.fillRect(0, laneTop - 3, dx + dr + 15, h + 6);

  // Outer ring
  ctx.beginPath(); ctx.arc(dx, y, dr + 8, 0, Math.PI * 2);
  ctx.fillStyle = '#5D4037'; ctx.fill();
  ctx.strokeStyle = '#8D6E63'; ctx.lineWidth = 3; ctx.stroke();

  // Drum face
  const drumFlash = G.dh.don > 0 || G.dh.ka > 0;
  ctx.beginPath(); ctx.arc(dx, y, dr, 0, Math.PI * 2);
  ctx.fillStyle = drumFlash ? '#FFF8E1' : '#FFECB3'; ctx.fill();
  ctx.strokeStyle = '#A1887F'; ctx.lineWidth = 2; ctx.stroke();

  // Inner ring
  ctx.beginPath(); ctx.arc(dx, y, dr * 0.65, 0, Math.PI * 2);
  ctx.strokeStyle = drumFlash ? '#FF6D00' : '#BCAAA4'; ctx.lineWidth = 2; ctx.stroke();

  // Center dot
  ctx.beginPath(); ctx.arc(dx, y, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#795548'; ctx.fill();

  // Hit flash overlay
  if (drumFlash) {
    ctx.beginPath(); ctx.arc(dx, y, dr, 0, Math.PI * 2);
    const fl = ctx.createRadialGradient(dx, y, 0, dx, y, dr);
    fl.addColorStop(0, G.dh.don > 0 ? 'rgba(255,100,0,0.4)' : 'rgba(0,150,255,0.4)');
    fl.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = fl; ctx.fill();
  }

  // GO-GO TIME label
  if (G.gogo) {
    ctx.fillStyle = `rgba(255,200,0,${(0.7+Math.sin(performance.now()/150)*0.3).toFixed(2)})`;
    ctx.font = 'bold 18px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('\u2605 GO-GO TIME! \u2605', CONFIG.WIDTH/2, laneTop-15);
  }
}

// ─── Notes ───────────────────────────────────────
function drawNotes() {
  if (!G.song) return;
  const px = G.song.speed / 1000 * G.speedMod, y = CONFIG.LANE_Y;

  for (const n of G.notes) {
    // Roll
    if (n.type === NT.ROLL) {
      if (n.done) continue;
      const x1 = CONFIG.DRUM_X + (n.time - G.elapsed) * px;
      const x2 = CONFIG.DRUM_X + (n.end - G.elapsed) * px;
      if (x2 < CONFIG.DRUM_X - 30 || x1 > CONFIG.WIDTH + 50) continue;
      const left = Math.max(x1, CONFIG.DRUM_X + CONFIG.DRUM_R + 5);
      const r = CONFIG.NOTE_R;

      // Body
      ctx.fillStyle = '#FFC107';
      ctx.beginPath();
      ctx.roundRect(left, y - r, x2 - left, r * 2, r);
      ctx.fill();

      // Stripes
      ctx.save();
      ctx.beginPath(); ctx.roundRect(left, y - r, x2 - left, r * 2, r); ctx.clip();
      ctx.fillStyle = 'rgba(255,240,100,0.3)';
      const sw = 18, off = (G.elapsed * 0.2) % (sw * 2);
      for (let sx = left - sw * 2 - off; sx < x2 + sw; sx += sw * 2) ctx.fillRect(sx, y - r, sw, r * 2);
      ctx.restore();

      // Border
      ctx.strokeStyle = '#FFF'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.roundRect(left, y - r, x2 - left, r * 2, r); ctx.stroke();

      // Start cap
      ctx.beginPath(); ctx.arc(x1, y, r + 3, 0, Math.PI * 2);
      ctx.fillStyle = '#FF8F00'; ctx.fill(); ctx.strokeStyle = '#FFF'; ctx.lineWidth = 2.5; ctx.stroke();

      // Hit count
      if (n.hits > 0) {
        ctx.fillStyle = '#FFF'; ctx.font = 'bold 15px sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(n.hits, Math.max(x1, CONFIG.DRUM_X + CONFIG.DRUM_R + 15), y);
      }
      ctx.fillStyle = '#FFF'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(T('연타!'), (left + Math.min(x2, CONFIG.WIDTH)) / 2, y - r - 10);
      continue;
    }

    // Balloon note
    if (n.type === NT.BALLOON) {
      if (n.done) continue;
      const x = Math.max(CONFIG.DRUM_X, CONFIG.DRUM_X + (n.time - G.elapsed) * px);
      if (x > CONFIG.WIDTH + 60) continue;
      const prog = n.hits / n.reqHits, br = 28 + prog * 12;
      ctx.strokeStyle = '#999'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, y + br); ctx.lineTo(x, y + br + 15); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(x, y, br * 0.85, br, 0, 0, Math.PI * 2);
      const bg = ctx.createRadialGradient(x - br*0.2, y - br*0.3, br*0.1, x, y, br);
      bg.addColorStop(0, '#FF6666'); bg.addColorStop(0.7, '#E53935'); bg.addColorStop(1, '#B71C1C');
      ctx.fillStyle = bg; ctx.fill(); ctx.strokeStyle = '#FFF'; ctx.lineWidth = 2; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(x - br*0.25, y - br*0.3, br*0.15, br*0.25, -0.3, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fill();
      ctx.fillStyle = '#FFF'; ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(n.reqHits - n.hits, x, y);
      continue;
    }

    // Kusudama note
    if (n.type === NT.KUSUDAMA) {
      if (n.done) continue;
      const x = Math.max(CONFIG.DRUM_X, CONFIG.DRUM_X + (n.time - G.elapsed) * px);
      if (x > CONFIG.WIDTH + 60) continue;
      const prog = n.hits / n.reqHits, kr = 32;
      ctx.beginPath(); ctx.arc(x, y, kr, 0, Math.PI * 2);
      const kg = ctx.createRadialGradient(x - 8, y - 10, 4, x, y, kr);
      kg.addColorStop(0, '#FFD600'); kg.addColorStop(0.6, '#FF9800'); kg.addColorStop(1, '#E65100');
      ctx.fillStyle = kg; ctx.fill(); ctx.strokeStyle = '#FFF'; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.strokeStyle = '#B71C1C'; ctx.lineWidth = 1.5;
      for (let a = 0; a < 4; a++) {
        const ang = a * Math.PI / 4;
        ctx.beginPath(); ctx.moveTo(x + Math.cos(ang)*8, y + Math.sin(ang)*8);
        ctx.lineTo(x + Math.cos(ang)*kr*0.8, y + Math.sin(ang)*kr*0.8); ctx.stroke();
      }
      if (prog > 0.3) { ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x-5, y-kr*0.3); ctx.lineTo(x-12, y+kr*0.4); ctx.stroke(); }
      if (prog > 0.6) { ctx.beginPath(); ctx.moveTo(x+8, y-kr*0.2); ctx.lineTo(x+15, y+kr*0.5); ctx.stroke(); }
      ctx.fillStyle = '#FFF'; ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(n.reqHits - n.hits, x, y);
      continue;
    }

    // Imo (sweet potato chain) note
    if (n.type === NT.IMO) {
      if (n.done) continue;
      const x1 = Math.max(CONFIG.DRUM_X, CONFIG.DRUM_X + (n.time - G.elapsed) * px);
      const x2 = Math.max(CONFIG.DRUM_X + 20, CONFIG.DRUM_X + (n.end - G.elapsed) * px);
      if (x1 > CONFIG.WIDTH + 50) continue;
      const left = Math.max(x1, CONFIG.DRUM_X + CONFIG.DRUM_R + 5);
      const r = CONFIG.NOTE_R;
      ctx.fillStyle = '#8D6E63';
      ctx.beginPath(); ctx.roundRect(left, y - r, x2 - left, r * 2, r); ctx.fill();
      const segW = (x2 - left) / Math.max(n.reqHits, 1);
      for (let s = 0; s < n.reqHits && s < 20; s++) {
        const sx = left + s * segW + segW / 2;
        if (sx < CONFIG.DRUM_X || sx > CONFIG.WIDTH) continue;
        ctx.beginPath(); ctx.arc(sx, y, 8, 0, Math.PI * 2);
        ctx.fillStyle = s < n.hits ? 'rgba(255,255,255,0.3)' : (s % 2 === 0 ? '#E53935' : '#1E88E5');
        ctx.fill();
      }
      ctx.strokeStyle = '#FFF'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(left, y - r, x2 - left, r * 2, r); ctx.stroke();
      ctx.beginPath(); ctx.arc(x1, y, r + 3, 0, Math.PI * 2);
      ctx.fillStyle = '#6D4C41'; ctx.fill(); ctx.strokeStyle = '#FFF'; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = n.nextDon ? '#E53935' : '#1E88E5'; ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center'; ctx.fillText(n.nextDon ? T('쿵') : T('딱'), x1, y - r - 10);
      ctx.fillStyle = '#FFF'; ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(`${n.hits}/${n.reqHits}`, Math.max(x1, CONFIG.DRUM_X + CONFIG.DRUM_R + 15), y);
      continue;
    }

    if (n.hit || n.miss) continue;
    const x = CONFIG.DRUM_X + (n.time - G.elapsed) * px;
    if (x < CONFIG.DRUM_X - 40 || x > CONFIG.WIDTH + 40) continue;

    const big = n.type === NT.BIG_DON || n.type === NT.BIG_KA;
    const don = n.type === NT.DON || n.type === NT.BIG_DON;
    const r = big ? CONFIG.BIG_NOTE_R : CONFIG.NOTE_R;

    // White border circle
    ctx.beginPath(); ctx.arc(x, y, r + 3, 0, Math.PI * 2);
    ctx.fillStyle = '#FFF'; ctx.fill();

    // Colored fill
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = don ? '#E53935' : '#1E88E5'; ctx.fill();
  }
}

// ─── Character ───────────────────────────────────
function drawChar(cx, cy, sz, state) {
  ctx.save();
  const t = performance.now();
  const bob = Math.sin(t / 300) * 3;
  const jy = (state === 'happy' || state === 'excited' || state === 'roll') ? -Math.abs(Math.sin(t / 80)) * (G.chrJ || 6) : 0;
  ctx.translate(cx, cy + bob + jy);
  const s = sz / 40; ctx.scale(s, s);

  // Shadow
  ctx.beginPath(); ctx.ellipse(0, 42, 28, 7, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.15)'; ctx.fill();

  // Body
  ctx.fillStyle = '#8D6E63'; ctx.fillRect(-26, -3, 52, 38);
  ctx.beginPath(); ctx.ellipse(0, 35, 26, 9, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#795548'; ctx.fill();

  // Face
  ctx.beginPath(); ctx.ellipse(0, -3, 26, 26, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#FFECB3'; ctx.fill(); ctx.strokeStyle = '#A1887F'; ctx.lineWidth = 2.5; ctx.stroke();
  ctx.beginPath(); ctx.ellipse(0, -3, 20, 20, 0, 0, Math.PI * 2);
  ctx.strokeStyle = '#D7CCC8'; ctx.lineWidth = 1; ctx.stroke();

  // Blush
  ctx.fillStyle = 'rgba(255,130,130,0.45)';
  ctx.beginPath(); ctx.ellipse(-15, 5, 5, 3.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(15, 5, 5, 3.5, 0, 0, Math.PI * 2); ctx.fill();

  // Eyes + mouth
  if (state === 'excited') {
    drawStar(-8, -5, 5, '#FF6D00'); drawStar(8, -5, 5, '#FF6D00');
    ctx.beginPath(); ctx.ellipse(0, 8, 9, 7, 0, 0, Math.PI * 2); ctx.fillStyle = '#D32F2F'; ctx.fill();
  } else if (state === 'happy' || state === 'roll') {
    ctx.strokeStyle = '#4E342E'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(-8, -5, 5, Math.PI + 0.3, -0.3); ctx.stroke();
    ctx.beginPath(); ctx.arc(8, -5, 5, Math.PI + 0.3, -0.3); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 5, 7, 0.2, Math.PI - 0.2); ctx.strokeStyle = '#4E342E'; ctx.lineWidth = 2; ctx.stroke();
  } else if (state === 'sad') {
    ctx.fillStyle = '#4E342E';
    ctx.beginPath(); ctx.ellipse(-8, -5, 3, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(8, -5, 3, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(100,180,255,0.6)';
    const ty = (t / 200) % 12;
    ctx.beginPath(); ctx.ellipse(-12, 0 + ty, 2, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(12, 0 + ty * 0.7, 2, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, 10, 5, Math.PI + 0.3, -0.3); ctx.strokeStyle = '#4E342E'; ctx.lineWidth = 2; ctx.stroke();
  } else {
    ctx.fillStyle = '#4E342E';
    ctx.beginPath(); ctx.ellipse(-8, -5, 3, 3.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(8, -5, 3, 3.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#FFF';
    ctx.beginPath(); ctx.ellipse(-6, -7, 1.5, 1.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(10, -7, 1.5, 1.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, 5, 5, 0.2, Math.PI - 0.2); ctx.strokeStyle = '#4E342E'; ctx.lineWidth = 2; ctx.stroke();
  }

  // Bachi (sticks)
  const sa = state === 'roll' ? Math.sin(t / 50) * 0.5 : state === 'happy' || state === 'excited' ? Math.sin(t / 120) * 0.3 : Math.sin(t / 500) * 0.1;
  ctx.strokeStyle = '#BCAAA4'; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
  ctx.save(); ctx.translate(-23, 10); ctx.rotate(-0.5 + sa);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-16, -18); ctx.stroke();
  ctx.beginPath(); ctx.arc(-16, -18, 3, 0, Math.PI * 2); ctx.fillStyle = '#EFEBE9'; ctx.fill(); ctx.restore();
  ctx.save(); ctx.translate(23, 10); ctx.rotate(0.5 - sa);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(16, -18); ctx.stroke();
  ctx.beginPath(); ctx.arc(16, -18, 3, 0, Math.PI * 2); ctx.fillStyle = '#EFEBE9'; ctx.fill(); ctx.restore();

  // Headband
  ctx.strokeStyle = '#FF1744'; ctx.lineWidth = 3.5;
  ctx.beginPath(); ctx.arc(0, -3, 24, Math.PI + 0.6, -0.6); ctx.stroke();
  ctx.fillStyle = '#FF1744'; ctx.beginPath();
  ctx.moveTo(-26, -13); ctx.lineTo(-33, -23); ctx.lineTo(-26, -20); ctx.lineTo(-30, -28); ctx.lineTo(-23, -18);
  ctx.closePath(); ctx.fill();
  ctx.restore();
}
function drawStar(cx, cy, r, c) {
  ctx.fillStyle = c; ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + i * Math.PI * 2 / 5, ia = a + Math.PI / 5;
    if (i === 0) ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    else ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    ctx.lineTo(cx + Math.cos(ia) * r * 0.4, cy + Math.sin(ia) * r * 0.4);
  }
  ctx.closePath(); ctx.fill();
}

// ─── Combo ───────────────────────────────────────
function drawCombo() {
  if (G.combo < 2) return;
  const x = CONFIG.DRUM_X, y = CONFIG.LANE_Y + CONFIG.LANE_H / 2 + 35;
  const nearMile = (G.combo >= 45 && G.combo < 50) || (G.combo >= 95 && G.combo < 100);
  const pulse = nearMile ? 1 + Math.sin(performance.now() / 80) * 0.08 : 1 + Math.sin(performance.now() / 100) * 0.04;
  ctx.save(); ctx.translate(x, y); ctx.scale(pulse, pulse);
  if (nearMile) { ctx.shadowColor = '#FFD600'; ctx.shadowBlur = 15; }
  ctx.font = `bold ${G.combo >= 50 ? 34 : 26}px sans-serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillText(G.combo, 2, 2);
  ctx.fillStyle = G.combo >= 100 ? '#FF1744' : G.combo >= 50 ? '#FF6D00' : G.combo >= 20 ? '#FFD600' : '#FFF';
  ctx.fillText(G.combo, 0, 0);
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '10px sans-serif';
  ctx.fillText(T('콤보'), 0, 18);
  ctx.restore();
}

// ─── Effects ─────────────────────────────────────
function drawFx() {
  for (let i = G.fx.length - 1; i >= 0; i--) {
    const e = G.fx[i]; e.life--;
    if (e.life <= 0) { G.fx.splice(i, 1); continue; }
    const a = e.life / e.ml;
    if (e.type === 'p') {
      e.x += e.vx; e.y += e.vy; e.vy += 0.1;
      ctx.beginPath(); ctx.arc(e.x, e.y, e.r * a, 0, Math.PI * 2);
      ctx.fillStyle = e.color + Math.floor(a * 255).toString(16).padStart(2, '0');
      ctx.fill();
    } else {
      ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = e.color;
      ctx.font = `bold ${30 + (1 - a) * 12}px sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillText(e.text, e.x + 2, e.y - (1 - a) * 30 + 2);
      ctx.fillStyle = e.color; ctx.fillText(e.text, e.x, e.y - (1 - a) * 30);
      ctx.restore();
    }
  }
}

// ─── Touch Drum ──────────────────────────────────
function drawTDrum() {
  const cx = CONFIG.TDRUM_CX, y = CONFIG.TDRUM_Y;
  const or = CONFIG.TDRUM_OR, ir = CONFIG.TDRUM_IR, sr = CONFIG.TDRUM_SIDE_R;

  // ── Center drum (Don inner / Ka outer) ──
  ctx.beginPath(); ctx.arc(cx, y + 4, or + 4, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fill();
  ctx.beginPath(); ctx.arc(cx, y, or, 0, Math.PI * 2);
  ctx.fillStyle = G.dh.ka > 0 ? '#64B5F6' : '#1565C0'; ctx.fill();
  ctx.strokeStyle = '#1E88E5'; ctx.lineWidth = 3; ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, y, ir, 0, Math.PI * 2);
  ctx.fillStyle = G.dh.don > 0 ? '#EF9A9A' : '#C62828'; ctx.fill();
  ctx.strokeStyle = '#E53935'; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(T('쿵'), cx, y);
  ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '11px sans-serif';
  ctx.fillText(T('딱'), cx, y - ir - 12);
  ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.font = '10px monospace';
  ctx.fillText('F ' + T('쿵') + ' / D ' + T('딱'), cx, y - or - 10);

  // ── Left drum (Ka only) ──
  const lx = CONFIG.TDRUM_LX;
  ctx.beginPath(); ctx.arc(lx, y + 3, sr + 3, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.15)'; ctx.fill();
  ctx.beginPath(); ctx.arc(lx, y, sr, 0, Math.PI * 2);
  ctx.fillStyle = G.dh.ka > 0 ? '#64B5F6' : '#1565C0'; ctx.fill();
  ctx.strokeStyle = '#1E88E5'; ctx.lineWidth = 3; ctx.stroke();
  ctx.fillStyle = '#FFF'; ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(T('딱'), lx, y);
  ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '11px sans-serif';
  ctx.fillText('K', lx, y + sr + 15);

  // ── Right drum (Don only) ──
  const rx = CONFIG.TDRUM_RX;
  ctx.beginPath(); ctx.arc(rx, y + 3, sr + 3, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.15)'; ctx.fill();
  ctx.beginPath(); ctx.arc(rx, y, sr, 0, Math.PI * 2);
  ctx.fillStyle = G.dh.don > 0 ? '#EF9A9A' : '#C62828'; ctx.fill();
  ctx.strokeStyle = '#E53935'; ctx.lineWidth = 3; ctx.stroke();
  ctx.fillStyle = '#FFF'; ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(T('쿵'), rx, y);
  ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '11px sans-serif';
  ctx.fillText('J', rx, y + sr + 15);

  // MIC badge
  if (G.micOn) {
    ctx.fillStyle = 'rgba(76,175,80,0.7)'; ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center'; ctx.fillText('MIC', cx, y + or + 15);
  }
}

// ─── Progress Bar ────────────────────────────────
function drawProgress() {
  if (!G.song) return;
  const prog = G.elapsed / (G.song.dur * 1000);
  const bx = CONFIG.WIDTH - 310, by = CONFIG.HEIGHT - 18, bw = 290, bh = 8;
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 4); ctx.fill();
  const pg = ctx.createLinearGradient(bx, 0, bx + bw, 0);
  pg.addColorStop(0, '#FF6D00'); pg.addColorStop(1, '#FFD600');
  ctx.fillStyle = pg; ctx.beginPath(); ctx.roundRect(bx, by, bw * Math.min(prog, 1), bh, 4); ctx.fill();
}

// ═══ Screens ═════════════════════════════════════

// ─── Title ───────────────────────────────────────
function drawTitle() {
  drawBG();
  G.tb += 0.02;
  const p = 1 + Math.sin(G.tb * 2) * 0.04;
  const t = performance.now();

  // Large drum background
  ctx.beginPath(); ctx.arc(CONFIG.WIDTH / 2, 235, 110, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.15)'; ctx.fill();

  // Character
  const cs = Math.sin(t / 800) > 0.3 ? 'happy' : Math.sin(t / 800) > -0.3 ? 'idle' : 'excited';
  drawChar(CONFIG.WIDTH / 2, 210, 70, cs);

  // Title
  ctx.save(); ctx.translate(CONFIG.WIDTH / 2, 90); ctx.scale(p, p);
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.font = 'bold 54px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(T('태고의 달인'), 3, 3);
  ctx.fillStyle = '#FFF'; ctx.fillText(T('태고의 달인'), 0, 0);
  ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = '16px sans-serif';
  ctx.fillText('Web Taiko', 0, 35);
  ctx.restore();

  // Instructions panel
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath(); ctx.roundRect(CONFIG.WIDTH / 2 - 250, 340, 500, 95, 12); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.font = '14px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(T('쿵 (중앙): F / J 키  |  딱 (가장자리): D / K 키'), CONFIG.WIDTH / 2, 370);
  ctx.fillText(T('마우스/터치: 북 중앙 = 쿵  |  가장자리 = 딱'), CONFIG.WIDTH / 2, 395);
  ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '12px sans-serif';
  ctx.fillText(T('태고의 달인 웹 버전'), CONFIG.WIDTH / 2, 420);

  // Start
  if (Math.sin(t / 400) > 0) {
    ctx.fillStyle = '#FFD600'; ctx.font = 'bold 22px sans-serif';
    ctx.fillText(T('SPACE / ENTER / 클릭으로 시작!'), CONFIG.WIDTH / 2, 500);
  }
}

// ─── Select ──────────────────────────────────────
function drawSelect() {
  drawBG();

  const SL = SEL_LAYOUT;
  const viewTop = 68, viewBot = CONFIG.HEIGHT - 52, viewH = viewBot - viewTop;
  const diffColors = { '쉬움': '#66BB6A', '보통': '#FFA726', '어려움': '#EC407A', '귀신': '#AB47BC' };

  // Auto-scroll to keep selected song centered
  const target = Math.max(0, Math.min(SL.totalH - viewH, SL.pos[G.sel] - viewH / 2));
  G.selScrl += (target - G.selScrl) * 0.18;

  // Clip to scrollable area
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, viewTop, CONFIG.WIDTH, viewH);
  ctx.clip();

  // Difficulty headers
  for (const h of SL.hdrs) {
    const hy = viewTop + h.y - G.selScrl;
    if (hy < viewTop - 30 || hy > viewBot + 10) continue;
    ctx.fillStyle = diffColors[h.diff] || '#FFF'; ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.fillText(`── ${T(h.diff)} ──`, 130, hy + 5);
  }

  // Song cards
  for (let i = 0; i < SONGS.length; i++) {
    const sg = SONGS[i], y = viewTop + SL.pos[i] - G.selScrl, sel = i === G.sel;
    if (y < viewTop - 45 || y > viewBot + 45) continue;

    const cx = 120, cw = 720, ch = 58;

    // Card
    ctx.fillStyle = sel ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.25)';
    ctx.beginPath(); ctx.roundRect(cx, y - ch / 2, cw, ch, 10); ctx.fill();
    if (sel) {
      ctx.strokeStyle = sg.color; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.roundRect(cx, y - ch / 2, cw, ch, 10); ctx.stroke();
      ctx.shadowColor = sg.color; ctx.shadowBlur = 15;
      ctx.strokeStyle = sg.color; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.roundRect(cx, y - ch / 2, cw, ch, 10); ctx.stroke();
      ctx.shadowBlur = 0;

      const ax = 100 + Math.sin(performance.now() / 200) * 5;
      ctx.fillStyle = sg.color; ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; ctx.fillText('▶', ax, y);
    }

    // Color accent
    ctx.fillStyle = sg.color;
    ctx.beginPath(); ctx.roundRect(cx, y - ch / 2, 5, ch, [10, 0, 0, 10]); ctx.fill();

    // Title
    ctx.fillStyle = sel ? '#FFF' : 'rgba(255,255,255,0.6)';
    ctx.font = `bold ${sel ? 20 : 18}px sans-serif`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(T(sg.title), cx + 22, y - 8);

    // Sub
    ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '11px sans-serif';
    ctx.fillText(`${sg.sub}  |  ${sg.bpm} BPM  |  ${sg.dur}s`, cx + 22, y + 14);

    // Stars
    ctx.fillStyle = sg.color; ctx.font = '11px sans-serif'; ctx.textAlign = 'right';
    let stars = '';
    for (let j = 0; j < 10; j++) stars += j < sg.stars ? '\u2605' : '\u2606';
    ctx.fillText(stars, cx + cw - 18, y - 6);

    // High score & badges
    const hs = getScore(sg.title, DIFFS[G.selDiff]);
    if (hs) {
      ctx.font = '10px sans-serif'; ctx.textAlign = 'right';
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.fillText(`HI: ${Math.floor(hs.score)}`, cx + cw - 18, y + 10);
      if (hs.fc) {
        ctx.fillStyle = '#FFD600'; ctx.font = 'bold 9px sans-serif';
        ctx.fillText('FC', cx + cw - 18, y + 22);
      } else if (hs.cleared) {
        ctx.fillStyle = '#66BB6A'; ctx.font = 'bold 9px sans-serif';
        ctx.fillText('CLR', cx + cw - 18, y + 22);
      }
    }
  }

  ctx.restore();

  // Scroll indicator
  if (SL.totalH > viewH) {
    const sbh = Math.max(30, viewH * viewH / SL.totalH);
    const maxScrl = SL.totalH - viewH;
    const sby = viewTop + (G.selScrl / maxScrl) * (viewH - sbh);
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath(); ctx.roundRect(CONFIG.WIDTH - 12, sby, 6, sbh, 3); ctx.fill();
  }

  // Fixed header
  ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0, 0, CONFIG.WIDTH, 66);
  ctx.fillStyle = '#8D6E63'; ctx.fillRect(0, 66, CONFIG.WIDTH, 2);
  ctx.fillStyle = '#FFD600'; ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText(T('곡을 선택하세요'), 15, 20);

  // Difficulty tabs
  for (let d = 0; d < 4; d++) {
    const tx = 300 + d * 95;
    ctx.fillStyle = d === G.selDiff ? DIFF_COLORS[d] : 'rgba(255,255,255,0.15)';
    ctx.beginPath(); ctx.roundRect(tx, 8, 85, 24, 6); ctx.fill();
    ctx.fillStyle = d === G.selDiff ? '#FFF' : 'rgba(255,255,255,0.5)';
    ctx.font = `${d === G.selDiff ? 'bold ' : ''}11px sans-serif`; ctx.textAlign = 'center';
    ctx.fillText(T(DIFFS[d]), tx + 42, 20);
  }

  // Speed & 2P badges
  ctx.textAlign = 'right'; ctx.font = 'bold 11px sans-serif';
  let bx = CONFIG.WIDTH - 70;
  if (G.speedMod !== 1) {
    ctx.fillStyle = 'rgba(0,200,255,0.7)'; ctx.fillText(`x${G.speedMod}`, bx, 20); bx -= 40;
  }
  if (G.twoP) {
    ctx.fillStyle = 'rgba(255,100,100,0.8)'; ctx.fillText('2P', bx, 20); bx -= 30;
  }
  if (G.micOn) {
    ctx.fillStyle = 'rgba(100,255,100,0.8)'; ctx.fillText('MIC', bx, 20); bx -= 40;
  }
  ctx.fillStyle = 'rgba(255,220,100,0.8)'; ctx.fillText(G.lang === 'ko' ? 'KO' : 'JA', bx, 20); bx -= 30;

  ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('\u2190\u2192 \uB09C\uC774\uB3C4  |  S: \uBC30\uC18D  |  2: 2P  |  M: \uB9C8\uC774\uD06C  |  O: \uC635\uC158  |  L: \uC5B8\uC5B4', CONFIG.WIDTH / 2, 52);
  drawChar(CONFIG.WIDTH - 40, 25, 24, 'happy');

  // Fixed free play button at bottom
  ctx.fillStyle = 'rgba(30,10,0,0.75)'; ctx.fillRect(0, CONFIG.HEIGHT - 50, CONFIG.WIDTH, 50);
  const fbx = CONFIG.WIDTH / 2, fby = CONFIG.HEIGHT - 25;
  ctx.fillStyle = 'rgba(255,170,0,0.2)';
  ctx.beginPath(); ctx.roundRect(fbx - 110, fby - 16, 220, 32, 16); ctx.fill();
  ctx.strokeStyle = 'rgba(255,170,0,0.5)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.roundRect(fbx - 110, fby - 16, 220, 32, 16); ctx.stroke();
  ctx.fillStyle = '#FFD600'; ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('🥁 ' + T('자유 모드') + ' / Free Play (T)', fbx, fby);
}

// ─── Result ──────────────────────────────────────
function drawResult() {
  drawBG();
  const total = G.perf + G.good + G.miss;
  const acc = total > 0 ? ((G.perf + G.good * 0.5) / total * 100) : 0;
  const cleared = G.soul >= 70;
  const fc = G.miss === 0 && total > 0;

  // Dark overlay
  ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

  // Banner
  if (fc) {
    ctx.fillStyle = '#FFD600'; ctx.font = 'bold 38px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('🎊 ' + T('풀콤보!') + '! 🎊', CONFIG.WIDTH / 2, 50);
  } else if (cleared) {
    ctx.fillStyle = '#FF6D00'; ctx.font = 'bold 34px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(T('클리어!'), CONFIG.WIDTH / 2, 50);
  } else {
    ctx.fillStyle = '#999'; ctx.font = 'bold 34px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(T('결과 발표'), CONFIG.WIDTH / 2, 50);
  }

  // Song
  if (G.song) {
    ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = '15px sans-serif';
    ctx.fillText(`${T(G.song.title)} (${T(G.song.diff)})`, CONFIG.WIDTH / 2, 80);
  }

  // Score
  ctx.fillStyle = '#FFF'; ctx.font = 'bold 52px sans-serif';
  ctx.fillText(String(Math.floor(G.score)).padStart(7, '0'), CONFIG.WIDTH / 2, 130);

  // Rank + Character
  let rank = 'C', rc = '#999';
  if (acc >= 95) { rank = 'S'; rc = '#FFD600'; }
  else if (acc >= 85) { rank = 'A'; rc = '#FF6D00'; }
  else if (acc >= 70) { rank = 'B'; rc = '#42A5F5'; }
  ctx.fillStyle = rc; ctx.font = 'bold 80px sans-serif';
  ctx.fillText(rank, CONFIG.WIDTH / 2 - 60, 215);

  const rcs = rank === 'S' ? 'excited' : rank === 'A' ? 'happy' : rank === 'B' ? 'idle' : 'sad';
  drawChar(CONFIG.WIDTH / 2 + 60, 195, 50, rcs);

  // Soul gauge result
  const sgx = CONFIG.WIDTH / 2 - 120, sgy = 265, sgw = 240, sgh = 18;
  ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.beginPath(); ctx.roundRect(sgx, sgy, sgw, sgh, 4); ctx.fill();
  const sg = ctx.createLinearGradient(sgx, 0, sgx + sgw * G.soul / 100, 0);
  sg.addColorStop(0, '#42A5F5'); sg.addColorStop(1, G.soul >= 70 ? '#FF1744' : '#FFC107');
  ctx.fillStyle = sg; ctx.beginPath(); ctx.roundRect(sgx, sgy, sgw * G.soul / 100, sgh, 4); ctx.fill();
  ctx.fillStyle = '#FFF'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(`${T('혼')} ${Math.floor(G.soul)}%`, CONFIG.WIDTH / 2, sgy + sgh / 2 + 1);

  // Stats
  const stats = [
    [T('최고'), G.perf, '#FF6D00'], [T('좋아'), G.good, '#FFD600'], [T('빗나감'), G.miss, '#999'],
    [T('최대 콤보'), G.maxCombo, '#FF1744'], [T('연타'), G.rollHits, '#FFC107'],
    [T('정확도'), acc.toFixed(1) + '%', '#42A5F5'],
  ];
  let sy = 310;
  for (const [l, v, c] of stats) {
    ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '15px sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(l, CONFIG.WIDTH / 2 - 20, sy);
    ctx.fillStyle = c; ctx.font = 'bold 18px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText(v, CONFIG.WIDTH / 2 + 20, sy);
    sy += 30;
  }

  // 2P comparison
  if (G.twoP) {
    const p2y = 310;
    ctx.fillStyle = 'rgba(100,150,255,0.2)';
    ctx.beginPath(); ctx.roundRect(CONFIG.WIDTH/2 + 160, 100, 260, 220, 10); ctx.fill();
    ctx.fillStyle = '#64B5F6'; ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('P2', CONFIG.WIDTH/2 + 290, 120);
    ctx.fillStyle = '#FFF'; ctx.font = 'bold 28px sans-serif';
    ctx.fillText(String(Math.floor(G.p2.score)).padStart(7,'0'), CONFIG.WIDTH/2 + 290, 150);
    const p2stats = [
      ['\u826F', G.p2.perf, '#FF6D00'], ['\u53EF', G.p2.good, '#FFD600'], ['\u4E0D\u53EF', G.p2.miss, '#999'],
      [T('Max콤보'), G.p2.maxCombo, '#FF1744'],
    ];
    let p2sy = 180;
    for (const [l,v,c] of p2stats) {
      ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '12px sans-serif'; ctx.textAlign = 'right';
      ctx.fillText(l, CONFIG.WIDTH/2 + 270, p2sy);
      ctx.fillStyle = c; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(v, CONFIG.WIDTH/2 + 280, p2sy);
      p2sy += 24;
    }
    // Winner
    const winner = G.score > G.p2.score ? 'P1 WIN!' : G.p2.score > G.score ? 'P2 WIN!' : 'DRAW!';
    ctx.fillStyle = '#FFD600'; ctx.font = 'bold 22px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(winner, CONFIG.WIDTH/2, CONFIG.HEIGHT - 50);
  }

  if (Math.sin(performance.now() / 400) > 0) {
    ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '14px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('SPACE / ENTER / \uD074\uB9AD \u2192 \uACE1 \uC120\uD0DD', CONFIG.WIDTH / 2, CONFIG.HEIGHT - 20);
  }
}

// ─── Free Play ───────────────────────────────────
function drawFree() {
  drawBG();

  const y = CONFIG.LANE_Y, h = CONFIG.LANE_H;
  // Lane
  ctx.fillStyle = '#37474F'; ctx.fillRect(0, y - h / 2, CONFIG.WIDTH, h);
  ctx.fillStyle = '#FFD600'; ctx.fillRect(0, y - h / 2 - 3, CONFIG.WIDTH, 3);
  ctx.fillStyle = '#FFD600'; ctx.fillRect(0, y + h / 2, CONFIG.WIDTH, 3);

  // Drum face
  const dx = CONFIG.DRUM_X, dr = CONFIG.DRUM_R;
  ctx.fillStyle = '#263238'; ctx.fillRect(0, y - h / 2 - 3, dx + dr + 15, h + 6);
  ctx.beginPath(); ctx.arc(dx, y, dr + 8, 0, Math.PI * 2);
  ctx.fillStyle = '#5D4037'; ctx.fill(); ctx.strokeStyle = '#8D6E63'; ctx.lineWidth = 3; ctx.stroke();
  const df = G.dh.don > 0 || G.dh.ka > 0;
  ctx.beginPath(); ctx.arc(dx, y, dr, 0, Math.PI * 2);
  ctx.fillStyle = df ? '#FFF8E1' : '#FFECB3'; ctx.fill();
  ctx.strokeStyle = '#A1887F'; ctx.lineWidth = 2; ctx.stroke();
  ctx.beginPath(); ctx.arc(dx, y, dr * 0.65, 0, Math.PI * 2);
  ctx.strokeStyle = df ? '#FF6D00' : '#BCAAA4'; ctx.lineWidth = 2; ctx.stroke();

  // Beat lines
  const el = performance.now() - G.ft0;
  if (G.song) {
    const beatMs = 60 / G.song.bpm * 1000;
    const first = Math.floor(el / beatMs) * beatMs;
    for (let t = first - beatMs * 5; t < el; t += beatMs) {
      const age = el - t, x = dx + (age / 1000) * 350 * G.speedMod;
      if (x > dx + dr && x < CONFIG.WIDTH) {
        ctx.strokeStyle = `rgba(255,255,255,${Math.max(0, 0.1 - age / 30000)})`;
        ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y - h / 2); ctx.lineTo(x, y + h / 2); ctx.stroke();
      }
    }
  }

  // Free notes
  for (let i = G.fn.length - 1; i >= 0; i--) {
    const fn = G.fn[i], age = el - fn.t, x = dx + (age / 1000) * 350 * G.speedMod;
    if (x > CONFIG.WIDTH + 60) { G.fn.splice(i, 1); continue; }
    const alpha = Math.max(0, 1 - age / 3000);
    if (alpha <= 0) { G.fn.splice(i, 1); continue; }
    const big = fn.type === NT.BIG_DON || fn.type === NT.BIG_KA;
    const don = fn.type === NT.DON || fn.type === NT.BIG_DON;
    const r = big ? CONFIG.BIG_NOTE_R : CONFIG.NOTE_R;
    ctx.save(); ctx.globalAlpha = alpha;
    ctx.beginPath(); ctx.arc(x, y, r + 3, 0, Math.PI * 2); ctx.fillStyle = '#FFF'; ctx.fill();
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = don ? '#E53935' : '#1E88E5'; ctx.fill();
    ctx.restore();
  }

  drawFx();
  drawChar(dx, y - 80, 36, G.chr);
  drawTDrum();

  // UI
  ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(0, 0, CONFIG.WIDTH, 55);
  ctx.fillStyle = '#8D6E63'; ctx.fillRect(0, 55, CONFIG.WIDTH, 3);
  ctx.fillStyle = '#FFD600'; ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(T('자유 모드'), 15, 20);
  ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '12px sans-serif';
  ctx.fillText('Free Play', 15, 42);

  if (G.song) {
    ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = '13px sans-serif'; ctx.textAlign = 'right';
    const prog = el / (G.song.dur * 1000);
    ctx.fillText(prog > 1 ? `${T(G.song.title)} - ${T('끝')}` : `${T(G.song.title)} - ${G.song.bpm} BPM`, CONFIG.WIDTH - 15, 20);
    // Mini progress
    const bx = CONFIG.WIDTH - 220, bw = 200, by = 38;
    ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.beginPath(); ctx.roundRect(bx, by, bw, 5, 3); ctx.fill();
    if (prog <= 1) {
      ctx.fillStyle = G.song.color; ctx.beginPath(); ctx.roundRect(bx, by, bw * prog, 5, 3); ctx.fill();
    }
  }

  ctx.fillStyle = '#FFF'; ctx.font = 'bold 20px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(`${G.fhc}`, CONFIG.WIDTH / 2, 28);
  ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '10px sans-serif';
  ctx.fillText('HITS', CONFIG.WIDTH / 2, 44);

  ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(T('자유롭게 북을 쳐보세요!  |  ESC: 돌아가기'), CONFIG.WIDTH / 2, CONFIG.HEIGHT - 12);

  // Mic processing in free mode
  processMic();

  if (G.dh.don > 0) G.dh.don--; if (G.dh.ka > 0) G.dh.ka--;
  if (G.chrT > 0) G.chrT--; else if (G.chr !== 'idle') { G.chr = 'idle'; G.chrJ = 0; }
}

// ─── Pause Overlay ──────────────────────────────
function drawPause() {
  ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
  ctx.fillStyle = '#FFF'; ctx.font = 'bold 36px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(T('일시정지'), CONFIG.WIDTH/2, 180);
  const opts = ['\u25B6 ' + T('계속하기'), '\u2716 ' + T('그만두기')];
  for (let i = 0; i < 2; i++) {
    const oy = 260 + i * 60;
    ctx.fillStyle = G.pauseSel === i ? 'rgba(255,200,0,0.25)' : 'rgba(255,255,255,0.08)';
    ctx.beginPath(); ctx.roundRect(CONFIG.WIDTH/2 - 160, oy - 22, 320, 44, 10); ctx.fill();
    if (G.pauseSel === i) {
      ctx.strokeStyle = '#FFD600'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(CONFIG.WIDTH/2 - 160, oy - 22, 320, 44, 10); ctx.stroke();
    }
    ctx.fillStyle = G.pauseSel === i ? '#FFD600' : 'rgba(255,255,255,0.7)';
    ctx.font = 'bold 20px sans-serif'; ctx.fillText(opts[i], CONFIG.WIDTH/2, oy);
  }
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.font = '12px sans-serif';
  ctx.fillText('\u2191\u2193 \uC120\uD0DD  |  ENTER \uD655\uC778  |  ESC \uACC4\uC18D', CONFIG.WIDTH/2, 410);
}

// ─── Countdown Overlay ──────────────────────────
function drawCountdown() {
  if (G.countdown < 0) return;
  const elapsed = (performance.now() - G.cdT) / 1000;
  const num = G.countdown;
  const frac = elapsed % 1;
  const scale = 1 + (1 - frac) * 0.5;
  const alpha = Math.max(0, 1 - frac * 1.2);
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
  ctx.translate(CONFIG.WIDTH/2, CONFIG.HEIGHT/2 - 30);
  ctx.scale(scale, scale); ctx.globalAlpha = alpha;
  ctx.fillStyle = '#FFD600'; ctx.font = 'bold 120px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(num > 0 ? num : T('쿵') + '!', 0, 0);
  ctx.restore();
}

// ─── Options Screen ─────────────────────────────
function drawOptions() {
  drawBG();
  ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
  ctx.fillStyle = '#FFD600'; ctx.font = 'bold 30px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(T('옵션'), CONFIG.WIDTH/2, 60);
  const items = [
    [T('음량'), `${Math.round(G.optVol*100)}%`],
    [T('타이밍 오프셋'), `${G.optOffset}ms`],
    [T('노트 속도'), `x${G.speedMod}`],
    [T('마이크 입력'), G.micOn ? 'ON' : 'OFF'],
    [T('마이크 민감도'), `${G.micThreshold}`],
  ];
  for (let i = 0; i < items.length; i++) {
    const iy = 130 + i * 65;
    ctx.fillStyle = G.optSel === i ? 'rgba(255,200,0,0.2)' : 'rgba(255,255,255,0.06)';
    ctx.beginPath(); ctx.roundRect(CONFIG.WIDTH/2 - 250, iy - 28, 500, 56, 10); ctx.fill();
    if (G.optSel === i) {
      ctx.strokeStyle = '#FFD600'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(CONFIG.WIDTH/2 - 250, iy - 28, 500, 56, 10); ctx.stroke();
    }
    ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = '16px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText(items[i][0], CONFIG.WIDTH/2 - 220, iy);
    ctx.fillStyle = G.optSel === i ? '#FFD600' : '#FFF'; ctx.font = 'bold 22px sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(items[i][1], CONFIG.WIDTH/2 + 220, iy);
    if (G.optSel === i) {
      ctx.fillStyle = '#FFD600'; ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'left'; ctx.fillText('\u25C0', CONFIG.WIDTH/2 + 100, iy);
      ctx.textAlign = 'right'; ctx.fillText('\u25B6', CONFIG.WIDTH/2 + 240, iy);
    }
  }
  // Volume bar
  const vx = CONFIG.WIDTH/2 - 100, vy = 130, vw = 200;
  ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.beginPath(); ctx.roundRect(vx, vy + 18, vw, 6, 3); ctx.fill();
  ctx.fillStyle = '#FFD600'; ctx.beginPath(); ctx.roundRect(vx, vy + 18, vw * G.optVol, 6, 3); ctx.fill();

  // Mic level meter
  if (G.micOn) {
    processMic();
    const my = 130 + 3 * 65, mw = 200, ml = Math.min(1, G.micLevel / 80);
    ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.beginPath(); ctx.roundRect(CONFIG.WIDTH/2 - 100, my + 18, mw, 6, 3); ctx.fill();
    ctx.fillStyle = ml > 0.6 ? '#FF4444' : ml > 0.3 ? '#FFD600' : '#66BB6A';
    ctx.beginPath(); ctx.roundRect(CONFIG.WIDTH/2 - 100, my + 18, mw * ml, 6, 3); ctx.fill();
  }

  ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('\u2191\u2193 \uC120\uD0DD  |  \u2190\u2192 \uC870\uC808  |  ESC \uB3CC\uC544\uAC00\uAE30', CONFIG.WIDTH/2, CONFIG.HEIGHT - 40);
}

// ─── Achievement Popup ──────────────────────────
function drawAchPopup() {
  if (G.achQueue.length === 0) return;
  const a = G.achQueue[0], age = performance.now() - a.t;
  if (age > 3000) { G.achQueue.shift(); return; }
  const slideIn = Math.min(1, age / 300);
  const fadeOut = age > 2500 ? 1 - (age - 2500) / 500 : 1;
  const bx = CONFIG.WIDTH/2 - 180, by = CONFIG.HEIGHT - 60 * slideIn;
  ctx.save(); ctx.globalAlpha = fadeOut;
  ctx.fillStyle = 'rgba(40,20,0,0.9)';
  ctx.beginPath(); ctx.roundRect(bx, by, 360, 50, 10); ctx.fill();
  ctx.strokeStyle = '#FFD600'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect(bx, by, 360, 50, 10); ctx.stroke();
  ctx.fillStyle = '#FFD600'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText('\u2605 ' + T(a.name), bx + 15, by + 18);
  ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = '12px sans-serif';
  ctx.fillText(T(a.desc), bx + 15, by + 36);
  ctx.restore();
}

// ─── Mic Level Meter ────────────────────────────
function drawMicMeter() {
  const mx = 12, my = CONFIG.HEIGHT - 100, mw = 10, mh = 80;
  const level = Math.min(1, G.micLevel / 80);
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.beginPath(); ctx.roundRect(mx, my, mw, mh, 3); ctx.fill();
  const fillH = mh * level;
  const mc = level > 0.6 ? '#FF4444' : level > 0.3 ? '#FFD600' : '#66BB6A';
  ctx.fillStyle = mc;
  ctx.beginPath(); ctx.roundRect(mx, my + mh - fillH, mw, fillH, 3); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '8px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillText('MIC', mx + mw/2, my + mh + 3);
}

// ─── Game Loop ───────────────────────────────────
function update() {
  if (G.st !== ST.PLAYING) return;
  if (G.paused) return;

  // Countdown
  if (G.countdown >= 0) {
    const cdElapsed = (performance.now() - G.cdT) / 1000;
    const newCd = 3 - Math.floor(cdElapsed);
    if (newCd !== G.countdown) G.countdown = newCd;
    if (G.countdown < 0) {
      G.t0 = performance.now(); G.elapsed = 0;
      playBGM(G.song);
    }
    return;
  }

  G.elapsed = performance.now() - G.t0;

  // Mic input
  processMic();

  // GO-GO tracking
  G.gogo = false;
  for (const [s, e] of G.gogoRanges) { if (G.elapsed >= s && G.elapsed <= e) { G.gogo = true; break; } }

  // Process notes (P1)
  function processNotes(notes, p) {
    for (const n of notes) {
      if (n.type === NT.ROLL) { if (!n.done && G.elapsed > n.end) n.done = true; }
      else if (n.type === NT.BALLOON) { if (!n.done && G.elapsed > n.time + 4000) n.done = true; }
      else if (n.type === NT.KUSUDAMA) { if (!n.done && G.elapsed > n.time + 5000) n.done = true; }
      else if (n.type === NT.IMO) { if (!n.done && G.elapsed > n.end) n.done = true; }
      else if (!n.hit && !n.miss && n.time < G.elapsed - CONFIG.BAD_WINDOW) {
        n.miss = true; p.miss++; p.combo = 0;
        p.soul = Math.max(0, p.soul - 3);
        p.chr = 'sad'; p.chrT = 30; p.chrJ = 0;
      }
    }
  }
  processNotes(G.notes, G);
  if (G.twoP) processNotes(G.p2notes, G.p2);

  // Drum flash decay
  if (G.dh.don > 0) G.dh.don--; if (G.dh.ka > 0) G.dh.ka--;
  if (G.chrT > 0) G.chrT--; else if (G.chr !== 'idle') { G.chr = 'idle'; G.chrJ = 0; }
  if (G.twoP) {
    if (G.p2.dh.don > 0) G.p2.dh.don--; if (G.p2.dh.ka > 0) G.p2.dh.ka--;
    if (G.p2.chrT > 0) G.p2.chrT--; else if (G.p2.chr !== 'idle') { G.p2.chr = 'idle'; G.p2.chrJ = 0; }
  }

  // End game
  if (G.song && G.elapsed >= G.song.dur * 1000 + 2000) {
    G.st = ST.RESULT; stopBGM();
    const total = G.perf + G.good + G.miss;
    const fc = G.miss === 0 && total > 0, cleared = G.soul >= 70;
    saveScore(G.song.title, DIFFS[G.selDiff], G.score, fc, cleared);
    incPlays(); checkAch();
  }
}

function render() {
  ctx.clearRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
  if (G.st === ST.TITLE) drawTitle();
  else if (G.st === ST.SELECT) drawSelect();
  else if (G.st === ST.OPTIONS) drawOptions();
  else if (G.st === ST.PLAYING) {
    drawBG(); drawLane(); drawNotes(); drawFx();
    drawChar(CONFIG.DRUM_X, CONFIG.LANE_Y - 80, 36, G.chr);
    drawCombo(); drawTDrum(); drawTopPanel(); drawSoulGauge(); drawProgress();
    if (G.micOn) drawMicMeter();
    if (G.countdown >= 0) drawCountdown();
    if (G.paused) drawPause();
  }
  else if (G.st === ST.RESULT) drawResult();
  else if (G.st === ST.FREE) drawFree();
  drawAchPopup();
}

canvas.width = CONFIG.WIDTH;
canvas.height = CONFIG.HEIGHT;

function resizeCanvas() {
  const ratio = CONFIG.WIDTH / CONFIG.HEIGHT;
  let w = window.innerWidth, h = window.innerHeight;
  if (w / h > ratio) w = h * ratio; else h = w / ratio;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

(function loop() { update(); render(); requestAnimationFrame(loop); })();
