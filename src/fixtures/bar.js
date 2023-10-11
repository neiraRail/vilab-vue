const xAxisData = [];
const data1 = [];
const data2 = [];
const data3 = [];

for (let i = 0; i < 7; i++) {
  xAxisData.push(`date ${i + 1}`);
  data1.push(Math.floor(Math.random() * 20 + 1) + i);
  data2.push(Math.floor(Math.random() * 20 + 1) + i);
  data3.push(Math.floor(Math.random() * 20 + 1) + i);
}

const content = [
  { title: "Today", data: data1 },
  { title: "Last Week", data: data2 },
  { title: "Last Month", data: data3 }
];

const serieObject = ({ title, data }) => ({
  name: title,
  type: "bar",
  data,
  animationDelay: function(idx) {
    return idx * 10;
  },
  barWidth: 15,
  itemStyle: {
    barBorderRadius: [30, 30, 0, 0]
  },
  label: {
    show: true,
    position: "top",
    distance: 15,
    color: "#fff",
    fontSize: 10,
    formatter: data => {
      return `${data.value}%`;
    }
  }
});

export const barDataMulti = {
  xAxis: {
    data: xAxisData,
    type: "category",
    silent: false,
    splitLine: {
      show: false
    }
  },
  yAxis: {
    show: false
  },
  legend: {
    show: true,
    data: content.map(item => item.title),
    align: "left"
  },
  series: content.map(item => serieObject(item))
};

export const barData = {
  xAxis: {
    data: xAxisData,
    type: "category",
    silent: false,
    splitLine: {
      show: false
    }
  },
  label: {
    show: true
  },
  yAxis: {
    show: false
  },
  series: [serieObject({ title: "legend", data: data1 })]
};
