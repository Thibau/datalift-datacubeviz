define([
  'config/global'
], function (g) {
  'use strict';

  var Observation = function (identifier, components) {
    var self = this;

    self.identifier = identifier;
    self.components = components;
  };

  return Observation;
});
