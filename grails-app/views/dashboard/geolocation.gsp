<!DOCTYPE html>
<html>
  <head>
    <title>Place Autocomplete Address Form</title>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
    <script>
    
    function getMarkers()
    {	console.log("Inside markers...");

    	var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
   		 };
   		var latitude1 = getUrlParameter('latitude');
   		var longitude1 = getUrlParameter('longitude');
   		var radius1 = getUrlParameter('radius');

    
    	var markers = [];//some array
	 	$.ajax({url: "${createLink(controller:'Dashboard', action: 'interestpoints')}?&latitude="+latitude1+"&longitude="+longitude1+"&radius="+radius1, success: function(results){
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

    var map;
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

    // Loop through the results array and place a marker for each
    // set of coordinates.
	  $( document ).ready(function() {
		  getMarkers();
	});
    </script>
    <style>
      /* Always set the map height explicitly to define the size of the div
       * element that contains the map. */
      #map {
        height: 50%;
        width: 50%;
      }
      /* Optional: Makes the sample page fill the window. */
      html, body {
        height: 100%;
        margin: 0;
        padding: 0;
      }
    </style>
    <link type="text/css" rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500">
    <style>
      #locationField, #controls {
        position: relative;
        width: 480px;
      }
      #autocomplete {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 99%;
      }
      .label {
        text-align: right;
        font-weight: bold;
        width: 100px;
        color: #303030;
      }

      .field {
        width: 99%;
      }
      .slimField {
        width: 80px;
      }
      .wideField {
        width: 200px;
      }
      #locationField {
        height: 20px;
        margin-bottom: 2px;
      }
      .mapLoc {
        top: 40px;
        margin-bottom: 2px;
      }
    </style>
  </head>

  <body>
    <div id="locationField">
     
      <button id="button2" onClick="getMarkers()">markers</button><br>
    </div>
    
     <div id="map" class="mapLoc"	></div>

    <script async defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyASzllYde2cO8z7gmUg5Wkez4asfgYc9hE&callback=initMap">
    </script>
     </body>
</html>