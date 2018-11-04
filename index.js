/*
 * Pirple Node.js Master Class
 * Homework Assignment #1
 * Nikolaos Bellias
 * nikolaos.bellias@gmail.com
 * 
 * Based on the primary file for the RESTful API
 * 
 */

//Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
const mathLib = require('./lib/math');
const proverbsLib = require('./lib/proverbs');

//Instantiate a HTTP server
const httpServer = http.createServer((req, res) => {
    unifiedServer(req, res);
});

//Start the HTTP server
httpServer.listen(config.httpPort, () => {
    console.log('The http server is listening on port ' + config.httpPort + ' in ' + config.envName + ' mode, now...');
});

//Instantiate a HTTPS server
const httpsServerOptions = {
    'key': fs.readFileSync('./sec/key.pem'),
    'cert': fs.readFileSync('./sec/cert.pem')
};
const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
    unifiedServer(req, res);
});

//Start the HTTP server
httpsServer.listen(config.httpsPort, () => {
    console.log('The secure http server is listening on port ' + config.httpsPort + ' in ' + config.envName + ' mode, now...');
});

//All the server logic for both http and https
const unifiedServer = (req, res) => {
    //Get the URL and parse it
    const parsedURL = url.parse(req.url, true);

    //Get the path
    const path = parsedURL.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    //Get the query string as an object
    const queryStringObject = parsedURL.query;

    //Get the http method
    const method = req.method.toLowerCase();

    //Get the headers as an object
    const headers = req.headers;

    //Get the payload, if any
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', (data) => {
        buffer += decoder.write(data);
    });
    req.on('end', () => {
        buffer += decoder.end();

        //Choose the handler this request should go to. If one is not found use the notFound handler.
        const chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        //Construct the data to send to the handler
        const data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': buffer
        };

        //Route the request to the handler specified in the router
        chosenHandler(data, (statusCode, payload) => {
            //Use the status code called back by the handler, or default to 
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;
            //Use the payload called back by the handler, or default to a
            payload = typeof (payload) == 'object' ? payload : {};
            //Convert the payload to a string
            const payloadString = JSON.stringify(payload);
            //Return the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
            //Log the request path
            console.log('Request received with this payload: ', statusCode, payloadString);
        });
    });
};

//Define proverb database
const myProverbs = {};

//Return a proverb randomly
myProverbs.printAProverb = () => {
    const allProverbs = proverbsLib.allProverbs();
    const numberOfProverbs = allProverbs.length;
    const randomNumber = mathLib.getRandomNumber(1,numberOfProverbs);
    const selectedProverb = allProverbs[randomNumber - 1];
    return selectedProverb;
};

//Define the handlers
const handlers = {};

//Hello handler
handlers.hello = (data, callback) => {
    //Callback a http status code, and payload object
    callback(200, {
        'welcome message': myProverbs.printAProverb()
    });
};

//Not found handler
handlers.notFound = (data, callback) => {
    callback(404);
};

//Define the request router
const router = {
    'hello': handlers.hello
};