define([
  'jquery',
  'knockout',
  'config/global',
  'd3',
  'nvd3'
], function ($, ko, g, d3, nv) {
  'use strict';

    /**
     * Here are stored some handlers for D3 / NVD3.
     * Those handle bindings which need two things :
     * - Data, in a format compatible with the handler
     * - Parameters for the visualization.
     */

    ko.bindingHandlers.nvChart = {
      init: function (element, valueAccessor) {},
      update: function (element, valueAccessor) {
        var binding = ko.utils.unwrapObservable(valueAccessor());

        if (binding) {
          var data = function() {
            var sin = [],
                cos = [];

            for (var i = 0; i < 100; i++) {
              sin.push({x: i, y: Math.sin(i/10)});
              cos.push({x: i, y: 0.5 * Math.cos(i/10)});
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

            d3.select(element)
                .datum(data())
              .transition().duration(500)
                .call(chart);

            nv.utils.windowResize(chart.update);

            return chart;
          });
        }
      }
    };


    ko.bindingHandlers.pieChart = {
      init: function (element, valueAccessor) {},
      update: function (element, valueAccessor) {
        var binding = ko.utils.unwrapObservable(valueAccessor());

        // var data = [{
        //   key: "Cumulative Return",
        //   values: [
        //     {label: "One", value : 29.765957771107},
        //     {label: "Two", value : 0},
        //     {label: "Three", value : 32.807804682612},
        //     {label: "Four", value : 196.45946739256},
        //     {label: "Five", value : 0.19434030906893},
        //     {label: "Six", value : 98.079782601442},
        //     {label: "Seven", value : 13.925743130903},
        //     {label: "Eight", value : 5.1387322875705}
        //   ]
        // }
        // ];

        if (binding.visible) {

          nv.addGraph(function() {
            var chart = nv.models.pieChart()
              .x(function(d) { return d.label; })
              .y(function(d) { return d.value; })
              .showLabels(true)
              .noData("Ø")
              .labelThreshold(0.03);

            d3.select(element)
              .datum(binding.data)
              .transition().duration(500)
              .call(chart);

              return chart;
          });

        }

      }
    };

    // A doughnut chart is a pie chart without its center (Bagel chart).
    ko.bindingHandlers.donutChart = {
      init: function (element, valueAccessor) {},
      update: function (element, valueAccessor) {
        var binding = ko.utils.unwrapObservable(valueAccessor());

        if (binding.visible) {
          nv.addGraph(function() {
            var chart = nv.models.pieChart()
              .x(function(d) { return d.label; })
              .y(function(d) { return d.value; })
              .showLabels(true)
              .noData("Ø")
              .labelThreshold(0.05)
              .donut(true);

            d3.select(element)
              .datum(binding.data)
              .transition().duration(500)
              .call(chart);

              return chart;
          });
        }
      }
    };

    // A bullet chart is useful when displaying only one value with context.
    ko.bindingHandlers.bulletChart = {
      init: function (element, valueAccessor) {},
      update: function (element, valueAccessor) {
        var binding = ko.utils.unwrapObservable(valueAccessor());

        // {
        //   "title": "Revenue",
        //   "subtitle": "US$, in thousands",
        //   "ranges": [150,225,300],
        //   "measures": [220],
        //   "markers": [250]
        // }

        if (binding.visible) {
          nv.addGraph(function() {
            var chart = nv.models.bulletChart();

            d3.select(element)
              .datum(binding.data)
              .transition().duration(500)
              .call(chart);

            return chart;
          });
        }
      }
    };

    // A bar chart is good when comparing data.
    ko.bindingHandlers.barChart = {
      init: function (element, valueAccessor) {},
      update: function (element, valueAccessor) {
        var binding = ko.utils.unwrapObservable(valueAccessor());

        // [
        //   {
        //     key: "Cumulative Return",
        //     values: [
        //       {"label" : "A" , "value" : -29.765957771107} ,
        //       {"label" : "B" , "value" : 0} ,
        //       {"label" : "C" , "value" : 32.807804682612} ,
        //       {"label" : "D" , "value" : 196.45946739256} ,
        //       {"label" : "E" , "value" : 0.19434030906893} ,
        //       {"label" : "F" , "value" : -98.079782601442} ,
        //       {"label" : "G" , "value" : -13.925743130903} ,
        //       {"label" : "H" , "value" : -5.1387322875705}
        //     ]
        //   }
        // ]

        if (binding.visible) {
          nv.addGraph(function() {
            var chart = nv.models.discreteBarChart()
                .x(function(d) { return d.label;})
                .y(function(d) { return d.value;})
                .staggerLabels(false)
                .tooltips(true)
                .showValues(true);

            d3.select(element)
              .datum(binding.data)
              .transition().duration(500)
              .call(chart);

            nv.utils.windowResize(chart.update);

            return chart;
          });

        }
      }
    };
});
