<script setup lang="ts">
import { TaggedComboBox } from "@loved/ui";
import { useSubmissionsFiltersStore } from "../../stores/submissionsFiltersStore";
import { storeToRefs } from "pinia";

const options = [
    { name: "Pending", color: 45 },
    { name: "Loved", color: 333 },
    { name: "Ranked", color: 90 },
    { name: "Graveyard", color: undefined }
];

const filterStore = useSubmissionsFiltersStore();
const { status } = storeToRefs(filterStore);
const values = ref<(typeof options[number])[]>(
    status.value.map(s => options.find(o => o.name.toLowerCase() === s)!)
);

watch(values, () => {
    status.value = values.value.map(v => v.name.toLowerCase()) as typeof status.value;
});
</script>

<template>
    <div class="flex flex-col gap-0.5">
        <p class="text-col-5">Beatmap status</p>
        <TaggedComboBox
            v-model="values"
            :options="options"
            :get-option-key="v => v.name"
            :get-option-style="v => v.color ? {
                'background-color': `hsl(${v.color}, 100%, 70%)`,
                'color': `hsl(${v.color}, 100%, 10%)`
            } : {}"
        />
    </div>
</template>
