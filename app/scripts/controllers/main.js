'use strict';

/**
 * @ngdoc function
 * @name imageuploadApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the imageuploadApp
 */
angular.module('imageuploadApp')
  .controller('MainCtrl', function ($scope, $rootScope, Upload, ngToast, $http) {

    $scope.init = function() {
      if (!$scope.model) { $scope.model = {}; }
      $scope.tmpFiles = [];
      $scope.files = [];

      $http.get('http://localhost:9255/api/v1/media/076ffc02-c076-43f8-a725-1ce322b7bee5',
        { headers: { 'Accept': 'image/png' } })
        .then(function(response){
          $scope.files.push(response.data);
          console.log($scope.files);
        }, function(error) {
          console.log(error);
        });
    };


    $scope.uploadFile = function(file) {
      $rootScope.$emit('fileUpload.start');
      $scope.model.running = true;
      file.uploading = true;
      Upload.http({
        url: 'http://localhost:9255/api/v1/media',
        method: 'POST',
        headers: {
          'Content-Type': file.type
        },
        data: file
      }).then(function(response) {
        $rootScope.$emit('fileUpload.done', response);
        file.uploaded = true;
        file.error = false;
        file.uploading = false;
        $scope.files.push(file);
      }, function(error) {
        $rootScope.$emit('fileUpload.error', error);
        file.error = true;
      }, function (evt) {
        file.progress = parseInt(100.0 * evt.loaded / evt.total);
        console.log($scope.progress);
      });
    };
    $rootScope.$on('fileUpload.start', function() {
      $scope.model.running = true;
      ngToast.dismiss();
      ngToast.warning('Enviando arquivos...');
    });
    $rootScope.$on('fileUpload.done', function($event, response) {
      $scope.model.running = false;
      ngToast.dismiss();
      ngToast.success('Arquivo enviado com sucesso!');
      console.log($event, response);
    });
    $rootScope.$on('fileUpload.error', function($event, error) {
      $scope.model.running = false;
      ngToast.dismiss();
      ngToast.danger('Erro - ' + error.data);
    });

    $scope.init();
  });
