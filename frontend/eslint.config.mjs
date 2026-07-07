// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'dist/**', 'src/api/schema.d.ts'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  // eslint-plugin-react-hooks' own `flat` config export is an empty
  // placeholder in this version - build the flat form by hand from its
  // `recommended-latest` rules instead of the legacy `plugins: [string]` config.
  {
    plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs['recommended-latest'].rules,
  },
  reactRefresh.configs.vite,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
    },
  },
);
