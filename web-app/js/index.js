

var MAP_API_KEY = "AIzaSyASzllYde2cO8z7gmUg5Wkez4asfgYc9hE";

var startDate;
var endDate;
var longitude;
var latitude;
var map;

//$( document ).ready(function() {
$(window).load (function() {
	init();
});

function init() {
  //drawBarChart();
  //drawHotelRates("${request.getContextPath()}/js/response.json", "orange");
  //drawHotelRates();
}

function drawBarChart(radius) {
	var	width = document.getElementById('placeholder3xx3').offsetWidth,
		height = document.getElementById('placeholder3xx3').offsetHeight,
 	svg = d3.select("#placeholder3xx3")
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("fill", "teal"),
      margin = {top: 20, right: 20, bottom: 100, left: 40},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom;

      svg.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ 0 +","+(height/2 + 200)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            .text("Average Price");

        svg.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ (width/2) +","+ height +")")  // centre below axis
            .text("Hotel Names");

  var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
      y = d3.scaleLinear().rangeRound([height, 0]);

  var g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var url = "http://localhost:8080/businessbooster/dashboard/gethoteldata?&latitude=" + latitude + "&longitude="
       + longitude + "&radius=" + radius + "&check_in=" + startDate + "&check_out=" + endDate;

       console.log(url);

    $.get(url, function(response, status) {
    	console.log(response);
    var hotelList = response['data']['hotelList'];

      hotelList.forEach(function(d) {
        d.name = d.name;
        d.totalRate = d.totalRate;
      });

      x.domain(hotelList.map(function(d) { return d.name; }));
        
        g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-90)" );

      y.domain([0, d3.max(hotelList, function(d) { return d.totalRate; })]);

      g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end");

      g.selectAll(".bar")
      .data(hotelList)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.name); })
        .attr("y", function(d) { return y(d.totalRate); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.totalRate); })
        .on("click", function(d) {
        	$('#streamgraph').empty();
        	drawHotelRates(d['propertyCode']);
        	showHotelDetails(d['propertyCode']);
        });
  }); 
}

function drawHotelRates(propertyCode) {
	console.log(propertyCode);
  /*$.get("http://localhost:8080/businessbooster/dashboard/gethoteldata?&latitude=36.0857&longitude=-115.1541&radius=42&check_in=2017-01-16&check_out=2017-01-17", function(response, status) {
    console.log(response);
});*/
var	width = document.getElementById('streamgraph').offsetWidth,
		height = document.getElementById('streamgraph').offsetHeight,
	svg = d3.select("#streamgraph")
		.append("svg")
		.attr("width", width)
		.attr("height", height),	
		 margin = {top: 20, right: 20, bottom: 40, left: 50},
		width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom;
    //var svg = d3.select("svg"),
    ;
    
var parseDate = d3.timeParse("%Y-%m-%d");

var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory10);


var color = d3.scaleLinear()
    .range(["#A1DBFF", "#0085E5"]);

var area = d3.area()
    .curve(d3.curveCardinal)
    .x(function(d, i) { 
      //console.log(d['data'].date);
      return x(d['data'].date); 
    })
    .y0(function(d) {
     return y(d[0]); })
    .y1(function(d) { 
      return y(d[1]); });

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var url = "http://localhost:8080/businessbooster/dashboard/getroomdata?property_code=" + propertyCode + "&check_in=" + startDate + "&check_out=" + endDate; 
$.get(url, function(response, status) {
  console.log(response);
  var keys = response['keys'];
  var data = response['data'];
  data.forEach(function(d) {
        d.date = parseDate(d.date);
        // Object.keys(d).forEach(function(key) {
        //   if(key != "date") {
        //    value = d[key];
        //   d[key] = d[key] / 5;
        //   console.log(d[key]); 
        //   }         
        // });
          return d;
        //d.totalRate = d.totalRate;
  });

  var stack = d3.stack()
    .keys(keys)
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone);

  x.domain(d3.extent(data, function(d) { 
   // console.log(d.date);
    return d.date;
  }));
  console.log(response['maxRate']);
  z.domain(keys);

  var layer = g.selectAll(".layer")
    .data(stack(data))  
    .enter().append("g")
      .attr("class", "layer");

  var stackData = stack(data);
  var lastData = stackData[stackData.length - 1];
   y.domain([0, lastData[lastData.length - 1][1]]);
  console.log(stack(data)); 
  layer.append("path")
      .attr("class", "area")
      .style("fill", function() { return color(Math.random()); })
      .attr("d", area);

  layer.filter(function(d) { 
    return d[d.length - 1][1] - d[d.length - 1][0] > 0.01; 
  })
    .append("text")
      .attr("x", width - 6)
      .attr("y", function(d) { 
      	return y(d[d.length - 1][1]); 
      })
      .style("font", "10px sans-serif")
      .style("text-anchor", "end")
      .text(function(d) { return d.key; });

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10));
});
}

function showHotelDetails(propertyCode) {
	var url = "http://localhost:8080/businessbooster/dashboard/getstatichoteldata?property_code=" + propertyCode + "&check_in=" + startDate + "&check_out=" + endDate; 
	$.get(url, function(response, status) {
		document.getElementById("hotelName").innerHTML = "NAME:" + response['data']['property_name'];
		document.getElementById("address").innerHTML = "ADDRESS:" + response['data']['address']['line1'] + ", " +
														response['data']['address']['city'] + ", " +
														response['data']['address']['country'] + ", " +
														response['data']['address']['postal_code'];
		if(response["data"]["rating"] == undefined) {
			document.getElementById("rating").innerHTML = "NA";	
		} else {
			document.getElementById("rating").innerHTML = response["data"]["rating"] + "/5";	
		}
	});
	
}

function onSearch() {
  var url = "https://maps.googleapis.com/maps/api/geocode/json?address="+ document.getElementById('autocomplete').value+"&key=" + MAP_API_KEY;
console.log(url);
        $.get(url, function(response, status) {
          var location = response['results'][0]['geometry']['location'];
          latitude = location.lat;
          longitude = location.lng;
          console.log(latitude + ' ' + longitude);
          radius = document.getElementById("myRange").value;
  console.log(document.getElementById("myRange").value);
  if(startDate !== undefined && endDate !== undefined && radius !== undefined) {
    //$('#placeholder3xx3').empty();
    drawBarChart(radius);
  }  
  console.log(startDate + " " + endDate);
        });
	
}

function initAutocomplete() {
        // Create the autocomplete object, restricting the search to geographical
        // location types.
        autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
            {types: ['geocode']});

        // When the user selects an address from the dropdown, populate the address
        // fields in the form.
        //autocomplete.addListener('place_changed', fillInAddress);

}

function getLocationDetails()
      { 

        var url = "https://maps.googleapis.com/maps/api/geocode/json?address="+ document.getElementById('autocomplete').value+"&key=" + MAP_API_KEY;

        $.get(url, function(response, status) {
          var location = response['results'][0]['geometry']['location'];
          latitude = location.lat;
          longitude = location.lng;
          console.log(latitude + ' ' + longitude);
        });
    }

    function geolocate() {
        if (navigator.geolocation) {
          console.log(navigator.geolocation);
          navigator.geolocation.getCurrentPosition(function(position) {

              latitude = position.coords.latitude;
              longitude = position.coords.latitude;
  			
            var geolocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
              center: geolocation,
              radius: position.coords.accuracy
              
            });
            autocomplete.setBounds(circle.getBounds());
    
          });

        }
      }

$('#reportrange').on('apply.daterangepicker', function(ev, picker) {
	startDate = picker.startDate.format('YYYY-MM-DD');
	endDate = picker.endDate.format('YYYY-MM-DD');
 });

function getMarkers(radius)
    { console.log("Inside markers...");
      var markers = [];//some array
    $.ajax({url: "http://localhost:8080/businessbooster/dashboard/interestpoints?&latitude=36.0857&longitude=-115.1541&radius=42", success: function(results){
          //window.eqfeed_callback = function(results) {
                 for (var i = 0; i < results.data.length; i++) {
                   var coords = results.data[i];
                   var latLng = new google.maps.LatLng(coords.latitude,coords.longitude);
                   var marker = new google.maps.Marker({
                      position: latLng,
                      map: map
                   });
                   markers.push(marker);
                 }
               //}

                 var bounds = new google.maps.LatLngBounds();
               for (var i = 0; i < markers.length; i++) {
                bounds.extend(markers[i].getPosition());
               }

               map.fitBounds(bounds);
         }});
       
       
    }

    function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5,
        center: new google.maps.LatLng(36,-115),
        mapTypeId: 'terrain'
      });

      
      // Create a <script> tag and set the USGS URL as the source.
      var script = document.createElement('script');
      // This example uses a local copy of the GeoJSON stored at
      // http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp
      //script.src = 'https://developers.google.com/maps/documentation/javascript/examples/json/earthquake_GeoJSONP.js';
      //$("button2").click(function(){
         
      //});
      document.getElementsByTagName('head')[0].appendChild(script);
    }
