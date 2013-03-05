define([
  'config/global'
], function (g) {
  'use strict';

  /**
   * A datacube.Dataset is the combination of statistical data and
   * a structure for this statistical data, plus metadata.
   *
   * @param {String} uri         The URI of the dataset.
   * @param {Object} source      Its (Datalift) source.
   * @param {String} title       The title of the dataset.
   * @param {String} description The description of the dataset.
   * @param {String} identifier  Equivalent to dct:identifier.
   * @param {String} depiction   A URL to an image.
   * @param {Array} license      An array of licenses content.
   * @param {Array} origin       An array of origin content.
   * @param {String} date        Main date property.
   * @param {String} created     Creation date.
   * @param {String} issued      Publication date.
   * @param {String} modified    Last modification date.
   * @param {Array} seeAlso      Array of related resources.
   * @param {Array} subjects     Array of subjects of this dataset.
   * @param {Agent} publisher    An Agent responsible for publishing.
   * @param {Agent} creator      The creator of the dataset.
   * @param {Agent} contributor  One of its contributors.
   */
  var Dataset = function (uri, source, title, description, identifier, depiction, license, origin, date, created, issued, modified, seeAlso, subjects, publisher, creator, contributor) {
    var self = this;

    // All of these properties have unique values.
    self.uri           = uri;
    // This is a datacube.Source.
    self.source        = source;
    self.title         = title;
    self.description   = description;
    self.identifier    = identifier;
    self.depiction     = depiction;

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
