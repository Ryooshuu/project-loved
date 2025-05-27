import { defineStore } from "pinia";
import { allRulesets, Ruleset } from "../lib/rulesets";
import { RemovableRef, useStorage } from "@vueuse/core";

export const useSubmissionsFiltersStore = defineStore("submissionsFilters", () => {
    const query = ref("");
    const status = ref<RemovableRef<("pending" | "loved" | "ranked" | "graveyard")[]>>(
        useStorage(
            "submissionsFilters.status",
            ["pending", "graveyard"]
        )
    );

    const reviewStatus = ref<RemovableRef<("reviewed" | "not reviewed" | "positive" | "neutral" | "negative")[]>>(useStorage("submissionsFilters.reviewStatus", []));

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
        status,
        reviewStatus,
        rulesets,
        toggleRuleset
    };
});
