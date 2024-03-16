module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'drizzle'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:drizzle/recommended',
    "simple-import-sort"
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    "simple-import-sort/imports": [
    "warn",
      {
        "groups": [
          ["^\\u0000"],
          ["^@?\\w", "^@nestjs(/.*|$)", "^react"],
          ["^@lj(/.*|$)"],
          ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
          ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"]
        ]
      }
    ],
    "simple-import-sort/exports": "warn",
    "@typescript-eslint/member-ordering": [
          "warn",
          {
            "default": [
              // Index signature
              "signature",
              "call-signature",

              // Fields
              "public-static-field",
              "protected-static-field",
              "private-static-field",
              // "#private-static-field",

              // Static methods
              "public-static-method",
              "protected-static-method",
              "private-static-method",
              // "#private-static-method",

              "public-decorated-field",
              "protected-decorated-field",
              "private-decorated-field",

              "public-instance-field",
              "protected-instance-field",
              "private-instance-field",
              // "#private-instance-field",

              "public-abstract-field",
              "protected-abstract-field",

              "public-field",
              "protected-field",
              "private-field",
              // "#private-field",

              "static-field",
              "instance-field",
              "abstract-field",

              "decorated-field",

              "field",

              // Static initialization
              // "static-initialization",

              // Constructors
              "public-constructor",
              "protected-constructor",
              "private-constructor",

              "constructor",

              // Getters and Setters. Here they are grouped like this because of the `grouped-accessor-pairs` rule.
              ["public-static-get", "public-static-set"],
              ["protected-static-get", "protected-static-set"],
              ["private-static-get", "private-static-set"],
              // "#private-static-get",
              // "#private-static-set",

              ["public-decorated-get", "public-decorated-set"],
              ["protected-decorated-get", "protected-decorated-set"],
              ["private-decorated-get", "private-decorated-set"],

              ["public-instance-get", "public-instance-set"],
              ["protected-instance-get", "protected-instance-set"],
              ["private-instance-get", "private-instance-set"],
              // "#private-instance-get",
              // "#private-instance-set",

              ["public-abstract-get", "public-abstract-set"],
              ["protected-abstract-get", "protected-abstract-set"],

              ["public-get", "public-set"],
              ["protected-get", "protected-set"],
              ["private-get", "private-set"],
              // "#private-get",
              // "#private-set",

              ["static-get", "static-set"],
              ["instance-get", "instance-set"],
              ["abstract-get", "abstract-set"],

              ["decorated-get", "decorated-set"],

              ["get", "set"],

              // Methods

              "public-decorated-method",
              "protected-decorated-method",
              "private-decorated-method",

              "public-instance-method",
              "protected-instance-method",
              "private-instance-method",
              // "#private-instance-method",

              "public-abstract-method",
              "protected-abstract-method",

              "public-method",
              "protected-method",
              "private-method",
              // "#private-method",

              "static-method",
              "instance-method",
              "abstract-method",

              "decorated-method",

              "method"
            ]
          }
        ]
  },
};
