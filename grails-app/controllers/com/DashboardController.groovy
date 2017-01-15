package com

import grails.converters.JSON
import wslite.rest.*
import groovy.json.JsonSlurper
import java.text.DateFormat
import java.text.SimpleDateFormat
import businessbooster.utils.com.DashboardUtils

class DashboardController {

	def index() { }
	
	def geolocation() { }

	def gettemp() {

		def data = [ statusCode: 200]
		render data as JSON
	}

	def getdata() {
		def client = new RESTClient("http://localhost:8080/businessbooster/")
		println response
		println response.statusCode
		def data = [
			"status":"success", "statusCode":200,
			"totalHotels": 4,
			maxRate : 423,
			hotelList: [
				[ name: "Taj1", totalRate: 123],
				[ name: "Taj2", totalRate: 143],
				[ name: "Taj3", totalRate: 223],
				[ name: "Taj4", totalRate: 423],
			]
		]
		render data as JSON
	}


	def getroomdata(){
		def data = [:]
		try {
			def client = new RESTClient("https://api.sandbox.amadeus.com/v1.2/")
			//client.authorization = new HTTPBasicAuthorization(credUserName, credUserPassword)
			String apiUrl = "/hotels/"+ params.property_code + "?apikey=" + grailsApplication.config.grails.appKey + "&check_in=" + params.check_in + "&check_out=" + params.check_out;
			println "API URL : " + apiUrl
			//def response = client.get(path: '/hotels/MXLASC07?apikey=Ae9sOKJ1iwj25Uo8ZlysnNMIw6o5Jkju&check_in=2017-01-14&check_out=2017-01-30')
			def response = client.get(path: apiUrl)	
			println response
			data = DashboardUtils.createFilterMapForRooms(response)
		}
		catch(Exception e) {
			e.printStackTrace()
			data = [ status: "fail", statusCode: 400, errorMsg: e.getMessage() ]
			
		}
		render data as JSON
	}


	def gethoteldata() {
		def data = [:]
		try {
			def client = new RESTClient("https://api.sandbox.amadeus.com/v1.2")
			//client.authorization = new HTTPBasicAuthorization(credUserName, credUserPassword)
			String apiUrl = "/hotels/search-circle?apikey=" + grailsApplication.config.grails.appKey + "&check_in=" + params.check_in + "&check_out=" + params.check_out + "&latitude=" + params.latitude + "&longitude=" + params.longitude + "&radius=" + params.radius;
			println "--------------------------------------"+apiUrl
			def response = client.get(path: apiUrl)
			data = DashboardUtils.createFilterMapForHotels(response)
		}
		catch(Exception e) {
			e.printStackTrace()
			data = [ status: "fail", statusCode: 400, errorMsg: e.getMessage() ]
		}
		render data as JSON
	}
	
	def filteramenities() {
		def data = [:]
		try {
			def client = new RESTClient("https://api.sandbox.amadeus.com/v1.2")
			//client.authorization = new HTTPBasicAuthorization(credUserName, credUserPassword)
			String requiredAmenities = params.amenity
			String [] amenitiesArr = requiredAmenities.split(",")
			StringBuffer finalAmenities = new StringBuffer();
			amenitiesArr?.each{
				finalAmenities.append("&amenity=")
				finalAmenities.append(it)
			}
			println "Final Amenities : " + finalAmenities
			String apiUrl = "/hotels/search-circle?apikey=" + grailsApplication.config.grails.appKey + "&check_in=" + params.check_in + "&check_out=" + params.check_out + "&latitude=" + params.latitude + "&longitude=" + params.longitude + "&radius=" + params.radius + finalAmenities;
			println "--------------------------------------"+apiUrl
			def response = client.get(path: apiUrl)
			data = DashboardUtils.createFilterMapForHotels(response)
		}
		catch(Exception e) {
			e.printStackTrace()
			data = [ status: "fail", statusCode: 400, errorMsg: e.getMessage() ]
		}
		render data as JSON
	}
	
	def getstatichoteldata()
	{
		def data = [:]
		try {
			def client = new RESTClient("https://api.sandbox.amadeus.com/v1.2/")
			//client.authorization = new HTTPBasicAuthorization(credUserName, credUserPassword)
			String apiUrl = "/hotels/"+ params.property_code + "?apikey=" + grailsApplication.config.grails.appKey + "&check_in=" + params.check_in + "&check_out=" + params.check_out;
			def response = client.get(path: apiUrl)
			data = DashboardUtils.staticHotelDataFilter(response)
		}
		catch(Exception e) {
			e.printStackTrace()
			data = [ status: "fail", statusCode: 400, errorMsg: e.getMessage() ]
			
		}
		render data as JSON
	}
	
	def interestpoints(){
		def data = [:]
		try {
			def client = new RESTClient("https://api.sandbox.amadeus.com/v1.2")
			//client.authorization = new HTTPBasicAuthorization(credUserName, credUserPassword)
			String apiUrl = "points-of-interest/yapq-search-circle?apikey=" + grailsApplication.config.grails.appKey + "&latitude=" + params.latitude  + "&longitude=" + params.longitude + "&radius=" + params.radius;
			println "--------------------------------------"+apiUrl
			def response = client.get(path: apiUrl)
			data = DashboardUtils.getInterestPoints(response)
		}
		catch(Exception e) {
			e.printStackTrace()
			data = [ status: "fail", statusCode: 400, errorMsg: e.getMessage() ]
		}
		render data as JSON
	}
	
	def nearestairports(){
		def data = [:]
		try {
			def client = new RESTClient("https://api.sandbox.amadeus.com/v1.2")
			//client.authorization = new HTTPBasicAuthorization(credUserName, credUserPassword)
			String apiUrl = "airports/nearest-relevant?apikey=" + grailsApplication.config.grails.appKey + "&latitude=" + params.latitude  + "&longitude=" + params.longitude;
			println "--------------------------------------"+apiUrl
			def response = client.get(path: apiUrl)
			data = DashboardUtils.getNearestAirports(response)
		}
		catch(Exception e) {
			e.printStackTrace()
			data = [ status: "fail", statusCode: 400, errorMsg: e.getMessage() ]
		}
		render data as JSON
	}
}
