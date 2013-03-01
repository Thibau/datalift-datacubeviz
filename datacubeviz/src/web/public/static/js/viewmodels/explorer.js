define([
  'jquery',
  'knockout',
  'config/global'
], function ($, ko, g) {
  'use strict';

  var ExplorerViewModel = function (project) {
    var self = this;

    self.project = ko.observable(project);

    self.sources = [];
    self.currentDataset = ko.observable();

    self.initialize = function () {
      $.getJSON(g.remoteURL + g.paths.datasets + '?project=' + self.project(),
        function (data) {
          // self.sources = data.map(function (elt) {
          //   return new DataCubeDataset();
          // });
          // self.currentDataset(self.sources[0]);
          // console.log(self.currentDataset());
        }
      );
    };

    self.initialize();
  };

  return ExplorerViewModel;
});
