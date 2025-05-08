/* eslint-disable @typescript-eslint/no-unsafe-function-type */
export type FunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T];
export type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

export type NonFunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];
export type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

export type RecursiveExcludeFunctions<T> = {
    [K in keyof T as T[K] extends Function ? never : K]:
    Exclude<T[K], undefined> extends Array<infer E>
        ? Array<RecursiveExcludeFunctions<E>>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        : Exclude<T[K], undefined> extends Record<string, any>
            ? RecursiveExcludeFunctions<T[K]>
            : T[K];
};
