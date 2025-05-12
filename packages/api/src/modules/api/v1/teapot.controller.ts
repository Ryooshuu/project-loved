import { sessionPlugin } from "@loved/api/plugins/session.plugin";
import Elysia from "elysia";

export const teapotController = new Elysia({
    tags: ["Teapot"],
    prefix: "/teapot"
})
    .use(sessionPlugin)
    .get("/", ({ status, user }) => {
        return status(418, `I'm a teapot.${user ? ` You are ${user.username}.` : ""}`);
    }, {
        assertLoggedIn: true
    });
