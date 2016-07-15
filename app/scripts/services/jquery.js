'use strict';

/**
 * @ngdoc service
 * @name imageuploadApp.jQuery
 * @description
 * # jQuery
 * Factory in the imageuploadApp.
 */
angular.module('imageuploadApp')
  .factory('$', function ($window) {
    var $ = $window.$;
    return $;
  });
