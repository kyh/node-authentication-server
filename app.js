const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const router = require('./router');
const dbSetup = require('./db/setup');

// DB Setup
dbSetup('mongodb://localhost:auth/auth');

// App Setup
app.use(morgan('combined'));
app.use(bodyParser.json());
router(app);

module.exports = app;
