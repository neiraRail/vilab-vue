import ApiService from "@/services/api.service";
import axios from 'axios';

const apiUrl = "http://localhost:8080/nodo";
const url = "nodo";
export const service = {
    getAll() {
        return ApiService.get(url, { id: "" });
    },
    get(id) {
        return id;
    },
    create(params) {
        return ApiService.post(url, { params: params });
    },
    update(id, params) {
        return ApiService.update(url, { slug: id, params: params });
    },
    destroy(id) {
        return ApiService.delete(url, { id: id });
    },
    async runNodo(id) {
        try {
          const response = await axios.post(`${apiUrl}/run/${id}`);
          return response.data;
        } catch (error) {
          console.error("Error al iniciar el nodo: ", error);
          throw error;
        }
    },
    async stopNodo(id) {
        try {
          const response = await axios.post(`${apiUrl}/stop/${id}`);
          return response.data;
        } catch (error) {
          console.error("Error al detener el nodo: ", error);
          throw error;
        }
    }
};
export default service;