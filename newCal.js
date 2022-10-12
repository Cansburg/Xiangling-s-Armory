// cr = 暴击率(Crit Ratio), cd = 暴击伤害(Crit Dmg),
// atk = Attack, ed = 元素加伤(Elem Dmg),
// er = 充能(Elem Recharge), em = 精通(Elem Mastery)

//通用属性
const atk = 46.6;
const hp = 46.6;
const em = 186.6;
// 沙漏主属性%
const erSand = 51.8;
// 杯子主属性%
const edGoblet = 46.6;
// 头主属性%
const crHat = 31.1;
const cdHat = 62.2;

// 每词条数值
const crpe = 3.3;
const cdpe = 6.6;
const atkpe = 5.0;
const hppe = 5.0;
const erpe = 5.5;
const empe = 19.8;
// console.log(crpe, cdpe, atkpe, erpe, empe);
// 班尼特加攻
let bntAtk = document.getElementById("bntAtk");

let entries = document.getElementById("entries"); // 词条数 范围18 ~ 38
let hpE = document.getElementById("hpE");
let minEr = document.getElementById("minEr");
let btn = document.getElementById("getResult");
let sand = document.getElementById("selectSand");
let goblet = document.getElementById("selectGoblet");
let hat = document.getElementById("selectHat");
let bnt = document.getElementById("isBnt");
let clear = document.getElementById("clear");
// 是否带班尼特玩
bnt.onclick = () => {
  if (bnt.checked) {
    bntAtk = document.getElementById("bntAtk");
    return;
  }
  bntAtk = { value: 0 };
  return;
};

class Chara {
  constructor(name) {
    this.hp = 10875;
    this.hpg = 4780;
    this.hph = 0; //百分比生命
    this.atk = 225;
    this.atkg = 311;
    this.atkh = 0; //百分比攻击
    this.cr = 5.0;
    this.cd = 50.0;
    this.er = 100;
    this.ed = 0;
    this.em = 96;
    this.weaponName = "";
    this.name = name;
    this.equipment = "";
  }
  getFinalChara(sand, goblet, hat, weapon, entries, hpE) {
    // console.log(this);
    //绝缘2的效果
    this.er += 20;
    //生命词条
    this.hph = (this.hph * 10 + hpE * hppe * 10) / 10;
    // console.log(this.hph);
    //增加圣遗物主词条面板
    if (sand == 0) {
      this.equipment = "攻";
      this.atkh += atk;
    } else if (sand == 1) {
      this.equipment = "充";
      this.er += erSand;
    } else if (sand == 2) {
      this.equipment = "精";
      this.em += em;
    } else {
      this.equipment = "生";
      this.hph = (this.hph * 10 + hp * 10) / 10;
    }
    if (goblet == 0) {
      this.equipment += "火";
      this.ed += edGoblet;
    } else if (goblet == 1) {
      this.equipment += "攻";
      this.atkh += atk;
    } else if (goblet == 2) {
      this.equipment += "精";
      this.em += em;
    } else {
      this.equipment = "生";
      this.hph = (this.hph * 10 + hp * 10) / 10;
    }
    if (hat == 0) {
      this.equipment += "暴";
      this.cr = (this.cr * 10 + crHat * 10) / 10;
    } else if (hat == 1) {
      this.equipment += "暴伤";
      this.cd = (this.cd * 10 + cdHat * 10) / 10;
    } else if (hat == 2) {
      this.equipment += "精";
      this.em += em;
    } else {
      this.equipment = "生";
      this.hph = (this.hph * 10 + hp * 10) / 10;
    }
    //确定白字
    this.atk += weapon.weaponAtk;
    //增加班神攻击
    this.atkg += Number(bntAtk.value);
    //增加武器主词条
    switch (weapon.weaponType) {
      case "atk":
        this.atkh = (this.atkh * 10 + weapon.weaponData * 10) / 10;
        break;
      case "er":
        this.er = (this.er * 10 + weapon.weaponData * 10) / 10;
        break;
      case "cr":
        this.cr = (this.cr * 10 + weapon.weaponData * 10) / 10;
        break;
      case "cd":
        this.cd = (this.cd * 10 + weapon.weaponData * 10) / 10;
        break;
      case "em":
        this.em = (this.em * 10 + weapon.weaponData * 10) / 10;
        break;
      default:
        break;
    }
    //增加武器特效
    this.hph += weapon.extraHp;
    this.atkh += weapon.extraAtk;
    this.cr += weapon.extraCr;
    this.er += weapon.extraEr;
    this.ed += weapon.extraEd;
    this.weaponName = weapon.name;
    // console.log(this);
    //特效折算的攻击
    if (weapon.dynamicTo == "atkg") {
      this.atkg += dynamicAttr(this, weapon.dynamicBy, weapon.k);
    } else if (weapon.dynamicTo == "atkh") {
      this.atkh += dynamicAttr(this, weapon.dynamicBy, weapon.k);
    }
    console.log(this);
    //开始计算副词条
    let costE = Math.ceil((minEr.value - this.er) / erpe);
    if (costE < 0) {
      costE = 0;
    }
    let remainE = entries - costE;
    // console.log(costE, remainE);
    if (remainE > 0) {
      //优先保证充能达标
      this.er = (this.er * 10 + costE * erpe * 10) / 10;
      // console.log("元素充能 分配" + costE + "词条，剩余词条：" + remainE);
      /* 
      if (!bnt.checked && this.atkh < 80) {
        //保证攻击力达标
        costE = Math.ceil((80 - this.atkh) / atkpe);
        if (remainE - costE > 0) {
          this.atkh += costE * atkpe;
          remainE -= costE;
          console.log("攻击 分配" + costE + "词条，剩余词条：" + remainE);
        }
      }*/
      //开始分配剩余词条
      //1.配平双爆
      while (remainE > 0) {
        let c = this.cd * 10 - this.cr * 20;
        if (Math.abs(c) > cdpe * 10) {
          if (c > 0) {
            this.cr = (this.cr * 10 + crpe * 10) / 10;
          } else {
            this.cd = (this.cd * 10 + cdpe * 10) / 10;
          }
          remainE--;
        } else break;
      }
      //2.分配基础精通
      while (this.em < 3 * empe + 96) {
        this.em = (this.em * 10 + empe * 10) / 10;
        // console.log("精通 分配1词条，精通：" + this.em);
        remainE--;
      }
      //3.在精通达到阈值(306)之前，按照4双暴+1精通的顺序分配剩余词条
      let f = 0;
      while (remainE > 0) {
        this.cd = (this.cd * 10 + cdpe * 10) / 10;
        // console.log("爆伤 分配1词条，爆伤：" + this.cd);
        remainE--;
        if (remainE > 0) {
          this.cr = (this.cr * 10 + crpe * 10) / 10;
          // console.log("暴击 分配1词条，暴击：" + this.cr);
          remainE--;
        }
        f++;
        if (remainE > 0 && this.em < 306 && f % 2 == 0) {
          this.em = (this.em * 10 + empe * 10) / 10;
          // console.log("精通 分配1词条，精通：" + this.em);
          remainE--;
        }
      }
    }
    //计算绿字
    this.hpg += (this.hp * this.hph) / 100;
    this.atkg += (this.atk * this.atkh) / 100;
    //计算绝缘4效果
    this.ed = (this.ed * 100 + (this.er * 100) / 4) / 100;
    // console.log(this);
  }
}

// 武器
// 武器也写成类试试？
/*class Weapon {
  constructor(
    name,
    type,
    white,
    data,
    dynBy,
    dynTo,
    k,
    exHp,
    exAtkh,
    exAtkg,
    exEr,
    exEd,
    exCr,
    exCd,
    exEm
  ) {
    this.name = name;
    this.weaponType = type;
    this.weaponAtk = white;
    this.weaponData = data;
    this.dynamicBy = dynBy;
    this.dynamicTo = dynTo;
    this.k = k;
    this.extraHp = exHp;
    this.extraAtkh = exAtkh;
    this.extraAtkg = exAtkg;
    this.extraEr = exEr;
    this.extraEd = exEd;
    this.extraCr = exCr;
    this.extraCd = exCd;
    this.extraEm = exEm;
  }
  getFinalWeapon(chara) {
    let dynAttr;
    switch (this.dynamicBy) {
      case "hp":
        dynAttr = chara.hp * (1 + chara.hph / 100) + chara.hpg;
        break;
      case "em":
        dynAttr = chara.em;
        break;
      case "er":
        dynAttr = chara.er - 100;
        break;

      default:
        break;
    }
    let dynData = dynAttr * this.k;
    switch (this.dynamicTo) {
      case "atkg":
        this.extraAtkg += dynData;
        break;
      case "atkh":
        this.extraAtkh += dynData;

      default:
        break;
    }
  }
}
console.log(new Weapon("name"));
const wlist = [
  new Weapon(
    "qq",
    "atk",
    565,
    27.6,
    "none",
    "none",
    0,
    0,
    14,
    0,
    0,
    0,
    6,
    0,
    0
  ),
  new Weapon(
    "yy",
    "atk",
    565,
    27.6,
    "none",
    "none",
    0,
    0,
    22,
    0,
    0,
    0,
    14,
    0,
    0
  ),
  new Weapon("jj", "cr", 454, 36.8, "none", "none", 0, 0, 20, 0, 0, 0, 0, 0, 0),
  new Weapon("kk", "cr", 454, 36.8, "none", "none", 0, 0, 40, 0, 0, 0, 0, 0, 0),
  new Weapon(
    "hh",
    "cd",
    608,
    66.2,
    "hp",
    "atkg",
    0.008,
    20,
    0,
    0,
    0,
    0,
    0,
    0,
    0
  ),
];
*/
// 试试就逝世，鸽了

const weaponList = [
  {
    name: "精1千岩长枪",
    weaponAtk: 565,
    weaponType: "atk",
    weaponData: 27.6,
    dynamicBy: "none",
    dynamicTo: "none",
    k: 0,
    extraHp: 0,
    extraAtk: 14,
    extraEr: 0,
    extraEd: 0,
    extraCr: 6,
  },
  {
    name: "精5千岩长枪",
    weaponAtk: 565,
    weaponType: "atk",
    weaponData: 27.6,
    dynamicBy: "none",
    dynamicTo: "none",
    k: 0,
    extraHp: 0,
    extraAtk: 22,
    extraEr: 0,
    extraEd: 0,
    extraCr: 14,
  },
  {
    name: "精1决斗之枪",
    weaponAtk: 454,
    weaponType: "cr",
    weaponData: 36.8,
    dynamicBy: "none",
    dynamicTo: "none",
    k: 0,
    extraHp: 0,
    extraAtk: 20,
    extraEr: 0,
    extraEd: 0,
    extraCr: 0,
  },
  {
    name: "精5决斗之枪",
    weaponAtk: 454,
    weaponType: "cr",
    weaponData: 36.8,
    dynamicBy: "none",
    dynamicTo: "none",
    k: 0,
    extraHp: 0,
    extraAtk: 40,
    extraEr: 0,
    extraEd: 0,
    extraCr: 0,
  },
  {
    name: "西风长枪",
    weaponAtk: 565,
    weaponType: "er",
    weaponData: 30.6,
    dynamicBy: "none",
    dynamicTo: "none",
    k: 0,
    extraHp: 0,
    extraAtk: 0,
    extraEr: 0,
    extraEd: 0,
    extraCr: 0,
  },
  {
    name: "精5渔获",
    weaponAtk: 510,
    weaponType: "er",
    weaponData: 45.9,
    dynamicBy: "none",
    dynamicTo: "none",
    k: 0,
    extraHp: 0,
    extraAtk: 0,
    extraEr: 0,
    extraEd: 32,
    extraCr: 12,
  },
  {
    name: "精5匣里灭辰",
    weaponAtk: 454,
    weaponType: "em",
    weaponData: 221,
    dynamicBy: "none",
    dynamicTo: "none",
    k: 0,
    extraHp: 0,
    extraAtk: 0,
    extraEr: 0,
    extraEd: 36,
    extraCr: 0,
  },
  {
    name: "喜多院十文字",
    weaponAtk: 565,
    weaponType: "em",
    weaponData: 110,
    dynamicBy: "none",
    dynamicTo: "none",
    k: 0,
    extraHp: 0,
    extraAtk: 0,
    extraEr: 0,
    extraEd: 0,
    extraCr: 0,
  },
  {
    name: "精1天空之脊",
    weaponAtk: 674,
    weaponType: "er",
    weaponData: 36.8,
    dynamicBy: "none",
    dynamicTo: "none",
    k: 0,
    extraHp: 0,
    extraAtk: 0,
    extraEr: 0,
    extraEd: 0,
    extraCr: 8,
  },
  {
    name: "2层和璞鸢",
    weaponAtk: 674,
    weaponType: "cr",
    weaponData: 22.1,
    dynamicBy: "none",
    dynamicTo: "none",
    k: 0,
    extraHp: 0,
    extraEr: 0,
    extraAtk: 6.4,
    extraEd: 0,
    extraCr: 0,
  },
  {
    name: "满层和璞鸢",
    weaponAtk: 674,
    weaponType: "cr",
    weaponData: 22.1,
    dynamicBy: "none",
    dynamicTo: "none",
    k: 0,
    extraHp: 0,
    extraAtk: 22.4,
    extraEr: 0,
    extraEd: 12,
    extraCr: 0,
  },
  {
    name: "满血护摩之杖",
    weaponAtk: 608,
    weaponType: "cd",
    weaponData: 66.2,
    dynamicBy: "hp",
    dynamicTo: "atkg",
    k: 8 / 1000,
    extraHp: 20,
    extraAtk: 0,
    extraEr: 0,
    extraEd: 0,
    extraCr: 0,
  },
  {
    name: "半血护摩之杖",
    weaponAtk: 608,
    weaponType: "cd",
    weaponData: 66.2,
    dynamicBy: "hp",
    dynamicTo: "atkg",
    k: 18 / 1000,
    extraHp: 20,
    extraAtk: 0,
    extraEr: 0,
    extraEd: 0,
    extraCr: 0,
  },
  {
    name: "1层赤沙之杖",
    weaponAtk: 542,
    weaponType: "cr",
    weaponData: 44.1,
    dynamicBy: "em",
    dynamicTo: "atkg",
    k: (52 + 28) / 100,
    extraHp: 0,
    extraAtk: 0,
    extraEr: 0,
    extraEd: 0,
    extraCr: 0,
  },
  {
    name: "3层赤沙之杖",
    weaponAtk: 542,
    weaponType: "cr",
    weaponData: 44.1,
    dynamicBy: "em",
    dynamicTo: "atkg",
    k: (52 + 28 * 3) / 100,
    extraHp: 0,
    extraAtk: 0,
    extraEr: 0,
    extraEd: 0,
    extraCr: 0,
  },
  {
    name: "薙刀",
    weaponAtk: 608,
    weaponType: "er",
    weaponData: 55.1,
    dynamicBy: "er",
    dynamicTo: "atkh",
    k: 0.28,
    extraHp: 0,
    extraAtk: 0,
    extraEr: 30,
    extraEd: 0,
    extraCr: 0,
  },
];

// 武器特效折算
let dynamicAttr = (chara, type, k) => {
  // console.log(chara);
  let attr;
  switch (type) {
    case "hp":
      attr = chara.hp * (1 + chara.hph / 100) + chara.hpg;
      // console.log(attr);
      break;
    case "atk":
      attr = chara.atk;
      break;
    case "er":
      attr = chara.er - 100;
      break;
    case "cr":
      attr = chara.cr;
      break;
    case "em":
      attr = chara.em;
      break;
    default:
      attr = 0;
      break;
  }
  // console.log(attr * k);
  return attr * k;
};

// 计算伤害
let getDmg = (chara) => {
  // console.log(chara.atk, chara.atkg, chara.cr, chara.cd, chara.ed);
  return (
    ((chara.atk + chara.atkg) *
      238 * // 13级Q倍率
      (1 + (chara.cr * chara.cd) / 10000) *
      (1 + chara.ed / 100)) /
    100
  );
};
let getReactDmg = (dmg, chara, react) => {
  let r, rEm;
  let k, a;
  if (react) {
    //剧变
    k = 16.0;
    a = 2000;
    return Number(((1590 * (k * chara.em)) / (chara.em + a)).toFixed(2));
  } else {
    //蒸发
    r = 1.5;
    k = 2.78;
    a = 1400;
  }
  rEm = Number(((k * chara.em) / (chara.em + a)).toFixed(2));
  return dmg * r * (rEm + 1);
};

// 结果列表
let results = [];

// 获取ul、展开键、删除键
let resList = document.getElementById("results");
let collapse = document.getElementsByClassName("collapse");
let delBtn = document.getElementsByClassName("del");

//整体刷新列表
let flushList = (arr) => {
  resList.innerHTML = "";
  let flag = 0;
  arr.forEach((e) => {
    resList.innerHTML += `
    <li><button class='collapse'>展开▶</button> ${e.xiangling.weaponName}
    ${e.xiangling.equipment}
    充能效率:${e.xiangling.er.toFixed(1)}%
    期望伤害:${e.dmg}
    蒸发伤害:${e.r0}
    超载伤害:${
      e.r1
    } <button class='del' style='color:red' value=${flag}>删除</button>
    <div value=0 style = "display:none">
    攻击：${(e.xiangling.atk + e.xiangling.atkg).toFixed(0)}
    精通:${e.xiangling.em}
    暴击:${e.xiangling.cr.toFixed(1)}%
    暴伤:${e.xiangling.cd.toFixed(1)}%
    充能:${e.xiangling.er.toFixed(1)}%
    元素加伤:${e.xiangling.ed.toFixed(1)}%
    </div>
    </li>
    <p></p>
    `;
    flag++;
  });
};

//增加列表项
let fullList = (e) => {
  resList.innerHTML += `
    <li><button class='collapse'>展开▶</button> ${
      e[e.length - 1].xiangling.weaponName
    }
    ${e[e.length - 1].xiangling.equipment}
    充能效率:${e[e.length - 1].xiangling.er.toFixed(1)}%
    期望伤害:${e[e.length - 1].dmg}
    蒸发伤害:${e[e.length - 1].r0}
    超载伤害:${e[e.length - 1].r1} <button class='del' style='color:red'value=${
    e.length - 1
  }>删除</button>
    <div value=0 style = "display:none">
    生命值：${(
      e[e.length - 1].xiangling.hp + e[e.length - 1].xiangling.hpg
    ).toFixed(0)}
    攻击：${(
      e[e.length - 1].xiangling.atk + e[e.length - 1].xiangling.atkg
    ).toFixed(0)}
    精通:${e[e.length - 1].xiangling.em}
    暴击:${e[e.length - 1].xiangling.cr.toFixed(1)}%
    暴伤:${e[e.length - 1].xiangling.cd.toFixed(1)}%
    充能:${e[e.length - 1].xiangling.er.toFixed(1)}%
    元素加伤:${e[e.length - 1].xiangling.ed.toFixed(1)}%
    </div>
    </li>
    <p></p>
    `;
};

//绑定点击事件
btn.onclick = () => {
  //判断数据是否合法
  //鸽了

  //开始计算
  let xiangling = new Chara("xiangling");
  xiangling.getFinalChara(
    sand.selectedIndex,
    goblet.selectedIndex,
    hat.selectedIndex,
    weaponList[document.getElementById("selectWeapon").selectedIndex],
    entries.value,
    hpE.value
  );

  let dmg = getDmg(xiangling).toFixed(2);
  let r0 = getReactDmg(dmg, xiangling, 0).toFixed(2),
    r1 = getReactDmg(dmg, xiangling, 1).toFixed(2);

  results.push({
    xiangling,
    name: `${xiangling.weaponName}\n${entries.value}词条${
      bnt.checked ? "(班)" : ""
    }\n${xiangling.equipment}\n${xiangling.er.toFixed(1)}充能`,
    dmg,
    r0,
    r1,
  });
  fullList(results);
  clear.style.visibility = "visible";
};

//事件委托yyds……
resList.addEventListener("click", (e) => {
  let target = e.target;
  if (target.className == "del") {
    results.splice(target.getAttribute("value"), 1);
    flushList(results);
  }
  if (target.className == "collapse") {
    let panel = target.parentNode.lastElementChild;
    if (panel.getAttribute("value") == "0") {
      panel.style = "display: block";
      panel.setAttribute("value", "1");
      target.innerText = "收起▼";
    } else {
      panel.style = "display: none";
      panel.setAttribute("value", "0");
      target.innerText = "展开▶";
    }
  }
});

//一键清除
clear.onclick = () => {
  results = [];
  clear.previousElementSibling.innerHTML = "";
  clear.style.visibility = "hidden";
};
