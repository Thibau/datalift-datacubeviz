define([
  'jquery',
  'knockout',
  'config/global',
  'models/TableOptions',
  'models/State',
  'models/datacube/Source',
  'models/datacube/Dataset',
  'models/datacube/Observation'
], function ($, ko, g, TableOptions, State, Source, Dataset, Observation) {
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

    self.tableOptions   = ko.observable(new TableOptions(self.language()));

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
            var qbSource = new Source(source.uri, self.project(), source.title || "SRC Ø");
            $.each(source.datasets, function (j, dataset) {
              self.datasets.push(new Dataset(dataset.uri, qbSource, dataset.title || "DS Ø"));
              // This is only to test.
              self.datasets.push(new Dataset(dataset.uri, qbSource, dataset.title || "DS2 Ø"));
              self.datasets.push(new Dataset(dataset.uri, qbSource, dataset.title || "DS3 Ø"));
            });
          });

          self.currentDataset(self.datasets()[0]);
        }
      );
    };

    self.initialize();

    self.explore = function (dataset) {
      self.currentDataset(dataset);

      self.populate();

      self.state.selected(g.tabs.table);
    };

    self.populate = function () {
            //self.tableContent([]);

      $.getJSON(g.paths.observations,
        function (data) {
          var observations = {};
          var bnode;

          $.each(data.results.bindings, function (i, binding) {
            // obs.value is the Observation bnode, thus unique.
            bnode = binding.obs.value;
            observations[bnode] = observations[bnode] || {};
            observations[bnode][binding.compoProp.value] = binding.value.value;
          });


          self.currentObservations(
            $.map(observations, function (components, bnode) {
              return new Observation(bnode, components);
            })
          );
        }
      );
    }

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

    self.tableContent = ko.computed(function () {
      var rows = [];
      if (self.currentObservations().length > 0) {
        $.each(self.currentObservations(), function (index, observation) {
          rows.push($.map(observation.components, function (value, key) { return value; }));
        });
      }
      else {
        rows = [[0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0], [0, 1, 4, 5], [3, 2, 1, 0]];
      }

      console.log(rows);
      return rows;
    });

  };

  return ExplorerViewModel;
});
