import type { AccountStatus } from '@prisma/client';
import { AppError } from '@/server/core/errors/app-error';

/**
 * Authorization policy for Dashboard Overview
 */
export class DashboardOverviewPolicy {
  /**
   * Check if user can access dashboard overview
   * Dashboard is readable by any authenticated user.
   * SessionService already enforces authentication before this is called.
   */
  static enforceCanAccessDashboard(userStatus: AccountStatus | undefined): void {
    if (!userStatus) {
      throw new AppError(
        'UNAUTHENTICATED',
        401,
        'يجب أن تكون مسجل دخول للوصول إلى لوحة المعلومات'
      );
    }

    // Note: Account status check could be added here if needed in future
    // Current implementation trusts middleware for coarse route protection
  }
}
