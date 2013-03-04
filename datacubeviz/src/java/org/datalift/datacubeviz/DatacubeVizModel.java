/*
 * Copyright / LIRMM 2013
 * Contributor(s) : T. Colas, T. Marmin
 *
 * Contact: thibaut.marmin@etud.univ-montp2.fr
 * Contact: thibaud.colas@etud.univ-montp2.fr
 *
 * This software is governed by the CeCILL license under French law and
 * abiding by the rules of distribution of free software. You can use,
 * modify and/or redistribute the software under the terms of the CeCILL
 * license as circulated by CEA, CNRS and INRIA at the following URL
 * "http://www.cecill.info".
 *
 * As a counterpart to the access to the source code and rights to copy,
 * modify and redistribute granted by the license, users are provided only
 * with a limited warranty and the software's author, the holder of the
 * economic rights, and the successive licensors have only limited
 * liability.
 *
 * In this respect, the user's attention is drawn to the risks associated
 * with loading, using, modifying and/or developing or reproducing the
 * software by the user in light of its specific status of free software,
 * that may mean that it is complicated to manipulate, and that also
 * therefore means that it is reserved for developers and experienced
 * professionals having in-depth computer knowledge. Users are therefore
 * encouraged to load and test the software's suitability as regards their
 * requirements in conditions enabling the security of their systems and/or
 * data to be ensured and, more generally, to use and operate it in the
 * same conditions as regards security.
 *
 * The fact that you are presently reading this means that you have had
 * knowledge of the CeCILL license and that you accept its terms.
 */

package org.datalift.datacubeviz;

import static org.openrdf.query.QueryLanguage.SPARQL;

import org.datalift.fwk.project.Source;
import org.datalift.fwk.project.SparqlSource;
import org.datalift.fwk.project.TransformedRdfSource;
import org.openrdf.model.impl.URIImpl;
import org.openrdf.query.TupleQuery;
import org.openrdf.query.TupleQueryResult;
import org.openrdf.repository.RepositoryConnection;

/**
 * A module to visualize Datacube (RDF) data in the Datalift Platform.
 * 
 * @author T. Colas, T. Marmin
 * @version 260213
 */
public class DatacubeVizModel extends ModuleModel {

	// -------------------------------------------------------------------------
	// Instance members
	// -------------------------------------------------------------------------

	private static URIImpl DATACUBE_NS = new URIImpl(
			"http://purl.org/linked-data/cube#");
	private static URIImpl DATACUBE_DATASET_NS = new URIImpl(DATACUBE_NS
			+ "DataSet");

	// -------------------------------------------------------------------------
	// Constructors
	// -------------------------------------------------------------------------

	/**
	 * Creates a new DatacubeVizModel instance.
	 * 
	 * @param name
	 *            Name of the module.
	 */
	public DatacubeVizModel(String name) {
		super(name);
	}

	// -------------------------------------------------------------------------
	// Sources management.
	// -------------------------------------------------------------------------

	/**
	 * Checks if a given {@link Source} contains valid Datacube-structured data.
	 * 
	 * @param src
	 *            The source to check.
	 * @return True if src is {@link TransformedRdfSource} or
	 *         {@link SparqlSource}.
	 */
	public boolean isValidSource(Source src) {
		// detect if src is a valid source to be used by the module
		// A valid source is an instance of TransformedRdfSource witch contains
		// a qb:Dataset
		try {
			if (src instanceof TransformedRdfSource) {
				TransformedRdfSource rdf = (TransformedRdfSource) src;
				LOG.debug("Source {} is candidate", rdf.getTitle());

				RepositoryConnection cnx = INTERNAL_REPO.newConnection();
				LOG.debug("Connexion to internal repo OK");
				TupleQuery q = cnx.prepareTupleQuery(
						SPARQL,
						"SELECT DISTINCT ?s WHERE { GRAPH <"
								+ rdf.getTargetGraph() + "> { ?s a <"
								+ DATACUBE_DATASET_NS + "> . } }");
				LOG.debug("Query ready, evaluate... -> {}", q.toString());
				TupleQueryResult rs = q.evaluate();
				LOG.debug("OK");
				if (rs.hasNext())
					return true;
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			LOG.fatal("BAD THING APPEND");
			e.printStackTrace();
		}
		return false;
	}

	public TupleQueryResult getDatasets(Source src) {
		TupleQueryResult rs = null;
		if (src instanceof TransformedRdfSource) {
			try {
				TransformedRdfSource rdf = (TransformedRdfSource) src;
				RepositoryConnection cnx = INTERNAL_REPO.newConnection();
				LOG.debug("Connexion to internal repo OK");
				TupleQuery q;
				q = cnx.prepareTupleQuery(
						SPARQL,
						"SELECT DISTINCT ?s WHERE { GRAPH <"
								+ rdf.getTargetGraph() + "> { ?s a <"
								+ DATACUBE_DATASET_NS + "> . } }");
				LOG.debug("Query ready, evaluate... -> {}", q.toString());
				rs = q.evaluate();
				LOG.debug("OK");
			} catch (Exception e) {
				// TODO Auto-generated catch block
				LOG.fatal("BAD THING APPEND");
				e.printStackTrace();
			}
		}
		return rs;
	}
}
