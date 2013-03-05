define([
  'jquery',
  'config/global',
  'models/datacube/Observation'
], function ($, g, Observation) {
  'use strict';

  /**
   * This class helps generating datacube.Observations from the data
   * sent by the server. It basically manages a mapping between
   * the JSON message and our class.
   */
  var ObservationFactory = function () {
    var self = this;

    self.buildObservations = function (bindings) {
      var observations = {};
      var bnode;

      $.each(bindings, function (i, binding) {
        // obs.value is the Observation bnode, thus unique.
        bnode = binding.obs.value;
        // Retrieve or create, then make the observation a map of component - value.
        observations[bnode] = observations[bnode] || {};
        observations[bnode][binding.compoProp.value] = binding.value.value;
      });

      // Now that one object equals one observation, we can build them with the constructor.
      var result = $.map(observations, function (components, bnode) {
        return new Observation(bnode, components);
      });

      return result;
    };
  };

  return ObservationFactory;
});
