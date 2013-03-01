define([
  'knockout'
], function (ko) {
  'use strict';

  var DataCubeDataset = function (source, title, uri) {
    var self = this;

    self.title  = title;
    self.uri    = uri;
    self.source = source;
  };

  return DataCubeDataset;
});
