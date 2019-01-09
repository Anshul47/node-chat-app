const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const publicPath = path.join(__dirname, '../public');
const {generateMessage} = require('./utils/message');

const PORT = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', (socket) => {
    
    console.log('New user joined');

    /* ************************************************* */

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat'));
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User Joined'));

    /* ************************************************* */

    socket.on('createMessage', (message, callback) => {

        io.emit('newMessage', generateMessage(message.from, message.text));
        callback({
            err: 0,
            msg: 'Done'
        });
    });

    /* ************************************************* */

    socket.on('createLocationMessage', (message, callback) => {
        var userLocationObj = {
            lat: message.locationObj.lat,
            lng: message.locationObj.lng
        }
        io.emit('newLocationMessage', generateMessage(message.from, userLocationObj));
        callback({
            err: 0,
            msg: 'Done'
        });
    });

    /* ************************************************* */

    socket.on('disconnect', () => {
        console.log('User was Disconnected to server')
    });

});

app.use(express.static(publicPath));

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

//console.log(publicPath);