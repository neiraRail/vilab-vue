<template>
    <v-card elevation="5">
        <v-chart class="chart" :option="chartOption" autoresize="" />
    </v-card>
</template>
  
<script>
import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { TooltipComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart, { THEME_KEY } from "vue-echarts";

use([TooltipComponent, GridComponent, LineChart, CanvasRenderer])

export default {
    props: ['data', "selectedNode"],
    components: {
        VChart
    },
    data() {
        return {
            chartOption: {
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
                    data: this.data.t
                },
                grid: {
                    left: '3%',
                    right: '3%',
                    bottom: '3%',
                    containLabel: true
                },
                yAxis: {
                    splitLine: { show: false },
                },
                series: [
                    {
                        name: 'x',
                        type: 'line',
                        showSymbol: false,
                        data: this.data.x
                    },
                    {
                        name: 'y',
                        type: 'line',
                        showSymbol: false,
                        data: this.data.y
                    },
                    {
                        name: 'z',
                        type: 'line',
                        showSymbol: false,
                        data: this.data.z
                    }
                ]
            }
        };
    },
};

</script>
  
<style scoped>
.chart {
    height: 330px;
}
</style>
  