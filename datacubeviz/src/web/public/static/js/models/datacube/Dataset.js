define([
  'config/global'
], function (g) {
  'use strict';

  var Dataset = function (uri, source, title, description, identifier, publisher, creator, contributor) {
    var self = this;

    // All of these properties have unique values.
    self.uri           = uri;
    // This is a datacube.Source.
    self.source        = source;
    self.title         = title;
    self.description   = description;
    self.identifier    = identifier;

    // self.license       = license;
    // self.provenance    = provenance;
    // self.provenanceURL = provenanceURL;
    // self.seeAlso       = seeAlso;

    // self.date          = date;
    // self.created       = created;
    // self.issued        = issued;
    // self.modified      = modified;

    // self.subjects      = subjects;

    // All three of the datacube.Agent type.
    self.publisher     = publisher;
    self.creator       = creator;
    self.contributor   = contributor;

  };

  return Dataset;
});
