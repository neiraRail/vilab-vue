<template>
    <div class="container">
        <div class="row my-3">
            <h4 class="font-weight-bold">Job {{ jobid }}</h4>
        </div>
        <div class="row">
            <job-runs-table :jobid="jobid"></job-runs-table>
        </div>
    </div>
</template>
<script>
import JobRunsTable from "@/views/components/JobRunsTable.vue";
export default {
    props: ['jobid'],
    components: { JobRunsTable }
}
</script>