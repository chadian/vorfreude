'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'vorfreude',
    IMAGE_ENDPOINT_URL: 'https://vorfreude.now.sh/',
    environment
  };

  return ENV;
};
