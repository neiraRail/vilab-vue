<template>
    <v-card elevation="5">
        <v-chart :style="'height: '+height+'px;'" :option="chartOption" autoresize="" />
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
    props: ['data', 'height'],
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
                    show: false,
                    splitLine: { show: false },
                },
                series: [
                    {
                        name: 'x',
                        type: 'line',
                        showSymbol: false,
                        data: this.data.data
                    }
                ]
            }
        };
    },
};

</script>
  
<style scoped>
</style>
  