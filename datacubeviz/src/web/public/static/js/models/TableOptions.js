define([
  'jquery',
  'config/global',
  'config/translation'
], function ($, g, i18n) {
  'use strict';

  /**
   * This class handles the generation of a DataTables configuration object.
   * DataTables is a bit clumsy, this configuration might be hard to read.
   * @param {String} lang Current user language.
   */
  var TableOptions = function (lang) {


    var options = {
      // This property is magic. http://www.datatables.net/usage/options#sDom
      sDom: 'RC<"clear">lf<"clearfix">rtip',
      // Options for the plugins.
      oColVis: {
        activate: "click",
        buttonText: "&nbsp;" + i18n.colvis[lang].visibility,
        aiExclude: [0]
      },
      oColReorder: {
        iFixedColumns: 1
      },
      // Tells that when using this conf, the table is created from scratch.
      bDestroy : true,
      bPaginate: true,
      iDisplayLength: 50,
      aLengthMenu: [[10, 50, 250, 1000], [10, 50, 250, 1000]],
      sScrollY: "400px",
      sScrollX: "100%",
      sScrollXInner: "150%",
      bScrollCollapse: true,
      aoColumns: [ { sTitle: 'Col1' }, { sTitle: 'Col2' }, { sTitle: 'Col3' }, { sTitle: 'Col4' }]
    };

    // Translate datatables to current language.
    if (i18n.datatables[lang]) {
      options.oLanguage = i18n.datatables[lang];
    }

    return options;
  };

  return TableOptions;
});
