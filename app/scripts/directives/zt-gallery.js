'use strict';

/**
 * @ngdoc directive
 * @name imageuploadApp.directive:ztGallery
 * @description
 * # ztGallery
 */
angular.module('imageuploadApp')
  .directive('ztGallery', function ($rootScope, Upload, $) {
    return {
      templateUrl: 'views/directives/zt-gallery.html',
      restrict: 'E',
      scope: {
        images: '=galleryModel',
        uploadUrl: '=galleryUploadUrl',
        dropAreaText: '@galleryDropText'
      },
      link: function postLink(scope, element) {
        var dropArea = $(element).find('.gallery-drop-area');
        scope.model = {};
        scope.zoomIn = null;

        $.fn.dndhover = function() {
          return this.each(function() {
            var self = $(this);
            var collection = $();

            self.on('dragenter', function(event) {
              self.trigger('dndHoverStart');
              collection = collection.add(event.target);
            });

            self.on('drop', function(event) {
              self.trigger('dndHoverEnd');
              collection = collection.add(event.target);
            });

            self.on('dragleave', function(event) {
              /*
               * Firefox 3.6 fires the dragleave event on the previous element
               * before firing dragenter on the next one so we introduce a delay
               */
              setTimeout(function() {
                collection = collection.not(event.target);
                if (collection.size() === 0) {
                  self.trigger('dndHoverEnd');
                }
              }, 1);
            });
          });
        };
        $(window).dndhover().on({
            'dndHoverStart': function(event) {
                $(dropArea).addClass('active');
                event.stopPropagation();
                event.preventDefault();
                return false;
            },
            'dndHoverEnd': function(event) {
                $(dropArea).removeClass('active');
                event.stopPropagation();
                event.preventDefault();
                return false;
            }
        });
        scope.zoom = function(url) {
          scope.zoomIn = url;
        };
        scope.zoomClose = function() {
          scope.zoomIn = null;
        };
        scope.removeUploaded = function() {
          scope.tmpFiles = scope.tmpFiles.reduce(function(result, item) {
            if (!item.uploaded) {
              result.push(item);
            }
            return result;
          }, []);
        };
        scope.removeFile = function(f) {
          scope.images = scope.images.reduce(function(result, item) {
            if (item.url !== f.url) {
              result.push(item);
            }
            return result;
          },[]);
        };
        scope.uploadAll = function() {
          angular.forEach(scope.tmpFiles, function(file) {
            scope.uploadFile(file);
          });
        };
        scope.uploadFile = function(file) {
          $rootScope.$emit('fileUpload.start');
          scope.model.running = true;
          scope.model.uploading = true;
          Upload.http({
            url: scope.uploadUrl,
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
            scope.model.uploading = false;
            scope.model.running = false;
            scope.images.push({
              url: response.headers('Location')
            });
            scope.removeUploaded();
          }, function(error) {
            $rootScope.$emit('fileUpload.error', error);
            file.error = true;
            scope.model.uploading = false;
            scope.model.running = false;
          }, function (evt) {
            file.progress = parseInt(100.0 * evt.loaded / evt.total);
          });
        };
      }
    };
  });
