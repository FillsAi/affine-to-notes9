import type { Server } from '@affine/core/modules/cloud';

// Disabled version checking for notes9 - removed unused rules

/**
 * Return the error tip if the server version is not meet the requirement
 * DISABLED FOR NOTES9 - Allow all versions
 */
export const useSelfhostLoginVersionGuard = (_server: Server) => {
  // Always return null to disable version checking for Notes9
  return null;
};
