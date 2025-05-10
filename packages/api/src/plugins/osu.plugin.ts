import Elysia from "elysia";
import { config } from "loved";
import { API as osu } from "osu-api-v2-js";

export const osuPlugin = new Elysia({
    name: "osu"
})
    .decorate("osu", async (user?: { code: string }) => {
        const client = await osu.createAsync(
            config.osu.client.id,
            config.osu.client.secret,
            user
                ? {
                    code: user.code,
                    redirect_uri: config.osu.callback
                }
                : undefined,
            {
                server: config.osu.url
            }
        );

        return client;
    });
