import axios from "axios";

const API_URL = "http://129.151.100.69:8080";
var swisApi = axios.create({ baseURL: API_URL });

const apiService = {
  setHeader() {
    var token = localStorage.getItem('jwt');
    swisApi.defaults.headers.common["Authorization"]
      = `Bearer ${token}`;
  },
  post(route, { params = " ", slug = "" }) {
    //this.setHeader();
    return swisApi.post(`${route}/${slug}`, params).catch(error => {
      console.log(error)
      throw new Error(error.response.data.razon);
    });
  },
  update(route, { params = " ", slug = "" }) {
    //this.setHeader();
    return swisApi.put(`${route}/${slug}`, params).catch(error => {
      throw new Error(`ApiService Error: ${error}`);
    });
  },
  get(route, { id = "" }) {
    //this.setHeader();
    return swisApi.get(`${route}/${id}`).catch(error => {
      throw new Error(`ApiService Error: ${error}`);
    });
  },
  delete(route, { id = "", params = "" }) {
    //this.setHeader();
    return swisApi.delete(`${route}/${id}`, { data: params }).catch(error => {
      throw new Error(error.response.data.message);
    });
  }
}
export default apiService;