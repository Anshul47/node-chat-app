var socket = io();

socket.on('connect', function() {
  console.log('User Connected to server');

});

socket.on('disconnect', function() {
  console.log('User Disconnected to server');
});

socket.on('newMessage', function(message) {
  console.log('From: '+message.from);
  console.log('Text: '+message.text);
  console.log('Created: '+message.createdAt);
});

socket.emit('createMessage', {
  from: 'Anshul',
  text: 'Hi',
  createdAt: new Date().getTime()
});