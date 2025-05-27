<script setup lang="ts">
import { BorderedBox } from "@loved/ui";
import RulesetSelector from "./RulesetSelector.vue";
import { useSubmissionsFiltersStore } from "../../stores/submissionsFiltersStore";
import { storeToRefs } from "pinia";
import BeatmapStatusPicker from "./BeatmapStatusPicker.vue";
import ReviewStatusPicker from "./ReviewStatusPicker.vue";

const filterStore = useSubmissionsFiltersStore();
const { query } = storeToRefs(filterStore);
</script>

<template>
    <BorderedBox
        align="bottom"
        color="hsla(333, 46%, 70%, 16%)"
        gradient-type="linear"
        class="flex flex-[1] max-w-[300px] p-5 flex-col gap-5"
    >
        <div class="flex flex-col gap-2.5">
            <RulesetSelector />
            <input
                v-model="query"
                type="text"
                placeholder="Search beatmaps..."
                class="px-2 py-1 rounded-md surface-1 border-2 border-transparent focus:border-surface-2 text-sm placeholder:text-col-4 outline-none transition-all"
            >
        </div>
        <div class="flex flex-col gap-1.5">
            <p>Filters</p>
            <BeatmapStatusPicker />
            <ReviewStatusPicker />
        </div>
        <div class="flex flex-col gap-1.5">
            <p>Sort by</p>
        </div>
    </BorderedBox>
</template>
