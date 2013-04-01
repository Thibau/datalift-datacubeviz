define([
  'config/global'
], function (g) {
  'use strict';

  /**
   * An observation is a DataCube entity which is a part of a statistical dataset.
   * @param {String} identifier The unique identifier for the observation (BNode, URI).
   * @param {Object} components The components of the observation : key/value pairs,
   * where key is the predicate and value its object.
   */
  var Observation = function (identifier, components) {
    var self = this;

    self.identifier = identifier;
    self.components = components;

  };

  return Observation;
});
