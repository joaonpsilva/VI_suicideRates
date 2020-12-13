
var width = document.getElementById('lineViz').parentElement.clientWidth * 4/5;
var height = document.getElementById('lineViz').parentElement.clientHeight * 4/5;
var margin = 50;
var xmargin = 100

var x_scale;
var tooltipLine;
var tooltip;
var vizdata;
function updateLine(){

    // código de visualização
    var linesvg = d3.select("#lineViz");
    linesvg.selectAll("*").remove();

    linesvg
    .attr('width', width)
    .attr('height', height)

    tooltip = d3.select('#tooltip');
    tooltipLine = linesvg.append('line');

    linesvg.attr("transform", "translate(" + width*1/9.5 +"," + height*1/5 +")");

    vizdata=[];
    for(var key in dataLine){
        var value = dataLine[key];
        vizdata.push({"year": key, "suicides": value["suicides"], "gdpPerCap":value["gdp"]/value["population"] })
    }


    // X Scale
    let x_extent = d3.extent(vizdata, function (d) { return d.year });
    x_scale = d3.scaleLinear()
        .range([xmargin, width - xmargin])
        .domain(x_extent);

    // X Axis
    let x_axis = d3.axisBottom(x_scale);

    linesvg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height - margin) + ")")
        .call(x_axis);

    // Y Scale
    let y_extent = d3.extent(vizdata, function (d) { return d.suicides });
    let y_scale = d3.scaleLinear()
        .range([height - margin, margin])
        .domain(y_extent);

    // Y Axis
    let y_axis = d3.axisLeft(y_scale);
    linesvg.append("g")
        .attr("class", "y axisO")
        .attr("transform", "translate(" + xmargin + ", 0)")
        .call(y_axis);

    // Y2 Scale
    let y_extent2 = d3.extent(vizdata, function (d) {return d.gdpPerCap });
    let y_scale2 = d3.scaleLinear()
        .range([height - margin, margin])
        .domain(y_extent2);

    // Y2 Axis
    let y_axis2 = d3.axisRight(y_scale2);
    linesvg.append("g")
        .attr("class", "y axisG")
        .attr("transform", "translate(" + (width-xmargin) +  ", 0)")
        .call(y_axis2);


    console.log(vizdata)
    // Line
    let linesuicides = d3.line()
        .x(function (d) { return x_scale(d.year) })
        .y(function (d) { return y_scale(d.suicides) });

    // Line
    let linegdp = d3.line()
        .x(function (d) { return x_scale(d.year) })
        .y(function (d) { return y_scale2(d.gdpPerCap) });


    linesvg.append("path")
        .attr("d", linesuicides(vizdata))
        .attr("class", "linha_suicides");
    linesvg.append("path")
        .attr("d", linegdp(vizdata))
        .attr("class", "linha_gdp");

    linesvg.append("text")
        .text("Suicides over the years")
        .style('fill', 'white')
        .style('font-size', '30px')
        .attr("x", (width / 2) - xmargin)
        .attr("y", margin / 2)
        .attr("fill", "red");

    linesvg.append("text")
        .text("Years")
        .style('fill', 'white')
        .style('font-size', '20px')
        .attr("x", (width / 2))
        .attr("y", height - margin / 3);

    linesvg.append("text")
        .text("Suicides")
        .style('fill', 'red')
        .style('font-size', '20px')
        .attr("x", 0)
        .attr("y", 0)
        .attr("transform", "rotate (90, 0, 0) translate(150, -" + (xmargin-70) +")");

    linesvg.append("text")
        .text("GDP per cap")
        .style('fill', 'green')
        .style('font-size', '20px')
        .attr("x", 0)
        .attr("y", 0)
        .attr("transform", "rotate (90, 0, 0) translate(100, -" + (width-xmargin + 70) +")");


    tipBox = linesvg.append('rect')
    .attr('width', width-2*xmargin)
    .attr('height', height)
    .attr('opacity', 0)
    .attr("transform", "translate(" + xmargin +", 0)")
    .on('mousemove', drawTooltip)
    .on('mouseout', removeTooltip);

}

function removeTooltip() {
    if (tooltip) tooltip.style('display', 'none');
    if (tooltipLine) tooltipLine.attr('stroke', 'none');
}

function drawTooltip() {
    const year = Math.floor((x_scale.invert(d3.mouse(tipBox.node())[0] + xmargin)));
    
    tooltipLine.attr('stroke', 'black')
        .attr('x1', x_scale(year))
        .attr('x2', x_scale(year))
        .attr('y1', 0)
        .attr('y2', height);
    
    tooltip.html(year)
        .style('color', 'black')
        .style('display', 'block')
        .style('left', (d3.event.pageX + 20) + "px")
        .style('top', (d3.event.pageY) + "px");

    let suicides;
    let gdp;
    vizdata.forEach(function (item, index) {
        if (item.year == year){
            suicides = item.suicides;
            gdp = item.gdpPerCap;
        }
    });
    tooltip.append('div').style('color','orangered').html("Suicides: " + suicides);
    tooltip.append('div').style('color','green').html("GDP per cap. " + gdp);

}