// set the dimensions and margins of the graph
var width = window.innerWidth
    height = document.getElementById('mapViz').parentElement.clientHeight
    margin = 40


// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(width/2.5, height/2.5) / 2 - margin

// append the svg object to the div called 'my_dataviz'
var svgPie1 = d3.select("#pieChart1")
    .attr("width", width/2)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + (width/4)  + "," + radius + ")");

var svgPie2 = d3.select("#pieChart2")
    .attr("width", width/2)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + (width/4 - 70) + "," + radius + ")");

//LABELS
var lab = document.getElementById("sexLabel")
lab.innerHTML="Sex:"
lab.style.left= width/4 - radius -50 + "px"
lab.style.top=height/4 + "px"

var lab2 = document.getElementById("ageLabel")
lab2.innerHTML="Age:"
lab2.style.left= width/4 - radius -50 - 70 + "px"
lab2.style.top=height/4 + "px"

// set the color scale
var color = d3.scaleOrdinal()
  .range(d3.schemeDark2);

var arcGenerator = d3.arc()
  .innerRadius(0)
  .outerRadius(radius)
// Create dummy data
function updatePie(svgPie, pieData){
    for (var key in pieData){
      if (pieData[key] == 0 || isNaN(pieData[key])){
        delete pieData[key];
      }
    }


    var pie = d3.pie()
    .value(function(d) {return d.value; })
    .sort(function(a, b) { return d3.ascending(a.key, b.key);} ) // This make sure that group order remains the same in the pie chart
    var data_ready = pie(d3.entries(pieData))

    // map to data
    var u = svgPie.selectAll("path")
        .data(data_ready)
    // Build the pie    
    u
        .enter()
        .append('path')
        .merge(u)
        .attr('d', arcGenerator)
        .attr('fill', function(d){ return(color(d.data.key)) })
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 1)
    // remove the group that is not present anymore
    u
        .exit()
        .remove()


    var u = svgPie.selectAll("text")
        .data(data_ready)
    u.enter()
        .append('text')
        .merge(u)
        .transition()
        .duration(2000)
        .text(function(d) {
          return d.data.key
        })
        .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
        .style("text-anchor", "middle")
        .style("font-size", 17)
    u
        .exit()
        .remove()

}
