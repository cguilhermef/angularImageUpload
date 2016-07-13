'use strict';

/**
 * @ngdoc function
 * @name imageuploadApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the imageuploadApp
 */
angular.module('imageuploadApp')
  .controller('MainCtrl', function ($scope, Upload, ngToast, $window, $timeout) {
    $scope.files = [];
    $scope.uploadFiles = function(files, errFiles) {
        $scope.errFiles = errFiles;
        angular.forEach(files, function(file) {
          console.log(file);
            file.upload = Upload.http({
                url: 'http://localhost:9255/api/v1/media',
                method: 'POST',
                headers: {
                  'Content-Type': file.type
                },
                data: Upload.dataUrltoBlob(file.$ngfBlobUrl, file.name)
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0) {
                    $scope.errorMsg = response.status + ': ' + response.data;
                  }
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 *
                                         evt.loaded / evt.total));
            });
        });

        $scope.rupload = function($file, $invalid) {
          console.log($file, $invalid, 'ops');
        };
    };
    $scope.sigleUpload = function($file) {
      var file = $file[0];
      if (file) {
        Upload
          .urlToBlob(file.$ngfBlobUrl, file.name)
            .then(function(blob) {
              console.log(blob);
              file.uplaod = Upload.http({
                url: 'http://localhost:9255/api/v1/media',
                method: 'POST',
                headers: {
                  'Content-Type': file.type
                },
                data: blob
              }).then(function(response){
                $scope.files.push(file);
              });
            });
      }
    };
  });
