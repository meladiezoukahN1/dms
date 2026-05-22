/**
 * Validator for Dashboard Overview queries
 */
export class DashboardOverviewValidator {
  /**
   * Validate get dashboard overview request
   * Currently no parameters required; can extend in future for filters
   */
  static validateGetOverview(): void {
    // No validation needed for GET overview
    // In future, could validate optional query filters like:
    // - dateFrom, dateTo
    // - departmentId
    // - status filters
  }
}
