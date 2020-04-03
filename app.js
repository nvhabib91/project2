let svgWidth = 960;
let svgHeight = 500;
let margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
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
// Append an SVG group
let chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
// Initial Params
let chosenXAxis = "games_played";
// function used for updating x-scale let upon click on axis label
function xScale(playerData, chosenXAxis) {
  // create scales
  let xLinearScale = d3.scaleLinear()
    .domain([d3.min(playerData, d => d[chosenXAxis]),
      d3.max(playerData, d => d[chosenXAxis])
    ])
    .range([0, width]);
  return xLinearScale;
}
// function used for updating xAxis let upon click on axis label
function renderAxes(newXScale, xAxis) {
  let bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  return xAxis;
}
// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));
  return circlesGroup;
}
// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {
  let label;
  if (chosenXAxis === "games_played") {
    label = "Games Played:";
  }
  else if (chosenXAxis === "age") {
    label = "Age";
  }

  else {
    label = "Player Efficiency Rating"
  }

  let toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`Player Name: ${d.name} <br>Minutes Played: ${d.minutes_played}<br>${label} ${d[chosenXAxis]}`);
    });
  circlesGroup.call(toolTip);
  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });
  return circlesGroup;
}
// Retrieve data from the CSV file and execute everything below
d3.csv("player_advanced_2018_cleaned.csv").then(function(playerData, err) {
  console.log(playerData)
  if (err) throw err;
  // parse data
  playerData.forEach(function(data) {
    data.minutes_played = +data.minutes_played;
    data.games_played = +data.games_played;
    data.age = +data.age;
    data.player_efficiency_rating = +data.player_efficiency_rating
  });
  // xLinearScale function above csv import
  let xLinearScale = xScale(playerData, chosenXAxis);
  // Create y scale function
  let yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(playerData, d => d.minutes_played)])
    .range([height, 0]);
  // Create initial axis functions
  let bottomAxis = d3.axisBottom(xLinearScale);
  let leftAxis = d3.axisLeft(yLinearScale);
  // append x axis
  let xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  // append y axis
  chartGroup.append("g")
    .call(leftAxis);
  // append initial circles
  let circlesGroup = chartGroup.selectAll("circle")
    .data(playerData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.minutes_played))
    .attr("r", 5)
    .attr("fill", "blue")
    .attr("opacity", ".5");
  // Create group for  2 x- axis labels
  let labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);
  let gamesPlayedLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "games_played") // value to grab for event listener
    .classed("active", true)
    .text("Games Played");
  let ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age");
  let playerefficiencyratingLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "player_efficiency_rating") // value to grab for event listener
    .classed("inactive", true)
    .text("Player Efficiency Rating");
  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Minutes Played");
  // updateToolTip function above csv import
  circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      let value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {
        // replaces chosenXAxis with value
        chosenXAxis = value;
        console.log(chosenXAxis)
        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(playerData, chosenXAxis);
        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);
        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
        // changes classes to change bold text
        if (chosenXAxis === "games_played") {
          gamesPlayedLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          playerefficiencyratingLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "age"){
          gamesPlayedLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          playerefficiencyratingLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          gamesPlayedLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          playerefficiencyratingLabel
            .classed("active", true)
            .classed("inactive", false);
      }
    }
      });
}).catch(function(error) {
  console.log(error);
});