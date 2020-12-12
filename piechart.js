// set the dimensions and margins of the graph
var width = document.getElementById('mapViz').parentElement.clientWidth
    height = document.getElementById('mapViz').parentElement.clientHeight
    margin = 40

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(width/2.5, height/2.5) / 2 - margin

// append the svg object to the div called 'my_dataviz'
var svgPie1 = d3.select("#pieChart1")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width/3.2  + "," + radius + ")");

var svgPie2 = d3.select("#pieChart2")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width/3.2 + "," + radius + ")");

// set the color scale
var color = d3.scaleOrdinal()
  .range(d3.schemeDark2);

var arcGenerator = d3.arc()
  .innerRadius(0)
  .outerRadius(radius)
// Create dummy data
//var data = {a: 9, b: 20, c:30, d:8, e:12}
function updatePie(svgPie, pieData){


    var pie = d3.pie()
    .value(function(d) {return d.value; })
    .sort(function(a, b) { console.log(a) ; return d3.ascending(a.key, b.key);} ) // This make sure that group order remains the same in the pie chart
    var data_ready = pie(d3.entries(pieData))

    // map to data
    var u = svgPie.selectAll("path")
        .data(data_ready)
    // Build the pie    
    u
        .enter()
        .append('path')
        .merge(u)
        .transition()
        .duration(1000)
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
        .duration(1000)
        .text(function(d){ return d.data.key})
        .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
        .style("text-anchor", "middle")
        .style("font-size", 17)
    u
        .exit()
        .remove()

}


/*
  // A function that create / update the plot for a given variable:
function update(chart) {

    // Compute the position of each group on the pie:
    if (chart == 0){    //SEX
        
        var pieData = {'male': 0, 'female':0};
        data.array.forEach(element => {
            pieData['male'] += element.perSex['male'];
            pieData['male'] += element.perSex['male'];
        });
    }
    var pie = d3.pie()
      .value(function(d) {return d.value; })
      .sort(function(a, b) { console.log(a) ; return d3.ascending(a.key, b.key);} ) // This make sure that group order remains the same in the pie chart
    var data_ready = pie(d3.entries(data))
  
    // map to data
    var u = svg.selectAll("path")
      .data(data_ready)
  
    // Build the pie          <script  src="piechart.js"></script>
  
    u
      .enter()
      .append('path')
      .merge(u)
      .transition()
      .duration(1000)
      .attr('d', d3.arc()
        .innerRadius(0)
        .outerRadius(radius)
      )
      .attr('fill', function(d){ return(color(d.data.key)) })
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 1)
  
    // remove the group that is not present anymore
    u
      .exit()
      .remove()
  
  }
  
  // Initialize the plot with the first dataset
  update(data1)*/