define({
  ENTER_KEY: 13,
  remoteURL : window.location.href.substring(0, window.location.href.indexOf('?')),
  datasetsPerRow : 3,
  paths : {
    datasets : '/ws/datasets',
    endpoint : window.location.href.substring(0, window.location.href.indexOf('?')).replace('sdmxdatacube', 'sparql')
  },
  tabs : {
    explorer      : 'explorer',
    table         : 'table',
    graphs        : 'graphs',
    documentation : 'documentation'
  }
});
