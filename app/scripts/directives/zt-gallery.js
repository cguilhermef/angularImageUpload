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
      restrict: 'EA',
      scope: {
        images: '=',
        uploadUrl: '='
      },
      link: function postLink(scope, element) {
        var dropArea = $(element).find('.drop-area');
        var areaDrop = document.getElementById('area-droppable');
        // $(document.body).on('dragenter', function(e) {
        //   dropArea.toggleClass('active');
        // }).on('dragend', function() {
        //   dropArea.toggleClass('active')
        // })
        // $(document.body).on('dragenter', function(e) {
        //   dropArea.addClass('active');
        // }).on('drop, dragleave', function(e) {
        //   // if (e.originalEvent.target !== )
        //   if (e.type === 'dragleave') {
        //     console.log('leave', e, e.originalEvent.target === areaDrop);
        //   }
        //   dropArea.removeClass('active');
        // });
          // $(document.body).on('drag, dragenter', function() {
          //   console.log('drag');
          //   dropArea.addClass('active');
          // }).on('dragend', function(){
          //     dropArea.removeClass('active');
          //     console.log('dragend');
          // }).on('drop', function() {
          //     dropArea.removeClass('active');
          //     console.log('drop');
          // });
        // $(window).on('drag, dragenter', function() {
        //   console.log('drag');
        //   dropArea.addClass('active');
        // }).on('dragend, drop', function() {
        //     dropArea.removeClass('active');
        //     console.log('drop or dragend');
        // }).on('dragleave', function(e) {
        //   console.log('leave...', e.target, e.originalEvent.target);
        // });
        $.fn.dndhover = function(options) {

          return this.each(function() {

              var self = $(this);
              var collection = $();

              self.on('dragenter', function(event) {
                  if (collection.size() === 0) {
                      self.trigger('dndHoverStart');
                  }
                  collection = collection.add(event.target);
              });

              self.on('drop', function(event) {
                //  if (collection.size() === 0) {
                      self.trigger('dndHoverEnd');
                  //}
                  //collection = collection.add(event.target);
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

      $(document.body).dndhover().on({
          'dndHoverStart': function(event) {

              $(areaDrop).addClass('active');
              console.log('start...');
              event.stopPropagation();
              event.preventDefault();
              return false;
          },
          'dndHoverEnd': function(event) {

              $(areaDrop).removeClass('active');
              console.log('end...');
              event.stopPropagation();
              event.preventDefault();
              return false;
          }
      });
        scope.model = {};
        scope.uploadFile = function(file) {
          $rootScope.$emit('fileUpload.start');
          scope.model.running = true;
          file.uploading = true;
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
            console.log(response);
            scope.images.push({
              url: response.headers('Location')
            });

          }, function(error) {
            $rootScope.$emit('fileUpload.error', error);
            file.error = true;
          }, function (evt) {
            file.progress = parseInt(100.0 * evt.loaded / evt.total);
            console.log(scope.progress);
          });
        };
        console.log(scope.images);
      }
    };
  });
