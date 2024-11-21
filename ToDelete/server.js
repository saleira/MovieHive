const http = require('http'),
    fs = require('fs'),
    url = require('url');

http.createServer((req, res) => { //Create a server object
    let addr = req.url; // Refers to the URL path of the incoming request. For example, if a client requests http://localhost:8080/default.html, req.url = /default.html
    let q = new URL(addr, 'http://' + req.headers.host); 
    let filePath = '';

    fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Added to log.');
        }
    });


    if (q.pathname.includes('documentation')) {
        filePath = (__dirname + '/documentation.html');
    } else {
        filePath = 'index.html';
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }
    });
    
}).listen(8080);

console.log('My test server is running on Port 8080.');