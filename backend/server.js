require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const { log, ExpressAPILogMiddleware } = require('@rama41222/node-logger');
const cookieParser = require('cookie-parser');
// const mysqlConnect = require('./db');
const {readdirSync} = require('fs');

// set up some configs for express.
const config = {
  name: 'DB-GUI-Backend',
  port: 8000,
  host: '0.0.0.0',
};

// create the express.js object
const app = express();

// create a logger object.  Using logger is preferable to simply writing to the console.
const logger = log({ console: true, file: false, label: config.name });

// specify middleware to use
app.use(bodyParser.json());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8000'],
  credentials: true,
}));
app.use(ExpressAPILogMiddleware(logger, { request: true }));
app.use(cookieParser());

// Load routes in routes folder
readdirSync('./routes').filter(file => file.endsWith('.js')).forEach(file => {
  logger.info(`Loading ${file} routes`);
  const route = require(`./routes/${file}`);
  route(app, logger);
}); 

// connecting the express object to listen on a particular port as defined in the config object.
app.listen(config.port, config.host, (e) => {
  if (e) {
    throw new Error('Internal Server Error');
  }
  logger.info(`${config.name} running on ${config.host}:${config.port}`);
});
