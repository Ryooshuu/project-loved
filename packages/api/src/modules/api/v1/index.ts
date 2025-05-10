import Elysia from "elysia";
import { teapotController } from "./teapot.controller";

export const v1Controller = new Elysia({
    prefix: "/v1"
})
    .use(teapotController);
