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
    $scope.onLoadFile = function(event) {
        var img = new Image();
        img.onload = onLoadImage;
        return event.target.result;
        // return img;
    };
    $scope.init = function() {
      if (!$scope.model) { $scope.model = {}; }
      $scope.tmpFiles = [];
      $scope.files = [];
      $scope.files.push({
        url: 'http://localhost:9255/api/v1/media/9bb20099-a518-475b-a175-95c15e1c6131'
      });
      // $http.get('http://localhost:9255/get-media/9bb20099-a518-475b-a175-95c15e1c6131.png',
      //   { headers: { 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8' } })
      //   .then(function(response){
      //     console.log(response);
      //     // $scope.files.push('data:image/png;base64,' + response.data);
      //
      //   }, function(error) {
      //     console.log(error);
      //   });
    };

    $scope

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
        console.log(response);
        $scope.files.push({
          url: response.headers('Location')
        });

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
