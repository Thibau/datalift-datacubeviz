define([
  'config/global'
], function (g) {
  'use strict';

  /**
   * TODO. TODO. TODO.
   * A datacube.Concept. Used in Codelists.
   */
  var Concept = function (identifier, label, sameAs) {
    var self = this;

    self.identifier = identifier;
    self.label = label;
    self.sameAs = sameAs;

  };

  return Concept;
});
