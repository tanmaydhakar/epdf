const path = require('path');
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');

const expressRouter = express.Router();
const configFile = require(path.resolve('./config/config'))[process.env.NODE_ENV];
const app = express();

/**
 * Method to setup env. variables
 * @returns {Promise} resolve - returns the success state of promise
 * */
const setupConfigs = function () {
  return new Promise(resolve => {
    for (const key in configFile) {
      process.env[key] = configFile[key];
    }
    return resolve();
  });
};

/**
 * Method to setup all express routes
 * @returns {Promise} resolve - returns the express router instance
 * */
const setupRoutes = function () {
  return new Promise((resolve, reject) => {
    const resisterRoutesPromise = require(path.resolve('./register')).registerRoutes(expressRouter);
    resisterRoutesPromise
      .then(routerInstance => {
        return resolve(routerInstance);
      })
      .catch(err => {
        return reject(err);
      });
  });
};

/**
 * Method to setup all policies
 * @returns {Promise} resolve - returns the success state of promise
 * */
const setupPolicies = function () {
  return new Promise((resolve, reject) => {
    const resisterRoutesPromise = require(path.resolve('./register')).registerPolicies();
    resisterRoutesPromise
      .then(() => {
        return resolve();
      })
      .catch(err => {
        return reject(err);
      });
  });
};

/**
 * Method to setup the database with models
 * @returns {Promise} resolve - the success state of promise
 * */
const setupSequelize = function () {
  return new Promise(resolve => {
    require(path.resolve('./models'));
    return resolve();
  });
};

/**
 * Method to initiate the server with all dependencies
 * */
const setupServer = function () {
  const setupConfigsPromise = setupConfigs();
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  );
  app.use(compression());
  setupConfigsPromise.then(() => {
    const setupSequelizePromise = setupSequelize();
    setupSequelizePromise.then(() => {
      const setupRoutesPromise = setupRoutes();
      setupRoutesPromise.then(router => {
        const setupPoliciesPromise = setupPolicies();
        setupPoliciesPromise.then(() => {
          app.use('/', router);
          app.listen(process.env.server_port);
          console.log(`SERVER STARTED ON PORT ${process.env.server_port}!`);
        });
      });
    });
  });
};

setupServer();
