import ApiService from "@/services/api.service";
const url = "lecturas";
export const service = {
    getLecturasFromNodeStartPaginated(node, start, page, size) {
        return ApiService.customGet(url, `node/${node}/start/${start}/pag/${page}/${size}`);
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