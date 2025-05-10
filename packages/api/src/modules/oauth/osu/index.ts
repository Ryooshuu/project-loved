import Elysia from "elysia";
import { tokenController } from "./token.controller";
import { callbackController } from "./callback.controller";

export const osuOauthController = new Elysia({
    prefix: "/osu"
})
    .use(tokenController)
    .use(callbackController);
