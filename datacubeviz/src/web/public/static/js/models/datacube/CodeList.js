define([
  'config/global'
], function (g) {
  'use strict';

  /**
   * TODO. TODO. TODO.
   * A datacube.CodeList. Used in datasets' structure.
   */
  var CodeList = function (identifier, label) {
    var self = this;

    self.identifier = identifier;
    self.label = label;

    self.codes = {};

    self.pushCode = function (code) {
      self.codes[code.identifier] = code;
    };

    self.getCode = function (identifier) {
      return self.codes[identifier];
    };
  };

  return CodeList;
});
