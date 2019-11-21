const createError = require("http-errors");
const express = require("express");
const { json, urlencoded } = require("express");

const { join } = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const indexRouter = require("./routes/index");
const pingRouter = require("./routes/ping");
const authRouter = require("./routes/auth");
const shopRouter = require("./routes/shop");
const seeding = require("./seeding");
const app = express();
const log = require("./utils/logger");

mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => log.info("Mongoose has connected to the database!")
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  seeding.default();
});

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "public")));

// Socket.io
const http = require('http').Server(app);
const io = require('socket.io')(http);
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('User Disconnected');
  });
  socket.on('example_message', function(msg){
    console.log('message: ' + msg);
  });
});
io.listen(8000);

app.use("/", indexRouter);
app.use("/ping", pingRouter);
app.use("/auth", authRouter);
app.use("/shop", shopRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
