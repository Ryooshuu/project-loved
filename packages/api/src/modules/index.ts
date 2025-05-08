import Elysia from "elysia";
import { teapotController } from "./teapot.controller";

export const apiController = new Elysia({
    prefix: "/api"
})
    .use(teapotController);

export type AppType = typeof apiController;
