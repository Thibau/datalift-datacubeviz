package org.datalift.datacubeviz.container;

import java.util.HashMap;
import java.util.Map;

public class Dataset {

	private String uri;
	private Map<String, String> metadata;

	public Dataset(String uri) {
		this.uri = uri;
		this.metadata = new HashMap<String, String>();
	}

	public void addMetadata(String key, String value) {
		this.metadata.put(key, value);
	}

	public void removeMetadata(String key) {
		this.metadata.remove(key);
	}

	public String getMetadata(String key) {
		return this.metadata.get(key);
	}

	public void setUri(String uri) {
		this.uri = uri;
	}

	public String getUri() {
		return this.uri;
	}
}
