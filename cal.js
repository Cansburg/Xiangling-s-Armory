// alert("hi");
// cr = 暴击率(Crit Ratio), cd = 暴击伤害(Crit Dmg),
// atk = Attack, ed = 元素加伤(Elem Dmg),
// er = 充能(Elem Recharge), em = 精通(Elem Mastery)

// 沙漏主属性%
const erSand = 51.8;
const atkSG = 46.6; // 杯子沙漏数值相同
// 杯子主属性%
// const atkGoblet = 46.6;
const edGoblet = 46.6;
// 每词条数值%
const atkpe = 5.3;
const erpe = 5.8;
const crpe = 3.5;
const cdpe = 7.0;
// 班尼特加攻
const bntAtk = 965;
// 人物基础数值 取71级数值
const baseCr = 5.0;
const baseCd = 50.0;
const baseAtk = 185;
const baseEr = 100;
// const baseEm = 72;

// let weaponType;
// let weaponAtk;
// let weaponData;
// 千岩枪模板
const qianyan = {
  name: "千岩长枪",
  weaponAtk: 565,
  weaponType: "atk",
  weaponData: 27.6,
  extraAtk: 14,
  extraEd: 0,
  extraCr: 6,
};
// 天空枪模板
const sky = {
  name: "天空之脊",
  weaponAtk: 674,
  weaponType: "er",
  weaponData: 36.8,
  extraAtk: 0,
  extraEd: 0,
  extraCr: 8,
};
//西风模板
const wind = {
  name: "西风长枪",
  weaponAtk: 565,
  weaponType: "er",
  weaponData: 30.6,
  extraAtk: 0,
  extraEd: 0,
  extraCr: 8,
};
// 鱼叉模板
const fish = {
  name: "渔获",
  weaponAtk: 510,
  weaponType: "er",
  weaponData: 45.9,
  extraAtk: 0,
  extraEd: 32,
  extraCr: 12,
};
// 决斗模板
const fight = {
  name: "决斗之枪",
  weaponAtk: 454,
  weaponType: "cr",
  weaponData: 36.8,
  extraAtk: 20,
  extraEd: 0,
  extraCr: 0,
};
// 香菱模板
let Xiangling = {
  atk: baseAtk,
  cr: baseCr,
  cd: baseCd,
  er: baseEr,
  em: 72,
};
let entries; // 词条数 范围18 ~ 25
let rechargeDl = 180; // 最少180
let cr, cd, atk, ed, er, em; // cr = Crit Ratio, cd = Crit Dmg, atk = Attack, ed = Elem Dmg, er = Elem Recharge, em = Elem Mastery
let attr;

// attr: 1.攻火暴 2.充攻暴 3.充火暴
let getFinalDmg = (chara, weapon, attr, entries) => {
  let finalChara = {
    atk: chara.atk + weapon.weaponAtk,
    atkg: 311,
    cr: chara.cr + 31.1 + weapon.extraCr,
    cd: chara.cd,
    er: chara.er,
    em: chara.em,
    ed: 0,
  };
  let mainAtk = 0;
  let mainEd = 0;
  let mainEr = 0;
  let mainCr = 0;
  if (attr == 1 || attr == 2) {
    mainAtk += atkSG;
    if (weapon.weaponType == "atk") {
      mainAtk += weapon.weaponData + weapon.extraAtk;
    } else if (weapon.weaponType == "er") {
      mainEr += weapon.weaponData;
    } else {
      mainCr += weapon.weaponData;
    }
    attr == 1 ? (mainEd += edGoblet + weapon.extraEd) : (mainEr += erSand);
  } else if (attr == 3) {
    if (weapon.weaponType == "atk") {
      mainAtk += weapon.weaponData + weapon.extraAtk;
    } else if (weapon.weaponType == "er") {
      mainEr += weapon.weaponData;
    } else {
      mainCr += weapon.weaponData;
    }
    mainEd += edGoblet + weapon.extraEd;
    mainEr += erSand;
  }
  let costE = Math.ceil((80 - mainEr) / erpe);
  if (costE < 0) {
    costE = 0;
  }
  remainE = entries - costE;
  let finalDmg;
  // console.log(remainE, mainAtk, mainEr, mainEd, costE);
  if (remainE > 0) {
    mainEr += costE * erpe;
    // console.log("元素充能 分配" + costE + "词条，剩余词条：" + remainE);
    if (mainAtk < 80) {
      costE = Math.ceil((80 - mainAtk) / atkpe);
      if (remainE - costE > 0) {
        mainAtk += costE * atkpe;
        remainE -= costE;
        // console.log("攻击 分配" + costE + "词条，剩余词条：" + remainE);
      }
    }
    while (remainE > 0) {
      if (finalChara.cd - finalChara.cr * 2 < 0) {
        finalChara.cd += cdpe;
        // console.log("暴击伤害 分配1词条，剩余词条：" + remainE);
      } else {
        finalChara.cr += crpe;
        // console.log("暴击率 分配1词条，剩余词条：" + remainE);
      }
      remainE--;
    }
  }
  finalChara.atkg += finalChara.atk * (mainAtk / 100);
  finalChara.er += mainEr;
  finalChara.cr += mainCr;
  finalChara.ed += mainEd + finalChara.er / 4;

  finalDmg =
    (finalChara.atk + finalChara.atkg) *
    (1 + ((finalChara.cr / 100) * finalChara.cd) / 100) *
    (1 + finalChara.ed / 100);
  return {
    entries: entries,
    // attr: attr,
    getAttr: ((attr) => {
      let e;
      switch (attr) {
        case 1:
          e = "攻火暴";
          break;
        case 2:
          e = "充攻暴";
          break;
        case 3:
          e = "充火暴";
          break;
        default:
          break;
      }
      return e;
    })(attr),
    finalChara: finalChara,
    damage: Math.floor(finalDmg * 100) / 100,
  };
};
let getDmgWithBennet = (chara, weapon, attr, entries) => {
  let finalChara = {
    atk: chara.atk + weapon.weaponAtk,
    atkg: 311,
    cr: chara.cr + 31.1 + weapon.extraCr,
    cd: chara.cd,
    er: chara.er,
    em: chara.em,
    ed: 0,
  };
  let mainAtk = 0;
  let mainEd = 0;
  let mainEr = 0;
  let mainCr = 0;
  if (attr == 1 || attr == 2) {
    mainAtk += atkSG;
    if (weapon.weaponType == "atk") {
      mainAtk += weapon.weaponData + weapon.extraAtk;
    } else if (weapon.weaponType == "er") {
      mainEr += weapon.weaponData;
    } else {
      mainCr += weapon.weaponData;
    }
    attr == 1 ? (mainEd += edGoblet + weapon.extraEd) : (mainEr += erSand);
  } else if (attr == 3) {
    if (weapon.weaponType == "atk") {
      mainAtk += weapon.weaponData + weapon.extraAtk;
    } else if (weapon.weaponType == "er") {
      mainEr += weapon.weaponData;
    } else {
      mainCr += weapon.weaponData;
    }
    mainEd += edGoblet + weapon.extraEd;
    mainEr += erSand;
  }
  let costE = Math.ceil((80 - mainEr) / erpe);
  if (costE < 0) {
    costE = 0;
  }
  remainE = entries - costE;
  let dmgWithBennet;
  // console.log(remainE, mainAtk, mainEr, mainEd, costE);
  if (remainE > 0) {
    mainEr += costE * erpe;
    // console.log("元素充能 分配" + costE + "词条，剩余词条：" + remainE);
    while (remainE > 0) {
      if (finalChara.cd - finalChara.cr * 2 < 0) {
        finalChara.cd += cdpe;
        // console.log("暴击伤害 分配1词条，剩余词条：" + remainE);
      } else {
        finalChara.cr += crpe;
        // console.log("暴击率 分配1词条，剩余词条：" + remainE);
      }
      remainE--;
    }
  }
  finalChara.atkg += finalChara.atk * (mainAtk / 100);
  finalChara.er += mainEr;
  finalChara.cr += mainCr;
  finalChara.ed += mainEd + finalChara.er / 4;

  dmgWithBennet =
    (finalChara.atk + finalChara.atkg + bntAtk) *
    (1 + ((finalChara.cr / 100) * finalChara.cd) / 100) *
    (1 + finalChara.ed / 100);

  return {
    entries: entries,
    // attr: attr,
    getAttr: ((attr) => {
      let e;
      switch (attr) {
        case 1:
          e = "攻火暴";
          break;
        case 2:
          e = "充攻暴";
          break;
        case 3:
          e = "充火暴";
          break;
        default:
          break;
      }
      return e;
    })(attr),
    finalChara: finalChara,
    damage: Math.floor(dmgWithBennet * 100) / 100,
  };
};
let resultQianyan = [];
let resultSky = [];
let resultFish = [];
let resultFight = [];
let resultQianyanB = [];
let resultSkyB = [];
let resultFishB = [];
let resultFightB = [];

for (let i = 18; i < 25; i++) {
  for (let j = 1; j < 4; j++) {
    resultQianyan.push(getFinalDmg(Xiangling, qianyan, j, i));
  }
}
for (let i = 18; i < 25; i++) {
  for (let j = 1; j < 4; j++) {
    resultQianyanB.push(getDmgWithBennet(Xiangling, qianyan, j, i));
  }
}
for (let i = 18; i < 25; i++) {
  for (let j = 1; j < 4; j++) {
    resultSky.push(getFinalDmg(Xiangling, sky, j, i));
  }
}
for (let i = 18; i < 25; i++) {
  for (let j = 1; j < 4; j++) {
    resultSkyB.push(getDmgWithBennet(Xiangling, sky, j, i));
  }
}
for (let i = 18; i < 25; i++) {
  for (let j = 1; j < 4; j++) {
    resultFish.push(getFinalDmg(Xiangling, fish, j, i));
  }
}
for (let i = 18; i < 25; i++) {
  for (let j = 1; j < 4; j++) {
    resultFishB.push(getDmgWithBennet(Xiangling, fish, j, i));
  }
}
for (let i = 18; i < 25; i++) {
  for (let j = 1; j < 4; j++) {
    resultFight.push(getFinalDmg(Xiangling, fight, j, i));
  }
}
for (let i = 18; i < 25; i++) {
  for (let j = 1; j < 4; j++) {
    resultFightB.push(getDmgWithBennet(Xiangling, fight, j, i));
  }
}
console.log(resultQianyan, resultSky, resultFish);
