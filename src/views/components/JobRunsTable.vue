<template>
    <div class="row">
      <div class="col">
        <table class="table table-bordered table-striped">
          <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Nodo</th>
            <th>Mediciones</th>
            <th>Tiempo (s)</th>
            <th>Retraso (s)</th>
            <th>Acciones</th>
          </tr>
          </thead>
          <tbody>
          <tr
            v-for="jobrun in jobruns"
            :key="jobrun._id"
            @click="viewJobrun(jobrun)"
          >
            <td>{{ jobrun._id }}</td>
            <td>{{ new Date(jobrun.dt * 1000).toLocaleString() }}</td>
            <td>{{ jobrun.n }}</td>
            <td>{{ jobrun.nm }}</td>
            <td>{{ jobrun.t }}</td>
            <td>{{ jobrun.d }}</td>
            <td>
              <button class="btn btn-warning btn-sm" @click.stop="deleteJobrun(jobrun._id)">Eliminar</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
</template>
<script>
import jobrunService from "@/services/jobruns.service"; // Importa el servicio
import { useNodeStore } from '@/stores/nodeStore.js'
export default {
  data() {
    return {
      jobruns: [],
      nodeStore: useNodeStore()
    };
  },
  props: ["jobid"],
  methods: {
    async fetchJobruns(jobid) {
      try {
        this.jobruns = await jobrunService.fetchJobruns(jobid);
      } catch (error) {
        console.error("Error al obtener los jobruns:", error);
      }
    },

    async deleteJobrun(id) {
      try {
        await jobrunService.deleteJobrun(id);
        this.fetchJobruns(this.jobid);
      } catch (error) {
        console.error("Error al eliminar el jobrun:", error);
      }
    },

    viewJobrun(jobrun){
      this.$router.push({ name: 'JobRunView', params: { jobid: jobrun.j, jobrunid: jobrun._id } });
    }
  },
  mounted() {
    this.nodeStore.isLoading = true;
    this.fetchJobruns(this.jobid).then(() => {
      this.nodeStore.isLoading = false;
    });
  }
}
</script>
<style>
.me-2 {
  margin-right: 0.5rem;
}
.table-bordered {
  border: 2px solid #dee2e6;
}
</style>