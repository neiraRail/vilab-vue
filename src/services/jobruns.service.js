// jobs.service.js
import axios from 'axios';

const apiUrl = "http://localhost:8080/jobrun";

const jobrunService = {
  async fetchJobruns(id) {
    try {
      const response = await axios.get(`${apiUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener los jobruns:", error);
      throw error;
    }
  },
  async deleteJobrun(id) {
    try {
      const response = await axios.delete(`${apiUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar el jobrun:", error);
      throw error;
    }
  }
};

export default jobrunService;
