<script setup lang="ts">
import { TaggedComboBox } from "@loved/ui";
</script>

<template>
    <TaggedComboBox
        label="Beatmap status"
        :options="[
            { name: 'Pending', color: 45 },
            { name: 'Loved', color: 333 },
            { name: 'Ranked', color: 90 },
            { name: 'Graveyard', color: undefined }
        ]"
        :default-values="[{ name: 'Pending', color: 45 }]"
        :get-option-key="v => v.name"
        :get-option-style="v => v.color ? {
            'background-color': `hsl(${v.color}, 100%, 70%)`,
            'color': `hsl(${v.color}, 100%, 10%)`
        } : {}"
    />
</template>
