const express = require('express');
const http = require('http');
const path = require('path');
const moment = require('moment');
const socketIO = require('socket.io');


const publicPath = path.join(__dirname, '../public');
const {generateMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const PORT = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

io.on('connection', (socket) => {
    
    console.log('New user joined');

    /* ********************** New User Join Chat *************************** */

   
    socket.on('join', (param, callback) => {
        if(!isRealString(param.name) || !isRealString(param.room)){
            return callback('Name and room name are required.')
        }
        //console.log('Room Name: '+param.room);
        socket.join(param.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, param.name, param.room);
        
        io.to(param.room).emit('updateUserList', users.getUserList(param.room));
        
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat'));
        socket.broadcast.to(param.room).emit('newMessage', generateMessage('Admin', `${param.name} has Joined`));
    
        callback('');

    });

    /* ********************** User Send Chat *************************** */

    socket.on('createMessage', (message, callback) => {

        io.emit('newMessage', generateMessage(message.from, message.text));
        callback({
            err: 0,
            msg: 'Done'
        });
    });

    /* ********************** User Send Location *************************** */

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
        
        var user = users.removeUser(socket.id);
        
        
        if(user){
            console.log(`${user.name} was Disconnected to server in room ${user.room}`);
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has Left`));
        }
        
    });

});

app.use(express.static(publicPath));

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

//console.log(publicPath);