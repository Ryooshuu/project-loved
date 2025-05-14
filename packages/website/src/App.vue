<script setup lang="ts">
import { routes } from "vue-router/auto-routes";
import { IconoirProvider, Check } from "@iconoir/vue";
import { motion } from "motion-v";

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
            <motion.button
                class="bg-red-500"
                :while-hover="{ scale: 1.1 }"
                :while-press="{ scale: 0.95 }"
                :transition="{
                    ease: 'easeOut',
                    duration: 0.1
                }"
                @click="count++"
            >
                +1
            </motion.button>
            <motion.button
                class="bg-blue-500"
                :while-hover="{ scale: 1.1 }"
                :while-press="{ scale: 0.95 }"
                :transition="{
                    ease: 'easeOut',
                    duration: 0.1
                }"
                @click="count--"
            >
                -1
            </motion.button>
            <Check />
        </div>
    </IconoirProvider>
</template>
