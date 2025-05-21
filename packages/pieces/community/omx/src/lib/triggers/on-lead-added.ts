import {
  createTrigger,
  Property,
  TriggerStrategy,
} from '@activepieces/pieces-framework';
import { onLeadAddsampleData } from '../../constants/constants';

const liveMarkdown = `**Live URL:**
\`\`\`text
{{webhookUrl}}
\`\`\`
generate sample data & triggers published flow.

`;

export const onLeadAdded = createTrigger({
  name: 'on-lead-added',
  displayName: 'on-lead-added',
  description: 'Triggers when a new lead is added to a pipeline.',
  props: {
    liveMd: Property.MarkDown({ value: liveMarkdown }),
  },
  sampleData: onLeadAddsampleData,
  type: TriggerStrategy.WEBHOOK,
  async onEnable(context) {
    // console.log(webhookUrl);
    try {
      const webHURl = context.webhookUrl;
      const auth = context.auth as {
        baseUrl: string;
        token: string;
      };

      console.log('this is webhook url  : ', webHURl);
      console.log('this is auth:', auth);

      if (!auth) {
        return;
      }
      const response = await fetch(`${auth.baseUrl}/api/webhooks`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'lead.added',
          targetUrl: webHURl,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to register webhook: ${response.statusText}`);
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Webhook registration failed: ${response.status} ${errorText}`
        );
      }

      const data = await response.json();
      console.log(`this is the data: `, data);
      // Return the webhook ID for later use when disabling
      // return {
      //   webhookId: data.id,
      // };
    } catch (error) {
      console.error('Failed to register webhook:', error);
    }
  },
  async onDisable(context) {
    // implement webhook deletion logic
  },
  async run(context) {
    return [context.payload.body];
  },
});
