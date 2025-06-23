<template>
  <div class="container">
    <div class="row my-3">
      <div class="col">
        <button class="btn btn-primary" @click="createJob">Crear Nuevo Job</button>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <table class="table table-bordered table-striped">
          <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Nodo</th>
            <th>Mediciones</th>
            <th>Tiempo (s)</th>
            <th>Retraso (s)</th>
            <th>AI Monitoreo</th>
            <th>AI Aprendizaje</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
          </thead>
          <tbody>
          <tr
            v-for="job in jobs"
            :key="job._id"
            :class="{'table-success': job.a === 1}"
            @click="viewJob(job)"
          >
            <td>{{ job._id }}</td>
            <td>{{ job.n }}</td>
            <td>{{ job.nm }}</td>
            <td>{{ job.t }}</td>
            <td>{{ job.d }}</td>
            <td>{{ job['ai-monitoreo'] }}</td>
            <td>{{ job['ai-aprendizaje'] }}</td>
            <td>{{ job.a === 1 ? 'Activo' : 'Inactivo' }}</td>
            <td>
              <button v-if="job.a===0" class="btn btn-success btn-sm me-2" @click="startJob(job._id)">Iniciar</button>
              <button v-else class="btn btn-danger btn-sm me-2" @click="stopJob(job._id)">Detener</button>
              <button class="btn btn-info btn-sm me-2" @click="editJob(job)">Editar</button>
              <button class="btn btn-warning btn-sm" @click="deleteJob(job._id)">Eliminar</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal para crear o editar job -->
    <div class="modal fade" id="jobModal" tabindex="-1" aria-labelledby="jobModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="jobModalLabel">{{ editingJob ? 'Editar Job' : 'Crear Job' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label for="nodoInput" class="form-label">Nodo</label>
                <input type="number" class="form-control" v-model="jobData.n" id="nodoInput" />
              </div>
              <div class="mb-3">
                <label for="medicionesInput" class="form-label">Número de Mediciones</label>
                <input type="number" class="form-control" v-model="jobData.nm" id="medicionesInput" />
              </div>
              <div class="mb-3">
                <label for="tiempoInput" class="form-label">Tiempo de Mediciones (s)</label>
                <input type="number" class="form-control" v-model="jobData.t" id="tiempoInput" />
              </div>
              <div class="mb-3">
                <label for="retrasoInput" class="form-label">Retraso entre Mediciones (s)</label>
                <input type="number" class="form-control" v-model="jobData.d" id="retrasoInput" />
              </div>
              <div class="mb-3">
                <label for="aimInput" class="form-label">AI Monitoreo</label>
                <input type="number" class="form-control" v-model="jobData['ai-monitoreo']" id="aimInput" />
              </div>
              <div>
                <label for="aiaInput" class="form-label">AI Aprendizaje</label>
                <input type="number" class="form-control" v-model="jobData['ai-aprendizaje']" id="aiaInput" />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" @click="saveJob">Guardar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import jobService from "@/services/jobs.service"; // Importa el servicio
import { useNodeStore } from '@/stores/nodeStore.js'
export default {
  data() {
    return {
      jobs: [],
      editingJob: false,
      jobData: {
        n: "",
        nm: "",
        t: "",
        d: "",
        a: 0,
        'ai-monitoreo': 0,
        'ai-aprendizaje': 0
      },
      nodeStore: useNodeStore()
    };
  },
  methods: {
    async fetchJobs() {
      try {
        this.jobs = await jobService.fetchJobs();
      } catch (error) {
        console.error("Error al obtener los jobs:", error);
      }
    },
    createJob() {
      this.jobData = { n: "", nm: "", t: "", d: "", 'ai-monitoreo': 0, 'ai-aprendizaje': 0 };
      this.editingJob = false;
      new bootstrap.Modal(document.getElementById('jobModal')).show();
    },
    editJob(job) {
      this.jobData = { ...job };
      this.editingJob = true;
      new bootstrap.Modal(document.getElementById('jobModal')).show();
    },
    viewJob(job) {
      this.$router.push({ name: 'JobView', params: { jobid: job._id } });
    },
    async saveJob() {
      try {
        if (this.editingJob) {
          await jobService.updateJob(this.jobData._id, this.jobData);
        } else {
          await jobService.createJob(this.jobData);
        }
        this.fetchJobs();
        bootstrap.Modal.getInstance(document.getElementById('jobModal')).hide();
      } catch (error) {
        console.error("Error al guardar el job:", error);
      }
    },
    async deleteJob(id) {
      try {
        await jobService.deleteJob(id);
        this.fetchJobs();
      } catch (error) {
        console.error("Error al eliminar el job:", error);
      }
    },
    async startJob(id) {
      try {
        await jobService.startJob(id);
        this.fetchJobs();
        // setTimeout(() => {
        //   console.log("Fetching again...")
        //   this.fetchJobs();
        // }, 33000)
      } catch (error) {
        console.error("Error al iniciar el job:", error);
      }
    },
    async stopJob(id) {
      try {
        await jobService.stopJob(id);
        this.fetchJobs();
      } catch (error) {
        console.error("Error al detener el job:", error);
      }
    }
  },
  mounted() {
    this.nodeStore.isLoading = true;
    this.fetchJobs().then(() => {
      this.nodeStore.isLoading = false;
    });
  }
};
</script>

<style>
.me-2 {
  margin-right: 0.5rem;
}
.table-bordered {
  border: 2px solid #dee2e6;
}
.table-success {
  background-color: #d4edda !important;
}
</style>
