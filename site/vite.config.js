import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Permite montar o index.html a partir de pedaços: <!-- @include sections/hero.html -->
// Cada seção do site vive em src/sections/<nome>.html|.css|.js
function htmlIncludes() {
  const src = resolve(__dirname, 'src');
  const expand = (html, depth = 0) =>
    html.replace(/<!--\s*@include\s+([\w/.-]+)\s*-->/g, (_, p) => {
      if (depth > 5) throw new Error('include recursivo: ' + p);
      return expand(readFileSync(resolve(src, p), 'utf8'), depth + 1);
    });
  return {
    name: 'lumini-html-includes',
    transformIndexHtml: { order: 'pre', handler: html => expand(html) },
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.html')) server.ws.send({ type: 'full-reload' });
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [htmlIncludes()],
  build: { target: 'es2020', assetsInlineLimit: 0, chunkSizeWarningLimit: 900 },
  server: { host: true },
});
