import { base, restrictEnvAccess } from "@repo/eslint-config/base";

export default [
  {
    ignores: ["dist/**"],
  },
  ...base,
  ...restrictEnvAccess,
];
