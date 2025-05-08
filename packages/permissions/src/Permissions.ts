/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PoliciesBase, Prettify, Prettify2, SingletonBase } from "./lib/types";
import { Policy, PolicyManager } from "./Policies";

export type AnyPermissions = Permissions<any, any>;

/**
 * ### Permissions class
 * Main class to create policies using resources and relations.
 *
 * ---
 * @example
 * ```ts
 * import { Permissions } from "@loved/permissions";
 * import { UserEntity, PostEntity } from "@loved/api";
 *
 * const isSelfOrAdmin = ({ user, post }: { user: typeof UserEntity, post: typeof PostEntity }) => {
 *     return user.id === post.userId || user.role === "admin";
 * };
 *
 * const permissions = new Permissions()
 *     .resource("user", UserEntity)
 *     .resource("post", PostEntity)
 *     .policy(["user", "post"], {
 *         create: true,
 *         read: true,
 *         update: isSelfOrAdmin,
 *         delete: isSelfOrAdmin
 *     });
 *
 * const policy = permissions.policyFor("user", "post");
 * const allowed = policy.can("create", { post: Post, user: User }); // true
 * ```
 */
export class Permissions<
    const in out Singleton extends SingletonBase = {
        resources: {}
    },
    const in out Policies extends PoliciesBase = {
        relations: {}
        store: {}
    }
> {
    "~Singleton" = null as unknown as Singleton;
    "~Policies" = null as unknown as Policies;

    protected singleton = {
        resources: {}
    } as SingletonBase;

    get resources(): Singleton["resources"] {
        return this.singleton.resources;
    }

    protected policies = {
        relations: {},
        store: {}
    } as PoliciesBase;

    get relations(): Policies["relations"] {
        return this.policies.relations;
    }

    get store(): Policies["store"] {
        return this.policies.store;
    }

    /**
     * ### use
     * Merge separate Permissions instance with this one.
     * @param instance - The instance to merge.
     * @returns The merged instance.
     *
     * ---
     * @example
     * ```ts
     * const resources = new Permissions()
     *     .resource("user", UserEntity)
     *     .resource("post", PostEntity);
     *
     * const policies = new Permissions()
     *     .use(resources)
     *     .policy(["user", "post"], {
     *         create: true,
     *         read: true,
     *     });
     * ```
     */
    use<
        const NewPermissions extends AnyPermissions
    >(
        instance: NewPermissions
    ): Permissions<
        // @ts-expect-error This is fine.
        Prettify2<Singleton & NewPermissions["~Singleton"]>,
        Prettify2<Policies & NewPermissions["~Policies"]>
    >;
    use(plugin: AnyPermissions): AnyPermissions {
        this.singleton.resources = { ...this.singleton.resources, ...plugin.resources };
        this.policies.relations = { ...this.policies.relations, ...plugin.relations };
        this.policies.store = { ...this.policies.store, ...plugin.store };

        return this;
    }

    /**
     * ### resource
     * Add a resource to the instance.
     *
     * @param name The name of the resource.
     * @param value The value of the resource.
     * @returns The instance with the resource added.
     *
     * ---
     * @example
     * ```ts
     * const resources = new Permissions()
     *     .resource("user", UserEntity)
     *     .resource("post", PostEntity);
     * ```
     */
    resource<Value, const Name extends string = string>(
        name: Name,
        value?: Value
    ): Permissions<
        {
            resources: Singleton["resources"] & {
                [K in Name]: Value;
            }
        },
        Policies
    >;
    resource(
        name: string,
        value?: unknown
    ): AnyPermissions {
        this.singleton.resources[name] = value ?? {};
        return this;
    }

    /**
     * ### policy
     * Add a policy to the instance.
     *
     * @param relation The relation to create the policy for. The first element is the identity, the second is the resource.
     * @param policy The policy to apply to the relation.
     * @returns The instance with the policy added.
     *
     * ---
     * @example
     * ```ts
     * const permissions = new Permissions()
     *     .use(resources)
     *     .policy(["user", "post"], {
     *         create: true,
     *         read: true,
     *         update: ({ user, post }) => user.id === post.userId || user.role === "admin",
     *         delete: ({ user, post }) => user.id === post.userId || user.role === "admin",
     *     });
     * ```
     */
    policy<
        const Key1 extends keyof Singleton["resources"],
        const Key2 extends keyof Omit<Singleton["resources"], Key1>,
        const NewPolicy extends {
            [K in "create" | "read" | "update" | "delete"]?: Policy<Pick<Singleton["resources"], Key1 | Key2 & string>>
        } | {
            [K in string]?: Policy<Pick<Singleton["resources"], Key1 | Key2 & string>>;
        }
    >(
        relation: [Key1, Key2],
        policy: NewPolicy
    ): Permissions<
        Singleton,
        {
            relations: Prettify<Omit<Policies["relations"], Key1> & {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                [K in Key1]: Policies["relations"][Key1] extends (infer _)[]
                    ? [Key2, ...Policies["relations"][Key1]]
                    : [Key2]
            }>
            store: Policies["store"] & {
                [K in Key1]: {
                    [K in Key2 & string]: NewPolicy
                }
            }
        }
    >;
    policy(
        relation: string[],
        policy: Record<string, Policy>
    ): AnyPermissions {
        this.policies.relations[relation[0] as string] = relation.slice(1);
        this.policies.store = {
            ...this.policies.store,
            [relation[0] as string]: {
                [relation[1] as string]: policy
            }
        };

        return this;
    }

    /**
     * ### policyFor
     * Get the policy manager for a relation.
     *
     * @param identity The identity in the relation to get the policy for.
     * @param resource The resource in the relation to get the policy for.
     * @returns The policy manager for the relation.
     *
     * ---
     * @example
     * ```ts
     * const policy = permissions.policyFor("user", "post");
     * ```
     */
    policyFor<
        const IdentityKey extends keyof Policies["relations"],
        const ResourceKey extends keyof Policies["store"][IdentityKey & string]
    >(
        identity: IdentityKey,
        resource: ResourceKey
    ): PolicyManager<
        Prettify2<
          { [K in IdentityKey]: Singleton["resources"][K & string] }
          & { [K in ResourceKey]: Singleton["resources"][K & string] }
        >,
        // @ts-expect-error This is fine.
        Policies["store"][IdentityKey & string][ResourceKey & string]
    >;
    policyFor(
        identity: string,
        resource: string
    ): PolicyManager {
        return new PolicyManager(this, identity, resource);
    }
}
