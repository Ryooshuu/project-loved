<script setup lang="ts">
import { TaggedComboBox } from "@loved/ui";
import { useSubmissionsFiltersStore } from "../../stores/submissionsFiltersStore";
import { storeToRefs } from "pinia";

const options = ["Reviewed", "Not reviewed", "Positive", "Neutral", "Negative"];
const filterStore = useSubmissionsFiltersStore();
const { reviewStatus } = storeToRefs(filterStore);

const values = ref<(typeof options[number])[]>(
    reviewStatus.value.map(s => options.find(o => o.toLowerCase() === s)!)
);

watch(values, () => {
    reviewStatus.value = values.value.map(v => v.toLowerCase()) as typeof reviewStatus.value;
});
</script>

<template>
    <div class="flex flex-col gap-0.5">
        <p class="text-col-5">Review status</p>
        <TaggedComboBox
            v-model="values"
            :options="options"
        />
    </div>
</template>
