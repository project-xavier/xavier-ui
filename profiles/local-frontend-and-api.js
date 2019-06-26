/*global module*/

const SECTION = 'staging';
const APP_ID = 'migration-analytics';
const FRONTEND_PORT = 8002;
const API_PORT = 8080;
const routes = {};


routes[`/beta/${SECTION}/${APP_ID}`] = { host: `http://localhost:${FRONTEND_PORT}` };
routes[`/${SECTION}/${APP_ID}`]      = { host: `http://localhost:${FRONTEND_PORT}` };
routes[`/beta/apps/${APP_ID}`]       = { host: `http://localhost:${FRONTEND_PORT}` };
routes[`/apps/${APP_ID}`]            = { host: `http://localhost:${FRONTEND_PORT}` };

routes[`/api/xavier`] = { host: `http://localhost:${API_PORT}` };
// routes[`/api/xavier`] = { host: `http://analytics-integration-ma.127.0.0.1.nip.io` };

module.exports = { routes };
