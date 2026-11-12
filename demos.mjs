const bracket = '<i class="scene-bracket" aria-hidden="true"></i>';

export const demos = {
  relay: {
    frames: [
      ['触发', '玻璃面板放在首屏，先展示退款请求进入工作流。', 'Trigger', 'Start with one refund request inside the glass panel.'],
      ['路由', '沿连线点亮审批节点，让观众看清接下来由谁处理。', 'Route', 'Follow the accent line to the approval node.'],
      ['完成', '所有节点归位，结果与下一步在同一画面中可见。', 'Resolve', 'Resolve the request and keep the result in the same view.'],
    ],
    scene: t => `<div class="relay-halo"></div><div class="relay-copy"><small>RELAY / FLOW</small><strong>${t('工作流，<br>一眼看懂。', 'Make work<br>flow.')}</strong></div>
      <div class="relay-window"><div class="relay-window-label"><i></i>${t('退款工作流', 'Refund workflow')}</div><div class="relay-flow">
      <span><b>↳</b>${t('请求', 'Request')}</span><span><b>◈</b>${t('审批', 'Approve')}</span><span><b>✓</b>${t('退款', 'Refund')}</span></div></div>`,
  },
  'kai-nomura': {
    frames: [
      ['首件作品', '让单色作品占据大部分画面，作者与图注留在边缘。', 'First work', 'Give the first work most of the frame. Keep the caption at the edge.'],
      ['切换作品', '作品本身改变，图注的位置不动，便于比较。', 'Next work', 'Change the artwork while keeping the caption anchored.'],
      ['作品索引', '缩小画幅并露出相邻作品，让人理解浏览节奏。', 'Index view', 'Show the neighboring work to reveal the rhythm of the portfolio.'],
    ],
    scene: t => `<div class="kai-top"><strong>KAI NOMURA</strong><span>${t('精选作品', 'SELECTED WORKS')}</span></div>
      <div class="kai-work"><div class="kai-art"><i></i><i></i><i></i></div><div class="kai-second"><i></i></div></div>
      <div class="kai-foot"><span>${t('光的研究', 'STUDIES IN LIGHT')}</span><span>01 — 02</span></div>`,
  },
  artefakt: {
    frames: [
      ['轮廓', '深色背景先突出外套的整体轮廓。', 'Silhouette', 'A dark backdrop gives the jacket a clear silhouette.'],
      ['光影', '冷光从侧面扫过，强化虹彩材质。', 'Light', 'A cool light sweep brings out the iridescent finish.'],
      ['细节', '镜头靠近面料，固定的标题和索引帮助保持方向。', 'Detail', 'Move in on the fabric while the title and index stay anchored.'],
    ],
    scene: t => `<div class="arte-product"></div><div class="arte-grid"></div><div class="arte-light"></div>
      <div class="arte-top">ARTEFAKT <span>01 / 03</span></div>
      <div class="arte-foot"><strong>${t('光谱外套', 'Spectral shell')}</strong><small>${t('材质研究', 'MATERIAL STUDY')}</small></div>${bracket}`,
  },
  'process-bento': {
    frames: [
      ['目标', '最大的卡片先讲结果。', 'Outcome', 'Give the outcome the largest tile.'],
      ['步骤', '用一致的编号和位置把人带到下一步。', 'Sequence', 'Use consistent numbering and placement to guide the next step.'],
      ['窄屏', '网格堆叠后，流程仍然能按原来的顺序阅读。', 'Stack', 'Stack the tiles in the same reading order on a narrow screen.'],
    ],
    scene: t => `<div class="process-board"><div class="process-lead"><small>${t('流程', 'PROCESS')}</small><strong>${t('从想法<br>到成品。', 'Idea to<br>launch.')}</strong></div>
      <div class="process-step"><b>01</b>${t('探索', 'Explore')}</div><div class="process-step"><b>02</b>${t('搭建', 'Build')}</div>
      <div class="process-step"><b>03</b>${t('交付', 'Ship')}</div></div>`,
  },
  'headline-gallery': {
    frames: [
      ['标题', '用一组大字确立阅读顺序。', 'Headline', 'Establish reading order with display type.'],
      ['穿插图像', '让小幅图像插进标题行，作为视觉停顿。', 'Insert', 'Use small images as visual pauses inside the line.'],
      ['窄屏', '把图像移到下方，避免切断句子。', 'Reflow', 'Move the images below the text to keep the sentence intact.'],
    ],
    scene: t => `<div class="headline-body"><strong>${t('给图像', 'Make')}</strong><i class="headline-photo first"></i><strong>${t('留个位置。', 'room.')}</strong>
      <i class="headline-photo second"></i></div><div class="headline-rule">${t('图像与排版', 'IMAGE & TYPE')}</div>`,
  },
  'bento-proof-grid': {
    frames: [
      ['关键数字', '让最能说明结果的数字占据主卡。', 'Lead metric', 'Make the strongest result the lead tile.'],
      ['补充证据', '相邻卡片补充样本与上下文。', 'Context', 'Use neighboring tiles to explain the sample and context.'],
      ['换一张', '切换辅助内容，核心数字保持可见。', 'Swap', 'Change supporting evidence while keeping the lead metric visible.'],
    ],
    scene: t => `<div class="proof-board"><div class="proof-metric"><strong>94%</strong><span>${t('完成率（示例）', 'Completion (sample)')}</span></div>
      <div class="proof-sample"><strong>120</strong><span>${t('次试用', 'Trials')}</span></div>
      <div class="proof-bars"><i></i><i></i><i></i><i></i></div></div>`,
  },
  'blueprint-tabs': {
    frames: [
      ['结构', '先看到整体结构与固定参照。', 'Structure', 'Start with the whole structure and a fixed point of reference.'],
      ['连接', '同一个画布上只强调连接位置。', 'Connect', 'Highlight the connection on the same canvas.'],
      ['完成', '保留参照物，用颜色标出完成状态。', 'Complete', 'Keep the reference in place and mark the finished state.'],
    ],
    scene: t => `<div class="blueprint-tabs"><span>${t('结构', 'Structure')}</span><span>${t('连接', 'Connect')}</span><span>${t('完成', 'Complete')}</span></div>
      <div class="blueprint-diagram"><i></i><i></i><i></i><i></i></div><div class="blueprint-mark">+ &nbsp; / &nbsp; +</div>`,
  },
};
