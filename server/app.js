import createError from "http-errors";
import express, { json, urlencoded } from "express";
import { join } from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import mongoose from "mongoose";

import indexRouter from "./routes/index";
import pingRouter from "./routes/ping";
import authRouter from "./routes/auth";
import shopRouter from "./routes/shop";
import users from './schemas/users';

let app = express();

mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log('Mongoose has connected to the database!')
);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
      console.log("you are connected");

 users.find({ 'id': 1 }, function (err, found) {
  if (err) console.log("Error in users: ",err);
  if (found.length == 0){
      let newUser = {
        id: 1,
        account_type: "Admin",
        // change your name here - David -------
        first_name: "Naresh",  
        last_name: "Akkarapaka",
      };
      users.create( newUser, function (err, user) {
        if (err) console.log("Error:", err);
        else console.log("I am the new user",user);
      });
  }
  else console.log("Found results:",found);
});
});

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "public")));

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
  res.json({ error: err });
});

module.exports = app;
