const http = require('http');
function jsonMiddleware(req, res, next) {
    let body = '';
    req.on('data', chunk => {
        body += chunk;
    });
    req.on('end', () => {
        if (body) {
            try {
                req.body = JSON.parse(body);
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        }
        next();
    });
}

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/hello') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        return res.end('Hello, World!');
    }
    
    if (req.method === 'POST' && req.url === '/data') {
        jsonMiddleware(req, res, () => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ received: req.body }));
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
