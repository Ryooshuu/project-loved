import Elysia from "elysia";

export const teapotController = new Elysia({
    tags: ["Teapot"],
    prefix: "/teapot"
})
    .get("/", ({ status }) => {
        return status(418);
    });
