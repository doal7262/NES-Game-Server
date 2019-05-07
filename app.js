// This is the server-side file of our mobile remote controller app.
// It initializes socket.io and a new express instance.
// Start it by running 'node app.js' from your terminal.

// Dependencies
var http = require('http');
var io = require('socket.io');

// Creating an express server
var express = require('express'),
    app = express();

// Import the Anagrammatix game file
// Import the Anagrammatix game file.
var nes = require('./nesgame');

// This is needed if the app is run on heroku and other cloud providers:

var server = require('http').createServer(app).listen(process.env.PORT || 8080);

// Initialize a new socket.io object. It is bound to 
// the express app, which allows them to coexist.

var io = require('socket.io').listen(app.listen(server));

// App Configuration

// Make the files in the public folder available to the world
app.use(express.static(__dirname + '/public/'));

// Initialize a new socket.io application
app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});


// When a client connects...
io.sockets.on('connection', function(socket)
{
   // Confirm the connection
   socket.emit("welcome", {});
   nes.initGame(io, socket);
});

console.log('Your presentation is running on http://localhost:' + server);