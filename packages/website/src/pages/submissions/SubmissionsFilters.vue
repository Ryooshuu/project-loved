<script setup lang="ts">
import { BorderedBox } from "@loved/ui";
import RulesetSelector from "./RulesetSelector.vue";
</script>

<template>
    <BorderedBox
        align="bottom"
        color="hsla(333, 46%, 70%, 16%)"
        gradient-type="linear"
        class="flex flex-[1] max-w-[300px] p-5 flex-col"
    >
        <RulesetSelector />
    </BorderedBox>
</template>
