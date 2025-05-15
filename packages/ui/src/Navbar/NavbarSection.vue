<script setup lang="ts">
import NavbarHighlight from "./NavbarHighlight.vue";

const logo = useTemplateRef("logo");

const { logoInset } = defineProps<{
    logoInset: {
        left: number
        top: number
        bottom: number
    }
}>();
</script>

<template>
    <div class="relative flex flex-row gap-1 items-center h-full">
        <NavbarHighlight :logo-inset :logo />

        <div class="flex flex-row items-end gap-8 pl-2">
            <div ref="logo" class="flex flex-row gap-8">
                <slot name="logo" />
            </div>
            <div ref="items" class="flex flex-row gap-4">
                <slot name="items" />
            </div>
        </div>
    </div>
</template>
