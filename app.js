const express = require('express');
const app = express();
// import body-parser to parse request bodies
const bodyParser = require('body-parser');
// import cors to handle CORS requests
const cors = require('cors');

module.exports = app;

// Add middleware for handling CORS requests from index.html
app.use(cors());


// Add middleware for parsing request bodies here:
app.use(bodyParser.json());


// Mount your existing apiRouter below at the '/api' path.
const apiRouter = require('./server/api');
app.use('/api', apiRouter);


