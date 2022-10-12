let myChart = document.getElementById("main");

let initChart = echarts.init(myChart, null, {
  renderer: "svg",
});

let option = {
  title: {
    text: "卯师傅武器排名",
  },

  grid: { left: 80 },

  aria: {
    show: true,
    decal: {
      show: true,
    },
  },

  legend: {
    data: ["dmg", "r0", "r1"],
    // orient: "vertical",
    right: 10,
    top: 30,
    // backgroundColor: "#ccc",
    selected: {
      dmg: true,
      r0: true,
      r1: true,
    },
  },

  tooltip: {
    show: true,
    // triggerOn: "click",
    formatter: (e) => {
      // console.log(e);
      let str = "";
      switch (e.seriesName) {
        case "dmg":
          str = "期望伤害";
          break;
        case "r0":
          str = "蒸发伤害";
          break;
        case "r1":
          str = "超载伤害";
          break;
        default:
          break;
      }
      return `<span style='font-size:14px'>${str}:${e.data[e.seriesName]}</span>
      <div style='text-align:left; font-size:12px; line-height: 100%'>
      生命：${(e.data.xiangling.hp + e.data.xiangling.hpg).toFixed(1)}
      <br>攻击：${(e.data.xiangling.atk + e.data.xiangling.atkg).toFixed(1)}
      <br>精通：${e.data.xiangling.em}
      <br>暴率：${e.data.xiangling.cr.toFixed(1)}%
      <br>暴伤：${e.data.xiangling.cd.toFixed(1)}%
      <br>元素加伤：${e.data.xiangling.ed.toFixed(1)}%
      </div>`;
    },
  },

  dataset: [
    {
      dimensions: ["name", "dmg", "r0", "r1"],
      // 提供一份数据。
      source: [],
    },
    {
      transform: {
        type: "sort",
        // 按分数排序
        config: { dimension: "dmg", order: "asc" },
      },
    },
  ],

  yAxis: {
    type: "category",
    axisLabel: { rotate: 0 },
  },

  xAxis: {},
  // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
  series: [
    { type: "bar", datasetIndex: 1, barGap: "0" },
    { type: "bar", datasetIndex: 1, barGap: "0" },
    { type: "bar", datasetIndex: 1, barGap: "0" },
  ],

  animationDuration: 300,
};
// 创建柱状图
let addChart = document.getElementById("addChart");
addChart.onclick = () => {
  if (results.length) {
    addChart.innerText = "更新柱状图";
    option.dataset[0].source = results;
    initChart.setOption(option);
    // console.log(results);
    // console.log(document.body.clientWidth);
    initChart.resize({
      width: "auto",
      height: results.length > 2 ? 100 * results.length : 240,
    });
  }
};
// 点击排序
initChart.on("click", (params) => {
  // console.log(params.seriesName);
  option.dataset[1].transform.config.dimension == params.seriesName
    ? {}
    : (option.dataset[1].transform.config.dimension = params.seriesName),
    initChart.setOption(option);
});

let dis = () => {
  initChart.dispose();
};
