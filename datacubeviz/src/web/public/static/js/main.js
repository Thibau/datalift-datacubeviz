require.config({
  // Prod/Dev : baseUrl : 'http://localhost:1337/static/js',
  baseUrl : 'datacubeviz/static/js',
  // Require.js allows us to configure shortcut alias
  paths : {
    jquery : 'libs/jquery-1.9.1.min',
    bootstrap : 'libs/bootstrap-2.3.0.min',
    knockout : 'libs/knockout-2.2.1.min',
    datatables : 'libs/datatables-1.9.4.min',
    colreorder : 'libs/colreorderresize-1.0.7.min',
    colvis : 'libs/colvis-1.0.8.min',
    d3 : 'libs/d3-2.10.2.min',
    nvd3 : 'libs/nvd3-0.0.1a.min'
  },
  shim : {
    // Set dependencies.
    bootstrap : ['jquery'],
    datatables : ['jquery'],
    colreorder : ['jquery', 'datatables'],
    colvis : ['jquery', 'bootstrap', 'datatables'],
    // D3 and NVD3 doesn't support AMD, but they expose global variables.
    d3 : {
      exports: 'd3'
    },
    nvd3: {
      deps: ['d3'],
      exports: 'nv'
    },
    'extends/datatables-bootstrap' : ['datatables']
  }
});

require([
  'knockout',
  'config/global',
  'viewmodels/explorer',
  'extends/handlers',
  'extends/nvd3-handlers',
  'extends/native',
  'bootstrap',
  'extends/datatables-bootstrap',
  'colreorder',
  'colvis'
], function (ko, g, ExplorerViewModel) {
  'use strict';
  /*
    Here it is time for some explanation.
    RequireJS modules define their dependencies explicitly,
    and we should here define a dependency to a config/parameters module
    which could contain the default values for our form, put there by Velocity (/ AJAX).
    But Datalift does not widely use RequireJS nor Knockout at the moment,
    so this isn't that bad to use such a half-assed solution.
    -- tl;dr;
    This is a "temporary" fix.
   */
  var parameters = window.inlineParameters;

  // Bind a new instance of our view model to the page.
  ko.applyBindings(new ExplorerViewModel(parameters.project, parameters.language));
});
