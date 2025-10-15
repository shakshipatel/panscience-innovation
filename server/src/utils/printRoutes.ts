import { type Express } from "express";

// printRoutes.js
function getLayerPath(layer: any) {
  // Convert regexp like "^\\/api\\/?(?=\\/|$)" -> "/api"
  if (!layer.regexp) return '';
  let s = layer.regexp.source;
  s = s
    .replace('\\/?', '')
    .replace('(?=\\/|$)', '')
    .replace('^', '')
    .replace('\\/?$', '')
    .replace('$', '')
    .replace(/\\\//g, '/');
  return s === '' ? '' : (s.startsWith('/') ? s : '/' + s);
}

function collectRoutes(entry: Express) {
  const stack = entry._router ? entry._router.stack : entry.stack; // app or router
  const routes: Array<{ path: string; methods: string[] }> = [];

  function traverse(stack: any[], prefix = '') {
    stack.forEach(layer => {
      // Route handler (e.g., app.get('/x', ...))
      if (layer.route) {
        const path = prefix + layer.route.path;
        const methods = Object.keys(layer.route.methods).map(m => m.toUpperCase());
        routes.push({ path, methods });
      }
      // Mounted router (app.use('/api', router))
      else if (layer.name === 'router' && layer.handle && layer.handle.stack) {
        const mountPath = getLayerPath(layer) || '';
        traverse(layer.handle.stack, prefix + mountPath);
      }
      // middleware with a path (rare)
      else if (layer.name && layer.regexp && layer.regexp.source !== '^\\/?$') {
        const mountPath = getLayerPath(layer) || '';
        // middleware without explicit routes — show as middleware
        // routes.push({ path: prefix + mountPath + ' (middleware)', methods: [] });
      }
    });
  }

  traverse(stack, '');
  return routes;
}

// Usage:
// const express = require('express');
// const app = express();
// ... define routes ...
// console.log(collectRoutes(app));
export default collectRoutes;