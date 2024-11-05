<template>
    <div class="container my-3">
        <div v-for="(measure, index) in measures" :key="index" :class="'row pa-5 ' + (index % 2 ? 'even-row' : 'odd-row')">
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
                            <div class="col">
                                <p>Duration: {{ selectedMeasure.duration }} seconds</p>
                                <p>Vectors: {{ selectedMeasure.vectors }}</p>
                            </div>
                            <div class="col">
                                <p>Duration: {{ selectedMeasure.duration }} seconds</p>
                                <p>Vectors: {{ selectedMeasure.vectors }}</p>
                            </div>

                            <div class="col">
                                <p>Duration: {{ selectedMeasure.duration }} seconds</p>
                                <p>Vectors: {{ selectedMeasure.vectors }}</p>
                            </div>
                            <div class="col">
                                <p>Duration: {{ selectedMeasure.duration }} seconds</p>
                                <p>Vectors: {{ selectedMeasure.vectors }}</p>
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
export default {
    props: ["jobrunid"],
    data() {
        return {
            measures: [],
            nodeStore: useNodeStore(),
            selectedMeasure: {}
        };
    },
    methods: {
        viewMeasure(index) {
            this.selectedMeasure = this.measures[index];
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