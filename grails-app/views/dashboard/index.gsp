<!DOCTYPE html>
<meta charset="utf-8">
<style>

.bar {
  fill: steelblue;
}

.bar:hover {
  fill: brown;
}

.axis--x path {
  display: none;
}

</style>
<svg width="960" height="500"></svg>
<script src="https://d3js.org/d3.v4.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<script>

init();

function init() {

  var svg = d3.select("svg"),
      margin = {top: 20, right: 20, bottom: 100, left: 40},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom;

  var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
      y = d3.scaleLinear().rangeRound([height, 0]);

  var g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    $.get("http://localhost:8080/businessbooster/dashboard/gethoteldata", function(response, status) {
    var hotelList = response['data']['hotelList'];

      hotelList.forEach(function(d) {
        d.name = d.name;
        console.log(d.name);
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

function myJsonMethod(response) {
  console.log(response);
}

</script>