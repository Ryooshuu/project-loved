<script setup lang="ts">
import { IconoirProvider } from "@iconoir/vue";
import LovedNavbar from "./components/LovedNavbar.vue";
</script>

<template>
    <IconoirProvider
        :icon-props="{
            'stroke-width': 2,
            'width': '1em',
            'height': '1em'
        }"
    >
        <div class="app font-sans flex flex-col">
            <LovedNavbar />
            <RouterView />
        </div>
    </IconoirProvider>
</template>
