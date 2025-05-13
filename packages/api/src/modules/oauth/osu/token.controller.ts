import Elysia, { redirect } from "elysia";
import { config } from "loved";
import { generateAuthorizationURL } from "osu-api-v2-js";

export const tokenController = new Elysia({
    tags: ["osu"],
    prefix: "/token"
})
    .get("/", async () => {
        const url = generateAuthorizationURL(
            config.osu.client.id,
            config.osu.callback,
            ["public"],
            config.osu.url
        );

        return redirect(url);
    });
