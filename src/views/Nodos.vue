<template>
    <v-data-table items-per-page="-1" :headers="headers" :items-length="nodeStore.nodes.length" :items="nodeStore.nodes"
        :loading="nodeStore.nodes.length<=0" :search="search" class="elevation-1" item-value="name" hover>

        <template v-slot:item.active="{ item }">
            <div class="other">
                <span :class="[item.active ? 'dot green' : 'dot red']"></span>
            </div>
            <div class="actionButtons">
                <v-btn icon="mdi-poll" @click="goToLiveData(item.node)" class="mx-2"></v-btn>
                <v-btn icon="mdi-cog" @click="goToConfig(item.node)" dense></v-btn>
            </div>
        </template>

    </v-data-table>
</template>

<script setup>
import { VDataTable } from 'vuetify/labs/VDataTable'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNodeStore } from '@/stores/nodeStore.js'

const nodeStore = useNodeStore();

const router = useRouter()

const headers = ref([
    { title: 'Detalle', align: 'start', sortable: false, key: 'detail' },
    { title: 'Nodo', key: 'node', align: 'end' },
    { title: 'Lectura', key: 'delay_sensor', align: 'end' },
    { title: 'Actualización', key: 'delay_update', align: 'end' },
    { title: 'Reinicio', key: 'time_reset', align: 'end' },
    { title: 'Activo', key: 'active', align: 'end' }
])
const search = ref('')
const loading = ref(true)

// Load items function

function goToConfig() {

}

function goToLiveData(node) {
    nodeStore.setSelectedNode(node)
    router.push({ 
        name: "LiveData"
    })
}
</script>

<style>
.dot {
    height: 10px;
    width: 10px;
    border-radius: 50%;
    display: inline-block;
}

.red {
    background-color: red;
}

.green {
    background-color: green;
}

tr .actionButtons {
    display: none;
}

tr:hover .actionButtons {
    display: contents;
}

tr:hover .other {
    display: none;
}
</style>