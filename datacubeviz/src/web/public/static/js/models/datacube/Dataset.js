define([
  'config/global'
], function (g) {
  'use strict';

  var Dataset = function (uri, source, title, description, identifier, license, origin, date, created, issued, modified, seeAlso, subjects, publisher, creator, contributor) {
    var self = this;

    // All of these properties have unique values.
    self.uri           = uri;
    // This is a datacube.Source.
    self.source        = source;
    self.title         = title;
    self.description   = description;
    self.identifier    = identifier;

    // Those are arrays. origin is equal to dct:source.
    self.license       = license;
    self.origin        = origin;

    // The dates are unique too (they are assumed equal between bindings).
    self.date          = date;
    self.created       = created;
    self.issued        = issued;
    self.modified      = modified;

    // Arrays. Subjects are URIs or Strings.
    self.seeAlso       = seeAlso;
    self.subjects      = subjects;

    // All three of the datacube.Agent type.
    self.publisher     = publisher;
    self.creator       = creator;
    self.contributor   = contributor;

  };

  return Dataset;
});
