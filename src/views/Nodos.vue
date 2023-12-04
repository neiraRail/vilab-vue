<template>
    <div class="bg-deep-purple-lighten-4" style="height:100%;">
        <v-container>
            <v-row justify="end">
                <v-col class="d-flex" cols="4">
                    <v-spacer/>
                    <v-dialog v-model="dialogEditar" persistent width="1024">
                        <template v-slot:activator="{ props }">
                            <v-btn class="mr-3" color="deep-purple-accent-4" v-bind="props">Editar</v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="text-h5">Editar nodo</span>
                            </v-card-title>
                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col>
                                            <v-combobox :items="nodeStore.nodes" item-title="node" label="Escoge un nodo"
                                                item-value="node" v-model="nodeToEdit"
                                                @update:model-value="buscarConfig"></v-combobox>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12">
                                            <v-textarea label="Ingresa el Json" required v-model="jsonToEdit"
                                                :disabled="nodeToEdit === ''" auto-grow></v-textarea>
                                        </v-col>
                                    </v-row>
                                    <v-alert v-if="dialogErrorMessage" :v-model="dialogErrorMessage != ''" border="start"
                                        variant="tonal" closable close-label="Close Alert" color="deep-purple-accent-4"
                                        title="Error">
                                        {{ dialogErrorMessage }}
                                    </v-alert>
                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn variant="text" @click="cerrarDialog('editar')">
                                    Cerrar
                                </v-btn>
                                <v-btn variant="text" @click="editarNodo">
                                    Enviar
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="dialogEliminar" persistent width="1024">
                        <template v-slot:activator="{ props }">
                            <v-btn color="deep-purple-darken-2" v-bind="props">Eliminar</v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="text-h5">Eliminar nodo</span>
                            </v-card-title>
                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col>
                                            <v-combobox :items="nodeStore.nodes" item-title="node" label="Escoge un nodo"
                                                item-value="node" v-model="nodeToDelete" :return-object="false"></v-combobox>
                                        </v-col>
                                    </v-row>
                                    <v-alert v-if="dialogErrorMessage" :v-model="dialogErrorMessage != ''" border="start"
                                        variant="tonal" closable close-label="Close Alert" color="deep-purple-accent-4"
                                        title="Error">
                                        {{ dialogErrorMessage }}
                                    </v-alert>
                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn variant="text" @click="cerrarDialog('eliminar')">
                                    Cerrar
                                </v-btn>
                                <v-btn variant="text" @click="eliminarNodo">
                                    Eliminar
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-col>
                <v-divider vertical></v-divider>
                <v-col class="d-flex" cols="2">
                    <v-spacer />
                    <v-dialog v-model="dialogCrear" persistent width="1024">
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props">
                                Nuevo nodo
                            </v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="text-h5">Crear Nodo</span>
                            </v-card-title>
                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12">
                                            <v-textarea label="Ingresa el Json" required v-model="nuevoJson"
                                                auto-grow></v-textarea>
                                        </v-col>
                                    </v-row>
                                    <v-alert v-if="dialogErrorMessage" :v-model="dialogErrorMessage != ''" border="start"
                                        variant="tonal" closable close-label="Close Alert" color="deep-purple-accent-4"
                                        title="Error">
                                        {{ dialogErrorMessage }}
                                    </v-alert>
                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn variant="text" @click="cerrarDialog('crear')">
                                    Cerrar
                                </v-btn>
                                <v-btn variant="text" @click="crearNodo">
                                    Enviar
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-col>
            </v-row>
            <v-row justify="center">
                <v-col>
                    <v-data-table items-per-page="-1" :headers="headers" :items-length="nodeStore.nodes.length"
                        :items="nodeStore.nodes" :loading="nodeStore.isLoading" :search="search" class="elevation-1"
                        item-value="name" hover>

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
                </v-col>
            </v-row>
        </v-container>


    </div>
</template>

<script setup>
import { VDataTable } from 'vuetify/labs/VDataTable'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNodeStore } from '@/stores/nodeStore.js'
import service from '@/services/nodo.service';

const nodeStore = useNodeStore();
const router = useRouter()

const headers = ref([
    { title: 'Detalle', align: 'start', sortable: false, key: 'detail' },
    { title: 'Nodo', key: 'node', align: 'end' },
    { title: 'Lectura', key: 'time_sensor', align: 'end' },
    { title: 'Actualización', key: 'time_update', align: 'end' },
    { title: 'Reinicio', key: 'time_reset', align: 'end' },
    { title: 'Activo', key: 'active', align: 'end' }
])  
const search = ref('')
const loading = ref(true)
const dialogCrear = ref(false)
const dialogEditar = ref(false)
const dialogEliminar = ref(false)
const nuevoJson = ref('{\n\t"active": 0,\n\t"batch_size": 0,\n\t"detail": "",\n\t"node": ,\n\t"operaciones": [],\n\t"password": "",\n\t"protocol": "udp",\n\t"rest_server": "http://200.13.4.208:8080",\n\t"send_mode": "stream",\n\t"ssid": "",\n\t"start": 0,\n\t"time_reset": 24,\n\t"time_sensor": 100,\n\t"time_update": 10\n}')
const jsonToEdit = ref("")
const dialogErrorMessage = ref("")
const nodeToEdit = ref("")
const nodeToDelete = ref("")
// Funciones

function goToConfig(node) {
    nodeStore.setSelectedNode(node)
    router.push({
        path: "Detalle/"+node
    })
}

function buscarConfig(node) {
    console.log(nodeToEdit.value.node)
    jsonToEdit.value = JSON.stringify(node, null, "\t")
}

function goToLiveData(node) {
    nodeStore.setSelectedNode(node)
    router.push({
        name: "LiveData"
    })
}

function cerrarDialog(dialog) {
    if (dialog == "crear") {
        dialogCrear.value = false
    }
    else if (dialog == "editar") {
        dialogEditar.value = false
        jsonToEdit.value = ""
        nodeToEdit.value = ""
    }
    else if (dialog == "eliminar"){
        dialogEliminar.value = false
        nodeToDelete.value = ""
    }
    dialogErrorMessage.value = ""

}

function crearNodo() {
    let parsedData = ""
    try {
        parsedData = JSON.parse(nuevoJson.value);
    } catch (error) {
        dialogErrorMessage.value = "Hay un error al parsear el json"
        return
    }
    service.create(parsedData).then((response) => {
        console.log(response.data)
        dialogCrear.value = false
        nodeStore.fetchNodes();
    }).catch((error) => {
        console.log(error.response.data.razon)
        const propertyName = Object.keys(error.response.data.razon)[0];
        const propertyValue = error.response.data.razon[propertyName];

        dialogErrorMessage.value = `Error en ${propertyName}: ${propertyValue}`
    });
}

function editarNodo() {
    let parsedData
    try {
        parsedData = JSON.parse(jsonToEdit.value);
    } catch (error) {
        dialogErrorMessage.value = "Hay un error al parsear el json"
        return
    }
    service.update(parsedData.node, parsedData).then((response) => {
        console.log(response.data)
        dialogEditar.value = false
        nodeStore.fetchNodes();
    }).catch((error) => {
        console.log(error.response.data.razon)
        const propertyName = Object.keys(error.response.data.razon)[0];
        const propertyValue = error.response.data.razon[propertyName];

        dialogErrorMessage.value = `Error en ${propertyName}: ${propertyValue}`
    })
}

function eliminarNodo(){
    service.destroy(nodeToDelete.value).then((response)=>{
        console.log(response.data)
        dialogEliminar.value = false
        nodeStore.fetchNodes();
    }).catch((error)=>{
        console.log(error.response.data)
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