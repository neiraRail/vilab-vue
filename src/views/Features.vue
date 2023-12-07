<template>
    <v-container fluid>
        <v-row>
            <v-col cols="8">
                <v-card elevation="0">
                    <v-card-title>Time Domain</v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col v-for="(operation, key) in node.operaciones" :key="key" cols="6">
                                <h3>{{operation.subtipo}}</h3>
                                <real-time-chart :data="chartData[operation.subtipo].acc" height="330"></real-time-chart>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
                <v-card elevation="0">
                    <v-card-title>Frequency Domain</v-card-title>
                </v-card>
                <v-card elevation="0">
                    <v-card-title>
                        Time-frequency domain
                    </v-card-title>
                </v-card>
            </v-col>
            <v-col cols="4">
                <v-card>
                    <v-toolbar flat dense>
                        <v-toolbar-title>
                            <span class="text-subheading"
                                style="display: flex; justify-content: space-between; width: 90%;">
                                <h3>Features</h3>
                            </span>
                        </v-toolbar-title>
                    </v-toolbar>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { useNodeStore } from '@/stores/nodeStore.js'
import { useRoute } from 'vue-router';
import { ref, defineProps, computed } from "vue";
import RealTimeChart from './RealTimeChart.vue';
import io from "socket.io-client";

const nodeStore = useNodeStore();
const route = useRoute();
const props = defineProps(['newNode', 'attr', 'height'])

const node = computed(() => {
    return nodeStore.nodes.filter((node) => node.node == route.params.node)[0]
})

const chartData = ref(node.value.operaciones.reduce((accum, key) => {
    accum[key.subtipo] = { acc: { x: [0], y: [0], z: [0], t: [0] }, gyro: { x: [0], y: [0], z: [0], t: [0] }}
    return accum
}, {})) // { 'rms': [], 'max': [], ... }

const last_id = ref(node.value.operaciones.reduce((accum, key) => {
    accum[key.subtipo] = 0
    return accum
}, {}))
console.log(last_id.value)
const hola = ref({
    x: [0],
    y: [0],
    z: [0],
    t: [0]
})

const socket = io.connect("http://200.13.4.208:8082");
socket.on("connect", () => {
    console.log("CONNECTED");
    socket.emit("feature", { node: route.params.node });  // Podria indicar solo acelerómetro
});
socket.on('newfeature', (feature) => {
    if (feature.batch_id > last_id.value[feature.subtipo]) {
        console.log("new feature called: ", feature.subtipo)
        last_id.value[feature.subtipo] = feature.batch_id
        chartData.value[feature.subtipo].acc.x.push(feature.acc_x)
        chartData.value[feature.subtipo].acc.y.push(feature.acc_y)
        chartData.value[feature.subtipo].acc.z.push(feature.acc_z)
        chartData.value[feature.subtipo].gyro.x.push(feature.gyro_x)
        chartData.value[feature.subtipo].gyro.y.push(feature.gyro_y)
        chartData.value[feature.subtipo].gyro.z.push(feature.gyro_z)
        chartData.value[feature.subtipo].acc.t.push(feature.batch_id)
        chartData.value[feature.subtipo].gyro.t.push(feature.batch_id)
        if (chartData.value[feature.subtipo].acc.t.length > 4) {
            //shift each array inside acc and gyro using a for loop
            for(let axis in chartData.value[feature.subtipo].acc){
                chartData.value[feature.subtipo].acc[axis].shift()
            }
            for(let axis in chartData.value[feature.subtipo].gyro){
                chartData.value[feature.subtipo].gyro[axis].shift()
            }
        }
    }

});

</script>