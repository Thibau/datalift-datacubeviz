define([
  'jquery',
  'knockout',
  'config/global',
  'models/TableOptions',
  'models/State',
  'models/datacube/Source',
  'models/datacube/Dataset',
  'models/datacube/Observation',
  'models/factories/DatasetFactory'
], function ($, ko, g, TableOptions, State, Source, Dataset, Observation, DatasetFactory) {
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
      // $.getJSON(g.remoteURL + g.paths.datasets + '?project=' + self.project() + '&language=' + self.language(),
      //   function (data) {
      //     // Our main working entity is a dataset, we add them to our view model.
      //     $.each(data, function (i, source) {
      //       var qbSource = new Source(source.uri, self.project(), source.title || "SRC Ø");
      //       $.each(source.datasets, function (j, dataset) {
      //         self.datasets.push(new Dataset(dataset.uri, qbSource, dataset.title || "DS Ø"));
      //         // This is only to test.
      //         self.datasets.push(new Dataset(dataset.uri, qbSource, dataset.title || "DS2 Ø"));
      //         self.datasets.push(new Dataset(dataset.uri, qbSource, dataset.title || "DS3 Ø"));
      //       });
      //     });

      //     self.currentDataset(self.datasets()[0]);
      //   }
      // );
      var metadataQuery = "PREFIX qb: <http://purl.org/linked-data/cube#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX dct: <http://purl.org/dc/terms/> PREFIX dc: <http://purl.org/dc/elements/1.1/> PREFIX foaf: <http://xmlns.com/foaf/0.1/> PREFIX skos: <http://www.w3.org/2004/02/skos/core#> PREFIX sdmx: <http://purl.org/linked-data/sdmx#> PREFIX sdmx-subject: <http://purl.org/linked-data/sdmx/2009/subject#> SELECT * WHERE { ?ds a qb:DataSet . OPTIONAL {{?ds dct:identifier ?id} UNION {?ds dc:identifier ?id}} . OPTIONAL { {?ds rdfs:label ?titleFR} UNION {?ds dct:title ?titleFR} UNION {?ds dc:title ?titleFR}. FILTER langMatches(lang(?titleFR), 'FR') . } . OPTIONAL { {?ds rdfs:label ?titleEN} UNION {?ds dct:title ?titleEN} UNION {?ds dc:title ?titleEN}. FILTER langMatches(lang(?titleEN), 'EN') . } . OPTIONAL { {?ds rdfs:label ?titleOther} UNION {?ds dct:title ?titleOther} UNION {?ds dc:title ?titleOther}. FILTER (!langMatches(lang(?titleOther), 'EN') &&  !langMatches(lang(?titleOther), 'FR')) . } . OPTIONAL { {?ds rdfs:comment ?descriptionFR} UNION {?ds dct:description ?descriptionFR} UNION {?ds dc:description ?descriptionFR} . FILTER langMatches(lang(?descriptionFR), 'FR') . } . OPTIONAL { {?ds rdfs:comment ?descriptionEN} UNION {?ds dct:description ?descriptionEN} UNION {?ds dc:description ?descriptionEN} . FILTER langMatches(lang(?descriptionEN), 'EN') . } . OPTIONAL { {?ds rdfs:comment ?descriptionOther} UNION {?ds dct:description ?descriptionOther} UNION {?ds dc:description ?descriptionOther} . FILTER (!langMatches(lang(?descriptionOther), 'EN') &&  !langMatches(lang(?descriptionOther), 'FR')) . } . OPTIONAL {?ds dct:license ?license} . OPTIONAL {{?ds dct:source ?source} UNION {?ds dc:source ?source}} . OPTIONAL {?ds rdfs:seeAlso ?seeAlso} . OPTIONAL {{?ds dct:date ?date} UNION {?ds dc:date ?date}} . OPTIONAL {?ds dct:created ?created} . OPTIONAL {?ds dct:issued ?issued} . OPTIONAL {?ds dct:modified ?modified} . OPTIONAL { {?ds dct:subject ?subject} UNION {?ds dc:subject ?subject} . OPTIONAL { FILTER (isLiteral(?subject)) OPTIONAL { {?ds dct:subject ?subjectFR} . FILTER langMatches(lang(?subjectFR), 'FR') . } . OPTIONAL { {?ds dct:subject ?subjectEN} . FILTER langMatches(lang(?subjectEN), 'EN') . } . OPTIONAL { {?ds dct:subject ?subjectOther} . FILTER (!langMatches(lang(?subjectOther), 'EN') &&  !langMatches(lang(?subjectOther), 'FR')) . } . } . OPTIONAL { FILTER (!isLiteral(?subject)) OPTIONAL { ?subject a ?subjectType FILTER (?subjectType = skos:Concept || ?subjectType = sdmx:Concept || ?subjectType = sdmx-subject:) OPTIONAL { {?ds skos:prefLabel ?subjectLabelFR} . FILTER langMatches(lang(?subjectLabelFR), 'FR') . } . OPTIONAL { {?ds skos:prefLabel ?subjectLabelEN} . FILTER langMatches(lang(?subjectLabelEN), 'EN') . } . OPTIONAL { {?ds skos:prefLabel ?subjectLabelOther} . FILTER (!langMatches(lang(?subjectLabelOther), 'EN') &&  !langMatches(lang(?subjectLabelOther), 'FR')) . } . } } . } . OPTIONAL { {?ds dct:contributor ?contributor} UNION {?ds dc:contributor ?contributor} . OPTIONAL { {?contributor foaf:name ?contributorName} UNION {?contributor rdfs:label ?contributorName} . } . OPTIONAL { {?contributor foaf:homepage ?contributorPage} UNION {?contributor foaf:page ?contributorPage} UNION {?contributor rdfs:seeAlso ?contributorPage}. } . } . OPTIONAL { {?ds dct:creator ?creator} UNION {?ds dc:creator ?creator} . OPTIONAL { {?creator foaf:name ?creatorName} UNION {?creator rdfs:label ?creatorName} . } . OPTIONAL { {?creator foaf:homepage ?creatorPage} UNION {?creator foaf:page ?creatorPage} UNION {?creator rdfs:seeAlso ?creatorPage}. } . } . OPTIONAL { {?ds dct:publisher ?publisher} UNION {?ds dc:publisher ?publisher} . OPTIONAL { {?publisher foaf:name ?publisherName} UNION {?publisher rdfs:label ?publisherName} . } . OPTIONAL { {?publisher foaf:homepage ?publisherPage} UNION {?publisher foaf:page ?publisherPage} UNION {?publisher rdfs:seeAlso ?publisherPage}. } . } . }";

      $.getJSON(g.paths.endpoint + '?default-graph-uri=internal&format=json&query=' + encodeURIComponent(metadataQuery),
        function (data) {
          var datasetFactory = new DatasetFactory(self.language());
          self.datasets(datasetFactory.buildDatasets(data.results.bindings));
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
      return rows;
    });

  };

  return ExplorerViewModel;
});
