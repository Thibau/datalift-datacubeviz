define([
  'config/global'
], function (g) {
  'use strict';

  var Concept = function (identifier, label, sameAs) {
    var self = this;

    self.identifier = identifier;
    self.label = label;
    self.sameAs = sameAs;

  };

  return Concept;
});
