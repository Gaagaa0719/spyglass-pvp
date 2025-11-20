/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ["**/*.{js,ts}"] },
    {
        languageOptions: {
            sourceType: "module" // import/export を使うために必要
        }
    },
    {
        rules: {
            camelcase: [
                "error",
                {
                    properties: "always",
                    ignoreDestructuring: false
                }
            ]
        }
    }
];
