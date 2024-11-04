<template>
    <div class="container my-3">
        <div v-for="(measure, index) in measures" :key="index" class="row">
            <div class="col">
                <div class="card mb-4">
                    <div class="card-body">
                        <h6 class="card-subtitle text-muted">measure {{ measure._id }}</h6>
                        <div class="empty-space" style="height: 100px; border: 1px dashed #aaa; margin: 15px 0;">
                            empty space for now
                        </div>
                    </div>
                </div>
                <div v-if="index != measures.length-1" class="vertical-space d-flex justify-content-center">
                    <div class="vertical-line"></div>
                </div>
            </div>
            <div class="col">
                <div><strong>{{ measure.duration }}</strong> segundos</div>
                <div><strong>{{ measure.vectors }}</strong> vectores</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            interval: 292,
            measures: [
                { _id: "67186ff2962093cf0de1a1f1", duration: 8, vectors: 796 },
                { _id: "6718706a962093cf0de1a1f4", duration: 8, vectors: 800 },
                { _id: "6718706a962093cf0de1a1f4", duration: 8, vectors: 800 },
            ]
        };
    },
    mounted() {
        // fetch original measures
        // if measures have 'si' and 'so' not null, fetch data of each measure
        // calculte duration and vectors
        // build this.measures list
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
    margin-bottom: 20px;
}
</style>