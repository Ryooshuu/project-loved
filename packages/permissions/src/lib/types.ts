/* eslint-disable @typescript-eslint/no-explicit-any */
export type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};

export type Prettify2<T> = {
    [K in keyof T]: T extends {
        [ey in keyof any]: unknown;
    } ? Prettify<T[K]> : T[K];
} & {};

export interface SingletonBase {
    resources: Record<string, unknown>
}

export interface PoliciesBase {
    relations: Record<string, string[]>
    store: Record<string, unknown>
}
