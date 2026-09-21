// 金铲铲之战 S8怪兽入侵赛季阵容详情数据（官方数据）
// 数据来源：
// 1. 金铲铲之战官方公告：https://jcc.qq.com
// 2. 金铲铲之战官方微博 - 怪兽入侵赛季返场公告（2025年6月17日）
// 3. TapTap金铲铲之战官方社区 - S8怪兽入侵返场阵容推荐
// 4. 云顶之弈数据站 - TFT Set 8 Team Comps 官方数据
// 5. 虎扑游戏电竞资讯 - 云顶之弈S8赛季怪兽来袭羁绊明细

export const teamDetailsData = [
  {
    id: 2,
    name: '无情连打贾克斯',
    tier: 'T0',
    description: '5战斗机甲+4斗士，贾克斯无限叠加攻速输出',
    difficulty: '中等',
    population: 8,
    heroes: [
      { name: '贾克斯', cost: 3, position: { row: 1, col: 3 }, role: '主C', synergies: ['战斗机甲', '斗士'] },
      { name: '瑟庄妮', cost: 4, position: { row: 0, col: 2 }, role: '主坦', synergies: ['斗士'] },
      { name: '费德提克', cost: 5, position: { row: 1, col: 5 }, role: '控制', synergies: ['堕落使者', '怪兽'] },
      { name: '蕾欧娜', cost: 5, position: { row: 0, col: 5 }, role: '功能', synergies: ['战斗机甲'] },
      { name: '瑟提', cost: 4, position: { row: 0, col: 3 }, role: '副坦', synergies: ['战斗机甲', '精英战士'] },
      { name: '锐雯', cost: 3, position: { row: 1, col: 2 }, role: '副C', synergies: ['战斗机甲', '斗士'] },
      { name: '德莱文', cost: 4, position: { row: 2, col: 3 }, role: '功能', synergies: ['战斗机甲', '精英战士'] },
      { name: '孙悟空', cost: 1, position: { row: 0, col: 1 }, role: '功能', synergies: ['战斗机甲'] }
    ],
    synergies: ['5 战斗机甲', '4 斗士', '2 护卫', '1 怪兽', '1 堕落使者', '1 精英战士'],
    equipment: {
      mainC: {
        hero: '贾克斯',
        required: ['疾射火炮', '鬼索的狂暴之刃'],
        optional: ['海克斯科技枪刃', '汲取剑', '泰坦的坚决', '水银']
      },
      mainTank: {
        hero: '瑟庄妮',
        required: ['日炎斗篷', '圣盾使的誓约'],
        optional: ['石像鬼石板甲', '狂徒铠甲']
      }
    },
    operation: {
      early: '2阶段4斗士打工（贾克斯、李青、布里茨、雷克顿），2-1升4，2-5升5，走连胜',
      mid: '3阶段替换为3战斗机甲+4斗士+4护卫，保留贾克斯、瑟庄妮、孙悟空体系牌',
      late: '3-5/4-1拉7大D除四费卡外全部二星；7人口锁血后卡利息慢D三星贾克斯；同行多时存钱冲8开完整5机甲'
    },
    augments: {
      hero: ['无情连打（贾克斯专属，体系核心，见到必拿）'],
      combat: ['升星之运', '英勇福袋', '药剂师 II', '光明圣物'],
      economy: ['便携锻炉', 'DD街区']
    },
    counter: {
      advantage: '机甲合体献祭友军给贾克斯巨额血量、双攻属性；4斗士全队生命值大幅提升；贾克斯叠满攻速输出环境稳定',
      disadvantage: '极度依赖贾克斯专属强化无情连打；同行内卷时贾克斯存量稀少难追三'
    },
    tips: '火炮避免敌方单位卡位打假赛，羊刀配合无情连打无限叠加攻速；泰坦提供免控，饮血/科技枪保障持续续航'
  },
  {
    id: 6,
    name: '超英伊泽瑞尔',
    tier: 'T0',
    description: '超级英雄+源计划，EZ叠加攻速法强高频技能输出',
    difficulty: '简单',
    population: 6,
    heroes: [
      { name: '伊泽瑞尔', cost: 2, position: { row: 2, col: 3 }, role: '主C', synergies: ['源计划：激光特工', '情报特工'] },
      { name: '李青', cost: 2, position: { row: 0, col: 2 }, role: '主坦', synergies: ['源计划：激光特工', '斗士', '超级英雄'] },
      { name: '普朗克', cost: 1, position: { row: 0, col: 3 }, role: '功能', synergies: ['源计划：激光特工', '超级英雄'] },
      { name: '墨菲特', cost: 2, position: { row: 0, col: 1 }, role: '副坦', synergies: ['超级英雄'] },
      { name: '雷克顿', cost: 1, position: { row: 1, col: 2 }, role: '副坦', synergies: ['源计划：激光特工', '斗士'] },
      { name: '艾希', cost: 1, position: { row: 2, col: 1 }, role: '功能', synergies: ['源计划：激光特工', '情报特工'] }
    ],
    synergies: ['4 源计划：激光特工', '3 超级英雄', '2 斗士', '2 情报特工'],
    equipment: {
      mainC: {
        hero: '伊泽瑞尔',
        required: ['蓝霸符', '珠光护手'],
        optional: ['大天使之杖', '海克斯科技枪刃']
      },
      mainTank: {
        hero: '李青',
        required: ['石像鬼石板甲', '日炎斗篷'],
        optional: ['狂徒铠甲', '棘刺背心']
      }
    },
    operation: {
      early: '2-1升4，2-5升5，开局能刷到EZ可直接定阵，源计划羁绊前期又肉又有输出，走连胜',
      mid: '3-2拉6，大D找三星EZ+三星李青，凑齐4源计划+3超英',
      late: '6人口全员三星后存钱上7补质量，有条件上8挂高费卡'
    },
    augments: {
      hero: ['咒能高涨（EZ专属，每次释放技能叠加攻速法强）'],
      combat: ['源计划植入', '源计划甲壳', '实战训练'],
      economy: ['DD街区', '升星之运', '利滚利']
    },
    counter: {
      advantage: 'EZ只有55法力值叠加多次后技能释放极其频繁；源计划羁绊前期坦度充足；低费成型快',
      disadvantage: '上限有限，后期遇到九五阵容容易被碾压；极度依赖EZ专属强化'
    },
    tips: 'EZ专属强化咒能高涨每次释放技能可获得可叠加攻速与法强，技能释放极其频繁'
  },
  {
    id: 1,
    name: '机甲精英九五',
    tier: 'T0',
    description: '运营天花板阵容，9人口大成碾压全场',
    difficulty: '困难',
    population: 9,
    heroes: [
      { name: '瑟提', cost: 4, position: { row: 0, col: 3 }, role: '主坦', synergies: ['战斗机甲', '精英战士'] },
      { name: '莫德凯撒', cost: 5, position: { row: 1, col: 2 }, role: '副C', synergies: ['精英战士', '怪兽'] },
      { name: '莎弥拉', cost: 4, position: { row: 2, col: 1 }, role: '主C', synergies: ['精英战士', '枪手'] },
      { name: '厄运小姐', cost: 4, position: { row: 2, col: 6 }, role: '副C', synergies: ['精英战士', '枪手'] },
      { name: '蕾欧娜', cost: 5, position: { row: 0, col: 5 }, role: '功能', synergies: ['战斗机甲'] },
      { name: '厄加特', cost: 5, position: { row: 1, col: 5 }, role: '功能', synergies: ['怪兽', '精英战士'] },
      { name: '费德提克', cost: 5, position: { row: 1, col: 4 }, role: '控制', synergies: ['堕落使者', '怪兽'] },
      { name: '德莱文', cost: 4, position: { row: 2, col: 3 }, role: '功能', synergies: ['战斗机甲', '精英战士'] },
      { name: '厄斐琉斯', cost: 5, position: { row: 2, col: 5 }, role: '补强', synergies: ['枪手', '福牛守护者'] }
    ],
    synergies: ['4 精英战士', '3 战斗机甲', '1 怪兽', '1 堕落使者'],
    equipment: {
      mainC: {
        hero: '莎弥拉',
        required: ['最后的轻语', '无尽之刃'],
        optional: ['锐利之刃', '海克斯科技枪刃', '巨人杀手']
      },
      subC: {
        hero: '厄运小姐',
        required: ['朔极之矛', '珠光护手'],
        optional: ['大天使之杖', '灭世者的死亡之帽']
      },
      mainTank: {
        hero: '瑟提',
        required: ['石像鬼石板甲', '振奋盔甲'],
        optional: ['狂徒铠甲', '棘刺背心']
      }
    },
    operation: {
      early: '2-3阶段不D牌攒经济，推荐过渡：亚索、布里茨、雷克顿、艾希（3源计划+2斗士）',
      mid: '6-7人口替换为4决斗+3源计划+2情报特工，保留莎弥拉、厄运小姐体系牌',
      late: '4-1判断血量：压力大拉7小D找瑟提+莎弥拉；健康存钱上8；8人口大D凑齐莫德凯撒开启4精英，全员二星后冲9'
    },
    augments: {
      hero: ['莎弥拉专属强化（提升输出上限）', '瑟提专属强化'],
      combat: ['精英战士之徽', '耐心学习', '纷乱头脑'],
      economy: ['对冲基金', '利滚利加强版', '高端购物', '升级咯']
    },
    counter: {
      advantage: '完整9人口大成后，综合输出、坦度、斩杀机制拉满，压制绝大多数阵容',
      disadvantage: '惧怕同体系九五对手的蕾欧娜，蕾欧娜技能针对瑟提大幅降低前排承伤；成型周期长，中期血量掉太快容易未成型出局'
    },
    tips: '机甲合体固定让瑟提作为载体，全部防御装备集中给他；精英战士羁绊凑不齐4个时先用索尔携带女枪装备过渡'
  },
  {
    id: 4,
    name: '怪兽卡莎',
    tier: 'T1',
    description: '怪兽前排+情报特工，卡莎高频技能输出',
    difficulty: '中等',
    population: 8,
    heroes: [
      { name: '卡莎', cost: 3, position: { row: 2, col: 3 }, role: '主C', synergies: ['星之守护者', '情报特工'] },
      { name: '薇恩', cost: 3, position: { row: 2, col: 1 }, role: '副C', synergies: ['情报特工'] },
      { name: '伊泽瑞尔', cost: 2, position: { row: 2, col: 5 }, role: '功能', synergies: ['源计划：激光特工', '情报特工'] },
      { name: '艾希', cost: 1, position: { row: 2, col: 2 }, role: '功能', synergies: ['源计划：激光特工', '情报特工'] },
      { name: '拉莫斯', cost: 3, position: { row: 0, col: 2 }, role: '主坦', synergies: ['怪兽'] },
      { name: '科加斯', cost: 3, position: { row: 0, col: 3 }, role: '副坦', synergies: ['怪兽'] },
      { name: '扎克', cost: 4, position: { row: 0, col: 5 }, role: '副坦', synergies: ['怪兽'] },
      { name: '维克兹', cost: 3, position: { row: 1, col: 4 }, role: '控制', synergies: ['怪兽'] }
    ],
    synergies: ['4 怪兽', '4 情报特工'],
    equipment: {
      mainC: {
        hero: '卡莎',
        required: ['斯塔缇克电刃', '海克斯科技枪刃'],
        optional: ['破防者', '鬼索的狂暴之刃']
      },
      mainTank: {
        hero: '拉莫斯',
        required: ['棘刺背心', '石像鬼石板甲'],
        optional: ['日炎斗篷', '狂徒铠甲']
      },
      subC: {
        hero: '维克兹',
        required: ['斯塔缇克电刃', '珠光护手'],
        optional: ['朔极之矛']
      }
    },
    operation: {
      early: '2阶段小天才+吉祥物打工（璐璐、悠米、加里奥、内瑟斯），走连胜',
      mid: '3-2拉6，补上怪兽牌，场上补卡莎/薇恩，攒钱等7人口启动',
      late: '3-5拉7大D找2星卡莎+2星龙龟稳住血量后上8，然后慢D多张3星'
    },
    augments: {
      hero: ['多重射击（卡莎专属）', '锥刺强化（龙龟专属）'],
      combat: ['常客优惠', '团队建设', '飞升', '三费成众'],
      economy: ['潘多拉装备', '利滚利']
    },
    counter: {
      advantage: '怪兽前排龙龟+大虫双坦硬度拉满；4情报特工提供高额攻速和位移能力',
      disadvantage: '极度惧怕同体系同行，对手三星成型后很难对抗'
    },
    tips: '电刃快速循环技能持续群体灼烧；科技枪拉高续航；龙龟纯肉装前排扛住'
  },
  {
    id: 3,
    name: '机甲德莱文',
    tier: 'T0',
    description: '5战斗机甲+3超级英雄，德莱文血量破7000赌狗阵容',
    difficulty: '中等',
    population: 8,
    heroes: [
      { name: '德莱文', cost: 4, position: { row: 2, col: 3 }, role: '主C', synergies: ['战斗机甲', '精英战士'] },
      { name: '墨菲特', cost: 2, position: { row: 0, col: 1 }, role: '主坦', synergies: ['超级英雄'] },
      { name: '李青', cost: 2, position: { row: 0, col: 2 }, role: '副坦', synergies: ['源计划：激光特工', '斗士', '超级英雄'] },
      { name: '瑟提', cost: 4, position: { row: 0, col: 3 }, role: '副坦', synergies: ['战斗机甲', '精英战士'] },
      { name: '蕾欧娜', cost: 5, position: { row: 0, col: 5 }, role: '功能', synergies: ['战斗机甲'] },
      { name: '普朗克', cost: 1, position: { row: 1, col: 2 }, role: '功能', synergies: ['源计划：激光特工', '超级英雄'] },
      { name: '孙悟空', cost: 1, position: { row: 0, col: 4 }, role: '功能', synergies: ['战斗机甲'] },
      { name: '贾克斯', cost: 3, position: { row: 1, col: 3 }, role: '功能', synergies: ['战斗机甲', '斗士'] }
    ],
    synergies: ['5 战斗机甲', '3 超级英雄', '2 护卫', '2 斗士', '1 精英战士'],
    equipment: {
      mainC: {
        hero: '德莱文',
        required: ['无尽之刃', '水银', '最后的轻语'],
        optional: ['巨人杀手', '破防者']
      },
      mainTank: {
        hero: '墨菲特',
        required: ['棘刺背心', '狂徒铠甲', '石像鬼石板甲'],
        optional: ['日炎斗篷', '冰霜之心']
      },
      subC: {
        hero: '蕾欧娜',
        required: ['水银', '珠光护手', '离子火花'],
        optional: ['多余法装']
      }
    },
    operation: {
      early: '2阶段留体系内卡牌，连败过渡稳经济，选秀优先抢德莱文装备，大剑、拳套优先级最高',
      mid: '3-2阶段直接拉6级，大D一波搜出德莱文+石头人，凑出3战斗机甲羁绊，之后就在6级慢D追德莱文+石头人双三星',
      late: '三星后稳步拉人口升到8级凑齐5机甲完全体，有条件上9补风女/二星五费卡'
    },
    augments: {
      hero: ['德莱文联盟（德莱文专属，击杀掉金币）', '最佳组件（德莱文专属）'],
      combat: ['飞升', '升星之运', '关爱包裹'],
      economy: ['便携锻炉', 'DD街区']
    },
    counter: {
      advantage: '机甲合体+超级英雄增伤+精英斩杀，三星四费龙王都能一刀秒，成型基本锁血吃鸡',
      disadvantage: '极度依赖德莱文专属强化和三星成型；水银必带免控才能稳定砍全场'
    },
    tips: '水银必带！免控才能稳定砍全场；石头人所有肉装全塞给他，前排扛住=德莱文乱杀'
  },
  {
    id: 7,
    name: '地下魔盗团',
    tier: 'T1',
    description: '经济发育阵容，盗窃层数累积开宝箱收菜',
    difficulty: '困难',
    population: 8,
    heroes: [
      { name: '凯尔', cost: 1, position: { row: 2, col: 1 }, role: '功能', synergies: ['地下魔盗团'] },
      { name: '蔚', cost: 2, position: { row: 0, col: 2 }, role: '副坦', synergies: ['地下魔盗团', '斗士'] },
      { name: '伊泽瑞尔', cost: 2, position: { row: 2, col: 3 }, role: '副C', synergies: ['地下魔盗团', '情报特工'] },
      { name: '娑娜', cost: 3, position: { row: 2, col: 5 }, role: '功能', synergies: ['地下魔盗团', '爱心使者'] },
      { name: '莎弥拉', cost: 4, position: { row: 2, col: 4 }, role: '主C', synergies: ['地下魔盗团', '枪手', '精英战士'] },
      { name: '索拉卡', cost: 4, position: { row: 1, col: 4 }, role: '治疗', synergies: ['AI程序', '爱心使者'] },
      { name: '阿利斯塔', cost: 3, position: { row: 0, col: 3 }, role: '主坦', synergies: ['吉祥物', '福牛守护者'] },
      { name: '费德提克', cost: 5, position: { row: 1, col: 5 }, role: '控制', synergies: ['堕落使者', '怪兽'] }
    ],
    synergies: ['5 地下魔盗团', '2 斗士', '2 爱心使者', '1 怪兽'],
    equipment: {
      mainC: {
        hero: '莎弥拉',
        required: ['最后的轻语', '无尽之刃'],
        optional: ['锐利之刃', '巨人杀手']
      },
      mainTank: {
        hero: '阿利斯塔',
        required: ['石像鬼石板甲', '日炎斗篷'],
        optional: ['狂徒铠甲', '棘刺背心']
      }
    },
    operation: {
      early: '2阶段开局3魔盗打工，连败攒层数，选秀优先抢莎弥拉装备',
      mid: '3阶段继续连败累积盗窃层数，层数达到7层以上可考虑收菜',
      late: '收菜后转型九五阵容，用魔盗奖励的装备和金币快速拉9人口'
    },
    augments: {
      hero: ['莎弥拉专属强化'],
      combat: ['地下魔盗团之徽', '地下魔盗团之冕'],
      economy: ['利滚利', '对冲基金', '高端购物']
    },
    counter: {
      advantage: '连败可快速累积盗窃层数，宝箱奖励丰厚可开出金币、装备、妮蔻、五费整卡',
      disadvantage: '前期战力薄弱容易掉血太多；层数不够收菜奖励不理想'
    },
    tips: '盗窃层数达到7层以上收菜最佳；宝箱可开出五费整卡、4件成品神装、完整妮蔻'
  },
  {
    id: 8,
    name: '星守辛德拉',
    tier: 'T1',
    description: '星之守护者+爱心使者，辛德拉主C',
    difficulty: '中等',
    population: 8,
    heroes: [
      { name: '辛德拉', cost: 5, position: { row: 2, col: 3 }, role: '主C', synergies: ['星之守护者'] },
      { name: '拉克丝', cost: 1, position: { row: 2, col: 1 }, role: '副C', synergies: ['星之守护者', '灵能使'] },
      { name: '悠米', cost: 2, position: { row: 2, col: 4 }, role: '功能', synergies: ['星之守护者', '爱心使者'] },
      { name: '卡莎', cost: 3, position: { row: 2, col: 5 }, role: '副C', synergies: ['星之守护者', '情报特工'] },
      { name: '尼菈', cost: 3, position: { row: 0, col: 2 }, role: '副坦', synergies: ['星之守护者', '决斗大师'] },
      { name: '艾克', cost: 4, position: { row: 1, col: 2 }, role: '功能', synergies: ['星之守护者', '黑客'] },
      { name: '塔莉垭', cost: 4, position: { row: 0, col: 4 }, role: '功能', synergies: ['星之守护者'] },
      { name: '索拉卡', cost: 4, position: { row: 1, col: 4 }, role: '治疗', synergies: ['爱心使者', 'AI程序'] }
    ],
    synergies: ['6 星之守护者', '2 爱心使者', '2 决斗大师'],
    equipment: {
      mainC: {
        hero: '辛德拉',
        required: ['灭世者的死亡之帽', '大天使之杖', '蓝霸符'],
        optional: ['珠光护手', '莫雷洛秘典']
      },
      subC: {
        hero: '拉克丝',
        required: ['蓝霸符'],
        optional: ['灭世者的死亡之帽', '珠光护手']
      }
    },
    operation: {
      early: '2阶段星守打工（拉克丝、悠米），走连胜',
      mid: '3-2拉6，小D找二星拉克丝+二星悠米，凑齐4星守',
      late: '4-1拉7，大D找辛德拉+卡莎；4-5拉8，凑齐6星守'
    },
    augments: {
      hero: ['辛德拉专属强化', '拉克丝专属强化'],
      combat: ['星守之徽', '星守之冕', '珠光莲花'],
      economy: ['利滚利', '对冲基金']
    },
    counter: {
      advantage: '星守羁绊提供法力值回复，技能释放频繁；辛德拉技能召唤棋子增加阵容灵活性',
      disadvantage: '成型依赖五费卡辛德拉，前期过渡较弱'
    },
    tips: '辛德拉技能可召唤备战席棋子到战场，注意备战席棋子质量'
  }
]

// 根据ID获取阵容详情
export const getTeamDetailById = (id) => {
  return teamDetailsData.find(team => team.id === Number(id))
}