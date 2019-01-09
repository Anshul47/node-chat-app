var socket = io();

socket.on('connect', function() {
  console.log('User Connected to server');

});

socket.on('disconnect', function() {
  console.log('User Disconnected to server');
});

socket.on('newMessage', function(message) {
  // console.log('Created: '+message.createdAt);
  var li = $('<li></li>');
  li.text(`${message.from}: ${message.text}`);
  $('#messages').append(li);
});

socket.on('newLocationMessage', function(message) {
  // console.log('Created: '+message.createdAt);
  var li = $(`<li>${message.from}: <a target="_blank" href="https://www.google.com/maps?q=${message.text.lat},${message.text.lng}">My Current Location</a></li>`);
  //li.text(``);
  $('#messages').append(li);
});

function sendMessage(from, text){
  socket.emit('createMessage', {
    from,
    text,
    createdAt: new Date().getTime()
  }, function (data) {
    //console.log('Got it '+data.msg);
    $('#message').val('');
  });
}

function sendLocationMessage(from, locationObj){
  socket.emit('createLocationMessage', {
    from,
    locationObj,
    createdAt: new Date().getTime()
  }, function (data) {
    $('#message').val('');
  });
}

$('#message-form').on('submit', function (e){
  e.preventDefault();
  sendMessage($('#username').val(), $('#message').val());
});

var locationButton = $('#loction-button');

locationButton.on('click', function (e){
  
  if(!navigator.geolocation){
    return alert('geolocation not supported by your browser');
  }

  locationButton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function (position){
    
    //console.log(position);
    var locationObj = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    }
    locationButton.removeAttr('disabled').text('Send location');
    sendLocationMessage($('#username').val(), locationObj);
  }, function (){
    alert('Unale to fetch location');
    locationButton.removeAttr('disabled').text('Send location');
  });
});