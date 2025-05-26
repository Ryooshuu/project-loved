<script setup lang="ts">
type VerticalAlign = "top" | "bottom";
type HorizontalAlign = "left" | "right";
type Align = `${VerticalAlign} ${HorizontalAlign}` | VerticalAlign | HorizontalAlign;

const {
    align = "top left",
    color = "white",
    gradientType = "radial"
} = defineProps<{
    align?: Align
    color?: string
    gradientType?: "radial" | "linear"
}>();

const cssGradient = computed(() => {
    if (gradientType === "radial") {
        return `radial-gradient(ellipse at ${align}, ${color}, transparent 75%) border-box`;
    }
    else {
        return `linear-gradient(to ${align}, ${color}, transparent) border-box`;
    }
});

</script>

<template>
    <div :class="$style['bordered-box']">
        <slot />
    </div>
</template>

<style module>
.bordered-box {
    position: relative;
}

.bordered-box:after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-radius: var(--radius-md);
    border: 1px solid transparent;
    background: v-bind(cssGradient);
    mask:
        linear-gradient(#000 0 0) padding-box,
        linear-gradient(#000 0 0);
    mask-composite: exclude;
}
</style>
