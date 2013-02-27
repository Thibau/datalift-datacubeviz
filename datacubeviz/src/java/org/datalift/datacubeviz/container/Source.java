package org.datalift.datacubeviz.container;

import java.util.LinkedList;
import java.util.List;

public class Source {

	private String uri;
	private List<Dataset> datasets;

	public Source(String uri) {
		this.uri = uri;
		this.datasets = new LinkedList<Dataset>();
	}

	public List<Dataset> getDatasets() {
		return this.datasets;
	}

	public void addDataset(Dataset dataset) {
		this.datasets.add(dataset);
	}

	public String getUri() {
		return this.uri;
	}

	public void setUri(String uri) {
		this.uri = uri;
	}
}
