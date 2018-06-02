const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const nunjucks = require('nunjucks');
app.use(express.static('public'));
nunjucks.configure('views', {
  autoescape: true,
  express: app,
  noCache: true
});
var people = {};

app.get('/', function(req, res){
res.sendFile(__dirname + '/views/chat.html');
});

io.on('connection', function(client){
    client.on("enter", function(name){
		client.id = name;
		console.log('name :', name);
		io.emit("update", "You have connected to the server.");
		io.sockets.emit("update", name + " has joined the server.");
		io.sockets.emit("update-people", people);
	});
  client.on('disconnect', function(client){
    io.emit('leave');
  });
  client.on('chat message', function(msg){
    console.log('ppl: ', people);
    var namelong = client.id;
    var name = namelong.substring(0,7);
    io.emit('chat message', name, msg);
  });
});

var PORT = process.env.PORT || 8080;
http.listen(PORT, function () {
  console.log('Listening on port ' + PORT);
});
// http.listen(8080, function(){
//   console.log('listening on 8080');
// });

