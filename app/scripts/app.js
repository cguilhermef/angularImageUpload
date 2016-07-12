'use strict';

/**
 * @ngdoc overview
 * @name imageuploadApp
 * @description
 * # imageuploadApp
 *
 * Main module of the application.
 */
angular
  .module('imageuploadApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'angularFileUpload',
    'ngToast'
  ])
  .config(['ngToastProvider', function(ngToastProvider) {
    ngToastProvider.configure({
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
