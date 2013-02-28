define([
  'jquery',
  'knockout',
  'config/global'
], function($, ko, g){
  'use strict';

  var ExplorerViewModel = function() {
    var self = this;

    var sources = ko.observableArray();

    var currentDataSet = ko.observable();


  };

  return ExplorerViewModel;
});
