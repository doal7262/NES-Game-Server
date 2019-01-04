// app.js
var express = require('express');  
var app = express();  
var port = process.env.PORT || 4200 
var io = require('socket.io').listen(app.listen(port));

app.use(express.static(__dirname + '/bower_components'));  
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(client) {  
    console.log('Client connected...');

    client.on('join', function(data) {
        console.log(data);
    });

    client.on('messages', function(data) {
           client.emit('broad', data);
           client.broadcast.emit('broad',data);
    });
});

console.log("localhost:" + port)  