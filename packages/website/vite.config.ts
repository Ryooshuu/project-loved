import { VueRouterAutoImports } from "unplugin-vue-router";
import { config } from "loved";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import autoImport from "unplugin-auto-import/vite";
import unfonts from "unplugin-fonts/vite";
import vueRouter from "unplugin-vue-router/vite";
import inspect from "vite-plugin-inspect";
import tsconfigPaths from "vite-tsconfig-paths";
import vueDevTools from "vite-plugin-vue-devtools";

export default defineConfig(() => {
    return {
        server: {
            port: config.vite.port
        },
        plugins: [
            vueRouter({
                extensions: [".page.vue", ".vue"],
                importMode: "async",
                routesFolder: [
                    {
                        src: "./src/pages"
                    }
                ],
                exclude: [
                    "**/*.component.vue"
                ]
            }),
            vue(),
            unfonts({
                custom: {
                    families: [
                        { name: "Torus", local: "Torus", src: "./public/fonts/torus/*.otf" }
                    ]
                }
            }),
            autoImport({
                dts: true,
                vueTemplate: true,
                imports: [
                    "vue",
                    VueRouterAutoImports
                ],
                eslintrc: {
                    enabled: true
                }
            }),
            tailwindcss(),
            tsconfigPaths(),
            vueDevTools(),
            inspect()
        ]
    };
});
