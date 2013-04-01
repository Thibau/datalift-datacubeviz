define([
  'jquery',
  'knockout',
  'config/global',
  'config/endpoint',
  'models/TableOptions',
  'models/State',
  'models/datacube/Source',
  'models/datacube/Dataset',
  'models/datacube/Observation',
  'models/factories/DatasetFactory',
  'models/factories/ObservationFactory',
  'models/factories/ComponentFactory'
], function ($, ko, g, endpoint, TableOptions, State, Source, Dataset, Observation, DatasetFactory, ObservationFactory, ComponentFactory) {
  'use strict';

  /**
   * What's next (TODO) :
   * - "Pipe and filter" data from the observations to the views (table / charts).
   * - Be able to visualize subsets of the triples in those views.
   * - "Pipe and filter" components (structure) of the current dataset from the server (/ SPARQL Endpoint).
   * - "Pipe and filter" those components to our model.
   * - "Pipe and filter" our model to the controls to manage the views.
   * - Add more views.
   * - Add a management of history.
   *
   * Those are the two main items to make the module work, but it is also necessary to strenghten it.
   * On the server side, it might be better to delegate some processing to the server component of the module.
   * Either to parallelize development or to make responsibilities more manageable.
   * For example to be able to embed visualization widgets inside other "pages" outside of the module.
   */

  /**
   * A view model which manages the exploration of DataCube datasets
   * contained inside DataCube sources.
   * @param {String} project  The URI of the current project (to retrieve datasets).
   * @param {String} language The current user language preference, same purpose.
   */
  var ExplorerViewModel = function (project, language) {
    var self = this;

    self.project             = ko.observable(project);
    self.language            = ko.observable(language);
    self.state               = new State();

    self.datasets            = ko.observableArray([]);
    self.currentDataset      = ko.observable();
    self.currentComponents   = ko.observableArray([]);
    self.currentObservations = ko.observableArray([]);


    self.stubData = [{key: "Cumulative Return", values: [{label: "One", value : 29.765957771107}, {label: "Two", value : 0}, {label: "Three", value : 32.807804682612}, {label: "Four", value : 196.45946739256}, {label: "Five", value : 0.19434030906893}, {label: "Six", value : 98.079782601442}, {label: "Seven", value : 13.925743130903}, {label: "Eight", value : 5.1387322875705}]}];

    /**
     * Initializes our explorer by retrieving the metadata for each dataset.
     */
    self.initialize = function () {
      $.getJSON(g.paths.endpoint + endpoint.parameters(g.project) + encodeURIComponent(endpoint.query.metadata()),
        function (data) {
          var datasetFactory = new DatasetFactory(self.language());
          self.datasets(datasetFactory.build(data.results.bindings));
          self.currentDataset(self.datasets()[0]);
          self.populate();
        }
      );
    };

    /**
     * Populates our views with data (observations) and datastructure (components) for the current dataset.
     */
    self.populate = function () {
      var datasetURI = self.currentDataset().uri;
      var endpointURL = g.paths.endpoint + endpoint.parameters(g.project);

      $.getJSON(endpointURL + encodeURIComponent(endpoint.query.observations(datasetURI)),
        function (data) {
          var observationFactory = new ObservationFactory();
          self.currentObservations(observationFactory.build(data.results.bindings));
        }
      );

      $.getJSON(endpointURL + encodeURIComponent(endpoint.query.components(datasetURI)),
        function (data) {
          var componentFactory = new ComponentFactory();
          self.currentComponents(componentFactory.build(data.results.bindings));
        }
      );
    };

    self.initialize();

    /**
     * Change the current dataset and start populating our views with its data.
     * @param  {Object} dataset A DataCube Dataset.
     */
    self.explore = function (dataset) {
      self.currentDataset(dataset);
      self.populate();
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

    /**
     * This computed observable exposes a glimpse of the dataset structure for the table view.
     * @return {Object}           A Datatables configuration in a TableOptions object.
     */
    self.tableOptions = ko.computed(function () {
      var columns = [];
      // TODO Use the components to define the columns.
      if (self.currentObservations().length) {
        for (var i = 0; i < 4; i++) {
          columns.push({sTitle: 'Column' + i});
        }
      }
      return new TableOptions(self.language(), columns);
    });

    /**
     * Exposes a table-friendlty subset of our observations for Datatables.
     */
    self.tableContent = ko.computed(function () {
      var rows = [];
      $.each(self.currentObservations(), function (index, observation) {
        rows.push($.map(observation.components, function (value, key) { return value; }));
      });
      return rows;
    });

  };

  return ExplorerViewModel;
});
