const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(path.resolve('config/config'))[env];
const db = {};
const modelFolder = path.resolve('./modules');

const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable], config)
  : new Sequelize(config.database, config.username, config.password, config);

const getAllRoutesPath = function () {
  const allModelsPath = [];
  fs.readdirSync(modelFolder).forEach(file => {
    const fullPath = `${modelFolder}/${file}`;
    if (fs.existsSync(fullPath)) {
      fs.readdirSync(fullPath).forEach(nestedfile => {
        if (nestedfile.includes('model')) {
          const routePath = `${fullPath}/${nestedfile}`.replace('.js', '');
          allModelsPath.push(routePath);
        }
      });
    }
  });
  return allModelsPath;
};

const allRoutesPath = getAllRoutesPath();

allRoutesPath.forEach(routeFile => {
  const model = require(routeFile)(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
});

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
