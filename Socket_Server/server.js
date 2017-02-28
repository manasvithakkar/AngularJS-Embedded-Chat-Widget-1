// Socket.io Express Web Server.
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/chat',function(err){
    if(err){
        console.log("error");
    }
    else{
        console.log("Connected to mongodb")
    }


});

var chatSchema = mongoose.Schema({
   username: String,
    msg: String,
    id: String,
    created:{type:Date, default: Date.now}
});
var Chat = mongoose.model('Message',chatSchema);

var nsp = io.of('/admin');
var index = 0;
var dict={};

var temp=[];
app.use(express.static(__dirname + '/public'));

http.listen('3000', function(){

    console.log("Listening on 3000:");
});

io.on('connection', function(socket) {
    var name;
    console.log("We have a connection");
    socket.on("new-message", function (msg) {
        name = msg.username;
        if(!(msg.username in dict)){
            console.log("Username does not exist");
            if(temp.length>0)
            {
               console.log("Entered temp");
                dict[msg.username] = temp[0];
                console.log("Current dict",dict);
                temp.splice(0,1);
            }
            else{
                dict[msg.username] =  index++;
            }
        }
        else{
            console.log("Username exists");
        }
        var newMsg = new Chat({username: msg.username,msg: msg.message,id:msg.id});
        newMsg.save(function(err){
           if(err) throw err;
           // console.log("Data Inserted");
        });

        msg.code = dict[msg.username];
        nsp.emit("receive-message",msg);
    });

    socket.on('disconnect', function () {
        if (name==undefined){
            console.log("admin disconnected");
        }
        else {
            nsp.emit("user-disconnected", dict[name]);
            temp.push(dict[name]);
            delete dict[name];
        }
    });

});
nsp.on('connection', function(socket){
    socket.on("reply-from-admin",function(reply){
        io.to(reply.client).emit('receive-message',reply);
        var newMsg = new Chat({username: reply.username,msg: reply.message, id: reply.client});
        newMsg.save(function(err){
            if(err) throw err;
            console.log("Data Inserted");
        });
    });
});



