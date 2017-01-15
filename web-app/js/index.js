

var MAP_API_KEY = "AIzaSyASzllYde2cO8z7gmUg5Wkez4asfgYc9hE";

var startDate;
var endDate;
var longitude;
var latitude;

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

      console.log(+svg.attr("width"));
      console.log(height);

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
        .attr("height", function(d) { return height - y(d.totalRate); });
  }); 
}

function drawHotelRates(startDate, endDate, radius) {
  /*$.get("http://localhost:8080/businessbooster/dashboard/gethoteldata?&latitude=36.0857&longitude=-115.1541&radius=42&check_in=2017-01-16&check_out=2017-01-17", function(response, status) {
    console.log(response);
});*/
    var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom;

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

$.get("http://localhost:8080/businessbooster/dashboard/getroomdata?property_code=RTCEQIBS&check_in=2017-01-14&check_out=2017-01-30", function(response, status) {
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
      .attr("y", function(d) { return y(d[d.length - 1][1]); })
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

function onSearch() {
	radius = document.getElementById("myRange").value;
	console.log(document.getElementById("myRange").value);
	if(startDate !== undefined && endDate !== undefined && radius !== undefined) {
		drawBarChart(radius);
	}  
	console.log(startDate + " " + endDate);
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
        console.log(url);

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
   	console.log("apply event fired, start/end dates are " + picker.startDate.format('MMMM D, YYYY') + " to " + picker.endDate.format('MMMM D, YYYY'));
 });