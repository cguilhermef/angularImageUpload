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
    $scope.model = {
      uploaded: []
    };
    $scope.uploader = new FileUploader({
      url: 'http://localhost:9255/api/v1/media',
      removeAfterUpload: true
    });
    $scope.dragAndDrop = new FileUploader({
      url: 'http://localhost:9255/api/v1/media',
      removeAfterUpload: true
    });
    $scope.dragAndDrop.onSuccessItem = function(item, response, status, header) { //item, reponse, status, header
      console.log(item, response, status, header);
      ngToast.dismiss();
      ngToast.create({
        className: 'success',
        content: '<span class="fa fa-check"></span> ' + item.file.name + ' successful uploaded!',
        timeout: 4000
      });
      // $scope.model.uploaded.push()
    };
    // $scope.dragAndDrop.onAfterAddingFile = function(item) {
    //   console.log(item);
    // };
  });
