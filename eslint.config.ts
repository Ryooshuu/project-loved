import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import stylistic from "@stylistic/eslint-plugin";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs,ts,vue}"],
        plugins: { js },
        extends: ["js/recommended"]
    },
    {
        files: ["**/*.{js,mjs,cjs,ts,vue}"],
        languageOptions: { globals: globals.browser }
    },
    {
        files: ["**/*.{js,mjs,cjs,ts,vue}"],
        // @ts-expect-error idk
        extends: [tseslint.configs.recommended],
        rules: {
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/no-empty-object-type": ["error", { allowInterfaces: "with-single-extends" }],
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }]
        }
    },
    {
        files: ["**/*.vue"],
        extends: [pluginVue.configs["flat/recommended"]],
        languageOptions: { parserOptions: { parser: tseslint.parser } },
        rules: {
            "vue/html-indent": ["error", 4],
            "vue/script-indent": ["error", 4],
            "vue/block-order": ["error", { order: ["script", "template", "style"] }],
            "vue/max-attributes-per-line": ["warn", { singleline: 3, multiline: 1 }],
            "vue/multi-word-component-names": "off",
            "vue/singleline-html-element-content-newline": "off"
        }
    },
    {
        files: ["**/*.{js,mjs,cjs,ts,vue}"],
        plugins: {
            "@stylistic": stylistic
        },
        extends: [stylistic.configs["recommended"]],
        rules: {
            "@stylistic/indent": ["error", 4],
            "@stylistic/comma-dangle": ["warn", "never"],
            "@stylistic/quotes": ["warn", "double"],
            "@stylistic/semi": ["warn", "always"]
        }
    }
]);
