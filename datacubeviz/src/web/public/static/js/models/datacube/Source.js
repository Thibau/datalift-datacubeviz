define([
  'config/global'
], function (g) {
  'use strict';

  var Source = function (uri, project, title) {
    var self = this;

    self.uri     = uri;
    self.project = project;
    self.title   = title;
  };

  return Source;
});
