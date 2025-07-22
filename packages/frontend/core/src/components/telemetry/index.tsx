import React, { useEffect } from 'react';

export function Telemetry() {
  useEffect(() => {
    // Telemetry completely disabled for air-gap deployment
    console.log('Telemetry disabled - no external tracking');
  }, []);

  return null;
}
