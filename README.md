# Datalift — DataCubeViz

Version: 0.3
Date: 2013-04-01  
Authors: [Thibaud Colas](https://github.com/ThibWeb), [Thibaut Marmin](https://github.com/marminthibaut)  
Repository: [GitHub](https://github.com/Thibau/datalift-datacubeviz/)  
Documentation: [GitHub Wiki](https://github.com/Thibau/datalift-sdmxdatacube/wiki)  

---------------------------------------------------------------------

## tl;dr

DataCubeViz is a [Datalift](http://datalift.org/) module which helps visualizing statistical datasets using the [DataCube](http://www.w3.org/TR/vocab-data-cube/) ontology.

It was created to fulfill the needs of the Datalift project to work with statistical linked data by two students during a two weeks scholar project.

## How to use it

DataCubeViz shouldn't need anything else than Datalift's source code to be compiled, all of the other dependencies being uploaded in its repository.

DataCubeViz specifically needs access to Datalift's `core`, `framework` and `incubator` module folders . Those dependencies will be automatically found if the `datacubeviz` folder is placed at the root of Datalift's source code, or can be otherwise resolved by placing symbolic links inside `datalift-datacubeviz`:

```
  ln -s /Path/to/Datalift/core/ core
  ln -s /Path/to/Datalift/framework/ framework
  ln -s /Path/to/Datalift/incubator/ incubator
```

Please note that in order for the compilation step to execute, the Datalift core and framework must have already been compiled, including the `incubator/query` module.

Once compiled, the module can be used by placing its jar (`datacubeviz/dist/datacubeviz.jar`) inside Datalift's `modules` directory (`DATALIFT_HOME/modules`), and restarting Datalift.

This process can be automated by using one of the two build scripts : `reload_module.sh` and `live-build.xml` (developer-centric and rather opinionated).

## How is it built

DataCubeViz is a Datalift module, thus uses the [Sesame](http://openrdf.org/) triplestore, the Jersey JAX-RS implementation and [GSON](https://code.google.com/p/google-gson/).

This module is designed to feel snappy to use, the first request loads the whole interface and every subsequent call is full AJAJ.

The frontend is built with [Twitter Bootstrap](http://twitter.github.com/bootstrap/), [KnockoutJS](http://knockoutjs.com/) and [RequireJS](http://requirejs.org/). We use RequireJS to help organize the JavaScript code, separating it into modules.

The tabular view uses the popular [DataTables](http://datatables.net/) jQuery library, with some plugins to make it more Bootstrap-friendly and to add some functionalities.

The chart view uses [D3](http://d3js.org/) and [NVD3](http://nvd3.org/), two JavaScript visualization libraries (the latter built on the former). which make it easy to render data on a web page via SVG and plain old CSS. NVD3 actually is based on D3 and "only" provides reusable charts.

### Points of interest

* This module is built with strict mode enabled ("use strict").
* SPARQL Queries hard-coded within the module are available in separate files.
* Those SPARQL queries are quite huge to compensate for differences between DataCube datasets.
* Both D3.js and NVD3 binding handlers are available (NVD3 is great but might not be as future-proof as vanilla D3).
* This module shares a small common code base (via inheritance) with the StringToURI module.
* Nearly all of the module's inner working is coded on the client side (ATM).

## What's the module's future

This module will (hopefully) soon be integrated as part of Datalift's main modules repository and further be developed. It still needs some work to be able to work as intended.

```

/**
 * What's next (TODO) :
 * - "Pipe and filter" data from the observations to the views (table / charts).
 * - Be able to visualize subsets of the triples in those views.
 * - "Pipe and filter" components (structure) of the current dataset from the server (/ SPARQL Endpoint).
 * - "Pipe and filter" those components to our model.
 * - "Pipe and filter" our model to the controls to manage the views.
 * - Add more views.
 * - Add a management of history.
 *
 * Those are the two main items to make the module work, but it is also necessary to strenghten it.
 * On the server side, it might be better to delegate some processing to the server component of the module.
 * Either to parallelize development or to make responsibilities more manageable.
 * For example to be able to embed visualization widgets inside other "pages" outside of the module.
 */

```

## External resources

### General

- http://datalift.org/
- http://sdmx.org/
- http://www.w3.org/TR/vocab-data-cube/
- https://webgate.ec.europa.eu/fpfis/mwikis/sdmx/
- http://eurostat.linked-statistics.org/
- http://csarven.ca/linked-sdmx-data

### Client

- http://twitter.github.com/bootstrap/
- http://knockoutjs.com/
- http://requirejs.org
- http://jquery.com/
- http://datatables.net/
- http://d3js.org/
- http://nvd3.org/

### Server

- http://openrdf.org/
- http://www.sdmxsource.org/
- http://jersey.java.net/
- https://code.google.com/p/google-gson/
