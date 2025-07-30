const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // If index.html doesn't exist, try to serve the HTML file in the directory
        fs.readdir('.', (err, files) => {
          if (err) {
            res.writeHead(500);
            res.end('Server Error');
            return;
          }
          
          const htmlFile = files.find(file => file.endsWith('.html'));
          if (htmlFile) {
            fs.readFile(htmlFile, (readError, htmlContent) => {
              if (readError) {
                res.writeHead(404);
                res.end('File not found');
              } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(htmlContent, 'utf-8');
              }
            });
          } else {
            res.writeHead(404);
            res.end('No HTML file found');
          }
        });
      } else {
        res.writeHead(500);
        res.end('Server Error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': mimeType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});