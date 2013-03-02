require.config({
  baseUrl : 'http://localhost:1337/static/js',
  // Prod/Dev : baseUrl : 'datacubeviz/static/js',
  // Require.js allows us to configure shortcut alias
  paths : {
    jquery : 'libs/jquery-1.9.1.min',
    bootstrap : 'libs/bootstrap-2.3.0.min',
    knockout : 'libs/knockout-2.2.1.min',
    validation : 'libs/knockout.validation-1.0.2.min',
    datatables : 'libs/datatables-1.9.4.min',
    colreorder : 'libs/colreorder-1.0.8.min',
    colvis : 'libs/colvis-1.0.8.min'
  },
  shim : {
    // Set dependencies.
    'bootstrap' : ['jquery'],
    'datatables' : ['jquery'],
    'extends/datatables-bootstrap' : ['datatables'],
    'colreorder' : ['datatables', 'jquery'],
    'colvis' : ['datatables', 'bootstrap', 'jquery']
  }
});

require([
  'knockout',
  'config/global',
  'viewmodels/explorer',
  'extends/handlers',
  'extends/native',
  'bootstrap',
  'extends/datatables-bootstrap'
], function (ko, g, ExplorerViewModel) {
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
  //'use strict';
  var parameters = inlineParameters;

  // Bind a new instance of our view model to the page.
  ko.applyBindings(new ExplorerViewModel(parameters.project, parameters.language));
});
