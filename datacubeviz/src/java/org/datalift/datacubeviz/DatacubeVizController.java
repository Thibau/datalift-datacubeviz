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

import java.net.URISyntaxException;
import java.util.LinkedList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.datalift.datacubeviz.container.Dataset;
import org.datalift.fwk.MediaTypes;
import org.datalift.fwk.project.Project;
import org.datalift.fwk.project.Source;
import org.datalift.fwk.view.TemplateModel;
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
	public final static int MODULE_POSITION = 6000;

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
			if (model.isValidSource(s)) {
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
							s.getUri().toString());

					TupleQueryResult rs = model.getDatasets(s);
					while (rs.hasNext()) {
						BindingSet set = rs.next();
						Value uri = set.getValue("s");
						src.addDataset(new Dataset(uri.toString()));
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
