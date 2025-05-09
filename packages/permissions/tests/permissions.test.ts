import { describe, expect, it } from "vitest";
import { Permissions } from "../src/Permissions";

const userEntity = { id: 1, username: "saryu", role: "user" };
const postEntity = { id: 1, userId: 2, content: "Hello world!" };

describe("permissions", () => {
    it("should be instantiable", () => {
        const permissions = new Permissions();
        expect(permissions).toBeDefined();
        expect(permissions.resources).toBeDefined();
        expect(permissions.relations).toBeDefined();
        expect(permissions.store).toBeDefined();
    });

    it("should be instantiable with resources", () => {
        const permissions = new Permissions()
            .resource("user", userEntity);

        expect(permissions.resources).toBeDefined();
        expect(permissions.resources.user).toBe(userEntity);
    });

    it("should be instantiable with policies", () => {
        const permissions = new Permissions()
            .resource("user", userEntity)
            .resource("post", postEntity)
            .policy(["user", "post"], {
                create: true,
                read: true,
                update: true,
                delete: true
            });

        expect(permissions.relations).toBeDefined();
        expect(permissions.relations.user).toBeDefined();
        expect(permissions.relations.user).toEqual(["post"]);
        expect(permissions.store).toBeDefined();
        expect(permissions.store.user).toBeDefined();
        expect(permissions.store.user.post).toBeDefined();
    });

    it("should be mergeable", () => {
        const resources = new Permissions()
            .resource("user", userEntity)
            .resource("post", postEntity);

        const policies = new Permissions()
            .use(resources)
            .policy(["user", "post"], {
                create: true,
                read: true,
                update: true,
                delete: true
            });

        const permissions = new Permissions()
            .use(policies);

        expect(permissions.resources).toBeDefined();
        expect(permissions.resources.user).toBe(userEntity);
        expect(permissions.resources.post).toBe(postEntity);
        expect(permissions.relations).toBeDefined();
        expect(permissions.relations.user).toBeDefined();
        expect(permissions.relations.user).toEqual(["post"]);
        expect(permissions.store).toBeDefined();
        expect(permissions.store.user).toBeDefined();
        expect(permissions.store.user.post).toBeDefined();
    });
});

describe("policies", () => {
    it("should fetch a policy", () => {
        const permissions = new Permissions()
            .resource("user", userEntity)
            .resource("post", postEntity)
            .policy(["user", "post"], {
                create: true,
                read: true,
                update: true,
                delete: true
            });

        const policy = permissions.policyFor("user", "post");
        expect(policy.can("create", { user: userEntity, post: postEntity })).toBe(true);
        expect(policy.can("read", { user: userEntity, post: postEntity })).toBe(true);
        expect(policy.can("update", { user: userEntity, post: postEntity })).toBe(true);
        expect(policy.can("delete", { user: userEntity, post: postEntity })).toBe(true);
    });

    it("should be able to change results based off a function", () => {
        const permissions = new Permissions()
            .resource("user", userEntity)
            .resource("post", postEntity)
            .policy(["user", "post"], {
                create: true,
                read: true,
                update: ({ user, post }) => user.id === post.userId || user.role === "admin",
                delete: ({ user, post }) => user.id === post.userId || user.role === "admin"
            });

        const policy = permissions.policyFor("user", "post");
        expect(policy.can("create", { user: userEntity, post: postEntity })).toBe(true);
        expect(policy.can("read", { user: userEntity, post: postEntity })).toBe(true);
        expect(policy.can("update", { user: userEntity, post: postEntity })).toBe(false);
        expect(policy.can("delete", { user: userEntity, post: postEntity })).toBe(false);

        const adminUser = { ...userEntity, role: "admin" };
        expect(policy.can("create", { user: adminUser, post: postEntity })).toBe(true);
        expect(policy.can("read", { user: adminUser, post: postEntity })).toBe(true);
        expect(policy.can("update", { user: adminUser, post: postEntity })).toBe(true);
        expect(policy.can("delete", { user: adminUser, post: postEntity })).toBe(true);
    });
});
