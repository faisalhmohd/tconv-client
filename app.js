#! /usr/bin/env node

var url = "http://tconv.herokuapp.com/";

var http = require('http');
var socket = require('socket.io-client')(url);
var term = require( 'terminal-kit' ).terminal;
var async = require('async');
var colors = require('colors');

colors.setTheme({
  initiate: ['yellow'],
  success: 'green',
  promptuser: 'blue',
  error: 'red',
  newuser: ['cyan','dim'],
  messageuser: ['grey', 'bold'],
  messagedata: ['grey'],
  prompt: ['blue']
});

socket.on('connect', function(){
    console.log('Enter your nickname: '.prompt);
      async.waterfall([
        getusername,
        transmitusername,
      ],function (error, result) {
        if(error){
          console.log('Something went wrong'.error);
        }
        else {
          term.clear();
          console.log('You are chatting as #'.success + socket.username.success);
          setup();
        }
      })
});

socket.on('incoming user', function(msg){
  if(msg != socket.username){
    console.log(msg.newuser + ' has just joined'.newuser);
  }
});

socket.on('incoming message', function(msg){
  if(msg.user != socket.username){
    console.log('#'.prompt + msg.user.messageuser + ' > '.prompt + msg.message.messagedata);
  }
});

socket.on('disconnect', function(){
  term('I am disconnected');
});

http.get(url,function(res) {
  res.on('data', function(d) {
    })
  }).on('error', function(error) {
      console.log(error);
  });

var getusername = function (callback) {
  return term.inputField([],function (error, result) {
      if(error){
        callback(error);
      }
      else {
      callback(null, result)
      }
    });
}

var transmitusername = function (username, callback) {
  socket.username = username;
  socket.emit('new user', username);
  callback(null, true)
}

var getmessage = function (callback) {
  return term.inputField([],function (error, result) {
    callback(null, result)
    });
}

var transmitmessage = function(message, callback){
  socket.emit('new message',{
    user: socket.username,
    message: message
  });
  callback(null, true);
}

var setup = function () {
  async.waterfall([
    function (callback) {
      callback(null)
    },
    getmessage,
    transmitmessage
  ],function (error,result) {
    if (error) {
      console.log('Something went wrong'.error);
      process.exit(0);
    }
    else {
      console.log('');
      setup();
    }
  });
}

term.on('key', function (name, matches, data) {
  if ( name === 'CTRL_C' ){
    console.log('tconv closing');
    term.grabInput( false ) ;
    setTimeout( function() { process.exit() } , 100 ) ;
  }
})
