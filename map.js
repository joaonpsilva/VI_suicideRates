
// The svg
var width = document.getElementById('mapViz').parentElement.clientWidth;
var height = document.getElementById('mapViz').parentElement.clientHeight;

var svg = d3.select("#mapViz")
  .attr('width', width)
  .attr('height', height*0.9)

var tooltipMap = d3.select('#tooltipMap');

// Map and projection
var path = d3.geoPath();
var projection = d3.geoMercator()
  .scale(150)
  .center([0,20])
  .translate([width / 2, height / 2]);

// Data and color scale

var colorScale = d3.scaleThreshold()
  .domain([10, 25, 50, 75, 100])
  .range(d3.schemeReds[5]);

// Load external data and boot
updateData();

function updateData(){
  data = {}
  dataLine = {}

  d3.queue()
    .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
    .defer(d3.csv, "master.csv",
      function(d){
          if (!filterCountries.includes(d.country)) return;
          
          //------------LINECHART
          if (!(d.year in dataLine) ){
            dataLine[d.year] = {"suicides":0,"population":0, "gdp":0, "countries":[]};
          }
          dataLine[d.year]["population"] += parseInt(d.population);
          if (!(dataLine[d.year]["countries"].includes(d.country))){
            dataLine[d.year]["gdp"] += parseInt(d.gdp_for_year);
            dataLine[d.year]["countries"].push(d.country);
          }
          //------------------------------
          
          if (!filterSex.includes(d.sex))return;
          
          if (!filterAges.includes(d.age))return;
          
          dataLine[d.year]["suicides"]+=parseInt(d.suicides_no);

          if (d.year != yearSelected)return;

          if (d.country in data){
            var c = data[d.country];
          }
          else{
            var c = new Country(d.country);
          }
          c.addPerAge(d.age, parseFloat(d.suicides_no));
          c.addPerSex(d.sex, parseFloat(d.suicides_no));
          c.addSuicideno(parseFloat(d.suicides_no));
          c.addPopulation(parseFloat(d.population));
          c.setGdp(d.gdp_for_year);
          c.setGdpPerCap(d.gdp_per_capita);
          data[d.country] = c;


          //data.set(d.country, p);
      })
    .await(ready);
    }

function ready(error, topo) {

  // Draw the map
  //console.log(data);

  svg.append("g")
    .selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")
      // draw each country
      .attr("d", d3.geoPath()
        .projection(projection)
      )
      // set the color of each country
      .attr("fill", function (d) {
        return getColor(d);
      })
      // On click event function for map
      .on('mouseover', function(d){
          console.log(d)
          d3.select(this).attr("fill","Turquoise")

          
          tooltipMap.html(d.properties.name)
          .style('color', 'black')
          .style("font-size", '30px')
          .style('display', 'block')
          .style("font-weight", 'bolder')
          .style('left', (d3.event.pageX + 20) + "px")
          .style('top', (d3.event.pageY) + "px");

          tooltipMap.append("div");
          tooltipMap.append('text').text("Population: ").style("font-size", '18px');
          tooltipMap.append('text').text(d.properties.population).style("font-size", '18px').style("font-weight", 'normal');

          tooltipMap.append("div");
          tooltipMap.append('text').text("Suicides: ").style("font-size", '18px');
          tooltipMap.append('text').text(d.properties.suicides).style("font-size", '18px').style("font-weight", 'normal');

          tooltipMap.append("div");
          tooltipMap.append('text').text("Suicides p/ 100k: ").style("font-size", '18px');
          tooltipMap.append('text').text(d.properties.suicidesPerCapita.toFixed(2)).style("font-size", '18px').style("font-weight", 'normal');

          tooltipMap.append("div");
          tooltipMap.append('text').text("Gdp p/ Capita: ").style("font-size", '18px');
          tooltipMap.append('text').text(d.properties.gdpPerCap).style("font-size", '18px').style("font-weight", 'normal');

      })
      .on('mouseout', function(d){
        console.log(d)
        d3.select(this).attr("fill",getColor(d))
        if (tooltipMap) tooltipMap.style('display', 'none');

      })
      .on("click", function(d){
        filterCountries = [d.properties.name]
        document.getElementById("aficaCB").checked = false;
        document.getElementById("asiaCB").checked = false;
        document.getElementById("americaCB").checked = false;
        document.getElementById("europeCB").checked = false;

        updateData()
      })

      var pieData1 = {'male': 0, 'female':0};
      var pieData2 = {'5-14':0, '15-24':0,'25-34':0,'35-54':0,'55-74':0, '75+':0};
      
      for (var key in data){
          pieData1['male'] += data[key].perSex['male'];
          pieData1['female'] += data[key].perSex['female'];

          pieData2['5-14'] += data[key].perAge['5-14 years'];
          pieData2['15-24'] += data[key].perAge['15-24 years'];
          pieData2['25-34'] += data[key].perAge['25-34 years'];
          pieData2['35-54'] += data[key].perAge['35-54 years'];
          pieData2['55-74'] += data[key].perAge['55-74 years'];
          pieData2['75+'] += data[key].perAge['75+ years'];
      }
      updatePie(svgPie1, pieData1);
      updatePie(svgPie2, pieData2);
      updateLine()
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
    return colorScale(per100k);
  }
  return "black"
}
