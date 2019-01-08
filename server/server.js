const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const publicPath = path.join(__dirname, '../public');

const PORT = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', (socket) => {

    console.log('New user joined');
    //socket emit message from admin welcome
    //socket broadcast emit to 

    socket.emit('newMessage', {
        from: 'Admin',
        text: 'Welcome to chat',
        createdAt: new Date().getTime()
    });

    socket.broadcast.emit('newMessage', {
        from: 'Admin',
        text: 'New User Joined',
        createdAt: new Date().getTime()
    });



    socket.on('createMessage', (message) => {
        
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
    });

    socket.on('disconnect', () => {
        console.log('User was Disconnected to server')
    });


});

app.use(express.static(publicPath));

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

//console.log(publicPath);