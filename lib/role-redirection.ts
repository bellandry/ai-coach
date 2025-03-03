import { UserRole } from "@prisma/client";

export const roleRedirectMap = {
  [UserRole.ADMIN]: "/admin",
  [UserRole.USER]: "/dashboard",
} as const;

export const getRoleBasedRedirectPath = (role: UserRole): string => {
  return roleRedirectMap[role] || "/dashboard";
};
