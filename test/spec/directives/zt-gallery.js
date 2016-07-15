'use strict';

describe('Directive: ztGallery', function () {

  // load the directive's module
  beforeEach(module('imageuploadApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<zt-gallery></zt-gallery>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the ztGallery directive');
  }));
});
