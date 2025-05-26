<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSubmissionsFiltersStore } from "../../stores/submissionsFiltersStore";

const filterStore = useSubmissionsFiltersStore();
const { rulesets } = storeToRefs(filterStore);
</script>

<template>
    <div class="flex flex-row gap-2">
        <button
            v-for="ruleset in rulesets.values()"
            :key="ruleset.id"
            @click="filterStore.toggleRuleset(ruleset)"
        >
            <img
                :src="`/public/icons/${ruleset.name}.svg`"
                :alt="ruleset.name"
                :class="(ruleset.active ? 'glow-sm' : 'opacity-50') + ' transition-all cursor-pointer'"
                width="24"
                height="24"
            >
        </button>
    </div>
</template>
