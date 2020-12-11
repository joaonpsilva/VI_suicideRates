
// The svg
var width = document.getElementById('my_dataviz').parentElement.clientWidth;
var height = document.getElementById('my_dataviz').parentElement.clientHeight;

var svg = d3.select("svg")
  .attr('width', width)
  .attr('height', height*0.9)

/*   width = +svg.attr("width"),
  height = +svg.attr("height");
*/
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
  d3.queue()
    .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
    .defer(d3.csv, "master.csv",
      function(d){
          if (d.year != yearSelected){
            return;
          }
          if (!filterSex.includes(d.sex)){
            return;
          }
          if (!filterAges.includes(d.age)){
            return;
          }

          if (d.country in data){
            var c = data[d.country];
          }
          else{
            var c = new Country(d.country);
          }
          c.addPerAge(d.age, parseFloat(d.suicides_no));
          c.addPerSex(d.sex, parseFloat(d.suicides_no));
          c.addPopulation(parseFloat(d.population));
          data[d.country] = c;


          //data.set(d.country, p);
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
        //console.log(d.properties.name);
        //console.log(d.properties.name in data);

        if (d.properties.name in data){
          var c = data[d.properties.name];
          var per100k = 100000 * c.ctotal / c.cpopulation;
          return colorScale(per100k);
        }
      });
    }
