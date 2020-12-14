
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

var colorScale;

// Load external data and boot
updateData();

function updateData(){
  data = {}
  dataLine = {}
  
  if (per100kVis)
    colorScale = d3.scaleThreshold()
    .domain([10, 25, 50, 75, 100])
    .range(d3.schemeReds[5]);
  else
    colorScale = d3.scaleThreshold()
    .domain([100, 1000, 10000, 25000, 50000])
    .range(d3.schemeReds[5]);

  d3.queue()
    .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
    .defer(d3.csv, "master.csv",
      function(d){
          if (!filterCountries.includes(d.country)) return;
          //------------LINECHART
          if (!(d.country=='China' &&  filterCountries.length != 1)){
            if (!(d.year in dataLine) ){
              dataLine[d.year] = {"suicides":0,"population":0, "gdp":0, "countries":[]};
            }
            dataLine[d.year]["population"] += parseInt(d.population);
            if (!(dataLine[d.year]["countries"].includes(d.country))){
              dataLine[d.year]["gdp"] += parseInt(d.gdp_for_year);
              dataLine[d.year]["countries"].push(d.country);
            }
          }
          //------------------------------
          
          if (!filterSex.includes(d.sex))return;
          
          if ((!filterAges.includes(d.age) && d.age!='') || filterAges.length==0)return;
          
          if (!(d.country=='China' &&  filterCountries.length != 1))
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
          c.addPopulationPerSex(d.sex, parseFloat(d.population));
          c.addPopulationPerAge(d.age, parseFloat(d.population));

          c.setGdp(d.gdp_for_year);
          c.setGdpPerCap(d.gdp_per_capita);
          data[d.country] = c;

      })
    .await(ready);
    }

function ready(error, topo) {

  // Draw the map
  console.log(data);

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
      .on('mouseover', function(d){               //HOOVER
          //console.log(d)
          d3.select(this).attr("fill","Turquoise")

          
          tooltipMap.html(d.properties.name)
          .style('color', 'black')
          .style("font-size", '30px')
          .style('display', 'block')
          .style("font-weight", 'bolder')
          .style('left', (d3.event.pageX + 20) + "px")
          .style('top', (d3.event.pageY) + "px");

          if (d.properties.name in data){
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
          }
      })
      .on('mouseout', function(d){
        d3.select(this).attr("fill",getColor(d))
        if (tooltipMap) tooltipMap.style('display', 'none');

      })
      .on("click", function(d){               //CLICK
        filterCountries = [d.properties.name]
        document.getElementById("aficaCB").checked = false;
        document.getElementById("asiaCB").checked = false;
        document.getElementById("americaCB").checked = false;
        document.getElementById("europeCB").checked = false;

        updateData()
      })
      var totalPopPSex = {};
      var totalPopPAge = {};
      var pieData1 = {};
      var pieData2 = {};

      filterAges.forEach(function(e){ //create dicts
        totalPopPAge[e.slice(0,-6)] = 0
        pieData2[e.slice(0,-6)] = 0
      });
      filterSex.forEach(function(e){ //create dicts
        totalPopPSex[e] = 0
        pieData1[e] = 0
      });


      for (var key in data){  //fill dicts

        filterAges.forEach(function(e){
          totalPopPAge[e.slice(0,-6)] += data[key].popPerAge[e]
          pieData2[e.slice(0,-6)]+= data[key].perAge[e]
        });
        filterSex.forEach(function(e){
          totalPopPSex[e] += data[key].popPerSex[e]
          pieData1[e]+= data[key].perSex[e]
        });
      }

      if (per100kVis){
        for (sex in pieData1){  //merge dicts
          pieData1[sex] /= totalPopPSex[sex]
        }
        for (age in pieData2){
          pieData2[age] /= totalPopPAge[age]
        }
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

    if(per100kVis)
      return colorScale(per100k);
    else
      return colorScale(c.total)
  }
  return "black"
}

