/**
 * User interface for test user configuration
 */
export interface User {
  userName: string;
  password: string;
  role?: string;
  district?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}