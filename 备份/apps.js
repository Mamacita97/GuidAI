(function () {
  'use strict';

  var APPS_DATA = [
    { id: '1', cat: '图像', catKey: 'image', icon: '🖼️', name: 'Qwen 图像编辑', desc: '智能修图、局部重绘与风格化', price: '⚡0.5', uses: '18.2k', rating: '4.9', featured: true, hot: true, official: true, gradient: 'linear-gradient(135deg,#4c1d95,#1e3a8a)' },
    { id: '2', cat: '图像', catKey: 'image', icon: '🎨', name: 'Qwen 动漫游戏生成', desc: '二次元角色与游戏资产一键生成', price: '⚡0.4', uses: '12.6k', rating: '4.8', featured: true, official: true, gradient: 'linear-gradient(135deg,#831843,#581c87)' },
    { id: '3', cat: '换装', catKey: 'tryon', icon: '👗', name: 'AI 虚拟换装', desc: '上传人物与服装图，在线试穿', price: '⚡0.3', uses: '9.8k', rating: '4.7', featured: true, official: true, gradient: 'linear-gradient(135deg,#065f46,#134e4a)' },
    { id: '4', cat: '视频', catKey: 'video', icon: '🎬', name: 'PixVerse V6 图生视频', desc: '高清图生视频，支持 10s 输出', price: '⚡0.8', uses: '7.1k', rating: '4.9', featured: true, official: true, hot: true, gradient: 'linear-gradient(135deg,#0c4a6e,#164e63)' },
    { id: '5', cat: '换脸', catKey: 'face', icon: '🔄', name: 'AI 智能换脸', desc: '任意人脸替换，自然融合', price: '⚡0.5', uses: '12.3k', rating: '4.9', hot: true, gradient: 'linear-gradient(135deg,#6d28d9,#2563eb)' },
    { id: '6', cat: '换脸', catKey: 'face', icon: '🌟', name: 'AI 换脸·明星特效', desc: '一键明星脸特效模板', price: '⚡0.5', uses: '8.7k', rating: '4.8', gradient: 'linear-gradient(135deg,#be1858,#e11d48)' },
    { id: '7', cat: '换装', catKey: 'tryon', icon: '👔', name: '虚拟试衣间', desc: '电商级虚拟试穿体验', price: '免费', uses: '4.2k', rating: '4.6', gradient: 'linear-gradient(135deg,#b45309,#ca8a04)' },
    { id: '8', cat: '风格', catKey: 'style', icon: '🎨', name: '油画风格转换', desc: '照片转经典油画质感', price: '免费', uses: '3.2k', rating: '4.5', gradient: 'linear-gradient(135deg,#4338ca,#7c3aed)' },
    { id: '9', cat: '风格', catKey: 'style', icon: '🌃', name: '赛博朋克风格', desc: '霓虹都市科幻视觉', price: '免费', uses: '2.8k', rating: '4.8', gradient: 'linear-gradient(135deg,#0891b2,#1d4ed8)' },
    { id: '10', cat: '修复', catKey: 'tool', icon: '🖼️', name: '老照片修复', desc: 'AI 修复划痕与模糊', price: '⚡0.4', uses: '1.5k', rating: '4.9', gradient: 'linear-gradient(135deg,#c2410c,#ea580c)' },
    { id: '11', cat: '修复', catKey: 'tool', icon: '🔍', name: '图片无损放大', desc: '4K 超分，保留细节', price: '⚡0.4', uses: '1.2k', rating: '4.7', gradient: 'linear-gradient(135deg,#52525b,#27272a)' },
    { id: '12', cat: '工具', catKey: 'tool', icon: '✨', name: '智能消除', desc: '消除画面中多余元素', price: '⚡0.2', uses: '5.6k', rating: '4.8', hot: true, bento: true, bentoColor: '#22d3ee', gradient: 'linear-gradient(135deg,#0e7490,#155e75)' },
    { id: '13', cat: '工具', catKey: 'tool', icon: '📐', name: '图片超清', desc: '电影级画质增强', price: '⚡0.3', uses: '4.1k', rating: '4.9', official: true, bento: true, bentoHighlight: true, gradient: 'linear-gradient(135deg,#3f6212,#365314)' },
    { id: '14', cat: '工具', catKey: 'tool', icon: '🏃', name: '动作模仿', desc: '一键动作迁移到角色', price: '⚡0.5', uses: '3.3k', rating: '4.7', bento: true, gradient: 'linear-gradient(135deg,#1e293b,#0f172a)' },
    { id: '15', cat: '文档', catKey: 'doc', icon: '📄', name: '智能文档写作', desc: '大纲、报告与营销文案一键生成', price: '⚡0.3', uses: '6.8k', rating: '4.8', official: true, isNew: true, gradient: 'linear-gradient(135deg,#1e40af,#3730a3)' },
    { id: '16', cat: '文档', catKey: 'doc', icon: '📝', name: '长文摘要助手', desc: '快速提炼 PDF / 网页核心要点', price: '免费', uses: '4.5k', rating: '4.7', isNew: true, gradient: 'linear-gradient(135deg,#334155,#1e293b)' },
    { id: '17', cat: '音频', catKey: 'audio', icon: '🎙️', name: 'AI 语音合成', desc: '多语种超拟人朗读与配音', price: '⚡0.4', uses: '8.2k', rating: '4.9', official: true, hot: true, gradient: 'linear-gradient(135deg,#7c2d12,#9a3412)' },
    { id: '18', cat: '音频', catKey: 'audio', icon: '🎵', name: '背景音乐生成', desc: '按场景与情绪生成 BGM', price: '⚡0.5', uses: '5.1k', rating: '4.8', isNew: true, gradient: 'linear-gradient(135deg,#581c87,#701a75)' }
  ];

  function isFreeApp(app) {
    return app.price.indexOf('免费') >= 0;
  }

  var EXPLORE_FILTERS = [
    { key: 'all', label: '全部' },
    { key: 'official', label: '官方精选', match: function (app) { return !!app.official; } },
    { key: 'hot', label: '热门', match: function (app) { return !!app.hot; } },
    { key: 'new', label: '最新', match: function (app) { return !!app.isNew; } },
    { key: 'free', label: '免费', match: isFreeApp },
    { key: 'face', label: '换脸', match: function (app) { return app.catKey === 'face'; } },
    { key: 'tryon', label: '虚拟换装', match: function (app) { return app.catKey === 'tryon'; } },
    { key: 'video', label: '图生视频', match: function (app) { return app.catKey === 'video'; } },
    { key: 'image', label: '图像生成', match: function (app) { return app.catKey === 'image'; } },
    { key: 'style', label: '风格转换', match: function (app) { return app.catKey === 'style'; } },
    { key: 'tool', label: '修图增强', match: function (app) { return app.catKey === 'tool'; } },
    { key: 'doc', label: '文案写作', match: function (app) { return app.catKey === 'doc'; } },
    { key: 'audio', label: '语音配音', match: function (app) { return app.catKey === 'audio'; } }
  ];

  var CURATED_ZONES = [
    {
      gridId: 'zone-media-grid',
      match: function (app) { return app.catKey === 'video' || app.catKey === 'audio'; },
      limit: 4
    },
    {
      gridId: 'zone-image-grid',
      match: function (app) { return app.catKey === 'image' || app.catKey === 'face' || app.catKey === 'style' || app.catKey === 'tryon'; },
      limit: 4
    },
    {
      gridId: 'zone-copy-grid',
      match: function (app) { return app.catKey === 'doc'; },
      limit: 4
    }
  ];

  var EXPLORE_RATIOS = ['ratio-34', 'ratio-43', 'ratio-11', 'ratio-916', 'ratio-45'];

  var TAB_LABELS = { doc: '文档', image: '图像', video: '视频', audio: '音频', tool: '工具', face: '换脸', tryon: '换装', style: '风格' };

  var state = {
    tab: 'all',
    query: '',
    exploreFilter: 'all'
  };

  function isEmbedded() {
    try { return window.parent !== window; } catch (e) { return true; }
  }

  function postToParent(action, payload) {
    if (!isEmbedded()) return;
    try {
      window.parent.postMessage({ type: 'guid-apps', action: action, payload: payload || {} }, '*');
    } catch (e) { /* ignore */ }
  }

  function showToast(msg) {
    var el = document.getElementById('apps-toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () { el.classList.remove('show'); }, 2000);
    postToParent('toast', { message: msg });
  }

  function openTemplate(app) {
    postToParent('openTemplate', {
      cat: app.cat,
      catKey: app.catKey,
      id: app.id,
      official: !!app.official,
      icon: app.icon,
      title: app.name,
      desc: app.desc,
      price: app.price,
      uses: app.uses + ' 次使用',
      rating: app.rating,
      gradient: app.gradient
    });
    if (!isEmbedded()) {
      showToast('🚀 打开应用：' + app.name);
    }
  }

  function getExploreFilterDef(key) {
    for (var i = 0; i < EXPLORE_FILTERS.length; i++) {
      if (EXPLORE_FILTERS[i].key === key) return EXPLORE_FILTERS[i];
    }
    return EXPLORE_FILTERS[0];
  }

  function getFiltered() {
    var filterDef = getExploreFilterDef(state.exploreFilter);
    return APPS_DATA.filter(function (app) {
      if (state.tab === 'doc' && app.catKey !== 'doc') return false;
      if (state.tab === 'image' && app.catKey !== 'image' && app.catKey !== 'face' && app.catKey !== 'style' && app.catKey !== 'tryon') return false;
      if (state.tab === 'video' && app.catKey !== 'video') return false;
      if (state.tab === 'audio' && app.catKey !== 'audio') return false;
      if (filterDef.match && !filterDef.match(app)) return false;
      if (state.query) {
        var q = state.query.toLowerCase();
        if (app.name.toLowerCase().indexOf(q) < 0 && app.desc.toLowerCase().indexOf(q) < 0 && app.cat.toLowerCase().indexOf(q) < 0) return false;
      }
      return true;
    });
  }

  function renderExploreFilters() {
    var wrap = document.getElementById('explore-filters');
    if (!wrap) return;
    wrap.innerHTML = EXPLORE_FILTERS.map(function (item) {
      var active = state.exploreFilter === item.key;
      return '<button type="button" class="explore-filter-chip' + (active ? ' active' : '') + '" data-explore-filter="' + item.key + '" role="tab" aria-selected="' + (active ? 'true' : 'false') + '">' + escapeHtml(item.label) + '</button>';
    }).join('');
    wrap.querySelectorAll('.explore-filter-chip').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setExploreFilter(btn.getAttribute('data-explore-filter'));
        showToast('筛选：' + btn.textContent.trim());
      });
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function parseUsesNum(uses) {
    var m = String(uses || '').match(/([\d.]+)\s*(k|w)?/i);
    if (!m) return 0;
    var n = parseFloat(m[1]);
    if ((m[2] || '').toLowerCase() === 'k') n *= 1000;
    if ((m[2] || '').toLowerCase() === 'w') n *= 10000;
    return n;
  }

  function formatSocialCount(num) {
    if (num >= 10000) return (num / 10000).toFixed(1).replace(/\.0$/, '') + 'w';
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return String(num);
  }

  function getAppSocialCounts(app) {
    if (app.likes != null && app.comments != null) {
      return { likes: app.likes, comments: app.comments };
    }
    var uses = parseUsesNum(app.uses);
    var likesNum = Math.max(8, Math.round(uses * 1.12) || 48);
    var commentsNum = Math.max(0, Math.round(uses / 720) || 6);
    return {
      likes: formatSocialCount(likesNum),
      comments: formatSocialCount(commentsNum)
    };
  }

  function renderCardSocialStats(app) {
    var social = getAppSocialCounts(app);
    return '<div class="apps-card-stats" aria-label="点赞 ' + social.likes + '，评论 ' + social.comments + '">' +
      '<span class="apps-card-stat"><span class="apps-card-stat-icon" aria-hidden="true">👍</span>' + escapeHtml(social.likes) + '</span>' +
      '<span class="apps-card-stat"><span class="apps-card-stat-icon" aria-hidden="true">💬</span>' + escapeHtml(social.comments) + '</span>' +
      '</div>';
  }

  function renderCuratedCard(app) {
    return '<article class="curated-card" data-id="' + app.id + '" role="button" tabindex="0">' +
      '<div class="curated-card-inner">' +
      '<div class="curated-card-media">' +
      '<div class="curated-card-cover" style="background:' + app.gradient + '"></div>' +
      '<span class="curated-card-emoji" aria-hidden="true">' + app.icon + '</span>' +
      '<div class="curated-card-overlay"></div>' +
      renderCardSocialStats(app) +
      '<div class="curated-card-action"><span>立即使用</span></div>' +
      '</div>' +
      '<div class="curated-card-foot">' +
      '<h3>' + escapeHtml(app.name) + '</h3>' +
      '<p>' + escapeHtml(app.desc) + '</p>' +
      '</div></div></article>';
  }

  function renderCuratedZones() {
    CURATED_ZONES.forEach(function (zone) {
      var grid = document.getElementById(zone.gridId);
      if (!grid) return;
      var items = APPS_DATA.filter(zone.match).slice(0, zone.limit);
      if (!items.length) {
        grid.innerHTML = '<p class="explore-empty">暂无应用</p>';
        return;
      }
      grid.innerHTML = items.map(renderCuratedCard).join('');
      grid.querySelectorAll('.curated-card').forEach(function (el) {
        bindCardClick(el, el.getAttribute('data-id'));
      });
    });
  }

  function renderFeatured() {
    var grid = document.getElementById('featured-grid');
    if (!grid) return;
    var items = APPS_DATA.filter(function (a) { return a.featured; });
    grid.innerHTML = items.map(function (app) {
      return '<article class="featured-card" data-id="' + app.id + '" role="button" tabindex="0">' +
        (app.hot ? '<span class="badge-hot">HOT</span>' : '') +
        '<div class="cover" style="background:' + app.gradient + '"></div>' +
        '<div class="overlay"></div>' +
        renderCardSocialStats(app) +
        '<div class="meta"><h3>' + escapeHtml(app.name) + '</h3></div></article>';
    }).join('');
    grid.querySelectorAll('.featured-card').forEach(function (el) {
      bindCardClick(el, el.getAttribute('data-id'));
    });
  }

  function renderBento() {
    var grid = document.getElementById('bento-grid');
    if (!grid) return;
    var tools = APPS_DATA.filter(function (a) { return a.bento; });
    var html = '<div class="bento-intro">' +
      '<p class="title">精选工具\n视频超分</p>' +
      '<button type="button" data-action="explore-tools">电影级视频画质 →</button></div>';
    tools.forEach(function (app) {
      html += '<div class="bento-cell' + (app.bentoHighlight ? ' highlight' : '') + '" data-id="' + app.id + '" role="button" tabindex="0">' +
        '<div class="bg" style="background:' + app.gradient + '"></div>' +
        renderCardSocialStats(app) +
        (app.id === '12' ? '<span class="hot-tag">HOT</span>' : '') +
        '<p class="label" style="color:' + (app.bentoColor || (app.bentoHighlight ? '#ccff00' : '#fff')) + '">' + escapeHtml(app.name) + '</p>' +
        '<p class="sub">' + escapeHtml(app.desc) + '</p></div>';
    });
    grid.innerHTML = html;
    grid.querySelectorAll('.bento-cell').forEach(function (el) {
      bindCardClick(el, el.getAttribute('data-id'));
    });
    var exploreBtn = grid.querySelector('[data-action="explore-tools"]');
    if (exploreBtn) {
      exploreBtn.addEventListener('click', function () {
        setTab('video');
        showToast('🎬 已筛选视频类应用');
      });
    }
  }

  function renderExplore() {
    var grid = document.getElementById('explore-masonry');
    if (!grid) return;
    var list = getFiltered();
    if (!list.length) {
      grid.innerHTML = '<p class="explore-empty">暂无匹配的应用，试试其他关键词或分类</p>';
      notifyHeight();
      return;
    }
    grid.innerHTML = list.map(function (app, idx) {
      var ratio = EXPLORE_RATIOS[idx % EXPLORE_RATIOS.length];
      var typeLabel = TAB_LABELS[app.catKey] || app.cat;
      return '<article class="explore-card" data-id="' + app.id + '" role="button" tabindex="0">' +
        '<div class="explore-card-inner">' +
        '<div class="explore-card-media ' + ratio + '">' +
        '<div class="explore-card-cover" style="background:' + app.gradient + '"></div>' +
        '<span class="explore-card-emoji" aria-hidden="true">' + app.icon + '</span>' +
        '<div class="explore-card-overlay"></div>' +
        renderCardSocialStats(app) +
        '<div class="explore-card-action"><span>立即使用</span></div>' +
        '</div>' +
        '<div class="explore-card-foot">' +
        '<h3>' + escapeHtml(app.name) + '</h3>' +
        '<div class="explore-card-meta">' +
        '<span class="explore-card-type">' + escapeHtml(typeLabel) + '</span>' +
        '<span>' + escapeHtml(app.uses) + ' 次使用</span>' +
        '</div></div></div></article>';
    }).join('');

    grid.querySelectorAll('.explore-card').forEach(function (el) {
      bindCardClick(el, el.getAttribute('data-id'));
    });
    notifyHeight();
  }

  function bindCardClick(el, id) {
    function go() {
      var app = APPS_DATA.find(function (a) { return a.id === id; });
      if (app) openTemplate(app);
    }
    el.addEventListener('click', go);
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
    });
  }

  function setExploreFilter(filter) {
    state.exploreFilter = getExploreFilterDef(filter).key;
    document.querySelectorAll('.explore-filter-chip').forEach(function (btn) {
      var active = btn.getAttribute('data-explore-filter') === state.exploreFilter;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    renderExplore();
  }

  function setTab(tab) {
    state.tab = tab;
    document.querySelectorAll('.tab-chip').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
    });
    renderExplore();
  }

  function init() {
    renderFeatured();
    renderCuratedZones();
    renderBento();
    renderExploreFilters();
    renderExplore();

    document.querySelectorAll('.tab-chip').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setTab(btn.getAttribute('data-tab'));
        showToast('已切换：' + btn.textContent.trim());
      });
    });

    var search = document.getElementById('apps-search-input');
    if (search) {
      search.addEventListener('input', function () {
        state.query = search.value.trim();
        renderExplore();
      });
    }

    document.getElementById('section-more-featured')?.addEventListener('click', function () {
      setTab('all');
      setExploreFilter('all');
      document.getElementById('apps-explore')?.scrollIntoView({ behavior: 'smooth' });
    });

    document.querySelectorAll('.section-more[data-zone-tab]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tab = btn.getAttribute('data-zone-tab');
        if (tab) setTab(tab);
        document.getElementById('apps-explore')?.scrollIntoView({ behavior: 'smooth' });
        showToast('已筛选：' + btn.closest('.curated-zone')?.querySelector('.section-title')?.textContent.trim());
      });
    });

    window.addEventListener('message', function (e) {
      if (!e.data || e.data.type !== 'guid-parent') return;
      if (e.data.action === 'theme' && e.data.dark) {
        document.documentElement.classList.add('parent-dark');
      } else if (e.data.action === 'openApp' && e.data.id) {
        var app = APPS_DATA.find(function (a) { return a.id === String(e.data.id); });
        if (app) openTemplate(app);
      }
    });

    postToParent('ready', {});
    notifyHeight();
    window.addEventListener('resize', notifyHeight);
  }

  function notifyHeight() {
    var h = document.documentElement.scrollHeight;
    postToParent('resize', { height: h });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
