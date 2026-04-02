import { createServer } from 'http';
const server = createServer((req, res) => {
  if (req.url === '/health') { res.writeHead(200); res.end('ok'); return; }
  res.writeHead(200);
  res.end('Node app running');
});
server.listen(3000, () => console.log('Listening on :3000'));