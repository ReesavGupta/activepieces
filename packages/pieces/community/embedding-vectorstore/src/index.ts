import {
  createPiece,
  PieceAuth,
  Property,
} from '@activepieces/pieces-framework';
import { generateEmbedding } from './lib/generate-embeddings';

export const embeddingVectorstore = createPiece({
  displayName: 'Embedding Vectorstore',
  auth: PieceAuth.CustomAuth({
    description: 'Authenticate with OpenAI and Qdrant',
    required: true,
    props: {
      openaiApiKey: PieceAuth.SecretText({
        displayName: 'OpenAI API Key',
        required: true,
      }),
      qdrantApiKey: PieceAuth.SecretText({
        displayName: 'Qdrant API Key',
        required: true,
      }),
    },
  }),
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/embedding-vectorstore.png',
  authors: ['Reesav Gupta'],
  description:
    'Generate text embeddings and store them in Qdrant vector database',
  actions: [generateEmbedding],
  triggers: [],
});
