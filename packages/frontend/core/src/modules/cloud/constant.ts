import { ServerDeploymentType, ServerFeature } from '@affine/graphql';

import type { ServerConfig, ServerMetadata } from './types';

// Force self-hosted mode - remove all external Affine connections
export const BUILD_IN_SERVERS: (ServerMetadata & { config: ServerConfig })[] = [
  {
    id: 'local-server',
    baseUrl: process.env.AFFINE_SERVER_EXTERNAL_URL || 'http://localhost:3010', // Dynamic server URL
    config: {
      serverName: 'notes9 Research Platform',
      features: [
        ServerFeature.LocalWorkspace,
        // Remove cloud features
      ],
      oauthProviders: ['oidc'], // Enable Auth0 via OIDC
      type: ServerDeploymentType.Selfhosted,
      credentialsRequirement: {
        password: {
          minLength: 8,
          maxLength: 32,
        },
      },
    },
  },
];
