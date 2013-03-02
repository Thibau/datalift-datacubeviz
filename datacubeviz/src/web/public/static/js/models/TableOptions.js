define([
  'jquery',
  'config/global',
  'config/translation',
  'colreorder'
], function ($, g, i18n) {
  'use strict';

  var TableOptions = function (lang) {


    var options = {
      sDom: 'Rlfrtip',//'RC<"clear">lfrtip',
      aoColumns: [ { sTitle: 'Col1' }, { sTitle: 'Col2' }, { sTitle: 'Col3' }, { sTitle: 'Col4' }, { sTitle: 'Col5' }, { sTitle: 'Col6' } ]
    };

    // Translate datatables to current language.
    if (i18n.datatables[lang]) {
      options.oLanguage = i18n.datatables[lang];
    }

    return options;
  };

  return TableOptions;
});
