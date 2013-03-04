define([
  'config/global'
], function (g) {
  'use strict';

  var Dataset = function (title, uri, source) {
    var self = this;

    self.title  = title;
    self.uri    = uri;
    self.source = source;
  };

  return Dataset;
});
