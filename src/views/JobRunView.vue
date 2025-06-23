<template>
    <div class="container">
        <div class="row my-3">
            <h5 class="font-weight-bold">Job {{ jobid }} /</h5> <h4 class="font-weight-bold"> Jobrun {{ jobrunid }}</h4>
        </div>
        <div class="row">
            <job-run-timeline :jobrunid="jobrunid"></job-run-timeline>
        </div>
        <button class="btn btn-primary scroll-bottom-btn" @click="scrollToBottom">
            Ir al final
        </button>
    </div>
</template>
<script>
import JobRunTimeline from "@/views/components/JobRunTimeline.vue";
export default {
    props: ['jobid', 'jobrunid'],

    components: { JobRunTimeline },
    methods: {
        scrollToBottom() {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
    }
}
</script>
<style scoped>
.scroll-bottom-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
}
</style>