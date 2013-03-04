define({
  ENTER_KEY: 13,
  remoteURL : window.location.href.substring(0, window.location.href.indexOf('?')),
  datasetsPerRow : 3,
  paths : {
    datasets : '/ws/datasets',
    observations : 'http://localhost:1339/observations.json',
    endpoint : 'http://localhost:8080/datalift/sparql'
  },
  tabs : {
    explorer      : 'explorer',
    table         : 'table',
    graphs        : 'graphs',
    documentation : 'documentation'
  }
});
