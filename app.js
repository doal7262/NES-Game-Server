// This is the server-side file of our mobile remote controller app.
// It initializes socket.io and a new express instance.
// Start it by running 'node app.js' from your terminal.

// Dependencies
var http = require('http');
var socket = require('socket.io');
var crypto = require('crypto');

// Creating an express server

var express = require('express');

// This is needed if the app is run on heroku and other cloud providers:

var port = process.env.PORT || 8080;

// App setup
var app = express();
var server = app.listen(port, function(){
   console.log('listen to requests on port 8080');
});

// Make the files in the public folder available to the world
app.use(express.static(__dirname + '/public/'));

// Socket setup
var io = socket(server);

io.on('connection', function(socket){
   console.log('made socket connection', socket.id); // Can view connections made in cmd line

   socket.on('chat', function(data){
      io.sockets.emit('chat', data);
   });
});

/* // This is a secret key that prevents others from opening your presentation
// and controlling it. Change it to something that only you know.

var socketCodes = {};

// Initialize a new socket.io application
app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

// usernames which are currently connected to the chat
var usernames = {};

// rooms which are currently available in chat
var rooms = ['room1', 'room2', 'room3'];

// When a client connects...
io.sockets.on('connection', function(socket)
{
   // Confirm the connection
   socket.emit("welcome", {});

   // when the client emits 'adduser', this listens and executes
   socket.on('adduser', function(username)
   {
        // store the username in the socket seesion for this client
        socket.username = username;
        // store the room name in the socket session for this client
        socket.room = 'room1';
        // add the client's username to the global list
        usernames[username] = username;
        // send client to room 1
        socket.join('room1');
        // echo to client they've connected
        socket.emit('updatechat', 'SERVER', 'you have connected to room1');
        // echo to room 1 that a person has connected to their room
        socket.broadcast.to('room1').emit('updatechat', 'SERVER', username + ' has connected to this room');
        socket.emit('updaterooms', rooms, 'room1');
   });

	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', function (data) {
		// we tell the client to execute 'updatechat' with 2 parameters
		io.sockets.in(socket.room).emit('updatechat', socket.username, data);
	});
	
	socket.on('switchRoom', function(newroom){
		socket.leave(socket.room);
		socket.join(newroom);
		socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);
		// sent message to OLD room
		socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has left this room');
		// update socket session room title
		socket.room = newroom;
		socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this room');
		socket.emit('updaterooms', rooms, newroom);
    });
    
    socket.on('joinRoom', function(newroom){
        socket.join(newroom);
        socket.room = newroom;
        socket.emit('updaterooms', rooms, newroom);
    });
    
   // Receive the client device type
   socket.on("device", function(device)
   {
      // if client is a browser game
      if(device.type === "game")
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
          socket.gameCode = gameCode;
         
         // Tell game client to initialize 
         //  and show the game code to the user
         socket.emit("initialize", gameCode);
      }
      // if client is a phone controller
      else if(device.type === "controller")
      {
         // if game code is valid...
         if(device.gameCode in socketCodes)
         {
            // save the game code for controller commands
             socket.gameCode = device.gameCode;

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

console.log('Your presentation is running on http://localhost:' + port); */