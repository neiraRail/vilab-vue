<template>
  <v-app>
    <v-navigation-drawer elevation="1">
      <v-list-item title="Menu"></v-list-item>
      <v-divider></v-divider>
      <v-list-item v-for="(item, i) in menuItems" :key="i" :value="item" :to="item.value">
        <template v-slot:prepend>
          <v-icon :icon="item.icon"></v-icon>
        </template>

        <v-list-item-title v-text="item.title"></v-list-item-title>
      </v-list-item>
    </v-navigation-drawer>
    <v-app-bar flat>
      <v-app-bar-title>
        <!-- <v-icon icon="mdi-circle-slice-4" /> -->
        Laboratorio de Monitoreo de sensores inerciales
      </v-app-bar-title>
    </v-app-bar>

    <v-main>
    <v-dialog v-model="nodeStore.isLoading" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Solicitando informacion...
          <v-progress-linear indeterminate color="white" class="mb-1"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <router-view :key="$route.fullPath" />
  </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';
import { useNodeStore } from '@/stores/nodeStore.js'
console.log("Loading app.vue")
const nodeStore = useNodeStore();
await nodeStore.fetchNodes();

const drawer = ref(false);
const menuItems = ref([
  { title: 'Nodos', value: "/Nodos", icon: "mdi-devices" },
  { title: 'Real-time', value: "/LiveData", icon: "mdi-antenna" },
  { title: 'Testing', value: "/Dashboard", icon: "mdi-test-tube"}
]);

const toggleDrawer = () => {
  drawer.value = !drawer.value;
};
</script>
