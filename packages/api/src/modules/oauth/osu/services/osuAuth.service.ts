import { osuPlugin } from "@loved/api/src/plugins/osu.plugin";
import { userRepository } from "@loved/api/src/plugins/repositories/user.plugin";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import Elysia, { status } from "elysia";
import { tryCatch } from "loved";
import { Err, Ok } from "ts-results";

function generateSessionToken() {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return encodeBase32LowerCaseNoPadding(bytes);
}

export const osuAuthService = new Elysia({
    name: "service.osu.auth"
})
    .use(osuPlugin)
    .use(userRepository)
    .derive({ as: "scoped" }, ({ osu, userRepository }) => {
        async function createUserFromCode(code: string) {
            const client = await tryCatch(async () => await osu({ code: code }));
            if (client.err) {
                return Err(status(400, {
                    status: 400,
                    message: "Invalid code."
                }));
            }

            const self = await tryCatch(async () => await client.val.getUser(client.val.user!));
            if (self.err) {
                return Err(status(400, {
                    status: 400,
                    message: "Invalid code."
                }));
            }

            if ((await userRepository.findByUsername(self.val.username)).some) {
                return Err(status(409, {
                    status: 409,
                    message: "Username already exists."
                }));
            }

            const sessionToken = generateSessionToken();
            const token = encodeHexLowerCase(sha256(new TextEncoder().encode(sessionToken)));

            const user = await userRepository.create(
                {
                    username: self.val.username,
                    country: self.val.country_code,
                    tokens: [code],
                    apiFetchedAt: new Date()
                },
                {
                    sessionToken: token,
                    expiresAt: new Date(Date.now() + (1000 * 60 * 60 * 24 * 7))
                }
            );

            if (user.err) {
                return Err(status(500, {
                    status: 500,
                    message: "Internal server error.",
                    error: user.val.message
                }));
            }

            return Ok({
                user: user.val,
                token: sessionToken
            });
        }

        return { createUserFromCode };
    });
