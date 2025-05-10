import Elysia from "elysia";
import { v1Controller } from "./v1";

export const apiController = new Elysia({
    prefix: "/api"
})
    .use(v1Controller);

export type ApiType = typeof apiController;
