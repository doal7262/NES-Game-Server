// This is the server-side file of our mobile remote controller app.
// It initializes socket.io and a new express instance.
// Start it by running 'node app.js' from your terminal.

// Dependencies
var http = require('http');
var io = require('socket.io')
var crypto = require('crypto');

// Creating an express server

var express = require('express'),
    app = express();

// This is needed if the app is run on heroku and other cloud providers:

var port = process.env.PORT || 8080;

// Initialize a new socket.io object. It is bound to 
// the express app, which allows them to coexist.

var io = require('socket.io').listen(app.listen(port));

// App Configuration

// Make the files in the public folder available to the world
app.use(express.static(__dirname + '/public'));

// This is a secret key that prevents others from opening your presentation
// and controlling it. Change it to something that only you know.

var secret = 'kittens';
var socketCodes = {};

// Initialize a new socket.io application
app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

// When a client connects...
io.sockets.on('connection', function(socket) 
{
   // Confirm the connection
   socket.emit("welcome", {});
   
   
   // Receive the client device type
   socket.on("device", function(device)
   {
      // if client is a browser game
      if(device.type == "game")
      {
         // Generate a code
         var gameCode = crypto.randomBytes(3).toString('hex');
         
         // Ensure uniqueness
         while(gameCode in socketCodes)
         {
            gameCode = crypto.randomBytes(3).toString('hex');
         }
         
         // Store game code -> socket association
         socketCodes[gameCode] = io.sockets.sockets[socket.id];
         socket.gameCode = gameCode
         
         // Tell game client to initialize 
         //  and show the game code to the user
         socket.emit("initialize", gameCode);
      }
      // if client is a phone controller
      else if(device.type == "controller")
      {
         // if game code is valid...
         if(device.gameCode in socketCodes)
         {
            // save the game code for controller commands
            socket.gameCode = device.gameCode

            // initialize the controller
            socket.emit("connected", {});
            
            // start the game
            socketCodes[device.gameCode].emit("connected", {});
         }
         // else game code is invalid, 
         //  send fail message and disconnect
         else
         {
            socket.emit("fail", {});
            socket.disconnect();
         }
      }
   });
   
   // send turn command to game client
   socket.on("turn", function(data)
   {
      if(socket.gameCode && socket.gameCode in socketCodes)
      {
         socketCodes[socket.gameCode].emit("turn", data.turn);
      }
   });
});


// When a client disconnects...
io.sockets.on('disconnect', function(socket) 
{
   // remove game code -> socket association on disconnect
   if(socket.gameCode && socket.gameCode in socketCodes)
   {
      delete socketCodes[socket.gameCode];
   }
});

/* OLD CODE, STILL USEABLE UNTIL NEW VERSION WORKS

var presentation = io.on('connection', function (socket) {

    // A new client has come online. Check the secret key and 
    // emit a "granted" or "denied" message.

    socket.on('load', function(data){

        socket.emit('access', {
            access: (data.key === secret ? "granted" : "denied")
        });

    });

    // Clients send the 'slide-changed' message whenever they navigate to a new slide.

    socket.on('slide-changed', function(data){

        // Check the secret key again

        if(data.key === secret) {

            // Tell all connected clients to navigate to the new slide

            presentation.emit('navigate', {
                hash: data.hash
            });
        }
    });
});
*/

console.log('Your presentation is running on http://localhost:' + port);