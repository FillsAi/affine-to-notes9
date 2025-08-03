// Mixpanel completely disabled for air-gap deployment
function createMixpanel() {
  const noOpHandler = {
    get() {
      return () => {}; // Return no-op function for all methods
    },
  };

  // Air-gap deployment: Create proxy for disabled mixpanel
  new Proxy({}, noOpHandler);

  const wrapped = {
    init() {
      console.log('Mixpanel disabled for local deployment');
    },
    track: () => {},
    track_pageview: () => {},
    identify: () => {},
    register: () => {},
    reset: () => {},
    opt_out_tracking: () => {},
    opt_in_tracking: () => {},
    people: {
      set: () => {},
    },
    middleware: () => ({ unsubscribe: () => {} }),
  };

  return wrapped;
}

export const mixpanel = createMixpanel();
