define([
  'jquery',
  'config/global',
  'models/datacube/Component'
], function ($, g, Component) {
  'use strict';

  /**
   * TODO. TODO. TODO.
   * This class helps generating datacube.Components from the data
   * sent by the server. It basically manages a mapping between
   * the JSON message and our class.
   */
  var ComponentFactory = function () {
    var self = this;

    self.build = function (bindings) {
      var components = {};
      var bnode;

      $.each(bindings, function (i, binding) {

        bnode = binding.obs.value;
        // Retrieve or create, then make the observation a map of component - value.
        components[bnode] = components[bnode] || {};
        //components[bnode]
      });

      // Now that one object equals one observation, we can build them with the constructor.
      var result = $.map(components, function (component, bnode) {
        return new Component();
      });

      return result;
    };
  };

  return ComponentFactory;
});
