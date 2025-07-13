import serverless from 'serverless-http';
import app from './app.js';

export const handler = serverless(app, {
  binary: false,
  request: (request, event, context) => {
    // Parse body before Express gets it
    if (event.body && typeof event.body === 'string') {
      try {
        request.body = JSON.parse(event.body);
      } catch (e) {
        console.error('Body parsing failed:', e);
      }
    }
  }
});
