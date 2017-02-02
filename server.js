"use strict";

/**
 * server.js
 * This file defines the server for a
 * simple photo gallery web app.
 */
 var http = require('http');
 var fs = require('fs');
 var port = 3000;

 var stylesheet = fs.readFileSync("gallery.css");

 var imageNames = ['ace.jpg', 'bubble.jpg', 'chess.jpg', 'fern.jpg', 'mobile.jpg']

function getImageNames(callback) {
  fs.readdir('images/', function(err, filenames) {
    if (err) {
      callback(err, undefined);
    }
    else {
      callback(false, filenames);
    }
  });
};

 function serveImage(filename, req, res) {
    var body = fs.readFile('images/' + filename, function(err, body){
      if (err) {
        res.statusCode = 404;
        res.statusMessage = "whoops";
        res.end("<h1>404: File Not Found!</h1>");
        console.error(err);
        return; //stop execution
      }
      res.setHeader("Content-Type", "image/jpeg");
      res.end(body);
    });
 }

function buildGallery(imageNames) {
  var html = '<!doctype html>';
  html += '<head>';
  html += '  <title>Gallery</title>';
  html += '  <link href="gallery.css" rel="stylesheet" type="text/css">';
  html += '</head>';
  html += '<body>';
  html += '  <h1>Gallery</h1>';
  html += `<div id="images">${imageNamesToTags(imageNames).join('')}</div>`;
  html += '  <h1>Hello.</h1> Time is ' + Date.now();
  html += '</body>';
  return html;
}

function serveGallery(req, res) {
  getImageNames(function (err, imageNames) {
    if (err) {
       res.statusCode = 500;
       res.statusMessage = 'Server Error';
       res.end();
       return;
    }
      res.setHeader('Content-Type', 'text/html');
      res.end(buildGallery(imageNames));
  });
}


 function imageNamesToTags(filenames) {
   return filenames.map(function (filename) {
     return `<img src="${filename}" alt="${filename}">`;
   });
 }
                                    //  => is lambda notation for a function
 var server = http.createServer((req, res) => {
   switch (req.url) {
     case '/':
     case '/gallery':
       serveGallery(req, res);
       break;
     case "/gallery.css":
       res.setHeader('Content-Type', 'text/css');
       res.end(stylesheet);
       break;
     default:
        serveImage(req.url, req, res);
   }
 })

 server.listen(port, function() {
   console.log("Listening on Port :" + port);
 });
