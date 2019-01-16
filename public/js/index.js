var socket = io();

function scrollToBottom() {
  var messages = $('#messages');
  
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');

  var newMessage = messages.children('li:last-child');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', function() {
  console.log('User Connected to server');
});

socket.on('disconnect', function() {
  console.log('User Disconnected to server');
});

/* ********************** New Chat Recive *************************** */


socket.on('newMessage', function(message) {
  var template = $('#message-temp').html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: message.createdAt
  });
  $('#messages').append(html);
  scrollToBottom();
  /*var li = $('<li></li>');
  li.text(`${message.from} ${message.createdAt}: ${message.text}`);*/
});

/* ********************** New Location Recive *************************** */

socket.on('newLocationMessage', function(message) {
  var url = `https://www.google.com/maps?q=${message.text.lat},${message.text.lng}`;
  var template = $('#location-message-temp').html();
  var html = Mustache.render(template, {
    text: url,
    from: message.from,
    createdAt: message.createdAt
  });
  $('#messages').append(html);
  scrollToBottom();
  //var li = $(`<li>${message.from} ${message.createdAt}: <a target="_blank" href="https://www.google.com/maps?q=${message.text.lat},${message.text.lng}">My Current Location</a></li>`);
  //li.text(``);
  //$('#messages').append(li);
});

/* ********************** Send Chat *************************** */

$('#message-form').on('submit', function (e){
  e.preventDefault();
  sendMessage($('#username').val(), $('#message').val());
});

function sendMessage(from, text){
  socket.emit('createMessage', {
    from,
    text,
    createdAt: moment().valueOf()
  }, function (data) {
    //console.log('Got it '+data.msg);
    $('#message').val('');
  });
}



/* ********************** Send Location *************************** */

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


function sendLocationMessage(from, locationObj){
  socket.emit('createLocationMessage', {
    from,
    locationObj,
    createdAt: moment().valueOf()
  }, function (data) {
    $('#message').val('');
  });
}



