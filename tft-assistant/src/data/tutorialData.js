/**
 * S18苍林秘境教学资源库 - 多平台覆盖，每条指向一个确定的视频/精准视频页
 * platform: embed(B站嵌入播放) | bilibili(跳转B站视频) | douyin(跳转抖音视频)
 * 注: bvid/link 为 S18 主题占位，后续可替换为最新视频
 */

export const tutorialCategories = [
  { key: 'all', label: '全部', icon: '📋' },
  { key: 'lineup', label: '阵容教学', icon: '🛡️' },
  { key: 'operation', label: '运营教学', icon: '📈' },
  { key: 'beginner', label: '新手入门', icon: '🎓' },
  { key: 'equipment', label: '装备神器', icon: '⚡' },
  { key: 'fun', label: '娱乐玩法', icon: '🎮' },
  { key: 'advanced', label: '进阶技巧', icon: '🔥' }
]

export const tutorialPlatforms = [
  { key: 'all', label: '全部平台', icon: '🌐' },
  { key: 'embed', label: '可直接播放', icon: '📺' },
  { key: 'bilibili', label: 'B站观看', icon: '🎬' },
  { key: 'douyin', label: '抖音观看', icon: '🎵' }
]

export const tutorials = [
  // ==================== 新手入门 ====================
  {
    id: 1, title: 'S18苍林秘境版本前瞻', category: 'beginner', platform: 'embed',
    bvid: 'BV1ohj36BEph', link: 'https://www.bilibili.com/video/BV1ohj36BEph',
    desc: 'S18苍林秘境最强六套阵容解析，助你定位赛五连鸡，包含绽放风暴、裂隙兽远古巨龙、苍木召唤流等核心打法。', duration: '4:59', author: '金铲铲700',
    tags: ['版本前瞻', 'S18机制', '必看', '阵容码']
  },
  {
    id: 2, title: 'S18新手入门基础教学', category: 'beginner', platform: 'embed',
    bvid: 'BV15KjL6GE4x', link: 'https://www.bilibili.com/video/BV15KjL6GE4x',
    desc: 'S18赛季最夯9大阵容推荐，机制详解：Wisps 神火系统、苍木植物、裂隙兽 Alpha Mark 等全覆盖。', duration: '2:30', author: '金铲铲御姐',
    tags: ['新手必看', 'S18机制', '阵容推荐']
  },
  {
    id: 3, title: 'S18经典阵容一览', category: 'beginner', platform: 'embed',
    bvid: 'BV1jbju6AEDj', link: 'https://www.bilibili.com/video/BV1jbju6AEDj',
    desc: '林小北出品，S18经典阵容一览，开服就玩这几套！21万播放验证的上分指南。', duration: '3:52', author: '林小北Lindo',
    tags: ['经典阵容', '开服必看', '林小北', '入门']
  },
  {
    id: 4, title: 'S18五大经典阵容回顾', category: 'beginner', platform: 'embed',
    bvid: 'BV1D1GX6vEbF', link: 'https://www.bilibili.com/video/BV1D1GX6vEbF',
    desc: 'S18苍林秘境五大经典阵容全面回顾，绽放风暴、裂隙兽远古巨龙、巫会卡西奥佩娅等经典回归。', duration: '2:21', author: '金铲铲700',
    tags: ['经典回顾', 'S18返场', '阵容合集']
  },
  {
    id: 5, title: 'S18返场8大强势阵容推荐', category: 'beginner', platform: 'embed',
    bvid: 'BV1FmLf6gE7g', link: 'https://www.bilibili.com/video/BV1FmLf6gE7g',
    desc: 'S18苍林秘境返场后8大强势上分阵容详细推荐，定位赛轻松拿第一！', author: '金铲铲91',
    tags: ['返场', '阵容推荐', '定位赛']
  },
  {
    id: 6, title: '苍木返场最强信息差', category: 'beginner', platform: 'embed',
    bvid: 'BV1P4LX68EaH', link: 'https://www.bilibili.com/video/BV1P4LX68EaH',
    desc: '苍木返场最强信息差玩法，教你利用版本理解差距轻松偷分！', duration: '1:58', author: '画小骨yzx',
    tags: ['信息差', '返场', '偷分']
  },

  // ==================== 阵容教学 ====================
  {
    id: 7, title: '绽放卡尔玛零门槛上分', category: 'lineup', platform: 'embed',
    bvid: 'BV19TLX6GELp', link: 'https://www.bilibili.com/video/BV19TLX6GELp',
    desc: '7人口成型，4绽放+3法术编织者，主C卡尔玛电刀科技枪。简单强势，把把硬玩。', duration: '6:54', author: '最可爱的菊草叶',
    tags: ['赌狗', '卡尔玛', '绽放', '低费', '阵容码']
  },
  {
    id: 8, title: '绽放卡尔玛优化版教学', category: 'lineup', platform: 'embed',
    bvid: 'BV1VD4y187mV', link: 'https://www.bilibili.com/video/BV1VD4y187mV',
    desc: '卡尔玛优化版，吃分更稳强度更高！附一图流阵容码，33万播放验证。', duration: '2:03', author: '桃浪一丶',
    tags: ['卡尔玛', '优化', '稳定吃分', '阵容码']
  },
  {
    id: 9, title: 'S18最强苍木九五阵容', category: 'lineup', platform: 'embed',
    bvid: 'BV1ZDLf6TEKE', link: 'https://www.bilibili.com/video/BV1ZDLf6TEKE',
    desc: '多高费苍木+五费核心终极成型，三星四费纳尔都能瞬秒，7.8万播放。', duration: '15:18', author: '画小骨yzx',
    tags: ['苍木', '九五', '高费', '吃鸡']
  },
  {
    id: 10, title: '巫会灵能卡西奥佩娅阵容', category: 'lineup', platform: 'embed',
    bvid: 'BV1hP411u75i', link: 'https://www.bilibili.com/video/BV1hP411u75i',
    desc: 'S18巫会卡西奥佩娅阵容教学，卡西奥佩娅/莫甘娜/婕拉核心，巫会法系完整运营。', duration: '1:23', author: '云顶小老陈',
    tags: ['巫会', '法术编织者', '卡西奥佩娅', '法系']
  },
  {
    id: 11, title: '苍木无情连打易大师', category: 'lineup', platform: 'embed',
    bvid: 'BV1yWjs6DEP4', link: 'https://www.bilibili.com/video/BV1yWjs6DEP4',
    desc: 'S18最强英雄强化之一——无情连打易大师实况演示，极致攻速叠满秒全场。', duration: '0:16', author: '西木太太',
    tags: ['苍木', '易大师', '无情连打', '英雄强化']
  },
  {
    id: 12, title: '苍木伊泽瑞尔阵容', category: 'lineup', platform: 'embed',
    bvid: 'BV1GtL96mEoc', link: 'https://www.bilibili.com/video/BV1GtL96mEoc',
    desc: '苦等三年，那个一发瞬秒前排的男人回来了！苍木EZ阵容实战教学，4.5万播放。', duration: '2:28', author: 'Evade猫',
    tags: ['苍木', 'EZ', '赌狗', '低费']
  },
  {
    id: 13, title: '炼狱凯南阵容教学', category: 'lineup', platform: 'embed',
    bvid: 'BV1YR4y1C7CT', link: 'https://www.bilibili.com/video/BV1YR4y1C7CT',
    desc: '林小北出品——成型保底前二！5炼狱凯南正确玩法，135万播放S18最热阵容教学。', duration: '7:42', author: '林小北Lindo',
    tags: ['炼狱', '凯南', '林小北', 'S级']
  },
  {
    id: 14, title: '绽放之灵凯南新玩法', category: 'lineup', platform: 'embed',
    bvid: 'BV1VP7k6pErW', link: 'https://www.bilibili.com/video/BV1VP7k6pErW',
    desc: 'S18返场绽放之灵炼狱凯南强势玩法，无限开大瞬秒3星5费。', duration: '1:11', author: '金铲铲91',
    tags: ['凯南', '绽放之灵', '返场', '秒杀']
  },
  {
    id: 15, title: '裂隙兽远古巨龙公式阵容', category: 'lineup', platform: 'embed',
    bvid: 'BV1bM411U7my', link: 'https://www.bilibili.com/video/BV1bM411U7my',
    desc: '云顶S18裂隙兽远古巨龙公式套路，TOO出品，45万播放、7.4K点赞的经典上分阵容。', duration: '1:50', author: '我是TOO',
    tags: ['裂隙兽', '远古巨龙', '公式', '上分']
  },
  {
    id: 16, title: '灵巧兽纳尔特战队阵容教学', category: 'lineup', platform: 'embed',
    bvid: 'BV1DfLR6LEuw', link: 'https://www.bilibili.com/video/BV1DfLR6LEuw',
    desc: 'S18赛季最强阵容！灵巧兽纳尔特战队！5灵巧兽+纳尔蓝buff法爆无限技能，11.4万播放。', duration: '0:44', author: '李子会发光',
    tags: ['灵巧兽', '纳尔', '特战队', '快乐']
  },
  {
    id: 17, title: '宿敌VN阵容教学', category: 'lineup', platform: 'embed',
    bvid: 'BV1mW7A6NEza', link: 'https://www.bilibili.com/video/BV1mW7A6NEza',
    desc: '新晋版本T0宿敌VN，克制小天才纳尔，冷门偷分顶级理解，附阵容码。', duration: '3:33', author: '金铲铲700',
    tags: ['宿敌', 'VN', 'T0', '偷分', '阵容码']
  },
  {
    id: 18, title: '更简单的无脑上分阵容', category: 'lineup', platform: 'embed',
    bvid: 'BV1Ymjs6NEut', link: 'https://www.bilibili.com/video/BV1Ymjs6NEut',
    desc: '画小骨yzx出品，更简单的第二套无脑上分阵容教学，新手福音！', duration: '9:23', author: '画小骨yzx',
    tags: ['无脑', '上分', '新手', '简单']
  },
  {
    id: 19, title: '孤胆英雄大闹苍林阵容', category: 'lineup', platform: 'embed',
    bvid: 'BV1uFjz6vETc', link: 'https://www.bilibili.com/video/BV1uFjz6vETc',
    desc: '战力型卡牌大师阵容解析，沈小夏出品，7.2万播放、3K点赞的热门阵容。', duration: '1:24', author: '沈小夏',
    tags: ['孤胆英雄', '卡牌', '战力', '热门']
  },
  {
    id: 20, title: 'S18第一周7套最强阵容', category: 'lineup', platform: 'embed',
    bvid: 'BV1EYji65EiT', link: 'https://www.bilibili.com/video/BV1EYji65EiT',
    desc: 'S18第一周7套最强阵容推荐，阿助出品，4.6万播放、851赞的上分必看合集。', duration: '1:52', author: '阿助今天有工资吗',
    tags: ['阵容推荐', '第一周', '合集', '上分']
  },

  // ==================== 运营教学 ====================
  {
    id: 21, title: '地下秘境团收菜时机教学', category: 'operation', platform: 'embed',
    bvid: 'BV1swL96vEBw', link: 'https://www.bilibili.com/video/BV1swL96vEBw',
    desc: '血量50+继续叠，30-50看战力，<30立即收菜。4层纹章质变，7层英雄复制器天花板！', duration: '4:00', author: '金铲铲创作者',
    tags: ['秘境团', '收菜', '运营']
  },
  {
    id: 22, title: '地下秘境团运营详解', category: 'operation', platform: 'embed',
    bvid: 'BV1dP4y1Q7tZ', link: 'https://www.bilibili.com/video/BV1dP4y1Q7tZ',
    desc: '最细致的秘境团过渡运营手法，3秘境控血vs5秘境卖血策略对比。', duration: '12:00', author: '金蝉',
    tags: ['秘境团', '运营', '三星五费']
  },
  {
    id: 23, title: 'S18经济运营进阶教学', category: 'operation', platform: 'bilibili',
    link: 'https://www.bilibili.com/video/BV1mjD6EkEbA',
    desc: '连胜连败经济管理、利息最大化、升人口节奏、D牌时机，全面掌握运营基本功。', author: 'B站创作者',
    tags: ['经济', '利息', '升人口', 'D牌']
  },
  {
    id: 24, title: 'S18强力Wisps盘点', category: 'operation', platform: 'embed',
    bvid: 'BV1LSLR6pEgq', link: 'https://www.bilibili.com/video/BV1LSLR6pEgq',
    desc: 'S18强力Wisps神火全面盘点，哪些神火是版本T0，见到必选，1.5万播放。', duration: '2:06', author: '云顶精神力',
    tags: ['Wisps', '神火', '盘点', 'T0']
  },
  {
    id: 25, title: '经济阿木木偷分攻略', category: 'operation', platform: 'embed',
    bvid: 'BV1h9LR6UEFF', link: 'https://www.bilibili.com/video/BV1h9LR6UEFF',
    desc: '游戏内置外挂级英雄强化！遇到一定要选，随便追三星五费，10.6万播放。', duration: '1:17', author: '金铲铲700',
    tags: ['阿木木', '偷分', '经济', '三星五费']
  },
  {
    id: 26, title: 'S18如何拿到想要的英雄强化', category: 'operation', platform: 'embed',
    bvid: 'BV1x84y1t7Ah', link: 'https://www.bilibili.com/video/BV1x84y1t7Ah',
    desc: 'MortDog官方教学：S18如何精准拿到想要的英雄强化，37万播放10.6K点赞。', duration: '1:58', author: '弈士阿龙',
    tags: ['英雄强化', '机制', '技巧', '官方']
  },

  // ==================== 装备神器 ====================
  {
    id: 27, title: 'S18神器装备搭配指南', category: 'equipment', platform: 'embed',
    bvid: 'BV1fFjb6XE1o', link: 'https://www.bilibili.com/video/BV1fFjb6XE1o',
    desc: 'S18更新后第1周7大神器阵容推荐，全都是完美适配强度拉满，2.1万播放。', duration: '2:16', author: '金铲铲91',
    tags: ['神器', '装备', '奥恩', '搭配']
  },
  {
    id: 28, title: '锐评S18返场老装备', category: 'equipment', platform: 'embed',
    bvid: 'BV1wWVB6EE9i', link: 'https://www.bilibili.com/video/BV1wWVB6EE9i',
    desc: '从夯到拉锐评S18返场老装备：羊刀、灵风、圣杯等经典装备强度全面分析，5.2万播放。', duration: '4:04', author: '金铲铲700',
    tags: ['老装备', '回归', '评测', '羊刀']
  },
  {
    id: 29, title: 'S18英雄强化全部合集', category: 'equipment', platform: 'embed',
    bvid: 'BV14kjj6iEoh', link: 'https://www.bilibili.com/video/BV14kjj6iEoh',
    desc: 'S18返场全部英雄强化合集！一览所有英雄的专属强化效果，2.5万播放。', duration: '3:17', author: '云顶内个',
    tags: ['英雄强化', '合集', '全英雄', '必备']
  },
  {
    id: 30, title: '拿到必吃分的强化排行', category: 'equipment', platform: 'embed',
    bvid: 'BV1D84y1p7G5', link: 'https://www.bilibili.com/video/BV1D84y1p7G5',
    desc: '拿到必吃分的强化排名，版本英雄强化梯度一览，26万播放8K点赞。', duration: '1:08', author: '兔子解说JokerTu',
    tags: ['英雄强化', '梯度', '排行', '必看']
  },
  {
    id: 31, title: '锐评S18返场装备对比', category: 'equipment', platform: 'embed',
    bvid: 'BV1xV7K6zEDN', link: 'https://www.bilibili.com/video/BV1xV7K6zEDN',
    desc: '锐评S18返场装备！新老装备全面对比，哪些装备变强哪些变弱一目了然。', duration: '4:27', author: '金铲铲-烂分学教父',
    tags: ['装备', '返场', '对比', '评测']
  },

  // ==================== 娱乐玩法 ====================
  {
    id: 32, title: '八秘境团终极快乐玩法', category: 'fun', platform: 'embed',
    bvid: 'BV1Ajju63E1G', link: 'https://www.bilibili.com/video/BV1Ajju63E1G',
    desc: '8秘境团全开特效展示！无限制刷新商店、无限装备掉落，S18最爽体验，9.0万播放。', author: '金铲铲阿强',
    tags: ['秘境团', '娱乐', '8秘境']
  },
  {
    id: 33, title: '十裂隙兽效果展示', category: 'fun', platform: 'embed',
    bvid: 'BV1H9JA6aEHU', link: 'https://www.bilibili.com/video/BV1H9JA6aEHU',
    desc: 'S18十裂隙兽效果展示，究极棱彩羁绊是夯爆了还是拉完了？6.5万播放。', duration: '0:14', author: '金铲铲小蛟龙',
    tags: ['裂隙兽', '十裂隙', '棱彩']
  },
  {
    id: 34, title: 'S18返场最强翻车王', category: 'fun', platform: 'embed',
    bvid: 'BV14njP6AEBb', link: 'https://www.bilibili.com/video/BV14njP6AEBb',
    desc: 'S18返场谁是最强翻车王？搞笑翻车集锦，7.1万播放，轻松一笑。', duration: '2:32', author: '金铲铲御姐',
    tags: ['翻车', '搞笑', '返场', '娱乐']
  },
  {
    id: 35, title: '8宿敌棱彩羁绊玩法', category: 'fun', platform: 'embed',
    bvid: 'BV1M24y1k73z', link: 'https://www.bilibili.com/video/BV1M24y1k73z',
    desc: '云顶S18限定技8宿敌，只需一个铲子轻松拿下游戏！棱彩羁绊快乐体验。', duration: '1:55', author: '桃浪一丶',
    tags: ['宿敌', '棱彩', '铲子', '快乐']
  },
  {
    id: 36, title: '三星劫三把羊刀快乐局', category: 'fun', platform: 'embed',
    bvid: 'BV1tHj66MEdL', link: 'https://www.bilibili.com/video/BV1tHj66MEdL',
    desc: '老羊刀回归了？懂了给三星劫三把羊刀！S18最离谱娱乐玩法演示。', duration: '1:35', author: '懂猪咯',
    tags: ['劫', '羊刀', '娱乐', '三星']
  },

  // ==================== 进阶技巧 ====================
  {
    id: 37, title: '战力型守护者避雷指南', category: 'advanced', platform: 'embed',
    bvid: 'BV1gnjJ6EEkY', link: 'https://www.bilibili.com/video/BV1gnjJ6EEkY',
    desc: '战力型城市守护蛋强度排行，哪些蛋是陷阱千万别选，4.8万播放2.6K点赞。', duration: '2:59', author: '沈小夏',
    tags: ['守护者', '蛋', '战力', '避雷']
  },
  {
    id: 38, title: '经济型守护者强度排行', category: 'advanced', platform: 'embed',
    bvid: 'BV1L7jc6BEt1', link: 'https://www.bilibili.com/video/BV1L7jc6BEt1',
    desc: '锐评经济型城市守护者，金铲铲S18城市守护者该怎么选，7.6万播放3.3K点赞。', duration: '3:26', author: '沈小夏',
    tags: ['守护者', '经济', '排行', '选择']
  },
  {
    id: 39, title: '裂隙兽远古巨龙搭配旧羊刀', category: 'advanced', platform: 'embed',
    bvid: 'BV1s6jx6fESn', link: 'https://www.bilibili.com/video/BV1s6jx6fESn',
    desc: 'S18裂隙兽远古巨龙搭配回归旧羊刀伤害拉满，装备与英雄联动的深度理解教学。', duration: '1:23', author: '改名字需要我6个硬币',
    tags: ['远古巨龙', '羊刀', '装备', '联动']
  },
  {
    id: 40, title: '绽放德莱文八皇鼎立', category: 'advanced', platform: 'embed',
    bvid: 'BV14G7K6gErm', link: 'https://www.bilibili.com/video/BV14G7K6gErm',
    desc: '边德边盗缔造八皇鼎立！天胡秘境团遭同行反杀后的精彩翻盘，进阶博弈教学。', duration: '15:27', author: '赛文SIX6',
    tags: ['德莱文', '秘境团', '翻盘', '博弈']
  },
  {
    id: 41, title: 'S18返场S18刮痧之王评测', category: 'advanced', platform: 'embed',
    bvid: 'BV1vtj86WEmw', link: 'https://www.bilibili.com/video/BV1vtj86WEmw',
    desc: '这就是返场S18的刮痧之王？TOO出品评测，3.7万播放1K点赞的硬核分析。', duration: '1:16', author: '我是TOO',
    tags: ['评测', '刮痧', '返场', '数据分析']
  },
  {
    id: 42, title: 'Wisps高涨EZ实战', category: 'advanced', platform: 'embed',
    bvid: 'BV1GnJM68EXY', link: 'https://www.bilibili.com/video/BV1GnJM68EXY',
    desc: '校长出品，左脚踩右脚的Wisps高涨EZ看笑了，顶级理解实战教学，7.6万播放。', duration: '22:10', author: '较长的金铲铲',
    tags: ['Wisps高涨', 'EZ', '校长', '实战']
  },

  // ==================== 抖音平台精选 ====================
  {
    id: 43, title: 'S18苍林秘境阵容速成', category: 'beginner', platform: 'douyin',
    link: 'https://www.douyin.com/search/金铲铲S18苍林秘境阵容速成?type=video',
    desc: '抖音头部创作者出品，S18苍林秘境一分钟学会一套强力阵容，适合碎片时间快速学习。', author: '抖音创作者',
    tags: ['速成', '阵容', '一分钟', '新手']
  },
  {
    id: 44, title: '裂隙兽远古巨龙实战详解', category: 'lineup', platform: 'douyin',
    link: 'https://www.douyin.com/search/金铲铲S18裂隙兽远古巨龙阵容?type=video',
    desc: '抖音热门S18裂隙兽远古巨龙教学，7000血远古巨龙一刀一个，适合上分食用。', author: '抖音创作者',
    tags: ['裂隙兽', '远古巨龙', '上分', '实战']
  },
  {
    id: 45, title: '决战AI机甲精英阵容', category: 'lineup', platform: 'douyin',
    link: 'https://www.douyin.com/search/金铲铲S18决战AI精英阵容?type=video',
    desc: '抖音最新S18决战AI机甲精英阵容教学，最新理解助你冲分。', author: '抖音创作者',
    tags: ['AI', '机甲精英', '新理解', '上分']
  },
  {
    id: 46, title: 'S18最强赌狗泰隆教学', category: 'lineup', platform: 'douyin',
    link: 'https://www.douyin.com/search/金铲铲S18赌狗泰隆阵容?type=video',
    desc: '抖音热门超英泰隆阵容，福牛混沌双羁绊加持，专跳后排秒杀脆皮。', author: '抖音创作者',
    tags: ['泰隆', '赌狗', '福牛', '混沌']
  },
  {
    id: 47, title: 'S18情报绽放卡尔玛教学', category: 'lineup', platform: 'douyin',
    link: 'https://www.douyin.com/search/金铲铲S18情报绽放卡尔玛教学?type=video',
    desc: '抖音4情报+3绽放卡尔玛阵容详解，低门槛7人口成型，新手友好上分首选。', author: '抖音创作者',
    tags: ['卡尔玛', '情报', '绽放', '赌狗']
  },
  {
    id: 48, title: 'S18裂隙兽女枪AOE阵容', category: 'lineup', platform: 'douyin',
    link: 'https://www.douyin.com/search/金铲铲S18裂隙兽女枪AOE阵容?type=video',
    desc: '抖音7裂隙兽+精英女枪高坦度大范围AOE阵容，单卡数值拉满通吃常规体系。', author: '抖音创作者',
    tags: ['女枪', '裂隙兽', 'AOE', '精英']
  },
  {
    id: 49, title: 'S18秘境团上分娱乐两不误', category: 'operation', platform: 'douyin',
    link: 'https://www.douyin.com/search/金铲铲S18秘境团运营教学?type=video',
    desc: '抖音秘境团运营教学合集，连败控血→收菜时机→转型九五，一站式学完。', author: '抖音创作者',
    tags: ['秘境团', '运营', '收菜', '教学']
  },
  {
    id: 50, title: 'S18强势Wisps选择指南', category: 'equipment', platform: 'douyin',
    link: 'https://www.douyin.com/search/金铲铲S18Wisps选择指南?type=video',
    desc: '抖音S18强力Wisps神火选择建议，哪些神火是陷阱哪些必拿，一分钟了解版本答案。', author: '抖音创作者',
    tags: ['Wisps', '神火', '选择', '避雷', '推荐']
  },
  {
    id: 51, title: 'S18九巫会棱彩大羁绊', category: 'fun', platform: 'douyin',
    link: 'https://www.douyin.com/search/金铲铲S18九巫会棱彩羁绊?type=video',
    desc: '抖音S18九巫会大羁绊养成过程，全屏巫会特效华丽到爆，快乐娱乐首选。', author: '抖音创作者',
    tags: ['巫会', '棱彩', '娱乐', '特效']
  },
  {
    id: 52, title: 'S18站位防黑客跳后排', category: 'advanced', platform: 'douyin',
    link: 'https://www.douyin.com/search/金铲铲S18站位防黑客?type=video',
    desc: '抖音站位教学：如何用一字长蛇阵、角落阵防黑客和刺客切入，高端局必修课。', author: '抖音创作者',
    tags: ['站位', '防守', '黑客', '刺客']
  }
]
