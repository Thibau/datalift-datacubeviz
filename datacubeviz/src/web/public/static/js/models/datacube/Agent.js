define([
  'config/global'
], function (g) {
  'use strict';

  /**
   * Represents an Agent in the DC vocabulary. Can either be
   * an individual, a group or an organization.
   * @param {String} identifier ID (Bnode) or URI of the agent.
   * @param {String} name       Official name.
   * @param {String} website    URL to a web page about the agent.
   */
  var Agent = function (identifier, name, website) {
    var self = this;

    self.identifier = identifier;
    self.name       = name;
    self.website    = website;
  };

  return Agent;
});
