/* Progressive enhancement only: the complete English page works without JavaScript. */
(() => {
  'use strict';
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const language = document.getElementById('language');
  const nodes = [...document.querySelectorAll('[data-i18n]')];
  const english = Object.fromEntries(nodes.map(node => [node.dataset.i18n, node.textContent]));
  const translations = {
    'zh-CN': {
      'skip': '跳至正文',
      'hero.lead': '我是一名 AI 研究工程师，专注于提升智能体系统的运行速度。我曾在华为爱丁堡研究所研究智能体分叉、准入控制、状态管理和调度，也通过分析智能体框架的运行过程定位性能瓶颈。',
      'hero.interests': '我对硬件架构如何影响 AI 性能很感兴趣，尤其是内存系统和互连。我愿意考虑 AI 系统与性能工程领域的新机会，特别是专注于优化智能体 AI 工作负载的职位。',
      'hero.personal': '工作之外，我喜欢徒步、旅行和游泳。',
      'email': '邮箱', 'resume': '简历', 'work.heading': '精选研究',
      'paper.venue': '短论文 · ACM SoCC 2026',
      'paper.desc': '面向 best-of-N LLM 智能体、基于检查点分叉的启动策略：在 SWE-bench Verified 上 N=128 时，批次完成时间缩短 37%，每通道小时解决数提升至 1.7 倍。',
      'work2.category': '可观测性 · 华为', 'work2.title': '智能体推理服务的跨层可观测性',
      'work2.desc': '构建基于 OpenTelemetry/OpenLIT 的流水线，通过轨迹分析与词元级延迟剖析，识别 vLLM-Ascend 中的协调和内存瓶颈。',
      'work3.category': '硕士论文 · UCL', 'work3.title': '基于隐式人格建模的个性化对话生成',
      'work3.desc': '构建从对话历史推断人格的上下文学习流水线，并提出 Average Drift Score 量化话题漂移。',
      'work4.category': '本科论文 · 利物浦大学', 'work4.title': '基于变分自编码器的科学数据压缩',
      'work4.desc': '将尺度超先验变分自编码器适配到三维地震波形，在相同失真水平下实现比 ZFP 基线更低的码率工作点。',
      'experience.heading': '工作经历', 'employer': '华为技术研发（英国）', 'city': '爱丁堡',
      'role1.title': '系统 AI 研究工程师', 'role1.date': '2025年10月 — 2026年10月',
      'role1.desc': '曾从事推理调度、KV 缓存管理、可观测性与智能体编排的研究和工程工作。',
      'role2.title': '技术洞察专员', 'role2.date': '2024年11月 — 2025年10月',
      'role2.desc': '对比 Cerebras、NVIDIA 与昇腾架构，为推理基础设施战略提供依据。推动研究转向智能体推理服务，并与爱丁堡大学合作设计基于 openEuler 的智能体 AI 黑客松，吸引 100 余人参与。',
      'education.heading': '教育背景', 'education1.degree': '集成机器学习系统硕士', 'education1.grade': '优等（Distinction）',
      'education2.degree': '计算机科学与电子工程学士', 'education2.grade': '一等荣誉学位',
      'contact.heading': '联系', 'contact.copy': '欢迎交流推理基础设施、智能体系统及相关研究。'
    },
    ja: {
      'skip': '本文へ移動',
      'hero.lead': 'AI リサーチエンジニアとして、エージェントシステムの高速化に取り組んでいます。以前はファーウェイ・エディンバラ研究所で、エージェントのフォーク、アドミッション制御、状態管理、スケジューリングを研究しました。また、エージェントフレームワークをプロファイリングし、実行時のボトルネックを特定しました。',
      'hero.interests': 'ハードウェアアーキテクチャが AI の性能に与える影響、特にメモリシステムと相互接続に関心があります。AI システムや性能エンジニアリングの分野で新しい機会を探しており、特にエージェント型 AI ワークロードの最適化に携わる仕事に関心があります。',
      'hero.personal': '仕事以外では、ハイキング、旅行、水泳を楽しんでいます。',
      'email': 'メール', 'resume': '履歴書', 'work.heading': '主な研究',
      'paper.venue': 'ショートペーパー · ACM SoCC 2026',
      'paper.desc': 'best-of-N の LLM エージェント向けに、チェックポイントからのフォークを用いた起動方策を設計。SWE-bench Verified の N=128 で、バッチ完了時間を 37% 短縮し、レーン時間あたりの解決数を 1.7 倍に向上しました。',
      'work2.category': '可観測性 · ファーウェイ', 'work2.title': 'エージェントサービングのクロスレイヤ可観測性',
      'work2.desc': 'OpenTelemetry/OpenLIT によるパイプラインを構築。トレース分析とトークン単位の遅延解析により、vLLM-Ascend の連携とメモリのボトルネックを特定しました。',
      'work3.category': '修士論文 · UCL', 'work3.title': '暗黙ペルソナモデリングによる個別化対話生成',
      'work3.desc': '対話履歴からペルソナを推定するインコンテキスト学習パイプラインを構築し、話題の逸脱を定量化する Average Drift Score を提案しました。',
      'work4.category': '学士論文 · リヴァプール大学', 'work4.title': '変分オートエンコーダによる科学データ圧縮',
      'work4.desc': 'スケールハイパープライヤーを備えた変分オートエンコーダを三次元地震波形に適用し、同じ歪みで ZFP ベースラインより低いビットレートの動作点を実現しました。',
      'experience.heading': '職務経歴', 'employer': 'ファーウェイ技術研究開発（英国）', 'city': 'エディンバラ',
      'role1.title': 'システム AI リサーチエンジニア', 'role1.date': '2025年10月 — 2026年10月',
      'role1.desc': '推論スケジューリング、KV キャッシュ管理、可観測性、エージェントのオーケストレーションを研究・開発しました。',
      'role2.title': 'テクニカルインサイトスペシャリスト', 'role2.date': '2024年11月 — 2025年10月',
      'role2.desc': 'Cerebras、NVIDIA、Ascend のアーキテクチャを比較し、推論基盤の戦略に貢献。エージェントサービングへの研究転換を後押しし、エディンバラ大学と openEuler 上のエージェント AI ハッカソンを設計。100 名以上が参加しました。',
      'education.heading': '学歴', 'education1.degree': '統合機械学習システム修士', 'education1.grade': '優等（Distinction）',
      'education2.degree': '計算機科学・電子工学学士', 'education2.grade': '第一級優等学位',
      'contact.heading': 'お問い合わせ', 'contact.copy': '推論基盤、エージェントシステム、関連する研究について、お気軽にご連絡ください。'
    }
  };
  const storage = {
    get(key) { try { return localStorage.getItem(key); } catch (_) { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch (_) {} }
  };
  const systemTheme = matchMedia('(prefers-color-scheme: dark)');
  const labels = { en: 'Dark appearance', 'zh-CN': '深色外观', ja: 'ダーク表示' };
  function setMode(mode) {
    root.dataset.mode = mode;
    if (toggle) toggle.setAttribute('aria-pressed', String(mode === 'dark'));
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = mode === 'dark' ? '#000000' : '#f7f5f0';
  }
  function setLanguage(lang) {
    if (lang !== 'en' && !translations[lang]) lang = 'en';
    root.lang = lang;
    nodes.forEach(node => { node.textContent = translations[lang]?.[node.dataset.i18n] ?? english[node.dataset.i18n]; });
    if (language) language.value = lang;
    if (toggle) toggle.setAttribute('aria-label', labels[lang]);
  }
  if (toggle) {
    toggle.hidden = false;
    toggle.addEventListener('click', () => {
      const next = root.dataset.mode === 'dark' ? 'light' : 'dark';
      storage.set('mode', next);
      setMode(next);
    });
  }
  systemTheme.addEventListener('change', event => {
    if (!['light', 'dark'].includes(storage.get('mode'))) setMode(event.matches ? 'dark' : 'light');
  });
  const preferred = navigator.language.startsWith('zh') ? 'zh-CN' : navigator.language.startsWith('ja') ? 'ja' : 'en';
  setLanguage(language ? storage.get('lang') || preferred : 'en');
  setMode(root.dataset.mode === 'dark' ? 'dark' : 'light');
  if (language) {
    language.closest('.language-control').hidden = false;
    language.addEventListener('change', () => { setLanguage(language.value); storage.set('lang', language.value); });
  }
})();
