import {
  createPiece,
  PieceAuth,
  Property,
} from '@activepieces/pieces-framework';
import { onLeadAdded } from './lib/triggers/on-lead-added';

export const omx = createPiece({
  displayName: 'Omx',
  auth: PieceAuth.CustomAuth({
    description: 'Enter your API base URL and Bearer token',
    required: true,
    props: {
      baseUrl: Property.ShortText({
        displayName: 'Base URL',
        description: 'The base URL of your CRM API',
        required: true,
      }),
      token: PieceAuth.SecretText({
        displayName: 'Bearer Token',
        description: 'API token for your CRM',
        required: true,
      }),
    },
  }),
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/omx.png',
  authors: ['Reesav Gupta'],
  actions: [],
  triggers: [onLeadAdded],
});
