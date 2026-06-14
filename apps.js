(function () {
  'use strict';

  var APPS_DATA = [
    {
      id: 'index-tts2-voice',
      cat: '音频',
      catKey: 'audio',
      icon: '🎙️',
      name: 'IndexTTS2-语音克隆',
      desc: 'IndexTTS2 语音克隆，支持双人对话、情感沟通与文本描述音色迁移',
      price: '⚡0.7',
      uses: '61.6k',
      rating: '4.9',
      featured: true,
      hot: true,
      official: true,
      featuredCurated: true,
      curatedMedia: true,
      likes: '204',
      comments: '10',
      gradient: 'linear-gradient(135deg,#312e81,#2563eb)',
      tags: ['语音克隆', '双人对话', '情感迁移'],
      successRate: 97,
      avgDurationSec: 58,
      collectFav: 204,
      collectComment: 922,
      worksCount: 0,
      commentTabCount: 10,
      creatorName: '大海向C',
      creatorDate: '2024.04.03 更新',
      defaultVoiceText: '这是一段用于语音克隆的参考文本，请保持语速自然、吐字清晰，支持中英文混读。',
      defaultEmotion: '那最好',
      introHtml: '<p><strong>IndexTTS2 · 语音克隆</strong></p><p>支持<strong>双人对话</strong>、情感沟通，以及通过文本描述进行音色迁移。上传克隆参考音频与对应文本，可补充情感描述以控制语气。</p><h4>输入建议</h4><ul><li>克隆音频：干净干声，少混响与背景噪声</li><li>语音文本：与参考音频内容尽量一致</li><li>情感描述：如「温柔」「兴奋」「那最好」等短句</li></ul><p class="oiws-intro-link">📺 使用教程（演示）：详见应用广场说明文档</p>',
      officialSamples: [
        {
          gradient: 'linear-gradient(135deg,#312e81,#4c1d95)',
          bannerTitle: 'IndexTTS2',
          bannerSubtitle: '语音克隆'
        }
      ]
    },
    {
      id: 'short-drama-full',
      cat: '视频',
      catKey: 'video',
      icon: '🎬',
      name: '短剧生成全流程',
      desc: '多分钟分镜图 + 图生视频，上传角色与剧情后一键生成分镜提示词、分镜图与短视频片段',
      price: '⚡0.7',
      uses: '8.5k',
      rating: '4.9',
      featured: true,
      hot: true,
      official: true,
      curatedMedia: true,
      likes: '12',
      comments: '0',
      gradient: 'linear-gradient(135deg,#0f172a,#14532d)',
      tags: ['图生视频', '分镜生成'],
      successRate: 96,
      avgDurationSec: 180,
      collectFav: 12,
      collectComment: 53,
      worksCount: 0,
      commentTabCount: 0,
      creatorName: '数智AIGC',
      creatorDate: '2024.05.07 更新',
      defaultPlot: '刘峰，男，28岁，互联网公司产品经理。性格内敛但观察力敏锐，因一次意外卷入都市悬疑事件。故事从雨夜加班回家开始，他在地铁站遇见神秘女子，随后收到一封没有寄件人的旧照片，照片里是十年前的自己与一群陌生人站在废弃工厂前……',
      introHtml: '<p><strong>短剧生成全流程</strong>（多分钟图 + 图生视频）</p><ol class="oiws-intro-steps"><li><strong>第一步：</strong>上传人物角色图</li><li><strong>第二步：</strong>输入剧情描述</li><li><strong>第三步：</strong>生成分镜提示词 + 分镜图 + 视频短片</li></ol><p class="oiws-intro-note">可在左侧选择图片尺寸后点击运行。</p>',
      officialSamples: [
        {
          gradient: 'linear-gradient(180deg,#0f172a 0%,#1e293b 50%,#14532d 100%)',
          bannerTitle: '短剧生成全流程',
          bannerSubtitle: '一键出25分钟+15秒视频',
          bannerBadge: '图生视频 · 分镜生成'
        }
      ]
    },
    {
      id: 'ltx2-digital-human-lipsync',
      cat: '视频',
      catKey: 'video',
      icon: '🧑‍💻',
      name: '一键生成数字人制作表情口型同步',
      desc: 'LTX-2 数字人：上传音频与人像，一键生成表情与口型同步视频',
      price: '⚡0.7',
      uses: '2.4k',
      rating: '4.9',
      featured: true,
      hot: true,
      official: true,
      curatedMedia: true,
      likes: '3',
      comments: '1',
      gradient: 'linear-gradient(135deg,#1e1b4b,#312e81)',
      tags: ['其他视频处理', '面部视频', '数字人'],
      successRate: 98,
      avgDurationSec: 42,
      collectFav: 3,
      collectComment: 12,
      worksCount: 0,
      commentTabCount: 1,
      creatorName: 'AI世间创作',
      creatorDate: '2024.08.31 更新',
      introHtml: '<p><strong>LTX-2 · 数字人口型同步</strong></p><p>上传<strong>驱动音频</strong>与<strong>人像参考图</strong>，自动生成表情、口型与头部微动一致的视频。</p><ol class="oiws-intro-steps"><li><strong>第一步：</strong>上传清晰干声音频（建议 10s 内）</li><li><strong>第二步：</strong>上传正面人像，五官无遮挡</li><li><strong>第三步：</strong>点击运行，等待口型同步结果</li></ol><p class="oiws-intro-note">人像建议正面、光线均匀；音频避免背景音乐与混响。</p>',
      officialSamples: [
        {
          gradient: 'linear-gradient(135deg,#1e1b4b,#4338ca)',
          coverImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=720&q=80&auto=format&fit=crop',
          bannerVideo: 'https://www.w3schools.com/html/mov_bbb.mp4'
        }
      ]
    },
    {
      id: 'heartmula-song-voice',
      cat: '音频',
      catKey: 'audio',
      icon: '🎵',
      name: 'HeartMula 文生歌曲 + 音色克隆',
      desc: '一句话生成一首歌，支持上传参考音色克隆，儿歌/流行等多风格',
      price: '⚡0.7',
      uses: '150',
      rating: '4.9',
      featured: true,
      hot: true,
      official: true,
      curatedMedia: true,
      likes: '4',
      comments: '0',
      gradient: 'linear-gradient(135deg,#1e3a8a,#2563eb)',
      tags: ['音乐生成'],
      successRate: 97,
      avgDurationSec: 90,
      collectFav: 4,
      collectComment: 18,
      worksCount: 0,
      commentTabCount: 0,
      creatorName: '超级消息AIFSH',
      creatorDate: '2024.01.21 更新',
      songTheme: '孤独的小鸭在云',
      songGenre: '儿歌',
      songLanguage: '中文',
      introHtml: '<p><strong>HeartMula 文生歌曲 + 音色克隆</strong></p><p>运用介绍&amp;输入建议：一句话生成一首歌，可上传<strong>参考音色</strong>进行克隆。</p><p class="oiws-intro-link">0121 heartmula文生歌曲工作流（需解压后导入）.zip</p><p class="oiws-intro-link">夸克链接：<a href="https://pan.quark.cn/s/a6dd47747d23" target="_blank" rel="noopener">https://pan.quark.cn/s/a6dd47747d23</a></p>',
      officialSamples: [
        {
          gradient: 'linear-gradient(135deg,#eff6ff,#dbeafe)',
          coverImage: 'assets/heartmula-banner.png'
        }
      ],
      publicWorks: []
    },
    {
      id: 'seedance20-ref-real',
      cat: '视频',
      catKey: 'video',
      icon: '🎬',
      name: 'Seedance2.0 | 全能参考 · 支持真人',
      desc: 'Seedance 2.0 全能参考模式，上传角色卡与故事板，固定视频参考生成，支持真人角色一致性',
      price: '⚡0.7',
      uses: '19',
      rating: '4.9',
      featured: true,
      hot: true,
      official: true,
      curatedMedia: true,
      likes: '0',
      comments: '0',
      gradient: 'linear-gradient(135deg,#1c1917,#78716c)',
      tags: ['创作大赛2025', '固定视频', '角色一致性'],
      successRate: 97,
      avgDurationSec: 120,
      collectFav: 0,
      collectComment: 4,
      worksCount: 0,
      commentTabCount: 0,
      creatorName: 'Cdd | AIGC',
      creatorDate: '2024.08.25 更新',
      defaultPrompt: '图一角色A，图二角色B，严格按照图三故事板的分镜执行，总时长10秒。角色外观锁定图一和图二，场景锁定海岸公路，保持角色和车辆一致性。',
      introHtml: '<p><strong>Seedance 2.0 | 全能参考 · 支持真人</strong></p><p>运用介绍&amp;输入建议：上传<strong>角色卡</strong>与<strong>故事板</strong>参考，选择比例、分辨率与时长后生成视频；支持真人角色与固定视频参考模式。</p><p class="oiws-intro-link">📄 API 费用说明 · 角色卡设计指南 · 故事板通用说明（演示文档链接）</p><p class="oiws-intro-note">角色卡建议正面清晰无遮挡；故事板按分镜顺序上传关键帧。</p>',
      officialSamples: [
        {
          gradient: 'linear-gradient(180deg,#0a0a0a,#292524)',
          coverImage: 'assets/seedance20-banner.png'
        }
      ],
      publicWorks: []
    },
    {
      id: 'ecommerce-digital-human',
      cat: '视频',
      catKey: 'video',
      icon: '🎙️',
      name: '电商口播数字人 表情+口型+声音克隆',
      desc: '一键生成口播数字人：文案+图片驱动，InfiniteTalk 口型+表情复刻+声音克隆',
      price: '⚡0.7',
      uses: '15.3k',
      rating: '4.9',
      featured: true,
      hot: true,
      official: true,
      curatedMedia: true,
      likes: '38',
      comments: '2',
      gradient: 'linear-gradient(135deg,#7c2d12,#ea580c)',
      tags: ['音视频', '数字人'],
      successRate: 98,
      avgDurationSec: 38,
      collectFav: 38,
      collectComment: 308,
      worksCount: 6,
      commentTabCount: 2,
      creatorName: '魅力微变',
      creatorDate: '2023.12.03 更新',
      defaultCopy: '随时随地，一张图一段文案介绍你的产品，推荐15秒生成',
      introHtml: '<p><strong>电商口播数字人 · 表情+口型+声音克隆</strong></p><p>运用介绍&amp;输入建议：一键生成口播数字人，<strong>文案 + 图片</strong> 一键生成数字人；使用全新 <strong>InfiniteTalk</strong>，并兼容表情复刻模式（表情开关选 2）。</p><ol class="oiws-intro-steps"><li><strong>第一步：</strong>上传口播参考视频</li><li><strong>第二步：</strong>填写文案并选择语音</li><li><strong>第三步：</strong>上传克隆音频与表情驱动人像</li><li><strong>第四步：</strong>点击运行生成口播成片</li></ol><p class="oiws-intro-note">推荐 15 秒竖屏口播；音频建议干净干声，人像正面无遮挡。</p>',
      officialSamples: [
        {
          gradient: 'linear-gradient(135deg,#1c1917,#ea580c)',
          coverImage: 'assets/ecommerce-digital-human-banner.png',
          bannerVideo: 'https://www.w3schools.com/html/mov_bbb.mp4'
        },
        {
          gradient: 'linear-gradient(135deg,#431407,#c2410c)',
          coverImage: 'assets/ecommerce-digital-human-banner.png'
        }
      ],
      publicWorks: [
        { user: '魅力微变', emoji: '▶', gradient: 'linear-gradient(135deg,#7c2d12,#ea580c)', coverImage: 'assets/ecommerce-digital-human-banner.png', title: '护肤品口播', type: 'video', model: 'InfiniteTalk', likes: 12, views: 380, uses: 1, price: '⚡0.7', params: '15s · Plus' },
        { user: '魔力视觉', emoji: '▶', gradient: 'linear-gradient(135deg,#9a3412,#f97316)', coverImage: 'assets/ecommerce-digital-human-banner.png', title: '美妆种草', type: 'video', model: 'InfiniteTalk', likes: 9, views: 290, uses: 1, price: '⚡0.7', params: '15s · Plus' },
        { user: '电商小白', emoji: '▶', gradient: 'linear-gradient(135deg,#c2410c,#fb923c)', coverImage: 'assets/ecommerce-digital-human-banner.png', title: '3C 数码讲解', type: 'video', model: 'InfiniteTalk', likes: 7, views: 210, uses: 1, price: '⚡0.7', params: '15s · Plus' },
        { user: 'Lily', emoji: '▶', gradient: 'linear-gradient(135deg,#78350f,#ea580c)', coverImage: 'assets/ecommerce-digital-human-banner.png', title: '服装上身展示', type: 'video', model: 'InfiniteTalk', likes: 6, views: 175, uses: 1, price: '⚡0.7', params: '15s · Plus' },
        { user: '口播达人', emoji: '▶', gradient: 'linear-gradient(135deg,#431407,#dc2626)', coverImage: 'assets/ecommerce-digital-human-banner.png', title: '食品带货', type: 'video', model: 'InfiniteTalk', likes: 5, views: 142, uses: 1, price: '⚡0.7', params: '15s · Plus' },
        { user: 'StarShop', emoji: '▶', gradient: 'linear-gradient(135deg,#7c2d12,#f59e0b)', coverImage: 'assets/ecommerce-digital-human-banner.png', title: '节日促销口播', type: 'video', model: 'InfiniteTalk', likes: 4, views: 98, uses: 1, price: '⚡0.7', params: '15s · Plus', recommended: true }
      ]
    },
    {
      id: 'video-face-swap-v1',
      cat: '视频',
      catKey: 'video',
      icon: '🎭',
      name: '视频换脸',
      desc: '视频换脸 高清镜头换发型+自定义时长+真实自然换脸',
      price: '⚡0.7',
      uses: '319',
      rating: '4.9',
      featured: true,
      hot: true,
      official: true,
      curatedMedia: true,
      likes: '0',
      comments: '1',
      gradient: 'linear-gradient(135deg,#1e3a5f,#7c3aed)',
      tags: ['视频换脸', '高清镜头', '换脸'],
      successRate: 77,
      avgDurationSec: 387,
      collectFav: 0,
      collectComment: 3,
      worksCount: 1,
      commentTabCount: 1,
      creatorName: '小齐齐',
      creatorDate: '2024.05.22',
      defaultPrompt: '穿碎花裙在跳舞',
      vfsDuration: 5,
      vfsMaxSide: 832,
      introHtml: '<p><strong>视频换脸 高清镜头换发型+自定义时长+真实自然换脸</strong></p><p>上传<strong>模特照片</strong>与<strong>驱动视频</strong>，自定义时长与最长边，填写 text 描述动作与造型，一键生成高清自然视频换脸。</p><h4>输入建议</h4><ul><li>模特照：正面清晰、无遮挡</li><li>视频：人物主体居中、光线稳定</li><li>时长与最长边按成片需求调节</li></ul>',
      officialSamples: [
        { gradient: 'linear-gradient(180deg,#0a0a0a,#141414)', coverImage: 'assets/video-face-swap-banner.png' },
        { gradient: 'linear-gradient(180deg,#0f0f0f,#1a1a1a)', coverImage: 'assets/video-face-swap-banner.png' },
        { gradient: 'linear-gradient(180deg,#0a0a0a,#141414)', coverImage: 'assets/video-face-swap-banner.png' },
        { gradient: 'linear-gradient(180deg,#101010,#1c1c1c)', coverImage: 'assets/video-face-swap-banner.png' },
        { gradient: 'linear-gradient(180deg,#0a0a0a,#141414)', coverImage: 'assets/video-face-swap-banner.png' },
        { gradient: 'linear-gradient(180deg,#0d0d0d,#181818)', coverImage: 'assets/video-face-swap-banner.png' },
        { gradient: 'linear-gradient(180deg,#0a0a0a,#141414)', coverImage: 'assets/video-face-swap-banner.png' }
      ],
      publicWorks: [
        {
          user: '小齐齐',
          emoji: '▶',
          gradient: 'linear-gradient(135deg,#1e3a5f,#7c3aed)',
          coverImage: 'assets/video-face-swap-banner.png',
          title: '碎花裙跳舞换脸',
          type: 'video',
          prompt: '穿碎花裙在跳舞',
          model: '视频换脸',
          likes: 6,
          views: 180,
          uses: 12,
          price: '⚡0.7',
          params: '5s · 832 · Standard'
        }
      ]
    },
    {
      id: 'wan22-motion-transfer',
      cat: '视频',
      catKey: 'video',
      icon: '🎞️',
      name: '视频动作迁移',
      desc: 'Wan2.2 · AnimateV2：上传角色图与参考视频，一键完成动作迁移与角色一致性注入',
      price: '⚡0.7',
      uses: '16',
      rating: '4.9',
      featured: true,
      hot: true,
      official: true,
      curatedMedia: true,
      likes: '3',
      comments: '0',
      gradient: 'linear-gradient(135deg,#7c2d12,#ea580c)',
      tags: ['原生视频', '角色一致性', '动作迁移'],
      successRate: 97,
      avgDurationSec: 68,
      collectFav: 3,
      collectComment: 7,
      worksCount: 1,
      commentTabCount: 0,
      creatorName: 'StarTed',
      creatorDate: '2024.08.28 更新',
      introHtml: '<p><strong>[Wan2.2 | AnimateV2] 视频动作迁移与角色</strong></p><p>视频动作迁移与角色注入 + 创意动画/影视特效 · 视频重绘 · 动作克隆 · 角色一致性。</p><h4>核心痛点</h4><ul><li>参考视频动作复杂，传统换脸难以保持肢体律动</li><li>角色形象与参考动作需同时一致</li><li>需要快速试跑影视/短视频镜头</li></ul><ol class="oiws-intro-steps"><li><strong>第一步：</strong>添加角色参考图像</li><li><strong>第二步：</strong>上传驱动 Video 参考片段</li><li><strong>第三步：</strong>运行生成动作迁移结果</li></ol>',
      officialSamples: [
        {
          gradient: 'linear-gradient(180deg,#0a0a0a,#141414)',
          coverImage: 'assets/wan22-motion-transfer-banner.png'
        }
      ],
      publicWorks: [
        {
          user: 'StarTed',
          emoji: '▶',
          gradient: 'linear-gradient(135deg,#7c2d12,#c2410c)',
          title: '车内镜头动作迁移',
          type: 'video',
          prompt: '参考舞蹈律动迁移至角色人像，保持面部一致',
          model: 'Wan2.2 AnimateV2',
          likes: 28,
          views: 420,
          uses: 16,
          price: '⚡0.7',
          params: '9:16 · Standard'
        }
      ]
    },
    {
      id: 'wan22-keyframes-video',
      cat: '视频',
      catKey: 'video',
      icon: '🎥',
      name: '首尾帧视频',
      desc: 'wan2.2 首尾帧（极速优化版）：上传首帧/尾帧图像与文本描述，生成过渡视频',
      price: '⚡0.7',
      uses: '3.2k',
      rating: '4.9',
      featured: true,
      hot: true,
      official: true,
      curatedMedia: true,
      likes: '8',
      comments: '2',
      gradient: 'linear-gradient(135deg,#0c4a6e,#0369a1)',
      tags: ['场景特效', '视频特效', '人物特效'],
      successRate: 97,
      avgDurationSec: 55,
      collectFav: 8,
      collectComment: 15,
      worksCount: 0,
      commentTabCount: 0,
      creatorName: 'xiao',
      creatorDate: '2025.01 更新',
      defaultPrompt: '一位美女，她转了一圈，裙子变成了牛仔裙',
      introHtml: '<p><strong>wan2.2 首尾帧（极速优化版）</strong></p><p>上传<strong>首帧</strong>与<strong>尾帧</strong>参考图，并填写 text 描述中间过渡动作与变化，一键生成首尾帧插值视频。</p><ol class="oiws-intro-steps"><li><strong>第一步：</strong>上传首帧 image（起始画面）</li><li><strong>第二步：</strong>上传尾帧 image（结束画面）</li><li><strong>第三步：</strong>填写 text 描述动作与变化后运行</li></ol><p class="oiws-intro-note">首尾帧构图尽量一致、主体清晰；text 写清动作与服装/场景变化。</p>',
      officialSamples: [
        {
          gradient: 'linear-gradient(180deg,#0c4a6e,#0369a1)',
          coverImage: 'assets/wan22-keyframes-banner-1.png'
        },
        {
          gradient: 'linear-gradient(180deg,#134e4a,#0f766e)',
          coverImage: 'https://images.unsplash.com/photo-1507525421304-4916845a8e8b?w=720&q=80&auto=format&fit=crop'
        }
      ]
    },
    {
      id: 'gpt-image-2',
      cat: '图像',
      catKey: 'image',
      icon: '🖼️',
      name: 'GPT Image2.0 文生图',
      desc: '新一代文生图，复杂提示词直出高清画面，适合电商与创意海报',
      price: '⚡0.6',
      uses: '9.1k',
      rating: '4.9',
      featured: true,
      hot: true,
      official: true,
      isNew: true,
      likes: '10k',
      comments: '72',
      gradient: 'linear-gradient(135deg,#134e4a,#0d9488)',
      tags: ['新奇创意', '其它电商产品', '文生图'],
      successRate: 95,
      avgDurationSec: 113,
      collectFav: 13,
      collectComment: 72,
      introHtml: '<p>GPT Image 2.0 面向真实创作场景，支持复杂构图、电商主图与品牌海报一键生成，语义理解与细节表现全面升级。</p><h4>输入建议</h4><ul><li>写清主体、场景、光线与镜头语言</li><li>补充材质、色调与品牌风格关键词</li><li>负向提示词用于规避低质、水印与畸形肢体</li></ul>',
      officialSamples: [
        {
          gradient: 'linear-gradient(135deg,#134e4a,#115e59)',
          coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd3fbae?w=960&q=80&auto=format&fit=crop'
        }
      ]
    },
    {
      id: 'flux2-watermark-gen',
      cat: '图像',
      catKey: 'image',
      icon: '✨',
      name: '一键去水印',
      desc: 'FLUX2去水印万能改图单图版保持原图不变',
      price: '⚡0.7',
      uses: '0',
      rating: '4.9',
      featured: true,
      hot: true,
      official: true,
      curatedImage: true,
      likes: '2',
      comments: '0',
      gradient: 'linear-gradient(135deg,#312e81,#7c3aed)',
      tags: ['黑科技', '去水印'],
      successRate: 98,
      avgDurationSec: 45,
      collectFav: 2,
      collectComment: 3,
      worksCount: 0,
      commentTabCount: 0,
      creatorName: 'Openclaw2026',
      creatorDate: '2024.05.25 更新',
      defaultPrompt: '去除画面水印与杂物，保持人物与场景细节不变，自然修复',
      introHtml: '<p><strong>FLUX2 一键去水印</strong></p><p>运用介绍&amp;输入建议：上传图片即可<strong>一键去除水印、杂物</strong>，单图版在改图时尽量<strong>保持原图不变</strong>（尺寸与主体构图）。</p><p class="oiws-intro-note">创作赛福利：输入邀请码 <em>fdxwead2</em> 可领取额外算力（演示）。</p><p class="oiws-intro-link">技术路径：4090 24G 单卡可跑；试用版每日约 5 次免费额度（演示说明）。</p>',
      officialSamples: [
        {
          gradient: 'linear-gradient(135deg,#1e1b4b,#4c1d95)',
          coverImage: 'assets/flux2-watermark-banner.png'
        }
      ],
      publicWorks: []
    },
    {
      id: 'ecommerce-model-gen-oneclick',
      cat: '图像',
      catKey: 'image',
      icon: '👗',
      name: '-一键生成电商模特图',
      desc: '全能图片-2.0-图生图-一键生成电商模特图',
      price: '⚡0.7',
      uses: '491',
      rating: '4.9',
      featured: true,
      hot: true,
      official: true,
      curatedImage: true,
      likes: '4',
      comments: '0',
      gradient: 'linear-gradient(135deg,#1e3a5f,#7c3aed)',
      tags: ['服装展示', '模特产品展示', '图生图'],
      successRate: 99,
      avgDurationSec: 340,
      collectFav: 4,
      collectComment: 25,
      worksCount: 10,
      commentTabCount: 0,
      creatorName: 'KIMI',
      creatorDate: '2024.05.15 发布',
      defaultPrompt: '女士修身长袖T恤打底衫，20-30岁亚洲年轻女性',
      introHtml: '<p><strong>产品图一键生成模特图 · 一次性生成 5 张</strong></p><p>运用介绍&amp;输入建议：上传<strong>产品图</strong>与<strong>模特参考图</strong>，填写产品名称描述，基于全能图片 2.0 超强一致性一键输出电商模特展示图。</p><h4>输入建议</h4><ul><li>产品图建议平铺或挂拍，主体完整、背景干净</li><li>模特参考图正面清晰，姿态与目标展示风格接近</li><li>产品名称写清品类、版型与适龄人群</li></ul>',
      officialSamples: [
        {
          gradient: 'linear-gradient(180deg,#1a1a2e 0%,#0f0f1a 100%)',
          coverImage: 'assets/ecommerce-model-gen-banner.png'
        }
      ],
      publicWorks: []
    },
    {
      id: 'ecommerce-white-bg-scene',
      cat: '图像',
      catKey: 'image',
      icon: '🛍️',
      name: '电商白底图智能生成场景',
      desc: '电商白底图智能生成场景',
      price: '⚡0.7',
      uses: '29',
      rating: '4.9',
      featured: true,
      hot: true,
      official: true,
      curatedImage: true,
      likes: '0',
      comments: '0',
      gradient: 'linear-gradient(135deg,#d4c4a8,#a8a29e)',
      tags: ['图片场景精美', '精修', '置士图'],
      successRate: 97,
      avgDurationSec: 1,
      collectFav: 0,
      collectComment: 6,
      worksCount: 0,
      commentTabCount: 0,
      creatorName: '我不吃甜药',
      creatorDate: '2024.05.27 发布',
      introHtml: '<p><strong>电商白底图智能生成场景</strong></p><p>运用介绍&amp;输入建议：注册 <a href="https://www.runninghub.cn/?inviteCode=5ef7f491" target="_blank" rel="noopener">www.runninghub.cn</a> 可领取算力奖励（邀请码 <em>5ef7f491</em>）。</p><p>上传<strong>白底商品图</strong>，一键生成精美电商场景图，支持精修与置景扩展。</p><h4>输入建议</h4><ul><li>推荐纯白或浅色背景的商品主图</li><li>产品主体清晰、无严重遮挡</li><li>可按需补充场景风格描述</li></ul>',
      officialSamples: [
        {
          gradient: 'linear-gradient(180deg,#f5f0e8 0%,#e8e0d4 100%)',
          coverImage: 'assets/ecommerce-white-bg-scene-banner.png'
        }
      ],
      publicWorks: []
    },
    {
      id: 'ecommerce-product-multiangle',
      cat: '图像',
      catKey: 'image',
      icon: '📦',
      name: '自动电商产品多角度生成',
      desc: '电商产品-自动产品多角度生成',
      price: '⚡0.7',
      uses: '5',
      rating: '4.9',
      featured: true,
      hot: true,
      official: true,
      curatedImage: true,
      likes: '0',
      comments: '0',
      gradient: 'linear-gradient(135deg,#c2410c,#ea580c)',
      tags: ['图片类'],
      successRate: 97,
      avgDurationSec: 60,
      collectFav: 0,
      collectComment: 3,
      worksCount: 0,
      commentTabCount: 0,
      creatorName: '大师',
      creatorDate: '2024.05.29 进阶',
      defaultPrompt: 'Next Scene: 将镜头向前移动\nNext Scene: 将镜头向左移动\nNext Scene: 将镜头变为俯视镜头\nNext Scene: 将镜头向右移动\nNext Scene: 将镜头向后移动\nNext Scene: 将镜头变为仰视镜头\nNext Scene: 将镜头向左旋转45度\nNext Scene: 将镜头向右旋转45度\nNext Scene: 将镜头拉远\nNext Scene: 将镜头推近',
      introHtml: '<p><strong>电商产品 · 自动多角度生成</strong></p><p>运用介绍&amp;输入建议：注册 <a href="https://www.runninghub.cn/" target="_blank" rel="noopener">www.runninghub.cn</a> 可领取 <strong>1000RH</strong> 算力奖励；微信联系 <em>rdcm008</em> 获取脚本与进阶指导。</p><p>上传<strong>成品图</strong>，按提示词中的 Next Scene 镜头指令自动生成多角度产品展示图。</p>',
      officialSamples: [
        {
          gradient: 'linear-gradient(180deg,#1a1a1a 0%,#0f0f0f 100%)',
          coverImage: 'assets/ecommerce-product-multiangle-banner.png'
        }
      ],
      publicWorks: []
    },
    {
      id: 'face-swap-outfit-v2',
      cat: '图像',
      catKey: 'image',
      icon: '👤',
      name: '换脸换装',
      desc: '换脸换装 人物一致+自然真实全能通拟2.0人物一致',
      price: '⚡0.7',
      uses: '26',
      rating: '4.9',
      featured: true,
      hot: true,
      official: true,
      curatedImage: true,
      likes: '1',
      comments: '0',
      gradient: 'linear-gradient(135deg,#0f766e,#134e4a)',
      tags: ['人像写真', '置换图', '换脸'],
      successRate: 97,
      avgDurationSec: 50,
      collectFav: 1,
      collectComment: 6,
      worksCount: 2,
      commentTabCount: 0,
      creatorName: '九七先生',
      creatorDate: '2024.05.28 更新',
      introHtml: '<p><strong>极致换脸 人物一致+自然真实</strong></p><p>上传<strong>模特照片</strong>与<strong>人脸照片</strong>，一键完成人像换脸与造型融合，保持五官一致、肤色自然。</p><h4>输入建议</h4><ul><li>模特图建议全身或半身，光线均匀、面部清晰</li><li>人脸照片正面无遮挡，与模特图肤色接近时效果更佳</li></ul>',
      officialSamples: [
        {
          gradient: 'linear-gradient(180deg,#1a2e2a 0%,#0d1f1c 100%)',
          bannerPoster: true,
          posterStyle: 'faceswap',
          coverImage: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=960&q=85&auto=format&fit=crop'
        }
      ],
      publicWorks: []
    },
    {
      id: 'image-to-360-panorama',
      cat: '图像',
      catKey: 'image',
      icon: '🌐',
      name: '一键 图片 转 360全景图',
      desc: 'Qwen 2511 一键图转 360 全景，自动扩充、修复接缝、高分辨率输出',
      price: '⚡0.7',
      uses: '27',
      rating: '4.9',
      featured: true,
      hot: true,
      official: true,
      curatedImage: true,
      likes: '0',
      comments: '0',
      gradient: 'linear-gradient(135deg,#6b5344,#3d2f24)',
      tags: ['场景转换', '美化建筑及空间设计', '图片画'],
      successRate: 97,
      avgDurationSec: 90,
      collectFav: 0,
      collectComment: 2,
      worksCount: 0,
      commentTabCount: 0,
      creatorName: 'HyLan_L',
      creatorDate: '2024.05.26 18:31',
      introHtml: '<p><strong>一键 图片 转 360全景图</strong></p><p>运用介绍&amp;输入建议：投稿教程：寻找受了启发</p><p>上传室内或建筑空间照片，自动<strong>扩充画幅</strong>、<strong>修复接缝</strong>并输出高分辨率 360° 全景图，适合空间设计与房产展示。</p><h4>输入建议</h4><ul><li>推荐横构图、光线均匀的室内/建筑参考图</li><li>避免严重畸变与大面积遮挡</li><li>主体居中时接缝修复效果更佳</li></ul>',
      officialSamples: [
        {
          gradient: 'linear-gradient(180deg,#4a3728 0%,#2a2118 100%)',
          bannerPoster: true,
          posterStyle: 'panorama',
          coverImage: 'https://images.unsplash.com/photo-1600210492493-0946911123d1?w=900&q=82&auto=format&fit=crop'
        }
      ],
      publicWorks: []
    },
    {
      id: 'old-photo-time-machine',
      cat: '图像',
      catKey: 'image',
      icon: '📷',
      name: '旧照时光机',
      desc: '专业级一键修复老照片，瞬间定格旧时光；AI 去划痕、智能上色与细节增强',
      price: '⚡0.7',
      uses: '16',
      rating: '4.9',
      featured: true,
      hot: true,
      official: true,
      curatedImage: true,
      likes: '1',
      comments: '0',
      gradient: 'linear-gradient(135deg,#d4c4a8,#8b7355)',
      tags: ['老照片修复', '人像写真', '民国风'],
      successRate: 98,
      avgDurationSec: 45,
      collectFav: 1,
      collectComment: 2,
      worksCount: 3,
      commentTabCount: 0,
      creatorName: 'user_63fiehy4',
      creatorDate: '2024.05.25 更新',
      introHtml: '<p><strong>旧照时光机</strong></p><p>运用介绍&amp;输入建议：输入邀请码 <em>gf3pouyd</em> 获取1000RH</p><p>专业级 AI 图像修复技术，拯救每一张泛黄时光：自动去划痕、补细节、智能上色，让老照片焕发新生。</p><h4>输入建议</h4><ul><li>上传清晰扫描件或手机翻拍的老照片</li><li>人像隐约可见、面部未严重模糊时效果最佳</li><li>严重破损可先轻度锐化再上传</li></ul>',
      officialSamples: [
        {
          gradient: 'linear-gradient(180deg,#f5efe6 0%,#e8dcc8 100%)',
          bannerPoster: true,
          coverImage: 'example1.png'
        }
      ],
      publicWorks: [
        { user: 'user_63fiehy4', emoji: '📷', gradient: 'linear-gradient(135deg,#d4c4a8,#8b7355)', coverImage: 'example1.png', title: '全家福修复', type: 'image', prompt: '老照片智能上色与细节修复', model: '旧照时光机', likes: 8, views: 120, uses: 2, price: 'R 23', params: 'Standard' },
        { user: '修复达人', emoji: '🖼️', gradient: 'linear-gradient(135deg,#a8a29e,#78716c)', coverImage: 'example1.png', title: '泛黄记忆', type: 'image', model: '旧照时光机', likes: 5, views: 86, uses: 1, price: 'R 23', params: 'Standard' },
        { user: '时光馆', emoji: '✨', gradient: 'linear-gradient(135deg,#c4b5a0,#92674f)', coverImage: 'example1.png', title: '一键焕新', type: 'image', model: '旧照时光机', likes: 3, views: 42, uses: 1, price: 'R 23', params: 'Standard' }
      ]
    },
    {
      id: 'character-replace-v3',
      cat: '图像',
      catKey: 'image',
      icon: '🔄',
      name: '人物替换',
      desc: '人物替换-图片编辑 V3，上传目标人脸与场景图，保持角色一致性，支持多人场景影视替换',
      price: '⚡0.7',
      uses: '75.8k',
      rating: '4.9',
      featured: true,
      hot: true,
      official: true,
      curatedImage: true,
      likes: '237',
      comments: '15',
      gradient: 'linear-gradient(135deg,#1e3a5f,#0f766e)',
      tags: ['角色一致性', '国产'],
      successRate: 100,
      avgDurationSec: 5,
      collectFav: 237,
      collectComment: 1043,
      worksCount: 8,
      commentTabCount: 15,
      creatorName: '阿姨AI',
      creatorDate: '2024.10.08 更新',
      defaultPrompt: '4k.',
      introHtml: '<p><strong>人物替换 · 图片编辑 V3</strong></p><p>支持多人场景、影视替换与恶搞必备玩法。上传<strong>目标</strong>人脸与<strong>场景图</strong>，可保持角色五官一致并融合进新场景。</p><h4>输入建议</h4><ul><li>目标图：清晰正面或半侧面人脸，光线均匀</li><li>场景图：包含待替换人物的完整构图</li><li>分辨率建议 1280 起，提示词可写 <em>4k</em> 等画质关键词</li></ul><p class="oiws-intro-link">📺 视频教程（演示）：可在 B 站搜索「人物替换 图片编辑V3」</p>',
      officialSamples: [
        {
          gradient: 'linear-gradient(135deg,#1e3a5f,#115e59)',
          coverImage: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=960&q=80&auto=format&fit=crop'
        }
      ]
    },
    {
      id: 'anime-couple-postcard',
      cat: '图像',
      catKey: 'image',
      icon: '💌',
      name: '二次元情侣头像明信片',
      desc: '上传两张人像，一键生成二次元情侣头像明信片，支持 GPT 4o / GPT-Image-1',
      price: '⚡0.7',
      uses: '355',
      rating: '4.9',
      featured: true,
      hot: true,
      official: true,
      curatedImage: true,
      likes: '4',
      comments: '1',
      gradient: 'linear-gradient(135deg,#1e1b4b,#be1858)',
      tags: ['创意形象', '节日主题'],
      successRate: 98,
      avgDurationSec: 42,
      collectFav: 4,
      collectComment: 43,
      worksCount: 5,
      commentTabCount: 1,
      creatorName: 'Crazy Lychee',
      creatorDate: '2023.11.21 更新',
      introHtml: '<p><strong>情侣头像明信片</strong></p><p>应用介绍&amp;输入建议：上传图像，一键生成情侣头像明信片。调用三方 API：<strong>GPT 4o</strong>、<strong>GPT-Image-1</strong>。</p><ul><li>5 次【每日免费】</li><li>超出后约 0.15 元/次</li></ul><ol class="oiws-intro-steps"><li><strong>第一步：</strong>上传图像一（男生/女生人像均可）</li><li><strong>第二步：</strong>上传图像二（另一半人像）</li><li><strong>第三步：</strong>点击运行生成明信片套图</li></ol><p class="oiws-intro-note">建议使用正面清晰人像，光线均匀、五官无遮挡，生成效果更稳定。</p>',
      officialSamples: [
        {
          gradient: 'linear-gradient(135deg,#312e81,#9d174d)',
          coverImage: 'assets/anime-couple-postcard-banner.png'
        },
        {
          gradient: 'linear-gradient(135deg,#4c1d95,#db2777)',
          coverImage: 'assets/anime-couple-postcard-banner.png'
        },
        {
          gradient: 'linear-gradient(135deg,#831843,#be1858)',
          coverImage: 'assets/anime-couple-postcard-banner.png'
        }
      ],
      publicWorks: [
        { user: 'Crazy Lychee', emoji: '💌', gradient: 'linear-gradient(135deg,#312e81,#9d174d)', coverImage: 'assets/anime-couple-postcard-banner.png', title: '草帽情侣明信片', type: 'image', prompt: '二次元手绘情侣明信片，Love / You 字样', model: 'GPT-Image-1', likes: 12, views: 280, uses: 1, price: '⚡0.7', params: '1280', recommended: true },
        { user: 'Crazy Lychee', emoji: '💌', gradient: 'linear-gradient(135deg,#4c1d95,#db2777)', coverImage: 'assets/anime-couple-postcard-banner.png', title: '夏日饮品主题', type: 'image', prompt: '情侣头像明信片套图', model: 'GPT 4o', likes: 8, views: 190, uses: 1, price: '⚡0.7', params: '1280' },
        { user: 'Momo', emoji: '🎨', gradient: 'linear-gradient(135deg,#831843,#be1858)', coverImage: 'assets/anime-couple-postcard-banner.png', title: '节日限定款', type: 'image', model: 'GPT-Image-1', likes: 6, views: 120, uses: 1, price: '⚡0.7', params: '1280' },
        { user: '星野', emoji: '✨', gradient: 'linear-gradient(135deg,#1e3a5f,#7c3aed)', coverImage: 'assets/anime-couple-postcard-banner.png', title: '签名线稿风', type: 'image', model: 'GPT 4o', likes: 5, views: 98, uses: 1, price: '⚡0.7', params: '1280' },
        { user: 'Lychee', emoji: '🌸', gradient: 'linear-gradient(135deg,#134e4a,#0d9488)', coverImage: 'assets/anime-couple-postcard-banner.png', title: '双人竖版明信片', type: 'image', model: 'GPT-Image-1', likes: 4, views: 76, uses: 1, price: '⚡0.7', params: '1280' }
      ]
    },
    {
      id: 'ecommerce-detail-gen',
      cat: '图像',
      catKey: 'image',
      icon: '🛒',
      name: 'AI全自动电商详情页生成 V3直出10张图片',
      desc: '上传商品图，V3 直出 10 张电商详情页套图，可指定语言',
      price: '⚡0.7',
      uses: '77',
      rating: '4.9',
      featured: true,
      hot: true,
      official: true,
      curatedImage: true,
      likes: '2',
      comments: '20',
      gradient: 'linear-gradient(135deg,#ea580c,#f97316)',
      tags: ['分类:生成图', '副主题', '高级制作'],
      successRate: 98,
      avgDurationSec: 77,
      collectFav: 2,
      collectComment: 20,
      worksCount: 0,
      commentTabCount: 1,
      creatorName: 'AI地铺创作',
      creatorDate: '2024.04.28 12:35',
      introHtml: '<p><strong>AI全自动电商详情页生成 V3</strong></p><p>上传商品主图，一键直出 <strong>10 张</strong> 电商详情页套图，支持指定输出语言。</p><ol class="oiws-intro-steps"><li><strong>第一步：</strong>上传商品图片（建议白底或清晰产品图）</li><li><strong>第二步：</strong>确认品类与风格偏好</li><li><strong>第三步：</strong>点击运行，等待详情页套图生成</li></ol><p class="oiws-intro-note">创作赛福利：输入邀请码 <em>fdxwead2</em> 可领取额外算力（演示）。</p>',
      officialSamples: [
        {
          gradient: 'linear-gradient(135deg,#fff7ed,#fed7aa)',
          coverImage: 'assets/ecommerce-detail-banner.png'
        }
      ],
      publicWorks: [
        { user: 'AI地铺创作', emoji: '🛒', gradient: 'linear-gradient(135deg,#ea580c,#f97316)', coverImage: 'assets/ecommerce-detail-banner.png', title: '护肤品详情页套图', type: 'image', prompt: '电商详情页 10 张，护肤品类', model: 'V3 直出', likes: 2, views: 77, uses: 1, price: '⚡0.7', params: '1280' }
      ]
    },
    {
      id: 'person-model-gen',
      cat: '图像',
      catKey: 'image',
      icon: '👤',
      name: '人物模特生成',
      desc: '人像写真一键生成，智能核心训练版，支持 API 补充提示词与竖屏 9:16 输出',
      price: '⚡0.5',
      uses: '20.6k',
      rating: '4.9',
      featured: true,
      hot: true,
      official: true,
      curatedImage: true,
      likes: '212',
      comments: '5',
      gradient: 'linear-gradient(135deg,#831843,#be1858)',
      tags: ['人像写真', '美少女', '文生图'],
      successRate: 99,
      avgDurationSec: 116,
      collectFav: 212,
      collectComment: 504,
      worksCount: 991,
      commentTabCount: 5,
      creatorName: '魅力 创意',
      creatorDate: '2024.08.05 更新',
      defaultPrompt: '一位气质清新的少女模特，半身人像，柔和自然光，浅粉连衣裙，手持花束，背景虚化，高级写真质感，五官精致，皮肤细腻，9:16 竖屏构图',
      introHtml: '<p><strong>人物模特生成 · 智能核心训练版</strong></p><p>运用介绍&amp;输入建议：目前可用 API 补充提示词；常用引导词 <em>John3006</em>。写清人物气质、服装、光线与构图，可快速得到商用级人像写真。</p><h4>输入建议</h4><ul><li>描述模特年龄感、表情与姿态</li><li>指定服装、道具与场景氛围</li><li>竖屏 9:16 适合短视频封面与电商详情</li></ul>',
      officialSamples: [
        {
          gradient: 'linear-gradient(135deg,#831843,#9d174d)',
          coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=960&q=80&auto=format&fit=crop'
        }
      ]
    },
    {
      id: 'omni-image-2',
      cat: '图像',
      catKey: 'image',
      icon: '🖼️',
      name: '全能图片2.0',
      desc: '先看价格再运行，支持文生图与图生图；默认第三方低价渠道，亦可切换官方稳定版',
      price: '⚡0.5',
      uses: '550.3k',
      rating: '4.9',
      featured: true,
      hot: true,
      official: true,
      curatedImage: true,
      likes: '8.5k',
      gradient: 'linear-gradient(135deg,#1e3a5f,#7c3aed)',
      tags: ['文生图', '图生图'],
      successRate: 98,
      avgDurationSec: 77,
      collectFav: 591,
      collectComment: 2400,
      defaultPrompt: '近景构图（膝盖以上），图 1 的女孩穿着图 2 的衣服，身处图 3 的场景中，自信展示自我，姿态酷飒随性，眼神冷艳有气场，保持人物五官一致性，高级电影质感，光影干净柔和，细节超清，氛围感拉满，酷女孩风格，画面自然高级',
      introHtml: '<p>全能图片 2.0 支持文生图与图生图。运行前可先对比价格：<strong>第三方低价渠道版</strong> API 价格更低，适合批量试跑；<strong>官方稳定版</strong> 稳定性与性能更优，价格接近官网标准。</p><h4>输入建议</h4><ul><li>文生图：写清主体、构图、光线与风格关键词</li><li>图生图：上传清晰参考图并说明希望保留或修改的部分</li><li>复杂场景可补充负向提示，避免低质、水印与畸形</li></ul>',
      officialSamples: [
        {
          gradient: 'linear-gradient(135deg,#1e3a5f,#4c1d95)',
          coverImage: 'https://rh-images.xiaoyaoyou.com/431c8b65e23401f0645b6af625430999/2026-05-25/773681694d2baf05aa44cdc239059856.png?imageMogr2/format/webp/rquality/60/ignore-error/1/minisize/1'
        }
      ]
    },
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
    {
      id: 'video-outfit-v1',
      cat: '视频',
      catKey: 'video',
      icon: '👗',
      name: '视频换装',
      desc: 'Urban Cuts · 音乐节拍同步换装短视频',
      price: '⚡34',
      uses: '620',
      rating: '4.9',
      featured: true,
      hot: true,
      official: true,
      bento: true,
      bentoColor: '#d7ff00',
      gradient: 'linear-gradient(135deg,#0a0a0a,#1a1a1a)',
      tags: ['视频换装', 'Urban Cuts', '节拍剪辑'],
      successRate: 95,
      avgDurationSec: 90,
      collectFav: 56,
      collectComment: 19,
      worksCount: 0,
      commentTabCount: 0,
      creatorName: 'GUID Studio',
      creatorDate: '2024.06.20 更新',
      introHtml: '<p><strong>视频换装 · Urban Cuts</strong></p><p>上传全身照，选择套装与背景音乐，生成约 <strong>10 秒</strong>、剪辑与节拍同步的换装短视频。</p><h4>输入建议</h4><ul><li>照片：单人全身，面部清晰</li><li>套装图：尽量无脸、背景简洁</li><li>音乐：可选预设或上传自有音轨</li></ul>',
      officialSamples: [
        {
          gradient: 'linear-gradient(180deg,#0a0a0a 0%,#141414 100%)',
          coverImage: 'assets/video-outfit-banner.png'
        }
      ],
      publicWorks: []
    },
    {
      id: 'video-recast-v1',
      cat: '视频',
      catKey: 'video',
      icon: '🎭',
      name: '视频换角色',
      desc: 'Recast · 视频中一键替换角色',
      price: '⚡2',
      uses: '860',
      rating: '4.9',
      featured: true,
      hot: true,
      official: true,
      bento: true,
      bentoColor: '#d7ff00',
      gradient: 'linear-gradient(135deg,#0a0a0a,#141414)',
      tags: ['视频换角色', 'Recast', '角色替换'],
      successRate: 96,
      avgDurationSec: 120,
      collectFav: 42,
      collectComment: 18,
      worksCount: 0,
      commentTabCount: 0,
      creatorName: 'GUID Studio',
      creatorDate: '2024.06.15 更新',
      introHtml: '<p><strong>视频换角色 · Recast</strong></p><p>上传<strong>源视频</strong>与<strong>目标角色参考图</strong>，一键完成视频中人物替换，并支持前后效果对比预览。</p><h4>输入建议</h4><ul><li>源视频：人物主体清晰、光线稳定</li><li>角色图：正面或半侧身，五官无遮挡</li><li>背景简单时融合效果更自然</li></ul>',
      officialSamples: [
        {
          gradient: 'linear-gradient(180deg,#0a0a0a 0%,#141414 100%)',
          coverImage: 'assets/video-recast-preview.png'
        }
      ],
      publicWorks: []
    },
    {
      id: 'ai-stylist-fitting-room',
      cat: '换装',
      catKey: 'tryon',
      icon: '👗',
      name: '试装间',
      desc: 'AI stylist 虚拟试装，上传全身照一键换装',
      price: '⚡2',
      uses: '1.2k',
      rating: '4.9',
      featured: true,
      hot: true,
      official: true,
      bento: true,
      bentoColor: '#d7ff00',
      gradient: 'linear-gradient(135deg,#141414,#262626)',
      tags: ['虚拟试装', 'AI stylist', '换装'],
      successRate: 97,
      avgDurationSec: 45,
      collectFav: 86,
      collectComment: 24,
      worksCount: 0,
      commentTabCount: 0,
      creatorName: 'GUID Studio',
      creatorDate: '2024.06.01 更新',
      introHtml: '<p><strong>试装间 · AI stylist</strong></p><p>上传<strong>全身人像</strong>，从右侧选择套装或单品，一键生成虚拟试衣效果。</p><h4>输入建议</h4><ul><li>单人全身或大半身，面部清晰可见</li><li>光线均匀、背景简洁时效果更佳</li><li>可先选性别再挑选 Outfit 预设</li></ul>',
      officialSamples: [
        {
          gradient: 'linear-gradient(180deg,#0a0a0a 0%,#1a1a1a 100%)',
          coverImage: 'assets/fitting-room-banner.png'
        }
      ],
      publicWorks: []
    },
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
      limit: 7
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
      gradient: app.gradient,
      tags: app.tags,
      introHtml: app.introHtml,
      inputTips: app.inputTips,
      successRate: app.successRate,
      avgDurationSec: app.avgDurationSec,
      officialSamples: app.officialSamples,
      collectFav: app.collectFav,
      collectComment: app.collectComment,
      likes: app.likes,
      defaultPrompt: app.defaultPrompt,
      defaultCopy: app.defaultCopy,
      defaultVoiceText: app.defaultVoiceText,
      defaultEmotion: app.defaultEmotion,
      defaultPlot: app.defaultPlot,
      worksCount: app.worksCount,
      commentTabCount: app.commentTabCount,
      creatorName: app.creatorName,
      creatorDate: app.creatorDate,
      publicWorks: app.publicWorks
    });
    if (!isEmbedded()) {
      if (typeof window.openAppTemplateModal === 'function') {
        window.openAppTemplateModal(app.cat, app.icon, app.name, app.desc, app.price, app.uses + ' 次使用', app.rating, {
          catKey: app.catKey,
          gradient: app.gradient,
          id: app.id,
          official: !!app.official,
          introHtml: app.introHtml,
          inputTips: app.inputTips,
          tags: app.tags,
          successRate: app.successRate,
          avgDurationSec: app.avgDurationSec,
          officialSamples: app.officialSamples,
          collectFav: app.collectFav,
          collectComment: app.collectComment,
          likes: app.likes,
          defaultPrompt: app.defaultPrompt,
          defaultCopy: app.defaultCopy,
          songTheme: app.songTheme,
          songGenre: app.songGenre,
          songLanguage: app.songLanguage,
          defaultVoiceText: app.defaultVoiceText,
          defaultEmotion: app.defaultEmotion,
          defaultPlot: app.defaultPlot,
          worksCount: app.worksCount,
          commentTabCount: app.commentTabCount,
          creatorName: app.creatorName,
          creatorDate: app.creatorDate,
          publicWorks: app.publicWorks
        });
      } else {
        showToast('🚀 打开应用：' + app.name);
      }
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

  function formatSocialCountField(val) {
    if (val == null || val === '') return '0';
    if (typeof val === 'number') return formatSocialCount(val);
    return String(val);
  }

  function getAppSocialCounts(app) {
    var likes = app.likes != null ? String(app.likes) : null;
    var favs = app.favs != null ? formatSocialCountField(app.favs) : null;
    if (favs == null && app.collectComment != null) {
      favs = formatSocialCountField(app.collectComment);
    }
    if (likes != null && favs != null) {
      return { likes: likes, favs: favs };
    }
    var uses = parseUsesNum(app.uses);
    var likesNum = app.collectFav != null ? Number(app.collectFav) : Math.max(8, Math.round(uses * 1.12) || 48);
    var favsNum = app.collectComment != null ? Number(app.collectComment) : Math.max(0, Math.round(uses / 48) || 12);
    return {
      likes: likes != null ? likes : formatSocialCount(likesNum),
      favs: favs != null ? favs : formatSocialCount(favsNum)
    };
  }

  function renderCardSocialStats(app) {
    var social = getAppSocialCounts(app);
    return '<div class="apps-card-stats" aria-label="点赞 ' + social.likes + '，收藏 ' + social.favs + '">' +
      '<span class="apps-card-stat"><span class="apps-card-stat-icon" aria-hidden="true">👍</span>' + escapeHtml(social.likes) + '</span>' +
      '<span class="apps-card-stat"><span class="apps-card-stat-icon" aria-hidden="true">⭐</span>' + escapeHtml(social.favs) + '</span>' +
      '</div>';
  }

  function renderCuratedCard(app) {
    var coverImg = 'example1.png';
    var coverStyle = 'background-image:url(' + coverImg + ');background-size:cover;background-position:center;background-color:#1a1f24';
    return '<article class="curated-card" data-id="' + app.id + '" role="button" tabindex="0">' +
      '<div class="curated-card-inner">' +
      '<div class="curated-card-media">' +
      '<div class="curated-card-cover" style="' + coverStyle + '"></div>' +
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
      var items = APPS_DATA.filter(zone.match);
      if (zone.gridId === 'zone-image-grid') {
        items.sort(function (a, b) {
          var pri = function (app) {
            if (app.id === 'ecommerce-model-gen-oneclick') return 19;
            if (app.id === 'ecommerce-white-bg-scene') return 18;
            if (app.id === 'flux2-watermark-gen') return 17;
            if (app.id === 'ecommerce-product-multiangle') return 16;
            if (app.id === 'face-swap-outfit-v2') return 15;
            if (app.id === 'image-to-360-panorama') return 14;
            if (app.id === 'old-photo-time-machine') return 13;
            if (app.id === 'ecommerce-detail-gen') return 11;
            if (app.id === 'anime-couple-postcard') return 10;
            return app.curatedImage ? 1 : 0;
          };
          return pri(b) - pri(a);
        });
      }
      if (zone.gridId === 'zone-media-grid') {
        items.sort(function (a, b) {
          var pri = function (app) {
            if (app.id === 'video-face-swap-v1') return 10;
            if (app.id === 'heartmula-song-voice') return 9;
            if (app.id === 'seedance20-ref-real') return 8;
            if (app.id === 'ecommerce-digital-human') return 7;
            if (app.id === 'wan22-keyframes-video') return 6;
            if (app.id === 'wan22-motion-transfer') return 5;
            if (app.id === 'ltx2-digital-human-lipsync') return 4;
            if (app.id === 'short-drama-full') return 3;
            if (app.id === 'index-tts2-voice') return 2;
            return app.curatedMedia ? 1 : 0;
          };
          return pri(b) - pri(a);
        });
        zone.limit = 8;
      }
      items = items.slice(0, zone.limit);
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
    items.sort(function (a, b) {
      return (b.featuredCurated ? 1 : 0) - (a.featuredCurated ? 1 : 0);
    });
    grid.innerHTML = items.map(function (app) {
      var coverImg = 'example1.png';
      var coverStyle = 'background-image:url(' + coverImg + ');background-size:cover;background-position:center;background-color:#1a1f24';
      return '<article class="featured-card" data-id="' + app.id + '" role="button" tabindex="0">' +
        (app.hot ? '<span class="badge-hot">HOT</span>' : '') +
        '<div class="cover" style="' + coverStyle + '"></div>' +
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
        setExploreFilter('video');
        document.getElementById('apps-explore')?.scrollIntoView({ behavior: 'smooth' });
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

  function init() {
    renderFeatured();
    renderCuratedZones();
    renderBento();
    renderExploreFilters();
    renderExplore();

    var search = document.getElementById('apps-search-input');
    if (search) {
      search.addEventListener('input', function () {
        state.query = search.value.trim();
        renderExplore();
      });
    }

    document.getElementById('section-more-featured')?.addEventListener('click', function () {
      setExploreFilter('all');
      document.getElementById('apps-explore')?.scrollIntoView({ behavior: 'smooth' });
    });

    document.querySelectorAll('.section-more[data-zone-tab]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tab = btn.getAttribute('data-zone-tab');
        if (tab) setExploreFilter(tab);
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
