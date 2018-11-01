/*
 * Pirple Node.js Master Class
 * Homework Assignment #1
 * Nikolaos Bellias
 * nikolaos.bellias@gmail.com
 * 
 * 
*/

const http = require('http');

const httpServer = http.createServer((req,res)=>{
    console.log("Request..." + req.headers);
    //Send the response
    res.end('Hello World\n');
});

httpServer.listen(3000, ()=>{
    console.log("HTTP Server is listening on port 3000...");
});