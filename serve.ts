import { createServer } from 'node:http';
import { readFileSync, realpathSync, statSync } from 'node:fs';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = realpathSync(resolve(dirname(fileURLToPath(import.meta.url)), 'game'));
const port = Number(process.env.PORT || 4173);
const types: Record<string, string> = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.json': 'application/json' };
const server = createServer((request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url || '/', 'http://localhost').pathname);
    const local = resolve(root, '.' + pathname);
    if (local !== root && !local.startsWith(root + sep)) { response.writeHead(403).end(); return; }
    const target = realpathSync(statSync(local).isDirectory() ? resolve(local, 'index.html') : local);
    if (!target.startsWith(root + sep)) { response.writeHead(403).end(); return; }
    const body = readFileSync(target);
    response.writeHead(200, { 'Content-Type': types[extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'Content-Length': body.length });
    response.end(body);
  } catch { response.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found'); }
});
server.on('error', error => { console.error(`Riverlight server: ${error.message}`); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => console.log(`Riverlight: http://127.0.0.1:${port}`));
