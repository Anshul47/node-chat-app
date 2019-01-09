var socket = io();

socket.on('connect', function() {
  console.log('User Connected to server');

});

socket.on('disconnect', function() {
  console.log('User Disconnected to server');
});

socket.on('newMessage', function(message) {
  // console.log('From: '+message.from);
  // console.log('Text: '+message.text);
  // console.log('Created: '+message.createdAt);
  var li = $('<li></li>');
  li.text(`${message.from}: ${message.text}`);
  $('#messages').append(li);
});

$('#message-form').on('submit', function (e){
  e.preventDefault();

  socket.emit('createMessage', {
    from: $('#username').val(),
    text: $('#message').val(),
    createdAt: new Date().getTime()
  }, function (data) {
    //console.log('Got it '+data.msg);
    $('#message').val('');
  });

})