<template>
  <v-main>
    <v-dialog v-model="nodeStore.isLoading" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Solicitando informacion...
          <v-progress-linear indeterminate color="white" class="mb-1"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <router-view />
  </v-main>
</template>

<script setup>
import { useNodeStore } from '@/stores/nodeStore.js'
console.log("Loading app.vue")
const nodeStore = useNodeStore();
await nodeStore.fetchNodes();
</script>
