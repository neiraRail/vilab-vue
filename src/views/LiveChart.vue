<template>
    <real-time-chart :data="chartData" :height="props.height"></real-time-chart>
</template>
<script setup>
import { ref, defineProps } from "vue";
import io from "socket.io-client";
import RealTimeChart from './RealTimeChart.vue';

const props = defineProps(['newNode', 'attr', 'height'])

const chartData = ref({
    t: [0],
    x: [0],
    y: [0],
    z: [0]
})

const socket = io.connect("http://200.13.4.208:8082");
socket.on("connect", () => {
    console.log("CONNECTED");
    socket.emit("realtime", { node: props.newNode });  // Podria indicar solo acelerómetro
});
socket.on('newdata', (data) => {
    let measure = {
        x: data[props.attr + '_x'],
        y: data[props.attr + '_y'],
        z: data[props.attr + '_z']
    }
    addMeasure(chartData, measure);
});

const addMeasure = (data, measure) => {
    if (data.value.t.length > 100) {
        data.value.t.shift()
        data.value.x.shift()
        data.value.y.shift()
        data.value.z.shift()
    }
    data.value.t.push(data.value.t[data.value.t.length - 1] + 1)
    data.value.x.push(measure.x)
    data.value.y.push(measure.y)
    data.value.z.push(measure.z)
}
</script>