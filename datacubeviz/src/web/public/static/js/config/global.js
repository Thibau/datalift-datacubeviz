define({
  ENTER_KEY: 13,
  remoteURL : window.location.href.substring(0, window.location.href.indexOf('?')),
  datasetsPerRow : 3,
  project : window.location.href.substring(window.location.href.indexOf('?'), window.location.href.length).replace('?project=', ''),
  paths : {
    datasets : '/ws/datasets',
    endpoint : window.location.href.substring(0, window.location.href.indexOf('?')).replace('datacubeviz', 'sparql')
  },
  tabs : {
    explorer      : 'explorer',
    table         : 'table',
    graphs        : 'graphs',
    documentation : 'documentation'
  }
});
