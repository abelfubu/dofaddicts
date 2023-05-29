import 'zone.js/node';
import './server/main';
export * from './src/main.server';
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
