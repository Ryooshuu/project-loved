import { Elysia, t } from "elysia";
import { userRepository } from "./repositories/user.plugin";
import { UserEntity } from "../database/entities/User";
import { validateSessionToken } from "../services/session.service";

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

        const session = await validateSessionToken(userRepository, token.value);
        if (!session.some)
            return {};

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
