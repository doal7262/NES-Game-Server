// Make Connection
var socket = io.connect('http://localhost:8080/nes-index.html');
console.log('testing to make sure we reach this page');

// Query DOM
var message = document.getElementById('message'),
    character_name = document.getElementById('character-name'),
    btn = document.getElementById('send'),
    output = document.getElementById('chat-dump');

// Emit Events
try {
    btn.addEventListener('click'), function(){
        socket.emit('chat', {
            message: message.value,
            character_name: character_name.value
        });
    });
} catch (error) {
    console.log('something broke');
}

// Listen for events
socket.on('chat', function(data){
    output.innerHTML += '<p><strong>' + data.character_name + ': </strong>' + data.message + '</p>';
})