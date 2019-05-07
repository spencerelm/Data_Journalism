// Set up chart
var svgWidth = 960;
var svgHeight = 500;
var margin = {top: 20, right: 40, bottom: 60, left: 100};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
var padding = 25;  
var formatPercent = d3.format('.2%');

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select('.chart')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var Smokechart = svg.append('g');

// Append a div to the body to create tooltips, assign it a class
d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);

// Retrieve data from CSV file and execute everything below
d3.csv("./assets/data/data.csv", function(err, SmokeAge) {
    for (var i = 0; i < SmokeAge.length; i++){

        // Print the smoke/age data
        console.log(SmokeAge[i].abbr)
  } 
    if(err) throw err;


    SmokeAge.forEach(function(data) {
        data.age = +data.age;
        data.smokes = +data.smokesHigh;
    });
    
    // Create scale functions
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    

    // Create axis functions
    var bottomAxis = d3.axisBottom(x);
    var leftAxis = d3.axisLeft(y);

    var xValue = function(d) { return x(d.age);};
    var yValue = function(d) { return y(d.smokes);};
  

    // Scale the domain
    var xMin;
    var xMax;
    var yMin;
    var yMax;

    xMin = d3.min(SmokeAge, function(data) {
        return data.age * 0.8 ;
    });

    xMax = d3.max(SmokeAge, function(data) {
        return data.age * 1.2;
    });

    yMin = d3.min(SmokeAge, function(data) {
        return data.smokes * 0.8 ;
    });

    yMax = d3.max(SmokeAge, function(data) {
        return data.smokes * 1.2;
    });
    
    x.domain([xMin, xMax]);
    y.domain([yMin, yMax]);

    // Initialize tooltip when you place mouse cursor it will give statename, age, and smoke variables
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(data) {
            var stateName = data.state;
            var age = +data.age;
            var smokes = +data.smokes;
            return (
                stateName + '<br> Age: ' + age + '% <br> smoking: ' + smokes +'%'
            );
        });

    // Create tooltip
    Smokechart.call(toolTip);

    // Append an SVG group for the xaxis, then display x-axis 
        Smokechart.append("g")
        .attr('transform', `translate(0, ${height})`)
        .call(bottomAxis);

    // Append a group for y-axis, then display it
    Smokechart
    .append("g")
    .call(leftAxis);
    
    

    Smokechart.selectAll("circle")
        .data(SmokeAge)
        .enter()
        .append("circle")
        .attr("cx", function(data) {
            return x([data.age])
        })
        .attr("cy", function(data) {
            return y(data.smokes)
        })
        .attr("r", "15")
        .attr("fill", "lightblue")


        // display tooltip on click
        .on("mouseenter", function(data) {
            toolTip.show(data);
        })
        // hide tooltip on mouseout
        .on("mouseout", function(data) {
            toolTip.hide(data);
        });
    
    // Appending a label to each data point
    Smokechart.append("text")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .selectAll("tspan")
        .data(SmokeAge)
        .enter()
        .append("tspan")
            .attr("x", function(data) {
                return x(data.age);
            })
            .attr("y", function(data) {
                return y(data.smokes);
            })
            .text(function(data) {
                return data.abbr
            });

    // Append y-axis label
    Smokechart
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0-margin.left + 40)
        .attr("x", 0 - height/2)
        .attr("dy","1em")
        .attr("class", "axis-text")
        .text("Age/Smoking (%)")

    // Append x-axis labels
    Smokechart
        .append("text")
        .attr(
            "transform",
            "translate(" + width / 2 + " ," + (height + margin.top + 30) + ")"
        )
        .attr("class", "axis-text")
        .text("STATES");
    });
