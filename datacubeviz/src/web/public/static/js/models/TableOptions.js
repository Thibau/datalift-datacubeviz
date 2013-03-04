define([
  'jquery',
  'config/global',
  'config/translation',
  'colreorder',
  'colvis'
], function ($, g, i18n) {
  'use strict';

  var TableOptions = function (lang) {

    // colreorder only : sDom: 'Rlfrtip',

    var options = {
      sDom: 'RC<"clear">lf<"clearfix">rtip',
      oColVis: {
        activate: "click",
        buttonText: "&nbsp;" + i18n.colvis[lang].visibility
      },
      bDestroy : true,
      bPaginate: false,
      sScrollY: "300px",
      sScrollX: "100%",
      sScrollXInner: "150%",
      bScrollCollapse: true,
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
