<script setup lang="ts">
import { RouteLocationRaw } from "vue-router";
import { motion } from "motion-v";

const { href } = defineProps<{
    href: RouteLocationRaw
}>();

const route = useRoute();
const isCurrent = computed(() => {
    return route.path === href;
});
</script>

<template>
    <RouterLink :to="href" exact-active-class="opacity-100" class="relative opacity-50 hover:opacity-100 transition-all">
        <slot />
        <motion.span
            v-if="isCurrent"
            id="navbar-item"
            layout
            layout-id="navbar-item"
            class="absolute left-0 right-0 -bottom-[10px] h-1 bg-white rounded-full glow"
            :transition="{
                type: 'spring',
                visualDuration: 0.3,
                bounce: 0.2
            }"
        />
    </RouterLink>
</template>
