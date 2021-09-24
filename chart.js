let myChart = document.getElementById("main");

let initChart = echarts.init(myChart, null, {
  renderer: "svg",
});

let option = {
  title: {
    text: "卯师傅武器排名",
  },

  aria: {
    show: true,
    decal: {
      show: true,
    },
  },

  legend: {
    data: ["dmg", "r0", "r1"],
    backgroundColor: "#ccc",
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

      return `<span>${str}:${e.data[e.seriesName]}</span>
      <p></p>
      <div style='text-align:left'>攻击力：${(
        e.data.xiangling.atk + e.data.xiangling.atkg
      ).toFixed(1)}
      <br>暴率：${e.data.xiangling.cr.toFixed(
        1
      )}<br>暴伤：${e.data.xiangling.cd.toFixed(1)}</div>`;
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
    axisLabel: { rotate: -25 },
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
    initChart.resize({
      width: 900,
      height: 80 * results.length > 400 ? 80 * results.length : 500,
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