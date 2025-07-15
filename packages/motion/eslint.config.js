import { base, restrictEnvAccess } from "@t2421/eslint-config/base";

export default [
  {
    ignores: ["dist/**"],
  },
  ...base,
  ...restrictEnvAccess,
];
