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
                        <real-time-chart :data="gyroData" height="330"></real-time-chart>
                    </v-col>
                    <v-col  v-if="mag">
                        <real-time-chart :data="magnData" height="330"></real-time-chart>
                    </v-col>
                    <!-- Other columns/cards can go here -->
                </v-row>
                <v-row>
                    <v-col>
                        <real-time-chart :data="accelData" height="330"></real-time-chart>
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
import LiveChart from './LiveChart.vue';
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
    if (data.value.t.length > 500) {
        data.value.t.shift()
        data.value.x.shift()
        data.value.y.shift()
        data.value.z.shift()
    }
    data.value.t.push(measure.tm) // el t podria ser el timestamp de alguna manera normalizado.
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
    // socket = io.connect("http://200.13.4.208:8082");
    socket = io.connect("http://localhost:8082");

    // Other socket setup, like your event listeners, should be repeated here
    socket.on("connect", () => {
        console.log("CONNECTED");
        console.log(newNode);
        socket.emit("realtime", { node: newNode });  // Use the newNode value
    });

    socket.on('realtime', async (data) => {
        console.log(data.length);
        if(data.length == 0) return;
        let measure = {}

        let realTime = performance.now();
        let idealTime = realTime;

        for(let i = 0; i < data.length; i++){
            let graficarTime = performance.now()
            measure = {
                tm: data[i].tm,
                x: data[i].ax,
                y: data[i].ay,
                z: data[i].az
            }
            addMeasure(accelData, measure);
            measure = {
                tm: data[i].tm,
                x: data[i].gx,
                y: data[i].gy,
                z: data[i].gz
            }
            addMeasure(gyroData, measure)
            graficarTime = performance.now() - graficarTime;

            const remainingTime = idealTime + (data[i].dt / 1000) - realTime + graficarTime;

            if (remainingTime > 0) {
                await new Promise(resolve => setTimeout(resolve, remainingTime));
            }
            
            //Update real and ideal timers
            idealTime = idealTime + (data[i].dt / 1000);
            realTime = performance.now()

            // console.log(idealTime-realTime)
        } // for loop
        


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
  