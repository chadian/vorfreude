'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'vorfreude',
    IMAGE_ENDPOINT_URL: 'https://vorfreude.now.sh/',
    environment,
  };

  if (environment === 'production') {
    ENV.IMAGE_ENDPOINT_URL = "https://vorfreude-server-ypttjqnzcu.now.sh/";
  }

  return ENV;
};
