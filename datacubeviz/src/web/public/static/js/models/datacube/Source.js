define([
  'config/global'
], function (g) {
  'use strict';

  var Source = function (title, uri, project) {
    var self = this;

    self.title   = title;
    self.uri     = uri;
    self.project = project;
  };

  return Source;
});
