'use strict';

/**
 * @ngdoc function
 * @name imageuploadApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the imageuploadApp
 */
angular.module('imageuploadApp')
  .controller('MainCtrl', function ($scope, $rootScope, ngToast) {

    $scope.init = function() {
      if (!$scope.model) { $scope.model = {}; }
      $scope.tmpFiles = [];
      $scope.model.files = [];
      $scope.model.url = 'http://localhost:9255/api/v1/media/';
      // $scope.model.files.push({
      //   url: $scope.model.url + '0dd7ec92-10f2-43c2-a70e-dd739a851a97'
      // });

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
