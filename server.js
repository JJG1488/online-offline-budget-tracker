// Creates an Express application. The express() function is a top-level function exported by the express module
const express = require("express");
// Pulls in logger...
// Create a new morgan logger middleware function using the given format and options. The format argument may be a string of a predefined name, or a string of a format string containing defined tokens.
const logger = require("morgan");
// includes mongoose in project....
const mongoose = require("mongoose");
// includes compression in project.....
// Returns the compression middleware using the given options. The middleware will attempt to compress response bodies for all request that traverse through the middleware, based on the given options.
// This middleware will never compress responses that include a Cache-Control header with the no-transform directive, as compressing will transform the body.
const compression = require("compression");

// sets the port that the server will listen on
const PORT = process.env.PORT || 3000;

// this sets the value of express to the variable "app"
const app = express();

// Concise output colored by response status for development use. The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes. :method :url :status :response-time ms - :res[content-length]
app.use(logger("dev"));

// Returns the compression middleware using the given options. The middleware will attempt to compress response bodies for all request that traverse through the middleware, based on the given options.
// This middleware will never compress responses that include a Cache-Control header with the no-transform directive, as compressing will transform the body.
app.use(compression());

// This is a built-in middleware function in Express. It parses incoming requests with urlencoded payloads and is based on body-parser.
// Returns middleware that only parses urlencoded bodies and only looks at requests where the Content-Type header matches the type option. This parser accepts only UTF-8 encoding of the body and supports automatic inflation of gzip and deflate encodings.
// A new body object containing the parsed data is populated on the request object after the middleware (i.e. req.body), or an empty object ({}) if there was no body to parse, the Content-Type was not matched, or an error occurred. This object will contain key-value pairs, where the value can be a string or array (when extended is false), or any type (when extended is true).
app.use(express.urlencoded({ extended: true }));

// This is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser
// Returns middleware that only parses JSON and only looks at requests where the Content-Type header matches the type option. This parser accepts any Unicode encoding of the body and supports automatic inflation of gzip and deflate encodings.
// A new body object containing the parsed data is populated on the request object after the middleware (i.e. req.body), or an empty object ({}) if there was no body to parse, the Content-Type was not matched, or an error occurred.
app.use(express.json());

// This is a built-in middleware function in Express. It serves static files and is based on serve-static
// this is going to "serve" all of the static files in public to the entire application
app.use(express.static("public"));

// connects to the database via our localhost
//useNewUrlParser - The underlying MongoDB driver has deprecated their current connection string parser. Because this is a major change, they added the useNewUrlParser flag to allow users to fall back to the old parser if they find a bug in the new parser. You should set useNewUrlParser: true unless that prevents you from connecting. Note that if you specify useNewUrlParser: true, you must specify a port in your connection string, like mongodb://localhost:27017/dbname. The new url parser does not support connection strings that do not have a port, like mongodb://localhost/dbname.
//useFindAndModify - True by default. Set to false to make findOneAndUpdate() and findOneAndRemove() use native findOneAndUpdate() rather than findAndModify().
// mongoose.connect("mongodb://localhost/budget", {
//   useNewUrlParser: true,
//   useFindAndModify: false
// });

// 'mongodb+srv://jg14:XVj7NOQNhoAgZPFH@cluster0.muarw.mongodb.net/test'  #### DELETE THIS BEFORE COMMITING

mongoose.connect(

  process.env.MONGODB_URI || "mongodb://localhost/budget",
{
  useNewUrlParser: true,
  useUnifiedTopology: true, 
  useCreateIndex: true,
  useFindAndModify: false
}

);

// routes
// ./routes/api.js is the path that matches...
//app.use()....
// Mounts the specified middleware function or functions at the specified path: the middleware function is executed when the base of the requested path matches path.
app.use(require("./routes/api.js"));

// Binds and listens for connections on the specified host and port. This method is identical to Node’s http.Server.listen()
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});