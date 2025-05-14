<script setup lang="ts">
import { routes } from "vue-router/auto-routes";
import { IconoirProvider, Check } from "@iconoir/vue";

console.log(`There are ${routes.length} routes.`);

const count = ref(0);
</script>

<template>
    <IconoirProvider
        :icon-props="{
            'stroke-width': 2,
            'width': '1em',
            'height': '1em'
        }"
    >
        <div class="app font-sans">
            <RouterView />
            <div>Count is: {{ count }}</div>
            <Check />
        </div>
    </IconoirProvider>
</template>
