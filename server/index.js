const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();
const router = require("./router");
const mongoose = require("mongoose");

//DB setup
//the string passed in will internally create a new db called auth
// DB Setup
mongoose.connect("mongodb://localhost/auth", { useNewUrlParser: true });

const connection = mongoose.connection;

connection.on("connected", function() {
  console.log("connected to db");
});

/*** APP SETUP ***/
//morgan is a logging framework to log incoming requests for debugging purposes
app.use(morgan("combined"));
//bodyparser will parse incoming requests as json
app.use(bodyParser.json({ type: "*/*" }));
router(app);

/*** SERVER SETUP ***/
const PORT = process.env.PORT || 3090;
const server = http.createServer(app);

server.listen(PORT, () => console.log(`listening on port ${PORT}`));
