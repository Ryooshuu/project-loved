import Elysia, { t } from "elysia";
import { osuAuthService } from "./services/osuAuth.service";

export const callbackController = new Elysia({
    prefix: "/callback"
})
    .guard(
        { query: t.Object({ code: t.String() }) },
        app => app
            .use(osuAuthService)
            .get("", async ({ query, createUserFromCode, cookie }) => {
                const result = await createUserFromCode(query.code);

                if (result.err) {
                    return result.val;
                }

                cookie["token"]?.set({
                    value: result.val.token,
                    expires: result.val.user.currentSession!.expiresAt,
                    secure: true
                });

                return {
                    status: 200,
                    message: "Successfully authenticated.",
                    data: {
                        user: result.val.user.toSafeJson(),
                        token: result.val.token
                    }
                };
            })
    );
