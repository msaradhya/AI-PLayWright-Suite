/**
 * Hoonuit Shared Exceptions Module Exports
 * Index file for easy importing of exception classes
 * 
 * This module provides TypeScript equivalents of Java exception classes
 * from the psqa.hoonuit.shared.exceptions package, maintaining the same
 * inheritance hierarchy and constructor patterns.
 * 
 * Inheritance Structure:
 * - Error (JavaScript built-in)
 *   ├── HoonuitException (base exception with dual constructors)
 *   │   ├── HoonuitDialogTimeoutException
 *   │   ├── HoonuitPageTimeoutException
 *   │   └── HoonuitTableException
 *   └── HoonuitApiException (extends Error directly, like Java RuntimeException)
 * 
 * All exceptions support both single-parameter (message) and dual-parameter
 * (message + cause) constructors for consistency and flexibility.
 */

// Base Exception (extends Error, equivalent to Java RuntimeException)
export { HoonuitException } from './HoonuitException';

// API Exception (extends Error directly, matches Java inheritance pattern)
export { HoonuitApiException } from './HoonuitApiException';

// Timeout Exceptions (extend HoonuitException)
export { HoonuitDialogTimeoutException } from './HoonuitDialogTimeoutException';
export { HoonuitPageTimeoutException } from './HoonuitPageTimeoutException';

// Table Exception (extends HoonuitException)
export { HoonuitTableException } from './HoonuitTableException';

// Import types for the union type
import type { HoonuitException } from './HoonuitException';
import type { HoonuitApiException } from './HoonuitApiException';
import type { HoonuitDialogTimeoutException } from './HoonuitDialogTimeoutException';
import type { HoonuitPageTimeoutException } from './HoonuitPageTimeoutException';
import type { HoonuitTableException } from './HoonuitTableException';

// Type definitions for convenience
export type HoonuitExceptionType = 
  | HoonuitException
  | HoonuitApiException
  | HoonuitDialogTimeoutException
  | HoonuitPageTimeoutException
  | HoonuitTableException;