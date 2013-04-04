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

import static javax.ws.rs.core.HttpHeaders.ACCEPT;

import java.io.InputStream;
import java.io.StringWriter;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.LinkedList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.httpclient.util.URIUtil;
import org.apache.commons.io.IOUtils;
import org.datalift.datacubeviz.container.Dataset;
import org.datalift.fwk.MediaTypes;
import org.datalift.fwk.project.Project;
import org.datalift.fwk.project.Source;
import org.datalift.fwk.project.TransformedRdfSource;
import org.datalift.fwk.view.TemplateModel;
import org.json.JSONObject;
import org.json.XML;
import org.openrdf.model.Value;
import org.openrdf.query.BindingSet;
import org.openrdf.query.QueryEvaluationException;
import org.openrdf.query.TupleQueryResult;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

/**
 * The DatacubeViz module's main class which permit visualization of Datacube
 * sources.
 *
 * @author T. Colas, T. Marmin
 * @version 260213
 */
@Path(DatacubeVizController.MODULE_NAME)
public class DatacubeVizController extends ModuleController {
	// -------------------------------------------------------------------------
	// Constants
	// -------------------------------------------------------------------------

	/** The module's name. */
	public static final String MODULE_NAME = "datacubeviz";
	public static final int MODULE_POSITION = 6000;

	public final static boolean VIEW_RESULTS_DEFAULT = true;

	// -------------------------------------------------------------------------
	// Instance members
	// -------------------------------------------------------------------------

	protected DatacubeVizModel model;

	// -------------------------------------------------------------------------
	// Constructors
	// -------------------------------------------------------------------------

	/**
	 * Creates a new DatacubeVizController instance, sets its button position.
	 */
	public DatacubeVizController() {
		// TODO Switch to the right position.
		super(MODULE_NAME, MODULE_POSITION);
		model = new DatacubeVizModel(MODULE_NAME);
	}

	// -------------------------------------------------------------------------
	// Project management
	// -------------------------------------------------------------------------

	/**
	 * Tells the project manager to add a new button to projects with at least
	 * two sources.
	 *
	 * @param p
	 *            Our current project.
	 * @return The URI to our project's main page.
	 */
	@Override
	public UriDesc canHandle(Project p) {
		UriDesc projectPage = null;
		// The project can be handled if it has at least one datacube
		// source.
		for (Source s : p.getSources()) {
			// TODO enlever pseudo condition here
			if (true || model.isValidSource(s)) {
				try {
					projectPage = new UriDesc(this.getName() + "?project="
							+ p.getUri(), HttpMethod.GET,
							getTranslatedResource(MODULE_NAME + ".button"));
					projectPage.setPosition(MODULE_POSITION);

					LOG.debug("Project {} can use DatacubeViz", p.getTitle());

				} catch (URISyntaxException e) {
					LOG.fatal("Failed to check status of project {}: {}", e,
							p.getUri(), e.getMessage());
				}
			} else {
				LOG.debug("Project {} can NOT use DatacubeViz", p.getTitle());
			}
			if (projectPage != null)
				break;
		}
		return projectPage;
	}

	// -------------------------------------------------------------------------
	// Web services
	// -------------------------------------------------------------------------

	/**
	 * Index page handler of the DatacubeViz module.
	 *
	 * @param projectId
	 *            the project using DatacubeViz
	 * @return Our module's interface.
	 */
	@GET
	@Produces({ MediaTypes.TEXT_HTML_UTF8, MediaTypes.APPLICATION_XHTML_XML })
	public Response getIndexPage(@QueryParam("project") java.net.URI projectId) {
		Response response = null;
		try {
			// Retrieve project.
			Project p = this.getProject(projectId);
			// Display conversion configuration page.
			TemplateModel view = this.newView("viz-form.vm", p);
			// view.put("helper", new ControllerHelper(model));
			// view.put("viewResults", VIEW_RESULTS_DEFAULT);

			response = Response.ok(view, MediaTypes.TEXT_HTML_UTF8).build();
		} catch (IllegalArgumentException e) {
			TechnicalException error = new TechnicalException(
					"ws.invalid.param.error", "project", projectId);
			this.sendError(Status.BAD_REQUEST, error.getLocalizedMessage());
		}
		return response;
	}

	@GET
	@Path("/ws/datasetsnew")
	@Produces({ MediaTypes.APPLICATION_JSON_UTF8 })
	public Response getDataSetsNew(@QueryParam("project") java.net.URI projectId) {
		Project p = this.getProject(projectId);
		InputStream data = null;
		JSONObject jsonObject = null;

		new LinkedList<org.datalift.datacubeviz.container.Source>();
		for (Source s : p.getSources()) {
			if (model.isValidSource(s)) {
				new org.datalift.datacubeviz.container.Source(s.getUri()
						.toString(), s.getTitle());

				TransformedRdfSource rdf = (TransformedRdfSource) s;

				try {
					// String query =
					// "SELECT DISTINCT ?uri ?title WHERE { GRAPH <"
					// + rdf.getTargetGraph()
					// + "> { ?uri a <"
					// + model.DATACUBE_DATASET_NS
					// +
					// "> . ?uri <http://www.w3.org/2000/01/rdf-schema#label> ?title . } }";

					String query = "PREFIX qb: <http://purl.org/linked-data/cube#>"
							+ "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"
							+ "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"
							+ "PREFIX dct: <http://purl.org/dc/terms/>"
							+ "PREFIX dc: <http://purl.org/dc/elements/1.1/>"
							+ "PREFIX foaf: <http://xmlns.com/foaf/0.1/>"
							+ "PREFIX skos: <http://www.w3.org/2004/02/skos/core#>"
							+ "PREFIX sdmx: <http://purl.org/linked-data/sdmx#>"
							+ "PREFIX sdmx-subject: <http://purl.org/linked-data/sdmx/2009/subject#>"
							+ "" + "SELECT *" + "WHERE {" + "GRAPH <"
							+ rdf.getTargetGraph()
							+ "> {"
							+ "  ?ds a <"
							+ DatacubeVizModel.DATACUBE_DATASET_NS
							+ "> ."
							+ ""
							+ "  OPTIONAL {{?ds dct:identifier ?id} UNION {?ds dc:identifier ?id}} ."
							+ "  OPTIONAL {?ds foaf:depiction ?depiction} ."
							+ "  OPTIONAL {"
							+ "    {?ds rdfs:label ?titleFR} UNION {?ds dct:title ?titleFR} UNION {?ds dc:title ?titleFR}."
							+ "    FILTER langMatches(lang(?titleFR), 'FR') ."
							+ "  } ."
							+ "  OPTIONAL {"
							+ "    {?ds rdfs:label ?titleEN} UNION {?ds dct:title ?titleEN} UNION {?ds dc:title ?titleEN}."
							+ "    FILTER langMatches(lang(?titleEN), 'EN') ."
							+ "  } ."
							+ "  OPTIONAL {"
							+ "    {?ds rdfs:label ?titleOther} UNION {?ds dct:title ?titleOther} UNION {?ds dc:title ?titleOther}."
							+ "    FILTER (!langMatches(lang(?titleOther), 'EN') &&  !langMatches(lang(?titleOther), 'FR')) ."
							+ "  } ."
							+ ""
							+ "  OPTIONAL {"
							+ "    {?ds rdfs:comment ?descriptionFR} UNION {?ds dct:description ?descriptionFR} UNION {?ds dc:description ?descriptionFR} ."
							+ "    FILTER langMatches(lang(?descriptionFR), 'FR') ."
							+ "  } ."
							+ "  OPTIONAL {"
							+ "    {?ds rdfs:comment ?descriptionEN} UNION {?ds dct:description ?descriptionEN} UNION {?ds dc:description ?descriptionEN} ."
							+ "    FILTER langMatches(lang(?descriptionEN), 'EN') ."
							+ "  } ."
							+ "  OPTIONAL {"
							+ "    {?ds rdfs:comment ?descriptionOther} UNION {?ds dct:description ?descriptionOther} UNION {?ds dc:description ?descriptionOther} ."
							+ "    FILTER (!langMatches(lang(?descriptionOther), 'EN') &&  !langMatches(lang(?descriptionOther), 'FR')) ."
							+ "  } ."
							+ ""
							+ "  OPTIONAL {?ds dct:license ?license} ."
							+ "  OPTIONAL {{?ds dct:source ?source} UNION {?ds dc:source ?source}} ."
							+ "  OPTIONAL {?ds rdfs:seeAlso ?seeAlso} ."
							+ ""
							+ "  OPTIONAL {{?ds dct:date ?date} UNION {?ds dc:date ?date}} ."
							+ "  OPTIONAL {?ds dct:created ?created} ."
							+ "  OPTIONAL {?ds dct:issued ?issued} ."
							+ "  OPTIONAL {?ds dct:modified ?modified} ."
							+ ""
							+ "  OPTIONAL {"
							+ "    {?ds dct:subject ?subject} UNION {?ds dc:subject ?subject} ."
							+ ""
							+ "    OPTIONAL {"
							+ "      FILTER (!isLiteral(?subject))"
							+ "      OPTIONAL {"
							+ "        ?subject a ?subjectType"
							+ "        FILTER (?subjectType = skos:Concept || ?subjectType = sdmx:Concept || ?subjectType = sdmx-subject:)"
							+ "        OPTIONAL {"
							+ "          {?subject skos:prefLabel ?subjectLabel} ."
							+ "        } ."
							+ "      }"
							+ "    } ."
							+ "  } ."
							+ ""
							+ "  OPTIONAL {"
							+ "    {?ds dct:contributor ?contributor} UNION {?ds dc:contributor ?contributor} ."
							+ "    OPTIONAL {"
							+ "      {?contributor foaf:name ?contributorName} UNION {?contributor rdfs:label ?contributorName} ."
							+ "    } ."
							+ "    OPTIONAL {"
							+ "      {?contributor foaf:homepage ?contributorPage} UNION {?contributor foaf:page ?contributorPage} UNION {?contributor rdfs:seeAlso ?contributorPage}."
							+ "    } ."
							+ "  } ."
							+ ""
							+ "  OPTIONAL {"
							+ "    {?ds dct:creator ?creator} UNION {?ds dc:creator ?creator} ."
							+ "    OPTIONAL {"
							+ "      {?creator foaf:name ?creatorName} UNION {?creator rdfs:label ?creatorName} ."
							+ "    } ."
							+ "    OPTIONAL {"
							+ "      {?creator foaf:homepage ?creatorPage} UNION {?creator foaf:page ?creatorPage} UNION {?creator rdfs:seeAlso ?creatorPage}."
							+ "    } ."
							+ "  } ."
							+ ""
							+ "  OPTIONAL {"
							+ "    {?ds dct:publisher ?publisher} UNION {?ds dc:publisher ?publisher} ."
							+ "    OPTIONAL {"
							+ "      {?publisher foaf:name ?publisherName} UNION {?publisher rdfs:label ?publisherName} ."
							+ "    } ."
							+ "    OPTIONAL {"
							+ "      {?publisher foaf:homepage ?publisherPage} UNION {?publisher foaf:page ?publisherPage} UNION {?publisher rdfs:seeAlso ?publisherPage}."
							+ "    } . } .  } }";
					// Use URI multi-argument constructor to escape query
					// string.
					URL repo_url = new URL(
							DatacubeVizModel.INTERNAL_REPO.getEndpointUrl());

					String buf = "?query="
							+ URIUtil.encodeQuery(query).replaceAll("&", "%26");
					LOG.debug("query: {}", query);
					LOG.debug("buf: {}", buf.toString());
					// buf.append("&default-graph-uri=").append(repo_url);

					URL url = new URI(repo_url + buf).toURL();

					// Build HTTP request.
					LOG.debug("url: {}", url.toString());
					HttpURLConnection cnx = (HttpURLConnection) (url
							.openConnection());
					cnx.setRequestMethod("GET");
					cnx.setConnectTimeout(2000); // 2 sec.
					cnx.setReadTimeout(30000); // 30 sec.
					cnx.setRequestProperty(ACCEPT, "application/xml");
					// Force server connection.
					cnx.connect();
					// Check for error data.
					data = cnx.getErrorStream();
					if (data == null) {
						// No error data available. => get response data.
						data = cnx.getInputStream();
						StringWriter writer = new StringWriter();
						IOUtils.copy(data, writer, "UTF-8");
						String datastring = writer.toString();
						LOG.debug("data received: {}", datastring);
						jsonObject = XML.toJSONObject(datastring);
						LOG.debug("json generated: {}", jsonObject.toString());
					}

				} catch (Exception e) {
					e.printStackTrace();
				}
			}

		}

		return Response.status(200).type(MediaTypes.APPLICATION_JSON_UTF8)
				.entity(jsonObject.toString()).build();
	}

	@GET
	@Path("/ws/datasets")
	@Produces({ MediaTypes.APPLICATION_JSON_UTF8 })
	public Response getDataSets(@QueryParam("project") java.net.URI projectId) {

		Project p = this.getProject(projectId);
		Gson gson = new GsonBuilder().create();

		List<org.datalift.datacubeviz.container.Source> list = new LinkedList<org.datalift.datacubeviz.container.Source>();
		try {

			for (Source s : p.getSources()) {
				if (model.isValidSource(s)) {
					org.datalift.datacubeviz.container.Source src = new org.datalift.datacubeviz.container.Source(
							s.getUri().toString(), s.getTitle());
					TupleQueryResult rs = model.getDatasets(s);

					while (rs.hasNext()) {
						BindingSet set = rs.next();
						Value uri = set.getValue("uri");
						Value title = set.getValue("title");
						src.addDataset(new Dataset(uri.toString(), title
								.toString()));
					}
					list.add(src);
				}

			}
		} catch (QueryEvaluationException e) {
			// TODO Auto-generated catch block
			LOG.fatal("oups...");
			e.printStackTrace();
		}

		return Response.status(200).entity(gson.toJson(list)).build();
	}
}
