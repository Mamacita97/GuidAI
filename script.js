// ===== 热门Apps滚动JS =====
    (function(){
      var scrollPos = 0;
      var cardWidth = 168; // w-36 + gap-3
      var visibleCards = 0;
      var maxScroll = 0;
      
      function updateScroll() {
        var container = document.getElementById('apps-scroll-container');
        var track = document.getElementById('apps-scroll-track');
        var prevBtn = document.getElementById('apps-prev-btn');
        var nextBtn = document.getElementById('apps-next-btn');
        if (!container || !track || !prevBtn || !nextBtn) return;
        
        visibleCards = Math.floor(container.clientWidth / cardWidth);
        maxScroll = Math.max(0, 15 - visibleCards);
        
        prevBtn.style.display = scrollPos > 0 ? 'flex' : 'none';
        nextBtn.style.display = scrollPos < maxScroll ? 'flex' : 'none';
        
        track.style.transform = 'translateX(-' + (scrollPos * cardWidth) + 'px)';
      }
      
      window.scrollApps = function(dir) {
        scrollPos = Math.max(0, Math.min(maxScroll, scrollPos + dir));
        updateScroll();
      };
      
      window.addEventListener('resize', updateScroll);
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateScroll);
      } else {
        updateScroll();
      }
    })();



// ===== GUID.AI 主脚本 =====
// ===== 示例预览媒体（本地占位） =====
var EXAMPLE_PREVIEW_IMAGE = 'example1.png';
var EXAMPLE_PREVIEW_VIDEO = 'example2.mp4';
var OIWS_VIDEO_PREVIEW_VARIANTS = ['ltx2-digital-human', 'motion-transfer', 'short-drama', 'seedance20', 'keyframes-video', 'ecommerce-digital-human', 'video-face-swap'];

function isVideoPreviewType(type) {
  var t = String(type || '').toLowerCase();
  return t === 'video' || t === 'mp4';
}

function getExamplePreviewSrc(type) {
  return isVideoPreviewType(type) ? EXAMPLE_PREVIEW_VIDEO : EXAMPLE_PREVIEW_IMAGE;
}

function isOiwsVideoPreviewVariant(variant) {
  return OIWS_VIDEO_PREVIEW_VARIANTS.indexOf(variant) >= 0;
}

function getOiwsExamplePreviewSrc() {
  return isOiwsVideoPreviewVariant(aiwsState && aiwsState.oiwsVariant)
    ? EXAMPLE_PREVIEW_VIDEO
    : EXAMPLE_PREVIEW_IMAGE;
}

function applyExamplePreviewToMediaBox(box, type, opts) {
  opts = opts || {};
  if (!box) return;
  var imgEl = opts.imgEl || box.querySelector('img[id$="-image"], img.example-preview-img');
  var placeholderEl = opts.placeholderEl || box.querySelector('[id$="-placeholder"]');
  var emojiEl = opts.emojiEl || box.querySelector('[id$="-emoji"], [id$="-media-icon"]');
  box.querySelectorAll('video.example-preview-video').forEach(function(v) {
    try { v.pause(); } catch (e) {}
    v.remove();
  });

  if (isVideoPreviewType(type)) {
    if (imgEl) imgEl.style.display = 'none';
    if (placeholderEl) placeholderEl.style.display = 'none';
    if (emojiEl) emojiEl.style.display = 'none';
    var video = document.createElement('video');
    video.className = 'example-preview-video';
    video.src = EXAMPLE_PREVIEW_VIDEO;
    video.poster = EXAMPLE_PREVIEW_IMAGE;
    video.controls = true;
    video.playsInline = true;
    video.style.cssText = opts.videoStyle || 'width:100%;height:100%;object-fit:contain;background:#000;display:block;';
    box.appendChild(video);
  } else if (type === 'image' || !type) {
    if (imgEl) {
      imgEl.src = EXAMPLE_PREVIEW_IMAGE;
      imgEl.style.display = 'block';
      imgEl.classList.add('example-preview-img');
    } else {
      var img = document.createElement('img');
      img.className = 'example-preview-img';
      img.src = EXAMPLE_PREVIEW_IMAGE;
      img.alt = opts.alt || '预览';
      img.style.cssText = opts.imgStyle || 'width:100%;height:100%;object-fit:contain;display:block;';
      box.appendChild(img);
    }
    if (placeholderEl) placeholderEl.style.display = 'none';
    if (emojiEl) emojiEl.style.display = 'none';
  } else {
    if (imgEl) imgEl.style.display = 'none';
    if (placeholderEl) placeholderEl.style.display = opts.showPlaceholder !== false ? '' : 'none';
    if (emojiEl) emojiEl.style.display = '';
  }
}

window.applyExamplePreviewToMobMedia = function(type) {
  var media = document.getElementById('mob-preview-media');
  if (!media) return;
  if (type === 'video') media.style.aspectRatio = '16/9';
  else if (type === 'audio') media.style.aspectRatio = '1/1';
  else media.style.aspectRatio = '4/5';
  applyExamplePreviewToMediaBox(media, type, {
    emojiEl: document.getElementById('mob-preview-emoji')
  });
  var cntEl = document.getElementById('mob-preview-count');
  if (cntEl) cntEl.textContent = isVideoPreviewType(type) ? '共 1 个' : '共 1 张';
};

window.applyExamplePreviewToInspMedia = function(type) {
  var media = document.getElementById('idm-media');
  if (!media) return;
  media.querySelectorAll('.idm-preview-img, .idm-preview-video').forEach(function(el) {
    if (el.tagName === 'VIDEO') { try { el.pause(); } catch (e) {} }
    el.remove();
  });
  applyExamplePreviewToMediaBox(media, type, {
    emojiEl: document.getElementById('idm-media-icon'),
    imgStyle: 'width:100%;height:100%;object-fit:contain;display:block;position:absolute;inset:0;'
  });
};

window.applyExamplePreviewToMyworksMedia = function(type) {
  applyExamplePreviewToMediaBox(document.getElementById('mwp-media-box'), type, {
    imgEl: document.getElementById('mwp-image'),
    placeholderEl: document.getElementById('mwp-placeholder')
  });
};

// ===== Toast =====
let toastTimer = null;
let currentRole = '';
let collabMode = false;
let collabModels = [];
let collabSummary = '';
let searchEnabled = true;
let deepThinkEnabled = false;

// ===== 历史对话下拉菜单 =====
window.toggleHistoryDropdown = function(e) {
  if (e) e.stopPropagation();
  const dropdown = document.getElementById('history-dropdown');
  if (!dropdown) return;
  const willOpen = dropdown.classList.contains('hidden');
  dropdown.classList.toggle('hidden');
  if (willOpen) {
    const model = document.getElementById('model-dropdown');
    const role = document.getElementById('role-dropdown');
    if (model) model.classList.add('hidden');
    if (role) role.classList.add('hidden');
    if (typeof closeChatMobileSheet === 'function') closeChatMobileSheet();
  }
};

document.addEventListener('click', function(e) {
  const dropdown = document.getElementById('history-dropdown');
  if (!dropdown || dropdown.classList.contains('hidden')) return;
  const historyWrap = document.querySelector('#page-chat .chat-top-left');
  if (historyWrap && !historyWrap.contains(e.target)) {
    dropdown.classList.add('hidden');
  }
});

// 加载历史对话
window.loadHistoryChat = function(chatId) {
  const dropdown = document.getElementById('history-dropdown');
  if (dropdown) {
    dropdown.classList.add('hidden');
  }
  showToast('📂 加载历史对话: ' + chatId);
  // 模拟加载历史对话内容
  resetChat();
  showToast('✅ 已加载历史对话');
};

// 查看全部历史
window.showAllHistory = function() {
  const dropdown = document.getElementById('history-dropdown');
  if (dropdown) {
    dropdown.classList.add('hidden');
  }
  showToast('📜 跳转到历史记录页面');
};

function showToast(m) { const t=document.getElementById('toast'); t.textContent=m; t.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove('show'),2000); }
function closeAnnouncementBar() { document.querySelectorAll('.home-announcement-bar').forEach(bar => bar.style.display='none'); }

// ===== 灵感页交互 =====
var _inspirationBound = false;
var _inspirationSampleCards = [
  { type:'image', attr:'free', source:'model', sourceName:'Flux Pro 1.1', title:'赛博朋克霓虹少女', author:'NeonMaster', likes:1234, gradA:'#7c3aed', gradB:'#ec4899', ratio:'4/5' },
  { type:'video', attr:'paid', source:'apps', sourceName:'AI 漫剧工坊', sourceApp:'lip-sync', title:'AI漫剧·未来都市', author:'Video_Master', likes:856, gradA:'#2563eb', gradB:'#06b6d4', ratio:'16/9' },
  { type:'image', attr:'free', source:'model', sourceName:'Midjourney V6', title:'梦幻森林光影', author:'Art_Genius', likes:2345, gradA:'#059669', gradB:'#14b8a6', ratio:'3/4' },
  { type:'audio', attr:'free', source:'model', sourceName:'Stable Audio 2.0', title:'电子音乐节拍', author:'Music_Bot', likes:567, gradA:'#dc2626', gradB:'#f97316', ratio:'1/1' },
  { type:'text', attr:'free', source:'model', sourceName:'Claude 3.5 Sonnet', title:'小红书爆款种草文案', author:'Copy_AI', likes:1890, gradA:'#6366f1', gradB:'#8b5cf6', ratio:'4/3' },
  { type:'comic', attr:'paid', source:'apps', sourceName:'ComfyUI 漫剧流', sourceApp:'ai-draw', title:'武侠传奇·第一话', author:'Comic_AI', likes:4321, gradA:'#ca8a04', gradB:'#f59e0b', ratio:'3/5' },
  { type:'image', attr:'free', source:'model', sourceName:'DALL·E 3', title:'深空探索概念图', author:'Space_Art', likes:987, gradA:'#4f46e5', gradB:'#9333ea', ratio:'4/3' },
  { type:'video', attr:'free', source:'apps', sourceName:'一键视频生成', sourceApp:'lip-sync', title:'美食教程 AI 版', author:'Food_AI', likes:2104, gradA:'#db2777', gradB:'#f43f5e', ratio:'16/9' },
  { type:'image', attr:'paid', source:'model', sourceName:'Flux Pro 1.1', title:'抽象流体艺术', author:'Abstract_Pro', likes:654, gradA:'#0d9488', gradB:'#22c55e', ratio:'1/1' },
  { type:'image', attr:'free', source:'model', sourceName:'Gemini Image', title:'古风人物写真', author:'Traditional_AI', likes:1876, gradA:'#b45309', gradB:'#ea580c', ratio:'3/4' },
  { type:'video', attr:'paid', source:'model', sourceName:'Kling 1.6', title:'旅行 Vlog 生成', author:'Travel_AI', likes:1543, gradA:'#0891b2', gradB:'#3b82f6', ratio:'9/16' },
  { type:'audio', attr:'free', source:'apps', sourceName:'AI 配音助手', sourceApp:'ai-dub', title:'治愈系 Lo-fi BGM', author:'Healing_Sound', likes:2340, gradA:'#16a34a', gradB:'#10b981', ratio:'1/1' },
  { type:'comic', attr:'free', source:'apps', sourceName:'漫剧分镜 App', sourceApp:'copywriting', title:'修仙世界·序章', author:'Xianxia_AI', likes:5678, gradA:'#7c3aed', gradB:'#6366f1', ratio:'2/3' },
  { type:'image', attr:'paid', source:'apps', sourceName:'电商一键生图', sourceApp:'product-shot', title:'电商主图·极简白底', author:'Ecom_AI', likes:892, gradA:'#52525b', gradB:'#a1a1aa', ratio:'1/1' },
  { type:'video', attr:'free', source:'model', sourceName:'Sora Turbo', title:'产品宣传片 15s', author:'BrandLab', likes:3210, gradA:'#1d4ed8', gradB:'#7c3aed', ratio:'16/9' },
  { type:'image', attr:'free', source:'model', sourceName:'Stable Diffusion XL', title:'水墨山水意境', author:'InkFlow', likes:1567, gradA:'#374151', gradB:'#6b7280', ratio:'4/5' },
  { type:'text', attr:'paid', source:'model', sourceName:'GPT-4o', title:'品牌 Slogan 创意合集', author:'BrandWriter', likes:756, gradA:'#4338ca', gradB:'#6366f1', ratio:'1/1' },
  { type:'comic', attr:'paid', source:'apps', sourceName:'短剧脚本 App', sourceApp:'copywriting', title:'都市恋爱·第3集', author:'Romance_AI', likes:2890, gradA:'#f472b6', gradB:'#fb7185', ratio:'3/5' }
];
var _inspSourceLabels = { model: '大模型', apps: 'App' };
var _inspDefaultParams = {
  image: 'Auto / 3:4 / 2k / 质量：中',
  video: '1080P / 16:9 / 5s / 运动：中',
  audio: '44.1kHz / 立体声 / 智能',
  text: 'temp:0.8 / max_tokens:2000',
  comic: '分镜 / 9:16 / 高清'
};
/** 灵感 → App 工作台（app-image-workspace-modal，与 Apps 页点击一致） */
var _inspAppsModalBySource = {
  'AI 漫剧工坊': { catalogId: 'comic-ws' },
  'ComfyUI 漫剧流': { catalogId: 'comic-ws' },
  '漫剧分镜 App': { catalogId: 'comic-ws' },
  '短剧脚本 App': { catalogId: 'comic-ws' },
  '一键视频生成': { catalogId: '4' },
  'AI 配音助手': { catalogId: '17' },
  '电商一键生图': { catalogId: '1' }
};
var _inspAppsCatalog = {
  'comic-ws': { id: 'comic-ws', cat: '视频', catKey: 'video', icon: '🎬', name: 'AI 漫剧工坊', desc: '输入故事剧本或梗概，AI 自动分镜生成漫剧，支持 10s 输出', price: '⚡1.0', uses: '6.8k', rating: '4.9', official: true, gradient: 'linear-gradient(135deg,#7c3aed,#ec4899)' },
  'gpt-image-2': { id: 'gpt-image-2', cat: '图像', catKey: 'image', icon: '🖼️', name: 'GPT Image2.0 文生图', desc: '新一代文生图，复杂提示词直出高清画面', price: '⚡0.6', uses: '9.1k', rating: '4.9', official: true, gradient: 'linear-gradient(135deg,#134e4a,#0d9488)' },
  'short-drama-full': { id: 'short-drama-full', cat: '视频', catKey: 'video', icon: '🎬', name: '短剧生成全流程', desc: '多分钟分镜图与图生视频一站式短剧生产', price: '⚡0.7', uses: '8.5k', rating: '4.9', official: true, gradient: 'linear-gradient(135deg,#0f172a,#14532d)' },
  'ltx2-digital-human-lipsync': { id: 'ltx2-digital-human-lipsync', cat: '视频', catKey: 'video', icon: '🧑‍💻', name: '一键生成数字人制作表情口型同步', desc: 'LTX-2 上传音频与人像，口型表情同步', price: '⚡0.7', uses: '2.4k', rating: '4.9', official: true, gradient: 'linear-gradient(135deg,#1e1b4b,#312e81)' },
  'video-face-swap-v1': { id: 'video-face-swap-v1', cat: '视频', catKey: 'video', icon: '🎭', name: '视频换脸', desc: '视频换脸 高清镜头换发型+自定义时长+真实自然换脸', price: '⚡0.7', uses: '319', rating: '4.9', official: true, gradient: 'linear-gradient(135deg,#1e3a5f,#7c3aed)', officialSamples: [{ gradient: 'linear-gradient(180deg,#0a0a0a,#141414)', coverImage: 'assets/video-face-swap-banner.png' }] },
  'wan22-motion-transfer': { id: 'wan22-motion-transfer', cat: '视频', catKey: 'video', icon: '🎞️', name: '视频动作迁移', desc: 'Wan2.2 动作迁移与角色注入', price: '⚡0.7', uses: '16', rating: '4.9', official: true, gradient: 'linear-gradient(135deg,#7c2d12,#ea580c)' },
  'wan22-keyframes-video': { id: 'wan22-keyframes-video', cat: '视频', catKey: 'video', icon: '🎥', name: '首尾帧视频', desc: 'wan2.2 首尾帧极速版，首帧尾帧插值视频', price: '⚡0.7', uses: '3.2k', rating: '4.9', official: true, gradient: 'linear-gradient(135deg,#0c4a6e,#0369a1)' },
  'index-tts2-voice': { id: 'index-tts2-voice', cat: '音频', catKey: 'audio', icon: '🎙️', name: 'IndexTTS2-语音克隆', desc: 'IndexTTS2 语音克隆，双人对话与情感音色迁移', price: '⚡0.7', uses: '61.6k', rating: '4.9', official: true, gradient: 'linear-gradient(135deg,#312e81,#2563eb)' },
  'character-replace-v3': { id: 'character-replace-v3', cat: '图像', catKey: 'image', icon: '🔄', name: '人物替换', desc: '人物替换-图片编辑 V3，目标人脸与场景图融合', price: '⚡0.7', uses: '75.8k', rating: '4.9', official: true, gradient: 'linear-gradient(135deg,#1e3a5f,#0f766e)' },
  'anime-couple-postcard': { id: 'anime-couple-postcard', cat: '图像', catKey: 'image', icon: '💌', name: '二次元情侣头像明信片', desc: '上传两张人像，一键生成二次元情侣头像明信片', price: '⚡0.7', uses: '1', rating: '4.9', official: true, gradient: 'linear-gradient(135deg,#1e1b4b,#be1858)' },
  'ecommerce-detail-gen': { id: 'ecommerce-detail-gen', cat: '图像', catKey: 'image', icon: '🛒', name: 'AI全自动电商详情页生成', desc: 'V3 直出 10 张电商详情页套图', price: '⚡0.7', uses: '77', rating: '4.9', official: true, gradient: 'linear-gradient(135deg,#ea580c,#f97316)' },
  'flux2-watermark-gen': { id: 'flux2-watermark-gen', cat: '图像', catKey: 'image', icon: '✨', name: '一键去水印', desc: 'FLUX2去水印万能改图单图版保持原图不变', price: '⚡0.7', uses: '0', rating: '4.9', official: true, gradient: 'linear-gradient(135deg,#312e81,#7c3aed)', officialSamples: [{ gradient: 'linear-gradient(135deg,#1e1b4b,#4c1d95)', coverImage: 'assets/flux2-watermark-banner.png' }] },
  'ecommerce-white-bg-scene': { id: 'ecommerce-white-bg-scene', cat: '图像', catKey: 'image', icon: '🛍️', name: '电商白底图智能生成场景', desc: '电商白底图智能生成场景', price: '⚡0.7', uses: '29', rating: '4.9', official: true, gradient: 'linear-gradient(135deg,#d4c4a8,#a8a29e)', officialSamples: [{ gradient: 'linear-gradient(180deg,#f5f0e8 0%,#e8e0d4 100%)', coverImage: 'assets/ecommerce-white-bg-scene-banner.png' }] },
  'ecommerce-model-gen-oneclick': { id: 'ecommerce-model-gen-oneclick', cat: '图像', catKey: 'image', icon: '👗', name: '-一键生成电商模特图', desc: '全能图片-2.0-图生图-一键生成电商模特图', price: '⚡0.7', uses: '491', rating: '4.9', official: true, gradient: 'linear-gradient(135deg,#1e3a5f,#7c3aed)', officialSamples: [{ gradient: 'linear-gradient(180deg,#1a1a2e 0%,#0f0f1a 100%)', coverImage: 'assets/ecommerce-model-gen-banner.png' }] },
  'ecommerce-digital-human': { id: 'ecommerce-digital-human', cat: '视频', catKey: 'video', icon: '🎙️', name: '电商口播数字人 表情+口型+声音克隆', desc: 'InfiniteTalk 口型+表情复刻+声音克隆', price: '⚡0.7', uses: '15.3k', rating: '4.9', official: true, gradient: 'linear-gradient(135deg,#7c2d12,#ea580c)' },
  'seedance20-ref-real': { id: 'seedance20-ref-real', cat: '视频', catKey: 'video', icon: '🎬', name: 'Seedance2.0 | 全能参考 · 支持真人', desc: 'Seedance 2.0 全能参考，角色卡+故事板，支持真人', price: '⚡0.7', uses: '19', rating: '4.9', official: true, gradient: 'linear-gradient(135deg,#1c1917,#78716c)' },
  'heartmula-song-voice': { id: 'heartmula-song-voice', cat: '音频', catKey: 'audio', icon: '🎵', name: 'HeartMula 文生歌曲 + 音色克隆', desc: '文生歌曲+音色克隆', price: '⚡0.7', uses: '150', rating: '4.9', official: true, gradient: 'linear-gradient(135deg,#1e3a8a,#2563eb)' },
  'person-model-gen': { id: 'person-model-gen', cat: '图像', catKey: 'image', icon: '👤', name: '人物模特生成', desc: '人像写真一键生成，智能核心训练版', price: '⚡0.5', uses: '20.6k', rating: '4.9', official: true, gradient: 'linear-gradient(135deg,#831843,#be1858)' },
  'image-to-360-panorama': { id: 'image-to-360-panorama', cat: '图像', catKey: 'image', icon: '🌐', name: '一键 图片 转 360全景图', desc: 'Qwen 2511 一键图转 360 全景', price: '⚡0.7', uses: '27', rating: '4.9', official: true, gradient: 'linear-gradient(135deg,#6b5344,#3d2f24)', officialSamples: [{ gradient: 'linear-gradient(180deg,#4a3728 0%,#2a2118 100%)', bannerPoster: true, posterStyle: 'panorama', coverImage: 'https://images.unsplash.com/photo-1600210492493-0946911123d1?w=900&q=82&auto=format&fit=crop' }] },
  'ecommerce-product-multiangle': { id: 'ecommerce-product-multiangle', cat: '图像', catKey: 'image', icon: '📦', name: '自动电商产品多角度生成', desc: '电商产品-自动产品多角度生成', price: '⚡0.7', uses: '5', rating: '4.9', official: true, gradient: 'linear-gradient(135deg,#c2410c,#ea580c)', officialSamples: [{ gradient: 'linear-gradient(180deg,#1a1a1a 0%,#0f0f0f 100%)', coverImage: 'assets/ecommerce-product-multiangle-banner.png' }] },
  'face-swap-outfit-v2': { id: 'face-swap-outfit-v2', cat: '图像', catKey: 'image', icon: '👤', name: '换脸换装', desc: '换脸换装 人物一致+自然真实全能通拟2.0人物一致', price: '⚡0.7', uses: '26', rating: '4.9', official: true, gradient: 'linear-gradient(135deg,#0f766e,#134e4a)', officialSamples: [{ gradient: 'linear-gradient(180deg,#1a2e2a 0%,#0d1f1c 100%)', bannerPoster: true, posterStyle: 'faceswap', coverImage: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=960&q=85&auto=format&fit=crop' }] },
  'ai-stylist-fitting-room': { id: 'ai-stylist-fitting-room', cat: '换装', catKey: 'tryon', icon: '👗', name: '试装间', desc: 'AI stylist 虚拟试装，上传全身照一键换装', price: '⚡2', uses: '1.2k', rating: '4.9', official: true, gradient: 'linear-gradient(135deg,#141414,#262626)', officialSamples: [{ gradient: 'linear-gradient(180deg,#0a0a0a 0%,#1a1a1a 100%)', coverImage: 'assets/fitting-room-banner.png' }] },
  'video-recast-v1': { id: 'video-recast-v1', cat: '视频', catKey: 'video', icon: '🎭', name: '视频换角色', desc: 'Recast · 视频中一键替换角色', price: '⚡2', uses: '860', rating: '4.9', official: true, gradient: 'linear-gradient(135deg,#0a0a0a,#1a1a1a)', officialSamples: [{ gradient: 'linear-gradient(180deg,#0a0a0a 0%,#141414 100%)', coverImage: 'assets/video-recast-preview.png' }] },
  'video-outfit-v1': { id: 'video-outfit-v1', cat: '视频', catKey: 'video', icon: '👗', name: '视频换装', desc: 'Urban Cuts · 音乐节拍同步换装短视频', price: '⚡34', uses: '620', rating: '4.9', official: true, gradient: 'linear-gradient(135deg,#0a0a0a,#1a1a1a)', officialSamples: [{ gradient: 'linear-gradient(180deg,#0a0a0a 0%,#141414 100%)', coverImage: 'assets/video-outfit-banner.png' }] },
  'old-photo-time-machine': { id: 'old-photo-time-machine', cat: '图像', catKey: 'image', icon: '📷', name: '旧照时光机', desc: '专业级一键修复老照片，瞬间定格旧时光', price: 'R 23', uses: '16', rating: '4.9', official: true, gradient: 'linear-gradient(135deg,#d4c4a8,#8b7355)', officialSamples: [{ gradient: 'linear-gradient(180deg,#f5efe6 0%,#e8dcc8 100%)', bannerPoster: true, coverImage: 'example1.png' }] },
  'omni-image-2': { id: 'omni-image-2', cat: '图像', catKey: 'image', icon: '🖼️', name: '全能图片2.0', desc: '文生图与图生图，支持低价渠道与官方稳定版', price: '⚡0.5', uses: '550.3k', rating: '4.9', official: true, gradient: 'linear-gradient(135deg,#1e3a5f,#7c3aed)' },
  '1': { id: '1', cat: '图像', catKey: 'image', icon: '🖼️', name: 'Qwen 图像编辑', desc: '智能修图、局部重绘与风格化', price: '⚡0.5', uses: '18.2k', rating: '4.9', official: true, gradient: 'linear-gradient(135deg,#4c1d95,#1e3a8a)' },
  '4': { id: '4', cat: '视频', catKey: 'video', icon: '🎬', name: 'PixVerse V6 图生视频', desc: '高清图生视频，支持 10s 输出', price: '⚡0.8', uses: '7.1k', rating: '4.9', official: true, gradient: 'linear-gradient(135deg,#0c4a6e,#164e63)' },
  '17': { id: '17', cat: '音频', catKey: 'audio', icon: '🎙️', name: 'AI 语音合成', desc: '多语种超拟人朗读与配音', price: '⚡0.4', uses: '8.2k', rating: '4.9', official: true, gradient: 'linear-gradient(135deg,#7c2d12,#9a3412)' }
};
var _inspTypeLabels = { image:'图片', video:'视频', audio:'音频', text:'文案', comic:'漫剧' };
var _inspTypeIcons = { image:'🖼️', video:'🎬', audio:'🎵', text:'📝', comic:'📚' };
var _inspDefaultModels = { image:'Flux Pro 1.1', video:'Kling 1.6', audio:'Stable Audio 2.0', text:'Claude 3.5 Sonnet', comic:'ComfyUI 工作流' };
window._inspCurrentDetail = null;
window._inspCommentsStore = window._inspCommentsStore || {};
window._inspFollowedAuthors = window._inspFollowedAuthors || {};
window._inspReplyTarget = null;

function _inspWorkKey(d) {
  if (!d) return '';
  return (d.title || '') + '|' + (d.author || '');
}

function _inspDefaultComments() {
  return [
    { user: 'NeonMaster', time: '2小时前', text: '效果太棒了，参数能分享吗？' },
    { user: 'Art_Genius', time: '昨天', text: '已同款，出图很快 👍' }
  ];
}

function _inspEscapeHtml(text) {
  return String(text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function syncInspirationSource(d) {
  var tag = document.getElementById('idm-source-tag');
  var nameEl = document.getElementById('idm-source-name');
  if (!tag || !d) return;
  var src = d.source === 'apps' ? 'apps' : 'model';
  tag.textContent = _inspSourceLabels[src] || '大模型';
  tag.dataset.src = src;
  var name = d.sourceName || '';
  if (!name && src === 'model') name = d.model || '';
  if (nameEl) {
    nameEl.textContent = name;
    nameEl.style.display = name ? '' : 'none';
  }
}

function syncInspirationFollowBtn() {
  var d = window._inspCurrentDetail;
  var btn = document.getElementById('idm-follow-btn');
  if (!btn || !d) return;
  var followed = !!window._inspFollowedAuthors[d.author];
  btn.textContent = followed ? '已关注' : '+ 关注';
  btn.classList.toggle('is-followed', followed);
}

function renderInspirationComments() {
  var d = window._inspCurrentDetail;
  var list = document.getElementById('idm-comment-list');
  var countEl = document.getElementById('idm-comment-count');
  if (!list || !d) return;
  var key = _inspWorkKey(d);
  if (!window._inspCommentsStore[key]) {
    window._inspCommentsStore[key] = _inspDefaultComments().slice();
  }
  var comments = window._inspCommentsStore[key];
  if (countEl) countEl.textContent = String(comments.length);
  if (!comments.length) {
    list.innerHTML = '<div class="insp-detail-modal__comment-empty">暂无评论，来说第一句吧</div>';
    return;
  }
  list.innerHTML = comments.map(function (c) {
    var user = _inspEscapeHtml(c.user);
    return '<article class="insp-detail-modal__comment-item">' +
      '<div class="insp-detail-modal__comment-meta">' +
        '<span class="insp-detail-modal__comment-user">' + user + '</span>' +
        '<span class="insp-detail-modal__comment-time">' + _inspEscapeHtml(c.time) + '</span>' +
      '</div>' +
      '<div class="insp-detail-modal__comment-body">' + _inspEscapeHtml(c.text) + '</div>' +
      '<button type="button" class="insp-detail-modal__comment-reply" data-reply-user="' + user + '">回复</button>' +
    '</article>';
  }).join('');
  list.querySelectorAll('.insp-detail-modal__comment-reply').forEach(function (btn) {
    btn.addEventListener('click', function () {
      replyInspirationComment(btn.getAttribute('data-reply-user'));
    });
  });
}

function updateInspirationCommentPlaceholder() {
  var input = document.getElementById('idm-comment-input');
  if (!input) return;
  input.placeholder = window._inspReplyTarget
    ? '回复 @' + window._inspReplyTarget + '…'
    : '说点什么…';
}

function postInspirationComment() {
  var d = window._inspCurrentDetail;
  var input = document.getElementById('idm-comment-input');
  if (!d || !input) return;
  var text = input.value.trim();
  if (!text) { showToast('请输入评论内容'); return; }
  if (window._inspReplyTarget) {
    text = '@' + window._inspReplyTarget + ' ' + text;
  }
  var key = _inspWorkKey(d);
  if (!window._inspCommentsStore[key]) {
    window._inspCommentsStore[key] = _inspDefaultComments().slice();
  }
  window._inspCommentsStore[key].unshift({ user: '我', time: '刚刚', text: text });
  input.value = '';
  window._inspReplyTarget = null;
  updateInspirationCommentPlaceholder();
  renderInspirationComments();
  showToast('💬 评论已发布');
}
window.postInspirationComment = postInspirationComment;

function replyInspirationComment(user) {
  window._inspReplyTarget = user || null;
  updateInspirationCommentPlaceholder();
  var input = document.getElementById('idm-comment-input');
  if (input) input.focus();
}
window.replyInspirationComment = replyInspirationComment;

function toggleInspirationFollow() {
  var d = window._inspCurrentDetail;
  if (!d || !d.author) return;
  var followed = !!window._inspFollowedAuthors[d.author];
  window._inspFollowedAuthors[d.author] = !followed;
  syncInspirationFollowBtn();
  showToast(!followed ? '✅ 已关注 ' + d.author : '👋 已取消关注 ' + d.author);
}
window.toggleInspirationFollow = toggleInspirationFollow;

var MYWORKS_SHARE_Z_DEFAULT = 200080;
var MYWORKS_SHARE_Z_STACKED = 200210;

function _isFavAppsPreviewOpen(modal) {
  if (!modal) return false;
  if (modal.classList.contains('fapm-open')) return true;
  var disp = modal.style.display;
  return disp === 'flex' || disp === 'block';
}

function _shareSheetParentState() {
  var ws = document.getElementById('app-image-workspace-modal');
  var copyWs = document.getElementById('app-copy-workspace-modal');
  var fav = document.getElementById('fav-apps-preview-modal');
  var insp = document.getElementById('insp-detail-modal');
  return {
    workspace: !!(ws && ws.classList.contains('open')),
    copyWorkspace: !!(copyWs && copyWs.classList.contains('open')),
    favApps: _isFavAppsPreviewOpen(fav),
    inspDetail: !!(insp && insp.classList.contains('open'))
  };
}

function _shareSheetResolveZIndex(opts) {
  if (opts && opts.zIndex != null) return opts.zIndex;
  if (opts && opts.stacked) return MYWORKS_SHARE_Z_STACKED;
  var p = _shareSheetParentState();
  if (p.workspace || p.copyWorkspace || p.favApps) return MYWORKS_SHARE_Z_STACKED;
  if (p.inspDetail) return MYWORKS_SHARE_Z_STACKED;
  return MYWORKS_SHARE_Z_DEFAULT;
}

function _restoreScrollAfterShareClose() {
  var p = _shareSheetParentState();
  if (p.workspace || p.copyWorkspace || p.favApps) {
    document.body.style.overflow = 'hidden';
    return;
  }
  if (document.querySelector('.modal-overlay.open')) {
    document.body.style.overflow = 'hidden';
    return;
  }
  document.body.style.overflow = '';
}

window.openMyworksShare = function (opts) {
  opts = opts || {};
  var modal = document.getElementById('myworks-share-modal');
  if (!modal) return;
  var z = _shareSheetResolveZIndex(opts);
  modal.style.zIndex = String(z);
  modal.classList.toggle('myworks-share--stacked', z >= MYWORKS_SHARE_Z_STACKED);
  var panel = document.getElementById('myworks-share-panel');
  if (panel) panel.style.transform = 'translateY(100%)';
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      if (panel) {
        panel.style.transition = 'transform 0.25s cubic-bezier(0.32,0.72,0,1)';
        panel.style.transform = 'translateY(0)';
      }
    });
  });
};

window.closeMyworksShare = function () {
  var modal = document.getElementById('myworks-share-modal');
  var panel = document.getElementById('myworks-share-panel');
  if (panel) {
    panel.style.transition = 'transform 0.2s cubic-bezier(0.32,0.72,0,1)';
    panel.style.transform = 'translateY(100%)';
  }
  setTimeout(function () {
    if (modal) {
      modal.style.display = 'none';
      modal.style.zIndex = String(MYWORKS_SHARE_Z_DEFAULT);
      modal.classList.remove('myworks-share--stacked');
    }
    _restoreScrollAfterShareClose();
  }, 200);
};

function openInspirationShare() {
  if (typeof openMyworksShare === 'function') {
    openMyworksShare();
    return;
  }
  showToast('📤 分享功能暂不可用');
}
window.openInspirationShare = openInspirationShare;

function _inspResolveCardMeta(card) {
  var views = card.views || Math.floor(card.likes * 2.4 + 180);
  var uses = card.uses || Math.floor(card.likes * 0.12 + 8);
  var model = card.model || _inspDefaultModels[card.type] || 'GPT-4o';
  var price = card.price || (card.attr === 'free' ? '免费' : '⚡0.50');
  var params = card.params || _inspDefaultParams[card.type] || '';
  var prompt = card.prompt || (
    card.type === 'text'
      ? '请以「' + card.title + '」为核心，输出 3 条适合小红书/抖音的种草文案，语气自然、有场景感，并附带 5 个热门标签。'
      : card.type === 'video'
        ? 'Cinematic shot of ' + card.title + ', smooth camera motion, 4K, professional color grading, highly detailed'
        : 'Masterpiece, ' + card.title + ', ultra detailed, professional lighting, 8K, trending on artstation --ar 3:4'
  );
  return { views: views, uses: uses, model: model, price: price, prompt: prompt, params: params };
}

function _inspPageForType(type) {
  var map = { image: 'image', video: 'video', audio: 'audio', text: 'chat', comic: 'apps' };
  return map[type] || 'image';
}

function _inspIsComicRelated(d) {
  if (!d) return false;
  if (d.type === 'comic') return true;
  var text = (d.title || '') + (d.sourceName || '');
  return /漫剧|AI\s*漫剧/i.test(text);
}

function _inspPrefillAiwsPrompt(prompt) {
  if (!prompt) return;
  setTimeout(function () {
    var form = document.getElementById('aiws-params-form');
    if (!form) return;
    var ta = form.querySelector('textarea');
    if (ta) ta.value = prompt;
  }, 50);
}

function _inspOpenAppWorkspaceFromCatalog(catalogId) {
  var app = _inspAppsCatalog[String(catalogId)];
  if (!app || typeof openAppTemplateModal !== 'function') return false;
  openAppTemplateModal(
    app.cat, app.icon, app.name, app.desc, app.price, app.uses + ' 次使用', app.rating,
    { catKey: app.catKey, gradient: app.gradient, id: app.id, official: app.official }
  );
  _inspPrefillAiwsPrompt(window._inspAppPrefillPrompt || '');
  return true;
}

function _inspOpenAppViaIframe(appId) {
  if (_inspOpenAppWorkspaceFromCatalog(appId)) return true;
  var iframe = document.getElementById('apps-iframe');
  if (!iframe || !iframe.contentWindow) return false;
  try {
    iframe.contentWindow.postMessage({ type: 'guid-parent', action: 'openApp', id: String(appId) }, '*');
    _inspPrefillAiwsPrompt(window._inspAppPrefillPrompt || '');
    return true;
  } catch (e) {
    return false;
  }
}

/** 打开对应 App 工作台（与 Apps 页点击应用一致） */
function _inspOpenAppsModalForDetail(d) {
  if (!d) return false;
  var prompt = d.prompt || '';
  var params = d.params || '';
  _inspCopyPromptAndParams(prompt, params);
  window._inspAppPrefillPrompt = prompt;

  var name = d.sourceName || '';
  var mapping = _inspAppsModalBySource[name];
  if (!mapping && _inspIsComicRelated(d)) mapping = { catalogId: 'comic-ws' };

  var catalogId = mapping && (mapping.catalogId || mapping.appId);
  if (catalogId && _inspOpenAppWorkspaceFromCatalog(catalogId)) {
    var app = _inspAppsCatalog[String(catalogId)];
    showToast('🚀 已打开「' + (app ? app.name : 'App') + '」');
    return true;
  }

  if (_inspIsComicRelated(d) && _inspOpenAppWorkspaceFromCatalog('comic-ws')) {
    showToast('🚀 已打开「AI 漫剧工坊」');
    return true;
  }

  return false;
}

function _inspRatioFromCard(d) {
  if (!d || !d.ratio) return '';
  return String(d.ratio).replace('/', ':');
}

function _inspCopyPromptAndParams(prompt, params) {
  var text = '【提示词】\n' + (prompt || '') + '\n\n【参数】\n' + (params || '');
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(function () {});
  }
}

function _inspSelectMatchValue(select, token) {
  if (!select || !token) return;
  token = String(token).trim();
  var opts = Array.prototype.slice.call(select.options);
  for (var i = 0; i < opts.length; i++) {
    var t = opts[i].textContent || '';
    if (t.indexOf(token) >= 0 || token.indexOf(t) >= 0) {
      select.value = opts[i].value;
      return;
    }
  }
}

function _inspApplyModel(pageEl, modelName) {
  if (!pageEl || !modelName) return;
  pageEl.querySelectorAll('select').forEach(function (sel) {
    Array.prototype.slice.call(sel.options).forEach(function (opt) {
      if ((opt.textContent || '').indexOf(modelName) >= 0 || modelName.indexOf(opt.textContent || '') >= 0) {
        sel.value = opt.value;
      }
    });
  });
}

function _inspApplyParamsToSelects(pageEl, paramsStr, ratio) {
  if (!pageEl) return;
  var parts = (paramsStr || '').split('/').map(function (s) { return s.trim(); }).filter(Boolean);
  if (ratio) parts.push(ratio);
  var selects = pageEl.querySelectorAll('select');
  parts.forEach(function (part) {
    selects.forEach(function (sel) { _inspSelectMatchValue(sel, part); });
  });
}

function applyInspirationToCreationPage(pageId, d) {
  if (!d) return;
  var pageEl = document.getElementById('page-' + pageId);
  if (!pageEl) return;
  var prompt = d.prompt || '';
  var model = d.source === 'model' ? (d.sourceName || d.model) : (d.model || '');
  var ta = null;
  if (pageId === 'chat') ta = document.getElementById('chat-input');
  else if (pageId === 'image') ta = document.getElementById('image-prompt-input');
  else if (pageId === 'video') ta = document.getElementById('video-prompt-textarea');
  else if (pageId === 'audio') ta = document.getElementById('audio-prompt-textarea');
  if (ta) ta.value = prompt;
  _inspApplyModel(pageEl, model);
  _inspApplyParamsToSelects(pageEl, d.params, _inspRatioFromCard(d));
}

function _executeUseInspiration(d) {
  if (!d) return;
  if (d.source === 'apps' || _inspIsComicRelated(d)) {
    if (_inspOpenAppsModalForDetail(d)) return;
    if (typeof showPage === 'function') showPage('apps');
    showToast('🚀 已跳转 Apps，请手动选择应用');
    return;
  }
  var prompt = d.prompt || '';
  var params = d.params || '';
  _inspCopyPromptAndParams(prompt, params);

  var page = _inspPageForType(d.type);
  var pageNames = { chat: '文字', image: '图片', video: '视频', audio: '音频' };
  if (typeof showPage === 'function') showPage(page);
  requestAnimationFrame(function () {
    applyInspirationToCreationPage(page, d);
  });
  showToast('🚀 已跳转' + (pageNames[page] || '创作') + '页，提示词与参数已填入并复制');
}
window.applyInspirationToCreationPage = applyInspirationToCreationPage;
window._executeUseInspiration = _executeUseInspiration;

function openInspirationDetail(data) {
  if (!data) return;
  var meta = _inspResolveCardMeta(data);
  if (!data.prompt) data.prompt = meta.prompt;
  if (!data.params) data.params = meta.params;
  if (!data.model) data.model = meta.model;
  if (!data.price) data.price = meta.price;
  if (data.views == null) data.views = meta.views;
  if (data.uses == null) data.uses = meta.uses;
  window._inspCurrentDetail = data;
  var modal = document.getElementById('insp-detail-modal');
  if (!modal) return;
  var typeLabel = _inspTypeLabels[data.type] || data.type || '作品';
  var typeTag = document.getElementById('idm-type-tag');
  if (typeTag) typeTag.textContent = typeLabel;
  var priceTag = document.getElementById('idm-price-tag');
  if (priceTag) {
    var isFree = data.attr === 'free' || data.price === '免费';
    priceTag.textContent = isFree ? '免费' : '付费';
    priceTag.className = 'insp-detail-modal__tag insp-detail-modal__tag--price' + (isFree ? '' : ' insp-detail-modal__tag--paid');
  }
  var titleEl = document.getElementById('idm-title');
  if (titleEl) titleEl.textContent = data.title || '—';
  var viewsEl = document.getElementById('idm-views');
  if (viewsEl) viewsEl.textContent = _inspFormatLikes(Number(data.views) || 0);
  var likesEl = document.getElementById('idm-likes');
  if (likesEl) likesEl.textContent = _inspFormatLikes(Number(data.likes) || 0);
  var usesEl = document.getElementById('idm-uses');
  if (usesEl) usesEl.textContent = _inspFormatLikes(Number(data.uses) || 0);
  var modelEl = document.getElementById('idm-model');
  if (modelEl) modelEl.textContent = data.model || '—';
  var priceEl = document.getElementById('idm-price');
  if (priceEl) {
    priceEl.textContent = data.price || '免费';
    var paid = data.attr === 'paid' || (data.price && data.price !== '免费');
    priceEl.className = 'insp-detail-modal__kv-value insp-detail-modal__price' + (paid ? ' is-paid' : '');
  }
  syncInspirationSource(data);
  var authorEl = document.getElementById('idm-author');
  if (authorEl) authorEl.textContent = data.author || data.user || '创作者';
  var avatarEl = document.getElementById('idm-avatar');
  if (avatarEl) avatarEl.textContent = (data.author || '创').slice(0, 1).toUpperCase();
  var promptEl = document.getElementById('idm-prompt');
  if (promptEl) promptEl.textContent = data.prompt || '—';
  var media = document.getElementById('idm-media');
  if (media) {
    if (data.mediaGradient) media.style.background = data.mediaGradient;
    else media.style.background = 'linear-gradient(135deg,' + (data.gradA || '#1a2030') + ',' + (data.gradB || '#121820') + ')';
  }
  var iconEl = document.getElementById('idm-media-icon');
  if (iconEl) iconEl.textContent = data.mediaEmoji || _inspTypeIcons[data.type] || '✨';
  if (typeof applyExamplePreviewToInspMedia === 'function') applyExamplePreviewToInspMedia(data.type);
  var useBtn = document.getElementById('idm-use-btn');
  if (useBtn) {
    var isPaid = data.attr === 'paid';
    useBtn.className = 'insp-detail-modal__cta' + (isPaid ? ' is-paid' : '');
    useBtn.textContent = isPaid ? ('使用此灵感 · ' + (data.price || '付费')) : '使用这个灵感';
  }
  var favBtn = document.getElementById('idm-fav-btn');
  if (favBtn) { favBtn.textContent = '☆'; favBtn.classList.remove('is-fav'); }
  window._inspReplyTarget = null;
  updateInspirationCommentPlaceholder();
  var commentInput = document.getElementById('idm-comment-input');
  if (commentInput) commentInput.value = '';
  syncInspirationFollowBtn();
  renderInspirationComments();
  var preserve = window._inspPreserveModalIds || [];
  window._inspPreserveModalIds = null;
  if (typeof openModal === 'function') openModal('insp-detail-modal', { preserve: preserve });
}
window.openInspirationDetail = openInspirationDetail;

function _isFapmPreviewOpen() {
  var fapm = document.getElementById('fav-apps-preview-modal');
  return !!(fapm && fapm.style.display === 'flex');
}

function _appsParentModalOpen() {
  var ws = document.getElementById('app-image-workspace-modal');
  return !!(ws && ws.classList.contains('open')) || _isFapmPreviewOpen();
}

function _appsRestoreParentScrollLock() {
  if (_appsParentModalOpen()) document.body.style.overflow = 'hidden';
}

function _appsParseGradientColors(gradient) {
  if (!gradient) return { gradA: '#1a2030', gradB: '#121820' };
  var hexes = String(gradient).match(/#[0-9a-fA-F]{3,8}/g);
  if (hexes && hexes.length >= 2) return { gradA: hexes[0], gradB: hexes[1] };
  if (hexes && hexes.length === 1) return { gradA: hexes[0], gradB: hexes[0] };
  return { gradA: '#1a2030', gradB: '#121820' };
}

function openAppsPublicWorkPreview(work, ctx) {
  if (!work) return;
  ctx = ctx || {};
  var colors = _appsParseGradientColors(work.gradient);
  var sourceName = ctx.sourceName || (typeof aiwsState !== 'undefined' && aiwsState.title) || '';
  if(ctx.preserve&&ctx.preserve.length){
    window._inspPreserveModalIds=ctx.preserve.slice();
  }else if(ctx.stacked){
    var stackedPreserve=['app-image-workspace-modal'];
    var oiwsEl=document.getElementById('omni-image-workspace-modal');
    if(oiwsEl&&oiwsEl.classList.contains('open'))stackedPreserve=['omni-image-workspace-modal'];
    window._inspPreserveModalIds=stackedPreserve;
  }else{
    window._inspPreserveModalIds=[];
  }
  openInspirationDetail({
    title: work.title || ((work.user || '用户') + ' 的作品'),
    author: work.user || work.author || '创作者',
    type: work.type || 'image',
    attr: work.attr || ((work.price && work.price !== '免费') ? 'paid' : 'free'),
    likes: work.likes != null ? work.likes : 48,
    views: work.views != null ? work.views : 320,
    uses: work.uses != null ? work.uses : 12,
    model: work.model || '—',
    prompt: work.prompt || '—',
    price: work.price || '免费',
    params: work.params || '',
    gradA: work.gradA || colors.gradA,
    gradB: work.gradB || colors.gradB,
    mediaGradient: work.gradient || '',
    mediaEmoji: work.emoji || '',
    source: 'apps',
    sourceName: sourceName
  });
  var modal = document.getElementById('insp-detail-modal');
  if (modal) modal.classList.toggle('insp-detail-modal--stacked', !!ctx.stacked);
}
window.openAppsPublicWorkPreview = openAppsPublicWorkPreview;

function openInspirationDetailFromCard(el) {
  if (!el || !el.dataset) return;
  openInspirationDetail({
    title: el.dataset.title,
    author: el.dataset.author,
    type: el.dataset.type,
    attr: el.dataset.attr,
    likes: el.dataset.likes,
    views: el.dataset.views,
    uses: el.dataset.uses,
    model: el.dataset.model,
    prompt: el.dataset.prompt,
    price: el.dataset.price,
    gradA: el.dataset.gradA,
    gradB: el.dataset.gradB,
    source: el.dataset.source,
    sourceName: el.dataset.sourceName,
    sourceApp: el.dataset.sourceApp,
    params: el.dataset.params,
    ratio: el.dataset.ratio
  });
}
window.openInspirationDetailFromCard = openInspirationDetailFromCard;

function closeInspirationDetail() {
  window._inspReplyTarget = null;
  var modal = document.getElementById('insp-detail-modal');
  if (modal) modal.classList.remove('insp-detail-modal--stacked');
  if (typeof closeModal === 'function') closeModal('insp-detail-modal');
  _appsRestoreParentScrollLock();
  window._inspCurrentDetail = null;
}
window.closeInspirationDetail = closeInspirationDetail;

function useInspirationDetail() {
  var d = window._inspCurrentDetail;
  if (!d) return;
  var wsModal = document.getElementById('app-image-workspace-modal');
  var wsOpen = wsModal && wsModal.classList.contains('open');
  if (wsOpen && d.source === 'apps' && d.sourceName && typeof aiwsState !== 'undefined' && aiwsState.title && d.sourceName === aiwsState.title) {
    _inspPrefillAiwsPrompt(d.prompt || '');
    closeInspirationDetail();
    if (typeof showToast === 'function') showToast('已填入提示词');
    return;
  }
  if (d.attr === 'paid' && typeof openModal === 'function') {
    var purchaseTitle = document.getElementById('purchase-title');
    if (purchaseTitle) purchaseTitle.textContent = d.title || '';
    window._inspPendingUse = Object.assign({}, d);
    closeInspirationDetail();
    openModal('purchase-modal');
    return;
  }
  closeInspirationDetail();
  _executeUseInspiration(d);
}
window.useInspirationDetail = useInspirationDetail;

(function patchInspirationPurchaseConfirm() {
  function apply() {
    var btn = document.querySelector('.confirm-pay');
    if (!btn || btn._inspPurchasePatched) return;
    btn.addEventListener('click', function (e) {
      if (!window._inspPendingUse) return;
      e.stopImmediatePropagation();
      var pending = window._inspPendingUse;
      window._inspPendingUse = null;
      if (typeof pressAnim === 'function') pressAnim(btn);
      showToast('⏳ 扣费中...');
      setTimeout(function () {
        if (typeof closeModal === 'function') {
          closeModal('purchase-modal');
          closeModal('detail-modal');
          closeModal('insp-detail-modal');
        }
        _executeUseInspiration(pending);
      }, 800);
    }, true);
    btn._inspPurchasePatched = true;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();
})();

function copyInspirationPrompt() {
  var text = document.getElementById('idm-prompt')?.textContent || '';
  if (navigator.clipboard && text) {
    navigator.clipboard.writeText(text).then(function () { showToast('📋 提示词已复制'); }).catch(function () { showToast('📋 提示词已复制'); });
  } else showToast('📋 提示词已复制');
}
window.copyInspirationPrompt = copyInspirationPrompt;

function toggleInspirationFav(btn) {
  if (!btn) return;
  var on = btn.classList.toggle('is-fav');
  btn.textContent = on ? '★' : '☆';
  showToast(on ? '⭐ 已收藏' : '已取消收藏');
}
window.toggleInspirationFav = toggleInspirationFav;

function openInspirationSidebar() {}
function closeInspirationSidebar() {}
window.openInspirationSidebar = openInspirationSidebar;
window.closeInspirationSidebar = closeInspirationSidebar;

function _inspGetRoot() {
  return document.getElementById('page-inspiration') || document.getElementById('page-inspiration-mobile');
}

function closeInspirationAnnounce() {
  var page = _inspGetRoot();
  if (page) page.classList.add('insp-announce-closed');
}
window.closeInspirationAnnounce = closeInspirationAnnounce;

window.toggleInspMobFilterSheet = function (open) {
  var sheet = document.getElementById('insp-mob-filter-sheet');
  var backdrop = document.getElementById('insp-mob-filter-backdrop');
  if (!sheet) return;
  var show = open === undefined ? sheet.getAttribute('aria-hidden') !== 'false' : !!open;
  sheet.setAttribute('aria-hidden', show ? 'false' : 'true');
  sheet.classList.toggle('is-open', show);
  if (backdrop) {
    backdrop.setAttribute('aria-hidden', show ? 'false' : 'true');
    backdrop.classList.toggle('is-open', show);
  }
  document.body.style.overflow = show ? 'hidden' : '';
};

function _inspFormatLikes(n) {
  if (n >= 10000) return (n / 10000).toFixed(1).replace(/\.0$/, '') + '万';
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
}

function generateGalleryCards() {
  var grid = document.getElementById('masonry-grid');
  if (!grid) return;
  grid.innerHTML = '';
  _inspirationSampleCards.forEach(function (card, idx) {
    var meta = _inspResolveCardMeta(card);
    var el = document.createElement('article');
    el.className = 'insp-card gallery-card-enter';
    el.dataset.type = card.type;
    el.dataset.attr = card.attr;
    el.dataset.title = card.title;
    el.dataset.author = card.author;
    el.dataset.likes = String(card.likes);
    el.dataset.views = String(meta.views);
    el.dataset.uses = String(meta.uses);
    el.dataset.model = meta.model;
    el.dataset.prompt = meta.prompt;
    el.dataset.price = meta.price;
    el.dataset.gradA = card.gradA;
    el.dataset.gradB = card.gradB;
    el.dataset.source = card.source || 'model';
    el.dataset.sourceName = card.sourceName || meta.model || '';
    el.dataset.params = meta.params;
    el.dataset.ratio = card.ratio || '';
    if (card.sourceApp) el.dataset.sourceApp = card.sourceApp;
    el.style.setProperty('--insp-grad-a', card.gradA);
    el.style.setProperty('--insp-grad-b', card.gradB);
    var badgeClass = card.attr === 'free' ? 'insp-card-badge--free' : 'insp-card-badge--paid';
    var badgeText = card.attr === 'free' ? '免费' : '付费';
    el.innerHTML =
      '<div class="insp-card-media">' +
        '<div class="insp-card-thumb" style="aspect-ratio:' + card.ratio + '"></div>' +
        '<span class="insp-card-type">' + (_inspTypeLabels[card.type] || card.type) + '</span>' +
        '<span class="insp-card-badge ' + badgeClass + '">' + badgeText + '</span>' +
        '<div class="insp-card-overlay"><button type="button" class="insp-card-use">一键同款</button></div>' +
      '</div>' +
      '<div class="insp-card-foot">' +
        '<div class="insp-card-title">' + card.title + '</div>' +
        '<div class="insp-card-meta">' +
          '<span class="insp-card-author">@' + card.author + '</span>' +
          '<span>♥ ' + _inspFormatLikes(card.likes) + '</span>' +
        '</div>' +
      '</div>';
    el.querySelector('.insp-card-use')?.addEventListener('click', function (e) {
      e.stopPropagation();
      openInspirationDetailFromCard(el);
      useInspirationDetail();
    });
    el.addEventListener('click', function () {
      openInspirationDetailFromCard(el);
    });
    setTimeout(function () { el.classList.remove('gallery-card-enter'); }, 400 + idx * 40);
    grid.appendChild(el);
  });
}

function filterGallery() {
  var root = _inspGetRoot();
  if (!root) return;
  var activeType = root.querySelector('.insp-chips[data-chip-group="type"] .insp-chip.active')?.dataset.type;
  var activeAttr = root.querySelector('.insp-chips[data-chip-group="attr"] .insp-chip.active')?.dataset.attr;
  var q = (document.getElementById('inspiration-search')?.value || '').trim().toLowerCase();
  root.querySelectorAll('#masonry-grid .insp-card').forEach(function (card) {
    var show = true;
    if (activeType && activeType !== 'all' && card.dataset.type !== activeType) show = false;
    if (show && activeAttr && activeAttr !== 'all' && card.dataset.attr !== activeAttr) show = false;
    if (show && q) {
      var title = card.querySelector('.insp-card-title')?.textContent || '';
      var author = card.querySelector('.insp-card-author')?.textContent || '';
      if (title.toLowerCase().indexOf(q) < 0 && author.toLowerCase().indexOf(q) < 0) show = false;
    }
    if (show) {
      card.classList.remove('gallery-card-exit');
      card.classList.add('gallery-card-enter');
      card.style.display = '';
      setTimeout(function () { card.classList.remove('gallery-card-enter'); }, 300);
    } else {
      card.classList.add('gallery-card-exit');
      card.classList.remove('gallery-card-enter');
      setTimeout(function () { card.style.display = 'none'; }, 250);
    }
  });
}

function _inspSyncChips(root, group, activeChip) {
  var key = group === 'type' ? 'type' : 'attr';
  var val = activeChip.dataset[key];
  root.querySelectorAll('.insp-chips[data-chip-group="' + group + '"] .insp-chip').forEach(function (c) {
    c.classList.toggle('active', c.dataset[key] === val);
  });
}

function _inspSyncNavFilter(root, activeBtn) {
  var val = activeBtn.dataset.filter;
  root.querySelectorAll('.insp-nav-item[data-filter]').forEach(function (b) {
    b.classList.toggle('active', b.dataset.filter === val);
  });
}

function bindInspirationPage() {
  if (_inspirationBound) return;
  var root = _inspGetRoot();
  if (!root) return;
  _inspirationBound = true;
  root.querySelectorAll('.insp-nav-item[data-filter]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      _inspSyncNavFilter(root, btn);
      showToast('🔍 ' + btn.textContent.trim());
    });
  });
  root.querySelectorAll('.insp-chips[data-chip-group="type"] .insp-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      _inspSyncChips(root, 'type', chip);
      filterGallery();
    });
  });
  root.querySelectorAll('.insp-chips[data-chip-group="attr"] .insp-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      _inspSyncChips(root, 'attr', chip);
      filterGallery();
    });
  });
  root.querySelectorAll('.insp-nav-item[data-official]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.getAttribute('data-official');
      if (key === 'comic') {
        window._inspAppPrefillPrompt = '';
        if (_inspOpenAppWorkspaceFromCatalog('comic-ws')) {
          showToast('🎬 已打开 AI 漫剧工坊');
        } else {
          showToast('🎬 漫剧工坊暂不可用');
        }
        return;
      }
      showToast('🎬 进入「' + btn.textContent.trim() + '」');
    });
  });
  document.getElementById('inspiration-search')?.addEventListener('input', function () {
    clearTimeout(bindInspirationPage._searchTimer);
    bindInspirationPage._searchTimer = setTimeout(filterGallery, 200);
  });
  root.querySelector('.load-more-gallery')?.addEventListener('click', function () {
    if (typeof pressAnim === 'function') pressAnim(this);
    showToast('🔄 已加载更多灵感');
  });
  root.querySelector('.insp-mob-filter-open')?.addEventListener('click', function () {
    toggleInspMobFilterSheet(true);
  });
  document.getElementById('insp-mob-filter-apply')?.addEventListener('click', function () {
    filterGallery();
    toggleInspMobFilterSheet(false);
    showToast('✅ 筛选已应用');
  });
  document.getElementById('idm-comment-input')?.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      postInspirationComment();
    }
  });
}

function initInspirationPage() {
  bindInspirationPage();
  if (!document.querySelector('#masonry-grid .insp-card')) generateGalleryCards();
}
window.initInspirationPage = initInspirationPage;

(function () {
  function boot() {
    var mobPage = document.getElementById('page-inspiration-mobile');
    if (mobPage) mobPage.classList.add('is-active');
    bindInspirationPage();
    if (document.getElementById('page-inspiration')?.classList.contains('active') || mobPage) initInspirationPage();
    else if (document.getElementById('masonry-grid')) generateGalleryCards();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

// ===== V19.0 打字机动效 =====
(function(){
  const phrases = [
    '写一份商业计划书...',
    '生成一张赛博朋克插画...',
    '制作一段音乐MV...',
    '克隆你的专属声音...',
    '创作一个AI漫剧...'
  ];
  let phraseIndex = 0, charIndex = 0, isDeleting = false;
  const el = document.getElementById('typewriter-text');
  if (!el) return;
  function tick() {
    const current = phrases[phraseIndex];
    let speed = isDeleting ? 40 : 80;
    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }
    if (!isDeleting && charIndex === current.length) {
      isDeleting = true; speed = 1800;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; speed = 400;
    }
    setTimeout(tick, speed);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tick);
  } else { tick(); }
})();
function pressAnim(el) { if(!el)return; el.style.transition='transform .12s'; el.style.transform='scale(0.93)'; setTimeout(()=>el.style.transform='scale(1)',120); }

// ===== 角色管理功能 =====
window.selectRoleFromModal=function(name,icon){
  pressAnim(event?.target);
  if(document.getElementById('page-chat')?.classList.contains('active')){selectChatRole(name);}else{
    const pill=[...document.querySelectorAll('.page-section.active .role-avatar')].find(x=>x.textContent.includes(name));
    if(pill)pill.click();else showToast('👤 已选择「'+name+'」');
  }
  closeModal('role-modal');
};
window.createNewRole=function(){
  const name=document.getElementById('new-role-name')?.value.trim();
  if(!name){showToast('⚠️ 请输入角色名称');return;}
  const prompt=document.getElementById('new-role-prompt')?.value.trim()||'';
  if(!prompt){showToast('⚠️ 请输入系统提示词');return;}
  if(!window.customRoles)window.customRoles=[];
  window.customRoles.push({name,desc:document.getElementById('new-role-desc')?.value.trim()||'自定义角色',prompt,icon:'🎭'});
  closeModal('role-modal');
  setTimeout(()=>{
    const div=document.createElement('div');div.className='modal-overlay open';div.id='role-success-modal';
    div.innerHTML='<div class="modal-content p-5" style="max-width:420px"><div class="text-center mb-4"><div class="text-3xl mb-2">✅</div><div class="text-base font-bold mb-1">角色创建成功</div><div class="text-xs text-gray-500">角色「'+name+'」已添加到「我的角色」列表</div></div><div class="flex gap-2"><button onclick="closeModal(\'role-success-modal\');useNewRole()" class="flex-1 py-2 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600">立即使用</button><button onclick="closeModal(\'role-success-modal\');setTimeout(function(){openModal(\'role-modal\')},100)" class="flex-1 py-2 text-xs border border-gray-200 rounded-lg hover:bg-gray-50">继续创建</button><button onclick="closeModal(\'role-success-modal\');openModal(\'role-modal\')" class="flex-1 py-2 text-xs border border-gray-200 rounded-lg hover:bg-gray-50">查看我的角色</button></div></div>';
    document.body.appendChild(div);
    document.getElementById('new-role-name').value='';document.getElementById('new-role-desc').value='';document.getElementById('new-role-prompt').value='';const cc=document.getElementById('prompt-char-count');if(cc)cc.textContent='0';
  },300);
};
window.useNewRole=function(){
  const cr=window.customRoles||[];const last=cr[cr.length-1];if(!last)return;
  const list=document.querySelector('#page-chat .role-avatar')?.closest('.flex');
  if(list){const pill=document.createElement('span');pill.className='role-avatar text-[11px] px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 border-blue-500 cursor-pointer shrink-0';pill.innerHTML='🎭 '+last.name;pill.onclick=function(){selectChatRole(last.name);};list.insertBefore(pill,list.querySelector('button')||list.querySelector('.current-role'));selectChatRole(last.name);}
  showToast('✅ 已应用角色「'+last.name+'」');
};
// ===== 参考图区域 =====
window.addRefImage=function(){
  var section=document.querySelector('.page-section.active');
  var area;
  if(section?.id==='page-image'){area=document.getElementById('ref-image-area');}else if(section?.id==='page-video'){area=document.getElementById('video-ref-area');}
  if(!area){showToast('📂 打开文件选择器');return;}
  // 显示所在的 section
  var refSection=area.closest('.mb-4');
  if(refSection)refSection.classList.remove('hidden');
  // 统计已有缩略图（不含 + 按钮和文字）
  var thumbs=area.querySelectorAll(':scope > div:not(.border-dashed):not(.text-\\[9px\\])');
  var max=section?.id==='page-image'?14:7;
  if(thumbs.length>=max){showToast('⚠️ 最多支持'+max+'张');return;}
  var colors=['from-blue-200 to-purple-200','from-green-200 to-teal-200','from-amber-200 to-orange-200','from-pink-200 to-rose-200','from-indigo-200 to-blue-200','from-emerald-200 to-green-200','from-violet-200 to-purple-200','from-cyan-200 to-blue-200'];
  var icons=['🖼️','🌃','📦','👤','🎋','🍜','🚀','🏔️'];
  var idx=thumbs.length%icons.length;
  var div=document.createElement('div');
  div.className='w-14 h-14 rounded-xl bg-gradient-to-br '+colors[idx]+' dark:bg-gradient-to-br '+colors[idx].replace('200','700')+' relative shrink-0 cursor-pointer overflow-hidden';
  div.onclick=function(){pressAnim(this);showToast('🔍 预览');};
  div.innerHTML='<div class="w-full h-full flex items-center justify-center text-white text-lg">'+icons[idx]+'</div><button class="del-thumb absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[8px] flex items-center justify-center hover:bg-red-600" onclick="event.stopPropagation();removeRefThumb(this)">✕</button>';
  area.insertBefore(div,area.querySelector('.border-dashed')||area.lastElementChild);
  showToast('✅ 已添加 1 张');
};
window.addAudioRef=function(){
  var area=document.getElementById('video-ref-area');
  if(!area){showToast('📂 打开文件选择器');return;}
  var refSection=area.closest('.mb-4');
  if(refSection)refSection.classList.remove('hidden');
  if(area.querySelector('.audio-thumb')){showToast('⚠️ 最多1条音频');return;}
  var div=document.createElement('div');
  div.className='audio-thumb w-14 h-14 rounded-xl bg-gradient-to-br from-pink-300 to-rose-300 dark:from-pink-700 dark:to-rose-700 relative shrink-0 cursor-pointer overflow-hidden';
  div.onclick=function(){pressAnim(this);showToast('▶ 播放音频');};
  div.innerHTML='<div class="w-full h-full flex items-center justify-center text-white text-xl">🎵</div><button class="del-thumb absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[8px] flex items-center justify-center hover:bg-red-600" onclick="event.stopPropagation();removeRefThumb(this)">✕</button>';
  area.insertBefore(div,area.querySelector('.border-dashed')||area.lastElementChild);
  showToast('✅ 已添加 1 条音频');
};
window.previewRef=function(el){
  pressAnim(el);
  var img=el.querySelector('.text-lg')?.textContent||'🖼️';
  showToast('🔍 预览参考图: '+img);
};
window.removeRefThumb=function(btn){
  var p=btn.parentElement;
  p.remove();
  var area=p.closest('#video-ref-area,#ref-image-area');
  if(area){
    var remaining=area.querySelectorAll(':scope > div:not(.border-dashed):not(.text-\\[9px\\])');
    if(remaining.length===0)area.closest('.mb-4')?.classList.add('hidden');
  }
};
// ===== 联网搜索开关 =====
window.toggleSearch=function(el){
  pressAnim(el);
  el.classList.toggle('active');
  searchEnabled=el.classList.contains('active');
  // 同步更新桌面端按钮
  var desktopBtn=document.querySelector('#page-chat .search-btn');
  if(desktopBtn&&desktopBtn!==el) desktopBtn.classList.toggle('active',searchEnabled);
  // 修改当前按钮的SVG属性 + 发光效果
  var svg=el.querySelector('svg');
  if(svg){
    svg.setAttribute('stroke',searchEnabled?'#3b82f6':'currentColor');
    svg.style.filter=searchEnabled?'drop-shadow(0 0 2px rgba(59,130,246,.4))':'';
  }
  if(typeof syncChatMobileToolIcons==='function')syncChatMobileToolIcons();
  var status=document.getElementById('search-status');
  if(status){
    if(searchEnabled){status.classList.remove('hidden');status.innerHTML='<span>🌐</span><span>联网搜索已开启 — AI将实时搜索互联网获取最新信息</span>';}
    else{status.classList.add('hidden');status.innerHTML='<span>🌐</span><span>联网搜索已关闭</span>';}
  }
  showToast(searchEnabled?'🌐 联网搜索已开启 — AI将实时搜索互联网获取最新信息':'🌐 联网搜索已关闭 — AI将仅依赖训练数据');
};
// ===== 深度思考开关 =====
window.toggleDeepThink=function(el){
  pressAnim(el);
  el.classList.toggle('active');
  deepThinkEnabled=el.classList.contains('active');
  // 同步更新桌面端按钮
  var desktopBtn=document.querySelector('#page-chat .deepthink-btn');
  if(desktopBtn&&desktopBtn!==el) desktopBtn.classList.toggle('active',deepThinkEnabled);
  // 修改当前按钮的SVG属性 + 发光效果
  var svg=el.querySelector('svg');
  if(svg){
    svg.setAttribute('stroke',deepThinkEnabled?'#8b5cf6':'currentColor');
    svg.style.filter=deepThinkEnabled?'drop-shadow(0 0 2px rgba(139,92,246,.4))':'';
  }
  if(typeof syncChatMobileToolIcons==='function')syncChatMobileToolIcons();
  var status=document.getElementById('deepthink-status');
  if(status){
    if(deepThinkEnabled){status.classList.remove('hidden');status.innerHTML='<span>🧠</span><span>深度思考已开启 — AI将先展示推理过程，再给出最终答案</span>';}
    else{status.classList.add('hidden');}
  }
  showToast(deepThinkEnabled?'🧠 深度思考已开启 — AI将先展示推理过程，再给出最终答案':'🧠 深度思考已关闭 — AI将直接给出答案');
};

// ===== 通知数据 & 函数 =====
const notifData = [
  {type:'interact', icon:'❤️', title:'用户「小明」点赞了你的作品「赛博朋克城市」', time:'刚刚', read:false, desc:'作品ID: INS_001234', work:'赛博朋克城市夜景', id:'INS_001234', time2:'2026-05-20 10:30:00', count:'1,234'},
  {type:'income', icon:'💰', title:'你获得了收益⚡11.5', time:'2分钟前', read:false, desc:'作品「赛博朋克城市」被购买，分成收入', work:'赛博朋克城市', id:'INS_001234', time2:'2026-05-20 10:28:00', count:'⚡11.5'},
  {type:'system', icon:'📢', title:'系统公告：Seedance 2.0接入新渠道', time:'1小时前', read:true, desc:'渠道部 × 商务部连轴蹲下来的成果，调用成本已下调！', work:'', id:'', time2:'2026-05-19 01:50:20', count:''},
  {type:'interact', icon:'⭐', title:'用户「小红」收藏了你的作品「国风美人」', time:'2小时前', read:false, desc:'作品ID: INS_001235', work:'国风美人', id:'INS_001235', time2:'2026-05-19 08:30:00', count:'856'},
  {type:'system', icon:'🎉', title:'618大促活动来袭！充值满100送20', time:'昨天', read:true, desc:'活动期间充值满100送20，更有会员折扣叠加，快来参与吧！', work:'', id:'', time2:'2026-05-16 09:00:00', count:''},
  {type:'interact', icon:'💬', title:'用户「小刚」评论了你的作品「赛博朋克城市」', time:'昨天', read:false, desc:'"太酷了！请问这个效果是怎么做到的？"', work:'赛博朋克城市', id:'INS_001234', time2:'2026-05-19 15:20:00', count:''},
  {type:'income', icon:'💰', title:'你获得了收益⚡3.2', time:'3天前', read:true, desc:'作品「国风美人」被购买，分成收入', work:'', id:'', time2:'2026-05-17 14:00:00', count:''},
  {type:'system', icon:'📢', title:'系统维护通知', time:'5天前', read:true, desc:'平台将于2026年5月16日凌晨2:00-4:00进行系统维护', work:'', id:'', time2:'2026-05-15 18:00:00', count:''}
];

function renderNotifList(data) {
  const list = document.getElementById('notif-list');
  if(!list) return;
  list.innerHTML = data.map(n => `
    <div class="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:shadow-sm transition" onclick="openNotifDetail()">
      <div class="flex items-start gap-2.5">
        <span class="text-sm mt-0.5">${n.read ? '○' : '●'}</span>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium ${n.read ? '' : 'text-gray-800 dark:text-gray-200'}">${n.icon} ${n.title}</span>
            <span class="text-[9px] text-gray-400 shrink-0">${n.time}</span>
          </div>
          <div class="border-t border-gray-100 dark:border-gray-700 my-1"></div>
          <div class="text-[10px] text-gray-500">${n.desc}</div>
          <div class="flex justify-end mt-1">
            <button onclick="event.stopPropagation();openNotifDetail()" class="text-[10px] text-blue-500 hover:underline">详情</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function renderNotifModalBody(data) {
  const body = document.getElementById('notif-modal-body');
  if(!body) return;
  body.innerHTML = data.slice(0, 5).map(n => `
    <div class="p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600 cursor-pointer hover:shadow-sm transition" onclick="closeModal('notif-modal');openNotifDetail()">
      <div class="flex items-start gap-2">
        <span class="text-xs mt-0.5">${n.read ? '○' : '●'}</span>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-medium ${n.read ? 'text-gray-500' : ''}">${n.icon} ${n.title}</span>
            <span class="text-[9px] text-gray-400 shrink-0">${n.time}</span>
          </div>
          <div class="text-[10px] text-gray-500 mt-0.5">${n.desc}</div>
          <button onclick="event.stopPropagation();closeModal('notif-modal');openNotifDetail()" class="text-[9px] text-blue-500 hover:underline mt-0.5">查看详情</button>
        </div>
      </div>
    </div>
  `).join('');
}

function getFilteredNotifs(filter) {
  if(filter === 'all') return notifData;
  if(filter === 'unread') return notifData.filter(n => !n.read);
  if(filter === 'read') return notifData.filter(n => n.read);
  return notifData.filter(n => n.type === filter);
}

let currentNotifFilter = 'all';
window.openNotificationModal = function() {
  renderNotifModalBody(notifData);
  openModal('notif-modal');
};
window.openNotifDetail = function() { openModal('notif-detail-modal'); };
window.markAllRead = function() { showToast('✅ 已标记为已读 — 已标记所有通知为已读'); };
window.clearNotifications = function() { showToast('⚠️ 确认清空所有通知？'); };

// 通知 Tab 切换
document.querySelectorAll('.ntab').forEach(t => {
  t.addEventListener('click', function() {
    document.querySelectorAll('.ntab').forEach(x => {
      x.classList.remove('active', 'bg-blue-500', 'text-white');
      x.classList.add('border', 'border-gray-200', 'dark:border-gray-600', 'text-gray-600', 'dark:text-gray-400');
    });
    this.classList.add('active', 'bg-blue-500', 'text-white');
    this.classList.remove('border', 'border-gray-200', 'dark:border-gray-600', 'text-gray-600', 'dark:text-gray-400');
    renderNotifModalBody(getFilteredNotifs(this.dataset.ntab));
  });
});
document.querySelectorAll('.notif-tab').forEach(t => {
  t.addEventListener('click', function() {
    document.querySelectorAll('.notif-tab').forEach(x => {
      x.classList.remove('active', 'bg-blue-500', 'text-white');
      x.classList.add('border', 'border-gray-200', 'dark:border-gray-600', 'text-gray-600', 'dark:text-gray-400');
    });
    this.classList.add('active', 'bg-blue-500', 'text-white');
    this.classList.remove('border', 'border-gray-200', 'dark:border-gray-600', 'text-gray-600', 'dark:text-gray-400');
    currentNotifFilter = this.dataset.filter;
    renderNotifList(getFilteredNotifs(currentNotifFilter));
  });
});

// ===== 音色克隆功能 =====
// ===== 收藏功能 =====
var favedTemplates={};
window.toggleFav=function(el){
  pressAnim(el);
  var card=el.closest('.apps-template');
  var name=card?card.dataset.name:'';if(!name)return;
  if(favedTemplates[name]){delete favedTemplates[name];el.textContent='☆';el.classList.remove('text-yellow-500');showToast('✅ 已取消收藏 — 「'+name+'」');}
  else{favedTemplates[name]=true;el.textContent='⭐';el.classList.add('text-yellow-500');showToast('✅ 已收藏 — 「'+name+'」');}
};
// ===== Apps页面功能 =====
var AIWS_IMAGE_KEYS=['image','face','style','tryon','tool'];
var AIWS_TAG_MAP={
  image:['图像生成','文生图','新奇创意'],
  face:['换脸','人像融合'],
  tryon:['虚拟换装','电商产品'],
  style:['风格转换','艺术滤镜'],
  tool:['修图增强','超分修复'],
  video:['图生视频','影音创作','高清输出'],
  audio:['语音合成','AI配音','多语种']
};
var AIWS_MEDIA_KEYS=['video','audio'];
var AIWS_CREATORS=[
  {name:'GUID官方',emoji:'🏛️',gradient:'linear-gradient(135deg,#1e40af,#3730a3)'},
  {name:'Nova_AI',emoji:'🎨',gradient:'linear-gradient(135deg,#4c1d95,#2563eb)'},
  {name:'像素工坊',emoji:'🖼️',gradient:'linear-gradient(135deg,#831843,#581c87)'},
  {name:'映画实验室',emoji:'🎬',gradient:'linear-gradient(135deg,#0c4a6e,#164e63)'},
  {name:'换脸大师',emoji:'🔄',gradient:'linear-gradient(135deg,#6d28d9,#2563eb)'},
  {name:'文案研究所',emoji:'📝',gradient:'linear-gradient(135deg,#334155,#1e293b)'}
];
var aiwsState={
  title:'',
  liked:false,
  faved:false,
  followed:false,
  likeCount:0,
  favCount:0,
  commentCount:0,
  comments:[],
  sharePayload:null
};
function getAppCreator(appId){
  var i=(parseInt(appId,10)||1)-1;
  return AIWS_CREATORS[((i%AIWS_CREATORS.length)+AIWS_CREATORS.length)%AIWS_CREATORS.length];
}
function renderAiwsCreator(appId,gradient,isOfficial,prefix){
  var creator=isOfficial?AIWS_CREATORS[0]:getAppCreator(appId);
  var p=typeof prefix==='string'?prefix:'aiws-';
  var avatar=document.getElementById(p+'avatar');
  var emojiEl=document.getElementById(p+'avatar-emoji');
  var nameEl=document.getElementById(p+'creator-name');
  if(avatar)avatar.style.background=gradient||creator.gradient;
  if(emojiEl)emojiEl.textContent=creator.emoji;
  if(nameEl)nameEl.textContent=creator.name;
}
window.toggleAiwsFollow=function(){
  aiwsState.followed=!aiwsState.followed;
  ['aiws-follow-btn','aiws-omni-follow-btn'].forEach(function(id){
    var btn=document.getElementById(id);
    if(btn){
      btn.textContent=aiwsState.followed?'已关注':'+ 关注';
      btn.classList.toggle('followed',aiwsState.followed);
    }
  });
  var name=document.getElementById('aiws-omni-creator-name')?.textContent||document.getElementById('aiws-creator-name')?.textContent;
  showToast(aiwsState.followed?'✅ 已关注 '+name:'👋 取消关注');
};

function isOmniImage2App(cat,appId){
  return appId==='omni-image-2'||(cat&&String(cat).indexOf('全能图片')>=0);
}
function isPersonModelApp(cat,appId){
  return appId==='person-model-gen'||(cat&&String(cat).indexOf('人物模特')>=0);
}
function isOldPhotoTimeMachineApp(title,appId){
  var t=String(title||'');
  return appId==='old-photo-time-machine'||t.indexOf('旧照时光机')>=0;
}
function isImageTo360PanoramaApp(title,appId){
  var t=String(title||'');
  return appId==='image-to-360-panorama'||t.indexOf('360全景')>=0||t.indexOf('360 全景')>=0||t.indexOf('图转 360')>=0;
}
function isFaceSwapOutfitApp(title,appId){
  var t=String(title||'');
  return appId==='face-swap-outfit-v2'||t.indexOf('换脸换装')>=0;
}
function isFittingRoomApp(cat,appId,title){
  var t=String(title||'');
  return appId==='ai-stylist-fitting-room'||t.indexOf('试装间')>=0||(t.indexOf('AI stylist')>=0&&t.indexOf('试装')>=0);
}
function isVideoRecastApp(cat,appId,title){
  var t=String(title||'').toLowerCase();
  return appId==='video-recast-v1'||String(title||'').indexOf('视频换角色')>=0||(t.indexOf('recast')>=0&&t.indexOf('角色')>=0);
}
function isVideoOutfitApp(cat,appId,title){
  var t=String(title||'').toLowerCase();
  return appId==='video-outfit-v1'||String(title||'').indexOf('视频换装')>=0||(t.indexOf('urban')>=0&&t.indexOf('cuts')>=0);
}
function isCharacterReplaceApp(cat,appId){
  return appId==='character-replace-v3'||(cat&&String(cat).indexOf('人物替换')>=0);
}
function isIndexTts2App(cat,appId,title){
  var t=String(title||cat||'');
  return appId==='index-tts2-voice'||t.indexOf('IndexTTS2')>=0;
}
function isShortDramaApp(cat,appId,title){
  var t=String(title||'');
  return appId==='short-drama-full'||t.indexOf('短剧生成')>=0;
}
function isLtx2DigitalHumanApp(cat,appId,title){
  var t=String(title||'');
  return appId==='ltx2-digital-human-lipsync'||t.indexOf('LTX-2')>=0||t.indexOf('数字人')>=0&&t.indexOf('口型')>=0;
}
function isVideoFaceSwapApp(cat,appId,title){
  var t=String(title||'');
  return appId==='video-face-swap-v1'||t.indexOf('视频换脸')>=0;
}
function isMotionTransferApp(cat,appId,title){
  var t=String(title||'');
  return appId==='wan22-motion-transfer'||t.indexOf('动作迁移')>=0||t.indexOf('AnimateV2')>=0;
}
function isKeyframesVideoApp(cat,appId,title){
  var t=String(title||'');
  return appId==='wan22-keyframes-video'||t.indexOf('首尾帧')>=0;
}
function isCouplePostcardApp(cat,appId,title){
  var t=String(title||'');
  return appId==='anime-couple-postcard'||t.indexOf('情侣头像明信片')>=0||t.indexOf('情侣明信片')>=0;
}
function isEcommerceDetailApp(cat,appId,title){
  var t=String(title||'');
  return appId==='ecommerce-detail-gen'||t.indexOf('电商详情页')>=0||t.indexOf('详情页生成')>=0;
}
function isEcommerceProductMultiangleApp(title,appId){
  var t=String(title||'');
  return appId==='ecommerce-product-multiangle'||t.indexOf('自动电商产品多角度')>=0||t.indexOf('自动产品多角度')>=0||t.indexOf('电商产品-自动产品多角度')>=0;
}
function isFlux2WatermarkApp(cat,appId,title){
  var t=String(title||'');
  return appId==='flux2-watermark-gen'||t.indexOf('一键去水印')>=0||(t.indexOf('FLUX2')>=0&&t.indexOf('去水印')>=0)||t.indexOf('去水印万能改图')>=0;
}
function isEcommerceWhiteBgSceneApp(cat,appId,title){
  var t=String(title||'');
  return appId==='ecommerce-white-bg-scene'||t.indexOf('电商白底图智能生成场景')>=0||(t.indexOf('白底图')>=0&&t.indexOf('智能生成场景')>=0);
}
function isEcommerceModelGenApp(cat,appId,title){
  var t=String(title||'');
  return appId==='ecommerce-model-gen-oneclick'||t.indexOf('一键生成电商模特图')>=0||(t.indexOf('电商模特图')>=0&&t.indexOf('图生图')>=0);
}
function isEcommerceDigitalHumanApp(cat,appId,title){
  var t=String(title||'');
  return appId==='ecommerce-digital-human'||t.indexOf('电商口播数字人')>=0||(t.indexOf('口播数字人')>=0&&t.indexOf('表情')>=0);
}
function isSeedance20App(cat,appId,title){
  var t=String(title||'');
  return appId==='seedance20-ref-real'||t.indexOf('Seedance')>=0||t.indexOf('全能参考')>=0;
}
function isHeartMulaApp(cat,appId,title){
  var t=String(title||'');
  return appId==='heartmula-song-voice'||t.indexOf('HeartMula')>=0||t.indexOf('文生歌曲')>=0||(t.indexOf('音色克隆')>=0&&t.indexOf('歌曲')>=0);
}
function isOiwsSidebarVariant(variant){
  return variant==='person-model'||variant==='old-photo-time-machine'||variant==='image-to-360-panorama'||variant==='face-swap-outfit'||variant==='fitting-room'||variant==='ecommerce-product-multiangle'||variant==='ecommerce-white-bg-scene'||variant==='ecommerce-model-gen'||variant==='character-replace'||variant==='index-tts2'||variant==='short-drama'||variant==='ltx2-digital-human'||variant==='motion-transfer'||variant==='video-face-swap'||variant==='keyframes-video'||variant==='couple-postcard'||variant==='ecommerce-detail'||variant==='ecommerce-digital-human'||variant==='seedance20'||variant==='heartmula'||variant==='flux2-watermark';
}
var PERSON_MODEL_DEFAULT_PROMPT='一位气质清新的少女模特，半身人像，柔和自然光，浅粉连衣裙，手持花束，背景虚化，高级写真质感，五官精致，皮肤细腻，9:16 竖屏构图';
var PERSON_MODEL_DEMO_WORKS=[
  {user:'魅力 创意',emoji:'👤',gradient:'linear-gradient(135deg,#831843,#9d174d)',title:'粉裙花束写真',type:'image',prompt:'少女模特半身像，浅粉连衣裙，手持花束，柔光写真',model:'人物模特生成',likes:312,views:4200,uses:88,price:'R 25',params:'9:16 · Standard'},
  {user:'Luna',emoji:'🌸',gradient:'linear-gradient(135deg,#be1858,#db2777)',title:'甜美棚拍人像',type:'image',prompt:'棚拍美少女，干净背景，商业写真质感',model:'人物模特生成',likes:198,views:2800,uses:45,price:'R 25',params:'9:16 · Standard'},
  {user:'Studio K',emoji:'📷',gradient:'linear-gradient(135deg,#7c2d12,#ea580c)',title:'户外自然光',type:'image',prompt:'户外人像，金色逆光，发丝透亮',model:'人物模特生成',likes:156,views:1900,uses:32,price:'R 25',params:'9:16 · Standard'},
  {user:'Mia',emoji:'💫',gradient:'linear-gradient(135deg,#4c1d95,#7c3aed)',title:'冷艳时尚大片',type:'image',prompt:'时尚杂志风人像，冷色调，高级感',model:'人物模特生成',likes:421,views:5100,uses:120,price:'R 25',params:'9:16 · Standard'}
];
function setOiwsVariant(variant){
  aiwsState.oiwsVariant=variant||'omni';
  var wrap=document.querySelector('#omni-image-workspace-modal .oiws-app-wrap');
  if(!wrap)return;
  wrap.classList.toggle('oiws-variant--person-model',isOiwsSidebarVariant(variant));
  wrap.classList.toggle('oiws-variant--index-tts',variant==='index-tts2');
  wrap.classList.toggle('oiws-variant--short-drama',variant==='short-drama');
  wrap.classList.toggle('oiws-variant--ltx2-digital-human',variant==='ltx2-digital-human');
  wrap.classList.toggle('oiws-variant--motion-transfer',variant==='motion-transfer');
  wrap.classList.toggle('oiws-variant--video-face-swap',variant==='video-face-swap');
  wrap.classList.toggle('oiws-variant--keyframes-video',variant==='keyframes-video');
  wrap.classList.toggle('oiws-variant--couple-postcard',variant==='couple-postcard');
  wrap.classList.toggle('oiws-variant--ecommerce-detail',variant==='ecommerce-detail');
  wrap.classList.toggle('oiws-variant--ecommerce-product-multiangle',variant==='ecommerce-product-multiangle');
  wrap.classList.toggle('oiws-variant--ecommerce-digital-human',variant==='ecommerce-digital-human');
  wrap.classList.toggle('oiws-variant--seedance20',variant==='seedance20');
  wrap.classList.toggle('oiws-variant--heartmula',variant==='heartmula');
  wrap.classList.toggle('oiws-variant--flux2-watermark',variant==='flux2-watermark');
  wrap.classList.toggle('oiws-variant--ecommerce-white-bg-scene',variant==='ecommerce-white-bg-scene');
  wrap.classList.toggle('oiws-variant--ecommerce-model-gen',variant==='ecommerce-model-gen');
  wrap.classList.toggle('oiws-variant--character-replace',variant==='character-replace');
  wrap.classList.toggle('oiws-variant--face-swap-outfit',variant==='face-swap-outfit');
  wrap.classList.toggle('oiws-variant--fitting-room',variant==='fitting-room');
  wrap.classList.toggle('oiws-variant--video-recast',variant==='video-recast');
  wrap.classList.toggle('oiws-variant--video-outfit',variant==='video-outfit');
  wrap.classList.toggle('oiws-variant--old-photo-time-machine',variant==='old-photo-time-machine');
  wrap.classList.toggle('oiws-variant--image-to-360-panorama',variant==='image-to-360-panorama');
  if(variant!=='fitting-room')hideFittingRoomStudio();
  if(variant!=='video-recast')hideVideoRecastStudio();
  if(variant!=='video-outfit')hideVideoOutfitStudio();
}
var INDEX_TTS2_DEFAULT_VOICE_TEXT='这是一段用于语音克隆的参考文本，请保持语速自然、吐字清晰，支持中英文混读。';
var INDEX_TTS2_DEFAULT_EMOTION='那最好';
function buildIndexTts2ParamsForm(p){
  p=p||{};
  var voiceText=p.defaultVoiceText||INDEX_TTS2_DEFAULT_VOICE_TEXT;
  var emotion=p.defaultEmotion||INDEX_TTS2_DEFAULT_EMOTION;
  var hasAudio=!!(aiwsState.ttsAudioName||aiwsState.uploadPreviews&&aiwsState.uploadPreviews[0]);
  var plane=function(title,content){
    return '<div class="oiws-item-plane">'+
      '<button type="button" class="oiws-plane-top" onclick="toggleOiwsPlane(this)">'+
      '<span class="oiws-plane-title" title="'+title+'">'+title+'</span>'+
      '<span class="oiws-plane-collapse" aria-hidden="true"></span></button>'+
      '<div class="oiws-plane-main">'+content+'</div></div>';
  };
  var audioSlot='<div class="oiws-upload-slot oiws-upload-slot--audio" data-oiws-slot="0">'+
    (hasAudio?'<button type="button" class="oiws-upload-delete" onclick="deleteOiwsUploadSlot(event,0)" aria-label="删除">×</button>':'')+
    '<div class="oiws-audio-upload" role="button" tabindex="0" onclick="openOiwsUploadAsset(0)">'+
    '<div class="oiws-audio-wave" aria-hidden="true"></div>'+
    '<div class="oiws-audio-meta">'+
    '<span class="oiws-audio-name">'+(aiwsState.ttsAudioName||'参考音频.wav')+'</span>'+
  '<span class="oiws-audio-hint">'+(hasAudio?'点击更换':'点击上传克隆音频')+'</span></div></div></div>';
  return plane('上传克隆音频',audioSlot)+
    plane('上传语音文本','<div class="oiws-text-wrap"><textarea class="oiws-textarea oiws-textarea--voice" maxlength="8000" placeholder="输入与参考音频对应的文本内容…">'+String(voiceText).replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</textarea></div>')+
    plane('情感描述','<div class="oiws-text-wrap"><textarea class="oiws-textarea oiws-textarea--emotion" maxlength="500" placeholder="如：温柔、兴奋、那最好…">'+String(emotion).replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</textarea></div>');
}
function refreshOiwsTtsAudioSlot(idx){
  var slotEl=document.querySelector('#oiws-params-form [data-oiws-slot="'+idx+'"]');
  if(!slotEl)return;
  var hasAudio=!!aiwsState.ttsAudioName;
  var isLtx=aiwsState.oiwsVariant==='ltx2-digital-human';
  slotEl.className='oiws-upload-slot oiws-upload-slot--audio';
  slotEl.innerHTML=
    (hasAudio?'<button type="button" class="oiws-upload-delete" onclick="deleteOiwsUploadSlot(event,0)" aria-label="删除">×</button>':'')+
    '<div class="oiws-audio-upload" role="button" tabindex="0" onclick="openOiwsUploadAsset(0)">'+
    '<div class="oiws-audio-wave" aria-hidden="true"></div>'+
    '<div class="oiws-audio-meta"><span class="oiws-audio-name">'+(aiwsState.ttsAudioName||(isLtx?'驱动音频.wav':'参考音频.wav'))+'</span>'+
    '<span class="oiws-audio-hint">'+(hasAudio?'点击更换':(isLtx?'点击上传音频':'点击上传克隆音频'))+'</span></div></div>';
}
var CHAR_REPLACE_UPLOAD_SLOTS=[
  {title:'目标',preview:'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=220&q=70&auto=format&fit=crop'},
  {title:'场景图',preview:'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=220&q=70&auto=format&fit=crop'}
];
var FSO_UPLOAD_SLOTS=[
  {title:'模特照片',preview:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80&auto=format&fit=crop'},
  {title:'人脸照片',preview:'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80&auto=format&fit=crop'}
];
var FSO_DEMO_WORKS=[
  {user:'九七先生',emoji:'👤',gradient:'linear-gradient(135deg,#0f766e,#134e4a)',title:'婚纱写真换脸',type:'image',prompt:'模特全身照换脸，自然融合肤色',model:'换脸换装 2.0',likes:12,views:380,uses:5,price:'⚡0.7',params:'Standard'},
  {user:'Lily',emoji:'💄',gradient:'linear-gradient(135deg,#115e59,#0d9488)',title:'时尚杂志风',type:'image',prompt:'杂志封面换脸，五官一致',model:'换脸换装 2.0',likes:8,views:210,uses:3,price:'⚡0.7',params:'Standard'}
];
var FITTING_ROOM_OUTFITS=[
  {id:'o1',swatch:['#f8fafc','#1e293b','#64748b']},
  {id:'o2',swatch:['#fef3c7','#78350f','#a8a29e']},
  {id:'o3',swatch:['#fce7f3','#831843','#cbd5e1']},
  {id:'o4',swatch:['#dbeafe','#1e3a8a','#475569']},
  {id:'o5',swatch:['#ecfccb','#365314','#78716c']},
  {id:'o6',swatch:['#e0e7ff','#3730a3','#94a3b8']},
  {id:'o7',swatch:['#ffedd5','#9a3412','#57534e']},
  {id:'o8',swatch:['#f1f5f9','#0f172a','#71717a']},
  {id:'o9',swatch:['#fafafa','#404040','#a3a3a3']},
  {id:'o10',swatch:['#fdf2f8','#701a75','#9ca3af']},
  {id:'o11',swatch:['#f0fdf4','#14532d','#6b7280']},
  {id:'o12',swatch:['#eff6ff','#1d4ed8','#525252']}
];
var FITTING_ROOM_SECTIONS=[
  {key:'outfit',label:'Outfit',icon:'hanger'},
  {key:'outerwear',label:'Outerwear',icon:'outerwear'},
  {key:'tops',label:'Tops',icon:'tops'},
  {key:'sets',label:'Sets',icon:'sets'},
  {key:'bottoms',label:'Bottoms',icon:'bottoms'},
  {key:'socks',label:'Socks',icon:'socks'},
  {key:'shoes',label:'Shoes',icon:'shoes'},
  {key:'accessories',label:'Accessories',icon:'accessories'},
  {key:'background',label:'Background',icon:'background',optional:true,dividerBefore:true},
  {key:'pose',label:'Pose',icon:'pose',optional:true}
];
function _oiwsFrDefaultSections(openKey){
  var s={};
  FITTING_ROOM_SECTIONS.forEach(function(sec){s[sec.key]=false;});
  if(openKey)s[openKey]=true;
  return s;
}
var OIWS_FR_MAX_PICKS=12;
function _oiwsFrEnsureState(){
  if(!aiwsState.frGender)aiwsState.frGender='female';
  if(!Array.isArray(aiwsState.frOutfits))aiwsState.frOutfits=[];
  if(!Array.isArray(aiwsState.frAssetPicks))aiwsState.frAssetPicks=[];
  if(typeof aiwsState.frShowAllOutfits!=='boolean')aiwsState.frShowAllOutfits=false;
  if(!aiwsState.frSections){
    aiwsState.frSections=_oiwsFrDefaultSections();
  }else{
    FITTING_ROOM_SECTIONS.forEach(function(sec){
      if(typeof aiwsState.frSections[sec.key]!=='boolean')aiwsState.frSections[sec.key]=false;
    });
  }
}
function _oiwsFrIconSvg(name){
  var a='class="oiws-fr-section-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  var icons={
    hanger:'<svg '+a+'><path d="M8 6.5 12 4.5l4 2"/><path d="M12 4.5V9"/><path d="M6 9h12l-1.5 12h-9L6 9z"/></svg>',
    outerwear:'<svg '+a+'><path d="M8 7 6 20h12l-2-13"/><path d="M12 7V4"/><path d="M9 7h6"/></svg>',
    tops:'<svg '+a+'><path d="M8 6 12 4l4 2v2H8V6z"/><path d="M7 8h10v12H7V8z"/></svg>',
    sets:'<svg '+a+'><path d="M9 4h6v3H9z"/><path d="M8 7h8v13H8z"/><path d="M10 11h4M10 15h4"/></svg>',
    bottoms:'<svg '+a+'><path d="M9 4h6l1 16H8L9 4z"/><path d="M10 9h4"/></svg>',
    socks:'<svg '+a+'><path d="M8 5c0-1.5 1.5-2.5 3-2.5h2c1.5 0 3 1 3 2.5v3l-2 11H10L8 8V5z"/></svg>',
    shoes:'<svg '+a+'><path d="M5 14c2-1 4-1 6 0s4 1 6 0l2 4H3l2-4z"/><path d="M7 12V9a2 2 0 0 1 4 0v3"/></svg>',
    accessories:'<svg '+a+'><circle cx="8" cy="10" r="3"/><circle cx="16" cy="10" r="3"/><path d="M11 10h2"/></svg>',
    background:'<svg '+a+'><rect x="4" y="4" width="16" height="16" rx="2"/><path d="m4 16 5-5 4 4 6-7 5 6"/></svg>',
    pose:'<svg '+a+'><circle cx="12" cy="5" r="2"/><path d="M12 7v5M9 20l3-8 3 8M8 12h8"/></svg>'
  };
  return icons[name]||icons.hanger;
}
function _oiwsFrSectionPlaceholder(label){
  return '<p class="oiws-fr-section-empty">'+label+' 即将上线</p>';
}
function _oiwsFrOutfitTileHtml(o,selected){
  if(o.custom){
    return '<button type="button" class="oiws-fr-outfit-tile oiws-fr-outfit-tile--custom" onclick="openOiwsFrAssetPicker(\'append\',event)" title="从我的资产添加">'+
      '<span class="oiws-fr-outfit-plus" aria-hidden="true">+</span></button>';
  }
  var sw=(o.swatch||['#fff','#111','#888']).map(function(c,i){
    return '<span class="oiws-fr-outfit-piece oiws-fr-outfit-piece--'+(i+1)+'" style="background:'+c+'"></span>';
  }).join('');
  return '<button type="button" class="oiws-fr-outfit-tile'+(selected?' is-selected':'')+'" onclick="oiwsFrPickOutfit(\''+o.id+'\',event)" aria-pressed="'+(selected?'true':'false')+'">'+sw+'</button>';
}
function buildFittingRoomParamsForm(){
  _oiwsFrEnsureState();
  var g=aiwsState.frGender;
  var list=FITTING_ROOM_OUTFITS.slice(0,aiwsState.frShowAllOutfits?FITTING_ROOM_OUTFITS.length:8);
  var grid=list.map(function(o){
    return _oiwsFrOutfitTileHtml(o,aiwsState.frOutfits.indexOf(o.id)>=0);
  }).join('');
  grid=_oiwsFrOutfitTileHtml({custom:true},false)+grid;
  if(FITTING_ROOM_OUTFITS.length>8&&!aiwsState.frShowAllOutfits){
    grid+='<button type="button" class="oiws-fr-show-more" onclick="oiwsFrShowMoreOutfits()">Show More <span aria-hidden="true">▾</span></button>';
  }
  var sec=function(cfg,body){
    var open=!!aiwsState.frSections[cfg.key];
    return '<div class="oiws-fr-section'+(open?' is-open':'')+(cfg.dividerBefore?' oiws-fr-section--spaced':'')+'">'+
      '<button type="button" class="oiws-fr-section-head" onclick="oiwsFrToggleSection(\''+cfg.key+'\',this)" aria-expanded="'+(open?'true':'false')+'">'+
      '<span class="oiws-fr-section-left">'+
      '<span class="oiws-fr-section-icon-wrap">'+_oiwsFrIconSvg(cfg.icon)+'</span>'+
      '<span class="oiws-fr-section-label">'+cfg.label+'</span></span>'+
      '<span class="oiws-fr-section-right">'+
      (cfg.optional?'<span class="oiws-fr-section-opt">Optional</span>':'')+
      '<span class="oiws-fr-section-chevron" aria-hidden="true"></span></span></button>'+
      '<div class="oiws-fr-section-body"'+(open?'':' hidden')+'>'+body+'</div></div>';
  };
  var sectionsHtml=FITTING_ROOM_SECTIONS.map(function(cfg){
    var body=cfg.key==='outfit'?grid:_oiwsFrSectionPlaceholder(cfg.label);
    return sec(cfg,body);
  }).join('');
  return '<div class="oiws-fr-panel">'+
    '<div class="oiws-fr-panel-top">'+
    '<div class="oiws-fr-gender" role="group" aria-label="性别">'+
    '<button type="button" class="oiws-fr-gender-btn'+(g==='male'?' is-active':'')+'" onclick="oiwsFrSetGender(\'male\')">Male</button>'+
    '<button type="button" class="oiws-fr-gender-btn'+(g==='female'?' is-active':'')+'" onclick="oiwsFrSetGender(\'female\')">Female</button></div>'+
    '<button type="button" class="oiws-fr-reset" onclick="oiwsFrReset()">Reset</button></div>'+
    '<div class="oiws-fr-sections">'+sectionsHtml+'</div></div>';
}
function _oiwsFrEscapeAttr(s){
  return String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
}
function _oiwsFrTotalPickCount(){
  _oiwsFrEnsureState();
  return aiwsState.frOutfits.length+aiwsState.frAssetPicks.length;
}
function _oiwsFrPushAssetPick(url,name,key){
  if(!url)return false;
  _oiwsFrEnsureState();
  var k=key||url;
  if(aiwsState.frAssetPicks.some(function(p){return p.key===k;}))return false;
  while(_oiwsFrTotalPickCount()>=OIWS_FR_MAX_PICKS){
    if(aiwsState.frOutfits.length)aiwsState.frOutfits.shift();
    else if(aiwsState.frAssetPicks.length)aiwsState.frAssetPicks.shift();
    else break;
  }
  if(_oiwsFrTotalPickCount()>=OIWS_FR_MAX_PICKS)return false;
  aiwsState.frAssetPicks.push({url:url,name:name||'资产图片',key:k});
  return true;
}
function _oiwsFrResolveSelImageUrl(sel){
  var asset=findUserAsset(sel.key);
  if(asset&&asset.dataUrl)return asset.dataUrl;
  var el=null;
  if(sel.assetId){
    el=document.querySelector('#asset-modal .asset-img-item[data-asset-id="'+sel.assetId+'"]');
  }
  if(!el&&sel.name){
    document.querySelectorAll('#asset-modal .asset-img-item').forEach(function(node){
      if(!el&&node.dataset.name===sel.name)el=node;
    });
  }
  if(!el&&sel.key){
    document.querySelectorAll('#asset-modal .asset-img-item').forEach(function(node){
      if(!el&&(node.dataset.assetId===sel.key||node.dataset.name===sel.key))el=node;
    });
  }
  if(el){
    var img=el.querySelector('img');
    if(img&&img.getAttribute('src'))return img.getAttribute('src');
  }
  var icons=['🖼️','🌃','📦','👤'];
  var fills=['374151','1e40af','b45309','9d174d'];
  var idx=Math.abs(String(sel.name||sel.key).length)%icons.length;
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect fill='%23"+fills[idx]+"' width='96' height='96'/%3E%3Ctext x='48' y='54' text-anchor='middle' font-size='28'%3E"+encodeURIComponent(icons[idx])+"%3C/text%3E%3C/svg%3E";
}
function _oiwsFrConfirmAssets(mode){
  _oiwsFrEnsureState();
  var imgs=(assetSelected||[]).filter(function(s){return s.tab==='image';});
  if(!imgs.length)return 0;
  var applied=0;
  if(mode==='main'){
    var url0=_oiwsFrResolveSelImageUrl(imgs[0]);
    if(url0){
      if(!aiwsState.uploadPreviews)aiwsState.uploadPreviews=[''];
      aiwsState.uploadPreviews[0]=url0;
      applied++;
    }
  }
  for(var i=0;i<imgs.length;i++){
    var sel=imgs[i];
    var dataUrl=_oiwsFrResolveSelImageUrl(sel);
    if(_oiwsFrPushAssetPick(dataUrl,sel.name||sel.key,sel.key))applied++;
  }
  renderFittingRoomStudio();
  return applied;
}
window.openOiwsFrAssetPicker=function(mode,ev){
  if(ev&&ev.stopPropagation)ev.stopPropagation();
  if(aiwsState.oiwsVariant!=='fitting-room')return;
  assetPickTarget={
    page:'oiws',
    slotIndex:mode==='main'?0:undefined,
    mediaType:'image',
    fittingRoom:true,
    frPickMode:mode==='main'?'main':'append'
  };
  if(typeof openAssetModal==='function'){
    openAssetModal('image',{preserve:['omni-image-workspace-modal']});
  }else if(typeof openModal==='function'){
    openModal('asset-modal',{preserve:['omni-image-workspace-modal']});
  }
};
function renderFittingRoomStudio(){
  var el=document.getElementById('oiws-fr-studio');
  if(!el)return;
  _oiwsFrEnsureState();
  var preview=(aiwsState.uploadPreviews&&aiwsState.uploadPreviews[0])||'';
  var picks=aiwsState.frOutfits.map(function(id){
    var o=FITTING_ROOM_OUTFITS.find(function(x){return x.id===id;});
    if(!o)return '';
    return '<div class="oiws-fr-pick">'+_oiwsFrOutfitTileHtml(o,true).replace(/<button[^>]*>/,'<div class="oiws-fr-pick-inner">').replace(/<\/button>/,'</div>')+'</div>';
  }).join('');
  picks+=(aiwsState.frAssetPicks||[]).map(function(p,idx){
    var src=_oiwsFrEscapeAttr(typeof oiwsResolveAssetUrl==='function'?oiwsResolveAssetUrl(p.url):p.url);
    return '<div class="oiws-fr-pick oiws-fr-pick--asset">'+
      '<img class="oiws-fr-pick-img" src="'+src+'" alt="'+_oiwsFrEscapeAttr(p.name)+'">'+
      '<button type="button" class="oiws-fr-pick-remove" onclick="oiwsFrRemoveAssetPick('+idx+',event)" aria-label="移除">×</button></div>';
  }).join('');
  el.innerHTML=
    '<div class="oiws-fr-studio-inner">'+
    '<div class="oiws-fr-upload'+(preview?' has-photo':'')+'" role="button" tabindex="0" onclick="openOiwsFrAssetPicker(\'main\',event)" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();openOiwsFrAssetPicker(\'main\',event);}">'+
    (preview?'<img class="oiws-fr-upload-img" src="'+(typeof oiwsResolveAssetUrl==='function'?oiwsResolveAssetUrl(preview):preview)+'" alt="已上传照片">':
      '<div class="oiws-fr-upload-empty"><span class="oiws-fr-upload-plus" aria-hidden="true">+</span>'+
      '<p class="oiws-fr-upload-title">Drag or click to upload your photo</p></div>')+
    '<p class="oiws-fr-upload-foot">One person, full body, face clearly visible</p></div>'+
    '<div class="oiws-fr-picks-row">'+(picks||'')+
    '<button type="button" class="oiws-fr-pick-add" onclick="openOiwsFrAssetPicker(\'append\',event)" aria-label="从我的资产添加图片">+</button></div>'+
    '</div>';
  el.classList.remove('hidden');
  el.setAttribute('aria-hidden','false');
  var crumb=document.getElementById('oiws-fr-crumb');
  if(crumb)crumb.classList.remove('hidden');
}
function hideFittingRoomStudio(){
  var el=document.getElementById('oiws-fr-studio');
  if(el){el.classList.add('hidden');el.setAttribute('aria-hidden','true');el.innerHTML='';}
  var crumb=document.getElementById('oiws-fr-crumb');
  if(crumb)crumb.classList.add('hidden');
}
window.oiwsFrSetGender=function(g){
  aiwsState.frGender=g==='male'?'male':'female';
  var form=document.getElementById('oiws-params-form');
  if(form&&aiwsState.oiwsVariant==='fitting-room')form.innerHTML=buildFittingRoomParamsForm();
};
window.oiwsFrReset=function(){
  aiwsState.frGender='female';
  aiwsState.frOutfits=[];
  aiwsState.frAssetPicks=[];
  aiwsState.frShowAllOutfits=false;
  aiwsState.frSections=_oiwsFrDefaultSections();
  aiwsState.uploadPreviews=[''];
  var form=document.getElementById('oiws-params-form');
  if(form&&aiwsState.oiwsVariant==='fitting-room')form.innerHTML=buildFittingRoomParamsForm();
  renderFittingRoomStudio();
  if(typeof showToast==='function')showToast('已重置试装参数');
};
window.oiwsFrRemoveAssetPick=function(idx,ev){
  if(ev){ev.stopPropagation();ev.preventDefault();}
  _oiwsFrEnsureState();
  if(idx>=0&&idx<aiwsState.frAssetPicks.length)aiwsState.frAssetPicks.splice(idx,1);
  renderFittingRoomStudio();
};
window.oiwsFrPickOutfit=function(id,e){
  if(e&&e.stopPropagation)e.stopPropagation();
  if(id==='custom'){openOiwsFrAssetPicker('append',e);return;}
  _oiwsFrEnsureState();
  var idx=aiwsState.frOutfits.indexOf(id);
  if(idx>=0)aiwsState.frOutfits.splice(idx,1);
  else{
    if(aiwsState.frOutfits.length>=3)aiwsState.frOutfits.shift();
    aiwsState.frOutfits.push(id);
  }
  var form=document.getElementById('oiws-params-form');
  if(form&&aiwsState.oiwsVariant==='fitting-room')form.innerHTML=buildFittingRoomParamsForm();
  renderFittingRoomStudio();
};
window.oiwsFrToggleSection=function(key,btn){
  _oiwsFrEnsureState();
  var wasOpen=!!aiwsState.frSections[key];
  aiwsState.frSections=_oiwsFrDefaultSections();
  if(!wasOpen)aiwsState.frSections[key]=true;
  var form=document.getElementById('oiws-params-form');
  if(form&&aiwsState.oiwsVariant==='fitting-room')form.innerHTML=buildFittingRoomParamsForm();
};
window.oiwsFrShowMoreOutfits=function(){
  aiwsState.frShowAllOutfits=true;
  var form=document.getElementById('oiws-params-form');
  if(form&&aiwsState.oiwsVariant==='fitting-room')form.innerHTML=buildFittingRoomParamsForm();
};
window.oiwsFrFocusOutfits=function(){
  _oiwsFrEnsureState();
  aiwsState.frSections=_oiwsFrDefaultSections('outfit');
  var form=document.getElementById('oiws-params-form');
  if(form&&aiwsState.oiwsVariant==='fitting-room')form.innerHTML=buildFittingRoomParamsForm();
  var panel=document.querySelector('.oiws-fr-section.is-open');
  if(panel&&panel.scrollIntoView)panel.scrollIntoView({behavior:'smooth',block:'nearest'});
};
var VRC_DEMO_BEFORE='https://images.unsplash.com/photo-1507003211169?w=900&q=80&auto=format&fit=crop';
var VRC_DEMO_AFTER='https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&q=80&auto=format&fit=crop';
var VRC_DEMO_VIDEO='assets/video-recast-preview.png';
function buildVideoRecastParamsForm(){
  return '';
}
function renderVideoRecastStudio(){
  var el=document.getElementById('oiws-vrc-studio');
  if(!el)return;
  if(typeof aiwsState.vrcComparePos!=='number')aiwsState.vrcComparePos=50;
  var pos=aiwsState.vrcComparePos;
  var resolve=typeof oiwsResolveAssetUrl==='function'?oiwsResolveAssetUrl:function(u){return u||'';};
  var videoUrl=(aiwsState.uploadPreviews&&aiwsState.uploadPreviews[0])||'';
  var charUrl=(aiwsState.uploadPreviews&&aiwsState.uploadPreviews[1])||'';
  var hasVideo=!!videoUrl;
  var hasChar=!!charUrl;
  var before=resolve(VRC_DEMO_BEFORE);
  var after=hasChar?resolve(charUrl):resolve(VRC_DEMO_AFTER);
  var thumb=hasChar?resolve(charUrl):resolve(VRC_DEMO_AFTER);
  var videoBox=hasVideo
    ?'<div class="oiws-vrc-upload-preview"><img src="'+resolve(videoUrl)+'" alt="已选视频"><span class="oiws-vrc-upload-play" aria-hidden="true">▶</span></div>'
    :'<span class="oiws-vrc-upload-icon" aria-hidden="true">🎬</span><span class="oiws-vrc-upload-title">Your Video</span><span class="oiws-vrc-upload-sub">Video with person to be replaced</span>';
  var charBox=hasChar
    ?'<div class="oiws-vrc-upload-preview"><img src="'+resolve(charUrl)+'" alt="角色参考图"></div>'
    :'<span class="oiws-vrc-upload-icon" aria-hidden="true">🖼️</span><span class="oiws-vrc-upload-title">Character Image</span><span class="oiws-vrc-upload-sub">Upload image of the desired character</span>';
  el.innerHTML=
    '<div class="oiws-vrc-studio-inner">'+
    '<div class="oiws-vrc-layout">'+
    '<div class="oiws-vrc-left">'+
    '<h2 class="oiws-vrc-headline">SWAP CHARACTERS IN ANY VIDEO</h2>'+
    '<p class="oiws-vrc-desc">Unlock endless creative possibilities with our instant character swap. Effortlessly replace characters in any video with a single click.</p>'+
    '<div class="oiws-vrc-uploads">'+
    '<button type="button" class="oiws-vrc-upload-box'+(hasVideo?' has-media':'')+'" onclick="openOiwsVrcAsset(\'video\',event)">'+videoBox+'</button>'+
    '<button type="button" class="oiws-vrc-upload-box'+(hasChar?' has-media':'')+'" onclick="openOiwsVrcAsset(\'image\',event)">'+charBox+'</button>'+
    '</div>'+
    '</div>'+
    '<div class="oiws-vrc-right">'+
    '<div class="oiws-vrc-compare">'+
    '<img class="oiws-vrc-compare-before" src="'+before+'" alt="替换前">'+
    '<img class="oiws-vrc-compare-after" src="'+after+'" alt="替换后" style="clip-path:inset(0 '+(100-pos)+'% 0 0)">'+
    '<div class="oiws-vrc-compare-handle" style="left:'+pos+'%"><span aria-hidden="true">‹ ›</span></div>'+
    '<input type="range" class="oiws-vrc-compare-range" min="0" max="100" value="'+pos+'" aria-label="对比滑块" oninput="oiwsVrcSetCompare(this.value)">'+
    (hasChar?'<div class="oiws-vrc-char-thumb"><img src="'+thumb+'" alt="角色参考"></div>':'')+
    '</div></div></div>'+
    '<section class="oiws-vrc-howto">'+
    '<h3 class="oiws-vrc-howto-title">HOW TO SWAP CHARACTER IN THE VIDEO</h3>'+
    '<ol class="oiws-vrc-howto-list">'+
    '<li>Upload your source video with the person to replace</li>'+
    '<li>Upload a clear character reference image</li>'+
    '<li>Click 运行 to generate and preview the before / after comparison</li>'+
    '</ol></section></div>';
  el.classList.remove('hidden');
  el.setAttribute('aria-hidden','false');
  var crumb=document.getElementById('oiws-vrc-crumb');
  if(crumb)crumb.classList.remove('hidden');
}
function hideVideoRecastStudio(){
  var el=document.getElementById('oiws-vrc-studio');
  if(el){el.classList.add('hidden');el.setAttribute('aria-hidden','true');el.innerHTML='';}
  var crumb=document.getElementById('oiws-vrc-crumb');
  if(crumb)crumb.classList.add('hidden');
}
window.openOiwsVrcAsset=function(kind,ev){
  if(ev&&ev.stopPropagation)ev.stopPropagation();
  if(aiwsState.oiwsVariant!=='video-recast')return;
  if(kind==='video'){
    assetPickTarget={page:'oiws',slotIndex:0,mediaType:'video',slotKind:'video'};
    if(typeof openAssetModal==='function')openAssetModal('video',{preserve:['omni-image-workspace-modal']});
    else if(typeof openModal==='function')openModal('asset-modal',{preserve:['omni-image-workspace-modal']});
  }else{
    assetPickTarget={page:'oiws',slotIndex:1,mediaType:'image'};
    if(typeof openAssetModal==='function')openAssetModal('image',{preserve:['omni-image-workspace-modal']});
    else if(typeof openModal==='function')openModal('asset-modal',{preserve:['omni-image-workspace-modal']});
  }
};
window.oiwsVrcSetCompare=function(val){
  aiwsState.vrcComparePos=Math.max(0,Math.min(100,Number(val)||50));
  var after=document.querySelector('#oiws-vrc-studio .oiws-vrc-compare-after');
  var handle=document.querySelector('#oiws-vrc-studio .oiws-vrc-compare-handle');
  var range=document.querySelector('#oiws-vrc-studio .oiws-vrc-compare-range');
  if(after)after.style.clipPath='inset(0 '+(100-aiwsState.vrcComparePos)+'% 0 0)';
  if(handle)handle.style.left=aiwsState.vrcComparePos+'%';
  if(range)range.value=String(aiwsState.vrcComparePos);
};
var UO_DEMO_HERO='assets/video-outfit-banner.png';
var UO_ASPECT_OPTIONS=['9:16','3:4','1:1','4:3','16:9'];
var UO_AUDIO_QUALITY_OPTIONS=['Standard','High','Lossless'];
var UO_MUSIC_PRESETS=[
  {id:'vapor',name:'VAPOR SKIN',gradient:'linear-gradient(135deg,#06b6d4 0%,#8b5cf6 50%,#f43f5e 100%)'},
  {id:'tokyo',name:'TOKYO DUST',gradient:'linear-gradient(135deg,#f97316 0%,#eab308 45%,#84cc16 100%)'},
  {id:'soft',name:'SOFT STATIC',gradient:'linear-gradient(135deg,#a78bfa 0%,#6366f1 55%,#312e81 100%)'},
  {id:'neon',name:'NEON DRIFT',gradient:'linear-gradient(135deg,#22d3ee 0%,#3b82f6 50%,#a855f7 100%)'},
  {id:'sweet',name:'Sweet Collapse',gradient:'linear-gradient(135deg,#ec4899 0%,#f472b6 40%,#a855f7 100%)'},
  {id:'midnight',name:'MIDNIGHT RUN',gradient:'linear-gradient(135deg,#1e293b 0%,#334155 50%,#64748b 100%)'},
  {id:'chrome',name:'CHROME HEART',gradient:'linear-gradient(135deg,#e2e8f0 0%,#94a3b8 50%,#475569 100%)'},
  {id:'pulse',name:'PULSE WAVE',gradient:'linear-gradient(135deg,#ef4444 0%,#f97316 50%,#facc15 100%)'},
  {id:'glass',name:'GLASS ROOM',gradient:'linear-gradient(135deg,#67e8f9 0%,#818cf8 50%,#c084fc 100%)'},
  {id:'dust',name:'DUST MOTOR',gradient:'linear-gradient(135deg,#78716c 0%,#a8a29e 50%,#d6d3d1 100%)'},
  {id:'velvet',name:'VELVET SKY',gradient:'linear-gradient(135deg,#7c3aed 0%,#db2777 50%,#f472b6 100%)'},
  {id:'sugar',name:'SUGAR RUSH',gradient:'linear-gradient(135deg,#fde68a 0%,#fb923c 50%,#f43f5e 100%)'},
  {id:'haze',name:'HAZE LINE',gradient:'linear-gradient(135deg,#6ee7b7 0%,#34d399 50%,#059669 100%)'},
  {id:'orbit',name:'ORBIT GLOW',gradient:'linear-gradient(135deg,#38bdf8 0%,#2563eb 50%,#1e40af 100%)'}
];
function _oiwsUoEnsureState(){
  if(typeof aiwsState.uoStep!=='number'||aiwsState.uoStep<1||aiwsState.uoStep>4)aiwsState.uoStep=1;
  if(!aiwsState.uoAspect)aiwsState.uoAspect='9:16';
  if(!aiwsState.uoQuality)aiwsState.uoQuality='Standard';
  if(aiwsState.uoOutfitId==null)aiwsState.uoOutfitId='';
  if(aiwsState.uoMusicId==null)aiwsState.uoMusicId='';
}
function _oiwsUoEscapeAttr(s){
  return String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
}
function _oiwsUoResolve(url){
  return typeof oiwsResolveAssetUrl==='function'?oiwsResolveAssetUrl(url):url||'';
}
function _oiwsUoStepBars(step){
  var html='';
  for(var i=1;i<=4;i++){
    html+='<span class="oiws-uo-step-bar'+(i<=step?' is-active':'')+'"></span>';
  }
  return html;
}
function _oiwsUoOutfitTileHtml(o,selected){
  if(o.custom){
    return '<button type="button" class="oiws-uo-outfit-tile oiws-uo-outfit-tile--upload'+(selected?' is-selected':'')+'" onclick="openOiwsUoOutfitUpload(event)" aria-pressed="'+(selected?'true':'false')+'">'+
      '<span class="oiws-uo-outfit-upload-icon" aria-hidden="true">+</span>'+
      '<span class="oiws-uo-outfit-upload-label">Upload outfit</span></button>';
  }
  var sw=(o.swatch||['#fff','#111','#888']).map(function(c,i){
    return '<span class="oiws-uo-outfit-piece oiws-uo-outfit-piece--'+(i+1)+'" style="background:'+c+'"></span>';
  }).join('');
  return '<button type="button" class="oiws-uo-outfit-tile'+(selected?' is-selected':'')+'" onclick="oiwsUoPickOutfit(\''+o.id+'\',event)" aria-pressed="'+(selected?'true':'false')+'">'+sw+'</button>';
}
function _oiwsUoMusicTileHtml(m,selected){
  if(m.type==='upload'){
    return '<button type="button" class="oiws-uo-music-tile oiws-uo-music-tile--action'+(selected?' is-selected':'')+'" onclick="openOiwsUoMusicUpload(event)" aria-pressed="'+(selected?'true':'false')+'">'+
      '<span class="oiws-uo-music-action-icon" aria-hidden="true">♪</span>'+
      '<span class="oiws-uo-music-action-label">Upload Music</span></button>';
  }
  if(m.type==='random'){
    return '<button type="button" class="oiws-uo-music-tile oiws-uo-music-tile--action'+(selected?' is-selected':'')+'" onclick="oiwsUoRandomMusic(event)" aria-pressed="'+(selected?'true':'false')+'">'+
      '<span class="oiws-uo-music-action-icon" aria-hidden="true">⇄</span>'+
      '<span class="oiws-uo-music-action-label">Random</span></button>';
  }
  var label=_oiwsUoEscapeAttr(m.name);
  return '<button type="button" class="oiws-uo-music-tile'+(selected?' is-selected':'')+'" style="background:'+(m.gradient||'#333')+'" onclick="oiwsUoPickMusic(\''+m.id+'\',event)" aria-pressed="'+(selected?'true':'false')+'" title="'+label+'">'+
    '<span class="oiws-uo-music-name">'+label+'</span></button>';
}
function _oiwsUoOutfitPreviewHtml(){
  _oiwsUoEnsureState();
  var oid=aiwsState.uoOutfitId;
  if(oid==='custom'&&aiwsState.uoCustomOutfitUrl){
    return '<img class="oiws-uo-review-img" src="'+_oiwsUoEscapeAttr(_oiwsUoResolve(aiwsState.uoCustomOutfitUrl))+'" alt="Outfit">';
  }
  var o=FITTING_ROOM_OUTFITS.find(function(x){return x.id===oid;});
  if(!o)return '<div class="oiws-uo-review-outfit-empty">未选择套装</div>';
  return _oiwsUoOutfitTileHtml(o,true).replace(/<button[^>]*>/,'<div class="oiws-uo-review-outfit-inner">').replace(/<\/button>/,'</div>');
}
function _oiwsUoMusicLabel(){
  _oiwsUoEnsureState();
  if(aiwsState.uoMusicId==='upload')return aiwsState.uoCustomMusicName||'Uploaded Track';
  if(aiwsState.uoMusicId==='random'){
    var rid=aiwsState.uoRandomMusicId;
    var m=UO_MUSIC_PRESETS.find(function(x){return x.id===rid;});
    return m?m.name:'Random';
  }
  var preset=UO_MUSIC_PRESETS.find(function(x){return x.id===aiwsState.uoMusicId;});
  return preset?preset.name:'';
}
function _oiwsUoMusicPreviewStyle(){
  _oiwsUoEnsureState();
  if(aiwsState.uoMusicId==='upload')return 'linear-gradient(135deg,#27272a,#52525b)';
  var id=aiwsState.uoMusicId==='random'?aiwsState.uoRandomMusicId:aiwsState.uoMusicId;
  var m=UO_MUSIC_PRESETS.find(function(x){return x.id===id;});
  return m&&m.gradient?m.gradient:'linear-gradient(135deg,#3f3f46,#71717a)';
}
function buildVideoOutfitParamsForm(){
  return '';
}
function renderVideoOutfitStudio(){
  var el=document.getElementById('oiws-uo-studio');
  if(!el)return;
  _oiwsUoEnsureState();
  var step=aiwsState.uoStep;
  var resolve=_oiwsUoResolve;
  var photo=(aiwsState.uploadPreviews&&aiwsState.uploadPreviews[0])||'';
  var hasPhoto=!!photo;
  var leftTop='';
  if(step>1){
    leftTop='<div class="oiws-uo-top">'+
      '<button type="button" class="oiws-uo-back" onclick="oiwsUoBack()" aria-label="上一步">←</button>'+
      '<div class="oiws-uo-steps" aria-hidden="true">'+_oiwsUoStepBars(step)+'</div>'+
      '</div>';
  }
  var leftBody='';
  var rightBody='';
  if(step===1){
    leftBody=
      '<h2 class="oiws-uo-title">CREATE BEAT-SYNCED OUTFIT VIDEOS</h2>'+
      '<p class="oiws-uo-desc">Transform your photo and outfit into a dynamic video with cuts perfectly synced to music.</p>'+
      '<button type="button" class="oiws-uo-upload'+(hasPhoto?' has-photo':'')+'" onclick="openOiwsUoPhotoUpload(event)">'+
      (hasPhoto?'<img class="oiws-uo-upload-img" src="'+_oiwsUoEscapeAttr(resolve(photo))+'" alt="已上传照片">':
        '<span class="oiws-uo-upload-icon" aria-hidden="true">🖼</span>'+
        '<span class="oiws-uo-upload-label">Upload Your Photo</span>'+
        '<span class="oiws-uo-upload-sub">PNG, JPG, paste, or drag and drop.</span>')+
      '</button>'+
      '<button type="button" class="oiws-uo-continue" onclick="oiwsUoContinue()">Continue</button>';
    var hero=hasPhoto?resolve(photo):resolve(UO_DEMO_HERO);
    rightBody='<div class="oiws-uo-hero"><img src="'+_oiwsUoEscapeAttr(hero)+'" alt="预览"><button type="button" class="oiws-uo-hero-wand" aria-label="效果预览" onclick="showToast(\'✨ 生成后展示换装视频（演示）\')">✨</button></div>';
  }else if(step===2){
    leftBody=
      leftTop+
      '<h2 class="oiws-uo-title">CHOOSE YOUR OUTFIT</h2>'+
      '<p class="oiws-uo-desc">Select an outfit or upload your own. For best results, use images without faces or backgrounds.</p>'+
      '<button type="button" class="oiws-uo-continue" onclick="oiwsUoContinue()">Continue</button>';
    var sel=aiwsState.uoOutfitId;
    var grid=_oiwsUoOutfitTileHtml({custom:true},sel==='custom');
    grid+=FITTING_ROOM_OUTFITS.map(function(o){
      return _oiwsUoOutfitTileHtml(o,sel===o.id);
    }).join('');
    rightBody='<div class="oiws-uo-outfit-grid">'+grid+'</div>';
  }else if(step===3){
    leftBody=
      leftTop+
      '<h2 class="oiws-uo-title">CHOOSE YOUR MUSIC</h2>'+
      '<p class="oiws-uo-desc">Select a music track for your video. Cuts will sync automatically to the beat.</p>'+
      '<button type="button" class="oiws-uo-continue" onclick="oiwsUoContinue()">Continue</button>';
    var mid=aiwsState.uoMusicId;
    var mgrid=_oiwsUoMusicTileHtml({type:'upload'},mid==='upload');
    mgrid+=_oiwsUoMusicTileHtml({type:'random'},mid==='random');
    mgrid+=UO_MUSIC_PRESETS.map(function(m){
      var on=mid===m.id||(mid==='random'&&aiwsState.uoRandomMusicId===m.id);
      return _oiwsUoMusicTileHtml(m,on);
    }).join('');
    rightBody='<div class="oiws-uo-music-grid">'+mgrid+'</div>';
  }else{
    leftBody=
      leftTop+
      '<h2 class="oiws-uo-title">REVIEW &amp; GENERATE</h2>'+
      '<p class="oiws-uo-desc">Your video will be 10 seconds with cuts synced to the music beat. Review your selections before generating.</p>';
    var photoSrc=hasPhoto?resolve(photo):resolve(UO_DEMO_HERO);
    var musicName=_oiwsUoEscapeAttr(_oiwsUoMusicLabel()||'Sweet Collapse');
    rightBody=
      '<div class="oiws-uo-review">'+
      '<div class="oiws-uo-review-row">'+
      '<div class="oiws-uo-review-card"><span class="oiws-uo-review-label"><span aria-hidden="true">🖼</span> Photo</span>'+
      '<div class="oiws-uo-review-media oiws-uo-review-media--photo"><img src="'+_oiwsUoEscapeAttr(photoSrc)+'" alt="Photo"></div></div>'+
      '<div class="oiws-uo-review-card"><span class="oiws-uo-review-label"><span aria-hidden="true">👕</span> Outfit</span>'+
      '<div class="oiws-uo-review-media oiws-uo-review-media--outfit">'+_oiwsUoOutfitPreviewHtml()+'</div></div></div>'+
      '<div class="oiws-uo-review-card oiws-uo-review-card--music"><span class="oiws-uo-review-label"><span aria-hidden="true">♪</span> Music</span>'+
      '<div class="oiws-uo-review-media oiws-uo-review-media--music" style="background:'+_oiwsUoMusicPreviewStyle()+'"><span class="oiws-uo-review-music-name">'+musicName+'</span></div></div>'+
      '</div>';
  }
  el.innerHTML=
    '<div class="oiws-uo-studio-inner">'+
    '<div class="oiws-uo-card">'+
    '<div class="oiws-uo-wizard">'+
    '<div class="oiws-uo-left">'+leftBody+'</div>'+
    '<div class="oiws-uo-right">'+rightBody+'</div>'+
    '</div></div></div>';
  el.classList.remove('hidden');
  el.setAttribute('aria-hidden','false');
  var crumb=document.getElementById('oiws-uo-crumb');
  if(crumb)crumb.classList.remove('hidden');
  syncOiwsUoRunBar();
}
function syncOiwsUoRunBar(){
  var side=document.querySelector('#omni-image-workspace-modal .oiws-side');
  var runBar=document.querySelector('#omni-image-workspace-modal .oiws-run-bar');
  if(!side||!runBar)return;
  if(aiwsState.oiwsVariant!=='video-outfit'){
    side.classList.remove('oiws-uo-side--hidden');
    runBar.classList.remove('oiws-uo-run-bar--step4');
    var stale=document.getElementById('oiws-uo-run-options');
    if(stale)stale.remove();
    return;
  }
  _oiwsUoEnsureState();
  var step=aiwsState.uoStep||1;
  side.classList.toggle('oiws-uo-side--hidden',step<4);
  runBar.classList.toggle('oiws-uo-run-bar--step4',step>=4);
  if(step<4){
    var rm=document.getElementById('oiws-uo-run-options');
    if(rm)rm.remove();
    return;
  }
  var opts=document.getElementById('oiws-uo-run-options');
  if(!opts){
    opts=document.createElement('div');
    opts.id='oiws-uo-run-options';
    opts.className='oiws-uo-run-options';
    var runBtn=document.getElementById('oiws-run-btn');
    if(runBtn)runBar.insertBefore(opts,runBtn);
    else runBar.appendChild(opts);
  }
  var asp=aiwsState.uoAspect||'9:16';
  var qual=aiwsState.uoQuality||'Standard';
  var aspOpts=UO_ASPECT_OPTIONS.map(function(v){
    return '<option value="'+v+'"'+(v===asp?' selected':'')+'>'+v+'</option>';
  }).join('');
  var qualOpts=UO_AUDIO_QUALITY_OPTIONS.map(function(v){
    return '<option value="'+v+'"'+(v===qual?' selected':'')+'>'+v+'</option>';
  }).join('');
  opts.innerHTML=
    '<label class="oiws-uo-run-field">'+
    '<span class="oiws-uo-run-field-icon" aria-hidden="true">📱</span>'+
    '<select class="oiws-uo-run-select" aria-label="分辨率" onchange="oiwsUoSetAspect(this.value)">'+aspOpts+'</select></label>'+
    '<label class="oiws-uo-run-field">'+
    '<span class="oiws-uo-run-field-icon" aria-hidden="true">♪</span>'+
    '<select class="oiws-uo-run-select" aria-label="音频质量" onchange="oiwsUoSetQuality(this.value)">'+qualOpts+'</select></label>';
}
function hideVideoOutfitStudio(){
  var el=document.getElementById('oiws-uo-studio');
  if(el){el.classList.add('hidden');el.setAttribute('aria-hidden','true');el.innerHTML='';}
  var crumb=document.getElementById('oiws-uo-crumb');
  if(crumb)crumb.classList.add('hidden');
  syncOiwsUoRunBar();
}
window.openOiwsUoPhotoUpload=function(ev){
  if(ev&&ev.stopPropagation)ev.stopPropagation();
  if(aiwsState.oiwsVariant!=='video-outfit')return;
  assetPickTarget={page:'oiws',slotIndex:0,mediaType:'image',videoOutfit:true,uoPickMode:'photo'};
  if(typeof openAssetModal==='function')openAssetModal('image',{preserve:['omni-image-workspace-modal']});
  else if(typeof openModal==='function')openModal('asset-modal',{preserve:['omni-image-workspace-modal']});
};
window.openOiwsUoOutfitUpload=function(ev){
  if(ev&&ev.stopPropagation)ev.stopPropagation();
  if(aiwsState.oiwsVariant!=='video-outfit')return;
  assetPickTarget={page:'oiws',slotIndex:0,mediaType:'image',videoOutfit:true,uoPickMode:'outfit'};
  if(typeof openAssetModal==='function')openAssetModal('image',{preserve:['omni-image-workspace-modal']});
  else if(typeof openModal==='function')openModal('asset-modal',{preserve:['omni-image-workspace-modal']});
};
window.openOiwsUoMusicUpload=function(ev){
  if(ev&&ev.stopPropagation)ev.stopPropagation();
  if(aiwsState.oiwsVariant!=='video-outfit')return;
  assetPickTarget={page:'oiws',slotIndex:0,mediaType:'audio',videoOutfit:true,uoPickMode:'music'};
  if(typeof openAssetModal==='function')openAssetModal('audio',{preserve:['omni-image-workspace-modal']});
  else if(typeof openModal==='function')openModal('asset-modal',{preserve:['omni-image-workspace-modal']});
};
window.oiwsUoBack=function(){
  _oiwsUoEnsureState();
  if(aiwsState.uoStep>1){
    aiwsState.uoStep--;
    renderVideoOutfitStudio();
  }
};
window.oiwsUoContinue=function(){
  _oiwsUoEnsureState();
  var photo=(aiwsState.uploadPreviews&&aiwsState.uploadPreviews[0])||'';
  if(aiwsState.uoStep===1){
    if(!photo){
      if(typeof showToast==='function')showToast('请先上传照片');
      return;
    }
    aiwsState.uoStep=2;
  }else if(aiwsState.uoStep===2){
    if(!aiwsState.uoOutfitId){
      if(typeof showToast==='function')showToast('请选择或上传套装');
      return;
    }
    aiwsState.uoStep=3;
    if(!aiwsState.uoMusicId)aiwsState.uoMusicId='sweet';
  }else if(aiwsState.uoStep===3){
    if(!aiwsState.uoMusicId){
      if(typeof showToast==='function')showToast('请选择音乐');
      return;
    }
    aiwsState.uoStep=4;
  }
  renderVideoOutfitStudio();
};
window.oiwsUoPickOutfit=function(id,ev){
  if(ev&&ev.stopPropagation)ev.stopPropagation();
  _oiwsUoEnsureState();
  aiwsState.uoOutfitId=id;
  renderVideoOutfitStudio();
};
window.oiwsUoPickMusic=function(id,ev){
  if(ev&&ev.stopPropagation)ev.stopPropagation();
  _oiwsUoEnsureState();
  aiwsState.uoMusicId=id;
  aiwsState.uoRandomMusicId='';
  renderVideoOutfitStudio();
};
window.oiwsUoRandomMusic=function(ev){
  if(ev&&ev.stopPropagation)ev.stopPropagation();
  _oiwsUoEnsureState();
  var idx=Math.floor(Math.random()*UO_MUSIC_PRESETS.length);
  aiwsState.uoMusicId='random';
  aiwsState.uoRandomMusicId=UO_MUSIC_PRESETS[idx].id;
  renderVideoOutfitStudio();
};
window.oiwsUoSetAspect=function(val){
  aiwsState.uoAspect=val||'9:16';
};
window.oiwsUoSetQuality=function(val){
  aiwsState.uoQuality=val||'Standard';
};
function _oiwsUoConfirmAssets(mode,sel){
  _oiwsUoEnsureState();
  if(mode==='photo'){
    var url=_oiwsFrResolveSelImageUrl(sel);
    if(!url)return 0;
    if(!aiwsState.uploadPreviews)aiwsState.uploadPreviews=[''];
    aiwsState.uploadPreviews[0]=url;
    renderVideoOutfitStudio();
    return 1;
  }
  if(mode==='outfit'){
    var ourl=_oiwsFrResolveSelImageUrl(sel);
    if(!ourl)return 0;
    aiwsState.uoOutfitId='custom';
    aiwsState.uoCustomOutfitUrl=ourl;
    renderVideoOutfitStudio();
    return 1;
  }
  if(mode==='music'&&sel.name){
    aiwsState.uoMusicId='upload';
    aiwsState.uoCustomMusicName=sel.name;
    renderVideoOutfitStudio();
    return 1;
  }
  return 0;
}
var CHAR_REPLACE_DEFAULT_PROMPT='4k.';
var CHAR_REPLACE_DEMO_WORKS=[
  {user:'user_kwbvchv',emoji:'🎬',gradient:'linear-gradient(135deg,#1e3a5f,#0f766e)',title:'影视场景替换',type:'image',prompt:'多人场景角色替换，保持五官一致',model:'人物替换 V3',likes:396,views:5200,uses:72,price:'⚡0.7',params:'1280 · 4k'},
  {user:'剪辑小王',emoji:'🎞️',gradient:'linear-gradient(135deg,#134e4a,#115e59)',title:'恶搞短片换脸',type:'image',prompt:'喜剧向人物替换，自然融合',model:'人物替换 V3',likes:218,views:3100,uses:41,price:'⚡0.7',params:'1280'},
  {user:'阿姨AI',emoji:'👩',gradient:'linear-gradient(135deg,#0c4a6e,#164e63)',title:'双人合照替换',type:'image',prompt:'两人场景逐一替换，国产模型',model:'人物替换 V3',likes:512,views:8900,uses:156,price:'⚡0.7',params:'1280 · Standard'},
  {user:'NeoFilm',emoji:'🌃',gradient:'linear-gradient(135deg,#312e81,#1e3a8a)',title:'夜景街拍融合',type:'image',prompt:'夜景场景人物替换，肤色一致',model:'人物替换 V3',likes:167,views:2400,uses:28,price:'⚡0.7',params:'1280'}
];
function buildCharacterReplaceParamsForm(p){
  p=p||{};
  var promptText=p.defaultPrompt||CHAR_REPLACE_DEFAULT_PROMPT;
  var res=aiwsState.crResolution!=null?aiwsState.crResolution:1280;
  var plane=function(title,content){
    return '<div class="oiws-item-plane">'+
      '<button type="button" class="oiws-plane-top" onclick="toggleOiwsPlane(this)">'+
      '<span class="oiws-plane-title" title="'+title+'">'+title+'</span>'+
      '<span class="oiws-plane-collapse" aria-hidden="true"></span></button>'+
      '<div class="oiws-plane-main">'+content+'</div></div>';
  };
  var uploadSlot=function(slot,idx){
    var previews=aiwsState.uploadPreviews||CHAR_REPLACE_UPLOAD_SLOTS.map(function(s){return s.preview;});
    var preview=previews[idx]||'';
    var hasImg=!!preview;
    return '<div class="oiws-upload-slot" data-oiws-slot="'+idx+'">'+
      (hasImg?'<button type="button" class="oiws-upload-delete" onclick="deleteOiwsUploadSlot(event,'+idx+')" aria-label="删除">×</button>':'')+
      '<div class="oiws-upload-wrap" role="button" tabindex="0" onclick="openOiwsUploadAsset('+idx+')">'+
      (hasImg?'<img class="oiws-upload-img" src="'+preview+'" width="110" height="110" alt="">':
        '<div class="oiws-upload-placeholder" aria-hidden="true">+</div>')+
      '</div></div>';
  };
  return CHAR_REPLACE_UPLOAD_SLOTS.map(function(slot,idx){
    return plane(slot.title,uploadSlot(slot,idx));
  }).join('')+
    plane('分辨率','<div class="oiws-resolution-field">'+
      '<input type="range" class="oiws-resolution-range" id="oiws-cr-resolution" min="512" max="2048" step="64" value="'+res+'" '+
      'oninput="oiwsCrResolutionChange(this)">'+
      '<span class="oiws-resolution-value" id="oiws-cr-resolution-val">'+res+'</span></div>')+
    plane('输入提示词','<div class="oiws-text-wrap"><textarea class="oiws-textarea" maxlength="5000" placeholder="补充画质与风格，如 4k、自然融合…">'+String(promptText).replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</textarea></div>');
}
function buildFaceSwapOutfitParamsForm(p){
  p=p||{};
  var plane=function(title,content){
    return '<div class="oiws-item-plane">'+
      '<button type="button" class="oiws-plane-top" onclick="toggleOiwsPlane(this)">'+
      '<span class="oiws-plane-title" title="'+title+'">'+title+'</span>'+
      '<span class="oiws-plane-collapse" aria-hidden="true"></span></button>'+
      '<div class="oiws-plane-main">'+content+'</div></div>';
  };
  var uploadSlot=function(slot,idx){
    var previews=aiwsState.uploadPreviews||FSO_UPLOAD_SLOTS.map(function(s){return s.preview;});
    var preview=previews[idx]||'';
    var hasImg=!!preview;
    return '<div class="oiws-upload-slot" data-oiws-slot="'+idx+'">'+
      (hasImg?'<button type="button" class="oiws-upload-delete" onclick="deleteOiwsUploadSlot(event,'+idx+')" aria-label="删除">×</button>':'')+
      (hasImg?'<button type="button" class="oiws-upload-edit" onclick="event.stopPropagation();openOiwsUploadAsset('+idx+')" aria-label="编辑">✎</button>':'')+
      '<div class="oiws-upload-wrap" role="button" tabindex="0" onclick="openOiwsUploadAsset('+idx+')">'+
      (hasImg?'<img class="oiws-upload-img" src="'+preview+'" width="110" height="110" alt="">':
        '<div class="oiws-upload-placeholder" aria-hidden="true">+</div>')+
      '</div></div>';
  };
  return FSO_UPLOAD_SLOTS.map(function(slot,idx){
    return plane(slot.title,uploadSlot(slot,idx));
  }).join('');
}
window.oiwsCrResolutionChange=function(input){
  var v=parseInt(input&&input.value,10)||1280;
  aiwsState.crResolution=v;
  var el=document.getElementById('oiws-cr-resolution-val');
  if(el)el.textContent=String(v);
};
var SHORT_DRAMA_UPLOAD_SLOTS=[
  {title:'人物角色',preview:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=220&q=70&auto=format&fit=crop'}
];
var SHORT_DRAMA_DEFAULT_PLOT='刘峰，男，28岁，互联网公司产品经理。性格内敛但观察力敏锐，因一次意外卷入都市悬疑事件。故事从雨夜加班回家开始，他在地铁站遇见神秘女子，随后收到一封没有寄件人的旧照片……';
function buildShortDramaParamsForm(p){
  p=p||{};
  var plotText=p.defaultPlot||SHORT_DRAMA_DEFAULT_PLOT;
  var plane=function(title,content){
    return '<div class="oiws-item-plane">'+
      '<button type="button" class="oiws-plane-top" onclick="toggleOiwsPlane(this)">'+
      '<span class="oiws-plane-title" title="'+title+'">'+title+'</span>'+
      '<span class="oiws-plane-collapse" aria-hidden="true"></span></button>'+
      '<div class="oiws-plane-main">'+content+'</div></div>';
  };
  var select=function(id,options,selectedIdx){
    return '<select class="oiws-select" id="'+id+'">'+
      options.map(function(opt,i){
        return '<option value="'+opt.value+'"'+(i===(selectedIdx||0)?' selected':'')+'>'+opt.label+'</option>';
      }).join('')+'</select>';
  };
  var previews=aiwsState.uploadPreviews||SHORT_DRAMA_UPLOAD_SLOTS.map(function(s){return s.preview;});
  var preview=previews[0]||'';
  var hasImg=!!preview;
  var charSlot='<div class="oiws-upload-slot" data-oiws-slot="0">'+
    (hasImg?'<button type="button" class="oiws-upload-delete" onclick="deleteOiwsUploadSlot(event,0)" aria-label="删除">×</button>':'')+
    '<div class="oiws-upload-wrap" role="button" tabindex="0" onclick="openOiwsUploadAsset(0)">'+
    (hasImg?'<img class="oiws-upload-img" src="'+preview+'" width="110" height="110" alt="">':
      '<div class="oiws-upload-placeholder" aria-hidden="true">+</div>')+
    '</div></div>';
  return plane('人物角色',charSlot)+
    plane('剧情背景描述','<div class="oiws-text-wrap"><textarea class="oiws-textarea oiws-textarea--plot" maxlength="12000" placeholder="描述人物关系、场景与剧情走向…">'+String(plotText).replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</textarea></div>')+
    plane('图片大小',select('oiws-sd-size',[
      {value:'1k',label:'1k'},{value:'2k',label:'2k'},{value:'4k',label:'4k'}
    ],1));
}
var LTX2_DIGITAL_HUMAN_IMAGE='https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=220&q=70&auto=format&fit=crop';
function buildLtx2DigitalHumanParamsForm(p){
  p=p||{};
  var hasAudio=!!(aiwsState.ttsAudioName||aiwsState.uploadPreviews&&aiwsState.uploadPreviews[0]);
  var plane=function(title,content){
    return '<div class="oiws-item-plane">'+
      '<button type="button" class="oiws-plane-top" onclick="toggleOiwsPlane(this)">'+
      '<span class="oiws-plane-title" title="'+title+'">'+title+'</span>'+
      '<span class="oiws-plane-collapse" aria-hidden="true"></span></button>'+
      '<div class="oiws-plane-main">'+content+'</div></div>';
  };
  var audioSlot='<div class="oiws-upload-slot oiws-upload-slot--audio" data-oiws-slot="0">'+
    (hasAudio?'<button type="button" class="oiws-upload-delete" onclick="deleteOiwsUploadSlot(event,0)" aria-label="删除">×</button>':'')+
    '<div class="oiws-audio-upload" role="button" tabindex="0" onclick="openOiwsUploadAsset(0)">'+
    '<div class="oiws-audio-wave" aria-hidden="true"></div>'+
    '<div class="oiws-audio-meta">'+
    '<span class="oiws-audio-name">'+(aiwsState.ttsAudioName||'驱动音频.wav')+'</span>'+
    '<span class="oiws-audio-hint">'+(hasAudio?'点击更换':'点击上传音频')+'</span></div></div></div>';
  var previews=aiwsState.uploadPreviews||['',LTX2_DIGITAL_HUMAN_IMAGE];
  var preview=previews[1]||'';
  var hasImg=!!preview;
  var imageSlot='<div class="oiws-upload-slot" data-oiws-slot="1">'+
    (hasImg?'<button type="button" class="oiws-upload-delete" onclick="deleteOiwsUploadSlot(event,1)" aria-label="删除">×</button>':'')+
    (hasImg?'<button type="button" class="oiws-upload-edit" onclick="event.stopPropagation();openOiwsUploadAsset(1)" aria-label="编辑">✎</button>':'')+
    '<div class="oiws-upload-wrap" role="button" tabindex="0" onclick="openOiwsUploadAsset(1)">'+
    (hasImg?'<img class="oiws-upload-img" src="'+preview+'" width="110" height="110" alt="">':
      '<div class="oiws-upload-placeholder" aria-hidden="true">+</div>')+
    '</div></div>';
  return plane('上传音频',audioSlot)+plane('上传图片',imageSlot);
}
var VFS_MODEL_IMAGE='https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=220&q=70&auto=format&fit=crop';
var VFS_VIDEO_THUMB='assets/video-face-swap-banner.png';
var VFS_BANNER='assets/video-face-swap-banner.png';
var VFS_DEFAULT_PROMPT='穿碎花裙在跳舞';
var VFS_DEMO_WORKS=[
  {user:'小齐齐',emoji:'▶',gradient:'linear-gradient(135deg,#1e3a5f,#7c3aed)',coverImage:'assets/video-face-swap-banner.png',title:'碎花裙跳舞换脸',type:'video',prompt:'穿碎花裙在跳舞',model:'视频换脸',likes:6,views:180,uses:12,price:'⚡0.7',params:'5s · 832 · Standard',recommended:true}
];
window.oiwsVfsNumStep=function(field,delta,min,max){
  var id=field==='duration'?'oiws-vfs-duration':'oiws-vfs-maxside';
  var el=document.getElementById(id);
  if(!el)return;
  var v=parseInt(el.textContent,10)||0;
  v=Math.min(max,Math.max(min,v+delta));
  el.textContent=String(v);
  if(field==='duration')aiwsState.vfsDuration=v;
  else aiwsState.vfsMaxSide=v;
};
function buildVideoFaceSwapParamsForm(p){
  p=p||{};
  var promptText=p.defaultPrompt||VFS_DEFAULT_PROMPT;
  var dur=aiwsState.vfsDuration!=null?aiwsState.vfsDuration:(typeof p.vfsDuration==='number'?p.vfsDuration:5);
  var maxSide=aiwsState.vfsMaxSide!=null?aiwsState.vfsMaxSide:(typeof p.vfsMaxSide==='number'?p.vfsMaxSide:832);
  var plane=function(title,content){
    return '<div class="oiws-item-plane">'+
      '<button type="button" class="oiws-plane-top" onclick="toggleOiwsPlane(this)">'+
      '<span class="oiws-plane-title" title="'+title+'">'+title+'</span>'+
      '<span class="oiws-plane-collapse" aria-hidden="true"></span></button>'+
      '<div class="oiws-plane-main">'+content+'</div></div>';
  };
  var stepper=function(id,val,field,min,max){
    return '<div class="oiws-qty-stepper" role="group" aria-label="'+field+'">'+
      '<button type="button" onclick="oiwsVfsNumStep(\''+field+'\',-1,'+min+','+max+')" aria-label="减少">−</button>'+
      '<span id="'+id+'">'+val+'</span>'+
      '<button type="button" onclick="oiwsVfsNumStep(\''+field+'\',1,'+min+','+max+')" aria-label="增加">+</button></div>';
  };
  var previews=aiwsState.uploadPreviews||[VFS_MODEL_IMAGE,VFS_VIDEO_THUMB];
  var facePreview=previews[0]||'';
  var hasFace=!!facePreview;
  var faceSlot='<div class="oiws-upload-slot" data-oiws-slot="0">'+
    (hasFace?'<button type="button" class="oiws-upload-delete" onclick="deleteOiwsUploadSlot(event,0)" aria-label="删除">×</button>':'')+
    (hasFace?'<button type="button" class="oiws-upload-edit" onclick="event.stopPropagation();openOiwsUploadAsset(0)" aria-label="编辑">✎</button>':'')+
    '<div class="oiws-upload-wrap" role="button" tabindex="0" onclick="openOiwsUploadAsset(0)">'+
    (hasFace?'<img class="oiws-upload-img" src="'+oiwsResolveAssetUrl(facePreview)+'" width="110" height="110" alt="">':
      '<div class="oiws-upload-placeholder" aria-hidden="true">+</div>')+
    '</div></div>';
  var videoPreview=previews[1]||'';
  var hasVideo=!!(aiwsState.vfsVideoName||videoPreview);
  var videoSlot='<div class="oiws-upload-slot oiws-upload-slot--video" data-oiws-slot="1">'+
    (hasVideo?'<button type="button" class="oiws-upload-delete" onclick="deleteOiwsUploadSlot(event,1)" aria-label="删除">×</button>':'')+
    '<div class="oiws-video-upload" role="button" tabindex="0" onclick="openOiwsUploadAsset(1)">'+
    (hasVideo?'<img class="oiws-video-upload-thumb" src="'+oiwsResolveAssetUrl(videoPreview)+'" alt="">'+
      '<span class="oiws-video-upload-name">'+(aiwsState.vfsVideoName||'参考视频.mp4')+'</span>':
      '<div class="oiws-video-upload-placeholder"><span class="oiws-video-upload-placeholder-icon" aria-hidden="true">🎬</span><span>点击上传 Video</span></div>')+
    '</div></div>';
  return plane('image-上传模特照片',faceSlot)+
    plane('video',videoSlot)+
    plane('value时长',stepper('oiws-vfs-duration',dur,'duration',1,60))+
    plane('value最长边',stepper('oiws-vfs-maxside',maxSide,'maxside',256,2048))+
    plane('text','<div class="oiws-text-wrap"><textarea class="oiws-textarea oiws-textarea--prompt" maxlength="2000" placeholder="描述动作、服装与场景…">'+String(promptText).replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</textarea></div>');
}
var MOTION_TRANSFER_IMAGE='https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=220&q=70&auto=format&fit=crop';
var MOTION_TRANSFER_VIDEO_THUMB='https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=220&q=70&auto=format&fit=crop';
var MOTION_TRANSFER_DEMO_WORKS=[
  {user:'StarTed',emoji:'▶',gradient:'linear-gradient(135deg,#7c2d12,#c2410c)',title:'车内镜头动作迁移',type:'video',prompt:'参考舞蹈律动迁移至角色人像，保持面部一致',model:'Wan2.2 AnimateV2',likes:28,views:420,uses:16,price:'⚡0.7',params:'9:16 · Standard'}
];
function buildMotionTransferParamsForm(p){
  p=p||{};
  var plane=function(title,content){
    return '<div class="oiws-item-plane">'+
      '<button type="button" class="oiws-plane-top" onclick="toggleOiwsPlane(this)">'+
      '<span class="oiws-plane-title" title="'+title+'">'+title+'</span>'+
      '<span class="oiws-plane-collapse" aria-hidden="true"></span></button>'+
      '<div class="oiws-plane-main">'+content+'</div></div>';
  };
  var uploadImg=function(idx,preview){
    var hasImg=!!preview;
    return '<div class="oiws-upload-slot" data-oiws-slot="'+idx+'">'+
      (hasImg?'<button type="button" class="oiws-upload-delete" onclick="deleteOiwsUploadSlot(event,'+idx+')" aria-label="删除">×</button>':'')+
      '<div class="oiws-upload-wrap" role="button" tabindex="0" onclick="openOiwsUploadAsset('+idx+')">'+
      (hasImg?'<img class="oiws-upload-img" src="'+preview+'" width="110" height="110" alt="">':
        '<div class="oiws-upload-placeholder" aria-hidden="true">+</div>')+
      '</div></div>';
  };
  var previews=aiwsState.uploadPreviews||[MOTION_TRANSFER_IMAGE,MOTION_TRANSFER_VIDEO_THUMB];
  var videoPreview=previews[1]||'';
  var hasVideo=!!(aiwsState.motionVideoName||videoPreview);
  var videoSlot='<div class="oiws-upload-slot oiws-upload-slot--video" data-oiws-slot="1">'+
    (hasVideo?'<button type="button" class="oiws-upload-delete" onclick="deleteOiwsUploadSlot(event,1)" aria-label="删除">×</button>':'')+
    '<div class="oiws-video-upload" role="button" tabindex="0" onclick="openOiwsUploadAsset(1)">'+
    (hasVideo?'<img class="oiws-video-upload-thumb" src="'+videoPreview+'" alt="">'+
      '<span class="oiws-video-upload-name">'+(aiwsState.motionVideoName||'参考视频.mp4')+'</span>':
      '<div class="oiws-video-upload-placeholder"><span class="oiws-video-upload-placeholder-icon" aria-hidden="true">🎬</span><span>点击上传 Video</span></div>')+
    '</div></div>';
  return plane('添加图像',uploadImg(0,previews[0]||''))+plane('Video',videoSlot);
}
var KEYFRAMES_FRAME_START='assets/wan22-keyframes-frame-start.png';
var KEYFRAMES_FRAME_END='assets/wan22-keyframes-frame-end.jpg';
var KEYFRAMES_DEFAULT_PROMPT='一位美女，她转了一圈，裙子变成了牛仔裙';
var COUPLE_POSTCARD_IMAGE_1='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=220&q=70&auto=format&fit=crop';
var COUPLE_POSTCARD_IMAGE_2='https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=220&q=70&auto=format&fit=crop';
var COUPLE_POSTCARD_DEMO_WORKS=[
  {user:'Crazy Lychee',emoji:'💌',gradient:'linear-gradient(135deg,#312e81,#9d174d)',coverImage:'assets/anime-couple-postcard-banner.png',title:'草帽情侣明信片',type:'image',prompt:'二次元手绘情侣明信片',model:'GPT-Image-1',likes:12,views:280,uses:1,price:'⚡0.7',params:'1280',recommended:true},
  {user:'Crazy Lychee',emoji:'💌',gradient:'linear-gradient(135deg,#4c1d95,#db2777)',coverImage:'assets/anime-couple-postcard-banner.png',title:'夏日饮品主题',type:'image',model:'GPT 4o',likes:8,views:190,uses:1,price:'⚡0.7',params:'1280'},
  {user:'Momo',emoji:'🎨',gradient:'linear-gradient(135deg,#831843,#be1858)',coverImage:'assets/anime-couple-postcard-banner.png',title:'节日限定款',type:'image',model:'GPT-Image-1',likes:6,views:120,uses:1,price:'⚡0.7',params:'1280'},
  {user:'星野',emoji:'✨',gradient:'linear-gradient(135deg,#1e3a5f,#7c3aed)',coverImage:'assets/anime-couple-postcard-banner.png',title:'签名线稿风',type:'image',model:'GPT 4o',likes:5,views:98,uses:1,price:'⚡0.7',params:'1280'},
  {user:'Lychee',emoji:'🌸',gradient:'linear-gradient(135deg,#134e4a,#0d9488)',coverImage:'assets/anime-couple-postcard-banner.png',title:'双人竖版明信片',type:'image',model:'GPT-Image-1',likes:4,views:76,uses:1,price:'⚡0.7',params:'1280'}
];
var ECOMMERCE_DETAIL_IMAGE='https://images.unsplash.com/photo-1556228720-195a672e8a03?w=220&q=70&auto=format&fit=crop';
var ECOMMERCE_DETAIL_DEMO_WORKS=[
  {user:'AI地铺创作',emoji:'🛒',gradient:'linear-gradient(135deg,#ea580c,#f97316)',coverImage:'assets/ecommerce-detail-banner.png',title:'护肤品详情页套图',type:'image',prompt:'电商详情页 10 张，护肤品类，中文',model:'V3 直出',likes:2,views:77,uses:1,price:'⚡0.7',params:'1280',recommended:true},
  {user:'ShopAI',emoji:'👗',gradient:'linear-gradient(135deg,#c2410c,#fb923c)',coverImage:'assets/ecommerce-detail-banner.png',title:'服装详情页',type:'image',model:'V3 直出',likes:1,views:42,uses:1,price:'⚡0.7',params:'1280'},
  {user:'跨境卖家',emoji:'🧳',gradient:'linear-gradient(135deg,#9a3412,#ea580c)',coverImage:'assets/ecommerce-detail-banner.png',title:'箱包详情页（英文）',type:'image',model:'V3 直出',likes:1,views:28,uses:1,price:'⚡0.7',params:'1280'}
];
function buildEcommerceDetailParamsForm(p){
  p=p||{};
  var plane=function(title,content){
    return '<div class="oiws-item-plane">'+
      '<button type="button" class="oiws-plane-top" onclick="toggleOiwsPlane(this)">'+
      '<span class="oiws-plane-title" title="'+title+'">'+title+'</span>'+
      '<span class="oiws-plane-collapse" aria-hidden="true"></span></button>'+
      '<div class="oiws-plane-main">'+content+'</div></div>';
  };
  var previews=aiwsState.uploadPreviews||[ECOMMERCE_DETAIL_IMAGE];
  var preview=previews[0]||'';
  var hasImg=!!preview;
  var src=hasImg?oiwsResolveAssetUrl(preview):'';
  var imageSlot='<div class="oiws-upload-slot" data-oiws-slot="0">'+
    (hasImg?'<button type="button" class="oiws-upload-delete" onclick="deleteOiwsUploadSlot(event,0)" aria-label="删除">×</button>':'')+
    (hasImg?'<button type="button" class="oiws-upload-edit" onclick="event.stopPropagation();openOiwsUploadAsset(0)" aria-label="编辑">✎</button>':'')+
    '<div class="oiws-upload-wrap" role="button" tabindex="0" onclick="openOiwsUploadAsset(0)">'+
    (hasImg?'<img class="oiws-upload-img" src="'+src+'" width="110" height="110" alt="">':
      '<div class="oiws-upload-placeholder" aria-hidden="true">+</div>')+
    '</div></div>';
  return plane('上传图片',imageSlot);
}
var EPM_UPLOAD_IMAGE='assets/ecommerce-product-multiangle-banner.png';
var EPM_DEFAULT_PROMPT='Next Scene: 将镜头向前移动\nNext Scene: 将镜头向左移动\nNext Scene: 将镜头变为俯视镜头\nNext Scene: 将镜头向右移动\nNext Scene: 将镜头向后移动\nNext Scene: 将镜头变为仰视镜头\nNext Scene: 将镜头向左旋转45度\nNext Scene: 将镜头向右旋转45度\nNext Scene: 将镜头拉远\nNext Scene: 将镜头推近';
function buildEcommerceProductMultiangleParamsForm(p){
  p=p||{};
  var promptText=p.defaultPrompt||EPM_DEFAULT_PROMPT;
  var plane=function(title,content){
    return '<div class="oiws-item-plane">'+
      '<button type="button" class="oiws-plane-top" onclick="toggleOiwsPlane(this)">'+
      '<span class="oiws-plane-title" title="'+title+'">'+title+'</span>'+
      '<span class="oiws-plane-collapse" aria-hidden="true"></span></button>'+
      '<div class="oiws-plane-main">'+content+'</div></div>';
  };
  var previews=aiwsState.uploadPreviews||[EPM_UPLOAD_IMAGE];
  var preview=previews[0]||'';
  var hasImg=!!preview;
  var src=hasImg?oiwsResolveAssetUrl(preview):'';
  var imageSlot='<div class="oiws-upload-slot" data-oiws-slot="0">'+
    (hasImg?'<button type="button" class="oiws-upload-delete" onclick="deleteOiwsUploadSlot(event,0)" aria-label="删除">×</button>':'')+
    (hasImg?'<button type="button" class="oiws-upload-edit" onclick="event.stopPropagation();openOiwsUploadAsset(0)" aria-label="编辑">✎</button>':'')+
    '<div class="oiws-upload-wrap" role="button" tabindex="0" onclick="openOiwsUploadAsset(0)">'+
    (hasImg?'<img class="oiws-upload-img" src="'+src+'" width="110" height="110" alt="">':
      '<div class="oiws-upload-placeholder" aria-hidden="true">+</div>')+
    '</div></div>';
  return plane('上传成品图',imageSlot)+
    plane('提示词（根据脚本自行调整）','<div class="oiws-text-wrap"><textarea class="oiws-textarea oiws-textarea--prompt" maxlength="8000" placeholder="按 Next Scene 填写镜头运动指令…">'+String(promptText).replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</textarea></div>');
}
var FLUX2_WATERMARK_IMAGE='https://images.unsplash.com/photo-1554118811-1e0d726b07d4?w=220&q=70&auto=format&fit=crop';
var FLUX2_WATERMARK_BANNER='assets/flux2-watermark-banner.png';
var ECOMMERCE_WHITE_BG_SCENE_BANNER='assets/ecommerce-white-bg-scene-banner.png';
var ECOMMERCE_WHITE_BG_UPLOAD_IMAGE='assets/ecommerce-white-bg-scene-banner.png';
var ECOMMERCE_MODEL_GEN_BANNER='assets/ecommerce-model-gen-banner.png';
var EMG_DEFAULT_PROMPT='女士修身长袖T恤打底衫，20-30岁亚洲年轻女性';
var EMG_UPLOAD_SLOTS=[
  {title:'产品图（必填）',preview:'https://images.unsplash.com/photo-1620799140188-3b2a021fb49c?w=400&q=80&auto=format&fit=crop'},
  {title:'模特参考图（必填）',preview:'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80&auto=format&fit=crop'}
];
var EMG_DEMO_WORKS=[
  {user:'Little Wrangler',emoji:'👗',gradient:'linear-gradient(135deg,#991b1b,#dc2626)',coverImage:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80&auto=format&fit=crop',title:'红色T恤模特展示',type:'image',prompt:'女士修身长袖T恤，电商模特图',model:'一键生成电商模特图',likes:42,views:680,uses:12,price:'⚡0.7',params:'图生图 · 5张'},
  {user:'电商视觉',emoji:'🛍️',gradient:'linear-gradient(135deg,#7f1d1d,#b91c1c)',coverImage:'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80&auto=format&fit=crop',title:'街拍风模特图',type:'image',prompt:'户外街拍电商展示',model:'一键生成电商模特图',likes:38,views:520,uses:9,price:'⚡0.7',params:'图生图'},
  {user:'Studio M',emoji:'📷',gradient:'linear-gradient(135deg,#9f1239,#e11d48)',coverImage:'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80&auto=format&fit=crop',title:'棚拍全身展示',type:'image',prompt:'棚拍全身模特展示图',model:'一键生成电商模特图',likes:31,views:410,uses:7,price:'⚡0.7',params:'图生图'},
  {user:'Luna',emoji:'💃',gradient:'linear-gradient(135deg,#be123c,#f43f5e)',coverImage:'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80&auto=format&fit=crop',title:'连衣裙模特图',type:'image',prompt:'连衣裙电商模特展示',model:'一键生成电商模特图',likes:27,views:360,uses:6,price:'⚡0.7',params:'图生图'},
  {user:'Brand K',emoji:'✨',gradient:'linear-gradient(135deg,#881337,#be1858)',coverImage:'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80&auto=format&fit=crop',title:'半身展示图',type:'image',prompt:'半身电商模特展示',model:'一键生成电商模特图',likes:24,views:290,uses:5,price:'⚡0.7',params:'图生图'},
  {user:'Mia',emoji:'🌸',gradient:'linear-gradient(135deg,#9d174d,#db2777)',coverImage:'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&q=80&auto=format&fit=crop',title:'时尚杂志风',type:'image',prompt:'杂志风电商模特图',model:'一键生成电商模特图',likes:22,views:270,uses:4,price:'⚡0.7',params:'图生图'},
  {user:'Chen',emoji:'👤',gradient:'linear-gradient(135deg,#831843,#9d174d)',coverImage:'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&q=80&auto=format&fit=crop',title:'休闲风展示',type:'image',prompt:'休闲风电商模特展示',model:'一键生成电商模特图',likes:19,views:240,uses:4,price:'⚡0.7',params:'图生图'},
  {user:'Neo',emoji:'🎨',gradient:'linear-gradient(135deg,#701a75,#a21caf)',coverImage:'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80&auto=format&fit=crop',title:'简约白底模特',type:'image',prompt:'白底简约模特展示',model:'一键生成电商模特图',likes:16,views:210,uses:3,price:'⚡0.7',params:'图生图'},
  {user:'Kate',emoji:'💄',gradient:'linear-gradient(135deg,#4c0519,#881337)',coverImage:'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&q=80&auto=format&fit=crop',title:'侧脸展示图',type:'image',prompt:'侧脸角度模特展示',model:'一键生成电商模特图',likes:14,views:180,uses:3,price:'⚡0.7',params:'图生图'},
  {user:'AI Shop',emoji:'🏪',gradient:'linear-gradient(135deg,#7c2d12,#ea580c)',coverImage:'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80&auto=format&fit=crop',title:'多姿态套图',type:'image',prompt:'多姿态电商模特套图',model:'一键生成电商模特图',likes:12,views:160,uses:2,price:'⚡0.7',params:'图生图 · 5张'}
];
var FLUX2_DEFAULT_PROMPT='去除画面水印与杂物，保持人物与场景细节不变，自然修复';
var OLD_PHOTO_UPLOAD_IMAGE='example1.png';
var IMG360_UPLOAD_IMAGE='https://images.unsplash.com/photo-1600210492493-0946911123d1?w=400&q=75&auto=format&fit=crop';
function buildImageTo360PanoramaParamsForm(p){
  p=p||{};
  var plane=function(title,content){
    return '<div class="oiws-item-plane">'+
      '<button type="button" class="oiws-plane-top" onclick="toggleOiwsPlane(this)">'+
      '<span class="oiws-plane-title" title="'+title+'">'+title+'</span>'+
      '<span class="oiws-plane-collapse" aria-hidden="true"></span></button>'+
      '<div class="oiws-plane-main">'+content+'</div></div>';
  };
  var previews=aiwsState.uploadPreviews||[IMG360_UPLOAD_IMAGE];
  var preview=previews[0]||'';
  var hasImg=!!preview;
  var src=hasImg?oiwsResolveAssetUrl(preview):'';
  var imageSlot='<div class="oiws-upload-slot" data-oiws-slot="0">'+
    (hasImg?'<button type="button" class="oiws-upload-delete" onclick="deleteOiwsUploadSlot(event,0)" aria-label="删除">×</button>':'')+
    (hasImg?'<button type="button" class="oiws-upload-edit" onclick="event.stopPropagation();openOiwsUploadAsset(0)" aria-label="编辑">✎</button>':'')+
    '<div class="oiws-upload-wrap" role="button" tabindex="0" onclick="openOiwsUploadAsset(0)">'+
    (hasImg?'<img class="oiws-upload-img" src="'+src+'" width="110" height="110" alt="">':
      '<div class="oiws-upload-placeholder" aria-hidden="true">+</div>')+
    '</div></div>';
  return plane('image',imageSlot);
}
function buildOldPhotoTimeMachineParamsForm(p){
  p=p||{};
  var plane=function(title,content){
    return '<div class="oiws-item-plane">'+
      '<button type="button" class="oiws-plane-top" onclick="toggleOiwsPlane(this)">'+
      '<span class="oiws-plane-title" title="'+title+'">'+title+'</span>'+
      '<span class="oiws-plane-collapse" aria-hidden="true"></span></button>'+
      '<div class="oiws-plane-main">'+content+'</div></div>';
  };
  var previews=aiwsState.uploadPreviews||[OLD_PHOTO_UPLOAD_IMAGE];
  var preview=previews[0]||'';
  var hasImg=!!preview;
  var src=hasImg?oiwsResolveAssetUrl(preview):'';
  var imageSlot='<div class="oiws-upload-slot" data-oiws-slot="0">'+
    (hasImg?'<button type="button" class="oiws-upload-delete" onclick="deleteOiwsUploadSlot(event,0)" aria-label="删除">×</button>':'')+
    (hasImg?'<button type="button" class="oiws-upload-edit" onclick="event.stopPropagation();openOiwsUploadAsset(0)" aria-label="编辑">✎</button>':'')+
    '<div class="oiws-upload-wrap" role="button" tabindex="0" onclick="openOiwsUploadAsset(0)">'+
    (hasImg?'<img class="oiws-upload-img oiws-upload-img--vintage" src="'+src+'" width="110" height="110" alt="">':
      '<div class="oiws-upload-placeholder" aria-hidden="true">+</div>')+
    '</div></div>';
  return plane('image',imageSlot);
}
function buildEcommerceModelGenParamsForm(p){
  p=p||{};
  var promptText=p.defaultPrompt||EMG_DEFAULT_PROMPT;
  var plane=function(title,content){
    return '<div class="oiws-item-plane">'+
      '<button type="button" class="oiws-plane-top" onclick="toggleOiwsPlane(this)">'+
      '<span class="oiws-plane-title" title="'+title+'">'+title+'</span>'+
      '<span class="oiws-plane-collapse" aria-hidden="true"></span></button>'+
      '<div class="oiws-plane-main">'+content+'</div></div>';
  };
  var uploadSlot=function(slot,idx){
    var previews=aiwsState.uploadPreviews||EMG_UPLOAD_SLOTS.map(function(s){return s.preview;});
    var preview=previews[idx]||'';
    var hasImg=!!preview;
    var src=hasImg?oiwsResolveAssetUrl(preview):'';
    return '<div class="oiws-upload-slot" data-oiws-slot="'+idx+'">'+
      (hasImg?'<button type="button" class="oiws-upload-delete" onclick="deleteOiwsUploadSlot(event,'+idx+')" aria-label="删除">×</button>':'')+
      (hasImg?'<button type="button" class="oiws-upload-edit" onclick="event.stopPropagation();openOiwsUploadAsset('+idx+')" aria-label="编辑">✎</button>':'')+
      '<div class="oiws-upload-wrap" role="button" tabindex="0" onclick="openOiwsUploadAsset('+idx+')">'+
      (hasImg?'<img class="oiws-upload-img oiws-upload-img--product" src="'+src+'" width="110" height="110" alt="">':
        '<div class="oiws-upload-placeholder" aria-hidden="true">+</div>')+
      '</div></div>';
  };
  return EMG_UPLOAD_SLOTS.map(function(slot,idx){
    return plane(slot.title,uploadSlot(slot,idx));
  }).join('')+
    plane('产品名称（必填）','<div class="oiws-text-wrap"><textarea class="oiws-textarea oiws-textarea--prompt" maxlength="2000" placeholder="描述产品品类、版型与适龄人群…">'+String(promptText).replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</textarea></div>');
}
function buildEcommerceWhiteBgSceneParamsForm(p){
  p=p||{};
  var plane=function(title,content){
    return '<div class="oiws-item-plane">'+
      '<button type="button" class="oiws-plane-top" onclick="toggleOiwsPlane(this)">'+
      '<span class="oiws-plane-title" title="'+title+'">'+title+'</span>'+
      '<span class="oiws-plane-collapse" aria-hidden="true"></span></button>'+
      '<div class="oiws-plane-main">'+content+'</div></div>';
  };
  var previews=aiwsState.uploadPreviews||[ECOMMERCE_WHITE_BG_UPLOAD_IMAGE];
  var preview=previews[0]||'';
  var hasImg=!!preview;
  var src=hasImg?oiwsResolveAssetUrl(preview):'';
  var imageSlot='<div class="oiws-upload-slot" data-oiws-slot="0">'+
    (hasImg?'<button type="button" class="oiws-upload-delete" onclick="deleteOiwsUploadSlot(event,0)" aria-label="删除">×</button>':'')+
    (hasImg?'<button type="button" class="oiws-upload-edit" onclick="event.stopPropagation();openOiwsUploadAsset(0)" aria-label="编辑">✎</button>':'')+
    '<div class="oiws-upload-wrap" role="button" tabindex="0" onclick="openOiwsUploadAsset(0)">'+
    (hasImg?'<img class="oiws-upload-img oiws-upload-img--product" src="'+src+'" width="110" height="110" alt="">':
      '<div class="oiws-upload-placeholder" aria-hidden="true">+</div>')+
    '</div></div>';
  return plane('模型',imageSlot);
}
function buildFlux2WatermarkParamsForm(p){
  p=p||{};
  var promptText=p.defaultPrompt||FLUX2_DEFAULT_PROMPT;
  var plane=function(title,content){
    return '<div class="oiws-item-plane">'+
      '<button type="button" class="oiws-plane-top" onclick="toggleOiwsPlane(this)">'+
      '<span class="oiws-plane-title" title="'+title+'">'+title+'</span>'+
      '<span class="oiws-plane-collapse" aria-hidden="true"></span></button>'+
      '<div class="oiws-plane-main">'+content+'</div></div>';
  };
  var previews=aiwsState.uploadPreviews||[FLUX2_WATERMARK_IMAGE];
  var preview=previews[0]||'';
  var hasImg=!!preview;
  var src=hasImg?oiwsResolveAssetUrl(preview):'';
  var imageSlot='<div class="oiws-upload-slot" data-oiws-slot="0">'+
    (hasImg?'<button type="button" class="oiws-upload-delete" onclick="deleteOiwsUploadSlot(event,0)" aria-label="删除">×</button>':'')+
    (hasImg?'<button type="button" class="oiws-upload-edit" onclick="event.stopPropagation();openOiwsUploadAsset(0)" aria-label="编辑">✎</button>':'')+
    '<div class="oiws-upload-wrap" role="button" tabindex="0" onclick="openOiwsUploadAsset(0)">'+
    (hasImg?'<img class="oiws-upload-img" src="'+src+'" width="110" height="110" alt="">':
      '<div class="oiws-upload-placeholder" aria-hidden="true">+</div>')+
    '</div></div>';
  return plane('上传图片',imageSlot)+
    plane('提示词（可选）','<div class="oiws-text-wrap"><textarea class="oiws-textarea oiws-textarea--prompt" maxlength="2000" placeholder="补充去水印范围或保留区域说明…">'+String(promptText).replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</textarea></div>');
}
var ECOM_DH_VIDEO_THUMB='assets/ecommerce-digital-human-banner.png';
var ECOM_DH_FACE_IMAGE='https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=220&q=70&auto=format&fit=crop';
var ECOM_DH_DEFAULT_COPY='随时随地，一张图一段文案介绍你的产品，推荐15秒生成';
function buildEcommerceDigitalHumanParamsForm(p){
  p=p||{};
  var copyText=p.defaultCopy||ECOM_DH_DEFAULT_COPY;
  var plane=function(title,content){
    return '<div class="oiws-item-plane">'+
      '<button type="button" class="oiws-plane-top" onclick="toggleOiwsPlane(this)">'+
      '<span class="oiws-plane-title" title="'+title+'">'+title+'</span>'+
      '<span class="oiws-plane-collapse" aria-hidden="true"></span></button>'+
      '<div class="oiws-plane-main">'+content+'</div></div>';
  };
  var select=function(id,options,selectedIdx){
    return '<select class="oiws-select" id="'+id+'">'+
      options.map(function(opt,i){
        return '<option value="'+opt.value+'"'+(i===(selectedIdx||0)?' selected':'')+'>'+opt.label+'</option>';
      }).join('')+'</select>';
  };
  var previews=aiwsState.uploadPreviews||[ECOM_DH_VIDEO_THUMB,'audio',ECOM_DH_FACE_IMAGE];
  var videoPreview=previews[0]||'';
  var hasVideo=!!(aiwsState.ecomDhVideoName||videoPreview);
  var videoSlot='<div class="oiws-upload-slot oiws-upload-slot--video" data-oiws-slot="0">'+
    (hasVideo?'<button type="button" class="oiws-upload-delete" onclick="deleteOiwsUploadSlot(event,0)" aria-label="删除">×</button>':'')+
    '<div class="oiws-video-upload" role="button" tabindex="0" onclick="openOiwsUploadAsset(0)">'+
    (hasVideo?'<img class="oiws-video-upload-thumb" src="'+oiwsResolveAssetUrl(videoPreview)+'" alt="">'+
      '<span class="oiws-video-upload-name">'+(aiwsState.ecomDhVideoName||'口播参考.mp4')+'</span>':
      '<div class="oiws-video-upload-placeholder"><span class="oiws-video-upload-placeholder-icon" aria-hidden="true">🎬</span><span>点击上传视频</span></div>')+
    '</div></div>';
  var hasAudio=!!(aiwsState.ttsAudioName||previews[1]==='audio');
  var audioSlot='<div class="oiws-upload-slot oiws-upload-slot--audio" data-oiws-slot="1">'+
    (hasAudio?'<button type="button" class="oiws-upload-delete" onclick="deleteOiwsUploadSlot(event,1)" aria-label="删除">×</button>':'')+
    '<div class="oiws-audio-upload" role="button" tabindex="0" onclick="openOiwsUploadAsset(1)">'+
    '<div class="oiws-audio-wave" aria-hidden="true"></div>'+
    '<div class="oiws-audio-meta">'+
    '<span class="oiws-audio-name">'+(aiwsState.ttsAudioName||'克隆音频.wav')+'</span>'+
    '<span class="oiws-audio-hint">'+(hasAudio?'上方已选择 · 点击更换':'点击上传音频')+'</span></div></div></div>';
  var facePreview=previews[2]||'';
  var hasFace=!!facePreview;
  var faceSrc=hasFace?oiwsResolveAssetUrl(facePreview):'';
  var faceSlot='<div class="oiws-upload-slot" data-oiws-slot="2">'+
    (hasFace?'<button type="button" class="oiws-upload-delete" onclick="deleteOiwsUploadSlot(event,2)" aria-label="删除">×</button>':'')+
    (hasFace?'<button type="button" class="oiws-upload-edit" onclick="event.stopPropagation();openOiwsUploadAsset(2)" aria-label="编辑">✎</button>':'')+
    '<div class="oiws-upload-wrap" role="button" tabindex="0" onclick="openOiwsUploadAsset(2)">'+
    (hasFace?'<img class="oiws-upload-img" src="'+faceSrc+'" width="110" height="110" alt="">':
      '<div class="oiws-upload-placeholder" aria-hidden="true">+</div>')+
    '</div></div>';
  return plane('上传（视频）',videoSlot)+
    plane('输入文案','<div class="oiws-text-wrap"><textarea class="oiws-textarea oiws-textarea--copy" maxlength="2000" placeholder="输入口播文案…">'+String(copyText).replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</textarea></div>')+
    plane('语音选择',select('oiws-edh-voice',[
      {value:'default-female',label:'默认女声'},{value:'sihao-female',label:'思浩女声'},
      {value:'default-male',label:'默认男声'},{value:'clone',label:'克隆音色（需上传音频）'}
    ],0))+
    plane('上传音频',audioSlot)+
    plane('上传（表情驱动）',faceSlot);
}
function refreshOiwsEcomDhVideoSlot(idx){
  var slotEl=document.querySelector('#oiws-params-form [data-oiws-slot="'+idx+'"]');
  if(!slotEl)return;
  var previews=aiwsState.uploadPreviews||[];
  var videoPreview=previews[idx]||'';
  var hasVideo=!!(aiwsState.ecomDhVideoName||videoPreview);
  slotEl.className='oiws-upload-slot oiws-upload-slot--video';
  slotEl.innerHTML=
    (hasVideo?'<button type="button" class="oiws-upload-delete" onclick="deleteOiwsUploadSlot(event,'+idx+')" aria-label="删除">×</button>':'')+
    '<div class="oiws-video-upload" role="button" tabindex="0" onclick="openOiwsUploadAsset('+idx+')">'+
    (hasVideo?'<img class="oiws-video-upload-thumb" src="'+oiwsResolveAssetUrl(videoPreview)+'" alt="">'+
      '<span class="oiws-video-upload-name">'+(aiwsState.ecomDhVideoName||'口播参考.mp4')+'</span>':
      '<div class="oiws-video-upload-placeholder"><span class="oiws-video-upload-placeholder-icon" aria-hidden="true">🎬</span><span>点击上传视频</span></div>')+
    '</div>';
}
function refreshOiwsEcomDhAudioSlot(idx){
  var slotEl=document.querySelector('#oiws-params-form [data-oiws-slot="'+idx+'"]');
  if(!slotEl)return;
  var hasAudio=!!aiwsState.ttsAudioName;
  slotEl.className='oiws-upload-slot oiws-upload-slot--audio';
  slotEl.innerHTML=
    (hasAudio?'<button type="button" class="oiws-upload-delete" onclick="deleteOiwsUploadSlot(event,'+idx+')" aria-label="删除">×</button>':'')+
    '<div class="oiws-audio-upload" role="button" tabindex="0" onclick="openOiwsUploadAsset('+idx+')">'+
    '<div class="oiws-audio-wave" aria-hidden="true"></div>'+
    '<div class="oiws-audio-meta"><span class="oiws-audio-name">'+(aiwsState.ttsAudioName||'克隆音频.wav')+'</span>'+
    '<span class="oiws-audio-hint">'+(hasAudio?'上方已选择 · 点击更换':'点击上传音频')+'</span></div></div>';
}
var SEEDANCE20_ROLE1='https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=220&q=70&auto=format&fit=crop';
var SEEDANCE20_BANNER='assets/seedance20-banner.png';
var SEEDANCE20_DEFAULT_PROMPT='图一角色A，图二角色B，严格按照图三故事板的分镜执行，总时长10秒。角色外观锁定图一和图二，场景锁定海岸公路，保持角色和车辆一致性。';
function buildSeedance20ParamsForm(p){
  p=p||{};
  var promptText=p.defaultPrompt||SEEDANCE20_DEFAULT_PROMPT;
  var plane=function(title,content,collapsed){
    return '<div class="oiws-item-plane'+(collapsed?' is-collapsed':'')+'">'+
      '<button type="button" class="oiws-plane-top" onclick="toggleOiwsPlane(this)">'+
      '<span class="oiws-plane-title" title="'+title+'">'+title+'</span>'+
      '<span class="oiws-plane-collapse" aria-hidden="true"></span></button>'+
      '<div class="oiws-plane-main">'+content+'</div></div>';
  };
  var select=function(id,options,selectedIdx){
    return '<select class="oiws-select" id="'+id+'">'+
      options.map(function(opt,i){
        return '<option value="'+opt.value+'"'+(i===(selectedIdx||0)?' selected':'')+'>'+opt.label+'</option>';
      }).join('')+'</select>';
  };
  var previews=aiwsState.uploadPreviews||[SEEDANCE20_ROLE1,'',''];
  var imageSlot=function(idx){
    var preview=previews[idx]||'';
    var hasImg=!!preview;
    var src=hasImg?oiwsResolveAssetUrl(preview):'';
    return '<div class="oiws-upload-slot" data-oiws-slot="'+idx+'">'+
      (hasImg?'<button type="button" class="oiws-upload-delete" onclick="deleteOiwsUploadSlot(event,'+idx+')" aria-label="删除">×</button>':'')+
      (hasImg?'<button type="button" class="oiws-upload-edit" onclick="event.stopPropagation();openOiwsUploadAsset('+idx+')" aria-label="编辑">✎</button>':'')+
      '<div class="oiws-upload-wrap" role="button" tabindex="0" onclick="openOiwsUploadAsset('+idx+')">'+
      (hasImg?'<img class="oiws-upload-img" src="'+src+'" width="110" height="110" alt="">':
        '<div class="oiws-upload-placeholder" aria-hidden="true">+</div>')+
      '</div></div>';
  };
  var noteHtml='<div class="oiws-seedance-note">'+
    '<p>前期资产 G2/Nano 筛，参考图定死上限；</p>'+
    '<p>无叙事、无运镜不用 SD2，有剧情纵深、高效运镜诉求才上；</p>'+
    '<p>极简提示词，重结构不堆词，不浪费解析力。</p></div>';
  return plane('角色卡1',imageSlot(0),false)+
    plane('角色卡2',imageSlot(1),true)+
    plane('故事板',imageSlot(2),true)+
    plane('比例',select('oiws-sd20-ratio',[
      {value:'16:9',label:'16:9'},{value:'9:16',label:'9:16'},
      {value:'1:1',label:'1:1'},{value:'4:3',label:'4:3'}
    ],0),false)+
    plane('分辨率',select('oiws-sd20-res',[
      {value:'720p',label:'720p'},{value:'1080p',label:'1080p'},{value:'480p',label:'480p'}
    ],0),false)+
    plane('多少秒',select('oiws-sd20-duration',[
      {value:'5',label:'5'},{value:'10',label:'10'},{value:'15',label:'15'},{value:'20',label:'20'}
    ],1),false)+
    plane('提示词','<div class="oiws-text-wrap"><textarea class="oiws-textarea oiws-textarea--prompt" maxlength="4000" placeholder="描述镜头运动、角色动作与场景变化…">'+String(promptText).replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</textarea></div>',true)+
    plane('【说明】',noteHtml,true);
}
var HEARTMULA_DEFAULT_THEME='孤独的小鸭在云';
var HEARTMULA_DEFAULT_GENRE='儿歌';
var HEARTMULA_DEFAULT_LANG='中文';
function buildHeartMulaParamsForm(p){
  p=p||{};
  var theme=p.songTheme||HEARTMULA_DEFAULT_THEME;
  var genre=p.songGenre||HEARTMULA_DEFAULT_GENRE;
  var lang=p.songLanguage||HEARTMULA_DEFAULT_LANG;
  var hasAudio=!!(aiwsState.ttsAudioName||aiwsState.uploadPreviews&&aiwsState.uploadPreviews[0]);
  var plane=function(title,content){
    return '<div class="oiws-item-plane">'+
      '<button type="button" class="oiws-plane-top" onclick="toggleOiwsPlane(this)">'+
      '<span class="oiws-plane-title" title="'+title+'">'+title+'</span>'+
      '<span class="oiws-plane-collapse" aria-hidden="true"></span></button>'+
      '<div class="oiws-plane-main">'+content+'</div></div>';
  };
  var esc=function(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');};
  var promptFields='<div class="oiws-heartmula-fields">'+
    '<label class="oiws-heartmula-row"><span class="oiws-heartmula-label">Theme</span>'+
    '<input type="text" class="oiws-heartmula-input" id="oiws-hm-theme" maxlength="200" value="'+esc(theme)+'" placeholder="歌曲主题"></label>'+
    '<label class="oiws-heartmula-row"><span class="oiws-heartmula-label">Music Genre</span>'+
    '<input type="text" class="oiws-heartmula-input" id="oiws-hm-genre" maxlength="80" value="'+esc(genre)+'" placeholder="如：儿歌、流行"></label>'+
    '<label class="oiws-heartmula-row"><span class="oiws-heartmula-label">Language</span>'+
    '<input type="text" class="oiws-heartmula-input" id="oiws-hm-lang" maxlength="40" value="'+esc(lang)+'" placeholder="中文 / English"></label></div>';
  var audioSlot='<div class="oiws-upload-slot oiws-upload-slot--audio" data-oiws-slot="0">'+
    (hasAudio?'<button type="button" class="oiws-upload-delete" onclick="deleteOiwsUploadSlot(event,0)" aria-label="删除">×</button>':'')+
    '<div class="oiws-audio-upload" role="button" tabindex="0" onclick="openOiwsUploadAsset(0)">'+
    '<div class="oiws-audio-wave" aria-hidden="true"></div>'+
    '<div class="oiws-audio-meta">'+
    '<span class="oiws-audio-name">'+(aiwsState.ttsAudioName||'参考音色.wav')+'</span>'+
    '<span class="oiws-audio-hint">'+(hasAudio?'点击更换':'点击上传参考音色')+'</span></div></div></div>';
  return plane('提示词',promptFields)+plane('上传参考音色',audioSlot);
}
function refreshOiwsHeartMulaAudioSlot(idx){
  var slotEl=document.querySelector('#oiws-params-form [data-oiws-slot="'+idx+'"]');
  if(!slotEl)return;
  var hasAudio=!!aiwsState.ttsAudioName;
  slotEl.className='oiws-upload-slot oiws-upload-slot--audio';
  slotEl.innerHTML=
    (hasAudio?'<button type="button" class="oiws-upload-delete" onclick="deleteOiwsUploadSlot(event,'+idx+')" aria-label="删除">×</button>':'')+
    '<div class="oiws-audio-upload" role="button" tabindex="0" onclick="openOiwsUploadAsset('+idx+')">'+
    '<div class="oiws-audio-wave" aria-hidden="true"></div>'+
    '<div class="oiws-audio-meta"><span class="oiws-audio-name">'+(aiwsState.ttsAudioName||'参考音色.wav')+'</span>'+
    '<span class="oiws-audio-hint">'+(hasAudio?'点击更换':'点击上传参考音色')+'</span></div></div>';
}
function buildCouplePostcardParamsForm(p){
  p=p||{};
  var plane=function(title,content){
    return '<div class="oiws-item-plane">'+
      '<button type="button" class="oiws-plane-top" onclick="toggleOiwsPlane(this)">'+
      '<span class="oiws-plane-title" title="'+title+'">'+title+'</span>'+
      '<span class="oiws-plane-collapse" aria-hidden="true"></span></button>'+
      '<div class="oiws-plane-main">'+content+'</div></div>';
  };
  var previews=aiwsState.uploadPreviews||[COUPLE_POSTCARD_IMAGE_1,COUPLE_POSTCARD_IMAGE_2];
  var imageSlot=function(idx){
    var preview=previews[idx]||'';
    var hasImg=!!preview;
    var src=hasImg?oiwsResolveAssetUrl(preview):'';
    return '<div class="oiws-upload-slot" data-oiws-slot="'+idx+'">'+
      (hasImg?'<button type="button" class="oiws-upload-delete" onclick="deleteOiwsUploadSlot(event,'+idx+')" aria-label="删除">×</button>':'')+
      (hasImg?'<button type="button" class="oiws-upload-edit" onclick="event.stopPropagation();openOiwsUploadAsset('+idx+')" aria-label="编辑">✎</button>':'')+
      '<div class="oiws-upload-wrap" role="button" tabindex="0" onclick="openOiwsUploadAsset('+idx+')">'+
      (hasImg?'<img class="oiws-upload-img" src="'+src+'" width="110" height="110" alt="">':
        '<div class="oiws-upload-placeholder" aria-hidden="true">+</div>')+
      '</div></div>';
  };
  return plane('上传图像一',imageSlot(0))+plane('上传图像二',imageSlot(1));
}
function buildKeyframesVideoParamsForm(p){
  p=p||{};
  var promptText=p.defaultPrompt||KEYFRAMES_DEFAULT_PROMPT;
  var plane=function(title,content){
    return '<div class="oiws-item-plane">'+
      '<button type="button" class="oiws-plane-top" onclick="toggleOiwsPlane(this)">'+
      '<span class="oiws-plane-title" title="'+title+'">'+title+'</span>'+
      '<span class="oiws-plane-collapse" aria-hidden="true"></span></button>'+
      '<div class="oiws-plane-main">'+content+'</div></div>';
  };
  var previews=aiwsState.uploadPreviews||[KEYFRAMES_FRAME_START,KEYFRAMES_FRAME_END];
  var imageSlot=function(idx){
    var preview=previews[idx]||'';
    var hasImg=!!preview;
    var src=hasImg?oiwsResolveAssetUrl(preview):'';
    return '<div class="oiws-upload-slot" data-oiws-slot="'+idx+'">'+
      (hasImg?'<button type="button" class="oiws-upload-delete" onclick="deleteOiwsUploadSlot(event,'+idx+')" aria-label="删除">×</button>':'')+
      (hasImg?'<button type="button" class="oiws-upload-edit" onclick="event.stopPropagation();openOiwsUploadAsset('+idx+')" aria-label="编辑">✎</button>':'')+
      '<div class="oiws-upload-wrap" role="button" tabindex="0" onclick="openOiwsUploadAsset('+idx+')">'+
      (hasImg?'<img class="oiws-upload-img" src="'+src+'" width="110" height="110" alt="">':
        '<div class="oiws-upload-placeholder" aria-hidden="true">+</div>')+
      '</div></div>';
  };
  return plane('image',imageSlot(0))+plane('image',imageSlot(1))+
    plane('text','<div class="oiws-text-wrap"><textarea class="oiws-textarea oiws-textarea--plot" maxlength="2000" placeholder="描述首尾帧之间的动作与变化…">'+String(promptText).replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</textarea></div>');
}
function refreshOiwsMotionVideoSlot(idx){
  var slotEl=document.querySelector('#oiws-params-form [data-oiws-slot="'+idx+'"]');
  if(!slotEl)return;
  var previews=aiwsState.uploadPreviews||['',MOTION_TRANSFER_VIDEO_THUMB];
  var videoPreview=previews[idx]||'';
  var hasVideo=!!(aiwsState.motionVideoName||videoPreview);
  slotEl.className='oiws-upload-slot oiws-upload-slot--video';
  slotEl.innerHTML=
    (hasVideo?'<button type="button" class="oiws-upload-delete" onclick="deleteOiwsUploadSlot(event,'+idx+')" aria-label="删除">×</button>':'')+
    '<div class="oiws-video-upload" role="button" tabindex="0" onclick="openOiwsUploadAsset('+idx+')">'+
    (hasVideo?'<img class="oiws-video-upload-thumb" src="'+videoPreview+'" alt="">'+
      '<span class="oiws-video-upload-name">'+(aiwsState.motionVideoName||'参考视频.mp4')+'</span>':
      '<div class="oiws-video-upload-placeholder"><span class="oiws-video-upload-placeholder-icon" aria-hidden="true">🎬</span><span>点击上传 Video</span></div>')+
    '</div>';
}
function refreshOiwsVfsVideoSlot(idx){
  var slotEl=document.querySelector('#oiws-params-form [data-oiws-slot="'+idx+'"]');
  if(!slotEl)return;
  var previews=aiwsState.uploadPreviews||[VFS_MODEL_IMAGE,VFS_VIDEO_THUMB];
  var videoPreview=previews[idx]||'';
  var hasVideo=!!(aiwsState.vfsVideoName||videoPreview);
  var thumbSrc=hasVideo?oiwsResolveAssetUrl(videoPreview):'';
  slotEl.className='oiws-upload-slot oiws-upload-slot--video';
  slotEl.innerHTML=
    (hasVideo?'<button type="button" class="oiws-upload-delete" onclick="deleteOiwsUploadSlot(event,'+idx+')" aria-label="删除">×</button>':'')+
    '<div class="oiws-video-upload" role="button" tabindex="0" onclick="openOiwsUploadAsset('+idx+')">'+
    (hasVideo?'<img class="oiws-video-upload-thumb" src="'+thumbSrc+'" alt="">'+
      '<span class="oiws-video-upload-name">'+(aiwsState.vfsVideoName||'参考视频.mp4')+'</span>':
      '<div class="oiws-video-upload-placeholder"><span class="oiws-video-upload-placeholder-icon" aria-hidden="true">🎬</span><span>点击上传 Video</span></div>')+
    '</div>';
}
function _parseRunPriceParts(price){
  var s=String(price||'⚡0.5').trim();
  var m=s.match(/([\d.]+)/);
  var num=m?m[1]:'0.5';
  var isR=/R/i.test(s)&&s.indexOf('⚡')<0&&s.indexOf('¥')<0;
  var isYuan=s.indexOf('¥')>=0;
  return {raw:s,num:num,isR:isR,isYuan:isYuan};
}
function _applyRunPriceToBoltNum(bolt,numEl,parts){
  if(!numEl)return;
  if(parts.isR||parts.isYuan){
    if(bolt){
      bolt.textContent=parts.isYuan?'¥':'R';
      bolt.classList.add('oiws-run-bolt--currency');
      bolt.classList.remove('is-hidden');
    }
    numEl.textContent=parts.num;
  }else{
    if(bolt){
      bolt.textContent='⚡';
      bolt.classList.remove('oiws-run-bolt--currency','is-hidden');
    }
    numEl.textContent=parts.num;
  }
}
function resolveOiwsRunPrice(p, flags){
  flags=flags||{};
  var fallback=flags.isKf?'⚡0.7':flags.isVfs?'⚡85':flags.isMotion?'⚡0.7':flags.isLtx?'⚡0.7':flags.isSd?'⚡0.7':flags.isTts?'⚡0.7':flags.isHeartMula?'⚡0.7':flags.isFlux2?'⚡0.7':flags.isEwbs?'⚡0.7':flags.isFr?'⚡2':flags.isVrc?'⚡2':flags.isCr||flags.isCp||flags.isEd||flags.isEdh||flags.isSeedance?'⚡0.7':flags.isImg360?'R 75':flags.isFso?'R 9':flags.isOpt?'R 23':flags.isPm?'⚡0.5':'⚡0.5';
  if(!p||!p.price)return fallback;
  var pr=String(p.price).trim();
  if((flags.isCp||flags.isEd)&&(pr.indexOf('¥')>=0||pr.indexOf('元')>=0||/R/i.test(pr)))return '⚡0.7';
  return p.price;
}
function syncOiwsRunPrice(price){
  var parts=_parseRunPriceParts(price);
  _applyRunPriceToBoltNum(
    document.getElementById('oiws-run-bolt'),
    document.getElementById('oiws-run-price-num'),
    parts
  );
}
function resetOiwsRunBar(mode){
  var labelEl=document.getElementById('oiws-run-label');
  var priceWrap=document.getElementById('oiws-run-price');
  var bolt=document.getElementById('oiws-run-bolt');
  var numEl=document.getElementById('oiws-run-price-num');
  var lite=document.getElementById('oiws-run-lite');
  var std=document.getElementById('oiws-run-standard');
  var plus=document.getElementById('oiws-run-plus');
  var btn=document.getElementById('oiws-run-btn');
  if(labelEl){
    labelEl.textContent='运行';
    labelEl.classList.remove('hidden');
  }
  if(priceWrap)priceWrap.classList.remove('oiws-run-price--dual');
  if(bolt){
    bolt.textContent='⚡';
    bolt.classList.remove('oiws-run-bolt--currency','is-hidden');
  }
  if(numEl)numEl.textContent='0.5';
  if(lite)lite.classList.add('hidden');
  if(std)std.classList.add('hidden');
  if(plus)plus.classList.add('hidden');
  if(btn){
    btn.classList.remove('oiws-run-btn-full--ecommerce','oiws-run-btn-full--plus');
    btn.setAttribute('aria-label','运行');
  }
  var runDur=document.getElementById('oiws-run-duration');
  if(runDur){
    runDur.textContent='';
    runDur.classList.add('hidden');
  }
  if(mode==='plus'){
    if(plus)plus.classList.remove('hidden');
    if(btn)btn.classList.add('oiws-run-btn-full--plus');
  }
  if(mode==='standard'){
    if(std)std.classList.remove('hidden');
    if(priceWrap)priceWrap.classList.add('hidden');
    if(btn)btn.classList.add('oiws-run-btn-full--ecommerce');
  }
}
function syncAiwsSideRunPrice(price){
  var parts=_parseRunPriceParts(price);
  _applyRunPriceToBoltNum(
    document.getElementById('aiws-side-run-bolt'),
    document.getElementById('aiws-side-run-price-num'),
    parts
  );
  var footerPrice=document.getElementById('aiws-run-price');
  if(footerPrice)footerPrice.textContent=parts.raw;
}
function buildPersonModelParamsForm(p){
  p=p||{};
  var promptText=p.defaultPrompt||PERSON_MODEL_DEFAULT_PROMPT;
  var plane=function(title,content){
    return '<div class="oiws-item-plane">'+
      '<button type="button" class="oiws-plane-top" onclick="toggleOiwsPlane(this)">'+
      '<span class="oiws-plane-title" title="'+title+'">'+title+'</span>'+
      '<span class="oiws-plane-collapse" aria-hidden="true"></span></button>'+
      '<div class="oiws-plane-main">'+content+'</div></div>';
  };
  var select=function(id,options,selectedIdx){
    return '<select class="oiws-select" id="'+id+'">'+
      options.map(function(opt,i){
        return '<option value="'+opt.value+'"'+(i===(selectedIdx||0)?' selected':'')+'>'+opt.label+'</option>';
      }).join('')+'</select>';
  };
  var qty=aiwsState.genQty!=null?aiwsState.genQty:1;
  return plane('提示词','<div class="oiws-text-wrap"><textarea class="oiws-textarea" maxlength="5000" placeholder="描述模特气质、服装、光线与构图…">'+String(promptText).replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</textarea></div>')+
    plane('图片比例',select('oiws-pm-ratio',[
      {value:'1:1',label:'正方形 1:1'},{value:'3:4',label:'竖屏比例 3:4'},
      {value:'4:3',label:'横屏比例 4:3'},{value:'16:9',label:'横屏比例 16:9'},
      {value:'9:16',label:'竖屏比例 9:16'}
    ],4))+
    plane('生成数量','<div class="oiws-qty-stepper" role="group" aria-label="生成数量">'+
      '<button type="button" onclick="oiwsQtyStep(-1)" aria-label="减少">−</button>'+
      '<span id="oiws-qty-val">'+qty+'</span>'+
      '<button type="button" onclick="oiwsQtyStep(1)" aria-label="增加">+</button></div>');
}
window.oiwsQtyStep=function(delta){
  var n=(aiwsState.genQty!=null?aiwsState.genQty:1)+(delta||0);
  if(n<1)n=1;
  if(n>4)n=4;
  aiwsState.genQty=n;
  var el=document.getElementById('oiws-qty-val');
  if(el)el.textContent=String(n);
};
var OMNI_IMAGE2_UPLOAD_SLOTS=[
  {title:'上传图像 1 【选填,一张图不上传默认是文生图】',preview:'https://images.unsplash.com/photo-1618005182384-a83a8bd3fbae?w=220&q=70&auto=format&fit=crop'},
  {title:'上传图像 2 【选填,用不上的图像可以直接删掉】',preview:'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=220&q=70&auto=format&fit=crop'},
  {title:'上传图像 3 【选填,工作流里面最多支持10张图】',preview:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=220&q=70&auto=format&fit=crop'}
];
var OMNI_IMAGE2_DEFAULT_PROMPT='近景构图（膝盖以上），图 1 的女孩穿着图 2 的衣服，身处图 3 的场景中，自信展示自我，姿态酷飒随性，眼神冷艳有气场，保持人物五官一致性，高级电影质感，光影干净柔和，细节超清，氛围感拉满，酷女孩风格，画面自然高级';
function buildOmniImage2ParamsForm(p){
  p=p||{};
  var promptText=p.defaultPrompt||OMNI_IMAGE2_DEFAULT_PROMPT;
  var plane=function(title,content){
    return '<div class="oiws-item-plane">'+
      '<button type="button" class="oiws-plane-top" onclick="toggleOiwsPlane(this)">'+
      '<span class="oiws-plane-title" title="'+title+'">'+title+'</span>'+
      '<span class="oiws-plane-collapse" aria-hidden="true"></span></button>'+
      '<div class="oiws-plane-main">'+content+'</div></div>';
  };
  var uploadSlot=function(slot,idx){
    var previews=aiwsState.uploadPreviews||OMNI_IMAGE2_UPLOAD_SLOTS.map(function(s){return s.preview;});
    var preview=previews[idx]||'';
    var hasImg=!!preview;
    return '<div class="oiws-upload-slot" data-oiws-slot="'+idx+'">'+
      (hasImg?'<button type="button" class="oiws-upload-delete" onclick="deleteOiwsUploadSlot(event,'+idx+')" aria-label="删除">×</button>':'')+
      '<div class="oiws-upload-wrap" role="button" tabindex="0" onclick="openOiwsUploadAsset('+idx+')">'+
      (hasImg?'<img class="oiws-upload-img" src="'+preview+'" width="110" height="110" alt="">':
        '<div class="oiws-upload-placeholder" aria-hidden="true">+</div>')+
      '</div></div>';
  };
  var select=function(id,options,selectedIdx){
    return '<select class="oiws-select" id="'+id+'">'+
      options.map(function(opt,i){
        return '<option value="'+opt.value+'"'+(i===(selectedIdx||0)?' selected':'')+'>'+opt.label+'</option>';
      }).join('')+'</select>';
  };
  return OMNI_IMAGE2_UPLOAD_SLOTS.map(function(slot,idx){
    return plane(slot.title,uploadSlot(slot,idx));
  }).join('')+
    plane('设置比例',select('oiws-ratio',[
      {value:'1:1',label:'1:1'},{value:'3:4',label:'3:4'},{value:'4:3',label:'4:3'},
      {value:'16:9',label:'16:9'},{value:'9:16',label:'9:16'}
    ],4))+
    plane('分辨率',select('oiws-resolution',[
      {value:'1k',label:'1k'},{value:'2k',label:'2k'},{value:'4k',label:'4k'}
    ],1))+
    plane('第三方/官方切换',select('oiws-channel',[
      {value:'lite',label:'第三方（低价渠道版）'},{value:'official',label:'官方稳定版'}
    ],0))+
    plane('输入文本','<div class="oiws-text-wrap"><textarea class="oiws-textarea" maxlength="5000" placeholder="描述画面主体、风格、光线与细节…">'+promptText+'</textarea></div>');
}
window.toggleOiwsPlane=function(btn){
  var plane=btn&&btn.closest('.oiws-item-plane');
  if(!plane)return;
  plane.classList.toggle('is-collapsed');
};
function initOiwsModal(){
  var modal=document.getElementById('omni-image-workspace-modal');
  if(!modal||modal.dataset.oiwsBound)return;
  modal.dataset.oiwsBound='1';
  modal.querySelectorAll('.oiws-main-tab').forEach(function(tab){
    tab.addEventListener('click',function(){
      switchOiwsMainTab(tab.getAttribute('data-oiws-main'));
    });
  });
}
window.openOiwsUploadAsset=function(slotIndex){
  if(aiwsState.oiwsVariant==='fitting-room'){
    openOiwsFrAssetPicker(slotIndex===0?'main':'append');
    return;
  }
  if(aiwsState.oiwsVariant==='video-recast'){
    openOiwsVrcAsset(slotIndex===0?'video':'image');
    return;
  }
  var isTts=aiwsState.oiwsVariant==='index-tts2';
  var isLtx=aiwsState.oiwsVariant==='ltx2-digital-human';
  var isMotion=aiwsState.oiwsVariant==='motion-transfer';
  var isEdh=aiwsState.oiwsVariant==='ecommerce-digital-human';
  var isHeartMula=aiwsState.oiwsVariant==='heartmula';
  if(isEdh&&slotIndex===0){
    assetPickTarget={page:'oiws',slotIndex:0,mediaType:'video',slotKind:'video'};
    if(typeof openAssetModal==='function'){
      openAssetModal('video',{preserve:['omni-image-workspace-modal']});
    }else if(typeof openModal==='function'){
      openModal('asset-modal',{preserve:['omni-image-workspace-modal']});
    }
    return;
  }
  if(isHeartMula&&slotIndex===0){
    assetPickTarget={page:'oiws',slotIndex:0,mediaType:'audio',slotKind:'audio'};
    if(typeof openAssetModal==='function'){
      openAssetModal('audio',{preserve:['omni-image-workspace-modal']});
    }else if(typeof openModal==='function'){
      openModal('asset-modal',{preserve:['omni-image-workspace-modal']});
    }
    return;
  }
  if(isEdh&&slotIndex===1){
    assetPickTarget={page:'oiws',slotIndex:1,mediaType:'audio',slotKind:'audio'};
    if(typeof openAssetModal==='function'){
      openAssetModal('audio',{preserve:['omni-image-workspace-modal']});
    }else if(typeof openModal==='function'){
      openModal('asset-modal',{preserve:['omni-image-workspace-modal']});
    }
    return;
  }
  if((isTts||isLtx)&&slotIndex===0){
    assetPickTarget={page:'oiws',slotIndex:0,mediaType:'audio',slotKind:'audio'};
    if(typeof openAssetModal==='function'){
      openAssetModal('audio',{preserve:['omni-image-workspace-modal']});
    }else if(typeof openModal==='function'){
      openModal('asset-modal',{preserve:['omni-image-workspace-modal']});
    }
    return;
  }
  if(isMotion&&slotIndex===1){
    assetPickTarget={page:'oiws',slotIndex:1,mediaType:'video',slotKind:'video'};
    if(typeof openAssetModal==='function'){
      openAssetModal('video',{preserve:['omni-image-workspace-modal']});
    }else if(typeof openModal==='function'){
      openModal('asset-modal',{preserve:['omni-image-workspace-modal']});
    }
    return;
  }
  assetPickTarget={page:'oiws',slotIndex:slotIndex,mediaType:'image'};
  if(typeof openAssetModal==='function'){
    openAssetModal('image',{preserve:['omni-image-workspace-modal']});
  }else if(typeof openModal==='function'){
    openModal('asset-modal',{preserve:['omni-image-workspace-modal']});
  }
};
window.deleteOiwsUploadSlot=function(ev,idx){
  if(ev){ev.stopPropagation();ev.preventDefault();}
  if(aiwsState.oiwsVariant==='ecommerce-digital-human'&&idx===0){
    aiwsState.ecomDhVideoName='';
    if(aiwsState.uploadPreviews)aiwsState.uploadPreviews[0]='';
    refreshOiwsEcomDhVideoSlot(0);
    return;
  }
  if(aiwsState.oiwsVariant==='ecommerce-digital-human'&&idx===1){
    aiwsState.ttsAudioName='';
    if(aiwsState.uploadPreviews)aiwsState.uploadPreviews[1]='';
    refreshOiwsEcomDhAudioSlot(1);
    return;
  }
  if((aiwsState.oiwsVariant==='index-tts2'||aiwsState.oiwsVariant==='ltx2-digital-human'||aiwsState.oiwsVariant==='heartmula')&&idx===0){
    aiwsState.ttsAudioName='';
    if(aiwsState.uploadPreviews)aiwsState.uploadPreviews[0]='';
    if(aiwsState.oiwsVariant==='heartmula')refreshOiwsHeartMulaAudioSlot(0);
    else refreshOiwsTtsAudioSlot(0);
    return;
  }
  if(aiwsState.oiwsVariant==='motion-transfer'&&idx===1){
    aiwsState.motionVideoName='';
    if(aiwsState.uploadPreviews)aiwsState.uploadPreviews[1]='';
    refreshOiwsMotionVideoSlot(1);
    return;
  }
  if(aiwsState.oiwsVariant==='video-face-swap'&&idx===1){
    aiwsState.vfsVideoName='';
    if(aiwsState.uploadPreviews)aiwsState.uploadPreviews[1]='';
    refreshOiwsVfsVideoSlot(1);
    return;
  }
  if(aiwsState.oiwsVariant==='fitting-room'){
    if(!aiwsState.uploadPreviews)aiwsState.uploadPreviews=[''];
    aiwsState.uploadPreviews[idx]='';
    renderFittingRoomStudio();
    return;
  }
  if(aiwsState.oiwsVariant==='video-recast'){
    if(!aiwsState.uploadPreviews)aiwsState.uploadPreviews=[VRC_DEMO_VIDEO,''];
    if(idx===0)aiwsState.vrcVideoName='';
    aiwsState.uploadPreviews[idx]='';
    renderVideoRecastStudio();
    return;
  }
  if(!aiwsState.uploadPreviews){
    aiwsState.uploadPreviews=OMNI_IMAGE2_UPLOAD_SLOTS.map(function(s){return s.preview;});
  }
  aiwsState.uploadPreviews[idx]='';
  if(aiwsState.oiwsVariant==='motion-transfer'&&idx===1)refreshOiwsMotionVideoSlot(idx);
  else if(aiwsState.oiwsVariant==='video-face-swap'&&idx===1)refreshOiwsVfsVideoSlot(idx);
  else if(aiwsState.oiwsVariant==='ecommerce-digital-human'&&idx===2)refreshOiwsUploadSlot(idx);
  else refreshOiwsUploadSlot(idx);
};
function refreshOiwsUploadSlot(idx){
  var slotEl=document.querySelector('#oiws-params-form [data-oiws-slot="'+idx+'"]');
  if(!slotEl)return;
  var previews=aiwsState.uploadPreviews||[];
  var preview=previews[idx]||'';
  var hasImg=!!preview;
  var isLtxImg=aiwsState.oiwsVariant==='ltx2-digital-human'&&idx===1;
  var isKfEdit=aiwsState.oiwsVariant==='keyframes-video'&&(idx===0||idx===1);
  var isCpEdit=aiwsState.oiwsVariant==='couple-postcard'&&(idx===0||idx===1);
  var isEdEdit=aiwsState.oiwsVariant==='ecommerce-detail'&&idx===0;
  var isFlux2Edit=aiwsState.oiwsVariant==='flux2-watermark'&&idx===0;
  var isEdhFace=aiwsState.oiwsVariant==='ecommerce-digital-human'&&idx===2;
  var isSeedanceImg=aiwsState.oiwsVariant==='seedance20'&&(idx===0||idx===1||idx===2);
  var imgSrc=hasImg?oiwsResolveAssetUrl(preview):'';
  slotEl.innerHTML=
    (hasImg?'<button type="button" class="oiws-upload-delete" onclick="deleteOiwsUploadSlot(event,'+idx+')" aria-label="删除">×</button>':'')+
    ((isLtxImg||isKfEdit||isCpEdit||isEdEdit||isFlux2Edit||isEdhFace||isSeedanceImg)&&hasImg?'<button type="button" class="oiws-upload-edit" onclick="event.stopPropagation();openOiwsUploadAsset('+idx+')" aria-label="编辑">✎</button>':'')+
    '<div class="oiws-upload-wrap" role="button" tabindex="0" onclick="openOiwsUploadAsset('+idx+')">'+
    (hasImg?'<img class="oiws-upload-img" src="'+imgSrc+'" width="110" height="110" alt="">':
      '<div class="oiws-upload-placeholder" aria-hidden="true">+</div>')+
    '</div>';
}
function _oiwsHideBannerVideo(){
  var videoWrap=document.getElementById('oiws-banner-video-wrap');
  var videoEl=document.getElementById('oiws-banner-video');
  var splitEl=document.getElementById('oiws-banner-split');
  if(splitEl)splitEl.classList.add('hidden');
  if(videoWrap)videoWrap.classList.add('hidden');
  if(videoEl){
    try{videoEl.pause();}catch(e){}
    videoEl.removeAttribute('src');
    videoEl.load();
  }
}
function isOiwsCommentsOpen(){
  var modal=document.getElementById('omni-image-workspace-modal');
  if(!modal)return false;
  var panel=modal.querySelector('[data-oiws-main-panel="comments"]');
  return !!(panel&&!panel.classList.contains('hidden'));
}
function switchOiwsMainTab(tabId){
  var modal=document.getElementById('omni-image-workspace-modal');
  if(!modal)return;
  modal.querySelectorAll('.oiws-main-tab').forEach(function(t){
    t.classList.toggle('active',t.getAttribute('data-oiws-main')===tabId);
  });
  modal.querySelectorAll('[data-oiws-main-panel]').forEach(function(p){
    p.classList.toggle('hidden',p.getAttribute('data-oiws-main-panel')!==tabId);
  });
}
function syncOiwsCounts(){
  var likeEl=document.getElementById('oiws-side-like');
  var starEl=document.getElementById('oiws-side-star');
  if(likeEl)likeEl.textContent=String(aiwsState.likeCount||0);
  if(starEl)starEl.textContent=String(aiwsState.favCount||0);
  syncOiwsTabCounts();
}
function syncOiwsTabCounts(){
  var w=document.getElementById('oiws-works-tab-count');
  var c=document.getElementById('oiws-comments-tab-count');
  if(w)w.textContent='('+(aiwsState.worksCount||0)+')';
  if(c)c.textContent='('+(aiwsState.commentCount||0)+')';
}
window.toggleOiwsIntro=function(btn){
  var box=btn&&btn.closest('.oiws-main-bottom');
  if(!box)return;
  box.classList.toggle('is-collapsed');
  btn.setAttribute('aria-expanded',box.classList.contains('is-collapsed')?'false':'true');
};
function oiwsResolveAssetUrl(path){
  if(!path||/^https?:\/\//i.test(path)||/^data:/i.test(path))return path;
  try{
    return new URL(path,window.location.href).href;
  }catch(e){
    return path;
  }
}
function isOiwsPcViewport(){
  return !!(window.matchMedia&&window.matchMedia('(min-width: 768px)').matches);
}
function clearOiwsRunResultView(){
  aiwsState.showingRunResult=false;
  aiwsState.runResultSrc='';
  var banner=document.querySelector('#omni-image-workspace-modal .oiws-banner');
  if(banner)banner.classList.remove('oiws-banner--run-result');
}
function resolveOiwsRunResultSrc(){
  return getOiwsExamplePreviewSrc();
}
function _renderOiwsBannerRunResult(){
  var isVideo=isOiwsVideoPreviewVariant(aiwsState.oiwsVariant);
  aiwsState.runResultSrc=getOiwsExamplePreviewSrc();
  var banner=document.querySelector('#omni-image-workspace-modal .oiws-banner');
  if(banner)banner.classList.add('oiws-banner--run-result');
  var splitEl=document.getElementById('oiws-banner-split');
  if(splitEl)splitEl.classList.add('hidden');
  var posterEl=document.getElementById('oiws-banner-poster');
  if(posterEl){
    posterEl.classList.add('hidden');
    posterEl.setAttribute('aria-hidden','true');
  }
  var wave=document.getElementById('oiws-banner-wave');
  if(wave)wave.classList.add('hidden');
  var badge=document.getElementById('oiws-banner-badge');
  if(badge)badge.classList.add('hidden');
  var img=document.getElementById('oiws-banner-img');
  var videoWrap=document.getElementById('oiws-banner-video-wrap');
  var videoEl=document.getElementById('oiws-banner-video');
  if(isVideo&&videoWrap&&videoEl){
    if(img){img.removeAttribute('src');img.style.display='none';}
    videoWrap.classList.remove('hidden');
    videoEl.src=EXAMPLE_PREVIEW_VIDEO;
    videoEl.poster=EXAMPLE_PREVIEW_IMAGE;
    videoEl.load();
  }else{
    _oiwsHideBannerVideo();
    if(img){
      img.src=EXAMPLE_PREVIEW_IMAGE;
      img.alt='生成结果';
      img.style.display='block';
    }
  }
  var counter=document.getElementById('oiws-banner-counter');
  if(counter)counter.textContent='生成结果';
  var prevBtn=document.getElementById('oiws-banner-prev');
  var nextBtn=document.getElementById('oiws-banner-next');
  if(prevBtn){
    prevBtn.disabled=false;
    prevBtn.classList.remove('disabled');
    prevBtn.setAttribute('aria-label','返回示例');
  }
  if(nextBtn){
    nextBtn.disabled=true;
    nextBtn.classList.add('disabled');
    nextBtn.setAttribute('aria-label','下一张');
  }
}
function showOiwsRunResultInBanner(src){
  aiwsState.showingRunResult=true;
  aiwsState.runResultSrc=src||resolveOiwsRunResultSrc();
  _renderOiwsBannerRunResult();
}
function showAiwsRunResultInPreview(src){
  aiwsState.showingRunResult=true;
  aiwsState.runResultSrc=src||resolveOiwsRunResultSrc();
  var stage=document.getElementById('aiws-preview-stage');
  var coverEl=document.getElementById('aiws-preview-cover');
  var emojiEl=document.getElementById('aiws-preview-emoji');
  if(stage)stage.classList.add('aiws-preview-stage--run-result');
  if(coverEl){
    coverEl.src=EXAMPLE_PREVIEW_IMAGE;
    coverEl.alt='生成结果';
    coverEl.classList.remove('hidden');
  }
  if(emojiEl)emojiEl.style.display='none';
  var counter=document.getElementById('aiws-official-counter');
  if(counter)counter.textContent='生成结果';
  var prevBtn=document.getElementById('aiws-official-prev');
  var nextBtn=document.getElementById('aiws-official-next');
  if(prevBtn){
    prevBtn.disabled=false;
    prevBtn.classList.remove('disabled');
    prevBtn.setAttribute('aria-label','返回示例');
  }
  if(nextBtn){
    nextBtn.disabled=true;
    nextBtn.classList.add('disabled');
  }
}
function showOiwsRunResultOnPc(){
  var src=resolveOiwsRunResultSrc();
  if(document.getElementById('omni-image-workspace-modal')?.classList.contains('open')){
    showOiwsRunResultInBanner(src);
    return;
  }
  if(document.getElementById('app-image-workspace-modal')?.classList.contains('open')){
    showAiwsRunResultInPreview(src);
  }
}
function renderOiwsBanner(){
  if(aiwsState.showingRunResult){
    _renderOiwsBannerRunResult();
    return;
  }
  var samples=aiwsState.officialSamples||[];
  var idx=aiwsState.officialIndex||0;
  if(!samples.length)return;
  if(idx<0)idx=0;
  if(idx>=samples.length)idx=samples.length-1;
  aiwsState.officialIndex=idx;
  var item=samples[idx];
  var img=document.getElementById('oiws-banner-img');
  var counter=document.getElementById('oiws-banner-counter');
  var prevBtn=document.getElementById('oiws-banner-prev');
  var nextBtn=document.getElementById('oiws-banner-next');
  var cover=item&&item.coverImage;
  var useVintagePoster=aiwsState.oiwsVariant==='old-photo-time-machine'&&item&&item.bannerPoster;
  var usePanoramaPoster=(aiwsState.oiwsVariant==='image-to-360-panorama'&&item&&item.bannerPoster)||(item&&item.posterStyle==='panorama'&&aiwsState.oiwsVariant==='image-to-360-panorama');
  var useFaceswapPoster=(aiwsState.oiwsVariant==='face-swap-outfit'&&item&&item.bannerPoster)||(item&&item.posterStyle==='faceswap'&&aiwsState.oiwsVariant==='face-swap-outfit');
  var usePoster=useVintagePoster||usePanoramaPoster||useFaceswapPoster;
  var posterEl=document.getElementById('oiws-banner-poster');
  var isTts=aiwsState.oiwsVariant==='index-tts2';
  var isSd=aiwsState.oiwsVariant==='short-drama';
  var isLtx=aiwsState.oiwsVariant==='ltx2-digital-human';
  var isMotion=aiwsState.oiwsVariant==='motion-transfer';
  var useWave=isTts||isSd;
  var useSplit=isMotion&&item&&item.bannerSplit&&item.bannerTopImage;
  var useVideo=!useSplit&&item&&item.bannerVideo&&(isLtx||isMotion);
  var wave=document.getElementById('oiws-banner-wave');
  var badge=document.getElementById('oiws-banner-badge');
  var waveTitle=document.getElementById('oiws-banner-wave-title');
  var waveSub=document.getElementById('oiws-banner-wave-sub');
  var videoWrap=document.getElementById('oiws-banner-video-wrap');
  var videoEl=document.getElementById('oiws-banner-video');
  var splitEl=document.getElementById('oiws-banner-split');
  var splitTop=document.getElementById('oiws-banner-split-top');
  var splitBottom=document.getElementById('oiws-banner-split-bottom');
  var splitTitle=document.getElementById('oiws-banner-split-title');
  var splitSub=document.getElementById('oiws-banner-split-sub');
  if(usePoster&&posterEl){
    _oiwsHideBannerVideo();
    if(splitEl)splitEl.classList.add('hidden');
    posterEl.classList.remove('hidden');
    posterEl.setAttribute('aria-hidden','false');
    posterEl.classList.toggle('oiws-banner-poster--panorama',!!usePanoramaPoster);
    posterEl.classList.toggle('oiws-banner-poster--faceswap',!!useFaceswapPoster);
    if(img){img.removeAttribute('src');img.style.display='none';}
    if(wave)wave.classList.add('hidden');
    if(badge)badge.classList.add('hidden');
    var coverUrl=oiwsResolveAssetUrl(cover||EXAMPLE_PREVIEW_IMAGE);
    var vintageLayout=document.getElementById('oiws-banner-poster-vintage');
    var panoramaLayout=document.getElementById('oiws-banner-poster-panorama');
    var faceswapLayout=document.getElementById('oiws-banner-poster-faceswap');
    if(vintageLayout){
      vintageLayout.classList.toggle('hidden',!!usePanoramaPoster||!!useFaceswapPoster);
      vintageLayout.setAttribute('aria-hidden',usePanoramaPoster||useFaceswapPoster?'true':'false');
    }
    if(panoramaLayout){
      panoramaLayout.classList.toggle('hidden',!usePanoramaPoster);
      panoramaLayout.setAttribute('aria-hidden',usePanoramaPoster?'false':'true');
    }
    if(faceswapLayout){
      faceswapLayout.classList.toggle('hidden',!useFaceswapPoster);
      faceswapLayout.setAttribute('aria-hidden',useFaceswapPoster?'false':'true');
    }
    if(useFaceswapPoster){
      var fsoImg=document.getElementById('oiws-banner-poster-fso-img');
      if(fsoImg){
        fsoImg.src=coverUrl;
        fsoImg.alt=aiwsState.title||'换脸换装';
      }
    }else if(usePanoramaPoster){
      var p360Img=document.getElementById('oiws-banner-poster-p360-img');
      if(p360Img){
        p360Img.src=coverUrl;
        p360Img.alt=aiwsState.title||'一键图转 360 全景图';
      }
    }else{
      var posterImg=document.getElementById('oiws-banner-poster-img');
      if(posterImg){
        posterImg.src=coverUrl;
        posterImg.alt=aiwsState.title||'旧照时光机';
      }
      var cmpBefore=posterEl.querySelector('.oiws-banner-poster-compare-img--before');
      var cmpAfter=posterEl.querySelector('.oiws-banner-poster-compare-img--after');
      if(cmpBefore)cmpBefore.src=coverUrl;
      if(cmpAfter)cmpAfter.src=coverUrl;
      if(cmpBefore)cmpBefore.classList.add('oiws-banner-poster-compare-img--vintage');
      if(cmpAfter)cmpAfter.classList.remove('oiws-banner-poster-compare-img--vintage');
    }
  }else if(posterEl){
    posterEl.classList.remove('oiws-banner-poster--panorama','oiws-banner-poster--faceswap');
    posterEl.classList.add('hidden');
    posterEl.setAttribute('aria-hidden','true');
  }
  if(usePoster){
    if(counter)counter.textContent=(idx+1)+'/'+(samples.length);
    if(prevBtn){
      prevBtn.disabled=idx<=0;
      prevBtn.classList.toggle('disabled',idx<=0);
    }
    if(nextBtn){
      nextBtn.disabled=idx>=samples.length-1;
      nextBtn.classList.toggle('disabled',idx>=samples.length-1);
    }
    return;
  }
  if(useSplit&&splitEl){
    splitEl.classList.remove('hidden');
    if(videoWrap)videoWrap.classList.add('hidden');
    if(videoEl){try{videoEl.pause();}catch(e){}videoEl.removeAttribute('src');}
    if(img){img.removeAttribute('src');img.style.display='none';}
    if(wave)wave.classList.add('hidden');
    if(badge)badge.classList.add('hidden');
    if(splitTop)splitTop.src=EXAMPLE_PREVIEW_IMAGE;
    if(splitBottom)splitBottom.src=EXAMPLE_PREVIEW_IMAGE;
    if(splitTitle)splitTitle.textContent=item.bannerOverlayTitle||'律动重构 角色动作迁移';
    if(splitSub)splitSub.textContent=item.bannerOverlaySub||'';
  }else if(useVideo&&videoWrap&&videoEl){
    if(splitEl)splitEl.classList.add('hidden');
    videoWrap.classList.remove('hidden');
    if(img){img.removeAttribute('src');img.style.display='none';}
    if(wave)wave.classList.add('hidden');
    if(badge)badge.classList.add('hidden');
    videoEl.src=EXAMPLE_PREVIEW_VIDEO;
    videoEl.poster=EXAMPLE_PREVIEW_IMAGE;
    videoEl.load();
  }else{
    _oiwsHideBannerVideo();
    if(img){
      if(cover&&!useWave){
        img.src=EXAMPLE_PREVIEW_IMAGE;
        img.alt=aiwsState.title||'全能图片2.0';
        img.style.display='block';
        if(wave)wave.classList.add('hidden');
      }else{
        img.removeAttribute('src');
        img.style.display='none';
        if(wave){
          wave.classList.toggle('hidden',!useWave);
          if(waveTitle)waveTitle.textContent=(item&&item.bannerTitle)||(isSd?'短剧生成全流程':'IndexTTS2');
          if(waveSub){
            waveSub.textContent=(item&&item.bannerSubtitle)||'';
            waveSub.classList.toggle('hidden',!(item&&item.bannerSubtitle));
          }
        }
      }
    }
    if(badge){
      if(useWave){
        badge.textContent=(item&&item.bannerBadge)||(isSd?'图生视频 · 分镜生成':'支持双人对话 + 情感沟通/文本描述音色迁移');
        badge.classList.remove('hidden');
      }else{
        badge.classList.add('hidden');
      }
    }
  }
  if(counter)counter.textContent=(idx+1)+'/'+(samples.length);
  if(prevBtn){
    prevBtn.disabled=idx<=0;
    prevBtn.classList.toggle('disabled',idx<=0);
  }
  if(nextBtn){
    nextBtn.disabled=idx>=samples.length-1;
    nextBtn.classList.toggle('disabled',idx>=samples.length-1);
  }
}
window.oiwsBannerPrev=function(){
  if(aiwsState.showingRunResult){
    clearOiwsRunResultView();
    renderOiwsBanner();
    return;
  }
  aiwsState.officialIndex=(aiwsState.officialIndex||0)-1;
  renderOiwsBanner();
};
window.oiwsBannerNext=function(){
  if(aiwsState.showingRunResult)return;
  aiwsState.officialIndex=(aiwsState.officialIndex||0)+1;
  renderOiwsBanner();
};
function _oiwsFormatWorkCount(n){
  n=Number(n)||0;
  if(n>=10000)return (n/10000).toFixed(1).replace(/\.0$/,'')+'w';
  if(n>=1000)return (n/1000).toFixed(1).replace(/\.0$/,'')+'k';
  return String(n);
}
function _oiwsNormalizePublicWork(w){
  if(!w)return w;
  return {
    user:w.user,emoji:w.emoji,gradient:w.gradient,title:w.title,type:w.type,
    prompt:w.prompt,model:w.model,likes:w.likes!=null?w.likes:0,views:w.views,uses:w.uses,
    price:w.price,params:w.params,liked:!!w.liked,faved:!!w.faved,
    coverImage:w.coverImage,recommended:!!w.recommended
  };
}
function refreshOiwsModalUI(){
  syncOiwsCounts();
  renderOiwsPublicWorks();
}
window.refreshOiwsModalUI=refreshOiwsModalUI;
window.toggleOiwsWorkLike=function(index,ev){
  if(ev){ev.stopPropagation();ev.preventDefault();}
  var works=aiwsState.publicWorks||[];
  var w=works[index];
  if(!w)return;
  w.liked=!w.liked;
  w.likes=Math.max(0,(Number(w.likes)||0)+(w.liked?1:-1));
  aiwsState.likeCount=Math.max(0,(Number(aiwsState.likeCount)||0)+(w.liked?1:-1));
  refreshOiwsModalUI();
  showToast(w.liked?'❤️ 已点赞':'已取消点赞');
};
window.toggleOiwsWorkFav=function(index,ev){
  if(ev){ev.stopPropagation();ev.preventDefault();}
  var works=aiwsState.publicWorks||[];
  var w=works[index];
  if(!w)return;
  w.faved=!w.faved;
  aiwsState.favCount=Math.max(0,(Number(aiwsState.favCount)||0)+(w.faved?1:-1));
  refreshOiwsModalUI();
  showToast(w.faved?'⭐ 已收藏':'已取消收藏');
};
function renderOiwsPublicWorks(){
  var grid=document.getElementById('oiws-works-grid');
  var empty=document.getElementById('oiws-works-empty');
  var works=aiwsState.publicWorks||[];
  if(!grid)return;
  if(!works.length){
    grid.innerHTML='';
    if(empty)empty.classList.remove('hidden');
    return;
  }
  if(empty)empty.classList.add('hidden');
  grid.innerHTML='';
  works.forEach(function(w,i){
    w=_oiwsNormalizePublicWork(w);
    works[i]=w;
    var card=document.createElement('article');
    card.className='oiws-work-card';
    card.setAttribute('role','button');
    card.setAttribute('tabindex','0');
    var cover=document.createElement('div');
    cover.className='oiws-work-card-cover';
    cover.style.background=w.gradient||'#232a2e';
    var emoji=document.createElement('span');
    emoji.className='oiws-work-card-emoji';
    emoji.textContent=w.emoji||'🖼️';
  var actions=document.createElement('div');
    actions.className='oiws-work-card-actions';
    var likeBtn=document.createElement('button');
    likeBtn.type='button';
    likeBtn.className='oiws-work-action oiws-work-action--like'+(w.liked?' is-active':'');
    likeBtn.setAttribute('aria-label','点赞');
    likeBtn.innerHTML='♥ <span>'+_oiwsFormatWorkCount(w.likes)+'</span>';
    likeBtn.addEventListener('click',function(ev){toggleOiwsWorkLike(i,ev);});
    var favBtn=document.createElement('button');
    favBtn.type='button';
    favBtn.className='oiws-work-action oiws-work-action--fav'+(w.faved?' is-active':'');
    favBtn.setAttribute('aria-label','收藏');
    favBtn.textContent=w.faved?'★':'☆';
    favBtn.addEventListener('click',function(ev){toggleOiwsWorkFav(i,ev);});
    actions.appendChild(likeBtn);
    actions.appendChild(favBtn);
    if(w.recommended){
      var recBadge=document.createElement('span');
      recBadge.className='oiws-work-card-rec';
      recBadge.textContent='推荐';
      cover.appendChild(recBadge);
    }
    if(w.type==='video'){
      emoji.textContent='';
      var workVid=document.createElement('video');
      workVid.className='oiws-work-card-vid';
      workVid.src=EXAMPLE_PREVIEW_VIDEO;
      workVid.poster=EXAMPLE_PREVIEW_IMAGE;
      workVid.muted=true;
      workVid.playsInline=true;
      workVid.style.cssText='width:100%;height:100%;object-fit:cover;display:block;';
      cover.appendChild(workVid);
      var playIcon=document.createElement('span');
      playIcon.className='oiws-work-card-play';
      playIcon.setAttribute('aria-hidden','true');
      playIcon.textContent='▶';
      cover.appendChild(playIcon);
    }else if(w.type==='image'||!w.type){
      var workImg=document.createElement('img');
      workImg.className='oiws-work-card-img';
      workImg.src=EXAMPLE_PREVIEW_IMAGE;
      workImg.alt=w.title||'';
      workImg.loading='lazy';
      cover.appendChild(workImg);
    }else{
      cover.appendChild(emoji);
    }
    cover.appendChild(actions);
    var meta=document.createElement('div');
    meta.className='oiws-work-card-meta';
    meta.textContent=w.title||(w.user||'作品 '+(i+1));
    card.appendChild(cover);
    card.appendChild(meta);
    card.addEventListener('click',function(ev){
      if(ev.target.closest('.oiws-work-card-actions'))return;
      openAppsPublicWorkPreview(w,{sourceName:aiwsState.title||'',stacked:true,preserve:['omni-image-workspace-modal']});
    });
    card.addEventListener('keydown',function(ev){
      if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();card.click();}
    });
    grid.appendChild(card);
  });
}
function renderOiwsComments(){
  var list=document.getElementById('oiws-comment-list');
  var empty=document.getElementById('oiws-comment-empty');
  if(!list)return;
  var comments=aiwsState.comments||[];
  if(!comments.length){
    list.innerHTML='';
    if(empty){
      empty.classList.remove('hidden');
      list.appendChild(empty);
    }
    return;
  }
  if(empty)empty.classList.add('hidden');
  list.innerHTML=comments.map(function(c){
    var initial=(c.user||'?').charAt(0);
    return '<div class="oiws-comment-item">'+
      '<div class="oiws-comment-avatar" aria-hidden="true">'+initial+'</div>'+
      '<div class="oiws-comment-body">'+
      '<div class="oiws-comment-head"><span class="oiws-comment-user">'+c.user+'</span>'+
      '<span class="oiws-comment-time">'+c.time+'</span></div>'+
      '<p class="oiws-comment-text">'+c.text+'</p></div></div>';
  }).join('');
}
window.toggleOiwsFollow=function(){
  aiwsState.followed=!aiwsState.followed;
  var btn=document.getElementById('oiws-side-follow-btn');
  if(btn){
    btn.innerHTML=(aiwsState.followed?'已关注':'<span aria-hidden="true">+</span> 关注');
    btn.classList.toggle('followed',aiwsState.followed);
  }
  showToast(aiwsState.followed?'✅ 已关注':'👋 取消关注');
};
window.toggleOiwsLike=function(){
  aiwsState.liked=!aiwsState.liked;
  aiwsState.likeCount+=aiwsState.liked?1:-1;
  if(aiwsState.likeCount<0)aiwsState.likeCount=0;
  refreshOiwsModalUI();
  showToast(aiwsState.liked?'❤️ 已点赞':'已取消点赞');
};
window.toggleOiwsFav=function(){
  aiwsState.faved=!aiwsState.faved;
  aiwsState.favCount+=aiwsState.faved?1:-1;
  if(aiwsState.favCount<0)aiwsState.favCount=0;
  refreshOiwsModalUI();
  showToast(aiwsState.faved?'⭐ 已收藏':'已取消收藏');
};
window.toggleOiwsComments=function(){
  if(isOiwsCommentsOpen()){
    switchOiwsMainTab('works');
    return;
  }
  switchOiwsMainTab('comments');
  var input=document.getElementById('oiws-comment-input');
  if(input)setTimeout(function(){input.focus();},50);
};
window.postOiwsComment=function(){
  var input=document.getElementById('oiws-comment-input');
  if(!input||!input.value.trim())return;
  aiwsState.comments.unshift({user:'我',time:'刚刚',text:input.value.trim()});
  aiwsState.commentCount=(aiwsState.commentCount||0)+1;
  input.value='';
  syncOiwsTabCounts();
  renderOiwsComments();
  showToast('💬 评论已发布');
};
window.runOiwsApp=function(){
  var btn=document.getElementById('oiws-run-btn');
  if(!btn||btn.disabled)return;
  btn.disabled=true;
  var labelEl=document.getElementById('oiws-run-label');
  var old=labelEl?labelEl.textContent:'运行';
  if(labelEl)labelEl.textContent='运行中…';
  showToast('🚀 任务已提交：'+aiwsState.title);
  setTimeout(function(){
    btn.disabled=false;
    if(labelEl)labelEl.textContent=old;
    showToast('✅ 生成完成（演示）');
    if(isOiwsSidebarVariant(aiwsState.oiwsVariant)||document.getElementById('app-image-workspace-modal')?.classList.contains('open')){
      if(isOiwsPcViewport()){
        showOiwsRunResultOnPc();
      }else{
        openOiwsRunResultModal();
      }
    }
  },2200);
};
window.openOiwsRunResultModal=function(){
  var modal=document.getElementById('oiws-result-modal');
  if(!modal){
    showToast('✅ 生成完成（演示）');
    return;
  }
  var img=document.getElementById('oiws-result-img');
  var isVideo=isOiwsVideoPreviewVariant(aiwsState.oiwsVariant);
  if(img){
    var wrap=img.parentElement;
    var oldV=wrap&&wrap.querySelector('video.oiws-result-video');
    if(isVideo){
      img.style.display='none';
      var v=oldV;
      if(!v&&wrap){
        v=document.createElement('video');
        v.className='oiws-result-preview-img oiws-result-video';
        v.controls=true;
        v.playsInline=true;
        wrap.appendChild(v);
      }
      if(v){
        v.src=EXAMPLE_PREVIEW_VIDEO;
        v.poster=EXAMPLE_PREVIEW_IMAGE;
        v.style.display='block';
      }
    }else{
      if(oldV){try{oldV.pause();}catch(e){}oldV.style.display='none';}
      img.style.display='block';
      img.src=EXAMPLE_PREVIEW_IMAGE;
    }
  }
  var preserve=['omni-image-workspace-modal'];
  if(document.getElementById('app-image-workspace-modal')?.classList.contains('open')){
    preserve.push('app-image-workspace-modal');
  }
  openModal('oiws-result-modal',{preserve:preserve});
};
window.downloadOiwsRunResult=function(){
  showToast('📥 结果已保存到本地（演示）');
};
function openShortDramaWorkspace(p){
  p=Object.assign({workspaceVariant:'short-drama'},p||{});
  openOmniImage2Workspace(p);
}
function openLtx2DigitalHumanWorkspace(p){
  p=Object.assign({workspaceVariant:'ltx2-digital-human'},p||{});
  openOmniImage2Workspace(p);
}
function openVideoFaceSwapWorkspace(p){
  p=Object.assign({
    workspaceVariant:'video-face-swap',
    runBarLikeCharacterReplace:true,
    hidePublishWork:true,
    price:'⚡0.7'
  },p||{});
  openOmniImage2Workspace(p);
}
function openMotionTransferWorkspace(p){
  p=Object.assign({workspaceVariant:'motion-transfer'},p||{});
  openOmniImage2Workspace(p);
}
function openKeyframesVideoWorkspace(p){
  p=Object.assign({workspaceVariant:'keyframes-video'},p||{});
  openOmniImage2Workspace(p);
}
function openCouplePostcardWorkspace(p){
  p=Object.assign({workspaceVariant:'couple-postcard'},p||{});
  openOmniImage2Workspace(p);
}
function openEcommerceDetailWorkspace(p){
  p=Object.assign({workspaceVariant:'ecommerce-detail'},p||{});
  openOmniImage2Workspace(p);
}
function openEcommerceProductMultiangleWorkspace(p){
  p=Object.assign({
    workspaceVariant:'ecommerce-product-multiangle',
    runBarLikeCharacterReplace:true,
    hidePublishWork:true,
    price:'⚡0.7'
  },p||{});
  openOmniImage2Workspace(p);
}
function openFlux2WatermarkWorkspace(p){
  p=Object.assign({
    workspaceVariant:'flux2-watermark',
    runBarLikeCharacterReplace:true,
    hidePublishWork:true,
    price:'⚡0.7'
  },p||{});
  openOmniImage2Workspace(p);
}
function openEcommerceWhiteBgSceneWorkspace(p){
  p=Object.assign({
    workspaceVariant:'ecommerce-white-bg-scene',
    runBarLikeCharacterReplace:true,
    hidePublishWork:true,
    price:'⚡0.7'
  },p||{});
  openOmniImage2Workspace(p);
}
function openEcommerceModelGenWorkspace(p){
  p=Object.assign({
    workspaceVariant:'ecommerce-model-gen',
    runBarLikeCharacterReplace:true,
    hidePublishWork:true,
    price:'⚡0.7'
  },p||{});
  openOmniImage2Workspace(p);
}
function openEcommerceDigitalHumanWorkspace(p){
  p=Object.assign({workspaceVariant:'ecommerce-digital-human'},p||{});
  openOmniImage2Workspace(p);
}
function openSeedance20Workspace(p){
  p=Object.assign({workspaceVariant:'seedance20'},p||{});
  openOmniImage2Workspace(p);
}
function openHeartMulaWorkspace(p){
  p=Object.assign({workspaceVariant:'heartmula'},p||{});
  openOmniImage2Workspace(p);
}
function openIndexTts2Workspace(p){
  p=Object.assign({workspaceVariant:'index-tts2'},p||{});
  openOmniImage2Workspace(p);
}
function openCharacterReplaceWorkspace(p){
  p=Object.assign({workspaceVariant:'character-replace'},p||{});
  openOmniImage2Workspace(p);
}
function openPersonModelWorkspace(p){
  p=Object.assign({workspaceVariant:'person-model'},p||{});
  openOmniImage2Workspace(p);
}
function openOldPhotoTimeMachineWorkspace(p){
  p=Object.assign({
    workspaceVariant:'old-photo-time-machine',
    runBarLikeCharacterReplace:true,
    hidePublishWork:true,
    price:'⚡0.7'
  },p||{});
  openOmniImage2Workspace(p);
}
function openImageTo360PanoramaWorkspace(p){
  p=Object.assign({
    workspaceVariant:'image-to-360-panorama',
    runBarLikeCharacterReplace:true,
    hidePublishWork:true,
    price:'⚡0.7'
  },p||{});
  openOmniImage2Workspace(p);
}
function openFaceSwapOutfitWorkspace(p){
  p=Object.assign({
    workspaceVariant:'face-swap-outfit',
    runBarLikeCharacterReplace:true,
    hidePublishWork:true,
    price:'⚡0.7'
  },p||{});
  openOmniImage2Workspace(p);
}
function openFittingRoomWorkspace(p){
  p=Object.assign({
    workspaceVariant:'fitting-room',
    runBarLikeCharacterReplace:true,
    hidePublishWork:true,
    price:'⚡2'
  },p||{});
  openOmniImage2Workspace(p);
}
function openVideoRecastWorkspace(p){
  p=Object.assign({
    workspaceVariant:'video-recast',
    runBarLikeCharacterReplace:true,
    hidePublishWork:true,
    price:'⚡2'
  },p||{});
  openOmniImage2Workspace(p);
}
function openVideoOutfitWorkspace(p){
  p=Object.assign({
    workspaceVariant:'video-outfit',
    runBarLikeCharacterReplace:true,
    hidePublishWork:true,
    price:'⚡34'
  },p||{});
  openOmniImage2Workspace(p);
}
function openOmniImage2Workspace(p){
  initOiwsModal();
  if(typeof closeModal==='function')closeModal('oiws-result-modal');
  clearOiwsRunResultView();
  p=p||{};
  var isKf=p.workspaceVariant==='keyframes-video'||isKeyframesVideoApp(p.cat,p.id,p.title);
  var isVfs=!isKf&&(p.workspaceVariant==='video-face-swap'||isVideoFaceSwapApp(p.cat,p.id,p.title));
  var isVrc=!isKf&&!isVfs&&(p.workspaceVariant==='video-recast'||isVideoRecastApp(p.cat,p.id,p.title));
  var isUo=!isKf&&!isVfs&&!isVrc&&(p.workspaceVariant==='video-outfit'||isVideoOutfitApp(p.cat,p.id,p.title));
  var isMotion=!isKf&&!isVfs&&!isVrc&&!isUo&&(p.workspaceVariant==='motion-transfer'||isMotionTransferApp(p.cat,p.id,p.title));
  var isEdh=!isKf&&!isMotion&&!isVfs&&!isVrc&&(p.workspaceVariant==='ecommerce-digital-human'||isEcommerceDigitalHumanApp(p.cat,p.id,p.title));
  var isSeedance=!isKf&&!isMotion&&!isEdh&&!isVfs&&!isVrc&&(p.workspaceVariant==='seedance20'||isSeedance20App(p.cat,p.id,p.title));
  var isHeartMula=!isKf&&!isMotion&&!isEdh&&!isSeedance&&!isVfs&&!isVrc&&(p.workspaceVariant==='heartmula'||isHeartMulaApp(p.cat,p.id,p.title));
  var isLtx=!isKf&&!isMotion&&!isEdh&&!isSeedance&&!isHeartMula&&!isVfs&&!isVrc&&(p.workspaceVariant==='ltx2-digital-human'||isLtx2DigitalHumanApp(p.cat,p.id,p.title));
  var isSd=!isKf&&!isMotion&&!isEdh&&!isSeedance&&!isHeartMula&&!isLtx&&!isVfs&&!isVrc&&(p.workspaceVariant==='short-drama'||isShortDramaApp(p.cat,p.id,p.title));
  var isTts=!isKf&&!isMotion&&!isEdh&&!isSeedance&&!isHeartMula&&!isLtx&&!isSd&&!isVfs&&!isVrc&&(p.workspaceVariant==='index-tts2'||isIndexTts2App(p.cat,p.id,p.title));
  var isFso=!isKf&&!isMotion&&!isEdh&&!isSeedance&&!isHeartMula&&!isLtx&&!isSd&&!isTts&&(p.workspaceVariant==='face-swap-outfit'||isFaceSwapOutfitApp(p.title,p.id));
  var isFr=!isKf&&!isMotion&&!isEdh&&!isSeedance&&!isHeartMula&&!isLtx&&!isSd&&!isTts&&!isFso&&(p.workspaceVariant==='fitting-room'||isFittingRoomApp(p.cat,p.id,p.title));
  var isCr=!isKf&&!isMotion&&!isEdh&&!isSeedance&&!isHeartMula&&!isLtx&&!isSd&&!isTts&&!isFso&&!isFr&&(p.workspaceVariant==='character-replace'||isCharacterReplaceApp(p.title,p.id));
  var isCp=!isKf&&!isMotion&&!isEdh&&!isSeedance&&!isHeartMula&&!isLtx&&!isSd&&!isTts&&!isCr&&!isFr&&(p.workspaceVariant==='couple-postcard'||isCouplePostcardApp(p.cat,p.id,p.title));
  var isFlux2=!isKf&&!isMotion&&!isEdh&&!isSeedance&&!isHeartMula&&!isLtx&&!isSd&&!isTts&&!isCr&&!isCp&&(p.workspaceVariant==='flux2-watermark'||isFlux2WatermarkApp(p.cat,p.id,p.title));
  var isEmg=!isKf&&!isMotion&&!isEdh&&!isSeedance&&!isHeartMula&&!isLtx&&!isSd&&!isTts&&!isCr&&!isCp&&!isFlux2&&(p.workspaceVariant==='ecommerce-model-gen'||isEcommerceModelGenApp(p.cat,p.id,p.title));
  var isEwbs=!isKf&&!isMotion&&!isEdh&&!isSeedance&&!isHeartMula&&!isLtx&&!isSd&&!isTts&&!isCr&&!isCp&&!isFlux2&&!isEmg&&(p.workspaceVariant==='ecommerce-white-bg-scene'||isEcommerceWhiteBgSceneApp(p.cat,p.id,p.title));
  var isEpm=!isKf&&!isMotion&&!isEdh&&!isSeedance&&!isHeartMula&&!isLtx&&!isSd&&!isTts&&!isFso&&!isCr&&!isCp&&!isFlux2&&!isEwbs&&!isEmg&&(p.workspaceVariant==='ecommerce-product-multiangle'||isEcommerceProductMultiangleApp(p.title,p.id));
  var isEd=!isKf&&!isMotion&&!isEdh&&!isSeedance&&!isHeartMula&&!isLtx&&!isSd&&!isTts&&!isFso&&!isCr&&!isCp&&!isFlux2&&!isEwbs&&!isEpm&&!isEmg&&(p.workspaceVariant==='ecommerce-detail'||isEcommerceDetailApp(p.cat,p.id,p.title));
  var isImg360=!isKf&&!isMotion&&!isEdh&&!isSeedance&&!isHeartMula&&!isLtx&&!isSd&&!isTts&&!isFso&&!isCr&&!isCp&&!isEd&&!isFlux2&&!isEwbs&&!isEpm&&!isEmg&&(p.workspaceVariant==='image-to-360-panorama'||isImageTo360PanoramaApp(p.title,p.id));
  var isOpt=!isKf&&!isMotion&&!isEdh&&!isSeedance&&!isHeartMula&&!isLtx&&!isSd&&!isTts&&!isFso&&!isCr&&!isCp&&!isEd&&!isFlux2&&!isImg360&&!isEwbs&&!isEpm&&!isEmg&&(p.workspaceVariant==='old-photo-time-machine'||isOldPhotoTimeMachineApp(p.title,p.id));
  var isPm=!isKf&&!isMotion&&!isEdh&&!isSeedance&&!isHeartMula&&!isLtx&&!isSd&&!isTts&&!isFso&&!isCr&&!isCp&&!isEd&&!isFlux2&&!isOpt&&!isImg360&&!isEwbs&&!isEpm&&!isEmg&&(p.workspaceVariant==='person-model'||isPersonModelApp(p.title,p.id));
  var isSidebar=isPm||isOpt||isImg360||isFso||isFr||isEpm||isEwbs||isEmg||isCr||isCp||isEd||isFlux2||isEdh||isSeedance||isHeartMula||isTts||isSd||isLtx||isMotion||isVfs||isKf;
  setOiwsVariant(isKf?'keyframes-video':isVfs?'video-face-swap':isVrc?'video-recast':isUo?'video-outfit':isMotion?'motion-transfer':isEdh?'ecommerce-digital-human':isSeedance?'seedance20':isHeartMula?'heartmula':isLtx?'ltx2-digital-human':isSd?'short-drama':isTts?'index-tts2':isCr?'character-replace':isCp?'couple-postcard':isFlux2?'flux2-watermark':isEmg?'ecommerce-model-gen':isEwbs?'ecommerce-white-bg-scene':isEd?'ecommerce-detail':isEpm?'ecommerce-product-multiangle':isImg360?'image-to-360-panorama':isFr?'fitting-room':isFso?'face-swap-outfit':isOpt?'old-photo-time-machine':isPm?'person-model':'omni');
  var title=p.title||(isKf?'wan2.2首尾帧（极速优化版）':isVfs?'视频换脸':isVrc?'视频换角色':isUo?'视频换装':isMotion?'[Wan2.2 | AnimateV2] 视频动作迁移与角色':isEdh?'电商口播数字人 表情+口型+声音克隆':isSeedance?'Seedance2.0 | 全能参考 · 支持真人':isHeartMula?'HeartMula 文生歌曲 + 音色克隆':isLtx?'LTX-2 一键生成数字人制作表情口型同步':isSd?'短剧生成全流程（多分钟图+图生视频）':isTts?'IndexTTS2-语音克隆':isCr?'人物替换':isCp?'二次元情侣头像明信片':isFlux2?'FLUX2去水印万能改图单图版保持原图不变':isEmg?'全能图片-2.0-图生图-一键生成电商模特图':isEwbs?'电商白底图智能生成场景':isEd?'AI全自动电商详情页生成 V3直出10张图片':isEpm?'电商产品-自动产品多角度生成':isImg360?'一键 图片 转 360全景图':isFso?'换脸换装':isOpt?'旧照时光机':isPm?'人物模特生成':'全能图片2.0');
  if(isFr&&!p.fromFavorites)title='试装间';
  else if(isFr&&p.fromFavorites&&p.title)title=p.title;
  if(isVrc&&!p.fromFavorites)title='视频换角色';
  else if(isVrc&&p.fromFavorites&&p.title)title=p.title;
  if(isUo&&!p.fromFavorites)title='视频换装';
  else if(isUo&&p.fromFavorites&&p.title)title=p.title;
  if(isOpt&&p.desc&&!p.fromFavorites)title=p.desc;
  if(isOpt&&p.fromFavorites&&p.title)title=p.title;
  if(isFso&&p.desc&&!p.fromFavorites)title=p.desc;
  if(isFso&&p.fromFavorites&&p.title)title=p.title;
  if(isEpm&&p.desc&&!p.fromFavorites)title=p.desc;
  if(isEpm&&p.fromFavorites&&p.title)title=p.title;
  if(isVfs&&p.desc&&!p.fromFavorites)title=p.desc;
  if(isVfs&&p.fromFavorites&&p.title)title=p.title;
  if(isFlux2&&p.desc&&!p.fromFavorites)title=p.desc;
  if(isFlux2&&p.fromFavorites&&p.title)title=p.title;
  if(isEwbs&&p.fromFavorites&&p.title)title=p.title;
  if(isEmg&&!p.fromFavorites)title='全能图片-2.0-图生图-一键生成电商模特图';
  else if(isEmg&&p.fromFavorites&&p.title)title=p.title;
  aiwsState.liked=false;
  aiwsState.faved=false;
  aiwsState.followed=false;
  aiwsState.title=title;
  aiwsState.sharePayload={
    title:title,desc:p.desc||'',icon:p.icon||(isKf?'🎥':isVfs?'🎭':isMotion?'🎞️':isEdh?'🎙️':isSeedance?'🎬':isHeartMula?'🎵':isFlux2?'✨':isEmg?'👗':isEwbs?'🛍️':isLtx?'🧑‍💻':isTts?'🎙️':isCp?'💌':isEd?'🛒':isEpm?'📦':isImg360?'🌐':isFso?'👤':isOpt?'📷':isSd?'🎬':'🖼️'),cat:p.cat||(isTts||isHeartMula?'音频':isSd||isLtx||isMotion||isEdh||isSeedance||isKf||isVfs?'视频':'图像'),
    catKey:p.catKey||(isTts||isHeartMula?'audio':isSd||isLtx||isMotion||isEdh||isSeedance||isKf||isVfs?'video':'image'),gradient:p.gradient||'linear-gradient(135deg,#1e3a5f,#7c3aed)'
  };
  aiwsState.comments=(p.seedComments!==false)?(isLtx?AIWS_DEMO_COMMENTS.slice(0,1):isCp?AIWS_DEMO_COMMENTS.slice(0,1):isEd?AIWS_DEMO_COMMENTS.slice(0,1):isEpm?AIWS_DEMO_COMMENTS.slice(0,1):isEmg?AIWS_DEMO_COMMENTS.slice(0,1):isEwbs?AIWS_DEMO_COMMENTS.slice(0,1):isVfs?AIWS_DEMO_COMMENTS.slice(0,1):isFlux2?AIWS_DEMO_COMMENTS.slice(0,1):isEdh?AIWS_DEMO_COMMENTS.slice(0,2):isSeedance||isHeartMula?[]:isSidebar&&!isSd&&!isMotion&&!isKf&&!isVfs?AIWS_DEMO_COMMENTS.slice(0,2):isSd||isMotion||isKf||isVfs?[]:AIWS_DEMO_COMMENTS.slice()):[];
  var usesNum=parseUsesNum(p.uses);
  aiwsState.likeCount=typeof p.collectFav==='number'?p.collectFav:(isKf?8:isVfs?0:isMotion?3:isEdh?38:isSeedance?0:isHeartMula?4:isFlux2?2:isEmg?4:isEwbs?0:isLtx?3:isSd?12:isTts?204:isCr?237:isCp?4:isEd?2:isEpm?0:isImg360?0:isFso?1:isOpt?1:isPm?212:591);
  aiwsState.favCount=typeof p.collectComment==='number'?p.collectComment:(isKf?15:isVfs?3:isMotion?7:isEdh?308:isSeedance?4:isHeartMula?18:isFlux2?3:isEmg?25:isEwbs?6:isLtx?12:isSd?53:isTts?922:isCr?1043:isCp?43:isEd?20:isEpm?3:isImg360?2:isFso?6:isOpt?2:isPm?504:2400);
  aiwsState.commentCount=typeof p.commentTabCount==='number'?p.commentTabCount:(isKf?0:isVfs?1:isMotion?0:isEdh?2:isSeedance?0:isHeartMula?0:isFlux2?0:isEmg?0:isEwbs?0:isLtx?1:isSd?0:isTts?10:isCr?15:isCp?1:isEd?1:isEpm?0:isImg360?0:isFso?0:isOpt?0:isPm?5:60);
  if(p.likes)aiwsState.likeCount=parseUsesNum(p.likes)||aiwsState.likeCount;
  var successPct=typeof p.successRate==='number'?p.successRate:(isKf?97:isVfs?77:isMotion?97:isEdh?98:isSeedance?97:isHeartMula?97:isFlux2?98:isEmg?99:isEwbs?97:isLtx?98:isSd?96:isTts?97:isCr?100:isCp?98:isEd?98:isEpm?97:isFso?97:isPm?99:98);
  var duration=typeof p.avgDurationSec==='number'?p.avgDurationSec:(isKf?55:isVfs?387:isMotion?68:isEdh?38:isSeedance?120:isHeartMula?90:isFlux2?45:isEmg?340:isEwbs?1:isLtx?42:isSd?180:isTts?58:isCr?5:isCp?42:isEd?77:isEpm?60:isFso?50:isPm?116:77);
  var usesText=String(p.uses||(isKf?'3.2k':isVfs?'319':isMotion?'16':isEdh?'15.3K':isSeedance?'19':isHeartMula?'150':isFlux2?'0':isEmg?'491':isEwbs?'29':isLtx?'2.4k':isSd?'8.5k':isTts?'61.6k':isCr?'75.8k':isCp?'355':isEd?'77':isEpm?'5':isImg360?'27':isFso?'26':isOpt?'16':isPm?'20.6k':'550.6k')).replace(/次使用/g,'').trim().replace(/k$/i,'K');
  var tipSuccess=(isSidebar?'这里的':'近期')+'运行成功率为'+successPct+'%';
  var tipDuration='平均运行时长在'+duration+'s左右';
  var useEl=document.getElementById('oiws-use-count');
  if(useEl)useEl.textContent=usesText;
  var tipOk=document.getElementById('oiws-tip-success');
  var tipDur=document.getElementById('oiws-tip-duration');
  if(tipOk)tipOk.textContent=tipSuccess;
  if(tipDur)tipDur.textContent=tipDuration;
  var titleEl=document.getElementById('oiws-title');
  if(titleEl){titleEl.textContent=title;titleEl.setAttribute('title',title);}
  var creatorName=document.getElementById('oiws-creator-name');
  if(creatorName)creatorName.textContent=p.creatorName||(isKf?'xiao':isVfs?'小齐齐':isMotion?'StarTed':isEdh?'魅力微变':isSeedance?'Cdd | AIGC':isHeartMula?'超级消息AIFSH':isFlux2?'Openclaw2026':isEmg?'KIMI':isEwbs?'我不吃甜药':isLtx?'AI世间创作':isSd?'数智AIGC':isTts?'大海向C':isCr?'阿姨AI':isCp?'Crazy Lychee':isEd?'AI地铺创作':isEpm?'大师':isImg360?'HyLan_L':isFso?'九七先生':isOpt?'user_63fiehy4':isPm?'魅力 创意':'Little Wrangler');
  var creatorDate=document.getElementById('oiws-creator-date');
  if(creatorDate)creatorDate.textContent=p.creatorDate||(isKf?'2025.01 更新':isVfs?'2024.05.22':isMotion?'2024.08.28 更新':isEdh?'2023.12.03 更新':isSeedance?'2024.08.25 更新':isHeartMula?'2024.01.21 更新':isFlux2?'2024.05.25 更新':isEmg?'2024.05.15 发布':isEwbs?'2024.05.27 发布':isLtx?'2024.08.31 更新':isSd?'2024.05.07 更新':isTts?'2024.04.03 更新':isCr?'2024.10.08 更新':isCp?'2023.11.21 更新':isEd?'2024.04.28 12:35':isEpm?'2024.05.29 进阶':isImg360?'2024.05.26 18:31':isFso?'2024.05.28 更新':isOpt?'2024.05.25 更新':isPm?'2024.08.05 更新':'更新于 2024-05-25');
  var creatorAv=document.getElementById('oiws-creator-avatar');
  if(creatorAv){
    var cn=(p.creatorName||(isKf?'xiao':isVfs?'小齐齐':isMotion?'StarTed':isEdh?'魅力微变':isSeedance?'Cdd | AIGC':isHeartMula?'超级消息AIFSH':isFlux2?'Openclaw2026':isEmg?'KIMI':isEwbs?'我不吃甜药':isLtx?'AI世间创作':isSd?'数智AIGC':isTts?'大海向C':isCr?'阿姨AI':isCp?'Crazy Lychee':isEd?'AI地铺创作':isEpm?'大师':isImg360?'HyLan_L':isFso?'九七先生':isOpt?'user_63fiehy4':isPm?'魅力 创意':'Little Wrangler')).replace(/\s+/g,'').replace(/\|/g,'');
    creatorAv.textContent=cn.length>=2?cn.slice(0,2).toUpperCase():cn.charAt(0).toUpperCase();
  }
  var tags=(p.tags&&p.tags.length)?p.tags.slice():(isKf?['场景特效','视频特效','人物特效']:isVfs?['视频换脸','高清镜头','换脸']:isMotion?['原生视频','角色一致性','动作迁移']:isEdh?['音视频','数字人']:isSeedance?['创作大赛2025','固定视频','角色一致性']:isHeartMula?['音乐生成']:isFlux2?['黑科技','去水印']:isEmg?['服装展示','模特产品展示','图生图']:isEwbs?['图片场景精美','精修','置士图']:isLtx?['其他视频处理','面部视频','数字人']:isSd?['图生视频','分镜生成']:isTts?['语音克隆','双人对话','情感迁移']:isCr?['角色一致性','国产']:isCp?['创意形象','节日主题']:isEd?['分类:生成图','副主题','高级制作']:isEpm?['图片类']:isImg360?['场景转换','美化建筑及空间设计','图片画']:isFso?['人像写真','置换图','换脸']:isOpt?['老照片修复','人像写真','民国风']:isPm?['人像写真','美少女','文生图']:['文生图','图生图']);
  var tagsEl=document.getElementById('oiws-tags');
  if(tagsEl){
    tagsEl.innerHTML=tags.map(function(t){return '<span class="oiws-tag">'+t+'</span>';}).join('');
  }
  if(!p.introHtml&&!p.inputTips){
    if(isKf){
      p.introHtml='<p><strong>wan2.2 首尾帧</strong></p><p>上传首帧与尾帧 image，填写 text 描述过渡动作后生成视频。</p>';
    }else if(isVfs){
      p.introHtml='<p><strong>视频换脸 高清镜头换发型+自定义时长+真实自然换脸</strong></p><p>上传<strong>模特照片</strong>与<strong>驱动视频</strong>，自定义时长与最长边，填写 text 描述动作与造型，一键生成高清自然视频换脸。</p><h4>输入建议</h4><ul><li>模特照：正面清晰、无遮挡</li><li>视频：人物主体居中、光线稳定</li><li>时长与最长边按成片需求调节</li></ul>';
    }else if(isMotion){
      p.introHtml='<p><strong>Wan2.2 · 视频动作迁移</strong></p><p>上传角色图与参考 Video，完成动作迁移与角色一致性注入。</p>';
    }else if(isLtx){
      p.introHtml='<p><strong>LTX-2 · 数字人口型同步</strong></p><p>上传驱动音频与人像参考图，生成口型与表情同步视频。</p>';
    }else if(isSd){
      p.introHtml='<p><strong>短剧生成全流程</strong></p><p>上传角色、填写剧情，自动完成分镜与视频片段生成。</p>';
    }else if(isTts){
      p.introHtml='<p><strong>IndexTTS2 · 语音克隆</strong></p><p>支持双人对话、情感沟通与文本描述音色迁移。</p>';
    }else if(isCr){
      p.introHtml='<p><strong>人物替换 · 图片编辑 V3</strong></p><p>支持多人场景与影视替换，上传目标人脸与场景图即可生成。</p>';
    }else if(isImg360){
      p.introHtml='<p><strong>一键 图片 转 360全景图</strong></p><p>运用介绍&amp;输入建议：投稿教程：寻找受了启发</p><p>上传室内或建筑空间照片，自动<strong>扩充画幅</strong>、<strong>修复接缝</strong>并输出高分辨率 360° 全景图。</p><h4>输入建议</h4><ul><li>推荐横构图、光线均匀的室内/建筑参考图</li><li>避免严重畸变与大面积遮挡</li></ul>';
    }else if(isFso){
      p.introHtml='<p><strong>极致换脸 人物一致+自然真实</strong></p><p>上传<strong>模特照片</strong>与<strong>人脸照片</strong>，一键完成人像换脸与造型融合，保持五官一致、肤色自然。</p><h4>输入建议</h4><ul><li>模特图建议全身或半身，光线均匀、面部清晰</li><li>人脸照片正面无遮挡，与模特图肤色接近时效果更佳</li></ul>';
    }else if(isOpt){
      p.introHtml='<p><strong>旧照时光机</strong></p><p>运用介绍&amp;输入建议：输入邀请码 <em>gf3pouyd</em> 获取1000RH</p><p>专业级 AI 图像修复技术，拯救每一张泛黄时光：自动去划痕、补细节、智能上色，让老照片焕发新生。</p><h4>输入建议</h4><ul><li>上传清晰扫描件或手机翻拍的老照片</li><li>人像隐约可见、面部未严重模糊时效果最佳</li><li>严重破损可先轻度锐化再上传</li></ul>';
    }else if(isPm){
      p.introHtml='<p><strong>人物模特生成 · 智能核心训练版</strong></p><p>运用介绍&amp;输入建议：目前可用 API 补充提示词；常用引导词 <em>John3006</em>。</p>';
    }else if(isCp){
      p.introHtml='<p><strong>情侣头像明信片</strong></p><p>上传两张人像，一键生成二次元情侣头像明信片（GPT 4o / GPT-Image-1）。</p>';
    }else if(isEpm){
      p.introHtml='<p><strong>电商产品 · 自动多角度生成</strong></p><p>运用介绍&amp;输入建议：注册 <a href="https://www.runninghub.cn/" target="_blank" rel="noopener">www.runninghub.cn</a> 可领取 <strong>1000RH</strong> 算力奖励；微信联系 <em>rdcm008</em> 获取脚本与进阶指导。</p><p>上传<strong>成品图</strong>，按提示词中的 Next Scene 镜头指令自动生成多角度产品展示图。</p>';
    }else if(isEd){
      p.introHtml='<p><strong>AI全自动电商详情页生成 V3</strong></p><p>上传商品主图，一键直出 <strong>10 张</strong> 电商详情页套图，支持指定输出语言。</p><p class="oiws-intro-note">创作赛福利：输入邀请码 <em>fdxwead2</em> 可领取额外算力（演示）。</p>';
    }else if(isEdh){
      p.introHtml='<p><strong>电商口播数字人 · 表情+口型+声音克隆</strong></p><p>运用介绍&amp;输入建议：一键生成口播数字人，<strong>文案 + 图片</strong> 一键生成数字人；使用全新 <strong>InfiniteTalk</strong>，并兼容表情复刻模式（表情开关选 2）。</p><p class="oiws-intro-note">推荐 15 秒竖屏口播；音频建议干净干声，人像正面无遮挡。</p>';
    }else if(isSeedance){
      p.introHtml='<p><strong>Seedance 2.0 | 全能参考 · 支持真人</strong></p><p>运用介绍&amp;输入建议：上传<strong>角色卡</strong>与<strong>故事板</strong>参考，选择比例、分辨率与时长后生成视频；支持真人角色与固定视频参考模式。</p><p class="oiws-intro-link">📄 API 费用说明 · 角色卡设计指南 · 故事板通用说明（演示文档链接）</p><p class="oiws-intro-note">角色卡建议正面清晰无遮挡；故事板按分镜顺序上传关键帧。</p>';
    }else if(isHeartMula){
      p.introHtml='<p><strong>HeartMula 文生歌曲 + 音色克隆</strong></p><p>运用介绍&amp;输入建议：一句话生成一首歌，可上传<strong>参考音色</strong>进行克隆。</p><p class="oiws-intro-link">0121 heartmula文生歌曲工作流（需解压后导入）.zip</p><p class="oiws-intro-link">夸克链接：<a href="https://pan.quark.cn/s/a6dd47747d23" target="_blank" rel="noopener">https://pan.quark.cn/s/a6dd47747d23</a></p>';
    }else if(isFlux2){
      p.introHtml='<p><strong>FLUX2 一键去水印</strong></p><p>运用介绍&amp;输入建议：上传图片即可<strong>一键去除水印、杂物</strong>，单图版在改图时尽量<strong>保持原图不变</strong>（尺寸与主体构图）。</p><p class="oiws-intro-note">创作赛福利：输入邀请码 <em>fdxwead2</em> 可领取额外算力（演示）。</p><p class="oiws-intro-link">技术路径：4090 24G 单卡可跑；试用版每日约 5 次免费额度（演示说明）。</p>';
    }else if(isEwbs){
      p.introHtml='<p><strong>电商白底图智能生成场景</strong></p><p>运用介绍&amp;输入建议：注册 <a href="https://www.runninghub.cn/?inviteCode=5ef7f491" target="_blank" rel="noopener">www.runninghub.cn</a> 可领取算力奖励（邀请码 <em>5ef7f491</em>）。</p><p>上传<strong>白底商品图</strong>，一键生成精美电商场景图，支持精修与置景扩展。</p><h4>输入建议</h4><ul><li>推荐纯白或浅色背景的商品主图</li><li>产品主体清晰、无严重遮挡</li></ul>';
    }else if(isEmg){
      p.introHtml='<p><strong>产品图一键生成模特图 · 一次性生成 5 张</strong></p><p>运用介绍&amp;输入建议：上传<strong>产品图</strong>与<strong>模特参考图</strong>，填写产品名称，基于全能图片 2.0 超强一致性一键输出电商模特展示图。</p><h4>输入建议</h4><ul><li>产品图建议平铺或挂拍，主体完整</li><li>模特参考图正面清晰、姿态自然</li><li>产品名称写清品类与适龄人群</li></ul>';
    }else{
      p.introHtml='<p>全能图片 2.0 支持文生图与图生图。运行前可先对比价格：<strong>第三方低价渠道版</strong> API 价格更低；<strong>官方稳定版</strong> 稳定性与性能更优。</p><h4>输入建议</h4><ul><li>文生图：写清主体、构图、光线与风格</li><li>图生图：上传清晰参考图并说明希望保留或修改的部分</li></ul>';
    }
  }
  setAiwsIntroContent(document.getElementById('oiws-desc'),p);
  aiwsState.officialSamples=buildAiwsOfficialSamples(p);
  aiwsState.officialIndex=0;
  renderOiwsBanner();
  var demoWorks=(p.publicWorks&&p.publicWorks.length)?p.publicWorks:(isVfs?VFS_DEMO_WORKS:isMotion?MOTION_TRANSFER_DEMO_WORKS:isEdh||isSeedance||isHeartMula||isFlux2||isEwbs?[]:isEmg?EMG_DEMO_WORKS:isKf||isLtx||isSd||isTts?[]:isEd?ECOMMERCE_DETAIL_DEMO_WORKS:isEpm?[]:isCp?COUPLE_POSTCARD_DEMO_WORKS:isCr?CHAR_REPLACE_DEMO_WORKS:isFso?FSO_DEMO_WORKS:isPm?PERSON_MODEL_DEMO_WORKS:AIWS_DEMO_PUBLIC_WORKS);
  aiwsState.publicWorks=demoWorks.map(function(w){return _oiwsNormalizePublicWork(Object.assign({},w));});
  aiwsState.worksCount=p.worksCount!=null?p.worksCount:(isVfs?Math.max(1,aiwsState.publicWorks.length):isMotion?Math.max(1,aiwsState.publicWorks.length):isEdh?Math.max(6,aiwsState.publicWorks.length):isSeedance||isHeartMula||isFlux2||isEwbs?0:isEmg?Math.max(10,aiwsState.publicWorks.length):isKf?0:isLtx?0:isSd?0:isTts?0:isEd?Math.max(3,aiwsState.publicWorks.length):isEpm?Math.max(0,aiwsState.publicWorks.length):isCp?Math.max(5,aiwsState.publicWorks.length):isCr?8:isFso?Math.max(0,aiwsState.publicWorks.length):isPm?991:Math.max(88,aiwsState.publicWorks.length));
  renderOiwsPublicWorks();
  if(isKf){
    aiwsState.uploadPreviews=[KEYFRAMES_FRAME_START,KEYFRAMES_FRAME_END];
  }else if(isVfs){
    aiwsState.vfsDuration=typeof p.vfsDuration==='number'?p.vfsDuration:5;
    aiwsState.vfsMaxSide=typeof p.vfsMaxSide==='number'?p.vfsMaxSide:832;
    aiwsState.vfsVideoName='参考视频.mp4';
    aiwsState.uploadPreviews=[VFS_MODEL_IMAGE,VFS_VIDEO_THUMB];
  }else if(isMotion){
    aiwsState.motionVideoName='参考视频.mp4';
    aiwsState.uploadPreviews=[MOTION_TRANSFER_IMAGE,MOTION_TRANSFER_VIDEO_THUMB];
  }else if(isLtx){
    aiwsState.ttsAudioName='驱动音频.wav';
    aiwsState.uploadPreviews=['audio',LTX2_DIGITAL_HUMAN_IMAGE];
  }else if(isSd){
    aiwsState.uploadPreviews=SHORT_DRAMA_UPLOAD_SLOTS.map(function(s){return s.preview;});
  }else if(isTts){
    aiwsState.ttsAudioName='克隆参考音频.wav';
    aiwsState.uploadPreviews=['audio',''];
  }else if(isCr){
    aiwsState.crResolution=1280;
    aiwsState.uploadPreviews=CHAR_REPLACE_UPLOAD_SLOTS.map(function(s){return s.preview;});
  }else if(isPm){
    aiwsState.genQty=1;
  }else if(isCp){
    aiwsState.uploadPreviews=[COUPLE_POSTCARD_IMAGE_1,COUPLE_POSTCARD_IMAGE_2];
  }else if(isEd){
    aiwsState.uploadPreviews=[ECOMMERCE_DETAIL_IMAGE];
  }else if(isEpm){
    aiwsState.uploadPreviews=[EPM_UPLOAD_IMAGE];
  }else if(isEdh){
    aiwsState.ecomDhVideoName='口播参考.mp4';
    aiwsState.ttsAudioName='克隆音频.wav';
    aiwsState.uploadPreviews=[ECOM_DH_VIDEO_THUMB,'audio',ECOM_DH_FACE_IMAGE];
  }else if(isSeedance){
    aiwsState.uploadPreviews=[SEEDANCE20_ROLE1,'',''];
  }else if(isHeartMula){
    aiwsState.ttsAudioName='参考音色.wav';
    aiwsState.uploadPreviews=['audio',''];
  }else if(isFlux2){
    aiwsState.uploadPreviews=[FLUX2_WATERMARK_IMAGE];
  }else if(isEwbs){
    aiwsState.uploadPreviews=[ECOMMERCE_WHITE_BG_UPLOAD_IMAGE];
  }else if(isEmg){
    aiwsState.uploadPreviews=EMG_UPLOAD_SLOTS.map(function(s){return s.preview;});
  }else if(isImg360){
    aiwsState.uploadPreviews=[IMG360_UPLOAD_IMAGE];
  }else if(isFso){
    aiwsState.uploadPreviews=FSO_UPLOAD_SLOTS.map(function(s){return s.preview;});
  }else if(isFr){
    aiwsState.frGender='female';
    aiwsState.frOutfits=[];
    aiwsState.frAssetPicks=[];
    aiwsState.frShowAllOutfits=false;
    aiwsState.frSections=_oiwsFrDefaultSections();
    aiwsState.uploadPreviews=[''];
  }else if(isUo){
    aiwsState.uoStep=1;
    aiwsState.uoOutfitId='';
    aiwsState.uoMusicId='';
    aiwsState.uoRandomMusicId='';
    aiwsState.uoCustomOutfitUrl='';
    aiwsState.uoCustomMusicName='';
    aiwsState.uoAspect='9:16';
    aiwsState.uoQuality='Standard';
    aiwsState.uploadPreviews=[''];
  }else if(isVrc){
    aiwsState.vrcVideoName='参考视频.mp4';
    aiwsState.vrcComparePos=50;
    aiwsState.uploadPreviews=[VRC_DEMO_VIDEO,''];
  }else if(isOpt){
    aiwsState.uploadPreviews=[OLD_PHOTO_UPLOAD_IMAGE];
  }else{
    aiwsState.uploadPreviews=OMNI_IMAGE2_UPLOAD_SLOTS.map(function(s){return s.preview;});
  }
  var form=document.getElementById('oiws-params-form');
  if(form){
    form.innerHTML=isKf?buildKeyframesVideoParamsForm(p):isVfs?buildVideoFaceSwapParamsForm(p):isVrc?buildVideoRecastParamsForm():isUo?buildVideoOutfitParamsForm():isMotion?buildMotionTransferParamsForm(p):isEdh?buildEcommerceDigitalHumanParamsForm(p):isSeedance?buildSeedance20ParamsForm(p):isHeartMula?buildHeartMulaParamsForm(p):isFlux2?buildFlux2WatermarkParamsForm(p):isEwbs?buildEcommerceWhiteBgSceneParamsForm(p):isEmg?buildEcommerceModelGenParamsForm(p):isLtx?buildLtx2DigitalHumanParamsForm(p):isSd?buildShortDramaParamsForm(p):isTts?buildIndexTts2ParamsForm(p):isCr?buildCharacterReplaceParamsForm(p):isCp?buildCouplePostcardParamsForm(p):isEd?buildEcommerceDetailParamsForm(p):isEpm?buildEcommerceProductMultiangleParamsForm(p):isImg360?buildImageTo360PanoramaParamsForm(p):isFr?buildFittingRoomParamsForm():isFso?buildFaceSwapOutfitParamsForm(p):isOpt?buildOldPhotoTimeMachineParamsForm(p):isPm?buildPersonModelParamsForm(p):buildOmniImage2ParamsForm(p);
  }
  var collectExtra=document.getElementById('oiws-collect-extra');
  var publishWork=document.getElementById('oiws-publish-work');
  if(isUo){
    resetOiwsRunBar(null);
    syncOiwsRunPrice(resolveOiwsRunPrice(p,{isCr:true,isUo:true}));
    var runStdUo=document.getElementById('oiws-run-standard');
    if(runStdUo)runStdUo.classList.add('hidden');
    var runLabelUo=document.getElementById('oiws-run-label');
    if(runLabelUo)runLabelUo.classList.remove('hidden');
    var runBtnUo=document.getElementById('oiws-run-btn');
    if(runBtnUo)runBtnUo.classList.remove('oiws-run-btn-full--ecommerce');
    if(collectExtra)collectExtra.classList.add('hidden');
    if(publishWork)publishWork.classList.add('hidden');
  }else if(isOpt||isImg360||isFso||isFr||isVrc||isEpm||isVfs||isFlux2||isEwbs||isEmg){
    var runLikeCr=p.runBarLikeCharacterReplace!==false;
    var hidePub=p.hidePublishWork!==false;
    if(runLikeCr){
      resetOiwsRunBar(null);
      syncOiwsRunPrice(resolveOiwsRunPrice(p,{isCr:true,isFr:isFr,isVrc:isVrc}));
      var runStdCr=document.getElementById('oiws-run-standard');
      if(runStdCr)runStdCr.classList.add('hidden');
      var runLabelCr=document.getElementById('oiws-run-label');
      if(runLabelCr)runLabelCr.classList.remove('hidden');
      var runBtnCr=document.getElementById('oiws-run-btn');
      if(runBtnCr)runBtnCr.classList.remove('oiws-run-btn-full--ecommerce');
      if(collectExtra)collectExtra.classList.toggle('hidden',true);
      if(publishWork)publishWork.classList.toggle('hidden',hidePub);
    }else{
      resetOiwsRunBar(null);
      syncOiwsRunPrice(resolveOiwsRunPrice(p,{isFso:isFso,isOpt:isOpt,isImg360:isImg360}));
      var runStd=document.getElementById('oiws-run-standard');
      if(runStd)runStd.classList.remove('hidden');
      var runLabel=document.getElementById('oiws-run-label');
      if(runLabel)runLabel.classList.add('hidden');
      if(collectExtra)collectExtra.classList.toggle('hidden',false);
      if(publishWork)publishWork.classList.toggle('hidden',hidePub);
    }
  }else{
    resetOiwsRunBar(null);
    syncOiwsRunPrice(resolveOiwsRunPrice(p,{isKf:isKf,isVfs:isVfs,isMotion:isMotion,isEdh:isEdh,isSeedance:isSeedance,isHeartMula:isHeartMula,isFlux2:isFlux2,isLtx:isLtx,isSd:isSd,isTts:isTts,isCr:isCr,isCp:isCp,isEd:isEd,isPm:isPm}));
    if(collectExtra)collectExtra.classList.add('hidden');
    if(publishWork)publishWork.classList.add('hidden');
  }
  var followBtn=document.getElementById('oiws-side-follow-btn');
  if(followBtn){
    followBtn.innerHTML='<span aria-hidden="true">+</span> 关注';
    followBtn.classList.remove('followed');
  }
  syncOiwsCounts();
  renderOiwsComments();
  switchOiwsMainTab('works');
  if(isFr)renderFittingRoomStudio();
  else hideFittingRoomStudio();
  if(isVrc)renderVideoRecastStudio();
  else hideVideoRecastStudio();
  if(isUo)renderVideoOutfitStudio();
  else hideVideoOutfitStudio();
  var oiwsModal=document.getElementById('omni-image-workspace-modal');
  if(!oiwsModal){
    if(typeof showToast==='function')showToast('⚠️ 全能图片工作区未加载，请刷新页面后重试');
    return;
  }
  openModal('omni-image-workspace-modal');
}
function applyAiwsImageWorkspaceLayout(p,isMedia,catKey){
  var isGpt=isGptImage2App(p.title,p.id);
  var wsWrap=document.querySelector('#app-image-workspace-modal .app-image-ws');
  if(wsWrap)wsWrap.classList.toggle('app-image-ws--gpt',isGpt);
  var sideRunBar=document.getElementById('aiws-side-run-bar');
  if(sideRunBar)sideRunBar.classList.toggle('hidden',!isGpt);
  var sep1=document.getElementById('aiws-stat-sep-1');
  var sep2=document.getElementById('aiws-stat-sep-2');
  var statLike=document.getElementById('aiws-stat-like-btn');
  var statFav=document.getElementById('aiws-stat-fav-btn');
  var collectRow=document.getElementById('aiws-collect-row');
  var workflowBtn=document.getElementById('aiws-workflow-btn');
  var collectCommentBtn=document.getElementById('aiws-collect-comment-btn');
  var headerLike=document.getElementById('aiws-like-btn');
  var headerFav=document.getElementById('aiws-fav-btn');
  var headerComment=document.getElementById('aiws-comment-btn');
  [sep1,sep2,statLike,statFav].forEach(function(el){
    if(el)el.classList.toggle('hidden',!isGpt);
  });
  if(collectRow)collectRow.classList.toggle('hidden',isGpt||(!isMedia&&catKey!=='image'));
  if(workflowBtn)workflowBtn.classList.toggle('hidden',isGpt);
  if(collectCommentBtn)collectCommentBtn.classList.toggle('hidden',isGpt);
  if(headerLike)headerLike.classList.toggle('hidden',isGpt);
  if(headerFav)headerFav.classList.toggle('hidden',isGpt);
  if(headerComment)headerComment.classList.toggle('hidden',isGpt);
}
function syncAiwsActionButtons(){
  var likeBtn=document.getElementById('aiws-like-btn');
  var favBtn=document.getElementById('aiws-fav-btn');
  var likeCountEl=document.getElementById('aiws-like-count');
  var favCountEl=document.getElementById('aiws-fav-count');
  var commentCountEl=document.getElementById('aiws-comment-count');
  var statLikeBtn=document.getElementById('aiws-stat-like-btn');
  var statFavBtn=document.getElementById('aiws-stat-fav-btn');
  var statLikeCount=document.getElementById('aiws-stat-like-count');
  var statFavCount=document.getElementById('aiws-stat-fav-count');
  if(likeCountEl)likeCountEl.textContent=String(aiwsState.likeCount);
  if(favCountEl)favCountEl.textContent=String(aiwsState.favCount);
  if(statLikeCount)statLikeCount.textContent=String(aiwsState.likeCount);
  if(statFavCount)statFavCount.textContent=String(aiwsState.favCount);
  if(commentCountEl)commentCountEl.textContent=String(aiwsState.commentCount);
  var omniFav=document.getElementById('aiws-omni-collect-fav');
  var omniComment=document.getElementById('aiws-omni-collect-comment');
  if(omniFav)omniFav.textContent=String(aiwsState.favCount);
  if(omniComment)omniComment.textContent=String(aiwsState.commentCount);
  if(likeBtn){
    likeBtn.classList.toggle('active',aiwsState.liked);
    likeBtn.setAttribute('aria-pressed',aiwsState.liked?'true':'false');
    var likeIcon=likeBtn.querySelector('.app-image-ws-action-icon');
    if(likeIcon)likeIcon.textContent=aiwsState.liked?'👍':'👍';
  }
  if(statLikeBtn){
    statLikeBtn.classList.toggle('active',aiwsState.liked);
    statLikeBtn.setAttribute('aria-pressed',aiwsState.liked?'true':'false');
  }
  if(favBtn){
    favBtn.classList.toggle('faved',aiwsState.faved);
    favBtn.classList.toggle('active',aiwsState.faved);
    favBtn.setAttribute('aria-pressed',aiwsState.faved?'true':'false');
    var favIcon=favBtn.querySelector('.app-image-ws-action-icon');
    if(favIcon)favIcon.textContent=aiwsState.faved?'★':'☆';
  }
  if(statFavBtn){
    statFavBtn.classList.toggle('faved',aiwsState.faved);
    statFavBtn.setAttribute('aria-pressed',aiwsState.faved?'true':'false');
    var statFavIcon=statFavBtn.querySelector('[aria-hidden="true"]');
    if(statFavIcon)statFavIcon.textContent=aiwsState.faved?'★':'☆';
  }
  var collectFav=document.getElementById('aiws-collect-fav');
  var collectComment=document.getElementById('aiws-collect-comment');
  if(collectFav)collectFav.textContent=String(aiwsState.favCount);
  if(collectComment)collectComment.textContent=String(aiwsState.commentCount);
  var commentBtn=document.getElementById('aiws-comment-btn');
  var commentsOpen=isAiwsCommentsOpen();
  if(commentBtn){
    commentBtn.classList.toggle('active',commentsOpen);
    commentBtn.setAttribute('aria-pressed',commentsOpen?'true':'false');
    commentBtn.setAttribute('aria-expanded',commentsOpen?'true':'false');
  }
}
function renderAiwsComments(){
  var list=document.getElementById('aiws-comment-list');
  var empty=document.getElementById('aiws-comment-empty');
  if(!list)return;
  if(!aiwsState.comments.length){
    if(empty)empty.style.display='';
    list.querySelectorAll('.app-image-ws-comment-item').forEach(function(el){el.remove();});
    return;
  }
  if(empty)empty.style.display='none';
  var existing=list.querySelectorAll('.app-image-ws-comment-item');
  existing.forEach(function(el){el.remove();});
  aiwsState.comments.forEach(function(c){
    var item=document.createElement('article');
    item.className='app-image-ws-comment-item';
    item.innerHTML='<div class="app-image-ws-comment-meta"><strong>'+c.user+'</strong><span>'+c.time+'</span></div>'+
      '<div class="app-image-ws-comment-body">'+c.text.replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</div>';
    list.appendChild(item);
  });
}
function isAiwsCommentsOpen(){
  var modal=document.getElementById('app-image-workspace-modal');
  if(!modal)return false;
  var panel=modal.querySelector('[data-aiws-main-panel="comments"]');
  return !!(panel&&!panel.classList.contains('hidden'));
}
function switchAiwsMainTab(tabId){
  var modal=document.getElementById('app-image-workspace-modal');
  if(!modal)return;
  modal.querySelectorAll('.app-image-ws-main-tab').forEach(function(t){
    var active=t.getAttribute('data-aiws-main')===tabId;
    t.classList.toggle('active',active);
  });
  modal.querySelectorAll('[data-aiws-main-panel]').forEach(function(p){
    p.classList.toggle('hidden',p.getAttribute('data-aiws-main-panel')!==tabId);
  });
  syncAiwsActionButtons();
}
window.toggleAiwsLike=function(){
  aiwsState.liked=!aiwsState.liked;
  aiwsState.likeCount+=aiwsState.liked?1:-1;
  if(aiwsState.likeCount<0)aiwsState.likeCount=0;
  refreshAiwsModalUI();
  showToast(aiwsState.liked?'👍 已点赞':'已取消点赞');
};
window.toggleAiwsFav=function(){
  aiwsState.faved=!aiwsState.faved;
  aiwsState.favCount+=aiwsState.faved?1:-1;
  if(aiwsState.favCount<0)aiwsState.favCount=0;
  refreshAiwsModalUI();
  showToast(aiwsState.faved?'⭐ 已收藏':'已取消收藏');
};
window.shareAiwsApp=function(){
  if(typeof openMyworksShare==='function'){
    openMyworksShare({ stacked: true });
    return;
  }
  openGuidSharePage(aiwsState.sharePayload||{title:aiwsState.title});
};
window.openGuidSharePage=function(payload){
  if(typeof openMyworksShare==='function'){
    openMyworksShare({ stacked: true });
    return;
  }
  payload=payload||{};
  var modal=document.getElementById('guid-share-modal');
  var frame=document.getElementById('guid-share-frame');
  if(!modal||!frame)return;
  var params=new URLSearchParams();
  if(payload.title)params.set('title',payload.title);
  if(payload.desc)params.set('desc',payload.desc);
  if(payload.icon)params.set('icon',payload.icon);
  if(payload.cat)params.set('cat',payload.cat);
  if(payload.gradient)params.set('gradient',payload.gradient);
  frame.src='share.html?'+params.toString();
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
};
window.closeGuidSharePage=function(){
  var modal=document.getElementById('guid-share-modal');
  var frame=document.getElementById('guid-share-frame');
  if(modal){
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
  }
  if(frame)frame.src='about:blank';
  document.body.style.overflow='';
};
window.toggleAiwsComments=function(){
  if(isAiwsCommentsOpen()){
    switchAiwsMainTab('works');
    return;
  }
  switchAiwsMainTab('comments');
  var input=document.getElementById('aiws-comment-input');
  if(input){
    setTimeout(function(){
      input.focus();
      input.scrollIntoView({behavior:'smooth',block:'center'});
    },50);
  }
};
window.focusAiwsComments=window.toggleAiwsComments;
window.toggleAiwsHistory=function(){};
window.toggleAcwsHistory=function(){};

var AIWS_DEMO_PUBLIC_WORKS=[
  {user:'阿童木',emoji:'🧑‍🎨',gradient:'linear-gradient(135deg,#312e81,#1e3a8a)',title:'赛博朋克人像试衣',type:'image',prompt:'赛博朋克风格人像，霓虹灯光，高细节面部，服装纹理清晰，商业摄影质感',model:'Qwen 图像编辑',likes:128,views:1240,uses:56,price:'免费',params:'1024x1024 · steps:28'},
  {user:'青青草原',emoji:'🌿',gradient:'linear-gradient(135deg,#064e3b,#047857)',title:'春日户外换装',type:'image',prompt:'自然光户外人像，浅绿草地背景，休闲春装，柔和色调，真实肤质',model:'Qwen 图像编辑',likes:86,views:890,uses:34,price:'免费',params:'768x1024 · style:natural'},
  {user:'设计狮小王',emoji:'🦁',gradient:'linear-gradient(135deg,#7c2d12,#b45309)',title:'电商白底商品图',type:'image',prompt:'纯白背景电商服装展示，正面平铺，无阴影，高清材质细节',model:'Qwen 图像编辑',likes:203,views:2100,uses:91,price:'⚡0.5',params:'1024x1024 · quality:hd'},
  {user:'Momo',emoji:'🎀',gradient:'linear-gradient(135deg,#831843,#9d174d)',title:'甜美洛丽塔造型',type:'image',prompt:'洛丽塔裙装人像，粉色系配饰，柔焦梦幻氛围，精致妆面',model:'Qwen 图像编辑',likes:64,views:520,uses:22,price:'免费',params:'832x1216 · style:anime'}
];
var AIWS_DEMO_COMMENTS=[
  {user:'阿童木',time:'2小时前',text:'效果太好了，完全看不出是 AI 生成的！'},
  {user:'青青草原',time:'5小时前',text:'已使用，效果惊艳！一键生成太方便了'},
  {user:'设计狮小王',time:'昨天',text:'求问能否支持批量处理？'}
];

function setAiwsIntroContent(descEl,p){
  if(!descEl)return;
  var html=p.introHtml||'';
  if(!html&&p.desc){
    html='<p>'+String(p.desc).replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</p>';
    if(p.inputTips){
      html+='<h4>输入建议</h4><ul><li>'+String(p.inputTips).split(/\n|；|;/).map(function(s){
        return s.trim();
      }).filter(Boolean).join('</li><li>')+'</li></ul>';
    }
  }
  descEl.innerHTML=html||'<p>暂无介绍</p>';
}
function buildAiwsOfficialSamples(p){
  var base=p.icon||'🖼️';
  var grad=p.gradient||'linear-gradient(135deg,#4c1d95,#1e3a8a)';
  if(p.officialSamples&&p.officialSamples.length)return p.officialSamples;
  return [
    {emoji:base,gradient:grad},
    {emoji:base,gradient:'linear-gradient(135deg,#1e3a5f,#0f766e)'},
    {emoji:base,gradient:'linear-gradient(135deg,#7c2d12,#be123c)'}
  ];
}
function renderAiwsOfficialSample(){
  if(aiwsState.showingRunResult){
    showAiwsRunResultInPreview(aiwsState.runResultSrc);
    return;
  }
  var stage=document.getElementById('aiws-preview-stage');
  if(stage)stage.classList.remove('aiws-preview-stage--run-result');
  var samples=aiwsState.officialSamples||[];
  var idx=aiwsState.officialIndex||0;
  if(!samples.length)return;
  if(idx<0)idx=0;
  if(idx>=samples.length)idx=samples.length-1;
  aiwsState.officialIndex=idx;
  var item=samples[idx];
  var stage=document.getElementById('aiws-preview-stage');
  var emojiEl=document.getElementById('aiws-preview-emoji');
  var coverEl=document.getElementById('aiws-preview-cover');
  var counter=document.getElementById('aiws-official-counter');
  var prevBtn=document.getElementById('aiws-official-prev');
  var nextBtn=document.getElementById('aiws-official-next');
  var hasCover=!!(item&&item.coverImage);
  if(stage){
    if(item.gradient)stage.style.background=item.gradient;
    stage.classList.toggle('has-cover',hasCover);
  }
  if(coverEl){
    if(hasCover){
      coverEl.src=EXAMPLE_PREVIEW_IMAGE;
      coverEl.alt=aiwsState.title||'官方示例';
      coverEl.classList.remove('hidden');
    }else{
      coverEl.removeAttribute('src');
      coverEl.classList.add('hidden');
    }
  }
  if(emojiEl){
    emojiEl.textContent=item.emoji||'🖼️';
    emojiEl.style.display=hasCover?'none':'';
  }
  if(counter)counter.textContent=(idx+1)+' / '+samples.length;
  if(prevBtn){
    prevBtn.disabled=idx<=0;
    prevBtn.classList.toggle('disabled',idx<=0);
  }
  if(nextBtn){
    nextBtn.disabled=idx>=samples.length-1;
    nextBtn.classList.toggle('disabled',idx>=samples.length-1);
  }
}
window.aiwsOfficialPrev=function(){
  if(aiwsState.showingRunResult){
    clearOiwsRunResultView();
    renderAiwsOfficialSample();
    return;
  }
  aiwsState.officialIndex=(aiwsState.officialIndex||0)-1;
  renderAiwsOfficialSample();
};
window.aiwsOfficialNext=function(){
  if(aiwsState.showingRunResult)return;
  aiwsState.officialIndex=(aiwsState.officialIndex||0)+1;
  renderAiwsOfficialSample();
};
function refreshAiwsModalUI(){
  syncAiwsActionButtons();
  renderAiwsPublicWorks();
}
window.refreshAiwsModalUI=refreshAiwsModalUI;
window.toggleAiwsWorkLike=function(index,ev){
  if(ev){ev.stopPropagation();ev.preventDefault();}
  var works=aiwsState.publicWorks||[];
  var w=works[index];
  if(!w)return;
  w.liked=!w.liked;
  w.likes=Math.max(0,(Number(w.likes)||0)+(w.liked?1:-1));
  aiwsState.likeCount=Math.max(0,(Number(aiwsState.likeCount)||0)+(w.liked?1:-1));
  refreshAiwsModalUI();
  showToast(w.liked?'❤️ 已点赞':'已取消点赞');
};
window.toggleAiwsWorkFav=function(index,ev){
  if(ev){ev.stopPropagation();ev.preventDefault();}
  var works=aiwsState.publicWorks||[];
  var w=works[index];
  if(!w)return;
  w.faved=!w.faved;
  aiwsState.favCount=Math.max(0,(Number(aiwsState.favCount)||0)+(w.faved?1:-1));
  refreshAiwsModalUI();
  showToast(w.faved?'⭐ 已收藏':'已取消收藏');
};
function renderAiwsPublicWorks(){
  var grid=document.getElementById('aiws-works-grid');
  var empty=document.getElementById('aiws-works-empty');
  var countEl=document.getElementById('aiws-works-count');
  var works=aiwsState.publicWorks||[];
  if(countEl)countEl.textContent=String(works.length);
  if(!grid)return;
  if(!works.length){
    grid.innerHTML='';
    if(empty)empty.classList.remove('hidden');
    return;
  }
  if(empty)empty.classList.add('hidden');
  grid.innerHTML='';
  works.forEach(function(w,i){
    w=_oiwsNormalizePublicWork(w);
    works[i]=w;
    var card=document.createElement('article');
    card.className='oiws-work-card';
    card.setAttribute('role','button');
    card.setAttribute('tabindex','0');
    var cover=document.createElement('div');
    cover.className='oiws-work-card-cover';
    cover.style.background=w.gradient||'#232a2e';
    var emoji=document.createElement('span');
    emoji.className='oiws-work-card-emoji';
    emoji.textContent=w.emoji||'🖼️';
    var actions=document.createElement('div');
    actions.className='oiws-work-card-actions';
    var likeBtn=document.createElement('button');
    likeBtn.type='button';
    likeBtn.className='oiws-work-action oiws-work-action--like'+(w.liked?' is-active':'');
    likeBtn.setAttribute('aria-label','点赞');
    likeBtn.innerHTML='♥ <span>'+_oiwsFormatWorkCount(w.likes)+'</span>';
    likeBtn.addEventListener('click',function(ev){toggleAiwsWorkLike(i,ev);});
    var favBtn=document.createElement('button');
    favBtn.type='button';
    favBtn.className='oiws-work-action oiws-work-action--fav'+(w.faved?' is-active':'');
    favBtn.setAttribute('aria-label','收藏');
    favBtn.textContent=w.faved?'★':'☆';
    favBtn.addEventListener('click',function(ev){toggleAiwsWorkFav(i,ev);});
    actions.appendChild(likeBtn);
    actions.appendChild(favBtn);
    if(w.type==='video'){
      emoji.textContent='';
      var workVid=document.createElement('video');
      workVid.className='oiws-work-card-vid';
      workVid.src=EXAMPLE_PREVIEW_VIDEO;
      workVid.poster=EXAMPLE_PREVIEW_IMAGE;
      workVid.muted=true;
      workVid.playsInline=true;
      workVid.style.cssText='width:100%;height:100%;object-fit:cover;display:block;';
      cover.appendChild(workVid);
      var playIcon=document.createElement('span');
      playIcon.className='oiws-work-card-play';
      playIcon.setAttribute('aria-hidden','true');
      playIcon.textContent='▶';
      cover.appendChild(playIcon);
    }else if(w.type==='image'||!w.type){
      var workImg=document.createElement('img');
      workImg.className='oiws-work-card-img';
      workImg.src=EXAMPLE_PREVIEW_IMAGE;
      workImg.alt=w.title||'';
      workImg.loading='lazy';
      cover.appendChild(workImg);
    }else{
      cover.appendChild(emoji);
    }
    cover.appendChild(actions);
    var meta=document.createElement('div');
    meta.className='oiws-work-card-meta';
    meta.textContent=w.title||(w.user||'作品 '+(i+1));
    card.appendChild(cover);
    card.appendChild(meta);
    card.addEventListener('click',function(ev){
      if(ev.target.closest('.oiws-work-card-actions'))return;
      openAppsPublicWorkPreview(w,{
        sourceName:aiwsState.title||'',
        stacked:true,
        preserve:['app-image-workspace-modal']
      });
    });
    card.addEventListener('keydown',function(ev){
      if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();card.click();}
    });
    grid.appendChild(card);
  });
}

function renderFapmPublicWorks(card){
  var grid=document.getElementById('fapm-works-grid');
  if(!grid)return;
  grid.innerHTML='';
  var count=parseInt(card&&card.getAttribute('data-works'),10);
  if(!count||count<1)count=AIWS_DEMO_PUBLIC_WORKS.length;
  var sourceName=(card&&card.getAttribute('data-name'))||'';
  for(var i=0;i<count;i++){
    var work=AIWS_DEMO_PUBLIC_WORKS[i%AIWS_DEMO_PUBLIC_WORKS.length];
    var btn=document.createElement('button');
    btn.type='button';
    btn.style.cssText='width:110px;min-width:110px;height:110px;border-radius:8px;overflow:hidden;border:none;padding:0;display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0;cursor:pointer;';
    btn.style.background=work.gradient||'linear-gradient(135deg,#374151,#1f2937)';
    if(isVideoPreviewType(work.type)){
      btn.innerHTML='<video src="'+EXAMPLE_PREVIEW_VIDEO+'" poster="'+EXAMPLE_PREVIEW_IMAGE+'" style="width:100%;height:100%;object-fit:cover;" muted playsinline></video>';
    }else if(work.type==='image'||!work.type){
      btn.innerHTML='<img src="'+EXAMPLE_PREVIEW_IMAGE+'" alt="" style="width:100%;height:100%;object-fit:cover;">';
    }else{
      btn.textContent=work.emoji||'🖼️';
    }
    btn.setAttribute('aria-label',(work.title||work.user||'作品')+' 的作品');
    (function(w,name){
      btn.addEventListener('click',function(){
        openAppsPublicWorkPreview(w,{sourceName:name,stacked:false});
      });
    })(work,sourceName);
    grid.appendChild(btn);
  }
}
window.renderFapmPublicWorks=renderFapmPublicWorks;
function syncAiwsTabCommentCount(){
  var tabCount=document.getElementById('aiws-tab-comment-count');
  if(tabCount)tabCount.textContent=String(aiwsState.commentCount||0);
}

window.NOTIF_PREFS_KEY='guid_ai_notif_prefs';
window.NOTIF_QUOTA_USD_RATE=500000;

window.loadNotifPrefs=function(){
  try{
    var raw=localStorage.getItem(window.NOTIF_PREFS_KEY);
    if(raw){
      var parsed=JSON.parse(raw);
      if(parsed&&typeof parsed==='object')return parsed;
    }
  }catch(e){}
  return {
    announce:true,works:true,income:true,promo:false,email:true,
    method:'email',quotaThreshold:500000,notifyEmail:'',
    citeCreative:true,inviteSuccess:true
  };
};
window.saveNotifPrefs=function(prefs){
  try{localStorage.setItem(window.NOTIF_PREFS_KEY,JSON.stringify(prefs));}catch(e){}
};

function _notifPrefsRoot(scope){
  if(scope==='modal')return document.getElementById('modal-notif-prefs');
  if(scope==='profile')return document.getElementById('profile-notif-prefs');
  return document.getElementById('profile-notif-prefs')||document.getElementById('modal-notif-prefs');
}

function _notifMethodInputName(root){
  if(!root)return 'notif-method';
  return root.id==='modal-notif-prefs'?'notif-method-modal':'notif-method';
}

function _notifFormatQuotaUsd(threshold){
  var n=Math.max(0,parseInt(threshold,10)||0);
  var rate=window.NOTIF_QUOTA_USD_RATE||500000;
  return '$'+(n/rate).toFixed(2);
}

window.updateNotifQuotaUsdDisplay=function(root){
  root=root||_notifPrefsRoot('profile');
  if(!root)return;
  var input=root.querySelector('.notif-quota-threshold');
  var usdEl=root.querySelector('.notif-quota-usd');
  if(!input||!usdEl)return;
  usdEl.textContent=_notifFormatQuotaUsd(input.value);
};

window.syncNotifMethodPanels=function(root,method){
  root=root||_notifPrefsRoot('profile');
  if(!root)return;
  method=method||'email';
  var emailField=root.querySelector('.notif-prefs-email-field');
  if(emailField)emailField.classList.toggle('is-hidden',method!=='email');
};

window.applyNotifPrefsToUI=function(prefs,scope){
  prefs=prefs||window.loadNotifPrefs();
  var roots=[];
  var profileRoot=document.getElementById('profile-notif-prefs');
  var modalRoot=document.getElementById('modal-notif-prefs');
  if(scope==='modal'&&modalRoot)roots=[modalRoot];
  else if(scope==='profile'&&profileRoot)roots=[profileRoot];
  else{
    if(profileRoot)roots.push(profileRoot);
    if(modalRoot)roots.push(modalRoot);
  }
  roots.forEach(function(root){
    var method=prefs.method||'email';
    var methodName=_notifMethodInputName(root);
    root.querySelectorAll('input[name="'+methodName+'"]').forEach(function(r){
      r.checked=r.value===method;
    });
    var quota=root.querySelector('.notif-quota-threshold');
    if(quota)quota.value=String(prefs.quotaThreshold!=null?prefs.quotaThreshold:500000);
    var email=root.querySelector('.notif-notify-email');
    if(email)email.value=prefs.notifyEmail||'';
    root.querySelectorAll('.notif-prefs-toggle').forEach(function(el){
      var key=el.getAttribute('data-notif-key');
      if(key&&Object.prototype.hasOwnProperty.call(prefs,key))el.checked=!!prefs[key];
    });
    window.syncNotifMethodPanels(root,method);
    window.updateNotifQuotaUsdDisplay(root);
  });
};

window.collectNotifPrefsFromUI=function(scope){
  var root=_notifPrefsRoot(scope);
  var prefs=window.loadNotifPrefs();
  if(!root)return prefs;
  var methodName=_notifMethodInputName(root);
  var checked=root.querySelector('input[name="'+methodName+'"]:checked');
  prefs.method=checked?checked.value:'email';
  var quota=root.querySelector('.notif-quota-threshold');
  prefs.quotaThreshold=quota?Math.max(0,parseInt(quota.value,10)||0):500000;
  var email=root.querySelector('.notif-notify-email');
  prefs.notifyEmail=email?email.value.trim():'';
  root.querySelectorAll('.notif-prefs-toggle').forEach(function(el){
    var key=el.getAttribute('data-notif-key');
    if(key)prefs[key]=!!el.checked;
  });
  return prefs;
};

function _bindNotifPrefsForm(root){
  if(!root||root.dataset.notifFormBound)return;
  root.dataset.notifFormBound='1';
  var methodName=_notifMethodInputName(root);
  root.querySelectorAll('input[name="'+methodName+'"]').forEach(function(r){
    r.addEventListener('change',function(){
      window.syncNotifMethodPanels(root,r.value);
    });
  });
  var quota=root.querySelector('.notif-quota-threshold');
  if(quota){
    quota.addEventListener('input',function(){
      window.updateNotifQuotaUsdDisplay(root);
    });
  }
  if(root.id==='profile-notif-prefs'){
    root.querySelectorAll('.notif-prefs-toggle').forEach(function(el){
      if(el.dataset.notifToggleBound)return;
      el.dataset.notifToggleBound='1';
      el.addEventListener('change',function(){
        var p=window.collectNotifPrefsFromUI('profile');
        window.saveNotifPrefs(p);
      });
    });
  }
}

window.saveProfileNotifSettings=function(){
  var prefs=window.collectNotifPrefsFromUI('profile');
  window.saveNotifPrefs(prefs);
  window.applyNotifPrefsToUI(prefs);
  if(typeof showToast==='function')showToast('✅ 通知偏好已保存');
};

window.saveNotifSettings=function(){
  var prefs=window.collectNotifPrefsFromUI('modal');
  window.saveNotifPrefs(prefs);
  window.applyNotifPrefsToUI(prefs);
  if(typeof closeModal==='function')closeModal('notif-settings-modal');
  if(typeof showToast==='function')showToast('✅ 通知偏好已保存');
};

window.initNotifPrefsUI=function(){
  var prefs=window.loadNotifPrefs();
  window.applyNotifPrefsToUI(prefs);
  _bindNotifPrefsForm(document.getElementById('profile-notif-prefs'));
  _bindNotifPrefsForm(document.getElementById('modal-notif-prefs'));
};
window.postAiwsComment=function(){
  var input=document.getElementById('aiws-comment-input');
  if(!input)return;
  var text=input.value.trim();
  if(!text){showToast('请输入评论内容');return;}
  aiwsState.comments.unshift({
    user:'我',
    time:'刚刚',
    text:text
  });
  aiwsState.commentCount+=1;
  input.value='';
  syncAiwsActionButtons();
  syncAiwsTabCommentCount();
  renderAiwsComments();
  showToast('💬 评论已发布');
};

function isMediaAppWorkspace(catKey){
  return catKey&&AIWS_MEDIA_KEYS.indexOf(catKey)>=0;
}
function isCopyAppWorkspace(catKey){
  return catKey==='doc';
}
function isImageAppWorkspace(cat,catKey){
  if(isCopyAppWorkspace(catKey))return false;
  if(isMediaAppWorkspace(catKey))return true;
  if(catKey&&AIWS_IMAGE_KEYS.indexOf(catKey)>=0)return true;
  var c=String(cat||'');
  return ['图像','换脸','换装','风格','修复','工具','视频','音频'].some(function(k){return c.indexOf(k)>=0;});
}
function parseUsesNum(uses){
  var m=String(uses||'').match(/([\d.]+)\s*(k|w)?/i);
  if(!m)return 0;
  var n=parseFloat(m[1]);
  if((m[2]||'').toLowerCase()==='k')n*=1000;
  if((m[2]||'').toLowerCase()==='w')n*=10000;
  return n;
}
var GPT_IMAGE2_DEFAULT_PROMPT='这是一张 ** 中远海运集装箱运输有限公司（COSCO SHIPPING）** 的 PPT 封面图，整体风格为商务科技风：\n左侧文字信息区：左上角是 COSCO SHIPPING 的品牌 Logo，下方是公司全称 “中远海运集装箱运输有限公司” 及英文 “COSCO SHIPPING LINES CO., LTD.”；主标题为 “2026年 年度推广计划”，副标题为 “携融合启程，驭价值前行”，底部标注日期 “2026.11.11”；背景为浅灰白色，带有半透明点阵纹理，右侧有红蓝渐变的装饰线条。\n右侧视觉主图：画面主体是一艘大型集装箱货轮，船身为蓝红配色，甲板上堆满了五颜六色的集装箱，背景是橙色港口起重机与蓝色海面，呈现出专业的航运物流场景。\n底部辅助文字：右下角标注了品牌愿景 “创建世界一流的全球综合物流供应链服务生态”，整体色调以蓝白为主，搭配橙色点缀，干净大气，突出企业专业、国际化的形象。';
function isGptImage2App(cat,appId){
  return appId==='gpt-image-2'||(cat&&String(cat).indexOf('GPT Image')>=0);
}
function escAiwsTextarea(s){
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;');
}
function buildAiwsParamsForm(catKey,cat,appId){
  var key=catKey||'image';
  var upload=function(label,hint){
    return '<div class="app-image-ws-field"><label>'+label+'</label>'+
      '<div class="app-image-ws-upload" onclick="showToast(\'📤 上传功能演示\')">'+
      '<div class="app-image-ws-upload-icon">📤</div>'+
      '<div class="app-image-ws-upload-title">点击上传或拖拽文件</div>'+
      '<div class="app-image-ws-upload-hint">'+(hint||'支持 jpg / png / webp，≤10MB')+'</div></div></div>';
  };
  var prompt=function(label,ph,req){
    return '<div class="app-image-ws-field"><label>'+label+(req?' <span class="req">*</span>':'')+'</label>'+
      '<textarea placeholder="'+ph+'"></textarea></div>';
  };
  var ratios='<div class="app-image-ws-field"><label>图片比例</label><div class="app-image-ws-ratio-chips">'+
    ['1:1','3:4','4:3','16:9','9:16'].map(function(r,i){
      return '<button type="button" class="app-image-ws-ratio-chip'+(i===0?' active':'')+'" onclick="selectAiwsRatio(this)">'+r+'</button>';
    }).join('')+'</div></div>';
  var count='<div class="app-image-ws-field"><label>生成数量</label><select><option>1 张</option><option>2 张</option><option>4 张</option></select></div>';
  if(key==='face'){
    return upload('目标人脸','清晰正面照效果最佳')+upload('源图片','需要换脸的原始图片')+
      '<div class="app-image-ws-field"><label>融合强度</label><select><option>自然</option><option>标准</option><option>高保真</option></select></div>';
  }
  if(key==='tryon'){
    return upload('人物图片','全身或半身照')+upload('服装图片','平铺或模特图')+
      '<div class="app-image-ws-field"><label>试穿模式</label><select><option>上身</option><option>全身</option><option>连衣裙</option></select></div>';
  }
  if(key==='style'){
    return upload('原始图片')+
      '<div class="app-image-ws-field"><label>目标风格</label><select><option>油画</option><option>赛博朋克</option><option>水彩</option><option>动漫</option></select></div>'+
      '<div class="app-image-ws-field"><label>风格强度</label><select><option>轻度</option><option selected>标准</option><option>强烈</option></select></div>';
  }
  if(key==='tool'){
    var toolLabel=cat&&cat.indexOf('修复')>=0?'待修复图片':'待处理图片';
    return upload(toolLabel)+
      prompt('补充说明（可选）','描述需要修复或增强的区域…',false)+
      '<div class="app-image-ws-field"><label>输出清晰度</label><select><option>2K</option><option selected>4K</option></select></div>';
  }
  if(key==='video'){
    return upload('参考图片 / 首帧','支持 jpg / png，建议 16:9 或 9:16')+
      prompt('视频描述','描述镜头运动、场景与风格，例如：人物缓缓转头，电影级光效…',true)+
      '<div class="app-image-ws-field"><label>视频时长</label><select><option>5 秒</option><option selected>10 秒</option><option>15 秒</option></select></div>'+
      '<div class="app-image-ws-field"><label>输出分辨率</label><select><option>720P</option><option selected>1080P</option><option>4K</option></select></div>'+
      ratios;
  }
  if(key==='audio'){
    return prompt('配音文本','输入需要朗读或合成的文案内容…',true)+
      '<div class="app-image-ws-field"><label>音色</label><select><option>温柔女声</option><option selected>磁性男声</option><option>童声</option><option>新闻播报</option><option>多语种 EN</option></select></div>'+
      '<div class="app-image-ws-field"><label>语速</label><select><option>较慢</option><option selected>标准</option><option>较快</option></select></div>'+
      '<div class="app-image-ws-field"><label>情感风格</label><select><option>平静</option><option selected>自然</option><option>激昂</option><option>悲伤</option></select></div>';
  }
  if(isGptImage2App(cat,appId)){
    return '<div class="app-image-ws-field"><label>提示词 <span class="req">*</span></label>'+
      '<textarea id="aiws-gpt-prompt" rows="12">'+escAiwsTextarea(GPT_IMAGE2_DEFAULT_PROMPT)+'</textarea></div>'+
      ratios+count;
  }
  if(isOmniImage2App(cat,appId))return '';
  return prompt('正向提示词','描述你想生成的画面，例如：赛博朋克都市，霓虹灯光，电影质感…',true)+
    prompt('负向提示词','低质量，模糊，畸形，水印…',false)+
    ratios+count+
    '<div class="app-image-ws-field"><label>采样步数</label><select><option>20</option><option selected>30</option><option>50</option></select></div>';
}
window.selectAiwsRatio=function(btn){
  var wrap=btn&&btn.closest('.app-image-ws-ratio-chips');
  if(!wrap)return;
  wrap.querySelectorAll('.app-image-ws-ratio-chip').forEach(function(b){b.classList.remove('active');});
  btn.classList.add('active');
};
window.runAiwsApp=function(){
  var btn=document.getElementById('aiws-run-btn')||
    document.getElementById('aiws-side-run-btn')||
    document.getElementById('aiws-omni-run-btn')||
    document.getElementById('oiws-run-btn');
  if(!btn||btn.disabled)return;
  btn.disabled=true;
  var labelEl=btn.querySelector('.app-image-ws-run-label,.aiws-omni-run-label,.oiws-run-label');
  var oldLabel=labelEl?labelEl.textContent:'运行';
  var oldAria=btn.getAttribute('aria-label')||'运行';
  if(labelEl)labelEl.textContent='运行中…';
  btn.setAttribute('aria-label','运行中…');
  showToast('🚀 任务已提交：'+aiwsState.title);
  setTimeout(function(){
    btn.disabled=false;
    if(labelEl)labelEl.textContent=oldLabel;
    btn.setAttribute('aria-label',oldAria);
    showToast('✅ 生成完成（演示）');
  },2200);
};
function initAiwsTabs(){
  var modal=document.getElementById('app-image-workspace-modal');
  if(!modal||modal.dataset.aiwsBound)return;
  modal.dataset.aiwsBound='1';
  modal.querySelectorAll('.app-image-ws-main-tab').forEach(function(tab){
    tab.addEventListener('click',function(){
      var tabId=tab.getAttribute('data-aiws-main');
      if(tabId==='comments'){
        toggleAiwsComments();
        return;
      }
      switchAiwsMainTab(tabId);
    });
  });
}
function openAppImageWorkspace(p){
  p=p||{};
  if(typeof closeModal==='function')closeModal('oiws-result-modal');
  clearOiwsRunResultView();
  if(isShortDramaApp(p.cat,p.id,p.title)){
    openShortDramaWorkspace(p);
    return;
  }
  if(isKeyframesVideoApp(p.cat,p.id,p.title)){
    openKeyframesVideoWorkspace(p);
    return;
  }
  if(isEcommerceDigitalHumanApp(p.cat,p.id,p.title)){
    openEcommerceDigitalHumanWorkspace(p);
    return;
  }
  if(isSeedance20App(p.cat,p.id,p.title)){
    openSeedance20Workspace(p);
    return;
  }
  if(isHeartMulaApp(p.cat,p.id,p.title)){
    openHeartMulaWorkspace(p);
    return;
  }
  if(isLtx2DigitalHumanApp(p.cat,p.id,p.title)){
    openLtx2DigitalHumanWorkspace(p);
    return;
  }
  if(isVideoFaceSwapApp(p.cat,p.id,p.title)){
    openVideoFaceSwapWorkspace(p);
    return;
  }
  if(isMotionTransferApp(p.cat,p.id,p.title)){
    openMotionTransferWorkspace(p);
    return;
  }
  if(isCouplePostcardApp(p.cat,p.id,p.title)){
    openCouplePostcardWorkspace(p);
    return;
  }
  if(isFlux2WatermarkApp(p.cat,p.id,p.title)){
    openFlux2WatermarkWorkspace(p);
    return;
  }
  if(isEcommerceModelGenApp(p.cat,p.id,p.title)){
    openEcommerceModelGenWorkspace(p);
    return;
  }
  if(isEcommerceWhiteBgSceneApp(p.cat,p.id,p.title)){
    openEcommerceWhiteBgSceneWorkspace(p);
    return;
  }
  if(isEcommerceProductMultiangleApp(p.title,p.id)){
    openEcommerceProductMultiangleWorkspace(p);
    return;
  }
  if(isEcommerceDetailApp(p.cat,p.id,p.title)){
    openEcommerceDetailWorkspace(p);
    return;
  }
  if(isIndexTts2App(p.cat,p.id,p.title)){
    openIndexTts2Workspace(p);
    return;
  }
  if(isFaceSwapOutfitApp(p.title,p.id)){
    openFaceSwapOutfitWorkspace(p);
    return;
  }
  if(isFittingRoomApp(p.cat,p.id,p.title)){
    openFittingRoomWorkspace(p);
    return;
  }
  if(isVideoOutfitApp(p.cat,p.id,p.title)){
    openVideoOutfitWorkspace(p);
    return;
  }
  if(isVideoRecastApp(p.cat,p.id,p.title)){
    openVideoRecastWorkspace(p);
    return;
  }
  if(isCharacterReplaceApp(p.title,p.id)){
    openCharacterReplaceWorkspace(p);
    return;
  }
  if(isImageTo360PanoramaApp(p.title,p.id)){
    openImageTo360PanoramaWorkspace(p);
    return;
  }
  if(isOldPhotoTimeMachineApp(p.title,p.id)){
    openOldPhotoTimeMachineWorkspace(p);
    return;
  }
  if(isPersonModelApp(p.title,p.id)){
    openPersonModelWorkspace(p);
    return;
  }
  if(isOmniImage2App(p.title,p.id)){
    openOmniImage2Workspace(p);
    return;
  }
  initAiwsTabs();
  var catKey=p.catKey||'image';
  var title=p.title||'图片应用';
  aiwsState.liked=false;
  aiwsState.faved=false;
  aiwsState.followed=false;
  aiwsState.title=title;
  aiwsState.sharePayload={
    title:title,
    desc:p.desc||'',
    icon:p.icon||'🖼️',
    cat:p.cat||'应用',
    catKey:p.catKey||'image',
    gradient:p.gradient||'linear-gradient(135deg,#4c1d95,#1e3a8a)'
  };
  aiwsState.comments=(p.seedComments!==false)?AIWS_DEMO_COMMENTS.slice():[];
  var usesNum=parseUsesNum(p.uses);
  aiwsState.favCount=Math.max(8,Math.round(usesNum/700)||13);
  aiwsState.likeCount=Math.max(usesNum,Math.round(usesNum*1.2)||71);
  aiwsState.commentCount=aiwsState.comments.length;
  var rating=parseFloat(String(p.rating||'4.8'))||4.8;
  var successPct=typeof p.successRate==='number'?p.successRate:Math.min(99,Math.round(rating*20));
  var isMedia=isMediaAppWorkspace(catKey);
  var duration=typeof p.avgDurationSec==='number'?p.avgDurationSec:(catKey==='video'?91:catKey==='audio'?45:catKey==='tool'?72:catKey==='face'?95:112);
  if(typeof p.collectFav==='number')aiwsState.favCount=p.collectFav;
  if(p.likes)aiwsState.likeCount=parseUsesNum(p.likes)||aiwsState.likeCount;
  if(typeof p.collectComment==='number')aiwsState.commentCount=Math.max(p.collectComment,aiwsState.comments.length);
  var titleEl=document.getElementById('aiws-title');
  var descEl=document.getElementById('aiws-desc');
  var usesEl=document.getElementById('aiws-uses');
  if(!titleEl){
    showToast('⚠️ 工作区未加载，请刷新页面后重试');
    return;
  }
  titleEl.textContent=title;
  if(!p.introHtml&&!p.inputTips){
    p.inputTips='写清主体、风格与画面细节；可补充负向提示避免低质与水印';
  }
  setAiwsIntroContent(descEl,p);
  aiwsState.officialSamples=buildAiwsOfficialSamples(p);
  aiwsState.officialIndex=0;
  renderAiwsOfficialSample();
  var demoWorksAiws=(p.publicWorks&&p.publicWorks.length)?p.publicWorks:AIWS_DEMO_PUBLIC_WORKS;
  aiwsState.publicWorks=demoWorksAiws.map(function(w){return _oiwsNormalizePublicWork(Object.assign({},w));});
  renderAiwsPublicWorks();
  var usesText=String(p.uses||'').replace(/次使用/g,'').trim();
  if(usesEl)usesEl.textContent='👤 '+(usesText||'0')+' 次使用';
  var footerMeta=document.getElementById('aiws-footer-meta');
  if(footerMeta)footerMeta.textContent='评分 '+rating+' · '+successPct+'% 成功率';
  document.getElementById('aiws-tip-success').textContent='近期运行成功率为 '+successPct+'%';
  document.getElementById('aiws-tip-duration').textContent='平均运行时长在 '+duration+'s 左右';
  syncAiwsSideRunPrice(p.price||'⚡0.6');
  var previewEmoji=document.getElementById('aiws-preview-emoji');
  var previewPlay=document.getElementById('aiws-preview-play');
  if(previewEmoji)previewEmoji.textContent=p.icon||(catKey==='audio'?'🎙️':'🎬');
  if(previewPlay){
    previewPlay.classList.toggle('hidden',!isMedia||catKey==='audio');
    previewPlay.setAttribute('aria-hidden',(!isMedia||catKey==='audio')?'true':'false');
  }
  var stage=document.getElementById('aiws-preview-stage');
  if(stage){
    stage.style.background=p.gradient||'linear-gradient(135deg,#4c1d95,#1e3a8a)';
    stage.classList.toggle('is-media',isMedia);
    stage.classList.toggle('is-audio',catKey==='audio');
  }
  applyAiwsImageWorkspaceLayout(p,isMedia,catKey);
  var tags=(p.tags&&p.tags.length)?p.tags.slice():(AIWS_TAG_MAP[catKey]||['图像','AI']).slice();
  if(p.cat&&tags.indexOf(p.cat)<0)tags.unshift(p.cat);
  document.getElementById('aiws-tags').innerHTML=tags.map(function(t){
    return '<span class="app-image-ws-tag">'+t+'</span>';
  }).join('');
  document.getElementById('aiws-params-form').innerHTML=buildAiwsParamsForm(catKey,p.title||p.cat,p.id);
  var followBtn=document.getElementById('aiws-follow-btn');
  if(followBtn){
    followBtn.textContent='+ 关注';
    followBtn.classList.remove('followed');
  }
  renderAiwsCreator(p.id||'1',p.gradient,!!p.official);
  syncAiwsActionButtons();
  renderAiwsComments();
  syncAiwsTabCommentCount();
  switchAiwsMainTab('works');
  openModal('app-image-workspace-modal');
}

var ACWS_TAG_MAP={
  doc:['文案写作','智能生成','多场景模板'],
  summary:['长文摘要','要点提炼','PDF解析']
};
var acwsState={
  title:'',liked:false,faved:false,followed:false,
  likeCount:0,favCount:0,commentCount:0,comments:[],sharePayload:null
};
function isAcwsCommentsOpen(){
  var modal=document.getElementById('app-copy-workspace-modal');
  if(!modal)return false;
  var panel=modal.querySelector('[data-acws-main-panel="comments"]');
  return !!(panel&&!panel.classList.contains('hidden'));
}
function switchAcwsMainTab(tabId){
  var modal=document.getElementById('app-copy-workspace-modal');
  if(!modal)return;
  modal.querySelectorAll('.app-image-ws-main-tab').forEach(function(t){
    t.classList.toggle('active',t.getAttribute('data-acws-main')===tabId);
  });
  modal.querySelectorAll('[data-acws-main-panel]').forEach(function(p){
    p.classList.toggle('hidden',p.getAttribute('data-acws-main-panel')!==tabId);
  });
  syncAcwsActionButtons();
}
function syncAcwsActionButtons(){
  var likeBtn=document.getElementById('acws-like-btn');
  var favBtn=document.getElementById('acws-fav-btn');
  var likeCountEl=document.getElementById('acws-like-count');
  var favCountEl=document.getElementById('acws-fav-count');
  var commentCountEl=document.getElementById('acws-comment-count');
  if(likeCountEl)likeCountEl.textContent=String(acwsState.likeCount);
  if(favCountEl)favCountEl.textContent=String(acwsState.favCount);
  if(commentCountEl)commentCountEl.textContent=String(acwsState.commentCount);
  if(likeBtn){
    likeBtn.classList.toggle('active',acwsState.liked);
    likeBtn.setAttribute('aria-pressed',acwsState.liked?'true':'false');
  }
  if(favBtn){
    favBtn.classList.toggle('faved',acwsState.faved);
    favBtn.classList.toggle('active',acwsState.faved);
    favBtn.setAttribute('aria-pressed',acwsState.faved?'true':'false');
    var favIcon=favBtn.querySelector('.app-image-ws-action-icon');
    if(favIcon)favIcon.textContent=acwsState.faved?'★':'☆';
  }
  var commentBtn=document.getElementById('acws-comment-btn');
  var commentsOpen=isAcwsCommentsOpen();
  if(commentBtn){
    commentBtn.classList.toggle('active',commentsOpen);
    commentBtn.setAttribute('aria-pressed',commentsOpen?'true':'false');
    commentBtn.setAttribute('aria-expanded',commentsOpen?'true':'false');
  }
}
function renderAcwsComments(){
  var list=document.getElementById('acws-comment-list');
  var empty=document.getElementById('acws-comment-empty');
  if(!list)return;
  if(!acwsState.comments.length){
    if(empty)empty.style.display='';
    list.querySelectorAll('.app-image-ws-comment-item').forEach(function(el){el.remove();});
    return;
  }
  if(empty)empty.style.display='none';
  list.querySelectorAll('.app-image-ws-comment-item').forEach(function(el){el.remove();});
  acwsState.comments.forEach(function(c){
    var item=document.createElement('article');
    item.className='app-image-ws-comment-item';
    item.innerHTML='<div class="app-image-ws-comment-meta"><strong>'+c.user+'</strong><span>'+c.time+'</span></div>'+
      '<div class="app-image-ws-comment-body">'+c.text.replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</div>';
    list.appendChild(item);
  });
}
function renderAcwsCreator(appId,gradient,isOfficial){
  var creator=isOfficial?AIWS_CREATORS[0]:getAppCreator(appId);
  var avatar=document.getElementById('acws-avatar');
  var emojiEl=document.getElementById('acws-avatar-emoji');
  var nameEl=document.getElementById('acws-creator-name');
  if(avatar)avatar.style.background=gradient||creator.gradient;
  if(emojiEl)emojiEl.textContent=creator.emoji;
  if(nameEl)nameEl.textContent=creator.name;
}
function buildAcwsParamsForm(title){
  var isSummary=String(title||'').indexOf('摘要')>=0;
  var field=function(label,inner){return '<div class="app-image-ws-field"><label>'+label+'</label>'+inner+'</div>';};
  var textarea=function(label,ph,req){
    return field(label+(req?' <span class="req">*</span>':''),'<textarea placeholder="'+ph+'"></textarea>');
  };
  var upload=function(label,hint){
    return field(label,'<div class="app-image-ws-upload" onclick="showToast(\'📤 上传功能演示\')">'+
      '<div class="app-image-ws-upload-icon">📎</div>'+
      '<div class="app-image-ws-upload-title">点击上传或粘贴链接</div>'+
      '<div class="app-image-ws-upload-hint">'+(hint||'支持 txt / docx / pdf，≤20MB')+'</div></div>');
  };
  if(isSummary){
    return upload('原文 / 文档','支持 PDF、Word、网页链接')+
      field('摘要长度','<select><option>简短 · 3-5 条要点</option><option selected>标准 · 分段摘要</option><option>详细 · 含引用与结论</option></select>')+
      field('输出语言','<select><option selected>简体中文</option><option>English</option></select>');
  }
  return textarea('写作需求','描述产品、受众、核心卖点与希望强调的信息…',true)+
    field('文案类型','<select><option>营销软文</option><option>产品详情</option><option selected>社媒短文案</option><option>品牌故事</option><option>活动邮件</option><option>新闻稿</option></select>')+
    field('语气风格','<select><option>专业正式</option><option selected>亲切自然</option><option>幽默活泼</option><option>高端质感</option><option>热血励志</option></select>')+
    field('目标字数','<select><option>约 200 字</option><option selected>约 500 字</option><option>约 1000 字</option><option>约 2000 字</option></select>')+
    upload('参考素材（可选）','可上传竞品文案、产品资料等');
}
function getAcwsDraftSample(title){
  if(String(title||'').indexOf('摘要')>=0){
    return '<h3>文档摘要</h3><p><strong>核心结论：</strong>本报告围绕 AI 内容生产效率展开，重点比较了模板化写作与对话式写作在营销场景下的转化差异。</p>'+
      '<ol><li>模板化适合高频短文案，平均节省 62% 撰写时间；</li><li>对话式更适合复杂长文，需配合明确大纲；</li><li>建议采用「大纲确认 → 分段生成 → 人工润色」三步流程。</li></ol>'+
      '<p><strong>待跟进：</strong>补充 A/B 测试数据与 2 个竞品案例引用。</p>';
  }
  return '<h3>春季新品上市 · 种草文案</h3><p>当第一缕春光落在肩头，我们也为日常准备了一点轻盈的惊喜。全新系列以「少即是轻」为理念，兼顾舒适与质感，让通勤与周末都能一套搞定。</p>'+
    '<p><strong>核心卖点：</strong></p><ul><li>亲肤面料，全天透气不闷；</li><li>模块化设计，三件组合五种穿法；</li><li>限定配色，线上线下同步首发。</li></ul>'+
    '<p>现在下单享早鸟礼遇，邀请好友同行还可叠加专属折扣。把春天穿身上，从此刻开始。</p>';
}
function updateAcwsWordCount(html){
  var el=document.getElementById('acws-word-count');
  if(!el)return;
  var text=String(html||'').replace(/<[^>]+>/g,'').replace(/\s+/g,'');
  el.textContent='约 '+text.length+' 字';
}
window.toggleAcwsLike=function(){
  acwsState.liked=!acwsState.liked;
  acwsState.likeCount+=acwsState.liked?1:-1;
  if(acwsState.likeCount<0)acwsState.likeCount=0;
  syncAcwsActionButtons();
  showToast(acwsState.liked?'👍 已点赞':'已取消点赞');
};
window.toggleAcwsFav=function(){
  acwsState.faved=!acwsState.faved;
  acwsState.favCount+=acwsState.faved?1:-1;
  if(acwsState.favCount<0)acwsState.favCount=0;
  syncAcwsActionButtons();
  showToast(acwsState.faved?'⭐ 已收藏':'已取消收藏');
};
window.shareAcwsApp=function(){
  if(typeof openMyworksShare==='function'){
    openMyworksShare({ stacked: true });
    return;
  }
  openGuidSharePage(acwsState.sharePayload||{title:acwsState.title});
};
window.toggleAcwsFollow=function(){
  acwsState.followed=!acwsState.followed;
  var btn=document.getElementById('acws-follow-btn');
  if(btn){
    btn.textContent=acwsState.followed?'已关注':'+ 关注';
    btn.classList.toggle('followed',acwsState.followed);
  }
  showToast(acwsState.followed?'✅ 已关注 '+document.getElementById('acws-creator-name')?.textContent:'👋 取消关注');
};
window.toggleAcwsComments=function(){
  if(isAcwsCommentsOpen()){switchAcwsMainTab('samples');return;}
  switchAcwsMainTab('comments');
  var input=document.getElementById('acws-comment-input');
  if(input)setTimeout(function(){input.focus();},50);
};
window.postAcwsComment=function(){
  var input=document.getElementById('acws-comment-input');
  if(!input)return;
  var text=input.value.trim();
  if(!text){showToast('请输入评论内容');return;}
  acwsState.comments.unshift({user:'我',time:'刚刚',text:text});
  acwsState.commentCount+=1;
  input.value='';
  syncAcwsActionButtons();
  renderAcwsComments();
  showToast('💬 评论已发布');
};
window.copyAcwsDraft=function(){
  var draft=document.getElementById('acws-draft-preview');
  if(!draft){showToast('暂无内容');return;}
  var text=draft.innerText||draft.textContent||'';
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(function(){showToast('✅ 已复制全文');}).catch(function(){showToast('复制失败');});
  }else{showToast('✅ 已复制（演示）');}
};
function initAcwsTabs(){
  var modal=document.getElementById('app-copy-workspace-modal');
  if(!modal||modal.dataset.acwsBound)return;
  modal.dataset.acwsBound='1';
  var draft=document.getElementById('acws-draft-preview');
  if(draft&&!draft.dataset.acwsInputBound){
    draft.dataset.acwsInputBound='1';
    draft.addEventListener('input',function(){
      updateAcwsWordCount(draft.innerHTML);
    });
  }
  modal.querySelectorAll('.app-image-ws-main-tab').forEach(function(tab){
    tab.addEventListener('click',function(){
      var tabId=tab.getAttribute('data-acws-main');
      if(tabId==='comments'){toggleAcwsComments();return;}
      switchAcwsMainTab(tabId);
    });
  });
}
window.runAcwsApp=function(){
  var btn=document.getElementById('acws-run-btn');
  if(!btn||btn.disabled)return;
  btn.disabled=true;
  var labelEl=btn.querySelector('.app-image-ws-run-label');
  var oldLabel=labelEl?labelEl.textContent:'生成文案';
  var oldAria=btn.getAttribute('aria-label')||'生成文案';
  if(labelEl)labelEl.textContent='生成中…';
  btn.setAttribute('aria-label','生成中…');
  showToast('🚀 正在生成：'+acwsState.title);
  setTimeout(function(){
    btn.disabled=false;
    if(labelEl)labelEl.textContent=oldLabel;
    btn.setAttribute('aria-label',oldAria);
    var html=getAcwsDraftSample(acwsState.title);
    var draft=document.getElementById('acws-draft-preview');
    if(draft){draft.innerHTML=html;updateAcwsWordCount(html);}
    showToast('✅ 文案已生成');
  },1800);
};
function openAppCopyWorkspace(p){
  initAcwsTabs();
  p=p||{};
  var title=p.title||'文案应用';
  var isSummary=String(title).indexOf('摘要')>=0;
  acwsState.liked=false;
  acwsState.faved=false;
  acwsState.followed=false;
  acwsState.title=title;
  acwsState.sharePayload={
    title:title,desc:p.desc||'',icon:p.icon||'📄',cat:p.cat||'文档',
    catKey:'doc',gradient:p.gradient||'linear-gradient(135deg,#1e40af,#3730a3)'
  };
  acwsState.comments=[];
  var usesNum=parseUsesNum(p.uses);
  acwsState.favCount=Math.max(8,Math.round(usesNum/700)||13);
  acwsState.likeCount=Math.max(usesNum,Math.round(usesNum*1.15)||71);
  acwsState.commentCount=0;
  var rating=parseFloat(String(p.rating||'4.8'))||4.8;
  var successPct=Math.min(99,Math.round(rating*20));
  var duration=isSummary?28:45;
  var titleEl=document.getElementById('acws-title');
  if(!titleEl){showToast('⚠️ 文案工作区未加载，请刷新页面');return;}
  titleEl.textContent=title;
  var descEl=document.getElementById('acws-desc');
  if(descEl)descEl.textContent=p.desc||'';
  var usesEl=document.getElementById('acws-uses');
  if(usesEl){
    var usesText=String(p.uses||'').replace(/次使用/g,'').trim();
    usesEl.textContent='👤 '+(usesText||'0')+' 次使用';
  }
  document.getElementById('acws-tip-success').textContent='近期运行成功率为 '+successPct+'%';
  document.getElementById('acws-tip-duration').textContent='平均生成时长在 '+duration+'s 左右';
  document.getElementById('acws-run-price').textContent=p.price||'⚡0.3';
  var footerMeta=document.getElementById('acws-footer-meta');
  if(footerMeta)footerMeta.textContent='评分 '+rating+' · '+successPct+'% 成功率';
  var tags=(isSummary?ACWS_TAG_MAP.summary:ACWS_TAG_MAP.doc).slice();
  if(p.cat&&tags.indexOf(p.cat)<0)tags.unshift(p.cat);
  document.getElementById('acws-tags').innerHTML=tags.map(function(t){
    return '<span class="app-image-ws-tag">'+t+'</span>';
  }).join('');
  document.getElementById('acws-params-form').innerHTML=buildAcwsParamsForm(title);
  var followBtn=document.getElementById('acws-follow-btn');
  if(followBtn){followBtn.textContent='+ 关注';followBtn.classList.remove('followed');}
  renderAcwsCreator(p.id||'15',p.gradient,!!p.official);
  var draft=document.getElementById('acws-draft-preview');
  if(draft){
    draft.innerHTML='<p class="app-copy-ws-draft-placeholder">填写左侧写作需求，点击底部「生成文案」后，AI 将在此输出可编辑文稿。</p>';
    updateAcwsWordCount('');
  }
  syncAcwsActionButtons();
  renderAcwsComments();
  switchAcwsMainTab('samples');
  openModal('app-copy-workspace-modal');
}
window.openAppTemplateModal=function(cat,icon,title,desc,price,uses,rating,extra){
  extra=extra||{};
  var payload={
    cat:cat,icon:icon,title:title,desc:desc,price:price,uses:uses,rating:rating,
    catKey:extra.catKey,gradient:extra.gradient,id:extra.id,official:extra.official,
    introHtml:extra.introHtml,inputTips:extra.inputTips,tags:extra.tags,
    successRate:extra.successRate,avgDurationSec:extra.avgDurationSec,
    officialSamples:extra.officialSamples,collectFav:extra.collectFav,collectComment:extra.collectComment,
    likes:extra.likes,defaultPrompt:extra.defaultPrompt,defaultCopy:extra.defaultCopy,
    songTheme:extra.songTheme,songGenre:extra.songGenre,songLanguage:extra.songLanguage,
    defaultVoiceText:extra.defaultVoiceText,defaultEmotion:extra.defaultEmotion,defaultPlot:extra.defaultPlot,
    worksCount:extra.worksCount,commentTabCount:extra.commentTabCount,
    creatorName:extra.creatorName,creatorDate:extra.creatorDate,
    publicWorks:extra.publicWorks
  };
  if(isCopyAppWorkspace(payload.catKey)){
    openAppCopyWorkspace(payload);
    return;
  }
  if(isImageAppWorkspace(cat,payload.catKey)){
    openAppImageWorkspace(payload);
    return;
  }
  document.getElementById('atm-title').textContent=icon+' '+title+'模板';
  document.getElementById('atm-preview').innerHTML='<div class="w-28 h-28 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center text-gray-400 text-[10px] text-center leading-relaxed">原图</div><div class="text-lg text-gray-400">→</div><div class="w-28 h-28 bg-gradient-to-br from-purple-200 to-blue-200 dark:from-purple-800/30 dark:to-blue-800/30 rounded-lg flex items-center justify-center text-gray-400 text-[10px] text-center leading-relaxed">生成效果</div>';
  document.getElementById('atm-desc').innerHTML=desc+'<div class="mt-2 text-[10px] text-gray-400">⚙️ 使用步骤：<br>1. 上传素材图片<br>2. 等待AI处理<br>3. 下载生成结果</div>';
  document.getElementById('atm-price').textContent=price+'/次';
  document.getElementById('atm-uses').textContent='📊 使用数据: '+uses;
  document.getElementById('atm-rating').textContent='👍 '+rating;
  document.getElementById('atm-creator').textContent='👤 创作者: 平台官方';
  var up1=document.getElementById('atm-up1-label');
  var up2=document.getElementById('atm-up2-label');
  if(cat==='换脸'){up1.textContent='上传人脸';up2.textContent='上传源图';}
  else if(cat==='换装'){up1.textContent='上传人物图';up2.textContent='上传服装图';}
  else if(cat==='风格'){up1.textContent='上传图片';up2.textContent='选择风格▼';}
  else if(cat==='背景替换'){up1.textContent='上传图片';up2.textContent='选择背景▼';}
  else if(cat==='修复'){up1.textContent='上传图片';up2.textContent='上传参考图';}
  openModal('app-template-modal');
};
// ===== Apps iframe 与父页通信（独立 apps.html）=====
window.syncAppsIframeLayout=function(){
  var iframe=document.getElementById('apps-iframe');
  if(!iframe)return;
  var bottom=typeof getMobileBottomNavOffset==='function'?getMobileBottomNavOffset():0;
  iframe.style.height=Math.max(480,window.innerHeight-56-bottom)+'px';
};
window.addEventListener('message',function(e){
  if(!e.data)return;
  if(e.data.type==='guid-share'){
    if(e.data.action==='close'&&typeof closeGuidSharePage==='function')closeGuidSharePage();
    else if(e.data.action==='toast'&&e.data.message&&typeof showToast==='function')showToast(e.data.message);
    return;
  }
  if(e.data.type!=='guid-apps')return;
  var action=e.data.action;
  var p=e.data.payload||{};
  if(action==='openTemplate'&&typeof openAppTemplateModal==='function'){
    openAppTemplateModal(p.cat,p.icon,p.title,p.desc,p.price,p.uses,p.rating,{
      catKey:p.catKey,gradient:p.gradient,id:p.id,official:p.official,
      introHtml:p.introHtml,inputTips:p.inputTips,tags:p.tags,
      successRate:p.successRate,avgDurationSec:p.avgDurationSec,
      officialSamples:p.officialSamples,collectFav:p.collectFav,collectComment:p.collectComment,
      likes:p.likes,defaultPrompt:p.defaultPrompt,
      defaultVoiceText:p.defaultVoiceText,defaultEmotion:p.defaultEmotion,defaultPlot:p.defaultPlot,
      worksCount:p.worksCount,commentTabCount:p.commentTabCount,
      creatorName:p.creatorName,creatorDate:p.creatorDate,
      publicWorks:p.publicWorks
    });
  }else if(action==='toast'&&p.message&&typeof showToast==='function'){
    showToast(p.message);
  }else if(action==='resize'){
    var iframe=document.getElementById('apps-iframe');
    if(iframe&&p.height){
      var bottom=typeof getMobileBottomNavOffset==='function'?getMobileBottomNavOffset():0;
      var h=Math.min(p.height+32,window.innerHeight-56-bottom);
      iframe.style.height=Math.max(480,h)+'px';
    }
  }
});
window.addEventListener('resize',function(){
  if(typeof syncMobileBottomNav==='function'){
    syncMobileBottomNav(typeof getActivePageId==='function'?getActivePageId():'homepage');
  }
  if(document.getElementById('page-apps')?.classList.contains('active')&&typeof syncAppsIframeLayout==='function'){
    syncAppsIframeLayout();
  }
});
// ===== Apps Tab切换（旧内联页，iframe 模式下无此元素）=====
document.querySelectorAll('.apps-tab').forEach(function(t){t.addEventListener('click',function(){pressAnim(this);document.querySelectorAll('.apps-tab').forEach(function(x){x.classList.remove('bg-blue-100','dark:bg-blue-900/30','text-blue-600');x.classList.add('bg-gray-100','dark:bg-gray-800');});this.classList.add('bg-blue-100','dark:bg-blue-900/30','text-blue-600');this.classList.remove('bg-gray-100','dark:bg-gray-800');showToast('🔀 切换到「'+this.textContent.trim()+'」');});});
// ===== 作品编辑/删除功能 =====
window.openNewWork=function(){
  openModal('publish-modal');
};
window.submitPublish=function(){
  var title=document.getElementById('pub-title')?.value.trim()||'未命名作品';
  closeModal('publish-modal');
  // 发布成功弹窗
  var div=document.createElement('div');div.className='modal-overlay open';div.id='publish-success-modal';
  div.innerHTML='<div class="modal-content p-5" style="max-width:420px"><div class="text-center mb-4"><div class="text-3xl mb-2">✅</div><div class="text-base font-bold mb-1">发布成功</div><div class="text-xs text-gray-500">作品「'+title+'」已成功发布！</div></div><div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2.5 text-[10px] text-blue-700 dark:text-blue-300 mb-4 leading-relaxed">💡 提示：<br>• 作品正在审核中，审核通过后将在灵感广场展示<br>• 你可以随时在我的作品中编辑或下架此作品</div><div class="flex gap-2"><button onclick="closeModal(\'publish-success-modal\')" class="flex-1 py-2 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600">查看作品</button><button onclick="closeModal(\'publish-success-modal\');openNewWork()" class="flex-1 py-2 text-xs border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">继续发布</button></div></div>';
  document.body.appendChild(div);
};
window.openEditWork=function(name){
  document.getElementById('ew-title').value=name;
  openModal('edit-work-modal');
};
window.saveEditWork=function(){
  var vis=document.querySelector('input[name="ew-vis"]:checked');
  var isPublic=vis?vis.value==='on'||document.querySelectorAll('input[name="ew-vis"]')[0].checked:true;
  var title=document.getElementById('ew-title').value;
  closeModal('edit-work-modal');
  showToast(isPublic?'✅ 作品「'+title+'」已发布 — 已设置为公开分享，现在所有人可见':'✅ 作品「'+title+'」已下架 — 已设置为仅自己可见，已从灵感广场移除');
};
window.openDeleteWork=function(name){
  document.getElementById('dw-title').textContent=name;
  openModal('delete-work-modal');
};
window.confirmDeleteWork=function(){
  var name=document.getElementById('dw-title').textContent;
  closeModal('delete-work-modal');
  showToast('🗑️ 作品「'+name+'」已永久删除');
};
function getAssetImportTextarea(){
  if(assetPickTarget&&assetPickTarget.page==='audio'){
    return document.getElementById('audio-prompt-textarea');
  }
  if(assetPickTarget&&assetPickTarget.page==='chat'){
    return document.getElementById('chat-input');
  }
  var audioPage=document.getElementById('page-audio');
  if(audioPage&&audioPage.classList.contains('active')){
    return document.getElementById('audio-prompt-textarea');
  }
  var chatPage=document.getElementById('page-chat');
  if(chatPage&&chatPage.classList.contains('active')){
    return document.getElementById('chat-input');
  }
  return document.querySelector('.page-section.active textarea');
}

function applyImportedTextToTextarea(ta,parts){
  if(!ta||!parts||!parts.length) return false;
  var joined=parts.join('\n\n');
  var prev=(ta.value||'').trim();
  ta.value=prev?(prev+'\n\n'+joined):joined;
  ta.dispatchEvent(new Event('input',{bubbles:true}));
  ta.focus();
  try{
    var len=ta.value.length;
    ta.setSelectionRange(len,len);
  }catch(e){}
  return true;
}

window.importTextAsset=function(name,text){
  closeModal('asset-modal');
  var ta=getAssetImportTextarea();
  if(ta&&text){
    applyImportedTextToTextarea(ta,[text]);
    showToast('✅ 已导入文本资产 — 「'+name+'」');
  }else showToast('📥 已导入文本');
};
window.selectAudioAsset=function(name,assetId,ev){
  var el=ev&&ev.currentTarget?ev.currentTarget.closest('.asset-audio-item'):document.querySelector('#asset-tab-audio [data-name="'+name+'"]');
  if(el) toggleAssetRecord(el,'audio',ev||(typeof event!=='undefined'?event:null));
};
function formatVoiceDuration(sec){
  var s=Math.max(0,Math.floor(sec||0));
  return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
}

window._voiceCloneRecordState={active:false,recorder:null,stream:null,chunks:[],timer:null,seconds:0,simulateIv:null};

window.openVoiceCloneModal=function(){
  if(typeof stopVoiceCloneRecording==='function') stopVoiceCloneRecording(true);
  window._voiceCloneRecordState.seconds=0;
  window._voiceCloneRecordState.chunks=[];
  if(typeof resetVoiceRecordButton==='function') resetVoiceRecordButton();
  ['voice-upload-progress','voice-upload-done','voice-clone-progress','voice-clone-success'].forEach(function(id){
    var el=document.getElementById(id);
    if(el) el.classList.add('hidden');
  });
  var row=document.getElementById('voice-source-row');
  if(row) row.classList.remove('hidden');
  var startBtn=document.getElementById('voice-start-clone');
  if(startBtn){
    startBtn.disabled=false;
    startBtn.textContent='开始克隆';
    startBtn.classList.remove('hidden');
  }
  ['voice-upload-bar','voice-clone-bar'].forEach(function(id){
    var el=document.getElementById(id);
    if(el) el.style.width='0%';
  });
  ['voice-upload-pct','voice-clone-pct'].forEach(function(id){
    var el=document.getElementById(id);
    if(el) el.textContent='0%';
  });
  var nameInput=document.getElementById('voice-name-input');
  if(nameInput) nameInput.value='';
  openModal('voice-clone-modal');
};

window.resetVoiceRecordButton=function(){
  var btn=document.getElementById('voice-record-btn');
  var icon=document.getElementById('voice-record-icon');
  var label=document.getElementById('voice-record-label');
  var hint=document.getElementById('voice-record-hint');
  var timer=document.getElementById('voice-record-timer');
  if(btn){btn.classList.remove('is-recording');btn.disabled=false;}
  if(icon)icon.textContent='🎙️';
  if(label)label.textContent='点击开始录音';
  if(hint){hint.classList.remove('hidden');hint.innerHTML='使用麦克风录制<br>建议 10-60 秒';}
  if(timer)timer.classList.add('hidden');
};

window.stopVoiceCloneRecording=function(silent){
  var st=window._voiceCloneRecordState;
  if(st.timer){clearInterval(st.timer);st.timer=null;}
  if(st.simulateIv){clearInterval(st.simulateIv);st.simulateIv=null;}
  if(st.recorder&&st.recorder.state!=='inactive'){
    try{st.recorder.stop();}catch(e){}
  }else if(st.stream){
    st.stream.getTracks().forEach(function(t){t.stop();});
    st.stream=null;
  }
  st.active=false;
  window.resetVoiceRecordButton();
  if(!silent) return st.seconds;
  return st.seconds;
};

window.finishVoiceCloneAudioSource=function(fileLabel,durationSec){
  if(typeof stopVoiceCloneRecording==='function') stopVoiceCloneRecording(true);
  var row=document.getElementById('voice-source-row');
  var progress=document.getElementById('voice-upload-progress');
  var done=document.getElementById('voice-upload-done');
  if(row) row.classList.add('hidden');
  if(progress) progress.classList.add('hidden');
  if(done){
    done.classList.remove('hidden');
    var info=document.getElementById('voice-file-info');
    var dur=formatVoiceDuration(durationSec);
    if(info) info.textContent='文件：'+fileLabel+' ｜ 时长：'+dur;
    var wave=done.querySelector('.h-12');
    if(wave) wave.innerHTML='<span>🔊 音频波形预览  ▶ 0:00 / '+dur+'</span>';
  }
};

window.startVoiceUpload=function(){
  if(typeof stopVoiceCloneRecording==='function') stopVoiceCloneRecording(true);
  var row=document.getElementById('voice-source-row');
  var progress=document.getElementById('voice-upload-progress');
  if(row) row.classList.add('hidden');
  if(progress) progress.classList.remove('hidden');
  var bar=document.getElementById('voice-upload-bar');
  var pct=document.getElementById('voice-upload-pct');
  var nameEl=document.getElementById('voice-upload-name');
  var p=0;
  var iv=setInterval(function(){p+=Math.floor(Math.random()*12)+5;if(p>=100){p=100;clearInterval(iv);if(bar) bar.style.width='100%';if(pct)pct.textContent='100%';if(nameEl)nameEl.textContent='✅ 上传完成：「my_voice.mp3」';setTimeout(function(){finishVoiceCloneAudioSource('my_voice.mp3',35);},500);}else{if(bar)bar.style.width=p+'%';if(pct)pct.textContent=p+'%';if(nameEl)nameEl.textContent='正在上传音频文件... '+p+'%';}},200);
};

window._onVoiceCloneRecordStop=function(){
  var st=window._voiceCloneRecordState;
  if(st.timer){clearInterval(st.timer);st.timer=null;}
  st.active=false;
  var secs=st.seconds||0;
  var label='voice_record.webm';
  if(st.chunks&&st.chunks.length){
    try{
      var blob=new Blob(st.chunks,{type:st.recorder&&st.recorder.mimeType?st.recorder.mimeType:'audio/webm'});
      label=blob.size>0?'voice_record.webm':'voice_record.webm';
      st.audioBlob=blob;
    }catch(e){}
  }
  if(st.stream){
    st.stream.getTracks().forEach(function(t){t.stop();});
    st.stream=null;
  }
  st.recorder=null;
  st.chunks=[];
  st.active=false;
  window.resetVoiceRecordButton();
  if(secs<1){
    showToast('⚠️ 录音时间过短，请重新录制');
    return;
  }
  var row=document.getElementById('voice-source-row');
  var progress=document.getElementById('voice-upload-progress');
  if(row) row.classList.add('hidden');
  if(progress){
    progress.classList.remove('hidden');
    var nameEl=document.getElementById('voice-upload-name');
    if(nameEl) nameEl.textContent='正在处理录音...';
    var bar=document.getElementById('voice-upload-bar');
    var pct=document.getElementById('voice-upload-pct');
    var p=0;
    var iv=setInterval(function(){
      p+=Math.floor(Math.random()*15)+8;
      if(p>=100){
        p=100;clearInterval(iv);
        if(bar)bar.style.width='100%';
        if(pct)pct.textContent='100%';
        setTimeout(function(){finishVoiceCloneAudioSource(label,secs);},400);
      }else{
        if(bar)bar.style.width=p+'%';
        if(pct)pct.textContent=p+'%';
      }
    },120);
  }else{
    finishVoiceCloneAudioSource(label,secs);
  }
};

window.startVoiceCloneRecording=function(){
  if(typeof stopVoiceCloneRecording==='function') stopVoiceCloneRecording(true);
  var st=window._voiceCloneRecordState;
  st.seconds=0;
  st.chunks=[];
  var btn=document.getElementById('voice-record-btn');
  var icon=document.getElementById('voice-record-icon');
  var label=document.getElementById('voice-record-label');
  var hint=document.getElementById('voice-record-hint');
  var timer=document.getElementById('voice-record-timer');
  var useReal=!!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia&&window.MediaRecorder);
  function beginCapture(){
    st.active=true;
    if(btn){btn.classList.add('is-recording');btn.disabled=false;}
    if(icon)icon.textContent='⏹️';
    if(label)label.textContent='点击停止录音';
    if(hint)hint.classList.add('hidden');
    if(timer){timer.classList.remove('hidden');timer.textContent='00:00';}
    st.timer=setInterval(function(){
      st.seconds+=1;
      if(timer) timer.textContent=formatVoiceDuration(st.seconds);
      if(st.seconds>=60){
        showToast('⏱️ 已达 60 秒，自动结束录音');
        window.stopVoiceCloneRecording(false);
        window._onVoiceCloneRecordStop();
      }
    },1000);
  }
  if(!useReal){
    beginCapture();
    showToast('🎙️ 开始录音（演示模式）');
    return;
  }
  navigator.mediaDevices.getUserMedia({audio:true}).then(function(stream){
    st.stream=stream;
    var mime=MediaRecorder.isTypeSupported('audio/webm;codecs=opus')?'audio/webm;codecs=opus':(MediaRecorder.isTypeSupported('audio/webm')?'audio/webm':'');
    var rec=mime?new MediaRecorder(stream,{mimeType:mime}):new MediaRecorder(stream);
    st.recorder=rec;
    rec.ondataavailable=function(e){if(e.data&&e.data.size>0) st.chunks.push(e.data);};
    rec.onstop=function(){window._onVoiceCloneRecordStop();};
    rec.onerror=function(){showToast('⚠️ 录音失败');window.stopVoiceCloneRecording(true);};
    try{
      rec.start(200);
      beginCapture();
      showToast('🎙️ 开始录音，点击停止结束');
    }catch(err){
      stream.getTracks().forEach(function(t){t.stop();});
      showToast('⚠️ 无法启动录音');
    }
  }).catch(function(){
    beginCapture();
    showToast('🎙️ 开始录音（演示模式）');
  });
};

window.toggleVoiceCloneRecording=function(e){
  if(e){e.preventDefault();e.stopPropagation();}
  var st=window._voiceCloneRecordState;
  if(st.active){
    if(st.recorder&&st.recorder.state==='recording'){
      try{st.recorder.stop();}catch(err){window._onVoiceCloneRecordStop();}
    }else{
      if(st.timer){clearInterval(st.timer);st.timer=null;}
      st.active=false;
      window._onVoiceCloneRecordStop();
    }
    return;
  }
  window.startVoiceCloneRecording();
};

window.startVoiceClone=function(){
  var uploadDone=document.getElementById('voice-upload-done');
  if(!uploadDone||uploadDone.classList.contains('hidden')){showToast('⚠️ 请先上传或录制音频');return;}
  var name=document.getElementById('voice-name-input')?.value.trim()||'我的专属音色';
  closeModal('voice-clone-modal');
  showToast('⏳ 正在克隆音色「'+name+'」...');
  var p=0;
  var iv=setInterval(function(){
    p+=Math.floor(Math.random()*8)+3;
    if(p>=100){
      p=100;
      clearInterval(iv);
      var entry=typeof addAudioVoiceToCatalog==='function'?addAudioVoiceToCatalog({name:name,category:'我的音色',hyper:true,custom:true}):null;
      if(entry&&typeof selectAudioVoice==='function') selectAudioVoice(entry.id,{closeModal:false,toast:false});
      else if(typeof syncVoiceSelectHidden==='function') syncVoiceSelectHidden('custom-'+Date.now(),name);
      if(typeof updateAudioVoicePickerButton==='function') updateAudioVoicePickerButton(entry||{name:name});
      showToast('✅ 音色「'+name+'」已创建，可在「选择音色」中使用');
    }
  },300);
};
// ===== 资产库功能 =====
var assetPickTarget=null;
var assetSelected=[];
let userAssetLibrary=[];
const ASSET_STORAGE_KEY='guidai_user_assets';

function escapeAssetHtml(str){
  return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
}

function getActiveAssetTab(){
  var tabs=['image','video','text','audio'];
  for(var i=0;i<tabs.length;i++){
    var pane=document.getElementById('asset-tab-'+tabs[i]);
    if(pane&&!pane.classList.contains('hidden')) return tabs[i];
  }
  return 'image';
}

function formatAssetDate(d){
  var dt=d?new Date(d):new Date();
  return dt.getFullYear()+'-'+String(dt.getMonth()+1).padStart(2,'0')+'-'+String(dt.getDate()).padStart(2,'0');
}

var ASSET_TAB_DATE_LAYOUT={
  image:{tabId:'asset-tab-image',listId:'asset-image-list',itemSel:'.asset-img-item',bodyClass:'grid grid-cols-4 gap-2'},
  video:{tabId:'asset-tab-video',listId:'asset-video-list',itemSel:'.asset-video-item',bodyClass:'grid grid-cols-4 gap-2'},
  text:{tabId:'asset-tab-text',listId:'asset-text-list',itemSel:'.asset-text-item',bodyClass:'space-y-1'},
  audio:{tabId:'asset-tab-audio',listId:'asset-audio-list',itemSel:'.asset-audio-item',bodyClass:'space-y-1'}
};

function getAssetRecordDate(el){
  if(!el) return '';
  var d=el.getAttribute('data-date')||el.dataset.date;
  if(d) return String(d).slice(0,10);
  var nodes=el.querySelectorAll('div,span');
  for(var i=0;i<nodes.length;i++){
    var cls=nodes[i].className||'';
    if(cls.indexOf('text-[9px]')===-1||cls.indexOf('text-gray-400')===-1) continue;
    var m=(nodes[i].textContent||'').trim().match(/\d{4}-\d{2}-\d{2}/);
    if(m) return m[0];
  }
  return '';
}

function formatAssetDateGroupLabel(dateStr){
  if(!dateStr) return '📅 更早';
  var today=formatAssetDate();
  var yd=new Date();
  yd.setDate(yd.getDate()-1);
  var yesterday=formatAssetDate(yd);
  if(dateStr===today) return '📅 今天';
  if(dateStr===yesterday) return '📅 昨天';
  return '📅 '+dateStr;
}

function compareAssetDatesDesc(a,b){
  if(a===b) return 0;
  if(!a) return 1;
  if(!b) return -1;
  return a>b?-1:a<b?1:0;
}

function layoutAssetTabByDate(tab){
  var cfg=ASSET_TAB_DATE_LAYOUT[tab];
  if(!cfg) return;
  var tabEl=document.getElementById(cfg.tabId);
  var listEl=document.getElementById(cfg.listId);
  if(!tabEl||!listEl) return;
  var items=Array.from(tabEl.querySelectorAll(cfg.itemSel));
  if(!items.length){
    listEl.innerHTML='';
    return;
  }
  var groups={};
  items.forEach(function(el){
    var date=getAssetRecordDate(el)||'';
    if(!groups[date]) groups[date]=[];
    groups[date].push(el);
  });
  var dates=Object.keys(groups).sort(compareAssetDatesDesc);
  var frag=document.createDocumentFragment();
  dates.forEach(function(date){
    var section=document.createElement('div');
    section.className='asset-date-group';
    section.dataset.dateGroup=date||'unknown';
    var head=document.createElement('div');
    head.className='asset-date-group-head';
    head.textContent=formatAssetDateGroupLabel(date);
    section.appendChild(head);
    var body=document.createElement('div');
    body.className='asset-date-group-body '+cfg.bodyClass;
    groups[date].forEach(function(el){body.appendChild(el);});
    section.appendChild(body);
    frag.appendChild(section);
  });
  listEl.innerHTML='';
  listEl.appendChild(frag);
}

function layoutAssetModalByDate(){
  ['image','video','text','audio'].forEach(layoutAssetTabByDate);
}

function loadUserAssetLibrary(){
  try{
    var raw=localStorage.getItem(ASSET_STORAGE_KEY);
    var parsed=raw?JSON.parse(raw):[];
    userAssetLibrary=Array.isArray(parsed)?parsed:[];
  }catch(e){
    userAssetLibrary=[];
    try{localStorage.removeItem(ASSET_STORAGE_KEY);}catch(err){}
  }
}

function saveUserAssetLibrary(){
  try{
    var toSave=userAssetLibrary.map(function(a){
      var copy=Object.assign({},a);
      if((copy.type==='audio'||copy.type==='video')&&copy.dataUrl&&copy.dataUrl.indexOf('blob:')===0) delete copy.dataUrl;
      if(copy.type==='image'&&copy.dataUrl&&copy.dataUrl.length>500000) delete copy.dataUrl;
      return copy;
    });
    localStorage.setItem(ASSET_STORAGE_KEY,JSON.stringify(toSave));
  }catch(e){showToast('⚠️ 资料过多，部分仅保存在本次会话');}
}

function findUserAsset(idOrName){
  return userAssetLibrary.find(function(a){return a.id===idOrName||a.name===idOrName;});
}

function detectAssetFileType(file){
  if(file.type.indexOf('image/')===0) return 'image';
  if(file.type.indexOf('video/')===0) return 'video';
  if(file.type.indexOf('audio/')===0) return 'audio';
  var ext=(file.name.split('.').pop()||'').toLowerCase();
  if(['jpg','jpeg','png','gif','webp','bmp','svg'].indexOf(ext)!==-1) return 'image';
  if(['mp4','webm','mov','avi','mkv','m4v','wmv'].indexOf(ext)!==-1) return 'video';
  if(['mp3','wav','ogg','m4a','flac','aac'].indexOf(ext)!==-1) return 'audio';
  if(['txt','md','json','csv','log'].indexOf(ext)!==-1) return 'text';
  if(file.type.indexOf('text/')===0) return 'text';
  return 'text';
}

function updateAssetUploadHint(tab){
  var hint=document.getElementById('asset-upload-hint');
  if(!hint) return;
  var hints={image:'支持 JPG / PNG / WebP / GIF 等图片，可多选',video:'支持 MP4 / WebM / MOV 等视频文件，可多选',text:'支持 TXT / MD / JSON 等文本文件',audio:'支持 MP3 / WAV / M4A 等音频文件'};
  hint.textContent=hints[tab]||hints.image;
}

window.renderUploadedAssets=function(){
  var imgBox=document.getElementById('asset-image-uploaded');
  var videoBox=document.getElementById('asset-video-uploaded');
  var textBox=document.getElementById('asset-text-uploaded');
  var audioBox=document.getElementById('asset-audio-uploaded');
  if(imgBox){
    var imgs=userAssetLibrary.filter(function(a){return a.type==='image';});
    imgBox.innerHTML=imgs.map(function(a){
      var preview=a.dataUrl
        ?'<div class="aspect-square overflow-hidden"><img src="'+a.dataUrl+'" class="w-full h-full object-cover"></div>'
        :'<div class="aspect-square bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white text-lg">🖼️</div>';
      return '<div class="asset-img-item user-uploaded-asset bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden" data-asset-id="'+a.id+'" data-name="'+escapeAssetHtml(a.name)+'" data-date="'+a.date+'" onclick="toggleAssetRecord(this,\'image\',event)">'+
        buildAssetMediaCardActionsHtml('image',a.id)+
        '<div class="overflow-hidden cursor-pointer hover:shadow-md transition relative">'+
        preview+
        '<span class="absolute top-1 left-1 text-[8px] px-1 py-0.5 bg-blue-500 text-white rounded">本地</span>'+
        '</div></div>';
    }).join('');
    imgBox.classList.toggle('hidden',imgs.length===0);
  }
  if(videoBox){
    var videos=userAssetLibrary.filter(function(a){return a.type==='video';});
    videoBox.innerHTML=videos.map(function(a){
      var preview=a.dataUrl
        ?'<div class="aspect-square overflow-hidden relative bg-black"><video src="'+a.dataUrl+'" class="w-full h-full object-cover" muted playsinline></video><span class="absolute inset-0 flex items-center justify-center text-xl text-white/80 pointer-events-none">▶</span></div>'
        :'<div class="aspect-square bg-gradient-to-br from-slate-600 to-blue-900 flex items-center justify-center text-white text-2xl">🎬</div>';
      return '<div class="asset-video-item user-uploaded-asset bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden" data-asset-id="'+a.id+'" data-name="'+escapeAssetHtml(a.name)+'" data-date="'+a.date+'" onclick="toggleAssetRecord(this,\'video\',event)">'+
        buildAssetMediaCardActionsHtml('video',a.id)+
        '<div class="overflow-hidden cursor-pointer hover:shadow-md transition relative">'+
        preview+
        '<span class="absolute top-1 left-1 text-[8px] px-1 py-0.5 bg-blue-500 text-white rounded">本地</span>'+
        '</div></div>';
    }).join('');
    videoBox.classList.toggle('hidden',videos.length===0);
  }
  if(textBox){
    var texts=userAssetLibrary.filter(function(a){return a.type==='text';});
    textBox.innerHTML=texts.map(function(a){
      var preview=escapeAssetHtml((a.preview||a.content||'').slice(0,60));
      return '<div class="asset-text-item user-uploaded-asset p-2.5 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50" data-asset-id="'+a.id+'" data-name="'+escapeAssetHtml(a.name)+'" data-date="'+a.date+'" data-asset-text="'+escapeAssetHtml(a.content||a.preview||'')+'" onclick="toggleAssetRecord(this,\'text\',event)">'+
        '<div class="flex justify-between items-start gap-2"><div class="flex-1 min-w-0"><span class="text-xs font-medium">📝 '+escapeAssetHtml(a.name)+'</span><span class="text-[8px] ml-1 text-blue-500">本地</span>'+
        '<div class="text-[10px] text-gray-400 truncate mt-0.5">"'+preview+'..."</div><div class="text-[9px] text-gray-400 mt-0.5">'+a.date+'</div></div>'+
        '<div class="flex gap-1 shrink-0"><button type="button" class="text-[9px] px-2 py-0.5 border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700/50" onclick="event.stopPropagation();viewAssetTextRecord(this)" title="查看">👁️</button></div>'+
        '</div></div>';
    }).join('');
    textBox.classList.toggle('hidden',texts.length===0);
  }
  if(audioBox){
    var audios=userAssetLibrary.filter(function(a){return a.type==='audio';});
    audioBox.innerHTML=audios.map(function(a){
      return '<div class="asset-audio-item user-uploaded-asset p-2.5 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50" data-asset-id="'+a.id+'" data-name="'+escapeAssetHtml(a.name)+'" data-date="'+a.date+'" onclick="toggleAssetRecord(this,\'audio\',event)">'+
        '<div class="flex justify-between items-center"><div class="flex items-center gap-2 min-w-0"><span class="text-sm">🎵</span><div class="min-w-0"><div class="text-xs font-medium truncate">'+escapeAssetHtml(a.name)+'</div><span class="text-[8px] text-blue-500">本地</span><div class="text-[9px] text-gray-400">'+a.date+'</div></div></div><div class="flex gap-1 shrink-0"><button type="button" class="text-[9px] px-2 py-0.5 border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700/50" onclick="event.stopPropagation();showToast(\'▶ 播放音频\')" title="播放">▶️</button></div></div></div>';
    }).join('');
    audioBox.classList.toggle('hidden',audios.length===0);
  }
  layoutAssetModalByDate();
  updateAssetCountLabel();
  filterAssetLibrary();
};

function isAssetModalMobileUi(){
  return window.matchMedia('(max-width:768px)').matches;
}

function stripAssetCardActionsMobile(){
  if(!isAssetModalMobileUi()) return;
  document.querySelectorAll('#asset-modal .asset-img-item>.asset-card-actions,#asset-modal .asset-video-item>.asset-card-actions').forEach(function(el){
    el.remove();
  });
}

var ASSET_CARD_PREVIEW_ICON_SVG='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';

function buildAssetMediaCardActionsHtml(tab,assetId){
  if(isAssetModalMobileUi()&&(tab==='image'||tab==='video')) return '';
  if(tab==='image'){
    return '<div class="asset-card-actions"><button type="button" class="asset-card-preview-btn" title="预览" aria-label="预览" onclick="event.stopPropagation();previewAssetRecord(this,\'image\')">'+ASSET_CARD_PREVIEW_ICON_SVG+'</button></div>';
  }
  if(tab==='video'){
    return '<div class="asset-card-actions"><button type="button" class="asset-card-preview-btn" title="预览" aria-label="预览" onclick="event.stopPropagation();previewAssetRecord(this,\'video\')">'+ASSET_CARD_PREVIEW_ICON_SVG+'</button></div>';
  }
  return '';
}

var assetLongPressState={timer:null,startX:0,startY:0,suppressClick:false};

function clearAssetLongPressTimer(){
  if(assetLongPressState.timer){
    clearTimeout(assetLongPressState.timer);
    assetLongPressState.timer=null;
  }
}

function getAssetMediaCardTab(card){
  if(!card) return null;
  if(card.classList.contains('asset-img-item')) return 'image';
  if(card.classList.contains('asset-video-item')) return 'video';
  return null;
}

function bindAssetModalMobileLongPress(){
  var modal=document.getElementById('asset-modal');
  if(!modal||modal.dataset.mobileLongPressBound==='1') return;
  modal.dataset.mobileLongPressBound='1';
  modal.addEventListener('touchstart',function(e){
    if(!isAssetModalMobileUi()) return;
    var card=e.target.closest('.asset-img-item,.asset-video-item');
    if(!card||!modal.contains(card)) return;
    var tab=getAssetMediaCardTab(card);
    if(!tab) return;
    var t=e.touches[0];
    assetLongPressState.startX=t.clientX;
    assetLongPressState.startY=t.clientY;
    assetLongPressState.suppressClick=false;
    clearAssetLongPressTimer();
    assetLongPressState.timer=setTimeout(function(){
      assetLongPressState.timer=null;
      assetLongPressState.suppressClick=true;
      card.dataset.assetLongPressBlock='1';
      if(navigator.vibrate) navigator.vibrate(10);
      if(typeof previewAssetRecord==='function') previewAssetRecord(card,tab);
      setTimeout(function(){delete card.dataset.assetLongPressBlock;},450);
    },480);
  },{passive:true});
  modal.addEventListener('touchmove',function(e){
    if(!assetLongPressState.timer) return;
    var t=e.touches[0];
    if(Math.abs(t.clientX-assetLongPressState.startX)>12||Math.abs(t.clientY-assetLongPressState.startY)>12){
      clearAssetLongPressTimer();
    }
  },{passive:true});
  modal.addEventListener('touchend',clearAssetLongPressTimer,{passive:true});
  modal.addEventListener('touchcancel',clearAssetLongPressTimer,{passive:true});
  modal.addEventListener('click',function(e){
    if(!assetLongPressState.suppressClick) return;
    if(e.target.closest('.asset-img-item,.asset-video-item')){
      e.preventDefault();
      e.stopPropagation();
    }
    assetLongPressState.suppressClick=false;
  },true);
}

function updateAssetCountLabel(){
  var staticImg=document.querySelectorAll('#asset-tab-image .asset-img-item:not(.user-uploaded-asset)').length;
  var staticVideo=document.querySelectorAll('#asset-tab-video .asset-video-item:not(.user-uploaded-asset)').length;
  var staticText=document.querySelectorAll('#asset-tab-text .asset-text-item:not(.user-uploaded-asset)').length;
  var staticAudio=document.querySelectorAll('#asset-tab-audio .asset-audio-item:not(.user-uploaded-asset)').length;
  var total=staticImg+staticVideo+staticText+staticAudio+userAssetLibrary.length;
  var label=document.getElementById('asset-count-label');
  if(label) label.textContent='共 '+total+' 个资产';
}

function ensureAssetCardActions(cardEl,tab){
  if(!cardEl) return;
  if(isAssetModalMobileUi()&&(tab==='image'||tab==='video')) return;
  cardEl.querySelectorAll('.asset-card-delete-btn').forEach(function(btn){btn.remove();});
  var actions=cardEl.querySelector('.asset-card-actions');
  if(!actions){
    actions=document.createElement('div');
    actions.className='asset-card-actions';
    cardEl.insertBefore(actions,cardEl.firstChild);
  }
  if(!actions.querySelector('.asset-card-preview-btn')){
    var prevBtn=document.createElement('button');
    prevBtn.type='button';
    prevBtn.className='asset-card-preview-btn';
    prevBtn.title='预览';
    prevBtn.setAttribute('aria-label','预览');
    prevBtn.innerHTML=ASSET_CARD_PREVIEW_ICON_SVG;
    prevBtn.onclick=function(ev){ev.stopPropagation();previewAssetRecord(this,tab);};
    actions.appendChild(prevBtn);
  }
}

window.closeAssetMediaPreview=function(){
  var overlay=document.getElementById('asset-media-preview-overlay');
  if(overlay){
    var v=overlay.querySelector('video');
    if(v){v.pause();v.removeAttribute('src');v.load();}
    overlay.remove();
  }
  if(typeof syncMobilePreviewOpenState==='function')syncMobilePreviewOpenState();
};

function resolveAssetPreviewItemFromCard(card,tab){
  if(!card) return null;
  var name=card.dataset.name||'资产';
  var assetId=card.dataset.assetId||'';
  var type=tab==='video'?'video':'image';
  var src=getExamplePreviewSrc(type);
  return{key:assetId||('static:'+name),assetId:assetId,name:name,src:src,poster:EXAMPLE_PREVIEW_IMAGE,thumbSrc:EXAMPLE_PREVIEW_IMAGE,type:type};
}

function collectAssetTabPreviewItems(tab){
  var tabRoot=tab==='video'?document.getElementById('asset-tab-video'):document.getElementById('asset-tab-image');
  if(!tabRoot) return [];
  var selector=tab==='video'?'.asset-video-item':'.asset-img-item';
  var items=[];
  tabRoot.querySelectorAll(selector).forEach(function(card){
    if(card.style.display==='none') return;
    var item=resolveAssetPreviewItemFromCard(card,tab);
    if(item){
      item.index=items.length;
      if(!item.key) item.key=item.assetId||('idx:'+item.index);
      items.push(item);
    }
  });
  return items;
}

function findAssetPreviewIndex(items,card,opts){
  opts=opts||{};
  if(opts.activeIndex!=null&&!isNaN(opts.activeIndex)) return Math.max(0,Math.min(parseInt(opts.activeIndex,10),items.length-1));
  if(opts.assetId){
    var byId=items.findIndex(function(it){return it.assetId===opts.assetId;});
    if(byId>=0) return byId;
  }
  if(card){
    var cid=card.dataset.assetId;
    if(cid){
      var i=items.findIndex(function(it){return it.assetId===cid;});
      if(i>=0) return i;
    }
    var cname=card.dataset.name;
    if(cname){
      var j=items.findIndex(function(it){return it.name===cname;});
      if(j>=0) return j;
    }
  }
  if(opts.name){
    var k=items.findIndex(function(it){return it.name===opts.name;});
    if(k>=0) return k;
  }
  return 0;
}

function fillAssetMediaPreviewMain(mainEl,item){
  if(!mainEl||!item) return;
  var esc=function(s){return String(s||'').replace(/"/g,'&quot;');};
  if(item.type==='video'){
    mainEl.innerHTML='<video src="'+esc(EXAMPLE_PREVIEW_VIDEO)+'" poster="'+esc(EXAMPLE_PREVIEW_IMAGE)+'" controls playsinline class="max-w-full max-h-full"></video>';
    var v=mainEl.querySelector('video');
    if(v) v.play().catch(function(){});
  }else{
    mainEl.innerHTML='<img src="'+esc(EXAMPLE_PREVIEW_IMAGE)+'" alt="'+esc(item.name)+'" class="max-w-full max-h-full object-contain">';
  }
}

function renderAssetPreviewSessionStrip(overlay,items,activeIndex){
  var strip=overlay.querySelector('#asset-preview-session-strip');
  var scroll=overlay.querySelector('#asset-preview-session-scroll');
  var countEl=overlay.querySelector('#asset-preview-session-count');
  var titleEl=overlay.querySelector('#asset-preview-session-title');
  if(!strip||!scroll) return;
  if(!items.length){
    strip.classList.add('is-empty');
    overlay.classList.remove('has-session-strip');
    return;
  }
  var isVideo=items[0].type==='video';
  if(titleEl) titleEl.textContent=isVideo?'当前分类 · 视频库':'当前分类 · 图片库';
  if(items.length<=1){
    strip.classList.add('is-empty');
    overlay.classList.remove('has-session-strip');
    scroll.innerHTML='';
    if(countEl) countEl.textContent='';
    return;
  }
  strip.classList.remove('is-empty');
  overlay.classList.add('has-session-strip');
  if(countEl) countEl.textContent='共 '+items.length+' 个';
  scroll.innerHTML=items.map(function(item,i){
    var active=i===activeIndex?' is-active':'';
    var play=isVideo?'<span class="session-thumb-play" aria-hidden="true">▶</span>':'';
    return '<button type="button" class="result-preview-session-thumb'+active+'" data-asset-preview-index="'+i+'" title="'+String(item.name||'').replace(/"/g,'&quot;')+'">'+
      '<img src="'+String(item.thumbSrc||'').replace(/"/g,'&quot;')+'" alt="">'+play+'</button>';
  }).join('');
  requestAnimationFrame(function(){
    var activeThumb=scroll.querySelector('.result-preview-session-thumb.is-active');
    if(activeThumb&&activeThumb.scrollIntoView) activeThumb.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'});
  });
}

function setAssetMediaPreviewIndex(overlay,items,index){
  if(!overlay||!items||!items.length) return;
  index=Math.max(0,Math.min(index,items.length-1));
  overlay._assetPreviewItems=items;
  overlay.dataset.activeIndex=String(index);
  var item=items[index];
  var main=overlay.querySelector('#asset-preview-main');
  var title=overlay.querySelector('#asset-preview-title');
  if(main){
    var prevV=main.querySelector('video');
    if(prevV){prevV.pause();prevV.removeAttribute('src');}
    fillAssetMediaPreviewMain(main,item);
  }
  if(title) title.textContent=item.name||'资产';
  renderAssetPreviewSessionStrip(overlay,items,index);
}

function getAssetPreviewBackBtnHtml(){
  return '<button type="button" class="asset-preview-back" aria-label="返回">'+
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>'+
    '<span>返回</span></button>';
}

function getAssetPreviewCloseBtnHtml(){
  return '<button type="button" class="asset-preview-close" aria-label="关闭">&times;</button>';
}

function bindAssetPreviewNavButtons(overlay){
  function goBack(e){
    if(e){e.stopPropagation();e.preventDefault();}
    closeAssetMediaPreview();
  }
  var back=overlay.querySelector('.asset-preview-back');
  var close=overlay.querySelector('.asset-preview-close');
  if(back) back.onclick=goBack;
  if(close) close.onclick=goBack;
}

function mountAssetGalleryPreview(overlay,items,activeIndex){
  overlay.innerHTML=
    '<div class="asset-preview-body">'+
      '<div class="asset-preview-topbar">'+
        '<div class="asset-preview-topbar-start">'+getAssetPreviewBackBtnHtml()+'</div>'+
        '<div class="asset-preview-title" id="asset-preview-title"></div>'+
        '<div class="asset-preview-topbar-end">'+getAssetPreviewCloseBtnHtml()+'</div>'+
      '</div>'+
      '<div class="asset-preview-main" id="asset-preview-main"></div>'+
    '</div>'+
    '<div class="result-preview-session-strip is-empty" id="asset-preview-session-strip">'+
      '<div class="result-preview-session-strip-head">'+
        '<span class="result-preview-session-strip-title" id="asset-preview-session-title">当前分类 · 图片库</span>'+
        '<span class="result-preview-session-strip-count" id="asset-preview-session-count"></span>'+
      '</div>'+
      '<div class="result-preview-session-strip-scroll" id="asset-preview-session-scroll" role="list"></div>'+
    '</div>';
  bindAssetPreviewNavButtons(overlay);
  overlay.querySelector('#asset-preview-session-scroll').addEventListener('click',function(e){
    var thumb=e.target.closest('[data-asset-preview-index]');
    if(!thumb) return;
    e.preventDefault();
    e.stopPropagation();
    setAssetMediaPreviewIndex(overlay,overlay._assetPreviewItems||items,parseInt(thumb.getAttribute('data-asset-preview-index')||'0',10));
  });
  setAssetMediaPreviewIndex(overlay,items,activeIndex);
}

window.openAssetMediaPreview=function(opts){
  opts=opts||{};
  var type=opts.type||'image';
  var card=opts.card||null;
  closeAssetMediaPreview();
  var items=(type==='image'||type==='video')?collectAssetTabPreviewItems(type):[];
  var activeIndex=items.length?findAssetPreviewIndex(items,card,opts):0;
  var item=items[activeIndex];
  if(!item){
    item={
      type:type,
      name:opts.name||'资产',
      src:opts.src||'',
      poster:opts.poster||'',
      thumbSrc:opts.src||opts.poster||videoRefPlaceholderDataUrl('image',opts.name||'资产')
    };
    items=[item];
    activeIndex=0;
  }
  var useGallery=type==='image'||type==='video';
  var overlay=document.createElement('div');
  overlay.id='asset-media-preview-overlay';
  overlay.className='fixed inset-0 z-[200050] flex asset-media-preview--gallery bg-[#0a0a0a]';
  overlay._assetPreviewItems=items;
  overlay.dataset.activeIndex=String(activeIndex);
  if(useGallery){
    mountAssetGalleryPreview(overlay,items,activeIndex);
  }
  document.body.appendChild(overlay);
  if(typeof setMobilePreviewOpen==='function'&&window.matchMedia&&window.matchMedia('(max-width:768px)').matches){
    setMobilePreviewOpen(true);
  }
};

window.viewAssetTextRecord=function(trigger){
  var card=trigger&&trigger.closest?trigger.closest('.asset-text-item'):null;
  if(!card) return;
  var name=card.dataset.name||'文本资产';
  var text=card.dataset.assetText||card.dataset.assetContent||'';
  if(!text){
    var assetId=card.dataset.assetId;
    if(assetId&&typeof findUserAsset==='function'){
      var asset=findUserAsset(assetId);
      if(asset) text=asset.content||asset.preview||'';
    }
  }
  var titleEl=document.getElementById('asset-text-view-title');
  var bodyEl=document.getElementById('asset-text-view-body');
  if(titleEl) titleEl.textContent='📝 '+name;
  if(bodyEl) bodyEl.value=text||'（暂无内容）';
  var modal=document.getElementById('asset-text-view-modal');
  if(modal) modal.classList.add('open');
  document.body.style.overflow='hidden';
};

window.previewAssetRecord=function(trigger,tab){
  var card=trigger&&trigger.closest?trigger.closest('.asset-img-item,.asset-video-item'):null;
  if(!card) return;
  var item=resolveAssetPreviewItemFromCard(card,tab);
  if(!item) return;
  openAssetMediaPreview({
    type:item.type,
    name:item.name,
    src:item.src,
    poster:item.poster,
    assetId:item.assetId,
    card:card
  });
};

window.filterAssetLibrary=function(){
  var q=(document.getElementById('asset-search')?.value||'').trim().toLowerCase();
  document.querySelectorAll('.asset-img-item,.asset-video-item,.asset-text-item,.asset-audio-item').forEach(function(el){
    if(el.id&&el.id.indexOf('asset-')===0&&el.id.indexOf('uploaded')!==-1) return;
    var name=(el.dataset.name||el.querySelector('.truncate,.text-xs.font-medium')?.textContent||'').toLowerCase();
    var show=!q||name.indexOf(q)!==-1;
    el.style.display=show?'':'none';
  });
  document.querySelectorAll('#asset-modal .asset-date-group').forEach(function(sec){
    var hasVisible=false;
    sec.querySelectorAll('.asset-img-item,.asset-video-item,.asset-text-item,.asset-audio-item').forEach(function(el){
      if(el.style.display!=='none') hasVisible=true;
    });
    sec.style.display=hasVisible?'':'none';
  });
};

window.triggerAssetUpload=function(){
  var input=document.getElementById('asset-upload-input');
  if(!input) return;
  var tab=getActiveAssetTab();
  if(tab==='image') input.accept='image/*';
  else if(tab==='video') input.accept='video/*,.mp4,.webm,.mov,.avi,.mkv,.m4v';
  else if(tab==='audio') input.accept='audio/*,.mp3,.wav,.ogg,.m4a,.flac';
  else input.accept='.txt,.md,.json,.csv,.log,text/plain';
  input.value='';
  input.click();
};

window.handleAssetUpload=function(input){
  if(!input||!input.files||!input.files.length) return;
  var files=Array.from(input.files);
  var tab=getActiveAssetTab();
  var progress=document.getElementById('asset-upload-progress');
  var bar=document.getElementById('asset-upload-bar');
  var pct=document.getElementById('asset-upload-pct');
  var status=document.getElementById('asset-upload-status');
  if(progress) progress.classList.remove('hidden');
  var done=0;
  function tick(){
    done++;
    var p=Math.round(done/files.length*100);
    if(bar) bar.style.width=p+'%';
    if(pct) pct.textContent=p+'%';
    if(done>=files.length){
      if(progress) setTimeout(function(){progress.classList.add('hidden');if(bar)bar.style.width='0%';},400);
      saveUserAssetLibrary();
      renderUploadedAssets();
      showToast('✅ 已上传 '+files.length+' 个文件到资料库');
      input.value='';
    }
  }
  files.forEach(function(file){
    var type=detectAssetFileType(file);
    if(tab==='image'&&type!=='image'){showToast('⚠️ 当前为图片分类，已跳过：'+file.name);tick();return;}
    if(tab==='video'&&type!=='video'){showToast('⚠️ 当前为视频分类，已跳过：'+file.name);tick();return;}
    if(tab==='audio'&&type!=='audio'){showToast('⚠️ 当前为音频分类，已跳过：'+file.name);tick();return;}
    if(tab==='text'&&(type==='image'||type==='video'||type==='audio')){showToast('⚠️ 当前为文本分类，已跳过：'+file.name);tick();return;}
    var item={id:'upl_'+Date.now()+'_'+Math.random().toString(36).substr(2,6),name:file.name,type:type,date:formatAssetDate(),uploadedAt:Date.now()};
    if(type==='image'){
      var reader=new FileReader();
      reader.onload=function(e){item.dataUrl=e.target.result;userAssetLibrary.unshift(item);tick();};
      reader.onerror=function(){showToast('⚠️ 读取失败：'+file.name);tick();};
      reader.readAsDataURL(file);
    }else if(type==='audio'){
      item.dataUrl=URL.createObjectURL(file);
      userAssetLibrary.unshift(item);
      tick();
    }else if(type==='video'){
      item.dataUrl=URL.createObjectURL(file);
      userAssetLibrary.unshift(item);
      tick();
    }else{
      var reader=new FileReader();
      reader.onload=function(e){item.content=e.target.result;item.preview=(e.target.result||'').slice(0,120);userAssetLibrary.unshift(item);tick();};
      reader.onerror=function(){showToast('⚠️ 读取失败：'+file.name);tick();};
      reader.readAsText(file,'UTF-8');
    }
  });
};

window.deleteUserAsset=function(id){
  var asset=findUserAsset(id);
  if(!asset) return;
  if(!confirm('确定删除资料「'+asset.name+'」？')) return;
  userAssetLibrary=userAssetLibrary.filter(function(a){return a.id!==id;});
  saveUserAssetLibrary();
  renderUploadedAssets();
  showToast('🗑️ 已删除：'+asset.name);
};

window.deleteAssetRecord=function(trigger,tab){
  var el=trigger&&trigger.closest?trigger.closest('.asset-img-item,.asset-video-item'):null;
  if(!el) return;
  var name=el.dataset.name||'资产';
  if(!confirm('确定删除「'+name+'」？')) return;
  var key=el.dataset.assetId||el.dataset.name;
  if(key){
    var idx=findAssetSelectionIndex(key,tab);
    if(idx>=0){
      assetSelected.splice(idx,1);
      updateAssetConfirmLabel();
    }
  }
  el.remove();
  updateAssetCountLabel();
  showToast('🗑️ 已删除：'+name);
};

window.openAssetModal=function(tab,opts){
  opts=opts||{};
  if(typeof closeAssetLibrary==='function') closeAssetLibrary();
  openModal('asset-modal',{preserve:opts.preserve||[]});
  try{
    clearAssetModalSelection();
    loadUserAssetLibrary();
    renderUploadedAssets();
    initAssetModalStaticRecords();
    layoutAssetModalByDate();
    if(tab) window.switchAssetTab(tab,null);
    else updateAssetUploadHint(getActiveAssetTab());
  }catch(e){
    console.error('openAssetModal',e);
    userAssetLibrary=[];
    try{renderUploadedAssets();initAssetModalStaticRecords();layoutAssetModalByDate();}catch(err){}
    if(tab) window.switchAssetTab(tab,null);
    else updateAssetUploadHint(getActiveAssetTab());
  }
};

function videoRefPlaceholderDataUrl(type,name){
  var icons={image:'🖼️',video:'🎬',audio:'🎵'};
  var fills={image:'374151',video:'1e3a5f',audio:'4c1d95'};
  var icon=icons[type]||'📎';
  var fill=fills[type]||'374151';
  var label=encodeURIComponent((name||type).slice(0,8));
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect fill='%23"+fill+"' width='96' height='96'/%3E%3Ctext x='48' y='44' text-anchor='middle' font-size='22'%3E"+encodeURIComponent(icon)+"%3C/text%3E%3Ctext x='48' y='68' text-anchor='middle' fill='%239ca3af' font-size='9'%3E"+label+"%3C/text%3E%3C/svg%3E";
}

window.openImageAssetModal=function(){
  assetPickTarget={page:'image',mediaType:'image'};
  openAssetModal('image');
};

window.openVideoAssetModal=function(mediaType){
  assetPickTarget={page:'video',mediaType:mediaType||'image'};
  var tab=mediaType==='audio'?'audio':mediaType==='video'?'video':'image';
  openAssetModal(tab);
};

window.openChatAssetModal=function(){
  assetPickTarget={page:'chat',mediaType:'text'};
  openAssetModal('text');
};

window.openAudioAssetModal=function(){
  assetPickTarget={page:'audio',mediaType:'text'};
  openAssetModal('text');
};

// ===== 我的产品页面 Tab 切换（事件委托） =====
document.addEventListener('click',function(e){
  var tabBtn=e.target.closest('#myworks-tab-bar .myworks-tab');
  if(!tabBtn) return;
  var tab=tabBtn.getAttribute('data-tab');
  if(!tab) return;
  e.preventDefault();
  // 更新按钮样式
  var siblings=document.querySelectorAll('#myworks-tab-bar .myworks-tab');
  for(var si=0;si<siblings.length;si++){
    siblings[si].classList.remove('active','bg-white','dark:bg-gray-700','text-gray-800','dark:text-gray-100','font-medium','shadow-sm');
    siblings[si].classList.add('text-gray-500','dark:text-gray-400');
  }
  tabBtn.classList.add('active','bg-white','dark:bg-gray-700','text-gray-800','dark:text-gray-100','font-medium','shadow-sm');
  tabBtn.classList.remove('text-gray-500','dark:text-gray-400');
  // 切换内容
  var contents=document.querySelectorAll('#page-myassets .myworks-tab-content');
  for(var ci=0;ci<contents.length;ci++){contents[ci].style.display='none';}
  var target=document.getElementById('myworks-tab-'+tab);
  if(target){target.style.display='block';}
  // 重置搜索
  var searchEls=document.querySelectorAll('#page-myassets input[placeholder*="搜索"]');
  for(var si=0;si<searchEls.length;si++){searchEls[si].value='';}
  // 重置类型过滤
  if(typeof filterMyworksByType==='function') filterMyworksByType('all');
  // 退出管理模式
  if(window._myworksManageMode){window.toggleMyWorksManage(true);}
  // 渲染来源图标
  renderMyworksSourceIcons();
});

// 类型过滤：全部 / 图片 / 视频 / 音频 / 文件
window.filterMyworksByType=function(type){
  // 更新按钮高亮
  var btns=document.querySelectorAll('#page-myassets .myworks-filter-btn');
  for(var i=0;i<btns.length;i++){
    btns[i].classList[btns[i].getAttribute('data-filter')===type?'add':'remove']('active');
  }
  // 联动搜索过滤（同时按类型+关键词过滤）
  if(typeof filterMyWorks==='function') filterMyWorks();
};

// 搜索过滤
window.filterMyWorks=function(){
  var activeTab=getVisibleMyworksTab();
  if(!activeTab) return;
  var searchInput=activeTab.querySelector('input[placeholder*="搜索"]');
  var q=(searchInput?searchInput.value:'').toLowerCase().trim();
  var activeFilter=document.querySelector('#page-myassets .myworks-filter-btn.active');
  var filterType=activeFilter?activeFilter.getAttribute('data-filter')||'all':'all';
  var cards=activeTab.querySelectorAll('.masonry-card');
  for(var i=0;i<cards.length;i++){
    var el=cards[i];
    var name=(el.getAttribute('data-name')||'').toLowerCase();
    var typeMatch=filterType==='all'||el.getAttribute('data-type')===filterType;
    var searchMatch=!q||name.indexOf(q)!==-1;
    el.style.display=(typeMatch&&searchMatch)?'':'none';
  }
};

// 我的产品 - 重新生成（跳转到对应生成页面）
window.regenerateProduct=function(btn){
  var card=btn.closest('.masonry-card');
  if(!card) return;
  var type=card.getAttribute('data-type')||'image';
  var pageMap={image:'image',video:'video',audio:'audio',text:'chat'};
  var target=pageMap[type]||'image';
  showPage(target);
};

// 我的产品 - 删除当前卡片
window.deleteProduct=function(btn){
  if(!confirm('确定要删除这个作品吗？此操作不可撤销。')) return;
  var card=btn.closest('.masonry-card');
  if(card){
    card.style.transition='all 0.3s ease';
    card.style.transform='scale(0.9)';
    card.style.opacity='0';
    setTimeout(function(){
      card.remove();
      showToast('🗑️ 已删除');
    },300);
  }
};

// 我的产品 - 打开/关闭编辑作品页
function openMyworksEditPage(){
  var editPage=document.getElementById('myworks-edit-page');
  if(!editPage) return false;
  editPage.style.display='flex';
  editPage.classList.add('is-open');
  document.body.classList.add('myworks-edit-open');
  document.body.style.overflow='hidden';
  return true;
}
window.hideEditProduct=function(){
  var editPage=document.getElementById('myworks-edit-page');
  if(editPage){
    editPage.style.display='none';
    editPage.classList.remove('is-open');
  }
  document.body.classList.remove('myworks-edit-open');
  document.body.style.overflow='';
  if(typeof syncMobileBottomNav==='function'){
    syncMobileBottomNav(typeof getActivePageId==='function'?getActivePageId():'myassets');
  }
};

// 我的产品 - 打开编辑产品页面
window.showEditProduct=function(btn){
  var card=btn.closest('.masonry-card');
  if(!card) return;
  var name=card.getAttribute('data-name')||'';
  var type=card.getAttribute('data-type')||'image';
  var model=card.getAttribute('data-model')||'';
  var params=card.getAttribute('data-params')||'';

  var editPage=document.getElementById('myworks-edit-page');
  if(!editPage) return;

  // 填充标题
  var titleInput=document.getElementById('myworks-edit-title');
  if(titleInput) titleInput.value=name;

  // 填充提示词（用名称模拟）
  var promptInput=document.getElementById('myworks-edit-prompt');
  if(promptInput) promptInput.value=name;

  // 填充分类标签（根据类型预设）
  var tagColors={
    image:['#eff6ff|#3b82f6|#bfdbfe','#f0fdf4|#22c55e|#bbf7d0','#fdf2f8|#ec4899|#fbcfe8'],
    video:['#eff6ff|#3b82f6|#bfdbfe','#fefce8|#eab308|#fef08a'],
    audio:['#f0fdf4|#22c55e|#bbf7d0','#fdf2f8|#ec4899|#fbcfe8'],
    text:['#f5f3ff|#8b5cf6|#ddd6fe','#fff7ed|#f97316|#fed7aa']
  };
  var tagNames={
    image:['风景','赛博朋克','城市'],
    video:['视频','创意','动态'],
    audio:['音乐','氛围','创作'],
    text:['文案','创意','写作']
  };
  var tagsContainer=document.getElementById('myworks-edit-tags');
  if(tagsContainer){
    var tags=tagNames[type]||tagNames.image;
    var colors=tagColors[type]||tagColors.image;
    tagsContainer.innerHTML='';
    tags.forEach(function(tag,i){
      var c=colors[i]||colors[0];
      var parts=c.split('|');
      var bg=parts[0],color=parts[1],border=parts[2];
      var span=document.createElement('span');
      span.style.cssText='display:inline-flex;align-items:center;gap:4px;font-size:11px;padding:3px 10px;border-radius:20px;background:'+bg+';color:'+color+';border:1px solid '+border+';';
      span.innerHTML=tag+' <span onclick="removeEditTag(this)" style="cursor:pointer;opacity:0.6;font-size:13px;line-height:1;">×</span>';
      tagsContainer.appendChild(span);
    });
  }

  // 重置价格/可见性
  var freeRadio=editPage.querySelector('input[name="edit-price-type"][value="free"]');
  if(freeRadio){ freeRadio.checked=true; toggleEditPriceInput(); }
  var publicRadio=editPage.querySelector('input[name="edit-visibility"][value="public"]');
  if(publicRadio){ publicRadio.checked=true; updateEditVisibility(); }

  // 显示弹窗
  openMyworksEditPage();
};

// 删除编辑弹窗标签
window.removeEditTag=function(closeBtn){
  var span=closeBtn.parentElement;
  if(span) span.remove();
};

// 回车添加标签
window.addEditTagOnEnter=function(e){
  if(e.key!=='Enter') return;
  e.preventDefault();
  var input=document.getElementById('myworks-edit-tag-input');
  if(!input||!input.value.trim()) return;
  var tagsContainer=document.getElementById('myworks-edit-tags');
  if(!tagsContainer) return;
  var tagColors=['#eff6ff|#3b82f6|#bfdbfe','#f0fdf4|#22c55e|#bbf7d0','#fdf2f8|#ec4899|#fbcfe8','#f5f3ff|#8b5cf6|#ddd6fe','#fff7ed|#f97316|#fed7aa'];
  var c=tagColors[tagsContainer.children.length%tagColors.length].split('|');
  var span=document.createElement('span');
  span.style.cssText='display:inline-flex;align-items:center;gap:4px;font-size:11px;padding:3px 10px;border-radius:20px;background:'+c[0]+';color:'+c[1]+';border:1px solid '+c[2]+';';
  span.innerHTML=input.value.trim()+' <span onclick="removeEditTag(this)" style="cursor:pointer;opacity:0.6;font-size:13px;line-height:1;">×</span>';
  tagsContainer.appendChild(span);
  input.value='';
};

// 切换付费价格输入框
window.toggleEditPriceInput=function(){
  var priceInput=document.getElementById('myworks-edit-price-val');
  if(!priceInput) return;
  var paidRadio=document.querySelector('input[name="edit-price-type"][value="paid"]');
  priceInput.disabled=!(paidRadio&&paidRadio.checked);
  priceInput.style.opacity=priceInput.disabled?'0.4':'1';
  priceInput.style.background=priceInput.disabled?'#f3f4f6':'#fff';
};

// 更新可见性选项高亮
window.updateEditVisibility=function(){
  var pubWrap=document.getElementById('edit-visibility-public-wrap');
  var priWrap=document.getElementById('edit-visibility-private-wrap');
  var pubRadio=document.querySelector('input[name="edit-visibility"][value="public"]');
  if(!pubWrap||!priWrap) return;
  if(pubRadio&&pubRadio.checked){
    pubWrap.style.borderColor='#22c55e'; pubWrap.style.background='#f0fdf4';
    priWrap.style.borderColor='#e5e7eb'; priWrap.style.background='#f9fafb';
  } else {
    priWrap.style.borderColor='#3b82f6'; priWrap.style.background='#eff6ff';
    pubWrap.style.borderColor='#e5e7eb'; pubWrap.style.background='#f9fafb';
  }
};

function getVisibleMyworksTab(){
  var contents=document.querySelectorAll('#page-myassets .myworks-tab-content');
  for(var i=0;i<contents.length;i++){
    var el=contents[i];
    if(el.style.display==='none') continue;
    if(getComputedStyle(el).display==='none') continue;
    return el;
  }
  return document.getElementById('myworks-tab-works');
}
function positionMyworksBatchBar(){
  var bar=document.getElementById('myworks-batch-bar');
  if(!bar) return;
  bar.style.bottom='0';
  bar.style.zIndex='200120';
}
// 管理模式切换
// ===== 我的产品 - 管理模式（批量选择/下载/删除） =====
window.toggleMyWorksManage=function(forceOff){
  var isManage=window._myworksManageMode;
  if(forceOff===true&&!isManage) return; // 已经是退出状态
  if(forceOff===true) isManage=true;

  if(!document.getElementById('page-myassets')?.classList.contains('active')){
    showToast('请先进入「我的产品」页面');
    return;
  }
  var activeTab=getVisibleMyworksTab();
  if(!activeTab) return;
  var btn=document.getElementById('myworks-manage-btn');
  var cards=activeTab.querySelectorAll('.masonry-card');
  var searchEl=activeTab.querySelector('input[placeholder*="搜索"]');

  if(isManage){
    // === 退出管理模式 ===
    window._myworksManageMode=false;
    if(btn){btn.textContent='管理';btn.classList.remove('bg-blue-500','text-white','border-blue-500');btn.classList.add('border-gray-200','dark:border-gray-600','text-gray-500','dark:text-gray-400');}
    if(searchEl) searchEl.disabled=false;
    cards.forEach(function(c){c.classList.remove('selected','manage-show');});
    // 移除勾选框
    activeTab.querySelectorAll('.myworks-card-check').forEach(function(el){el.remove();});
    // 隐藏底部操作栏
    document.body.classList.remove('myworks-manage-active');
    if(typeof syncMobileBottomNav==='function'){
      syncMobileBottomNav(typeof getActivePageId==='function'?getActivePageId():'myassets');
    }
    var bar=document.getElementById('myworks-batch-bar');
    if(bar){
      bar.classList.remove('is-visible');
      bar.setAttribute('aria-hidden','true');
    }
  } else {
    // === 进入管理模式 ===
    window._myworksManageMode=true;
    if(btn){btn.textContent='完成';btn.classList.add('bg-blue-500','text-white','border-blue-500');btn.classList.remove('border-gray-200','dark:border-gray-600','text-gray-500','dark:text-gray-400');}
    if(searchEl) searchEl.disabled=true;
    // 为每个卡片添加勾选框
    cards.forEach(function(c,i){
      c.classList.add('manage-show');
      if(c.querySelector('.myworks-card-check')) return;
      var check=document.createElement('div');
      check.className='myworks-card-check';
      check.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20,6 9,17 4,12"/></svg>';
      c.appendChild(check);
    });
    document.body.classList.add('myworks-manage-active');
    if(typeof updateBatchBar==='function') updateBatchBar();
  }
};

// 管理模式下点击卡片选择/取消
document.addEventListener('click',function(e){
  if(!window._myworksManageMode) return;
  var card=e.target.closest('#page-myassets .masonry-card');
  if(!card) return;
  e.stopPropagation();
  e.preventDefault();
  card.classList.toggle('selected');
  updateBatchBar();
});

// ─── 我的产品预览弹窗 工具函数 ───────────────────────────────

// 时间格式化
var _mwpFmt=function(d){
  return d.getFullYear()+'-'+(d.getMonth()+1).toString().padStart(2,'0')+'-'+d.getDate().toString().padStart(2,'0')
    +' '+d.getHours().toString().padStart(2,'0')+':'+d.getMinutes().toString().padStart(2,'0')+':'+d.getSeconds().toString().padStart(2,'0');
};

// 卡片类型颜色（用于缩略图背景，截图中缩略图是深蓝灰色）
var _mwpGrad={
  image:['#2a3044','#303850'],
  video:['#1e2a40','#243050'],
  audio:['#1e3038','#243840'],
  text:['#2a2a44','#303060']
};

// 大模型类型标签与能力说明（参数配置区展示）
var _mwpModelTypeTags={image:'图片生成',video:'视频生成',audio:'音频生成',text:'文本生成'};
var _mwpModelTypeIcons={image:'🖼️',video:'🎬',audio:'🎵',text:'💬'};
var _mwpModelDefaultDesc={
  image:'文生图模型，根据提示词与画面参数生成高质量图像，支持分辨率、比例与风格控制。',
  video:'文生视频模型，根据提示词生成动态画面，支持时长、分辨率与运动幅度等参数。',
  audio:'音频生成模型，可合成背景音乐、旁白配音与音效，支持采样率与时长设置。',
  text:'大语言模型，用于文案创作、内容摘要与多轮对话，支持温度与输出长度调节。'
};
var _mwpModelKnownDesc={
  'stable diffusion xl':'开源文生图模型，擅长写实与概念艺术，支持高分辨率出图。',
  'midjourney v6':'高质量艺术向文生图模型，风格化表现力强，适合插画与视觉设计。',
  'dall-e 3':'OpenAI 文生图模型，语义理解准确，适合商业海报与产品展示图。',
  'flux.1 pro':'新一代文生图模型，细节丰富、出图速度快，适合电商与广告素材。',
  'kling 1.6':'可灵视频生成模型，支持文生视频与图生视频，运动自然流畅。',
  'runway gen-3':'Runway 视频生成模型，适合电影感镜头与创意短片制作。',
  'stable audio 2.0':'Stable Audio 音频生成模型，可创作背景音乐与环境音效。',
  'elevenlabs tts':'ElevenLabs 语音合成模型，多音色旁白，适合有声书与口播。',
  'gpt-4o':'OpenAI 多模态大语言模型，擅长创意写作与复杂指令理解。',
  'claude 3.5 sonnet':'Anthropic 大语言模型，长文写作与结构化文案表现优秀。',
  'gemini-3-pro-image-preview':'Google Gemini 图像预览模型，支持高质量图像生成与编辑。',
  'flux-pro-1.1':'Flux Pro 图像模型，细节与光影表现突出。',
  'sora-turbo':'OpenAI Sora 视频模型快速版，适合短视频与动态预览生成。'
};
function _mwpResolveModelDesc(type,modelName){
  var key=(modelName||'').toLowerCase().trim();
  if(key&&_mwpModelKnownDesc[key]) return _mwpModelKnownDesc[key];
  for(var k in _mwpModelKnownDesc){
    if(key&&key.indexOf(k)>=0) return _mwpModelKnownDesc[k];
  }
  return _mwpModelDefaultDesc[type]||_mwpModelDefaultDesc.image;
}

// 当前预览的卡片引用（供下载/发布/删除按钮使用）
window._mwpCurrentCard=null;
// 当前所有卡片（供缩略图切换）
window._mwpAllCards=[];

// 填充预览内容（card: DOM元素）
function _mwpFill(card,allCards){
  var name=card.getAttribute('data-name')||'未命名';
  var type=card.getAttribute('data-type')||'image';
  var model=card.getAttribute('data-model')||'';
  var params=card.getAttribute('data-params')||'';

  var typeLabels={image:'图片提示词',video:'视频提示词',audio:'音频提示词',text:'文字提示词'};
  var typeIcons={image:'🏙️',video:'🎬',audio:'🎵',text:'📝'};
  var makeBtns={image:'图片制作',video:'视频制作',audio:'音频制作',text:'文字创作'};
  var pageTargets={image:'image',video:'video',audio:'audio',text:'chat'};

  // 存储当前卡片引用
  window._mwpCurrentCard=card;

  // 判断是否已发布：有 data-price 即为已发布，否则为草稿
  var isPublished=!!card.getAttribute('data-price');
  
  // 已发布产品显示 产品名称/分类标签/使用价格，草稿隐藏
  ['mwp-section-title','mwp-section-category','mwp-section-price'].forEach(function(id){
    var el=document.getElementById(id);
    if(el) el.style.display=isPublished?'':'none';
  });

  // 产品名称
  var titleEl=document.getElementById('mwp-title');
  if(titleEl) titleEl.textContent=name||'未命名';

  // 分类标签
  var category=card.getAttribute('data-category')||'';
  var catEl=document.getElementById('mwp-category');
  if(catEl){
    var catColors={
      商业:{bg:'#dbeafe',color:'#1d4ed8',icon:'💼'},
      营销:{bg:'#fef3c7',color:'#b45309',icon:'📊'},
      艺术:{bg:'#fce7f3',color:'#be185d',icon:'🎨'},
      文案:{bg:'#fef3c7',color:'#b45309',icon:'✍️'},
      视频:{bg:'#e0e7ff',color:'#4338ca',icon:'🎬'},
      图片:{bg:'#d1fae5',color:'#059669',icon:'🖼️'},
      摄影:{bg:'#e0e7ff',color:'#4338ca',icon:'📷'}
    };
    if(category&&catColors[category]){
      var c=catColors[category];
      catEl.innerHTML='<span style="display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:4px;font-size:11px;background:'+c.bg+';color:'+c.color+';">'+c.icon+' '+category+'</span>';
    } else if(category){
      catEl.innerHTML='<span style="display:inline-flex;align-items:center;padding:2px 8px;border-radius:4px;font-size:11px;background:#e5e7eb;color:#6b7280;">'+category+'</span>';
    } else {
      catEl.innerHTML='<span style="display:inline-flex;align-items:center;padding:2px 8px;border-radius:4px;font-size:11px;background:#e5e7eb;color:#6b7280;">未分类</span>';
    }
  }

  // 使用价格
  var price=card.getAttribute('data-price')||'';
  var priceEl=document.getElementById('mwp-price');
  if(priceEl){
    var priceNum=parseFloat(price);
    if(price==='免费'||price==='0'||priceNum===0){
      priceEl.innerHTML='🆓 免费';
    } else if(priceNum>0){
      priceEl.innerHTML='⚡ <span style="font-family:monospace;">'+priceNum.toFixed(2)+'</span> /次';
    } else if(price){
      priceEl.textContent=price;
    } else {
      priceEl.innerHTML='<span style="color:#6b7280;font-size:13px;">未定价</span>';
    }
  }

  // 提示词标签
  var promptLabel=document.getElementById('mwp-prompt-label');
  if(promptLabel) promptLabel.textContent=typeLabels[type]||typeLabels.image;

  // 提示词内容
  var promptText=document.getElementById('mwp-prompt-text');
  if(promptText) promptText.textContent=name||'—';

  // 占位标签（"生成结果 1"）—— 不再设置 emoji 图标，仅保留文字
  var lbl=document.getElementById('mwp-label');
  if(lbl) lbl.textContent='生成结果 1';

  // 参数行：截图格式 Auto / 0:16 / 2k / 质量：中
  var paramLine=document.getElementById('mwp-param-line');
  if(paramLine) paramLine.textContent=params||'Auto / 0:16 / 2k / 质量：中';

  // 使用大模型说明（参数配置区）
  var srcForModel=card.getAttribute('data-source')||'model';
  var displayModel=model;
  if(!displayModel){
    if(srcForModel==='apps') displayModel=card.getAttribute('data-source-name')||'应用工作流';
    else if(srcForModel==='inspiration') displayModel='灵感广场同款';
    else displayModel='Auto';
  }
  var modelNameEl=document.getElementById('mwp-model-name');
  var modelDescEl=document.getElementById('mwp-model-desc');
  var modelIconEl=document.getElementById('mwp-model-icon');
  var modelTypeTag=document.getElementById('mwp-model-type-tag');
  if(modelNameEl) modelNameEl.textContent=displayModel;
  if(modelTypeTag) modelTypeTag.textContent=_mwpModelTypeTags[type]||'AI 模型';
  if(modelIconEl) modelIconEl.textContent=_mwpModelTypeIcons[type]||'🤖';
  if(modelDescEl){
    var customDesc=card.getAttribute('data-model-desc')||'';
    modelDescEl.textContent=customDesc||_mwpResolveModelDesc(type,displayModel);
  }

  // 制作按钮 - 更新文字 + onclick
  var makeBtnEl=document.getElementById('mwp-make-btn');
  if(makeBtnEl){
    makeBtnEl.textContent=makeBtns[type]||'图片制作';
    makeBtnEl.onclick=function(){closeMyworksPreview();showPage&&showPage(pageTargets[type]||'image');showToast('🚀 跳转到'+makeBtns[type]);};
  }

  // 来源：大模型 / 灵感广场 / Apps
  var src=card.getAttribute('data-source')||'model';
  var tags=document.querySelectorAll('.mwp-source-tag');
  for(var i=0;i<tags.length;i++){
    tags[i].style.display=tags[i].getAttribute('data-src')===src?'inline':'none';
  }
  var noneEl=document.getElementById('mwp-source-none');
  if(noneEl) noneEl.style.display=['model','inspiration','apps'].indexOf(src)>=0?'none':'inline';
  // 来源名称：仅灵感/Apps 显示具体名称；大模型来源不再重复展示模型名（见参数配置区）
  var nameEl=document.getElementById('mwp-source-name');
  if(nameEl){
    var srcName='';
    if(src!=='model') srcName=card.getAttribute('data-source-name')||'';
    if(srcName){nameEl.textContent=srcName;nameEl.style.display='inline';}
    else{nameEl.textContent='';nameEl.style.display='none';}
  }

  // 任务ID（模拟，与截图格式一致）
  var taskidEl=document.getElementById('mwp-taskid');
  if(taskidEl) taskidEl.textContent='17796745558069535'+Math.floor(Math.random()*90+10);

  // 时间（截图格式：2026-5-25 10:02:35，使用非补零格式）
  var now=new Date();
  var exp=new Date(now.getTime()+13*24*60*60*1000);
  var fmtShort=function(d){
    return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours().toString().padStart(2,'0')+':'+d.getMinutes().toString().padStart(2,'0')+':'+d.getSeconds().toString().padStart(2,'0');
  };
  var createdEl=document.getElementById('mwp-created-at');
  if(createdEl) createdEl.textContent=fmtShort(now);
  var expiredEl=document.getElementById('mwp-expired-at');
  if(expiredEl) expiredEl.textContent=fmtShort(exp);

  // ─── 渲染底部图片库缩略图 ──────────────────────────────────
  var thumbs=document.getElementById('mwp-thumbnails');
  var countEl=document.getElementById('mwp-thumb-count');
  if(thumbs){
    var cards=allCards||document.querySelectorAll('#myworks-tab-works .masonry-card');
    window._mwpAllCards=Array.prototype.slice.call(cards);
    if(countEl) countEl.textContent='共 '+cards.length+' 张';
    thumbs.innerHTML='';
    Array.prototype.forEach.call(cards,function(c){
      var t=c.getAttribute('data-type')||'image';
      var grads=_mwpGrad[t]||_mwpGrad.image;
      var isActive=(c===card);
      var thumb=document.createElement('div');
      // 截图中缩略图样式：约56x56，深蓝灰色背景，小文字标题，无emoji，当前高亮黄绿边框
      thumb.style.cssText='width:56px;height:56px;border-radius:6px;flex-shrink:0;cursor:pointer;overflow:hidden;transition:border 0.15s;position:relative;'
        +'background:linear-gradient(135deg,'+grads.join(',')+');'
        +'border:2px solid '+(isActive?'#b6ef3a':'transparent')+';';
      // 缩略图内小文字（模拟截图中能看到文字内容）
      var nameShort=(c.getAttribute('data-name')||'').slice(0,4);
      thumb.innerHTML='<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:4px;"><span style="font-size:9px;color:#6b7280;text-align:center;line-height:1.2;word-break:break-all;">'+nameShort+'</span></div>';
      thumb.title=c.getAttribute('data-name')||'未命名';
      thumb.addEventListener('click',function(){
        // 更新缩略图高亮
        Array.prototype.forEach.call(thumbs.children,function(ch){ch.style.border='2px solid transparent';});
        thumb.style.border='2px solid #b6ef3a';
        _mwpFill(c,window._mwpAllCards);
      });
      thumbs.appendChild(thumb);
    });
  }

  if(typeof applyExamplePreviewToMyworksMedia==='function') applyExamplePreviewToMyworksMedia(type);
}

// ─── 卡片点击事件 ─────────────────────────────────────────────
document.addEventListener('click',function(e){
  var card=e.target.closest('#page-myassets .masonry-card');
  if(!card||window._myworksManageMode) return;
  if(e.target.closest('#myworks-manage-btn')||e.target.closest('button')) return;

  // 判断卡片所在 Tab
  var tabEl=card.closest('.myworks-tab-content');
  var tabId=tabEl?tabEl.id:'';

  // ── 我的收藏 Tab — 已通过卡片内联 onclick 处理，此处跳过
  if(tabId==='myworks-tab-favs') return;

  // 📱 窄屏 → 打开移动端底部预览（带右侧折叠抽屉）
  if(window.innerWidth<640){
    e.preventDefault();
    var mobSheet=document.getElementById('mob-preview-sheet');
    if(!mobSheet) return;
    // 收集卡片数据
    var mobName=card.getAttribute('data-name')||'';
    var mobType=card.getAttribute('data-type')||'image';
    var mobModel=card.getAttribute('data-model')||'';
    var mobParams=card.getAttribute('data-params')||'';
    var mobEmojiEl=card.querySelector('.mob-card-img .text-4xl')||card.querySelector('.text-4xl')||card.querySelector('.mob-card-img span:nth-child(3)');
    var mobEmoji=(mobEmojiEl&&mobEmojiEl.textContent.trim())||'📦';
    var typeMap={image:'🖼️ 图片',video:'🎬 视频',audio:'🎵 音频',text:'📝 文本'};
    // 填充预览数据
    var tEl=document.getElementById('mob-preview-title');
    if(tEl) tEl.textContent=mobName;
    var mEl=document.getElementById('mob-preview-meta');
    if(mEl) mEl.textContent=(typeMap[mobType]||'📦 文件')+(mobModel?' · '+mobModel:'');
    var pEl=document.getElementById('mob-preview-params');
    if(pEl) pEl.textContent=mobParams?'参数：'+mobParams:'暂无参数信息';
    var eEl=document.getElementById('mob-preview-emoji');
    if(eEl) eEl.textContent=mobEmoji;
    var media=document.getElementById('mob-preview-media');
    if(media) media.style.aspectRatio=mobType==='video'?'16/9':(mobType==='audio'?'1/1':'4/5');
    // 打开预览
    mobSheet.style.display='flex';
    document.body.style.overflow='hidden';
    if(typeof setMobilePreviewOpen==='function')setMobilePreviewOpen(true);
    // 重置抽屉为折叠
    window._mobDrawerOpen=false;
    var drawer=document.getElementById('mob-preview-drawer');
    var chevron=document.getElementById('mob-drawer-chevron');
    if(drawer) drawer.style.right='-280px';
    if(chevron) chevron.style.transform='';
    return;
  }

  var modal=document.getElementById('myworks-preview-modal');
  if(!modal) return;

  var isPublished=tabId==='myworks-tab-publish';

  // 发布按钮：我的发布 Tab 隐藏，其他显示
  var pubBtn=document.getElementById('mwp-publish-btn');
  if(pubBtn) pubBtn.style.display=isPublished?'none':'flex';

  // 收集当前 Tab 的所有卡片
  var tabCardsSelector='#'+tabId+' .masonry-card';
  var allCards=document.querySelectorAll(tabCardsSelector);

  _mwpFill(card,allCards);

  modal.style.display='flex';
  document.body.style.overflow='hidden';
  if(typeof setMobilePreviewOpen==='function')setMobilePreviewOpen(true);
});

// ─── 关闭弹窗 ─────────────────────────────────────────────────
window.closeMyworksPreview=function(){
  var modal=document.getElementById('myworks-preview-modal');
  if(modal) modal.style.display='none';
  document.body.style.overflow='';
  if(typeof syncMobilePreviewOpenState==='function')syncMobilePreviewOpenState();
};

// ═══════════════════════════════════════════════════════════════
// ─── 收藏灵感预览弹窗 ──────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════

// 当前灵感卡片引用
window._fipCurrentCard=null;

/** 一键换装：人物替换工作区布局（左上角返回）；其他 Apps 收藏：右上角关闭 */
window.isFapmOutfitReplaceCard=function(card){
  if(!card) return false;
  var layout=card.getAttribute('data-fapm-layout');
  if(layout==='character-replace') return true;
  var name=(card.getAttribute('data-name')||'').trim();
  return name.indexOf('一键换装')>=0;
};
window.isFapmOldPhotoCard=function(card){
  if(!card) return false;
  var layout=card.getAttribute('data-fapm-layout');
  if(layout==='old-photo-time-machine') return true;
  var appId=card.getAttribute('data-app-id')||'';
  if(appId==='old-photo-time-machine') return true;
  return isOldPhotoTimeMachineApp(card.getAttribute('data-name')||'',appId);
};
window.isFapmWorkspaceCard=function(card){
  return window.isFapmOutfitReplaceCard(card)||window.isFapmOldPhotoCard(card);
};
var FAPM_OUTFIT_PARAMS_HTML='<div class="fapm-field">'+
  '<span class="fapm-field-label">模特图</span>'+
  '<div class="fapm-upload-slot" onclick="openAssetModal(\'image\')" role="button" tabindex="0">'+
  '<div class="fapm-upload-preview fapm-upload-preview--model">🧥</div>'+
  '<button type="button" class="fapm-upload-edit" onclick="event.stopPropagation();openAssetModal(\'image\')" aria-label="编辑模特图">'+
  '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button></div></div>'+
  '<div class="fapm-field"><span class="fapm-field-label">替换衣物图</span>'+
  '<div class="fapm-upload-slot" onclick="openAssetModal(\'image\')" role="button" tabindex="0">'+
  '<div class="fapm-upload-preview fapm-upload-preview--cloth">👔</div>'+
  '<button type="button" class="fapm-upload-edit" onclick="event.stopPropagation();openAssetModal(\'image\')" aria-label="编辑衣物图">'+
  '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button></div></div>'+
  '<div class="fapm-field fapm-field--prompt"><span class="fapm-field-label">提示词</span>'+
  '<textarea class="fapm-prompt-input" placeholder="让图一的人物穿上图二的衣服" rows="3"></textarea></div>';
function renderFapmParamsForm(card){
  var box=document.querySelector('#fav-apps-preview-modal .fapm-block-box');
  if(!box) return;
  if(window.isFapmOldPhotoCard(card)){
    var src=typeof oiwsResolveAssetUrl==='function'?oiwsResolveAssetUrl(OLD_PHOTO_UPLOAD_IMAGE):OLD_PHOTO_UPLOAD_IMAGE;
    box.innerHTML='<div class="fapm-field"><span class="fapm-field-label">image</span>'+
      '<div class="fapm-upload-slot" onclick="openAssetModal(\'image\')" role="button" tabindex="0">'+
      '<img class="fapm-upload-img fapm-upload-img--vintage" src="'+src+'" alt="" width="110" height="110" style="width:100%;aspect-ratio:1;object-fit:cover;display:block;border-radius:8px;">'+
      '<button type="button" class="fapm-upload-edit" onclick="event.stopPropagation();openAssetModal(\'image\')" aria-label="编辑图片">'+
      '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button></div></div>';
  }else if(window.isFapmOutfitReplaceCard(card)){
    box.innerHTML=FAPM_OUTFIT_PARAMS_HTML;
  }
}
window.syncFapmRunBar=function(card){
  var bolt=document.getElementById('fapm-run-bolt');
  var numEl=document.getElementById('fapm-run-price-num');
  var labelEl=document.getElementById('fapm-run-label');
  var stdEl=document.getElementById('fapm-run-standard');
  var priceWrap=document.getElementById('fapm-run-price');
  var isWs=window.isFapmWorkspaceCard(card);
  if(stdEl)stdEl.classList.add('hidden');
  if(labelEl)labelEl.classList.toggle('hidden',!isWs);
  var price='⚡0.7';
  if(card){
    var raw=String(card.getAttribute('data-price')||'').trim();
    if(window.isFapmOldPhotoCard(card)||window.isFapmOutfitReplaceCard(card)){
      price='⚡0.7';
    }else if(raw&&/R/i.test(raw)&&raw.indexOf('⚡')<0){
      price=raw;
    }else if(raw){
      var m=raw.match(/[\d.]+/);
      price=m?'⚡'+m[0]:'⚡0.7';
    }
  }
  if(typeof _applyRunPriceToBoltNum==='function'){
    _applyRunPriceToBoltNum(bolt,numEl,_parseRunPriceParts(price));
  }else if(numEl){
    if(bolt)bolt.textContent='⚡';
    numEl.textContent='0.7';
  }
  if(priceWrap)priceWrap.classList.remove('hidden');
};
window.syncFapmPublishWork=function(card){
  var pub=document.getElementById('fapm-publish-work');
  if(pub)pub.classList.add('hidden');
};

window.syncFapmHeaderLayout=function(modal,card){
  if(!modal) return;
  var isWs=window.isFapmWorkspaceCard(card);
  var isOld=window.isFapmOldPhotoCard(card);
  modal.classList.toggle('fapm-layout--workspace',isWs);
  modal.classList.toggle('fapm-layout--simple',!isWs);
  var wrap=modal.querySelector('.fapm-app-wrap');
  if(wrap){
    wrap.classList.toggle('fapm-variant--person-model',isWs);
    wrap.classList.toggle('fapm-variant--old-photo-time-machine',isOld);
  }
  var backBtn=modal.querySelector('#fapm-header-back');
  var closeBtn=modal.querySelector('#fapm-header-close');
  if(backBtn) backBtn.hidden=!isWs;
  if(closeBtn) closeBtn.hidden=isWs;
};

// 打开灵感收藏预览
window.openFavInsprPreview=function(card){
  if(!card) return;
  window._fipCurrentCard=card;
  
  // 从零创建弹窗 DOM（不依赖 HTML 预设）
  var old=document.getElementById('fav-inspr-preview-modal');
  if(old) old.remove();
  
  var m=document.createElement('div');
  m.id='fav-inspr-preview-modal';
  m.style.cssText='display:flex !important;position:fixed !important;top:0!important;left:0!important;right:0!important;bottom:0!important;z-index:200090!important;width:100vw!important;height:100vh!important;background:rgba(0,0,0,0.6)!important;align-items:center!important;justify-content:center!important;';
  m.setAttribute('onclick',"if(event.target===this)closeFavInsprPreview()");
  
  // 检测是否为移动端
  var isMobile=window.innerWidth<768;
  
  // 弹窗主体
  var body=document.createElement('div');
  if(isMobile){
    body.style.cssText='display:flex;flex-direction:column;width:100%;max-width:100%;height:100%;max-height:100%;border-radius:0;overflow:hidden;';
  } else {
    body.style.cssText='display:flex;flex-direction:row;width:760px;max-width:calc(100vw - 40px);height:540px;max-height:calc(100vh - 120px);border-radius:16px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,0.5);';
  }
  
  // 左侧：图片预览区
  var left=document.createElement('div');
  if(isMobile){
    left.style.cssText='flex:none;height:45vh;display:flex;align-items:center;justify-content:center;background:#0d0d0d;min-width:0;position:relative;';
  } else {
    left.style.cssText='flex:1;display:flex;align-items:center;justify-content:center;background:#0d0d0d;min-width:0;position:relative;';
  }
  left.innerHTML='<div id="fipm-media-box" style="width:100%;height:100%;background:#1a1a1a;display:flex;align-items:center;justify-content:center;"><img id="fipm-image" src="" alt="" style="width:100%;height:100%;object-fit:cover;display:none;"><div id="fipm-placeholder" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#2a3044,#303850);"><span id="fipm-emoji" style="font-size:64px;">✨</span></div></div>';
  body.appendChild(left);
  
  // 右侧：信息面板
  var right=document.createElement('div');
  if(isMobile){
    right.style.cssText='width:100%;min-width:0;flex:1;background:#1a1a1a;display:flex;flex-direction:column;overflow-y:auto;';
  } else {
    right.style.cssText='width:280px;min-width:280px;background:#1a1a1a;display:flex;flex-direction:column;overflow-y:auto;';
  }
  right.innerHTML='\
    <div style="padding:16px 16px 12px;border-bottom:1px solid #2a2a2a;position:relative;">\
      <div id="fipm-title" style="font-size:16px;font-weight:700;color:#f1f5f9;margin-bottom:8px;padding-right:28px;"></div>\
      <div style="display:flex;align-items:center;gap:8px;">\
        <span id="fipm-category-tag" style="font-size:11px;padding:2px 8px;border-radius:12px;background:#f3e8ff;color:#7c3aed;"></span>\
      </div>\
      <button type="button" class="fipm-close-inline" onclick="closeFavInsprPreview()" style="position:absolute;top:14px;right:12px;width:26px;height:26px;border-radius:50%;border:none;background:rgba(255,255,255,0.08);color:#9ca3af;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;">×</button>\
    </div>\
    <div style="padding:12px 16px;flex:1;">\
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">\
        <div><div style="font-size:10px;color:#6b7280;">浏览量</div><div id="fipm-views" style="font-size:14px;font-weight:600;color:#e5e7eb;">0</div></div>\
        <div><div style="font-size:10px;color:#6b7280;">使用量</div><div id="fipm-uses" style="font-size:14px;font-weight:600;color:#e5e7eb;">0</div></div>\
        <div><div style="font-size:10px;color:#6b7280;">模型</div><div id="fipm-model" style="font-size:11px;color:#93c5fd;">—</div></div>\
        <div><div style="font-size:10px;color:#6b7280;">价格</div><div id="fipm-price" style="font-size:13px;font-weight:600;color:#10b981;">免费</div></div>\
      </div>\
      <div style="border-top:1px solid #2a2a2a;padding-top:10px;">\
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">\
          <div id="fipm-avatar-fallback" style="width:30px;height:30px;border-radius:50%;background:#6366f1;display:flex;align-items:center;justify-content:center;font-size:12px;color:#fff;font-weight:600;">👤</div>\
          <img id="fipm-avatar-img" src="" alt="" style="width:30px;height:30px;border-radius:50%;object-fit:cover;display:none;">\
          <span id="fipm-author" style="font-size:12px;color:#d1d5db;"></span>\
        </div>\
        <button onclick="useFavInspr()" style="width:100%;padding:9px 0;border-radius:10px;border:none;background:#3b82f6;color:#fff;font-size:13px;font-weight:600;cursor:pointer;">✨ 使用此灵感</button>\
      </div>\
    </div>';
  body.appendChild(right);
  m.appendChild(body);
  if(isMobile){
    var screenClose=document.createElement('button');
    screenClose.type='button';
    screenClose.className='fipm-close-screen';
    screenClose.setAttribute('aria-label','关闭');
    screenClose.textContent='×';
    screenClose.addEventListener('click',function(ev){
      ev.stopPropagation();
      closeFavInsprPreview();
    });
    m.appendChild(screenClose);
  }
  document.body.appendChild(m);
  var modal=m;
  
  document.body.style.overflow='hidden';
  
  // 填充数据
  try{
  if(!modal) return;

  var name=card.getAttribute('data-name')||'—';
  var category=card.getAttribute('data-category')||'图片';
  var views=card.getAttribute('data-views')||'0';
  var uses=card.getAttribute('data-uses')||'0';
  var model=card.getAttribute('data-model')||'—';
  var price=card.getAttribute('data-price')||'免费';
  var author=card.getAttribute('data-author')||'创作者';
  var authorAvatar=card.getAttribute('data-author-avatar')||'';

  // 分类标签样式映射
  var catColors={
    '图片':  {bg:'#f3e8ff',color:'#7c3aed'},
    '视频':  {bg:'#fef3c7',color:'#d97706'},
    '音频':  {bg:'#d1fae5',color:'#059669'},
    '文本':  {bg:'#dbeafe',color:'#2563eb'},
    '3D':    {bg:'#fce7f3',color:'#db2777'},
    '默认':  {bg:'#f3f4f6',color:'#6b7280'}
  };
  var catStyle=catColors[category]||catColors['默认'];

  // 填充分类标签
  var catEl=document.getElementById('fipm-category-tag');
  if(catEl){
    catEl.textContent=category;
    catEl.style.background=catStyle.bg;
    catEl.style.color=catStyle.color;
  }

  // 填充标题
  var titleEl=document.getElementById('fipm-title');
  if(titleEl) titleEl.textContent=name;

  // 填充数据
  var viewsEl=document.getElementById('fipm-views');
  if(viewsEl) viewsEl.textContent=views;
  var usesEl=document.getElementById('fipm-uses');
  if(usesEl) usesEl.textContent=uses;

  // 填充模型
  var modelEl=document.getElementById('fipm-model');
  if(modelEl) modelEl.textContent=model;

  // 填充价格（免费绿色，付费正常色）
  var priceEl=document.getElementById('fipm-price');
  if(priceEl){
    priceEl.textContent=price;
    priceEl.style.color=(price==='免费'||price==='0'||price==='¥0')?'#10b981':'#111827';
  }

  // 填充作者
  var authorEl=document.getElementById('fipm-author');
  if(authorEl) authorEl.textContent=author;

  // 填充作者头像
  var avatarImg=document.getElementById('fipm-avatar-img');
  var avatarFallback=document.getElementById('fipm-avatar-fallback');
  if(avatarImg&&avatarFallback){
    if(authorAvatar){
      avatarImg.src=authorAvatar;
      avatarImg.style.display='block';
      avatarFallback.style.display='none';
    } else {
      avatarImg.style.display='none';
      avatarFallback.style.display='flex';
      // 用姓名首字作为头像字符
      avatarFallback.textContent=author.slice(0,1)||'👤';
    }
  }

  // 媒体展示：尝试读取卡片内图片，否则显示 emoji 占位
  var imgEl=card.querySelector('img');
  var emojiEl=card.querySelector('.text-3xl,.text-2xl,.text-4xl');
  var fipImg=document.getElementById('fipm-image');
  var fipPlaceholder=document.getElementById('fipm-placeholder');
  var fipEmoji=document.getElementById('fipm-emoji');

  // 背景色与卡片同步（提取 gradient 类）
  var mediaBox=document.getElementById('fipm-media-box');
  var gradMatch=(card.innerHTML.match(/from-(\w+-\d+)\s+(?:via-[\w-]+\s+)?to-(\w+-\d+)/)||['','',''])[0];
  var bgColors={
    'slate':['#64748b','#475569'],'gray':['#6b7280','#4b5563'],'zinc':['#71717a','#52525b'],
    'purple':['#a855f7','#7c3aed'],'indigo':['#6366f1','#4338ca'],'blue':['#3b82f6','#1d4ed8'],
    'amber':['#f59e0b','#d97706'],'orange':['#f97316','#ea580c'],'red':['#ef4444','#dc2626'],
    'green':['#22c55e','#16a34a'],'emerald':['#10b981','#059669'],'cyan':['#06b6d4','#0891b2'],
    'pink':['#ec4899','#db2777'],'rose':['#f43f5e','#e11d48']
  };
  // 简单颜色映射
  var cardBg='linear-gradient(135deg,#2a3044,#303850)';
  var fromMatch=(card.innerHTML.match(/from-([\w]+-[\d]+)/)||[])[1];
  if(fromMatch){
    var colorName=fromMatch.split('-')[0];
    var pair=bgColors[colorName];
    if(pair) cardBg='linear-gradient(135deg,'+pair[0]+','+pair[1]+')';
  }
  if(mediaBox) mediaBox.style.background=cardBg;

  var cardType=card.getAttribute('data-type')||'image';
  applyExamplePreviewToMediaBox(mediaBox,cardType,{
    imgEl:fipImg,
    placeholderEl:fipPlaceholder,
    emojiEl:fipEmoji
  });

  modal.style.display='flex';
  document.body.style.overflow='hidden';
  }catch(e){showToast('⚠️ '+e.message);}
};

// 关闭灵感收藏预览
window.closeFavInsprPreview=function(){
  var modal=document.getElementById('fav-inspr-preview-modal');
  if(modal) modal.style.display='none';
  document.body.style.overflow='';
};

// 使用灵感 → 跳转到对应制作页面
window.useFavInspr=function(){
  var card=window._fipCurrentCard;
  var type=card?card.getAttribute('data-type')||'image':'image';
  var name=card?card.getAttribute('data-name')||'灵感':'灵感';
  var pageMap={image:'image',video:'video',audio:'audio',text:'chat'};
  var target=pageMap[type]||'image';
  closeFavInsprPreview();
  if(typeof showPage==='function') showPage(target);
  if(typeof showToast==='function') showToast('✨ 使用灵感「'+name+'」');
};

// ═══════════════════════════════════════════════════════════════
// ─── 收藏 Apps 预览弹窗 ────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════

window._fapCurrentCard=null;
window._fapmCurrentPage=1;
window._fapmTotalPages=4;
window._fapmTemplateHtml=null;

function captureFapmTemplateOnce(){
  if(window._fapmTemplateHtml)return;
  var el=document.getElementById('fav-apps-preview-modal');
  if(el&&el.innerHTML)window._fapmTemplateHtml=el.innerHTML;
}
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',captureFapmTemplateOnce);
}else{
  captureFapmTemplateOnce();
}

function ensureFapmModal(){
  captureFapmTemplateOnce();
  var modal=document.getElementById('fav-apps-preview-modal');
  if(!modal){
    modal=document.createElement('div');
    modal.id='fav-apps-preview-modal';
    modal.className='fapm-modal';
    modal.setAttribute('aria-hidden','true');
    document.body.appendChild(modal);
  }
  if(window._fapmTemplateHtml)modal.innerHTML=window._fapmTemplateHtml;
  return modal;
}

function buildFavAppsWorkspacePayload(card){
  card=card||{};
  var tags=(card.getAttribute('data-app-tags')||'').split(',').filter(Boolean);
  var appId=card.getAttribute('data-app-id')||'';
  var catalog=appId&&window._inspAppsCatalog?window._inspAppsCatalog[appId]:null;
  return{
    title:card.getAttribute('data-name')||'应用',
    desc:card.getAttribute('data-app-desc')||'',
    introHtml:card.getAttribute('data-app-desc')||'',
    uses:card.getAttribute('data-runs')||'16',
    price:'⚡0.7',
    successRate:parseInt(String(card.getAttribute('data-success-rate')||'98').replace(/\D/g,''),10)||98,
    avgDurationSec:parseInt(String(card.getAttribute('data-avg-time')||'45').replace(/\D/g,''),10)||45,
    creatorName:card.getAttribute('data-author')||'创作者',
    creatorDate:card.getAttribute('data-updated')||'',
    tags:tags.length?tags:(catalog&&catalog.tags)||[],
    collectFav:parseInt(card.getAttribute('data-likes')||card.getAttribute('data-favs')||'1',10)||1,
    collectComment:parseInt(card.getAttribute('data-comments')||'2',10)||2,
    worksCount:parseInt(card.getAttribute('data-works')||'3',10)||3,
    commentTabCount:parseInt(card.getAttribute('data-comments')||'0',10)||0,
    hidePublishWork:true,
    runBarLikeCharacterReplace:true,
    fromFavorites:true,
    officialSamples:catalog&&catalog.officialSamples?catalog.officialSamples:[{
      gradient:'linear-gradient(180deg,#f5efe6 0%,#e8dcc8 100%)',
      bannerPoster:true,
      coverImage:'example1.png'
    }]
  };
}

/** 我的收藏 · Apps 卡片入口：旧照时光机直接进工作区（无发布作品、运行条同人物替换） */
window.openFavAppsCard=function(card){
  if(!card)return;
  window._fapCurrentCard=card;
  if(window.isFapmOldPhotoCard(card)&&typeof openOldPhotoTimeMachineWorkspace==='function'){
    openOldPhotoTimeMachineWorkspace(Object.assign(buildFavAppsWorkspacePayload(card),{
      id:'old-photo-time-machine',
      workspaceVariant:'old-photo-time-machine'
    }));
    return;
  }
  openFavAppsPreview(card);
};

window.openFavAppsPreview=function(card){
  if(!card) return;
  window._fapCurrentCard=card;
  window._fapmCurrentPage=1;
  
  var modal=ensureFapmModal();
  document.body.style.overflow='hidden';
  
  try{

  var name      = card.getAttribute('data-name')||'应用名称';
  var desc      = card.getAttribute('data-app-desc')||'';
  var tagsRaw   = card.getAttribute('data-app-tags')||'';
  var likes     = card.getAttribute('data-likes')||'0';
  var runs      = card.getAttribute('data-runs')||'0';
  var author    = card.getAttribute('data-author')||'创作者';
  var avatar    = card.getAttribute('data-author-avatar')||'';
  var updated   = card.getAttribute('data-updated')||'';
  var succ      = card.getAttribute('data-success-rate')||'—';
  var avgTime   = card.getAttribute('data-avg-time')||'—';
  var price     = card.getAttribute('data-price')||'';
  var works     = card.getAttribute('data-works')||'0';
  var comments  = card.getAttribute('data-comments')||'0';
  var emoji     = (card.querySelector('.text-3xl,.text-2xl,.text-4xl')||{textContent:'📦'}).textContent.trim()||'📦';

  // 标题
  var titleEl=document.getElementById('fapm-title');
  if(titleEl) titleEl.textContent=name;

  // 标签
  var tagsEl=document.getElementById('fapm-tags');
  if(tagsEl){
    tagsEl.innerHTML='';
    tagsRaw.split(',').filter(Boolean).forEach(function(t){
      var tag=t.trim();
      var el=document.createElement('span');
      el.textContent=tag;
      el.className='fapm-tag';
      tagsEl.appendChild(el);
    });
  }

  // 数据
  var likesEl=document.getElementById('fapm-likes');
  if(likesEl) likesEl.textContent=likes;
  var runsEl=document.getElementById('fapm-runs');
  if(runsEl) runsEl.textContent=runs;

  // 收藏数
  var favs=card.getAttribute('data-favs')||'0';
  var favC=document.getElementById('fapm-fav-count');
  if(favC) favC.textContent=favs;

  // 创作者
  var authorEl=document.getElementById('fapm-author');
  if(authorEl) authorEl.textContent=author;
  var updatedEl=document.getElementById('fapm-updated');
  if(updatedEl) updatedEl.textContent=updated?updated+' 更新':'';

  // 头像
  var avatarImg=document.getElementById('fapm-avatar-img');
  var avatarFallback=document.getElementById('fapm-avatar-fallback');
  if(avatarImg&&avatarFallback){
    if(avatar){
      avatarImg.src=avatar;
      avatarImg.classList.add('is-visible');
      avatarFallback.style.display='none';
    }else{
      avatarImg.classList.remove('is-visible');
      avatarFallback.style.display='flex';
      avatarFallback.textContent=author.slice(0,1)||'🤖';
    }
  }

  // 运行提示
  var succEl=document.getElementById('fapm-success-rate');
  if(succEl) succEl.textContent=succ;
  var avgEl=document.getElementById('fapm-avg-time');
  if(avgEl) avgEl.textContent=avgTime;

  if(typeof renderFapmParamsForm==='function') renderFapmParamsForm(card);
  if(typeof syncFapmRunBar==='function') syncFapmRunBar(card);
  if(typeof syncFapmPublishWork==='function') syncFapmPublishWork(card);

  // 描述
  var descEl=document.getElementById('fapm-desc');
  if(descEl) descEl.textContent=desc||'暂无应用介绍';

  // 作品/评论数
  var wcEl=document.getElementById('fapm-works-count');
  if(wcEl) wcEl.textContent=works;
  var ccEl=document.getElementById('fapm-comments-count');
  if(ccEl) ccEl.textContent=comments;

  // 主图 emoji
  var mainEmoji=document.getElementById('fapm-main-emoji');
  var fapmImg=document.getElementById('fapm-main-img');
  var fapmMainBox=document.getElementById('fapm-main-img-box');
  if(fapmMainBox){
    applyExamplePreviewToMediaBox(fapmMainBox,'image',{
      imgEl:fapmImg,
      emojiEl:mainEmoji
    });
  }else if(mainEmoji) mainEmoji.textContent=emoji;

  // 页码
  window._fapmTotalPages=parseInt(works)||4;
  var pageInd=document.getElementById('fapm-page-indicator');
  if(pageInd) pageInd.textContent='1/'+window._fapmTotalPages;

  // 重置 Tab + 描述折叠状态
  switchFapmTab('works');
  var introBox=document.getElementById('fapm-intro-box');
  if(introBox){
    introBox.classList.add('is-collapsed');
    var introBtn=introBox.querySelector('.fapm-main-bottom-title');
    if(introBtn) introBtn.setAttribute('aria-expanded','false');
  }
  window._fapmIntroExpanded=false;

  renderFapmPublicWorks(card);

  var favBtn=document.getElementById('fapm-fav-btn');
  if(favBtn) favBtn.classList.add('is-faved');

  if(typeof syncFapmHeaderLayout==='function') syncFapmHeaderLayout(modal,card);

  modal.classList.add('fapm-open');
  modal.setAttribute('aria-hidden','false');
  if(typeof setMobilePreviewOpen==='function'&&window.matchMedia&&window.matchMedia('(max-width:768px)').matches){
    setMobilePreviewOpen(true);
  }
  }catch(e){showToast('⚠️ '+e.message);}
};

window.closeFavAppsPreview=function(){
  var modal=document.getElementById('fav-apps-preview-modal');
  if(modal){
    modal.classList.remove('fapm-open');
    modal.setAttribute('aria-hidden','true');
  }
  if(typeof setMobilePreviewOpen==='function') setMobilePreviewOpen(false);
  document.body.style.overflow='';
};

// 切换作品/评论 Tab
window.switchFapmTab=function(tab){
  var wBtn=document.getElementById('fapm-works-tab-btn');
  var cBtn=document.getElementById('fapm-comments-tab-btn');
  var grid=document.getElementById('fapm-works-grid');
  var comments=document.getElementById('fapm-comments-section');
  if(tab==='works'){
    if(wBtn) wBtn.classList.add('active');
    if(cBtn) cBtn.classList.remove('active');
    if(grid) grid.hidden=false;
    if(comments) comments.hidden=true;
  }else{
    if(cBtn) cBtn.classList.add('active');
    if(wBtn) wBtn.classList.remove('active');
    if(grid) grid.hidden=true;
    if(comments) comments.hidden=false;
  }
};

// 翻页
window.fapmPrev=function(){
  if(window._fapmCurrentPage>1){ window._fapmCurrentPage--; _fapmUpdatePage(); }
};
window.fapmNext=function(){
  if(window._fapmCurrentPage<window._fapmTotalPages){ window._fapmCurrentPage++; _fapmUpdatePage(); }
};
function _fapmUpdatePage(){
  var ind=document.getElementById('fapm-page-indicator');
  if(ind) ind.textContent=window._fapmCurrentPage+'/'+window._fapmTotalPages;
}

// 折叠介绍（与人物替换工作区一致）
window.toggleFapmIntro=function(btn){
  var box=document.getElementById('fapm-intro-box');
  if(!box) return;
  window._fapmIntroExpanded=!window._fapmIntroExpanded;
  box.classList.toggle('is-collapsed',!window._fapmIntroExpanded);
  var trigger=btn||box.querySelector('.fapm-main-bottom-title');
  if(trigger) trigger.setAttribute('aria-expanded',window._fapmIntroExpanded?'true':'false');
};

// ── 点赞/收藏切换 ──────────────────────────────────────
window._fapmLiked=false;
window._fapmFaved=true; // 已经是收藏状态（从收藏Tab进入）

window.fapmToggleLike=function(){
  window._fapmLiked=!window._fapmLiked;
  var btn=document.getElementById('fapm-like-btn');
  if(btn) btn.classList.toggle('is-liked',window._fapmLiked);
  var cnt=document.getElementById('fapm-likes');
  var val=parseInt(cnt?.textContent||'0');
  var newVal=val+(window._fapmLiked?1:-1);
  if(cnt) cnt.textContent=String(newVal);
  showToast(window._fapmLiked?'❤️ 已点赞':'💔 取消点赞');
};

window.fapmToggleFav=function(){
  window._fapmFaved=!window._fapmFaved;
  var btn=document.getElementById('fapm-fav-btn');
  if(btn) btn.classList.toggle('is-faved',window._fapmFaved);
  // 更新收藏数
  var favC=document.getElementById('fapm-fav-count');
  if(favC){
    var v=parseInt(favC.textContent||'0');
    favC.textContent=String(v+(window._fapmFaved?1:-1));
  }
  showToast(window._fapmFaved?'⭐ 已收藏':'💨 取消收藏');
};

// ── 关注切换 ──────────────────────────────────────────
window._fapmFollowed=false;
window.fapmToggleFollow=function(){
  window._fapmFollowed=!window._fapmFollowed;
  var btn=document.getElementById('fapm-follow-btn');
  if(!btn)return;
  btn.classList.toggle('is-followed',window._fapmFollowed);
  btn.innerHTML=window._fapmFollowed?'已关注':'<span aria-hidden="true">+</span> 关注';
  showToast(window._fapmFollowed?'✅ 已关注':'👋 取消关注');
};

// ── 运行（打开人物替换类工作区，与 Apps 人物替换页一致） ──
window.fapmRunApp=function(){
  var card=window._fapCurrentCard;
  if(!card){ showToast('⚠️ 未选择应用'); return; }
  var name=card.getAttribute('data-name')||'应用';
  var wsPayload=buildFavAppsWorkspacePayload(card);
  closeFavAppsPreview();
  if(window.isFapmOldPhotoCard(card)&&typeof openOldPhotoTimeMachineWorkspace==='function'){
    openOldPhotoTimeMachineWorkspace(Object.assign(wsPayload,{
      id:'old-photo-time-machine',
      workspaceVariant:'old-photo-time-machine'
    }));
    return;
  }
  if(typeof openOmniImage2Workspace==='function'){
    openOmniImage2Workspace(Object.assign(wsPayload,{
      workspaceVariant:'character-replace',
      id:'character-replace-v3'
    }));
    return;
  }
  showToast('🚀 正在运行「'+name+'」…');
};

// ── 发布作品 → 打开编辑产品弹窗 ──────────────────────────
window.fapmPublishWork=function(){
  var card=window._fapCurrentCard;
  if(!card){ showToast('⚠️ 未选择作品'); return; }
  var name=card.getAttribute('data-name')||'';
  var type=card.getAttribute('data-type')||'image';

  var editPage=document.getElementById('myworks-edit-page');
  if(!editPage){ showToast('⚠️ 编辑页面不可用'); return; }

  var titleInput=document.getElementById('myworks-edit-title');
  if(titleInput) titleInput.value=name;
  var promptInput=document.getElementById('myworks-edit-prompt');
  if(promptInput) promptInput.value=name;

  // 根据类型设置分类标签
  var tagColors={
    image:['#eff6ff|#3b82f6|#bfdbfe','#f0fdf4|#22c55e|#bbf7d0','#fdf2f8|#ec4899|#fbcfe8'],
    video:['#eff6ff|#3b82f6|#bfdbfe','#fefce8|#eab308|#fef08a'],
    audio:['#f0fdf4|#22c55e|#bbf7d0','#fdf2f8|#ec4899|#fbcfe8'],
    text:['#eff6ff|#3b82f6|#bfdbfe','#f0fdf4|#22c55e|#bbf7d0']
  };
  var colors=tagColors[type]||tagColors['image'];
  var tagContainer=document.querySelector('#myworks-edit-page .myworks-edit-tags');
  if(tagContainer){
    tagContainer.innerHTML='';
    colors.forEach(function(c){
      var parts=c.split('|');
      var label=document.createElement('span');
      label.textContent=parts[1]?parts[1]:'标签';
      label.style.cssText='font-size:11px;padding:4px 12px;border-radius:20px;background:'+(parts[0]||'#f3f4f6')+';color:'+(parts[1]||'#374151')+';border:1px solid '+(parts[2]||'transparent')+';cursor:pointer;';
      label.onclick=function(){ tagContainer.querySelectorAll('span').forEach(function(s){s.style.borderColor=s.getAttribute('data-orig-border')||'transparent';s.style.opacity='0.6';}); label.style.borderColor='#3b82f6';label.style.opacity='1'; };
      label.setAttribute('data-orig-border',parts[2]||'transparent');
      tagContainer.appendChild(label);
    });
  }

  openMyworksEditPage();
};

// ─── 下载当前作品 ─────────────────────────────────────────────
window.mwpDownload=function(){
  var c=window._mwpCurrentCard;
  var name=c?c.getAttribute('data-name')||'作品':'作品';
  showToast('⬇ 下载中：'+name);
};

// ─── 发布当前作品 ─────────────────────────────────────────────
window.mwpPublish=function(){
  var c=window._mwpCurrentCard;
  if(c){
    var btn=c.querySelector('button[title="发布"]');
    if(btn){ btn.click(); return; }
  }
  openModal('myworks-publish-modal');
};

// ─── 删除当前作品 ─────────────────────────────────────────────
window.mwpDelete=function(){
  var c=window._mwpCurrentCard;
  if(!c) return;
  var name=c.getAttribute('data-name')||'作品';
  if(!confirm('确定删除「'+name+'」？此操作不可撤销。')) return;
  closeMyworksPreview();
  c.style.transition='transform 0.2s,opacity 0.2s';
  c.style.transform='scale(0.8)';
  c.style.opacity='0';
  setTimeout(function(){c.remove();},200);
  showToast('🗑️ 已删除：'+name);
};

// ─── 来源图标（在卡片右上角显示） ─────────────────────────────
var _mwpSourceSvgs={
  model:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
  inspiration:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  apps:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>'
};
var _mwpSourceColors={model:'#60a5fa',inspiration:'#fbbf24',apps:'#34d399'};
var _mwpSourceBg={model:'rgba(96,165,250,.15)',inspiration:'rgba(251,191,36,.15)',apps:'rgba(52,211,153,.15)'};
var _mwpSourceLabels={model:'大模型',inspiration:'灵感广场',apps:'Apps'};

function renderMyworksSourceIcons(){
  var cards=document.querySelectorAll('#page-myassets .masonry-card');
  for(var i=0;i<cards.length;i++){
    var c=cards[i];
    if(c.querySelector('.mwp-source-badge')) continue;
    var src=c.getAttribute('data-source')||'model';
    if(!_mwpSourceSvgs[src]) src='model';
    var badge=document.createElement('span');
    badge.className='mwp-source-badge';
    badge.style.cssText='position:absolute;top:6px;right:6px;z-index:11;width:22px;height:22px;border-radius:6px;display:flex;align-items:center;justify-content:center;cursor:default;transition:opacity .2s;';
    badge.style.background=_mwpSourceBg[src];
    badge.style.color=_mwpSourceColors[src];
    badge.innerHTML=_mwpSourceSvgs[src];
    badge.title=_mwpSourceLabels[src];
    var container=c.querySelector('.rounded-xl');
    if(container) container.appendChild(badge);
  }
}

// 全选
document.addEventListener('click',function(e){
  var btn=e.target.closest('#myworks-select-all');
  if(!btn||!window._myworksManageMode) return;
  e.stopPropagation();
  var activeTab=getVisibleMyworksTab();
  if(!activeTab) return;
  var cards=activeTab.querySelectorAll('.masonry-card');
  var isAll=btn.getAttribute('data-all')==='true';
  cards.forEach(function(c){
    if(isAll) c.classList.remove('selected');
    else c.classList.add('selected');
  });
  btn.setAttribute('data-all',isAll?'false':'true');
  btn.textContent=isAll?'全选':'取消全选';
  updateBatchBar();
});

// 更新底部批量操作栏
function updateBatchBar(){
  var bar=document.getElementById('myworks-batch-bar');
  if(!bar) return;
  var onMyassets=document.getElementById('page-myassets')?.classList.contains('active');
  if(!window._myworksManageMode||!onMyassets){
    bar.classList.remove('is-visible');
    bar.setAttribute('aria-hidden','true');
    return;
  }
  positionMyworksBatchBar();
  bar.classList.add('is-visible');
  bar.setAttribute('aria-hidden','false');
  var selected=document.querySelectorAll('#page-myassets .masonry-card.selected');
  var count=bar.querySelector('#myworks-batch-count');
  if(count) count.textContent=selected.length;
  var dlBtn=bar.querySelector('button[onclick*="batchDownloadSelected"]');
  var delBtn=bar.querySelector('button[onclick*="batchDeleteSelected"]');
  var disabled=selected.length===0;
  if(dlBtn){dlBtn.disabled=disabled;dlBtn.style.opacity=disabled?'0.45':'1';dlBtn.style.pointerEvents=disabled?'none':'';}
  if(delBtn){delBtn.disabled=disabled;delBtn.style.opacity=disabled?'0.45':'1';delBtn.style.pointerEvents=disabled?'none':'';}
}

// 批量删除
window.batchDeleteSelected=function(){
  var selected=document.querySelectorAll('#page-myassets .masonry-card.selected');
  if(selected.length===0){showToast('请先选择作品');return;}
  if(!confirm('确定要删除选中的 '+selected.length+' 个作品吗？此操作不可撤销。')) return;
  selected.forEach(function(card){card.remove();});
  showToast('🗑️ 已删除');
  updateBatchBar();
};

// 批量下载
window.batchDownloadSelected=function(){
  var selected=document.querySelectorAll('#page-myassets .masonry-card.selected');
  if(selected.length===0){showToast('请先选择作品');return;}
  selected.forEach(function(card){
    var name=card.getAttribute('data-name')||'作品';
    var type=card.getAttribute('data-type')||'file';
    showToast('📥 下载: '+name+' ('+type+')');
  });
  setTimeout(function(){showToast('✅ 已加入下载队列 ('+selected.length+' 项)');},800);
};

function addImageRefFromAsset(name,dataUrl){
  if(typeof imageRefFiles==='undefined') return false;
  if(imageRefFiles.length>=14){
    showToast('⚠️ 最多14张参考图');
    return false;
  }
  var icons=['🖼️','🌃','📦','👤','🎋','🍜','🚀','🏔️'];
  var fills=['374151','1e40af','b45309','9d174d','475569','c2410c','4338ca','047857'];
  var idx=imageRefFiles.length%icons.length;
  var url=dataUrl||("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect fill='%23"+fills[idx]+"' width='96' height='96'/%3E%3Ctext x='48' y='54' text-anchor='middle' font-size='28'%3E"+encodeURIComponent(icons[idx])+"%3C/text%3E%3C/svg%3E");
  imageRefFiles.push({
    id:'asset_'+Date.now()+'_'+Math.random().toString(36).substr(2,6),
    dataUrl:url,
    isAsset:true,
    assetName:name
  });
  if(typeof renderImageRefThumbnails==='function') renderImageRefThumbnails();
  var preview=document.getElementById('image-ref-preview-area');
  if(preview) preview.classList.remove('hidden');
  return true;
}

window.switchAssetTab=function(tab,sourceEl){
  if(sourceEl) pressAnim(sourceEl);
  else if(typeof event!=='undefined'&&event&&event.target&&String(event.type||'')==='click') pressAnim(event.target);
  document.querySelectorAll('.asset-tab').forEach(function(t){t.classList.remove('bg-blue-100','dark:bg-blue-900/30','text-blue-600');t.classList.add('bg-gray-100','dark:bg-gray-800');});
  var active=document.querySelector('.asset-tab[data-tab="'+tab+'"]');if(active){active.classList.add('bg-blue-100','dark:bg-blue-900/30','text-blue-600');active.classList.remove('bg-gray-100','dark:bg-gray-800');}
  var imgTab=document.getElementById('asset-tab-image');
  var videoTab=document.getElementById('asset-tab-video');
  var textTab=document.getElementById('asset-tab-text');
  var audioTab=document.getElementById('asset-tab-audio');
  if(imgTab) imgTab.classList.toggle('hidden',tab!=='image');
  if(videoTab) videoTab.classList.toggle('hidden',tab!=='video');
  if(textTab) textTab.classList.toggle('hidden',tab!=='text');
  if(audioTab) audioTab.classList.toggle('hidden',tab!=='audio');
  updateAssetUploadHint(tab);
};
function findAssetSelectionIndex(key,tab){
  for(var i=0;i<assetSelected.length;i++){
    if(assetSelected[i].key===key&&assetSelected[i].tab===tab) return i;
  }
  return -1;
}

function clearAssetModalSelection(){
  assetSelected=[];
  document.querySelectorAll('#asset-modal .asset-record-selected').forEach(function(el){
    el.classList.remove('asset-record-selected','ring-2','ring-inset','ring-blue-500','border-blue-500','border-2');
  });
  updateAssetConfirmLabel();
}

function updateAssetConfirmLabel(){
  var label=document.getElementById('asset-count-label');
  if(label) label.textContent=assetSelected.length>0?'已选 '+assetSelected.length+' 个':'共 15 个资产';
}

function initAssetModalStaticRecords(){
  stripAssetCardActionsMobile();
  document.querySelectorAll('#asset-tab-image .asset-img-item').forEach(function(el){
    ensureAssetCardActions(el,'image');
  });
  document.querySelectorAll('#asset-tab-video .asset-video-item').forEach(function(el){
    ensureAssetCardActions(el,'video');
  });
  stripAssetCardActionsMobile();
  document.querySelectorAll('#asset-tab-text .asset-text-item').forEach(function(el){
    if(el.classList.contains('user-uploaded-asset')) return;
    if(el.dataset.assetText) return;
    var titleEl=el.querySelector('.text-xs.font-medium');
    var name=titleEl?(titleEl.textContent||'').replace(/^📝\s*/,'').trim():'';
    if(name) el.dataset.name=name;
    if(!el.getAttribute('onclick')) el.setAttribute('onclick',"toggleAssetRecord(this,'text',event)");
  });
  document.querySelectorAll('#asset-tab-audio .asset-audio-item').forEach(function(el){
    if(el.classList.contains('user-uploaded-asset')) return;
    if(!el.getAttribute('onclick')) el.setAttribute('onclick',"toggleAssetRecord(this,'audio',event)");
    el.querySelectorAll('button').forEach(function(btn){
      if((btn.textContent||'').trim()==='选择') btn.remove();
    });
  });
}

window.toggleAssetRecord=function(el,tab,ev){
  if(ev&&ev.target&&ev.target.closest&&ev.target.closest('button')) return;
  if(el&&el.dataset.assetLongPressBlock==='1') return;
  if(!el) return;
  var key=el.dataset.assetId||el.dataset.name;
  if(!key) return;
  var idx=findAssetSelectionIndex(key,tab);
  if(idx>=0){
    assetSelected.splice(idx,1);
    el.classList.remove('asset-record-selected','ring-2','ring-inset','ring-blue-500','border-blue-500','border-2');
  }else{
    assetSelected.push({
      key:key,
      tab:tab,
      name:el.dataset.name||key,
      assetId:el.dataset.assetId||'',
      textContent:el.dataset.assetText||el.dataset.assetContent||''
    });
    var ringCls=el.classList.contains('asset-img-item')||el.classList.contains('asset-video-item')
      ?['asset-record-selected']
      :['asset-record-selected','ring-2','ring-blue-500','border-2','border-blue-500'];
    el.classList.add.apply(el.classList,ringCls);
  }
  updateAssetConfirmLabel();
};

window.confirmAssetPicker=function(){
  if(assetSelected.length===0){
    showToast('⚠️ 请先选择资产');
    return;
  }
  if(assetPickTarget&&assetPickTarget.fittingRoom&&aiwsState.oiwsVariant==='fitting-room'){
    var frApplied=_oiwsFrConfirmAssets(assetPickTarget.frPickMode||'append');
    if(frApplied>0){
      showToast('✅ 已添加 '+frApplied+' 张图片');
    }else{
      showToast('⚠️ 请选择图片类资产');
    }
    assetPickTarget=null;
    clearAssetModalSelection();
    closeModal('asset-modal');
    return;
  }
  if(assetPickTarget&&assetPickTarget.videoOutfit&&aiwsState.oiwsVariant==='video-outfit'){
    var uoSel=assetSelected[0];
    var uoApplied=0;
    if(uoSel){
      if(assetPickTarget.uoPickMode==='music'){
        if(uoSel.tab==='audio'||uoSel.name){
          uoApplied=_oiwsUoConfirmAssets('music',uoSel);
        }
      }else if(uoSel.tab==='image'){
        uoApplied=_oiwsUoConfirmAssets(assetPickTarget.uoPickMode||'photo',uoSel);
      }
    }
    if(uoApplied>0){
      showToast(assetPickTarget.uoPickMode==='music'?'✅ 已选择音乐':'✅ 已选择图片');
    }else{
      showToast(assetPickTarget.uoPickMode==='music'?'⚠️ 请选择音频类资产':'⚠️ 请选择图片类资产');
    }
    assetPickTarget=null;
    clearAssetModalSelection();
    closeModal('asset-modal');
    return;
  }
  var isImagePage=document.getElementById('page-image')&&document.getElementById('page-image').classList.contains('active');
  var isVideoPage=document.getElementById('page-video')&&document.getElementById('page-video').classList.contains('active');
  var applied=0;
  var textParts=[];
  assetSelected.forEach(function(sel){
    var asset=findUserAsset(sel.key);
    var name=sel.name||sel.key;
    var dataUrl=asset&&asset.dataUrl;
    if(sel.tab==='image'){
      if(isVideoPage&&assetPickTarget&&assetPickTarget.page==='video'){
        var media=assetPickTarget.mediaType||'image';
        if(addVideoRefFromAsset(name,dataUrl,media)) applied++;
      }else if(assetPickTarget&&assetPickTarget.page==='oiws'){
        var slotIdx=assetPickTarget.slotIndex;
        if(assetPickTarget.mediaType==='audio'&&name){
          aiwsState.ttsAudioName=name;
          if(!aiwsState.uploadPreviews)aiwsState.uploadPreviews=['',''];
          aiwsState.uploadPreviews[0]='audio';
          if(aiwsState.oiwsVariant==='heartmula')refreshOiwsHeartMulaAudioSlot(0);
          else refreshOiwsTtsAudioSlot(0);
          applied++;
        }else if(assetPickTarget.mediaType==='video'&&typeof slotIdx==='number'){
          if(aiwsState.oiwsVariant==='ecommerce-digital-human'&&slotIdx===0){
            aiwsState.ecomDhVideoName=name||'口播参考.mp4';
            if(!aiwsState.uploadPreviews)aiwsState.uploadPreviews=[ECOM_DH_VIDEO_THUMB,'audio',ECOM_DH_FACE_IMAGE];
            aiwsState.uploadPreviews[0]=dataUrl||ECOM_DH_VIDEO_THUMB;
            refreshOiwsEcomDhVideoSlot(0);
          }else if(aiwsState.oiwsVariant==='video-face-swap'){
            aiwsState.vfsVideoName=name||'参考视频.mp4';
            if(!aiwsState.uploadPreviews)aiwsState.uploadPreviews=[VFS_MODEL_IMAGE,VFS_VIDEO_THUMB];
            aiwsState.uploadPreviews[slotIdx]=dataUrl||VFS_VIDEO_THUMB;
            refreshOiwsVfsVideoSlot(slotIdx);
          }else if(aiwsState.oiwsVariant==='video-recast'&&slotIdx===0){
            aiwsState.vrcVideoName=name||'参考视频.mp4';
            if(!aiwsState.uploadPreviews)aiwsState.uploadPreviews=[VRC_DEMO_VIDEO,''];
            aiwsState.uploadPreviews[0]=dataUrl||VRC_DEMO_VIDEO;
            renderVideoRecastStudio();
          }else{
            aiwsState.motionVideoName=name||'参考视频.mp4';
            if(!aiwsState.uploadPreviews)aiwsState.uploadPreviews=['',MOTION_TRANSFER_VIDEO_THUMB];
            aiwsState.uploadPreviews[slotIdx]=dataUrl||MOTION_TRANSFER_VIDEO_THUMB;
            refreshOiwsMotionVideoSlot(slotIdx);
          }
          applied++;
        }else if(assetPickTarget.mediaType==='audio'&&typeof slotIdx==='number'&&aiwsState.oiwsVariant==='ecommerce-digital-human'&&slotIdx===1){
          aiwsState.ttsAudioName=name;
          if(!aiwsState.uploadPreviews)aiwsState.uploadPreviews=[ECOM_DH_VIDEO_THUMB,'audio',ECOM_DH_FACE_IMAGE];
          aiwsState.uploadPreviews[1]='audio';
          refreshOiwsEcomDhAudioSlot(1);
          applied++;
        }else if(typeof slotIdx==='number'&&(dataUrl||(aiwsState.oiwsVariant==='video-recast'&&sel.tab==='image'))){
          var pickedUrl=dataUrl;
          if(!pickedUrl&&aiwsState.oiwsVariant==='video-recast')pickedUrl=_oiwsFrResolveSelImageUrl(sel);
          if(!pickedUrl)return;
          if(!aiwsState.uploadPreviews){
            aiwsState.uploadPreviews=aiwsState.oiwsVariant==='video-recast'?[VRC_DEMO_VIDEO,'']:OMNI_IMAGE2_UPLOAD_SLOTS.map(function(s){return s.preview;});
          }
          aiwsState.uploadPreviews[slotIdx]=pickedUrl;
          if(aiwsState.oiwsVariant==='fitting-room')renderFittingRoomStudio();
          else if(aiwsState.oiwsVariant==='video-recast')renderVideoRecastStudio();
          else if(aiwsState.oiwsVariant==='motion-transfer'&&slotIdx===1)refreshOiwsMotionVideoSlot(slotIdx);
          else if(aiwsState.oiwsVariant==='video-face-swap'&&slotIdx===1)refreshOiwsVfsVideoSlot(slotIdx);
          else if(aiwsState.oiwsVariant==='ecommerce-digital-human'&&slotIdx===2)refreshOiwsUploadSlot(slotIdx);
          else refreshOiwsUploadSlot(slotIdx);
          applied++;
        }
      }else if(sel.tab==='audio'&&assetPickTarget&&assetPickTarget.page==='oiws'){
        if(name){
          var audioSlot=assetPickTarget.slotIndex;
          aiwsState.ttsAudioName=name;
          if(aiwsState.oiwsVariant==='ecommerce-digital-human'&&audioSlot===1){
            if(!aiwsState.uploadPreviews)aiwsState.uploadPreviews=[ECOM_DH_VIDEO_THUMB,'audio',ECOM_DH_FACE_IMAGE];
            aiwsState.uploadPreviews[1]='audio';
            refreshOiwsEcomDhAudioSlot(1);
          }else if(aiwsState.oiwsVariant==='heartmula'){
            if(!aiwsState.uploadPreviews)aiwsState.uploadPreviews=['audio',''];
            aiwsState.uploadPreviews[0]='audio';
            refreshOiwsHeartMulaAudioSlot(0);
          }else{
            if(!aiwsState.uploadPreviews)aiwsState.uploadPreviews=['',''];
            aiwsState.uploadPreviews[0]='audio';
            refreshOiwsTtsAudioSlot(0);
          }
          applied++;
        }
      }else if(isImagePage||assetPickTarget&&assetPickTarget.page==='image'){
        if(addImageRefFromAsset(name,dataUrl)) applied++;
      }else{
        addRefImage();
        applied++;
      }
    }else if(sel.tab==='video'){
      if(isVideoPage&&assetPickTarget&&assetPickTarget.page==='video'){
        if(addVideoRefFromAsset(name,dataUrl,'video')) applied++;
      }else applied++;
    }else if(sel.tab==='text'){
      var text=(asset&&(asset.content||asset.preview))||sel.textContent||'';
      if(!text&&sel.assetId){
        var textEl=document.querySelector('.asset-text-item[data-asset-id="'+sel.assetId+'"]');
        if(textEl) text=textEl.dataset.assetText||textEl.dataset.assetContent||'';
      }
      if(!text&&sel.name){
        document.querySelectorAll('.asset-text-item').forEach(function(el){
          if(!text&&el.dataset.name===sel.name) text=el.dataset.assetText||el.dataset.assetContent||'';
        });
      }
      if(text) textParts.push(text);
    }else if(sel.tab==='audio'){
      if(isVideoPage&&assetPickTarget&&assetPickTarget.page==='video'){
        if(addVideoRefFromAsset(name,dataUrl,'audio')) applied++;
      }else applied++;
    }
  });
  if(textParts.length){
    var ta=getAssetImportTextarea();
    if(ta&&applyImportedTextToTextarea(ta,textParts)){
      applied+=textParts.length;
    }
  }
  var toastMsg=applied>0?'✅ 已确认选择 '+applied+' 项':'✅ 已确认';
  if(textParts.length&&assetPickTarget&&assetPickTarget.page==='audio'){
    toastMsg='✅ 已将 '+textParts.length+' 条文本导入配音输入框';
  }else if(textParts.length&&document.getElementById('page-audio')?.classList.contains('active')){
    toastMsg='✅ 已将 '+textParts.length+' 条文本导入配音输入框';
  }
  showToast(toastMsg);
  assetPickTarget=null;
  clearAssetModalSelection();
  closeModal('asset-modal');
};

window.pickAsset=function(el,type,ev){
  toggleAssetRecord(el,type||'image',ev||(typeof event!=='undefined'?event:null));
};
window.pickVideoAsset=function(el,assetId,ev){
  toggleAssetRecord(el,'video',ev||(typeof event!=='undefined'?event:null));
};
window.confirmMultiAsset=function(){
  confirmAssetPicker();
};

window.importUserTextAsset=function(id){
  var a=findUserAsset(id);
  if(!a) return;
  importTextAsset(a.name,a.content||'');
};
// ===== 角色管理：Tab切换 + 字符计数 =====
(function(){document.querySelectorAll('.role-tab').forEach(function(t){t.addEventListener('click',function(){pressAnim(this);
  document.querySelectorAll('.role-tab').forEach(function(x){x.classList.remove('active','text-blue-600','border-blue-500');x.classList.add('text-gray-500','border-transparent');});
  this.classList.add('active','text-blue-600','border-blue-500');this.classList.remove('text-gray-500','border-transparent');
  document.getElementById('role-tab-list').classList.toggle('hidden',this.dataset.tab!=='list');
  document.getElementById('role-tab-create').classList.toggle('hidden',this.dataset.tab!=='create');
});});
document.getElementById('new-role-prompt')?.addEventListener('input',function(){var c=document.getElementById('prompt-char-count');if(c)c.textContent=this.value.length;});})();

// ===== 模板详情数据 (灵感广场功能卡片) =====
const appTemplateData = {
  'Viral Presets': {
    title: '🔥 Viral Presets模板', icon: '🔥',
    preview: ['原图', '预设效果'], upload1: '上传图片', upload2: '选择风格▼', up1Icon: '🖼️', up2Icon: '🎨',
    desc: '一键应用热门预设风格，快速生成专业级图片作品。',
    steps: ['1. 上传需要处理的图片', '2. 选择预设风格模板', '3. 点击生成，AI自动应用风格'],
    price: '⚡0.3/次', uses: '18.5k次使用', rating: '👍 98%好评率', creator: '👤 创作者: 平台官方'
  },
  '换脸 / 换装': {
    title: '🔄 AI智能换脸/换装模板', icon: '🔄',
    preview: ['原图', '换脸后效果'], upload1: '上传人脸', upload2: '上传源图', up1Icon: '📷', up2Icon: '📷',
    desc: '上传一张目标人脸图片和一张源图片，AI将自动将人脸替换到目标图片中。',
    steps: ['1. 上传目标人脸图片（清晰正面照效果最佳）', '2. 上传需要换脸的源图片', '3. 点击生成，AI自动完成换脸'],
    price: '⚡0.5/次', uses: '12.3k次使用', rating: '👍 96%好评率', creator: '👤 创作者: 平台官方'
  },
  'AI 漫剧工坊': {
    title: '🎬 AI漫剧工坊模板', icon: '🎬',
    preview: ['剧本', '生成漫剧'], upload1: '上传剧本', upload2: '选择风格▼', up1Icon: '📄', up2Icon: '🎨',
    desc: '输入故事剧本或梗概，AI自动生成完整漫画剧集。',
    steps: ['1. 输入或上传故事剧本', '2. 选择漫画风格', '3. 点击生成，AI自动分镜生成漫剧'],
    price: '⚡1.0/次', uses: '6.8k次使用', rating: '👍 94%好评率', creator: '👤 创作者: 平台官方'
  },
  'AI 音乐工坊': {
    title: '🎵 AI音乐工坊模板', icon: '🎵',
    preview: ['歌词/提示', '生成音乐'], upload1: '输入歌词', upload2: '选择风格▼', up1Icon: '🎤', up2Icon: '🎵',
    desc: '输入歌词或音乐风格描述，AI自动生成音乐或配音。',
    steps: ['1. 输入歌词或风格描述', '2. 选择音乐风格', '3. 点击生成，AI自动创作音乐'],
    price: '⚡0.8/次', uses: '9.1k次使用', rating: '👍 95%好评率', creator: '👤 创作者: 平台官方'
  }
};
// ===== 品牌系列数据 =====
const seriesData = {
  comic: {
    title: 'DBIM·漫剧工坊', icon: '🎬',
    gradient: 'from-purple-500 to-pink-500',
    desc: '本系列展示社区最优质的AI漫剧作品，从分镜到配音，看创作者如何用GUID.AI讲述精彩故事。',
    works: '128 部作品', creators: '56 人', plays: '23.4w',
    worksList: [
      {icon:'🎬',color:'from-purple-400 to-pink-400',name:'AI觉醒·第一集',uses:'2.3k使用'},
      {icon:'🎬',color:'from-blue-400 to-cyan-400',name:'星际迷途·预告',uses:'1.8k使用'},
      {icon:'🎬',color:'from-amber-400 to-orange-400',name:'都市传说·第三集',uses:'1.5k使用'},
      {icon:'🎬',color:'from-green-400 to-teal-400',name:'未来简史·试播',uses:'1.2k使用'},
      {icon:'🎬',color:'from-red-400 to-pink-400',name:'暗黑童话·第二集',uses:'980使用'},
      {icon:'🎬',color:'from-indigo-400 to-purple-400',name:'机械纪元·第四集',uses:'856使用'},
      {icon:'🎬',color:'from-teal-400 to-green-400',name:'山海经·异兽录',uses:'723使用'},
      {icon:'🎬',color:'from-pink-400 to-rose-400',name:'校园奇谈·第一集',uses:'654使用'}
    ]
  },
  design: {
    title: 'DBIM·设计魔方', icon: '🎨',
    gradient: 'from-blue-500 to-cyan-500',
    desc: '本系列展示社区最优质的商业设计作品，从品牌VI到营销海报，看设计师如何用GUID.AI提升效率。',
    works: '96 套设计', creators: '42 人', plays: '18.7w',
    worksList: [
      {icon:'🎨',color:'from-blue-400 to-cyan-400',name:'极简品牌VI·全套',uses:'3.1k使用'},
      {icon:'🎨',color:'from-purple-400 to-pink-400',name:'国潮海报系列',uses:'2.6k使用'},
      {icon:'🎨',color:'from-amber-400 to-orange-400',name:'产品包装·3款',uses:'2.1k使用'},
      {icon:'🎨',color:'from-green-400 to-teal-400',name:'社交媒体模板',uses:'1.9k使用'},
      {icon:'🎨',color:'from-rose-400 to-red-400',name:'电商主图设计',uses:'1.4k使用'},
      {icon:'🎨',color:'from-indigo-400 to-blue-400',name:'LOGO创意提案',uses:'1.1k使用'},
      {icon:'🎨',color:'from-teal-400 to-emerald-400',name:'画册排版设计',uses:'890使用'},
      {icon:'🎨',color:'from-pink-400 to-fuchsia-400',name:'APP界面概念',uses:'720使用'}
    ]
  },
  vision: {
    title: 'DBIM·视界', icon: '🌄',
    gradient: 'from-cyan-500 to-teal-500',
    desc: '本系列展示社区最惊艳的电影级AI视频作品，从科幻大片到唯美风光，感受AI视觉震撼。',
    works: '64 部影片', creators: '38 人', plays: '35.6w',
    worksList: [
      {icon:'🌄',color:'from-cyan-400 to-blue-400',name:'赛博都市·概念片',uses:'4.2k使用'},
      {icon:'🌄',color:'from-emerald-400 to-teal-400',name:'自然奇观·延时',uses:'3.5k使用'},
      {icon:'🌄',color:'from-violet-400 to-purple-400',name:'科幻短片·预告',uses:'2.8k使用'},
      {icon:'🌄',color:'from-amber-400 to-yellow-400',name:'古风意境·短片',uses:'2.3k使用'},
      {icon:'🌄',color:'from-rose-400 to-pink-400',name:'城市夜景·航拍',uses:'1.7k使用'},
      {icon:'🌄',color:'from-blue-400 to-indigo-400',name:'微观世界·创意',uses:'1.3k使用'},
      {icon:'🌄',color:'from-orange-400 to-red-400',name:'末日废土·片段',uses:'980使用'},
      {icon:'🌄',color:'from-lime-400 to-green-400',name:'四季更替·混剪',uses:'810使用'}
    ]
  },
  music: {
    title: 'DBIM·音悦', icon: '🎵',
    gradient: 'from-pink-500 to-rose-500',
    desc: '本系列展示社区最多元的AI音乐和配音作品，从流行歌曲到影视配音，听见AI的创造力。',
    works: '156 首作品', creators: '68 人', plays: '28.9w',
    worksList: [
      {icon:'🎵',color:'from-pink-400 to-rose-400',name:'治愈系纯音·钢琴',uses:'3.8k使用'},
      {icon:'🎵',color:'from-blue-400 to-indigo-400',name:'电子舞曲·Remix',uses:'3.2k使用'},
      {icon:'🎵',color:'from-amber-400 to-yellow-400',name:'影视配乐·史诗',uses:'2.7k使用'},
      {icon:'🎵',color:'from-green-400 to-emerald-400',name:'广告配音·男声',uses:'2.1k使用'},
      {icon:'🎵',color:'from-purple-400 to-violet-400',name:'古风歌曲·原创',uses:'1.6k使用'},
      {icon:'🎵',color:'from-cyan-400 to-teal-400',name:'ASMR·自然环境',uses:'1.2k使用'},
      {icon:'🎵',color:'from-red-400 to-orange-400',name:'播客开场·定制',uses:'950使用'},
      {icon:'🎵',color:'from-fuchsia-400 to-pink-400',name:'儿童故事·配音',uses:'760使用'}
    ]
  }
};
// ===== 预设模板数据 (聊天页) =====
const presetTemplates = {
  '爆款写作模板': {
    desc: '"从爬文到爆款文案，精通各类文体风格，让你的每一个字都有力量"',
    skills: '• 公众号爆款文章<br>• 小红书种草文案<br>• 短视频脚本<br>• 产品详情页文案<br>• 品牌Slogan<br>• 演讲稿/主持词',
    model: 'GPT-5.4', role: '写作助手', params: '温度 0.8, 最大token 4096',
    example: '<div class="mb-1"><span class="text-blue-600 font-medium">用户:</span> 帮我写一篇关于「人工智能」的知乎风格回答</div><div><span class="text-green-600 font-medium">AI:</span> 谢邀。作为一名AI领域的从业者，我认为未来十年人工智能将在医疗、教育等领域产生深远影响...</div>',
    uses: '12.3k次使用', rating: '👍 96%好评率', icon: '✍️',
    welcome: '你好！我是写作助手，精通各类文体风格。\n\n请问你今天需要写什么内容？我可以帮你：\n• 写公众号爆款文章\n• 写小红书种草文案\n• 写短视频脚本\n• 写产品详情页文案\n• 写品牌Slogan\n\n告诉我你的需求，我来帮你完成！'
  },
  '社媒文案模板': {
    desc: '"专注社交媒体文案创作，让品牌在社交平台脱颖而出，引爆用户互动"',
    skills: '• 微博文案<br>• 小红书笔记<br>• 抖音脚本<br>• 微信公众号推文<br>• 朋友圈营销文案',
    model: 'Gemini 3.1 Pro', role: '文案助手', params: '温度 0.9, 最大token 2048',
    example: '<div class="mb-1"><span class="text-blue-600 font-medium">用户:</span> 帮我写一个新款咖啡的小红书种草文案</div><div><span class="text-green-600 font-medium">AI:</span> ☕️ 救命！这杯咖啡让我放弃了奶茶！作为一个每天靠咖啡续命的打工人...</div>',
    uses: '8.7k次使用', rating: '👍 94%好评率', icon: '📝',
    welcome: '你好！我是文案助手，专注社交媒体文案创作。\n\n我可以帮你写：\n• 吸睛的小红书笔记\n• 病毒式微博文案\n• 抖音爆款脚本\n• 公众号爆款推文\n\n告诉我你的品牌和需求，开干吧！'
  },
  '商业分析模板': {
    desc: '"深度商业分析与战略建议，基于数据驱动的方法论，助你做出明智决策"',
    skills: '• 行业研究报告<br>• 竞品分析<br>• SWOT分析<br>• 商业计划书<br>• 市场调研报告',
    model: 'grok-4.3', role: '商业顾问', params: '温度 0.5, 最大token 8192',
    example: '<div class="mb-1"><span class="text-blue-600 font-medium">用户:</span> 分析一下新能源车市场的竞争格局</div><div><span class="text-green-600 font-medium">AI:</span> 当前新能源车市场呈现"一超多强"格局。比亚迪凭借垂直整合优势领跑...</div>',
    uses: '6.5k次使用', rating: '👍 95%好评率', icon: '💼',
    welcome: '你好！我是商业顾问，精通行业分析与战略规划。\n\n我擅长：\n• 撰写深度行业研究报告\n• 竞品分析与差异化策略\n• 商业模式评估与优化\n• 市场机会洞察\n\n请告诉我你的分析需求！'
  },
  '数据洞察模板': {
    desc: '"从海量数据中提炼洞察，用数据讲故事，驱动业务增长"',
    skills: '• 数据分析报告<br>• 数据可视化<br>• 用户行为分析<br>• A/B测试分析<br>• 增长率分析',
    model: 'GPT-5.4', role: '数据顾问', params: '温度 0.4, 最大token 4096',
    example: '<div class="mb-1"><span class="text-blue-600 font-medium">用户:</span> 帮我分析一下最近一个月的用户留存数据</div><div><span class="text-green-600 font-medium">AI:</span> 基于提供的留存数据，D1留存率环比提升5.2%，但D7留存下降了3.1%...</div>',
    uses: '4.2k次使用', rating: '👍 93%好评率', icon: '📊',
    welcome: '你好！我是数据顾问，帮你从数据中发现价值。\n\n我可以帮你：\n• 分析用户行为数据\n• 制作数据可视化报告\n• 发现增长机会\n• 优化数据指标体系\n\n请上传或描述你的数据！'
  },
  '代码审查模板': {
    desc: '"专业代码审查与优化建议，支持多种编程语言，提升代码质量和可维护性"',
    skills: '• JavaScript/TypeScript<br>• Python<br>• Java/C#<br>• Go/Rust<br>• SQL优化',
    model: 'opus-4-7', role: '代码助手', params: '温度 0.3, 最大token 8192',
    example: '<div class="mb-1"><span class="text-blue-600 font-medium">用户:</span> 请审查这段React代码，指出性能问题</div><div><span class="text-green-600 font-medium">AI:</span> 发现以下问题：1. 缺少useMemo缓存，会导致不必要的重渲染...</div>',
    uses: '9.8k次使用', rating: '👍 97%好评率', icon: '💻',
    welcome: '你好！我是代码助手，帮你写出更好的代码。\n\n我擅长：\n• 代码审查与优化\n• 重构建议\n• 设计模式应用\n• 最佳实践指导\n\n贴代码给我看看吧！'
  },
  // ===== 图片预设模板 =====
  '赛博朋克': {
    desc: '"赛博朋克风格，霓虹灯管、高科技低生活，充满未来感的视觉冲击"',
    skills: '• 霓虹色调<br>• 未来城市<br>• 机械义体<br>• 雨天夜景<br>• 全息投影',
    model: 'Nano Banana Pro', role: '', params: '风格化, 16:9',
    example: '<div class="mb-1"><span class="text-blue-600 font-medium">提示:</span> 赛博朋克城市夜景，霓虹灯，雨夜</div><div><span class="text-green-600 font-medium">效果:</span> 自动生成赛博朋克风格图片，带霓虹光效和雨滴反射</div>',
    uses: '8.5k次使用', rating: '👍 95%好评率', icon: '🏙️',
    prompt: 'A futuristic cyberpunk city at night, neon lights reflecting on wet streets, flying cars, holographic billboards, volumetric lighting, cinematic composition, 8K, unreal engine 5 style',
    ratio: '16:9 横屏', quality: '4K 超清'
  },
  '国风水墨': {
    desc: '"中国传统水墨画风格，意境深远，留白写意，展现东方美学"',
    skills: '• 水墨渲染<br>• 山水意境<br>• 留白构图<br>• 书法题字<br>• 禅意风格',
    model: 'Nano Banana Pro', role: '', params: '风格化, 1:1',
    example: '<div class="mb-1"><span class="text-blue-600 font-medium">提示:</span> 国风水墨山水，远山近水，云雾缭绕</div><div><span class="text-green-600 font-medium">效果:</span> 生成水墨风格山水画，笔触自然，意境空灵</div>',
    uses: '6.2k次使用', rating: '👍 97%好评率', icon: '🎋',
    prompt: '中国传统水墨山水画，远山如黛，近水含烟，云雾缭绕山间，一叶扁舟悠然漂于江面，留白写意，笔触洒脱，意境空灵深远，宣纸质感',
    ratio: '16:9 横屏', quality: '2K 高清'
  },
  '胶片质感': {
    desc: '"复古胶片摄影风格，颗粒感、暖色调，营造怀旧氛围"',
    skills: '• 胶片颗粒<br>• 暖色调<br>• 漏光效果<br>• 复古边框<br>• 褪色质感',
    model: 'Nano Banana Pro', role: '', params: '高清, 3:2',
    example: '<div class="mb-1"><span class="text-blue-600 font-medium">提示:</span> 胶片质感街拍，暖阳，复古建筑</div><div><span class="text-green-600 font-medium">效果:</span> 自动添加胶片颗粒和暖色调滤镜，营造复古氛围</div>',
    uses: '4.7k次使用', rating: '👍 93%好评率', icon: '📷',
    prompt: '复古胶片摄影，暖阳洒在百年欧式建筑上，街头咖啡店，行人漫步，胶片颗粒感，暖色调，漏光效果，怀旧氛围，35mm胶片质感，黄金时刻光线',
    ratio: '4:3 标准', quality: '高清'
  },
  '产品白底': {
    desc: '"专业产品摄影白底图，适合电商展示，突出产品细节"',
    skills: '• 纯白背景<br>• 精准打光<br>• 细节清晰<br>• 阴影自然<br>• 多角度展示',
    model: 'Nano Banana Pro', role: '', params: '高清, 1:1',
    example: '<div class="mb-1"><span class="text-blue-600 font-medium">提示:</span> 产品白底图，高清，电商风格</div><div><span class="text-green-600 font-medium">效果:</span> 生成专业级产品白底展示图，光线均匀，细节清晰</div>',
    uses: '11.2k次使用', rating: '👍 96%好评率', icon: '📦',
    prompt: '产品白底摄影图，纯白背景，均匀柔光，产品细节清晰可见，阴影自然柔和，电商展示风格，高清质感，商业摄影布光',
    ratio: '1:1 正方形', quality: '4K 超清'
  },
  // ===== 视频预设模板 =====
  'AI漫剧': {
    desc: '"AI漫剧风格，将故事以漫画分镜形式呈现，融合动画与实拍效果"',
    skills: '• 漫画分镜<br>• 角色设计<br>• 动态效果<br>• 配音配乐<br>• 剧情连贯',
    model: 'VIDU-音乐MV', role: '', params: '高清, 16:9',
    example: '<div class="mb-1"><span class="text-blue-600 font-medium">提示:</span> 科幻漫剧，未来城市，主角觉醒</div><div><span class="text-green-600 font-medium">效果:</span> 自动生成漫画分镜视频，带配音和特效</div>',
    uses: '5.6k次使用', rating: '👍 94%好评率', icon: '🎭',
    prompt: 'AI漫剧风格，科幻题材，未来城市背景，主角发现自身AI身份，漫画分镜叙事，动态转场，赛博朋克色调，中二热血风格，带旁白解说',
    resolution: '2K', ratio: '16:9'
  },
  '产品广告': {
    desc: '"产品广告视频风格，突出产品卖点，节奏明快，视觉冲击力强"',
    skills: '• 产品特写<br>• 卖点展示<br>• 节奏剪辑<br>• BGM搭配<br>• 品牌调性',
    model: 'Kling 2.0', role: '', params: '高清, 16:9',
    example: '<div class="mb-1"><span class="text-blue-600 font-medium">提示:</span> 新款智能手机广告，科技感，炫酷</div><div><span class="text-green-600 font-medium">效果:</span> 自动生成产品广告视频，节奏紧凑，视觉冲击</div>',
    uses: '8.2k次使用', rating: '👍 96%好评率', icon: '📱',
    prompt: '产品广告视频，新款科技产品展示，极简白色背景，产品360度旋转展示，光线追踪质感，动态粒子效果，节奏明快，高端品牌调性，15秒短片',
    resolution: '4K', ratio: '16:9'
  },
  '音乐MV': {
    desc: '"音乐MV风格，画面与音乐节奏同步，创意转场，艺术化表达"',
    skills: '• 节奏剪辑<br>• 创意转场<br>• 调色风格化<br>• 歌词可视化<br>• 氛围渲染',
    model: 'Sora2', role: '', params: '高清, 16:9',
    example: '<div class="mb-1"><span class="text-blue-600 font-medium">提示:</span> 流行歌曲MV，城市夜景，霓虹灯光</div><div><span class="text-green-600 font-medium">效果:</span> 自动生成音乐MV风格视频，画面与节奏同步</div>',
    uses: '7.1k次使用', rating: '👍 95%好评率', icon: '🎵',
    prompt: '音乐MV风格，流行歌曲视觉化，城市夜景背景，霓虹灯光，主角行走在雨中，慢动作镜头，色彩浓郁，胶片质感，歌词字幕浮现，艺术化表达',
    resolution: '4K', ratio: '16:9'
  },
  '短视频': {
    desc: '"短视频风格，竖屏拍摄，前3秒抓眼球，信息密度高，适合社交平台传播"',
    skills: '• 竖屏构图<br>• 快节奏剪辑<br>• 字幕特效<br>• 热门BGM<br>• 口播配合',
    model: 'Runway Gen-4', role: '', params: '高清, 9:16',
    example: '<div class="mb-1"><span class="text-blue-600 font-medium">提示:</span> 旅行vlog，快速剪辑，风景切换</div><div><span class="text-green-600 font-medium">效果:</span> 自动生成短视频，适合抖音/快手发布</div>',
    uses: '12.5k次使用', rating: '👍 97%好评率', icon: '📱',
    prompt: '竖屏短视频，快节奏剪辑，每2秒切换场景，热门BGM背景音乐，字幕特效跟随节奏，口播旁白，信息密度高，适合抖音/快手传播，年轻化风格',
    resolution: '1080P', ratio: '9:16'
  },
  // ===== 音频预设模板 =====
  '语音克隆': {
    desc: '"语音克隆模板，快速克隆目标音色，适用于配音、有声读物、播客等场景"',
    skills: '• 音色克隆<br>• 语音合成<br>• 情感表达<br>• 语速控制<br>• 多语言支持',
    model: '海螺语音克隆 2.8', role: '', params: '语速 1.0x, 语调 标准',
    example: '<div class="mb-1"><span class="text-blue-600 font-medium">提示:</span> 克隆一段温柔女声朗读散文</div><div><span class="text-green-600 font-medium">效果:</span> 自动克隆音色并生成语音</div>',
    uses: '15.2k次使用', rating: '👍 96%好评率', icon: '🎤',
    prompt: '请用温柔自然的语调朗读以下内容，语速适中，情感饱满，注意停顿和重音：\n\n在每一个清晨，阳光透过窗帘的缝隙洒进来，新的一天开始了。生活就像一杯茶，不会苦一辈子，但总会苦一阵子。'
  },
  '音乐生成': {
    desc: '"AI音乐生成模板，根据描述自动创作音乐，支持多种风格和情感"',
    skills: '• 旋律创作<br>• 和声编排<br>• 风格模仿<br>• 节奏设计<br>• 配器搭配',
    model: 'ElevenLabs Turbo', role: '', params: '语速 1.0x, 语调 标准',
    example: '<div class="mb-1"><span class="text-blue-600 font-medium">提示:</span> 生成一段治愈系钢琴曲</div><div><span class="text-green-600 font-medium">效果:</span> 自动生成钢琴曲，温暖治愈风格</div>',
    uses: '11.8k次使用', rating: '👍 94%好评率', icon: '🎵',
    prompt: '请生成一段治愈系纯音乐，钢琴为主奏乐器，配合轻柔的弦乐背景， tempo 80 BPM，C大调，温暖舒缓的氛围，适合放松、冥想或阅读时聆听，时长约2分钟'
  },
  '有声读物': {
    desc: '"有声读物模板，将文字转化为富有情感的语音，适合长篇朗读"',
    skills: '• 文本转语音<br>• 情感朗读<br>• 角色区分<br>• 节奏控制<br>• 音质优化',
    model: 'Fish Audio', role: '', params: '语速 1.0x, 语调 标准',
    example: '<div class="mb-1"><span class="text-blue-600 font-medium">提示:</span> 朗读一段小说开头</div><div><span class="text-green-600 font-medium">效果:</span> 自动生成有情感的有声读物</div>',
    uses: '9.5k次使用', rating: '👍 95%好评率', icon: '📖',
    prompt: '请用讲故事的口吻朗读以下内容，语速平缓，根据情节变化调整语气和情感：\n\n在很久很久以前，有一个被群山环绕的王国。这个王国四季如春，人民安居乐业。国王和王后有一个可爱的女儿，她的笑声像银铃一样清脆。'
  },
  '播客开场': {
    desc: '"播客开场模板，生成专业的播客开场白，包含背景音乐和人声"',
    skills: '• 开场设计<br>• 背景音乐<br>• 人声录制<br>• 混音处理<br>• 品牌调性',
    model: 'GPT-4o Voice', role: '', params: '语速 1.2x, 语调 激昂',
    example: '<div class="mb-1"><span class="text-blue-600 font-medium">提示:</span> 生成一个科技播客的开场白</div><div><span class="text-green-600 font-medium">效果:</span> 自动生成专业的播客开场</div>',
    uses: '7.3k次使用', rating: '👍 97%好评率', icon: '🎙️',
    prompt: '请用充满活力的声音录制以下播客开场白，语速稍快，语调热情：\n\n「欢迎收听《科技前沿》，我是你的主持人。在这个快速变化的时代，每一天都有新的技术突破。今天，我们将探讨人工智能如何重塑我们的生活方式。系好安全带，让我们一起开启这段探索之旅！」'
  }
};
function openSeriesDetail(key) {
  const d = seriesData[key];
  if(!d) return;
  const head = document.getElementById('series-header');
  const gradMap = {comic:'from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700',design:'from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700',vision:'from-cyan-50 to-teal-50 dark:from-gray-800 dark:to-gray-700',music:'from-pink-50 to-rose-50 dark:from-gray-800 dark:to-gray-700'};
  head.className = 'rounded-2xl p-5 mb-5 bg-gradient-to-br ' + gradMap[key];
  head.innerHTML = `<div class="flex items-center gap-2 mb-2"><span class="text-2xl">${d.icon}</span><span class="text-lg font-bold">${d.title}</span></div><p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3">${d.desc}</p><div class="flex items-center gap-4 text-[11px] text-gray-400"><span>📊 本系列已收录 ${d.works}</span><span>👥 本月创作者 ${d.creators}</span><span>📈 总播放量 ${d.plays}</span></div>`;
  // 更新作品网格
  const grid = document.getElementById('series-work-grid');
  grid.innerHTML = d.worksList.map((w, idx) => `<div class="series-work bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all" data-index="${idx}" data-series="${key}"><div class="aspect-[4/3] bg-gradient-to-br ${w.color} flex items-center justify-center text-white text-lg">${w.icon}</div><div class="p-2.5"><div class="text-xs font-semibold truncate">${w.name}</div><div class="text-[10px] text-gray-400">${w.uses}</div></div></div>`).join('');
  // 作品点击 → 跳转对应详情页
  grid.querySelectorAll('.series-work').forEach(el => {
    el.addEventListener('click', function() {
      const idx = this.dataset.index;
      const item = d.worksList[idx];
      if(!item) return;
      if(key === 'comic') { showPage('comic-detail'); showToast('🎬 进入「' + item.name + '」'); }
      else if(key === 'design') { showPage('design-detail'); showToast('🖼️ 进入「' + item.name + '」'); }
      else if(key === 'vision') { showPage('vision-detail'); showToast('🎬 进入「' + item.name + '」'); }
      else if(key === 'music') { showPage('music-detail'); showToast('🎵 进入「' + item.name + '」'); }
      else { showToast('📺 查看「' + item.name + '」详情'); }
    });
  });
  showPage('series-detail');
}
function openPresetTemplate(name) {
  const d = presetTemplates[name];
  if(!d) return;
  document.getElementById('tm-title').textContent = '📋 ' + name;
  document.getElementById('tm-desc').textContent = d.desc;
  document.getElementById('tm-skills').innerHTML = '<div class="font-medium text-[10px] text-gray-400 mb-1">擅长领域：</div>' + d.skills;
  document.getElementById('tm-model').textContent = d.model;
  document.getElementById('tm-role').textContent = d.role;
  document.getElementById('tm-params').textContent = d.params;
  document.getElementById('tm-example').innerHTML = d.example;
  document.getElementById('tm-uses').textContent = '📊 使用数据: ' + d.uses;
  document.getElementById('tm-rating').textContent = '👍 ' + d.rating;
  document.getElementById('tm-apply-btn').dataset.template = name;
  document.getElementById('tm-fav').classList.remove('text-yellow-500');
  document.getElementById('tm-fav').textContent = '☆';
  openModal('template-modal');
}
function openAppTemplate(name) {
  const d = appTemplateData[name];
  if(!d) return;
  document.getElementById('atm-title').textContent = d.title;
  document.getElementById('atm-preview').innerHTML = `<div class="w-28 h-28 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center text-gray-400 text-[10px] text-center leading-relaxed">${d.preview[0]}</div><div class="text-lg text-gray-400">→</div><div class="w-28 h-28 bg-gradient-to-br from-purple-200 to-blue-200 dark:from-purple-800/30 dark:to-blue-800/30 rounded-lg flex items-center justify-center text-gray-400 text-[10px] text-center leading-relaxed">${d.preview[1]}</div>`;
  document.getElementById('atm-desc').innerHTML = `${d.desc}<div class="mt-2 text-[10px] text-gray-400">⚙️ 使用步骤：<br>${d.steps.join('<br>')}</div>`;
  document.getElementById('atm-price').textContent = d.price;
  document.getElementById('atm-up1-label').textContent = d.upload1;
  document.getElementById('atm-up2-label').textContent = d.upload2;
  document.getElementById('atm-up1-icon').textContent = d.up1Icon;
  document.getElementById('atm-up2-icon').textContent = d.up2Icon;
  document.getElementById('atm-uses').textContent = d.uses;
  document.getElementById('atm-rating').textContent = d.rating;
  document.getElementById('atm-creator').textContent = d.creator;
  document.getElementById('atm-fav').classList.remove('text-yellow-500');
  document.getElementById('atm-fav').textContent = '☆';
  openModal('app-template-modal');
}

// ===== 多模型协作：增删模型 =====
function addCollabModel() {
  const sel = document.getElementById('collab-new-select');
  const n = sel.value;
  if(!n) { showToast('请先选择一个模型'); return; }
  // 检查是否已存在同名模型
  const existing = [...document.querySelectorAll('#collab-model-list .model-card .text-xs.font-medium')];
  if(existing.some(el => el.textContent === n)) { showToast(`⚠️ 模型「${n}」已在列表中`); return; }
  const list = document.getElementById('collab-model-list');
  const card = document.createElement('div');
  card.className = 'model-card flex items-center gap-2 px-2 py-1.5 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg anim-fade-up';
  card.innerHTML = `<input type="checkbox" checked class="accent-purple-500 w-3 h-3"><span class="text-xs font-medium">${n}</span><button class="remove-model text-[9px] text-red-400 hover:text-red-600" onclick="removeCollabModel(this)">✕</button>`;
  list.appendChild(card);
  // 同步到总结模型下拉
  const summarySel = document.getElementById('collab-summary-select');
  const opt = document.createElement('option');
  opt.textContent = n;
  summarySel.appendChild(opt);
  sel.value = '';
  showToast(`✅ 已添加模型「${n}」`);
}
function removeCollabModel(btn) {
  const card = btn.closest('.model-card');
  if(!card) return;
  const name = card.querySelector('.text-xs.font-medium')?.textContent || '';
  // 从总结模型下拉删除对应选项
  const sel = document.getElementById('collab-summary-select');
  for(let opt of sel.options) {
    if(opt.textContent === name) { opt.remove(); break; }
  }
  card.style.transition = 'all .2s';
  card.style.opacity = '0';
  card.style.transform = 'scale(0.8)';
  setTimeout(() => card.remove(), 200);
  showToast(`🗑️ 已移除模型「${name}」`);
}
function syncCollabSummary() {
  const sel = document.getElementById('collab-summary-select');
  if(!sel) return;
  const names = [...document.querySelectorAll('#collab-model-list .model-card .text-xs.font-medium')].map(el => el.textContent);
  const current = sel.value;
  sel.innerHTML = names.map(n => `<option>${n}</option>`).join('');
  if([...sel.options].some(o => o.textContent === current)) sel.value = current;
}

// ===== 多模型协作：取消协作 =====
function cancelCollab() {
  pressAnim(this);
  if(typeof closeChatMobileSheet==='function')closeChatMobileSheet();
  document.getElementById('collab-panel')?.classList.add('hidden');
  collabMode = false;
  collabModels = [];
  collabSummary = '';
  const btn = document.getElementById('collab-toggle-btn');
  if(btn){
    btn.classList.remove('border-purple-200','dark:border-purple-700','text-purple-600','bg-gradient-to-r','from-purple-50','to-pink-50','dark:from-purple-900/20','dark:to-pink-900/20');
    btn.classList.add('border-gray-200','dark:border-gray-600','text-gray-400');
  }
  document.getElementById('exit-collab-btn')?.classList.add('hidden');
  const msgs = document.getElementById('chat-messages');
  if(msgs) {
    msgs.innerHTML = '<div class="flex justify-center py-8 text-gray-400 text-xs"><div class="text-center"><div class="text-2xl mb-1">💬</div><div>请输入问题开始对话</div></div></div>';
  }
  if(typeof syncChatMobileToolIcons==='function')syncChatMobileToolIcons();
  showToast('已取消多模型协作');
}

// ===== 多模型协作：切换协作模式 =====
function toggleCollabMode(btn) {
  // 如果已在协作模式，点击则退出
  if(collabMode) {
    exitCollabMode();
    return;
  }
  // 否则打开配置面板
  pressAnim(btn);
  const panel = document.getElementById('collab-panel');
  if(panel) panel.classList.toggle('hidden');
  if(!panel?.classList.contains('hidden')) syncCollabSummary();
  showToast('⚡ 打开多模型协作配置面板');
}

// ===== 多模型协作：退出协作模式（工具栏X按钮）=====
function exitCollabMode() {
  // 恢复按钮为灰色未激活状态
  const btn = document.getElementById('collab-toggle-btn');
  if(btn) {
    btn.classList.remove('border-purple-200', 'dark:border-purple-700', 'text-purple-600', 'bg-gradient-to-r', 'from-purple-50', 'to-pink-50', 'dark:from-purple-900/20', 'dark:to-pink-900/20');
    btn.classList.add('border-gray-200', 'dark:border-gray-600', 'text-gray-400');
  }
  // 隐藏退出按钮
  const exitBtn = document.getElementById('exit-collab-btn');
  if(exitBtn) exitBtn.classList.add('hidden');
  // 隐藏配置面板
  const panel = document.getElementById('collab-panel');
  if(panel) panel.classList.add('hidden');
  // 重置协作状态
  collabMode = false;
  collabModels = [];
  collabSummary = '';
  // 移除聊天区域中的协作状态提示（保留AI回复）
  const collabStatus = document.querySelector('.collab-status');
  if(collabStatus) collabStatus.remove();
  if(typeof syncChatMobileToolIcons==='function')syncChatMobileToolIcons();
  showToast('已退出多模型协作模式');
}

// ===== 多模型协作：开始协作 =====
function startCollab() {
  const names = [...document.querySelectorAll('#collab-model-list .model-card input:checked')].map(cb => cb.nextElementSibling?.textContent || '');
  const summary = document.getElementById('collab-summary-select')?.value || names[0] || 'GPT-4 Turbo';
  if(names.length < 2) { showToast('⚠️ 请至少选择2个模型参与协作'); return; }
  
  collabMode = true;
  collabModels = names;
  collabSummary = summary;
  
  // 将按钮变亮（激活状态）
  const btn = document.getElementById('collab-toggle-btn');
  if(btn) {
    btn.classList.remove('border-gray-200', 'dark:border-gray-600', 'text-gray-400');
    btn.classList.add('border-purple-200', 'dark:border-purple-700', 'text-purple-600', 'bg-gradient-to-r', 'from-purple-50', 'to-pink-50', 'dark:from-purple-900/20', 'dark:to-pink-900/20');
  }
  
  const panel = document.getElementById('collab-panel');
  if(panel) panel.classList.add('hidden');
  if(typeof closeChatMobileSheet==='function')closeChatMobileSheet();
  if(typeof syncChatMobileToolIcons==='function')syncChatMobileToolIcons();
  const msgs = document.getElementById('chat-messages');
  if(msgs) {
    msgs.innerHTML = `<div class="collab-status bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-3 mb-3 anim-fade-up"><div class="flex items-center justify-between mb-2"><span class="text-xs font-semibold text-purple-700 dark:text-purple-300">⚡ 多模型协作模式已开启</span><button onclick="exitCollab()" class="text-[10px] px-2 py-0.5 border border-purple-300 dark:border-purple-700 rounded hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-600">退出协作</button></div><div class="text-[11px] text-gray-500"><div>🤖 参与模型: ${names.map(n=>'['+n+']').join(' ')} <span class="text-gray-400">共${names.length}个模型</span></div><div>✨ 总结模型: ${summary}</div></div></div><div class="flex justify-center py-8 text-gray-400 text-xs"><div class="text-center"><div class="text-2xl mb-1">💬</div>请输入问题开始多模型协作</div></div>`;
  }
  showToast('⚡ 多模型协作模式已开启');
}

// ===== Modal globals (供 inline onclick 调用) =====
window.openModal = function(id, opts) {
  opts = opts || {};
  var preserve = opts.preserve || [];
  var el=document.getElementById(id);
  if(!el) return;
  document.querySelectorAll('.modal-overlay.open').forEach(function(m){
    if(m.id!==id && preserve.indexOf(m.id) < 0) m.classList.remove('open');
  });
  el.classList.add('open');
  document.body.style.overflow='hidden';
  if(id==='notif-settings-modal'&&typeof window.applyNotifPrefsToUI==='function'){
    window.applyNotifPrefsToUI(window.loadNotifPrefs(),'modal');
  }
  if(id==='asset-modal'){
    if(typeof bindAssetModalMobileLongPress==='function') bindAssetModalMobileLongPress();
    if(typeof initAssetModalStaticRecords==='function'){
      try{initAssetModalStaticRecords();}catch(e){console.error('initAssetModalStaticRecords',e);}
    }
    if(typeof layoutAssetModalByDate==='function'){
      try{layoutAssetModalByDate();}catch(e){console.error('layoutAssetModalByDate',e);}
    }
  }
};
window.closeModal = function(id) {
  if(id==='voice-clone-modal'&&typeof stopVoiceCloneRecording==='function') stopVoiceCloneRecording(true);
  if(id==='voice-picker-modal'&&typeof stopVoicePreview==='function') stopVoicePreview();
  var el=document.getElementById(id);
  if(el) el.classList.remove('open');
  if(!document.querySelector('.modal-overlay.open')) document.body.style.overflow='';
};
window.openPasswordLoginModal=function(){
  closeModal('login-modal');
  openModal('password-login-modal');
};
window.backToLoginModal=function(){
  closeModal('password-login-modal');
  openModal('login-modal');
};
window.closeAllModals=function(){
  if(typeof stopVoicePreview==='function') stopVoicePreview();
  if(typeof hidePromptOptimizeProgress==='function') hidePromptOptimizeProgress();
  document.querySelectorAll('.modal-overlay.open').forEach(function(m){m.classList.remove('open');});
  if(typeof closeProfileBindDrawer==='function') closeProfileBindDrawer();
  if(typeof closeProfilePasswordDrawer==='function') closeProfilePasswordDrawer();
  document.body.style.overflow='';
};

// ===== 个人中心 · 换绑手机/邮箱（分步验证，禁止免验证换绑） =====
window.PROFILE_BIND_DATA={
  phoneFull:'13812341234',
  phoneMasked:'+86 138****1234',
  emailFull:'user@example.com',
  emailMasked:'u****er@example.com'
};
var _profileBindState={flow:null,step:1,phoneVerified:false,emailVerified:false,codeTimers:{}};

function _profileBindEl(id){return document.getElementById(id);}

function _profileBindNormPhone(v){
  return String(v||'').replace(/\D/g,'').slice(-11);
}

function _profileBindValidPhone(v){
  var p=_profileBindNormPhone(v);
  return /^1\d{10}$/.test(p);
}

function _profileBindValidEmail(v){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v||'').trim());
}

function _profileBindResetForm(){
  ['phone-old-code','phone-new-number','phone-new-code','email-old-code','email-new-address','email-new-code'].forEach(function(id){
    var el=_profileBindEl(id);
    if(el){el.value='';el.classList.remove('is-error');}
  });
  ['phone-new-same-error','email-new-same-error'].forEach(function(id){
    var el=_profileBindEl(id);
    if(el) el.hidden=true;
  });
  Object.keys(_profileBindState.codeTimers).forEach(function(k){
    clearInterval(_profileBindState.codeTimers[k]);
    delete _profileBindState.codeTimers[k];
  });
  ['phone-old-code-btn','phone-new-code-btn','email-old-code-btn','email-new-code-btn'].forEach(function(id){
    var btn=_profileBindEl(id);
    if(!btn) return;
    btn.disabled=false;
    if(id.indexOf('phone')>=0) btn.textContent='获取验证码';
    else btn.textContent='发送验证码';
  });
}

function _profileBindShowStep(flow,step){
  document.querySelectorAll('.profile-bind-step').forEach(function(s){s.hidden=true;});
  var panel=document.getElementById(flow+'-bind-step-'+step);
  if(panel) panel.hidden=false;
  _profileBindState.step=step;
  var back=_profileBindEl('profile-bind-drawer-back');
  if(back) back.style.display=step>1?'flex':'none';
  document.querySelectorAll('#profile-bind-step-dots .profile-bind-dot').forEach(function(dot){
    dot.classList.toggle('is-active',parseInt(dot.getAttribute('data-step-dot'),10)===step);
  });
}

function _profileBindSyncUi(){
  var oldCode=_profileBindEl('phone-old-code');
  var next1=_profileBindEl('phone-step1-next');
  if(next1&&oldCode) next1.disabled=!/^\d{4,6}$/.test(oldCode.value.trim());
  var newPhone=_profileBindEl('phone-new-number');
  var sameErr=_profileBindEl('phone-new-same-error');
  var newCodeBtn=_profileBindEl('phone-new-code-btn');
  var submitPhone=_profileBindEl('phone-step2-submit');
  if(newPhone){
    var same=_profileBindValidPhone(newPhone.value)&&_profileBindNormPhone(newPhone.value)===PROFILE_BIND_DATA.phoneFull;
    if(sameErr){
      sameErr.hidden=!same;
      newPhone.classList.toggle('is-error',same);
    }
    if(newCodeBtn) newCodeBtn.disabled=!_profileBindValidPhone(newPhone.value)||same;
    if(submitPhone){
      var nc=_profileBindEl('phone-new-code');
      submitPhone.disabled=!(_profileBindValidPhone(newPhone.value)&&!same&&nc&&/^\d{4,6}$/.test(nc.value.trim()));
    }
  }
  var emailOldCode=_profileBindEl('email-old-code');
  var emailNext1=_profileBindEl('email-step1-next');
  if(emailNext1&&emailOldCode) emailNext1.disabled=!/^\d{4,6}$/.test(emailOldCode.value.trim());
  var newEmail=_profileBindEl('email-new-address');
  var emailSameErr=_profileBindEl('email-new-same-error');
  var emailNewCodeBtn=_profileBindEl('email-new-code-btn');
  var submitEmail=_profileBindEl('email-step2-submit');
  if(newEmail){
    var eSame=_profileBindValidEmail(newEmail.value)&&newEmail.value.trim().toLowerCase()===PROFILE_BIND_DATA.emailFull.toLowerCase();
    if(emailSameErr){
      emailSameErr.hidden=!eSame;
      newEmail.classList.toggle('is-error',eSame);
    }
    if(emailNewCodeBtn) emailNewCodeBtn.disabled=!_profileBindValidEmail(newEmail.value)||eSame;
    if(submitEmail){
      var ec=_profileBindEl('email-new-code');
      submitEmail.disabled=!(_profileBindValidEmail(newEmail.value)&&!eSame&&ec&&/^\d{4,6}$/.test(ec.value.trim()));
    }
  }
}

function _profileBindStartCountdown(btnId,seconds,idleText){
  var btn=_profileBindEl(btnId);
  if(!btn) return;
  var left=seconds||60;
  btn.disabled=true;
  btn.textContent=left+'s';
  if(_profileBindState.codeTimers[btnId]) clearInterval(_profileBindState.codeTimers[btnId]);
  _profileBindState.codeTimers[btnId]=setInterval(function(){
    left--;
    if(left<=0){
      clearInterval(_profileBindState.codeTimers[btnId]);
      delete _profileBindState.codeTimers[btnId];
      btn.disabled=false;
      btn.textContent=idleText;
      return;
    }
    btn.textContent=left+'s';
  },1000);
}

window.openProfileChangePhone=function(){
  if(typeof closeProfilePasswordDrawer==='function') closeProfilePasswordDrawer();
  if(typeof initProfileBindDrawer==='function') initProfileBindDrawer();
  _profileBindResetForm();
  _profileBindState.flow='phone';
  _profileBindState.phoneVerified=false;
  var title=_profileBindEl('profile-bind-drawer-title');
  if(title) title.textContent='修改手机号';
  var disp=_profileBindEl('phone-bind-old-display');
  if(disp) disp.textContent=PROFILE_BIND_DATA.phoneMasked;
  _profileBindShowStep('phone',1);
  var drawer=_profileBindEl('profile-bind-drawer');
  if(drawer){drawer.classList.add('is-open');drawer.setAttribute('aria-hidden','false');}
  document.body.style.overflow='hidden';
  _profileBindSyncUi();
};

window.openProfileChangeEmail=function(){
  if(typeof closeProfilePasswordDrawer==='function') closeProfilePasswordDrawer();
  if(typeof initProfileBindDrawer==='function') initProfileBindDrawer();
  _profileBindResetForm();
  _profileBindState.flow='email';
  _profileBindState.emailVerified=false;
  var title=_profileBindEl('profile-bind-drawer-title');
  if(title) title.textContent='修改邮箱';
  var disp=_profileBindEl('email-bind-old-display');
  if(disp) disp.textContent=PROFILE_BIND_DATA.emailMasked;
  var hint=_profileBindEl('email-old-sent-hint');
  if(hint){
    var dom=PROFILE_BIND_DATA.emailFull.split('@')[1]||'example.com';
    hint.textContent='验证码将发送至当前邮箱 ***@'+dom+'，请注意查收（包括垃圾箱）。';
  }
  _profileBindShowStep('email',1);
  var drawer=_profileBindEl('profile-bind-drawer');
  if(drawer){drawer.classList.add('is-open');drawer.setAttribute('aria-hidden','false');}
  document.body.style.overflow='hidden';
  _profileBindSyncUi();
};

window.closeProfileBindDrawer=function(){
  var drawer=_profileBindEl('profile-bind-drawer');
  if(drawer){drawer.classList.remove('is-open');drawer.setAttribute('aria-hidden','true');}
  _profileBindState.flow=null;
  _profileBindResetForm();
  if(!document.querySelector('.modal-overlay.open')) document.body.style.overflow='';
};

window.profileBindDrawerBack=function(){
  if(_profileBindState.flow==='phone'&&_profileBindState.step===2){
    _profileBindState.phoneVerified=false;
    _profileBindShowStep('phone',1);
    _profileBindSyncUi();
    return;
  }
  if(_profileBindState.flow==='email'&&_profileBindState.step===2){
    _profileBindState.emailVerified=false;
    _profileBindShowStep('email',1);
    _profileBindSyncUi();
  }
};

window.profileBindSendCode=function(kind){
  if(kind==='phone-old'){
    _profileBindStartCountdown('phone-old-code-btn',60,'获取验证码');
    showToast('📱 验证码已发送至 '+PROFILE_BIND_DATA.phoneMasked);
    return;
  }
  if(kind==='phone-new'){
    var p=_profileBindEl('phone-new-number');
    if(!p||!_profileBindValidPhone(p.value)){showToast('⚠️ 请输入正确的新手机号');return;}
    if(_profileBindNormPhone(p.value)===PROFILE_BIND_DATA.phoneFull){showToast('⚠️ 新手机号不能与当前相同');return;}
    _profileBindStartCountdown('phone-new-code-btn',60,'获取验证码');
    showToast('📱 验证码已发送至新手机号');
    return;
  }
  if(kind==='email-old'){
    _profileBindStartCountdown('email-old-code-btn',60,'发送验证码');
    var hint=_profileBindEl('email-old-sent-hint');
    if(hint){
      var dom=PROFILE_BIND_DATA.emailFull.split('@')[1]||'example.com';
      hint.textContent='验证码已发送至当前邮箱 ***@'+dom+'，请注意查收（包括垃圾箱）。';
    }
    showToast('📧 验证码已发送至当前邮箱');
    return;
  }
  if(kind==='email-new'){
    var e=_profileBindEl('email-new-address');
    if(!e||!_profileBindValidEmail(e.value)){showToast('⚠️ 请输入正确的新邮箱');return;}
    if(e.value.trim().toLowerCase()===PROFILE_BIND_DATA.emailFull.toLowerCase()){showToast('⚠️ 新邮箱不能与当前相同');return;}
    _profileBindStartCountdown('email-new-code-btn',60,'发送验证码');
    showToast('📧 验证码已发送至新邮箱');
  }
};

window.profileBindPhoneStep1Next=function(){
  var code=_profileBindEl('phone-old-code');
  if(!code||!/^\d{4,6}$/.test(code.value.trim())){
    showToast('⚠️ 请输入正确的验证码');
    return;
  }
  _profileBindState.phoneVerified=true;
  _profileBindShowStep('phone',2);
  _profileBindSyncUi();
};

window.profileBindEmailStep1Next=function(){
  var code=_profileBindEl('email-old-code');
  if(!code||!/^\d{4,6}$/.test(code.value.trim())){
    showToast('⚠️ 请输入正确的验证码');
    return;
  }
  _profileBindState.emailVerified=true;
  _profileBindShowStep('email',2);
  _profileBindSyncUi();
};

window.profileBindConfirmPhone=function(){
  if(!_profileBindState.phoneVerified){
    showToast('⚠️ 请先完成原手机号验证');
    _profileBindShowStep('phone',1);
    return;
  }
  var num=_profileBindEl('phone-new-number');
  var code=_profileBindEl('phone-new-code');
  if(!num||!_profileBindValidPhone(num.value)){showToast('⚠️ 请输入新手机号');return;}
  if(_profileBindNormPhone(num.value)===PROFILE_BIND_DATA.phoneFull){showToast('⚠️ 新手机号不能与当前相同');return;}
  if(!code||!/^\d{4,6}$/.test(code.value.trim())){showToast('⚠️ 请输入新手机验证码');return;}
  var digits=_profileBindNormPhone(num.value);
  var masked='+86 '+digits.replace(/(\d{3})\d{4}(\d{4})/,'$1****$2');
  PROFILE_BIND_DATA.phoneFull=digits;
  PROFILE_BIND_DATA.phoneMasked=masked;
  var phoneDisp=_profileBindEl('profile-display-phone');
  if(phoneDisp) phoneDisp.textContent=digits.replace(/(\d{3})\d{4}(\d{4})/,'$1****$2');
  var oldDisp=_profileBindEl('phone-bind-old-display');
  if(oldDisp) oldDisp.textContent=masked;
  closeProfileBindDrawer();
  showToast('✅ 手机号换绑成功');
};

window.profileBindConfirmEmail=function(){
  if(!_profileBindState.emailVerified){
    showToast('⚠️ 请先完成原邮箱验证');
    _profileBindShowStep('email',1);
    return;
  }
  var addr=_profileBindEl('email-new-address');
  var code=_profileBindEl('email-new-code');
  if(!addr||!_profileBindValidEmail(addr.value)){showToast('⚠️ 请输入新邮箱');return;}
  if(addr.value.trim().toLowerCase()===PROFILE_BIND_DATA.emailFull.toLowerCase()){showToast('⚠️ 新邮箱不能与当前相同');return;}
  if(!code||!/^\d{4,6}$/.test(code.value.trim())){showToast('⚠️ 请输入新邮箱验证码');return;}
  var full=addr.value.trim();
  var local=full.split('@')[0];
  PROFILE_BIND_DATA.emailFull=full;
  PROFILE_BIND_DATA.emailMasked=(local.length>1?local[0]+'****'+local.slice(-1):local[0]+'****')+'@'+full.split('@')[1];
  var disp=_profileBindEl('profile-display-email');
  if(disp) disp.textContent=full;
  closeProfileBindDrawer();
  showToast('✅ 邮箱换绑成功');
};

window.openProfileBindAppeal=function(){
  openModal('profile-bind-appeal-modal');
};

window.initProfileBindDrawer=function(){
  if(window._profileBindInited) return;
  window._profileBindInited=true;
  ['phone-old-code','phone-new-number','phone-new-code','email-old-code','email-new-address','email-new-code'].forEach(function(id){
    var el=_profileBindEl(id);
    if(el){
      el.addEventListener('input',_profileBindSyncUi);
      el.addEventListener('change',_profileBindSyncUi);
    }
  });
};

// ===== 个人中心 · 密码管理 =====
window.PROFILE_PASSWORD_DATA={hasPassword:true,updatedAt:'2026-05-18',initialPassword:'K9m3x7P2',showInitialHint:true};
var _profilePasswordState={step:1,verified:false,codeTimer:null};

function _profilePasswordEl(id){return document.getElementById(id);}

function syncProfilePasswordStatus(){
  var hint=_profilePasswordEl('profile-password-initial-hint');
  var valEl=_profilePasswordEl('profile-password-initial-value');
  var initial=PROFILE_PASSWORD_DATA.initialPassword||'';
  var showHint=PROFILE_PASSWORD_DATA.showInitialHint!==false&&!!initial;
  if(hint) hint.hidden=!showHint;
  if(valEl&&initial) valEl.textContent=initial;
  var status=_profilePasswordEl('profile-password-status');
  if(!status) return;
  if(PROFILE_PASSWORD_DATA.hasPassword){
    status.textContent=PROFILE_PASSWORD_DATA.updatedAt
      ?'已设置 · '+PROFILE_PASSWORD_DATA.updatedAt
      :'已设置';
  }else{
    status.textContent='未设置';
  }
}

function _profilePasswordResetForm(){
  ['password-verify-code','password-current','password-new','password-confirm','password-captcha-input'].forEach(function(id){
    var el=_profilePasswordEl(id);
    if(el){el.value='';el.classList.remove('is-error');}
  });
  ['password-weak-error','password-mismatch-error'].forEach(function(id){
    var el=_profilePasswordEl(id);
    if(el) el.hidden=true;
  });
  if(_profilePasswordState.codeTimer){
    clearInterval(_profilePasswordState.codeTimer);
    _profilePasswordState.codeTimer=null;
  }
  var codeBtn=_profilePasswordEl('password-verify-code-btn');
  if(codeBtn){codeBtn.disabled=false;codeBtn.textContent='获取验证码';}
  _profilePasswordState.verified=false;
}

function _profilePasswordShowStep(step){
  var s1=_profilePasswordEl('password-manage-step-1');
  var s2=_profilePasswordEl('password-manage-step-2');
  if(s1) s1.hidden=step!==1;
  if(s2) s2.hidden=step!==2;
  _profilePasswordState.step=step;
  var back=_profilePasswordEl('profile-password-drawer-back');
  if(back) back.style.display=step>1?'flex':'none';
  document.querySelectorAll('#profile-password-step-dots .profile-bind-dot').forEach(function(dot){
    dot.classList.toggle('is-active',parseInt(dot.getAttribute('data-pwd-step-dot'),10)===step);
  });
  var curField=_profilePasswordEl('password-current-field');
  var step2Desc=_profilePasswordEl('password-step2-desc');
  if(curField) curField.hidden=!PROFILE_PASSWORD_DATA.hasPassword;
  if(step2Desc){
    step2Desc.textContent=PROFILE_PASSWORD_DATA.hasPassword
      ?'身份已验证，请输入当前密码并设置新密码。'
      :'身份已验证，请设置登录密码（设置后可使用密码登录）。';
  }
}

function _profilePasswordValidNew(pwd){
  return typeof pwd==='string'&&pwd.length>=8&&pwd.length<=32;
}

function _profilePasswordSyncUi(){
  var code=_profilePasswordEl('password-verify-code');
  var next1=_profilePasswordEl('password-step1-next');
  if(next1&&code) next1.disabled=!/^\d{4,6}$/.test(code.value.trim());
  var current=_profilePasswordEl('password-current');
  var newer=_profilePasswordEl('password-new');
  var confirm=_profilePasswordEl('password-confirm');
  var captcha=_profilePasswordEl('password-captcha-input');
  var submit=_profilePasswordEl('password-step2-submit');
  var weakErr=_profilePasswordEl('password-weak-error');
  var mismatchErr=_profilePasswordEl('password-mismatch-error');
  if(newer&&weakErr){
    var weak=!_profilePasswordValidNew(newer.value);
    weakErr.hidden=!newer.value||!weak;
    newer.classList.toggle('is-error',!!newer.value&&weak);
  }
  if(newer&&confirm&&mismatchErr){
    var mismatch=!!confirm.value&&newer.value!==confirm.value;
    mismatchErr.hidden=!mismatch;
    confirm.classList.toggle('is-error',mismatch);
  }
  if(!submit) return;
  var captchaBtn=_profilePasswordEl('password-captcha-btn');
  var captchaCode=(captchaBtn?.textContent||'').replace(/\s/g,'');
  var captchaOk=(captcha?.value||'').replace(/\s/g,'')===captchaCode&&!!captchaCode;
  var currentOk=!PROFILE_PASSWORD_DATA.hasPassword||(current&&current.value.length>=1);
  var pwdOk=newer&&confirm&&_profilePasswordValidNew(newer.value)&&newer.value===confirm.value;
  submit.disabled=!(currentOk&&pwdOk&&captchaOk);
}

window.openProfilePasswordDrawer=function(){
  if(typeof initProfilePasswordDrawer==='function') initProfilePasswordDrawer();
  if(typeof closeProfileBindDrawer==='function') closeProfileBindDrawer();
  _profilePasswordResetForm();
  _profilePasswordShowStep(1);
  var title=_profilePasswordEl('profile-password-drawer-title');
  if(title) title.textContent=PROFILE_PASSWORD_DATA.hasPassword?'修改登录密码':'设置登录密码';
  var phoneDisp=_profilePasswordEl('password-verify-phone-display');
  if(phoneDisp&&window.PROFILE_BIND_DATA) phoneDisp.textContent=PROFILE_BIND_DATA.phoneMasked;
  var drawer=_profilePasswordEl('profile-password-drawer');
  if(drawer){drawer.classList.add('is-open');drawer.setAttribute('aria-hidden','false');}
  document.body.style.overflow='hidden';
  _profilePasswordSyncUi();
};

window.closeProfilePasswordDrawer=function(){
  var drawer=_profilePasswordEl('profile-password-drawer');
  if(drawer){drawer.classList.remove('is-open');drawer.setAttribute('aria-hidden','true');}
  _profilePasswordResetForm();
  _profilePasswordShowStep(1);
  if(!document.querySelector('.modal-overlay.open')&&!document.querySelector('.profile-bind-drawer.is-open')) document.body.style.overflow='';
};

window.profilePasswordDrawerBack=function(){
  if(_profilePasswordState.step===2){
    _profilePasswordState.verified=false;
    _profilePasswordShowStep(1);
    _profilePasswordSyncUi();
  }
};

window.profilePasswordSendCode=function(){
  var btn=_profilePasswordEl('password-verify-code-btn');
  if(!btn||btn.disabled) return;
  var left=60;
  btn.disabled=true;
  btn.textContent=left+'s';
  if(_profilePasswordState.codeTimer) clearInterval(_profilePasswordState.codeTimer);
  _profilePasswordState.codeTimer=setInterval(function(){
    left--;
    if(left<=0){
      clearInterval(_profilePasswordState.codeTimer);
      _profilePasswordState.codeTimer=null;
      btn.disabled=false;
      btn.textContent='获取验证码';
      return;
    }
    btn.textContent=left+'s';
  },1000);
  var masked=window.PROFILE_BIND_DATA?PROFILE_BIND_DATA.phoneMasked:'绑定手机';
  showToast('📱 验证码已发送至 '+masked);
};

window.profilePasswordStep1Next=function(){
  var code=_profilePasswordEl('password-verify-code');
  if(!code||!/^\d{4,6}$/.test(code.value.trim())){
    showToast('⚠️ 请输入正确的短信验证码');
    return;
  }
  _profilePasswordState.verified=true;
  _profilePasswordShowStep(2);
  _profilePasswordSyncUi();
};

window.profilePasswordConfirm=function(){
  if(!_profilePasswordState.verified){
    showToast('⚠️ 请先完成手机验证');
    _profilePasswordShowStep(1);
    return;
  }
  var current=_profilePasswordEl('password-current');
  if(PROFILE_PASSWORD_DATA.hasPassword&&(!current||!current.value)){
    showToast('⚠️ 请输入当前密码');
    return;
  }
  var newer=_profilePasswordEl('password-new');
  var confirm=_profilePasswordEl('password-confirm');
  if(!newer||!_profilePasswordValidNew(newer.value)){
    showToast('⚠️ 新密码需为 8–32 位');
    return;
  }
  if(!confirm||newer.value!==confirm.value){
    showToast('⚠️ 两次输入的密码不一致');
    return;
  }
  var captchaInput=_profilePasswordEl('password-captcha-input');
  var captchaBtn=_profilePasswordEl('password-captcha-btn');
  var captchaCode=(captchaBtn?.textContent||'').replace(/\s/g,'');
  var captchaVal=(captchaInput?.value||'').replace(/\s/g,'');
  if(!captchaVal){showToast('⚠️ 请输入图形验证码');return;}
  if(captchaVal!==captchaCode){
    showToast('图形验证码不正确');
    if(captchaBtn){
      var digits='0123456789';
      captchaBtn.textContent=Array.from({length:4},function(){return digits[Math.floor(Math.random()*10)];}).join(' ');
    }
    if(captchaInput) captchaInput.value='';
    _profilePasswordSyncUi();
    return;
  }
  var btn=_profilePasswordEl('password-step2-submit');
  var wasChange=PROFILE_PASSWORD_DATA.hasPassword;
  if(btn){btn.disabled=true;btn.textContent='保存中...';}
  setTimeout(function(){
    PROFILE_PASSWORD_DATA.hasPassword=true;
    PROFILE_PASSWORD_DATA.updatedAt=new Date().toISOString().slice(0,10);
    PROFILE_PASSWORD_DATA.showInitialHint=false;
    syncProfilePasswordStatus();
    closeProfilePasswordDrawer();
    if(btn){btn.disabled=false;btn.textContent='确认保存';}
    showToast(wasChange?'✅ 登录密码已更新':'✅ 登录密码已设置');
  },900);
};

window.initProfilePasswordDrawer=function(){
  if(window._profilePasswordInited) return;
  window._profilePasswordInited=true;
  ['password-verify-code','password-current','password-new','password-confirm','password-captcha-input'].forEach(function(id){
    var el=_profilePasswordEl(id);
    if(el){
      el.addEventListener('input',_profilePasswordSyncUi);
      el.addEventListener('change',_profilePasswordSyncUi);
    }
  });
  syncProfilePasswordStatus();
};

// ===== 各页 fixed 浮层显隐（避免挡住文字页输入框）=====
window.syncPageFloatingLayers=function(activePageId){
  var ids=['image-input-area','ref-image-section','video-input-area','audio-input-area','video-preview-modal'];
  ids.forEach(function(id){
    var el=document.getElementById(id);
    if(!el) return;
    var page=el.closest('.page-section');
    var show=page&&page.id==='page-'+activePageId;
    if(show&&id==='ref-image-section') show=!el.classList.contains('hidden');
    if(show&&id==='video-preview-modal') show=!el.classList.contains('hidden');
    if(show){
      el.style.removeProperty('display');
      el.style.removeProperty('visibility');
      if(id==='image-input-area'||id==='video-input-area'||id==='audio-input-area'){
        el.style.pointerEvents='auto';
      }else{
        el.style.pointerEvents='auto';
      }
    }else{
      el.style.display='none';
      el.style.visibility='hidden';
      el.style.pointerEvents='none';
    }
  });
  var collab=document.getElementById('collab-panel');
  if(collab){
    if(activePageId!=='chat'){
      collab.classList.add('hidden');
      collab.style.pointerEvents='none';
    }else if(collab.classList.contains('hidden')){
      collab.style.pointerEvents='none';
    }else{
      collab.style.pointerEvents='auto';
    }
  }
};

// ===== 登录态（本地演示；对接后端时替换为 token 校验） =====
var AUTH_STORAGE_KEY = 'guid_ai_auth';

window.isAuthLoggedIn = function() {
  try { return localStorage.getItem(AUTH_STORAGE_KEY) === '1'; } catch (e) { return false; }
};

window.setAuthLoggedIn = function(loggedIn) {
  try {
    if (loggedIn) localStorage.setItem(AUTH_STORAGE_KEY, '1');
    else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(AUTH_STORAGE_KEY + '_user');
    }
  } catch (e) {}
  window.applyAuthNavState();
};

window.applyAuthNavState = function() {
  var loggedIn = window.isAuthLoggedIn();
  document.body.classList.toggle('is-auth-logged-in', !!loggedIn);
  var navHome = document.getElementById('nav-home');
  var navApp = document.getElementById('nav-app');
  if (navHome) navHome.style.display = loggedIn ? 'none' : 'flex';
  if (navApp) navApp.style.display = loggedIn ? 'flex' : 'none';
  document.querySelectorAll('[data-requires-auth]').forEach(function(el) {
    if (loggedIn) {
      el.style.removeProperty('display');
      el.removeAttribute('hidden');
      el.setAttribute('aria-hidden', 'false');
    } else {
      el.style.display = 'none';
      el.setAttribute('hidden', '');
      el.setAttribute('aria-hidden', 'true');
    }
  });
  if (typeof syncMobileBottomNav === 'function') {
    syncMobileBottomNav(typeof getActivePageId === 'function' ? getActivePageId() : 'homepage');
  }
};

window.AUTH_REQUIRED_PAGES = ['myassets', 'myassets-mobile'];

window.applyAuthSessionOnLoad = function() {
  window.applyAuthNavState();
  if (typeof showPage === 'function') {
    showPage(window.isAuthLoggedIn() ? 'inspiration' : 'homepage');
  }
};

window.handleLogoutClick = function(btn) {
  if (btn && typeof pressAnim === 'function') pressAnim(btn);
  window.logoutUser();
};

window.logoutUser = function() {
  if (window._logoutInProgress) return;
  if (!confirm('确定要退出登录吗？')) return;
  window._logoutInProgress = true;
  window.setAuthLoggedIn(false);
  if (typeof closeHeaderMobileMenu === 'function') closeHeaderMobileMenu();
  if (typeof showPage === 'function') {
    showPage('homepage');
  } else {
    document.querySelectorAll('.page-section').forEach(function(s) { s.classList.remove('active'); });
    var home = document.getElementById('page-homepage');
    if (home) home.classList.add('active');
    window.applyAuthNavState();
  }
  window.scrollTo(0, 0);
  if (typeof showToast === 'function') showToast('👋 已退出登录');
  window._logoutInProgress = false;
};

// ===== 手机端底部导航 =====
window.MOBILE_BOTTOM_NAV_PAGES=['image','apps','myassets','inspiration','video'];
window.MOBILE_BOTTOM_NAV_HIDE=[];
window.isMobileBottomNavViewport=function(){
  return !!(window.matchMedia&&window.matchMedia('(max-width:768px)').matches);
};
window.getMobileBottomNavOffset=function(){
  if(document.body.classList.contains('mobile-preview-open'))return 0;
  if(!document.body.classList.contains('has-mobile-bottom-nav'))return 0;
  var nav=document.getElementById('mobile-bottom-nav');
  if(!nav||getComputedStyle(nav).display==='none')return 0;
  return nav.offsetHeight||0;
};
window.setMobilePreviewOpen=function(open){
  document.body.classList.toggle('mobile-preview-open',!!open);
  if(open){
    document.documentElement.style.setProperty('--mobile-bottom-nav-offset','0px');
    return;
  }
  if(typeof syncMobileBottomNav==='function'){
    syncMobileBottomNav(typeof getActivePageId==='function'?getActivePageId():'profile');
  }
};
window.syncMobilePreviewOpenState=function(){
  var open=false;
  var mob=document.getElementById('mob-preview-sheet');
  if(mob&&mob.style.display&&mob.style.display!=='none')open=true;
  var mwp=document.getElementById('myworks-preview-modal');
  if(mwp&&mwp.style.display&&mwp.style.display!=='none')open=true;
  var imgPrev=document.getElementById('image-result-preview');
  if(imgPrev&&!imgPrev.classList.contains('hidden'))open=true;
  var vidPrev=document.getElementById('video-result-preview');
  if(vidPrev&&!vidPrev.classList.contains('hidden'))open=true;
  if(document.getElementById('asset-media-preview-overlay'))open=true;
  setMobilePreviewOpen(open);
};
window.syncMobileBottomNav=function(pageId){
  var nav=document.getElementById('mobile-bottom-nav');
  if(!nav)return;
  var hide=window.MOBILE_BOTTOM_NAV_HIDE.indexOf(pageId)>=0||!window.isMobileBottomNavViewport();
  document.body.classList.toggle('has-mobile-bottom-nav',!hide);
  document.body.classList.toggle('mobile-bottom-nav-hidden',hide);
  function applyOffset(){
    var offset=hide?0:window.getMobileBottomNavOffset();
    document.documentElement.style.setProperty('--mobile-bottom-nav-offset',offset?offset+'px':'0px');
    if(!hide&&document.getElementById('page-apps')?.classList.contains('active')&&typeof syncAppsIframeLayout==='function'){
      syncAppsIframeLayout();
    }
    if(!hide&&(pageId==='image'||pageId==='video'||pageId==='audio')&&typeof syncMediaDockPadding==='function'){
      syncMediaDockPadding(pageId);
    }
  }
  var navPageId=pageId==='myassets-mobile'?'myassets':pageId;
  nav.querySelectorAll('.mobile-bottom-nav-item[data-page]').forEach(function(btn){
    var on=btn.getAttribute('data-page')===navPageId;
    btn.classList.toggle('active',on);
    btn.setAttribute('aria-current',on?'page':'false');
  });
  applyOffset();
  if(!hide)requestAnimationFrame(applyOffset);
};
window.mobileBottomNavGo=function(pageId){
  var target=pageId;
  if(pageId==='myassets'&&typeof window.isMobileBottomNavViewport==='function'&&window.isMobileBottomNavViewport()){
    target='myassets-mobile';
  }
  if(typeof showPage==='function')showPage(target);
};
window.getActivePageId=function(){
  var active=document.querySelector('.page-section.active');
  return active&&active.id?active.id.replace(/^page-/,''):'homepage';
};

// ===== Page & Nav switching =====
window.showPage = function(pageId) {
  if (window.AUTH_REQUIRED_PAGES && window.AUTH_REQUIRED_PAGES.indexOf(pageId) >= 0 && !window.isAuthLoggedIn()) {
    if (typeof openModal === 'function') openModal('login-modal');
    if (typeof showToast === 'function') showToast('请先登录后查看我的产品');
    return;
  }
  if(typeof stopMobileVoiceInput==='function') stopMobileVoiceInput(true);
  if(typeof closeHeaderMobileMenu==='function') closeHeaderMobileMenu();
  if(typeof closeMediaMobileSheet==='function') closeMediaMobileSheet();
  if(typeof closeChatMobileSheet==='function') closeChatMobileSheet();
  if(typeof closeAssetLibrary==='function') closeAssetLibrary();
  if(typeof closeImageResultPreview==='function') closeImageResultPreview();
  if(typeof closeVideoResultPreview==='function') closeVideoResultPreview();
  if(typeof closeImagePreview==='function') closeImagePreview();
  if(typeof closeAllModals==='function') closeAllModals();
  else{
    document.querySelectorAll('.modal-overlay.open').forEach(function(m){m.classList.remove('open');});
    document.body.style.overflow='';
  }
  if(typeof clearAssetModalSelection==='function') clearAssetModalSelection();
  document.getElementById('collab-panel')?.classList.add('hidden');
  // Hide all sections, show target
  document.querySelectorAll('.page-section').forEach(s=>s.classList.remove('active'));
  const target = document.getElementById('page-'+pageId);
  if (target) target.classList.add('active');
  if(typeof syncPageFloatingLayers==='function') syncPageFloatingLayers(pageId);
  if(typeof resetMediaToolbarDropdowns==='function')resetMediaToolbarDropdowns();
  if(typeof closeImageToolbarDropdowns==='function')closeImageToolbarDropdowns(null);
  if(typeof closeVideoToolbarDropdowns==='function')closeVideoToolbarDropdowns(null);
  if(pageId==='chat'&&typeof placeChatHotAppsStrip==='function'){try{placeChatHotAppsStrip();}catch(e){console.error('placeChatHotAppsStrip',e);}}
  if(pageId==='image'&&typeof placeImageHotAppsStrip==='function'){try{placeImageHotAppsStrip();}catch(e){console.error('placeImageHotAppsStrip',e);}}
  if(pageId==='video'&&typeof placeVideoHotAppsStrip==='function'){try{placeVideoHotAppsStrip();}catch(e){console.error('placeVideoHotAppsStrip',e);}}
  if(pageId==='audio'&&typeof placeAudioHotAppsStrip==='function'){try{placeAudioHotAppsStrip();}catch(e){console.error('placeAudioHotAppsStrip',e);}}
  if(pageId==='audio'){
    requestAnimationFrame(function(){
      var ac=document.getElementById('audio-results-container');
      if(ac&&typeof refreshResultPromptClamp==='function') refreshResultPromptClamp(ac);
    });
  }
  if(pageId==='wallet'&&typeof renderWalletRecords==='function') renderWalletRecords();
  if(pageId==='image'||pageId==='video'||pageId==='audio'){
    requestAnimationFrame(function(){
      if(typeof syncMediaDockPadding==='function') syncMediaDockPadding(pageId);
    });
  }
  // Toggle nav: homepage uses simple nav, all others use app nav
  const isHome = pageId === 'homepage';
  const navHome=document.getElementById('nav-home');
  const navApp=document.getElementById('nav-app');
  if(navHome)navHome.style.display=isHome?'flex':'none';
  if(navApp)navApp.style.display=isHome?'none':'flex';
  // Update app nav active state
  if (!isHome&&navApp) {
    navApp.querySelectorAll('[data-page]').forEach(n=>{
      n.classList.remove('active');
      n.classList.add('text-gray-600','dark:text-gray-400');
    });
    const activeNav = navApp.querySelector('[data-page="'+pageId+'"]');
    if (activeNav) {
      activeNav.classList.add('active');
      activeNav.classList.remove('text-gray-600','dark:text-gray-400');
    }
  }
  if (typeof window.applyAuthNavState === 'function') window.applyAuthNavState();
  if(typeof syncHeaderMobileMenuActive==='function') syncHeaderMobileMenuActive(pageId,isHome);
  if(pageId!=='myassets'&&window._myworksManageMode&&typeof toggleMyWorksManage==='function'){
    toggleMyWorksManage(true);
  }
  if(typeof syncMobileBottomNav==='function') syncMobileBottomNav(pageId);
  // 模型广场页面初始化
  if(pageId === 'model-hub') {
    filterModelCards();
  }
  if(pageId === 'inspiration' && typeof initInspirationPage === 'function') {
    initInspirationPage();
  }
  // 图片页面初始化
  if(pageId === 'image') {
    updateImageGenCost();
    requestAnimationFrame(function(){
      if(typeof syncImageResultsBottomPadding==='function') syncImageResultsBottomPadding();
      updateImageOutputParamsLabel();
      if(typeof renderImageRefThumbnails==='function') renderImageRefThumbnails();
    });
  }
  if(pageId === 'video') {
    requestAnimationFrame(function() {
      syncVideoResultsBottomPadding();
      updateVideoOutputParamsLabel();
      updateVideoGenCost();
    });
  }
  if(pageId === 'audio') {
    requestAnimationFrame(function() {
      if(typeof syncAudioResultsBottomPadding==='function') syncAudioResultsBottomPadding();
      if(typeof updateAudioOutputParamsLabel==='function') updateAudioOutputParamsLabel();
      if(typeof initAudioVoicePicker==='function') initAudioVoicePicker();
      if(typeof updateAudioGenCost==='function') updateAudioGenCost();
    });
  }
  // 我的产品页面初始化来源图标
  if(pageId==='myassets'||pageId==='myassets-mobile') {
    requestAnimationFrame(function(){
      if(typeof renderMyworksSourceIcons==='function')renderMyworksSourceIcons();
      if(typeof filterMyworksByType==='function')filterMyworksByType('all');
    });
  }
  if(pageId==='apps'){
    requestAnimationFrame(function(){
      if(typeof syncAppsIframeLayout==='function')syncAppsIframeLayout();
    });
  }
  window.scrollTo({top:0,behavior:'smooth'});
}

window.syncMediaDockPadding=function(kind){
  var kinds=kind&&kind!=='all'?[kind]:['image','video','audio'];
  kinds.forEach(function(k){
    var page=document.getElementById('page-'+k);
    if(!page||!page.classList.contains('active')) return;
    var input=document.getElementById(k+'-input-area');
    var canvas=document.getElementById(k+'-canvas-area');
    if(!input||!canvas) return;
    var pad=input.offsetHeight+24;
    if(k==='image'){
      var ref=document.getElementById('ref-image-section');
      if(ref&&!ref.classList.contains('hidden')){
        pad+=ref.offsetHeight+12;
        ref.style.bottom=(input.offsetHeight+20)+'px';
      }
    }
    canvas.style.paddingBottom=pad+'px';
  });
};
window.syncImageResultsBottomPadding=function(){syncMediaDockPadding('image');};
window.syncVideoResultsBottomPadding=function(){syncMediaDockPadding('video');};
window.syncAudioResultsBottomPadding=function(){syncMediaDockPadding('audio');};

window.AUDIO_VOICE_FILTERS=['全部','我的','最热','最新','超拟人','解说','新闻主持','广告营销','娱乐','语音助手','方言','多语种','童声','老年','女声','男声'];

window.AUDIO_VOICE_AVATAR_GRADIENTS=[
  'linear-gradient(135deg,#60a5fa,#818cf8)',
  'linear-gradient(135deg,#f472b6,#fb7185)',
  'linear-gradient(135deg,#34d399,#2dd4bf)',
  'linear-gradient(135deg,#fbbf24,#f97316)',
  'linear-gradient(135deg,#a78bfa,#c084fc)',
  'linear-gradient(135deg,#38bdf8,#0ea5e9)'
];

window.AUDIO_VOICE_CATALOG=[
  {id:'yachen',name:'雅晨',category:'新闻主持',gender:'女',hyper:true,hot:true,new:false},
  {id:'yaxi',name:'雅夕',category:'广告营销',gender:'女',hyper:true,hot:true,new:true},
  {id:'yahan',name:'雅涵',category:'解说',gender:'女',hyper:true,hot:false,new:true},
  {id:'yaxuan',name:'雅萱',category:'童声',gender:'女',hyper:false,hot:false,new:false},
  {id:'xiaomei',name:'小美',category:'女声',gender:'女',hyper:true,hot:true,new:false},
  {id:'xiaoyu',name:'小宇',category:'男声',gender:'男',hyper:true,hot:true,new:false},
  {id:'zicheng',name:'自称',category:'方言',gender:'男',hyper:true,hot:false,new:true},
  {id:'yunyao',name:'云野',category:'娱乐',gender:'男',hyper:true,hot:true,new:true},
  {id:'yunshuo',name:'云硕',category:'语音助手',gender:'男',hyper:true,hot:false,new:false},
  {id:'yunlong',name:'云龙',category:'多语种',gender:'男',hyper:true,hot:false,new:true},
  {id:'yunze',name:'云泽',category:'解说',gender:'男',hyper:false,hot:false,new:false},
  {id:'xiaoyu2',name:'晓宇',category:'老年',gender:'男',hyper:true,hot:false,new:true},
  {id:'xiaodong',name:'晓东',category:'新闻主持',gender:'男',hyper:true,hot:true,new:false},
  {id:'wenrou',name:'温柔女声',category:'女声',gender:'女',hyper:false,hot:true,new:false},
  {id:'cixing',name:'磁性男声',category:'男声',gender:'男',hyper:false,hot:true,new:false},
  {id:'tongsheng',name:'童声',category:'童声',gender:'女',hyper:false,hot:false,new:false},
  {id:'boyin',name:'播音员',category:'新闻主持',gender:'男',hyper:true,hot:true,new:false}
];

window._audioVoicePickerFilter='最热';
window._audioVoicePickerCollapsed=false;

window.getAudioVoiceById=function(id){
  return (window.AUDIO_VOICE_CATALOG||[]).find(function(v){return v.id===id;});
};

window.getAudioVoiceAvatarStyle=function(voice,idx){
  var i=typeof idx==='number'?idx:((voice&&voice.name)?voice.name.charCodeAt(0):0);
  var g=window.AUDIO_VOICE_AVATAR_GRADIENTS[i%window.AUDIO_VOICE_AVATAR_GRADIENTS.length];
  return 'background:'+g;
};

window.syncVoiceSelectHidden=function(voiceId,voiceName){
  var sel=document.getElementById('voice-select');
  var hidden=document.getElementById('audio-selected-voice');
  if(hidden) hidden.value=voiceName||'';
  if(!sel) return;
  if(!voiceName||voiceName.indexOf('选择音色')>=0){
    sel.innerHTML='<option value="">选择音色</option>';
    sel.value='';
    return;
  }
  var found=false;
  for(var i=0;i<sel.options.length;i++){
    if(sel.options[i].value===voiceId||sel.options[i].textContent===voiceName){
      sel.selectedIndex=i;
      found=true;
      break;
    }
  }
  if(!found){
    var opt=document.createElement('option');
    opt.value=voiceId||voiceName;
    opt.textContent=voiceName;
    sel.appendChild(opt);
    sel.value=opt.value;
  }
};

window.updateAudioVoicePickerButton=function(voice){
  var btnLabel=document.getElementById('audio-voice-picker-label');
  var btnAvatar=document.getElementById('audio-voice-picker-avatar');
  if(!btnLabel) return;
  if(!voice||!voice.name){
    btnLabel.textContent='选择音色';
    if(btnAvatar){btnAvatar.textContent='音';btnAvatar.style.background='linear-gradient(135deg,#60a5fa,#818cf8)';}
    return;
  }
  btnLabel.textContent=voice.name;
  if(btnAvatar){
    btnAvatar.textContent=voice.name.charAt(0);
    btnAvatar.setAttribute('style',window.getAudioVoiceAvatarStyle(voice));
  }
};

window.addAudioVoiceToCatalog=function(voice){
  if(!voice||!voice.name) return null;
  var list=window.AUDIO_VOICE_CATALOG=window.AUDIO_VOICE_CATALOG||[];
  var id=voice.id||('custom-'+Date.now());
  var existing=list.find(function(v){return v.id===id||v.name===voice.name;});
  if(existing) return existing;
  var entry={id:id,name:voice.name,category:voice.category||'我的音色',gender:voice.gender||'女',hyper:!!voice.hyper,hot:false,new:true,custom:true};
  list.unshift(entry);
  return entry;
};

window.filterAudioVoiceCatalog=function(filterKey){
  var key=filterKey||window._audioVoicePickerFilter||'最热';
  var list=(window.AUDIO_VOICE_CATALOG||[]).slice();
  if(key==='全部') return list;
  if(key==='我的') return list.filter(function(v){return v.custom===true;});
  if(key==='最热') return list.sort(function(a,b){return (b.hot?1:0)-(a.hot?1:0)||a.name.localeCompare(b.name,'zh');});
  if(key==='最新') return list.sort(function(a,b){return (b.new?1:0)-(a.new?1:0)||b.id.localeCompare(a.id);});
  if(key==='超拟人') return list.filter(function(v){return v.hyper;});
  if(key==='女声') return list.filter(function(v){return v.gender==='女';});
  if(key==='男声') return list.filter(function(v){return v.gender==='男';});
  return list.filter(function(v){
    return v.category===key||(key==='童声'&&v.category==='童声')||(key==='老年'&&v.category==='老年');
  });
};

window.renderVoicePickerFilters=function(){
  var wrap=document.getElementById('voice-picker-filters');
  if(!wrap) return;
  var active=window._audioVoicePickerFilter||'最热';
  wrap.innerHTML=(window.AUDIO_VOICE_FILTERS||[]).map(function(f){
    return '<button type="button" class="voice-picker-filter'+(f===active?' active':'')+'" data-vfilter="'+f+'" onclick="setVoicePickerFilter(\''+f.replace(/'/g,"\\'")+'\')">'+f+'</button>';
  }).join('');
};

window.renderVoicePickerGrid=function(){
  var grid=document.getElementById('voice-picker-grid');
  if(!grid) return;
  var selectedId=document.getElementById('audio-selected-voice-id');
  var currentId=selectedId?selectedId.value:'';
  if(!currentId){
    var hidden=document.getElementById('audio-selected-voice');
    var name=hidden?hidden.value:'';
    if(name){
      var match=(window.AUDIO_VOICE_CATALOG||[]).find(function(v){return v.name===name;});
      if(match) currentId=match.id;
    }
  }
  var voices=window.filterAudioVoiceCatalog();
  if(!voices.length){
    grid.innerHTML='<div class="col-span-2 text-center text-xs text-gray-400 py-8">暂无匹配音色</div>';
    return;
  }
  var playingId=window._voicePreviewPlayingId||'';
  var playSvg='<svg class="voice-preview-icon-play" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="8 5 19 12 8 19 8 5"/></svg>';
  var pauseSvg='<svg class="voice-preview-icon-pause" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';
  grid.innerHTML=voices.map(function(v,idx){
    var sel=v.id===currentId?' is-selected':'';
    var playing=v.id===playingId?' is-playing':'';
    var hyper=v.hyper?'<span class="voice-picker-hyper-badge">超拟人</span>':'';
    var avStyle=window.getAudioVoiceAvatarStyle(v,idx);
    var vid=v.id.replace(/'/g,"\\'");
    return '<div class="voice-picker-card'+sel+'" data-voice-id="'+v.id+'">'+
      '<button type="button" class="voice-picker-card-main" onclick="selectAudioVoice(\''+vid+'\')">'+
      '<span class="voice-picker-card-avatar-wrap"><span class="voice-picker-card-avatar" style="'+avStyle+'">'+v.name.charAt(0)+'</span>'+hyper+'</span>'+
      '<span class="voice-picker-card-info"><span class="voice-picker-card-name">'+v.name+'</span><span class="voice-picker-card-cat">'+v.category+'</span></span></button>'+
      '<button type="button" class="voice-picker-preview-btn'+playing+'" onclick="previewAudioVoice(\''+vid+'\',this,event)" title="试听" aria-label="试听 '+v.name+'">'+playSvg+pauseSvg+'</button></div>';
  }).join('');
};

window._voicePreviewPlayingId=null;

window.getVoicePreviewSampleText=function(voice){
  if(!voice) return '你好，很高兴为你朗读。';
  return '你好，我是'+voice.name+'，'+voice.category+'风格，很高兴为你朗读。';
};

window.getVoicePreviewSpeechOpts=function(voice){
  var opts={lang:'zh-CN',rate:1,pitch:1};
  if(!voice) return opts;
  if(voice.gender==='女'){opts.pitch=1.08;opts.rate=1.02;}
  if(voice.gender==='男'){opts.pitch=0.88;opts.rate=0.96;}
  if(voice.category==='童声'){opts.pitch=1.32;opts.rate=1.08;}
  if(voice.category==='老年'){opts.pitch=0.72;opts.rate=0.84;}
  if(voice.category==='解说'){opts.rate=1.05;}
  if(voice.category==='新闻主持'){opts.rate=0.94;opts.pitch=voice.gender==='男'?0.9:1.02;}
  if(voice.hyper){opts.rate=Math.max(0.9,opts.rate-0.04);}
  var h=0;
  for(var i=0;i<(voice.id||'').length;i++) h+=voice.id.charCodeAt(i);
  opts.pitch+=(h%7)*0.025-0.075;
  return opts;
};

window.pickSpeechVoiceForPreview=function(voice,utterance){
  if(!window.speechSynthesis||!utterance) return;
  var list=window.speechSynthesis.getVoices();
  if(!list.length) return;
  var zh=list.filter(function(v){return v.lang&&v.lang.indexOf('zh')===0;});
  var pool=zh.length?zh:list;
  if(voice&&voice.gender==='女'){
    var fv=pool.find(function(v){
      var n=(v.name||'')+(v.voiceURI||'');
      return /female|女|xiaoxiao|tingting|huihui|yaoyao|lili/i.test(n);
    });
    if(fv){utterance.voice=fv;return;}
  }
  if(voice&&voice.gender==='男'){
    var mv=pool.find(function(v){
      var n=(v.name||'')+(v.voiceURI||'');
      return /male|男|yun|kang|yu/i.test(n);
    });
    if(mv){utterance.voice=mv;return;}
  }
  if(zh[0]) utterance.voice=zh[0];
};

window.stopVoicePreview=function(){
  if(window.speechSynthesis) window.speechSynthesis.cancel();
  window._voicePreviewPlayingId=null;
  document.querySelectorAll('.voice-picker-preview-btn.is-playing').forEach(function(b){b.classList.remove('is-playing');});
};

window.previewAudioVoice=function(voiceId,btn,evt){
  if(evt&&evt.stopPropagation) evt.stopPropagation();
  var voice=window.getAudioVoiceById(voiceId);
  if(!voice) return;
  if(window._voicePreviewPlayingId===voiceId){
    window.stopVoicePreview();
    return;
  }
  window.stopVoicePreview();
  if(!window.speechSynthesis){
    showToast('🔊 '+window.getVoicePreviewSampleText(voice));
    return;
  }
  var speechOpts=window.getVoicePreviewSpeechOpts(voice);
  var u=new SpeechSynthesisUtterance(window.getVoicePreviewSampleText(voice));
  u.lang=speechOpts.lang;
  u.rate=speechOpts.rate;
  u.pitch=speechOpts.pitch;
  window.pickSpeechVoiceForPreview(voice,u);
  u.onend=function(){
    window._voicePreviewPlayingId=null;
    if(btn) btn.classList.remove('is-playing');
    renderVoicePickerGrid();
  };
  u.onerror=function(){
    window._voicePreviewPlayingId=null;
    if(btn) btn.classList.remove('is-playing');
    renderVoicePickerGrid();
    showToast('⚠️ 试听失败，请重试');
  };
  window._voicePreviewPlayingId=voiceId;
  if(btn) btn.classList.add('is-playing');
  window.speechSynthesis.speak(u);
  showToast('🔊 正在试听：'+voice.name);
};

if(window.speechSynthesis&&!window._voicePreviewVoicesReady){
  window._voicePreviewVoicesReady=true;
  var _loadVoices=function(){window.speechSynthesis.getVoices();};
  _loadVoices();
  if(typeof window.speechSynthesis.onvoiceschanged!=='undefined'){
    window.speechSynthesis.onvoiceschanged=_loadVoices;
  }
}

window.setVoicePickerFilter=function(key){
  if(typeof stopVoicePreview==='function') stopVoicePreview();
  window._audioVoicePickerFilter=key;
  renderVoicePickerFilters();
  renderVoicePickerGrid();
};

window.toggleVoicePickerFilters=function(){
  window._audioVoicePickerCollapsed=!window._audioVoicePickerCollapsed;
  var wrap=document.getElementById('voice-picker-filters-wrap');
  var text=document.getElementById('voice-picker-collapse-text');
  if(wrap) wrap.classList.toggle('is-collapsed',!!window._audioVoicePickerCollapsed);
  if(text) text.textContent=window._audioVoicePickerCollapsed?'展开筛选':'收起';
};

window.selectAudioVoice=function(voiceId,opts){
  opts=opts||{};
  if(typeof stopVoicePreview==='function') stopVoicePreview();
  var voice=window.getAudioVoiceById(voiceId);
  if(!voice) return;
  var idEl=document.getElementById('audio-selected-voice-id');
  if(idEl) idEl.value=voice.id;
  syncVoiceSelectHidden(voice.id,voice.name);
  updateAudioVoicePickerButton(voice);
  if(typeof syncAudioMobileToolIcons==='function') syncAudioMobileToolIcons();
  renderVoicePickerGrid();
  if(opts.closeModal!==false) closeModal('voice-picker-modal');
  if(opts.toast!==false) showToast('🎵 已选择音色：'+voice.name);
};

window.openVoicePickerModal=function(){
  renderVoicePickerFilters();
  renderVoicePickerGrid();
  openModal('voice-picker-modal');
};

window.syncVoiceSelectWidth=function(){
  var hidden=document.getElementById('audio-selected-voice');
  var name=hidden?hidden.value:'';
  if(name){
    var v=(window.AUDIO_VOICE_CATALOG||[]).find(function(x){return x.name===name;});
    if(v) updateAudioVoicePickerButton(v);
  }
};

window.initAudioVoicePicker=function(){
  var def=window.getAudioVoiceById('yachen');
  var cur=document.getElementById('audio-selected-voice');
  if(def&&(!cur||!cur.value)) selectAudioVoice(def.id,{closeModal:false,toast:false});
  else if(cur&&cur.value){
    var v=(window.AUDIO_VOICE_CATALOG||[]).find(function(x){return x.name===cur.value;});
    if(v) updateAudioVoicePickerButton(v);
  }
};

let currentAudioEditParams=null;
let audioGenerationTimer=null;
let audioGenerationProgress=0;
let audioGenerationStartAt=0;
const audioGenStatusMessages=[
  '正在准备任务...',
  '正在分析文本...',
  '正在加载音色模型...',
  '正在合成语音...',
  '正在优化音质...',
  '即将完成...'
];

function getSelectedVoiceName(){
  var hidden=document.getElementById('audio-selected-voice');
  if(hidden&&hidden.value&&hidden.value.indexOf('选择音色')<0) return hidden.value;
  var sel=document.getElementById('voice-select');
  if(!sel) return '未选择音色';
  var opt=sel.options[sel.selectedIndex];
  var v=(opt?opt.textContent:sel.value)||'';
  if(!v||v.indexOf('选择音色')>=0) return '未选择音色';
  return v;
}

function getAudioOutputParamsSummary(){
  var speed=document.getElementById('audio-param-speed');
  var tone=document.getElementById('audio-param-tone');
  var effect=document.getElementById('audio-param-effect');
  var emo=document.getElementById('audio-param-emotion');
  var emoLabel=document.getElementById('audio-param-emotion-label');
  var base=(speed?speed.value:'1.0x')+' / '+(tone?tone.value:'标准')+' / '+(effect?effect.value:'无');
  if(emo&&emo.value) return base+' / '+(emoLabel&&emoLabel.value?emo.value+' '+emoLabel.value:emo.value);
  return base;
}

function getAudioQualityValue(){
  var sel=document.getElementById('audio-param-quality');
  if(!sel) return 'Turbo';
  return sel.value||sel.options[sel.selectedIndex]?.text.replace(/^质量\s*/,'')||'Turbo';
}

window.calcAudioGenerationCost=function(modelName,quality){
  var prices={'Auto':0.002,'海螺语音克隆 2.8':0.004,'ElevenLabs Turbo':0.006,'Fish Audio':0.003,'GPT-4o Voice':0.008,'CosmicVoice':0.005};
  var qMul={'Turbo':0.8,'标准':1,'高清':1.5};
  return (prices[modelName]||0.003)*(qMul[quality]||1);
};

window.updateAudioGenCost=function(){
  var costEl=document.getElementById('audio-gen-cost');
  var modelTextEl=document.getElementById('current-audio-model-text');
  if(!costEl) return;
  var modelName=modelTextEl?modelTextEl.textContent.trim():'Auto';
  var quality=typeof getAudioQualityValue==='function'?getAudioQualityValue():'Turbo';
  var total=calcAudioGenerationCost(modelName,quality).toFixed(4);
  costEl.innerHTML='💰 本次: <span class="text-yellow-500 leading-none" aria-hidden="true">⚡</span>'+total;
};

function setAudioGenPromptText(el,text){
  if(!el) return;
  var body=el.querySelector('.result-prompt-body');
  if(body) body.textContent=text;
  else el.textContent=text;
  if(typeof refreshResultPromptClamp==='function') refreshResultPromptClamp(el);
}

function showAudioGeneratingPanel(){
  var container=document.getElementById('audio-results-container');
  var generatingState=document.getElementById('audio-generating-state');
  if(!container||!generatingState) return;
  container.classList.remove('hidden');
  container.appendChild(generatingState);
  generatingState.classList.remove('hidden');
  requestAnimationFrame(function(){
    if(typeof refreshResultPromptClamp==='function') refreshResultPromptClamp(generatingState);
    generatingState.scrollIntoView({behavior:'smooth',block:'nearest'});
    syncAudioResultsBottomPadding();
  });
}

function hideAudioGeneratingPanel(){
  var generatingState=document.getElementById('audio-generating-state');
  if(generatingState) generatingState.classList.add('hidden');
}

function setAudioGenButtonState(generating){
  ['audio-gen-btn-desktop','audio-gen-btn-mobile'].forEach(function(id){
    var genBtn=document.getElementById(id);
    if(!genBtn) return;
    if(generating){
      genBtn.disabled=true;
      genBtn.textContent='⏳ 生成中...';
    }else{
      genBtn.disabled=false;
      genBtn.innerHTML='✨ 生成';
    }
  });
}

function updateAudioGenerationProgress(){
  var bar=document.getElementById('audio-gen-progress-bar');
  var text=document.getElementById('audio-gen-status-text');
  var detail=document.getElementById('audio-gen-status-detail');
  var pct=Math.floor(audioGenerationProgress);
  if(bar) bar.style.width=pct+'%';
  if(text) text.textContent=pct+'%';
  if(detail){
    var msgIdx=Math.min(Math.floor(pct/20),audioGenStatusMessages.length-1);
    detail.textContent=audioGenStatusMessages[msgIdx];
  }
}

window.startAudioGeneration=function(){
  currentAudioEditParams=null;
  var prompt=document.getElementById('audio-prompt-textarea');
  var promptText=prompt?prompt.value.trim():'';
  if(!promptText){
    showToast('⚠️ 请输入要朗读的文本内容');
    return;
  }

  var emptyState=document.getElementById('audio-empty-state');
  if(emptyState) emptyState.classList.add('hidden');

  var modelText=document.getElementById('current-audio-model-text');
  var model=modelText?modelText.textContent.trim():'Auto';
  var voice=getSelectedVoiceName();
  var paramsSummary=getAudioOutputParamsSummary();
  var quality=getAudioQualityValue();

  var genVoice=document.getElementById('audio-gen-voice');
  if(genVoice) genVoice.textContent=voice;
  var genModel=document.getElementById('audio-gen-model');
  if(genModel) genModel.textContent=model;
  var genParams=document.getElementById('audio-gen-params');
  if(genParams) genParams.textContent=paramsSummary;
  var genQuality=document.getElementById('audio-gen-quality');
  if(genQuality) genQuality.textContent=quality;

  setAudioGenPromptText(document.getElementById('audio-gen-prompt'),promptText);

  audioGenerationStartAt=Date.now();
  showAudioGeneratingPanel();
  if(typeof placeAudioHotAppsStrip==='function')placeAudioHotAppsStrip();

  var inputArea=document.getElementById('audio-input-area');
  if(inputArea) inputArea.classList.add('pointer-events-none','opacity-50');
  setAudioGenButtonState(true);

  audioGenerationProgress=0;
  updateAudioGenerationProgress();
  audioGenerationTimer=setInterval(function(){
    audioGenerationProgress+=Math.random()*12+4;
    if(audioGenerationProgress>=100){
      audioGenerationProgress=100;
      clearInterval(audioGenerationTimer);
      audioGenerationTimer=null;
      setTimeout(function(){ finishAudioGeneration(); },300);
    }
    updateAudioGenerationProgress();
  },600);
};

function finishAudioGeneration(){
  hideAudioGeneratingPanel();

  var emptyState=document.getElementById('audio-empty-state');
  if(emptyState) emptyState.classList.add('hidden');

  var prompt=document.getElementById('audio-prompt-textarea');
  var promptText=prompt?prompt.value.trim():'';
  var modelText=document.getElementById('current-audio-model-text');
  var model=modelText?modelText.textContent.trim():'Auto';
  var voice=getSelectedVoiceName();
  var paramsSummary=getAudioOutputParamsSummary();
  var quality=getAudioQualityValue();
  var speedEl=document.getElementById('audio-param-speed');
  var toneEl=document.getElementById('audio-param-tone');
  var effectEl=document.getElementById('audio-param-effect');
  var emotionEl=document.getElementById('audio-param-emotion');
  var emotionLabelEl=document.getElementById('audio-param-emotion-label');

  var finishedAt=Date.now();
  var genDurationMs=audioGenerationStartAt?finishedAt-audioGenerationStartAt:0;
  var genCost=calcAudioGenerationCost(model,quality);
  var costStr=(typeof genCost==='number'?genCost:parseFloat(genCost)||0).toFixed(4);

  var cardId='audio-result-card-'+Date.now();
  var cardParams=JSON.stringify({
    model:model,
    voice:voice,
    speed:speedEl?speedEl.value:'1.0x',
    tone:toneEl?toneEl.value:'标准',
    effect:effectEl?effectEl.value:'无',
    emotion:emotionEl?emotionEl.value:'',
    emotionLabel:emotionLabelEl?emotionLabelEl.value:'',
    quality:quality,
    paramsSummary:paramsSummary,
    prompt:promptText,
    genDurationMs:genDurationMs,
    genCost:genCost,
    genFinishedAt:finishedAt,
    genTaskId:String(finishedAt)+String(100000+Math.floor(Math.random()*900000))
  }).replace(/"/g,'&quot;');

  var durationLabel='00:35';
  var waveformBars=Array.from({length:48},function(_,i){
    var h=20+Math.sin(i*0.45)*12+((i*7)%11);
    return '<div class="flex-1 rounded-t-sm bg-blue-400/70 dark:bg-blue-500/60" style="height:'+h+'px"></div>';
  }).join('');
  var safePrompt=typeof escapeHtml==='function'?escapeHtml(promptText):promptText;
  var safeVoice=typeof escapeHtml==='function'?escapeHtml(voice):voice;
  var safeModel=typeof escapeHtml==='function'?escapeHtml(model):model;
  var safeParams=typeof escapeHtml==='function'?escapeHtml(paramsSummary):paramsSummary;
  var safeQuality=typeof escapeHtml==='function'?escapeHtml(quality):quality;
  var titleSnippet=safePrompt.slice(0,40)+(promptText.length>40?'…':'');

  var audioBlockHtml=
    '<div class="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 bg-gradient-to-br from-slate-100 to-blue-50 dark:from-gray-900 dark:to-blue-950/40">'+
      '<div class="px-4 py-3 flex items-center gap-3 border-b border-gray-200/80 dark:border-gray-700/80">'+
        '<button type="button" onclick="previewResultAudio(this)" class="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shrink-0 shadow" title="播放">'+
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="8 5 19 12 8 19 8 5"/></svg>'+
        '</button>'+
        '<div class="flex-1 min-w-0">'+
          '<div class="text-[11px] font-medium text-gray-700 dark:text-gray-200 truncate">'+titleSnippet+'</div>'+
          '<div class="text-[10px] text-gray-500 dark:text-gray-400 font-mono mt-0.5">▶ 0:00 / '+durationLabel+'</div>'+
        '</div>'+
        '<div class="flex items-center gap-1 shrink-0">'+
          '<button type="button" onclick="downloadResultAudio(this)" class="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 p-1.5 rounded-lg hover:bg-white/60 dark:hover:bg-gray-800" title="下载"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>'+
          '<button type="button" onclick="publishResultAudio(this)" class="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 p-1.5 rounded-lg hover:bg-white/60 dark:hover:bg-gray-800" title="发布"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>'+
          '<button type="button" onclick="deleteAudioResultCard(this)" class="text-gray-500 hover:text-red-600 dark:text-gray-400 p-1.5 rounded-lg hover:bg-white/60 dark:hover:bg-gray-800" title="删除"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>'+
        '</div>'+
      '</div>'+
      '<div class="h-20 px-4 flex items-end gap-0.5 pb-2">'+waveformBars+'</div>'+
    '</div>';

  var audioCardActionsHtml=
    '<div class="flex items-center gap-1 shrink-0">'+
    '<button type="button" onclick="regenerateAudio(\''+cardId+'\')" class="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition" title="再次生成">'+
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg></button>'+
    '<button type="button" onclick="reEditAudio(\''+cardId+'\')" class="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition" title="重新编辑">'+
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>'+
    '</div>';

  var cardHtml='<div id="'+cardId+'" class="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-2xl shadow-lg p-4">'+
    '<div class="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3 text-[11px]">'+
    '<span class="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-[10px] font-medium shrink-0">'+safeVoice+'</span>'+
    '<span class="text-gray-500 dark:text-gray-400 shrink-0">'+safeModel+'</span>'+
    '<span class="text-gray-300 dark:text-gray-600">|</span>'+
    '<span class="text-gray-500 dark:text-gray-400 shrink-0">'+safeParams+'</span>'+
    '<span class="text-gray-300 dark:text-gray-600">|</span>'+
    '<span class="text-gray-500 dark:text-gray-400 shrink-0">'+safeQuality+'</span>'+
    '<span class="text-gray-300 dark:text-gray-600">|</span>'+
    (typeof formatLightningAmountHtml==='function'?formatLightningAmountHtml(costStr):'<span class="text-gray-500 dark:text-gray-400 shrink-0 tabular-nums inline-flex items-center gap-0.5">'+window.LIGHTNING_ICON_HTML+costStr+'</span>')+
    audioCardActionsHtml+
    '</div>'+
    '<div class="audio-result-prompt-wrap mb-4 w-full">'+
    '<p class="result-prompt-text text-gray-700 dark:text-gray-300 text-[12px] w-full"><span class="result-prompt-body">'+safePrompt+'</span></p>'+
    '<span class="result-prompt-toggle-hint hidden"></span></div>'+
    audioBlockHtml+
    '<div class="hidden card-params" data-params="'+cardParams+'"></div>'+
    '</div>';

  var container=document.getElementById('audio-results-container');
  var generatingState=document.getElementById('audio-generating-state');
  if(container){
    container.classList.remove('hidden');
    if(generatingState){
      generatingState.insertAdjacentHTML('beforebegin',cardHtml);
      var newCard=generatingState.previousElementSibling;
      if(newCard){
        requestAnimationFrame(function(){
          requestAnimationFrame(function(){
            if(typeof refreshResultPromptClamp==='function') refreshResultPromptClamp(newCard);
            newCard.scrollIntoView({behavior:'smooth',block:'nearest'});
            syncAudioResultsBottomPadding();
          });
        });
      }
    }else{
      container.insertAdjacentHTML('beforeend',cardHtml);
      requestAnimationFrame(function(){
        var last=container.lastElementChild;
        if(last&&typeof refreshResultPromptClamp==='function') refreshResultPromptClamp(last);
        syncAudioResultsBottomPadding();
      });
    }
  }

  var inputArea=document.getElementById('audio-input-area');
  if(inputArea) inputArea.classList.remove('pointer-events-none','opacity-50');
  setAudioGenButtonState(false);
  showToast('✅ 语音生成完成');
  if(typeof placeAudioHotAppsStrip==='function')placeAudioHotAppsStrip();
}

window.deleteAudioResultCard=function(arg){
  var card;
  if(typeof arg==='string') card=document.getElementById(arg);
  else if(arg&&arg.closest) card=arg.closest('[id^="audio-result-card-"]');
  if(card){
    card.remove();
    var container=document.getElementById('audio-results-container');
    var hasCards=container&&container.querySelector('[id^="audio-result-card-"]');
    if(!hasCards&&container) container.classList.add('hidden');
    syncAudioResultsBottomPadding();
    if(typeof syncAudioResultsEmptyState==='function')syncAudioResultsEmptyState();
    if(typeof placeAudioHotAppsStrip==='function')placeAudioHotAppsStrip();
    showToast('已删除结果');
  }
};

window.regenerateAudio=function(cardId){
  if(cardId){
    var card=document.getElementById(cardId);
    if(card){
      var paramsEl=card.querySelector('.card-params');
      if(paramsEl){
        try{
          currentAudioEditParams=JSON.parse(paramsEl.getAttribute('data-params').replace(/&quot;/g,'"'));
        }catch(e){}
      }
    }
  }
  startAudioGeneration();
};

window.reEditAudio=function(cardId){
  if(!cardId) return;
  var card=document.getElementById(cardId);
  if(!card){ showToast('❌ 找不到结果卡片'); return; }
  var paramsEl=card.querySelector('.card-params');
  if(!paramsEl){ showToast('❌ 找不到参数数据'); return; }
  var params;
  try{
    var raw=paramsEl.getAttribute('data-params');
    if(!raw){ showToast('❌ 参数数据为空'); return; }
    params=JSON.parse(raw.replace(/&quot;/g,'"'));
  }catch(e){
    showToast('❌ 参数解析失败');
    return;
  }
  currentAudioEditParams=params;

  var emptyState=document.getElementById('audio-empty-state');
  var resultsContainer=document.getElementById('audio-results-container');
  if(emptyState) emptyState.classList.add('hidden');
  if(resultsContainer) resultsContainer.classList.remove('hidden');

  if(params.model){
    var modelText=document.getElementById('current-audio-model-text');
    if(modelText) modelText.textContent=params.model;
  }
  if(params.voice&&params.voice.indexOf('选择音色')<0){
    var catalog=window.AUDIO_VOICE_CATALOG||[];
    var voiceMatch=catalog.find(function(v){return v.name===params.voice||v.id===params.voice;});
    if(!voiceMatch&&typeof addAudioVoiceToCatalog==='function') voiceMatch=addAudioVoiceToCatalog({name:params.voice,category:'我的音色'});
    if(voiceMatch&&typeof selectAudioVoice==='function') selectAudioVoice(voiceMatch.id,{closeModal:false,toast:false});
    else if(typeof syncVoiceSelectHidden==='function'){
      syncVoiceSelectHidden(params.voice,params.voice);
      if(typeof updateAudioVoicePickerButton==='function') updateAudioVoicePickerButton({name:params.voice});
    }
  }
  if(params.speed) setAudioOutputParam('speed',params.speed);
  if(params.tone) setAudioOutputParam('tone',params.tone);
  if(params.effect) setAudioOutputParam('effect',params.effect);
  if(params.emotion&&typeof setAudioEmotion==='function'){
    var eVal=params.emotion;
    var eLbl=params.emotionLabel||'';
    var opts=window.AUDIO_EMOTION_OPTIONS||[];
    var mapped=opts.find(function(o){return o.emoji===eVal||o.label===eVal||o.label===eLbl;});
    if(mapped) setAudioEmotion(mapped.emoji,mapped.label,true);
    else setAudioEmotion(eVal,eLbl,true);
  }else if(typeof clearAudioEmotion==='function') clearAudioEmotion(false);
  if(params.quality){
    var qSel=document.getElementById('audio-param-quality');
    if(qSel) qSel.value=params.quality;
  }
  if(typeof updateAudioOutputParamsLabel==='function') updateAudioOutputParamsLabel();
  if(typeof updateAudioGenCost==='function') updateAudioGenCost();

  var promptInput=document.getElementById('audio-prompt-textarea');
  if(promptInput&&params.prompt!==undefined) promptInput.value=params.prompt;

  var inputArea=document.getElementById('audio-input-area');
  if(inputArea) inputArea.classList.remove('pointer-events-none','opacity-50');
  setAudioGenButtonState(false);
  syncAudioResultsBottomPadding();
  if(promptInput) promptInput.focus();
  showToast('📝 已加载到输入框，展示区保持不变');
};

window.downloadResultAudio=function(btn){
  showToast('⬇️ 开始下载音频...');
};

window.publishResultAudio=function(btn){
  if(typeof publishResultImage==='function'){
    publishResultImage(btn);
    return;
  }
  var card=btn&&btn.closest?btn.closest('[id^="audio-result-card-"]'):null;
  if(!card){ showToast('❌ 找不到结果卡片'); return; }
  showToast('📤 请先完成页面加载后重试');
};

window.previewResultAudio=function(btn){
  showToast('▶ 播放音频（演示）');
};

// ===== API 密钥页面函数 =====
let currentStrategy = 'price';
let currentLimit = 0;
const generatedKey = 'sk-guid-abc123def456ghi789jkl012mno345pqr678stu';

// 模型选择下拉
window.toggleModelDropdown = function(e) {
  e.stopPropagation();
  const dropdown = e.currentTarget.closest('.model-select-wrapper')?.querySelector('.model-dropdown');
  if(!dropdown) return;
  const isHidden = dropdown.classList.contains('hidden');
  // 关闭所有其他下拉
  document.querySelectorAll('.model-dropdown, .limit-dropdown').forEach(d => d.classList.add('hidden'));
  if(isHidden) dropdown.classList.remove('hidden');
};
window.selectModel = function(el) {
  const name = el.dataset.model;
  const wrapper = el.closest('.model-select-wrapper');
  if(wrapper) {
    const text = wrapper.querySelector('.model-select-text');
    if(text) { text.textContent = name; text.classList.remove('text-gray-500'); }
  }
  const dropdown = el.closest('.model-dropdown');
  if(dropdown) dropdown.classList.add('hidden');
};
// 模型搜索 & 选项点击（直接执行，不依赖 DOMContentLoaded）
(function initModelDropdown() {
  // 模型搜索过滤
  document.querySelector('.model-search')?.addEventListener('input', function() {
    const q = this.value.toLowerCase();
    const options = this.closest('.model-dropdown')?.querySelectorAll('.model-option');
    if(!options) return;
    options.forEach(o => {
      const name = o.dataset.model?.toLowerCase() || '';
      o.style.display = name.includes(q) ? '' : 'none';
    });
  });
  // 模型下拉选项点击
  document.querySelectorAll('.model-option').forEach(o => {
    o.addEventListener('click', function() { selectModel(this); });
  });
  // 调用限额下拉选项点击
  document.querySelectorAll('.limit-option').forEach(o => {
    o.addEventListener('click', function() {
      const limit = this.dataset.limit;
      const wrapper = this.closest('.limit-select-wrapper');
      if(wrapper) {
        const text = wrapper.querySelector('.limit-select-text');
        if(text) {
          if(limit === 'custom') { text.textContent = '自定义...'; }
          else { text.textContent = limit === '0' ? '0 = 不限' : parseInt(limit).toLocaleString() + ' 次/日'; }
        }
      }
      currentLimit = limit;
      const dropdown = this.closest('.limit-dropdown');
      if(dropdown) dropdown.classList.add('hidden');
    });
  });
  // 点击外部关闭所有下拉
  document.addEventListener('click', function() {
    document.querySelectorAll('.model-dropdown, .limit-dropdown').forEach(d => d.classList.add('hidden'));
  });
});

// 渠道策略选择
window.selectStrategy = function(el) {
  document.querySelectorAll('#create-key-modal .channel-strategy-btn').forEach(b => {
    b.classList.remove('bg-blue-500', 'text-white');
    b.classList.add('border', 'border-gray-200', 'dark:border-gray-600', 'text-gray-600', 'dark:text-gray-400');
  });
  el.classList.add('bg-blue-500', 'text-white');
  el.classList.remove('border', 'border-gray-200', 'dark:border-gray-600', 'text-gray-600', 'dark:text-gray-400');
  currentStrategy = el.dataset.strategy;
};

// 确认创建密钥
window.confirmCreateKey = function() {
  const name = document.getElementById('new-key-name')?.value?.trim();
  if(!name) { showToast('⚠️ 请填写密钥名称'); return; }
  closeModal('create-key-modal');
  // 重置表单
  document.getElementById('new-key-name').value = '';
  document.querySelectorAll('.limit-select-text').forEach(t => t.textContent = '0 = 不限');
  document.querySelectorAll('#create-key-modal .channel-strategy-btn').forEach((b,i) => {
    b.classList[i===0?'add':'remove']('bg-blue-500','text-white');
    b.classList[i===0?'remove':'add']('border','border-gray-200','dark:border-gray-600','text-gray-600','dark:text-gray-400');
  });
  // 打开成功弹窗
  setTimeout(() => {
    document.getElementById('new-key-value').value = generatedKey;
    openModal('create-key-success-modal');
  }, 300);
};

// 复制新密钥
window.copyNewKey = function() {
  const input = document.getElementById('new-key-value');
  if(input) {
    input.select();
    navigator.clipboard?.writeText(input.value);
  }
  showToast('📋 密钥已复制到剪贴板');
};

// 调用限额下拉
window.toggleLimitDropdown = function(e) {
  e.stopPropagation();
  const dropdown = e.currentTarget.closest('.limit-select-wrapper')?.querySelector('.limit-dropdown');
  if(!dropdown) return;
  const isHidden = dropdown.classList.contains('hidden');
  document.querySelectorAll('.model-dropdown, .limit-dropdown').forEach(d => d.classList.add('hidden'));
  if(isHidden) dropdown.classList.remove('hidden');
};

// ===== FAQ 手风琴展开/折叠 =====
window.toggleFaq = function(header) {
  const item = header.closest('.faq-item');
  if(!item) return;
  const body = item.querySelector('.faq-body');
  const icon = item.querySelector('.faq-icon');
  if(!body || !icon) return;
  const isOpen = !body.classList.contains('hidden');
  // 关闭所有其他 FAQ
  document.querySelectorAll('.faq-item .faq-body').forEach(b => { if(b !== body) b.classList.add('hidden'); });
  document.querySelectorAll('.faq-item .faq-icon').forEach(i => { if(i !== icon) i.textContent = '▼'; });
  // 切换当前
  if(isOpen) {
    body.classList.add('hidden');
    icon.textContent = '▼';
  } else {
    body.classList.remove('hidden');
    icon.textContent = '▲';
  }
};

// ===== 模型广场数据 & 函数 =====
const modelData = [
  {name:'gpt-image-2-all',  provider:'OpenAI',   billing:'按量计费', tag:'econ_image',  endpoint:'openai', endpointPath:'/v1/chat/completions', inPrice:'$75.0000/1M', outPrice:'$150.0000/1M', defaultPrice:'$75.0000', vipPrice:'$150.0000', chain:'auto分组调用链路 → default分组', desc:'OpenAI图像生成模型标准版'},
  {name:'gpt-image-2-vip', provider:'OpenAI',   billing:'按量计费', tag:'econ_image',  endpoint:'openai', endpointPath:'/v1/chat/completions', inPrice:'$75.0000/1M', outPrice:'$150.0000/1M', defaultPrice:'$75.0000', vipPrice:'$150.0000', chain:'auto分组调用链路 → default分组', desc:'OpenAI最新一代图像生成模型，语义理解与细节表现更强'},
  {name:'deepseek-v4-flash:cloud', provider:'DeepSeek', billing:'按量计费', tag:'flash3-lite', endpoint:'openai', endpointPath:'/v1/chat/completions', inPrice:'$2.0000/1M', outPrice:'$2.0000/1M', defaultPrice:'$2.0000', vipPrice:'$75.0000', chain:'auto分组调用链路 → default分组', desc:'DeepSeek最新快速推理模型'},
  {name:'deepseek-v4-pro:cloud', provider:'DeepSeek', billing:'按量计费', tag:'flash3-lite', endpoint:'openai', endpointPath:'/v1/chat/completions', inPrice:'$75.0000/1M', outPrice:'$75.0000/1M', defaultPrice:'$75.0000', vipPrice:'$150.0000', chain:'auto分组调用链路 → default分组', desc:'DeepSeek专业推理模型'},
  {name:'gemini-2.0-flash-lite', provider:'Google', billing:'按量计费', tag:'flash3-lite', endpoint:'gemini', endpointPath:'/v1/chat/completions', inPrice:'$75.0000/1M', outPrice:'$300.0000/1M', defaultPrice:'$75.0000', vipPrice:'$300.0000', chain:'auto分组调用链路 → default分组', desc:'Gemini 2.0轻量快速模型'},
  {name:'gemini-2.5-flash-lite', provider:'Google', billing:'按量计费', tag:'flash3-lite', endpoint:'gemini', endpointPath:'/v1/chat/completions', inPrice:'$75.0000/1M', outPrice:'$300.0000/1M', defaultPrice:'$75.0000', vipPrice:'$300.0000', chain:'auto分组调用链路 → default分组', desc:'Gemini 2.5轻量快速模型'},
  {name:'gemini-3-flash-preview', provider:'Google', billing:'按量计费', tag:'flash3-lite', endpoint:'gemini', endpointPath:'/v1/chat/completions', inPrice:'$2.0000/1M', outPrice:'$2.0000/1M', defaultPrice:'$2.0000', vipPrice:'$75.0000', chain:'auto分组调用链路 → default分组', desc:'Gemini 3 Flash 预览版'},
  {name:'gemini-3.1-flash-image-preview', provider:'Google', billing:'按量计费', tag:'flash3-lite', endpoint:'gemini', endpointPath:'/v1/chat/completions', inPrice:'$75.0000/1M', outPrice:'$75.0000/1M', defaultPrice:'$75.0000', vipPrice:'$150.0000', chain:'auto分组调用链路 → default分组', desc:'Gemini 3.1 Flash 图像模型预览版'},
  {name:'gemini-3.1-flash-lite-preview', provider:'Google', billing:'按量计费', tag:'flash3-lite', endpoint:'gemini', endpointPath:'/v1/chat/completions', inPrice:'$75.0000/1M', outPrice:'$75.0000/1M', defaultPrice:'$75.0000', vipPrice:'$150.0000', chain:'auto分组调用链路 → default分组', desc:'Gemini 3.1 Flash Lite 预览版'},
  {name:'chatglm-pro:cloud', provider:'智谱', billing:'按量计费', tag:'embedding', endpoint:'openai', endpointPath:'/v1/chat/completions', inPrice:'$1.0000/1M', outPrice:'$2.0000/1M', defaultPrice:'$1.0000', vipPrice:'$2.0000', chain:'auto分组调用链路 → default分组', desc:'智谱 ChatGLM 专业版'},
  {name:'chatglm-std:cloud', provider:'智谱', billing:'按量计费', tag:'embedding', endpoint:'openai', endpointPath:'/v1/chat/completions', inPrice:'$0.5000/1M', outPrice:'$1.0000/1M', defaultPrice:'$0.5000', vipPrice:'$1.0000', chain:'auto分组调用链路 → default分组', desc:'智谱 ChatGLM 标准版'},
  {name:'moonshot-v1:cloud', provider:'Moonshot', billing:'按量计费', tag:'embedding', endpoint:'openai', endpointPath:'/v1/chat/completions', inPrice:'$3.0000/1M', outPrice:'$6.0000/1M', defaultPrice:'$3.0000', vipPrice:'$6.0000', chain:'auto分组调用链路 → default分组', desc:'Moonshot 月之暗面对话模型'},
  {name:'qwen-max:cloud', provider:'阿里巴巴', billing:'按量计费', tag:'embedding', endpoint:'openai', endpointPath:'/v1/chat/completions', inPrice:'$2.5000/1M', outPrice:'$5.0000/1M', defaultPrice:'$2.5000', vipPrice:'$5.0000', chain:'auto分组调用链路 → default分组', desc:'通义千问 Max 旗舰版'},
  {name:'qwen-turbo:cloud', provider:'阿里巴巴', billing:'按量计费', tag:'embedding', endpoint:'openai', endpointPath:'/v1/chat/completions', inPrice:'$0.8000/1M', outPrice:'$1.5000/1M', defaultPrice:'$0.8000', vipPrice:'$1.5000', chain:'auto分组调用链路 → default分组', desc:'通义千问 Turbo 快速版'},
  {name:'gpt-4-turbo:cloud', provider:'未知供应商', billing:'按量计费', tag:'embedding', endpoint:'openai', endpointPath:'/v1/chat/completions', inPrice:'$10.0000/1M', outPrice:'$30.0000/1M', defaultPrice:'$10.0000', vipPrice:'$30.0000', chain:'auto分组调用链路 → default分组', desc:'GPT-4 Turbo 云端版'},
  {name:'claude-3-opus:cloud', provider:'未知供应商', billing:'按量计费', tag:'embedding', endpoint:'openai', endpointPath:'/v1/chat/completions', inPrice:'$15.0000/1M', outPrice:'$75.0000/1M', defaultPrice:'$15.0000', vipPrice:'$75.0000', chain:'auto分组调用链路 → default分组', desc:'Claude 3 Opus 云端版'},
  {name:'deepseek-r1:cloud', provider:'DeepSeek', billing:'按量计费', tag:'embedding', endpoint:'openai', endpointPath:'/v1/chat/completions', inPrice:'$1.5000/1M', outPrice:'$6.0000/1M', defaultPrice:'$1.5000', vipPrice:'$6.0000', chain:'auto分组调用链路 → default分组', desc:'DeepSeek R1 推理模型'},
  {name:'deepseek-v3:cloud', provider:'DeepSeek', billing:'按量计费', tag:'embedding', endpoint:'openai', endpointPath:'/v1/chat/completions', inPrice:'$0.5000/1M', outPrice:'$2.0000/1M', defaultPrice:'$0.5000', vipPrice:'$2.0000', chain:'auto分组调用链路 → default分组', desc:'DeepSeek V3 通用模型'},
  {name:'glm-4-plus:cloud', provider:'智谱', billing:'按量计费', tag:'embedding', endpoint:'openai', endpointPath:'/v1/chat/completions', inPrice:'$2.0000/1M', outPrice:'$4.0000/1M', defaultPrice:'$2.0000', vipPrice:'$4.0000', chain:'auto分组调用链路 → default分组', desc:'智谱 GLM-4 Plus 增强版'},
  {name:'grok-3:cloud', provider:'未知供应商', billing:'按量计费', tag:'embedding', endpoint:'openai', endpointPath:'/v1/chat/completions', inPrice:'$5.0000/1M', outPrice:'$15.0000/1M', defaultPrice:'$5.0000', vipPrice:'$15.0000', chain:'auto分组调用链路 → default分组', desc:'xAI Grok 3 对话模型'},
  {name:'gemini-2.5-pro:cloud', provider:'Google', billing:'按量计费', tag:'embedding', endpoint:'gemini', endpointPath:'/v1/chat/completions', inPrice:'$10.0000/1M', outPrice:'$40.0000/1M', defaultPrice:'$10.0000', vipPrice:'$40.0000', chain:'auto分组调用链路 → default分组', desc:'Gemini 2.5 Pro 专业版'},
  {name:'gemini-3-pro:cloud', provider:'Google', billing:'按量计费', tag:'embedding', endpoint:'gemini', endpointPath:'/v1/chat/completions', inPrice:'$15.0000/1M', outPrice:'$60.0000/1M', defaultPrice:'$15.0000', vipPrice:'$60.0000', chain:'auto分组调用链路 → default分组', desc:'Gemini 3 Pro 旗舰版'},
  {name:'seedream-v2:cloud', provider:'未知供应商', billing:'按次计费', tag:'econ_image', endpoint:'openai', endpointPath:'/v1/images/generations', inPrice:'$0.0500/次', outPrice:'-', defaultPrice:'$0.0500', vipPrice:'$0.0800', chain:'auto分组调用链路 → default分组', desc:'Seedream V2 图像生成模型'},
  {name:'midjourney-v7:cloud', provider:'未知供应商', billing:'按次计费', tag:'econ_image', endpoint:'openai', endpointPath:'/v1/images/generations', inPrice:'$0.0800/次', outPrice:'-', defaultPrice:'$0.0800', vipPrice:'$0.1200', chain:'auto分组调用链路 → default分组', desc:'Midjourney V7 图像生成'},
  {name:'sora-2:cloud', provider:'未知供应商', billing:'按次计费', tag:'econ_image', endpoint:'openai', endpointPath:'/v1/video/generations', inPrice:'$0.3500/次', outPrice:'-', defaultPrice:'$0.3500', vipPrice:'$0.5000', chain:'auto分组调用链路 → default分组', desc:'Sora 2 视频生成模型'},
  {name:'kling-2:cloud', provider:'未知供应商', billing:'按次计费', tag:'econ_image', endpoint:'openai', endpointPath:'/v1/video/generations', inPrice:'$0.2200/次', outPrice:'-', defaultPrice:'$0.2200', vipPrice:'$0.3500', chain:'auto分组调用链路 → default分组', desc:'Kling 2.0 视频生成'},
  {name:'runway-gen4:cloud', provider:'未知供应商', billing:'按次计费', tag:'econ_image', endpoint:'openai', endpointPath:'/v1/video/generations', inPrice:'$0.2800/次', outPrice:'-', defaultPrice:'$0.2800', vipPrice:'$0.4200', chain:'auto分组调用链路 → default分组', desc:'Runway Gen-4 视频生成'},
  {name:'pika-2:cloud', provider:'未知供应商', billing:'按次计费', tag:'econ_image', endpoint:'openai', endpointPath:'/v1/video/generations', inPrice:'$0.1800/次', outPrice:'-', defaultPrice:'$0.1800', vipPrice:'$0.2800', chain:'auto分组调用链路 → default分组', desc:'Pika 2.0 视频生成'},
  {name:'stable-diffusion-4:cloud', provider:'未知供应商', billing:'按次计费', tag:'econ_image', endpoint:'openai', endpointPath:'/v1/images/generations', inPrice:'$0.0400/次', outPrice:'-', defaultPrice:'$0.0400', vipPrice:'$0.0600', chain:'auto分组调用链路 → default分组', desc:'Stable Diffusion 4 图像生成'},
  {name:'flux-pro:cloud', provider:'未知供应商', billing:'按次计费', tag:'econ_image', endpoint:'openai', endpointPath:'/v1/images/generations', inPrice:'$0.0600/次', outPrice:'-', defaultPrice:'$0.0600', vipPrice:'$0.1000', chain:'auto分组调用链路 → default分组', desc:'FLUX.1 Pro 图像生成'},
  {name:'dalle-4:cloud', provider:'OpenAI', billing:'按次计费', tag:'econ_image', endpoint:'openai', endpointPath:'/v1/images/generations', inPrice:'$0.1200/次', outPrice:'-', defaultPrice:'$0.1200', vipPrice:'$0.1800', chain:'auto分组调用链路 → default分组', desc:'DALL·E 4 图像生成'},
  {name:'vidu-mv:cloud', provider:'未知供应商', billing:'按次计费', tag:'econ_image', endpoint:'openai', endpointPath:'/v1/video/generations', inPrice:'$0.1446/秒', outPrice:'-', defaultPrice:'$0.1446', vipPrice:'$0.2000', chain:'auto分组调用链路 → default分组', desc:'VIDU 音乐MV视频生成'},
  {name:'nano-banana-pro:cloud', provider:'未知供应商', billing:'按次计费', tag:'econ_image', endpoint:'openai', endpointPath:'/v1/images/generations', inPrice:'$0.0800/次', outPrice:'-', defaultPrice:'$0.0800', vipPrice:'$0.1200', chain:'auto分组调用链路 → default分组', desc:'Nano Banana Pro 图像生成'}
];

let modelViewMode = 'table';
let modelPageSize = 10;

// 渲染模型表格
function renderModelTable(data) {
  const tbody = document.getElementById('model-table-body');
  if(!tbody) return;
  tbody.innerHTML = data.slice(0, modelPageSize).map(m => `
    <tr class="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition">
      <td class="p-3 pl-5 font-mono text-[11px]">${m.name}</td>
      <td class="p-3">${m.provider}</td>
      <td class="p-3">${m.billing}</td>
      <td class="p-3 text-right font-mono text-[11px]">${m.inPrice}</td>
      <td class="p-3 text-right font-mono text-[11px]">${m.outPrice}</td>
      <td class="p-3 text-center"><button class="model-detail-btn text-blue-500 hover:underline text-[10px]" data-name="${m.name}">详情</button></td>
    </tr>
  `).join('');
  // 绑定详情按钮
  tbody.querySelectorAll('.model-detail-btn').forEach(b => b.addEventListener('click', function() {
    const name = this.dataset.name;
    const model = modelData.find(m => m.name === name);
    if(model) openModelDetail(model);
  }));
}

// 渲染模型卡片
function renderModelCards(data) {
  const grid = document.getElementById('model-card-grid');
  if(!grid) return;
  grid.innerHTML = data.slice(0, modelPageSize).map(m => `
    <div class="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div class="text-xs font-semibold font-mono truncate mb-1" title="${m.name}">${m.name}</div>
      <div class="text-[10px] text-gray-400 mb-2">${m.provider}</div>
      <div class="border-t border-gray-100 dark:border-gray-700 my-2"></div>
      <div class="text-[10px] text-gray-500 mb-1">${m.billing}</div>
      <div class="text-[10px] text-gray-500">输入: <span class="font-mono">${m.inPrice}</span></div>
      <div class="text-[10px] text-gray-500 mb-2">输出: <span class="font-mono">${m.outPrice}</span></div>
      <button class="model-detail-btn w-full py-1.5 mt-1 text-[10px] bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition" data-name="${m.name}">查看详情</button>
    </div>
  `).join('');
  grid.querySelectorAll('.model-detail-btn').forEach(b => b.addEventListener('click', function() {
    const name = this.dataset.name;
    const model = modelData.find(m => m.name === name);
    if(model) openModelDetail(model);
  }));
}

// 刷新模型列表
function refreshModelList() {
  let filtered = [...modelData];
  // 供应商筛选
  const activeProvider = document.querySelector('.provider-chip.active');
  if(activeProvider) {
    const prov = activeProvider.dataset.provider;
    if(prov !== 'all') filtered = filtered.filter(m => m.provider === prov);
  }
  // 搜索
  const searchVal = document.querySelector('.model-search-input')?.value?.toLowerCase().trim();
  if(searchVal) filtered = filtered.filter(m => m.name.toLowerCase().includes(searchVal));
  // 更新计数
  document.querySelector('.model-count').textContent = filtered.length;
  // 渲染
  if(modelViewMode === 'table') renderModelTable(filtered);
  else renderModelCards(filtered);
}

// 打开模型详情
function openModelDetail(model) {
  document.querySelector('.model-detail-title').textContent = model.name;
  document.querySelector('.model-detail-name').textContent = model.name;
  document.querySelector('.model-detail-provider').textContent = model.provider;
  document.querySelector('.model-detail-billing').textContent = model.billing;
  document.querySelector('.model-detail-desc').textContent = model.desc;
  document.querySelector('.model-detail-endpoint').textContent = model.endpoint + ': ' + model.endpointPath;
  if(typeof setLightningPriceElement==='function'){
    setLightningPriceElement(document.querySelector('.model-detail-in-price'), model.inPrice + ' / ' + (model.billing === '按次计费' ? '次' : '1M tokens'));
    setLightningPriceElement(document.querySelector('.model-detail-out-price'), model.outPrice + ' / ' + (model.billing === '按次计费' ? '次' : '1M tokens'));
    setLightningPriceElement(document.querySelector('.model-detail-def-price'), model.defaultPrice);
    setLightningPriceElement(document.querySelector('.model-detail-vip-price'), model.vipPrice);
  }else{
    document.querySelector('.model-detail-in-price').textContent = model.inPrice + ' / ' + (model.billing === '按次计费' ? '次' : '1M tokens');
    document.querySelector('.model-detail-out-price').textContent = model.outPrice + ' / ' + (model.billing === '按次计费' ? '次' : '1M tokens');
    document.querySelector('.model-detail-def-price').textContent = model.defaultPrice;
    document.querySelector('.model-detail-vip-price').textContent = model.vipPrice;
  }
  document.querySelector('.model-detail-chain').textContent = model.chain;
  openModal('model-detail-modal');
}

// 复制端点
window.copyDetailEndpoint = function() {
  const ep = document.querySelector('.model-detail-endpoint')?.textContent;
  if(ep) navigator.clipboard?.writeText(ep);
  showToast('📋 API端点已复制');
};

// ===== 模型广场 V2 - 卡片视图渲染 =====
function getProviderLogo(provider) {
  const logos = {
    'OpenAI': '<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.896zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" fill="currentColor"/></svg>',
    'Google': '<svg class="w-6 h-6" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>',
    'DeepSeek': '<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#4F6DFF"/><path d="M8 12h8M12 8v8" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>',
    '智谱': '<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="4" fill="#10B981"/><text x="12" y="16" text-anchor="middle" fill="white" font-size="10" font-weight="bold">智</text></svg>',
    'Moonshot': '<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#8B5CF6"/><circle cx="15" cy="10" r="4" fill="white" opacity="0.6"/></svg>',
    '阿里巴巴': '<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="4" fill="#FF6A00"/><text x="12" y="16" text-anchor="middle" fill="white" font-size="8" font-weight="bold">Ali</text></svg>'
  };
  return logos[provider] || '<div class="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px] text-gray-500">' + provider.charAt(0) + '</div>';
}

// 渲染新模型卡片（与截图一致）
function renderModelCardsNew(data) {
  const grid = document.getElementById('model-card-grid-new');
  if(!grid) return;
  
  const displayData = data.slice(0, 20);
  
  grid.innerHTML = displayData.map(m => {
    const logo = getProviderLogo(m.provider);
    return `
    <div class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-all relative group">
      <div class="flex items-start gap-3">
        <div class="w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400 shrink-0">
          ${logo}
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-1">
            <span class="text-sm font-semibold text-gray-900 dark:text-white truncate" title="${m.name}">${m.name}</span>
            <div class="flex items-center gap-1.5 ml-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onclick="copyModelName('${m.name.replace(/'/g, "\\'")}')" class="text-gray-400 hover:text-blue-500 text-xs" title="复制">📋</button>
              <input type="checkbox" onchange="updateSelectedModels()" class="model-checkbox accent-blue-500 w-3.5 h-3.5 cursor-pointer" data-name="${m.name}">
            </div>
          </div>
          <div class="text-[11px] text-gray-500 dark:text-gray-400 space-y-0.5">
            <div>输入价格 ${currentCurrency}${formatPrice(m.inPrice)}/${priceUnit}</div>
            <div>补全价格 ${currentCurrency}${formatPrice(m.outPrice)}/${priceUnit}</div>
          </div>
        </div>
      </div>
      <div class="mt-3 flex items-center justify-between">
        <span class="inline-block px-2 py-0.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded text-[10px] font-medium">${m.billing}</span>
        <button onclick="openModelDetail(modelData.find(mo=>mo.name=='${m.name.replace(/'/g, "\\'")}'))" class="text-[10px] text-blue-500 hover:text-blue-700 hover:underline">详情</button>
      </div>
      <!-- 倍率信息 -->
      <div class="rate-info mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 hidden">
        <div class="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400 mb-1">
          <span>倍率信息</span>
          <span title="模型的调用倍率">❓</span>
        </div>
        <div class="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400">
          <span>模型: <span class="font-mono text-gray-700 dark:text-gray-300">${m.rateModel || (Math.random() * 50 + 10).toFixed(1)}</span></span>
          <span>补全: <span class="font-mono text-gray-700 dark:text-gray-300">${m.rateCompletion || Math.floor(Math.random() * 5 + 1)}</span></span>
          <span>分组: <span class="font-mono text-gray-700 dark:text-gray-300">${m.rateGroup || 1}</span></span>
        </div>
      </div>
    </div>
    `;
  }).join('');
  
  // 更新计数
  const badge = document.getElementById('model-count-badge');
  if(badge) badge.textContent = data.length;
}

// ===== 模型视图切换 =====
let currentModelView = 'card'; // 当前视图模式
let priceUnit = 'M'; // 当前价格单位 M=百万tokens, K=千tokens

function toggleModelView() {
  currentModelView = currentModelView === 'card' ? 'list' : 'card';
  const toggleBtn = document.getElementById('view-toggle-btn');
  const cardGrid = document.getElementById('model-card-grid-new');
  const listView = document.getElementById('model-list-view-new');
  
  if(currentModelView === 'card') {
    toggleBtn.className = 'flex items-center gap-1.5 px-3 py-2 text-[11px] border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-600 dark:text-gray-400';
    cardGrid.classList.remove('hidden');
    listView.classList.add('hidden');
  } else {
    toggleBtn.className = 'flex items-center gap-1.5 px-3 py-2 text-[11px] border border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-lg transition text-blue-500 font-medium';
    listView.classList.remove('hidden');
    cardGrid.classList.add('hidden');
    // 渲染列表视图
    renderModelListView(modelData.slice(0, 20));
  }
}

// 切换价格单位
function togglePriceUnit() {
  priceUnit = priceUnit === 'M' ? 'K' : 'M';
  const unitBtn = document.getElementById('unit-toggle-btn');
  unitBtn.textContent = priceUnit;
  // 检查倍率开关是否打开
  const rateSwitch = document.querySelector('.toggle-switch.active');
  const rateEnabled = rateSwitch !== null;
  // 重新渲染当前视图
  if(currentModelView === 'card') {
    filterModelCards();
  } else {
    renderModelListView(modelData.slice(0, 20));
  }
  // 保持倍率信息状态
  if(rateEnabled) {
    document.querySelectorAll('.rate-info').forEach(info => info.classList.remove('hidden'));
  }
}

// 格式化价格显示
function formatPrice(price) {
  // 如果是字符串，先提取数字部分
  let numPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) : price;
  if(priceUnit === 'K') {
    // 转换为 /K (M 除以 1000 = K)
    return (numPrice / 1000).toFixed(3);
  }
  return numPrice.toFixed(4);
}

// 渲染模型列表视图
function renderModelListView(data) {
  const listView = document.getElementById('model-list-view-new');
  if(!listView) return;
  
  listView.innerHTML = `
  <div class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
    <table class="w-full text-[11px]">
      <thead class="bg-gray-50 dark:bg-gray-700/50">
        <tr>
          <th class="px-3 py-2.5 text-left font-medium text-gray-500 dark:text-gray-400 w-10"></th>
          <th class="px-3 py-2.5 text-left font-medium text-gray-500 dark:text-gray-400">模型名称</th>
          <th class="px-3 py-2.5 text-left font-medium text-gray-500 dark:text-gray-400">供应商</th>
          <th class="px-3 py-2.5 text-left font-medium text-gray-500 dark:text-gray-400">描述</th>
          <th class="px-3 py-2.5 text-left font-medium text-gray-500 dark:text-gray-400">标签</th>
          <th class="px-3 py-2.5 text-left font-medium text-gray-500 dark:text-gray-400">计费类型</th>
          <th class="px-3 py-2.5 text-left font-medium text-gray-500 dark:text-gray-400">可用端点类型</th>
          <th class="px-3 py-2.5 text-left font-medium text-gray-500 dark:text-gray-400">模型价格</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
        ${data.map(m => {
          const logo = getProviderLogo(m.provider);
          const endpointTags = (m.endpoint || 'openai').split(',').map(e => 
            `<span class="inline-block px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded text-[10px]">${e.trim()}</span>`
          ).join(' ');
          return `
          <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/30 group">
            <td class="px-3 py-2.5">
              <input type="checkbox" onchange="updateSelectedModels()" class="model-checkbox accent-blue-500 w-3.5 h-3.5 cursor-pointer" data-name="${m.name}">
            </td>
            <td class="px-3 py-2.5">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400">${logo}</div>
                <span class="font-medium text-gray-900 dark:text-white">${m.name}</span>
              </div>
            </td>
            <td class="px-3 py-2.5 text-gray-600 dark:text-gray-400">${m.provider}</td>
            <td class="px-3 py-2.5 text-gray-500 dark:text-gray-400">${m.desc || '-'}</td>
            <td class="px-3 py-2.5">
              <span class="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-[10px]">${m.tag || '-'}</span>
            </td>
            <td class="px-3 py-2.5">
              <span class="inline-block px-2 py-0.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded text-[10px] font-medium">${m.billing}</span>
            </td>
            <td class="px-3 py-2.5">${endpointTags}</td>
            <td class="px-3 py-2.5 text-gray-700 dark:text-gray-300">
              <div>输入价格 ${currentCurrency}${formatPrice(m.inPrice)}/${priceUnit}</div>
              <div>补全价格 ${currentCurrency}${formatPrice(m.outPrice)}/${priceUnit}</div>
            </td>
          </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  </div>
  `;
}

// 筛选模型卡片
function filterModelCards() {
  clearSelectedModels(); // 切换筛选时清空已选
  let filtered = [...modelData];
  
  // 供应商筛选
  const activeProvider = document.querySelector('.model-filter-chip.active[data-filter="provider"]');
  if(activeProvider) {
    const prov = activeProvider.dataset.value;
    if(prov !== 'all') filtered = filtered.filter(m => m.provider === prov);
  }
  
  // 计费类型筛选
  const activeBilling = document.querySelector('.model-filter-chip.active[data-filter="billing"]');
  if(activeBilling) {
    const billing = activeBilling.dataset.value;
    if(billing !== 'all') filtered = filtered.filter(m => m.billing === billing);
  }
  
  // 端点类型筛选
  const activeEndpoint = document.querySelector('.model-filter-chip.active[data-filter="endpoint"]');
  if(activeEndpoint) {
    const ep = activeEndpoint.dataset.value;
    if(ep !== 'all') filtered = filtered.filter(m => m.endpoint === ep);
  }
  
  // 搜索
  const searchVal = document.getElementById('model-search-input')?.value?.toLowerCase().trim();
  if(searchVal) filtered = filtered.filter(m => m.name.toLowerCase().includes(searchVal));

  // 检查倍率开关状态
  const rateSwitch = document.querySelector('.toggle-switch.active');

  // 根据当前视图渲染
  if(currentModelView === 'card') {
    renderModelCardsNew(filtered);
    // 保持倍率信息状态
    if(rateSwitch) {
      document.querySelectorAll('.rate-info').forEach(info => info.classList.remove('hidden'));
    }
  } else {
    renderModelListView(filtered.slice(0, 20));
  }
}

function switchModelView(view) {
  currentModelView = view;
  toggleModelView();
}

// 复制模型名称
function copyModelName(name) {
  navigator.clipboard?.writeText(name);
  showToast('📋 已复制: ' + name);
}

// 已选中的模型名称集合
const selectedModels = new Set();

// 当前货币符号
let currentCurrency = '¥'; // 默认人民币

// 更新已选中模型
function updateSelectedModels() {
  selectedModels.clear();
  document.querySelectorAll('.model-checkbox:checked').forEach(cb => {
    selectedModels.add(cb.dataset.name);
  });
  updateCopyButton();
}

// 更新复制按钮状态
function updateCopyButton() {
  const btn = document.getElementById('copy-btn');
  if (!btn) return;
  
  // 有选中项或有搜索内容时可用
  const hasSelection = selectedModels.size > 0;
  const hasSearch = document.getElementById('model-search-input')?.value?.trim();
  
  if (hasSelection || hasSearch) {
    btn.disabled = false;
    btn.classList.remove('text-gray-400', 'dark:text-gray-500', 'border-gray-200', 'dark:border-gray-600', 'bg-gray-100', 'dark:bg-gray-800', 'cursor-not-allowed');
    btn.classList.add('text-blue-500', 'border-blue-300', 'dark:border-blue-700', 'bg-blue-50', 'dark:bg-blue-900/20', 'hover:bg-blue-100', 'dark:hover:bg-blue-900/30', 'cursor-pointer');
  } else {
    btn.disabled = true;
    btn.classList.add('text-gray-400', 'dark:text-gray-500', 'border-gray-200', 'dark:border-gray-600', 'bg-gray-100', 'dark:bg-gray-800', 'cursor-not-allowed');
    btn.classList.remove('text-blue-500', 'border-blue-300', 'dark:border-blue-700', 'bg-blue-50', 'dark:bg-blue-900/20', 'hover:bg-blue-100', 'dark:hover:bg-blue-900/30', 'cursor-pointer');
  }
}

// 复制（有选中项复制选中项，否则复制搜索内容）
function copyModels() {
  if (selectedModels.size > 0) {
    const names = Array.from(selectedModels).join(', ');
    navigator.clipboard?.writeText(names);
    showToast(`📋 已复制 ${selectedModels.size} 个模型名称`);
  } else {
    const searchVal = document.getElementById('model-search-input')?.value?.trim();
    if (searchVal) {
      navigator.clipboard?.writeText(searchVal);
      showToast('📋 已复制搜索内容');
    }
  }
}

// 重置已选中（切换筛选时清空）
function clearSelectedModels() {
  selectedModels.clear();
  document.querySelectorAll('.model-checkbox').forEach(cb => cb.checked = false);
  updateCopyButton();
}

// 复制搜索
function copyModelSearch() {
  const val = document.getElementById('model-search-input')?.value;
  if(val) {
    navigator.clipboard?.writeText(val);
    showToast('📋 已复制搜索内容');
  }
}

// 切换价格显示
function togglePriceDisplay(el) {
  el.classList.toggle('active');
  const knob = el.querySelector('.knob');
  const currencySelect = document.getElementById('currency-select');
  if(el.classList.contains('active')) {
    el.style.background = '#3B82F6';
    knob.style.transform = 'translateX(16px)';
    // 显示货币选择下拉框
    if(currencySelect) currencySelect.classList.remove('hidden');
  } else {
    el.style.background = '';
    knob.style.transform = '';
    // 隐藏货币选择下拉框
    if(currencySelect) currencySelect.classList.add('hidden');
  }
}

// 货币切换
function onCurrencyChange(value) {
  let currencySymbol = '';
  if(value === 'custom') {
    // 自定义货币，弹窗提示
    const custom = prompt('请输入自定义货币符号（如 EUR, JPY 等）：');
    if(custom && custom.trim()) {
      currencySymbol = custom.trim().toUpperCase();
      // 创建自定义选项
      const select = document.getElementById('currency-select');
      // 检查是否已有自定义选项
      let customOption = select.querySelector('option[value="custom_active"]');
      if(!customOption) {
        customOption = document.createElement('option');
        customOption.value = 'custom_active';
        select.insertBefore(customOption, select.querySelector('option[value="custom"]'));
      }
      customOption.textContent = currencySymbol;
      customOption.selected = true;
      showToast('💱 已切换货币：' + currencySymbol);
    } else {
      // 取消则回到CNY
      document.getElementById('currency-select').value = 'CNY';
      currentCurrency = '¥';
      reRenderModelCards();
      return;
    }
  } else {
    currencySymbol = value;
    currentCurrency = value === 'USD' ? '$' : (value === 'CNY' ? '¥' : value);
    showToast('💱 已切换货币：' + value);
  }
  
  currentCurrency = currencySymbol;
  reRenderModelCards();
}

// 重新渲染模型卡片（保持当前筛选状态）
function reRenderModelCards() {
  let filtered = [...modelData];
  
  const activeProvider = document.querySelector('.model-filter-chip.active[data-filter="provider"]');
  if(activeProvider && activeProvider.dataset.value !== 'all') {
    filtered = filtered.filter(m => m.provider === activeProvider.dataset.value);
  }
  
  const activeBilling = document.querySelector('.model-filter-chip.active[data-filter="billing"]');
  if(activeBilling && activeBilling.dataset.value !== 'all') {
    filtered = filtered.filter(m => m.billing === activeBilling.dataset.value);
  }
  
  const activeEndpoint = document.querySelector('.model-filter-chip.active[data-filter="endpoint"]');
  if(activeEndpoint && activeEndpoint.dataset.value !== 'all') {
    filtered = filtered.filter(m => m.endpoint === activeEndpoint.dataset.value);
  }
  
  const searchVal = document.getElementById('model-search-input')?.value?.toLowerCase().trim();
  if(searchVal) filtered = filtered.filter(m => m.name.toLowerCase().includes(searchVal));
  
  // 检查倍率开关状态
  const rateSwitch = document.querySelector('.toggle-switch.active');
  
  // 根据当前视图渲染
  if(currentModelView === 'card') {
    renderModelCardsNew(filtered);
    // 保持倍率信息状态
    if(rateSwitch) {
      document.querySelectorAll('.rate-info').forEach(info => info.classList.remove('hidden'));
    }
  } else {
    renderModelListView(filtered.slice(0, 20));
  }
}

// 切换倍率显示
function toggleRateDisplay(el) {
  el.classList.toggle('active');
  const knob = el.querySelector('.knob');
  const isActive = el.classList.contains('active');
  if(isActive) {
    el.style.background = '#3B82F6';
    knob.style.transform = 'translateX(16px)';
  } else {
    el.style.background = '';
    knob.style.transform = '';
  }
  // 显示/隐藏倍率信息
  document.querySelectorAll('.rate-info').forEach(info => {
    if(isActive) info.classList.remove('hidden');
    else info.classList.add('hidden');
  });
}

// 模型页筛选区折叠
window.toggleModelHubFilters = function() {
  var panel = document.getElementById('model-filters-panel');
  if (!panel) return;
  var collapsed = panel.classList.toggle('is-collapsed');
  var toggleBtn = panel.querySelector('.model-hub-filters-toggle');
  var hint = document.getElementById('model-filters-toggle-text');
  if (toggleBtn) toggleBtn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
  if (hint) hint.textContent = collapsed ? '展开' : '收起';
};

// 重置筛选
function resetModelFilters() {
  clearSelectedModels();
  document.querySelectorAll('.model-filter-chip').forEach(chip => {
    chip.classList.remove('active');
    chip.style.color = '';
    chip.style.borderColor = '';
    chip.style.background = '';
    if(chip.dataset.value === 'all') {
      chip.classList.add('active');
      chip.style.color = '#7C3AED';
      chip.style.borderColor = '#7C3AED';
      chip.style.background = 'rgba(124,58,237,0.08)';
    }
  });
  document.getElementById('model-search-input').value = '';
  filterModelCards();
}

// 分页
function modelPagePrev() { showToast('⏪ 上一页'); }
function modelPageNext() { showToast('⏩ 下一页'); }

// 复制用户消息
window.copyUserMessage = function(btn) {
  var col=btn.closest('.chat-msg-col');
  const msgBubble=(col||btn.closest('.flex.flex-col'))?.querySelector('.message-bubble.user,.message-bubble');
  if (msgBubble) {
    navigator.clipboard.writeText(msgBubble.textContent).then(() => {
      showToast('📋 已复制到剪贴板');
    });
  }
};

function getChatMessageBubble(btn){
  var row=btn&&btn.closest?btn.closest('.chat-msg-row,.flex.justify-start,.flex.justify-end'):null;
  if(!row) return null;
  return row.querySelector('.message-bubble.ai,.message-bubble')||row.querySelector('.rounded-2xl');
}

function getChatAiMessageText(bubble){
  if(!bubble) return '';
  var textEl=bubble.querySelector('.chat-msg-text');
  if(textEl) return (textEl.innerText||textEl.textContent||'').trim();
  var body=bubble.querySelector('.chat-msg-body');
  if(body){
    var clone=body.cloneNode(true);
    var label=clone.querySelector('.chat-msg-label');
    if(label) label.remove();
    return (clone.innerText||clone.textContent||'').trim();
  }
  var clone=bubble.cloneNode(true);
  var actions=clone.querySelector('.chat-msg-actions-row');
  if(actions) actions.remove();
  return (clone.innerText||clone.textContent||'').trim();
}

window.getChatAiActionsRowHtml=function(meta){
  meta=meta||{};
  var tokens=meta.tokens!=null?meta.tokens:Math.floor(80+Math.random()*180);
  var cost=meta.cost!=null?meta.cost:'0.0002';
  var status=meta.status||'已完成';
  return '<div class="chat-msg-actions-row flex items-center gap-3 mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">'+
    '<div class="chat-msg-actions-primary">'+
    '<button type="button" onclick="event.stopPropagation();copyAiMessage(this)" class="chat-msg-action text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-1 cursor-pointer relative z-10" title="复制">'+
      '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'+
      '<span class="chat-msg-action-label">复制</span></button>'+
    '<button type="button" onclick="event.stopPropagation();readAiMessage(this)" class="chat-msg-action text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-1 cursor-pointer relative z-10" title="朗读">'+
      '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>'+
      '<span class="chat-msg-action-label">朗读</span></button>'+
    '</div>'+
    '<div class="chat-msg-actions-meta">'+
    '<span class="chat-msg-meta-item text-[10px] text-gray-400">'+tokens+' tokens</span>'+
    '<span class="chat-msg-meta-item text-[10px] text-gray-400">'+(typeof formatLightningAmountHtml==='function'?formatLightningAmountHtml(cost):'⚡'+cost)+'</span>'+
    '<span class="chat-msg-meta-item text-[10px] text-green-500">'+status+'</span>'+
    '</div></div>';
};

window.buildAiMessageBubbleHtml=function(opts){
  opts=opts||{};
  var label=opts.label||'🤖 GPT-5.4';
  var tags=opts.tags||'';
  var bodyHtml=opts.bodyHtml||'';
  var showLabel=opts.showLabel!==false;
  var labelBlock=showLabel?'<div class="chat-msg-label mb-1"><span class="text-blue-600 dark:text-blue-400 font-medium text-[10px]">'+label+tags+'</span></div>':'';
  return '<div class="message-bubble ai bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">'+
    '<div class="chat-msg-body text-xs text-gray-800 dark:text-gray-200 leading-relaxed">'+labelBlock+
    '<div class="chat-msg-text">'+bodyHtml+'</div></div>'+
    (typeof getChatAiActionsRowHtml==='function'?getChatAiActionsRowHtml(opts.meta):'')+
  '</div>';
};

window.copyAiMessage=function(btn){
  var bubble=getChatMessageBubble(btn);
  if(!bubble){showToast('⚠️ 未找到消息内容');return;}
  var text=getChatAiMessageText(bubble);
  if(!text){showToast('⚠️ 无内容可复制');return;}
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(function(){showToast('📋 已复制到剪贴板');}).catch(function(){showToast('📋 '+text.slice(0,80));});
  }else{showToast('📋 '+text.slice(0,80));}
};

window.readAiMessage=function(btn){
  var bubble=getChatMessageBubble(btn);
  if(!bubble){showToast('⚠️ 未找到消息内容');return;}
  var text=getChatAiMessageText(bubble);
  if(!text){showToast('⚠️ 无内容可朗读');return;}
  if(window.speechSynthesis){
    window.speechSynthesis.cancel();
    var u=new SpeechSynthesisUtterance(text);
    u.lang='zh-CN';
    window.speechSynthesis.speak(u);
    showToast('🔊 正在朗读');
  }else{showToast('🔊 '+text.slice(0,60)+(text.length>60?'…':''));}
};

/* 手机端语音输入（文字 / 图片 / 视频） */
window._mobileVoiceState={recognition:null,inputId:null,btn:null,baseText:'',sessionFinal:'',autoSend:false,userStopped:false};

window.isSpeechRecognitionSupported=function(){
  return !!(window.SpeechRecognition||window.webkitSpeechRecognition);
};

window.getSpeechRecognitionCtor=function(){
  return window.SpeechRecognition||window.webkitSpeechRecognition||null;
};

window._setMobileVoiceBtnActive=function(active){
  document.querySelectorAll('.mobile-voice-btn.listening').forEach(function(b){b.classList.remove('listening');});
  var st=window._mobileVoiceState;
  if(active&&st.btn)st.btn.classList.add('listening');
};

window.stopMobileVoiceInput=function(silent){
  var st=window._mobileVoiceState;
  if(st.recognition){
    try{st.recognition.stop();}catch(err){}
    try{st.recognition.abort();}catch(err){}
  }
  window._setMobileVoiceBtnActive(false);
  if(!silent&&st.btn&&!st.userStopped)showToast('🎤 语音输入已结束');
  st.recognition=null;
  st.inputId=null;
  st.btn=null;
  st.baseText='';
  st.sessionFinal='';
  st.autoSend=false;
  st.userStopped=false;
};

window._applyMobileVoiceTranscript=function(interim){
  var st=window._mobileVoiceState;
  var input=document.getElementById(st.inputId);
  if(!input)return;
  var base=st.baseText||'';
  var finals=st.sessionFinal||'';
  var gap=(base&&finals&&!/\s$/.test(base)&&!/^[\s，。！？、]/.test(finals))?' ':'';
  input.value=base+gap+finals+(interim||'');
  if(typeof input.dispatchEvent==='function')input.dispatchEvent(new Event('input',{bubbles:true}));
};

window._finishMobileVoiceInput=function(){
  var st=window._mobileVoiceState;
  window._applyMobileVoiceTranscript('');
  var input=document.getElementById(st.inputId);
  var text=input?(input.value||'').trim():'';
  var shouldSend=!!st.autoSend&&st.inputId==='chat-input'&&text;
  var inputId=st.inputId;
  window.stopMobileVoiceInput(true);
  if(shouldSend&&typeof sendChatMessage==='function'){
    sendChatMessage();
  }else if(text&&inputId!=='chat-input'){
    showToast('🎤 已填入语音内容');
  }else if(!text){
    showToast('⚠️ 未识别到语音内容');
  }
};

window.startMobileVoiceInput=function(btn){
  if(!window.isChatMobileView||!window.isChatMobileView()){
    showToast('语音输入请在手机端使用');
    return;
  }
  if(!window.isSpeechRecognitionSupported()){
    showToast('⚠️ 当前浏览器不支持语音输入');
    return;
  }
  var inputId=btn.getAttribute('data-voice-input');
  var input=inputId?document.getElementById(inputId):null;
  if(!input){
    showToast('⚠️ 未找到输入框');
    return;
  }
  window.stopMobileVoiceInput(true);
  var Ctor=window.getSpeechRecognitionCtor();
  var rec=new Ctor();
  var st=window._mobileVoiceState;
  st.recognition=rec;
  st.inputId=inputId;
  st.btn=btn;
  st.baseText=input.value||'';
  st.sessionFinal='';
  st.autoSend=btn.getAttribute('data-voice-autosend')==='1';
  st.userStopped=false;
  rec.lang='zh-CN';
  rec.continuous=true;
  rec.interimResults=true;
  rec.maxAlternatives=1;
  rec.onresult=function(e){
    var interim='';
    var finals='';
    for(var i=e.resultIndex;i<e.results.length;i++){
      var t=e.results[i][0].transcript;
      if(e.results[i].isFinal)finals+=t;
      else interim+=t;
    }
    if(finals)st.sessionFinal+=finals;
    window._applyMobileVoiceTranscript(interim);
  };
  rec.onerror=function(e){
    var code=e&&e.error?e.error:'';
    window.stopMobileVoiceInput(true);
    if(code==='not-allowed'||code==='service-not-allowed')showToast('⚠️ 请允许麦克风权限');
    else if(code==='no-speech')showToast('⚠️ 未检测到语音，请重试');
    else if(code!=='aborted')showToast('⚠️ 语音识别失败'+(code?('：'+code):''));
  };
  rec.onend=function(){
    if(st.recognition!==rec)return;
    window._finishMobileVoiceInput();
  };
  try{
    rec.start();
    window._setMobileVoiceBtnActive(true);
    showToast(st.autoSend?'🎤 正在聆听，再次点击结束并发送':'🎤 正在聆听，再次点击结束');
  }catch(err){
    window.stopMobileVoiceInput(true);
    showToast('⚠️ 无法启动语音识别');
  }
};

window.toggleMobileVoiceInput=function(e){
  if(e){e.preventDefault();e.stopPropagation();}
  var btn=e&&e.currentTarget?e.currentTarget:(e&&e.target?e.target.closest('.mobile-voice-btn'):null);
  if(!btn)return;
  var st=window._mobileVoiceState;
  if(st.recognition&&st.btn===btn){
    st.userStopped=true;
    try{st.recognition.stop();}catch(err){window._finishMobileVoiceInput();}
    return;
  }
  if(st.recognition)window.stopMobileVoiceInput(true);
  window.startMobileVoiceInput(btn);
};

// 删除用户消息
window.deleteUserMessage = function(btn) {
  const msgContainer = btn.closest('.flex.justify-end');
  if (msgContainer) {
    msgContainer.remove();
    showToast('🗑️ 消息已删除');
  }
};

// 热门 Apps 数据（文字页 / 图片页共用）
var HOT_APPS=[
  {id:'face-swap',icon:'🎭',name:'AI 换脸',desc:'无痕电影级换脸',heat:'52.3k',grad:'linear-gradient(135deg,#f472b6,#f43f5e)',cat:'换脸',price:'⚡0.5/次',uses:'52.3k次使用',rating:'👍 4.9 (2.1k)',up1:'上传人脸',up2:'上传源图',longDesc:'上传目标人脸与源图，AI 自动完成电影级无痕换脸。<div class="mt-2 text-[10px] text-gray-400">⚙️ 使用步骤：<br>1. 上传清晰正面人脸<br>2. 上传需要换脸的源图<br>3. 点击生成并下载结果</div>'},
  {id:'outfit',icon:'👗',name:'AI 换装',desc:'一键虚拟试穿',heat:'38.7k',grad:'linear-gradient(135deg,#a78bfa,#6366f1)',cat:'换装',price:'⚡0.3/次',uses:'38.7k次使用',rating:'👍 4.8 (1.5k)',up1:'上传人物图',up2:'上传服装图',longDesc:'上传人物照与服装图，AI 智能合成试穿效果。<div class="mt-2 text-[10px] text-gray-400">⚙️ 使用步骤：<br>1. 上传全身或半身人物图<br>2. 上传服装平铺或模特图<br>3. 生成并微调细节</div>'},
  {id:'upscale-4k',icon:'📺',name:'4K 修复',desc:'画质超清增强',heat:'41.2k',grad:'linear-gradient(135deg,#fbbf24,#f97316)',cat:'修复',price:'⚡0.4/次',uses:'41.2k次使用',rating:'👍 4.9 (1.8k)',up1:'上传图片',up2:'选择倍率▼',longDesc:'AI 超分辨率修复，提升老片、截图与模糊素材清晰度。<div class="mt-2 text-[10px] text-gray-400">⚙️ 使用步骤：<br>1. 上传待修复图片<br>2. 选择 2K/4K 输出<br>3. 等待处理并下载</div>'},
  {id:'ai-draw',icon:'🎨',name:'AI 绘画',desc:'文生图灵感生成',heat:'63.1k',grad:'linear-gradient(135deg,#a78bfa,#7c3aed)',cat:'风格',price:'⚡0.2/次',uses:'63.1k次使用',rating:'👍 4.9 (3.2k)',up1:'输入提示词',up2:'上传参考图',longDesc:'根据文字描述生成高质量插画、海报与概念图。<div class="mt-2 text-[10px] text-gray-400">⚙️ 使用步骤：<br>1. 填写画面描述<br>2. 可选上传风格参考<br>3. 一键生成多张候选</div>'},
  {id:'product-shot',icon:'🖼️',name:'商品主图',desc:'AI 电商主图',heat:'22.7k',grad:'linear-gradient(135deg,#f472b6,#db2777)',cat:'电商',price:'⚡0.4/次',uses:'22.7k次使用',rating:'👍 4.8 (650)',up1:'上传商品图',up2:'选择场景▼',longDesc:'一键生成电商主图与模特展示图。<div class="mt-2 text-[10px] text-gray-400">⚙️ 使用步骤：<br>1. 上传商品平铺图<br>2. 选择背景与模特<br>3. 批量导出主图</div>'},
  {id:'style-transfer',icon:'🌈',name:'次元转换',desc:'真人转二次元',heat:'29.8k',grad:'linear-gradient(135deg,#22d3ee,#3b82f6)',cat:'风格',price:'免费',uses:'29.8k次使用',rating:'👍 4.7 (890)',up1:'上传照片',up2:'选择风格▼',longDesc:'将真人照片转换为动漫、插画风格。<div class="mt-2 text-[10px] text-gray-400">⚙️ 使用步骤：<br>1. 上传人像照片<br>2. 选择目标画风<br>3. 生成并对比效果</div>'},
  {id:'photo-restore',icon:'🖌️',name:'老照片修复',desc:'模糊照片高清化',heat:'24.1k',grad:'linear-gradient(135deg,#84cc16,#16a34a)',cat:'修复',price:'⚡0.4/次',uses:'24.1k次使用',rating:'👍 4.9 (320)',up1:'上传老照片',up2:'增强选项▼',longDesc:'修复划痕、褪色与模糊的老照片。<div class="mt-2 text-[10px] text-gray-400">⚙️ 使用步骤：<br>1. 上传待修复照片<br>2. 勾选上色/超分<br>3. 下载高清结果</div>'},
  {id:'bg-replace',icon:'🌄',name:'背景替换',desc:'智能抠图换背景',heat:'19.6k',grad:'linear-gradient(135deg,#34d399,#059669)',cat:'抠图',price:'⚡0.3/次',uses:'19.6k次使用',rating:'👍 4.6 (420)',up1:'上传主体图',up2:'选择背景▼',longDesc:'精准抠图并替换任意背景场景。<div class="mt-2 text-[10px] text-gray-400">⚙️ 使用步骤：<br>1. 上传带主体图片<br>2. 选择或上传背景<br>3. 合成导出</div>'},
  {id:'lip-sync',icon:'🎬',name:'对口型',desc:'精准 Lip-sync',heat:'35.6k',grad:'linear-gradient(135deg,#34d399,#14b8a6)',cat:'视频',price:'⚡0.6/次',uses:'35.6k次使用',rating:'👍 4.7 (980)',up1:'上传视频',up2:'上传音频',longDesc:'让人物口型与配音精准同步，适用于短视频与数字人。<div class="mt-2 text-[10px] text-gray-400">⚙️ 使用步骤：<br>1. 上传人物视频<br>2. 上传配音音频<br>3. 生成对口型成片</div>'},
  {id:'voice-clone',icon:'🎵',name:'声音克隆',desc:'3秒克隆专属声',heat:'27.4k',grad:'linear-gradient(135deg,#fb7185,#ec4899)',cat:'音频',price:'⚡0.5/次',uses:'27.4k次使用',rating:'👍 4.8 (720)',up1:'上传样本音频',up2:'输入文本',longDesc:'仅需数秒参考音频，即可克隆专属音色并朗读文本。<div class="mt-2 text-[10px] text-gray-400">⚙️ 使用步骤：<br>1. 上传 3–10 秒人声样本<br>2. 输入要合成的文案<br>3. 导出音频文件</div>'},
  {id:'copywriting',icon:'📝',name:'文案生成',desc:'爆款带货脚本',heat:'45.8k',grad:'linear-gradient(135deg,#38bdf8,#6366f1)',cat:'文字',price:'免费',uses:'45.8k次使用',rating:'👍 4.8 (2.4k)',up1:'输入商品信息',up2:'选择风格▼',longDesc:'一键生成短视频脚本、直播话术与商品卖点文案。<div class="mt-2 text-[10px] text-gray-400">⚙️ 使用步骤：<br>1. 填写商品/主题<br>2. 选择文案风格<br>3. 复制或继续润色</div>'},
  {id:'ai-dub',icon:'🎙️',name:'AI 配音',desc:'多音色智能配音',heat:'31.5k',grad:'linear-gradient(135deg,#fb923c,#ef4444)',cat:'音频',price:'⚡0.3/次',uses:'31.5k次使用',rating:'👍 4.7 (1.1k)',up1:'输入文本',up2:'选择音色▼',longDesc:'多语种、多情绪音色，为视频与有声内容快速配音。<div class="mt-2 text-[10px] text-gray-400">⚙️ 使用步骤：<br>1. 粘贴配音文稿<br>2. 选择音色与语速<br>3. 生成并下载音频</div>'}
];
var CHAT_HOT_APPS=HOT_APPS;
window._appDetailReturnPage='chat';
window._currentAppDetailId=null;
window.findHotApp=function(idOrName){
  return HOT_APPS.find(function(a){return a.id===idOrName||a.name===idOrName;});
};
window.findChatHotApp=window.findHotApp;
window.renderAppDetailPage=function(app){
  window._currentAppDetailId=app.id;
  var hero=document.getElementById('apd-hero-icon');
  if(hero){hero.textContent=app.icon;hero.style.background=app.grad;}
  var set=function(id,v){var el=document.getElementById(id);if(el)el.innerHTML=v;};
  set('apd-title',app.name);
  set('apd-desc',app.desc);
  set('apd-heat','🔥 '+app.heat+'人');
  set('apd-rating',app.rating);
  set('apd-uses','📊 '+app.uses);
  set('apd-long-desc',app.longDesc);
  set('apd-price',app.price);
  var up1=document.getElementById('apd-up1');if(up1)up1.textContent=app.up1;
  var up2=document.getElementById('apd-up2');if(up2)up2.textContent=app.up2;
  var back=document.getElementById('apd-back-label');
  if(back){
    var rp=window._appDetailReturnPage;
    back.textContent=rp==='chat'?'返回对话':rp==='image'?'返回图片':rp==='video'?'返回视频':rp==='audio'?'返回音频':rp==='apps'?'返回 Apps':rp==='inspiration'?'返回灵感':'返回';
  }
  var fav=document.getElementById('apd-fav-btn');
  if(fav){fav.textContent=window.favedTemplates&&window.favedTemplates[app.name]?'⭐':'☆';fav.classList.toggle('text-yellow-500',!!(window.favedTemplates&&window.favedTemplates[app.name]));}
  window.scrollTo(0,0);
};
function hotAppCatToKey(cat){
  var map={'换脸':'face','换装':'tryon','修复':'tool','风格':'style','抠图':'tool','视频':'video','音频':'audio','文字':'doc','电商':'image'};
  return map[cat]||'image';
}
function hotAppNormalizeRating(rating){
  var m=String(rating||'').match(/([\d.]+)/);
  return m?m[1]:'4.8';
}
/** 热门 Apps 条 → 与 Apps 页卡片一致的弹窗/工作台 */
window.openHotAppInAppsModal=function(idOrName){
  var app=window.findHotApp(idOrName);
  if(!app){if(typeof showToast==='function')showToast('未找到该 App');return;}
  if(typeof openAppTemplateModal!=='function')return;
  var catKey=hotAppCatToKey(app.cat);
  openAppTemplateModal(
    app.cat,app.icon,app.name,app.desc,app.price,app.uses,
    hotAppNormalizeRating(app.rating),
    {catKey:catKey,gradient:app.grad,id:app.id,official:false,introHtml:catKey==='doc'?undefined:app.longDesc}
  );
};
window.openAppDetail=function(idOrName,fromPage){
  var app=window.findHotApp(idOrName);
  if(!app){if(typeof showToast==='function')showToast('未找到该 App');return;}
  var ret=fromPage||'chat';
  window._appDetailReturnPage=ret;
  var pageEl=document.getElementById('page-app-detail');
  if(pageEl)pageEl.setAttribute('data-return-page',ret);
  renderAppDetailPage(app);
  if(typeof showPage==='function')showPage('app-detail');
};
window.closeAppDetail=function(e){
  if(e&&e.preventDefault)e.preventDefault();
  if(e&&e.stopPropagation)e.stopPropagation();
  var pageEl=document.getElementById('page-app-detail');
  var page=(pageEl&&pageEl.getAttribute('data-return-page'))||window._appDetailReturnPage||'chat';
  if(!page||page==='app-detail')page='chat';
  if(page==='inspiration'&&typeof showPage==='function'){showPage('inspiration');window.scrollTo(0,0);return;}
  window._appDetailReturnPage=page;
  try{
    if(typeof showPage==='function'){showPage(page);return;}
  }catch(err){console.error('closeAppDetail showPage',err);}
  document.querySelectorAll('.page-section').forEach(function(s){s.classList.remove('active');});
  var target=document.getElementById('page-'+page);
  if(target)target.classList.add('active');
  if(typeof syncPageFloatingLayers==='function')syncPageFloatingLayers(page);
  var isHome=page==='homepage';
  var nh=document.getElementById('nav-home');
  var na=document.getElementById('nav-app');
  if(nh)nh.style.display=isHome?'flex':'none';
  if(na)na.style.display=isHome?'none':'flex';
  if(!isHome&&na){
    na.querySelectorAll('[data-page]').forEach(function(n){
      n.classList.remove('active');
      n.classList.add('text-gray-600','dark:text-gray-400');
    });
    var nav=na.querySelector('[data-page="'+page+'"]');
    if(nav){nav.classList.add('active');nav.classList.remove('text-gray-600','dark:text-gray-400');}
  }
  if(page==='chat'&&typeof placeChatHotAppsStrip==='function'){try{placeChatHotAppsStrip();}catch(err2){console.error('placeChatHotAppsStrip',err2);}}
  if(page==='image'&&typeof placeImageHotAppsStrip==='function'){try{placeImageHotAppsStrip();}catch(err3){console.error('placeImageHotAppsStrip',err3);}}
  if(page==='video'&&typeof placeVideoHotAppsStrip==='function'){try{placeVideoHotAppsStrip();}catch(err4){console.error('placeVideoHotAppsStrip',err4);}}
  if(page==='audio'&&typeof placeAudioHotAppsStrip==='function'){try{placeAudioHotAppsStrip();}catch(err5){console.error('placeAudioHotAppsStrip',err5);}}
  window.scrollTo(0,0);
};
window.toggleAppDetailFav=function(){
  var app=window.findHotApp(window._currentAppDetailId);
  var btn=document.getElementById('apd-fav-btn');
  if(!app||!btn)return;
  if(typeof pressAnim==='function')pressAnim(btn);
  if(favedTemplates[app.name]){delete favedTemplates[app.name];btn.textContent='☆';btn.classList.remove('text-yellow-500');if(typeof showToast==='function')showToast('✅ 已取消收藏 — 「'+app.name+'」');}
  else{favedTemplates[app.name]=true;btn.textContent='⭐';btn.classList.add('text-yellow-500');if(typeof showToast==='function')showToast('✅ 已收藏 — 「'+app.name+'」');}
};
window.startAppDetailGenerate=function(){
  var app=window.findHotApp(window._currentAppDetailId);
  if(typeof showToast==='function')showToast(app?'✨ 正在使用「'+app.name+'」生成…':'✨ 开始生成');
};
window._hotAppsDismissed={};
window.isHotAppsStripDismissed=function(page){return!!window._hotAppsDismissed[page];};
window.closeHotAppsStrip=function(page,e){
  if(e&&e.preventDefault)e.preventDefault();
  if(e&&e.stopPropagation)e.stopPropagation();
  window._hotAppsDismissed[page]=true;
  var ids={chat:'chat-hot-apps',image:'image-hot-apps',video:'video-hot-apps',audio:'audio-hot-apps'};
  var strip=document.getElementById(ids[page]);
  if(strip)strip.classList.add('hidden');
  if(page==='image'&&typeof syncImageResultsEmptyState==='function')syncImageResultsEmptyState();
  if(page==='video'&&typeof syncVideoResultsEmptyState==='function')syncVideoResultsEmptyState();
  if(page==='audio'&&typeof syncAudioResultsEmptyState==='function')syncAudioResultsEmptyState();
};
window.getHotAppsPlacementHost=function(page){
  if(page==='chat')return document.getElementById('chat-messages');
  if(page==='image')return document.getElementById('image-results-container');
  if(page==='video'){
    var vc=document.getElementById('video-results-container');
    if(vc&&!vc.classList.contains('hidden'))return vc;
    return document.getElementById('video-hot-apps-slot');
  }
  if(page==='audio'){
    var ac=document.getElementById('audio-results-container');
    if(ac&&!ac.classList.contains('hidden'))return ac;
    return document.getElementById('audio-hot-apps-slot');
  }
  return null;
};
window.buildHotAppsStripHeadHtml=function(page){
  var headCls=page+'-hot-apps-head';
  return '<div class="'+headCls+'"><span class="text-[11px] font-bold text-gray-800 dark:text-gray-200">🔥 热门 Apps</span>'+
    '<span class="text-[9px] px-1.5 py-0.5 rounded-full bg-red-50 dark:bg-red-900/25 text-red-500">左右滑动探索</span>'+
    '<button type="button" class="hot-apps-close-btn" onclick="closeHotAppsStrip(\''+page+'\',event)" title="关闭" aria-label="关闭热门 Apps">×</button></div>';
};
window.placeHotAppsStripAtTop=function(page,stripId,ensureFn){
  if(isHotAppsStripDismissed(page)){
    var hidden=document.getElementById(stripId);
    if(hidden)hidden.classList.add('hidden');
    return null;
  }
  var strip=ensureFn();
  if(!strip)return null;
  strip.classList.remove('hidden');
  var host=getHotAppsPlacementHost(page);
  if(host)host.prepend(strip);
  return strip;
};
window.buildChatHotAppsStripHtml=function(){
  var cards=HOT_APPS.map(function(a){
    return '<div class="chat-hot-app-card" onclick="openChatHotApp(\''+a.id+'\')">'+
      '<div class="chat-hot-app-icon" style="background:'+a.grad+'">'+a.icon+'</div>'+
      '<h4>'+a.name+'</h4><p>'+a.desc+'</p><span class="chat-hot-app-heat">🔥 '+a.heat+'</span></div>';
  }).join('');
  return '<div id="chat-hot-apps" class="chat-hot-apps anim-fade-up">'+buildHotAppsStripHeadHtml('chat')+
    '<div class="chat-hot-apps-scroll" id="chat-hot-apps-scroll">'+cards+'</div></div>';
};
window.buildImageHotAppsStripHtml=function(){
  var cards=HOT_APPS.map(function(a){
    return '<div class="image-hot-app-card" onclick="openImageHotApp(\''+a.id+'\')">'+
      '<div class="image-hot-app-icon" style="background:'+a.grad+'">'+a.icon+'</div>'+
      '<h4>'+a.name+'</h4><p>'+a.desc+'</p><span class="image-hot-app-heat">🔥 '+a.heat+'</span></div>';
  }).join('');
  return '<div id="image-hot-apps" class="image-hot-apps anim-fade-up">'+buildHotAppsStripHeadHtml('image')+
    '<div class="image-hot-apps-scroll" id="image-hot-apps-scroll">'+cards+'</div></div>';
};
window.ensureImageHotAppsStrip=function(){
  var strip=document.getElementById('image-hot-apps');
  if(strip)return strip;
  var host=getHotAppsPlacementHost('image');
  if(host){host.insertAdjacentHTML('afterbegin',buildImageHotAppsStripHtml());return document.getElementById('image-hot-apps');}
  return null;
};
window.syncImageResultsEmptyState=function(){
  var container=document.getElementById('image-results-container');
  if(!container)return;
  var hasCard=!!container.querySelector('[id^="result-card-"]');
  container.classList.toggle('image-results--empty',!hasCard);
  var empty=document.getElementById('image-empty-state');
  if(empty)empty.classList.toggle('hidden',hasCard);
};
window.placeImageHotAppsStrip=function(){
  var container=document.getElementById('image-results-container');
  if(!container)return;
  window.syncImageResultsEmptyState();
  placeHotAppsStripAtTop('image','image-hot-apps',ensureImageHotAppsStrip);
};
window.openImageHotApp=function(idOrName){
  openHotAppInAppsModal(idOrName);
};
window.buildVideoHotAppsStripHtml=function(){
  var cards=HOT_APPS.map(function(a){
    return '<div class="video-hot-app-card" onclick="openVideoHotApp(\''+a.id+'\')">'+
      '<div class="video-hot-app-icon" style="background:'+a.grad+'">'+a.icon+'</div>'+
      '<h4>'+a.name+'</h4><p>'+a.desc+'</p><span class="video-hot-app-heat">🔥 '+a.heat+'</span></div>';
  }).join('');
  return '<div id="video-hot-apps" class="video-hot-apps anim-fade-up">'+buildHotAppsStripHeadHtml('video')+
    '<div class="video-hot-apps-scroll" id="video-hot-apps-scroll">'+cards+'</div></div>';
};
window.ensureVideoHotAppsStrip=function(){
  var strip=document.getElementById('video-hot-apps');
  if(strip)return strip;
  var host=getHotAppsPlacementHost('video');
  if(host){host.insertAdjacentHTML('afterbegin',buildVideoHotAppsStripHtml());return document.getElementById('video-hot-apps');}
  return null;
};
window.syncVideoResultsEmptyState=function(){
  var container=document.getElementById('video-results-container');
  var slot=document.getElementById('video-hot-apps-slot');
  var emptyOverlay=document.getElementById('video-empty-state');
  var hasCard=!!(container&&container.querySelector('[id^="video-result-card-"]'));
  var resultsVisible=!!(container&&!container.classList.contains('hidden'));
  var showResults=hasCard||resultsVisible;
  if(container){
    if(showResults)container.classList.remove('hidden');
    else container.classList.add('hidden');
  }
  if(slot)slot.classList.toggle('hidden',showResults);
  if(emptyOverlay)emptyOverlay.classList.add('hidden');
};
window.placeVideoHotAppsStrip=function(){
  window.syncVideoResultsEmptyState();
  placeHotAppsStripAtTop('video','video-hot-apps',ensureVideoHotAppsStrip);
};
window.openVideoHotApp=function(idOrName){
  openHotAppInAppsModal(idOrName);
};
window.buildAudioHotAppsStripHtml=function(){
  var cards=HOT_APPS.map(function(a){
    return '<div class="audio-hot-app-card" onclick="openAudioHotApp(\''+a.id+'\')">'+
      '<div class="audio-hot-app-icon" style="background:'+a.grad+'">'+a.icon+'</div>'+
      '<h4>'+a.name+'</h4><p>'+a.desc+'</p><span class="audio-hot-app-heat">🔥 '+a.heat+'</span></div>';
  }).join('');
  return '<div id="audio-hot-apps" class="audio-hot-apps anim-fade-up">'+buildHotAppsStripHeadHtml('audio')+
    '<div class="audio-hot-apps-scroll" id="audio-hot-apps-scroll">'+cards+'</div></div>';
};
window.ensureAudioHotAppsStrip=function(){
  var strip=document.getElementById('audio-hot-apps');
  if(strip)return strip;
  var host=getHotAppsPlacementHost('audio');
  if(host){host.insertAdjacentHTML('afterbegin',buildAudioHotAppsStripHtml());return document.getElementById('audio-hot-apps');}
  return null;
};
window.syncAudioResultsEmptyState=function(){
  var container=document.getElementById('audio-results-container');
  var slot=document.getElementById('audio-hot-apps-slot');
  var emptyOverlay=document.getElementById('audio-empty-state');
  var hasCard=!!(container&&container.querySelector('[id^="audio-result-card-"]'));
  var resultsVisible=!!(container&&!container.classList.contains('hidden'));
  var showResults=hasCard||resultsVisible;
  if(container){
    if(showResults)container.classList.remove('hidden');
    else container.classList.add('hidden');
  }
  if(slot)slot.classList.toggle('hidden',showResults);
  if(emptyOverlay)emptyOverlay.classList.add('hidden');
};
window.placeAudioHotAppsStrip=function(){
  window.syncAudioResultsEmptyState();
  placeHotAppsStripAtTop('audio','audio-hot-apps',ensureAudioHotAppsStrip);
};
window.openAudioHotApp=function(idOrName){
  openHotAppInAppsModal(idOrName);
};
window.ensureChatHotAppsStrip=function(){
  var strip=document.getElementById('chat-hot-apps');
  if(strip)return strip;
  var host=getHotAppsPlacementHost('chat');
  if(host){host.insertAdjacentHTML('afterbegin',buildChatHotAppsStripHtml());return document.getElementById('chat-hot-apps');}
  return null;
};
window.placeChatHotAppsStrip=function(){
  placeHotAppsStripAtTop('chat','chat-hot-apps',ensureChatHotAppsStrip);
};
window.openChatHotApp=function(idOrName){
  openHotAppInAppsModal(idOrName);
};

// 重置聊天页面
window.resetChat = function() {
  const messagesContainer = document.getElementById('chat-messages');
  if (messagesContainer) {
    var welcomeBubble=typeof buildAiMessageBubbleHtml==='function'?buildAiMessageBubbleHtml({
      label:'🤖 GPT-5.4',
      tags:'',
      bodyHtml:'你好！😊 很高兴认识你～ 今天想聊点什么呀？',
      meta:{tokens:142,cost:'0.0001',status:'已完成'}
    }):'';
    messagesContainer.innerHTML =
      '<div id="chat-hot-apps-mount"></div>'+
      '<div class="chat-msg-row chat-msg-row--ai flex justify-start anim-fade-up"><div class="chat-msg-col chat-msg-col--ai">'+welcomeBubble+'</div></div>';
    if(typeof placeChatHotAppsStrip==='function')placeChatHotAppsStrip();
  }
  const chatInput = document.getElementById('chat-input');
  if (chatInput) chatInput.value = '';
  // 清除角色选中状态
  window.clearRole();
};

// 筛选按钮点击事件
document.addEventListener('DOMContentLoaded', function() {
  if(typeof window.initNotifPrefsUI==='function')window.initNotifPrefsUI();
  if(typeof initAssetModalStaticRecords==='function'){
    try{initAssetModalStaticRecords();}catch(e){console.error('initAssetModalStaticRecords',e);}
  }
  if(typeof placeChatHotAppsStrip==='function')placeChatHotAppsStrip();
  if(typeof placeImageHotAppsStrip==='function')placeImageHotAppsStrip();
  if(typeof placeVideoHotAppsStrip==='function')placeVideoHotAppsStrip();
  if(typeof placeAudioHotAppsStrip==='function')placeAudioHotAppsStrip();
  // 模型筛选按钮
  document.querySelectorAll('.model-filter-chip').forEach(chip => {
    chip.addEventListener('click', function() {
      const filterType = this.dataset.filter;
      // 同组内取消其他选中
      document.querySelectorAll(`.model-filter-chip[data-filter="${filterType}"]`).forEach(c => {
        c.classList.remove('active');
        c.style.color = '';
        c.style.borderColor = '';
        c.style.background = '';
      });
      // 选中当前
      this.classList.add('active');
      this.style.color = '#7C3AED';
      this.style.borderColor = '#7C3AED';
      this.style.background = 'rgba(124,58,237,0.08)';
      filterModelCards();
    });
  });
  
  // 初始渲染模型卡片
  if(document.getElementById('model-card-grid-new')) {
    renderModelCardsNew(modelData);
  }

  // 初始化图片生成预估费用
  updateImageGenCost();
  updateImageOutputParamsLabel();
  
  // 初始化图片参考图缩略图区域
  renderImageRefThumbnails();
});

// ===== 公告数据 & 函数 =====
const announceData = [
  {cat:'新模型', title:'🚀 Seedance 2.0 接入新渠道', time:'2026-05-19 01:50:20', summary:'渠道部 × 商务部连轴蹲下来的成果，调用成本已下调！<br>📊 预判结果 / 新渠道 / 砸下来的<br>📊 调用成本 / ⬇️已下调 / 一点一点抠出来<br>📊 让利用户 / 100% / 原封不动给到<br><br>翻译大白话：调用成本又抠下来了一点，不藏着不掖着，全部让给大家。', badge:'新'},
  {cat:'更新', title:'🎬 Sora2 官转版 并发能力大升级', time:'2026-05-18 14:30:00', summary:'Sora2 官转版又加了几条新渠道，并发能力一口气拉满，支持一次性同时生成多个视频。', badge:'更新'},
  {cat:'新模型', title:'💎 GPT-5.5 深度推理版上线', time:'2026-05-17 10:00:00', summary:'OpenAI推出新一代旗舰模型，推理能力大幅提升，适合复杂专业场景。', badge:'新'},
  {cat:'活动', title:'🎉 618大促活动来袭！', time:'2026-05-16 09:00:00', summary:'活动期间充值满100送20，更有会员折扣叠加，快来参与吧！', badge:'活动'},
  {cat:'系统', title:'⚙️ 系统维护通知', time:'2026-05-15 18:00:00', summary:'平台将于2026年5月16日凌晨2:00-4:00进行系统维护，届时部分功能可能不可用。', badge:'系统'},
  {cat:'更新', title:'🔔 新增多语言支持', time:'2026-05-14 10:30:00', summary:'平台功能更新：新增多语言支持，界面支持中英文切换。', badge:'更新'},
  {cat:'新模型', title:'🧠 DeepSeek-R3 推理模型上线', time:'2026-05-13 15:00:00', summary:'DeepSeek最新推理模型R3已上线，推理速度提升3倍。', badge:'新'},
  {cat:'更新', title:'🎨 参考图功能优化', time:'2026-05-12 11:20:00', summary:'图片生成页面上传参考图时，支持批量上传和多图参考功能。', badge:'更新'},
  {cat:'系统', title:'🛡️ 安全策略升级通知', time:'2026-05-11 09:00:00', summary:'平台安全策略升级，需重新验证API密钥，请及时更新。', badge:'系统'},
  {cat:'活动', title:'🎊 五一限时特惠活动', time:'2026-05-01 00:00:00', summary:'五一期间所有模型调用享8折优惠，更有新用户专享大礼包。', badge:'活动'}
];

let announcePage = 0;
const pageSize = 5;

function getFilteredAnnounces() {
  const cat = document.querySelector('.announce-tab.active')?.dataset.cat || 'all';
  const q = document.querySelector('.announce-search')?.value?.toLowerCase().trim() || '';
  let list = cat === 'all' ? [...announceData] : announceData.filter(a => a.cat === cat);
  if(q) list = list.filter(a => a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q));
  return list;
}

function renderAnnounceList() {
  const container = document.getElementById('announce-list');
  if(!container) return;
  const list = getFilteredAnnounces();
  const items = list.slice(0, (announcePage + 1) * pageSize);
  container.innerHTML = items.map(a => `
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-sm transition cursor-pointer" onclick="openAnnounceDetail('${a.title.replace(/'/g,"\\'")}')">
      <div class="flex items-center justify-between mb-1">
        <span class="text-xs font-semibold">${a.title}</span>
        ${a.badge ? `<span class="text-[9px] px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded font-medium">${a.badge}</span>` : ''}
      </div>
      <div class="border-t border-gray-100 dark:border-gray-700 my-1.5"></div>
      <div class="text-[10px] text-gray-400 mb-1.5">发布时间：${a.time}</div>
      <div class="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">${a.summary.replace(/<br>/g,' ').substring(0,120)}...</div>
      <div class="flex items-center gap-2 mt-2">
        <button onclick="event.stopPropagation();openAnnounceDetail('${a.title.replace(/'/g,"\\'")}')" class="text-[10px] text-blue-500 hover:underline">查看详情</button>
        <button onclick="event.stopPropagation();shareAnnounce()" class="text-[10px] text-gray-400 hover:text-gray-600">分享</button>
      </div>
    </div>
  `).join('');
  const btn = document.querySelector('.load-more-announce');
  if(btn) btn.textContent = items.length >= list.length ? '✅ 已全部加载' : '🔄 加载更多';
}

function renderAnnounceModal() {
  const body = document.getElementById('announcement-modal-body');
  if(!body) return;
  const items = announceData.slice(0, 3);
  body.innerHTML = items.map(a => `
    <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600 cursor-pointer hover:shadow-sm transition" onclick="closeModal('announcement-modal');openAnnounceDetail('${a.title.replace(/'/g,"\\'")}')">
      <div class="flex items-center justify-between mb-1">
        <span class="text-xs font-semibold">${a.title}</span>
        ${a.badge ? `<span class="text-[9px] px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded font-medium">${a.badge}</span>` : ''}
      </div>
      <div class="border-t border-gray-100 dark:border-gray-700 my-1"></div>
      <div class="text-[10px] text-gray-400 mb-1">${a.time}</div>
      <div class="text-[10px] text-gray-500">${a.summary.replace(/<br>/g,' ').substring(0,80)}</div>
    </div>
  `).join('');
}

window.loadMoreAnnounce = function() { announcePage++; renderAnnounceList(); };
window.searchAnnouncements = function() { announcePage = 0; renderAnnounceList(); };
// 资产库弹窗（旧浮层入口，统一转 my 资产弹窗）
window.openAssetLibrary = function(btn) {
  var tab=null;
  if(document.getElementById('page-chat')?.classList.contains('active')) tab='text';
  else if(document.getElementById('page-image')?.classList.contains('active')) tab='image';
  else if(document.getElementById('page-video')?.classList.contains('active')){
    if(typeof openVideoAssetModal==='function'){openVideoAssetModal('image');return;}
    tab='image';
  }
  if(typeof openAssetModal==='function'){openAssetModal(tab);return;}
  // 移除已存在的资产库弹窗
  const existing = document.getElementById('asset-library-popup');
  if (existing) { existing.remove(); return; }
  
  // 获取按钮位置
  const rect = btn.getBoundingClientRect();
  
  // 创建资产库弹窗
  const popup = document.createElement('div');
  popup.id = 'asset-library-popup';
  popup.className = 'fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-[100]';
  popup.style.cssText = `left: 50%; top: 50%; transform: translate(-50%, -50%); width: 480px; max-height: 600px;`;
  
  // 居中遮罩层
  const overlay = document.createElement('div');
  overlay.id = 'asset-library-overlay';
  overlay.className = 'fixed inset-0 bg-black/30 z-[99]';
  overlay.onclick = closeAssetLibrary;
  document.body.appendChild(overlay);
  
  // 资产库内容
  popup.innerHTML = `
    <div class="p-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
      <span class="text-xs font-semibold">📦 资产库</span>
      <button onclick="closeAssetLibrary()" class="text-gray-400 hover:text-gray-600">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="p-2 border-b border-gray-100 dark:border-gray-700">
      <div class="flex gap-2">
        <input type="text" placeholder="搜索资产..." class="flex-1 text-xs px-3 py-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg outline-none focus:ring-1 focus:ring-blue-400">
        <button class="px-3 py-1.5 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600">搜索</button>
      </div>
      <div class="flex gap-2 mt-2">
        <button class="text-[10px] px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg">全部</button>
        <button class="text-[10px] px-2 py-1 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">图片</button>
        <button class="text-[10px] px-2 py-1 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">视频</button>
        <button class="text-[10px] px-2 py-1 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">文本</button>
        <button class="text-[10px] px-2 py-1 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">音频</button>
      </div>
    </div>
    <div class="p-2 max-h-80 overflow-y-auto">
      <div class="grid grid-cols-3 gap-2">
        <div onclick="selectAsset('img1', '图片资产1', 'image')" class="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer hover:ring-2 hover:ring-blue-400 overflow-hidden">
          <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23374151' width='100' height='100'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='%239ca3af' font-size='10'%3E图片1%3C/text%3E%3C/svg%3E" class="w-full h-full object-cover">
        </div>
        <div onclick="selectAsset('img2', '图片资产2', 'image')" class="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer hover:ring-2 hover:ring-blue-400 overflow-hidden">
          <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23374151' width='100' height='100'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='%239ca3af' font-size='10'%3E图片2%3C/text%3E%3C/svg%3E" class="w-full h-full object-cover">
        </div>
        <div onclick="selectAsset('img3', '图片资产3', 'image')" class="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer hover:ring-2 hover:ring-blue-400 overflow-hidden">
          <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23374151' width='100' height='100'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='%239ca3af' font-size='10'%3E图片3%3C/text%3E%3C/svg%3E" class="w-full h-full object-cover">
        </div>
        <div onclick="selectAsset('text1', '文本资产1', 'text')" class="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer hover:ring-2 hover:ring-blue-400 flex items-center justify-center">
          <div class="text-center p-1">
            <div class="text-lg mb-1">📝</div>
            <div class="text-[9px] text-gray-500 dark:text-gray-400">文本1</div>
          </div>
        </div>
        <div onclick="selectAsset('text2', '文本资产2', 'text')" class="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer hover:ring-2 hover:ring-blue-400 flex items-center justify-center">
          <div class="text-center p-1">
            <div class="text-lg mb-1">📝</div>
            <div class="text-[9px] text-gray-500 dark:text-gray-400">文本2</div>
          </div>
        </div>
        <div onclick="selectAsset('video1', '视频资产1', 'video')" class="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer hover:ring-2 hover:ring-blue-400 flex items-center justify-center">
          <div class="text-center p-1">
            <div class="text-lg mb-1">🎬</div>
            <div class="text-[9px] text-gray-500 dark:text-gray-400">视频1</div>
          </div>
        </div>
        <div onclick="selectAsset('audio1', '音频资产1', 'audio')" class="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer hover:ring-2 hover:ring-blue-400 flex items-center justify-center">
          <div class="text-center p-1">
            <div class="text-lg mb-1">🎵</div>
            <div class="text-[9px] text-gray-500 dark:text-gray-400">音频1</div>
          </div>
        </div>
      </div>
    </div>
    <div class="p-2 border-t border-gray-100 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <span class="text-[10px] text-gray-400">共 7 个资产</span>
        <button onclick="uploadNewAsset()" class="text-[10px] text-blue-500 hover:underline">+ 上传新资产</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(popup);
  
  // 点击其他地方关闭
  setTimeout(() => {
    document.addEventListener('click', function closePopup(e) {
      if (!popup.contains(e.target) && e.target !== btn) {
        closeAssetLibrary();
        document.removeEventListener('click', closePopup);
      }
    });
  }, 100);
};

// 图片参考图数组（资产库和附件上传共用）
let imageRefFiles = [];
let cardRefImages = {}; // 存储结果卡片对应的参考图数据（避免data-params属性被撑爆）
let cardVideoRefImages = {}; // 视频结果卡片参考素材

// 当前正在重新编辑的参数
let currentEditParams = null;

window.closeAssetLibrary = function() {
  const popup = document.getElementById('asset-library-popup');
  const overlay = document.getElementById('asset-library-overlay');
  if (popup) popup.remove();
  if (overlay) overlay.remove();
};

window.selectAsset = function(id, name, type) {
  // 判断当前是否在图片页面
  const isImagePage = document.getElementById('page-image') && !document.getElementById('page-image').classList.contains('hidden');
  
  // 图片/视频/音频类型 → 放入图片预览区
  if (isImagePage && (type === 'image' || type === 'video' || type === 'audio')) {
    // 模拟获取资产URL（实际项目中这里应该是真实URL）
    const assetUrl = `asset://${id}`;
    
    // 如果是图片，创建虚拟File对象添加到图片预览区
    if (type === 'image') {
      // 创建占位图片（实际项目中应该用真实图片URL）
      const placeholderImg = document.createElement('img');
      placeholderImg.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Crect fill='%23374151' width='48' height='48'/%3E%3Ctext x='24' y='28' text-anchor='middle' fill='%239ca3af' font-size='8'%3E${encodeURIComponent(name)}%3C/text%3E%3C/svg%3E`;
      placeholderImg.className = 'w-12 h-12 rounded-lg object-cover border cursor-pointer';
      placeholderImg.onclick = function() { previewImage(this.src); };
      
      const container = document.getElementById('image-ref-thumbnails');
      if (container) {
        const wrapper = document.createElement('div');
        wrapper.className = 'relative shrink-0 group';
        wrapper.dataset.assetId = id;
        
        const delBtn = document.createElement('button');
        delBtn.className = 'absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition';
        delBtn.textContent = '×';
        delBtn.onclick = function(e) { 
          e.stopPropagation(); 
          wrapper.remove();
          // 从数组中移除
          const idx = imageRefFiles.findIndex(f => f.id === id);
          if (idx > -1) imageRefFiles.splice(idx, 1);
          showToast('已移除资产: ' + name);
        };
        
        wrapper.appendChild(placeholderImg);
        wrapper.appendChild(delBtn);
        container.insertBefore(wrapper, container.lastElementChild);
        
        // 保存到数组（用占位URL标记为资产）
        imageRefFiles.push({
          id: id,
          dataUrl: placeholderImg.src,
          isAsset: true,
          assetName: name,
          assetType: type
        });
      }
    } else if (type === 'video') {
      // 视频类型显示视频图标预览
      const container = document.getElementById('image-ref-thumbnails');
      if (container) {
        const wrapper = document.createElement('div');
        wrapper.className = 'relative shrink-0 group w-12 h-12 border border-dashed border-blue-300 rounded-lg flex items-center justify-center bg-blue-50 cursor-pointer';
        wrapper.innerHTML = '<span class="text-lg">🎬</span><span class="absolute bottom-0.5 left-0.5 text-[7px] text-blue-500">视频</span>';
        wrapper.onclick = function() { showToast('📹 视频资产: ' + name); };
        
        const delBtn = document.createElement('button');
        delBtn.className = 'absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition';
        delBtn.textContent = '×';
        delBtn.onclick = function(e) { 
          e.stopPropagation(); 
          wrapper.remove();
          showToast('已移除资产: ' + name);
        };
        
        wrapper.appendChild(delBtn);
        container.insertBefore(wrapper, container.lastElementChild);
      }
    } else if (type === 'audio') {
      // 音频类型显示音频图标预览
      const container = document.getElementById('image-ref-thumbnails');
      if (container) {
        const wrapper = document.createElement('div');
        wrapper.className = 'relative shrink-0 group w-12 h-12 border border-dashed border-purple-300 rounded-lg flex items-center justify-center bg-purple-50 cursor-pointer';
        wrapper.innerHTML = '<span class="text-lg">🎵</span><span class="absolute bottom-0.5 left-0.5 text-[7px] text-purple-500">音频</span>';
        wrapper.onclick = function() { showToast('🎵 音频资产: ' + name); };
        
        const delBtn = document.createElement('button');
        delBtn.className = 'absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition';
        delBtn.textContent = '×';
        delBtn.onclick = function(e) { 
          e.stopPropagation(); 
          wrapper.remove();
          showToast('已移除资产: ' + name);
        };
        
        wrapper.appendChild(delBtn);
        container.insertBefore(wrapper, container.lastElementChild);
      }
    }
    
    showToast('📦 已添加' + (type === 'image' ? '图片' : type === 'video' ? '视频' : '音频') + '资产: ' + name);
  } else {
    // 文本类型或其他 → 放入输入区
    const chatInput = document.getElementById('chat-input') || document.getElementById('image-prompt-input');
    if (chatInput) {
      chatInput.value += `[资产: ${name}]`;
      chatInput.focus();
    }
    showToast(`📦 已添加资产: ${name}`);
  }
  
  closeAssetLibrary();
};

window.uploadNewAsset = function() {
  showToast('📤 打开上传面板...');
  closeAssetLibrary();
};

window.announcePrev = function() { showToast('⏪ 上一条公告'); };
window.announceNext = function() { showToast('⏩ 下一条公告'); };
window.announceLatest = function() { showToast('📌 已跳转到最新公告'); };

window.openAnnounceDetail = function(title) {
  const ad = announceData.find(a => a.title === title);
  if(ad) {
    document.getElementById('ad-title').textContent = ad.title;
    document.getElementById('ad-time').textContent = '发布时间：' + ad.time;
    document.getElementById('ad-content').innerHTML = ad.summary;
  }
  showPage('announcement-detail');
};

window.likeAnnounce = function(btn) {
  const count = btn.querySelector('.like-count');
  if(count) {
    if(btn.classList.contains('text-blue-600')) { count.textContent = parseInt(count.textContent) - 1; btn.classList.remove('text-blue-600'); }
    else { count.textContent = parseInt(count.textContent) + 1; btn.classList.add('text-blue-600'); }
  }
  showToast('👍 感谢您的点赞！');
};
window.favAnnounce = function(btn) { btn.classList.toggle('text-yellow-500'); showToast(btn.classList.contains('text-yellow-500') ? '⭐ 已收藏' : '💔 已取消收藏'); };
window.shareAnnounce = function() { showToast('📤 已复制分享链接'); };
window.replyComment = function(btn) {
  const input = document.querySelector('.comment-input');
  if(input) { input.focus(); input.placeholder = '回复...'; }
};
window.postComment = function() {
  const input = document.querySelector('.comment-input');
  if(!input || !input.value.trim()) { showToast('⚠️ 请输入评论内容'); return; }
  const list = document.getElementById('comment-list');
  if(list) {
    const initials = '用户' + String.fromCharCode(65 + list.children.length);
    list.innerHTML += '<div class="flex items-start gap-2 p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg anim-fade-up"><div class="w-6 h-6 rounded-full bg-purple-400 flex items-center justify-center text-white text-[9px] font-bold shrink-0">' + initials.slice(-1) + '</div><div class="flex-1"><div class="flex items-center justify-between"><span class="text-[11px] font-medium">' + initials + '</span><button onclick="replyComment(this)" class="text-[10px] text-blue-500 hover:underline">回复</button></div><div class="text-[11px] text-gray-500 mt-0.5">' + input.value + '</div></div></div>';
  }
  showToast('✅ 评论已发布');
  input.value = '';
};

// 漫剧详情播放页函数
window.toggleComicPlay = function(el) {
  const btn = el.querySelector('.group-hover\\:scale-110') || el.querySelector('.w-16');
  if(btn) {
    if(btn.innerHTML.includes('▶')) { btn.innerHTML = '⏸'; showToast('▶ 播放中'); }
    else { btn.innerHTML = '▶'; showToast('⏸ 已暂停'); }
  }
};
window.toggleVisionPlay = function(el) {
  const btn = el.querySelector('.group-hover\\:scale-110') || el.querySelector('.w-16');
  if(btn) {
    if(btn.innerHTML.includes('▶')) { btn.innerHTML = '⏸'; showToast('▶ 视频播放中'); }
    else { btn.innerHTML = '▶'; showToast('⏸ 视频已暂停'); }
  }
};
window.toggleMusicPlay = function(el) {
  const btn = el.tagName === 'BUTTON' ? el : (el.querySelector('.group-hover\\:scale-110') || el);
  const playBtn = btn.tagName === 'BUTTON' ? btn : btn.closest('.group')?.querySelector('button') || btn;
  if(playBtn) {
    if(playBtn.innerHTML.includes('▶')) { playBtn.innerHTML = '⏸'; showToast('🎵 音乐播放中'); }
    else { playBtn.innerHTML = '▶'; showToast('⏸ 音乐已暂停'); }
  }
  // Also toggle the center circle
  const circle = document.querySelector('#page-music-detail .w-20');
  if(circle) {
    if(circle.innerHTML.includes('▶')) { circle.innerHTML = '⏸'; }
    else { circle.innerHTML = '▶'; }
  }
};
window.replyComicComment = function() {
  const input = document.querySelector('.comic-comment-input');
  if(input) { input.focus(); input.placeholder = '输入回复...'; }
};
window.postComicComment = function() {
  const input = document.querySelector('.comic-comment-input');
  if(!input || !input.value.trim()) { showToast('⚠️ 请输入评论内容'); return; }
  showToast('✅ 评论已发布');
  input.value = '';
};

// 设计详情页 → 使用此设计（跳转图片页并填充参数）
window.useDesignImage = function() {
  showPage('image');
  const ta = document.querySelector('#page-image textarea');
  if(ta) ta.value = '国风与现代设计的完美融合，适用于品牌VI、海报、包装等场景，Midjourney风格，16:9';
  // 设置模型选择器
  const selects = document.querySelectorAll('#page-image select');
  selects.forEach(s => {
    if([...s.options].some(o => o.textContent.includes('Midjourney'))) {
      const opt = [...s.options].find(o => o.textContent.includes('Midjourney'));
      if(opt) s.value = opt.textContent;
    }
    if([...s.options].some(o => o.textContent.includes('16:9'))) {
      const opt = [...s.options].find(o => o.textContent.includes('16:9'));
      if(opt) s.value = opt.textContent;
    }
  });
  showToast('🚀 已跳转图片页面并填充提示词和参数');
};

// 视界详情页 → 使用此视频
window.useDesignVideo = function() {
  showPage('video');
  const ta = document.querySelector('#page-video textarea');
  if(ta) ta.value = '一部展现未来城市风貌的AI短片，赛博朋克风格，视觉震撼，VIDU生成，16:9';
  const selects = document.querySelectorAll('#page-video select');
  selects.forEach(s => {
    if([...s.options].some(o => o.textContent.includes('16:9'))) {
      const opt = [...s.options].find(o => o.textContent.includes('16:9'));
      if(opt) s.value = opt.textContent;
    }
  });
  showToast('🚀 已跳转视频页面并填充提示词和参数');
};

// 音悦详情页 → 使用此音乐
window.useDesignAudio = function() {
  showPage('audio');
  const ta = document.getElementById('audio-prompt-textarea');
  if(ta) ta.value = '一首治愈系纯音乐，适合放松、冥想、学习时聆听，44.1kHz';
  showToast('🚀 已跳转音频页面并填充提示词和参数');
};

// 分享有礼 · 邀请链接与海报
window.INVITE_LINK = 'https://guid.ai?invite=S09EEHO8P4GLBDXM';

window.copyInviteLink = function() {
  navigator.clipboard?.writeText(window.INVITE_LINK || 'https://guid.ai?invite=S09EEHO8P4GLBDXM');
  showToast('📋 邀请链接已复制到剪贴板');
};

window.openInvitePosterModal = function(skipLoading) {
  var modal = document.getElementById('invite-poster-modal');
  if (!modal) {
    showToast('海报弹窗未加载');
    return;
  }
  var gen = document.getElementById('invite-poster-generating');
  var preview = document.getElementById('invite-poster-preview-wrap');
  var codeEl = document.getElementById('invite-poster-code');
  if (codeEl) {
    var link = window.INVITE_LINK || '';
    var m = link.match(/invite=([^&]+)/);
    codeEl.textContent = m ? m[1] : 'S09EEHO8P4GLBDXM';
  }
  if (gen) gen.classList.toggle('hidden', !!skipLoading);
  if (preview) preview.classList.toggle('hidden', !skipLoading);
  openModal('invite-poster-modal', { preserve: ['invite-modal'] });
  if (!skipLoading) {
    setTimeout(function() {
      if (gen) gen.classList.add('hidden');
      if (preview) preview.classList.remove('hidden');
    }, 800);
  }
};

window.downloadInvitePoster = function() {
  showToast('📥 邀请海报已保存到本地（演示）');
};

// MCP文档页函数
window.scrollToSection = function(id) {
  const el = document.getElementById('section-' + id);
  if(el) { el.scrollIntoView({behavior:'smooth', block:'start'}); }
  // 更新导航高亮
  document.querySelectorAll('.mcp-nav-item').forEach(n => {
    n.classList.remove('active', 'bg-blue-50', 'dark:bg-blue-900/20', 'text-blue-600');
    n.classList.add('hover:bg-gray-50', 'dark:hover:bg-gray-700/30');
  });
  const nav = document.querySelector(`.mcp-nav-item[data-section="${id}"]`);
  if(nav) { nav.classList.add('active', 'bg-blue-50', 'dark:bg-blue-900/20', 'text-blue-600'); nav.classList.remove('hover:bg-gray-50', 'dark:hover:bg-gray-700/30'); }
};
window.copyMcpConfig = function() {
  const json = '{\n  "mcpServers": {\n    "guid": {\n      "url": "https://api.guid.ai/mcp",\n      "headers": {\n        "Authorization": "Bearer YOUR_API_KEY"\n      }\n    }\n  }\n}';
  navigator.clipboard?.writeText(json);
  showToast('📋 MCP配置已复制到剪贴板');
};
window.copyCode = function(btn, type) {
  const pre = btn.previousElementSibling?.querySelector('pre') || btn.closest('.space-y-2')?.querySelector('.bg-gray-900 pre');
  if(!pre) { showToast('📋 代码已复制'); return; }
  navigator.clipboard?.writeText(pre.textContent);
  showToast('📋 代码已复制到剪贴板');
};

// 交易记录函数（钱包账单，不含提现）
const txDetailData = [
  {type:'消费', amount:'-⚡0.6', status:'成功', time:'2026-05-26 08:12:00', desc:'图片生成 · Flux Pro', id:'IMG_99001', creator:'-', pay:'余额支付'},
  {type:'充值', amount:'+⚡30', status:'成功', time:'2026-05-26 09:40:00', desc:'微信支付', id:'TX202605260940', creator:'-', pay:'微信支付'},
  {type:'收入', amount:'+⚡3.2', status:'成功', time:'2026-05-25 16:40:00', desc:'灵感分成：夏日促销', id:'INS_001240', creator:'青铜娃娃', pay:'系统分成'},
  {type:'消费', amount:'-⚡0.5', status:'成功', time:'2026-05-20 10:30:00', desc:'购买灵感「赛博朋克城市夜景」', id:'INS_001234', creator:'青铜娃娃', pay:'余额支付'},
  {type:'充值', amount:'+⚡50', status:'成功', time:'2026-05-19 15:20:00', desc:'微信支付', id:'TX202605191520', creator:'-', pay:'微信支付'},
  {type:'收入', amount:'+⚡11.5', status:'成功', time:'2026-05-19 09:15:00', desc:'灵感分成：赛博朋克', id:'INS_001234', creator:'青铜娃娃', pay:'系统分成'},
  {type:'消费', amount:'-⚡0.3', status:'成功', time:'2026-05-17 11:30:00', desc:'图片生成 · SD XL', id:'IMG_88201', creator:'-', pay:'余额支付'},
  {type:'充值', amount:'+⚡20', status:'成功', time:'2026-05-16 16:45:00', desc:'支付宝支付', id:'TX202605161645', creator:'-', pay:'支付宝'},
  {type:'收入', amount:'+⚡8.5', status:'成功', time:'2026-05-15 09:00:00', desc:'灵感分成：国风美人', id:'INS_001235', creator:'青铜娃娃', pay:'系统分成'},
  {type:'消费', amount:'-⚡1.0', status:'成功', time:'2026-05-14 13:20:00', desc:'视频生成 · Kling 1.6', id:'VID_44102', creator:'-', pay:'余额支付'},
  {type:'充值', amount:'+⚡100', status:'成功', time:'2026-05-13 10:00:00', desc:'PayPal支付', id:'TX202605131000', creator:'-', pay:'支付宝'},
  {type:'消费', amount:'-⚡2.5', status:'成功', time:'2026-05-12 18:20:00', desc:'Apps · 一键换装工作流', id:'APP_22018', creator:'-', pay:'余额支付'},
  {type:'消费', amount:'-⚡0.8', status:'成功', time:'2026-05-12 09:05:00', desc:'聊天 · GPT-4o', id:'CHAT_9912', creator:'-', pay:'余额支付'}
];
var _walletRecordFilter='all';
var _walletDateRange='all';
var _walletRecordVisible=6;
function _walletParseTime(timeStr){
  if(!timeStr) return null;
  var parts=timeStr.trim().split(' ');
  var d=parts[0].split('-').map(function(n){return parseInt(n,10);});
  var t=(parts[1]||'00:00:00').split(':').map(function(n){return parseInt(n,10);});
  if(d.length<3||isNaN(d[0])) return null;
  return new Date(d[0],d[1]-1,d[2],t[0]||0,t[1]||0,t[2]||0);
}
function _walletStartOfDay(dt){
  return new Date(dt.getFullYear(),dt.getMonth(),dt.getDate());
}
function _walletMatchDateRange(timeStr,range){
  if(!range||range==='all') return true;
  var tx=_walletParseTime(timeStr);
  if(!tx) return false;
  var now=new Date();
  var todayStart=_walletStartOfDay(now);
  var txStart=_walletStartOfDay(tx);
  if(range==='today') return txStart.getTime()===todayStart.getTime();
  if(range==='yesterday'){
    var y=new Date(todayStart);
    y.setDate(y.getDate()-1);
    return txStart.getTime()===y.getTime();
  }
  if(range==='week'){
    var weekStart=new Date(todayStart);
    weekStart.setDate(weekStart.getDate()-6);
    return tx>=weekStart&&tx<=now;
  }
  if(range==='30d'){
    var mStart=new Date(todayStart);
    mStart.setDate(mStart.getDate()-29);
    return tx>=mStart&&tx<=now;
  }
  return true;
}
function _walletTypeKey(type){
  if(type==='充值') return 'recharge';
  if(type==='消费') return 'consume';
  if(type==='收入') return 'income';
  return 'other';
}
function _walletTypeIcon(type){
  return {充值:'💳',消费:'⚡',收入:'💰'}[type]||'📋';
}
function _walletFormatDateGroup(timeStr){
  if(!timeStr) return '';
  var p=timeStr.split(' ')[0].split('-');
  if(p.length<3) return timeStr;
  var now=new Date();
  var y=parseInt(p[0],10),m=parseInt(p[1],10),d=parseInt(p[2],10);
  if(y===now.getFullYear()&&m===now.getMonth()+1&&d===now.getDate()) return '今天';
  if(y===now.getFullYear()&&m===now.getMonth()+1&&d===now.getDate()-1) return '昨天';
  return y+'年'+m+'月'+d+'日';
}
function _walletFormatTimeShort(timeStr){
  if(!timeStr) return '';
  var t=timeStr.split(' ');
  if(t.length<2) return timeStr;
  return t[1].slice(0,5);
}
window.renderWalletRecords=function(){
  var list=document.getElementById('wallet-record-list');
  if(!list) return;
  var filtered=txDetailData.map(function(d,i){return {d:d,i:i};}).filter(function(row){
    if(_walletRecordFilter!=='all'&&_walletTypeKey(row.d.type)!==_walletRecordFilter) return false;
    return _walletMatchDateRange(row.d.time,_walletDateRange);
  });
  var visible=filtered.slice(0,_walletRecordVisible);
  if(!visible.length){
    list.innerHTML='<div class="wallet-record-empty">该条件下暂无账单记录</div>';
    var moreBtn=document.getElementById('wallet-record-more');
    if(moreBtn) moreBtn.style.display='none';
    return;
  }
  var groups={};
  var order=[];
  visible.forEach(function(row){
    var d=row.d;
    var g=_walletFormatDateGroup(d.time);
    if(!groups[g]){groups[g]=[];order.push(g);}
    groups[g].push(row);
  });
  var html='';
  order.forEach(function(g){
    html+='<div class="wallet-record-group-date">'+g+'</div>';
    groups[g].forEach(function(row){
      var d=row.d;
      var i=row.i;
      var tk=_walletTypeKey(d.type);
      var isPlus=(d.amount||'').indexOf('+')===0;
      html+='<div class="wallet-record-item" data-tx-idx="'+i+'" role="button" tabindex="0">'+
        '<div class="wallet-record-icon is-'+tk+'">'+_walletTypeIcon(d.type)+'</div>'+
        '<div class="wallet-record-body">'+
          '<div class="wallet-record-title">'+(d.desc||d.type)+'</div>'+
          '<div class="wallet-record-meta">'+
            '<span>'+d.type+'</span><span>·</span>'+
            '<span>'+_walletFormatTimeShort(d.time)+'</span>'+
            (d.status?'<span>·</span><span class="wallet-record-status '+(d.status==='成功'?'is-ok':'is-pending')+'">'+d.status+'</span>':'')+
          '</div></div>'+
        '<div class="wallet-record-amount '+(isPlus?'is-plus':'is-minus')+'">'+d.amount+'</div>'+
      '</div>';
    });
  });
  list.innerHTML=html;
  list.querySelectorAll('.wallet-record-item').forEach(function(el){
    el.addEventListener('click',function(){
      var idx=parseInt(el.getAttribute('data-tx-idx'),10);
      if(!isNaN(idx)) openTxDetail(idx);
    });
  });
  var moreBtn=document.getElementById('wallet-record-more');
  if(moreBtn){
    moreBtn.style.display=filtered.length>_walletRecordVisible?'block':'none';
    moreBtn.textContent=filtered.length>_walletRecordVisible?'加载更多':'没有更多了';
  }
};
window.initWalletPage=function(){
  _walletRecordFilter='all';
  _walletDateRange='all';
  _walletRecordVisible=6;
  var tabs=document.querySelectorAll('#wallet-records-tabs .wallet-records-tab');
  tabs.forEach(function(tab){
    tab.classList.toggle('active',tab.getAttribute('data-filter')==='all');
    tab.onclick=function(){
      tabs.forEach(function(t){t.classList.remove('active');});
      tab.classList.add('active');
      _walletRecordFilter=tab.getAttribute('data-filter')||'all';
      _walletRecordVisible=6;
      renderWalletRecords();
    };
  });
  var dateTabs=document.querySelectorAll('#wallet-records-date-tabs .wallet-records-date-tab');
  dateTabs.forEach(function(tab){
    tab.classList.toggle('active',tab.getAttribute('data-range')==='all');
    tab.onclick=function(){
      dateTabs.forEach(function(t){t.classList.remove('active');});
      tab.classList.add('active');
      _walletDateRange=tab.getAttribute('data-range')||'all';
      _walletRecordVisible=6;
      renderWalletRecords();
    };
  });
  var moreBtn=document.getElementById('wallet-record-more');
  if(moreBtn){
    moreBtn.onclick=function(){
      _walletRecordVisible+=6;
      renderWalletRecords();
    };
  }
  renderWalletRecords();
};
window.openTxDetail = function(idx) {
  const d = txDetailData[idx];
  if(!d) return;
  const modal = document.getElementById('tx-detail-modal');
  const colorMap = {消费:'text-red-500',充值:'text-green-600',收入:'text-green-600',提现:'text-amber-600'};
  const statusMap = {成功:'text-green-600',处理中:'text-amber-600',失败:'text-red-500'};
  modal.querySelector('.tx-type').textContent = d.type;
  modal.querySelector('.tx-type').className = 'font-medium ' + (colorMap[d.type]||'');
  modal.querySelector('.tx-amount').textContent = d.amount;
  modal.querySelector('.tx-amount').className = 'font-medium ' + (d.amount.startsWith('+') ? 'text-green-600' : 'text-red-500');
  modal.querySelector('.tx-status').textContent = d.status;
  modal.querySelector('.tx-status').className = (statusMap[d.status]||'text-gray-500');
  modal.querySelector('.tx-time').textContent = d.time;
  modal.querySelector('.tx-desc').textContent = d.desc;
  modal.querySelector('.tx-work-id').textContent = d.id || '-';
  modal.querySelector('.tx-creator').textContent = d.creator || '-';
  modal.querySelector('.tx-pay').textContent = d.pay;
  openModal('tx-detail-modal');
};
window.resetTxFilters = function() {
  showToast('🔄 筛选条件已重置');
};
window.confirmExport = function() {
  closeModal('export-modal');
  setTimeout(() => openModal('export-success-modal'), 300);
};

// ===== Generate gallery cards =====
const galleryData = [
  {img:'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=400&fit=crop',title:'赛博朋克城市夜景',author:'青铜娃娃',paid:'💎付费⚡0.5',likes:'1.2k',views:'3.4k'},
  {img:'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop',title:'国风水墨仕女图',author:'墨池',paid:'💎付费⚡0.3',likes:'856',views:'2.1k'},
  {img:'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop',title:'抽象几何光影',author:'Kai',paid:'',likes:'2.3k',views:'5.6k'},
  {img:'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=400&fit=crop',title:'像素冒险世界',author:'青铜娃娃',paid:'💎付费⚡0.8',likes:'654',views:'1.8k'},
  {img:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',title:'北欧极光摄影',author:'墨池',paid:'',likes:'3.1k',views:'7.2k'},
  {img:'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&h=400&fit=crop',title:'霓虹都市·赛博朋克',author:'青铜娃娃',paid:'💎付费⚡0.5',likes:'987',views:'2.9k'},
  {img:'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=400&h=400&fit=crop',title:'数字流体艺术',author:'Luna',paid:'💎付费⚡0.4',likes:'1.8k',views:'4.2k'},
  {img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',title:'光影人像·自然光',author:'Sophia',paid:'',likes:'2.5k',views:'6.1k'}
];
const grid = document.getElementById('gallery-grid');
if(grid) galleryData.forEach((d,i)=>{
  const card = document.createElement('div');
  card.className='gallery-card bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700';
  card.innerHTML = `<div class="relative aspect-square"><img src="${d.img}" class="w-full h-full object-cover" loading="lazy">${d.paid ? `<span class="paid-badge absolute top-2 left-2 px-2 py-0.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-[10px] font-semibold rounded">${d.paid}</span>` : ''}</div><div class="p-2.5"><h4 class="text-xs font-semibold truncate">${d.title}</h4><div class="flex items-center justify-between mt-1 text-[11px] text-gray-400"><span class="author-name cursor-pointer">👤${d.author}</span><span class="like-btn cursor-pointer flex items-center gap-0.5">❤️<span>${d.likes}</span></span><span>👁️${d.views}</span></div></div>`;
  grid.appendChild(card);
});

// ===== Re-bind events after gallery generation =====
function bindEvents() {
  // (hero-start / hero-browse 已移除)
  document.querySelector('.publish-btn')?.addEventListener('click',function(){pressAnim(this);openModal('publish-modal');});

  // Feature cards → 打开模板详情弹窗
  document.querySelectorAll('.feature-card').forEach(c=>c.addEventListener('click',function(e){
    if(e.target.closest('.series-more')||e.target.closest('.series-watch'))return;
    pressAnim(this);
    const t=this.querySelector('h3')?.textContent?.trim()||'';
    if(appTemplateData[t]){openAppTemplate(t);showToast(`📂 打开「${t}」模板详情`);}
  }));

  // Series
  document.querySelector('.series-more')?.addEventListener('click',function(){pressAnim(this);showToast('跳转 /series');});
  document.querySelectorAll('.series-card').forEach(el=>el.addEventListener('click',function(e){
    if(e.target.closest('.series-more'))return;
    pressAnim(this);
    const key = this.dataset.series || 'comic';
    openSeriesDetail(key);
    showToast(`📺 进入「${seriesData[key]?.title||''}」`);
  }));
  document.querySelector('.gallery-more')?.addEventListener('click',function(){pressAnim(this);showToast('跳转 /inspiration?view=all');});

  // 5.5: 灵感卡片 → 打开详情
  document.querySelectorAll('.gallery-card').forEach(c=>c.addEventListener('click',function(e){
    if(e.target.closest('.like-btn')||e.target.closest('.paid-badge')||e.target.closest('.author-name'))return;
    pressAnim(this);
    const img=this.querySelector('img')?.src||'',title=this.querySelector('h4')?.textContent||'',author=this.querySelector('.author-name')?.textContent?.replace('👤','').trim()||'未知',badge=this.querySelector('.paid-badge'),likes=this.querySelector('.like-btn span')?.textContent||'0',views=this.querySelector('.flex.items-center.justify-between .gap-0\\.5 + span')?.textContent?.replace('👁️','').trim()||(this.innerHTML.match(/👁️([^<]*)/)?.[1]?.trim()||'0');
    const viewsTxt = [...this.querySelectorAll('.text-\\[11px\\]')].find(el=>el.textContent.includes('👁️'))?.textContent?.replace('👁️','').trim()||(this.querySelectorAll('.text-\\[11px\\]')[2]?.textContent||'0');
    // Populate work-detail page
    document.getElementById('wd-image').src=EXAMPLE_PREVIEW_IMAGE;
    document.getElementById('wd-title').textContent=title;
    document.getElementById('wd-author').textContent=author;
    document.getElementById('wd-likes').textContent=likes;
    document.getElementById('wd-views').textContent=viewsTxt;
    document.getElementById('wd-creator').textContent=author;
    // CTA: 付费 / 免费
    const cta=document.getElementById('wd-cta-area');
    if(badge){const p=badge.textContent.trim().replace(/[^0-9.]/g,'');cta.innerHTML=`<button onclick="pressAnim(this);openModal('purchase-modal')" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-semibold hover:from-purple-700 hover:to-blue-700 transition">💎 使用此灵感 <span class="text-[10px] opacity-80">消耗 ${p}</span></button>`;}else{cta.innerHTML=`<button onclick="pressAnim(this);showPage('image');showToast('🚀 已跳转图片页面')" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold hover:from-green-600 hover:to-emerald-600 transition">🚀 免费使用此灵感</button>`;}
    showPage('work-detail');
  }));

  // 5.5: ❤️ 点赞
  document.querySelectorAll('.like-btn').forEach(b=>b.addEventListener('click',function(e){e.stopPropagation();pressAnim(this);this.classList.toggle('liked');const s=this.querySelector('span');if(!s)return;let c=parseInt(s.textContent.replace(/[^0-9]/g,''));if(this.classList.contains('liked')){c++;showToast('❤️ 已点赞');}else{c=Math.max(0,c-1);showToast('已取消点赞');}s.textContent=c>=1000?(c/1000).toFixed(1).replace(/\.0$/,'')+'k':c;}));

  // 5.5: 付费标识→闪烁
  document.querySelectorAll('.paid-badge').forEach(b=>b.addEventListener('click',function(e){e.stopPropagation();this.classList.remove('animate-blink');void this.offsetWidth;this.classList.add('animate-blink');showToast(`💎 付费灵感，${this.textContent.trim()}`);}));

  // 5.5: 作者名→跳转
  document.querySelectorAll('.author-name').forEach(e=>e.addEventListener('click',function(e2){e2.stopPropagation();const n=this.textContent.replace('👤','').trim();this.style.color='#3B82F6';setTimeout(()=>this.style.color='',2000);showToast(`👤 跳转 /profile/${encodeURIComponent(n)}`);}));

  // 5.5: 加载更多
  document.querySelector('.load-more')?.addEventListener('click',function(){pressAnim(this);this.textContent='⏳ 加载中...';this.disabled=true;setTimeout(()=>{this.innerHTML='🔄 加载更多';this.disabled=false;showToast('✅ 已加载下一页作品');},1200);});

  // 5.6: 详情弹窗控件
  document.querySelector('.detail-copy')?.addEventListener('click',function(){pressAnim(this);showToast('📋 提示词已复制到剪贴板');});
  document.querySelector('.detail-use')?.addEventListener('click',function(){pressAnim(this);closeModal('detail-modal');showPage('image');showToast('🚀 已跳转图片页面并填充提示词');});

  // 6.4: 聊天控件
  document.querySelector('.new-chat')?.addEventListener('click',function(){pressAnim(this);var cm=document.getElementById('chat-messages');if(cm){cm.innerHTML='<div id="chat-hot-apps-mount"></div><div class="flex justify-center py-8 text-gray-400 text-xs"><div class="text-center"><div class="text-2xl mb-1">💬</div>新对话已开始</div></div>';if(typeof placeChatHotAppsStrip==='function')placeChatHotAppsStrip();}showToast('🗑️ 对话已清空');});
  document.querySelector('.collab-toggle')?.addEventListener('click',function(){pressAnim(this);const panel=document.getElementById('collab-panel');panel?.classList.toggle('hidden');if(!panel?.classList.contains('hidden'))syncCollabSummary();showToast('⚡ 打开多模型协作配置面板');});
  // ⚡ 开始协作
  document.querySelector('.collab-start')?.addEventListener('click',function(){pressAnim(this);
    document.getElementById('collab-panel').classList.add('hidden');
    const names=[...document.querySelectorAll('#collab-model-list .model-item input:checked')].map(cb=>cb.closest('.model-item').querySelector('.text-xs.font-medium')?.textContent).filter(Boolean);
    if(names.length<2){showToast('⚠️ 请至少选择2个模型');return;}
    const summary=document.getElementById('collab-summary-select')?.value||names[0];
    collabMode=true;collabModels=names;collabSummary=summary;
    const msgs=document.getElementById('chat-messages');
    msgs.innerHTML=`<div class="collab-status bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-3 mb-3 anim-fade-up"><div class="flex items-center justify-between mb-2"><span class="text-xs font-semibold text-purple-700 dark:text-purple-300">⚡ 多模型协作模式已开启</span><button onclick="exitCollab()" class="text-[10px] px-2 py-0.5 border border-purple-300 dark:border-purple-700 rounded hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-600">退出协作</button></div><div class="text-[11px] text-gray-500"><div>🤖 参与模型: ${names.map(n=>'['+n+']').join(' ')} <span class="text-gray-400">共${names.length}个模型</span></div><div>✨ 总结模型: ${summary}</div></div></div><div class="flex justify-center py-8 text-gray-400 text-xs"><div class="text-center"><div class="text-2xl mb-1">💬</div>请输入问题开始多模型协作</div></div>`;
    if(typeof syncChatMobileToolIcons==='function')syncChatMobileToolIcons();
    showToast('⚡ 多模型协作模式已开启');
  });
  // 退出协作
  window.exitCollab=function(){
    if(typeof closeChatMobileSheet==='function')closeChatMobileSheet();
    exitCollabMode();
  };
  function checkCollabDone(names,summary,question){
    const done=document.querySelectorAll('.model-progress .status-text.text-green-600');
    if(done.length<names.length)return;
    // 模拟4类回答内容
    const answers=[
      '从技术角度来看，AI对就业市场的影响主要体现在三个方面：\n1. 自动化替代：制造业、客服等重复性岗位将逐步被AI替代，预计到2030年将影响全球约3亿个岗位。\n2. 新岗位创造：AI训练师、提示词工程师、AI伦理顾问等新职业将大量涌现。\n3. 技能升级：现有岗位需要掌握AI协作能力，人机协同成为新常态。\n\n建议：教育体系需加强STEM教育，同时培养批判性思维和创造力。',
      '从商业角度来看，企业将经历三个阶段的变化：\n第一阶段（2026-2028）：AI辅助阶段，将AI作为效率工具。\n第二阶段（2029-2032）：人机协作阶段，AI与人类分工明确。\n第三阶段（2033-2036）：AI驱动阶段，商业模式全面重构。\n\n企业需要提前布局AI战略，培养员工的AI素养，否则将被市场淘汰。',
      '从社会角度来看，需要关注的不仅是就业数量，更是就业质量：\n• 教育体系需要改革，培养AI无法替代的创造力、情感智能和复杂决策能力。\n• 社保制度需要调整，应对结构性失业风险。\n• 全民基本收入(UBI)将重新被提上议程。\n• 数字鸿沟问题需要引起重视，确保AI红利公平分配。',
      '综合来看，AI对就业市场的影响是一个渐进但深远的过程。关键不在于AI是否会取代人类工作，而在于我们如何适应这个变革。未来的赢家将是那些能够与AI协作的人，而不是与AI竞争的人。'
    ];
    const modelAnswers={};
    names.forEach((n,i)=>{modelAnswers[n]=answers[i%answers.length];});
    // 生成总结
    const summaryText=`综合${names.join('、')}三个模型的分析，从技术、商业、社会三个维度来看：\n\n【技术维度】${names[0]}指出，AI将替代重复性劳动，但同时创造新的技术岗位，需要教育体系提前布局人才培养。\n\n【商业维度】${names[1]||names[0]}分析认为，企业将更注重员工的AI协作能力，商业模式将经历从辅助到驱动三个阶段的演变。\n\n【社会维度】${names[2]||names[0]}强调，需要建立新的教育体系和社保制度，确保AI红利公平分配，缩小数字鸿沟。`;
    const msgs=document.getElementById('chat-messages');
    let html='<div class="collab-result mt-2 space-y-3 anim-fade-up ml-[60px]">';
    // 总结
    html+=`<div class="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 border border-purple-200 dark:border-purple-800 rounded-xl p-3"><div class="flex items-center justify-between mb-2"><span class="text-xs font-semibold text-purple-700 dark:text-purple-300">✨ 总结 (由 ${summary} 整合)</span><button onclick="this.parentElement.parentElement.querySelector('.summary-body').classList.toggle('hidden')" class="text-[10px] text-gray-400 hover:text-gray-600">收起 ▼</button></div><div class="summary-body text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">${summaryText}</div><div class="flex gap-2 mt-2"><button onclick="showToast('📋 已复制总结')" class="text-gray-400 hover:text-gray-600" title="复制总结"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button><button onclick="showToast('🔊 朗读总结')" class="text-gray-400 hover:text-gray-600" title="朗读"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg></button></div></div>`;
    // 各模型原始回答
    names.forEach((n,i)=>{
      const d=modelAnswers[n];const collapsed=i>0?' collapsed':'';
      html+=`<div class="model-answer${collapsed} bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"><div class="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-700/50 cursor-pointer" onclick="this.nextElementSibling.classList.toggle('hidden');this.querySelector('.arrow').classList.toggle('rotate-180')"><span class="text-xs font-medium flex items-center gap-1.5"><span>🤖</span>${n} 的原始回答</span><span class="flex items-center gap-2"><button onclick="event.stopPropagation();showToast('📋 已复制')" class="text-gray-400 hover:text-gray-600" title="复制"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button><span class="arrow text-[10px] text-gray-400 transition-transform ${i===0?'rotate-180':''}">▼</span></span></div><div class="p-2.5 text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line ${i===0?'':'hidden'}">${d}</div></div>`;
    });
    // 移除进度面板
    const prog=document.querySelector('.collab-progress');if(prog)prog.remove();
    msgs.innerHTML+=html;msgs.scrollTop=msgs.scrollHeight;
  }
  // 取消按钮
  document.querySelector('.collab-cancel')?.addEventListener('click',function(){pressAnim(this);document.getElementById('collab-panel').classList.add('hidden');});
  document.querySelectorAll('.preset-tag').forEach(t=>t.addEventListener('click',function(){pressAnim(this);showToast(`📋 打开「${this.textContent.trim()}」详情弹窗`);}));
  document.querySelector('.role-select')?.addEventListener('click',function(){pressAnim(this);openModal('role-modal');});
  document.querySelector('.history-btn')?.addEventListener('click',function(){pressAnim(this);showToast('📁 展开历史对话侧边栏');});
  document.querySelector('.attach-btn')?.addEventListener('click',function(){pressAnim(this);showToast('📎 展开附件菜单');});
  document.querySelector('.mic-btn')?.addEventListener('click',function(){pressAnim(this);showToast('🎤 开始语音输入');});
  document.querySelector('.asset-btn')?.addEventListener('click',function(){pressAnim(this);showToast('📁 打开资产库弹窗');});
  window.sendChatMessage=function(btn){
    const inp=document.getElementById('chat-input');
    if(!inp||!inp.value.trim()){
      showToast('⚠️ 请输入要发送的内容');
      return;
    }
    if(btn&&typeof pressAnim==='function')pressAnim(btn);
    const q=inp.value;
    const attachments = [...chatAttachments]; // 保存当前附件
    inp.value='';
    clearChatAttachments();
    const msgs=document.getElementById('chat-messages');
    
    // 构建附件HTML
    var attachmentsHtml = '';
    if(attachments.length > 0) {
      attachmentsHtml = '<div class="flex flex-wrap gap-2 mt-2">';
      attachments.forEach(function(att) {
        if(att.type.startsWith('image/')) {
          attachmentsHtml += '<img src="'+att.dataUrl+'" class="max-w-[120px] max-h-[100px] rounded-lg object-cover cursor-pointer hover:opacity-90" onclick="previewImage(this.src)">';
        } else {
          var icon = getAttachmentIcon(att.type, att.name);
          attachmentsHtml += '<div class="flex items-center gap-1.5 px-2 py-1 bg-white/20 rounded-lg text-white text-[10px]"><span>'+icon+'</span><span class="max-w-[80px] truncate">'+att.name+'</span></div>';
        }
      });
      attachmentsHtml += '</div>';
    }
    
    // 多模型协作模式
    if(collabMode){
      showToast('⚡ 多模型协作进行中...');
      const names=collabModels||[];const summary=collabSummary||'GPT-5.4';
      msgs.innerHTML+=`<div class="flex justify-end anim-fade-up"><div class="chat-msg-col chat-msg-col--user"><div class="message-bubble user p-3 rounded-2xl rounded-br-sm bg-blue-500 text-white text-xs leading-relaxed">${q}${attachmentsHtml}</div><div class="chat-msg-actions flex items-center gap-2 mt-1"><button onclick="copyUserMessage(this)" class="text-gray-400 hover:text-gray-600" title="复制"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div></div></div>`;
      // 进度面板
      let progressHtml=`<div class="collab-progress bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-3 anim-fade-up mt-2"><div class="flex items-center justify-between mb-2"><span class="text-xs font-semibold text-purple-700 dark:text-purple-300">⏳ 多模型协作进行中...</span><button onclick="exitCollab()" class="text-[10px] px-2 py-0.5 border border-purple-300 rounded hover:bg-purple-100 text-purple-600">取消协作</button></div>`;
      names.forEach((n,i)=>{progressHtml+=`<div class="flex items-center gap-2 text-[11px] mb-1 model-progress" data-idx="${i}"><span class="w-5">🤖</span><span class="font-medium w-32 truncate">${n}</span><span class="status-text text-gray-400">⏳ 等待中...</span><span class="ml-auto text-[9px] text-gray-400 w-10 text-right">0%</span></div>`;});
      progressHtml+=`<div class="text-[10px] text-gray-400 mt-2">已完成 0/${names.length} 个模型回答，完成后将自动生成总结...</div></div>`;
      msgs.innerHTML+=progressHtml;msgs.scrollTop=msgs.scrollHeight;
      // 模拟各模型依次完成
      names.forEach((n,i)=>{setTimeout(()=>{const row=document.querySelector(`.model-progress[data-idx="${i}"]`);if(!row)return;const st=row.querySelector('.status-text');let pct=0;const iv=setInterval(()=>{pct+=Math.floor(Math.random()*15)+5;if(pct>=100){pct=100;clearInterval(iv);st.textContent='✅ 完成';st.className='status-text text-green-600';row.querySelector('.text-\\[9px\\]').textContent='100%';const done=document.querySelectorAll('.model-progress .status-text.text-green-600').length;document.querySelector('.collab-progress .text-\\[10px\\]').textContent=`已完成 ${done}/${names.length} 个模型回答，完成后将自动生成总结...`;checkCollabDone(names,summary,q);}else{st.textContent='⏳ 回答中...';st.className='status-text text-purple-600';row.querySelector('.text-\\[9px\\]').textContent=pct+'%';}},300);},i*1200);});
      return;
    }
    // 普通回复模式
    showToast('⏎ 提交消息，调用AI生成回复');
    msgs.innerHTML+='<div class="chat-msg-row chat-msg-row--user flex justify-end anim-fade-up"><div class="chat-msg-col chat-msg-col--user"><div class="message-bubble user p-3 rounded-2xl rounded-br-sm bg-blue-500 text-white text-xs leading-relaxed">'+q+attachmentsHtml+'</div><div class="chat-msg-actions flex items-center gap-2 mt-1"><button onclick="copyUserMessage(this)" class="text-gray-400 hover:text-gray-600" title="复制"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div></div></div>';
    setTimeout(function(){
      var role=currentRole||'';
      var label=role?'🤖 GPT-5.4 ('+role+')':'🤖 GPT-5.4';
      var tags=[];
      if(searchEnabled)tags.push('<span class="text-[9px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 px-1.5 py-0.5 rounded ml-1">🌐 联网</span>');
      if(deepThinkEnabled)tags.push('<span class="text-[9px] bg-purple-100 dark:bg-purple-900/30 text-purple-600 px-1.5 py-0.5 rounded ml-1">🧠 深度思考</span>');
      var tagStr=tags.join('');
      var firstLine=searchEnabled?'<span class="text-[10px] text-blue-500">[正在搜索互联网...]</span><br>':'收到！正在思考你的问题...<br>';
      if(deepThinkEnabled)firstLine='<span class="text-[10px] text-purple-500">[深度思考中...]</span><br>';
      var extra='';
      if(deepThinkEnabled){
        extra='<div class="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-2.5 mt-2 text-[10px] leading-relaxed"><div class="text-[10px] font-semibold text-purple-700 dark:text-purple-300 mb-1">📝 推理过程</div>设鸡有x只，兔有y只。<br><br>根据题意：<br>① x + y = 35 (头的总数)<br>② 2x + 4y = 94 (脚的总数)<br><br>由①得：x = 35 - y<br>代入②：2(35 - y) + 4y = 94<br>　　　70 - 2y + 4y = 94<br>　　　70 + 2y = 94<br>　　　2y = 24<br>　　　y = 12<br><br>代入①：x + 12 = 35<br>　　　x = 23<br><br>验证：23×2 + 12×4 = 46 + 48 = 94 ✅<br><br><span class="text-green-600 font-semibold">✅ 最终答案：鸡有 23 只，兔有 12 只。</span></div>';
      }
      var bodyHtml=firstLine+extra;
      var bubbleHtml=typeof buildAiMessageBubbleHtml==='function'?buildAiMessageBubbleHtml({label:label,tags:tagStr,bodyHtml:bodyHtml}):'';
      msgs.innerHTML+='<div class="chat-msg-row chat-msg-row--ai flex justify-start ml-[60px] anim-fade-up"><div class="chat-msg-col chat-msg-col--ai">'+bubbleHtml+'</div></div>';
      if(typeof placeChatHotAppsStrip==='function')placeChatHotAppsStrip();
      else msgs.scrollTop=msgs.scrollHeight;
    },600);
  };
  document.querySelectorAll('#page-chat .send-btn').forEach(function(btn){
    btn.addEventListener('click',function(){sendChatMessage(btn);});
  });
  var chatInputEl=document.getElementById('chat-input');
  if(chatInputEl){
    chatInputEl.addEventListener('keydown',function(e){
      if(e.key==='Enter'&&!e.shiftKey){
        e.preventDefault();
        sendChatMessage();
      }
    });
  }

  // 7.2: 图片控件
  document.querySelectorAll('.edit-img-btn,.preset-btn,.pin-btn,.guide-btn').forEach(b=>b.addEventListener('click',function(){pressAnim(this);const actions={'编辑图片':'进入图片编辑器','💎预设':'展开预设系统面板','📌置顶':'该模型已置顶','玩法':'打开玩法说明弹窗'};showToast(actions[this.textContent.trim().replace(' ','')]||'操作执行');}));
  // ===== 图片角色预设数据 =====
  const imgRoleData = {
    '👤 电商海报': {prompt:'电商主图，产品展示，促销海报，商业摄影风格，突出产品卖点，视觉冲击力强，干净背景，4K高清',ratio:'1:1 正方形',quality:'4K 超清'},
    '👤 人像写真': {prompt:'人像写真，柔和自然光，肤质细腻，背景虚化，情绪氛围感，高级感色调，精修质感',ratio:'3:4 竖版',quality:'4K 超清'},
    '👤 概念插画': {prompt:'概念艺术插画，奇幻风格，丰富细节，光影层次，数字绘画质感，创意构图，氛围渲染',ratio:'16:9 横版',quality:'2K 高清'},
    '👤 自然风光': {prompt:'自然风光摄影，壮丽景色，黄金时刻光线，丰富色彩层次，景深清晰，HDR效果，沉浸感',ratio:'16:9 横版',quality:'2K 高清'},
    '👤 美食摄影': {prompt:'美食摄影，诱人摆盘，暖色调照明，细节特写，浅景深，食物纹理清晰，食欲感强',ratio:'1:1 正方形',quality:'4K 超清'}
  };
  // ===== 视频角色预设数据 =====
  const videoRoleData = {
    '👤 短视频编导': {prompt:'快节奏短视频，竖屏拍摄，前3秒抓眼球，热门BGM，口播+画面切换，信息密度高，适合抖音/快手传播',resolution:'1080P',ratio:'9:16'},
    '👤 广告导演': {prompt:'品牌广告大片，电影级画质，精致构图，情感叙事，品牌调性统一，产品卖点自然融入故事，15-30秒',resolution:'4K',ratio:'16:9'},
    '👤 微电影导演': {prompt:'微电影叙事，情节完整，人物刻画细腻，镜头语言丰富，光影层次感强，配乐烘托氛围，3-5分钟短片',resolution:'4K',ratio:'16:9'},
    '👤 MV导演': {prompt:'音乐MV风格，节奏与音乐同步，创意转场，色彩风格统一，艺术化表达，歌词可视化，视觉冲击力',resolution:'4K',ratio:'16:9'},
    '👤 纪录片编导': {prompt:'纪实风格，自然光线，跟拍镜头，采访画面，真实感强，旁白解说，信息量大，人文关怀视角',resolution:'1080P',ratio:'16:9'}
  };
  document.querySelectorAll('.role-avatar').forEach(a=>a.addEventListener('click',function(){pressAnim(this);const section=this.closest('.page-section');if(section){section.querySelectorAll('.role-avatar').forEach(x=>{x.classList.remove('bg-blue-100','dark:bg-blue-900/30','text-blue-600','border-blue-500');x.classList.add('bg-gray-100','dark:bg-gray-800');});}this.classList.add('bg-blue-100','dark:bg-blue-900/30','text-blue-600','border-blue-500');this.classList.remove('bg-gray-100','dark:bg-gray-800');
    // 图片页角色 → 自动填充提示词和参数
    if(section?.id==='page-image'){
      const key=this.textContent.trim();
      const data=imgRoleData[key];
      if(data){
        const ta=section.querySelector('textarea');
        if(ta)ta.value=data.prompt;
        const selects=section.querySelectorAll('select');
        // 第3个select = 比例 (0:16竖屏 → 对应值)
        if(selects[2])selects[2].value=data.ratio;
        // 第4个select = 质量
        if(selects[3])selects[3].value=data.quality;
        // 显示提示条（放在角色区下面，紧跟着角色区）
        let hint=section.querySelector('.role-hint');
        if(!hint){hint=document.createElement('div');hint.className='role-hint text-[11px] text-blue-600 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2.5 anim-fade-up mt-2';const roleSection=section.querySelector('.role-avatar')?.closest('.mb-4');if(roleSection)roleSection.after(hint);else section.querySelector('select:last-of-type')?.closest('.mb-4')?.after(hint);}
        hint.innerHTML=`💡 提示：「${key.replace('👤 ','')}」角色已激活，已为您优化提示词和参数，可直接生成或继续调整`;
      }
    }
    // 视频页角色 → 自动填充提示词和参数
    if(section?.id==='page-video'){
      const key=this.textContent.trim();
      const data=videoRoleData[key];
      if(data){
        const ta=section.querySelector('textarea');
        if(ta)ta.value=data.prompt;
        const selects=section.querySelectorAll('select');
        // selects[2] = 分辨率, selects[3] = 比例 (在buttons之后)
        if(selects[2]&&data.resolution)selects[2].value=data.resolution;
        const ratioSelect=[...selects].find(s=>['16:9','9:16','4:3','1:1'].some(v=>[...s.options].some(o=>o.textContent.includes(v))));
        if(ratioSelect&&data.ratio){
          const opt=[...ratioSelect.options].find(o=>o.textContent.includes(data.ratio));
          if(opt)ratioSelect.value=opt.textContent;
        }
        let hint=section.querySelector('.role-hint');
        if(!hint){hint=document.createElement('div');hint.className='role-hint text-[11px] text-blue-600 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2.5 anim-fade-up mt-2';const roleSection=section.querySelector('.role-avatar')?.closest('.mb-4');if(roleSection)roleSection.after(hint);}
        hint.innerHTML=`💡 提示：「${key.replace('👤 ','')}」角色已激活，已为您优化提示词和参数，可直接生成或继续调整`;
      }
    }
    showToast('👤 选中「'+this.textContent.trim()+'」');
  }));
  document.querySelectorAll('.upload-audio').forEach(b=>b.addEventListener('click',function(){
    pressAnim(this);
    if(document.getElementById('page-video')?.classList.contains('active')&&typeof openVideoAssetModal==='function') openVideoAssetModal('audio');
    else if(typeof openAssetModal==='function'){assetPickTarget={page:'audio',mediaType:'audio'};openAssetModal('audio');}
  }));
  document.querySelectorAll('.upload-ref').forEach(b=>b.addEventListener('click',function(){
    pressAnim(this);
    var section=document.querySelector('.page-section.active');
    if(section?.id==='page-image'&&typeof openImageAssetModal==='function') openImageAssetModal();
    else if(section?.id==='page-video'&&typeof openVideoAssetModal==='function') openVideoAssetModal('image');
    else if(typeof openAssetModal==='function') openAssetModal('image');
  }));
  document.querySelectorAll('.asset-select').forEach(b=>b.addEventListener('click',function(){pressAnim(this);if(typeof openAssetModal==='function')openAssetModal();else openModal('asset-modal');}));
  document.querySelectorAll('.asset-import').forEach(b=>b.addEventListener('click',function(){pressAnim(this);if(typeof openAssetModal==='function')openAssetModal();else openModal('asset-modal');}));
  function bindOpenAssetModalClick(areaId,openFn,defaultTab){
    var area=document.getElementById(areaId);
    if(!area) return;
    area.addEventListener('click',function(e){
      var trigger=e.target.closest('[data-open-asset-modal]');
      if(!trigger) return;
      e.preventDefault();
      e.stopPropagation();
      if(typeof openFn==='function') openFn();
      else if(typeof openAssetModal==='function') openAssetModal(defaultTab);
      else openModal('asset-modal');
    });
  }
  bindOpenAssetModalClick('image-input-area',function(){openImageAssetModal();},'image');
  bindOpenAssetModalClick('video-input-area',function(){openVideoAssetModal('image');},'image');
  bindOpenAssetModalClick('page-chat',function(){openChatAssetModal();},'text');
  loadUserAssetLibrary();
  var assetZone=document.getElementById('asset-upload-zone');
  if(assetZone){
    assetZone.addEventListener('dragover',function(e){e.preventDefault();assetZone.classList.add('border-blue-400','bg-blue-50/50');});
    assetZone.addEventListener('dragleave',function(){assetZone.classList.remove('border-blue-400','bg-blue-50/50');});
    assetZone.addEventListener('drop',function(e){
      e.preventDefault();
      assetZone.classList.remove('border-blue-400','bg-blue-50/50');
      if(e.dataTransfer&&e.dataTransfer.files&&e.dataTransfer.files.length){
        var input=document.getElementById('asset-upload-input');
        if(input){handleAssetUpload({files:e.dataTransfer.files,value:''});}
      }
    });
  }
  document.querySelectorAll('.save-asset').forEach(b=>b.addEventListener('click',function(){pressAnim(this);
    var ta=document.querySelector('.page-section.active textarea');
    var text=ta?ta.value.trim():'';
    if(!text){showToast('⚠️ 请输入内容后再保存');return;}
    // 简单弹窗确认保存
    var name=prompt('💾 保存为资产\n\n请输入资产名称：','我的文本资产');
    if(name&&name.trim()){showToast('✅ 已保存「'+name.trim()+'」到资产库');}else if(name!==null){showToast('⚠️ 资产名称不能为空');}
  }));
  document.querySelectorAll('.gen-btn').forEach(b=>{
    if(b.id==='video-gen-btn-desktop'||b.id==='video-gen-btn-mobile'||b.id==='image-gen-btn-desktop'||b.id==='image-gen-btn-mobile'||b.id==='audio-gen-btn-desktop'||b.id==='audio-gen-btn-mobile')return;
    b.addEventListener('click',function(){pressAnim(this);this.textContent='⏳ 生成中...';this.disabled=true;setTimeout(()=>{this.innerHTML='✨ 生成';this.disabled=false;showToast('✅ 生成完成');},1500);});
  });

  // 8.2: 视频控件
  document.querySelectorAll('.lip-sync,.subtitle').forEach(b=>b.addEventListener('click',function(){pressAnim(this);const isOn=this.textContent.includes('❌');this.textContent=isOn?this.textContent.replace('❌','✅'):this.textContent.replace('✅','❌');showToast(isOn?'✅ 已开启':'❌ 已关闭');}));

  // 9.2: 音频控件
  if(typeof initAudioVoicePicker==='function') initAudioVoicePicker();
  document.querySelectorAll('.new-voice').forEach(function(btn){
    btn.addEventListener('click',function(e){
      if(e&&typeof e.preventDefault==='function') e.preventDefault();
      if(typeof pressAnim==='function') pressAnim(btn);
      if(typeof openVoiceCloneModal==='function') openVoiceCloneModal();
    });
  });
  document.querySelectorAll('.more-roles').forEach(b=>b.addEventListener('click',function(){pressAnim(this);openModal('role-modal');}));
  // ===== 系列详情页 (8.1节) =====
  document.querySelectorAll('.series-tab').forEach(t=>t.addEventListener('click',function(){pressAnim(this);document.querySelectorAll('.series-tab').forEach(x=>{x.classList.remove('bg-blue-100','dark:bg-blue-900/30','text-blue-600');x.classList.add('bg-gray-100','dark:bg-gray-800');});this.classList.add('bg-blue-100','dark:bg-blue-900/30','text-blue-600');this.classList.remove('bg-gray-100','dark:bg-gray-800');showToast(`🔀 切换到「${this.textContent.trim()}」`);}));
  document.getElementById('series-work-grid')?.addEventListener('click',function(e){const w=e.target.closest('.series-work');if(w){pressAnim(w);showToast('📂 打开作品详情');}});
  document.querySelector('.series-load-more')?.addEventListener('click',function(){pressAnim(this);showToast('🔄 加载更多作品');});

  // 10.3: Apps控件
  document.querySelectorAll('.tab-rec,.tab-hot,.tab-fav').forEach(t=>t.addEventListener('click',function(){pressAnim(this);document.querySelectorAll('.tab-rec,.tab-hot,.tab-fav').forEach(x=>{x.classList.remove('bg-blue-100','dark:bg-blue-900/30','text-blue-600');x.classList.add('text-gray-600');});this.classList.add('bg-blue-100','dark:bg-blue-900/30','text-blue-600');this.classList.remove('text-gray-600');showToast(`显示「${this.textContent.trim()}」模板`);}));
  document.querySelectorAll('.cat-card,.template-card').forEach(c=>c.addEventListener('click',function(){pressAnim(this);showToast('📂 打开模板详情弹窗');}));

  // 11.2: 模型广场控件
  document.querySelectorAll('.provider-chip').forEach(chip => {
    chip.addEventListener('click', function() {
      document.querySelectorAll('.provider-chip').forEach(c => {
        c.classList.remove('active', 'bg-blue-500', 'text-white');
        c.classList.add('border', 'border-gray-200', 'dark:border-gray-600', 'text-gray-600', 'dark:text-gray-400');
      });
      this.classList.add('active', 'bg-blue-500', 'text-white');
      this.classList.remove('border', 'border-gray-200', 'dark:border-gray-600', 'text-gray-600', 'dark:text-gray-400');
      refreshModelList();
    });
  });
  document.querySelector('.model-search-input')?.addEventListener('input', refreshModelList);
  document.querySelector('.reset-filters')?.addEventListener('click', function() {
    document.querySelectorAll('.provider-chip').forEach(c => {
      c.classList.toggle('active', c.dataset.provider === 'all');
      if(c.dataset.provider === 'all') { c.classList.add('bg-blue-500', 'text-white'); c.classList.remove('border', 'border-gray-200', 'dark:border-gray-600', 'text-gray-600', 'dark:text-gray-400'); }
      else { c.classList.remove('active', 'bg-blue-500', 'text-white'); c.classList.add('border', 'border-gray-200', 'dark:border-gray-600', 'text-gray-600', 'dark:text-gray-400'); }
    });
    document.querySelector('.model-search-input').value = '';
    refreshModelList();
  });
  document.querySelectorAll('.view-toggle').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.view-toggle').forEach(b => {
        b.classList.remove('bg-blue-500', 'text-white');
        b.classList.add('border', 'border-gray-200', 'dark:border-gray-600', 'text-gray-600', 'dark:text-gray-400');
      });
      this.classList.add('bg-blue-500', 'text-white');
      this.classList.remove('border', 'border-gray-200', 'dark:border-gray-600', 'text-gray-600', 'dark:text-gray-400');
      modelViewMode = this.dataset.view;
      const tableView = document.querySelector('.model-table-view');
      const cardView = document.querySelector('.model-card-view');
      if(tableView) tableView.classList.toggle('hidden', modelViewMode !== 'table');
      if(cardView) cardView.classList.toggle('hidden', modelViewMode !== 'card');
      refreshModelList();
    });
  });
  document.querySelector('.copy-search-btn')?.addEventListener('click', function() {
    const rows = document.querySelectorAll('#model-table-body tr');
    if(!rows.length) { showToast('⚠️ 没有可复制的数据'); return; }
    const lines = ['模型名称\t供应商\t计费类型\t输入价格\t输出价格'];
    rows.forEach(r => {
      const cells = r.querySelectorAll('td');
      if(cells.length >= 5) lines.push(`${cells[0].textContent.trim()}\t${cells[1].textContent.trim()}\t${cells[2].textContent.trim()}\t${cells[3].textContent.trim()}\t${cells[4].textContent.trim()}`);
    });
    navigator.clipboard?.writeText(lines.join('\n'));
    showToast('📋 模型列表已复制到剪贴板');
  });
  document.querySelector('.load-more-models')?.addEventListener('click', function() {
    pressAnim(this);
    modelPageSize += 10;
    refreshModelList();
    if(modelPageSize >= modelData.length) this.textContent = '✅ 已全部加载';
    else showToast('🔄 已加载更多模型');
  });
  document.querySelector('.help-btn')?.addEventListener('click', function() {
    pressAnim(this); showToast('📖 跳转 /help/newapi');
  });
  document.querySelector('.price-toggle')?.addEventListener('click', function() {
    pressAnim(this); showToast('💰 切换价格显示货币');
  });

  // 公告控件
  document.querySelectorAll('.announce-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.announce-tab').forEach(t => {
        t.classList.remove('active', 'bg-blue-500', 'text-white');
        t.classList.add('border', 'border-gray-200', 'dark:border-gray-600', 'text-gray-600', 'dark:text-gray-400');
      });
      this.classList.add('active', 'bg-blue-500', 'text-white');
      this.classList.remove('border', 'border-gray-200', 'dark:border-gray-600', 'text-gray-600', 'dark:text-gray-400');
      announcePage = 0;
      renderAnnounceList();
    });
  });
  document.querySelector('.announce-search')?.addEventListener('input', function() {
    announcePage = 0;
    renderAnnounceList();
  });

  // 11.3: Skills控件
  document.querySelector('.connect-btn')?.addEventListener('click',function(){
    pressAnim(this);
    if(typeof showPage==='function'){showPage('api');showToast('🔑 前往密钥管理创建 API Key');}
    else{document.getElementById('skills-mcp-section')?.scrollIntoView({behavior:'smooth'});}
  });
  document.querySelector('.skills-step-key-btn')?.addEventListener('click',function(){
    pressAnim(this);
    if(typeof showPage==='function'){showPage('api');showToast('🔑 在密钥管理中创建 API Key');}
  });
  document.querySelector('.docs-btn')?.addEventListener('click',function(){pressAnim(this);showPage('mcp-docs');});
  document.querySelector('.copy-config')?.addEventListener('click',function(){pressAnim(this);
    const json='{\n  "mcpServers": {\n    "guid": {\n      "url": "https://api.guid.ai/mcp",\n      "headers": {\n        "Authorization": "Bearer YOUR_API_KEY"\n      }\n    }\n  }\n}';
    navigator.clipboard?.writeText(json);
    showToast('✅ 配置已复制 — MCP服务器配置已复制到剪贴板');
  });

  // 12.3: API控件
  document.querySelector('.new-key-btn')?.addEventListener('click',function(){pressAnim(this);openModal('create-key-modal');});
  document.querySelectorAll('.stat-card').forEach(c=>c.addEventListener('click',function(){pressAnim(this);showToast('📊 显示详细统计数据');}));
  document.querySelectorAll('.copy-key').forEach(b=>b.addEventListener('click',function(){pressAnim(this);navigator.clipboard?.writeText('sk-guid-***');showToast('📋 API密钥已复制到剪贴板');}));
  document.querySelectorAll('.edit-key').forEach(b=>b.addEventListener('click',function(){pressAnim(this);showToast('✏️ 打开编辑密钥弹窗');}));
  document.querySelectorAll('.del-key').forEach(b=>b.addEventListener('click',function(){pressAnim(this);showToast('⚠️ 确认删除该密钥？');}));
  document.querySelector('.copy-curl-btn')?.addEventListener('click',function(){pressAnim(this);navigator.clipboard?.writeText('curl -X POST https://api.guid.ai/v1/chat/completions ...');showToast('📋 curl命令已复制到剪贴板');});
  document.querySelector('.view-docs-btn')?.addEventListener('click',function(){pressAnim(this);showToast('📄 跳转完整API文档');});
  document.querySelectorAll('.upgrade-plan-btn').forEach(b=>b.addEventListener('click',function(){pressAnim(this);showToast('💎 打开套餐升级弹窗');}));
  document.querySelector('.consult-plan-btn')?.addEventListener('click',function(){pressAnim(this);showToast('💬 联系销售');});

  // 14.2: 个人中心控件 - 移除旧handler，由新handler统一处理
  document.querySelector('.copy-id')?.addEventListener('click',function(){pressAnim(this);showToast('📋 用户ID已复制');});
  // 退出登录由按钮 onclick="handleLogoutClick(this)" 处理，避免重复绑定

  // 免费使用此灵感 → 跳转聊天页并填充提示词
  document.addEventListener('click',function(e){
    const btn=e.target.closest('.goto-chat-btn');
    if(btn){pressAnim(btn);closeModal('detail-modal');showPage('image');showToast('🚀 已跳转图片页面并填充提示词');}
  });

  // 付费：确认支付 → 扣费成功后跳转图片页面
  document.querySelector('.confirm-pay')?.addEventListener('click',function(){pressAnim(this);showToast('⏳ 扣费中...');setTimeout(()=>{closeModal('purchase-modal');closeModal('detail-modal');showPage('image');showToast('✅ 支付成功！已跳转到图片页面并填充提示词');},1000);});

  // 公告
  document.querySelector('.nav-announce')?.addEventListener('click',function(){pressAnim(this);renderAnnounceModal();openModal('announcement-modal');});
  document.querySelectorAll('#announcement-modal button').forEach(b=>b.addEventListener('click',function(){pressAnim(this);showToast(`📢 ${this.textContent.trim()}`);}));

  // 邀请
  document.querySelector('.copy-link')?.addEventListener('click',function(){pressAnim(this);showToast('📋 邀请链接已复制');});

  // ===== 官网首页(未登录) 控件 (3.3节) =====
  // [GUID.AI] Logo → 刷新首页
  document.querySelector('#nav-home .cursor-pointer')?.addEventListener('click',function(){showPage('homepage');showToast('🏠 返回首页');});

  // [登录] → 打开登录弹窗
  document.querySelector('.login-btn')?.addEventListener('click',function(){pressAnim(this);openModal('login-modal');});

  // [🌐 语言切换] → 展开/收起语言下拉菜单
  window.HEADER_NAV_ITEMS=[
    {page:'inspiration',label:'✨ 灵感'},
    {page:'model-hub',label:'🤖 模型'},
    {page:'chat',label:'💬 文字创作'},
    {page:'image',label:'🖼️ 图片生成'},
    {page:'video',label:'🎬 视频工坊'},
    {page:'audio',label:'🎵 音频空间'},
    {page:'3dgs',label:'🧊 3DGS'},
    {page:'apps',label:'🎮 爆款 Apps'},
    {page:'myassets',label:'💎 我的资产'},
    {page:'skills',label:'🔌 Skills'}
  ];

  window.renderHeaderMobileMenu=function(mode){
    var navEl=document.getElementById('header-mobile-menu-nav');
    var footEl=document.getElementById('header-mobile-menu-foot');
    if(!navEl||!footEl)return;
    var items=(window.HEADER_NAV_ITEMS||[]).filter(function(it){
      return !(it.requiresAuth&&!window.isAuthLoggedIn());
    });
    navEl.innerHTML=items.map(function(it){
      return '<button type="button" class="header-mobile-menu-item" data-nav-page="'+it.page+'" onclick="headerMobileNavGo(\''+it.page+'\')">'+it.label+'</button>';
    }).join('');
    if(mode==='home'){
      footEl.innerHTML=
        '<div class="text-[11px] text-gray-400 px-1">语言</div>'+
        '<div class="header-mobile-menu-lang" id="header-mobile-menu-lang"></div>'+
        '<button type="button" class="header-mobile-menu-login" onclick="closeHeaderMobileMenu();openModal(\'login-modal\')">登录 / 注册</button>';
      var langBox=document.getElementById('header-mobile-menu-lang');
      var cur=document.getElementById('current-lang');
      var curText=cur?cur.textContent.trim():'中文';
      if(langBox){
        langBox.innerHTML='';
        document.querySelectorAll('.lang-option').forEach(function(opt){
          var t=opt.getAttribute('data-lang')||opt.textContent.trim();
          var short=t.replace(/^[^\s]+\s/,'').slice(0,8);
          var btn=document.createElement('button');
          btn.type='button';
          btn.className='header-mobile-menu-lang-btn'+(short===curText||t.indexOf(curText)!==-1?' is-active':'');
          btn.textContent=short;
          btn.onclick=function(){
            if(cur)cur.textContent=short;
            langBox.querySelectorAll('.header-mobile-menu-lang-btn').forEach(function(b){b.classList.remove('is-active');});
            btn.classList.add('is-active');
            var dd=document.getElementById('lang-dropdown');
            if(dd)dd.classList.add('hidden');
            showToast('🌐 已切换为 '+short);
          };
          langBox.appendChild(btn);
        });
      }
    }else{
      footEl.innerHTML=
        '<button type="button" class="header-mobile-menu-wallet" onclick="closeHeaderMobileMenu();showPage(\'wallet\');showToast(\'💰 跳转钱包管理\')"><span>⚡ 钱包余额</span><span class="font-semibold">12.50</span></button>'+
        '<button type="button" class="header-mobile-menu-item" data-nav-page="profile" onclick="headerMobileNavGo(\'profile\')">👤 个人中心</button>';
    }
  };

  window.syncHeaderMobileMenuActive=function(pageId,isHome){
    var navEl=document.getElementById('header-mobile-menu-nav');
    if(!navEl)return;
    navEl.querySelectorAll('.header-mobile-menu-item[data-nav-page]').forEach(function(btn){
      var p=btn.getAttribute('data-nav-page');
      var on=!isHome&&p===pageId;
      btn.classList.toggle('active',!!on);
    });
  };

  window.headerMobileNavGo=function(pageId){
    if(typeof showPage==='function')showPage(pageId);
    if(typeof closeHeaderMobileMenu==='function')closeHeaderMobileMenu();
  };

  window.toggleHeaderMobileMenu=function(){
    var sheet=document.getElementById('header-mobile-menu');
    if(!sheet)return;
    var open=sheet.classList.contains('hidden');
    if(open){
      var isHome=!!(document.getElementById('nav-home')&&document.getElementById('nav-home').style.display!=='none');
      if(typeof renderHeaderMobileMenu==='function')renderHeaderMobileMenu(isHome?'home':'app');
      var activePage='homepage';
      document.querySelectorAll('.page-section.active').forEach(function(s){
        if(s.id&&s.id.indexOf('page-')===0)activePage=s.id.replace('page-','');
      });
      if(typeof syncHeaderMobileMenuActive==='function')syncHeaderMobileMenuActive(activePage,isHome);
      sheet.classList.remove('hidden');
      sheet.setAttribute('aria-hidden','false');
      document.body.classList.add('header-menu-open');
      document.querySelectorAll('.header-menu-toggle').forEach(function(b){b.classList.add('is-open');b.setAttribute('aria-expanded','true');});
    }else{
      closeHeaderMobileMenu();
    }
  };

  window.closeHeaderMobileMenu=function(){
    var sheet=document.getElementById('header-mobile-menu');
    if(!sheet)return;
    sheet.classList.add('hidden');
    sheet.setAttribute('aria-hidden','true');
    document.body.classList.remove('header-menu-open');
    document.querySelectorAll('.header-menu-toggle').forEach(function(b){b.classList.remove('is-open');b.setAttribute('aria-expanded','false');});
  };

  if(!window._headerMenuSheetInBody){
    window._headerMenuSheetInBody=true;
    var hm=document.getElementById('header-mobile-menu');
    if(hm&&hm.parentElement!==document.body)document.body.appendChild(hm);
  }

  const langBtn = document.getElementById('lang-btn');
  const langDropdown = document.getElementById('lang-dropdown');
  const currentLangSpan = document.getElementById('current-lang');
  
  langBtn?.addEventListener('click', function(e) {
    e.stopPropagation();
    pressAnim(this);
    langDropdown.classList.toggle('hidden');
  });
  
  // 点击语言选项
  document.querySelectorAll('.lang-option').forEach(opt => {
    opt.addEventListener('click', function() {
      const lang = this.dataset.lang;
      const langText = lang.split(' ')[1]; // 去掉国旗获取语言名
      currentLangSpan.textContent = langText;
      langDropdown.classList.add('hidden');
      showToast('🌐 语言已切换为 ' + lang);
      // 清除其他选项的选中样式
      document.querySelectorAll('.lang-option').forEach(o => o.classList.remove('bg-blue-100', 'dark:bg-blue-900/30'));
      this.classList.add('bg-blue-100', 'dark:bg-blue-900/30');
    });
  });
  
  // 点击其他地方关闭下拉菜单 / 侧滑菜单
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.lang-dropdown') && !e.target.closest('#lang-btn')) {
      langDropdown?.classList.add('hidden');
    }
    if (!e.target.closest('#header-mobile-menu') && !e.target.closest('.header-menu-toggle')) {
      if (typeof closeHeaderMobileMenu === 'function') closeHeaderMobileMenu();
    }
  });

  // [🎯 开始使用] → 打开登录弹窗
  document.querySelector('.home-start')?.addEventListener('click',function(){pressAnim(this);openModal('login-modal');});

  // 官网首页所有控件→进入登录页
  document.querySelector('.home-learn')?.addEventListener('click',function(){pressAnim(this);openModal('login-modal');});
  document.querySelectorAll('.capability-card').forEach(c=>c.addEventListener('click',function(){pressAnim(this);openModal('login-modal');}));
  document.querySelector('.home-register')?.addEventListener('click',function(){pressAnim(this);openModal('login-modal');});
  // 用户价值卡片、数据统计卡片、Footer链接→全部进入登录页
  document.querySelectorAll('#page-homepage .cursor-pointer').forEach(c=>{
    if(!c.closest('.lang-btn')&&!c.closest('.login-btn')&&!c.closest('[onclick]'))c.addEventListener('click',function(e){
      if(e.target.closest('.lang-btn')||e.target.closest('.login-btn'))return;
      pressAnim(this);openModal('login-modal');
    });
  });
  // Footer文字链接
  document.querySelectorAll('#page-homepage .gap-1 span').forEach(s=>{
    const t=s.textContent.trim();
    if(t!=='·'&&t!=='GUID.AI')s.addEventListener('click',function(){pressAnim(this);openModal('login-modal');});
  });

  // ===== 登录弹窗控件 (4.2节) =====
  // 手机/邮箱登录Tab切换
  document.querySelectorAll('.login-tab').forEach(t=>t.addEventListener('click',function(){pressAnim(this);
    document.querySelectorAll('.login-tab').forEach(x=>{x.classList.remove('active','text-blue-600','border-blue-500');x.classList.add('text-gray-500');x.style.borderBottom='2px solid transparent';});
    this.classList.add('active','text-blue-600','border-blue-500');this.classList.remove('text-gray-500');this.style.borderBottom='2px solid #3B82F6';
    const tab=this.dataset.tab;
    document.getElementById('login-form-phone').classList.toggle('hidden',tab!=='phone');
    document.getElementById('login-form-email').classList.toggle('hidden',tab!=='email');
  }));

  // [获取验证码] → 倒计时60秒（手机 / 邮箱）
  document.querySelectorAll('#login-modal .send-code').forEach(function(btn){
    btn.addEventListener('click',function(){
      pressAnim(this);
      if(this.disabled) return;
      var isEmail=!!this.closest('#login-form-email');
      var sec=60;
      var self=this;
      self.textContent=sec+'s';
      self.disabled=true;
      var iv=setInterval(function(){
        sec--;
        if(sec<=0){
          clearInterval(iv);
          self.textContent='获取验证码';
          self.disabled=false;
        }else{
          self.textContent=sec+'s';
        }
      },1000);
      showToast(isEmail?'✉️ 验证码已发送至邮箱，请注意查收':'📱 验证码已发送');
    });
  });

  // 图形验证码 → 刷新（验证码登录 / 密码登录共用）
  document.querySelectorAll('.captcha-refresh').forEach(function(btn){
    btn.addEventListener('click',function(){
      pressAnim(this);
      var c='0123456789';
      this.textContent=Array.from({length:4},function(){return c[Math.floor(Math.random()*10)];}).join(' ');
      showToast('🔄 验证码已刷新');
    });
  });

  // [登录 / 注册] → 校验提交
  document.querySelector('.login-submit')?.addEventListener('click',function(){pressAnim(this);this.textContent='⏳ 登录中...';this.disabled=true;
    setTimeout(()=>{closeModal('login-modal');this.textContent='登录 / 注册';this.disabled=false;
      window.setAuthLoggedIn(true);
      showPage('inspiration');
      showToast('✅ 登录成功，跳转 /inspiration');
    },1200);
  });

  // 第三方登录按钮 → 唤起OAuth
  document.querySelectorAll('.oauth-btn').forEach(b=>b.addEventListener('click',function(){pressAnim(this);showToast(`🔑 唤起${this.title||'第三方'}OAuth授权`);}));

  document.querySelector('.password-login-submit')?.addEventListener('click',function(){
    pressAnim(this);
    var account=document.getElementById('pwd-login-account')?.value.trim();
    var password=document.getElementById('pwd-login-password')?.value;
    var captchaInput=(document.getElementById('pwd-login-captcha')?.value||'').replace(/\s/g,'');
    var captchaBtn=document.querySelector('#password-login-modal .captcha-refresh');
    var captchaCode=(captchaBtn?.textContent||'').replace(/\s/g,'');
    var agreed=document.querySelector('.pwd-login-agree')?.checked;
    if(!account){showToast('请输入账号');return;}
    if(!password){showToast('请输入密码');return;}
    if(!captchaInput){showToast('请输入图形验证码');return;}
    if(captchaInput!==captchaCode){
      showToast('图形验证码不正确');
      if(captchaBtn){
        var digits='0123456789';
        captchaBtn.textContent=Array.from({length:4},function(){return digits[Math.floor(Math.random()*10)];}).join(' ');
      }
      var captchaField=document.getElementById('pwd-login-captcha');
      if(captchaField) captchaField.value='';
      return;
    }
    if(!agreed){showToast('请先阅读并同意用户协议与隐私政策');return;}
    var btn=this;
    var old=btn.textContent;
    btn.textContent='⏳ 登录中...';
    btn.disabled=true;
    setTimeout(function(){
      closeModal('password-login-modal');
      btn.textContent=old;
      btn.disabled=false;
      window.setAuthLoggedIn(true);
      showPage('inspiration');
      showToast('✅ 密码登录成功');
    },1200);
  });

  // Footer链接 → 跳转对应页面
  document.querySelectorAll('#page-homepage .hover\\:underline').forEach(l=>l.addEventListener('click',function(){pressAnim(this);showToast(`📄 跳转 /${this.textContent.trim().replace(/[《》]/g,'')}`);}));

  // Nav (app nav items → use showPage)
  document.querySelectorAll('#nav-app [data-page]').forEach(item=>{
    item.addEventListener('click',function(){
      pressAnim(this);showPage(this.dataset.page);
    });
  });

  // Dark mode
  window.toggleDark = function() {
    document.body.classList.toggle('dark');
    const icon=document.getElementById('theme-icon');
    if(document.body.classList.contains('dark'))icon.innerHTML='<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
    else icon.innerHTML='<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>';
  };

  // ===== 钱包页 (13.4节) =====
  document.querySelectorAll('.recharge-btn').forEach(function(btn){
    btn.addEventListener('click',function(){pressAnim(this);openModal('recharge-modal');});
  });
  document.querySelectorAll('.export-btn').forEach(function(btn){
    btn.addEventListener('click',function(){pressAnim(this);showToast('📥 导出账单 Excel');});
  });
  if(typeof initWalletPage==='function') initWalletPage();
  if(typeof initProfileBindDrawer==='function') initProfileBindDrawer();

  // ===== 充值弹窗 =====
  document.querySelectorAll('.recharge-tier').forEach(t=>t.addEventListener('click',function(){pressAnim(this);document.querySelectorAll('.recharge-tier').forEach(x=>{x.classList.remove('border-2','border-blue-500','bg-blue-50','dark:bg-blue-900/20');x.classList.add('border');});this.classList.add('border-2','border-blue-500','bg-blue-50','dark:bg-blue-900/20');this.classList.remove('border');}));
  document.querySelectorAll('.pay-method').forEach(p=>p.addEventListener('click',function(){pressAnim(this);document.querySelectorAll('.pay-method').forEach(x=>{x.classList.remove('border-2','border-blue-500','bg-blue-50','dark:bg-blue-900/20');x.classList.add('border');});this.classList.add('border-2','border-blue-500','bg-blue-50','dark:bg-blue-900/20');this.classList.remove('border');}));
  document.querySelector('.confirm-recharge')?.addEventListener('click',function(){pressAnim(this);showToast('⏳ 跳转支付平台...');setTimeout(()=>{closeModal('recharge-modal');showToast('✅ 充值成功');},1200);});

  // ===== 角色管理 =====
  // 聊天页角色选择（药丸风格 inline）
  // 聊天角色预设提示词
  const chatRolePrompts={
    '写作助手':'请以爆款写作的风格，帮我撰写一篇关于[主题]的文章，要求标题吸引眼球、结构清晰、内容有深度。',
    '文案助手':'请帮我写一段社交媒体推广文案，风格要吸引用户互动，突出产品/服务的核心卖点。',
    '商业顾问':'请对以下业务/市场情况进行深度商业分析，包括行业格局、竞争态势和发展建议。',
    '数据顾问':'请帮我分析以下数据，提炼关键洞察，并给出数据驱动的业务优化建议。',
    '代码助手':'请审查以下代码，指出潜在问题、性能优化点和最佳实践建议。',
    '翻译官':'请将以下内容翻译成专业、地道的中文/英文，保持原文语调和风格。'
  };
  window.selectChatRole=function(name){
    pressAnim(event?.target);
    currentRole=name;
    // 更新下拉按钮文字
    const textEl=document.getElementById('current-role-text');
    if(textEl) textEl.textContent=name;
    // 更新药丸高亮（如果还存在）
    document.querySelectorAll('#page-chat .role-avatar').forEach(x=>{x.classList.remove('bg-blue-100','dark:bg-blue-900/30','text-blue-600','border-blue-500');x.classList.add('bg-gray-100','dark:bg-gray-800');});
    const active=[...document.querySelectorAll('#page-chat .role-avatar')].find(x=>x.textContent.trim().includes(name));
    if(active){active.classList.add('bg-blue-100','dark:bg-blue-900/30','text-blue-600','border-blue-500');active.classList.remove('bg-gray-100','dark:bg-gray-800');}
    const roleTextEl=document.getElementById('chat-current-role');
    if(roleTextEl) roleTextEl.textContent='当前: '+name;
    // 填充输入框提示词
    const ta=document.querySelector('#page-chat textarea');
    if(ta&&chatRolePrompts[name])ta.value=chatRolePrompts[name];
    // 显示提示条
    const section=document.getElementById('page-chat');
    let hint=section?.querySelector('.role-hint');
    if(!hint&&section){hint=document.createElement('div');hint.className='role-hint text-[11px] text-blue-600 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2.5 anim-fade-up mb-2';section.querySelector('.mb-2')?.after(hint);}
    if(hint)hint.innerHTML='💡 提示：「'+name+'」角色已激活，已为您优化提示词，可直接发送或继续调整';
    showToast('🔄 角色已切换 / 当前角色：'+name);
  };
  // 取消角色
  window.clearRole=function(){
    currentRole='';
    // 重置下拉按钮文字
    const textEl=document.getElementById('current-role-text');
    if(textEl) textEl.textContent='选择角色';
    // 重置药丸高亮
    document.querySelectorAll('#page-chat .role-avatar').forEach(x=>{x.classList.remove('bg-blue-100','dark:bg-blue-900/30','text-blue-600','border-blue-500');x.classList.add('bg-gray-100','dark:bg-gray-800');});
    const roleTextEl=document.getElementById('chat-current-role');
    if(roleTextEl) roleTextEl.textContent='当前: 无';
    // 移除提示条
    const h=document.querySelector('.role-hint');
    if(h)h.remove();
    showToast('✕ 已取消当前角色');
  };

  window.isChatMobileView=function(){
    return window.matchMedia('(max-width: 768px)').matches;
  };
  window.isMediaMobileView=window.isChatMobileView;

  window.closeMediaMobileSheet=function(){
    if(typeof stopMobileVoiceInput==='function')stopMobileVoiceInput(true);
    if(typeof stopVoicePreview==='function')stopVoicePreview();
    var sheet=document.getElementById('media-mobile-sheet');
    if(sheet){sheet.classList.add('hidden');sheet.setAttribute('aria-hidden','true');}
    document.body.classList.remove('media-sheet-open');
    if(typeof closeImageToolbarDropdowns==='function')closeImageToolbarDropdowns(null);
    if(typeof closeVideoToolbarDropdowns==='function')closeVideoToolbarDropdowns(null);
    if(typeof closeAudioToolbarDropdowns==='function')closeAudioToolbarDropdowns(null);
    // 关闭手机端情绪条
    var emoBar=document.getElementById('audio-mobile-emotion-bar');
    if(emoBar) emoBar.classList.add('hidden');
  };

  window.bindMediaSheetBody=function(){
    var sheet=document.getElementById('media-mobile-sheet');
    if(sheet&&sheet.parentElement!==document.body)document.body.appendChild(sheet);
    var body=document.getElementById('media-sheet-body');
    if(!body||body._mediaParamBound)return;
    body._mediaParamBound=true;
    body.addEventListener('click',function(e){
      var ip=e.target.closest('[data-iparam]');
      if(ip){
        e.preventDefault();
        e.stopPropagation();
        if(typeof setImageOutputParam==='function'){
          setImageOutputParam(ip.getAttribute('data-iparam'),ip.getAttribute('data-ivalue'));
        }
        return;
      }
      var vp=e.target.closest('[data-vparam]');
      if(vp){
        e.preventDefault();
        e.stopPropagation();
        if(typeof setVideoOutputParam==='function'){
          setVideoOutputParam(vp.getAttribute('data-vparam'),vp.getAttribute('data-vvalue'));
        }
        return;
      }
      var vt=e.target.closest('[data-vtoggle]');
      if(vt){
        e.preventDefault();
        e.stopPropagation();
        if(typeof setVideoToggleParam==='function'){
          setVideoToggleParam(vt.getAttribute('data-vtoggle'),vt.getAttribute('data-vvalue'));
        }
        return;
      }
      var ap=e.target.closest('[data-aparam]');
      if(ap){
        e.preventDefault();
        e.stopPropagation();
        if(typeof setAudioOutputParam==='function'){
          setAudioOutputParam(ap.getAttribute('data-aparam'),ap.getAttribute('data-avalue'));
        }
      }
    });
  };

  window.cloneMediaPanelToSheet=function(srcId){
    var src=document.getElementById(srcId);
    if(!src)return null;
    var clone=src.cloneNode(true);
    clone.removeAttribute('id');
    clone.className='media-sheet-clone';
    clone.classList.remove('hidden','absolute','bottom-full','left-0','mb-1','w-72','w-48','w-56','w-[300px]','z-50','output-params-panel','video-output-panel','shadow-2xl');
    clone.style.position='static';
    clone.style.width='100%';
    clone.style.maxHeight='none';
    return clone;
  };

  window.buildImagePresetSheetHtml=function(){
    var sel=document.getElementById('image-preset-select');
    if(!sel)return '';
    var iconMap={'赛博朋克':'🌃','国风水墨':'🏮','胶片质感':'📷','莫兰迪色':'🎨','复古胶片':'📽️'};
    var html='<button type="button" class="media-sheet-option" onclick="applyImagePreset(\'\');closeMediaMobileSheet();"><span class="font-medium">🔄 无预设</span></button>';
    Array.prototype.forEach.call(sel.options,function(opt){
      if(!opt.value)return;
      var v=String(opt.value).replace(/'/g,'\\\'');
      var icon=iconMap[opt.value]||'📋';
      html+='<button type="button" class="media-sheet-option" onclick="applyImagePreset(\''+v+'\');closeMediaMobileSheet();"><span class="font-medium">'+icon+' '+opt.text+'</span></button>';
    });
    return html;
  };

  window.videoModeIcons={'多模式参考':'📐','首尾帧':'🔄'};

  window.buildVideoModeSheetHtml=function(){
    var sel=document.getElementById('video-param-mode');
    if(!sel)return '';
    var html='';
    Array.prototype.forEach.call(sel.options,function(opt){
      var v=String(opt.value||opt.text).replace(/'/g,'\\\'');
      var t=String(opt.text).replace(/'/g,'\\\'');
      var icon=window.videoModeIcons[t]||'🎬';
      html+='<button type="button" class="media-sheet-option" onclick="setVideoParamMode(\''+v+'\');closeMediaMobileSheet();"><span class="flex items-center gap-2"><span>'+icon+'</span><span class="font-medium">'+t+'</span></span></button>';
    });
    return html;
  };

  window.setVideoParamMode=function(mode){
    selectVideoParamMode(mode);
  };

  window.selectVideoParamMode=function(mode){
    var sel=document.getElementById('video-param-mode');
    if(sel){
      for(var i=0;i<sel.options.length;i++){
        if(sel.options[i].value===mode||sel.options[i].text===mode){sel.selectedIndex=i;mode=sel.options[i].text;break;}
      }
    }
    var textEl=document.getElementById('current-video-mode-text');
    if(textEl)textEl.textContent=mode||'多模式参考';
    var dropdown=document.getElementById('video-mode-dropdown');
    if(dropdown)dropdown.classList.add('hidden');
    document.querySelectorAll('#video-mode-dropdown [data-mode-opt]').forEach(function(el){
      el.classList.toggle('bg-blue-50',el.getAttribute('data-mode-opt')===mode);
      el.classList.toggle('dark:bg-blue-900/20',el.getAttribute('data-mode-opt')===mode);
    });
    // 更新手机端生成模式按钮图标
    var icon=window.videoModeIcons[mode]||'🎬';
    var mBtn=document.getElementById('vid-m-icon-mode');
    if(mBtn){
      mBtn.innerHTML='<span style="font-size:16px;line-height:1;display:flex;align-items:center;justify-content:center;width:100%;height:100%">'+icon+'</span>';
    }
    showToast('🎬 已切换模式：'+mode);
  };

  window.toggleVideoModeDropdown=function(e){
    if(e)e.stopPropagation();
    if(window.isMediaMobileView()){openVideoMobileSheet('mode',e);return;}
    var dropdown=document.getElementById('video-mode-dropdown');
    if(!dropdown)return;
    var willOpen=dropdown.classList.contains('hidden');
    closeVideoToolbarDropdowns(willOpen?'video-mode-dropdown':null);
    if(willOpen){
      dropdown.classList.remove('hidden');
      var sel=document.getElementById('video-param-mode');
      var cur=sel&&sel.options[sel.selectedIndex]?sel.options[sel.selectedIndex].text:'多模式参考';
      document.querySelectorAll('#video-mode-dropdown [data-mode-opt]').forEach(function(el){
        var on=el.getAttribute('data-mode-opt')===cur;
        el.classList.toggle('bg-blue-50',on);
        el.classList.toggle('dark:bg-blue-900/20',on);
        el.classList.toggle('font-medium',on);
      });
    }else dropdown.classList.add('hidden');
  };

  window.openImageMobileSheet=function(kind,e){
    if(e){e.stopPropagation();e.preventDefault();}
    if(kind==='role'&&typeof openImagePromptOptimizeModal==='function'){
      openImagePromptOptimizeModal(e);
      return;
    }
    if(!window.isMediaMobileView()){
      if(kind==='model')window.toggleImageModelDropdown(e);
      else if(kind==='role')window.toggleImageRoleDropdown(e);
      else if(kind==='params')window.toggleImageOutputParamsDropdown(e);
      else if(kind==='preset'){var s=document.getElementById('image-preset-select');if(s)s.focus();}
      return;
    }
    if(typeof closeChatMobileSheet==='function')closeChatMobileSheet();
    var sheet=document.getElementById('media-mobile-sheet');
    var body=document.getElementById('media-sheet-body');
    var titleEl=document.getElementById('media-sheet-title');
    if(!sheet||!body||!titleEl)return;
    var titles={model:'选择图片模型',role:'提示词优化',params:'输出参数',preset:'风格预设'};
    titleEl.textContent=titles[kind]||'选项';
    body.innerHTML='';
    if(kind==='model'){
      var c=window.cloneMediaPanelToSheet('image-model-dropdown');
      if(c)body.appendChild(c);
    }else if(kind==='role'){
      var c2=window.cloneMediaPanelToSheet('image-role-dropdown');
      if(c2)body.appendChild(c2);
    }else if(kind==='params'){
      var c3=window.cloneMediaPanelToSheet('image-output-params-dropdown');
      if(c3)body.appendChild(c3);
      if(typeof updateImageOutputParamsLabel==='function')updateImageOutputParamsLabel();
    }else if(kind==='preset'){
      body.innerHTML=window.buildImagePresetSheetHtml();
    }
    sheet.classList.remove('hidden');
    sheet.setAttribute('aria-hidden','false');
    document.body.classList.add('media-sheet-open');
    closeImageToolbarDropdowns(null);
  };

  window.openVideoMobileSheet=function(kind,e){
    if(e){e.stopPropagation();e.preventDefault();}
    if(!window.isMediaMobileView()){
      if(kind==='model')window.toggleVideoModelDropdown(e);
      else if(kind==='role')window.toggleVideoRoleDropdown(e);
      else if(kind==='params')window.toggleVideoOutputParamsDropdown(e);
      else if(kind==='mode')window.toggleVideoModeDropdown(e);
      return;
    }
    if(typeof closeChatMobileSheet==='function')closeChatMobileSheet();
    var sheet=document.getElementById('media-mobile-sheet');
    var body=document.getElementById('media-sheet-body');
    var titleEl=document.getElementById('media-sheet-title');
    if(!sheet||!body||!titleEl)return;
    var titles={model:'选择视频模型',role:'提示词优化',params:'输出参数',mode:'生成模式'};
    titleEl.textContent=titles[kind]||'选项';
    body.innerHTML='';
    if(kind==='model'){
      var c=window.cloneMediaPanelToSheet('video-model-dropdown');
      if(c)body.appendChild(c);
    }else if(kind==='role'){
      if(typeof openVideoPromptOptimizeModal==='function') openVideoPromptOptimizeModal(e);
      return;
    }else if(kind==='params'){
      var c3=window.cloneMediaPanelToSheet('video-output-params-dropdown');
      if(c3)body.appendChild(c3);
      if(typeof updateVideoOutputParamsLabel==='function')updateVideoOutputParamsLabel();
    }else if(kind==='mode'){
      body.innerHTML=window.buildVideoModeSheetHtml();
    }
    sheet.classList.remove('hidden');
    sheet.setAttribute('aria-hidden','false');
    document.body.classList.add('media-sheet-open');
    closeVideoToolbarDropdowns(null);
  };

  window.audioQualityIcons={'Turbo':'⚡','标准':'📊','高清':'🔊'};

  window.buildAudioQualitySheetHtml=function(){
    var sel=document.getElementById('audio-param-quality');
    if(!sel)return '';
    var html='';
    Array.prototype.forEach.call(sel.options,function(opt){
      var v=String(opt.value).replace(/'/g,'\\\'');
      var t=String(opt.text).replace(/'/g,'\\\'');
      var icon=window.audioQualityIcons[v]||'🔊';
      html+='<button type="button" class="media-sheet-option" onclick="var s=document.getElementById(\'audio-param-quality\');if(s){s.value=\''+v+'\';if(typeof updateAudioGenCost===\'function\')updateAudioGenCost();}if(typeof syncAudioMobileToolIcons===\'function\')syncAudioMobileToolIcons();closeMediaMobileSheet();"><span class="flex items-center gap-2"><span>'+icon+'</span><span class="font-medium">'+t+'</span></span></button>';
    });
    return html;
  };

  window.buildAudioEmotionSheetHtml=function(){
    if(typeof renderAudioEmotionPicker==='function') renderAudioEmotionPicker();
    var opts=window.AUDIO_EMOTION_OPTIONS||[];
    var html='<p class="text-[12px] text-gray-500 dark:text-gray-400 mb-3">点击表情将插入到文本光标处</p><div class="audio-emotion-sheet-grid" style="display:flex;flex-wrap:wrap;gap:10px">';
    opts.forEach(function(o){
      var em=o.emoji.replace(/'/g,'\\\'');
      var lb=o.label.replace(/'/g,'\\\'');
      html+='<button type="button" class="audio-emotion-sheet-btn" style="width:52px;height:52px;font-size:26px;border-radius:14px;border:1px solid #e5e7eb;background:#fff" onmousedown="event.preventDefault();if(typeof saveAudioPromptCursor===\'function\')saveAudioPromptCursor()" onclick="if(typeof setAudioEmotion===\'function\')setAudioEmotion(\''+em+'\',\''+lb+'\');">'+o.emoji+'</button>';
    });
    html+='</div>';
    return html;
  };

  window.buildAudioMobileEmotionBar=function(){
    var opts=window.AUDIO_EMOTION_OPTIONS||[];
    var content=document.getElementById('audio-mobile-emotion-content');
    if(!content||content.dataset.built==='1') return;
    content.innerHTML=opts.map(function(o,i){
      var em=o.emoji.replace(/'/g,'\\\'');
      var lb=o.label.replace(/'/g,'\\\'');
      return '<button type="button" class="audio-emotion-chip'+(i>=5?' hidden':'')+'" data-emoji="'+em+'" data-label="'+lb+'" onmousedown="event.preventDefault();saveAudioPromptCursor()" onclick="setAudioEmotion(\''+em+'\',\''+lb+'\');updateAudioMobileEmotionBarState();" title="'+lb+'" style="width:36px;height:36px;font-size:18px;border-radius:10px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.15s">'+o.emoji+'</button>';
    }).join('');
    // 如果超过5个，显示展开按钮
    if(opts.length>5){
      var toggleBtn=document.getElementById('audio-mobile-emotion-toggle');
      if(toggleBtn) toggleBtn.classList.remove('hidden');
    }
    content.dataset.built='1';
  };

  window.updateAudioMobileEmotionBarState=function(){
    var emo=document.getElementById('audio-param-emotion');
    var cur=emo?emo.value:'';
    document.querySelectorAll('#audio-mobile-emotion-content .audio-emotion-chip').forEach(function(btn){
      btn.style.borderColor=btn.getAttribute('data-emoji')===cur?'#3b82f6':'';
      btn.style.background=btn.getAttribute('data-emoji')===cur?'#eff6ff':'';
    });
  };

  window.toggleAudioMobileEmotionBar=function(){
    var bar=document.getElementById('audio-mobile-emotion-bar');
    if(!bar) return;
    if(!bar.classList.contains('hidden')){
      bar.classList.add('hidden');
      return;
    }
    if(typeof window.buildAudioMobileEmotionBar==='function') window.buildAudioMobileEmotionBar();
    bar.classList.remove('hidden');
    window.updateAudioMobileEmotionBarState();
  };

  window.toggleAudioMobileEmotionBarExpand=function(){
    var chips=document.querySelectorAll('#audio-mobile-emotion-content .audio-emotion-chip');
    var toggleBtn=document.getElementById('audio-mobile-emotion-toggle');
    var isCollapsed=chips.length>0&&chips[5]&&chips[5].classList.contains('hidden');
    chips.forEach(function(ch,i){
      if(i>=5) ch.classList.toggle('hidden',!isCollapsed);
    });
    if(toggleBtn){
      var arrow=toggleBtn.querySelector('svg');
      if(arrow) arrow.style.transform=isCollapsed?'rotate(180deg)':'rotate(0deg)';
    }
  };
  window.toggleAudioMobileEmotionBarExpand=window.toggleAudioMobileEmotionBarExpand||function(){};

  window.openAudioMobileSheet=function(kind,e){
    if(e){e.stopPropagation();e.preventDefault();}
    if(!window.isMediaMobileView()){
      if(kind==='model'&&typeof toggleAudioModelDropdown==='function')toggleAudioModelDropdown(e);
      else if(kind==='params'&&typeof toggleAudioOutputParamsDropdown==='function')toggleAudioOutputParamsDropdown(e);
      else if(kind==='quality'){
        var qs=document.getElementById('audio-param-quality');
        if(qs)qs.focus();
      }else if(kind==='emotion'&&typeof toggleAudioEmotionPicker==='function')toggleAudioEmotionPicker(e);
      return;
    }
    if(typeof closeChatMobileSheet==='function')closeChatMobileSheet();
    var sheet=document.getElementById('media-mobile-sheet');
    var body=document.getElementById('media-sheet-body');
    var titleEl=document.getElementById('media-sheet-title');
    if(!sheet||!body||!titleEl)return;
    var titles={model:'选择音频模型',params:'输出参数',quality:'质量',emotion:'情绪'};
    titleEl.textContent=titles[kind]||'选项';
    body.innerHTML='';
    if(kind==='model'){
      var c=window.cloneMediaPanelToSheet('audio-model-dropdown');
      if(c)body.appendChild(c);
    }else if(kind==='params'){
      var c2=window.cloneMediaPanelToSheet('audio-output-params-dropdown');
      if(c2)body.appendChild(c2);
      if(typeof updateAudioOutputParamsLabel==='function')updateAudioOutputParamsLabel();
    }else if(kind==='quality'){
      body.innerHTML=window.buildAudioQualitySheetHtml();
    }else if(kind==='emotion'){
      // 手机端：显示内联情绪条（紧贴输入框上方），不弹 bottom sheet
      window.toggleAudioMobileEmotionBar();
      return;
    }
    sheet.classList.remove('hidden');
    sheet.setAttribute('aria-hidden','false');
    document.body.classList.add('media-sheet-open');
    if(typeof closeAudioToolbarDropdowns==='function')closeAudioToolbarDropdowns(null);
  };

  window.syncAudioMobileToolIcons=function(){
    var emo=document.getElementById('audio-param-emotion');
    var mEmo=document.getElementById('audio-m-icon-emotion');
    if(mEmo&&emo){
      if(emo.value){
        mEmo.innerHTML='<span style="font-size:16px;line-height:1;display:flex;align-items:center;justify-content:center;width:100%;height:100%">'+emo.value+'</span>';
      }else{
        mEmo.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>';
      }
    }
    var qSel=document.getElementById('audio-param-quality');
    var mQ=document.getElementById('audio-m-icon-quality');
    if(mQ&&qSel){
      var qIcon=window.audioQualityIcons[qSel.value]||'🔊';
      mQ.innerHTML='<span style="font-size:16px;line-height:1;display:flex;align-items:center;justify-content:center;width:100%;height:100%">'+qIcon+'</span>';
    }
    var voiceId=document.getElementById('audio-selected-voice-id');
    var mVoice=document.getElementById('audio-m-icon-voice');
    if(mVoice&&voiceId) mVoice.classList.toggle('active',!!voiceId.value);
  };

  window.syncChatMobileToolIcons=function(){
    var deep=document.querySelector('#page-chat .deepthink-btn');
    var search=document.querySelector('#page-chat .search-btn');
    var collab=document.getElementById('collab-toggle-btn');
    var mDeep=document.getElementById('chat-m-icon-deepthink');
    var mSearch=document.getElementById('chat-m-icon-search');
    var mCollab=document.getElementById('chat-m-icon-collab');
    if(mDeep&&deep){
      mDeep.classList.toggle('active',deep.classList.contains('active'));
      var svg=mDeep.querySelector('svg');
      if(svg){
        if(deep.classList.contains('active')){
          svg.setAttribute('stroke','#8b5cf6');svg.style.filter='drop-shadow(0 0 2px rgba(139,92,246,.4))';
        }else{
          svg.setAttribute('stroke','currentColor');svg.style.filter='';
        }
      }
    }
    if(mSearch&&search){
      mSearch.classList.toggle('active',search.classList.contains('active'));mSearch.classList.toggle('search-on',true);
      var svg=mSearch.querySelector('svg');
      if(svg){
        if(search.classList.contains('active')){
          svg.setAttribute('stroke','#3b82f6');svg.style.filter='drop-shadow(0 0 2px rgba(59,130,246,.4))';
        }else{
          svg.setAttribute('stroke','currentColor');svg.style.filter='';
        }
      }
    }
    if(mCollab){
      mCollab.classList.toggle('active',!!collabMode);
    }
  };
  window.toggleChatMobileCollab=function(e){
    if(e){e.stopPropagation();e.preventDefault();}
    var icon=document.getElementById('chat-m-icon-collab');
    if(typeof pressAnim==='function'&&icon)pressAnim(icon);
    if(collabMode){
      if(typeof closeChatMobileSheet==='function')closeChatMobileSheet();
      exitCollabMode();
      return;
    }
    if(window.isChatMobileView&&typeof openChatMobileSheet==='function'){
      openChatMobileSheet('collab',e);
      return;
    }
    var btn=document.getElementById('collab-toggle-btn');
    if(btn)toggleCollabMode(btn);
  };
  window.closeChatMobileSheet=function(){
    if(typeof stopMobileVoiceInput==='function')stopMobileVoiceInput(true);
    var sheet=document.getElementById('chat-mobile-sheet');
    if(sheet){sheet.classList.add('hidden');sheet.setAttribute('aria-hidden','true');}
    document.body.classList.remove('chat-sheet-open');
    var model=document.getElementById('model-dropdown');
    var role=document.getElementById('role-dropdown');
    if(model)model.classList.add('hidden');
    if(role)role.classList.add('hidden');
  };
  window.closeChatPickers=window.closeChatMobileSheet;
  window.cloneChatDropdownToSheet=function(srcId){
    var src=document.getElementById(srcId);
    if(!src)return null;
    var clone=src.cloneNode(true);
    clone.removeAttribute('id');
    clone.className='chat-sheet-clone';
    clone.classList.remove('hidden','absolute','bottom-full','left-0','mb-1','w-72','w-44','z-50','chat-picker-panel');
    return clone;
  };
  window.buildChatTemplateSheetHtml=function(){
    var items=[
      {v:'',l:'📋 不使用模板',d:'清空预设'},
      {v:'writing',l:'✍️ 爆款写作模板',d:'标题吸睛、内容有深度'},
      {v:'social',l:'📱 社媒文案模板',d:'轻松活泼、真实种草'},
      {v:'business',l:'💼 商业分析模板',d:'SWOT 与行动建议'},
      {v:'data',l:'📊 数据洞察模板',d:'指标解读与趋势分析'},
      {v:'code',l:'💻 代码审查模板',d:'Bug、性能与最佳实践'},
      {v:'translate',l:'🌐 翻译润色模板',d:'准确传达原意'}
    ];
    return items.map(function(it){
      return '<button type="button" class="chat-sheet-option" onclick="applyPresetTemplate(\''+it.v+'\');closeChatMobileSheet();"><span class="text-lg shrink-0">'+(it.l.split(' ')[0])+'</span><span class="flex-1 min-w-0"><span class="block font-medium">'+it.l.replace(/^[^\s]+\s/,'')+'</span><span class="block text-[11px] text-gray-400 mt-0.5">'+it.d+'</span></span></button>';
    }).join('');
  };
  window.setChatToggle=function(kind,enable){
    var isDeep=kind==='deepthink';
    var btn=document.querySelector(isDeep?'#page-chat .deepthink-btn':'#page-chat .search-btn');
    if(!btn)return;
    var on=btn.classList.contains('active');
    if(enable&&!on){if(isDeep)window.toggleDeepThink(btn);else window.toggleSearch(btn);}
    else if(!enable&&on){if(isDeep)window.toggleDeepThink(btn);else window.toggleSearch(btn);}
    if(typeof syncChatMobileToolIcons==='function')syncChatMobileToolIcons();
    window.openChatMobileSheet(kind);
  };
  window.buildChatToggleSheetHtml=function(kind){
    var isDeep=kind==='deepthink';
    var btn=document.querySelector(isDeep?'#page-chat .deepthink-btn':'#page-chat .search-btn');
    var on=btn&&btn.classList.contains('active');
    var title=isDeep?'深度思考':'联网搜索';
    var desc=isDeep?'开启后 AI 将先展示推理过程，再给出最终答案。':'开启后 AI 将实时搜索互联网获取最新信息。';
    return '<div class="chat-sheet-toggle-card"><div class="text-sm font-semibold text-gray-800 dark:text-gray-100">'+title+'</div><p class="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">'+desc+'</p><p class="text-xs text-gray-600 dark:text-gray-300 mt-3">当前状态：<strong>'+(on?'已开启':'已关闭')+'</strong></p><div class="chat-sheet-toggle-row"><button type="button" class="chat-sheet-toggle-btn'+(!on?' on':'')+'" onclick="setChatToggle(\''+kind+'\',false)">关闭</button><button type="button" class="chat-sheet-toggle-btn'+(on?' on':'')+'" onclick="setChatToggle(\''+kind+'\',true)">开启</button></div></div>';
  };
  window.openChatMobileSheet=function(kind,e){
    if(e){e.stopPropagation();e.preventDefault();}
    if(!window.isChatMobileView()){
      if(kind==='model')window.toggleModelDropdown(e);
      else if(kind==='role')window.toggleRoleDropdown(e);
      else if(kind==='collab'){var b=document.getElementById('collab-toggle-btn');if(b)toggleCollabMode(b);}
      else if(kind==='deepthink'){var d=document.querySelector('#page-chat .deepthink-btn');if(d)toggleDeepThink(d);}
      else if(kind==='search'){var s=document.querySelector('#page-chat .search-btn');if(s)toggleSearch(s);}
      else if(kind==='template'){var sel=document.getElementById('preset-template-select');if(sel)sel.focus();}
      return;
    }
    var sheet=document.getElementById('chat-mobile-sheet');
    var body=document.getElementById('chat-sheet-body');
    var titleEl=document.getElementById('chat-sheet-title');
    if(!sheet||!body||!titleEl)return;
    var titles={model:'选择大模型',role:'选择角色',template:'预设模板',collab:'多模型协作',deepthink:'深度思考',search:'联网搜索'};
    titleEl.textContent=titles[kind]||'选项';
    body.innerHTML='';
    if(kind==='model'){
      var clone=window.cloneChatDropdownToSheet('model-dropdown');
      if(clone)body.appendChild(clone);
    }else if(kind==='role'){
      var clone2=window.cloneChatDropdownToSheet('role-dropdown');
      if(clone2)body.appendChild(clone2);
    }else if(kind==='template'){
      body.innerHTML=window.buildChatTemplateSheetHtml();
    }else if(kind==='collab'){
      var panel=document.querySelector('#collab-panel > div.relative.bg-white');
      if(panel){
        var c=panel.cloneNode(true);
        c.classList.add('chat-sheet-collab','w-full','!mx-0','!max-w-none');
        var closeBtn=c.querySelector('button[onclick*="collab-panel"]');
        if(closeBtn)closeBtn.setAttribute('onclick','closeChatMobileSheet()');
        body.appendChild(c);
      }
    }else if(kind==='deepthink'){
      body.innerHTML=window.buildChatToggleSheetHtml('deepthink');
    }else if(kind==='search'){
      body.innerHTML=window.buildChatToggleSheetHtml('search');
    }
    sheet.classList.remove('hidden');
    sheet.setAttribute('aria-hidden','false');
    document.body.classList.add('chat-sheet-open');
  };

  // ===== 角色下拉菜单 =====
  window.toggleRoleDropdown=function(e){
    if(e) e.stopPropagation();
    if(window.isChatMobileView()){window.openChatMobileSheet('role',e);return;}
    const dropdown=document.getElementById('role-dropdown');
    if(dropdown){
      const model=document.getElementById('model-dropdown');
      if(model)model.classList.add('hidden');
      dropdown.classList.toggle('hidden');
    }
  };
  
  // ===== 模型下拉菜单 =====
  let currentChatModel = 'Auto';
  
  window.toggleModelDropdown=function(e){
    if(e) e.stopPropagation();
    if(window.isChatMobileView()){window.openChatMobileSheet('model',e);return;}
    const dropdown=document.getElementById('model-dropdown');
    if(dropdown){
      const role=document.getElementById('role-dropdown');
      if(role)role.classList.add('hidden');
      dropdown.classList.toggle('hidden');
    }
  };
  
  window.selectChatModel=function(modelName, icon){
    if(typeof closeChatMobileSheet==='function')closeChatMobileSheet();
    const dropdown=document.getElementById('model-dropdown');
    if(dropdown) dropdown.classList.add('hidden');
    // 更新按钮文字
    const textEl=document.getElementById('current-model-text');
    if(textEl) textEl.textContent=modelName;
    currentChatModel=modelName;
    if(typeof updateChatGenCost==='function') updateChatGenCost();
    // 更新移动端模型按钮图标
    const mobileModelBtn = document.getElementById('chat-m-icon-model');
    if (mobileModelBtn) {
      mobileModelBtn.innerHTML = '';
      const iconSpan = document.createElement('span');
      iconSpan.textContent = icon;
      iconSpan.className = 'text-lg leading-none';
      mobileModelBtn.appendChild(iconSpan);
    }
    showToast('🤖 已切换模型：'+modelName);
  };

  window.updateChatGenCost=function(){
    var costEl=document.getElementById('chat-gen-cost');
    var modelText=document.getElementById('current-model-text');
    if(!costEl) return;
    var model=modelText?modelText.textContent.trim():'Auto';
    var ranges={
      'Auto':'0.0022-0.0065',
      'GPT-4 Turbo':'0.0040-0.0120',
      'Claude 3.5 Sonnet':'0.0028-0.0085',
      'DeepSeek V3':'0.0008-0.0025',
      'Gemini 2.5 Pro':'0.0015-0.0045',
      'Grok 3':'0.0030-0.0090',
      'Qwen Max':'0.0008-0.0025',
      'Moonshot V1':'0.0018-0.0055',
      'ChatGLM-4':'0.0008-0.0025'
    };
    var range=ranges[model]||'0.0022-0.0065';
    costEl.innerHTML='💰 预估: <span class="text-yellow-500 leading-none" aria-hidden="true">⚡</span>'+range+'/次';
  };

  window.resetMediaToolbarDropdowns=function(){
    var map={
      'image-model-dropdown':['image-model-dropdown-container','button'],
      'image-role-dropdown':['image-role-dropdown-container','button'],
      'image-output-params-dropdown':['image-output-params-wrap','button'],
      'video-model-dropdown':['video-model-dropdown-container','button'],
      'video-role-dropdown':['video-role-dropdown-container','button'],
      'video-output-params-dropdown':['video-output-params-wrap','button'],
      'video-mode-dropdown':['video-mode-dropdown-container','button']
    };
    Object.keys(map).forEach(function(id){
      var el=document.getElementById(id);
      if(!el)return;
      el.classList.add('hidden');
      el.classList.remove('toolbar-dropdown-pinned');
      el.style.cssText='';
      var wrap=document.getElementById(map[id][0]);
      if(!wrap)return;
      var anchor=wrap.querySelector(map[id][1]);
      if(anchor&&anchor.nextSibling!==el){
        wrap.insertBefore(el,anchor.nextSibling);
      }else if(!wrap.contains(el)){
        wrap.appendChild(el);
      }
      delete el._pinOrigParent;
      delete el._pinOrigNext;
    });
  };

  window.closeImageToolbarDropdowns=function(exceptId){
    ['image-model-dropdown','image-role-dropdown','image-output-params-dropdown'].forEach(function(id){
      if(id===exceptId) return;
      var el=document.getElementById(id);
      if(el) el.classList.add('hidden');
    });
  };

  function getImageRatioLabel(ratioVal){
    var labels={'0:16':'0:16 竖屏','9:16':'9:16 竖屏','16:9':'16:9 横屏','21:9':'21:9 超宽'};
    return labels[ratioVal]||ratioVal||'0:16';
  }

  window.updateImageOutputParamsLabel=function(){
    var count=document.getElementById('image-param-count');
    var ratio=document.getElementById('image-param-ratio');
    var quality=document.getElementById('image-param-quality');
    var tier=document.getElementById('image-param-tier');
    var label=document.getElementById('image-output-params-label');
    if(!label) return;
    var c=count?count.value:'1条';
    var r=ratio?ratio.value:'0:16';
    var q=quality?quality.value:'2k';
    var t=tier?tier.value:'中';
    label.textContent=c+' / '+r+' / '+q+' / '+t;
    document.querySelectorAll('[data-iparam]').forEach(function(btn){
      var param=btn.getAttribute('data-iparam');
      var val=btn.getAttribute('data-ivalue');
      var hidden=document.getElementById('image-param-'+param);
      var active=false;
      if(hidden){
        if(hidden.tagName==='SELECT'){
          var opt=hidden.options[hidden.selectedIndex];
          active=hidden.value===val||(opt&&opt.text===val);
        }else{
          active=hidden.value===val;
        }
      }
      btn.classList.toggle('active',!!active);
    });
  };

  window.toggleImageOutputParamsDropdown=function(e){
    if(e) e.stopPropagation();
    if(window.isMediaMobileView()){window.openImageMobileSheet('params',e);return;}
    var dropdown=document.getElementById('image-output-params-dropdown');
    if(!dropdown) return;
    var willOpen=dropdown.classList.contains('hidden');
    closeImageToolbarDropdowns(willOpen?'image-output-params-dropdown':null);
    if(willOpen){
      dropdown.classList.remove('hidden');
      updateImageOutputParamsLabel();
    }else{
      dropdown.classList.add('hidden');
    }
  };

  window.setImageOutputParam=function(type,value){
    var el=document.getElementById('image-param-'+type);
    if(!el)return;
    if(el.tagName==='SELECT'){
      var matched=false;
      for(var i=0;i<el.options.length;i++){
        if(el.options[i].value===value||el.options[i].text===value){
          el.selectedIndex=i;
          matched=true;
          break;
        }
      }
      if(!matched)el.value=value;
    }else{
      el.value=value;
    }
    updateImageOutputParamsLabel();
    if(type==='count'||type==='quality')updateImageGenCost();
  };

  // 图片页面模型下拉框
  window.toggleImageModelDropdown=function(e){
    if(e) e.stopPropagation();
    if(window.isMediaMobileView()){window.openImageMobileSheet('model',e);return;}
    const dropdown=document.getElementById('image-model-dropdown');
    if(!dropdown) return;
    var willOpen=dropdown.classList.contains('hidden');
    closeImageToolbarDropdowns(willOpen?'image-model-dropdown':null);
    if(willOpen) dropdown.classList.remove('hidden');
    else dropdown.classList.add('hidden');
  };

  window.selectImageModel=function(modelName, icon){
    const dropdown=document.getElementById('image-model-dropdown');
    if(dropdown) dropdown.classList.add('hidden');
    const textEl=document.getElementById('current-image-model-text');
    if(textEl) textEl.textContent=modelName;
    // 更新手机端大模型按钮图标
    if(icon){
      var mBtn=document.getElementById('img-m-icon-model');
      if(mBtn){
        mBtn.innerHTML='<span style="font-size:16px;line-height:1;display:flex;align-items:center;justify-content:center;width:100%;height:100%">'+icon+'</span>';
      }
    }
    updateImageGenCost();
    if(typeof closeMediaMobileSheet==='function')closeMediaMobileSheet();
    showToast('🎨 已切换图片模型：'+modelName);
  };

  window.calcImageGenerationCost=function(modelName,quality,tier,count){
    const modelPrices={'Auto':0.002,'Nano Banana Pro':0.002,'Midjourney 7':0.01,'DALL·E 5':0.005,'Stable Diffusion 5':0.001,'Flux.1 Pro':0.02};
    const qualityMultiplier={'1k':0.5,'2k':1,'4k':2,'8k':4};
    const tierMultiplier={'低':0.85,'中':1,'高':1.2};
    const price=modelPrices[modelName]||0.002;
    const n=parseInt(count,10)||1;
    const multiplier=(qualityMultiplier[quality]||1)*(tierMultiplier[tier]||1);
    return price*n*multiplier;
  };

  // 更新图片生成预估费用
  window.updateImageGenCost=function(){
    const countEl=document.getElementById('image-param-count');
    const qualityEl=document.getElementById('image-param-quality');
    const tierEl=document.getElementById('image-param-tier');
    const costEl=document.getElementById('image-gen-cost');
    const modelTextEl=document.getElementById('current-image-model-text');
    if(!costEl) return;
    const modelName=modelTextEl?modelTextEl.textContent:'Auto';
    const count=parseInt(countEl?countEl.value:1,10)||1;
    const resKey=qualityEl?qualityEl.value:'2k';
    const tierKey=tierEl?tierEl.value:'中';
    const total=calcImageGenerationCost(modelName,resKey,tierKey,count).toFixed(4);
    costEl.innerHTML='💰 预估: <span class="text-yellow-500 leading-none" aria-hidden="true">⚡</span>'+total+'/张';
  };

  // 图片页面提示词优化
  window.toggleImageRoleDropdown=function(e){
    if(e) e.stopPropagation();
    if(typeof openImagePromptOptimizeModal==='function') openImagePromptOptimizeModal(e);
  };

  window._promptOptimizeTimer=null;

  window.getPromptOptimizeStatusMessages=function(page,styleName){
    var sn=styleName||'';
    if(page==='video'){
      return[
        '正在分析视频脚本与镜头描述...',
        '正在匹配「'+sn+'」编导风格...',
        '正在优化节奏与转场关键词...',
        '正在补充画面与氛围细节...',
        '即将写入输入框...'
      ];
    }
    return[
      '正在分析原始提示词...',
      '正在匹配「'+sn+'」画面风格...',
      '正在补充构图与光影描述...',
      '正在润色关键词与细节...',
      '即将写入输入框...'
    ];
  };

  window.hidePromptOptimizeProgress=function(){
    if(window._promptOptimizeTimer){
      clearInterval(window._promptOptimizeTimer);
      window._promptOptimizeTimer=null;
    }
    var overlay=document.getElementById('prompt-optimize-overlay');
    if(overlay){
      overlay.classList.add('hidden');
      overlay.setAttribute('aria-hidden','true');
    }
    document.body.classList.remove('prompt-optimize-open');
    var bar=document.getElementById('prompt-optimize-progress-bar');
    if(bar) bar.style.width='0%';
    var pct=document.getElementById('prompt-optimize-pct');
    if(pct) pct.textContent='0%';
  };

  window.showPromptOptimizeProgress=function(cfg){
    cfg=cfg||{};
    if(window._promptOptimizeTimer){
      clearInterval(window._promptOptimizeTimer);
      window._promptOptimizeTimer=null;
    }
    var overlay=document.getElementById('prompt-optimize-overlay');
    if(!overlay){
      if(cfg.onComplete) cfg.onComplete();
      return;
    }
    if(overlay.parentElement!==document.body) document.body.appendChild(overlay);
    var pageTag=document.getElementById('prompt-optimize-page-tag');
    var styleEl=document.getElementById('prompt-optimize-style-name');
    var statusEl=document.getElementById('prompt-optimize-status');
    var bar=document.getElementById('prompt-optimize-progress-bar');
    var pctEl=document.getElementById('prompt-optimize-pct');
    if(pageTag) pageTag.textContent=cfg.page==='video'?'视频创作':'图片创作';
    if(styleEl) styleEl.textContent=cfg.styleName||'';
    if(statusEl) statusEl.textContent='正在准备...';
    if(bar) bar.style.width='0%';
    if(pctEl) pctEl.textContent='0%';
    overlay.classList.remove('hidden');
    overlay.setAttribute('aria-hidden','false');
    document.body.classList.add('prompt-optimize-open');
    var messages=window.getPromptOptimizeStatusMessages(cfg.page,cfg.styleName);
    var progress=0;
    window._promptOptimizeTimer=setInterval(function(){
      progress+=Math.random()*14+6;
      if(progress>=100){
        progress=100;
        clearInterval(window._promptOptimizeTimer);
        window._promptOptimizeTimer=null;
        if(bar) bar.style.width='100%';
        if(pctEl) pctEl.textContent='100%';
        if(statusEl) statusEl.textContent='优化完成';
        setTimeout(function(){
          window.hidePromptOptimizeProgress();
          if(cfg.onComplete) cfg.onComplete();
        },320);
        return;
      }
      if(bar) bar.style.width=progress+'%';
      if(pctEl) pctEl.textContent=Math.round(progress)+'%';
      if(statusEl&&messages.length){
        var idx=Math.min(Math.floor(progress/22),messages.length-1);
        statusEl.textContent=messages[idx];
      }
    },320);
  };

  window.runPromptOptimizeForMedia=function(opts){
    opts=opts||{};
    var styleName=opts.styleName;
    var page=opts.page||'image';
    if(typeof closeMediaMobileSheet==='function') closeMediaMobileSheet();
    if(page==='image'){
      var dd=document.getElementById('image-role-dropdown');
      if(dd) dd.classList.add('hidden');
      if(typeof closeImageToolbarDropdowns==='function') closeImageToolbarDropdowns(null);
    }else{
      var vdd=document.getElementById('video-role-dropdown');
      if(vdd) vdd.classList.add('hidden');
      if(typeof closeVideoToolbarDropdowns==='function') closeVideoToolbarDropdowns(null);
    }
    window.showPromptOptimizeProgress({
      page:page,
      styleName:styleName,
      onComplete:function(){
        if(opts.onLabelUpdate) opts.onLabelUpdate(styleName);
        var before=opts.getBefore?opts.getBefore():'';
        var optimized=page==='video'
          ? (typeof optimizeVideoPromptByStyle==='function'?optimizeVideoPromptByStyle(styleName,before):before)
          : (typeof optimizeImagePromptByStyle==='function'?optimizeImagePromptByStyle(styleName,before):before);
        if(opts.applyResult) opts.applyResult(optimized,before);
      }
    });
  };

  const imagePromptOptimizeStyles={
    '电商海报':{
      icon:'🛍️',
      cost:'0.02',
      desc:'强化商品卖点、商业摄影质感与干净背景，适合电商主图、促销海报与详情页配图。',
      empty:'电商主图，产品展示，促销海报，商业摄影风格，突出产品卖点，视觉冲击力强，干净背景，4K高清',
      enhance:'，电商主图风格，产品卖点突出，商业摄影质感，干净背景，专业布光，构图简洁大气，4K超清'
    },
    '人像写真':{
      icon:'👤',
      cost:'0.02',
      desc:'突出肤质质感、自然光影与情绪氛围，适合写真、头像与人物海报。',
      empty:'人像写真，柔和自然光，肤质细腻，背景虚化，情绪氛围感，高级感色调，精修质感',
      enhance:'，人像写真风格，柔和自然光，肤质细腻，背景虚化，情绪氛围感，高级感色调，精修质感'
    },
    '概念插画':{
      icon:'🎨',
      cost:'0.018',
      desc:'增强奇幻创意、数字绘画质感与氛围渲染，适合概念设计、封面与插画创作。',
      empty:'概念艺术插画，奇幻风格，丰富细节，光影层次，数字绘画质感，创意构图，氛围渲染',
      enhance:'，概念插画风格，奇幻创意，丰富细节，光影层次，数字绘画质感，创意构图，氛围渲染'
    },
    '自然风光':{
      icon:'🏔️',
      cost:'0.018',
      desc:'补充壮丽景色、黄金时刻光线与 HDR 层次，适合风景、旅行与户外主题。',
      empty:'自然风光摄影，壮丽景色，黄金时刻光线，丰富色彩层次，景深清晰，HDR效果，沉浸感',
      enhance:'，自然风光摄影，壮丽景色，黄金时刻光线，丰富色彩层次，景深清晰，HDR效果，沉浸感'
    },
    '美食摄影':{
      icon:'🍜',
      cost:'0.015',
      desc:'突出食欲感、暖色布光与食物纹理细节，适合餐饮、菜谱与产品实拍风。',
      empty:'美食摄影，诱人摆盘，暖色调照明，细节特写，浅景深，食物纹理清晰，食欲感强',
      enhance:'，美食摄影风格，诱人摆盘，暖色调照明，细节特写，浅景深，食物纹理清晰，食欲感强'
    }
  };

  window.optimizeImagePromptByStyle=function(styleName,rawPrompt){
    const style=imagePromptOptimizeStyles[styleName];
    if(!style) return rawPrompt||'';
    const trimmed=(rawPrompt||'').trim();
    if(!trimmed) return style.empty;
    const tag=style.enhance.slice(1,12);
    if(trimmed.indexOf(tag)!==-1) return trimmed;
    return trimmed+style.enhance;
  };

  window._ipomSelectedStyle=null;

  window.renderImagePromptOptimizeSchemes=function(){
    var list=document.getElementById('ipom-scheme-list');
    if(!list) return;
    var html='';
    Object.keys(imagePromptOptimizeStyles).forEach(function(name){
      var s=imagePromptOptimizeStyles[name];
      html+='<div class="ipom-scheme-item" data-style="'+name+'" onclick="selectImagePromptOptimizeScheme(\''+name+'\')">'+
        '<div class="ipom-scheme-head">'+
        '<div class="ipom-scheme-name"><span>'+(s.icon||'✨')+'</span><span>'+name+'</span></div>'+
        '<div class="ipom-scheme-actions" onclick="event.stopPropagation()">'+
        '<div class="ipom-cost">本次优化<br><span class="ipom-cost-val">⚡'+(s.cost||'0.02')+'</span></div>'+
        '<button type="button" class="ipom-execute-btn" onclick="runImagePromptOptimizeExecute()">执行优化</button>'+
        '</div></div>'+
        '<div class="ipom-scheme-desc">'+(s.desc||'')+'</div></div>';
    });
    list.innerHTML=html;
  };

  window.selectImagePromptOptimizeScheme=function(styleName){
    window._ipomSelectedStyle=styleName;
    var list=document.getElementById('ipom-scheme-list');
    if(list){
      list.querySelectorAll('.ipom-scheme-item').forEach(function(el){
        el.classList.toggle('active',el.getAttribute('data-style')===styleName);
      });
    }
    var activeBtn=list?list.querySelector('.ipom-scheme-item.active .ipom-execute-btn'):null;
    if(activeBtn) activeBtn.disabled=false;
  };

  window.openImagePromptOptimizeModal=function(e,preselectStyle){
    if(e){e.stopPropagation();e.preventDefault();}
    if(typeof closeMediaMobileSheet==='function') closeMediaMobileSheet();
    var dd=document.getElementById('image-role-dropdown');
    if(dd) dd.classList.add('hidden');
    if(typeof closeImageToolbarDropdowns==='function') closeImageToolbarDropdowns(null);
    var src=document.getElementById('image-prompt-input');
    var modalInput=document.getElementById('ipom-prompt-input');
    if(modalInput) modalInput.value=src?src.value:'';
    window._ipomSelectedStyle=null;
    if(typeof renderImagePromptOptimizeSchemes==='function') renderImagePromptOptimizeSchemes();
    if(preselectStyle&&imagePromptOptimizeStyles[preselectStyle]){
      selectImagePromptOptimizeScheme(preselectStyle);
    }else{
      var list=document.getElementById('ipom-scheme-list');
      if(list) list.querySelectorAll('.ipom-scheme-item').forEach(function(el){el.classList.remove('active');});
    }
    if(typeof openModal==='function') openModal('image-prompt-optimize-modal');
  };

  window.closeImagePromptOptimizeModal=function(){
    if(typeof closeModal==='function') closeModal('image-prompt-optimize-modal');
  };

  window.runImagePromptOptimizeExecute=function(){
    var styleName=window._ipomSelectedStyle;
    if(!styleName){
      if(typeof showToast==='function') showToast('请先选择一个优化方案');
      return;
    }
    var modalInput=document.getElementById('ipom-prompt-input');
    var before=modalInput?modalInput.value:'';
    var list=document.getElementById('ipom-scheme-list');
    var execBtn=list?list.querySelector('.ipom-scheme-item.active .ipom-execute-btn'):null;
    if(execBtn) execBtn.disabled=true;
    window.showPromptOptimizeProgress({
      page:'image',
      styleName:styleName,
      onComplete:function(){
        var optimized=typeof optimizeImagePromptByStyle==='function'?optimizeImagePromptByStyle(styleName,before):before;
        if(modalInput) modalInput.value=optimized;
        var textEl=document.getElementById('current-image-role-text');
        if(textEl) textEl.textContent=styleName;
        if(execBtn) execBtn.disabled=false;
        if(typeof showToast==='function'){
          if(!before.trim()) showToast('✨ 已按「'+styleName+'」生成优化提示词');
          else showToast('✨ 已按「'+styleName+'」优化提示词');
        }
      }
    });
  };

  window.confirmImagePromptOptimize=function(){
    var modalInput=document.getElementById('ipom-prompt-input');
    var src=document.getElementById('image-prompt-input');
    if(modalInput&&src){
      src.value=modalInput.value;
      src.focus();
    }
    closeImagePromptOptimizeModal();
    if(typeof showToast==='function') showToast('✅ 已应用优化后的提示词');
  };

  window.selectImageRole=function(styleName){
    if(typeof openImagePromptOptimizeModal==='function') openImagePromptOptimizeModal(null,styleName);
  };

  // 应用预设模板
  window.applyImagePreset=function(presetName){
    if(!presetName){
      // 无预设：恢复手机端按钮默认图标
      var mModelBtn=document.getElementById('img-m-icon-model');
      if(mModelBtn){
        mModelBtn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
      }
      var mPresetBtn=document.getElementById('img-m-icon-preset');
      if(mPresetBtn){
        mPresetBtn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>';
      }
      if(typeof closeMediaMobileSheet==='function')closeMediaMobileSheet();
      return;
    }
    const presets = {
      '赛博朋克': {
        model: 'Flux.1 Pro',
        modelIcon: '⚡',
        role: '概念插画',
        roleIcon: '🎨',
        count: '2条',
        ratio: '16:9 横屏',
        quality: '4K 超清',
        prompt: '赛博朋克风格，霓虹灯光，未来城市，高对比度色彩，数字故障效果，霓虹灯牌，潮湿街道反射，科幻机械元素，赛博朋克色调，赛博格风格'
      },
      '国风水墨': {
        model: 'Stable Diffusion 5',
        modelIcon: '🧪',
        role: '自然风光',
        roleIcon: '🏔️',
        count: '1条',
        ratio: '1:1 正方形',
        quality: '2K 高清',
        prompt: '中国水墨画风格，山水意境，留白技法，浓淡墨韵，古典园林，诗意画面，禅意空间，笔触灵动，水墨氤氲，古韵新风'
      },
      '胶片质感': {
        model: 'Midjourney 7',
        modelIcon: '🎨',
        role: '人像写真',
        roleIcon: '👤',
        count: '2条',
        ratio: '3:4 竖版',
        quality: '4K 超清',
        prompt: '胶片摄影风格，暖色调，颗粒感，怀旧氛围，复古色调，柔焦效果，自然光运用，情感氛围，胶片噪点，复古风格人像'
      },
      '莫兰迪色': {
        model: 'DALL·E 5',
        modelIcon: '🖌️',
        role: '概念插画',
        roleIcon: '🎨',
        count: '1条',
        ratio: '1:1 正方形',
        quality: '2K 高清',
        prompt: '莫兰迪色调，低饱和度，柔和配色高级感，灰粉色系，静物构图，优雅简约风格，画面安静平和，高级灰调艺术感'
      },
      '复古胶片': {
        model: 'Nano Banana Pro',
        modelIcon: '🍌',
        role: '美食摄影',
        roleIcon: '🍜',
        count: '4条',
        ratio: '16:9 横屏',
        quality: '2K 高清',
        prompt: '复古胶片风格，暖黄色调，旧时光氛围，手工质感，怀旧风格，vintage美学，泛黄照片效果，温馨氛围，胶片边框'
      }
    };
    const preset = presets[presetName];
    if(!preset) return;
    // 应用模型
    const modelBtn = document.getElementById('current-image-model-text');
    if(modelBtn) modelBtn.textContent = preset.model;
    // 更新手机端大模型按钮图标
    if(preset.modelIcon){
      var mModelBtn=document.getElementById('img-m-icon-model');
      if(mModelBtn){
        mModelBtn.innerHTML='<span style="font-size:16px;line-height:1;display:flex;align-items:center;justify-content:center;width:100%;height:100%">'+preset.modelIcon+'</span>';
      }
    }
    // 更新手机端风格预设按钮图标
    var mPresetBtn=document.getElementById('img-m-icon-preset');
    if(mPresetBtn){
      var iconMap={'赛博朋克':'🌃','国风水墨':'🏮','胶片质感':'📷','莫兰迪色':'🎨','复古胶片':'📽️'};
      mPresetBtn.innerHTML='<span style="font-size:16px;line-height:1;display:flex;align-items:center;justify-content:center;width:100%;height:100%">'+(iconMap[presetName]||'📋')+'</span>';
    }
    // 应用角色
    const roleBtn = document.getElementById('current-image-role-text');
    if(roleBtn) roleBtn.textContent = preset.role;
    // 应用参数
    setSelectValue('image-param-count', preset.count);
    setSelectValue('image-param-ratio', preset.ratio);
    setSelectValue('image-param-quality', preset.quality);
    updateImageOutputParamsLabel();
    updateImageGenCost();
    // 应用到输入框
    const input = document.getElementById('image-prompt-input');
    if(input) {
      input.value = preset.prompt;
      input.focus();
    }
    if(typeof closeMediaMobileSheet==='function')closeMediaMobileSheet();
    showToast('✨ 已应用预设：'+presetName);
  };

  // 辅助函数：设置select值
  function setSelectValue(selectId, value) {
    const select = document.getElementById(selectId);
    if(!select||!value) return;
    var v=String(value).toLowerCase();
    for(var i=0; i<select.options.length; i++) {
      var opt=select.options[i];
      var ov=(opt.value||'').toLowerCase();
      var ot=(opt.text||'').toLowerCase();
      if(ot===v||ov===v||ot.indexOf(v)!==-1||v.indexOf(ov)!==-1||v.indexOf(ot)!==-1) {
        select.selectedIndex=i;
        break;
      }
    }
  }

  // ===== 视频页面下拉菜单函数 =====
  window.closeVideoToolbarDropdowns=function(exceptId){
    ['video-model-dropdown','video-role-dropdown','video-output-params-dropdown','video-mode-dropdown'].forEach(function(id){
      if(id===exceptId) return;
      var el=document.getElementById(id);
      if(el) el.classList.add('hidden');
    });
  };

  window.AUDIO_EMOTION_OPTIONS=[
    {emoji:'🤖',label:'自动'},
    {emoji:'😊',label:'快乐'},
    {emoji:'😢',label:'悲伤'},
    {emoji:'😠',label:'严肃'},
    {emoji:'😐',label:'平静'},
    {emoji:'😌',label:'柔和'},
    {emoji:'🥳',label:'兴奋'},
    {emoji:'😴',label:'慵懒'},
    {emoji:'😲',label:'惊讶'},
    {emoji:'🥺',label:'温柔'}
  ];

  window.saveAudioPromptCursor=function(){
    var ta=document.getElementById('audio-prompt-textarea');
    if(!ta) return;
    var len=ta.value.length;
    var focused=document.activeElement===ta;
    var start=focused&&typeof ta.selectionStart==='number'?ta.selectionStart:len;
    var end=focused&&typeof ta.selectionEnd==='number'?ta.selectionEnd:start;
    window._audioPromptCursor={start:start,end:end};
  };

  window.insertAudioPromptAtCursor=function(text){
    var ta=document.getElementById('audio-prompt-textarea');
    if(!ta||text==null||text==='') return;
    var saved=window._audioPromptCursor;
    var val=ta.value;
    var start=typeof saved?.start==='number'?saved.start:(typeof ta.selectionStart==='number'?ta.selectionStart:val.length);
    var end=typeof saved?.end==='number'?saved.end:start;
    if(start<0) start=0;
    if(end<start) end=start;
    if(start>val.length) start=val.length;
    if(end>val.length) end=val.length;
    ta.value=val.slice(0,start)+text+val.slice(end);
    var pos=start+text.length;
    window._audioPromptCursor={start:pos,end:pos};
    ta.focus();
    try{ta.setSelectionRange(pos,pos);}catch(e){}
    ta.dispatchEvent(new Event('input',{bubbles:true}));
  };

  window.renderAudioEmotionPicker=function(){
    var row=document.querySelector('#audio-emotion-picker .audio-emotion-picker-row');
    if(!row||row.dataset.built==='1') return;
    var opts=window.AUDIO_EMOTION_OPTIONS||[];
    row.innerHTML=opts.map(function(o){
      return '<button type="button" class="audio-emotion-emoji-btn" data-emoji="'+o.emoji+'" data-label="'+o.label+'" onmousedown="event.preventDefault();saveAudioPromptCursor()" onclick="setAudioEmotion(\''+o.emoji+'\',\''+o.label+'\')" title="'+o.label+'" role="option">'+o.emoji+'</button>';
    }).join('');
    row.dataset.built='1';
    if(typeof syncAudioEmotionPickerActive==='function') syncAudioEmotionPickerActive();
  };

  window.syncAudioEmotionPickerActive=function(){
    var emo=document.getElementById('audio-param-emotion');
    var cur=emo?emo.value:'';
    document.querySelectorAll('#audio-emotion-picker .audio-emotion-emoji-btn').forEach(function(btn){
      btn.classList.toggle('active',btn.getAttribute('data-emoji')===cur);
    });
  };

  window.updateAudioEmotionButton=function(){
    var emo=document.getElementById('audio-param-emotion');
    var labelEl=document.getElementById('audio-param-emotion-label');
    var btnEmoji=document.getElementById('audio-emotion-btn-emoji');
    var btn=document.getElementById('audio-emotion-btn');
    var val=emo?emo.value:'';
    var lbl=labelEl?labelEl.value:'';
    if(btnEmoji) btnEmoji.textContent=val||'🎭';
    if(btn){
      btn.classList.toggle('has-selection',!!val);
      btn.title=val?(lbl||'情绪')+' '+val:'选择情绪';
    }
  };

  window.setAudioEmotion=function(emoji,label,silent){
    if(!silent&&typeof insertAudioPromptAtCursor==='function') insertAudioPromptAtCursor(emoji);
    var emo=document.getElementById('audio-param-emotion');
    var labelEl=document.getElementById('audio-param-emotion-label');
    if(emo) emo.value=emoji||'';
    if(labelEl) labelEl.value=label||'';
    if(typeof syncAudioEmotionPickerActive==='function') syncAudioEmotionPickerActive();
    if(typeof updateAudioEmotionButton==='function') updateAudioEmotionButton();
    if(typeof syncAudioMobileToolIcons==='function') syncAudioMobileToolIcons();
    if(typeof updateAudioMobileEmotionBarState==='function') updateAudioMobileEmotionBarState();
    if(!silent) showToast('已插入 '+emoji);
  };

  window.clearAudioEmotion=function(updateUi){
    var emo=document.getElementById('audio-param-emotion');
    var labelEl=document.getElementById('audio-param-emotion-label');
    if(emo) emo.value='';
    if(labelEl) labelEl.value='';
    if(updateUi!==false){
      if(typeof syncAudioEmotionPickerActive==='function') syncAudioEmotionPickerActive();
      if(typeof updateAudioEmotionButton==='function') updateAudioEmotionButton();
    }
  };

  window.toggleAudioEmotionPicker=function(e){
    if(e&&e.stopPropagation)e.stopPropagation();
    if(window.isMediaMobileView()){window.openAudioMobileSheet('emotion',e);return;}
    var picker=document.getElementById('audio-emotion-picker');
    if(!picker) return;
    if(typeof renderAudioEmotionPicker==='function') renderAudioEmotionPicker();
    var isHidden=picker.classList.contains('hidden');
    // 切换 hidden 类
    picker.classList.toggle('hidden');
    var nowHidden=picker.classList.contains('hidden');
    closeAudioToolbarDropdowns(nowHidden?null:'audio-emotion-picker');
    closeImageToolbarDropdowns(null);
    closeVideoToolbarDropdowns(null);
    var btn=document.getElementById('audio-emotion-btn');
    if(!nowHidden){
      // 弹窗现在显示
      if(typeof saveAudioPromptCursor==='function') saveAudioPromptCursor();
      if(btn){btn.classList.add('is-active');btn.setAttribute('aria-expanded','true');}
      if(typeof syncAudioEmotionPickerActive==='function') syncAudioEmotionPickerActive();
    }else{
      // 弹窗现在隐藏
      if(btn){btn.classList.remove('is-active');btn.setAttribute('aria-expanded','false');}
    }
  };

  window.closeAudioToolbarDropdowns=function(exceptId){
    ['audio-model-dropdown','audio-output-params-dropdown','audio-emotion-picker'].forEach(function(id){
      if(id===exceptId) return;
      var el=document.getElementById(id);
      if(el) el.classList.add('hidden');
    });
    if(exceptId!=='audio-emotion-picker'){
      var emoBtn=document.getElementById('audio-emotion-btn');
      if(emoBtn){emoBtn.classList.remove('is-active');emoBtn.setAttribute('aria-expanded','false');}
    }
  };

  window.updateAudioOutputParamsLabel=function(){
    var speed=document.getElementById('audio-param-speed');
    var tone=document.getElementById('audio-param-tone');
    var effect=document.getElementById('audio-param-effect');
    var label=document.getElementById('audio-output-params-label');
    if(label){
      label.textContent=(speed?speed.value:'1.0x')+' / '+(tone?tone.value:'标准')+' / '+(effect?effect.value:'无');
    }
    document.querySelectorAll('[data-aparam]').forEach(function(btn){
      var param=btn.getAttribute('data-aparam');
      var val=btn.getAttribute('data-avalue');
      var hidden=document.getElementById('audio-param-'+param);
      btn.classList.toggle('active',!!(hidden&&hidden.value===val));
    });
  };

  window.toggleAudioOutputParamsDropdown=function(e){
    if(e&&e.stopPropagation)e.stopPropagation();
    if(window.isMediaMobileView()){window.openAudioMobileSheet('params',e);return;}
    var dropdown=document.getElementById('audio-output-params-dropdown');
    if(!dropdown) return;
    var willOpen=dropdown.classList.contains('hidden');
    closeAudioToolbarDropdowns(willOpen?'audio-output-params-dropdown':null);
    closeImageToolbarDropdowns(null);
    closeVideoToolbarDropdowns(null);
    if(willOpen){
      dropdown.classList.remove('hidden');
      updateAudioOutputParamsLabel();
    }
  };

  window.setAudioOutputParam=function(type,value){
    var el=document.getElementById('audio-param-'+type);
    if(el) el.value=value;
    updateAudioOutputParamsLabel();
    if(typeof syncAudioMobileToolIcons==='function')syncAudioMobileToolIcons();
  };

  if(typeof renderAudioEmotionPicker==='function') renderAudioEmotionPicker();
  if(typeof updateAudioEmotionButton==='function') updateAudioEmotionButton();
  if(typeof initAudioVoicePicker==='function') initAudioVoicePicker();
  if(typeof updateAudioGenCost==='function') updateAudioGenCost();
  if(typeof syncAudioMobileToolIcons==='function') syncAudioMobileToolIcons();

  window.toggleAudioModelDropdown=function(e){
    if(e&&e.stopPropagation)e.stopPropagation();
    if(window.isMediaMobileView()){window.openAudioMobileSheet('model',e);return;}
    var dropdown=document.getElementById('audio-model-dropdown');
    if(!dropdown) return;
    var willOpen=dropdown.classList.contains('hidden');
    closeAudioToolbarDropdowns(willOpen?'audio-model-dropdown':null);
    closeImageToolbarDropdowns(null);
    closeVideoToolbarDropdowns(null);
    if(willOpen) dropdown.classList.remove('hidden');
  };

  window.selectAudioModel=function(modelName, icon){
    var dropdown=document.getElementById('audio-model-dropdown');
    if(dropdown) dropdown.classList.add('hidden');
    var textEl=document.getElementById('current-audio-model-text');
    if(textEl) textEl.textContent=modelName;
    if(icon){
      var mBtn=document.getElementById('audio-m-icon-model');
      if(mBtn){
        mBtn.innerHTML='<span style="font-size:16px;line-height:1;display:flex;align-items:center;justify-content:center;width:100%;height:100%">'+icon+'</span>';
      }
    }
    if(typeof updateAudioGenCost==='function') updateAudioGenCost();
    if(typeof closeMediaMobileSheet==='function') closeMediaMobileSheet();
    showToast('🎵 已切换音频模型：'+modelName);
  };

  window.updateVideoOutputParamsLabel=function(){
    var quality=document.getElementById('video-param-quality');
    var ratio=document.getElementById('video-param-ratio');
    var durationEl=document.getElementById('video-param-duration');
    var audioEl=document.getElementById('video-param-audio');
    var label=document.getElementById('video-output-params-label');
    if(!label) return;
    var r=ratio?ratio.value:'1:1';
    var q=quality?quality.value:'480p';
    var sec=durationEl?durationEl.value:'4';
    var audioLabel=(audioEl&&audioEl.value==='开启')?'有配音':'无配音';
    label.textContent=r+' / '+q+' / '+sec+'秒 / '+audioLabel;

    document.querySelectorAll('.video-ratio-opt').forEach(function(btn){
      var active=ratio&&btn.getAttribute('data-vvalue')===ratio.value;
      btn.classList.toggle('active',!!active);
    });
    document.querySelectorAll('.video-quality-opt').forEach(function(btn){
      var active=quality&&btn.getAttribute('data-vvalue')===quality.value;
      btn.classList.toggle('active',!!active);
    });
    document.querySelectorAll('.video-toggle-opt').forEach(function(btn){
      var toggle=btn.getAttribute('data-vtoggle');
      var hidden=document.getElementById('video-param-'+toggle);
      var active=hidden&&btn.getAttribute('data-vvalue')===hidden.value;
      btn.classList.toggle('active',!!active);
    });
    var slider=document.getElementById('video-duration-slider');
    var display=document.getElementById('video-duration-display');
    if(slider&&durationEl) slider.value=durationEl.value;
    if(display&&durationEl) display.textContent=durationEl.value+'秒';
    updateVideoGenCost();
  };

  window.calcVideoGenerationCost=function(modelName,quality,durationSec,count,realPerson,audio){
    const modelPrices={'Auto':0.00012,'Sora2':0.00015,'Kling 2.0':0.00012,'Runway Gen-4':0.00014,'Pika 3.0':0.00008,'VIDU-音乐MV':0.0001};
    const qualityMultiplier={'480p':0.5,'720p':0.75,'native1080p':1,'1080p':1,'2k':1.5,'4k':2.5};
    const price=modelPrices[modelName]||0.00012;
    const duration=parseInt(durationSec,10)||4;
    const n=parseInt(count,10)||1;
    const qMult=qualityMultiplier[quality]||1;
    const rpMult=(realPerson==='开启')?1.2:1;
    const audioMult=(audio==='开启')?1.15:1;
    return price*duration*n*qMult*rpMult*audioMult;
  };

  window.updateVideoGenCost=function(){
    const costEl=document.getElementById('video-gen-cost');
    const modelTextEl=document.getElementById('current-video-model-text');
    const qualityEl=document.getElementById('video-param-quality');
    const durationEl=document.getElementById('video-param-duration');
    const countEl=document.getElementById('video-param-count');
    const realPersonEl=document.getElementById('video-param-realperson');
    const audioEl=document.getElementById('video-param-audio');
    if(!costEl) return;
    const modelName=modelTextEl?modelTextEl.textContent:'Auto';
    const duration=parseInt(durationEl?durationEl.value:4,10)||4;
    const count=parseInt(countEl?countEl.value:1,10)||1;
    const resKey=qualityEl?qualityEl.value:'480p';
    const rp=realPersonEl?realPersonEl.value:'关闭';
    const aud=audioEl?audioEl.value:'关闭';
    const total=calcVideoGenerationCost(modelName,resKey,duration,count,rp,aud).toFixed(4);
    costEl.innerHTML='💰 预估: <span class="text-yellow-500 leading-none" aria-hidden="true">⚡</span>'+total;
  };

  window.toggleVideoOutputParamsDropdown=function(e){
    if(e) e.stopPropagation();
    if(window.isMediaMobileView()){window.openVideoMobileSheet('params',e);return;}
    var dropdown=document.getElementById('video-output-params-dropdown');
    if(!dropdown) return;
    var willOpen=dropdown.classList.contains('hidden');
    closeVideoToolbarDropdowns(willOpen?'video-output-params-dropdown':null);
    if(willOpen){
      dropdown.classList.remove('hidden');
      updateVideoOutputParamsLabel();
    }else{
      dropdown.classList.add('hidden');
    }
  };

  if(!window._toolbarDropdownClickBound){
    window._toolbarDropdownClickBound=true;
    function handleToolbarOutsidePointer(e){
      if(window.matchMedia('(max-width:768px)').matches){
        var emoSheet=document.getElementById('media-mobile-sheet');
        var emoTitle=document.getElementById('media-sheet-title');
        if(emoSheet&&!emoSheet.classList.contains('hidden')&&emoTitle&&emoTitle.textContent==='情绪'){
          if(!e.target.closest('#media-mobile-sheet .media-mobile-sheet-panel')&&!e.target.closest('#audio-m-icon-emotion')){
            // if(typeof closeMediaMobileSheet==='function')closeMediaMobileSheet(); // 取消情绪弹窗外部关闭
          }
        }
        return;
      }
      if(e.target.closest('#image-model-dropdown,#image-role-dropdown,#image-output-params-dropdown,#video-model-dropdown,#video-role-dropdown,#video-output-params-dropdown,#video-mode-dropdown,#audio-model-dropdown,#audio-output-params-dropdown,#audio-emotion-picker'))return;
      if(e.target.closest('#image-model-dropdown-container,#image-role-dropdown-container,#image-output-params-wrap,#video-model-dropdown-container,#video-role-dropdown-container,#video-output-params-wrap,#video-mode-dropdown-container,#audio-model-dropdown-container,#audio-output-params-wrap,#audio-emotion-wrap'))return;
      closeImageToolbarDropdowns(null);
      closeVideoToolbarDropdowns(null);
      if(typeof closeAudioToolbarDropdowns==='function')closeAudioToolbarDropdowns('audio-emotion-picker');
    }
    document.addEventListener('click',handleToolbarOutsidePointer);
    document.addEventListener('mousedown',handleToolbarOutsidePointer,true);
  }
  if(!window._audioEmotionCanvasCloseBound){
    window._audioEmotionCanvasCloseBound=true;
    var audioCanvas=document.getElementById('audio-canvas-area');
    if(audioCanvas){
      audioCanvas.addEventListener('mousedown',function(){
        if(!document.getElementById('page-audio')?.classList.contains('active'))return;
        if(window.isMediaMobileView()){
          var sheet=document.getElementById('media-mobile-sheet');
          var title=document.getElementById('media-sheet-title');
          if(sheet&&!sheet.classList.contains('hidden')&&title&&title.textContent==='情绪'&&typeof closeMediaMobileSheet==='function'){/* 取消情绪弹窗外部关闭 */}
          return;
        }
        if(typeof closeAudioToolbarDropdowns==='function')closeAudioToolbarDropdowns('audio-emotion-picker');
      });
    }
  }

  window.setVideoOutputParam=function(type,value){
    var sel=document.getElementById('video-param-'+type);
    if(sel) sel.value=value;
    updateVideoOutputParamsLabel();
  };

  window.setVideoDuration=function(seconds){
    var durationEl=document.getElementById('video-param-duration');
    if(durationEl) durationEl.value=String(seconds);
    updateVideoOutputParamsLabel();
  };

  window.setVideoToggleParam=function(type,value){
    var hidden=document.getElementById('video-param-'+type);
    if(hidden) hidden.value=value;
    updateVideoOutputParamsLabel();
  };

  window.toggleVideoModelDropdown=function(e){
    if(e) e.stopPropagation();
    if(window.isMediaMobileView()){window.openVideoMobileSheet('model',e);return;}
    const dropdown=document.getElementById('video-model-dropdown');
    if(!dropdown) return;
    var willOpen=dropdown.classList.contains('hidden');
    closeVideoToolbarDropdowns(willOpen?'video-model-dropdown':null);
    if(willOpen) dropdown.classList.remove('hidden');
    else dropdown.classList.add('hidden');
  };

  window.selectVideoModel=function(modelName, icon){
    const dropdown=document.getElementById('video-model-dropdown');
    if(dropdown) dropdown.classList.add('hidden');
    const textEl=document.getElementById('current-video-model-text');
    if(textEl) textEl.textContent=modelName;
    if(icon){
      var mBtn=document.getElementById('vid-m-icon-model');
      if(mBtn){
        mBtn.innerHTML='<span style="font-size:16px;line-height:1;display:flex;align-items:center;justify-content:center;width:100%;height:100%">'+icon+'</span>';
      }
    }
    updateVideoGenCost();
    if(typeof closeMediaMobileSheet==='function')closeMediaMobileSheet();
    showToast('🎬 已切换视频模型：'+modelName);
  };

  const videoPromptOptimizeStyles={
    '短视频编导':{
      icon:'📱',
      cost:'0.022',
      desc:'强化前3秒抓眼球、快节奏剪辑与竖屏传播节奏，适合抖音/快手类短视频脚本。',
      empty:'创作一个有趣的短视频，包含吸引人的开场、精彩的内容和令人印象深刻的结尾。场景：室内/户外，风格：轻松活泼，节奏：快节奏剪辑。',
      enhance:'，短视频风格，前3秒抓眼球，快节奏剪辑，竖屏适配，信息密度高，适合抖音/快手传播'
    },
    '广告导演':{
      icon:'📺',
      cost:'0.025',
      desc:'突出产品卖点、电影级画质与15–30秒品牌叙事，适合商业广告与产品宣传片。',
      empty:'制作一支专业的广告片，产品突出，视觉冲击力强。目标受众：年轻群体，时长：15-30秒，画面风格：高端质感。',
      enhance:'，品牌广告风格，产品卖点突出，电影级画质，精致构图，情感叙事，15-30秒时长'
    },
    '微电影导演':{
      icon:'🎥',
      cost:'0.028',
      desc:'完善起承转合叙事、镜头语言与光影氛围，适合剧情向短片与情感表达。',
      empty:'拍摄一段微电影片段，包含完整的叙事结构：开场、发展、高潮、结尾。主题：情感/悬疑/励志，画面风格：电影质感。',
      enhance:'，微电影叙事，情节完整，人物刻画细腻，镜头语言丰富，光影层次感强，配乐烘托氛围'
    },
    'MV导演':{
      icon:'🎤',
      cost:'0.026',
      desc:'强调音画同步、节拍卡点与创意转场，适合音乐 MV 与节奏感强的视觉作品。',
      empty:'制作一支音乐MV，音画同步，视觉节奏与音乐节拍完美配合。歌曲风格：流行/摇滚/电子，拍摄手法：多场景切换+特效。',
      enhance:'，音乐MV风格，节奏与音乐同步，创意转场，色彩风格统一，艺术化表达，视觉冲击力'
    },
    '纪录片编导':{
      icon:'📽️',
      cost:'0.02',
      desc:'侧重真实纪录感、自然光线与旁白叙事，适合人文纪实与自然题材。',
      empty:'记录真实场景，展现人物故事或自然风光。叙事方式：平实纪录+解说，画面风格：真实自然，节奏：舒缓沉稳。',
      enhance:'，纪实风格，自然光线，跟拍镜头，真实感强，旁白解说，人文关怀视角'
    }
  };

  window.optimizeVideoPromptByStyle=function(styleName,rawPrompt){
    const style=videoPromptOptimizeStyles[styleName];
    if(!style) return rawPrompt||'';
    const trimmed=(rawPrompt||'').trim();
    if(!trimmed) return style.empty;
    const tag=style.enhance.slice(1,12);
    if(trimmed.indexOf(tag)!==-1) return trimmed;
    return trimmed+style.enhance;
  };

  window._vpomSelectedStyle=null;

  window.renderVideoPromptOptimizeSchemes=function(){
    var list=document.getElementById('vpom-scheme-list');
    if(!list) return;
    var html='';
    Object.keys(videoPromptOptimizeStyles).forEach(function(name){
      var s=videoPromptOptimizeStyles[name];
      html+='<div class="ipom-scheme-item" data-style="'+name+'" onclick="selectVideoPromptOptimizeScheme(\''+name+'\')">'+
        '<div class="ipom-scheme-head">'+
        '<div class="ipom-scheme-name"><span>'+(s.icon||'✨')+'</span><span>'+name+'</span></div>'+
        '<div class="ipom-scheme-actions" onclick="event.stopPropagation()">'+
        '<div class="ipom-cost">本次优化<br><span class="ipom-cost-val">⚡'+(s.cost||'0.02')+'</span></div>'+
        '<button type="button" class="ipom-execute-btn" onclick="runVideoPromptOptimizeExecute()">执行优化</button>'+
        '</div></div>'+
        '<div class="ipom-scheme-desc">'+(s.desc||'')+'</div></div>';
    });
    list.innerHTML=html;
  };

  window.selectVideoPromptOptimizeScheme=function(styleName){
    window._vpomSelectedStyle=styleName;
    var list=document.getElementById('vpom-scheme-list');
    if(list){
      list.querySelectorAll('.ipom-scheme-item').forEach(function(el){
        el.classList.toggle('active',el.getAttribute('data-style')===styleName);
      });
    }
    var activeBtn=list?list.querySelector('.ipom-scheme-item.active .ipom-execute-btn'):null;
    if(activeBtn) activeBtn.disabled=false;
  };

  window.openVideoPromptOptimizeModal=function(e,preselectStyle){
    if(e){e.stopPropagation();e.preventDefault();}
    if(typeof closeMediaMobileSheet==='function') closeMediaMobileSheet();
    var dd=document.getElementById('video-role-dropdown');
    if(dd) dd.classList.add('hidden');
    if(typeof closeVideoToolbarDropdowns==='function') closeVideoToolbarDropdowns(null);
    var src=document.getElementById('video-prompt-textarea');
    var modalInput=document.getElementById('vpom-prompt-input');
    if(modalInput) modalInput.value=src?src.value:'';
    window._vpomSelectedStyle=null;
    if(typeof renderVideoPromptOptimizeSchemes==='function') renderVideoPromptOptimizeSchemes();
    if(preselectStyle&&videoPromptOptimizeStyles[preselectStyle]){
      selectVideoPromptOptimizeScheme(preselectStyle);
    }else{
      var list=document.getElementById('vpom-scheme-list');
      if(list) list.querySelectorAll('.ipom-scheme-item').forEach(function(el){el.classList.remove('active');});
    }
    if(typeof openModal==='function') openModal('video-prompt-optimize-modal');
  };

  window.closeVideoPromptOptimizeModal=function(){
    if(typeof closeModal==='function') closeModal('video-prompt-optimize-modal');
  };

  window.runVideoPromptOptimizeExecute=function(){
    var styleName=window._vpomSelectedStyle;
    if(!styleName){
      if(typeof showToast==='function') showToast('请先选择一个优化方案');
      return;
    }
    var modalInput=document.getElementById('vpom-prompt-input');
    var before=modalInput?modalInput.value:'';
    var list=document.getElementById('vpom-scheme-list');
    var execBtn=list?list.querySelector('.ipom-scheme-item.active .ipom-execute-btn'):null;
    if(execBtn) execBtn.disabled=true;
    window.showPromptOptimizeProgress({
      page:'video',
      styleName:styleName,
      onComplete:function(){
        var optimized=typeof optimizeVideoPromptByStyle==='function'?optimizeVideoPromptByStyle(styleName,before):before;
        if(modalInput) modalInput.value=optimized;
        var textEl=document.getElementById('current-video-role-text');
        if(textEl) textEl.textContent=styleName;
        if(execBtn) execBtn.disabled=false;
        if(typeof showToast==='function'){
          if(!before.trim()) showToast('✨ 已按「'+styleName+'」生成优化提示词');
          else showToast('✨ 已按「'+styleName+'」优化提示词');
        }
      }
    });
  };

  window.confirmVideoPromptOptimize=function(){
    var modalInput=document.getElementById('vpom-prompt-input');
    var src=document.getElementById('video-prompt-textarea');
    if(modalInput&&src){
      src.value=modalInput.value;
      src.focus();
    }
    closeVideoPromptOptimizeModal();
    if(typeof showToast==='function') showToast('✅ 已应用优化后的提示词');
  };

  window.toggleVideoRoleDropdown=function(e){
    if(e) e.stopPropagation();
    if(typeof openVideoPromptOptimizeModal==='function') openVideoPromptOptimizeModal(e);
  };

  window.selectVideoRole=function(styleName, icon){
    if(typeof openVideoPromptOptimizeModal==='function') openVideoPromptOptimizeModal(null,styleName);
  };

  // 视频参考素材预览
  window.addVideoRef=function(file,type){
    if(videoRefFiles.length >= 7) {
      showToast('⚠️ 最多7个参考素材');
      return;
    }
    if(!type) type = 'image';
    const reader = new FileReader();
    reader.onload = function(e) {
      videoRefFiles.push({name: file.name, dataUrl: e.target.result, type: type});
      renderVideoRefThumbnails();
    };
    reader.readAsDataURL(file);
  };

  window.renderVideoRefThumbnails=function(){
    var typeIcons = {image:'🖼️', video:'🎬', audio:'🎵'};
    var types = ['image', 'video', 'audio'];
    for(var t = 0; t < types.length; t++) {
      var type = types[t];
      var container = document.getElementById('video-ref-thumbnails-' + type);
      if(!container) continue;
      var filesOfType = videoRefFiles.filter(function(f){ return f.type === type; });
      if(filesOfType.length === 0) {
        container.innerHTML = '';
        continue;
      }
      container.innerHTML=filesOfType.map(function(f){
        var globalIdx = videoRefFiles.indexOf(f);
        var icon = typeIcons[f.type] || '📎';
        var isVideo = f.type === 'video';
        var isAudio = f.type === 'audio';
        if(isVideo || isAudio) {
          return '<div class="relative w-11 h-11 shrink-0 rounded-xl cursor-pointer group" title="'+f.name+'" onclick="showVideoPreview('+globalIdx+')" style="background-image:url('+f.dataUrl+');background-size:cover;background-position:center;"><div class="absolute inset-0 bg-[#374151] rounded-xl flex items-center justify-center text-sm hover:bg-[#4B5563] transition">'+icon+'</div><button onclick="event.stopPropagation();removeVideoRef('+globalIdx+')" class="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded-full text-[8px] flex items-center justify-center shadow z-10">×</button></div>';
        } else {
          return '<div class="relative w-11 h-11 shrink-0 rounded-xl cursor-pointer group" title="'+f.name+'" onclick="showVideoPreview('+globalIdx+')"><img src="'+f.dataUrl+'" class="w-full h-full object-cover rounded-lg"><button onclick="event.stopPropagation();removeVideoRef('+globalIdx+')" class="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded-full text-[8px] flex items-center justify-center shadow z-10">×</button></div>';
        }
      }).join('');
    }
  };

  // 放大预览
  window.showVideoPreview=function(index){
    var f = videoRefFiles[index];
    if(!f) return;
    var modal=document.getElementById('video-preview-modal');
    var content=document.getElementById('video-preview-content');
    var nameEl=document.getElementById('video-preview-name');
    if(!modal||!content) return;
    nameEl.textContent = f.name;
    if(f.type==='image') {
      content.innerHTML='<img src="'+EXAMPLE_PREVIEW_IMAGE+'" class="max-w-[80vw] max-h-[75vh] object-contain rounded-lg shadow-2xl">';
    } else if(f.type==='video') {
      content.innerHTML='<video src="'+EXAMPLE_PREVIEW_VIDEO+'" poster="'+EXAMPLE_PREVIEW_IMAGE+'" controls autoplay loop class="max-w-[80vw] max-h-[75vh] rounded-lg shadow-2xl"></video>';
    } else if(f.type==='audio') {
      var icons={image:'🖼️',video:'🎬',audio:'🎵'};
      content.innerHTML='<div class="flex flex-col items-center gap-6 p-10"><div class="text-7xl">'+(icons[f.type]||'📎')+'</div><audio src="'+f.dataUrl+'" controls class="w-72"></audio></div>';
    }
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  };
  window.closeVideoPreview=function(){
    var modal=document.getElementById('video-preview-modal');
    if(modal){
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      // 停止视频/音频播放
      var v=modal.querySelector('video'); if(v)v.pause();
      var a=modal.querySelector('audio'); if(a)a.pause();
    }
  };

  window.removeVideoRef=function(index){
    if(videoRefFiles[index]) {
      videoRefFiles.splice(index,1);
      renderVideoRefThumbnails();
    }
  };

  var videoRefFiles=[];
  var currentVideoEditParams = null;

  window.addVideoRefFromAsset=function(name,dataUrl,mediaType){
    if(videoRefFiles.length>=7){
      showToast('⚠️ 最多7个参考素材');
      return false;
    }
    var type=mediaType||'image';
    var url=dataUrl||(typeof videoRefPlaceholderDataUrl==='function'?videoRefPlaceholderDataUrl(type,name):'');
    videoRefFiles.push({name:name||'资产素材',dataUrl:url,type:type});
    renderVideoRefThumbnails();
    return true;
  };

  window.handleVideoFileSelect=function(input,type){
    if(!type) type = 'image';
    var typeLabels = {image:'图片', video:'视频', audio:'音频'};
    var label = typeLabels[type] || '文件';
    if(input.files) {
      for(var i=0;i<input.files.length;i++){
        addVideoRef(input.files[i], type);
      }
      input.value='';
      showToast('✅ 已添加 '+input.files.length+' 个'+label+'素材');
    }
  };

  // ============ 视频生成流程 ============
  var videoGenerationTimer = null;
  var videoGenerationProgress = 0;
  var videoGenerationStartAt = 0;
  var videoGenStatusMessages = [
    '正在准备任务...',
    '正在分析提示词...',
    '正在加载模型...',
    '正在生成视频...',
    '正在渲染画面...',
    '即将完成...'
  ];

  function getVideoDurationLabel() {
    var durationEl = document.getElementById('video-param-duration');
    if (durationEl && durationEl.value) return durationEl.value + '秒';
    return '4秒';
  }


  function setVideoGenButtonState(generating) {
    var genBtn = document.getElementById('video-gen-btn-desktop') || document.getElementById('video-gen-btn-mobile');
    if (!genBtn) return;
    if (generating) {
      genBtn.disabled = true;
      genBtn.textContent = '⏳ 生成中...';
    } else {
      genBtn.disabled = false;
      genBtn.innerHTML = '✨ 生成';
    }
  }

  window.startVideoGeneration = function() {
    currentVideoEditParams = null;
    var prompt = document.getElementById('video-prompt-textarea');
    var promptText = prompt ? prompt.value.trim() : '';
    if (!promptText && videoRefFiles.length === 0) {
      showToast('⚠️ 请输入提示词或上传参考素材');
      return;
    }

    var emptyState = document.getElementById('video-empty-state');
    if (emptyState) emptyState.classList.add('hidden');

    var modelText = document.getElementById('current-video-model-text');
    var modeSel = document.getElementById('video-param-mode');
    var ratioSel = document.getElementById('video-param-ratio');
    var qualitySel = document.getElementById('video-param-quality');
    var mode = modeSel ? modeSel.value : '多模式参考';
    var modelStr = (modelText ? modelText.textContent.trim() : 'Auto') + '-' + mode;
    var ratio = ratioSel ? ratioSel.value : '16:9';
    var quality = qualitySel ? qualitySel.value : '480p';
    var duration = getVideoDurationLabel();

    var genModel = document.getElementById('video-gen-model');
    if (genModel) genModel.textContent = modelStr;
    var genRatio = document.getElementById('video-gen-ratio');
    if (genRatio) genRatio.textContent = ratio;
    var genDuration = document.getElementById('video-gen-duration');
    if (genDuration) genDuration.textContent = duration;
    var genQuality = document.getElementById('video-gen-quality');
    if (genQuality) genQuality.textContent = quality;

    setResultPromptText(document.getElementById('video-gen-prompt'), promptText || '（无提示词）');

    var genThumbs = document.getElementById('video-gen-ref-thumbs');
    if (genThumbs) {
      var imageRefs = videoRefFiles.filter(function(f) { return f.type === 'image'; });
      var refsToShow = imageRefs.length > 0 ? imageRefs.slice(0, 2) : videoRefFiles.slice(0, 2);
      if (refsToShow.length > 0) {
        genThumbs.innerHTML = refsToShow.map(function(f, idx) {
          if (f.type === 'image') {
            return '<div class="relative w-10 h-10 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-600 shrink-0"><img src="' + f.dataUrl + '" class="w-full h-full object-cover" title="参考' + (idx + 1) + '"></div>';
          }
          var icons = {video: '🎬', audio: '🎵'};
          return '<div class="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm shrink-0 border border-gray-200 dark:border-gray-600">' + (icons[f.type] || '📎') + '</div>';
        }).join('');
      } else {
        genThumbs.innerHTML = '';
      }
    }

    var resultsContainer = document.getElementById('video-results-container');
    var generatingState = document.getElementById('video-generating-state');
    if (resultsContainer) resultsContainer.classList.remove('hidden');
    if (resultsContainer && generatingState) {
      resultsContainer.appendChild(generatingState);
      generatingState.classList.remove('hidden');
      syncVideoResultsBottomPadding();
      requestAnimationFrame(function() {
        syncVideoResultsBottomPadding();
        refreshResultPromptClamp(generatingState);
        generatingState.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    }
    if (typeof placeVideoHotAppsStrip === 'function') placeVideoHotAppsStrip();

    var inputArea = document.getElementById('video-input-area');
    if (inputArea) inputArea.classList.add('pointer-events-none', 'opacity-50');

    setVideoGenButtonState(true);

    videoGenerationStartAt = Date.now();
    videoGenerationProgress = 0;
    updateVideoGenerationProgress();
    videoGenerationTimer = setInterval(function() {
      videoGenerationProgress += Math.random() * 10 + 3;
      if (videoGenerationProgress >= 100) {
        videoGenerationProgress = 100;
        clearInterval(videoGenerationTimer);
        videoGenerationTimer = null;
        setTimeout(function() { finishVideoGeneration(); }, 400);
      }
      updateVideoGenerationProgress();
    }, 500);
  };

  function updateVideoGenerationProgress() {
    var bar = document.getElementById('video-gen-progress-bar');
    var text = document.getElementById('video-gen-status-text');
    var detail = document.getElementById('video-gen-status-detail');
    var pct = Math.floor(videoGenerationProgress);
    if (bar) bar.style.width = pct + '%';
    if (text) text.textContent = pct + '%';
    if (detail) {
      var msgIdx = Math.min(Math.floor(pct / 20), videoGenStatusMessages.length - 1);
      detail.textContent = videoGenStatusMessages[msgIdx];
    }
  }

  window.stopVideoGeneration = function() {
    if (videoGenerationTimer) {
      clearInterval(videoGenerationTimer);
      videoGenerationTimer = null;
    }
    var generatingState = document.getElementById('video-generating-state');
    if (generatingState) generatingState.classList.add('hidden');
    var resultsContainer = document.getElementById('video-results-container');
    var hasResultCards = resultsContainer && resultsContainer.querySelector('[id^="video-result-card-"]');
    if (!hasResultCards && resultsContainer) resultsContainer.classList.add('hidden');
    if (typeof syncVideoResultsEmptyState === 'function') syncVideoResultsEmptyState();
    if (typeof placeVideoHotAppsStrip === 'function') placeVideoHotAppsStrip();
    var inputArea = document.getElementById('video-input-area');
    if (inputArea) inputArea.classList.remove('pointer-events-none', 'opacity-50');
    setVideoGenButtonState(false);
    showToast('⏹ 已停止生成');
  };

  function buildResultVideoOverlayHtml() {
    return '<div class="result-video-toolbar">' +
      '<button type="button" class="result-video-tool-btn" onclick="event.stopPropagation();downloadResultVideo(this)" title="下载"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>' +
      '<button type="button" class="result-video-tool-btn" onclick="event.stopPropagation();publishResultVideo(this)" title="发布"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>' +
      '<button type="button" class="result-video-tool-btn" onclick="event.stopPropagation();deleteVideoResultCard(this)" title="删除"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>' +
      '</div>';
  }

  function finishVideoGeneration() {
    var generatingState = document.getElementById('video-generating-state');
    if (generatingState) generatingState.classList.add('hidden');

    var emptyState = document.getElementById('video-empty-state');
    if (emptyState) emptyState.classList.add('hidden');

    var prompt = document.getElementById('video-prompt-textarea');
    var promptText = prompt ? prompt.value.trim() : '';
    var modelText = document.getElementById('current-video-model-text');
    var modeSel = document.getElementById('video-param-mode');
    var ratioSel = document.getElementById('video-param-ratio');
    var qualitySel = document.getElementById('video-param-quality');
    var countSel = document.getElementById('video-param-count');
    var mode = modeSel ? modeSel.value : '多模式参考';
    var modelStr = (modelText ? modelText.textContent.trim() : 'Auto') + '-' + mode;
    var ratio = ratioSel ? ratioSel.value : '16:9';
    var quality = qualitySel ? qualitySel.value : '480p';
    var duration = getVideoDurationLabel();
    var count = countSel ? (parseInt(countSel.value) || 1) : 1;
    var realPersonEl = document.getElementById('video-param-realperson');
    var audioEl = document.getElementById('video-param-audio');
    var durationSecEl = document.getElementById('video-param-duration');
    var durationSec = durationSecEl ? durationSecEl.value : '4';
    var realPersonVal = realPersonEl ? realPersonEl.value : '关闭';
    var audioVal = audioEl ? audioEl.value : '关闭';
    var modelNameOnly = modelText ? modelText.textContent.trim() : 'Auto';
    var finishedAt = Date.now();
    var genDurationMs = videoGenerationStartAt ? finishedAt - videoGenerationStartAt : 0;
    var genCost = calcVideoGenerationCost(modelNameOnly, quality, durationSec, count, realPersonVal, audioVal);
    var genMetaHtml = buildResultGenMetaHtml(finishedAt, genCost, videoGenerationStartAt, { showLabels: false });

    var cardId = 'video-result-card-' + Date.now();
    cardVideoRefImages[cardId] = videoRefFiles.map(function(f) {
      return { name: f.name, dataUrl: f.dataUrl, type: f.type || 'image' };
    });

    var genTaskId = String(finishedAt) + String(100000 + Math.floor(Math.random() * 900000));
    var cardParams = JSON.stringify({
      model: modelStr,
      mode: mode,
      ratio: ratio,
      duration: duration,
      durationSec: durationSec,
      quality: quality,
      count: count,
      realPerson: realPersonVal,
      audio: audioVal,
      genDurationMs: genDurationMs,
      genCost: genCost,
      genFinishedAt: finishedAt,
      genTaskId: genTaskId,
      prompt: promptText,
      hasRef: videoRefFiles.length > 0
    }).replace(/"/g, '&quot;');

    var refThumbsHtml = cardVideoRefImages[cardId].length > 0
      ? cardVideoRefImages[cardId].map(function(f, idx) {
        if (f.type === 'image') {
          return '<div class="relative w-10 h-10 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-600 shrink-0"><img src="' + f.dataUrl + '" class="w-full h-full object-cover" title="参考' + (idx + 1) + '"></div>';
        }
        var icons = { video: '🎬', audio: '🎵' };
        return '<div class="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm shrink-0 border border-gray-200 dark:border-gray-600">' + (icons[f.type] || '📎') + '</div>';
      }).join('')
      : '';

    var videosHtml = '';
    var gridClass = count <= 1 ? 'grid-cols-1 max-w-3xl mx-auto' : 'grid-cols-2';
    for (var i = 0; i < count && i < 4; i++) {
      var posterUrl = EXAMPLE_PREVIEW_IMAGE;
      videosHtml += '<div class="result-video-wrap group rounded-xl overflow-hidden shadow-lg flex-1 min-w-0 relative">' +
        '<div class="result-video-slot w-full max-w-3xl mx-auto aspect-video bg-black flex items-center justify-center relative overflow-hidden cursor-pointer" onclick="previewResultVideo(this)" data-video-index="' + i + '" data-video-poster="' + posterUrl + '" data-video-src="' + EXAMPLE_PREVIEW_VIDEO + '" title="预览视频">' +
        '<img src="' + posterUrl + '" class="result-video-main w-full h-full object-cover" alt="生成结果 ' + (i + 1) + '">' +
        '<div class="absolute inset-0 flex items-center justify-center pointer-events-none"><div class="w-14 h-14 rounded-full bg-black/55 flex items-center justify-center text-white text-2xl pl-1 shadow-lg">▶</div></div>' +
        buildResultVideoOverlayHtml() +
        '</div></div>';
    }

    var cardActionsHtml =
      '<div class="result-card-actions flex items-center gap-2 shrink-0 ml-3 pl-3 border-l border-gray-200 dark:border-gray-600">' +
      '<button type="button" onclick="regenerateVideo(\'' + cardId + '\')" class="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition" title="再次生成">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg></button>' +
      '<button type="button" onclick="reEditVideo(\'' + cardId + '\')" class="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition" title="重新编辑">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>' +
      '</div>';

    var cardHtml = '<div id="' + cardId + '" class="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-2xl shadow-lg p-4">' +
      '<div class="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3 text-[11px]">' +
      '<span class="text-gray-500 dark:text-gray-400 shrink-0">' + modelStr + '</span>' +
      '<span class="text-gray-300 dark:text-gray-600">|</span>' +
      '<span class="text-gray-500 dark:text-gray-400 shrink-0">' + ratio + '</span>' +
      '<span class="text-gray-300 dark:text-gray-600">|</span>' +
      '<span class="text-gray-500 dark:text-gray-400 shrink-0">' + duration + '</span>' +
      '<span class="text-gray-300 dark:text-gray-600">|</span>' +
      '<span class="text-gray-500 dark:text-gray-400 shrink-0">' + quality + '</span>' +
      genMetaHtml +
      cardActionsHtml +
      '</div>' +
      '<p class="result-prompt-text text-gray-700 dark:text-gray-300 mb-3 text-[12px] w-full"><span class="result-prompt-body">' + escapeHtml(promptText || '（无提示词）') + '</span><span class="result-prompt-toggle-hint hidden"></span></p>' +
      (refThumbsHtml ? '<div class="result-ref-thumbs flex items-center gap-2 flex-wrap mb-4">' + refThumbsHtml + '</div>' : '') +
      '<div class="grid ' + gridClass + ' gap-3">' + videosHtml + '</div>' +
      '<div class="hidden card-params" data-params="' + cardParams + '"></div>' +
      '</div>';

    var container = document.getElementById('video-results-container');
    var genPanel = document.getElementById('video-generating-state');
    if (container) {
      container.classList.remove('hidden');
      if (genPanel) {
        genPanel.insertAdjacentHTML('beforebegin', cardHtml);
        var newCard = genPanel.previousElementSibling;
        if (newCard) {
          requestAnimationFrame(function() {
            syncVideoResultsBottomPadding();
            refreshResultPromptClamp(newCard);
            newCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          });
        }
      } else {
        container.insertAdjacentHTML('beforeend', cardHtml);
        syncVideoResultsBottomPadding();
        var lastCard = container.lastElementChild;
        if (lastCard) {
          requestAnimationFrame(function() {
            syncVideoResultsBottomPadding();
            refreshResultPromptClamp(lastCard);
            lastCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          });
        }
      }
    }

    var inputArea = document.getElementById('video-input-area');
    if (inputArea) inputArea.classList.remove('pointer-events-none', 'opacity-50');
    setVideoGenButtonState(false);
    showToast('✅ 视频生成完成');
    if (typeof placeVideoHotAppsStrip === 'function') placeVideoHotAppsStrip();
  };

  window.regenerateVideo = function(cardId) {
    if (cardId) {
      var card = document.getElementById(cardId);
      if (card) {
        var paramsEl = card.querySelector('.card-params');
        if (paramsEl) {
          try {
            currentVideoEditParams = JSON.parse(paramsEl.getAttribute('data-params').replace(/&quot;/g, '"'));
          } catch (e) {}
        }
      }
    }
    startVideoGeneration();
  };

  window.reEditVideo = function(cardId) {
    if (!cardId) return;
    var card = document.getElementById(cardId);
    if (!card) {
      showToast('❌ 找不到结果卡片');
      return;
    }
    var paramsEl = card.querySelector('.card-params');
    if (!paramsEl) {
      showToast('❌ 找不到参数数据');
      return;
    }
    var params;
    try {
      var raw = paramsEl.getAttribute('data-params');
      if (!raw) {
        showToast('❌ 参数数据为空');
        return;
      }
      params = JSON.parse(raw.replace(/&quot;/g, '"'));
    } catch (e) {
      showToast('❌ 参数解析失败');
      return;
    }
    currentVideoEditParams = params;

    // 保持视频展示区：不隐藏、不清空已生成的结果卡片
    var emptyState = document.getElementById('video-empty-state');
    var resultsContainer = document.getElementById('video-results-container');
    var generatingState = document.getElementById('video-generating-state');
    if (emptyState) emptyState.classList.add('hidden');
    if (resultsContainer && resultsContainer.children.length) {
      resultsContainer.classList.remove('hidden');
    }
    if (generatingState) generatingState.classList.add('hidden');

    var modelText = document.getElementById('current-video-model-text');
    var modeSel = document.getElementById('video-param-mode');
    if (modelText && params.model) {
      if (params.mode && params.model.endsWith('-' + params.mode)) {
        modelText.textContent = params.model.slice(0, -(params.mode.length + 1));
      } else {
        modelText.textContent = params.model;
      }
    }
    if (modeSel && params.mode) modeSel.value = params.mode;

    if (params.ratio) {
      var ratioSel = document.getElementById('video-param-ratio');
      if (ratioSel) ratioSel.value = params.ratio;
    }
    if (params.quality) {
      var qualitySel = document.getElementById('video-param-quality');
      if (qualitySel) qualitySel.value = params.quality;
    }
    if (params.count) {
      var countSel = document.getElementById('video-param-count');
      if (countSel) {
        for (var i = 0; i < countSel.options.length; i++) {
          if (countSel.options[i].value.indexOf(String(params.count)) !== -1) {
            countSel.selectedIndex = i;
            break;
          }
        }
      }
    }
    if (params.durationSec) {
      setVideoDuration(params.durationSec);
    } else if (params.duration) {
      var sec = parseInt(String(params.duration).replace(/[^\d]/g, ''), 10);
      if (sec) setVideoDuration(sec);
    }
    if (params.realPerson) setVideoToggleParam('realperson', params.realPerson);
    if (params.audio) setVideoToggleParam('audio', params.audio);
    updateVideoOutputParamsLabel();

    var promptInput = document.getElementById('video-prompt-textarea');
    if (promptInput && params.prompt !== undefined) {
      promptInput.value = params.prompt;
    }

    var savedRefs = cardVideoRefImages[cardId] || [];
    videoRefFiles = savedRefs.map(function(f, idx) {
      if (typeof f === 'string') {
        return { name: 'ref-' + idx, dataUrl: f, type: 'image' };
      }
      return {
        name: f.name || ('ref-' + idx),
        dataUrl: f.dataUrl,
        type: f.type || 'image'
      };
    });
    renderVideoRefThumbnails();

    var inputArea = document.getElementById('video-input-area');
    if (inputArea) {
      inputArea.classList.remove('pointer-events-none', 'opacity-50');
    }
    setVideoGenButtonState(false);
    syncVideoResultsBottomPadding();

    if (promptInput) promptInput.focus();
    showToast('📝 已加载到输入框，展示区保持不变');
  };

  window.deleteVideoResultCard = function(arg) {
    var card;
    if (typeof arg === 'string') {
      card = document.getElementById(arg);
    } else if (arg && arg.closest) {
      card = arg.closest('[id^="video-result-card-"]');
    }
    if (card) {
      var previewModal = document.getElementById('video-result-preview');
      if (previewModal && previewModal.dataset.cardId === card.id) closeVideoResultPreview();
      delete cardVideoRefImages[card.id];
      card.remove();
      var container = document.getElementById('video-results-container');
      var hasResultCards = container && container.querySelector('[id^="video-result-card-"]');
      if (container && !hasResultCards) container.classList.add('hidden');
      syncVideoResultsBottomPadding();
      if (typeof syncVideoResultsEmptyState === 'function') syncVideoResultsEmptyState();
      if (typeof placeVideoHotAppsStrip === 'function') placeVideoHotAppsStrip();
      showToast('已删除结果');
    }
  };

  window.downloadResultVideo = function(btn) {
    var slot = btn.closest('.result-video-slot') || btn.closest('.aspect-video');
    if (slot) {
      showToast('⬇️ 开始下载视频...');
    }
  };

  window.publishResultVideo = function(btn) {
    publishResultImage(btn);
  };

  // 图片参考图预览
  window.addImageRef=function(file){
    if(imageRefFiles.length >= 14) {
      showToast('⚠️ 最多14张参考图');
      return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
      const id = 'ref_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      imageRefFiles.push({id: id, dataUrl: e.target.result});
      renderImageRefThumbnails();
    };
    reader.readAsDataURL(file);
  };

  window.renderImageRefThumbnails=function(){
    const container = document.getElementById('image-ref-thumbnails');
    if(!container) return;
    if(imageRefFiles.length === 0) {
      // 初始状态显示一个 + 添加按钮
      container.innerHTML = '<div data-open-asset-modal onclick="openImageAssetModal()" class="w-12 h-12 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-400 cursor-pointer shrink-0" title="添加参考图"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg><span class="text-[9px] mt-0.5">图片</span></div>';
      return;
    }
    container.innerHTML = imageRefFiles.map(function(f) {
      return '<div class="relative shrink-0 group">' +
        '<img src="'+f.dataUrl+'" class="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-gray-600 cursor-pointer" onclick="previewImage(this.src)">' +
        '<button type="button" onclick="event.stopPropagation();removeImageRef(\''+f.id+'\')" class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-10" title="删除">×</button>' +
        '</div>';
    }).join('') + '<div data-open-asset-modal onclick="openImageAssetModal()" class="w-12 h-12 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-400 cursor-pointer shrink-0" title="继续添加"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg><span class="text-[9px] mt-0.5">图片</span></div>';
  };

  window.removeImageRef=function(id){
    imageRefFiles = imageRefFiles.filter(function(f) { return f.id !== id; });
    renderImageRefThumbnails();
  };

  window.formatGenElapsed=function(startAt){
    var ms=Math.max(0,Date.now()-(startAt||Date.now()));
    if(ms<1000) return (ms/1000).toFixed(1)+'秒';
    var sec=ms/1000;
    if(sec<60) return sec.toFixed(1)+'秒';
    var m=Math.floor(sec/60);
    var s=Math.round(sec%60);
    return m+'分'+(s<10?'0':'')+s+'秒';
  };

  window.LIGHTNING_ICON_HTML='<span class="text-yellow-500 leading-none" aria-hidden="true">⚡</span>';

  window.stripDollarPrefix=function(str){
    return String(str==null?'':str).replace(/^\$/,'').trim();
  };

  window.formatLightningAmountHtml=function(amount,opts){
    opts=opts||{};
    var extra=opts.extraClass?' '+opts.extraClass:'';
    var v=window.stripDollarPrefix(amount);
    return '<span class="inline-flex items-center gap-0.5 shrink-0 tabular-nums'+extra+'">'+window.LIGHTNING_ICON_HTML+v+'</span>';
  };

  window.formatLightningPriceTextHtml=function(text){
    var t=window.stripDollarPrefix(text);
    return '<span class="inline-flex items-center gap-0.5">'+window.LIGHTNING_ICON_HTML+t+'</span>';
  };

  window.setLightningPriceElement=function(el,text){
    if(!el)return;
    el.innerHTML=window.formatLightningPriceTextHtml(text);
  };

  window.initMediaPageLightningPrices=function(){
    if(typeof setLightningPriceElement!=='function')return;
    ['page-chat','page-image','page-video','page-audio','model-detail-modal'].forEach(function(id){
      var root=document.getElementById(id);
      if(!root)return;
      root.querySelectorAll('div,span').forEach(function(el){
        if(el.childElementCount>0)return;
        var t=(el.textContent||'').trim();
        if(t.charAt(0)==='$')setLightningPriceElement(el,t);
      });
    });
  };

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',window.initMediaPageLightningPrices);
  }else{
    window.initMediaPageLightningPrices();
  }

  window.formatGenFinishedTime=function(ts){
    var d=new Date(ts||Date.now());
    var pad2=function(n){return n<10?'0'+n:''+n;};
    return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+pad2(d.getHours())+':'+pad2(d.getMinutes())+':'+pad2(d.getSeconds());
  };

  window.buildResultGenMetaHtml=function(finishedAt,costUsd,startAt,opts){
    opts=opts||{};
    var ts=finishedAt||Date.now();
    var timeStr=formatGenFinishedTime(ts);
    var costStr=(typeof costUsd==='number'?costUsd:parseFloat(costUsd)||0).toFixed(4);
    var titleAttr=startAt?' title="耗时 '+formatGenElapsed(startAt)+'"':'';
    if(opts.showLabels===false){
      return '<span class="text-gray-300 dark:text-gray-600">|</span>'+
        '<span class="text-gray-500 dark:text-gray-400 shrink-0"'+titleAttr+'>'+timeStr+'</span>'+
        '<span class="text-gray-300 dark:text-gray-600">|</span>'+
        (typeof formatLightningAmountHtml==='function'?formatLightningAmountHtml(costStr):window.LIGHTNING_ICON_HTML+costStr);
    }
    return '<span class="text-gray-300 dark:text-gray-600">|</span>'+
      '<span class="text-gray-500 dark:text-gray-400 shrink-0"'+titleAttr+'>生成时间 '+timeStr+'</span>'+
      '<span class="text-gray-300 dark:text-gray-600">|</span>'+
      '<span class="text-gray-500 dark:text-gray-400 shrink-0 inline-flex items-center gap-0.5">生成花费 '+(typeof formatLightningAmountHtml==='function'?formatLightningAmountHtml(costStr):window.LIGHTNING_ICON_HTML+costStr)+'</span>';
  };

  // ============ 图片生成流程 ============
  let imageGenerationTimer = null;
  let imageGenerationProgress = 0;
  let imageGenerationStartAt = 0;
  const genStatusMessages = [
    '正在准备任务...',
    '正在分析提示词...',
    '正在加载模型...',
    '正在生成图片...',
    '正在优化细节...',
    '即将完成...'
  ];

  function setResultPromptText(el, text) {
    if (!el) return;
    var body = el.querySelector('.result-prompt-body');
    if (body) body.textContent = text;
    else el.textContent = text;
    refreshResultPromptClamp(el);
  }

  function isResultPromptOverflow(textEl) {
    if (!textEl) return false;
    if (textEl.classList.contains('is-expanded')) return false;
    if (textEl.scrollHeight > textEl.clientHeight + 1) return true;
    var body = textEl.querySelector('.result-prompt-body');
    if (!body || !(body.textContent || '').trim()) return false;
    var style = getComputedStyle(textEl);
    var lh = parseFloat(style.lineHeight);
    if (isNaN(lh) || lh <= 0) lh = (parseFloat(style.fontSize) || 12) * 1.5;
    return body.scrollHeight > lh * 3 + 2;
  }

  function applyResultPromptClampState(container, textEl) {
    if (!container || !textEl) return;
    if (textEl.classList.contains('is-expanded')) {
      container.classList.add('is-expanded');
      updateResultPromptHint(container, textEl);
      return;
    }
    container.classList.remove('result-prompt--clampable', 'is-expanded');
    textEl.classList.remove('is-expanded');
    container.removeAttribute('role');
    container.removeAttribute('tabindex');
    container.removeAttribute('aria-expanded');
    var hint = container.querySelector('.result-prompt-toggle-hint');
    if (hint) hint.classList.add('hidden');
    if (isResultPromptOverflow(textEl)) {
      container.classList.add('result-prompt--clampable');
      container.setAttribute('role', 'button');
      container.setAttribute('tabindex', '0');
      container.setAttribute('aria-expanded', 'false');
      updateResultPromptHint(container, textEl);
    }
  }

  window.refreshResultPromptClamp = function(root) {
    var audioWraps = [];
    var nodes = [];
    if (!root) {
      nodes = Array.from(document.querySelectorAll('.result-prompt-text'));
      audioWraps = Array.from(document.querySelectorAll('#page-audio .audio-result-prompt-wrap'));
    } else if (root.classList && root.classList.contains('result-prompt-text')) {
      nodes = [root];
    } else if (root.classList && root.classList.contains('audio-result-prompt-wrap')) {
      audioWraps = [root];
    } else {
      if (root.querySelectorAll) {
        nodes = Array.from(root.querySelectorAll('.result-prompt-text'));
        audioWraps = Array.from(root.querySelectorAll('.audio-result-prompt-wrap'));
      }
    }
    audioWraps.forEach(function(wrap) {
      var textEl = wrap.querySelector('.result-prompt-text');
      if (textEl) applyResultPromptClampState(wrap, textEl);
    });
    nodes.forEach(function(el) {
      if (el.closest('.audio-result-prompt-wrap')) return;
      if (el.classList.contains('is-expanded')) {
        updateResultPromptHint(el, el);
        return;
      }
      el.classList.remove('result-prompt--clampable', 'is-expanded');
      el.removeAttribute('role');
      el.removeAttribute('tabindex');
      el.removeAttribute('aria-expanded');
      var hint = el.querySelector('.result-prompt-toggle-hint');
      if (hint) hint.classList.add('hidden');
      if (isResultPromptOverflow(el)) {
        el.classList.add('result-prompt--clampable');
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
        el.setAttribute('aria-expanded', 'false');
        updateResultPromptHint(el, el);
      }
    });
  };

  function updateResultPromptHint(container, textEl) {
    var hint = container.querySelector ? container.querySelector('.result-prompt-toggle-hint') : null;
    if (!hint) return;
    var clampable = container.classList.contains('result-prompt--clampable');
    if (!clampable) {
      hint.classList.add('hidden');
      return;
    }
    hint.classList.remove('hidden');
    var expanded = textEl && textEl.classList.contains('is-expanded');
    hint.textContent = expanded ? '点击收起' : '点击查看全文';
  }

  window.toggleResultPrompt = function(el) {
    if (!el) return;
    var wrap = el.classList.contains('audio-result-prompt-wrap') ? el : el.closest('.audio-result-prompt-wrap');
    var textEl = wrap ? wrap.querySelector('.result-prompt-text') : el;
    var container = wrap || el;
    if (!container.classList.contains('result-prompt--clampable')) return;
    var expanded = !(textEl && textEl.classList.contains('is-expanded'));
    if (textEl) textEl.classList.toggle('is-expanded', expanded);
    container.classList.toggle('is-expanded', expanded);
    container.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    updateResultPromptHint(container, textEl || el);
  };

  document.addEventListener('click', function(e) {
    var el = e.target.closest('.result-prompt-text.result-prompt--clampable') || e.target.closest('.audio-result-prompt-wrap.result-prompt--clampable');
    if (!el) return;
    if (e.target.closest('button,a,input,select,textarea,label')) return;
    window.toggleResultPrompt(el);
  });
  document.addEventListener('keydown', function(e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var el = e.target.closest('.result-prompt-text.result-prompt--clampable') || e.target.closest('.audio-result-prompt-wrap.result-prompt--clampable');
    if (!el) return;
    e.preventDefault();
    window.toggleResultPrompt(el);
  });

  function showImageGeneratingPanel() {
    const container = document.getElementById('image-results-container');
    const generatingState = document.getElementById('image-generating-state');
    if (!container || !generatingState) return;
    container.appendChild(generatingState);
    generatingState.classList.remove('hidden');
    requestAnimationFrame(function() {
      refreshResultPromptClamp(generatingState);
      generatingState.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  function hideImageGeneratingPanel() {
    const generatingState = document.getElementById('image-generating-state');
    if (generatingState) generatingState.classList.add('hidden');
  }

  window.startImageGeneration = function() {
    // 清空重新编辑参数（生成开始后不再需要）
    currentEditParams = null;
    
    const prompt = document.getElementById('image-prompt-input');
    const promptText = prompt ? prompt.value.trim() : '';
    if (!promptText && imageRefFiles.length === 0) {
      showToast('⚠️ 请输入提示词或上传参考图');
      return;
    }

    if(typeof syncImageResultsEmptyState==='function')syncImageResultsEmptyState();

    // 获取当前参数
    const modelText = document.getElementById('current-image-model-text');
    const ratioSel = document.getElementById('image-param-ratio');
    const qualitySel = document.getElementById('image-param-quality');

    // 填充生成中状态的信息
    const genRefThumbs = document.getElementById('gen-ref-thumbs');
    if (genRefThumbs && imageRefFiles.length > 0) {
      genRefThumbs.innerHTML = imageRefFiles.map(function(f, idx) {
        return '<div class="relative w-10 h-10 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-600 shrink-0">' +
          '<img src="' + f.dataUrl + '" class="w-full h-full object-cover" title="参考图' + (idx+1) + '">' +
          '</div>';
      }).join('');
    } else if (genRefThumbs) {
      genRefThumbs.innerHTML = '';
    }

    const genModel = document.getElementById('gen-model');
    if (genModel && modelText) genModel.textContent = modelText.textContent || 'Auto';

    const genRatio = document.getElementById('gen-ratio');
    if (genRatio && ratioSel) genRatio.textContent = getImageRatioLabel(ratioSel.value);

    const genQuality = document.getElementById('gen-quality');
    if (genQuality && qualitySel) {
      var qm = { '低': '低', '中': '中', '高': '高', '标准': '中', '高清': '高', '超清': '高' };
      genQuality.textContent = qm[qualitySel.value] || qualitySel.value;
    }

    setResultPromptText(document.getElementById('gen-prompt'), promptText || '（无提示词）');

    imageGenerationStartAt = Date.now();
    showImageGeneratingPanel();

    // 禁用输入区域
    const inputArea = document.getElementById('image-input-area');
    if (inputArea) inputArea.classList.add('pointer-events-none', 'opacity-50');

    // 开始进度模拟
    imageGenerationProgress = 0;
    updateImageGenerationProgress();
    imageGenerationTimer = setInterval(function() {
      imageGenerationProgress += Math.random() * 12 + 4;
      if (imageGenerationProgress >= 100) {
        imageGenerationProgress = 100;
        clearInterval(imageGenerationTimer);
        setTimeout(function() {
          finishImageGeneration();
        }, 300);
      }
      updateImageGenerationProgress();
    }, 600);
  };

  function updateImageGenerationProgress() {
    const bar = document.getElementById('gen-progress-bar');
    const text = document.getElementById('gen-status-text');
    const detail = document.getElementById('gen-status-detail');
    const pct = Math.floor(imageGenerationProgress);
    if (bar) bar.style.width = pct + '%';
    if (text) text.textContent = pct + '%';
    // 根据进度显示不同状态文字
    if (detail) {
      let msgIdx = Math.min(Math.floor(pct / 20), genStatusMessages.length - 1);
      detail.textContent = genStatusMessages[msgIdx];
    }
  }

  window.stopImageGeneration = function() {
    if (imageGenerationTimer) {
      clearInterval(imageGenerationTimer);
      imageGenerationTimer = null;
    }
    hideImageGeneratingPanel();
    const inputArea = document.getElementById('image-input-area');
    if (inputArea) inputArea.classList.remove('pointer-events-none', 'opacity-50');
    showToast('⏹ 已停止生成');
  };

  function buildResultImageOverlayHtml() {
    return '<div class="result-image-toolbar">' +
      '<button type="button" class="result-image-tool-btn" onclick="event.stopPropagation();downloadResultImage(this)" title="下载"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>' +
      '<button type="button" class="result-image-tool-btn" onclick="event.stopPropagation();publishResultImage(this)" title="发布"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>' +
      '<button type="button" class="result-image-tool-btn" data-action="delete-image" onclick="event.stopPropagation();deleteResultImage(this)" title="删除" aria-label="删除图片"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>' +
      '</div>';
  }

  function finishImageGeneration() {
    hideImageGeneratingPanel();

    if(typeof syncImageResultsEmptyState==='function')syncImageResultsEmptyState();

    // 获取当前参数
    const prompt = document.getElementById('image-prompt-input');
    const promptText = prompt ? prompt.value.trim() : '';
    const modelText = document.getElementById('current-image-model-text');
    const ratioSel = document.getElementById('image-param-ratio');
    const qualitySel = document.getElementById('image-param-quality');
    const countSel = document.getElementById('image-param-count');

    const model = modelText ? modelText.textContent : 'Auto';
    const ratio = ratioSel ? ratioSel.value : '16:9';
    const quality = qualitySel ? qualitySel.value : '2k';
    const tierEl = document.getElementById('image-param-tier');
    const tier = tierEl ? tierEl.value : '中';
    const count = countSel ? parseInt(countSel.value) || 1 : 1;
    const finishedAt = Date.now();
    const genDurationMs = imageGenerationStartAt ? finishedAt - imageGenerationStartAt : 0;
    const genCost = calcImageGenerationCost(model, quality, tier, count);
    const genMetaHtml = buildResultGenMetaHtml(finishedAt, genCost, imageGenerationStartAt, { showLabels: false });

    // 获取参考图数据（保存全部）
    const refDataList = imageRefFiles.map(function(f) {
      return f.dataUrl;
    });

    // 生成结果卡片
    const cardId = 'result-card-' + Date.now();
    // 保存参数到JSON（refDataList 太大，不写进 HTML 属性，改存到全局变量）
    cardRefImages[cardId] = refDataList;
    const cardParams = JSON.stringify({
      model: model,
      ratio: ratio,
      quality: quality,
      tier: tier,
      count: count,
      prompt: promptText,
      hasRef: refDataList.length > 0,
      genDurationMs: genDurationMs,
      genCost: genCost,
      genFinishedAt: finishedAt,
      genTaskId: String(finishedAt) + String(100000 + Math.floor(Math.random() * 900000))
    }).replace(/"/g, '&quot;');

    let imagesHtml = '';
    var imgMainClass = count <= 1
      ? 'result-image-main w-full max-w-4xl h-96 object-cover cursor-pointer'
      : 'result-image-main w-full h-72 object-cover cursor-pointer';
    var imagesGridClass = count <= 1
      ? 'result-images-grid result-images-grid--single grid grid-cols-1 max-w-3xl mx-auto gap-3'
      : 'result-images-grid result-images-grid--multi grid grid-cols-2 gap-2';
    for (var i = 0; i < count && i < 4; i++) {
      imagesHtml += '<div class="result-image-wrap group rounded-xl overflow-hidden shadow-lg w-full min-w-0">' +
        '<img src="' + EXAMPLE_PREVIEW_IMAGE + '" class="' + imgMainClass + '" onclick="previewResultImage(this)" data-image-index="' + i + '" alt="生成结果">' +
        buildResultImageOverlayHtml() +
        '</div>';
    }

    var refThumbsHtml = refDataList.length > 0
      ? refDataList.map(function(dataUrl, idx) {
        return '<div class="relative w-10 h-10 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-600 shrink-0"><img src="' + dataUrl + '" class="w-full h-full object-cover" title="参考图' + (idx+1) + '"></div>';
      }).join('')
      : '';

    const cardActionsHtml =
      '<div class="result-card-actions flex items-center gap-2 shrink-0 ml-3 pl-3 border-l border-gray-200 dark:border-gray-600">' +
      '<button type="button" onclick="regenerateImage(\'' + cardId + '\')" class="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition" title="再次生成">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg></button>' +
      '<button type="button" onclick="reEditImage(\'' + cardId + '\')" class="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition" title="重新编辑">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>' +
      '</div>';

    const cardHtml = '<div id="' + cardId + '" class="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-2xl shadow-lg p-4">' +
      '<div class="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3 text-[11px]">' +
      '<span class="text-gray-500 dark:text-gray-400 shrink-0">' + model + '</span>' +
      '<span class="text-gray-300 dark:text-gray-600">|</span>' +
      '<span class="text-gray-500 dark:text-gray-400 shrink-0">' + ratio + '</span>' +
      '<span class="text-gray-300 dark:text-gray-600">|</span>' +
      '<span class="text-gray-500 dark:text-gray-400 shrink-0">' + quality + '</span>' +
      genMetaHtml +
      cardActionsHtml +
      '</div>' +
      '<p class="result-prompt-text text-gray-700 dark:text-gray-300 mb-3 text-[12px] w-full"><span class="result-prompt-body">' + escapeHtml(promptText || '（无提示词）') + '</span><span class="result-prompt-toggle-hint hidden"></span></p>' +
      (refThumbsHtml ? '<div class="result-ref-thumbs flex items-center gap-2 flex-wrap mb-4">' + refThumbsHtml + '</div>' : '') +
      '<div class="' + imagesGridClass + '">' + imagesHtml + '</div>' +
      '<div class="hidden card-params" data-params="' + cardParams + '"></div>' +
      '</div>';

    // 插入到生成进度条之前（进度条固定在结果区底部）
    const container = document.getElementById('image-results-container');
    const generatingState = document.getElementById('image-generating-state');
    if (container && generatingState) {
      generatingState.insertAdjacentHTML('beforebegin', cardHtml);
      const newCard = generatingState.previousElementSibling;
      if (newCard) {
        requestAnimationFrame(function() {
          refreshResultPromptClamp(newCard);
          newCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
      }
    } else if (container) {
      container.insertAdjacentHTML('beforeend', cardHtml);
      requestAnimationFrame(function() { refreshResultPromptClamp(container); });
    }

    // 恢复输入区域
    const inputArea = document.getElementById('image-input-area');
    if (inputArea) inputArea.classList.remove('pointer-events-none', 'opacity-50');

    showToast('✅ 生成完成');
    if(typeof placeImageHotAppsStrip==='function')placeImageHotAppsStrip();
    if(typeof patchImageResultDeleteButtons==='function')patchImageResultDeleteButtons();
  }

  function syncResultCardImageGrid(card) {
    if (!card) return;
    var wraps = card.querySelectorAll('.result-image-wrap');
    var count = wraps.length;
    var grid = card.querySelector('.grid');
    if (!grid || !count) return;
    var imgMainClass = count <= 1
      ? 'result-image-main w-full max-w-4xl h-96 object-cover cursor-pointer'
      : 'result-image-main w-full h-72 object-cover cursor-pointer';
    grid.className = count <= 1
      ? 'result-images-grid result-images-grid--single grid grid-cols-1 max-w-3xl mx-auto gap-3'
      : 'result-images-grid result-images-grid--multi grid grid-cols-2 gap-2';
    wraps.forEach(function(wrap, i) {
      var img = wrap.querySelector('.result-image-main');
      if (!img) return;
      img.setAttribute('data-image-index', String(i));
      img.className = imgMainClass;
      wrap.classList.add('w-full', 'min-w-0');
      wrap.classList.remove('flex-1');
    });
    var paramsEl = card.querySelector('.card-params');
    if (paramsEl) {
      try {
        var params = JSON.parse(paramsEl.getAttribute('data-params').replace(/&quot;/g, '"'));
        params.count = count;
        paramsEl.setAttribute('data-params', JSON.stringify(params).replace(/"/g, '&quot;'));
      } catch (e) {}
    }
  }

  function removeResultImageFromCard(card, deletedIndex) {
    if (!card) return;
    var previewModal = document.getElementById('image-result-preview');
    var previewOpen = previewModal && !previewModal.classList.contains('hidden');
    var previewCardId = previewOpen ? previewModal.dataset.cardId : '';
    var previewIndex = previewOpen ? parseInt(previewModal.dataset.imageIndex || '0', 10) : -1;

    var remaining = card.querySelectorAll('.result-image-wrap');
    if (!remaining.length) {
      if (previewOpen && previewCardId === card.id && typeof closeImageResultPreview === 'function') {
        closeImageResultPreview();
      }
      deleteResultCard(card.id);
      if (typeof syncImageResultsEmptyState === 'function') syncImageResultsEmptyState();
      return;
    }

    syncResultCardImageGrid(card);
    showToast('已删除该图片');

    if (previewOpen && previewCardId === card.id) {
      var newIdx = previewIndex;
      if (previewIndex === deletedIndex) {
        newIdx = Math.min(deletedIndex, remaining.length - 1);
      } else if (previewIndex > deletedIndex) {
        newIdx = previewIndex - 1;
      }
      var ctx = typeof buildImageResultPreviewCtx === 'function'
        ? buildImageResultPreviewCtx(card.id, newIdx)
        : null;
      if (ctx && typeof fillImageResultPreview === 'function') {
        fillImageResultPreview(previewModal, ctx);
      } else if (typeof closeImageResultPreview === 'function') {
        closeImageResultPreview();
      }
    }
  }

  window.deleteResultImage = function(btn) {
    if (!btn) return;
    var now = Date.now();
    if (btn._deleteHandledAt && now - btn._deleteHandledAt < 400) return;
    btn._deleteHandledAt = now;
    var wrap = btn.closest ? btn.closest('.result-image-wrap') : null;
    if (!wrap) return;
    var card = wrap.closest('[id^="result-card-"]');
    if (!card) return;
    var img = wrap.querySelector('.result-image-main');
    var deletedIndex = img ? parseInt(img.getAttribute('data-image-index') || '0', 10) : 0;
    wrap.remove();
    removeResultImageFromCard(card, deletedIndex);
  };
  window.removeResultImageFromCard = removeResultImageFromCard;

  function patchImageResultDeleteButtons(root) {
    var scope = root || document.getElementById('image-results-container') || document;
    scope.querySelectorAll('.result-image-tool-btn[title="删除"],.result-image-tool-btn[data-action="delete-image"]').forEach(function(btn) {
      btn.setAttribute('data-action', 'delete-image');
      var oc = btn.getAttribute('onclick') || '';
      if (oc.indexOf('deleteResultCard') !== -1) {
        btn.setAttribute('onclick', 'event.stopPropagation();deleteResultImage(this)');
      }
    });
  }
  window.patchImageResultDeleteButtons = patchImageResultDeleteButtons;

  function bindImageResultToolbarDelegation() {
    var container = document.getElementById('image-results-container');
    if (!container || container.dataset.imageToolbarBound === '1') return;
    container.dataset.imageToolbarBound = '1';
    function onDeleteIntent(e) {
      var delBtn = e.target.closest('[data-action="delete-image"]');
      if (!delBtn || !container.contains(delBtn)) return;
      e.preventDefault();
      e.stopPropagation();
      if (typeof window.deleteResultImage === 'function') window.deleteResultImage(delBtn);
    }
    container.addEventListener('click', onDeleteIntent, true);
    container.addEventListener('touchend', onDeleteIntent, true);
  }
  bindImageResultToolbarDelegation();
  patchImageResultDeleteButtons();

  window.deleteResultCard = function(arg) {
    var card;
    if (typeof arg === 'string') {
      card = document.getElementById(arg);
    } else if (arg && arg.closest) {
      card = arg.closest('[id^="result-card-"]');
    }
    if (card) {
      var previewModal = document.getElementById('image-result-preview');
      if (previewModal && !previewModal.classList.contains('hidden') && previewModal.dataset.cardId === card.id) {
        if (typeof closeImageResultPreview === 'function') closeImageResultPreview();
      }
      delete cardRefImages[card.id];
      card.remove();
      showToast('已删除结果');
      if (typeof syncImageResultsEmptyState === 'function') syncImageResultsEmptyState();
      if (typeof placeImageHotAppsStrip === 'function') placeImageHotAppsStrip();
    }
  };

  window.regenerateImage = function(cardId) {
    if (cardId) {
      // 从卡片读取参数
      const card = document.getElementById(cardId);
      if (card) {
        const paramsEl = card.querySelector('.card-params');
        if (paramsEl) {
          try {
            const params = JSON.parse(paramsEl.getAttribute('data-params').replace(/&quot;/g, '"'));
            // 保存当前参数到全局变量
            currentEditParams = params;
          } catch(e) {}
        }
      }
    }
    startImageGeneration();
  };

  window.reEditImage = function(cardId) {
    if (!cardId) return;
    
    const card = document.getElementById(cardId);
    if (!card) {
      showToast('❌ 找不到结果卡片');
      return;
    }
    
    // 读取保存的参数
    const paramsEl = card.querySelector('.card-params');
    if (!paramsEl) {
      showToast('❌ 找不到参数数据');
      return;
    }
    
    let params;
    try {
      var raw = paramsEl.getAttribute('data-params');
      if (!raw) {
        showToast('❌ 参数数据为空');
        return;
      }
      params = JSON.parse(raw.replace(/&quot;/g, '"'));
    } catch(e) {
      showToast('❌ 参数解析失败');
      return;
    }
    
    // 保存当前参数供再次生成使用
    currentEditParams = params;
    
    // 1. 设置模型
    if (params.model) {
      var modelText = document.getElementById('current-image-model-text');
      if (modelText) modelText.textContent = params.model;
    }
    
    // 2. 设置比例
    if (params.ratio) {
      var ratioSel = document.getElementById('image-param-ratio');
      if (ratioSel) {
        var ratioMatched = false;
        for (var i = 0; i < ratioSel.options.length; i++) {
          if (ratioSel.options[i].value.indexOf(params.ratio) !== -1) {
            ratioSel.selectedIndex = i;
            ratioMatched = true;
            break;
          }
        }
        if (!ratioMatched) ratioSel.selectedIndex = 0;
      }
    }
    
    // 3. 设置质量
    if (params.quality) {
      var qualitySel = document.getElementById('image-param-quality');
      if (qualitySel) {
        var qualityMatched = false;
        for (var i = 0; i < qualitySel.options.length; i++) {
          if (qualitySel.options[i].value.indexOf(params.quality) !== -1) {
            qualitySel.selectedIndex = i;
            qualityMatched = true;
            break;
          }
        }
        if (!qualityMatched) qualitySel.selectedIndex = 0;
      }
    }
    
    // 4. 设置数量
    if (params.count) {
      var countSel = document.getElementById('image-param-count');
      if (countSel) {
        var countMatched = false;
        for (var i = 0; i < countSel.options.length; i++) {
          if (countSel.options[i].value.indexOf(String(params.count)) !== -1) {
            countSel.selectedIndex = i;
            countMatched = true;
            break;
          }
        }
        if (!countMatched) countSel.selectedIndex = 0;
      }
    }
    if (params.tier) {
      var tierEl = document.getElementById('image-param-tier');
      if (tierEl) tierEl.value = params.tier;
    }
    updateImageOutputParamsLabel();
    updateImageGenCost();
    
    // 5. 设置提示词
    if (params.prompt !== undefined) {
      var promptInput = document.getElementById('image-prompt-input');
      if (promptInput) {
        promptInput.value = params.prompt;
        // 聚焦输入框
        promptInput.focus();
      }
    }
    
    // 6. 设置参考图（从全局变量还原，避免 data-params 属性被撑爆）
    var refDataList = cardId ? (cardRefImages[cardId] || []) : [];
    if (refDataList.length > 0) {
      imageRefFiles = refDataList.map(function(dataUrl, idx) {
        return { id: 'ref-' + Date.now() + '-' + idx, dataUrl: dataUrl };
      });
      renderImageRefThumbnails();
    } else {
      // 如果没有参考图，清空
      imageRefFiles = [];
      renderImageRefThumbnails();
    }
    
    // 7. 滚动到底部输入框区域（fixed定位元素不能用scrollIntoView）
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    
    // 移除输入框禁用状态
    var inputArea = document.getElementById('image-input-area');
    if (inputArea) inputArea.classList.remove('pointer-events-none', 'opacity-50');
    
    showToast('📝 已加载之前的设置（模型：' + (params.model || '默认') + '，比例：' + (params.ratio || '默认') + '），请修改后重新生成');
  };

  window.downloadResultImage = function(btn) {
    var img = btn.closest('.relative').querySelector('img');
    if (img && img.src) {
      showToast('⬇️ 开始下载...');
    }
  };

  window.publishResultImage = function(btn) {
    // 获取卡片信息（图片 / 视频 / 音频结果卡片）
    var card = btn.closest('[id^="result-card-"], [id^="video-result-card-"], [id^="audio-result-card-"]');
    if (!card) { showToast('❌ 找不到结果卡片'); return; }
    var paramsEl = card.querySelector('.card-params');
    var promptText = '';
    try {
      var raw = paramsEl ? paramsEl.getAttribute('data-params') : '{}';
      var p = JSON.parse(raw.replace(/&quot;/g, '"'));
      promptText = p.prompt || '';
    } catch(e) {}
    if (!promptText) {
      var promptBody = card.querySelector('.result-prompt-body');
      if (promptBody) promptText = promptBody.textContent.trim();
    }

    // 获取图片
    var img = btn.closest('.relative').querySelector('img');
    var imgSrc = img ? img.src : '';

    // 清理旧弹窗
    var oldPopup = document.getElementById('publish-popup');
    if (oldPopup) oldPopup.remove();
    var oldOverlay = document.getElementById('publish-overlay');
    if (oldOverlay) oldOverlay.remove();

    var overlay = document.createElement('div');
    overlay.id = 'publish-overlay';
    overlay.className = 'fixed inset-0 bg-black/40 backdrop-blur-sm z-[200060]';
    overlay.onclick = closePublishPopup;

    var popup = document.createElement('div');
    popup.id = 'publish-popup';
    var isPubMobile = window.matchMedia && window.matchMedia('(max-width:768px)').matches;
    popup.className = 'publish-popup-panel fixed z-[200061] bg-white dark:bg-gray-900 shadow-2xl flex flex-col overflow-hidden ' +
      (isPubMobile ? 'inset-0 w-full h-full max-w-full max-h-full rounded-none' : 'top-8 right-8 bottom-8 w-[420px] rounded-2xl');
    popup.onclick = function(e) { e.stopPropagation(); };
    popup.innerHTML =
      '<div class="px-6 pt-5 pb-3 flex-shrink-0 flex items-center justify-between">' +
        '<div class="text-[15px] font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2"><span>✏️</span><span>编辑作品</span></div>' +
        '<button onclick="closePublishPopup()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>' +
      '</div>' +
      '<div class="flex-1 overflow-y-auto px-6 space-y-4">' +
        '<!-- 作品标题 -->' +
        '<div>' +
          '<label class="block text-[12px] font-medium text-gray-500 dark:text-gray-400 mb-1.5">作品标题</label>' +
          '<input id="pub-title" type="text" value="' + escapeHtml(promptText.substring(0,30)) + '" class="w-full text-[13px] border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 outline-none focus:border-blue-400 dark:focus:border-blue-500 transition" placeholder="输入作品标题">' +
        '</div>' +
        '<!-- 分类标签 -->' +
        '<div>' +
          '<label class="block text-[12px] font-medium text-gray-500 dark:text-gray-400 mb-1.5">分类标签</label>' +
          '<div id="pub-tags-container" class="flex flex-wrap gap-1.5 mb-2"></div>' +
          '<input id="pub-tag-input" type="text" class="w-full text-[12px] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 bg-gray-50 dark:bg-gray-800 outline-none focus:border-blue-400 dark:focus:border-blue-500" placeholder="添加标签">' +
        '</div>' +
        '<!-- 提示词 -->' +
        '<div>' +
          '<label class="block text-[12px] font-medium text-gray-500 dark:text-gray-400 mb-1.5">提示词</label>' +
          '<textarea id="pub-prompt" class="w-full text-[12px] border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 resize-none outline-none focus:border-blue-400 dark:focus:border-blue-500 leading-relaxed" rows="3">' + escapeHtml(promptText) + '</textarea>' +
        '</div>' +
        '<!-- 使用价格 -->' +
        '<div>' +
          '<label class="block text-[12px] font-medium text-gray-500 dark:text-gray-400 mb-2">使用价格</label>' +
          '<div class="space-y-2">' +
            '<label class="flex items-center gap-2 cursor-pointer">' +
              '<input type="radio" name="pub-price-type" value="free" checked class="w-4 h-4 accent-blue-500">' +
              '<span class="text-[13px] text-gray-700 dark:text-gray-300">免费</span>' +
            '</label>' +
            '<label class="flex items-center gap-2 cursor-pointer">' +
              '<input type="radio" name="pub-price-type" value="paid" class="w-4 h-4 accent-blue-500">' +
              '<span class="text-[13px] text-gray-700 dark:text-gray-300">付费</span>' +
              '<span class="text-yellow-500">⚡</span>' +
              '<input id="pub-price-input" type="number" step="0.1" min="0.01" value="0.5" disabled class="w-20 text-[12px] border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 bg-gray-50 dark:bg-gray-800 outline-none focus:border-blue-400">' +
              '<span class="text-[12px] text-gray-400">/次</span>' +
            '</label>' +
          '</div>' +
        '</div>' +
        '<!-- 可见性 -->' +
        '<div>' +
          '<label class="block text-[12px] font-medium text-gray-500 dark:text-gray-400 mb-2">可见性 <span class="font-normal text-gray-400">(控制发布/下架)</span></label>' +
          '<div class="space-y-2">' +
            '<label class="flex items-center gap-2 cursor-pointer p-3 border border-green-200 dark:border-green-800/30 rounded-xl bg-green-50/50 dark:bg-green-900/10">' +
              '<input type="radio" name="pub-visibility" value="public" checked class="w-4 h-4 accent-blue-500">' +
              '<span class="text-[13px] text-gray-700 dark:text-gray-300">公开分享</span>' +
              '<span class="text-[11px] text-gray-400 ml-auto">（作品发布，所有人可见）</span>' +
            '</label>' +
            '<label class="flex items-center gap-2 cursor-pointer p-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50">' +
              '<input type="radio" name="pub-visibility" value="private" class="w-4 h-4 accent-blue-500">' +
              '<span class="text-[13px] text-gray-700 dark:text-gray-300">仅自己可见</span>' +
              '<span class="text-[11px] text-gray-400 ml-auto">（作品下架，只有自己可见）</span>' +
            '</label>' +
          '</div>' +
        '</div>' +
        '<!-- 作品统计 -->' +
        '<div class="border-t border-gray-100 dark:border-gray-700/50 pt-4">' +
          '<div class="text-[12px] font-medium text-gray-500 dark:text-gray-400 mb-2.5 flex items-center gap-1"><span>📊</span> 作品统计</div>' +
          '<div class="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[12px]">' +
            '<div class="flex justify-between"><span class="text-gray-400">浏览量：</span><span class="text-gray-700 dark:text-gray-300 font-medium">' + Math.floor(Math.random()*5000+1000).toLocaleString() + '</span></div>' +
            '<div class="flex justify-between"><span class="text-gray-400">点赞数：</span><span class="text-gray-700 dark:text-gray-300 font-medium">' + Math.floor(Math.random()*500+20).toLocaleString() + '</span></div>' +
            '<div class="flex justify-between"><span class="text-gray-400">使用次数：</span><span class="text-gray-700 dark:text-gray-300 font-medium">' + Math.floor(Math.random()*800+50).toLocaleString() + '</span></div>' +
            '<div class="flex justify-between"><span class="text-gray-400">收益：</span><span class="text-gray-700 dark:text-gray-300 font-medium">⚡ ' + Math.floor(Math.random()*500+10).toLocaleString() + '</span></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="flex-shrink-0 px-6 py-4 border-t border-gray-100 dark:border-gray-700/50 flex items-center justify-end gap-3">' +
        '<button onclick="closePublishPopup()" class="px-5 py-2 text-[13px] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition">取消</button>' +
        '<button onclick="confirmPublishSave()" class="px-6 py-2 text-[13px] bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition font-medium">保存</button>' +
      '</div>';

    document.body.appendChild(overlay);
    document.body.appendChild(popup);
    document.body.style.overflow = 'hidden';

    // 初始化默认标签
    window.pubTagsList = ['风景', '赛博朋克', '城市'];
    renderPubTags();
    bindPubEvents();
  };

  window.closePublishPopup = function() {
    var p = document.getElementById('publish-popup');
    var o = document.getElementById('publish-overlay');
    if (p) p.remove();
    if (o) o.remove();
    document.body.style.overflow = '';
  };

  window.renderPubTags = function() {
    var container = document.getElementById('pub-tags-container');
    if (!container) return;
    container.innerHTML = pubTagsList.map(function(tag) {
      return '<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border select-none" style="' +
        (tag === '风景' ? 'background:#eef2ff;color:#6366f1;border-color:#c7d2fe' :
         tag === '赛博朋克' ? 'background:#fdf2f8;color:#db2777;border-color:#fbcfe8' :
         'background:#ecfccb;color:#65a30d;border-color:#bef264') + '">' +
        tag + ' <button onclick="removePubTag(\'' + tag.replace(/'/g,"\\\'") + '\')" class="hover:opacity-70 ml-0.5 text-current">×</button>' +
        '</span>';
    }).join('');
  };

  window.removePubTag = function(tag) {
    pubTagsList = pubTagsList.filter(function(t){ return t !== tag; });
    renderPubTags();
  };

  window.bindPubEvents = function() {
    // 价格类型切换
    var priceRadios = document.querySelectorAll('input[name="pub-price-type"]');
    priceRadios.forEach(function(r){
      r.addEventListener('change',function(){
        var priceInput = document.getElementById('pub-price-input');
        if(priceInput) priceInput.disabled = this.value !== 'paid';
      });
    });
    // 标签输入回车添加
    var tagInput = document.getElementById('pub-tag-input');
    if(tagInput){
      tagInput.addEventListener('keydown',function(e){
        if(e.key==='Enter'){
          e.preventDefault();
          var val = this.value.trim();
          if(val && pubTagsList.indexOf(val)===-1 && pubTagsList.length<8){
            pubTagsList.push(val);
            renderPubTags();
            this.value='';
          }
        }
      });
    }
  };

  window.confirmPublishSave = function(){
    var title = document.getElementById('pub-title');
    var titleVal = title ? title.value.trim() : '未命名作品';
    var visRadio = document.querySelector('input[name="pub-visibility"]:checked');
    var visibility = visRadio ? visRadio.value : 'public';
    closePublishPopup();
    showToast('✅ 作品「' + (titleVal || '未命名作品').substring(0,15) + (titleVal.length>15?'...':'') + '」已' + (visibility==='public'?'公开发布':'设为私密'));
  };

  window.escapeHtml = function(s) {
    if(!s) return '';
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  };

  window.downloadImage = function(btn) {
    showToast('⬇️ 开始下载...');
  };

  window.selectChatRoleFromDropdown=function(name,icon){
    if(typeof closeChatMobileSheet==='function')closeChatMobileSheet();
    const dropdown=document.getElementById('role-dropdown');
    if(dropdown) dropdown.classList.add('hidden');
    // 更新按钮文字
    const textEl=document.getElementById('current-role-text');
    if(textEl) textEl.textContent=name;
    // 更新移动端角色按钮图标
    const mobileRoleBtn = document.getElementById('chat-m-icon-role');
    if (mobileRoleBtn) {
      mobileRoleBtn.innerHTML = '';
      const iconSpan = document.createElement('span');
      iconSpan.textContent = icon;
      iconSpan.className = 'text-lg leading-none';
      mobileRoleBtn.appendChild(iconSpan);
    }
    // 调用原来的selectChatRole
    window.selectChatRole(name);
  };
  
  window.openCreateRole=function(){
    if(typeof closeChatMobileSheet==='function')closeChatMobileSheet();
    const dropdown=document.getElementById('role-dropdown');
    if(dropdown) dropdown.classList.add('hidden');
    // 打开角色弹窗并切换到创建角色Tab
    openModal('role-modal');
    // 切换到创建角色Tab
    setTimeout(()=>{
      const createTab=document.querySelector('[data-tab="create"]');
      if(createTab) createTab.click();
    },100);
    showToast('✨ 进入创建角色页面');
  };
  
  document.addEventListener('click',function(e){
    if(window.isChatMobileView&&window.isChatMobileView())return;
    const roleContainer=document.getElementById('role-dropdown-container');
    const roleDropdown=document.getElementById('role-dropdown');
    if(roleContainer&&roleDropdown&&!roleContainer.contains(e.target)){
      roleDropdown.classList.add('hidden');
    }
    const modelContainer=document.getElementById('model-dropdown-container');
    const modelDropdown=document.getElementById('model-dropdown');
    if(modelContainer&&modelDropdown&&!modelContainer.contains(e.target)){
      modelDropdown.classList.add('hidden');
    }
  });
  if(typeof syncChatMobileToolIcons==='function'){
    syncChatMobileToolIcons();
    window.addEventListener('resize',syncChatMobileToolIcons);
  }

  // 预设模板数据
  const presetTemplates = {
    'writing': '请以爆款写手的风格，撰写一篇引人入胜的文章。要求：标题吸睛、开头抓人、内容有深度、结尾有共鸣。',
    'social': '请为以下产品/话题撰写社媒文案：\n平台：小红书/微博/朋友圈\n风格：轻松活泼、真实种草\n要求：带emoji、有互动感、引导评论',
    'business': '请对以下业务场景进行商业分析：\n1. 市场现状与趋势\n2. 竞争格局分析\n3. SWOT分析\n4. 具体行动建议',
    'data': '请分析以下数据并给出洞察：\n1. 关键指标解读\n2. 趋势变化分析\n3. 异常点识别\n4. 数据驱动的优化建议',
    'code': '请审查以下代码，从以下维度给出建议：\n1. 潜在Bug与风险\n2. 性能优化点\n3. 可读性与维护性\n4. 最佳实践',
    'translate': '请将以下内容进行专业翻译：\n要求：准确传达原意、符合目标语言习惯、保持专业术语一致性。'
  };

  // 应用预设模板
  window.applyPresetTemplate = function(value) {
    if(!value) {
      // 重置为默认模型和角色
      selectChatModel('Auto', '✨');
      document.getElementById('current-role-text').textContent = '选择角色';
      document.getElementById('current-role-text').className = 'text-gray-500';
      currentRole = '';
      // 重置移动端角色按钮图标为默认SVG
      const mobileRoleBtn = document.getElementById('chat-m-icon-role');
      if (mobileRoleBtn) {
        mobileRoleBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
      }
      // 重置移动端模板按钮图标为默认SVG
      const mobileTemplateBtn = document.getElementById('chat-m-icon-template');
      if (mobileTemplateBtn) {
        mobileTemplateBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>';
      }
      return;
    }
    
    const ta = document.querySelector('#page-chat #chat-input');
    if(ta && presetTemplates[value]) {
      ta.value = presetTemplates[value];
    }
    
    // 根据模板配置更新模型和角色显示
    const templateConfigs = {
      writing: { model: 'GPT-4 Turbo', icon: '💎', role: '写作助手', roleIcon: '✍️', templateIcon: '✍️' },
      social: { model: 'Claude 3.5 Sonnet', icon: '🧠', role: '文案助手', roleIcon: '📝', templateIcon: '📝' },
      business: { model: 'DeepSeek V3', icon: '🔵', role: '商业顾问', roleIcon: '💼', templateIcon: '💼' },
      data: { model: 'GPT-4 Turbo', icon: '💎', role: '数据顾问', roleIcon: '📊', templateIcon: '📊' },
      code: { model: 'Claude 3.5 Sonnet', icon: '🧠', role: '代码助手', roleIcon: '💻', templateIcon: '💻' },
      translate: { model: 'DeepSeek V3', icon: '🔵', role: '翻译官', roleIcon: '🌐', templateIcon: '🌐' }
    };
    
    const cfg = templateConfigs[value];
    if(cfg) {
      // 只更新当前显示的模型名称
      document.getElementById('current-model-text').textContent = cfg.model;
      currentChatModel = cfg.model;
      // 只更新当前显示的角色名称
      document.getElementById('current-role-text').textContent = cfg.role;
      document.getElementById('current-role-text').className = 'text-gray-700 dark:text-gray-300 font-medium';
      // 更新移动端模型按钮图标
      const mobileModelBtn = document.getElementById('chat-m-icon-model');
      if (mobileModelBtn) {
        mobileModelBtn.innerHTML = '';
        const modelIconSpan = document.createElement('span');
        modelIconSpan.textContent = cfg.icon;
        modelIconSpan.className = 'text-lg leading-none';
        mobileModelBtn.appendChild(modelIconSpan);
      }
      // 更新移动端角色按钮图标
      const mobileRoleBtn = document.getElementById('chat-m-icon-role');
      if (mobileRoleBtn) {
        mobileRoleBtn.innerHTML = '';
        const roleIconSpan = document.createElement('span');
        roleIconSpan.textContent = cfg.roleIcon;
        roleIconSpan.className = 'text-lg leading-none';
        mobileRoleBtn.appendChild(roleIconSpan);
      }
      // 更新移动端模板按钮图标
      const mobileTemplateBtn = document.getElementById('chat-m-icon-template');
      if (mobileTemplateBtn) {
        mobileTemplateBtn.innerHTML = '';
        const templateIconSpan = document.createElement('span');
        templateIconSpan.textContent = cfg.templateIcon;
        templateIconSpan.className = 'text-lg leading-none';
        mobileTemplateBtn.appendChild(templateIconSpan);
      }
      showToast('📋 已应用预设模板');
    }
  };


  // ===== 模板/Apps/系列详情 =====
  // 预设模板点击 → 打开模板详情弹窗，记录来源页面
  // 预设模板标签 → 打开模板详情弹窗（各页面通用）
  document.querySelectorAll('.preset-tag').forEach(t=>t.addEventListener('click',function(){pressAnim(this);const name=this.textContent.trim();if(presetTemplates[name])openPresetTemplate(name);else showToast('📋 打开「'+name+'」');}));
  // 图片/视频/音频页的💎预设按钮 → 打开模板详情弹窗
  document.querySelectorAll('.preset-btn').forEach(b=>b.addEventListener('click',function(){pressAnim(this);
    const parent=this.closest('.page-section');
    const pageId=parent?.id?.replace('page-','')||'image';
    const name=this.textContent.trim()+'模板';
    document.getElementById('tm-title').textContent='📋 '+name;
    document.getElementById('tm-desc').textContent='选择一个预设模板快速开始创作';
    document.getElementById('tm-skills').innerHTML='<div class="font-medium text-[10px] text-gray-400 mb-1">适用场景：</div>• 快速生成预设风格内容';
    document.getElementById('tm-model').textContent='—';
    document.getElementById('tm-role').textContent='—';
    document.getElementById('tm-params').textContent='按需调整';
    document.getElementById('tm-example').innerHTML='<div class="text-gray-400 text-center py-2">选择一个模板后即可开始创作</div>';
    document.getElementById('tm-uses').textContent='📊 热门模板';
    document.getElementById('tm-rating').textContent='👍 好评';
    document.getElementById('tm-apply-btn').dataset.template='';
    openModal('template-modal');
  }));
  // 应用模板 → 更新聊天页面
  document.getElementById('tm-apply-btn')?.addEventListener('click',function(){pressAnim(this);
    const name=this.dataset.template;
    const d=presetTemplates[name];
    if(d){
      // 检测当前活动页面
      const activePage=document.querySelector('.page-section.active');
      const pageId=activePage?.id||'';
      // 更新模型选择器（根据当前页面定位）
      if(pageId==='page-chat'){
        const sel=document.querySelector('#page-chat .model-selector');
        if(sel&&d.model)sel.value=d.model;
        if(d.role)selectChatRole(d.role);
        const msgs=document.getElementById('chat-messages');
        if(msgs&&d.welcome){
          var tplBody=(d.welcome||'').replace(/\n/g,'<br>');
          var tplBubble=typeof buildAiMessageBubbleHtml==='function'?buildAiMessageBubbleHtml({label:'🤖 '+d.role,tags:'',bodyHtml:tplBody}):'';
          msgs.innerHTML+='<div class="chat-msg-row chat-msg-row--ai flex justify-start ml-[60px] anim-fade-up"><div class="chat-msg-col chat-msg-col--ai">'+tplBubble+'</div></div>';
          if(typeof placeChatHotAppsStrip==='function')placeChatHotAppsStrip();
          msgs.scrollTop=msgs.scrollHeight;
        }
      } else {
        // 图片/视频/音频页：在该页面中找到包含推荐模型的 select 并更新
        const allSelects=activePage?.querySelectorAll('select');
        if(allSelects&&d.model)allSelects.forEach(s=>{if([...s.options].some(o=>o.textContent===d.model))s.value=d.model;});
        // 图片/视频/音频页额外：填充提示词和参数
        if(pageId==='page-image'||pageId==='page-video'||pageId==='page-audio'){
          const ta=activePage.querySelector('textarea');
          if(ta&&d.prompt)ta.value=d.prompt;
          const pageSelects=activePage.querySelectorAll('select');
          if(pageId==='page-image'&&pageSelects.length>=4){
            if(d.ratio)pageSelects[2].value=d.ratio;
            if(d.quality)pageSelects[3].value=d.quality;
          }
          if(pageId==='page-video'){
            // selects[2]=分辨率, selects[3]=比例(在按钮之后)
            if(d.resolution&&pageSelects[2])pageSelects[2].value=d.resolution;
            if(d.ratio){
              var ratioOpt=[...pageSelects].find(s=>['16:9','9:16','4:3','1:1','21:9'].some(v=>[...s.options].some(o=>o.textContent.includes(v))));
              if(ratioOpt){var match=[...ratioOpt.options].find(o=>o.textContent.includes(d.ratio));if(match)ratioOpt.value=match.textContent;}
            }
          }
        }
      }
    }
    closeModal('template-modal');
    showToast('✅ 模板应用成功');
  });
  document.querySelectorAll('.apps-template,.apps-cat,.template-card,.cat-card').forEach(c=>c.addEventListener('click',function(){pressAnim(this);}));
  // Apps模板弹窗：上传按钮
  document.querySelectorAll('.upload-box').forEach(b=>b.addEventListener('click',function(){pressAnim(this);showToast('📂 打开文件选择器');}));
  // Apps模板弹窗：✨生成 → 显示结果
  document.querySelector('.app-gen-btn')?.addEventListener('click',function(){pressAnim(this);showToast('⏳ 正在生成...');setTimeout(()=>{const p=document.getElementById('atm-preview');const old=p.innerHTML;p.innerHTML=`<div class="w-28 h-28 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center text-gray-400 text-[10px] text-center leading-relaxed">原图</div><div class="text-lg text-gray-400">→</div><div class="w-28 h-28 bg-gradient-to-br from-green-200 to-blue-200 dark:from-green-800/30 dark:to-blue-800/30 rounded-lg flex items-center justify-center text-gray-400 text-[10px] text-center leading-relaxed border-2 border-green-400">生成结果</div><div class="flex gap-2 justify-center col-span-full w-full mt-3"><button onclick="showToast('⬇️ 已下载')" class="text-[10px] px-2 py-1 border rounded hover:bg-gray-50">下载</button><button onclick="document.getElementById('atm-preview').innerHTML=this._old" class="text-[10px] px-2 py-1 border rounded hover:bg-gray-50">重新生成</button><button onclick="showToast('💾 已保存到资产库')" class="text-[10px] px-2 py-1 border rounded hover:bg-gray-50">保存到资产库</button></div>`;p.querySelector('button[onclick*="重新"]')._old=old;showToast('✅ 生成完成');},1500);});
  document.querySelector('.series-more')?.addEventListener('click',function(){pressAnim(this);openModal('series-detail-modal');});

  // ===== 个人中心：我的作品→编辑 =====
  // (已在 profile handler 中处理)

  // ===== 帮助反馈/客服/投诉 =====
  // 个人中心→帮助反馈
  document.querySelectorAll('#page-profile .cursor-pointer').forEach(c=>c.addEventListener('click',function(){pressAnim(this);const t=this.querySelector('.text-sm.font-medium')?.textContent||'';
    if(t.includes('帮助')||t.includes('反馈'))openModal('feedback-modal');
    else if(t.includes('钱包'))showPage('wallet');
    else if(t.includes('作品'))showToast('📋 跳转 /profile/works');
    else if(t.includes('收藏'))showToast('⭐ 跳转 /profile/favorites');
    else if(t.includes('邀请'))openModal('invite-modal');
    else if(t.includes('设置'))showToast('⚙️ 跳转 /profile/settings');
  }));
  document.querySelector('.submit-feedback')?.addEventListener('click',function(){pressAnim(this);showToast('✅ 反馈已提交，感谢您的建议！');closeModal('feedback-modal');});

  // ===== 底部客服入口 =====
  document.querySelectorAll('.help-center,.contact-service').forEach(b=>b?.addEventListener('click',function(){openModal('service-modal');}));

  // Modal backdrop
  document.querySelectorAll('.modal-overlay').forEach(m=>{m.addEventListener('click',function(e){if(e.target===this){this.classList.remove('open');document.body.style.overflow='';}});});
}
// ===== 文字页面附件上传功能 =====
var chatAttachments = []; // 存储附件数据
var maxChatAttachments = 9; // 最多9个附件

// 处理文件选择
window.handleChatFileSelect = function(input) {
  if (!input.files || input.files.length === 0) return;

  var files = Array.from(input.files);

  // 判断当前是否在图片页面
  var isImagePage = document.getElementById('page-image') && !document.getElementById('page-image').classList.contains('hidden');

  if(isImagePage) {
    // 图片页面：添加到参考图区域
    files.forEach(function(file) {
      if(!file.type.startsWith('image/')) {
        showToast('⚠️ 仅支持图片格式');
        return;
      }
      window.addImageRef(file);
    });
    input.value = '';
    return;
  }

  var remaining = maxChatAttachments - chatAttachments.length;

  if (files.length > remaining) {
    showToast('⚠️ 最多还能添加 ' + remaining + ' 个附件');
    files = files.slice(0, remaining);
  }

  files.forEach(function(file) {
    var reader = new FileReader();
    reader.onload = function(e) {
      var attachment = {
        id: 'att_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl: e.target.result
      };
      chatAttachments.push(attachment);
      renderChatAttachments();
      updateChatInputWithAttachments();
    };
    reader.readAsDataURL(file);
  });

  // 清空input以便重复选择同一文件
  input.value = '';
};

// 渲染附件预览
window.renderChatAttachments = function() {
  var area = document.getElementById('chat-attachments-area');
  if (!area) return;
  
  if (chatAttachments.length === 0) {
    area.classList.add('hidden');
    area.innerHTML = '';
    return;
  }
  
  area.classList.remove('hidden');
  area.innerHTML = '';
  
  chatAttachments.forEach(function(att) {
    var div = document.createElement('div');
    div.className = 'chat-attachment-item relative flex items-center gap-1.5 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg';
    div.dataset.id = att.id;
    
    var icon = getAttachmentIcon(att.type, att.name);
    var sizeStr = formatFileSize(att.size);
    
    div.innerHTML = 
      '<span class="text-xs">' + icon + '</span>' +
      '<span class="text-[10px] text-gray-600 dark:text-gray-400 max-w-[80px] truncate">' + att.name + '</span>' +
      '<span class="text-[9px] text-gray-400">' + sizeStr + '</span>' +
      '<button onclick="removeChatAttachment(\'' + att.id + '\')" class="text-gray-400 hover:text-red-500 ml-1">✕</button>';
    
    area.appendChild(div);
  });
};

// 获取附件图标
function getAttachmentIcon(type, name) {
  if (type.startsWith('image/')) return '🖼️';
  if (type.startsWith('audio/')) return '🎵';
  if (type.includes('pdf')) return '📄';
  if (type.includes('word') || name.endsWith('.doc') || name.endsWith('.docx')) return '📝';
  if (type.includes('excel') || name.endsWith('.xls') || name.endsWith('.xlsx')) return '📊';
  if (type.includes('powerpoint') || name.endsWith('.ppt') || name.endsWith('.pptx')) return '📽️';
  if (name.endsWith('.zip') || name.endsWith('.rar') || name.endsWith('.7z')) return '📦';
  return '📎';
}

// 格式化文件大小
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + 'B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'K';
  return (bytes / (1024 * 1024)).toFixed(1) + 'M';
}

// 移除附件
window.removeChatAttachment = function(id) {
  chatAttachments = chatAttachments.filter(function(att) { return att.id !== id; });
  renderChatAttachments();
  updateChatInputWithAttachments();
};

// 更新输入框内容（添加附件引用）
window.updateChatInputWithAttachments = function() {
  var input = document.getElementById('chat-input');
  if (!input) return;
  
  // 如果有附件，在输入框中添加引用文本
  if (chatAttachments.length > 0) {
    var names = chatAttachments.map(function(att) { return att.name; }).join(', ');
    // 不自动修改用户输入，只在提示位置显示
  }
};

// 清除所有附件
window.clearChatAttachments = function() {
  chatAttachments = [];
  renderChatAttachments();
};

// 发送消息时附带附件（用于实际发送逻辑中）
window.getChatAttachmentsData = function() {
  return chatAttachments;
};

// 关闭图片预览弹窗
window.closeImagePreview = function() {
  var overlay = document.getElementById('image-preview-overlay');
  if (overlay) overlay.remove();
  closeImageResultPreview();
};

window.closeImageResultPreview = function() {
  var modal = document.getElementById('image-result-preview');
  if (modal) {
    modal.classList.remove('side-open', 'has-session-strip');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
  if (typeof syncMobilePreviewOpenState === 'function') syncMobilePreviewOpenState();
};

window.closeResultPreviewSide = function(modal) {
  if (modal) modal.classList.remove('side-open');
};

window.toggleResultPreviewSide = function(modal) {
  if (!modal || !window.matchMedia('(max-width: 768px)').matches) return;
  var open = !modal.classList.contains('side-open');
  modal.classList.toggle('side-open', open);
  var toggle = modal.querySelector('.result-preview-side-toggle');
  if (toggle) toggle.setAttribute('aria-label', open ? '收起信息' : '展开信息');
};

function getResultPreviewMobileExtras(kind) {
  var isImage = kind === 'image';
  var closedChevron = isImage
    ? '<polyline points="9 18 15 12 9 6"/>'
    : '<polyline points="15 18 9 12 15 6"/>';
  var openChevron = isImage
    ? '<polyline points="15 18 9 12 15 6"/>'
    : '<polyline points="9 18 15 12 9 6"/>';
  return '<button type="button" class="result-preview-side-toggle" data-action="toggle-side" aria-label="展开信息" title="图片信息">' +
    '<span class="result-preview-side-toggle-icon result-preview-side-toggle-icon--closed"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' + closedChevron + '</svg></span>' +
    '<span class="result-preview-side-toggle-icon result-preview-side-toggle-icon--open"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' + openChevron + '</svg></span>' +
  '</button>' +
  '<div class="result-preview-side-backdrop" data-action="close-side" aria-hidden="true"></div>';
}

function formatPreviewExpiryTime(ts) {
  var d = new Date((ts || Date.now()) + 13 * 24 * 60 * 60 * 1000);
  var pad2 = function(n) { return n < 10 ? '0' + n : '' + n; };
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + pad2(d.getHours()) + ':' + pad2(d.getMinutes()) + ':' + pad2(d.getSeconds());
}

function formatPreviewCostCny(usd) {
  var cny = (parseFloat(usd) || 0) * 7.5;
  if (cny < 0.01 && cny > 0) return '￥0.01';
  return '￥' + cny.toFixed(2);
}

function parseResultCardParams(card) {
  if (!card) return {};
  var paramsEl = card.querySelector('.card-params');
  if (!paramsEl) return {};
  try {
    return JSON.parse(paramsEl.getAttribute('data-params').replace(/&quot;/g, '"'));
  } catch (e) {
    return {};
  }
}

window.previewResultImage = function(imgEl) {
  if (!imgEl) return;
  var card = imgEl.closest('[id^="result-card-"]');
  if (!card) {
    previewImage(imgEl.src);
    return;
  }
  var ctx = buildImageResultPreviewCtx(card.id, parseInt(imgEl.getAttribute('data-image-index') || '0', 10));
  if (ctx) openImageResultPreview(ctx);
};

var IMAGE_RESULT_PREVIEW_VERSION = '8';

function getResultPreviewSessionStripHtml(kind) {
  var isImage = kind === 'image';
  var id = isImage ? 'image-preview-session-strip' : 'video-preview-session-strip';
  var scrollId = isImage ? 'image-preview-session-scroll' : 'video-preview-session-scroll';
  var countId = isImage ? 'image-preview-session-count' : 'video-preview-session-count';
  var title = isImage ? '本次对话 · 图片库' : '本次对话 · 视频库';
  return '<div class="result-preview-session-strip is-empty" id="' + id + '">' +
    '<div class="result-preview-session-strip-head">' +
      '<span class="result-preview-session-strip-title">' + title + '</span>' +
      '<span class="result-preview-session-strip-count" id="' + countId + '"></span>' +
    '</div>' +
    '<div class="result-preview-session-strip-scroll" id="' + scrollId + '" role="list"></div>' +
  '</div>';
}

function collectSessionImagePreviewItems() {
  var container = document.getElementById('image-results-container');
  if (!container) return [];
  var items = [];
  container.querySelectorAll('[id^="result-card-"]').forEach(function(card) {
    card.querySelectorAll('.result-image-main').forEach(function(img, i) {
      items.push({ key: card.id + ':' + i, cardId: card.id, imageIndex: i, thumbSrc: EXAMPLE_PREVIEW_IMAGE });
    });
  });
  return items;
}

function buildImageResultPreviewCtx(cardId, imageIndex) {
  var card = document.getElementById(cardId);
  if (!card) return null;
  var imgs = card.querySelectorAll('.result-image-main');
  if (!imgs.length) return null;
  var idx = Math.max(0, Math.min(parseInt(imageIndex, 10) || 0, imgs.length - 1));
  var imgEl = imgs[idx];
  var params = parseResultCardParams(card);
  var refs = (typeof cardRefImages !== 'undefined' && cardRefImages[cardId]) ? cardRefImages[cardId] : [];
  var promptFromCard = card.querySelector('.result-prompt-body');
  return {
    src: EXAMPLE_PREVIEW_IMAGE,
    cardId: card.id,
    imageIndex: idx,
    prompt: promptFromCard ? promptFromCard.textContent : (params.prompt || ''),
    model: params.model || 'Auto',
    ratio: params.ratio || '16:9',
    quality: params.quality || '2k',
    tier: params.tier || '中',
    genCost: params.genCost,
    genFinishedAt: params.genFinishedAt,
    genTaskId: params.genTaskId || card.id.replace('result-card-', ''),
    refs: refs
  };
}

function renderImagePreviewSessionStrip(modal) {
  var strip = document.getElementById('image-preview-session-strip');
  var scroll = document.getElementById('image-preview-session-scroll');
  var countEl = document.getElementById('image-preview-session-count');
  if (!strip || !scroll || !modal) return;
  var items = collectSessionImagePreviewItems();
  if (!items.length) {
    strip.classList.add('is-empty');
    modal.classList.remove('has-session-strip');
    scroll.innerHTML = '';
    if (countEl) countEl.textContent = '';
    return;
  }
  strip.classList.remove('is-empty');
  modal.classList.add('has-session-strip');
  if (countEl) countEl.textContent = '共 ' + items.length + ' 张';
  var activeKey = (modal.dataset.cardId || '') + ':' + (modal.dataset.imageIndex || '0');
  scroll.innerHTML = items.map(function(item) {
    var active = item.key === activeKey ? ' is-active' : '';
    return '<button type="button" class="result-preview-session-thumb' + active + '" data-card-id="' + item.cardId + '" data-image-index="' + item.imageIndex + '" title="查看图片">' +
      '<img src="' + item.thumbSrc + '" alt="">' +
    '</button>';
  }).join('');
  requestAnimationFrame(function() {
    var activeThumb = scroll.querySelector('.result-preview-session-thumb.is-active');
    if (activeThumb && activeThumb.scrollIntoView) activeThumb.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  });
}

function fillImageResultPreview(modal, ctx) {
  ctx = ctx || {};
  modal.dataset.cardId = ctx.cardId || '';
  modal.dataset.taskId = ctx.genTaskId || '';
  modal.dataset.imageIndex = String(ctx.imageIndex != null ? ctx.imageIndex : 0);
  var mainImg = document.getElementById('image-result-preview-img');
  if (mainImg) mainImg.src = EXAMPLE_PREVIEW_IMAGE;
  document.getElementById('image-preview-prompt').textContent = ctx.prompt || '（无提示词）';
  var refsWrap = document.getElementById('image-preview-refs');
  var refsSection = document.getElementById('image-preview-refs-section');
  var refs = ctx.refs || [];
  if (refs.length > 0) {
    refsSection.classList.remove('hidden');
    refsWrap.innerHTML = refs.map(function(url, i) {
      return '<img src="' + url + '" alt="参考图' + (i + 1) + '" title="参考图' + (i + 1) + '">';
    }).join('');
  } else {
    refsSection.classList.add('hidden');
    refsWrap.innerHTML = '';
  }
  var createdStr = typeof formatGenFinishedTime === 'function' ? formatGenFinishedTime(ctx.genFinishedAt) : '';
  var expiryStr = formatPreviewExpiryTime(ctx.genFinishedAt);
  var costStr = formatPreviewCostCny(ctx.genCost);
  var modelLine = (ctx.model || 'Auto') + ' / ' + (ctx.ratio || '16:9') + ' / ' + (ctx.quality || '2k') + ' / 质量：' + (ctx.tier || '中');
  var taskId = ctx.genTaskId || '';
  var esc = typeof escapeHtml === 'function' ? escapeHtml : function(s) { return String(s || ''); };
  document.getElementById('image-preview-meta').innerHTML =
    '<div class="meta-line">' + esc(modelLine) + '</div>' +
    '<div class="meta-line">任务消耗：' + costStr + ' 钱包</div>' +
    '<div class="meta-line flex items-center gap-1 flex-wrap">Taskid: <span class="font-mono text-[10px]">' + esc(taskId) + '</span>' +
      '<button type="button" class="image-result-preview-copy !p-0.5" data-action="copy-taskid" title="复制 Task ID"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>' +
    '<div class="meta-line">创作时间：' + esc(createdStr) + '</div>' +
    '<div class="meta-line">过期时间：' + esc(expiryStr) + '</div>';
  renderImagePreviewSessionStrip(modal);
}

function getImageResultPreviewHtml() {
  return '<div class="result-preview-body">' +
    '<div class="image-result-preview-main" id="image-result-preview-main">' +
      '<img id="image-result-preview-img" src="" alt="生成结果预览">' +
    '</div>' +
    getResultPreviewMobileExtras('image') +
    '<aside class="image-result-preview-side">' +
      '<button type="button" class="image-result-preview-close" data-action="close" title="关闭"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>' +
      '<div class="image-result-preview-actions">' +
        '<button type="button" data-action="download" title="下载"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>' +
        '<div class="image-result-preview-actions-right">' +
          '<button type="button" data-action="publish" title="发布"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></button>' +
          '<button type="button" data-action="delete" title="删除"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>' +
        '</div>' +
      '</div>' +
      '<div class="image-result-preview-divider"></div>' +
      '<div class="image-result-preview-scroll">' +
        '<section class="image-result-preview-section" id="image-preview-refs-section">' +
          '<h4>参考图</h4>' +
          '<div class="image-result-preview-ref" id="image-preview-refs"></div>' +
        '</section>' +
        '<section class="image-result-preview-section">' +
          '<div class="flex items-center justify-between gap-2 mb-2">' +
            '<h4 class="!mb-0">图片提示词</h4>' +
            '<button type="button" class="image-result-preview-copy" data-action="copy-prompt"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>复制提示词</button>' +
          '</div>' +
          '<p class="image-result-preview-prompt" id="image-preview-prompt"></p>' +
        '</section>' +
        '<section class="image-result-preview-section">' +
          '<div class="flex items-center justify-between gap-2 mb-2">' +
            '<h4 class="!mb-0">参数配置</h4>' +
            '<span class="image-result-preview-tag shrink-0">图片制作</span>' +
          '</div>' +
          '<div class="image-result-preview-meta" id="image-preview-meta"></div>' +
        '</section>' +
      '</div>' +
      '<div class="image-result-preview-footer">' +
        '<button type="button" class="btn-readjust" data-action="readjust">重新编辑</button>' +
        '<button type="button" class="btn-regen" data-action="regen"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>再次生成</button>' +
      '</div>' +
    '</aside>' +
  '</div>' +
  getResultPreviewSessionStripHtml('image');
}

function bindImageResultPreviewEvents(modal) {
  if (!modal || modal.dataset.eventsBound === '1') return;
  modal.dataset.eventsBound = '1';
  modal.addEventListener('click', function(e) {
    var sessionThumb = e.target.closest('.result-preview-session-thumb');
    if (sessionThumb && modal.contains(sessionThumb)) {
      var thumbCardId = sessionThumb.getAttribute('data-card-id');
      var thumbIdx = parseInt(sessionThumb.getAttribute('data-image-index') || '0', 10);
      var thumbCtx = buildImageResultPreviewCtx(thumbCardId, thumbIdx);
      if (thumbCtx) fillImageResultPreview(modal, thumbCtx);
      return;
    }
    var refImg = e.target.closest('#image-preview-refs img');
    if (refImg && refImg.src) {
      var mainImg = document.getElementById('image-result-preview-img');
      if (mainImg) mainImg.src = refImg.src;
      return;
    }
    var btn = e.target.closest('[data-action]');
    if (!btn || !modal.contains(btn)) return;
    var action = btn.getAttribute('data-action');
    var cardId = modal.dataset.cardId;
    if (action === 'close') closeImageResultPreview();
    else if (action === 'toggle-side') toggleResultPreviewSide(modal);
    else if (action === 'close-side') closeResultPreviewSide(modal);
    else if (action === 'download') {
      if (cardId) {
        var cardDl = document.getElementById(cardId);
        var dlBtn = cardDl && cardDl.querySelector('button[title="下载"]');
        if (dlBtn) downloadResultImage(dlBtn);
        else showToast('💾 图片已保存');
      } else showToast('💾 图片已保存');
    } else if (action === 'publish') {
      if (cardId) {
        var cardPub = document.getElementById(cardId);
        var pubBtn = cardPub && cardPub.querySelector('button[title="发布"]');
        if (pubBtn) publishResultImage(pubBtn);
        else showToast('📤 打开发布');
      } else showToast('📤 打开发布');
    } else if (action === 'delete' && cardId) {
      var cardEl = document.getElementById(cardId);
      var delIdx = parseInt(modal.dataset.imageIndex || '0', 10);
      var targetWrap = cardEl ? cardEl.querySelectorAll('.result-image-wrap')[delIdx] : null;
      if (targetWrap) {
        targetWrap.remove();
        if (typeof window.removeResultImageFromCard === 'function') {
          window.removeResultImageFromCard(cardEl, delIdx);
        } else {
          closeImageResultPreview();
          deleteResultCard(cardId);
        }
      } else {
        closeImageResultPreview();
        deleteResultCard(cardId);
      }
    } else if (action === 'copy-prompt') {
      var promptEl = document.getElementById('image-preview-prompt');
      var text = promptEl ? promptEl.textContent : '';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function() { showToast('📋 提示词已复制'); }).catch(function() { showToast('📋 提示词已复制'); });
      } else showToast('📋 提示词已复制');
    } else if (action === 'copy-taskid') {
      var tid = modal.dataset.taskId || '';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(tid).then(function() { showToast('📋 Task ID 已复制'); }).catch(function() { showToast('📋 Task ID 已复制'); });
      } else showToast('📋 Task ID 已复制');
    } else if (action === 'readjust' && cardId) {
      closeImageResultPreview();
      reEditImage(cardId);
    } else if (action === 'regen' && cardId) {
      closeImageResultPreview();
      regenerateImage(cardId);
    }
  });
  var mainPanel = modal.querySelector('.image-result-preview-main');
  if (mainPanel) {
    mainPanel.addEventListener('click', function(e) {
      if (e.target !== mainPanel) return;
      if (modal.classList.contains('side-open') && window.matchMedia('(max-width: 768px)').matches) {
        closeResultPreviewSide(modal);
        return;
      }
      closeImageResultPreview();
    });
  }
}

function ensureImageResultPreviewModal() {
  var modal = document.getElementById('image-result-preview');
  var needsRebuild = !modal || modal.dataset.version !== IMAGE_RESULT_PREVIEW_VERSION || !modal.querySelector('.result-preview-side-toggle');
  if (needsRebuild) {
    if (modal) modal.remove();
    modal = document.createElement('div');
    modal.id = 'image-result-preview';
    modal.className = 'image-result-preview hidden';
    modal.dataset.version = IMAGE_RESULT_PREVIEW_VERSION;
    modal.innerHTML = getImageResultPreviewHtml();
    bindImageResultPreviewEvents(modal);
    document.body.appendChild(modal);
  }
  return modal;
}

window.openImageResultPreview = function(ctx) {
  closeImagePreview();
  var modal = ensureImageResultPreviewModal();
  fillImageResultPreview(modal, ctx || {});
  modal.classList.remove('hidden');
  modal.classList.remove('side-open');
  document.body.style.overflow = 'hidden';
  if (typeof setMobilePreviewOpen === 'function' && window.matchMedia && window.matchMedia('(max-width:768px)').matches) {
    setMobilePreviewOpen(true);
  }
};

// 预览图片（参考图、聊天附件等 — 轻量预览）
window.previewImage = function(src) {
  closeImageResultPreview();
  var overlay = document.createElement('div');
  overlay.id = 'image-preview-overlay';
  overlay.className = 'fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center';
  overlay.onclick = function(e) { if (e.target === overlay) closeImagePreview(); };

  var wrap = document.createElement('div');
  wrap.className = 'relative flex flex-col items-center max-w-[90vw] max-h-[90vh]';

  var closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'absolute -top-10 right-0 text-white/70 hover:text-white text-2xl transition leading-none';
  closeBtn.setAttribute('aria-label', '关闭');
  closeBtn.innerHTML = '&times;';
  closeBtn.onclick = function(e) { e.stopPropagation(); closeImagePreview(); };

  var img = document.createElement('img');
  img.src = EXAMPLE_PREVIEW_IMAGE;
  img.alt = '图片预览';
  img.className = 'max-w-[90vw] max-h-[90vh] rounded-lg object-contain';
  img.onclick = function(e) { e.stopPropagation(); };

  wrap.appendChild(closeBtn);
  wrap.appendChild(img);
  overlay.appendChild(wrap);
  document.body.appendChild(overlay);
};

function buildDemoVideoPosterUrl(label, colorHex) {
  return EXAMPLE_PREVIEW_IMAGE;
}

window.closeVideoResultPreview = function() {
  var modal = document.getElementById('video-result-preview');
  if (modal) {
    var videoEl = document.getElementById('video-result-preview-video');
    if (videoEl) {
      videoEl.pause();
      videoEl.removeAttribute('src');
      videoEl.load();
    }
    modal.classList.remove('side-open', 'has-session-strip');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
  if (typeof syncMobilePreviewOpenState === 'function') syncMobilePreviewOpenState();
};

window.previewResultVideo = function(el) {
  if (!el) return;
  var card = el.closest('[id^="video-result-card-"]');
  if (!card) {
    showToast('▶ 播放视频（演示）');
    return;
  }
  var ctx = buildVideoResultPreviewCtx(card.id, parseInt(el.getAttribute('data-video-index') || '0', 10));
  if (ctx) openVideoResultPreview(ctx);
};

var VIDEO_RESULT_PREVIEW_VERSION = '5';

function collectSessionVideoPreviewItems() {
  var container = document.getElementById('video-results-container');
  if (!container) return [];
  var items = [];
  container.querySelectorAll('[id^="video-result-card-"]').forEach(function(card) {
    card.querySelectorAll('.result-video-slot').forEach(function(slot, i) {
      items.push({ key: card.id + ':' + i, cardId: card.id, videoIndex: i, thumbSrc: EXAMPLE_PREVIEW_IMAGE });
    });
  });
  return items;
}

function buildVideoResultPreviewCtx(cardId, videoIndex) {
  var card = document.getElementById(cardId);
  if (!card) return null;
  var slots = card.querySelectorAll('.result-video-slot');
  if (!slots.length) return null;
  var idx = Math.max(0, Math.min(parseInt(videoIndex, 10) || 0, slots.length - 1));
  var slot = slots[idx];
  var params = parseResultCardParams(card);
  var refs = cardVideoRefImages[cardId] || [];
  var poster = slot.getAttribute('data-video-poster') || EXAMPLE_PREVIEW_IMAGE;
  var videoSrc = slot.getAttribute('data-video-src') || EXAMPLE_PREVIEW_VIDEO;
  return {
    poster: poster,
    src: videoSrc,
    cardId: card.id,
    videoIndex: idx,
    prompt: (card.querySelector('.result-prompt-body') && card.querySelector('.result-prompt-body').textContent) || params.prompt || '',
    model: params.model || 'Auto',
    mode: params.mode || '',
    ratio: params.ratio || '16:9',
    duration: params.duration || '4秒',
    quality: params.quality || '480p',
    realPerson: params.realPerson || '关闭',
    audio: params.audio || '关闭',
    genCost: params.genCost,
    genFinishedAt: params.genFinishedAt,
    genTaskId: params.genTaskId || card.id.replace('video-result-card-', ''),
    refs: refs
  };
}

function renderVideoPreviewSessionStrip(modal) {
  var strip = document.getElementById('video-preview-session-strip');
  var scroll = document.getElementById('video-preview-session-scroll');
  var countEl = document.getElementById('video-preview-session-count');
  if (!strip || !scroll || !modal) return;
  var items = collectSessionVideoPreviewItems();
  if (!items.length) {
    strip.classList.add('is-empty');
    modal.classList.remove('has-session-strip');
    scroll.innerHTML = '';
    if (countEl) countEl.textContent = '';
    return;
  }
  strip.classList.remove('is-empty');
  modal.classList.add('has-session-strip');
  if (countEl) countEl.textContent = '共 ' + items.length + ' 个';
  var activeKey = (modal.dataset.cardId || '') + ':' + (modal.dataset.videoIndex || '0');
  scroll.innerHTML = items.map(function(item) {
    var active = item.key === activeKey ? ' is-active' : '';
    return '<button type="button" class="result-preview-session-thumb' + active + '" data-card-id="' + item.cardId + '" data-video-index="' + item.videoIndex + '" title="查看视频">' +
      '<img src="' + item.thumbSrc + '" alt="">' +
      '<span class="session-thumb-play" aria-hidden="true">▶</span>' +
    '</button>';
  }).join('');
  requestAnimationFrame(function() {
    var activeThumb = scroll.querySelector('.result-preview-session-thumb.is-active');
    if (activeThumb && activeThumb.scrollIntoView) activeThumb.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  });
}

function fillVideoResultPreview(modal, ctx) {
  ctx = ctx || {};
  modal.dataset.cardId = ctx.cardId || '';
  modal.dataset.taskId = ctx.genTaskId || '';
  modal.dataset.videoIndex = String(ctx.videoIndex != null ? ctx.videoIndex : 0);
  var videoEl = document.getElementById('video-result-preview-video');
  if (videoEl) {
    videoEl.pause();
    videoEl.src = EXAMPLE_PREVIEW_VIDEO;
    videoEl.poster = EXAMPLE_PREVIEW_IMAGE;
    videoEl.load();
  }
  document.getElementById('video-preview-prompt').textContent = ctx.prompt || '（无提示词）';
  var refsWrap = document.getElementById('video-preview-refs');
  var refsSection = document.getElementById('video-preview-refs-section');
  var refs = ctx.refs || [];
  if (refs.length > 0) {
    refsSection.classList.remove('hidden');
    refsWrap.innerHTML = renderVideoPreviewRefs(refs);
  } else {
    refsSection.classList.add('hidden');
    refsWrap.innerHTML = '';
  }
  var createdStr = typeof formatGenFinishedTime === 'function' ? formatGenFinishedTime(ctx.genFinishedAt) : '';
  var expiryStr = formatPreviewExpiryTime(ctx.genFinishedAt);
  var costStr = formatPreviewCostCny(ctx.genCost);
  var audioLabel = ctx.audio === '开启' ? '有配音' : '无配音';
  var modelLine = (ctx.model || 'Auto') + ' / ' + (ctx.ratio || '16:9') + ' / ' + (ctx.duration || '4秒') + ' / ' + (ctx.quality || '480p') + ' / ' + audioLabel;
  if (ctx.realPerson && ctx.realPerson !== '关闭') modelLine += ' / 真人：' + ctx.realPerson;
  var taskId = ctx.genTaskId || '';
  var esc = typeof escapeHtml === 'function' ? escapeHtml : function(s) { return String(s || ''); };
  document.getElementById('video-preview-meta').innerHTML =
    '<div class="meta-line">' + esc(modelLine) + '</div>' +
    '<div class="meta-line">任务消耗：' + costStr + ' 钱包</div>' +
    '<div class="meta-line flex items-center gap-1 flex-wrap">Taskid: <span class="font-mono text-[10px]">' + esc(taskId) + '</span>' +
      '<button type="button" class="video-result-preview-copy !p-0.5" data-action="copy-taskid" title="复制 Task ID"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>' +
    '<div class="meta-line">创作时间：' + esc(createdStr) + '</div>' +
    '<div class="meta-line">过期时间：' + esc(expiryStr) + '</div>';
  renderVideoPreviewSessionStrip(modal);
}

function getVideoResultPreviewHtml() {
  return '<div class="result-preview-body">' +
    '<div class="video-result-preview-main" id="video-result-preview-main">' +
      '<video id="video-result-preview-video" controls playsinline poster="" class="max-w-full max-h-full"></video>' +
    '</div>' +
    getResultPreviewMobileExtras('video') +
    '<aside class="video-result-preview-side">' +
      '<button type="button" class="video-result-preview-close" data-action="close" title="关闭"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>' +
      '<div class="video-result-preview-actions">' +
        '<button type="button" data-action="download" title="下载"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>' +
        '<div class="video-result-preview-actions-right">' +
          '<button type="button" data-action="publish" title="发布"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></button>' +
          '<button type="button" data-action="delete" title="删除"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>' +
        '</div>' +
      '</div>' +
      '<div class="video-result-preview-divider"></div>' +
      '<div class="video-result-preview-scroll">' +
        '<section class="video-result-preview-section" id="video-preview-refs-section">' +
          '<h4>参考素材</h4>' +
          '<div class="video-result-preview-ref" id="video-preview-refs"></div>' +
        '</section>' +
        '<section class="video-result-preview-section">' +
          '<div class="flex items-center justify-between gap-2 mb-2">' +
            '<h4 class="!mb-0">视频提示词</h4>' +
            '<button type="button" class="video-result-preview-copy" data-action="copy-prompt"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>复制提示词</button>' +
          '</div>' +
          '<p class="video-result-preview-prompt" id="video-preview-prompt"></p>' +
        '</section>' +
        '<section class="video-result-preview-section">' +
          '<div class="flex items-center justify-between gap-2 mb-2">' +
            '<h4 class="!mb-0">参数配置</h4>' +
            '<span class="video-result-preview-tag shrink-0">视频创作</span>' +
          '</div>' +
          '<div class="video-result-preview-meta" id="video-preview-meta"></div>' +
        '</section>' +
      '</div>' +
      '<div class="video-result-preview-footer">' +
        '<button type="button" class="btn-readjust" data-action="readjust">重新编辑</button>' +
        '<button type="button" class="btn-regen" data-action="regen"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>再次生成</button>' +
      '</div>' +
    '</aside>' +
  '</div>' +
  getResultPreviewSessionStripHtml('video');
}

function renderVideoPreviewRefs(refs) {
  if (!refs || !refs.length) return '';
  var icons = { image: '🖼️', video: '🎬', audio: '🎵' };
  return refs.map(function(ref, i) {
    if (ref.type === 'image' && ref.dataUrl) {
      return '<img src="' + ref.dataUrl + '" alt="参考图' + (i + 1) + '" title="参考图' + (i + 1) + '" data-ref-index="' + i + '" data-ref-type="image">';
    }
    var icon = icons[ref.type] || '📎';
    var thumbStyle = ref.dataUrl && ref.type !== 'audio'
      ? ' style="background-image:url(' + ref.dataUrl + ');background-size:cover;background-position:center"'
      : '';
    return '<div class="ref-thumb" data-ref-index="' + i + '" data-ref-type="' + (ref.type || 'image') + '" title="' + (ref.name || '参考素材') + '"' + thumbStyle + '>' + icon + '</div>';
  }).join('');
}

function applyVideoPreviewRef(modal, ref) {
  if (!ref) return;
  var videoEl = document.getElementById('video-result-preview-video');
  if (!videoEl) return;
  if (ref.type === 'video' && ref.dataUrl) {
    videoEl.src = ref.dataUrl;
    videoEl.poster = ref.dataUrl;
    videoEl.play().catch(function() {});
  } else if (ref.type === 'image' && ref.dataUrl) {
    videoEl.removeAttribute('src');
    videoEl.poster = ref.dataUrl;
    videoEl.load();
  } else if (ref.dataUrl) {
    videoEl.removeAttribute('src');
    videoEl.poster = ref.dataUrl;
    videoEl.load();
  } else {
    showToast('▶ ' + (ref.name || '参考素材'));
  }
}

function bindVideoResultPreviewEvents(modal) {
  if (!modal || modal.dataset.eventsBound === '1') return;
  modal.dataset.eventsBound = '1';
  modal.addEventListener('click', function(e) {
    var sessionThumb = e.target.closest('.result-preview-session-thumb');
    if (sessionThumb && modal.contains(sessionThumb)) {
      var thumbCardId = sessionThumb.getAttribute('data-card-id');
      var thumbIdx = parseInt(sessionThumb.getAttribute('data-video-index') || '0', 10);
      var thumbCtx = buildVideoResultPreviewCtx(thumbCardId, thumbIdx);
      if (thumbCtx) fillVideoResultPreview(modal, thumbCtx);
      return;
    }
    var refEl = e.target.closest('#video-preview-refs [data-ref-index]');
    if (refEl) {
      var cardId = modal.dataset.cardId;
      var refs = cardId ? (cardVideoRefImages[cardId] || []) : [];
      var idx = parseInt(refEl.getAttribute('data-ref-index') || '0', 10);
      applyVideoPreviewRef(modal, refs[idx]);
      return;
    }
    var btn = e.target.closest('[data-action]');
    if (!btn || !modal.contains(btn)) return;
    var action = btn.getAttribute('data-action');
    var cardId = modal.dataset.cardId;
    if (action === 'close') closeVideoResultPreview();
    else if (action === 'toggle-side') toggleResultPreviewSide(modal);
    else if (action === 'close-side') closeResultPreviewSide(modal);
    else if (action === 'download') {
      if (cardId) {
        var cardDl = document.getElementById(cardId);
        var slot = cardDl && cardDl.querySelector('[data-video-index]');
        if (slot && typeof downloadResultVideo === 'function') downloadResultVideo(slot);
        else showToast('⬇️ 开始下载视频...');
      } else showToast('⬇️ 开始下载视频...');
    } else if (action === 'publish') {
      if (cardId) {
        var cardPub = document.getElementById(cardId);
        var pubSlot = cardPub && cardPub.querySelector('[data-video-index]');
        if (pubSlot && typeof publishResultVideo === 'function') publishResultVideo(pubSlot);
        else showToast('📤 打开发布');
      } else showToast('📤 打开发布');
    } else if (action === 'delete' && cardId) {
      closeVideoResultPreview();
      if (typeof deleteVideoResultCard === 'function') deleteVideoResultCard(cardId);
    } else if (action === 'copy-prompt') {
      var promptEl = document.getElementById('video-preview-prompt');
      var text = promptEl ? promptEl.textContent : '';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function() { showToast('📋 提示词已复制'); }).catch(function() { showToast('📋 提示词已复制'); });
      } else showToast('📋 提示词已复制');
    } else if (action === 'copy-taskid') {
      var tid = modal.dataset.taskId || '';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(tid).then(function() { showToast('📋 Task ID 已复制'); }).catch(function() { showToast('📋 Task ID 已复制'); });
      } else showToast('📋 Task ID 已复制');
    } else if (action === 'readjust' && cardId) {
      closeVideoResultPreview();
      if (typeof reEditVideo === 'function') reEditVideo(cardId);
    } else if (action === 'regen' && cardId) {
      closeVideoResultPreview();
      if (typeof regenerateVideo === 'function') regenerateVideo(cardId);
    }
  });
  var mainPanel = modal.querySelector('.video-result-preview-main');
  if (mainPanel) {
    mainPanel.addEventListener('click', function(e) {
      if (e.target !== mainPanel) return;
      if (modal.classList.contains('side-open') && window.matchMedia('(max-width: 768px)').matches) {
        closeResultPreviewSide(modal);
        return;
      }
      closeVideoResultPreview();
    });
  }
}

function ensureVideoResultPreviewModal() {
  var modal = document.getElementById('video-result-preview');
  var needsRebuild = !modal || modal.dataset.version !== VIDEO_RESULT_PREVIEW_VERSION || !modal.querySelector('.result-preview-side-toggle');
  if (needsRebuild) {
    if (modal) modal.remove();
    modal = document.createElement('div');
    modal.id = 'video-result-preview';
    modal.className = 'video-result-preview hidden';
    modal.dataset.version = VIDEO_RESULT_PREVIEW_VERSION;
    modal.innerHTML = getVideoResultPreviewHtml();
    bindVideoResultPreviewEvents(modal);
    document.body.appendChild(modal);
  }
  return modal;
}

window.openVideoResultPreview = function(ctx) {
  if (typeof closeVideoPreview === 'function') closeVideoPreview();
  closeImageResultPreview();
  var modal = ensureVideoResultPreviewModal();
  fillVideoResultPreview(modal, ctx || {});
  modal.classList.remove('hidden');
  modal.classList.remove('side-open');
  document.body.style.overflow = 'hidden';
  if (typeof setMobilePreviewOpen === 'function' && window.matchMedia && window.matchMedia('(max-width:768px)').matches) {
    setMobilePreviewOpen(true);
  }
};

bindEvents();
if(typeof syncProfilePasswordStatus==='function') syncProfilePasswordStatus();
if(typeof bindMediaSheetBody==='function')bindMediaSheetBody();
if(typeof resetMediaToolbarDropdowns==='function')resetMediaToolbarDropdowns();
window.addEventListener('resize', function() {
  if (!window.matchMedia('(max-width: 768px)').matches) {
    var imgPrev = document.getElementById('image-result-preview');
    var vidPrev = document.getElementById('video-result-preview');
    if (imgPrev) imgPrev.classList.remove('side-open');
    if (vidPrev) vidPrev.classList.remove('side-open');
    if(typeof resetMediaToolbarDropdowns==='function')resetMediaToolbarDropdowns();
  }
  if(typeof syncMediaDockPadding==='function') syncMediaDockPadding('all');
});
requestAnimationFrame(function() {
  if(typeof syncMediaDockPadding==='function') syncMediaDockPadding('all');
  if(typeof updateVideoOutputParamsLabel==='function') updateVideoOutputParamsLabel();
  if(typeof updateImageOutputParamsLabel==='function') updateImageOutputParamsLabel();
  if(typeof updateVideoGenCost==='function') updateVideoGenCost();
});
// 初始化公告渲染
renderAnnounceList();
renderAnnounceModal();
renderNotifList(notifData);
// ESC 关闭预览弹窗
document.addEventListener('keydown',function(e){
  if(e.key==='Escape') {
    closeVideoPreview();
    closeVideoResultPreview();
    closeImagePreview();
    closeImageResultPreview();
    if(typeof closeAllModals==='function') closeAllModals();
  }
});
// 启动时清理可能挡住顶栏的残留遮罩，并同步浮层显隐
if(typeof closeAllModals==='function') closeAllModals();
var _initPage=document.querySelector('.page-section.active');
if(typeof syncPageFloatingLayers==='function'&&_initPage){
  syncPageFloatingLayers(_initPage.id.replace('page-',''));
}
if(typeof syncMobileBottomNav==='function'){
  syncMobileBottomNav(typeof getActivePageId==='function'?getActivePageId():'homepage');
}
['asset-library-overlay','publish-overlay','image-preview-overlay','asset-media-preview-overlay'].forEach(function(id){
  var el=document.getElementById(id);
  if(el) el.remove();
});
document.querySelectorAll('.modal-overlay.open').forEach(function(m){m.classList.remove('open');});
document.body.style.overflow='';
console.log('GUID.AI UI v14.0 loaded — all controls aligned with spec');
