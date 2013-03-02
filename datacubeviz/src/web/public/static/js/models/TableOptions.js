define([
  'jquery',
  'config/global',
  'config/translation'
], function ($, g, i18n) {
  'use strict';

  var TableOptions = function (lang) {


    var options = {
      // Save state with localStorage.
      bStateSave: true,
      aoColumns: [ { sTitle: 'ColFromBinding1' }, { sTitle: 'ColFromBinding2' } ]
    };

    // Translate datatables to current language.
    if (i18n.datatables[lang]) {
      options.oLanguage = i18n.datatables[lang];
    }

    return options;
  };

  return TableOptions;
});
