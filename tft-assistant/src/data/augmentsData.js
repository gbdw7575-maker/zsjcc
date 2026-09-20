// 金铲铲之战 S8怪兽入侵赛季海克斯强化数据（官方数据）
// 数据来源：
// 1. 金铲铲之战官方公告：https://jcc.qq.com
// 2. 金铲铲之战官方微博 - 怪兽入侵赛季返场公告（2025年6月17日）
// 3. lolchess.gg - TFT Set 8 Augments 官方数据
// 4. 虎扑游戏电竞资讯 - 云顶之弈S8赛季怪兽来袭英雄强化明细

export const augmentsData = {
  // 英雄强化符文（每个英雄有2个专属强化）
  heroAugments: [
    // ==================== 1费英雄强化 ====================
    {
      hero: '艾希',
      cost: 1,
      augments: [
        {
          name: '激光专注',
          type: '自身强化',
          effect: '艾希获得40%攻速，释放技能后获得额外80%攻速，持续5秒',
          tier: 'T1',
          suitableTeams: ['源计划赌艾希', '激光特工体系'],
          description: '搭配技能增加的攻击力，输出强度极大提升，测试服中能否选择赌艾希更多时候看第一个符文有没有激光专注'
        },
        {
          name: '特工专注',
          type: '团队强化',
          effect: '当一名友军阵亡时，所有友军获得20%攻速',
          tier: 'T2',
          suitableTeams: ['源计划体系', '激光特工体系'],
          description: '全员收益类符文，增加全员攻速'
        }
      ]
    },
    {
      hero: '凯尔',
      cost: 1,
      augments: [
        {
          name: '登神长阶',
          type: '自身强化',
          effect: '凯尔获得10%额外攻击力，每次升级获得10%额外攻击速度',
          tier: 'T1',
          suitableTeams: ['赌天使', '决斗大师体系'],
          description: '登神天使相当于多一件光明火炮一件光明飓风，手持额外两件光明装备的C位输出非常猛'
        },
        {
          name: '正义审判',
          type: '团队强化',
          effect: '所有友军获得15%攻速',
          tier: 'T2',
          suitableTeams: ['决斗大师体系'],
          description: '全员收益类符文'
        }
      ]
    },
    {
      hero: '内瑟斯',
      cost: 1,
      augments: [
        {
          name: '叠上叠',
          type: '自身强化',
          effect: '内瑟斯每次释放技能获得2%攻击力，可无限叠加',
          tier: 'T1',
          suitableTeams: ['赌狗头', '斗士体系'],
          description: '3星狗头本身攻击力146，通常一场对局攻击力能叠加到400+，一次技能可造成900+物理伤害'
        },
        {
          name: '吞噬灵魂',
          type: '团队强化',
          effect: '所有友军获得15%全能吸血',
          tier: 'T2',
          suitableTeams: ['斗士体系', '各种阵容'],
          description: '全员收益类符文，提供续航能力'
        }
      ]
    },
    {
      hero: '孙悟空',
      cost: 1,
      augments: [
        {
          name: '大闹天宫',
          type: '自身强化',
          effect: '孙悟空的技能范围增加1格',
          tier: 'T2',
          suitableTeams: ['机甲猴子', '战斗机甲体系'],
          description: '在5机甲羁绊下输出强度很不错'
        },
        {
          name: '活力再生',
          type: '团队强化',
          effect: '所有友军在释放技能后回复20法力值',
          tier: 'T2',
          suitableTeams: ['各种阵容'],
          description: '全员收益类符文，类似魔蕴效果'
        }
      ]
    },
    {
      hero: '拉克丝',
      cost: 1,
      augments: [
        {
          name: '启明奇点',
          type: '自身强化',
          effect: '拉克丝每第二次技能额外造成180%伤害',
          tier: 'T1',
          suitableTeams: ['星守拉克丝', '灵能体系'],
          description: '搭配星守与灵能羁绊，后期2次技能可秒大部分前排'
        },
        {
          name: '透光屏障',
          type: '团队强化',
          effect: '所有友军获得150护盾和15法术强度',
          tier: 'T2',
          suitableTeams: ['星守体系', '灵能体系'],
          description: '全员收益类符文，类似鸟盾效果'
        }
      ]
    },
    {
      hero: '普朗克',
      cost: 1,
      augments: [
        {
          name: '烈焰弹射',
          type: '自身强化',
          effect: '普朗克的技能额外对另一名敌人造成60%伤害',
          tier: 'T2',
          suitableTeams: ['源计划船长', '超级英雄体系'],
          description: '搭配超级英雄增加攻击，搭配决斗增加攻速，技能释放频繁'
        },
        {
          name: '酬劳',
          type: '团队强化',
          effect: '击杀敌人时有50%概率获得1金币',
          tier: 'T2',
          suitableTeams: ['各种阵容'],
          description: '经济类符文'
        }
      ]
    },
    {
      hero: '泰隆',
      cost: 1,
      augments: [
        {
          name: '刀锋领主',
          type: '自身强化',
          effect: '泰隆获得40法术强度，释放技能后回复40法力值',
          tier: 'T1',
          suitableTeams: ['赌泰隆', '福牛体系'],
          description: '本身技能打离棋盘中心最远敌人，增加法强后通常可秒人'
        },
        {
          name: '福牛守护者之徽',
          type: '团队强化',
          effect: '获得福牛守护者纹章+1个泰隆',
          tier: 'T2',
          suitableTeams: ['福牛守护者体系'],
          description: '提供羁绊纹章'
        }
      ]
    },
    {
      hero: '雷克顿',
      cost: 1,
      augments: [
        {
          name: '怒之领域',
          type: '自身强化',
          effect: '雷克顿获得相当于最大生命值10%的攻速',
          tier: 'T1',
          suitableTeams: ['斗士鳄鱼', '高斗士体系'],
          description: '超高血量意味着超高的攻速和技能伤害，肉的一批的同时伤害还高'
        },
        {
          name: '巨鳄狂袭',
          type: '团队强化',
          effect: '所有友军获得15额外攻击力',
          tier: 'T2',
          suitableTeams: ['斗士体系', '各种阵容'],
          description: '全员收益类符文'
        }
      ]
    },
    {
      hero: '墨菲特',
      cost: 1,
      augments: [
        {
          name: '岩石护甲',
          type: '自身强化',
          effect: '墨菲特获得100额外护甲',
          tier: 'T2',
          suitableTeams: ['超级英雄体系'],
          description: '大幅提升墨菲特坦度'
        },
        {
          name: '超级英雄之徽',
          type: '团队强化',
          effect: '获得超级英雄纹章+1个墨菲特',
          tier: 'T2',
          suitableTeams: ['超级英雄体系'],
          description: '提供羁绊纹章'
        }
      ]
    },
    // ==================== 2费英雄强化 ====================
    {
      hero: '卡蜜尔',
      cost: 2,
      augments: [
        {
          name: '适应性防守',
          type: '自身强化',
          effect: '卡蜜尔获得40攻击力，生命值低于50%时获得最大生命值50%的护盾',
          tier: 'T1',
          suitableTeams: ['主理人体系'],
          description: '可极大增加攻击力，且在生命值低于50%直接获得极高护盾，极大增加生存能力'
        },
        {
          name: '海克斯天罚',
          type: '团队强化',
          effect: '所有友军对护盾造成额外伤害',
          tier: 'T2',
          suitableTeams: ['主理人体系', '各种阵容'],
          description: '全员收益类符文'
        }
      ]
    },
    {
      hero: '蔚',
      cost: 2,
      augments: [
        {
          name: '不屈之劲',
          type: '自身强化',
          effect: '蔚每次释放技能获得10攻击力、10法术强度和10双抗',
          tier: 'T1',
          suitableTeams: ['源计划体系'],
          description: '效果类似泰坦的坚决，但是每次都会增加攻击、法强与双抗'
        },
        {
          name: '源计划植入',
          type: '团队强化',
          effect: '携带装备的棋子获得150生命值和15攻击力',
          tier: 'T2',
          suitableTeams: ['源计划体系'],
          description: '源计划体系核心符文'
        }
      ]
    },
    {
      hero: '亚索',
      cost: 2,
      augments: [
        {
          name: '虹吸之风',
          type: '自身强化',
          effect: '亚索获得66%全能吸血',
          tier: 'T1',
          suitableTeams: ['决斗亚索', '源计划体系'],
          description: '肉坦流亚索必备'
        },
        {
          name: '决斗大师之徽',
          type: '团队强化',
          effect: '获得决斗大师纹章+1个亚索',
          tier: 'T2',
          suitableTeams: ['决斗大师体系'],
          description: '提供羁绊纹章'
        }
      ]
    },
    {
      hero: '德莱文',
      cost: 2,
      augments: [
        {
          name: '德莱文联盟',
          type: '自身强化',
          effect: '德莱文获得30攻击力，击杀敌人时有50%概率获得2金币',
          tier: 'T1',
          suitableTeams: ['机甲德莱文', '精英战士体系'],
          description: '极大增加攻击力，且击杀概率获得金币'
        },
        {
          name: '冷酷利刃',
          type: '团队强化',
          effect: '所有友军获得25%暴击率',
          tier: 'T2',
          suitableTeams: ['精英战士体系', '各种阵容'],
          description: '全员收益类符文'
        }
      ]
    },
    {
      hero: '伊泽瑞尔',
      cost: 2,
      augments: [
        {
          name: '咒能高涨',
          type: '自身强化',
          effect: '伊泽瑞尔每次释放技能获得10%攻速和10法术强度，可叠加',
          tier: 'T0',
          suitableTeams: ['超英EZ', '源计划体系'],
          description: 'EZ只有55法力值叠加多次后技能释放极其频繁，核心符文'
        },
        {
          name: '战利品',
          type: '团队强化',
          effect: '获得一件临时成装',
          tier: 'T2',
          suitableTeams: ['各种阵容'],
          description: '装备类符文'
        }
      ]
    },
    {
      hero: '悠米',
      cost: 2,
      augments: [
        {
          name: '猫之精准',
          type: '自身强化',
          effect: '悠米获得30法术强度，技能伤害提升25%',
          tier: 'T2',
          suitableTeams: ['星守体系', '爱心使者体系'],
          description: '增加猫咪输出能力'
        },
        {
          name: '旺盛精力',
          type: '团队强化',
          effect: '所有友军获得15%攻速',
          tier: 'T2',
          suitableTeams: ['各种阵容'],
          description: '全员收益类符文'
        }
      ]
    },
    {
      hero: '金克丝',
      cost: 2,
      augments: [
        {
          name: '枪斗术',
          type: '自身强化',
          effect: '金克丝获得30%攻速',
          tier: 'T2',
          suitableTeams: ['枪手体系'],
          description: '增加金克丝输出能力'
        },
        {
          name: '枪手之徽',
          type: '团队强化',
          effect: '获得枪手纹章+1个金克丝',
          tier: 'T2',
          suitableTeams: ['枪手体系'],
          description: '提供羁绊纹章'
        }
      ]
    },
    {
      hero: '娑娜',
      cost: 2,
      augments: [
        {
          name: '能量和弦',
          type: '自身强化',
          effect: '娑娜获得30法术强度，技能治疗效果提升50%',
          tier: 'T2',
          suitableTeams: ['地下魔盗团', '爱心使者体系'],
          description: '增加娑娜辅助能力'
        },
        {
          name: '地下魔盗团之徽',
          type: '团队强化',
          effect: '获得地下魔盗团纹章+1个娑娜',
          tier: 'T2',
          suitableTeams: ['地下魔盗团'],
          description: '提供羁绊纹章'
        }
      ]
    },
    // ==================== 3费英雄强化 ====================
    {
      hero: '贾克斯',
      cost: 3,
      augments: [
        {
          name: '无情连打',
          type: '自身强化',
          effect: '贾克斯每次攻击获得5%攻速，可无限叠加',
          tier: 'T0',
          suitableTeams: ['机甲贾克斯', '战斗机甲体系'],
          description: '体系核心，见到必拿，配合羊刀无限叠加攻速'
        },
        {
          name: '战斗机甲之徽',
          type: '团队强化',
          effect: '获得战斗机甲纹章+1个贾克斯',
          tier: 'T2',
          suitableTeams: ['战斗机甲体系'],
          description: '提供羁绊纹章'
        }
      ]
    },
    {
      hero: '卡莎',
      cost: 3,
      augments: [
        {
          name: '多重射击',
          type: '自身强化',
          effect: '卡莎获得30法术强度，技能额外发射2发导弹',
          tier: 'T1',
          suitableTeams: ['怪兽卡莎', '情报特工体系'],
          description: '大幅提升卡莎输出能力'
        },
        {
          name: '星之守护者之徽',
          type: '团队强化',
          effect: '获得星之守护者纹章+1个卡莎',
          tier: 'T2',
          suitableTeams: ['星之守护者体系'],
          description: '提供羁绊纹章'
        }
      ]
    },
    {
      hero: '拉莫斯',
      cost: 3,
      augments: [
        {
          name: '锥刺甲壳',
          type: '自身强化',
          effect: '拉莫斯获得100护甲，被攻击时反弹伤害',
          tier: 'T1',
          suitableTeams: ['怪兽体系'],
          description: '龙龟专属强化，大幅提升坦度'
        },
        {
          name: '怪兽之力',
          type: '团队强化',
          effect: '所有怪兽棋子获得200额外生命值',
          tier: 'T2',
          suitableTeams: ['怪兽体系'],
          description: '怪兽体系核心符文'
        }
      ]
    },
    {
      hero: '维克兹',
      cost: 3,
      augments: [
        {
          name: '霜冻苔原',
          type: '自身强化',
          effect: '维克兹获得30法术强度，开局敌方群体降低30%攻速',
          tier: 'T2',
          suitableTeams: ['怪兽体系'],
          description: '大眼专属强化，强力控制'
        },
        {
          name: '怪兽之力',
          type: '团队强化',
          effect: '所有怪兽棋子获得200额外生命值',
          tier: 'T2',
          suitableTeams: ['怪兽体系'],
          description: '怪兽体系核心符文'
        }
      ]
    },
    {
      hero: '科加斯',
      cost: 3,
      augments: [
        {
          name: '虚空突袭',
          type: '自身强化',
          effect: '科加斯获得500额外生命值',
          tier: 'T2',
          suitableTeams: ['怪兽体系'],
          description: '增加大虫子坦度'
        },
        {
          name: '怪兽之力',
          type: '团队强化',
          effect: '所有怪兽棋子获得200额外生命值',
          tier: 'T2',
          suitableTeams: ['怪兽体系'],
          description: '怪兽体系核心符文'
        }
      ]
    },
    {
      hero: '乐芙兰',
      cost: 3,
      augments: [
        {
          name: '主理人之徽',
          type: '团队强化',
          effect: '获得主理人纹章+1个乐芙兰',
          tier: 'T2',
          suitableTeams: ['主理人体系'],
          description: '提供羁绊纹章'
        },
        {
          name: '幻影锁链',
          type: '自身强化',
          effect: '乐芙兰获得30法术强度，技能可额外复制一次',
          tier: 'T2',
          suitableTeams: ['主理人体系'],
          description: '乐芙兰专属强化'
        }
      ]
    },
    {
      hero: '锐雯',
      cost: 3,
      augments: [
        {
          name: '战斗机甲之徽',
          type: '团队强化',
          effect: '获得战斗机甲纹章+1个锐雯',
          tier: 'T2',
          suitableTeams: ['战斗机甲体系'],
          description: '提供羁绊纹章'
        },
        {
          name: '能量护盾',
          type: '自身强化',
          effect: '锐雯获得最大生命值30%的护盾',
          tier: 'T2',
          suitableTeams: ['战斗机甲体系'],
          description: '锐雯专属强化'
        }
      ]
    },
    {
      hero: '尼菈',
      cost: 3,
      augments: [
        {
          name: '决斗大师之徽',
          type: '团队强化',
          effect: '获得决斗大师纹章+1个尼菈',
          tier: 'T2',
          suitableTeams: ['决斗大师体系'],
          description: '提供羁绊纹章'
        },
        {
          name: '星之守护者之徽',
          type: '团队强化',
          effect: '获得星之守护者纹章+1个尼菈',
          tier: 'T2',
          suitableTeams: ['星之守护者体系'],
          description: '提供羁绊纹章'
        }
      ]
    },
    // ==================== 4费英雄强化 ====================
    {
      hero: '莎弥拉',
      cost: 4,
      augments: [
        {
          name: '铤而走险',
          type: '自身强化',
          effect: '莎弥拉获得30%攻击力，小小英雄每损失10点生命值全队获得5%攻速',
          tier: 'T1',
          suitableTeams: ['机甲4精英', '精英战士体系'],
          description: '最优选择，提升输出上限'
        },
        {
          name: '枪火谈判',
          type: '自身强化',
          effect: '莎弥拉击杀敌人后回复35%最大法力值',
          tier: 'T2',
          suitableTeams: ['精英战士体系'],
          description: '增加莎弥拉输出能力'
        }
      ]
    },
    {
      hero: '厄运小姐',
      cost: 4,
      augments: [
        {
          name: '大运当头',
          type: '自身强化',
          effect: '厄运小姐技能角度变宽，技能读条时获得300护盾',
          tier: 'T1',
          suitableTeams: ['机甲4精英', '精英战士体系'],
          description: '增加女枪输出能力'
        },
        {
          name: '赏金猎人',
          type: '团队强化',
          effect: '每3局对战后获得15金币',
          tier: 'T2',
          suitableTeams: ['各种阵容'],
          description: '经济类符文'
        }
      ]
    },
    {
      hero: '瑟提',
      cost: 4,
      augments: [
        {
          name: '破灭之锤',
          type: '自身强化',
          effect: '瑟提获得30攻击力和500额外生命值',
          tier: 'T1',
          suitableTeams: ['机甲体系', '战斗机甲体系'],
          description: '瑟提专属强化，大幅提升坦度'
        },
        {
          name: '战斗机甲之徽',
          type: '团队强化',
          effect: '获得战斗机甲纹章+1个瑟提',
          tier: 'T2',
          suitableTeams: ['战斗机甲体系'],
          description: '提供羁绊纹章'
        }
      ]
    },
    {
      hero: '瑟庄妮',
      cost: 4,
      augments: [
        {
          name: '极寒突袭',
          type: '自身强化',
          effect: '瑟庄妮获得25点护甲和魔抗，技能范围变为全屏',
          tier: 'T1',
          suitableTeams: ['斗士体系'],
          description: '瑟庄妮专属强化，技能范围变为全屏'
        },
        {
          name: '冰霜之心',
          type: '自身强化',
          effect: '瑟庄妮技能晕眩时间提升0.5秒，被眩晕敌人受到伤害增加20%',
          tier: 'T1',
          suitableTeams: ['斗士体系'],
          description: '瑟庄妮专属强化，大幅提升控制能力'
        }
      ]
    },
    {
      hero: '艾克',
      cost: 4,
      augments: [
        {
          name: '时空断裂',
          type: '自身强化',
          effect: '对局开始10秒后敌方所有英雄会被眩晕3秒',
          tier: 'T1',
          suitableTeams: ['黑客体系', '星守体系'],
          description: '艾克专属强化，强力控制'
        },
        {
          name: '时间扭曲',
          type: '自身强化',
          effect: '艾克获得30%攻速，每次普攻额外造成50点魔法伤害',
          tier: 'T2',
          suitableTeams: ['黑客体系'],
          description: '艾克专属强化'
        }
      ]
    },
    {
      hero: '劫',
      cost: 4,
      augments: [
        {
          name: '禁奥义！',
          type: '自身强化',
          effect: '劫获得10%攻击力，击杀敌方后获得被击杀敌方攻击力',
          tier: 'T0',
          suitableTeams: ['鸟盾劫', '黑客劫'],
          description: '劫专属强化，见到必拿，大幅提升劫爆发与斩杀能力'
        },
        {
          name: '决斗大师之徽',
          type: '团队强化',
          effect: '获得决斗大师纹章+1个劫',
          tier: 'T2',
          suitableTeams: ['决斗大师体系'],
          description: '提供羁绊纹章'
        }
      ]
    },
    {
      hero: '扎克',
      cost: 4,
      augments: [
        {
          name: '弹射起步',
          type: '自身强化',
          effect: '对局开始时扎克将离他最近的两个友方英雄扔向敌方后排并击飞3秒',
          tier: 'T1',
          suitableTeams: ['怪兽体系'],
          description: '扎克专属强化，强力控制'
        },
        {
          name: '不朽细胞',
          type: '自身强化',
          effect: '扎克获得1000点额外生命值并免疫群体控制',
          tier: 'T1',
          suitableTeams: ['怪兽体系'],
          description: '扎克专属强化，大幅提升坦度'
        }
      ]
    },
    {
      hero: '奥瑞利安·索尔',
      cost: 4,
      augments: [
        {
          name: '流星雨',
          type: '自身强化',
          effect: '奥瑞利安·索尔获得40点法术强度，技能召唤的流星变得更大',
          tier: 'T2',
          suitableTeams: ['怪兽体系'],
          description: '索尔专属强化'
        },
        {
          name: '宇宙引力',
          type: '自身强化',
          effect: '奥瑞利安·索尔技能会额外眩晕敌方2秒',
          tier: 'T1',
          suitableTeams: ['怪兽体系'],
          description: '索尔专属强化，强力控制'
        }
      ]
    },
    {
      hero: '佛耶戈',
      cost: 4,
      augments: [
        {
          name: '堕落之魂',
          type: '自身强化',
          effect: '佛耶戈获得10点法术强度，造成的伤害根据敌方已损失生命值提升最多50%',
          tier: 'T1',
          suitableTeams: ['堕落使者体系'],
          description: '佛耶戈专属强化'
        },
        {
          name: '灵魂收割',
          type: '团队强化',
          effect: '当佛耶戈登场时全队获得20%全能吸血，友方英雄不多于2个时提升至60%',
          tier: 'T2',
          suitableTeams: ['堕落使者体系'],
          description: '佛耶戈专属强化'
        }
      ]
    },
    {
      hero: '索拉卡',
      cost: 4,
      augments: [
        {
          name: '星之祝福',
          type: '自身强化',
          effect: '每5秒全队回复20点法力值',
          tier: 'T1',
          suitableTeams: ['星守体系', '爱心使者体系'],
          description: '索拉卡专属强化'
        },
        {
          name: '神圣之光',
          type: '自身强化',
          effect: '在战斗开始15秒后索拉卡的技能会获得强化',
          tier: 'T2',
          suitableTeams: ['星守体系'],
          description: '索拉卡专属强化'
        }
      ]
    },
    {
      hero: '卑尔维斯',
      cost: 4,
      augments: [
        {
          name: '虚空女皇',
          type: '自身强化',
          effect: '卑尔维斯获得20%全能吸血，生命值低于50%时提升为60%',
          tier: 'T1',
          suitableTeams: ['怪兽体系'],
          description: '卑尔维斯专属强化'
        },
        {
          name: '虚空造物',
          type: '自身强化',
          effect: '对局开始时最强的虚空女皇在前方制造两个75%生命值的虚空造物',
          tier: 'T2',
          suitableTeams: ['怪兽体系'],
          description: '卑尔维斯专属强化'
        }
      ]
    },
    {
      hero: '塔莉垭',
      cost: 4,
      augments: [
        {
          name: '岩石护盾',
          type: '自身强化',
          effect: '对局开始时塔莉垭为场上生命值最高的三个友方英雄提供他们50%最大生命值的护盾',
          tier: 'T1',
          suitableTeams: ['星守体系'],
          description: '塔莉垭专属强化'
        },
        {
          name: '地震',
          type: '自身强化',
          effect: '塔莉垭获得30法术强度，技能对最大生命值超过1800点的敌方单位伤害增加40%',
          tier: 'T2',
          suitableTeams: ['星守体系'],
          description: '塔莉垭专属强化'
        }
      ]
    },
    // ==================== 5费英雄强化 ====================
    {
      hero: '费德提克',
      cost: 5,
      augments: [
        {
          name: '堕落之魂',
          type: '团队强化',
          effect: '对局开始时费德提克周围的友军获得30点法术强度和堕落之魂效果',
          tier: 'T1',
          suitableTeams: ['堕落使者体系', '怪兽体系'],
          description: '费德提克专属强化，强力团队增益'
        },
        {
          name: '灵魂收割',
          type: '自身强化',
          effect: '当一名友方英雄阵亡时费德提克获得200点额外生命值',
          tier: 'T2',
          suitableTeams: ['堕落使者体系'],
          description: '费德提克专属强化'
        }
      ]
    },
    {
      hero: '厄斐琉斯',
      cost: 5,
      augments: [
        {
          name: '武器大师',
          type: '自身强化',
          effect: '厄斐琉斯普通攻击可以降低敌方10%护甲，可叠加',
          tier: 'T1',
          suitableTeams: ['枪手体系', '精英战士体系'],
          description: '厄斐琉斯专属强化'
        },
        {
          name: '月之祝福',
          type: '团队强化',
          effect: '当厄斐琉斯登场时全队获得15%额外攻击力，每5秒提升5%',
          tier: 'T2',
          suitableTeams: ['枪手体系'],
          description: '厄斐琉斯专属强化'
        }
      ]
    },
    {
      hero: '努努',
      cost: 5,
      augments: [
        {
          name: '小天才之力',
          type: '自身强化',
          effect: '努努获得30点法术强度，每秒回复10点法力值',
          tier: 'T2',
          suitableTeams: ['小天才体系', '怪兽体系'],
          description: '努努专属强化'
        },
        {
          name: '雪球滚滚',
          type: '团队强化',
          effect: '当努努登场时全队获得20点法术强度，每5秒提升5点',
          tier: 'T2',
          suitableTeams: ['小天才体系'],
          description: '努努专属强化'
        }
      ]
    },
    {
      hero: '蕾欧娜',
      cost: 5,
      augments: [
        {
          name: '太阳耀斑',
          type: '团队强化',
          effect: '当蕾欧娜登场时全队受到伤害减少30点',
          tier: 'T1',
          suitableTeams: ['战斗机甲体系'],
          description: '蕾欧娜专属强化，强力团队减伤'
        },
        {
          name: '日蚀',
          type: '自身强化',
          effect: '蕾欧娜获得30点额外法术强度，最大法力值减少20点',
          tier: 'T2',
          suitableTeams: ['战斗机甲体系'],
          description: '蕾欧娜专属强化'
        }
      ]
    },
    {
      hero: '辛德拉',
      cost: 5,
      augments: [
        {
          name: '星之力量',
          type: '团队强化',
          effect: '当辛德拉登场时备战席每有一个弈子全队获得5点法术强度',
          tier: 'T2',
          suitableTeams: ['星守体系'],
          description: '辛德拉专属强化'
        },
        {
          name: '召唤之力',
          type: '自身强化',
          effect: '被辛德拉召唤到场上的英雄获得30%攻击力和30点法术强度、护甲、魔抗',
          tier: 'T1',
          suitableTeams: ['星守体系'],
          description: '辛德拉专属强化'
        }
      ]
    },
    {
      hero: '迦娜',
      cost: 5,
      augments: [
        {
          name: '风暴之眼',
          type: '自身强化',
          effect: '气象主播加成效果提升100%',
          tier: 'T1',
          suitableTeams: ['平民英雄体系'],
          description: '风女专属强化'
        },
        {
          name: '风之祝福',
          type: '自身强化',
          effect: '迦娜每次普攻额外回复5点法力值',
          tier: 'T2',
          suitableTeams: ['平民英雄体系'],
          description: '风女专属强化'
        }
      ]
    },
    {
      hero: '莫德凯撒',
      cost: 5,
      augments: [
        {
          name: '黑暗领域',
          type: '自身强化',
          effect: '莫德凯撒每5秒获得20点法术强度',
          tier: 'T2',
          suitableTeams: ['精英战士体系'],
          description: '铁男专属强化'
        },
        {
          name: '死亡之握',
          type: '团队强化',
          effect: '对局开始时莫德凯撒减少敌方单位20%护甲和魔抗',
          tier: 'T1',
          suitableTeams: ['精英战士体系'],
          description: '铁男专属强化'
        }
      ]
    },
    {
      hero: '厄加特',
      cost: 5,
      augments: [
        {
          name: '宝藏猎人',
          type: '团队强化',
          effect: '对局开始时厄加特和周围英雄获得25点法术强度和15%攻击速度',
          tier: 'T1',
          suitableTeams: ['怪兽体系', '精英战士体系'],
          description: '厄加特专属强化'
        },
        {
          name: '幸运挖掘',
          type: '自身强化',
          effect: '厄加特技能有额外25%几率挖掘宝藏',
          tier: 'T2',
          suitableTeams: ['怪兽体系'],
          description: '厄加特专属强化'
        }
      ]
    }
  ],
  
  // ==================== 银色强化符文 ====================
  silverAugments: [
    { name: '枪手之心', tier: 'T2', effect: '获得枪手纹章', suitableTeams: ['枪手体系'] },
    { name: '情报特工之心', tier: 'T2', effect: '获得情报特工纹章', suitableTeams: ['情报特工体系'] },
    { name: '开摆', tier: 'T1', effect: '获得金币', suitableTeams: ['各种阵容'] },
    { name: '三阶之力', tier: 'T2', effect: '3费棋子获得属性加成', suitableTeams: ['赌狗阵容'] },
    { name: '窃贼手套', tier: 'T1', effect: '获得窃贼手套', suitableTeams: ['各种阵容'] },
    { name: '电火花', tier: 'T2', effect: '棋子死亡时对周围敌人造成伤害', suitableTeams: ['各种阵容'] },
    { name: '短兵相接', tier: 'T2', effect: '近距离作战棋子获得属性', suitableTeams: ['前排阵容'] },
    { name: '小巨人', tier: 'T2', effect: '获得额外生命值', suitableTeams: ['各种阵容'] },
    { name: '存心失利', tier: 'T2', effect: '连败获得额外金币', suitableTeams: ['连败阵容'] },
    { name: '源计划植入', tier: 'T1', effect: '携带装备棋子获得属性', suitableTeams: ['源计划体系'] }
  ],
  
  // ==================== 金色强化符文 ====================
  goldAugments: [
    { name: '斗士之徽', tier: 'T1', effect: '获得斗士纹章', suitableTeams: ['斗士体系'] },
    { name: '决斗大师之徽', tier: 'T1', effect: '获得决斗大师纹章', suitableTeams: ['决斗大师体系'] },
    { name: '灵能特工之徽', tier: 'T1', effect: '获得灵能特工纹章', suitableTeams: ['灵能特工体系'] },
    { name: '淘气包之徽', tier: 'T2', effect: '获得淘气包纹章', suitableTeams: ['淘气包体系'] },
    { name: '花到上头', tier: 'T1', effect: '获得金币和装备', suitableTeams: ['各种阵容'] },
    { name: '蓝电池', tier: 'T1', effect: '棋子释放技能回复法力值', suitableTeams: ['法系阵容'] },
    { name: '万用瞄准镜', tier: 'T1', effect: '增加攻击距离', suitableTeams: ['射手阵容'] },
    { name: '好事成双', tier: 'T1', effect: '两个相同棋子获得属性加成', suitableTeams: ['赌狗阵容'] },
    { name: 'DD街区+', tier: 'T1', effect: '每回合获得免费刷新', suitableTeams: ['赌狗阵容'] },
    { name: '利滚利加强版', tier: 'T1', effect: '获得大量金币', suitableTeams: ['运营阵容'] },
    { name: '大哥罩我', tier: 'T2', effect: '高费棋子保护低费棋子', suitableTeams: ['九五阵容'] },
    { name: '怪兽等级：最大', tier: 'T2', effect: '怪兽棋子获得属性加成', suitableTeams: ['怪兽体系'] },
    { name: '战斗机甲之徽', tier: 'T1', effect: '获得战斗机甲纹章', suitableTeams: ['战斗机甲体系'] },
    { name: '星之守护者之徽', tier: 'T1', effect: '获得星之守护者纹章', suitableTeams: ['星守体系'] },
    { name: '精英战士之徽', tier: 'T1', effect: '获得精英战士纹章', suitableTeams: ['精英战士体系'] }
  ],
  
  // ==================== 棱彩强化符文 ====================
  prismaticAugments: [
    { name: '斗士之冕', tier: 'T1', effect: '获得斗士纹章+2斗士棋子', suitableTeams: ['斗士体系'] },
    { name: '灵能特工之冕', tier: 'T1', effect: '获得灵能特工纹章+2灵能特工棋子', suitableTeams: ['灵能特工体系'] },
    { name: '决斗大师之冕', tier: 'T1', effect: '获得决斗大师纹章+2决斗大师棋子', suitableTeams: ['决斗大师体系'] },
    { name: '前进之路', tier: 'T1', effect: '每回合获得经验值', suitableTeams: ['运营阵容'] },
    { name: '恶魔契约', tier: 'T1', effect: '购买经验值获得金币', suitableTeams: ['运营阵容'] },
    { name: '快速思考', tier: 'T1', effect: '免费刷新商店', suitableTeams: ['赌狗阵容'] },
    { name: '骰子', tier: 'T1', effect: '获得刷新骰子', suitableTeams: ['各种阵容'] },
    { name: '黄金门票', tier: 'T1', effect: '刷新商店消耗减少', suitableTeams: ['赌狗阵容'] },
    { name: '古代档案', tier: 'T3', effect: '获得纹章之书', suitableTeams: ['各种阵容'] },
    { name: '升级咯', tier: 'T2', effect: '获得经验值和金币', suitableTeams: ['运营阵容'] },
    { name: '高端购物', tier: 'T2', effect: '商店出现高费棋子概率提升', suitableTeams: ['九五阵容'] },
    { name: '战斗机甲之冕', tier: 'T1', effect: '获得战斗机甲纹章+2战斗机甲棋子', suitableTeams: ['战斗机甲体系'] },
    { name: '星之守护者之冕', tier: 'T1', effect: '获得星之守护者纹章+2星守棋子', suitableTeams: ['星守体系'] },
    { name: '精英战士之冕', tier: 'T1', effect: '获得精英战士纹章+2精英战士棋子', suitableTeams: ['精英战士体系'] }
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