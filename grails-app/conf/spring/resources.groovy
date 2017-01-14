// Place your Spring DSL code here
beans = {
	clientBasicAuth(wslite.http.auth.HTTPBasicAuthorization) {
		username = "Aladdin"
		password = "open sesame"
	}
	
	httpClient(wslite.http.HTTPClient) {
		connectTimeout = 5000
		readTimeout = 10000
		useCaches = false
		followRedirects = false
		sslTrustAllCerts = true
		// authorization = ref('clientBasicAuth')
		// proxy = myproxy
	}
	
	soapClient(wslite.soap.SOAPClient) {
		serviceURL = "http://example.org/soap"
		httpClient = ref('httpClient')
		// authorization = ref('clientBasicAuth')
	}
	
	restClient(wslite.rest.RESTClient) {
		url = "http://example.org/services"
		httpClient = ref('httpClient')
		authorization = ref('clientBasicAuth')
	}
	
}
