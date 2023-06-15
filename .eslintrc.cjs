const eslintrc = {
    extends: [
        'plugin:prettier/recommended',
        // https://www.npmjs.com/package/@typescript-eslint/eslint-plugin
        'plugin:@typescript-eslint/recommended',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'plugin:markdown/recommended',
    ],
    env: {
        node: true,
        jasmine: true,
        es6: true,
    },
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'prettier', 'markdown'],
    // https://github.com/typescript-eslint/typescript-eslint/issues/46#issuecomment-470486034
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            rules: {
                '@typescript-eslint/no-unused-vars': [2, { args: 'none' }],
            },
        },
    ],
    rules: {
        "arrow-body-style": ["warn", "as-needed"],
        'import/extensions': 'off',
        'no-console': 'off',
        "no-param-reassign": "warn",
        "no-return-await": "warn",
        "no-shadow": "warn",
        "object-shorthand": ["warn", "always"],
    },
};

module.exports = eslintrc;
