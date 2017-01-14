package businessbooster.utils.com

import java.util.Map;
import wslite.rest.Response;

class DashboardUtils {

	static Map createFilterMapForRooms(Response response){
		def filterMap = [:]
		def data = [:]
		if (response.statusCode != 200) {
			data = [ status: "fail", statusCode: 400, errorMsg: response.message ]
		}
		else {
			TreeMap dateRateMap = [:]
			def roomInfoMap = [:]
			response?.json?.rooms?.each{
				it?.rates?.each{
					dateRateMap[it?.start_date] = it?.price
				}
				roomInfoMap["room_type"] = it.room_type_info.room_type
				roomInfoMap["bed_type"] = it.room_type_info.bed_type
				roomInfoMap["number_of_beds"] = it.room_type_info.number_of_beds
			}
			filterMap["roomInfo"] = roomInfoMap
			filterMap["rates"] = dateRateMap;
			data = [ status: "success", statusCode: 200, data: filterMap ]
		}
		return data;
	}

	static Map createFilterMapForHotels(Response response){
		def data = [:]
		if (response.statusCode != 200) {
			data = [ status: "fail", statusCode: 400, errorMsg: response.message ]
		}
		else {
			int totalHotels = 0
			def filterMap = [:]
			def hotelList = []
			float maxRate = 0.0
			response?.json?.results?.each{
				def tempMap = [:]
				tempMap["name"] = it?.property_name
				def amount = it?.total_price?.amount as Float
				tempMap["totalRate"] = amount
				tempMap["propertyCode"] = it?.property_code
				hotelList << tempMap
				totalHotels++
				if(maxRate < tempMap["totalRate"])
					maxRate = tempMap["totalRate"]
			}
			filterMap["totalHotels"] = totalHotels
			filterMap["hotelList"] = hotelList
			filterMap["maxRate"] = maxRate
			data = [ status: "success", statusCode: 200, data: filterMap ]
		}
	}
}
