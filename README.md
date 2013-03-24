# Datalift — DataCubeViz

Version: 0.3
Date: 2013-24-08  
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

TODO

## What's the module's future

This module will (hopefully) soon be integrated as part of Datalift's main modules repository and further be developed. Its interface will (hopefully) better answer the needs of its main users.

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
