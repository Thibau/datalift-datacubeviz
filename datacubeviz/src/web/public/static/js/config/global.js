define({
  ENTER_KEY: 13,
  // URL principale du module (i.e http://localhost:8080/datalift/datacubeviz).
  remoteURL : window.location.href.substring(0, window.location.href.indexOf('?')),
  datasetsPerRow : 3,
  project : window.location.href.substring(window.location.href.indexOf('?'), window.location.href.length).replace('?project=', ''),
  paths : {
    datasets : '/ws/datasets',
    // This should be temporary (ahem...), gets the URL to the Datalift SPARQL endpoint.
    endpoint : window.location.href.substring(0, window.location.href.indexOf('?')).replace('datacubeviz', 'sparql')
  },
  tabs : {
    explorer      : 'explorer',
    table         : 'table',
    graphs        : 'graphs',
    documentation : 'documentation'
  }
});
