<template>

  <jobs-table></jobs-table>
</template>
<script>

import {defineComponent} from "vue";
import JobsTable from "@/views/components/JobsTable.vue";

export default defineComponent({
  components: {JobsTable}
})
</script>
