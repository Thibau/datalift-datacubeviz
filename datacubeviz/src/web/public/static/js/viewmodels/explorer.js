define([
  'jquery',
  'knockout',
  'config/global',
  'models/TableOptions',
  'models/State',
  'models/datacube/Source',
  'models/datacube/Dataset'
], function ($, ko, g, TableOptions, State, Source, Dataset) {
  'use strict';

  /**
   * A view model which manages the exploration of DataCube datasets
   * contained inside DataCube sources.
   * @param {String} project  The URI of the current project (to retrieve datasets).
   * @param {String} language The current user language preference, same purpose.
   */
  var ExplorerViewModel = function (project, language) {
    var self = this;

    self.project        = ko.observable(project);
    self.language       = ko.observable(language);
    self.state          = new State();

    self.datasets            = ko.observableArray([]);
    self.currentDataset      = ko.observable();
    self.currentComponents   = ko.observableArray([]);
    self.currentObservations = ko.observableArray([]);

    self.tableOptions   = new TableOptions(self.language());
    self.tableContent   = ko.observableArray([[0, 1], [0, 1], [0, 1], [0, 1]]);

    /*
    TODO :
    -
    */

    /**
     * Initializes our explorer by retrieving the datasets.
     */
    self.initialize = function () {
      $.getJSON(g.remoteURL + g.paths.datasets + '?project=' + self.project() + '&language=' + self.language(),
        function (data) {
          // Our main working entity is a dataset, we add them to our view model.
          $.each(data, function (i, source) {
            var qbSource = new Source(source.title || "SRC Ø", source.uri, self.project());
            $.each(source.datasets, function (j, dataset) {
              self.datasets.push(new Dataset(dataset.title || "DS Ø", dataset.uri, qbSource));
              // This is only to test.
              self.datasets.push(new Dataset(dataset.title || "DS2 Ø", dataset.uri, qbSource));
              self.datasets.push(new Dataset(dataset.title || "DS3 Ø", dataset.uri, qbSource));
            });
          });

          // This is only to test.
          $.each(data, function (i, source) {
            var qbSource = new Source(source.title || "SRC2 Ø", source.uri, self.project());
            $.each(source.datasets, function (j, dataset) {
              self.datasets.push(new Dataset(dataset.title || "DS4 Ø", dataset.uri, qbSource));
              self.datasets.push(new Dataset(dataset.title || "DS5 Ø", dataset.uri, qbSource));
            });
          });

          self.currentDataset(self.datasets()[0]);
        }
      );
    };

    self.initialize();

    self.explore = function (dataset) {
      self.currentDataset(dataset);
      self.state.selected(g.tabs.table);
    };

    /**
     * This computed observable is used to group the datasets into rows.
     * @return {Array}  An array of rows, each row containing one to {g.datasetsPerRow} datasets.
     */
    self.groupedDatasets = ko.computed(function () {
      var rows = [];
      var current = [];
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
