import {
  OAuthProviderType,
  ServerDeploymentType,
  ServerFeature,
} from '@affine/graphql';

import type { ServerConfig, ServerMetadata } from './types';

// Force self-hosted mode - remove all external Affine connections
export const BUILD_IN_SERVERS: (ServerMetadata & { config: ServerConfig })[] = [
  {
    id: 'local-server',
    baseUrl: 'http://localhost:3010', // Only local server
    config: {
      serverName: 'Local AFFiNE Server',
      features: [
        ServerFeature.LocalWorkspace,
        // Remove cloud features
      ],
      oauthProviders: [], // Disable OAuth
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
