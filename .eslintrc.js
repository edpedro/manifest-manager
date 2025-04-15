module.exports = {
  parser: "@typescript-eslint/parser", // Usando o parser do TypeScript
  parserOptions: {
    project: "./tsconfig.json", // Referência ao tsconfig.json do NestJS
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "prettier", "nestjs"], // Plugins para linting e NestJS
  extends: [
    "eslint:recommended", // Regras recomendadas do ESLint
    "plugin:@typescript-eslint/recommended", // Regras recomendadas para TypeScript
    "plugin:prettier/recommended", // Integra Prettier com ESLint
    "plugin:nestjs/recommended", // Regras específicas para NestJS
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "off", // Desabilita a regra de "any" para facilitar
    "@typescript-eslint/explicit-function-return-type": "off", // Opcional: desabilita a exigência de tipo de retorno
    "@typescript-eslint/explicit-module-boundary-types": "off", // Opcional: desabilita a exigência de tipos de fronteira de módulo
    "prettier/prettier": "error", // Exige que o Prettier seja respeitado no código
    "no-console": "warn", // Aviso se `console` for usado
    "no-debugger": "warn", // Aviso se `debugger` for usado
    "nestjs/no-deprecated": "warn", // Aviso sobre funções ou recursos depreciados no NestJS
  },
  env: {
    node: true, // Ambiente Node.js
    jest: true, // Ambiente Jest para testes
  },
  ignorePatterns: ["dist", "node_modules"], // Ignora arquivos de build e dependências
};
