define([
  'jquery',
  'knockout',
  'config/global',
  'bootstrap',
  'datatables',
  'extends/datatables-bootstrap',
  'fixedcol'
], function ($, ko, g) {
  'use strict';

  // A custom binding to handle the enter key (could go in a separate library)
  ko.bindingHandlers.enterKey = {
    init: function (element, valueAccessor, allBindingsAccessor, data) {
      var wrappedHandler, newValueAccessor;

      // wrap the handler with a check for the enter key
      wrappedHandler = function (data, event) {
        if (event.keyCode === g.ENTER_KEY) {
          valueAccessor().call(this, data, event);
        }
      };

      // create a valueAccessor with the options that we would want to pass to the event binding
      newValueAccessor = function () {
        return {
          keyup: wrappedHandler
        };
      };

      // call the real event binding's init function
      ko.bindingHandlers.event.init(element, newValueAccessor, allBindingsAccessor, data);
    }
  };

  // Wrapper to hasfocus that also selects text and applies focus async
  ko.bindingHandlers.selectAndFocus = {
    init: function (element, valueAccessor, allBindingsAccessor) {
      ko.bindingHandlers.hasfocus.init(element, valueAccessor, allBindingsAccessor);
      ko.utils.registerEventHandler(element, 'focus', function () {
        element.focus();
      });
    },
    update: function (element, valueAccessor) {
      ko.utils.unwrapObservable(valueAccessor()); // for dependency
      // ensure that element is visible before trying to focus
      setTimeout(function () {
        ko.bindingHandlers.hasfocus.update(element, valueAccessor);
      }, 0);
    }
  };

  // Custom binding to trigger modals.
  ko.bindingHandlers['modal'] = {
    init: function (element) {
      $(element).modal({show : false});
    },
    update: function (element, valueAccessor) {
      var value = ko.utils.unwrapObservable(valueAccessor());

      if (value) {
        $(element).modal('show');
      } else {
        $(element).modal('hide');
      }
    }
  };

  // Custom binding to trigger tooltips.
  ko.bindingHandlers['tooltip'] = {
    init: function (element, valueAccessor) {
      var value = ko.utils.unwrapObservable(valueAccessor());
      $(element).tooltip({
        title: value
      });
    },
    update: function (element, valueAccessor) {
      var value = ko.utils.unwrapObservable(valueAccessor());
      $(element).tooltip({
        title: value
      });
    }
  };

  /**
   * knockout.bindingHandlers.dataTable.js v1.0
   *
   * Copyright (c) 2011, Josh Buckley (joshbuckley.co.uk).
   * License: MIT (http://www.opensource.org/licenses/mit-license.php)
   *
   * Example Usage:
   *     <table data-bind="dataTable: {data: myData, options: { key: val } }">
   *
   * Modified to work with observable options and to be able to reload options
   * when they change.
   */
  ko.bindingHandlers.dataTable = {
      init: function (element, valueAccessor) {

      },
      update: function (element, valueAccessor) {
        var binding = ko.utils.unwrapObservable(valueAccessor());

        var table = $(element).dataTable(binding.options());
        table.fnClearTable();
        table.fnAddData(binding.data());
        new FixedColumns(table);
      }
    };
});
