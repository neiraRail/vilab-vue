<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" md="4">
                <v-card>
                    <v-toolbar flat dense>
                        <v-toolbar-title>
                            <span class="text-subheading"
                                style="display: flex; justify-content: space-between; width: 90%;">
                                <h3>{{ node.detail }}</h3>
                                <p> #{{ node.node }} </p>
                            </span>
                        </v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-row v-for="(value, key) in node" :key="key" no-gutters>
                            <div style="display: flex; justify-content: space-between; width: 90%;" class="mt-1">
                                <h3 style="font-weight: bold;">{{ key }}</h3>
                                <p>{{ value }}</p>
                            </div>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-dialog v-model="dialogEditar" persistent width="1024">
                            <template v-slot:activator="{ props }">
                                <v-btn class="mr-3" color="deep-purple-accent-4" v-bind="props"
                                    @click="buscarConfig">Editar</v-btn>
                            </template>
                            <v-card>
                                <v-card-title>
                                    <span class="text-h5">Editar nodo</span>
                                </v-card-title>
                                <v-card-text>
                                    <v-container>
                                        <v-row>
                                            <v-col cols="12">
                                                <v-textarea label="Ingresa el Json" required v-model="jsonToEdit"
                                                    auto-grow></v-textarea>
                                            </v-col>
                                        </v-row>
                                        <v-alert v-if="dialogErrorMessage" :v-model="dialogErrorMessage != ''"
                                            border="start" variant="tonal" closable close-label="Close Alert"
                                            color="deep-purple-accent-4" title="Error">
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
                    </v-card-actions>
                </v-card>
                <v-card class="mt-5">
                    <v-card-actions>
                        <v-btn @click="goToAnterior" :disabled="!canGoBack">Anterior</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn @click="goToSiguiente" :disabled="!canGoNext">Siguiente</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
            <v-col cols="12" md="5">
                <v-card v-if="render">
                    <v-toolbar flat dense>
                        <v-toolbar-title>
                            <span class="text-subheading">
                                <h3>
                                    Configuración rápida
                                </h3>
                            </span>
                        </v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col class="pr-0 pl-0 text-center" cols="6">
                                    <h3>Activar y desactivar</h3>
                                    <!-- Center switch -->
                                    <v-card-text class="pa-0">
                                        <v-row class="mb-4">
                                            <v-spacer></v-spacer>
                                            <v-col class="text-center">
                                                <v-switch inset v-model="activeSwitch" flat color="green" @update:modelValue="toggleActivar"></v-switch>
                                            </v-col>
                                            <v-spacer></v-spacer>
                                        </v-row>
                                    </v-card-text>
                                </v-col>
                                <v-divider vertical></v-divider>
                                <v-col cols="6" class="text-center">
                                    <h3>Reiniciar</h3>
                                    <v-btn class="ma-5" color="red"> Reiniciar</v-btn>
                                </v-col>
                                <v-divider></v-divider>
                                <v-col class="pr-0 pl-0 text-center">
                                    <h3 style="justify-content: center;">Tiempo entre lecturas</h3>
                                    <v-slider v-model="time_sensor" track-color="grey" min="1" max="1000" :step="1">
                                        <template v-slot:prepend>
                                            <v-btn size="small" variant="text" icon="mdi-minus" @click="decrement"></v-btn>
                                        </template>
                                        <template v-slot:append>
                                            <v-btn size="small" variant="text" icon="mdi-plus" @click="increment"></v-btn>
                                        </template>
                                    </v-slider>
                                    <v-card-text class="pa-0">
                                        <v-row class="mb-4" justify="space-between">
                                            <v-col class="text-left">
                                                <span class="text-h4 font-weight-light" v-text="time_sensor"></span>
                                                <span class="subheading font-weight-light me-1">ms</span>
                                            </v-col>
                                            <v-col class="text-right">
                                                <v-btn theme="dark" icon elevation="0" @click="actualizarTimeSensor">
                                                    <v-icon size="large" icon='mdi-content-save'></v-icon>
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                </v-col>
                                <v-divider></v-divider>
                                <v-col class="pr-0 pl-0 text-center">
                                    <h3 style="justify-content: center;">Protocolo</h3>
                                    <v-slider :ticks="tickLabels" :max="4" step="1" show-ticks="always" tick-size="4"
                                        v-model="protocolSwitch" focused>
                                    </v-slider>
                                    {{ protocolSwitch }}
                                    <v-card-text class="pa-0">
                                        <v-row class="mb-4" justify="space-between">
                                            <v-col class="text-right">
                                                <v-btn theme="dark" icon elevation="0" @click="actualizarProtocolo">
                                                    <v-icon size="large" icon='mdi-content-save'></v-icon>
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                </v-col>
                                <v-divider></v-divider>
                                <v-col>

                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="3">
                <v-card>
                    <v-toolbar flat dense>
                        <v-toolbar-title>
                            <span class="text-subheading">
                                <h3>
                                    Visualización
                                </h3>
                            </span>
                        </v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <LiveChart :newNode="node.node" attr="acc" height="100"></LiveChart>
                        <LiveChart :newNode="node.node" attr="gyr" height="100" class="mt-4"></LiveChart>
                        <LiveChart :newNode="node.node" attr="mag" height="100" class="mt-4"></LiveChart>
                    </v-card-text>
                </v-card>
                <v-card class="mt-5 pr-4 pl-4" elevation="3">
                    <v-card-actions>
                        <v-btn @click="goToDashBoard" variant="tonal" color="deep-purple-accent-4">Raw data</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn @click="goToFeatures" variant="tonal" color="deep-purple-accent-4">Features</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
<script setup>
import { useNodeStore } from '@/stores/nodeStore.js'
import service from '@/services/nodo.service';
import { useRoute } from 'vue-router';
import { ref, onMounted, computed, nextTick } from 'vue';
import LiveChart from './LiveChart.vue';
import router from '@/router';

const nodeStore = useNodeStore();
const route = useRoute();

const node = computed(() => {
    return nodeStore.nodes.filter((node) => node.n == route.params.node)[0]
})

const canGoNext = computed(() => {
    return (nodeStore.nodes.indexOf(node.value) + 1) in nodeStore.nodes
})
const canGoBack = computed(() => {
    return (nodeStore.nodes.indexOf(node.value) - 1) in nodeStore.nodes
})

const tickLabels = ref({
    0: 'http',
    1: 'udp',
    2: 'mqtt0',
    3: 'mqtt1',
    4: 'mqtt2'
})

const labelsTick = {
    "http": 0,
    "udp": 1,
    "mqtt0": 2,
    "mqtt1": 3,
    "mqtt2": 4
}
const activeSwitch = ref(node.value.a == 1)
const protocolSwitch = ref(labelsTick[node.value.protocol])
const time_sensor = ref(node.value.time_sensor)
const dialogEditar = ref(false)
const dialogErrorMessage = ref("")
const jsonToEdit = ref("")
const render = ref(true)


function goToAnterior() {
    router.push({ name: 'Detalle', params: { node: nodeStore.nodes[nodeStore.nodes.indexOf(node.value) - 1].node } })
}
function goToSiguiente() {
    router.push({ name: 'Detalle', params: { node: nodeStore.nodes[nodeStore.nodes.indexOf(node.value) + 1].node } })
}
function goToDashBoard() {
    router.push({ name: 'Dashboard', params: { node: node.value.node } })
}
function goToFeatures() {
    router.push({ name: 'Features', params: { node: node.value.node } })
}


function actualizarTimeSensor() {
    node.value.time_sensor = time_sensor.value
    buscarConfig()
    editarNodo()
}

function actualizarProtocolo() {
    node.value.protocol = tickLabels.value[protocolSwitch.value]
    console.log(node.value)
    buscarConfig()
    editarNodo()
}

function toggleActivar(){
    node.value.a = activeSwitch.value ? 1: 0
    buscarConfig()
    editarNodo()
}

function decrement() {
    time_sensor.value--
}
function increment() {
    time_sensor.value++
}
function cerrarDialog(dialog) {
    dialogEditar.value = false
    jsonToEdit.value = ""

    dialogErrorMessage.value = ""
}
function buscarConfig() {
    jsonToEdit.value = JSON.stringify(node.value, null, "\t")
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





</script>