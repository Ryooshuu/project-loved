<script setup lang="ts">
import { TaggedComboBox } from "@loved/ui";

const options = [
    { name: "Pending", color: 45 },
    { name: "Loved", color: 333 },
    { name: "Ranked", color: 90 },
    { name: "Graveyard", color: undefined }
];

const values = ref<(typeof options[number])[]>([options[0]!]);
</script>

<template>
    <TaggedComboBox
        v-model="values"
        label="Beatmap status"
        :options="options"
        :get-option-key="v => v.name"
        :get-option-style="v => v.color ? {
            'background-color': `hsl(${v.color}, 100%, 70%)`,
            'color': `hsl(${v.color}, 100%, 10%)`
        } : {}"
    />
</template>
