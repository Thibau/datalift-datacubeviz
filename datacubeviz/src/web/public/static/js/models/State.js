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
  };

  return State;
});
