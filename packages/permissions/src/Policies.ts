/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */

import { AnyPermissions } from "./Permissions";

export type Policy<
    Resources extends Record<string, unknown> = {}
> = boolean | ((args: Resources) => boolean);

/**
 * ### PolicyManager class
 * Class to manage policies for a relation.
 *
 * ---
 * @example
 * ```ts
 * const policy = permissions.policyFor("user", "post");
 * const allowed = policy.can("create", { post: Post, user: User }); // true
 * ```
 */
export class PolicyManager<
    const in Resources extends Record<string, unknown> = {},
    const in out Policies extends Record<string, Policy<Resources>> = {}
> {
    constructor(
        private app: AnyPermissions,
        private identity: string,
        private resource: string
    ) {}

    /**
     * ### can
     * Check if the action is allowed.
     *
     * @param action The action to check.
     * @param resources The resources to check the action with if it's a function.
     *
     * ---
     * @example
     * ```ts
     * const policy = permissions.policyFor("user", "post");
     * const allowed = policy.can("create", { post: Post, user: User }); // true
     * ```
     */
    can<
        Resource extends Resources,
        Action extends keyof Policies
    >(
        action: Action,
        resources: Resource
    ): Policies[Action & string] & boolean;

    can(
        action: string,
        resources: unknown
    ): boolean {
        const act = this.app.store[this.identity][this.resource][action];
        if (typeof act === "boolean") {
            return act;
        }

        return act(resources as any);
    };

    /**
     * ### cannot
     * Check if the action is not allowed.
     *
     * @param action The action to check.
     * @param resources The resources to check the action with if it's a function.
     *
     * ---
     * @example
     * ```ts
     * const policy = permissions.policyFor("user", "post");
     * const allowed = policy.cannot("create", { post: Post, user: User }); // false
     * ```
     */
    cannot<
        Resource extends Resources,
        Action extends keyof Policies
    >(
        action: Action,
        resources: Resource
    ): Policies[Action & string] extends true ? false : true;

    cannot(
        action: string,
        resources: unknown
    ): boolean {
        return !this.can(action, resources as any);
    }
}
