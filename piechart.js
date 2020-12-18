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


var tooltipMap = d3.select('#tooltipPie');



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
    console.log(data_ready)

    console.log(pieData)
    // map to data
    var u = svgPie.selectAll("path")
        .data(data_ready)
    // Build the pie    
    u
        .enter()
        .append('path')
            .on('mouseover', function(d){
                d3.select(this).attr("fill",function(d){return d3.rgb(color(d.data.key)).brighter(1);})


                tooltipMap.html("  ")
                    .style('color', 'black')
                    .style("font-size", '30px')
                    .style('display', 'block')
                    .style("font-weight", 'bolder')
                    .style('left', (d3.event.pageX + 20) + "px")
                    .style('top', (d3.event.pageY) + "px");

                tooltipMap.append("div");
                tooltipMap.append('text').text("Cases: " + d.data.value).style("font-size", '18px');

                }
            )
        .on('mouseout', function(d){
            d3.select(this).attr("fill",function(d){ return(color(d.data.key)) })
            if (tooltipMap) tooltipMap.style('display', 'none');})


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

function getColor(d){
    if (d.properties.name in data){
        var c = data[d.properties.name];
        var per100k = 100000 * c.ctotal / c.cpopulation;

        d.properties.suicides = c.total
        d.properties.suicidesPerCapita = per100k
        d.properties.population = c.population
        d.properties.gdp = c.cgdp
        d.properties.gdpPerCap = c.cgdpPerCap

        if(per100kVis)
            return colorScale(per100k);
        else
            return colorScale(c.total)
    }
    return "black"
}