/**
 * Created by jmartinez on 7/27/2015.
 */


var svg = d3.select("#churchLegend")
    .append("svg")
    .attr("height", 20)
    .attr("width", 20);


svg.append("circle")
    .attr("r", 5)
    .attr("cx", 10)
    .attr("cy", 15);

d3.select("#churchLegend")
    .append("span")
    .text("Churches");

var svgRoutes = d3.select("#routesLegend")
    .append("svg")
    .attr("height", 20)
    .attr("width", 30);

svgRoutes.append("line")
    .attr("x1", 1)
    .attr("x2", 19)
    .attr("y1", 15)
    .attr("y2", 15)
    .attr("stroke", "#A22E3B")
    .attr("stroke-width", 2);

d3.select("#routesLegend")
    .append("span")
    .text("Transit Routes");

var svgStops = d3.select("#stopsLegend")
    .append("svg")
    .attr("height", 20)
    .attr("width", 30);

svgStops.append("circle")
    .attr("class", "stops")
    .attr("r", 5)
    .attr("cx", 10)
    .attr("cy", 15);

d3.select("#stopsLegend")
    .append("span")
    .text("Transit Stops");