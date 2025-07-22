import React from 'react';

// Sentry completely disabled for air-gap deployment
function createSentry() {
  const wrapped = {
    init() {
      console.log('Sentry disabled for local deployment');
    },
    enable() {
      console.log('Sentry remains disabled');
    },
    disable() {
      console.log('Sentry disabled');
    },
  };

  return wrapped;
}

export const sentry = createSentry();
export const SentryErrorBoundary = ({
  children,
}: {
  children: React.ReactNode;
}) => children;
