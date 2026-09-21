// 金铲铲之战 S18苍林秘境赛季阵容详情数据（社区数据）
// 数据来源：
// 1. 金铲铲之战官方公告：https://jcc.qq.com
// 2. Mobalytics TFT Set 18 Team Comps: https://mobalytics.gg/tft/set18/team-comps
// 3. 云顶之弈数据站 - TFT Set 18 Team Comps
// 4. RiftDaily - TFT Set 18 Enchanted Wilds guide

export const teamDetailsData = [
  {
    id: 1,
    name: '绽放风暴',
    tier: 'T0',
    description: '5绽放+2法术编织者，阿狸+瑟提双核输出，Wisps 持续增益',
    difficulty: '中等',
    population: 8,
    heroes: [
      { name: '卡尔玛', cost: 1, position: { row: 2, col: 3 }, role: '副C', synergies: ['绽放', '法术编织者'] },
      { name: '约里克', cost: 1, position: { row: 0, col: 2 }, role: '副坦', synergies: ['绽放', '重装战士', '召唤师'] },
      { name: '优娜拉', cost: 2, position: { row: 2, col: 1 }, role: '功能', synergies: ['绽放', '行刑官'] },
      { name: '易大师', cost: 3, position: { row: 2, col: 4 }, role: '副C', synergies: ['绽放', '适配者'] },
      { name: '阿狸', cost: 4, position: { row: 2, col: 5 }, role: '主C', synergies: ['绽放', '法术编织者'] },
      { name: '瑟提', cost: 4, position: { row: 0, col: 3 }, role: '主坦', synergies: ['绽放', '斗士'] },
      { name: '艾希', cost: 5, position: { row: 2, col: 2 }, role: '补强', synergies: ['绽放', '猎手'] },
      { name: '茂凯', cost: 5, position: { row: 0, col: 4 }, role: '副坦', synergies: ['古树', '重装战士'] }
    ],
    synergies: ['5 绽放', '2 法术编织者', '2 重装战士', '1 古树'],
    equipment: {
      mainC: {
        hero: '阿狸',
        required: ['灭世者的死亡之帽', '蓝霸符'],
        optional: ['大天使之杖', '珠光护手', '鬼索的狂暴之刃']
      },
      mainTank: {
        hero: '瑟提',
        required: ['石像鬼石板甲', '日炎斗篷'],
        optional: ['狂徒铠甲', '荆棘之甲']
      }
    },
    operation: {
      early: '2阶段用卡尔玛+约里克+优娜拉凑3绽放打工，2-1升4，2-5升5走连胜',
      mid: '3-2拉6，补易大师凑5绽放，攒钱等7人口启动',
      late: '4-1拉7大D找阿狸+瑟提双二星；锁血后卡利息升8凑齐5绽放完全体'
    },
    augments: {
      hero: ['精神炸弹（阿狸专属，必拿）', '兽性觉醒（瑟提专属）'],
      combat: ['绽放之徽', '绽放之冕', '蓝电池'],
      economy: ['利滚利', '高端购物']
    },
    counter: {
      advantage: '5绽放+Wisps 联动，每轮都有精灵增益，阿狸范围爆发+瑟提低血二次施法',
      disadvantage: '4费阿狸同行多时难追二星；前期依赖绽放纹章'
    },
    tips: '阿狸需蓝霸符频繁施法；瑟提装备以肉装为主，半血触发二次施法是关键'
  },
  {
    id: 2,
    name: '裂隙兽远古巨龙',
    tier: 'T0',
    description: '7裂隙兽+远古巨龙双格输出，Alpha Mark 强化主力',
    difficulty: '中等',
    population: 9,
    heroes: [
      { name: '小炭', cost: 1, position: { row: 1, col: 2 }, role: '副C', synergies: ['裂隙兽', '猎手'] },
      { name: '碎石', cost: 1, position: { row: 0, col: 2 }, role: '副坦', synergies: ['裂隙兽', '祈求者'] },
      { name: '暗影狼', cost: 2, position: { row: 0, col: 3 }, role: '副坦', synergies: ['裂隙兽', '掠夺者'] },
      { name: '格罗普', cost: 2, position: { row: 1, col: 3 }, role: '功能', synergies: ['裂隙兽', '适配者'] },
      { name: '斯库特尔', cost: 2, position: { row: 0, col: 4 }, role: '功能', synergies: ['裂隙兽', '重装战士'] },
      { name: '克鲁格', cost: 3, position: { row: 0, col: 1 }, role: '副坦', synergies: ['裂隙兽', '斗士'] },
      { name: '荆棘甲虫', cost: 4, position: { row: 1, col: 4 }, role: '副C', synergies: ['裂隙兽', '掠夺者'] },
      { name: '古代哨兵', cost: 4, position: { row: 0, col: 5 }, role: '功能', synergies: ['裂隙兽', '先锋', '祈求者'] },
      { name: '远古巨龙', cost: 5, position: { row: 1, col: 5 }, role: '主C', synergies: ['裂隙兽', '顶级捕食者'] }
    ],
    synergies: ['7 裂隙兽', '2 祈求者', '2 掠夺者', '1 顶级捕食者'],
    equipment: {
      mainC: {
        hero: '远古巨龙',
        required: ['无尽之刃', '最后的轻语'],
        optional: ['海克斯科技枪刃', '汲取剑', '巨人杀手']
      },
      mainTank: {
        hero: '克鲁格',
        required: ['石像鬼石板甲', '日炎斗篷'],
        optional: ['狂徒铠甲', '荆棘之甲']
      }
    },
    operation: {
      early: '2阶段3裂隙兽打工（小炭+碎石+暗影狼），2-1升4，2-5升5',
      mid: '3-2拉6，补格罗普/斯库特尔凑5裂隙兽，Alpha Mark 强化小炭主C',
      late: '4-1拉7大D找荆棘甲虫+古代哨兵，凑7裂隙兽；4-5升8找远古巨龙，凑齐10裂隙兽开+1队伍'
    },
    augments: {
      hero: ['远古怒吼（远古巨龙专属，必拿）', '裂隙之力（碎石）'],
      combat: ['裂隙兽之徽', '裂隙兽之冕', '飞升'],
      economy: ['利滚利加强版', 'DD街区']
    },
    counter: {
      advantage: '远古巨龙占2格，AOE+晕眩全屏；Alpha Mark 强化主力输出爆炸',
      disadvantage: '9人口才能凑10裂隙兽+1队伍上限；远古巨龙同行多时难拿'
    },
    tips: 'Alpha Mark 给远古巨龙获得处决低血敌人；小炭/碎石前期是核心，星级要追'
  },
  {
    id: 3,
    name: '苍木召唤流',
    tier: 'T0',
    description: '5苍木+召唤师，奥恩+乐芙兰+伊泽瑞尔+纳尔，植物铺场压制',
    difficulty: '困难',
    population: 8,
    heroes: [
      { name: '奥恩', cost: 1, position: { row: 0, col: 2 }, role: '主坦', synergies: ['苍木', '守护者'] },
      { name: '阿利斯塔', cost: 2, position: { row: 0, col: 3 }, role: '副坦', synergies: ['苍木', '斗士'] },
      { name: '乐芙兰', cost: 2, position: { row: 2, col: 3 }, role: '主C', synergies: ['苍木', '法术编织者'] },
      { name: '赫卡里姆', cost: 3, position: { row: 0, col: 1 }, role: '副坦', synergies: ['苍木', '先锋'] },
      { name: '伊泽瑞尔', cost: 4, position: { row: 2, col: 4 }, role: '副C', synergies: ['苍木', '行刑官'] },
      { name: '纳尔', cost: 5, position: { row: 1, col: 4 }, role: '主C', synergies: ['苍木', '灵巧兽', '斗士'] },
      { name: '霞', cost: 1, position: { row: 2, col: 1 }, role: '功能', synergies: ['苍木', '仙灵', '速射'] },
      { name: '艾翁', cost: 5, position: { row: 0, col: 4 }, role: '功能', synergies: ['绿父'] }
    ],
    synergies: ['5 苍木', '2 法术编织者', '2 守护者', '1 绿父', '1 灵巧兽'],
    equipment: {
      mainC: {
        hero: '乐芙兰',
        required: ['蓝霸符', '灭世者的死亡之帽'],
        optional: ['珠光护手', '大天使之杖']
      },
      subC: {
        hero: '伊泽瑞尔',
        required: ['最后的轻语', '无尽之刃'],
        optional: ['海克斯科技枪刃', '巨人杀手']
      },
      mainTank: {
        hero: '奥恩',
        required: ['石像鬼石板甲', '日炎斗篷'],
        optional: ['狂徒铠甲', '荆棘之甲']
      }
    },
    operation: {
      early: '2阶段3苍木打工（奥恩+阿利斯塔+乐芙兰），2-1升4',
      mid: '3-2拉6，补赫卡里姆凑5苍木，植物铺场压制',
      late: '4-1拉7大D找伊泽瑞尔+纳尔；4-5升8找艾翁凑6苍木+绿父'
    },
    augments: {
      hero: ['苍木箭术（伊泽瑞尔专属）', '苍木之锤（奥恩）'],
      combat: ['苍木之徽', '苍木之冕', '召唤师之徽'],
      economy: ['利滚利', '升级咯']
    },
    counter: {
      advantage: '苍木植物持续生成，5苍木后期场面铺满，乐芙兰+伊泽瑞尔双核输出',
      disadvantage: '苍木纹章凑不齐5层时前期较弱；纳尔5费难拿'
    },
    tips: '苍木植物位置要放前排吸收伤害；乐芙兰蓝霸符频繁施法触发分身'
  },
  {
    id: 4,
    name: '巫会卡西奥佩娅',
    tier: 'T1',
    description: '4巫会+法术编织者，卡西奥佩娅高频施法+持续中毒',
    difficulty: '中等',
    population: 8,
    heroes: [
      { name: '卡蜜尔', cost: 1, position: { row: 0, col: 2 }, role: '副坦', synergies: ['巫会', '掠夺者'] },
      { name: '凯特琳', cost: 2, position: { row: 2, col: 1 }, role: '功能', synergies: ['巫会', '猎手'] },
      { name: '伊莉丝', cost: 2, position: { row: 0, col: 3 }, role: '副坦', synergies: ['巫会', '先锋'] },
      { name: '卡西奥佩娅', cost: 3, position: { row: 2, col: 3 }, role: '主C', synergies: ['巫会', '法术编织者'] },
      { name: '莫甘娜', cost: 4, position: { row: 1, col: 2 }, role: '副C', synergies: ['巫会', '祈求者'] },
      { name: '婕拉', cost: 4, position: { row: 1, col: 3 }, role: '功能', synergies: ['荆棘少女', '召唤师'] },
      { name: '索拉卡', cost: 4, position: { row: 1, col: 4 }, role: '治疗', synergies: ['致命花', '行刑官'] },
      { name: '拉克丝', cost: 5, position: { row: 2, col: 4 }, role: '补强', synergies: ['化身'] }
    ],
    synergies: ['4 巫会', '2 法术编织者', '2 祈求者', '1 化身'],
    equipment: {
      mainC: {
        hero: '卡西奥佩娅',
        required: ['蓝霸符', '灭世者的死亡之帽'],
        optional: ['大天使之杖', '珠光护手']
      },
      mainTank: {
        hero: '伊莉丝',
        required: ['石像鬼石板甲', '日炎斗篷'],
        optional: ['狂徒铠甲', '荆棘之甲']
      }
    },
    operation: {
      early: '2阶段3巫会打工（卡蜜尔+凯特琳+伊莉丝），2-1升4',
      mid: '3-2拉6，小D找2星卡西奥佩娅，凑4巫会',
      late: '4-1拉7大D找莫甘娜+索拉卡凑完整羁绊；4-5升8挂拉克丝化身'
    },
    augments: {
      hero: ['巫会之毒（卡西奥佩娅专属）', '巫会诅咒（莫甘娜）'],
      combat: ['巫会之徽', '法术编织者之徽', '蓝电池'],
      economy: ['利滚利', '对冲基金']
    },
    counter: {
      advantage: '卡西奥佩娅持续中毒+莫甘娜减益，4巫会 Essence 滚雪球',
      disadvantage: '前期巫会战力弱，需连败或保血运营'
    },
    tips: '卡西奥佩娅蓝霸符必备，搭配死亡帽技能持续中毒消耗全场'
  },
  {
    id: 5,
    name: '灵巧兽纳尔',
    tier: 'T1',
    description: '5灵巧兽+斗士，让纳尔骑 BFF 叠大量生命攻速',
    difficulty: '中等',
    population: 7,
    heroes: [
      { name: '古布子', cost: 1, position: { row: 0, col: 2 }, role: '副坦', synergies: ['灵巧兽', '斗士'] },
      { name: '维迦', cost: 1, position: { row: 2, col: 3 }, role: '副C', synergies: ['怪异', '灵巧兽', '法术编织者'] },
      { name: '提莫', cost: 2, position: { row: 2, col: 1 }, role: '功能', synergies: ['灵巧兽', '祈求者'] },
      { name: '崔丝塔娜', cost: 3, position: { row: 2, col: 2 }, role: '副C', synergies: ['仙灵', '灵巧兽', '猎手'] },
      { name: '拉莫斯', cost: 3, position: { row: 0, col: 3 }, role: '主坦', synergies: ['灵巧兽', '守护者'] },
      { name: '纳尔', cost: 5, position: { row: 1, col: 3 }, role: '主C', synergies: ['苍木', '灵巧兽', '斗士'] },
      { name: '阿狸', cost: 4, position: { row: 2, col: 4 }, role: '补强', synergies: ['绽放', '法术编织者'] }
    ],
    synergies: ['5 灵巧兽', '2 斗士', '2 祈求者'],
    equipment: {
      mainC: {
        hero: '纳尔',
        required: ['鬼索的狂暴之刃', '泰坦的坚决'],
        optional: ['汲取剑', '海克斯科技枪刃', '水银']
      },
      mainTank: {
        hero: '拉莫斯',
        required: ['石像鬼石板甲', '日炎斗篷'],
        optional: ['狂徒铠甲', '荆棘之甲']
      }
    },
    operation: {
      early: '2阶段3灵巧兽打工（古布子+维迦+提莫），2-1升4',
      mid: '3-2拉6，小D找3星古布子+2星崔丝塔娜，5灵巧兽+1骑手让古布子上 BFF',
      late: '4-1拉7找纳尔骑 BFF，5灵巧兽完全体，纳尔叠大量属性'
    },
    augments: {
      hero: ['灵巧兽之力', '原始猎豹'],
      combat: ['灵巧兽之徽', '斗士之徽', '飞升'],
      economy: ['利滚利', 'DD街区']
    },
    counter: {
      advantage: '5灵巧兽+纳尔骑 BFF，纳尔血量+攻速爆炸，5费核心输出',
      disadvantage: '5费纳尔难拿，需赌狗运营；前期较弱'
    },
    tips: '纳尔必带羊刀叠攻速+泰坦减控；提莫蘑菇有概率开出重金币'
  },
  {
    id: 6,
    name: '炼狱凯南',
    tier: 'T1',
    description: '5炼狱+行刑官，凯南+阿木木+慎前排燃烧',
    difficulty: '中等',
    population: 8,
    heroes: [
      { name: '阿卡丽', cost: 1, position: { row: 1, col: 3 }, role: '副C', synergies: ['炼狱', '适配者', '掠夺者'] },
      { name: '维鲁斯', cost: 1, position: { row: 2, col: 1 }, role: '功能', synergies: ['炼狱', '速射'] },
      { name: '慎', cost: 2, position: { row: 0, col: 2 }, role: '副坦', synergies: ['炼狱', '守护者'] },
      { name: '阿木木', cost: 4, position: { row: 0, col: 3 }, role: '主坦', synergies: ['炼狱', '重装战士'] },
      { name: '凯南', cost: 5, position: { row: 1, col: 4 }, role: '主C', synergies: ['炼狱', '行刑官'] },
      { name: '索拉卡', cost: 4, position: { row: 1, col: 2 }, role: '治疗', synergies: ['致命花', '行刑官'] },
      { name: '克格莫', cost: 3, position: { row: 2, col: 2 }, role: '副C', synergies: ['腐蚀', '祈求者', '适配者'] }
    ],
    synergies: ['5 炼狱', '2 行刑官', '2 守护者', '2 适配者'],
    equipment: {
      mainC: {
        hero: '凯南',
        required: ['灭世者的死亡之帽', '鬼索的狂暴之刃'],
        optional: ['珠光护手', '大天使之杖']
      },
      mainTank: {
        hero: '阿木木',
        required: ['石像鬼石板甲', '日炎斗篷'],
        optional: ['狂徒铠甲', '荆棘之甲']
      }
    },
    operation: {
      early: '2阶段3炼狱打工（阿卡丽+维鲁斯+慎），2-1升4',
      mid: '3-2拉6，补克格莫凑5炼狱，5炼狱点燃商店滚高费',
      late: '4-1拉7大D找阿木木+凯南，5炼狱完全体燃烧全场'
    },
    augments: {
      hero: ['炼狱雷击（凯南专属）', '炼狱守护（慎）'],
      combat: ['炼狱之徽', '炼狱之冕', '蓝电池'],
      economy: ['利滚利', '高端购物']
    },
    counter: {
      advantage: '5炼狱点燃4个商店格滚高费，凯南核爆范围输出+阿木木前排坦度',
      disadvantage: '5费凯南难拿；5炼狱点燃商店格机制要熟练运用'
    },
    tips: '凯南必带死亡帽+羊刀持续输出；炼狱点燃商店格要灵活运用滚高费'
  },
  {
    id: 7,
    name: '宿敌猎杀',
    tier: 'T2',
    description: '2宿敌+猎手+掠夺者，雷恩加尔/卡兹克切后排',
    difficulty: '困难',
    population: 8,
    heroes: [
      { name: '雷恩加尔', cost: 3, position: { row: 1, col: 3 }, role: '主C', synergies: ['宿敌'] },
      { name: '卡兹克', cost: 3, position: { row: 1, col: 2 }, role: '副C', synergies: ['宿敌'] },
      { name: '凯特琳', cost: 2, position: { row: 2, col: 1 }, role: '功能', synergies: ['巫会', '猎手'] },
      { name: '希维尔', cost: 4, position: { row: 2, col: 3 }, role: '副C', synergies: ['原始', '猎手'] },
      { name: '蔚', cost: 3, position: { row: 0, col: 2 }, role: '副坦', synergies: ['原始', '重装战士'] },
      { name: '慎', cost: 2, position: { row: 0, col: 3 }, role: '副坦', synergies: ['炼狱', '守护者'] },
      { name: '厄斐琉斯', cost: 4, position: { row: 2, col: 4 }, role: '补强', synergies: ['月亮', '速射'] },
      { name: '凯尔', cost: 2, position: { row: 2, col: 2 }, role: '功能', synergies: ['太阳', '速射'] }
    ],
    synergies: ['2 宿敌', '3 猎手', '2 速射', '2 守护者'],
    equipment: {
      mainC: {
        hero: '雷恩加尔',
        required: ['无尽之刃', '最后的轻语'],
        optional: ['汲取剑', '水银', '巨人杀手']
      },
      mainTank: {
        hero: '慎',
        required: ['石像鬼石板甲', '日炎斗篷'],
        optional: ['狂徒铠甲', '荆棘之甲']
      }
    },
    operation: {
      early: '2阶段赌雷恩加尔/卡兹克打工，2-1升4',
      mid: '3-2拉6，找3星雷恩加尔+3星卡兹克，凑2宿敌',
      late: '4-1拉7大D补希维尔+厄斐琉斯，2宿敌+3猎手完全体'
    },
    augments: {
      hero: ['宿敌之力', '宿敌之徽'],
      combat: ['猎手之徽', '速射之徽', '飞升'],
      economy: ['利滚利', 'DD街区']
    },
    counter: {
      advantage: '2宿敌对决后雷恩加尔/卡兹克获得永久加成，切后排爆发强',
      disadvantage: '成型依赖三星3费；同行内卷时雷恩加尔难拿'
    },
    tips: '雷恩加尔必带无尽+轻语切后排爆发；2宿敌对决机制要触发'
  },
  {
    id: 8,
    name: '化身拉克丝',
    tier: 'T2',
    description: '拉克丝化身 trait 双倍加成，搭太阳/月亮混合',
    difficulty: '中等',
    population: 8,
    heroes: [
      { name: '凯尔', cost: 2, position: { row: 2, col: 1 }, role: '副C', synergies: ['太阳', '速射'] },
      { name: '蕾欧娜', cost: 1, position: { row: 0, col: 2 }, role: '副坦', synergies: ['太阳', '守护者'] },
      { name: '瑟庄妮', cost: 2, position: { row: 0, col: 3 }, role: '主坦', synergies: ['太阳', '重装战士'] },
      { name: '阿璐妮', cost: 5, position: { row: 1, col: 3 }, role: '功能', synergies: ['调谐', '月亮', '法术编织者'] },
      { name: '黛安娜', cost: 3, position: { row: 1, col: 2 }, role: '副C', synergies: ['月亮', '掠夺者', '先锋'] },
      { name: '厄斐琉斯', cost: 4, position: { row: 2, col: 3 }, role: '副C', synergies: ['月亮', '速射'] },
      { name: '塔里克', cost: 5, position: { row: 0, col: 4 }, role: '主坦', synergies: ['翠绿之相', '先锋'] },
      { name: '拉克丝', cost: 5, position: { row: 2, col: 4 }, role: '主C', synergies: ['化身'] }
    ],
    synergies: ['1 化身（双倍）', '3 太阳', '3 月亮', '2 速射', '2 守护者'],
    equipment: {
      mainC: {
        hero: '拉克丝',
        required: ['灭世者的死亡之帽', '蓝霸符'],
        optional: ['珠光护手', '大天使之杖']
      },
      mainTank: {
        hero: '塔里克',
        required: ['石像鬼石板甲', '日炎斗篷'],
        optional: ['狂徒铠甲', '荆棘之甲']
      }
    },
    operation: {
      early: '2阶段3太阳打工（蕾欧娜+凯尔+瑟庄妮），2-1升4',
      mid: '3-2拉6，补黛安娜凑3月亮，化身拉克丝进场双倍加成',
      late: '4-1拉7大D找厄斐琉斯+塔里克；4-5升8凑阿璐妮调谐'
    },
    augments: {
      hero: ['化身之力', '翠绿庇护（塔里克）'],
      combat: ['太阳之徽', '月亮之徽', '蓝电池'],
      economy: ['利滚利', '升级咯']
    },
    counter: {
      advantage: '化身拉克丝双倍 trait 加成，搭太阳/月亮混合触发多个 origin',
      disadvantage: '5费拉克丝+5费塔里克+5费阿璐妮三5费难拿，需要高端购物'
    },
    tips: '拉克丝进场后商店其他化身变成同 trait，可灵活搭配；塔里克+瑟庄妮双前排稳定'
  }
]

// 根据ID获取阵容详情
export const getTeamDetailById = (id) => {
  return teamDetailsData.find(team => team.id === Number(id))
}
