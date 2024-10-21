// jobs.service.js
import axios from 'axios';

const apiUrl = "http://localhost:5000/job";

const jobService = {
  async fetchJobs() {
    try {
      const response = await axios.get(apiUrl);
      return response.data;
    } catch (error) {
      console.error("Error al obtener los jobs:", error);
      throw error;
    }
  },
  async createJob(jobData) {
    try {
      const response = await axios.post(apiUrl, jobData);
      return response.data;
    } catch (error) {
      console.error("Error al crear el job:", error);
      throw error;
    }
  },
  async updateJob(id, jobData) {
    try {
      const response = await axios.put(`${apiUrl}/${id}`, jobData);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar el job:", error);
      throw error;
    }
  },
  async deleteJob(id) {
    try {
      const response = await axios.delete(`${apiUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar el job:", error);
      throw error;
    }
  },
  async startJob(id) {
    try {
      const response = await axios.post(`${apiUrl}/run/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al iniciar el job:", error);
      throw error;
    }
  },
  async stopJob(id) {
    try {
      const response = await axios.post(`${apiUrl}/stop/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al detener el job:", error);
      throw error;
    }
  }
};

export default jobService;
