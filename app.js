#! /usr/bin/env node

const url = "http://tconv.herokuapp.com/",
    http = require('http'),
    socket = require('socket.io-client')(url),
    term = require('terminal-kit').terminal,
    async = require('async'),
    colors = require('colors'),
    notifier = require('node-notifier');

const getusername = (callback) => {
        return term.inputField([], (error, result) => {
            if (error) {
                callback(error);
            }
            callback(null, result)
        });
    },
    transmitusername = (username, callback) => {
        socket.username = username;
        socket.emit('new user', username);
        callback(null, true)
    },
    getmessage = (callback) => {
        return term.inputField([], (error, result) => {
            callback(null, result)
        });
    },
    transmitmessage = (message, callback) => {
        socket.emit('new message', {
            user: socket.username,
            message: message
        });
        callback(null, true);
    },
    setup = () => {
        async.waterfall([
            function(callback) {
                callback(null)
            },
            getmessage,
            transmitmessage
        ], (error, result) => {
            if (error) {
                console.log('Something went wrong'.error);
                process.exit(0);
            }
            console.log('');
            setup();
        });
    }

colors.setTheme({
    initiate: ['yellow'],
    success: 'green',
    promptuser: 'blue',
    error: 'red',
    newuser: ['cyan', 'dim'],
    messageuser: ['grey', 'bold'],
    messagedata: ['grey'],
    prompt: ['blue']
});

socket.on('connect', () => {
    console.log('Enter your nickname: '.prompt);
    async.waterfall([
        getusername,
        transmitusername,
    ], (error, result) => {
        if (error) {
            console.log('Something went wrong'.error);
            return
        }
        term.clear();
        console.log('You are chatting as #'.success + socket.username.success);
        setup();
    })
});

socket.on('incoming user', (msg) => {
    if (msg != socket.username) {
        console.log(msg.newuser + ' has just joined'.newuser);
        notifier.notify({
            'title': 'New User',
            'message': msg + ' has joined your room'
        });
    }
});

socket.on('incoming message', (msg) => {
    if (msg.user != socket.username) {
        console.log('#'.prompt + msg.user.messageuser + ' > '.prompt + msg.message.messagedata);
        notifier.notify({
            'title': msg.user,
            'message': msg.message
        });
    }
});

socket.on('disconnect', () => {
    term('I am disconnected');
});

http.get(url, (res) => {
    res.on('data', (d) => {})
}).on('error', (error) => {
    console.log(error);
});

term.on('key', (name, matches, data) => {
    if (name === 'CTRL_C') {
        console.log('tconv closing');
        term.grabInput(false);
        setTimeout(() => {
            process.exit()
        }, 100);
    }
})
