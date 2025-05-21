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
      rise_csrf_cookie: PieceAuth.SecretText({
        displayName: 'Auth Token',
        required: true,
      }),
      ci_session: PieceAuth.SecretText({
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
