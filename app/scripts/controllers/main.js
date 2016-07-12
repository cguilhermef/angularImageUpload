'use strict';

/**
 * @ngdoc function
 * @name imageuploadApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the imageuploadApp
 */
angular.module('imageuploadApp')
  .controller('MainCtrl', function ($scope, FileUploader, ngToast, $window) {
    $scope.uploader = new FileUploader({
      url: 'http://localhost:9255/upload',
      removeAfterUpload: true
    });
    $scope.dragAndDrop = new FileUploader({
      url: 'http://localhost:9255/upload',
      removeAfterUpload: true
    });
    $scope.dragAndDrop.onSuccessItem = function(item) { //item, reponse, status, header
      ngToast.dismiss();
      ngToast.create({
        className: 'success',
        content: '<span class="fa fa-check"></span> ' + item.file.name + ' successful uploaded!',
        timeout: 4000
      });
    };
    $scope.dragAndDrop.onAfterAddingFile = function(item) {
      console.log(item);
    };


  });
