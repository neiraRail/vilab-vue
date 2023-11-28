<template>
    <div>
        <v-container>
            <v-row>
                <v-col cols="2">
                    <v-combobox v-model="selectedNode" :items="nodeIds" variant="solo" density="compact"
                        label="Nodo:"></v-combobox>
                </v-col>
                <v-col>
                    <v-btn @click="hide">Hide Magnetometer</v-btn>
                </v-col>
            </v-row>

            <template v-if="selectedNode !== ''">
                <v-row>
                    <v-col>
                        <real-time-chart :data="gyroData" :selectedNode="nodeStore.selectedNode"></real-time-chart>
                    </v-col>
                    <v-col  v-if="mag">
                        <real-time-chart :data="magnData" :selectedNode="nodeStore.selectedNode"></real-time-chart>
                    </v-col>
                    <!-- Other columns/cards can go here -->
                </v-row>
                <v-row>
                    <v-col>
                        <real-time-chart :data="accelData" :selectedNode="nodeStore.selectedNode"></real-time-chart>
                    </v-col>
                </v-row>
            </template>
        </v-container>
    </div>
</template>
  
<script setup>
import { ref, watch } from "vue";
import { useNodeStore } from '@/stores/nodeStore.js'
import { storeToRefs } from 'pinia'
import RealTimeChart from './RealTimeChart.vue';
import io from "socket.io-client";
import { onUnmounted } from "vue";

var socket = null;
const nodeStore = useNodeStore();
const { selectedNode, nodeIds } = storeToRefs(nodeStore)
const mag = ref(true)

const accelData = ref({
    t: [0],
    x: [0],
    y: [0],
    z: [0]
})
const gyroData = ref({
    t: [0],
    x: [0],
    y: [0],
    z: [0]
})
const magnData = ref({
    t: [0],
    x: [0],
    y: [0],
    z: [0]
})

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

const resetData = (data) => {
    data.value.t.length = 0
    data.value.x.length = 0
    data.value.y.length = 0
    data.value.z.length = 0

    data.value.t.push(0)
    data.value.x.push(0)
    data.value.y.push(0)
    data.value.z.push(0)
}

const hide = () => {
    mag.value = !mag.value
}

const handleNodeChange = (newNode, oldNode) => {
    if (oldNode !== "") {
        // Disconnect from the old socket
        socket.disconnect();
        resetData(accelData);
        resetData(gyroData);
        resetData(magnData);
    }

    // Create a new socket connection
    socket = io.connect("http://200.13.4.208:8082");

    // Other socket setup, like your event listeners, should be repeated here
    socket.on("connect", () => {
        console.log("CONNECTED");
        socket.emit("realtime", { node: newNode });  // Use the newNode value
    });

    socket.on('newdata', (data) => {
        let measure = {
            x: data.acc_x,
            y: data.acc_y,
            z: data.acc_z
        }
        addMeasure(accelData, measure);
        measure = {
            x: data.gyr_x,
            y: data.gyr_y,
            z: data.gyr_z
        }
        addMeasure(gyroData, measure)
    });
};

watch(selectedNode, handleNodeChange);


// Ensure to disconnect from the socket when the component is unmounted
onUnmounted(() => {
    if (socket) {
        socket.disconnect();
    }
    console.log("UNMOUNTED")
});
</script>
  