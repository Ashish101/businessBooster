package businessbooster.utils.com

import java.util.Map;
import wslite.rest.Response;

class DashboardUtils {

	static Map createFilterMapForRooms(Response response){

		def data = [:]
		def dataList = []
		if (response.statusCode != 200) {
			data = [ status: "fail", statusCode: 400, errorMsg: response.message ]
		}
		else {
			//int counter = 0
			TreeMap dateRateMap = [:]
			def dateRoomRateMap = [:]
			def keysList = []
			def roomInfoMap = [:]
			def roomInfoList=[]
			def finalDateRoomRateMap = [:]
			def finalDateRoomRateList = []
			Set room_type_codeSet = [] as Set
			
			response?.json?.rooms?.each{
				//counter ++;
				dateRateMap = [:]
				roomInfoMap = [:]
				it?.rates?.each{
					dateRateMap[it?.start_date] = it?.price
				}
				roomInfoMap[it.room_type_code] = it.room_type_info.room_type +" " + it.room_type_info.bed_type +" " + it.room_type_info.number_of_beds
				roomInfoList.add(roomInfoMap)
				keysList.add(it.room_type_code)
				


				//dateRoomRateMap[] = it.room_type_code
				def dateRateList = []
				dateRateMap?.each {date1, rate1->
					room_type_codeSet.add(it.room_type_code)
					if(dateRoomRateMap[date1])
						dateRoomRateMap[date1] << [(it.room_type_code) : rate1]
					else
						dateRoomRateMap[date1] = [(it.room_type_code) : rate1]
				}
				
				
			}
			int setSize = room_type_codeSet.size()
			println "Set Contents = "+room_type_codeSet+" Set Size= "+room_type_codeSet.size()
			def tempRoomRateMap = [:]
			dateRoomRateMap?.each {date1, roomRateMap->
				finalDateRoomRateMap = [:]
				
				if(roomRateMap.size() == setSize)
				{
					finalDateRoomRateMap = roomRateMap
					tempRoomRateMap = [:]
					tempRoomRateMap = roomRateMap
				}
				else
				{
					finalDateRoomRateMap = roomRateMap
					room_type_codeSet?.each{key1->
						if(!roomRateMap.containsKey(key1))
						{
							println ">>>>>>>>addKey"
							roomRateMap["$key1"] = tempRoomRateMap[key1]
						}
					}
				}
				finalDateRoomRateMap["date"] = date1
				finalDateRoomRateList.add(finalDateRoomRateMap)
			}
			data = [ status: "success", statusCode: 200, keys:keysList, data:finalDateRoomRateList, roomDescList : roomInfoList ]
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
