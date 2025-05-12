import { Elysia, t } from "elysia";
import { userRepository } from "./repositories/user.plugin";
import { UserEntity } from "../database/entities/User";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";

export const sessionPlugin = new Elysia({
    name: "plugin.session"
})
    .use(userRepository)
    .state({
        user: {} as UserEntity | null
    })
    .model({
        session: t.Cookie({
            token: t.String()
        }, {
            secure: true
        })
    })
    .resolve(async ({ cookie: { token }, userRepository }) => {
        if (!token?.value)
            return {};

        const tokenHash = encodeHexLowerCase(sha256(new TextEncoder().encode(token.value)));
        const session = await userRepository.findSessionByToken(tokenHash);
        if (!session.some)
            return {};

        await session.val.loadUser();

        if (!session.val.user)
            return {};

        session.val.user.currentSession = session.val;

        return {
            user: session.val.user
        };
    })
    .macro({
        assertLoggedIn(enabled: boolean) {
            if (!enabled)
                return;

            return {
                async beforeHandle({ status, user }) {
                    if (!user)
                        return status(401, "Unauthorized.");
                }
            };
        }
    })
    .as("scoped");
