/**
 * Policy for registration authorization
 * Contains RBAC checks
 */
export class RegisterPolicy {
  /**
   * Check if user can register
   * This is typically always true for public registration
   */
  static canRegister(): boolean {
    return true;
  }

  /**
   * Check if organization registration is allowed
   */
  static canRegisterAsOrganization(): boolean {
    // This could be controlled by feature flag or configuration
    return true;
  }
}
