define([
  'jquery',
  'config/global',
  'config/translation'
], function ($, g, i18n) {
  'use strict';

  /**
   * This class handles the generation of a DataTables configuration object.
   * DataTables is a bit clumsy, this configuration might be hard to read.
   * @param {String} lang     Current user language.
   * @param {Array}  columns  An array of column definitions.
   */
  var TableOptions = function (lang, columns) {

    console.log(i18n.colvis);
    var options = {
      // This property is magic. http://www.datatables.net/usage/options#sDom
      sDom: 'RC<"clear">lf<"clearfix">rtip',
      // Options for the plugins.
      oColVis: {
        activate: "click",
        buttonText: "&nbsp;" + i18n.colvis[lang].visibility
      },
      // Tells that when using this conf, the table is created from scratch.
      bDestroy : true,
      bPaginate: true,
      iDisplayLength: 500,
      aLengthMenu: [[100, 500, 1000], [100, 500, 1000]],
      sScrollY: "400px",
      // We use horizontal scrolling, but it is necessary by default.
      sScrollX: "100%",
      sScrollXInner: "100%",
      // Columns have to be defined outside.
      aoColumns: columns
    };

    // Translate datatables to current language.
    if (i18n.datatables[lang]) {
      options.oLanguage = i18n.datatables[lang];
    }

    return options;
  };

  return TableOptions;
});
