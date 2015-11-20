#! /usr/bin/env node

var url = "http://tconv.herokuapp.com/";

var http = require('http');
var socket = require('socket.io-client')(url);
var colors = require('colors');
var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);

console.log('tconv running, waiting to connect'.yellow);

socket.on('connect', function(){
  console.log('tconv successfully connected\n\n'.green);
  console.log('Welcome to tconv!\n\n');
    promptusername();
});

socket.on('new user', function(msg){
  if(msg != socket.username){
    console.log('\n' + msg.blue + ' has just joined'.blue);
    promptmessage();
  }
});

socket.on('new message', function(msg){
  if(msg.user != socket.username){
      console.log(msg.user + ': ' + msg.message);
  }
});

socket.on('disconnect', function(){
  console.log('I am disconnected');
});

http.get(url,function(res) {
  res.on('end', function() {
    console.log("Response completed");
});
});

var promptusername = function () {
  rl.question("Enter a nickname: ", function(name) {
      socket.username = name;
      socket.emit('new user', socket.username);
      promptmessage();
      rl.prompt(true);
  });
}

var promptmessage = function () {
  rl.on('line', function (line) {
    if (line[0] == "/" && line.length > 1) {
        var cmd = line.match(/[a-z]+\b/)[0];
        var arg = line.substr(cmd.length+2, line.length);
        chat_command(cmd, arg);

    } else {
        // send chat message
        socket.emit('new message',{
          user: socket.username,
          message: line
        });
        rl.prompt(true);
        promptmessage();
    }
});
}
