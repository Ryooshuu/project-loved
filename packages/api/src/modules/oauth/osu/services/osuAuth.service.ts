import { osuPlugin } from "@loved/api/plugins/osu.plugin";
import { userRepository } from "@loved/api/plugins/repositories/user.plugin";
import { createSession, generateSessionToken } from "@loved/api/services/session.service";
import Elysia, { status } from "elysia";
import { tryCatch } from "loved";
import { Err, Ok } from "ts-results";

export const osuAuthService = new Elysia({
    name: "service.osu.auth"
})
    .use(osuPlugin)
    .use(userRepository)
    .derive({ as: "scoped" }, ({ osu, userRepository }) => {
        async function createUserFromCode(code: string) {
            // todo : split these out into its own file
            const invalidCodeError = status(400, {
                status: 400,
                message: "Invalid code."
            });
            const serverError = (error: unknown) => status(500, {
                status: 500,
                message: "Internal server error.",
                error
            });

            const client = await tryCatch(async () => await osu({ code: code }));
            if (client.err)
                return Err(invalidCodeError);

            const self = await tryCatch(async () => await client.val.getUser(client.val.user!));
            if (self.err)
                return Err(invalidCodeError);

            if ((await userRepository.findByUsername(self.val.username)).some) {
                return Err(status(409, {
                    status: 409,
                    message: "Username already exists."
                }));
            }

            const user = await userRepository.createUser({
                username: self.val.username,
                country: self.val.country_code,
                tokens: [code],
                apiFetchedAt: new Date()
            });
            if (user.err)
                return Err(serverError(user.val.message));

            const sessionToken = generateSessionToken();
            const session = await createSession(userRepository, sessionToken, user.val);
            if (session.err)
                return Err(serverError(session.val.message));

            user.val.currentSession = session.val;

            return Ok({
                user: user.val,
                token: sessionToken
            });
        }

        return { createUserFromCode };
    });
