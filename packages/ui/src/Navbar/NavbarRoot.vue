<script setup lang="ts">
import { useScroll } from "@vueuse/core";
import { motion } from "motion-v";

const scroll = useScroll(window);
</script>

<template>
    <div class="sticky top-0 flex flex-row gap-12 items-center h-20 p-2">
        <motion.div
            :animate="{
                opacity: scroll.arrivedState.top ? 1 : 0,
                height: scroll.arrivedState.top ? '50vh' : 'calc(var(--spacing) * 20)'
            }"
            :transition="{
                duration: 0.25,
                type: 'tween',
                ease: 'easeOut'
            }"
            class="pointer-events-none absolute inset-0 h-[50vh] -z-50 bg-linear-to-b from-[#FF338F0F] to-[#FF338F00]"
        />
        <motion.div
            :animate="{
                opacity: scroll.arrivedState.top ? 0 : 1,
            }"
            :transition="{
                duration: 0.25,
                type: 'tween',
                ease: 'easeOut'
            }"
            class="pointer-events-none absolute inset-0 -z-50 bg-[#301D25] opacity-0"
        />
        <slot />
    </div>
</template>
