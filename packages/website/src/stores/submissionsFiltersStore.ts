import { defineStore } from "pinia";
import { allRulesets, Ruleset } from "../lib/rulesets";
import { RemovableRef, useStorage } from "@vueuse/core";

export const useSubmissionsFiltersStore = defineStore("submissionsFilters", () => {
    const rulesets = ref<RemovableRef<Map<number, Ruleset & { active: boolean }>>>(
        useStorage(
            "submissionsFilters.rulesets",
            new Map(
                allRulesets.map(
                    r => [
                        r.id,
                        { ...r, active: false }
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
        rulesets,
        toggleRuleset
    };
});
