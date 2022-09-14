const http = require('http');
http.createServer(function (request,response){
    response.writeHead(200,{'Content-Type': 'text/html'});
    response.end('<h1>hello world</h1>')
}).listen(8888);

console.log('Server running at http://127.0.0.1:8888/')
