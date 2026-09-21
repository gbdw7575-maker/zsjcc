// 金铲铲之战 S18苍林秘境赛季海克斯强化数据（社区数据）
// 数据来源：
// 1. 金铲铲之战官方公告：https://jcc.qq.com
// 2. Mobalytics TFT Set 18 Enchanted Wilds Augments: https://mobalytics.gg/tft/set18/augments
// 3. 云顶之弈数据站 - TFT Set 18 Augments
// 注: S18 新机制为 Wisps（神火/精灵），区别于传统 Augments

export const augmentsData = {
  // 英雄强化符文（基于 S18 英雄，每个英雄提供专属加成）
  heroAugments: [
    // ==================== 1费英雄强化 ====================
    {
      hero: '阿卡丽',
      cost: 1,
      augments: [
        {
          name: '炼狱之刃',
          type: '自身强化',
          effect: '阿卡丽获得30%攻速，技能附带燃烧伤害',
          tier: 'T1',
          suitableTeams: ['炼狱阿卡丽', '掠夺者体系'],
          description: '适配者+掠夺者双羁绊下，阿卡丽切后排强度大幅提升'
        },
        {
          name: '适配之灵',
          type: '团队强化',
          effect: '所有友军获得10%攻速和10法术强度',
          tier: 'T2',
          suitableTeams: ['适配者体系', '各种阵容'],
          description: '全员收益类符文，攻速法强双加成'
        }
      ]
    },
    {
      hero: '卡尔玛',
      cost: 1,
      augments: [
        {
          name: '绽放法力',
          type: '自身强化',
          effect: '卡尔玛每次释放技能获得15法术强度，可叠加',
          tier: 'T1',
          suitableTeams: ['绽放赌卡尔玛', '法术编织者体系'],
          description: '绽放+法术编织者双羁绊，搭配法系装备后期可秒前排'
        },
        {
          name: '绽放之徽',
          type: '团队强化',
          effect: '获得绽放纹章+1个卡尔玛',
          tier: 'T2',
          suitableTeams: ['绽放体系'],
          description: '提供羁绊纹章'
        }
      ]
    },
    {
      hero: '蕾欧娜',
      cost: 1,
      augments: [
        {
          name: '太阳护盾',
          type: '自身强化',
          effect: '蕾欧娜获得200护盾，战斗开始时全队获得10护甲',
          tier: 'T1',
          suitableTeams: ['太阳体系', '守护者体系'],
          description: '蕾欧娜前排坦度大幅提升'
        },
        {
          name: '守护者之徽',
          type: '团队强化',
          effect: '获得守护者纹章+1个蕾欧娜',
          tier: 'T2',
          suitableTeams: ['守护者体系'],
          description: '提供羁绊纹章'
        }
      ]
    },
    {
      hero: '奥恩',
      cost: 1,
      augments: [
        {
          name: '苍木之锤',
          type: '自身强化',
          effect: '奥恩获得30攻击力和200额外生命值',
          tier: 'T1',
          suitableTeams: ['苍木体系', '守护者体系'],
          description: '奥恩专属强化，前排坦度与输出兼备'
        },
        {
          name: '苍木之徽',
          type: '团队强化',
          effect: '获得苍木纹章+1个奥恩',
          tier: 'T2',
          suitableTeams: ['苍木体系'],
          description: '提供羁绊纹章'
        }
      ]
    },
    {
      hero: '碎石',
      cost: 1,
      augments: [
        {
          name: '裂隙之力',
          type: '自身强化',
          effect: '碎石每次释放技能获得5%最大生命值',
          tier: 'T1',
          suitableTeams: ['裂隙兽体系'],
          description: '祈求者+裂隙兽双羁绊，技能频繁'
        },
        {
          name: '裂隙兽之徽',
          type: '团队强化',
          effect: '获得裂隙兽纹章+1个碎石',
          tier: 'T2',
          suitableTeams: ['裂隙兽体系'],
          description: '提供羁绊纹章'
        }
      ]
    },
    // ==================== 2费英雄强化 ====================
    {
      hero: '凯尔',
      cost: 2,
      augments: [
        {
          name: '太阳之翼',
          type: '自身强化',
          effect: '凯尔获得15%攻速，每次升级额外获得10%攻速',
          tier: 'T1',
          suitableTeams: ['赌凯尔', '速射体系'],
          description: '太阳+速射双羁绊，凯尔后期输出爆炸'
        },
        {
          name: '太阳之徽',
          type: '团队强化',
          effect: '获得太阳纹章+1个凯尔',
          tier: 'T2',
          suitableTeams: ['太阳体系'],
          description: '提供羁绊纹章'
        }
      ]
    },
    {
      hero: '乐芙兰',
      cost: 2,
      augments: [
        {
          name: '苍木幻影',
          type: '自身强化',
          effect: '乐芙兰技能击杀敌人后召唤一个苍木分身',
          tier: 'T1',
          suitableTeams: ['苍木乐芙兰', '法术编织者体系'],
          description: '乐芙兰专属强化，分身增加场面压力'
        },
        {
          name: '法术编织者之徽',
          type: '团队强化',
          effect: '获得法术编织者纹章+1个乐芙兰',
          tier: 'T2',
          suitableTeams: ['法术编织者体系'],
          description: '提供羁绊纹章'
        }
      ]
    },
    {
      hero: '慎',
      cost: 2,
      augments: [
        {
          name: '炼狱守护',
          type: '自身强化',
          effect: '慎获得30魔抗，被攻击时反弹5%最大生命值伤害',
          tier: 'T1',
          suitableTeams: ['炼狱体系', '守护者体系'],
          description: '慎专属强化，强力反伤'
        },
        {
          name: '炼狱之徽',
          type: '团队强化',
          effect: '获得炼狱纹章+1个慎',
          tier: 'T2',
          suitableTeams: ['炼狱体系'],
          description: '提供羁绊纹章'
        }
      ]
    },
    {
      hero: '瑟庄妮',
      cost: 2,
      augments: [
        {
          name: '冰霜重装',
          type: '自身强化',
          effect: '瑟庄妮技能晕眩时间提升0.5秒',
          tier: 'T1',
          suitableTeams: ['太阳体系', '重装战士体系'],
          description: '瑟庄妮专属强化，强力控制'
        },
        {
          name: '重装战士之徽',
          type: '团队强化',
          effect: '获得重装战士纹章+1个瑟庄妮',
          tier: 'T2',
          suitableTeams: ['重装战士体系'],
          description: '提供羁绊纹章'
        }
      ]
    },
    // ==================== 3费英雄强化 ====================
    {
      hero: '易大师',
      cost: 3,
      augments: [
        {
          name: '剑道精进',
          type: '自身强化',
          effect: '易大师每次攻击获得5%攻速，可无限叠加',
          tier: 'T0',
          suitableTeams: ['赌易大师', '适配者体系'],
          description: '易大师专属强化，见到必拿，搭配羊刀无限叠加攻速'
        },
        {
          name: '绽放之徽',
          type: '团队强化',
          effect: '获得绽放纹章+1个易大师',
          tier: 'T2',
          suitableTeams: ['绽放体系'],
          description: '提供羁绊纹章'
        }
      ]
    },
    {
      hero: '卡西奥佩娅',
      cost: 3,
      augments: [
        {
          name: '巫会之毒',
          type: '自身强化',
          effect: '卡西奥佩娅技能施加持续中毒，每秒造成50魔法伤害',
          tier: 'T1',
          suitableTeams: ['巫会卡西', '法术编织者体系'],
          description: '卡西奥佩娅专属强化，强力持续伤害'
        },
        {
          name: '巫会之徽',
          type: '团队强化',
          effect: '获得巫会纹章+1个卡西奥佩娅',
          tier: 'T2',
          suitableTeams: ['巫会体系'],
          description: '提供羁绊纹章'
        }
      ]
    },
    {
      hero: '黛安娜',
      cost: 3,
      augments: [
        {
          name: '月光突袭',
          type: '自身强化',
          effect: '黛安娜技能额外对2名敌人造成伤害',
          tier: 'T1',
          suitableTeams: ['月亮体系', '掠夺者体系'],
          description: '黛安娜专属强化'
        },
        {
          name: '月亮之徽',
          type: '团队强化',
          effect: '获得月亮纹章+1个黛安娜',
          tier: 'T2',
          suitableTeams: ['月亮体系'],
          description: '提供羁绊纹章'
        }
      ]
    },
    {
      hero: '赫卡里姆',
      cost: 3,
      augments: [
        {
          name: '苍木冲锋',
          type: '自身强化',
          effect: '赫卡里姆获得30攻击力和200额外生命值',
          tier: 'T1',
          suitableTeams: ['苍木体系', '先锋体系'],
          description: '赫卡里姆专属强化'
        },
        {
          name: '先锋之徽',
          type: '团队强化',
          effect: '获得先锋纹章+1个赫卡里姆',
          tier: 'T2',
          suitableTeams: ['先锋体系'],
          description: '提供羁绊纹章'
        }
      ]
    },
    // ==================== 4费英雄强化 ====================
    {
      hero: '阿狸',
      cost: 4,
      augments: [
        {
          name: '精神炸弹',
          type: '自身强化',
          effect: '阿狸技能范围+1格，伤害提升20%',
          tier: 'T1',
          suitableTeams: ['绽放阿狸', '法术编织者体系'],
          description: '阿狸专属强化，4费核心'
        },
        {
          name: '绽放之徽',
          type: '团队强化',
          effect: '获得绽放纹章+1个阿狸',
          tier: 'T2',
          suitableTeams: ['绽放体系'],
          description: '提供羁绊纹章'
        }
      ]
    },
    {
      hero: '瑟提',
      cost: 4,
      augments: [
        {
          name: '兽性觉醒',
          type: '自身强化',
          effect: '瑟提生命值低于40%时立即获得100法力值',
          tier: 'T1',
          suitableTeams: ['绽放瑟提', '斗士体系'],
          description: '瑟提专属强化，关键时刻触发二次施法'
        },
        {
          name: '斗士之徽',
          type: '团队强化',
          effect: '获得斗士纹章+1个瑟提',
          tier: 'T2',
          suitableTeams: ['斗士体系'],
          description: '提供羁绊纹章'
        }
      ]
    },
    {
      hero: '伊泽瑞尔',
      cost: 4,
      augments: [
        {
          name: '苍木箭术',
          type: '自身强化',
          effect: '伊泽瑞尔每次释放技能获得10%攻速，可叠加',
          tier: 'T1',
          suitableTeams: ['苍木EZ', '行刑官体系'],
          description: '伊泽瑞尔专属强化，叠加后技能频繁'
        },
        {
          name: '行刑官之徽',
          type: '团队强化',
          effect: '获得行刑官纹章+1个伊泽瑞尔',
          tier: 'T2',
          suitableTeams: ['行刑官体系'],
          description: '提供羁绊纹章'
        }
      ]
    },
    {
      hero: '莫甘娜',
      cost: 4,
      augments: [
        {
          name: '巫会诅咒',
          type: '自身强化',
          effect: '莫甘娜技能命中敌人降低15%属性',
          tier: 'T1',
          suitableTeams: ['巫会体系', '祈求者体系'],
          description: '莫甘娜专属强化，强力减益'
        },
        {
          name: '祈求者之徽',
          type: '团队强化',
          effect: '获得祈求者纹章+1个莫甘娜',
          tier: 'T2',
          suitableTeams: ['祈求者体系'],
          description: '提供羁绊纹章'
        }
      ]
    },
    {
      hero: '奈德丽',
      cost: 4,
      augments: [
        {
          name: '原始猎豹',
          type: '自身强化',
          effect: '奈德丽AD/AP切换版本技能额外造成30%伤害',
          tier: 'T1',
          suitableTeams: ['原始体系', '适配者体系'],
          description: '奈德丽专属强化，4费核心'
        },
        {
          name: '原始之徽',
          type: '团队强化',
          effect: '获得原始纹章+1个奈德丽',
          tier: 'T2',
          suitableTeams: ['原始体系'],
          description: '提供羁绊纹章'
        }
      ]
    },
    // ==================== 5费英雄强化 ====================
    {
      hero: '德莱文',
      cost: 5,
      augments: [
        {
          name: '赏金之斧',
          type: '自身强化',
          effect: '德莱文攻击速度提升20%，bleed 持续时间增加',
          tier: 'T1',
          suitableTeams: ['赏金猎人体系'],
          description: '德莱文专属强化，5费核心输出'
        },
        {
          name: '赏金猎人之徽',
          type: '团队强化',
          effect: '获得赏金猎人纹章+1个德莱文',
          tier: 'T2',
          suitableTeams: ['赏金猎人体系'],
          description: '提供羁绊纹章'
        }
      ]
    },
    {
      hero: '凯南',
      cost: 5,
      augments: [
        {
          name: '炼狱雷击',
          type: '自身强化',
          effect: '凯南技能范围+1格，伤害提升30%',
          tier: 'T1',
          suitableTeams: ['炼狱体系', '行刑官体系'],
          description: '凯南专属强化，5费核爆输出'
        },
        {
          name: '炼狱之冕',
          type: '团队强化',
          effect: '获得炼狱纹章+2个炼狱棋子',
          tier: 'T2',
          suitableTeams: ['炼狱体系'],
          description: '提供羁绊纹章+棋子'
        }
      ]
    },
    {
      hero: '茂凯',
      cost: 5,
      augments: [
        {
          name: '古树根须',
          type: '自身强化',
          effect: '茂凯每5秒获得1000额外生命值',
          tier: 'T1',
          suitableTeams: ['古树体系', '重装战士体系'],
          description: '茂凯专属强化，5费坦度天花板'
        },
        {
          name: '古树之徽',
          type: '团队强化',
          effect: '获得古树纹章+1个茂凯',
          tier: 'T2',
          suitableTeams: ['古树体系'],
          description: '提供羁绊纹章'
        }
      ]
    },
    {
      hero: '塔里克',
      cost: 5,
      augments: [
        {
          name: '翠绿庇护',
          type: '自身强化',
          effect: '塔里克与配对友军半血时护盾值翻倍',
          tier: 'T1',
          suitableTeams: ['翠绿之相体系'],
          description: '塔里克专属强化，5费最强守护'
        },
        {
          name: '翠绿之相之徽',
          type: '团队强化',
          effect: '获得翠绿之相纹章+1个塔里克',
          tier: 'T2',
          suitableTeams: ['翠绿之相体系'],
          description: '提供羁绊纹章'
        }
      ]
    },
    {
      hero: '远古巨龙',
      cost: 5,
      augments: [
        {
          name: '远古怒吼',
          type: '自身强化',
          effect: '远古巨龙技能伤害提升40%，晕眩时间+1秒',
          tier: 'T0',
          suitableTeams: ['裂隙兽体系'],
          description: '远古巨龙专属强化，5费终极单位'
        },
        {
          name: '裂隙兽之冕',
          type: '团队强化',
          effect: '获得裂隙兽纹章+2个裂隙兽棋子',
          tier: 'T1',
          suitableTeams: ['裂隙兽体系'],
          description: '提供羁绊纹章+棋子'
        }
      ]
    }
  ],
  
  // ==================== 银色强化符文 ====================
  silverAugments: [
    { name: '斗士之心', tier: 'T2', effect: '获得斗士纹章', suitableTeams: ['斗士体系'] },
    { name: '守护者之心', tier: 'T2', effect: '获得守护者纹章', suitableTeams: ['守护者体系'] },
    { name: '开摆', tier: 'T1', effect: '获得金币', suitableTeams: ['各种阵容'] },
    { name: '三阶之力', tier: 'T2', effect: '3费棋子获得属性加成', suitableTeams: ['赌狗阵容'] },
    { name: '窃贼手套', tier: 'T1', effect: '获得窃贼手套', suitableTeams: ['各种阵容'] },
    { name: '电火花', tier: 'T2', effect: '棋子死亡时对周围敌人造成伤害', suitableTeams: ['各种阵容'] },
    { name: '短兵相接', tier: 'T2', effect: '近距离作战棋子获得属性', suitableTeams: ['前排阵容'] },
    { name: '小巨人', tier: 'T2', effect: '获得额外生命值', suitableTeams: ['各种阵容'] },
    { name: '存心失利', tier: 'T2', effect: '连败获得额外金币', suitableTeams: ['连败阵容'] },
    { name: '苍木之心', tier: 'T1', effect: '获得苍木纹章', suitableTeams: ['苍木体系'] }
  ],
  
  // ==================== 金色强化符文 ====================
  goldAugments: [
    { name: '斗士之徽', tier: 'T1', effect: '获得斗士纹章', suitableTeams: ['斗士体系'] },
    { name: '法术编织者之徽', tier: 'T1', effect: '获得法术编织者纹章', suitableTeams: ['法术编织者体系'] },
    { name: '先锋之徽', tier: 'T2', effect: '获得先锋纹章', suitableTeams: ['先锋体系'] },
    { name: '猎手之徽', tier: 'T2', effect: '获得猎手纹章', suitableTeams: ['猎手体系'] },
    { name: '花到上头', tier: 'T1', effect: '获得金币和装备', suitableTeams: ['各种阵容'] },
    { name: '蓝电池', tier: 'T1', effect: '棋子释放技能回复法力值', suitableTeams: ['法系阵容'] },
    { name: '万用瞄准镜', tier: 'T1', effect: '增加攻击距离', suitableTeams: ['射手阵容'] },
    { name: '好事成双', tier: 'T1', effect: '两个相同棋子获得属性加成', suitableTeams: ['赌狗阵容'] },
    { name: 'DD街区+', tier: 'T1', effect: '每回合获得免费刷新', suitableTeams: ['赌狗阵容'] },
    { name: '利滚利加强版', tier: 'T1', effect: '获得大量金币', suitableTeams: ['运营阵容'] },
    { name: '大哥罩我', tier: 'T2', effect: '高费棋子保护低费棋子', suitableTeams: ['九五阵容'] },
    { name: '绽放之徽', tier: 'T1', effect: '获得绽放纹章', suitableTeams: ['绽放体系'] },
    { name: '裂隙兽之徽', tier: 'T1', effect: '获得裂隙兽纹章', suitableTeams: ['裂隙兽体系'] },
    { name: '苍木之徽', tier: 'T1', effect: '获得苍木纹章', suitableTeams: ['苍木体系'] },
    { name: '巫会之徽', tier: 'T1', effect: '获得巫会纹章', suitableTeams: ['巫会体系'] }
  ],
  
  // ==================== 棱彩强化符文 ====================
  prismaticAugments: [
    { name: '斗士之冕', tier: 'T1', effect: '获得斗士纹章+2斗士棋子', suitableTeams: ['斗士体系'] },
    { name: '法术编织者之冕', tier: 'T1', effect: '获得法术编织者纹章+2棋子', suitableTeams: ['法术编织者体系'] },
    { name: '先锋之冕', tier: 'T1', effect: '获得先锋纹章+2先锋棋子', suitableTeams: ['先锋体系'] },
    { name: '前进之路', tier: 'T1', effect: '每回合获得经验值', suitableTeams: ['运营阵容'] },
    { name: '恶魔契约', tier: 'T1', effect: '购买经验值获得金币', suitableTeams: ['运营阵容'] },
    { name: '快速思考', tier: 'T1', effect: '免费刷新商店', suitableTeams: ['赌狗阵容'] },
    { name: '骰子', tier: 'T1', effect: '获得刷新骰子', suitableTeams: ['各种阵容'] },
    { name: '黄金门票', tier: 'T1', effect: '刷新商店消耗减少', suitableTeams: ['赌狗阵容'] },
    { name: '古代档案', tier: 'T3', effect: '获得纹章之书', suitableTeams: ['各种阵容'] },
    { name: '升级咯', tier: 'T2', effect: '获得经验值和金币', suitableTeams: ['运营阵容'] },
    { name: '高端购物', tier: 'T2', effect: '商店出现高费棋子概率提升', suitableTeams: ['九五阵容'] },
    { name: '绽放之冕', tier: 'T1', effect: '获得绽放纹章+2绽放棋子', suitableTeams: ['绽放体系'] },
    { name: '裂隙兽之冕', tier: 'T1', effect: '获得裂隙兽纹章+2裂隙兽棋子', suitableTeams: ['裂隙兽体系'] },
    { name: '苍木之冕', tier: 'T1', effect: '获得苍木纹章+2苍木棋子', suitableTeams: ['苍木体系'] }
  ]
}

// 根据名称获取海克斯详情
export const getAugmentByName = (name) => {
  // 搜索英雄强化
  for (const heroAugment of augmentsData.heroAugments) {
    for (const augment of heroAugment.augments) {
      if (augment.name === name) {
        return { ...augment, hero: heroAugment.hero, cost: heroAugment.cost }
      }
    }
  }
  
  // 搜索银色强化
  for (const augment of augmentsData.silverAugments) {
    if (augment.name === name) {
      return augment
    }
  }
  
  // 搜索金色强化
  for (const augment of augmentsData.goldAugments) {
    if (augment.name === name) {
      return augment
    }
  }
  
  // 搜索棱彩强化
  for (const augment of augmentsData.prismaticAugments) {
    if (augment.name === name) {
      return augment
    }
  }
  
  return null
}
