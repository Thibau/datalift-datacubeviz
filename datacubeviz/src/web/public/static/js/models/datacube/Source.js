define([
  'knockout'
], function (ko) {
  'use strict';

  var DataCubeSource = function (title, uri, project) {
    var self = this;

    self.title   = title;
    self.uri     = uri;
    self.project = project;
  };

  return DataCubeSource;
});
