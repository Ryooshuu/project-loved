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
            <RouterView v-slot="{ Component }">
                <Transition name="fade" mode="out-in">
                    <component :is="Component" />
                </Transition>
            </RouterView>
        </div>
    </IconoirProvider>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
