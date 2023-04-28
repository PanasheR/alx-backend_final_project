// Node dependencies
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// Setting up application routes
const routes = require('./routes/index');

// Creating an express application
const app = express();

// Defining the env variable process for development
const env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

// Setting up view engine to use EJS

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Setting up all routes to listen on routes file
app.use('/', routes);

// Setting up a  404 error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Printing the error stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      title: 'error'
    });
  });
}

// No stacktraces on production
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    title: 'error'
  });
});

module.exports = app;
// Exports all the application configuration

app.set('port', process.env.PORT || 3000);

// Setting up the server port and give a user message
const server = app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + server.address().port);
});

// Starting with socket.io
const io = require('socket.io').listen(server);
// Creating an Array to hold users
const userList = [];
// Creating an Array to hold connections
const connections = [];

// Starting connection listener
io.sockets.on('connection', function (socket) {
  connections.push(socket);
  console.log("Connected:", connections.length);

  // Setting up Disconnect user
  socket.on('disconnect', function (data) {
    if (socket.username) {
      userList.splice(userList.indexOf(socket.username), 1);
      updateUsernames();
    }
    connections.splice(connections.indexOf(socket), 1);
    console.log("Disconnected:", connections.length);
  });

  // Setting up new messages
  socket.on('send message', function (data) {
    io.sockets.emit('new message', { msg: data, user: socket.username });
  });

  // New User
  socket.on('new user', function (data, callback) {
    callback(!!data);
    socket.username = data;
    userList.push(socket.username);
    updateUsernames();
  });

  function updateUsernames() {
    io.sockets.emit('get userList', userList);
  }
});
