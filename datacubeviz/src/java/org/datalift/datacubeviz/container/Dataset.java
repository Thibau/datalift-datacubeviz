package org.datalift.datacubeviz.container;

import java.util.HashMap;
import java.util.Map;

public class Dataset {

	private String uri;
	private String title;
	private Map<String, String> metadata;

	public Dataset(String uri, String title) {
		this.uri = uri;
		this.title = title;
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

	public void setTitle(String title) {
		this.title = title;
	}

	public String getTitle() {
		return this.title;
	}

	public void setUri(String uri) {
		this.uri = uri;
	}

	public String getUri() {
		return this.uri;
	}
}
