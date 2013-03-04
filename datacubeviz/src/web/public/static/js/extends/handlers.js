define([
  'jquery',
  'knockout',
  'config/global',
  'bootstrap',
  'datatables',
  'nvd3'
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
   * Modified to work with observable options and to be able to reload options
   * when they change.
   * And to only reload everything if we are switching to the right tab.
   */
  ko.bindingHandlers.dataTable = {
      init: function (element, valueAccessor) {

      },
      update: function (element, valueAccessor) {
        var binding = ko.utils.unwrapObservable(valueAccessor());

        // We don't need to refresh the table if the displayed tab isn't the right one.
        if (binding.visible) {
          var table = $(element).dataTable(binding.options());
          table.fnClearTable();
          table.fnAddData(binding.data());
        }
      }
    };


    ko.bindingHandlers.nvChart = {
      init: function (element, valueAccessor) {

      },
      update: function (element, valueAccessor) {
        var binding = ko.utils.unwrapObservable(valueAccessor());

        if (binding) {
          var data = function() {
            var sin = [],
                cos = [];

            for (var i = 0; i < 100; i++) {
              sin.push({x: i, y: Math.sin(i/10)});
              cos.push({x: i, y: .5 * Math.cos(i/10)});
            }

            return [
              {
                values: sin,
                key: 'Sine Wave',
                color: '#ff7f0e'
              },
              {
                values: cos,
                key: 'Cosine Wave',
                color: '#2ca02c'
              }
            ];
          };

          nv.addGraph(function() {
            var chart = nv.models.lineChart();

            chart.xAxis
                .axisLabel('Time (ms)')
                .tickFormat(d3.format(',r'));

            chart.yAxis
                .axisLabel('Voltage (v)')
                .tickFormat(d3.format('.02f'));

            d3.select('#chart svg')
                .datum(data())
              .transition().duration(500)
                .call(chart);

            nv.utils.windowResize(chart.update);

            return chart;
          });
        }
      }
    }
});
