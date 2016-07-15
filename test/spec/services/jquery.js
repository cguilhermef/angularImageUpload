'use strict';

describe('Service: jQuery', function () {

  // load the service's module
  beforeEach(module('imageuploadApp'));

  // instantiate service
  var jQuery;
  beforeEach(inject(function (_jQuery_) {
    jQuery = _jQuery_;
  }));

  it('should do something', function () {
    expect(!!jQuery).toBe(true);
  });

});
