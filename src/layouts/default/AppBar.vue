<template>
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
</template>

<script setup>
import { ref } from 'vue';
const drawer = ref(false);
const menuItems = ref([
  { title: 'Nodos', value: "/Nodos", icon: "mdi-devices" },
  { title: 'Real-time', value: "/LiveData", icon: "mdi-antenna" }
]);

const toggleDrawer = () => {
  drawer.value = !drawer.value;
};

</script>
