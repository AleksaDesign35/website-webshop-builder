/**
 * Error Tracking Utility
 * 
 * This module provides error tracking functionality.
 * You can integrate with services like:
 * - Sentry (https://sentry.io)
 * - LogRocket (https://logrocket.com)
 * - Bugsnag (https://www.bugsnag.com)
 * - Rollbar (https://rollbar.com)
 */

interface ErrorContext {
  userId?: string;
  userEmail?: string;
  url?: string;
  userAgent?: string;
  timestamp?: string;
  [key: string]: unknown;
}

class ErrorTracker {
  private initialized = false;

  /**
   * Initialize error tracking service
   * Example for Sentry:
   * 
   * import * as Sentry from '@sentry/nextjs';
   * 
   * Sentry.init({
   *   dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
   *   environment: process.env.NODE_ENV,
   *   tracesSampleRate: 1.0,
   * });
   */
  init() {
    if (this.initialized) {
      return;
    }

    // Example: Initialize Sentry
    // if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    //   import('@sentry/nextjs').then((Sentry) => {
    //     Sentry.init({
    //       dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    //       environment: process.env.NODE_ENV,
    //       tracesSampleRate: 1.0,
    //     });
    //   });
    // }

    this.initialized = true;
  }

  /**
   * Capture an exception
   */
  captureException(error: Error, context?: ErrorContext) {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error captured:', error, context);
    }

    // Example: Send to Sentry
    // if (typeof window !== 'undefined') {
    //   import('@sentry/nextjs').then((Sentry) => {
    //     Sentry.captureException(error, {
    //       contexts: {
    //         custom: context || {},
    //       },
    //     });
    //   });
    // }

    // You can also send to your own API endpoint
    // fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     error: {
    //       message: error.message,
    //       stack: error.stack,
    //       name: error.name,
    //     },
    //     context: {
    //       ...context,
    //       url: window.location.href,
    //       userAgent: navigator.userAgent,
    //       timestamp: new Date().toISOString(),
    //     },
    //   }),
    // }).catch(console.error);
  }

  /**
   * Capture a message
   */
  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: ErrorContext) {
    if (process.env.NODE_ENV === 'development') {
      console[level === 'error' ? 'error' : level === 'warning' ? 'warn' : 'log'](message, context);
    }

    // Example: Send to Sentry
    // if (typeof window !== 'undefined') {
    //   import('@sentry/nextjs').then((Sentry) => {
    //     Sentry.captureMessage(message, {
    //       level: level as Sentry.SeverityLevel,
    //       contexts: {
    //         custom: context || {},
    //       },
    //     });
    //   });
    // }
  }

  /**
   * Set user context
   */
  setUser(userId: string, email?: string, additionalData?: Record<string, unknown>) {
    // Example: Set user in Sentry
    // if (typeof window !== 'undefined') {
    //   import('@sentry/nextjs').then((Sentry) => {
    //     Sentry.setUser({
    //       id: userId,
    //       email,
    //       ...additionalData,
    //     });
    //   });
    // }
  }

  /**
   * Clear user context
   */
  clearUser() {
    // Example: Clear user in Sentry
    // if (typeof window !== 'undefined') {
    //   import('@sentry/nextjs').then((Sentry) => {
    //     Sentry.setUser(null);
    //   });
    // }
  }
}

export const errorTracker = new ErrorTracker();

// Auto-initialize in browser
if (typeof window !== 'undefined') {
  errorTracker.init();
}

