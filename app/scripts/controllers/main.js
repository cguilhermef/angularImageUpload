'use strict';

/**
 * @ngdoc function
 * @name imageuploadApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the imageuploadApp
 */
angular.module('imageuploadApp')
  .controller('MainCtrl', function ($scope, FileUploader, $http) {
    $scope.uploader = new FileUploader({
      url: 'http://localhost:9255/upload',
      removeAfterUpload: true
    });
  });
