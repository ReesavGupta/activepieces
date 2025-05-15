import { createPiece, PieceAuth } from '@activepieces/pieces-framework';
import { createPipeline, listAllProjects, createProject } from './lib/actions';
export const test = createPiece({
  displayName: 'Test',
  auth: PieceAuth.CustomAuth({
    description: 'Add the token',
    required: true,
    props: {
      authtoken: PieceAuth.SecretText({
        displayName: 'Auth Token',
        required: true,
      }),
    },
  }),
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/test.png',
  authors: ['reesav'],
  actions: [createPipeline, listAllProjects, createProject],
  triggers: [],
});

// this is not working we need to fix this and also see why the req is not going through.
