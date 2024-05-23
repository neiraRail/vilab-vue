import ApiService from "@/services/api.service";
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
};
export default service;