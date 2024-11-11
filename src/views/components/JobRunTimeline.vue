<template>
    <div class="container my-3">
        <div v-for="(measure, index) in measures" :key="index"
            :class="'row pa-5 ' + (index % 2 ? 'even-row' : 'odd-row')">
            <div class="col-auto d-flex align-items-start mt-10">
                <h5>{{ index }}</h5>
            </div>
            <div class="col">
                <div :class="'card mb-4 ' + (measure.vectors ? 'hover-effect' : 'blocked')" @click="viewMeasure(index)">
                    <div class="card-body">
                        <h6 class="card-subtitle text-muted">measure {{ measure._id }}</h6>
                        <div class="empty-space" style="height: 100px; border: 1px dashed #aaa; margin: 15px 0;">
                        </div>
                    </div>
                </div>
                <div v-if="index != measures.length - 1" class="vertical-space d-flex justify-content-center">
                    <div class="vertical-line"></div>
                </div>
            </div>
            <div class="col">
                <div><strong>{{ measure.duration }}</strong> segundos</div>
                <div><strong>{{ measure.vectors }}</strong> vectores</div>
            </div>
        </div>
    </div>

    <!-- Modal para crear o editar job -->

    <div class="modal fade" id="measureModal" tabindex="-1" aria-labelledby="measureModal" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="measureModalLabel">Measure {{ selectedMeasure._id }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="container">
                        <div class="row">
                            <div class="col-9">
                                <div class="row pa-5">
                                    <div class="col">
                                        <real-time-chart :data="selectedMeasure.accelData"
                                            height="330"></real-time-chart>
                                    </div>
                                </div>
                                <div class="row pa-5">
                                    <div class="col">
                                        <real-time-chart :data="selectedMeasure.gyroData"
                                            height="330"></real-time-chart>
                                    </div>
                                </div>
                            </div>
                            <div class="col-3">
                                <div class="row">
                                    <h5>Información sobre la measure</h5>
                                    <div class="d-flex flex-column align-items-center pt-15 text-muted">
                                        <i class="information-off-outline" style="font-size: 2rem;"></i>
                                        <svg-icon type="mdi" :path="path"></svg-icon>
                                        <p class="text-center mt-2">No hay análisis disponible para estos datos.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useNodeStore } from "@/stores/nodeStore.js";
import measuresService from "@/services/measures.service.js";
import RealTimeChart from '@/views/RealTimeChart.vue';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiInformationOffOutline } from '@mdi/js';
export default {
    props: ["jobrunid"],
    components: {
        RealTimeChart,
        SvgIcon,
    },
    data() {
        return {
            path: mdiInformationOffOutline,
            measures: [],
            nodeStore: useNodeStore(),
            selectedMeasure: {
                _id: "",
                accelData: {
                    t: [],
                    x: [],
                    y: [],
                    z: [],
                },
                gyroData: {
                    t: [],
                    x: [],
                    y: [],
                    z: [],
                },
            },

        };
    },
    methods: {
        viewMeasure(index) {
            // Se debe cambiar la data para los gráficos sin que se pierda la referencia, 
            // por eso solo se pueden usar métodos de mutación de los arrays como push, pop, shift, etc.

            // clear previous data, method by https://stackoverflow.com/questions/1232040/how-do-i-empty-an-array-in-javascript
            this.selectedMeasure.accelData.t.length = 0;
            this.selectedMeasure.accelData.x.length = 0;
            this.selectedMeasure.accelData.y.length = 0;
            this.selectedMeasure.accelData.z.length = 0;

            this.selectedMeasure.gyroData.t.length = 0;
            this.selectedMeasure.gyroData.x.length = 0;
            this.selectedMeasure.gyroData.y.length = 0;
            this.selectedMeasure.gyroData.z.length = 0;

            // set the new data
            this.selectedMeasure._id = this.measures[index]._id;

            let t = Array.from({ length: this.measures[index].vectors }, (_, i) => i + 1);
            let x = this.measures[index].data.map((v) => v.ax);
            let y = this.measures[index].data.map((v) => v.ay);
            let z = this.measures[index].data.map((v) => v.az);

            this.selectedMeasure.accelData.t.push(...t);
            this.selectedMeasure.accelData.x.push(...x);
            this.selectedMeasure.accelData.y.push(...y);
            this.selectedMeasure.accelData.z.push(...z);

            let gx = this.measures[index].data.map((v) => v.gx);
            let gy = this.measures[index].data.map((v) => v.gy);
            let gz = this.measures[index].data.map((v) => v.gz);

            this.selectedMeasure.gyroData.t.push(...t);
            this.selectedMeasure.gyroData.x.push(...gx);
            this.selectedMeasure.gyroData.y.push(...gy);
            this.selectedMeasure.gyroData.z.push(...gz);

            new bootstrap.Modal(document.getElementById('measureModal')).show();
        },
    },
    async mounted() {
        // while doing all the fetching and processing, show a loading bar
        this.nodeStore.isLoading = true;
        // fetch original measures
        let measures = await measuresService.fetchMeasures(this.jobrunid);
        for (let i = 0; i < measures.length; i++) {
            if (measures[i].si && measures[i].so) {
                // fetch data of each measure
                let data = await measuresService.fetchData(measures[i].n, measures[i].si, measures[i].so);

                // duration is the difference between the last and first timestamp
                if (data.length > 2) {
                    measures[i].vectors = data.length - 2;
                    let first = data[0].timestamp;
                    let last = data[data.length - 1].timestamp;
                    measures[i].duration = (last - first).toFixed(3);
                } else {
                    measures[i].vectors = 0;
                    measures[i].duration = 0;
                }
                measures[i].data = data.slice(1, data.length - 1);
            }
        }
        this.measures = measures;
        this.nodeStore.isLoading = false;
    },
};
</script>

<style scoped>
.empty-space {
    background-color: #f9f9f9;
    display: flex;
    align-items: center;
    justify-content: center;
}

.separator {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
}

.vertical-line {
    height: 100px;
    width: 2px;
    background-color: #bbb;
}

.hover-effect {
    transition: transform 0.3s, box-shadow 0.3s;
    cursor: pointer;
}

.hover-effect:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.blocked {
    pointer-events: none;
    opacity: 0.7;
}

.modal-dialog {
    max-width: 80%;
}
</style>