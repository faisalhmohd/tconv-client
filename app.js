#! /usr/bin/env node

var url = "http://128.199.93.87:3000/";

var http = require('http');
var socket = require('socket.io-client')(url);
var inquirer = require("inquirer");

console.log('tconv running, waiting to connect');

socket.on('connect', function(){
  console.log('\ntconv connected');
    promptusername();
});

socket.on('new user', function(msg){
  console.log('\n' + msg + ' has just joined');
});

socket.on('new message', function(msg){
  if(msg.user != socket.username){
      console.log('\n~' + msg.user + ': ' + msg.message);
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
  inquirer.prompt([
    {
      type: "input",
      name: "username",
      message: "Enter your username"
    }
  ], function( answers ) {
      socket.username = answers.username;
      socket.emit('new user', socket.username);
      promptmessage();
  });
}

var promptmessage = function () {
  inquirer.prompt([
    {
      type: "input",
      name: "message",
      message: socket.username
    }
  ], function( answers ) {
      socket.emit('new message',{
        user: socket.username,
        message: answers.message
      });
      promptmessage();
  });
}
