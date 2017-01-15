<!DOCTYPE html>
<html lang="en">

  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!-- Meta, title, CSS, favicons, etc. -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Gentelella Alela! | </title>

    <!-- Bootstrap -->
    <link href="<%= request.getContextPath() %>/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="<%= request.getContextPath() %>/css/font-awesome/css/font-awesome.min.css" rel="stylesheet">
    <!-- NProgress -->
    <link href="<%= request.getContextPath() %>/css/nprogress.css" rel="stylesheet">
    <link href="<%= request.getContextPath() %>/css/daterangepicker.css" rel="stylesheet">
    
    <!-- Custom Theme Style -->
    <link href="<%= request.getContextPath() %>/css/custom.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Cherry+Swash" rel="stylesheet">
  </head>

  <body class="nav-md">
    <div class="container body">
      <h2 class="text-center" style="font-size:100px">D-VIZ</h2>
      <div class="main_container">

        <!-- page content -->
        <div class="right_col" role="main" style="margin-left: 0px;">
            <br />


            <div class="row">
              <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="dashboard_graph x_panel">
                  <div class="row x_title">
                   
                   		  <div class="col-xs-1">
                              <label for="MyInput" style="text-align:center; width:1px;">Area</label>
                          </div>
                          <div class="col-xs-3">
                              <input id="myRange" type ="range" min ="100" max="500" step ="50" width="80%" value ="100">
                           </div>

                            <div class="col-xs-3">
                              <div id="reportrange" style="background: #fff; cursor: pointer; padding: 7px 5px; border: 1px solid #ccc" style="display:block;margin-left:auto;margin-right:auto;">
                                 <i class="glyphicon glyphicon-calendar fa fa-calendar"></i>
                                 <span>December 30, 2014 - January 28, 2015</span> <b class="caret"></b>
                              </div>
                           </div>

                         
                     <div id="locationField" class="col-xs-3">
                      <!-- <div class="input-group"> -->
                         <input id="autocomplete" placeholder="Enter your address" onFocus="geolocate()" type="text" class="form-control"></input>
                    </div>	
                    <div class="col-xs-2">
                    	 <button id="search" onClick="onSearch()" class="btn btn-default">Search</button>
                     
                    </div>
                    <!-- <div class = "col-xs-3">
                      <img src="<%= request.getContextPath() %>/images/search-icon.png" height="50px" widht="50px" onclick="onSearch()" style="display:block;margin-left:auto;margin-right:auto;">
                    </div>
 -->
                  </div>

                  
                  <div class="x_content">
                    <div class="demo-container" style="height:500px">
                      <div id="placeholder3xx3" class="demo-placeholder" style="width: 100%; height:500px;"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="panel panel-default">
              <div class="panel-heading">Hotel Information</div>
                <div class="panel-body">
                  <div class="row">
                    <div class="col-md-12 col-sm-12 col-xs-12">
                      <div class = "col-xs-8" style="height:500px;">
                        <div id="streamgraph" class="demo-placeholder" style="width: 100%; height:500px;"></div>
                      </div>
                      <div class = "col-xs-4" style="height:500px;">
                      <table class="table" style="visibility:hidden" id="tableHotelInfo">
                      	<tr class="info">
                      		<th><center><b>Hotel Information</b></center></th>
                      		<th></th>
                        </tr>
                      	<tr class="info">
                      		<td>Name</td>
                      		<td id="hotelName"></td>
                      	</tr>
                      	<tr class="info">
                      		<td>Address</td>
                        	<td id="address"></td>
                        </tr>
                        <tr class="info">
                        	<td>Rating</td>
                        	<td id="rating"></td>
                        </tr>
                      </table>
                      <button type="button" class="btn btn-primary" id="locationInfo"  onClick="newMapWindow()">Search Location Information for business</button>

                      </div>
                    </div>
                  </div>
                </div>
              </div><!-- END: <div class="panel panel-default"> -->
              
              
              <div class="row">
              	<div class="col-md-12 col-sm-12 col-xs-12">
              		 <div class="col-xs-6">
	               		<div id="map" class="mapLoc">
	               		
	               		</div>
	               	</div>
	               	<div class="col-xs-6">
	               	</div>
               	</div>
              </div> 	
              
              
            </div>
          </div>
        </div>

      
        
        <!-- /page content -->

        <!-- footer content -->
        <footer style="margin-left: 0px">
          <div class="pull-right">
            Gentelella - Bootstrap Admin Template by <a href="https://colorlib.com">Colorlib</a>
          </div>
          <div class="clearfix"></div>
        </footer>
        <!-- /footer content -->
      </div>
    </div>

    <script src="https://d3js.org/d3.v4.min.js"></script>
    <!-- jQuery -->
    <script src="<%= request.getContextPath() %>/js/jquery.min.js"></script>
    <!-- Bootstrap -->
    <script src="<%= request.getContextPath() %>/js/bootstrap.min.js"></script>
    <script src="<%= request.getContextPath() %>/js/moment/min/moment.min.js"></script>
    <script src="<%= request.getContextPath() %>/js/bootstrap-daterangepicker/daterangepicker.js"></script>

    <!-- Custom Theme Scripts -->
    <script src="<%= request.getContextPath() %>/js/custom.min.js"></script>
    <script src="<%= request.getContextPath() %>/js/index.js"></script>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyASzllYde2cO8z7gmUg5Wkez4asfgYc9hE&libraries=places&callback=initAutocomplete"
        async defer></script>

    <script type="text/javascript">
      $(document).ready(function() {

        var cb = function(start, end, label) {
          console.log(start.toISOString(), end.toISOString(), label);
          $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        };

        var optionSet1 = {
          startDate: moment(),
          endDate: moment().add(1, 'month'),
          minDate: moment(),
          maxDate: '',
          dateLimit: {
            days: 60
          },
          showDropdowns: true,
          showWeekNumbers: true,
          timePicker: false,
          timePickerIncrement: 1,
          timePicker12Hour: true,
          ranges: {
            'Today': [moment(), moment()],
            'Tomorrow': [moment().add(1, 'days'), moment().add(1, 'days')],
            'Next 7 Days': [moment(), moment().add(6, 'days')],
            'Next 30 Days': [moment(), moment().add(29, 'days')],
            'This Month': [moment().startOf('month'), moment().endOf('month')]
//            'Next Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
          },
          opens: 'left',
          buttonClasses: ['btn btn-default'],
          applyClass: 'btn-small btn-primary',
          cancelClass: 'btn-small',
          format: 'MM/DD/YYYY',
          separator: ' to ',
          locale: {
            applyLabel: 'Submit',
            cancelLabel: 'Clear',
            fromLabel: 'From',
            toLabel: 'To',
            customRangeLabel: 'Custom',
            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            firstDay: 1
          }
        };
        $('#reportrange span').html(moment().subtract(29, 'days').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));
        $('#reportrange').daterangepicker(optionSet1, cb);
        $('#reportrange').on('show.daterangepicker', function() {
          console.log("show event fired");
        });
        $('#reportrange').on('hide.daterangepicker', function() {
          console.log("hide event fired");
        });
        $('#reportrange').on('apply.daterangepicker', function(ev, picker) {
          $(this).attr('value', $('#reportrange').val());
        });
        $('#reportrange').on('cancel.daterangepicker', function(ev, picker) {
          console.log("cancel event fired");
        });
        $('#options1').click(function() {
          $('#reportrange').data('daterangepicker').setOptions(optionSet1, cb);
        });
        $('#options2').click(function() {
          $('#reportrange').data('daterangepicker').setOptions(optionSet2, cb);
        });
        $('#destroy').click(function() {
          $('#reportrange').data('daterangepicker').remove();
        });
        $('#reportrange').change(function(){
          $(this).attr('value', $('#deliveryTime').val());
        });
    });

    </script>
    <!-- /bootstrap-daterangepicker -->
  </body>
</html>