(function () {
  'use strict';

  var params = new URLSearchParams(location.search);
  var state = {
    title: params.get('title') || 'GUID.AI 应用',
    desc: params.get('desc') || '探索 AI 创作工具，一键开启创作。',
    icon: params.get('icon') || '🖼️',
    cat: params.get('cat') || '应用',
    gradient: params.get('gradient') || 'linear-gradient(135deg,#4c1d95,#1e3a8a)'
  };

  function showToast(msg) {
    var el = document.getElementById('share-toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () { el.classList.remove('show'); }, 2200);
    try {
      if (window.parent !== window) {
        window.parent.postMessage({ type: 'guid-share', action: 'toast', message: msg }, '*');
      }
    } catch (e) { /* ignore */ }
  }

  function buildShareUrl() {
    var path = location.pathname.replace(/[^/]+$/, '');
    var origin = location.origin;
    var q = 'app=' + encodeURIComponent(state.title);
    return origin + path + 'index.html?' + q + '#page-apps';
  }

  function copyLink() {
    var url = document.getElementById('share-url-input').value;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(url).then(function () {
        showToast('✅ 链接已复制');
      });
    }
    var input = document.getElementById('share-url-input');
    input.select();
    try {
      document.execCommand('copy');
      showToast('✅ 链接已复制');
    } catch (e) {
      showToast('请手动复制链接');
    }
  }

  function init() {
    document.getElementById('share-title').textContent = state.title;
    document.getElementById('share-desc').textContent = state.desc;
    document.getElementById('share-icon').textContent = state.icon;
    document.getElementById('share-cat').textContent = state.cat;
    document.getElementById('share-cover').style.background = state.gradient;

    var shareUrl = buildShareUrl();
    document.getElementById('share-url-input').value = shareUrl;
    document.getElementById('share-open-app').href = shareUrl;

    document.getElementById('share-copy-btn').addEventListener('click', copyLink);

    document.querySelectorAll('.share-channel').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var ch = btn.getAttribute('data-channel');
        if (ch === 'link') {
          copyLink();
          return;
        }
        if (ch === 'embed') {
          copyLink();
          showToast('📋 嵌入代码已复制（演示）');
          return;
        }
        if (ch === 'poster') {
          showToast('🖼️ 海报生成中（演示）');
          return;
        }
        var names = {
          wechat: '微信',
          moments: '朋友圈',
          x: 'X',
          weibo: '微博',
          qq: 'QQ'
        };
        showToast('已分享到 ' + (names[ch] || ch));
      });
    });

    document.getElementById('share-close-btn').addEventListener('click', function () {
      try {
        if (window.parent !== window) {
          window.parent.postMessage({ type: 'guid-share', action: 'close' }, '*');
          return;
        }
      } catch (e) { /* ignore */ }
      if (history.length > 1) history.back();
      else location.href = 'index.html';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
