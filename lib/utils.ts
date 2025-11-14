import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hasCertificateIssuancePermission(profile: any): boolean {
  if (!profile) return false;

  // Check if user has admin role
  if (["coach", "admin", "superadmin"].includes(profile.role)) {
    return true;
  }

  // Check if user has association leadership role
  if (
    profile.association_memberships &&
    Array.isArray(profile.association_memberships)
  ) {
    const hasLeadershipRole = profile.association_memberships.some(
      (membership: any) =>
        [
          "president",
          "director",
          "provincial_director",
          "head_coach",
          "certification_manager",
        ].includes(membership.role)
    );
    if (hasLeadershipRole) return true;
  }

  return false;
}
