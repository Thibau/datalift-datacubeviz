define([
  'jquery',
  'config/global',
  'models/datacube/Dataset',
  'models/datacube/Agent'
], function ($, g, Dataset, Agent) {
  'use strict';

  var DatasetFactory = function (lang) {
    var self = this;

    self.lang = lang.toUpperCase();

    self.getValueIf = function (obj) {
      return obj && obj.value;
    };

    self.buildDatasets = function (bindings) {
      var rawDatasets = {};
      var current, uri;

      $.each(bindings, function (i, binding) {
        uri = binding.ds.value;
        current = rawDatasets[uri];
        if (!current) {
          current             = {};
          current.uri         = uri;
          current.source      = {};
          current.title       = self.getValueIf(binding['title' + self.lang]) || binding.titleOther.value;
          current.description = self.getValueIf(binding['description' + self.lang]) || binding.descriptionOther.value;
          current.identifier  = self.getValueIf(binding.identifier);
          current.depiction   = self.getValueIf(binding.depiction);

          current.date        = self.getValueIf(binding.date);
          current.created     = self.getValueIf(binding.created);
          current.issued      = self.getValueIf(binding.issued);
          current.modified    = self.getValueIf(binding.modified);

          current.seeAlso     = [];
          current.subjects    = [];
          current.origin      = [];
          current.license     = [];

          current.publisher   = binding.publisher && new Agent(binding.publisher.value, binding.publisherName.value, binding.publisherPage.value);
          current.creator     = binding.creator && new Agent(binding.creator.value, binding.creatorName.value, binding.creatorPage.value);
          current.contributor = binding.contributor && new Agent(binding.contributor.value, binding.contributorName.value, binding.contributorPage.value);
        }

        if (binding.seeAlso && current.seeAlso.indexOf(binding.seeAlso.value) === -1) {
          current.seeAlso.push(binding.seeAlso.value);
        }
        if (binding.subject && current.subjects.indexOf(binding.subject.value) === -1) {
          current.subjects.push(binding.subject.value);
        }
        if (binding.subjectLabel && current.subjects.indexOf(binding.subjectLabel.value) === -1) {
          current.subjects.push(binding.subjectLabel.value);
        }
        if (binding.origin && current.origin.indexOf(binding.origin.value) === -1) {
          current.origin.push(binding.origin.value);
        }
        if (binding.license && current.license.indexOf(binding.license.value) === -1) {
          current.license.push(binding.license.value);
        }

        rawDatasets[uri] = current;
      });

      var result = $.map(rawDatasets, function (ds, uri) {
        return new Dataset(ds.uri, ds.source, ds.title, ds.description, ds.identifier, ds.depiction, ds.license, ds.origin, ds.date, ds.created, ds.issued, ds.modified, ds.seeAlso, ds.subjects, ds.publisher, ds.creator, ds.contributor);
      });

      return result;
    };
  };

  return DatasetFactory;
});
