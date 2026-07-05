/* The Gallery & The Bonfire.
   Hero: pointillism name — water physics in the gallery, ignition in the dark.
   Atmosphere: page-wide embers rising in the dark, plus universal click effects.
   Copy: three languages (EN / 中文 / 日本語) × two moods (gallery / bonfire). */
(() => {
  'use strict';

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TAU = Math.PI * 2;

  /* ———— copy: language × mood ———— */

  const STRINGS = {
    en: {
      'nav.work': 'Work',
      'nav.contact': 'Contact',
      'toggle': { light: 'Light the bonfire', dark: 'Return to the gallery' },
      'hero.tag': { light: 'AI infrastructure · agentic systems · Edinburgh', dark: 'The flame of inference is kindled' },
      'hero.sub': { light: 'I build inference systems, and I study how meaning assembles from discrete parts — tokens, caches, and traces of computation.', dark: 'Keeper of the serving stack. What is generation, if not memory rekindled — one token at a time?' },
      'now.label': { light: 'Currently', dark: 'The present age' },
      'now.text': 'Researching runtime scheduling for agentic LLM workloads on vLLM-Ascend at Huawei R&D UK — how concurrent coding agents, RL rollouts, and Best-of-N swarms should share an inference cluster. On the side: essays on the systems layer of AI.',
      'exp.label': { light: 'Experience', dark: 'The journey' },
      'edu.label': { light: 'Education', dark: 'The apprenticeship' },
      'job1.title': 'System AI Research Engineer',
      'job1.when': 'Oct 2025 — present',
      'job1.org': 'Huawei Technologies R&D (UK) · Edinburgh',
      'job1.desc': 'Delay-aware scheduling for concurrent coding agents — lifting prefix-cache hit rate from 56% to 72% and halving queue wait. Built a cross-layer observability stack (OpenTelemetry, Prometheus) unifying agent, serving, and NPU telemetry on one timeline.',
      'job2.title': 'Technical Insight Analyst',
      'job2.when': 'Nov 2024 — Oct 2025',
      'job2.org': 'Huawei Technologies R&D (UK) · Edinburgh',
      'job2.desc': 'Comparative evaluation of LLM inference across Cerebras wafer-scale, NVIDIA, and Ascend architectures; helped pivot the team toward agentic serving. Initiated an agentic AI hackathon with the University of Edinburgh — 100+ participants.',
      'edu1.title': 'MSc Integrated Machine Learning Systems',
      'edu1.when': '2023 — 2024',
      'edu1.org': 'University College London · Distinction',
      'edu2.title': 'BEng Computer Science & Electronic Engineering',
      'edu2.when': '2020 — 2023',
      'edu2.org': 'University of Liverpool · First Class Honours',
      'work.label': { light: 'Selected work', dark: 'Relics' },
      'card1.title': 'Delay-aware sub-batch scheduling',
      'card1.desc': { light: 'Runtime scheduling for vLLM-Ascend serving concurrent coding agents — staggers bursts, packs sub-batches by delay tolerance. Prefix-cache hit rate 56→72%, queue wait halved.', dark: 'A scheduling rite of curious design. It delays the eager and staggers the burst; those who waited found their queues halved, and the cache remembered what it had once forgot.' },
      'card2.title': 'Cross-layer observability for agentic serving',
      'card2.desc': { light: 'OpenTelemetry and Prometheus with custom span converters and Gantt exporters — agent, serving, and NPU telemetry unified on a single timeline.', dark: 'An eye that sees across three worlds at once — agent, server, and silicon. No cycle is spent unwitnessed.' },
      'card3.title': 'Implicit persona dialogue generation',
      'card3.desc': { light: 'In-context pipeline that infers persona from dialogue history alone — no predefined profiles. Outperformed most implicit- and explicit-persona systems on fluency and diversity.', dark: 'It listens, and from listening alone divines the nature of the speaker. No profile written; none needed.' },
      'card4.meta': { light: 'writing · 2025', dark: 'scroll · 2025' },
      'card4.title': 'Prometheus brings fire',
      'card4.desc': { light: 'Open-source model democratization versus the concentration of compute.', dark: 'The first flame was stolen, not granted. On who may carry fire — the many, or the few.' },
      'skills.label': { light: 'Skills', dark: 'Attunement' },
      'sk.inference': 'inference',
      'sk.agentic': 'agentic',
      'sk.hardware': 'hardware',
      'sk.tooling': 'tooling',
      'contact.label': { light: 'Contact', dark: 'Summon' },
      'contact.title': { light: "Let's talk", dark: 'Leave a summoning sign' },
      'contact.email': 'email',
      'foot.line': { light: 'Edinburgh · accelerating into the future', dark: 'Rest here, traveller. The site remembers your visit.' },
    },
    'zh-CN': {
      'nav.work': '作品',
      'nav.contact': '联系',
      'toggle': { light: '点燃篝火', dark: '回到画廊' },
      'hero.tag': { light: 'AI Infra · Agentic AI · 爱丁堡', dark: '推理之火已被点燃' },
      'hero.sub': { light: '构建与优化推理系统，研究意义如何由离散的词元、缓存、计算中涌现。', dark: '服务栈的守火人。所谓生成，不过是记忆被重新点燃——一次一个词元。' },
      'now.label': { light: '近况', dark: '现世' },
      'now.text': '华为爱丁堡研究所AI研究工程师,聚焦大规模 LLM 推理加速，在 agentic AI 多智能体协同的复杂任务中，基于 vLLM-Ascend 的运行时调度提升推理效率；深入各平台硬件架构的对比洞察，在异构计算中找到最优加速方案。',
      'exp.label': { light: '经历', dark: '旅程' },
      'edu.label': { light: '教育', dark: '修行' },
      'job1.title': '系统 AI 研究工程师',
      'job1.when': '2025年10月 — 至今',
      'job1.org': '华为技术研发（英国）· 爱丁堡',
      'job1.desc': '面向并发编码智能体的延迟感知调度——前缀缓存命中率从 56% 提升至 72%，排队等待时间减半。构建跨层可观测性体系（OpenTelemetry、Prometheus），将智能体、推理服务与 NPU 遥测统一在同一条时间线上。',
      'job2.title': '技术洞察专员',
      'job2.when': '2024年11月 — 2025年10月',
      'job2.org': '华为技术研发（英国）· 爱丁堡',
      'job2.desc': '对比评估 Cerebras 晶圆级、NVIDIA 与昇腾架构上的 LLM 推理；推动团队转向智能体推理服务。与爱丁堡大学共同发起智能体 AI 黑客松——100 余人参与。',
      'edu1.title': '集成机器学习系统硕士',
      'edu1.when': '2023 — 2024',
      'edu1.org': '伦敦大学学院 · 优等（Distinction）',
      'edu2.title': '计算机科学与电子工程学士',
      'edu2.when': '2020 — 2023',
      'edu2.org': '利物浦大学 · 一等荣誉学位',
      'work.label': { light: '贡献', dark: '遗物' },
      'card1.title': '延迟感知的子批次调度',
      'card1.desc': { light: '为 vLLM-Ascend 上的并发编码智能体设计的运行时调度——错开突发请求，按延迟容忍度打包子批次。前缀缓存命中率 56→72%，排队等待减半。', dark: '一场构造奇特的调度仪式。它让性急者稍候，令蜂拥者错行；等待过的人发现队列已减半，而缓存想起了它曾遗忘之物。' },
      'card2.title': '面向智能体推理服务的跨层可观测性',
      'card2.desc': { light: '基于 OpenTelemetry 与 Prometheus，自研 span 转换器与甘特图导出器——智能体、推理服务与 NPU 遥测统一于同一时间线。', dark: '一只同时注视三界之眼——智能体、服务器与硅片。没有一个周期在无人见证中流逝。' },
      'card3.title': '隐式人格对话生成',
      'card3.desc': { light: '仅凭对话历史推断人格的上下文内流水线——无需预定义档案。在流畅度与多样性上优于多数隐式与显式人格系统。', dark: '它倾听，仅凭倾听便洞悉说话者的本性。无档案可查，亦无需档案。' },
      'card4.meta': { light: 'Substack随笔 ', dark: '卷轴 · 2025' },
      'card4.title': '普罗米修斯盗火',
      'card4.desc': { light: '开源模型的民主化与算力的集中化。', dark: '火种是盗来的，而非赐予的。论谁可执火——众人，还是少数。' },
      'skills.label': { light: '技能', dark: '禀赋' },
      'sk.inference': '推理',
      'sk.agentic': '智能体',
      'sk.hardware': '硬件',
      'sk.tooling': '工具链',
      'contact.label': { light: '联系', dark: '召唤' },
      'contact.title': { light: '欢迎建联', dark: '留下召唤印记' },
      'contact.email': '邮箱',
      'foot.line': { light: '爱丁堡 · 向未来加速', dark: '旅人，请在此稍歇。此地会记得你的到访。' },
    },
    ja: {
      'nav.work': '作品',
      'nav.contact': '連絡',
      'toggle': { light: '篝火を灯す', dark: 'ギャラリーへ戻る' },
      'hero.tag': { light: 'AI インフラ · エージェントシステム · エディンバラ', dark: '推論の火が灯された' },
      'hero.sub': { light: '推論システムを構築・最適化し、離散的なトークン、キャッシュ、計算のうちから、いかに意味が創発するのかを探究。', dark: 'サービングスタックの火守り。生成とは、記憶が再び灯ること——一トークンずつ。' },
      'now.label': { light: '近況', dark: '現世' },
      'now.text': 'ファーウェイ・エディンバラ研究所のAIリサーチエンジニア。大規模LLM推論の高速化に注力し、エージェンティックAIにおけるマルチエージェント協調の複雑なタスクに対しては、vLLM-Ascend上のランタイムスケジューリングにより推論効率を向上。また、多様なプラットフォームのハードウェアアーキテクチャを深く比較・洞察し、ヘテロジニアスコンピューティングにおける最適な加速アプローチを導く。',
      'exp.label': { light: '経歴', dark: '旅路' },
      'edu.label': { light: '学歴', dark: '修行の道' },
      'job1.title': 'システム AI リサーチエンジニア',
      'job1.when': '2025年10月 — 現在',
      'job1.org': 'ファーウェイ技術研究開発（英国）· エディンバラ',
      'job1.desc': '並行コーディングエージェントのための遅延考慮スケジューリング——プレフィックスキャッシュ命中率を 56% から 72% へ引き上げ、待ち時間を半減。OpenTelemetry と Prometheus によるクロスレイヤ可観測性基盤を構築し、エージェント・サービング・NPU のテレメトリをひとつのタイムラインに統合。',
      'job2.title': 'テクニカルインサイトアナリスト',
      'job2.when': '2024年11月 — 2025年10月',
      'job2.org': 'ファーウェイ技術研究開発（英国）· エディンバラ',
      'job2.desc': 'Cerebras ウェハスケール、NVIDIA、Ascend 各アーキテクチャ上の LLM 推論を比較評価し、チームのエージェントサービングへの転換を後押し。エディンバラ大学とともにエージェント AI ハッカソンを立ち上げ——参加者 100 名以上。',
      'edu1.title': '統合機械学習システム修士',
      'edu1.when': '2023 — 2024',
      'edu1.org': 'ユニバーシティ・カレッジ・ロンドン · 優等（Distinction）',
      'edu2.title': '計算機科学・電子工学学士',
      'edu2.when': '2020 — 2023',
      'edu2.org': 'リヴァプール大学 · 第一級優等学位',
      'work.label': { light: '代表作', dark: '遺物' },
      'card1.title': '遅延考慮サブバッチスケジューリング',
      'card1.desc': { light: 'vLLM-Ascend 上で並行コーディングエージェントを捌くランタイムスケジューリング——バーストをずらし、遅延許容度でサブバッチを構成。プレフィックスキャッシュ命中率 56→72%、待ち時間半減。', dark: '奇妙な意匠の調停の儀。急く者を待たせ、殺到する者をずらす。待った者の列は半ばに減り、キャッシュはかつて忘れたものを思い出した。' },
      'card2.title': 'エージェントサービングのためのクロスレイヤ可観測性',
      'card2.desc': { light: 'OpenTelemetry と Prometheus に独自のスパン変換器とガントチャート出力を加え——エージェント、サービング、NPU のテレメトリをひとつのタイムラインへ。', dark: '三つの世界を同時に見据える眼——エージェント、サーバ、そしてシリコン。見届けられぬまま費やされるサイクルはない。' },
      'card3.title': '暗黙ペルソナ対話生成',
      'card3.desc': { light: '対話履歴のみからペルソナを推定するインコンテキストパイプライン——事前定義プロファイル不要。流暢さと多様性で多くの既存システムを上回る。', dark: 'それは聴く。聴くことだけで、語り手の本性を見抜く。書かれた素性はなく、要りもしない。' },
      'card4.meta': { light: 'Substack', dark: '巻物 · 2025' },
      'card4.title': 'プロメテウス、火をもたらす',
      'card4.desc': { light: 'オープンソースモデルの民主化と、計算資源の寡占について。', dark: '最初の火は授けられたのではなく、盗まれた。火を持つべきは万人か、少数か。' },
      'skills.label': { light: 'スキル', dark: '記憶' },
      'sk.inference': '推論',
      'sk.agentic': 'エージェント',
      'sk.hardware': 'ハードウェア',
      'sk.tooling': 'ツール',
      'contact.label': { light: '連絡', dark: '召喚' },
      'contact.title': { light: '話しましょう', dark: '召喚サインを残す' },
      'contact.email': 'メール',
      'foot.line': { light: 'エディンバラ · 未来へ加速', dark: '旅人よ、ここで休むがいい。この場所はあなたの訪れを憶えている。' },
    },
  };

  /* ———— theme & language state ———— */

  const PALETTES = {
    light: ['#6D9BC3', '#4E7FA6', '#8FAE7E', '#6FA294', '#52708C'],
    dark: ['#C9A227', '#D4762C', '#E4C063', '#8B6914', '#A34A1F'],
  };
  const SPARK_COLORS = ['#E4C063', '#D4762C', '#C9A227'];
  const THEME_COLOR = { light: '#F2F5F3', dark: '#14110D' };
  const EMBER_COLOR = '#D4762C';

  let mode = root.dataset.mode === 'dark' ? 'dark' : 'light';
  let lang = 'en';
  try {
    lang = localStorage.getItem('lang') ||
      (navigator.language.indexOf('zh') === 0 ? 'zh-CN'
        : navigator.language.indexOf('ja') === 0 ? 'ja' : 'en');
  } catch (e) { /* private browsing */ }
  if (!STRINGS[lang]) lang = 'en';

  const toggle = document.getElementById('theme-toggle');
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  const copyNodes = Array.from(document.querySelectorAll('[data-i18n]'));
  const langButtons = Array.from(document.querySelectorAll('.lang-btn'));

  function writeCopy() {
    copyNodes.forEach((el) => {
      const v = STRINGS[lang][el.dataset.i18n] || STRINGS.en[el.dataset.i18n];
      if (v == null) return;
      el.textContent = typeof v === 'string' ? v : v[mode];
    });
  }

  function swapCopy(instant) {
    if (instant || reduceMotion) { writeCopy(); return; }
    copyNodes.forEach((el) => el.classList.add('fading'));
    setTimeout(() => {
      writeCopy();
      copyNodes.forEach((el) => el.classList.remove('fading'));
    }, 300);
  }

  function setLang(next, instant) {
    lang = next;
    try { localStorage.setItem('lang', next); } catch (e) { /* private browsing */ }
    root.lang = next;
    langButtons.forEach((b) => {
      const on = b.dataset.lang === next;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    swapCopy(instant);
  }

  langButtons.forEach((b) => {
    b.addEventListener('click', () => {
      if (b.dataset.lang !== lang) setLang(b.dataset.lang);
    });
  });

  function applyMode(next, instant) {
    mode = next;
    root.dataset.mode = next;
    try { localStorage.setItem('mode', next); } catch (e) { /* private browsing */ }
    if (metaTheme) metaTheme.content = THEME_COLOR[next];
    toggle.setAttribute('aria-pressed', String(next === 'dark'));
    swapCopy(instant);
    recolorParticles();
    populateAmbient();
  }

  function igniteButton() {
    toggle.classList.add('igniting');
    setTimeout(() => toggle.classList.remove('igniting'), 700);
  }

  function heroCenterOnPage() {
    const rect = canvas.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }

  function switchTheme() {
    const next = mode === 'light' ? 'dark' : 'light';
    if (!reduceMotion && typeof document.startViewTransition === 'function') {
      const r = toggle.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      root.classList.add('theme-instant');
      const vt = document.startViewTransition(() => applyMode(next, true));
      vt.ready.then(() => {
        const maxR = Math.hypot(
          Math.max(cx, window.innerWidth - cx),
          Math.max(cy, window.innerHeight - cy)
        );
        root.animate(
          { clipPath: ['circle(0px at ' + cx + 'px ' + cy + 'px)', 'circle(' + maxR + 'px at ' + cx + 'px ' + cy + 'px)'] },
          { duration: 700, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' }
        );
      }).catch(() => {});
      const skipTimer = setTimeout(() => {
        try { vt.skipTransition(); } catch (err) { /* already done */ }
      }, 1400);
      vt.finished.catch(() => {}).finally(() => {
        clearTimeout(skipTimer);
        root.classList.remove('theme-instant');
        const c = heroCenterOnPage();
        if (mode === 'dark') {
          fireAt(c.x, c.y);
          if (heroVisible) igniteAt(W / 2, H / 2);
        } else {
          splashAt(c.x, c.y);
          if (heroVisible) rippleAt(W / 2, H / 2);
        }
      });
    } else {
      applyMode(next, reduceMotion);
      if (reduceMotion) drawStatic();
      else scatter();
    }
    igniteButton();
  }

  toggle.addEventListener('click', switchTheme);

  /* ———— pointillism hero ———— */

  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');

  let W = 0;
  let H = 0;
  let targets = [];
  let particles = [];
  let ripples = [];
  let ignitions = [];
  let dabs = [];
  let heroBottom = 1;
  let dissolve = 0;
  let heroVisible = true;
  let needsClear = false;

  const pointer = { x: -1e4, y: -1e4, active: false };

  let targetsBlocked = false;

  function nameFont() {
    return '700 ' + Math.min(W / 6.2, H * 0.52, 170) + 'px Georgia, "Times New Roman", serif';
  }

  function buildTargets() {
    targets = [];
    targetsBlocked = false;
    const off = document.createElement('canvas');
    off.width = W;
    off.height = H;
    const o = off.getContext('2d');
    o.fillStyle = '#000';
    o.font = nameFont();
    o.textAlign = 'center';
    o.textBaseline = 'middle';
    o.fillText('Zirui Wang', W / 2, H / 2);
    let data;
    try {
      data = o.getImageData(0, 0, W, H).data;
    } catch (err) {
      targetsBlocked = true;
      return;
    }
    const step = W > 900 ? 4 : 3;
    for (let y = 0; y < H; y += step) {
      for (let x = 0; x < W; x += step) {
        if (data[(y * W + x) * 4 + 3] > 128 && Math.random() < 0.85) targets.push([x, y]);
      }
    }
    if (!targets.length) targetsBlocked = true;
  }

  /* canvas pixel reads can be blocked (e.g. iOS Lockdown Mode) — paint the name plainly instead */
  function drawNameFallback(alpha) {
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = 0.92 * (alpha == null ? 1 : alpha);
    ctx.fillStyle = PALETTES[mode][1];
    ctx.font = nameFont();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Zirui Wang', W / 2, H / 2);
    ctx.globalAlpha = 1;
  }

  function makeParticles() {
    const pal = PALETTES[mode];
    particles = targets.map(([tx, ty]) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      tx,
      ty,
      dx: (Math.random() - 0.5) * 150,
      dy: -20 - Math.random() * 90,
      c: pal[(Math.random() * pal.length) | 0],
      r: 1.1 + Math.random() * 1.5,
      ph: Math.random() * TAU,
      heat: 0,
    }));
    if (reduceMotion) particles.forEach((p) => { p.x = p.tx; p.y = p.ty; });
  }

  function recolorParticles() {
    const pal = PALETTES[mode];
    particles.forEach((p) => { p.c = pal[(Math.random() * pal.length) | 0]; });
  }

  function scatter() {
    particles.forEach((p) => { p.x = Math.random() * W; p.y = Math.random() * H; });
  }

  /* water: an unseen ring that displaces the dots (rings drawn by the fx layer) */
  function rippleAt(x, y) {
    ripples.push({ x, y, r: 4, v: 5.5, alpha: 0.5 });
    if (ripples.length > 6) ripples.shift();
  }

  /* fire: an ignition front that sets dots alight instead of pushing them */
  function igniteAt(x, y) {
    ignitions.push({ x, y, r: 4, v: 6.5 });
    if (ignitions.length > 6) ignitions.shift();
  }

  function addDabs(x0, y0, x1, y1) {
    const d = Math.hypot(x1 - x0, y1 - y0);
    if (d < 6) return;
    const n = Math.min(3, Math.round(d / 14) + 1);
    const pal = PALETTES[mode];
    for (let i = 0; i < n; i++) {
      const t = Math.random();
      dabs.push({
        x: x0 + (x1 - x0) * t + (Math.random() - 0.5) * 6,
        y: y0 + (y1 - y0) * t + (Math.random() - 0.5) * 6,
        vx: (Math.random() - 0.5) * 0.3,
        vy: mode === 'dark' ? -(0.3 + Math.random() * 0.7) : (Math.random() - 0.5) * 0.3,
        r: 1.4 + Math.random() * 2.2,
        life: 1,
        decay: 0.012 + Math.random() * 0.015,
        c: pal[(Math.random() * pal.length) | 0],
      });
    }
    if (dabs.length > 160) dabs.splice(0, dabs.length - 160);
  }

  canvas.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (!reduceMotion && pointer.active) addDabs(pointer.x, pointer.y, x, y);
    pointer.x = x;
    pointer.y = y;
    pointer.active = true;
  });

  canvas.addEventListener('pointerleave', () => {
    pointer.active = false;
    pointer.x = -1e4;
    pointer.y = -1e4;
  });

  function drawStatic() {
    if (targetsBlocked) { drawNameFallback(); return; }
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = 0.92;
    for (const p of particles) {
      ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.arc(p.tx, p.ty, p.r, 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function tick(ts) {
    if (!heroVisible) {
      if (needsClear) { ctx.clearRect(0, 0, W, H); needsClear = false; }
      requestAnimationFrame(tick);
      return;
    }
    needsClear = true;

    if (targetsBlocked) {
      drawNameFallback(1 - dissolve);
      requestAnimationFrame(tick);
      return;
    }

    ctx.clearRect(0, 0, W, H);
    const fade = 1 - dissolve;
    const k = dissolve * dissolve;

    for (const p of particles) {
      p.x += (p.tx + p.dx * k - p.x) * 0.06;
      p.y += (p.ty + p.dy * k - p.y) * 0.06;

      if (pointer.active) {
        const rx = p.x - pointer.x;
        const ry = p.y - pointer.y;
        const d2 = rx * rx + ry * ry;
        if (d2 < 8100 && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const f = (1 - d / 90) * 3.2;
          p.x += (rx / d) * f;
          p.y += (ry / d) * f;
        }
      }

      for (const rp of ripples) {
        const rx = p.x - rp.x;
        const ry = p.y - rp.y;
        const d = Math.hypot(rx, ry);
        const band = Math.abs(d - rp.r);
        if (band < 34 && d > 0.01) {
          const f = (1 - band / 34) * rp.alpha * 14;
          p.x += (rx / d) * f;
          p.y += (ry / d) * f;
        }
      }

      for (const ig of ignitions) {
        const d = Math.hypot(p.x - ig.x, p.y - ig.y);
        if (Math.abs(d - ig.r) < 26) p.heat = 1;
      }
      if (p.heat > 0) p.heat = Math.max(0, p.heat - 0.022);

      let ox;
      let oy;
      if (mode === 'light') {
        ox = Math.sin(ts / 1000 + p.tx * 0.02) * 1.1;
        oy = Math.cos(ts / 1400 + p.ph) * 0.5;
      } else {
        const j = Math.sin(ts / 500 + p.ph * 3) * 0.5;
        ox = j * 0.4;
        oy = j;
      }

      let fill = p.c;
      let rr = p.r;
      if (p.heat > 0) {
        fill = p.heat > 0.66 ? '#F6E7B2' : p.heat > 0.33 ? '#E4C063' : p.c;
        rr = p.r * (1 + p.heat * 0.9);
      }
      ctx.globalAlpha = 0.92 * fade;
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.arc(p.x + ox, p.y + oy, rr, 0, TAU);
      ctx.fill();
    }

    for (let i = ripples.length - 1; i >= 0; i--) {
      const rp = ripples[i];
      rp.r += rp.v;
      rp.v *= 0.985;
      rp.alpha *= 0.965;
      if (rp.alpha < 0.02) ripples.splice(i, 1);
    }

    const maxDim = Math.max(W, H);
    for (let i = ignitions.length - 1; i >= 0; i--) {
      const ig = ignitions[i];
      ig.r += ig.v;
      if (ig.r > maxDim) ignitions.splice(i, 1);
    }

    for (let i = dabs.length - 1; i >= 0; i--) {
      const d = dabs[i];
      d.x += d.vx;
      d.y += d.vy;
      d.life -= d.decay;
      if (d.life <= 0) { dabs.splice(i, 1); continue; }
      ctx.globalAlpha = d.life * 0.7 * fade;
      ctx.fillStyle = d.c;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r * d.life, 0, TAU);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  }

  /* ———— atmosphere layer: rising embers + universal click effects ———— */

  const fx = document.getElementById('fx-canvas');
  const fctx = fx.getContext('2d');

  let FW = 0;
  let FH = 0;
  let ambient = [];
  let fxRings = [];
  let fireFronts = [];
  let fxSparks = [];

  function makeEmberDrifter() {
    return {
      x: Math.random() * FW,
      y: Math.random() * FH,
      vy: -(0.25 + Math.random() * 0.5),
      wind: (Math.random() - 0.5) * 0.15,
      freq: 0.4 + Math.random() * 0.8,
      ph: Math.random() * TAU,
      s: 0.8 + Math.random() * 1.4,
      a: 0.15 + Math.random() * 0.4,
      ix: 0,
      iy: 0,
    };
  }

  /* ambience is the bonfire's alone: embers rise in the dark, the gallery stays still */
  function populateAmbient() {
    ambient = [];
    if (reduceMotion || !FW || mode !== 'dark') return;
    const area = FW * FH;
    const n = Math.round(Math.min(40, Math.max(14, area / 45000)));
    for (let i = 0; i < n; i++) ambient.push(makeEmberDrifter());
  }

  function splashAt(x, y) {
    fxRings.push({ x, y, r: 4, v: 5, alpha: 0.45 });
    fxRings.push({ x, y, r: 1, v: 4.2, alpha: 0.28 });
    if (fxRings.length > 10) fxRings.splice(0, fxRings.length - 10);
  }

  function fireAt(x, y) {
    fireFronts.push({ x, y, r: 6, v: 4.6, alpha: 0.9, seed: Math.random() * 100 });
    if (fireFronts.length > 5) fireFronts.shift();
    for (let i = 0; i < 24; i++) {
      const a = Math.random() * TAU;
      const sp = 1 + Math.random() * 3.2;
      fxSparks.push({
        x,
        y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 1.2,
        r: 0.8 + Math.random() * 1.6,
        life: 1,
        decay: 0.014 + Math.random() * 0.02,
        c: SPARK_COLORS[(Math.random() * SPARK_COLORS.length) | 0],
      });
    }
    if (fxSparks.length > 180) fxSparks.splice(0, fxSparks.length - 180);
  }

  function fxTick(ts) {
    fctx.clearRect(0, 0, FW, FH);

    for (const d of ambient) {
      d.x += d.wind + Math.sin((ts / 1000) * d.freq + d.ph) * 0.4 + d.ix;
      d.y += d.vy + d.iy;
      d.ix *= 0.92;
      d.iy *= 0.92;
      if (d.y < -14) { d.y = FH + 12; d.x = Math.random() * FW; }
      if (d.x < -20) d.x = FW + 16;
      if (d.x > FW + 20) d.x = -16;
      fctx.globalAlpha = d.a * (0.7 + 0.3 * Math.sin(ts / 200 + d.ph));
      fctx.fillStyle = EMBER_COLOR;
      fctx.beginPath();
      fctx.arc(d.x, d.y, d.s, 0, TAU);
      fctx.fill();
    }

    for (let i = fxRings.length - 1; i >= 0; i--) {
      const rp = fxRings[i];
      rp.r += rp.v;
      rp.v *= 0.985;
      rp.alpha *= 0.96;
      if (rp.alpha < 0.02) { fxRings.splice(i, 1); continue; }
      fctx.globalAlpha = rp.alpha;
      fctx.strokeStyle = '#4E7FA6';
      fctx.lineWidth = 1.4;
      fctx.beginPath();
      fctx.arc(rp.x, rp.y, rp.r, 0, TAU);
      fctx.stroke();
    }

    for (let i = fireFronts.length - 1; i >= 0; i--) {
      const f = fireFronts[i];
      f.r += f.v;
      f.v *= 0.99;
      f.alpha *= 0.95;
      if (f.alpha < 0.03) { fireFronts.splice(i, 1); continue; }
      const n = 42;
      for (let j = 0; j < n; j++) {
        const a = (j / n) * TAU;
        const jr = f.r + Math.sin(a * 7 + ts / 55 + f.seed) * 5 + Math.sin(a * 13 + f.seed * 3) * 3;
        fctx.globalAlpha = f.alpha * (0.45 + 0.55 * Math.abs(Math.sin(a * 9 + ts / 70 + f.seed)));
        fctx.fillStyle = j % 3 === 0 ? '#E4C063' : EMBER_COLOR;
        fctx.beginPath();
        fctx.arc(f.x + Math.cos(a) * jr, f.y + Math.sin(a) * jr, 1.2 + Math.random() * 1.6, 0, TAU);
        fctx.fill();
      }
    }

    for (let i = fxSparks.length - 1; i >= 0; i--) {
      const s = fxSparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.vx *= 0.98;
      s.vy = s.vy * 0.98 - 0.02;
      s.life -= s.decay;
      if (s.life <= 0) { fxSparks.splice(i, 1); continue; }
      fctx.globalAlpha = s.life;
      fctx.fillStyle = s.c;
      fctx.beginPath();
      fctx.arc(s.x, s.y, s.r * (0.4 + s.life * 0.6), 0, TAU);
      fctx.fill();
    }

    fctx.globalAlpha = 1;
    requestAnimationFrame(fxTick);
  }

  document.addEventListener('click', (e) => {
    if (reduceMotion || e.detail === 0) return;
    if (e.target.closest && e.target.closest('#theme-toggle')) return;
    const x = e.clientX;
    const y = e.clientY;

    if (mode === 'dark') fireAt(x, y);
    else splashAt(x, y);

    for (const d of ambient) {
      const dx = d.x - x;
      const dy = d.y - y;
      const dist = Math.hypot(dx, dy);
      if (dist < 140 && dist > 1) {
        const f = (1 - dist / 140) * 5;
        d.ix += (dx / dist) * f;
        d.iy += (dy / dist) * f;
      }
    }

    const rect = canvas.getBoundingClientRect();
    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
      const hx = x - rect.left;
      const hy = y - rect.top;
      if (mode === 'dark') igniteAt(hx, hy);
      else rippleAt(hx, hy);
    }
  });

  document.addEventListener('pointermove', (e) => {
    if (reduceMotion) return;
    for (const d of ambient) {
      const dx = d.x - e.clientX;
      const dy = d.y - e.clientY;
      const d2 = dx * dx + dy * dy;
      if (d2 < 4900 && d2 > 1) {
        const dist = Math.sqrt(d2);
        const f = (1 - dist / 70) * 0.6;
        d.ix += (dx / dist) * f;
        d.iy += (dy / dist) * f;
      }
    }
  });

  /* ———— layout & scroll ———— */

  let lastW = 0;
  let lastH = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.round(canvas.clientWidth);
    H = Math.round(canvas.clientHeight);
    /* iOS fires resize as the URL bar collapses while scrolling — only rebuild
       the hero when its box genuinely changed, or the name re-scatters mid-read */
    if (W && H && (W !== lastW || H !== lastH)) {
      lastW = W;
      lastH = H;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      heroBottom = canvas.getBoundingClientRect().bottom + window.scrollY;
      buildTargets();
      makeParticles();
      if (reduceMotion) drawStatic();
    }
    FW = window.innerWidth;
    FH = window.innerHeight;
    fx.width = FW * dpr;
    fx.height = FH * dpr;
    fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    populateAmbient();
  }

  function onScroll() {
    const y = window.scrollY;
    dissolve = Math.max(0, Math.min(1, y / (heroBottom * 0.72)));
    heroVisible = y < heroBottom + 80;
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ———— scroll reveal ———— */

  const revealNodes = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealNodes.forEach((el) => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealNodes.forEach((el) => io.observe(el));
  }

  /* ———— boot ———— */

  resize();
  onScroll();
  toggle.setAttribute('aria-pressed', String(mode === 'dark'));
  setLang(lang, true);
  if (!reduceMotion) {
    requestAnimationFrame(tick);
    requestAnimationFrame(fxTick);
  }

  /* open the site with #debug appended to the URL for an on-device diagnostic readout */
  if (location.hash === '#debug') {
    const el = document.createElement('pre');
    el.style.cssText = 'position:fixed;left:8px;bottom:8px;z-index:99;margin:0;' +
      'background:rgba(0,0,0,.78);color:#8f8;font:11px/1.6 monospace;' +
      'padding:8px 10px;border-radius:6px;max-width:92vw;white-space:pre-wrap;pointer-events:none';
    const update = () => {
      el.textContent =
        'canvas ' + W + 'x' + H + ' dpr ' + (window.devicePixelRatio || 1) +
        '\ntargets ' + targets.length + (targetsBlocked ? ' (reads BLOCKED — text fallback)' : '') +
        '\nreduceMotion ' + reduceMotion +
        '\ndissolve ' + dissolve.toFixed(2) + ' heroVisible ' + heroVisible +
        '\nmode ' + mode + ' · lang ' + lang;
    };
    update();
    setInterval(update, 800);
    document.body.appendChild(el);
  }
})();
