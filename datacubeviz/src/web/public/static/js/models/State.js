define([
  'jquery',
  'knockout',
  'config/global'
], function ($, ko, g) {
  'use strict';

  /**
   * An application state prototype used to delegate
   * the view model's keeping track duty.
   */
  var State = function () {
    var self = this;

    // The selected property is used to control the module's tabs.
    self.selected = ko.observable(g.tabs.explorer);

    self.isSelected = function (tab) {
      return self.selected() === tab;
    };
  };

  return State;
});
