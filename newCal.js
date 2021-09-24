// cr = 暴击率(Crit Ratio), cd = 暴击伤害(Crit Dmg),
// atk = Attack, ed = 元素加伤(Elem Dmg),
// er = 充能(Elem Recharge), em = 精通(Elem Mastery)

//通用属性
const atk = 46.6;
const em = 187;
// 沙漏主属性%
const erSand = 51.8;
// 杯子主属性%
const edGoblet = 46.6;
// 头主属性%
const crHat = 31.1;
const cdHat = 62.2;

// 每词条数值%
const atkpe = 5.3;
const erpe = 5.8;
const crpe = 3.5;
const cdpe = 7.0;
// 班尼特加攻
let bntAtk = { value: 0 };

let entries = document.getElementById("entries"); // 词条数 范围18 ~ 25
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
    this.atk = 185;
    this.atkg = 311;
    this.atkh = 0; //百分比攻击
    this.cr = 5.0;
    this.cd = 50.0;
    this.er = 100;
    this.ed = 0;
    this.em = 72;
    this.weaponName = "";
    this.name = name;
    this.equipment = "";
  }
  getFinalChara(sand, goblet, hat, weapon, entries) {
    //绝缘2的效果
    this.er += 20;
    //增加圣遗物主词条面板
    if (sand == 0) {
      this.equipment = "攻";
      this.atkh += atk;
    } else if (sand == 1) {
      this.equipment = "充";
      this.er += erSand;
    } else {
      this.equipment = "精";
      this.em += em;
    }
    if (goblet == 0) {
      this.equipment += "火";
      this.ed += edGoblet;
    } else if (goblet == 1) {
      this.equipment += "攻";
      this.atkh += atk;
    } else {
      this.equipment += "精";
      this.em += em;
    }
    if (hat == 0) {
      this.equipment += "暴";
      this.cr += crHat;
    } else if (hat == 1) {
      this.equipment += "暴伤";
      this.cd += cdHat;
    } else {
      this.equipment += "精";
      this.em += em;
    }

    this.atk += weapon.weaponAtk; //确定白字
    this.atkg += Number(bntAtk.value); //增加班神攻击
    //增加武器特效
    this.atkh += weapon.extraAtk;
    this.cr += weapon.extraCr;
    this.ed += weapon.extraEd;
    this.weaponName = weapon.name;
    // console.log(this.weaponName);
    //增加武器主词条
    switch (weapon.weaponType) {
      case "atk":
        this.atkh += weapon.weaponData;
        break;
      case "er":
        this.er += weapon.weaponData;
        break;
      case "cr":
        this.cr += weapon.weaponData;
        break;
      case "em":
        this.em += weapon.weaponData;
        break;
      default:
        break;
    }
    //开始计算副词条
    let costE = Math.ceil((minEr.value - this.er) / erpe);
    if (costE < 0) {
      costE = 0;
    }
    let remainE = entries - costE;
    // console.log(costE, remainE);
    if (remainE > 0) {
      this.er += costE * erpe; //优先保证充能达标
      // console.log("元素充能 分配" + costE + "词条，剩余词条：" + remainE);
      if (!bnt.checked && this.atkh < 80) {
        //保证攻击力达标
        costE = Math.ceil((80 - this.atkh) / atkpe);
        if (remainE - costE > 0) {
          this.atkh += costE * atkpe;
          remainE -= costE;
          // console.log("攻击 分配" + costE + "词条，剩余词条：" + remainE);
        }
      }
      //开始分配双爆词条
      while (remainE > 0) {
        if (this.cd - this.cr * 2 > 0 && this.cr <= 100) {
          this.cr += crpe;
          // console.log("暴击率 分配1词条，剩余词条：" + (remainE - 1));
        } else {
          this.cd += cdpe;
          // console.log("暴击伤害 分配1词条，剩余词条：" + (remainE - 1));
        }
        remainE--;
      }
    }
    this.atkg += (this.atk * this.atkh) / 100; //计算绿字
    this.ed += this.er / 4; //计算绝缘4效果
    // console.log(this);
  }
}
// 武器
const weaponList = [
  {
    name: "精1千岩长枪",
    weaponAtk: 565,
    weaponType: "atk",
    weaponData: 27.6,
    extraAtk: 14,
    extraEd: 0,
    extraCr: 6,
  },
  {
    name: "精5千岩长枪",
    weaponAtk: 565,
    weaponType: "atk",
    weaponData: 27.6,
    extraAtk: 22,
    extraEd: 0,
    extraCr: 14,
  },
  {
    name: "精1决斗之枪",
    weaponAtk: 454,
    weaponType: "cr",
    weaponData: 36.8,
    extraAtk: 20,
    extraEd: 0,
    extraCr: 0,
  },
  {
    name: "精5决斗之枪",
    weaponAtk: 454,
    weaponType: "cr",
    weaponData: 36.8,
    extraAtk: 40,
    extraEd: 0,
    extraCr: 0,
  },
  {
    name: "西风长枪",
    weaponAtk: 565,
    weaponType: "er",
    weaponData: 30.6,
    extraAtk: 0,
    extraEd: 0,
    extraCr: 0,
  },
  {
    name: "精5渔获",
    weaponAtk: 510,
    weaponType: "er",
    weaponData: 45.9,
    extraAtk: 0,
    extraEd: 32,
    extraCr: 12,
  },
  {
    name: "精5匣里灭辰",
    weaponAtk: 454,
    weaponType: "em",
    weaponData: 221,
    extraAtk: 0,
    extraEd: 36,
    extraCr: 0,
  },
  {
    name: "喜多院十文字",
    weaponAtk: 565,
    weaponType: "em",
    weaponData: 110,
    extraAtk: 0,
    extraEd: 0,
    extraCr: 0,
  },
  {
    name: "精1天空之脊",
    weaponAtk: 674,
    weaponType: "er",
    weaponData: 36.8,
    extraAtk: 0,
    extraEd: 0,
    extraCr: 8,
  },
  {
    name: "0层和璞鸢",
    weaponAtk: 674,
    weaponType: "cr",
    weaponData: 22.1,
    // extraAtk: 22.4,
    extraAtk: 6.4,
    extraEd: 0,
    extraCr: 0,
  },
  {
    name: "满层和璞鸢",
    weaponAtk: 674,
    weaponType: "cr",
    weaponData: 22.1,
    extraAtk: 22.4,
    //extraAtk2:6.4,
    extraEd: 12,
    extraCr: 0,
  },
];
// 计算伤害
let getDmg = (chara) => {
  // console.log(chara.atk, chara.atkg, chara.cr, chara.cd, chara.ed);
  return (
    (chara.atk + chara.atkg) *
    (1 + (chara.cr * chara.cd) / 10000) *
    (1 + chara.ed / 100)
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
  //开始计算
  let xiangling = new Chara("xiangling");
  xiangling.getFinalChara(
    sand.selectedIndex,
    goblet.selectedIndex,
    hat.selectedIndex,
    weaponList[document.getElementById("selectWeapon").selectedIndex],
    entries.value
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
