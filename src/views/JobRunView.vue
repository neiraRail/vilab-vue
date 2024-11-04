<template>
    <div class="container">
        <div class="row my-3">
            <h5 class="font-weight-bold">Job {{ jobid }} /</h5> <h4 class="font-weight-bold"> Jobrun {{ jobrunid }}</h4>
        </div>
        <div class="row">
            <job-run-timeline :jobrunid="jobrunid"></job-run-timeline>
        </div>
    </div>
</template>
<script>
import JobRunTimeline from "@/views/components/JobRunTimeline.vue";
export default {
    props: ['jobid', 'jobrunid'],

    components: { JobRunTimeline }
}
</script>