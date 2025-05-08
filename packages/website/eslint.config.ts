import { defineConfig } from "eslint/config";
import eslintConfig from "../../eslint.config";
import autoImportRules from "./.eslintrc-auto-import.json";

export default defineConfig([
    eslintConfig,
    {
        languageOptions: {
            globals: {
                ...autoImportRules.globals
            }
        }
    }
]);
