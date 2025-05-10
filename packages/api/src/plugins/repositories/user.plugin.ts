import Elysia from "elysia";
import { DrizzleUserRepository } from "../../database/repositories/user.repository";

export const userRepository = new Elysia({
    name: "user-repository"
})
    .decorate("userRepository", new DrizzleUserRepository());
