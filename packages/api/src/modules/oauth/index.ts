import Elysia from "elysia";
import { osuOauthController } from "./osu";

export const oauthController = new Elysia({
    prefix: "/oauth"
})
    .use(osuOauthController);
