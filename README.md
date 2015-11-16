# tconv
Conversations via terminal.

### Installation
```sh
$ npm i -g tconv
```
### Start
```sh
$ tconv
```

### Custom Server
In default, tconv uses its dedicated server.
Creating your personal host is easy! Follow the instructions below to set up the client and server.

#### Setting Server
Clone [this repo](https://github.com/faisalmohd/tconv-server) and execute on server.
```sh
$ node server
```
#### Setting Client
Install this package and edit app.js as follows:
```js
var url = "http://yoururl"
```
