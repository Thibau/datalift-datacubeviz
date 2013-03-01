define([
  'jquery',
  'knockout',
  'config/global',
  'models/State',
  'models/DataCubeSource',
  'models/DataCubeDataset'
], function ($, ko, g, State, DataCubeSource, DataCubeDataset) {
  'use strict';

  var ExplorerViewModel = function (project) {
    var self = this;

    self.project = ko.observable(project);
    self.state = new State();

    self.datasets = ko.observableArray([]);
    self.currentDataset = ko.observable();

    self.initialize = function () {
      $.getJSON(g.remoteURL + g.paths.datasets + '?project=' + self.project(),
        function (data) {
          // Our main working entity is a dataset.
          $.each(data, function (i, source) {
            var qbSource = new DataCubeSource(source.title || "SRC Ø", source.uri, self.project());
            $.each(source.datasets, function (j, dataset) {
              self.datasets.push(new DataCubeDataset(dataset.title || "DS Ø", dataset.uri, qbSource));
            });
          });

          self.currentDataset(self.datasets()[0]);
          console.log(self.currentDataset());
        }
      );
    };

    self.initialize();
  };

  return ExplorerViewModel;
});
