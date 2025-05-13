import {
  createAction,
  Property,
  ActionContext,
} from '@activepieces/pieces-framework';
import { OpenAI } from 'openai';
import { QdrantClient } from '@qdrant/js-client-rest';
import { randomUUID } from 'crypto';

export const generateEmbedding = createAction({
  name: 'generate_embedding',
  displayName: 'Generate & Store Embedding',
  description: 'Creates embedding from text and stores in Qdrant',
  props: {
    text: Property.LongText({
      displayName: 'Text to Embed',
      required: true,
    }),
    qdrantHost: Property.ShortText({
      displayName: 'Qdrant Host URL',
      required: true,
    }),
    collectionName: Property.ShortText({
      displayName: 'Qdrant Collection Name',
      required: true,
    }),
    dimension: Property.Number({
      displayName: 'Embedding Dimension',
      description:
        'Dimension of the embedding (e.g., 1536 for text-embedding-ada-002)',
      required: true,
      defaultValue: 1536,
    }),
  },
  async run(context: ActionContext) {
    try {
      const text = context.propsValue['text'] as string;
      const qdrantHost = context.propsValue['qdrantHost'] as string;
      const collectionName = context.propsValue['collectionName'] as string;
      const dimension = context.propsValue['dimension'] as number;

      console.log(
        `\n\n\n this is the context.propesValue: `,
        context.propsValue,
        `\n\n\n`
      );

      const { openaiApiKey, qdrantApiKey } = context.auth as {
        openaiApiKey: string;
        qdrantApiKey: string;
      };

      // Create OpenAI client
      const openai = new OpenAI({
        apiKey: openaiApiKey,
      });

      // Generate embedding
      const embeddingResponse = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: text,
      });

      const vector = embeddingResponse.data[0].embedding;

      // Create Qdrant client
      const qdrant = new QdrantClient({
        url: qdrantHost,
        apiKey: qdrantApiKey,
      });

      // Create collection if needed

      const collectionExists = await qdrant.getCollection(collectionName);
      if (!collectionExists) {
        await qdrant
          .createCollection(collectionName, {
            vectors: {
              size: dimension,
              distance: 'Cosine',
            },
          })
          .catch((error: Error) => {
            if (!error.message.includes('already exists')) {
              throw error;
            }
          });
      }

      const id = randomUUID();

      // Store vector
      await qdrant.upsert(collectionName, {
        wait: true,
        points: [
          {
            id,
            vector,
            payload: { text },
          },
        ],
      });

      return {
        message: 'Embedding stored successfully',
        embeddingId: id,
        vectorLength: vector.length,
      };
    } catch (error: unknown) {
      console.error('Embedding generation failed:', error);
      throw new Error(
        `Failed to generate and store embedding: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  },
});
