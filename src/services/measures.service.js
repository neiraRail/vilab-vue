// jobs.service.js
import axios from 'axios';

const apiUrl = "http://localhost:8080/measure";

const measuresService = {
  async fetchMeasures(jobrunid) {
    try {
      const response = await axios.get(`${apiUrl}/${jobrunid}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener las measures:", error);
      throw error;
    }
  },
  async fetchData(nodo, si, so){
    try {
      const response = await axios.get(`${apiUrl}/data/${nodo}?si=${si}&so=${so}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener la data:", error);
      throw error;
    }
  }
};

export default measuresService;
