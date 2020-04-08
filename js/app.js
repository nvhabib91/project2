let svgWidth = 800;
let svgHeight = 420;

let margin = {
  top: 20,
  right: 100,
  bottom: 80,
  left: 90
};

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
let svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

let defs = svg.append("defs")


d3.csv("../data/playerfaces.csv").then((data) => {
  defs.selectAll(".team-pattern")
    .data(data)
    .enter().append("pattern")
    .attr("class","team-pattern")
    .attr("id", function(d){
      return d.Player.toLowerCase().replace(/ |'/g,"-")
    })
    .attr("height", "100%")
    .attr("width", "100%")
    .attr("patternContentUnits","objectBoundingBox")
    .append("image")
    .attr("height",1)
    .attr("width",1)
    .attr("preserveAspectRatio", "none")
    .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
    .attr("xlink:href", function(d){
      return d.URL
    })
});
  // Append an SVG group
let chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
let switchX = "PTS";
let switchY = "G";

/////////////////////////////////////////////////////////////////////

// There are two x-axis, switch between
let xScale = (trendData, switchX) => {
  // create scales
  let xLinearScale = d3.scaleLinear()
    .domain([d3.min(trendData, d => d[switchX]) * 0.8,
      d3.max(trendData, d => d[switchX]) * 1.2])
    .range([0, width]);
  return xLinearScale;
}

// There are two y-axis, switch between
let yScale = (trendData, switchY) => {
  // create scales
  let yLinearScale = d3.scaleLinear()
    .domain([d3.min(trendData, d => d[switchY]) * 0.8,
      d3.max(trendData, d => d[switchY]) * 1.2])
    .range([height, 0]);
  return yLinearScale;
}

/////////////////////////////////////////////////////////////////////

// xAxis updating when clicking
let xAxes = (xScale2, xAxis) => {
  let bottomAxis = d3.axisBottom(xScale2);
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  return xAxis;
}

// yAxis updating when clicking
let yAxes = (yScale2, yAxis) => {
  let leftAxis = d3.axisLeft(yScale2);
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);
  return yAxis;
}

/////////////////////////////////////////////////////////////////////

// Adding circles and things
let addCircles = (circlesGroup, xScale2, yScale2,switchX,switchY) => {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => xScale2(d[switchX]))
    .attr("cy", d => yScale2(d[switchY]));

  return circlesGroup;
}

function addText(toolTipText, xScale2, yScale2,switchX,switchY) {

  toolTipText.transition()
    .duration(1000)
    .attr("x", d => xScale2(d[switchX]))
    .attr("y", d => yScale2(d[switchY]));
    

  return toolTipText;
}

/////////////////////////////////////////////////////////////////////
// Tooltip Hell
let updateToolTip = (switchX, switchY,circlesGroup) => {

  let toolTip = d3.tip()
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("border-radius", "8px")
    .style("background",'#FFDC5C')
    .style("padding", "4px")
    .offset([80, -60])
    .html(function(d) {
        return (`${d.Player}<br />${switchX}: ${d[switchX]}<br>${switchY}: ${d[switchY]} `);
    });
      
     
  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
    })
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });
  return circlesGroup;
}


function getChart(team) {
    if(document.getElementById('selSeason').value == "one") {
      d3.csv("../data/playertest.csv").then((data) => {
      chartGroup.html("")
      let teamData = data.filter(teamName => teamName.Team == team);
      let roster = teamData.filter(year => year.Season == "2016-17")
      let stats = roster.filter(stats => stats.Type == "Per Game")
        stats.forEach(function(d) {
          //X
          d.PTS = +d.PTS;
          d.TRB = +d.TRB;
          d.AST = +d.AST;
          //Y
          d.G = +d.G;
          d.Age = +d.Age;
          d.MP = +d.MP
          // Extra
          d.Player = d.Player
          d.Pos = d.Pos
      });
      console.log(stats);
  
      let xLinearScale = xScale(stats, switchX);
      let yLinearScale = yScale(stats, switchY);
  
      let bottomAxis = d3.axisBottom(xLinearScale);
      let leftAxis = d3.axisLeft(yLinearScale);
  
      // /////////////////////////////////////////////////////////////////////
  
      // Append X & Y Axis
      let xAxis = chartGroup.append("g")
          .classed("x-axis", true)
          .attr("transform", `translate(0, ${height})`)
          .call(bottomAxis);
  
      let yAxis = chartGroup.append("g")
          .classed("y-axis", true)
          // .attr("transform", `translate(0, ${height})`)
          .call(leftAxis);
  
      // /////////////////////////////////////////////////////////////////////
  
      // Append Circles and Things 2
      let circlesGroup = chartGroup.selectAll("circle")
      .data(stats)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[switchX]))
      .attr("cy", d => yLinearScale(d[switchY]))
      .attr("r", "18")
      .attr("opacity", "1.5")
      .attr("fill", function(d) {
        return ("url(#" + d.Player.toLowerCase().replace(/ |'/g,"-") +")")});
      let toolTipText = chartGroup.selectAll("text")
          // binding text to stupid circles
          .exit() // somehow this filled all the state abbreviations in the circles
          .data(stats)
          .enter()
          .append("text")
          .attr("x", d => xLinearScale(d[switchX]))
          .attr("y", d => yLinearScale(d[switchY]))
          .attr("font-size", "12px")
          .attr("text-anchor", "middle")
          .attr("fill", "black")
  
      circlesGroup = updateToolTip(switchX, switchY,circlesGroup); // Need this here because the tooltip won't show up upon initial rendering!!!
      
      // /////////////////////////////////////////////////////////////////////
      //     // Adding first circles
      let xlabelsGroup = chartGroup.append("g")
          .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
      let pointsLabel = xlabelsGroup.append("text")
          .attr("x", 0)
          .attr("y", 20)
          .attr("id","x-text")
          .attr("value", "PTS")
          .classed("active", true)
          .text("Points Per Game");
  
      let reboundsLabel = xlabelsGroup.append("text")
          .attr("x", 0)
          .attr("y", 40)
          .attr("id","x-text")
          .attr("value", "TRB") 
          .classed("inactive", true)
          .text("Rebounds Per Game");

      let assistsLabel = xlabelsGroup.append("text")
          .attr("x", 0)
          .attr("y", 60)
          .attr("id","x-text")
          .attr("value", "AST") 
          .classed("inactive", true)
          .text("Assists Per Game");
  
      // Y-Axis
      let ylabelsGroup = chartGroup.append("g");
      // .attr("transform", `translate(${width / 2}, ${height + 20})`);   
  
      let gamesLabel = ylabelsGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left)
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .attr("id", "y-text")
          .attr("value", "G")
          .classed("active", true)
          .text("Games Played");
  
      let ageLabel = ylabelsGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 20 - margin.left)
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .attr("id","y-text")
          .attr("value", "Age")
          .classed("inactive", true)
          .text("Player Age");
      let minutesLabel = ylabelsGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 40 - margin.left)
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .attr("id","y-text")
          .attr("value", "MP")
          .classed("inactive", true)
          .text("Minutes Per Game");
  
  // ////////////////////////////////////////////////////////////////// 
  // Events
      xlabelsGroup.selectAll("#x-text")
          .on("click", function() {
          let value = d3.select(this).attr("value");
          if (value !== switchX) {
  
              switchX = value;
  
              console.log(switchX)
  
  
              xLinearScale = xScale(stats, switchX);
              yLinearScale = yScale(stats, switchY);
  
  
              xAxis = xAxes(xLinearScale, xAxis);
  
    
              circlesGroup = addCircles(circlesGroup, xLinearScale,yLinearScale,switchX,switchY);
  
              toolTipText = addText(toolTipText, xLinearScale,yLinearScale,switchX,switchY);
  
              circlesGroup = updateToolTip(switchX, switchY,circlesGroup);
  
              if (switchX === "PTS") {
              pointsLabel
                  .classed("active", true)
                  .classed("inactive", false);
              reboundsLabel
                  .classed("active", false)
                  .classed("inactive", true);
              assistsLabel
                  .classed("active", false)
                  .classed("inactive", true);              
              } 
              else if (switchX === "TRB") {
              pointsLabel
                .classed("active", false)
                .classed("inactive", true);
              reboundsLabel
                .classed("active", true)
                .classed("inactive", false);
              assistsLabel
                .classed("active", false)
                .classed("inactive", true); 
              }
              else if (switchX === "AST") {
                pointsLabel
                  .classed("active", false)
                  .classed("inactive", true);
                reboundsLabel
                  .classed("active", false)
                  .classed("inactive", true);
                assistsLabel
                  .classed("active", true)
                  .classed("inactive", false); 
                }
    
          }
          });
  
  
      // Y Axis Events
      ylabelsGroup.selectAll("#y-text")
          .on("click", function() {
          let value = d3.select(this).attr("value");
          if (value !== switchY) {
  
          switchY = value;
  
          console.log(switchY)
  
  
          xLinearScale = xScale(stats, switchX);
  
          yLinearScale = yScale(stats, switchY);
  
          yAxis = yAxes(yLinearScale, yAxis);
  
  
          circlesGroup = addCircles(circlesGroup, xLinearScale,yLinearScale,switchX,switchY);
  
          toolTipText = addText(toolTipText, xLinearScale,yLinearScale,switchX,switchY);
  
          circlesGroup = updateToolTip(switchX, switchY,circlesGroup);
  
          
          if (switchY === "G") {
          gamesLabel
              .classed("active", true)
              .classed("inactive", false);
          ageLabel
              .classed("active", false)
              .classed("inactive", true);
          minutesLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (switchY ==="Age") {
          gamesLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          minutesLabel
            .classed("active", false)
            .classed("inactive", true);
          } 
          else if (switchY ==="MP") {
            gamesLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            minutesLabel
              .classed("active", true)
              .classed("inactive", false);
            } 
      }
      });
      });
}
if(document.getElementById('selSeason').value == "two") {
  d3.csv("../data/playertest.csv").then((data) => {
      chartGroup.html("")
      let teamData = data.filter(teamName => teamName.Team == team);
      let roster = teamData.filter(year => year.Season == "2017-18")
      let stats = roster.filter(stats => stats.Type == "Per Game")
        stats.forEach(function(d) {
          //X
          d.PTS = +d.PTS;
          d.TRB = +d.TRB;
          d.AST = +d.AST;
          //Y
          d.G = +d.G;
          d.Age = +d.Age;
          d.MP = +d.MP
          // Extra
          d.Player = d.Player
          d.Pos = d.Pos
      });
      //console.log(trendData);
  
      let xLinearScale = xScale(stats, switchX);
      let yLinearScale = yScale(stats, switchY);
  
      let bottomAxis = d3.axisBottom(xLinearScale);
      let leftAxis = d3.axisLeft(yLinearScale);
  
      // /////////////////////////////////////////////////////////////////////
  
      // Append X & Y Axis
      let xAxis = chartGroup.append("g")
          .classed("x-axis", true)
          .attr("transform", `translate(0, ${height})`)
          .call(bottomAxis);
  
      let yAxis = chartGroup.append("g")
          .classed("y-axis", true)
          // .attr("transform", `translate(0, ${height})`)
          .call(leftAxis);
  
      // /////////////////////////////////////////////////////////////////////
  
      // Append Circles and Things 2
      let circlesGroup = chartGroup.selectAll("circle")
      .data(stats)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[switchX]))
      .attr("cy", d => yLinearScale(d[switchY]))
      .attr("r", "18")
      .attr("opacity", "1.5")
      .attr("fill", function(d) {
        return ("url(#" + d.Player.toLowerCase().replace(/ |'/g,"-") +")")});
  
      let toolTipText = chartGroup.selectAll("text")
          // binding text to stupid circles
          .exit() // somehow this filled all the state abbreviations in the circles
          .data(stats)
          .enter()
          .append("text")
          .attr("x", d => xLinearScale(d[switchX]))
          .attr("y", d => yLinearScale(d[switchY]))
          .attr("font-size", "14px")
          .attr("text-anchor", "middle") // svg alignment (start, middle, end)
  
      circlesGroup = updateToolTip(switchX, switchY,circlesGroup); // Need this here because the tooltip won't show up upon initial rendering!!!
      
      // /////////////////////////////////////////////////////////////////////
      //     // Adding first circles
      let xlabelsGroup = chartGroup.append("g")
          .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
      let pointsLabel = xlabelsGroup.append("text")
          .attr("x", 0)
          .attr("y", 20)
          .attr("id","x-text")
          .attr("value", "PTS")
          .classed("active", true)
          .text("Points Per Game");
  
      let reboundsLabel = xlabelsGroup.append("text")
          .attr("x", 0)
          .attr("y", 40)
          .attr("id","x-text")
          .attr("value", "TRB") 
          .classed("inactive", true)
          .text("Rebounds Per Game");

      let assistsLabel = xlabelsGroup.append("text")
          .attr("x", 0)
          .attr("y", 60)
          .attr("id","x-text")
          .attr("value", "AST") 
          .classed("inactive", true)
          .text("Assists Per Game");
  
      // Y-Axis
      let ylabelsGroup = chartGroup.append("g");
      // .attr("transform", `translate(${width / 2}, ${height + 20})`);   
  
      let gamesLabel = ylabelsGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left)
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .attr("id", "y-text")
          .attr("value", "G")
          .classed("active", true)
          .text("Games Played");
  
      let ageLabel = ylabelsGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 20 - margin.left)
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .attr("id","y-text")
          .attr("value", "Age")
          .classed("inactive", true)
          .text("Player Age");
      let minutesLabel = ylabelsGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 40 - margin.left)
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .attr("id","y-text")
          .attr("value", "MP")
          .classed("inactive", true)
          .text("Minutes Per Game");
  
  // ////////////////////////////////////////////////////////////////// 
  // Events
      xlabelsGroup.selectAll("#x-text")
          .on("click", function() {
          let value = d3.select(this).attr("value");
          if (value !== switchX) {
  
              switchX = value;
  
              console.log(switchX)
  
  
              xLinearScale = xScale(stats, switchX);
              yLinearScale = yScale(stats, switchY);
  
  
              xAxis = xAxes(xLinearScale, xAxis);
  
    
              circlesGroup = addCircles(circlesGroup, xLinearScale,yLinearScale,switchX,switchY);
  
              toolTipText = addText(toolTipText, xLinearScale,yLinearScale,switchX,switchY);
  
              circlesGroup = updateToolTip(switchX, switchY,circlesGroup);
  
              if (switchX === "PTS") {
              pointsLabel
                  .classed("active", true)
                  .classed("inactive", false);
              reboundsLabel
                  .classed("active", false)
                  .classed("inactive", true);
              assistsLabel
                  .classed("active", false)
                  .classed("inactive", true);              
              } 
              else if (switchX === "TRB") {
              pointsLabel
                .classed("active", false)
                .classed("inactive", true);
              reboundsLabel
                .classed("active", true)
                .classed("inactive", false);
              assistsLabel
                .classed("active", false)
                .classed("inactive", true); 
              }
              else if (switchX === "AST") {
                pointsLabel
                  .classed("active", false)
                  .classed("inactive", true);
                reboundsLabel
                  .classed("active", false)
                  .classed("inactive", true);
                assistsLabel
                  .classed("active", true)
                  .classed("inactive", false); 
                }
    
          }
          });
  
  
      // Y Axis Events
      ylabelsGroup.selectAll("#y-text")
          .on("click", function() {
          let value = d3.select(this).attr("value");
          if (value !== switchY) {
  
          switchY = value;
  
          console.log(switchY)
  
  
          xLinearScale = xScale(stats, switchX);
  
          yLinearScale = yScale(stats, switchY);
  
          yAxis = yAxes(yLinearScale, yAxis);
  
  
          circlesGroup = addCircles(circlesGroup, xLinearScale,yLinearScale,switchX,switchY);
  
          toolTipText = addText(toolTipText, xLinearScale,yLinearScale,switchX,switchY);
  
          circlesGroup = updateToolTip(switchX, switchY,circlesGroup);
  
          
          if (switchY === "G") {
            gamesLabel
                .classed("active", true)
                .classed("inactive", false);
            ageLabel
                .classed("active", false)
                .classed("inactive", true);
            minutesLabel
                .classed("active", false)
                .classed("inactive", true);
            }
            else if (switchY ==="Age") {
            gamesLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
            minutesLabel
              .classed("active", false)
              .classed("inactive", true);
            } 
            else if (switchY ==="MP") {
              gamesLabel
                .classed("active", false)
                .classed("inactive", true);
              ageLabel
                .classed("active", false)
                .classed("inactive", true);
              minutesLabel
                .classed("active", true)
                .classed("inactive", false);
              } 
      }
      });
});
}
if(document.getElementById('selSeason').value == "three") {
  d3.csv("../data/playertest.csv").then((data) => {
      chartGroup.html("")
      let teamData = data.filter(teamName => teamName.Team == team);
      let roster = teamData.filter(year => year.Season == "2018-19")
      let stats = roster.filter(stats => stats.Type == "Per Game")
        stats.forEach(function(d) {
          //X
          d.PTS = +d.PTS;
          d.TRB = +d.TRB;
          d.AST = +d.AST;
          //Y
          d.G = +d.G;
          d.Age = +d.Age;
          d.MP = +d.MP;
          // Extra
          d.Player = d.Player
          d.Pos = d.Pos
      });
      //console.log(trendData);
  
      let xLinearScale = xScale(stats, switchX);
      let yLinearScale = yScale(stats, switchY);
  
      let bottomAxis = d3.axisBottom(xLinearScale);
      let leftAxis = d3.axisLeft(yLinearScale);
  
      // /////////////////////////////////////////////////////////////////////
  
      // Append X & Y Axis
      let xAxis = chartGroup.append("g")
          .classed("x-axis", true)
          .attr("transform", `translate(0, ${height})`)
          .call(bottomAxis);
  
      let yAxis = chartGroup.append("g")
          .classed("y-axis", true)
          // .attr("transform", `translate(0, ${height})`)
          .call(leftAxis);
  
      // /////////////////////////////////////////////////////////////////////
  
      // Append Circles and Things 2
      let circlesGroup = chartGroup.selectAll("circle")
      .data(stats)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[switchX]))
      .attr("cy", d => yLinearScale(d[switchY]))
      .attr("r", "18")
      .attr("opacity", "1.5")
      .attr("fill", function(d) {
        return ("url(#" + d.Player.toLowerCase().replace(/ |'/g,"-") +")")});
  
      let toolTipText = chartGroup.selectAll("text")
          // binding text to stupid circles
          .exit() // somehow this filled all the state abbreviations in the circles
          .data(stats)
          .enter()
          .append("text")
          .attr("x", d => xLinearScale(d[switchX]))
          .attr("y", d => yLinearScale(d[switchY]))
          .attr("font-size", "14px")
          .attr("text-anchor", "middle") // svg alignment (start, middle, end)
  
      circlesGroup = updateToolTip(switchX, switchY,circlesGroup); // Need this here because the tooltip won't show up upon initial rendering!!!
      
      // /////////////////////////////////////////////////////////////////////
      //     // Adding first circles
      let xlabelsGroup = chartGroup.append("g")
          .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
      let pointsLabel = xlabelsGroup.append("text")
          .attr("x", 0)
          .attr("y", 20)
          .attr("id","x-text")
          .attr("value", "PTS")
          .classed("active", true)
          .text("Points Per Game");
  
      let reboundsLabel = xlabelsGroup.append("text")
          .attr("x", 0)
          .attr("y", 40)
          .attr("id","x-text")
          .attr("value", "TRB") 
          .classed("inactive", true)
          .text("Rebounds Per Game");

      let assistsLabel = xlabelsGroup.append("text")
          .attr("x", 0)
          .attr("y", 60)
          .attr("id","x-text")
          .attr("value", "AST") 
          .classed("inactive", true)
          .text("Assists Per Game");
  
      // Y-Axis
      let ylabelsGroup = chartGroup.append("g");
      // .attr("transform", `translate(${width / 2}, ${height + 20})`);   
  
      let gamesLabel = ylabelsGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left)
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .attr("id", "y-text")
          .attr("value", "G")
          .classed("active", true)
          .text("Games Played");
  
      let ageLabel = ylabelsGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 20 - margin.left)
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .attr("id","y-text")
          .attr("value", "Age")
          .classed("inactive", true)
          .text("Player Age");
      let minutesLabel = ylabelsGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 40 - margin.left)
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .attr("id","y-text")
          .attr("value", "MP")
          .classed("inactive", true)
          .text("Minutes Per Game");
  
  // ////////////////////////////////////////////////////////////////// 
  // Events
      xlabelsGroup.selectAll("#x-text")
          .on("click", function() {
          let value = d3.select(this).attr("value");
          if (value !== switchX) {
  
              switchX = value;
  
              console.log(switchX)
  
  
              xLinearScale = xScale(stats, switchX);
              yLinearScale = yScale(stats, switchY);
  
  
              xAxis = xAxes(xLinearScale, xAxis);
  
    
              circlesGroup = addCircles(circlesGroup, xLinearScale,yLinearScale,switchX,switchY);
  
              toolTipText = addText(toolTipText, xLinearScale,yLinearScale,switchX,switchY);
  
              circlesGroup = updateToolTip(switchX, switchY,circlesGroup);
  
              if (switchX === "PTS") {
              pointsLabel
                  .classed("active", true)
                  .classed("inactive", false);
              reboundsLabel
                  .classed("active", false)
                  .classed("inactive", true);
              assistsLabel
                  .classed("active", false)
                  .classed("inactive", true);              
              } 
              else if (switchX === "TRB") {
              pointsLabel
                .classed("active", false)
                .classed("inactive", true);
              reboundsLabel
                .classed("active", true)
                .classed("inactive", false);
              assistsLabel
                .classed("active", false)
                .classed("inactive", true); 
              }
              else if (switchX === "AST") {
                pointsLabel
                  .classed("active", false)
                  .classed("inactive", true);
                reboundsLabel
                  .classed("active", false)
                  .classed("inactive", true);
                assistsLabel
                  .classed("active", true)
                  .classed("inactive", false); 
                }
    
          }
          });
  
  
      // Y Axis Events
      ylabelsGroup.selectAll("#y-text")
          .on("click", function() {
          let value = d3.select(this).attr("value");
          if (value !== switchY) {
  
          switchY = value;
  
          console.log(switchY)
  
  
          xLinearScale = xScale(stats, switchX);
  
          yLinearScale = yScale(stats, switchY);
  
          yAxis = yAxes(yLinearScale, yAxis);
  
  
          circlesGroup = addCircles(circlesGroup, xLinearScale,yLinearScale,switchX,switchY);
  
          toolTipText = addText(toolTipText, xLinearScale,yLinearScale,switchX,switchY);
  
          circlesGroup = updateToolTip(switchX, switchY,circlesGroup);
  
          
          if (switchY === "G") {
            gamesLabel
                .classed("active", true)
                .classed("inactive", false);
            ageLabel
                .classed("active", false)
                .classed("inactive", true);
            minutesLabel
                .classed("active", false)
                .classed("inactive", true);
            }
            else if (switchY ==="Age") {
            gamesLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
            minutesLabel
              .classed("active", false)
              .classed("inactive", true);
            } 
            else if (switchY ==="MP") {
              gamesLabel
                .classed("active", false)
                .classed("inactive", true);
              ageLabel
                .classed("active", false)
                .classed("inactive", true);
              minutesLabel
                .classed("active", true)
                .classed("inactive", false);
              } 
      }
      });
});
}
}
function getDemographic(team) {
    if(document.getElementById('selSeason').value == "one") {
        d3.csv("../data/goodblurb.csv").then((data) => {
            let blurb = data.filter(teamblurb => teamblurb.Team == team)
            let profile= d3.select("#team-profile");
            profile.html("");
            Object.entries(blurb).forEach((key) => {   
                    profile.append("h5").text((key[1].CleanedBlurb) + "\n");  
                });
        });
        }
        d3.csv("../data/team_logos.csv").then((data) => {
            let logo = data.filter(teamLogo => teamLogo.Team == team)
            let svg = d3.select("svg")
            svg.html("")
            Object.entries(logo).forEach((key) => {  
            let svg = d3.select("svg")
            console.log(key[1].Logos)
            svg.append('image')
                .attr("xlink:href", `${key[1].Logos}`)
                .attr("x", 150)
                .attr("y",0);
            });
        });
    if(document.getElementById('selSeason').value == "two") {
        d3.csv("../data/goodblurb2018.csv").then((data) => {
            let blurb = data.filter(teamblurb => teamblurb.Team == team)
            console.log(blurb)
            let profile= d3.select("#team-profile");
            profile.html("");
            Object.entries(blurb).forEach((key) => {   
                    profile.append("h5").text((key[1].CleanedBlurb) + "\n");  
                    console.log(key[1])  
                });
        });
        d3.csv("../data/team_logos.csv").then((data) => {
            let logo = data.filter(teamLogo => teamLogo.Team == team)
            let svg = d3.select("svg")
            svg.html("")
            Object.entries(logo).forEach((key) => {  
            let svg = d3.select("svg")
            console.log(key[1].Logos)
            svg.append('image')
                .attr("xlink:href", `${key[1].Logos}`)
                .attr("x", 150)
                .attr("y",0);
            });
        });
        }
        
    if(document.getElementById('selSeason').value == "three") {
    d3.csv("../data/cleaned2019blurb.csv").then((data) => {
        let blurb = data.filter(teamblurb => teamblurb.Team == team)
        console.log(blurb)
        let profile= d3.select("#team-profile");
        profile.html("");
        Object.entries(blurb).forEach((key) => {   
                profile.append("h5").text((key[1].CleanedBlurb) + "\n");  
                console.log(key[1])  
            });
    });
    d3.csv("../data/team_logos.csv").then((data) => {
        let logo = data.filter(teamLogo => teamLogo.Team == team)
        let svg = d3.select("svg")
        svg.html("")
        Object.entries(logo).forEach((key) => {  
        let svg = d3.select("svg")
        console.log(key[1].Logos)
        svg.append('image')
            .attr("xlink:href", `${key[1].Logos}`)
            .attr("x", 150)
            .attr("y",0);
        });
    });
    }
}
function dropdownOption(season) {
    getSeason(season)
}
function optionChanged(team) {
    getChart(team);
    getDemographic(team);
}

function getSeason() {
    if(document.getElementById('selSeason').value == "placeholder") {
        let tbody = d3.select("tbody")
        tbody.html("")
        d3.select("#selDataset").html("")
        let profile= d3.select("#team-profile");
        profile.html("");
        let svg = d3.select("svg")
        svg.html("")
    }
    if(document.getElementById('selSeason').value == "one") {
        d3.json("data/teamsupdated.json").then((data)=> {
            let first = data.filter(year => year.Season == "2016-2017")
            console.log(first)
            let firstteams = first.map(function(obj) {
                return {
                    Team: obj.Team,
                }
            }); 
            d3.select("#selDataset").html("")
            d3.select("#selDataset").append("option").text("Choose Team").attr("value");
            firstteams.forEach(function(name) {
                d3.select("#selDataset").append("option").text(name.Team).attr("value");
            });
            let tbody = d3.select("tbody")
            tbody.html("")
            $('table').DataTable().destroy();
            d3.csv("../data/2016standings.csv").then(function(teamStandings) {
                console.log(teamStandings);
                let table = $('table').DataTable({
                    data: teamStandings,
                    "retrieve": true,
                    "pageResize": true,
                    "responsive":true,
                    "paging": false,
                    "columns": [
                      {data: 'Team'},
                      {data: 'W'},
                      {data: 'L'},
                      {data: 'W/L%'},
                      {data: 'PA/G'},
                      {data: 'SRS'},
                      {data: 'Season'},
                      {data: 'Conference'}
                    ]
                })

            })
            getDemographic(data.name);
            getChart(data.name);
        });
    }
    if(document.getElementById('selSeason').value == "two") {
        d3.json("data/teamsupdated.json").then((data)=> {
            let second = data.filter(year => year.Season == "2017-2018")
            console.log(second)
            let secondteams = second.map(function(obj) {
                return {
                    Team: obj.Team,
                }
            }); 
            d3.select("#selDataset").html("")
            d3.select("#selDataset").append("option").text("Choose Team").attr("value");
            secondteams.forEach(function(name) {
                d3.select("#selDataset").append("option").text(name.Team).attr("value");
            });
            let tbody = d3.select("tbody")
            tbody.html("")
            $('table').DataTable().destroy();
            d3.csv("../data/2017standings.csv").then(function(secondteamStandings) {
                console.log(secondteamStandings);
                let table = $('table').DataTable({
                    data: secondteamStandings,
                    "retrieve": true,
                    "pageResize": true,
                    responsive:true,
                    paging: false,
                    "columns": [
                      {data: 'Team'},
                      {data: 'W'},
                      {data: 'L'},
                      {data: 'W/L%'},
                      {data: 'PA/G'},
                      {data: 'SRS'},
                      {data: 'Season'},
                      {data: 'Conference'}
                    ]
                })
            })         
        getDemographic(data.name);
        getChart(data.name);
        });
    }
    if(document.getElementById('selSeason').value == "three") {
        d3.json("data/teamsupdated.json").then((data)=> {
            let third = data.filter(year => year.Season == "2018-2019")
            console.log(third)
            let thirdteams = third.map(function(obj) {
                return {
                    Team: obj.Team,
                }
            }); 
            d3.select("#selDataset").html("")
            d3.select("#selDataset").append("option").text("Choose Team").attr("value");
            thirdteams.forEach(function(name) {
                d3.select("#selDataset").append("option").text(name.Team).attr("value");
            });
            let tbody = d3.select("tbody")
            tbody.html("")
            $('table').DataTable().destroy();
            d3.csv("../data/2018standings.csv").then(function(thirdteamStandings) {
                console.log(thirdteamStandings);
                let table = $('table').DataTable({
                    data: thirdteamStandings,
                    retrieve: true,
                    "pageResize": true,
                    responsive:true,
                    paging: false,
                    "columns": [
                      {data: 'Team'},
                      {data: 'W'},
                      {data: 'L'},
                      {data: 'W/L%'},
                      {data: 'PA/G'},
                      {data: 'SRS'},
                      {data: 'Season'},
                      {data: 'Conference'}
                    ]
                })
            })         
        getDemographic(data.name);
        getChart(data.name);
        });
    }
}