'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'vorfreude',
    environment,
    FLICKR_API_KEY: process.env.FLICKR_API_KEY
  };

  return ENV;
};
