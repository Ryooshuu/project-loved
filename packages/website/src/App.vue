<script setup lang="ts">
import { routes } from "vue-router/auto-routes";

console.log(`There are ${routes.length} routes.`);

const count = ref(0);
</script>

<template>
    <div class="app font-sans">
        <RouterView />
        <div>Count is: {{ count }}</div>
        <button class="bg-red-500" @click="count++">+1</button>
        <button class="bg-blue-500" @click="count--">-1</button>
    </div>
</template>
