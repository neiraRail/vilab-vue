<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="2">
          <v-combobox :items="nodeIds" variant="solo" density="compact" label="Nodo:"></v-combobox>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6"> <!-- This will take up 1/3 of the parent container's width -->
          <v-card elevation="5">
            <v-chart class="chart" :option="option" autoresize="" />
          </v-card>
        </v-col>
        <v-col cols="6"> <!-- This will take up 1/3 of the parent container's width -->
          <v-card elevation="5">
            <v-chart class="chart" :option="option" autoresize="" />
          </v-card>
        </v-col>
        <!-- Other columns/cards can go here -->
      </v-row>
      <v-row>
        <v-col>
          <v-card elevation="5">
            <v-chart class="chart" :option="option" autoresize="" />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-btn @click="add">Hola</v-btn>
  </div>
</template>

<script setup>
import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { TooltipComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, computed } from "vue";

import { useNodeStore } from '@/stores/nodeStore.js'

use([TooltipComponent, GridComponent, LineChart, CanvasRenderer])

const nodeStore = useNodeStore();
const nodeIds = computed(() => nodeStore.nodes.map(node => node.node));


var x = [Math.random() * 100];
var y = [Math.random() * 100];
var z = [Math.random() * 100];
var t = [1];
for (var i = 0; i < 100; i++) {
  x.push(x[x.length - 1] + Math.random() * 20 - 10);
  y.push(y[y.length - 1] + Math.random() * 20 - 10);
  z.push(z[z.length - 1] + Math.random() * 20 - 10);
  t.push(i + 2);
}


async function add() {
  for (var i = 0; i < 1; i++) {
    if (t.length > 100) {
      t.shift()
      y.shift()
      z.shift()
      option.value.series[0].data.shift()
    }
    t.push(t[t.length - 1] + 1)
    y.push(y[y.length - 1] + Math.random() * 21 - 10)
    z.push(z[z.length - 1] + Math.random() * 21 - 10)
    option.value.series[0].data.push(x[x.length - 1] + Math.random() * 21 - 10)

  }
}

const option = ref({

  tooltip: {
    trigger: 'axis',
    formatter: '{a} <br/>{b} : {c}',
    axisPointer: {
      animation: true
    }
  },
  xAxis: {
    name: 'x',
    splitLine: { show: false },
    data: t
  },
  grid: {
    left: '3%',
    right: '3%',
    bottom: '3%',
    containLabel: true
  },
  yAxis: {
    splitLine: { show: false },
    // boundaryGap: [0, '80%'],
  },
  series: [
    {
      name: 'x',
      type: 'line',
      showSymbol: false,
      data: x
    },
    {
      name: 'y',
      type: 'line',
      showSymbol: false,
      data: y
    },
    {
      name: 'z',
      type: 'line',
      showSymbol: false,
      data: z
    }
  ]
});
</script>

<style scoped>
.chart {
  height: 330px;
}
</style>