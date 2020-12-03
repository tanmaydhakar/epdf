const fs = require('fs');
const path = require('path');

const modulesFolder = path.resolve('./modules');

/**
 * Method to get all module paths
 * @returns {Promise} resolve - returns the success state of promise
 * */
const getAllModulesPaths = function () {
  const allModulePaths = [];
  fs.readdirSync(modulesFolder).forEach(file => {
    const fullPath = `${modulesFolder}/${file}`;
    if (fs.existsSync(fullPath)) {
      fs.readdirSync(fullPath).forEach(nestedfile => {
        const modulePath = `${fullPath}/${nestedfile}`.replace('.js', '');
        allModulePaths.push(modulePath);
      });
    }
  });
  return allModulePaths;
};

/**
 * Method to get all module's route paths
 * @params {class} routerInstance - The express router instance
 * @returns {Promise} resolve - routerInstance return the router with all register routes
 * */
const registerRoutes = function (routerInstance) {
  return new Promise(resolve => {
    const allModulePaths = getAllModulesPaths();

    // LOAD ALL NESTED ROUTES FILE
    allModulePaths.forEach(moduleFile => {
      if (moduleFile.includes('routes')) {
        require(moduleFile)(routerInstance);
      }
    });

    return resolve(routerInstance);
  });
};

/**
 * Method to get all module policies
 * @returns {Promise} resolve - routerInstance return the router with all register routes
 * */
const registerPolicies = function () {
  return new Promise(resolve => {
    const allModulePaths = getAllModulesPaths();

    // LOAD ALL NESTED POLICIES FILE
    allModulePaths.forEach(moduleFile => {
      if (moduleFile.includes('policy') && !moduleFile.includes('custom')) {
        require(moduleFile).invokeRolesPolicies();
      }
    });

    return resolve();
  });
};

module.exports = {
  registerRoutes,
  registerPolicies
};
