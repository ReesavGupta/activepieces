import {
  createAction,
  Property,
  ActionContext,
} from '@activepieces/pieces-framework';

export const createPipeline = createAction({
  name: 'create pipeline',
  displayName: 'this is test',
  description: 'this is the test description',

  props: {
    pipeline_name: Property.ShortText({
      required: true,
      displayName: 'Pipeline Name',
      defaultValue: '',
    }),
  },

  async run(context: ActionContext) {
    const pipeline_name = context.propsValue['pipeline_name'] as string;

    const { authtoken } = context.auth as { authtoken: string };

    const response = await fetch(
      'http://darkgrey-gnu-475203.hostingersite.com/index.php/pipeline/save',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authtoken: String(authtoken),
        },
        body: JSON.stringify({
          pipeline_name,
        }),
      }
    );

    const result = await response.json();
    console.log('Server response:', result);
    return result;
  },
});

/*
********************************************************************************
********************************************************************************
********************************************************************************
********************************************************************************
********************************************************************************
PROJECT ACTIONS
********************************************************************************
********************************************************************************
********************************************************************************
********************************************************************************
********************************************************************************
*/

export const listAllProjects = createAction({
  name: 'list all projects',
  description: 'this action is used to list all the projects',
  displayName: 'list all projects',
  props: {},
  async run(context: ActionContext) {
    try {
      const { authtoken } = context.auth as { authtoken: string };

      const response = await fetch(
        'http://darkgrey-gnu-475203.hostingersite.com/index.php//api/projects/',
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            authtoken: String(authtoken),
          },
        }
      );
      const result = await response.json();
      return {
        message: 'Projects fetched successfully',
        projects: result,
      };
    } catch (error: unknown) {
      console.error('fetch failed:', error);
      throw new Error(
        `Failed to fetch all the projects: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  },
});

/*



title - Deep
client_id - 1
description - dawdawd
start_date- 2025-05-15
start_time - 1:00 AM
deadline - 2025-05-22
price - 2500



*/
export const createProject = createAction({
  description: 'create a new project',
  displayName: 'create Project',
  name: 'Create Project',
  props: {
    title: Property.ShortText({
      displayName: 'Title',
      required: true,
      defaultValue: '',
    }),
    client_id: Property.ShortText({
      displayName: 'Client ID',
      required: true,
      defaultValue: '1',
    }),
    start_date: Property.ShortText({
      displayName: 'Start Date',
      required: true,
      defaultValue: new Date().toDateString(),
    }),
    description: Property.ShortText({
      displayName: 'Project Description',
      required: false,
      defaultValue: '',
    }),

    deadline: Property.ShortText({
      displayName: 'Project Deadline',
      required: false,
      defaultValue: new Date().toDateString(),
    }),
    price: Property.ShortText({
      displayName: 'Price',
      required: false,
      defaultValue: '0.00',
    }),
  },
  async run(context: ActionContext) {
    try {
      const title = context.propsValue['title'] as string;
      const start_date = context.propsValue['start_date'] as string;
      const description = context.propsValue['description'] as string;
      const deadline = context.propsValue['deadline'] as string;
      const price = context.propsValue['price'] as string;
      const client_id = context.propsValue['client_id'] as string;

      const { rise_csrf_cookie, ci_session, authtoken } = context.auth as {
        rise_csrf_cookie: string;
        ci_session: string;
        authtoken: string;
      };

      const body = new URLSearchParams({
        title,
        start_date,
        description,
        deadline,
        price,
        client_id: String(client_id),
      });

      console.log(
        `\n\n\n\n\n\n\n\n\n\nthis is the request body:`,
        body.toString(),
        '\n\n\n\n\n\n\n\n',
        'this si ci session:',
        ci_session,
        'this is csrf:',
        rise_csrf_cookie,
        '\n\n\n\n\n\n\n\n'
      );

      const response = await fetch(
        'http://darkgrey-gnu-475203.hostingersite.com/index.php/projects/save',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            cookie: `rise_csrf_cookie=${rise_csrf_cookie}; ci_session=${ci_session}`,
            // authtoken: authtoken,
          },
          body: body.toString(),
        }
      );

      const result = await response.json();
      return result;
    } catch (error: unknown) {
      console.error('poject creation failed:', error);
      throw new Error(
        `Failed to create the project: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  },
});
