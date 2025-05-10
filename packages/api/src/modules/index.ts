import Elysia from "elysia";
import { apiController } from "./api";
import { oauthController } from "./oauth";

export const appController = new Elysia()
    .use(apiController)
    .use(oauthController);

export type AppType = typeof appController;
