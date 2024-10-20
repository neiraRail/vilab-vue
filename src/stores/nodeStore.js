// nodeStore.js

import { defineStore } from 'pinia';
import nodoService from '@/services/nodo.service'

export const useNodeStore = defineStore({
    // unique id of the store across your application
    id: 'nodeStore',

    state: () => ({
        nodes: [],
        selectedNode: "",
        isLoading: true
    }),

    getters: {
        nodeIds: (state) => {
            const ids = state.nodes.map(node => node.n)
            ids.push(2)
            return ids
        }
    },

    actions: {
        async fetchNodes() {
            this.isLoading = true
            const { data } = await nodoService.getAll(); // Make sure to import nodoService at the top
            this.setNodes(data);
            console.log(data)
            if(data) this.isLoading = false
        },

        setNodes(nodeData) {
            this.nodes = nodeData;
        },

        getNodeById(nodeId) {
            return this.nodes.find(node => node.id === nodeId);
        },
        
        setSelectedNode(nodeId) {
            this.selectedNode = nodeId
        }

    }
});
