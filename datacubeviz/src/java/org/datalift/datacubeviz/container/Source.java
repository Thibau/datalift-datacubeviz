package org.datalift.datacubeviz.container;

import java.util.LinkedList;
import java.util.List;

public class Source {

	private String uri;
	private String title;
	private List<Dataset> datasets;

	public Source(String uri, String title) {
		this.uri = uri;
		this.title = title;
		this.datasets = new LinkedList<Dataset>();
	}

	public List<Dataset> getDatasets() {
		return this.datasets;
	}

	public void addDataset(Dataset dataset) {
		this.datasets.add(dataset);
	}

	public String getTitle() {
		return this.title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getUri() {
		return this.uri;
	}

	public void setUri(String uri) {
		this.uri = uri;
	}
}
