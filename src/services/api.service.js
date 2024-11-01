import axios from "axios";

// const API_URL = "http://200.13.4.208:8080";
const API_URL = "http://localhost:8080";
const swisApi = axios.create({baseURL: API_URL});

const apiService = {
  setHeader() {
    const token = localStorage.getItem('jwt');
    swisApi.defaults.headers.common["Authorization"]
      = `Bearer ${token}`;
  },
  post(route, { params = " ", slug = "" }) {
    //this.setHeader();
    return swisApi.post(`${route}/${slug}`, params).catch(error => {
      throw error;
    });
  },
  update(route, { params = " ", slug = "" }) {
    //this.setHeader();
    return swisApi.put(`${route}/${slug}`, params).catch(error => {
      throw error;
    });
  },
  get(route, { id = "" }) {
    //this.setHeader();
    return swisApi.get(`${route}${id!=""?"/":""}${id}`).catch(error => {
      throw new Error(`ApiService Error: ${error}`);
    });
  },
  customGet(route, customEnd){
    return swisApi.get(`${route}/${customEnd}`).catch(error => {
      throw new Error(`ApiService Error: ${error}`);
    });
  },
  delete(route, { id = "", params = "" }) {
    //this.setHeader();
    return swisApi.delete(`${route}/${id}`, { data: params }).catch(error => {
      throw error;
    });
  }
}
export default apiService;
