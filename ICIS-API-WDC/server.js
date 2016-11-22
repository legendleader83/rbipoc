var http = require('http');
var fs = require('fs');
var url = require('url');

var apiHostname = 'api.icis.com'

http.createServer(function (request, response) {

	// Parse the request containing file name
	var pathname = url.parse(request.url).pathname;
	
	// Print the name of the file for which request is made.
	console.log(new Date() + "Request for " + pathname + " received.");
	
	if (pathname.startsWith("/api/")) {
		
		var options = {
			hostname: '127.0.0.1', // using Fiddler
			port: 8888,
			protocol: 'http:',
			path: 'https://' + apiHostname + pathname.substring(4),
			method: request.method,
			headers: request.headers
		};
		
		var proxy_request = http.request(options);
		
		proxy_request.on('response', function (proxy_response) {
			
			proxy_response.on('data', function (chunk) {
				response.write(chunk, 'binary');
			});
			
			proxy_response.on('end', function () {
				response.end();
			});
			
			response.writeHead(proxy_response.statusCode, proxy_response.headers);
		});
		
		request.on('data', function (chunk) {
			proxy_request.write(chunk, 'binary');
		});
		
		request.on('end', function () {
			proxy_request.end();
		});
	}
	else {
		
		// Read the requested file content from file system
		fs.readFile(pathname.substr(1), function (err, data) {
			if (err) {
				console.log(err);
				// HTTP Status: 404 : NOT FOUND
				// Content Type: text/plain
				response.writeHead(404, { 'Content-Type': 'text/html' });
			} else {
				//Page found	  
				// HTTP Status: 200 : OK
				// Content Type: text/plain
				response.writeHead(200, { 'Content-Type': 'text/html' });
				
				// Write the content of the file to response body
				response.write(data.toString());
			}
			// Send the response body 
			response.end();
		});
	}

}).listen(8080);

console.log("Listening on port 8080...");