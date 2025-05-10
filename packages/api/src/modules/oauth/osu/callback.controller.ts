import Elysia, { status, t } from "elysia";
import { APIError } from "osu-api-v2-js";
import { DatabaseError } from "@loved/api/database/DatabaseError";
import { logger } from "@loved/api";
import { osuAuthService } from "./services/osuAuth.service";

export const callbackController = new Elysia({
    prefix: "/callback"
})
    .guard(
        { query: t.Object({ code: t.String() }) },
        app => app
            .use(osuAuthService)
            .get("", async ({ query, createUserFromCode, cookie }) => {
                try {
                    const result = await createUserFromCode(query.code);

                    if ("response" in result) {
                        return result;
                    }

                    console.log(result);

                    cookie["token"]?.set({
                        value: result.token,
                        expires: result.user.currentSession!.expiresAt,
                        secure: true
                    });

                    return {
                        status: 200,
                        message: "Successfully authenticated.",
                        user: result.user.toSafeJson()
                    };
                }
                catch (err) {
                    if (err instanceof DatabaseError) {
                        return status(500, {
                            status: 500,
                            message: "Internal server error.",
                            error: err.message
                        });
                    }
                    else if (err instanceof APIError) {
                        if (err.message === "No token obtained") {
                            return status(400, {
                                status: 400,
                                message: "Invalid code."
                            });
                        };
                    }

                    logger.error(`Error while authenticating user. ${err}`);
                }

                return status(500, {
                    status: 500,
                    message: "Internal server error."
                });
            })
    );
