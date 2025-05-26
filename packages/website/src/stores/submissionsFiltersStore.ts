import { defineStore } from "pinia";
import { allRulesets, Ruleset } from "../lib/rulesets";
import { RemovableRef, useStorage } from "@vueuse/core";

export const useSubmissionsFiltersStore = defineStore("submissionsFilters", () => {
    const query = ref("");

    const rulesets = ref<RemovableRef<Map<number, Ruleset & { active: boolean }>>>(
        useStorage(
            "submissionsFilters.rulesets",
            new Map(
                allRulesets.map(
                    r => [
                        r.id,
                        // osu!standard should be active by default
                        { ...r, active: r.id === 1 }
                    ])
            )
        )
    );

    function toggleRuleset(ruleset: Ruleset) {
        rulesets.value.set(ruleset.id, {
            ...ruleset,
            active: !rulesets.value.get(ruleset.id)!.active
        });
    }

    return {
        query,
        rulesets,
        toggleRuleset
    };
});
