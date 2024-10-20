<template>
    <div>
        <v-container>
            <v-row>
                <v-col cols="2">
                    <v-combobox v-model="selectedStart" :items="[133,140]" variant="solo" density="compact"
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
import { onUnmounted } from "vue";
import lecturaService from '@/services/lectura.service';

const nodeStore = useNodeStore();
const mag = ref(true)
const { selectedNode } = storeToRefs(nodeStore)
const selectedStart = ref("")

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


const handleStartChange = async (newStart, oldStart) => {
    if (oldStart !== "") {
        // Disconnect from the old socket
        resetData(accelData);
        resetData(gyroData);
        resetData(magnData);
    }

    // Create a new socket connection

    // Other socket setup, like your event listeners, should be repeated here

    let count = 0;
    let times = 3;

    let nextDataPromise = lecturaService.getLecturasFromNodeStartPaginated(selectedNode.value, newStart, times, 200);

    while (count || times === 3) {
        let data = (await nextDataPromise).data;

        console.log(data.length);

        count = data.length;
        times += 1;

        if (data.length == 0) return;

        // Lanzar la solicitud para el próximo lote de datos
        nextDataPromise = lecturaService.getLecturasFromNodeStartPaginated(selectedNode.value, newStart, times, 200);

        let measure = {};
        let realTime = performance.now();
        let idealTime = realTime;

        for (let i = 0; i < data.length; i++) {
            let graficarTime = performance.now();
            measure = {
                 tm: data[i].tm,
                 x: data[i].ax,
                 y: data[i].ay,
                 z: data[i].az
            };
            addMeasure(accelData, measure);
            measure = {
                tm: data[i].tm,
                x: data[i].gx,
                y: data[i].gy,
                z: data[i].gz
            };
            addMeasure(gyroData, measure);
            graficarTime = performance.now() - graficarTime;

            const remainingTime = idealTime + (data[i].dt / 1000) - realTime + graficarTime;

            if (remainingTime > 0) {
                await new Promise(resolve => setTimeout(resolve, remainingTime));
            }

            // Actualizar los temporizadores real e ideal
            idealTime = idealTime + (data[i].dt / 1000);
            realTime = performance.now();
        } // for loop
    } // while loop

    console.log("FINISHED")

};

watch(selectedStart, handleStartChange);


// Ensure to disconnect from the socket when the component is unmounted
onUnmounted(() => {
    console.log("UNMOUNTED")
});
</script>
  