define([
  'jquery',
  'knockout',
  'config/global',
  'models/TableOptions',
  'models/State',
  'models/datacube/Source',
  'models/datacube/Dataset',
  'models/datacube/Observation',
  'models/factories/DatasetFactory',
  'models/factories/ObservationFactory',
  'models/factories/ComponentFactory',
], function ($, ko, g, TableOptions, State, Source, Dataset, Observation, DatasetFactory, ObservationFactory, ComponentFactory) {
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


    self.stubData = [{key: "Cumulative Return",values: [{label: "One", value : 29.765957771107},{label: "Two", value : 0},{label: "Three", value : 32.807804682612},{label: "Four", value : 196.45946739256},{label: "Five", value : 0.19434030906893},{label: "Six", value : 98.079782601442},{label: "Seven", value : 13.925743130903},{label: "Eight", value : 5.1387322875705}]}];
    /*
    TODO :
    - So many things.
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
      //       });
      //     });

      //     self.currentDataset(self.datasets()[0]);
      //   }
      // );
      var metadataQuery = "PREFIX qb: <http://purl.org/linked-data/cube#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX dct: <http://purl.org/dc/terms/> PREFIX dc: <http://purl.org/dc/elements/1.1/> PREFIX foaf: <http://xmlns.com/foaf/0.1/> PREFIX skos: <http://www.w3.org/2004/02/skos/core#> PREFIX sdmx: <http://purl.org/linked-data/sdmx#> PREFIX sdmx-subject: <http://purl.org/linked-data/sdmx/2009/subject#> SELECT * WHERE { ?ds a qb:DataSet . OPTIONAL {{?ds dct:identifier ?id} UNION {?ds dc:identifier ?id}} . OPTIONAL {?ds foaf:depiction ?depiction} . OPTIONAL { {?ds rdfs:label ?titleFR} UNION {?ds dct:title ?titleFR} UNION {?ds dc:title ?titleFR}. FILTER langMatches(lang(?titleFR), 'FR') . } . OPTIONAL { {?ds rdfs:label ?titleEN} UNION {?ds dct:title ?titleEN} UNION {?ds dc:title ?titleEN}. FILTER langMatches(lang(?titleEN), 'EN') . } . OPTIONAL { {?ds rdfs:label ?titleOther} UNION {?ds dct:title ?titleOther} UNION {?ds dc:title ?titleOther}. FILTER (!langMatches(lang(?titleOther), 'EN') &&  !langMatches(lang(?titleOther), 'FR')) . } . OPTIONAL { {?ds rdfs:comment ?descriptionFR} UNION {?ds dct:description ?descriptionFR} UNION {?ds dc:description ?descriptionFR} . FILTER langMatches(lang(?descriptionFR), 'FR') . } . OPTIONAL { {?ds rdfs:comment ?descriptionEN} UNION {?ds dct:description ?descriptionEN} UNION {?ds dc:description ?descriptionEN} . FILTER langMatches(lang(?descriptionEN), 'EN') . } . OPTIONAL { {?ds rdfs:comment ?descriptionOther} UNION {?ds dct:description ?descriptionOther} UNION {?ds dc:description ?descriptionOther} . FILTER (!langMatches(lang(?descriptionOther), 'EN') &&  !langMatches(lang(?descriptionOther), 'FR')) . } . OPTIONAL {?ds dct:license ?license} . OPTIONAL {{?ds dct:source ?source} UNION {?ds dc:source ?source}} . OPTIONAL {?ds rdfs:seeAlso ?seeAlso} . OPTIONAL {{?ds dct:date ?date} UNION {?ds dc:date ?date}} . OPTIONAL {?ds dct:created ?created} . OPTIONAL {?ds dct:issued ?issued} . OPTIONAL {?ds dct:modified ?modified} . OPTIONAL { {?ds dct:subject ?subject} UNION {?ds dc:subject ?subject} . OPTIONAL { FILTER (!isLiteral(?subject)) OPTIONAL { ?subject a ?subjectType FILTER (?subjectType = skos:Concept || ?subjectType = sdmx:Concept || ?subjectType = sdmx-subject:) OPTIONAL {   {?subject skos:prefLabel ?subjectLabel} . } . } } . } . OPTIONAL { {?ds dct:contributor ?contributor} UNION {?ds dc:contributor ?contributor} . OPTIONAL { {?contributor foaf:name ?contributorName} UNION {?contributor rdfs:label ?contributorName} . } . OPTIONAL { {?contributor foaf:homepage ?contributorPage} UNION {?contributor foaf:page ?contributorPage} UNION {?contributor rdfs:seeAlso ?contributorPage}. } . } . OPTIONAL { {?ds dct:creator ?creator} UNION {?ds dc:creator ?creator} . OPTIONAL { {?creator foaf:name ?creatorName} UNION {?creator rdfs:label ?creatorName} . } . OPTIONAL { {?creator foaf:homepage ?creatorPage} UNION {?creator foaf:page ?creatorPage} UNION {?creator rdfs:seeAlso ?creatorPage}. } . } . OPTIONAL { {?ds dct:publisher ?publisher} UNION {?ds dc:publisher ?publisher} . OPTIONAL { {?publisher foaf:name ?publisherName} UNION {?publisher rdfs:label ?publisherName} . } . OPTIONAL { {?publisher foaf:homepage ?publisherPage} UNION {?publisher foaf:page ?publisherPage} UNION {?publisher rdfs:seeAlso ?publisherPage}. } . } . }";

      $.getJSON(g.paths.endpoint + '?default-graph-uri=internal&format=json&query=' + encodeURIComponent(metadataQuery),
        function (data) {
          var datasetFactory = new DatasetFactory(self.language());
          self.datasets(datasetFactory.build(data.results.bindings));
          self.currentDataset(self.datasets()[0]);
          self.populate();
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
      var datasetURI = self.currentDataset().uri;

      var observationQuery = "PREFIX qb: <http://purl.org/linked-data/cube#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX owl: <http://www.w3.org/2002/07/owl#> SELECT ?obs ?compoProp ?value WHERE { ?obs a qb:Observation . {?obs qb:dataset <"+datasetURI+">} UNION {?obs qb:dataSet <"+datasetURI+">} . ?obs ?compoProp ?value . FILTER (?compoProp != rdf:type && ?compoProp != qb:dataset && ?compoProp != qb:dataSet) }";
      $.getJSON(g.paths.endpoint + '?default-graph-uri=internal&format=json&query=' + encodeURIComponent(observationQuery),
        function (data) {
          var observationFactory = new ObservationFactory();
          self.currentObservations(observationFactory.build(data.results.bindings));
        }
      );

      var componentQuery = "PREFIX qb: <http://purl.org/linked-data/cube#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> SELECT * WHERE { <"+datasetURI+"> a qb:DataSet . ?ds qb:structure ?dsd . ?dsd qb:componENt ?compo . OPTIONAL { ?compo ?compoNature ?compoProp . FILTER (?compoNature != rdf:type && ?compoNature != rdfs:label && ?compoNature != rdfs:commENt && ?compoNature != qb:order) . OPTIONAL { ?compoProp a rdfs:Property . ?compoProp ?compoPropNature ?propConcept . FILTER (?compoPropNature != rdf:type) . OPTIONAL { ?propConcept rdfs:label ?propConceptLabelEn . FILTER langMatches(lang(?propConceptLabelEn), 'EN') . } . OPTIONAL { ?propConcept rdfs:label ?propConceptLabelFr . FILTER langMatches(lang(?propConceptLabelFr), 'FR') . } . OPTIONAL { ?propConcept rdfs:label ?propConceptLabelOther . FILTER ( !langMatches(lang(?propConceptLabelOther), 'FR') && !langMatches(lang(?propConceptLabelOther), 'EN') ) } . OPTIONAL { ?propConcept rdfs:commENt ?propConceptCommENt . } } . } . OPTIONAL { OPTIONAL { ?compo rdfs:label ?compoLabelEn . FILTER langMatches(lang(?compoLabelEn), 'EN') . } . OPTIONAL { ?compo rdfs:label ?compoLabelFr . FILTER langMatches(lang(?compoLabelFr), 'FR') . } . OPTIONAL { ?compo rdfs:label ?compoLabelOther . FILTER ( !langMatches(lang(?compoLabelOther), 'FR') && !langMatches(lang(?compoLabelOther), 'EN') ) } . } }";
      $.getJSON(g.paths.endpoint + '?default-graph-uri=internal&format=json&query=' + encodeURIComponent(componentQuery),
        function (data) {
          var componentFactory = new ComponentFactory();
          self.currentComponents(componentFactory.build(data.results.bindings));
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

    self.tableOptions = ko.computed(function () {
      var columns = [ { sTitle: 'Col1' }, { sTitle: 'Col2' }, { sTitle: 'Col3' }, { sTitle: 'Col4' }];
      return new TableOptions(self.language(), columns);
    });

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
