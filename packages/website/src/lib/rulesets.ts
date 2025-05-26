export type Ruleset = {
    id: number
    name: string
    description: string
};

export const osuRuleset = {
    id: 1,
    name: "osu",
    description: "osu!"
} as const;

type OsuRuleset = typeof osuRuleset;

export const taikoRuleset = {
    id: 2,
    name: "taiko",
    description: "osu!taiko"
} as const;

type TaikoRuleset = typeof taikoRuleset;

export const catchRuleset = {
    id: 3,
    name: "catch",
    description: "osu!catch"
} as const;

type CatchRuleset = typeof catchRuleset;

export const maniaRuleset = {
    id: 4,
    name: "mania",
    description: "osu!mania"
} as const;

type ManiaRuleset = typeof maniaRuleset;

export const allRulesets = [
    osuRuleset,
    taikoRuleset,
    catchRuleset,
    maniaRuleset
];

type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};

export type AllRulesets = Prettify<OsuRuleset | TaikoRuleset | CatchRuleset | ManiaRuleset>;
