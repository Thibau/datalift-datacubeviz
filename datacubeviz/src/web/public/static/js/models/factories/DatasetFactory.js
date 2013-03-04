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

    self.buildDatasets = function (bindings) {
      var rawDatasets = {};
      var current, uri;

      $.each(bindings, function (i, binding) {
        uri = binding.ds.value;
        current = rawDatasets[uri];
        if (current) {

        }
        else {
          current = {};
          current.uri = uri;
          current.source = {};
          current.title = binding['title' + self.lang] && binding['title' + self.lang].value || binding.titleOther.value;
          current.description = binding['description' + self.lang] && binding['description' + self.lang].value || binding.descriptionOther.value;
          current.identifier = binding.identifier;
          current.publisher = binding.publisher && new Agent(binding.publisher, binding.publisherName, binding.publisherPage);
          current.creator = binding.creator && new Agent(binding.creator, binding.creatorName, binding.creatorPage);
          current.contributor = binding.contributor && new Agent(binding.contributor, binding.contributorName, binding.contributorPage);
        }
        rawDatasets[uri] = current;
      });

      var result = $.map(rawDatasets, function (ds, uri) {
        return new Dataset(ds.uri, ds.source, ds.title, ds.description, ds.identifier, ds.publisher, ds.creator, ds.contributor);
      });

      return result;
    };
  };

  return DatasetFactory;
});
