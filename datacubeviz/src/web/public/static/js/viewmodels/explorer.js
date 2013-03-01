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
          // Our main working entity is a dataset, we add them to our view model.
          $.each(data, function (i, source) {
            var qbSource = new DataCubeSource(source.title || "SRC Ø", source.uri, self.project());
            $.each(source.datasets, function (j, dataset) {
              self.datasets.push(new DataCubeDataset(dataset.title || "DS Ø", dataset.uri, qbSource));
              self.datasets.push(new DataCubeDataset(dataset.title || "DS2 Ø", dataset.uri, qbSource));
              self.datasets.push(new DataCubeDataset(dataset.title || "DS3 Ø", dataset.uri, qbSource));
            });
          });

          // This is only to test.
          $.each(data, function (i, source) {
            var qbSource = new DataCubeSource(source.title || "SRC2 Ø", source.uri, self.project());
            $.each(source.datasets, function (j, dataset) {
              self.datasets.push(new DataCubeDataset(dataset.title || "DS4 Ø", dataset.uri, qbSource));
              self.datasets.push(new DataCubeDataset(dataset.title || "DS5 Ø", dataset.uri, qbSource));
            });
          });

          self.currentDataset(self.datasets()[0]);
        }
      );
    };

    self.initialize();

    self.groupedDatasets = ko.computed(function () {
      var rows = [], current = [];
      rows.push(current);
      for (var i = 0; i < self.datasets().length; i += 1) {
        current.push(self.datasets()[i]);
        if (((i + 1) % g.datasetsPerRow) === 0) {
          current = [];
          rows.push(current);
        }
      }
      return rows;
    });
  };

  return ExplorerViewModel;
});
