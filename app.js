// let svgWidth = 960;
// let svgHeight = 500;
// let margin = {
//   top: 20,
//   right: 40,
//   bottom: 80,
//   left: 100
// };

// let width = svgWidth - margin.left - margin.right;
// let height = svgHeight - margin.top - margin.bottom;
// // Create an SVG wrapper, append an SVG group that will hold our chart,
// // and shift the latter by left and top margins.
// let svg = d3
//   .select(".chart")
//   .append("svg")
//   .attr("width", svgWidth)
//   .attr("height", svgHeight);
// // Append an SVG group
// let chartGroup = svg.append("g")
//   .attr("transform", `translate(${margin.left}, ${margin.top})`);
// // Initial Params
// let chosenXAxis = "G";
// // function used for updating x-scale let upon click on axis label
// function xScale(playerData, chosenXAxis) {
//   // create scales
//   let xLinearScale = d3.scaleLinear()
//     .domain([d3.min(playerData, d => d[chosenXAxis]),
//       d3.max(playerData, d => d[chosenXAxis])
//     ])
//     .range([0, width]);
//   return xLinearScale;
// }
// // function used for updating xAxis let upon click on axis label
// function renderAxes(newXScale, xAxis) {
//   let bottomAxis = d3.axisBottom(newXScale);
//   xAxis.transition()
//     .duration(1000)
//     .call(bottomAxis);
//   return xAxis;
// }
// // function used for updating circles group with a transition to
// // new circles
// function renderCircles(circlesGroup, newXScale, chosenXAxis) {
//   circlesGroup.transition()
//     .duration(1000)
//     .attr("cx", d => newXScale(d[chosenXAxis]));
//   return circlesGroup;
// }
// // function used for updating circles group with new tooltip
// function updateToolTip(chosenXAxis, circlesGroup) {
//   let label;
//   if (chosenXAxis === "G") {
//     label = "Games Played:";
//   }
//   else if (chosenXAxis === "Age") {
//     label = "Age";
//   }

//   else {
//     label = "Player Efficiency Rating"
//   }

//   let toolTip = d3.tip()
//     .attr("class", "tooltip")
//     .offset([80, -60])
//     .html(function(d) {
//       return (`Player Name: ${d.Player} <br>Minutes Played: ${d.MP}<br>${label} ${d[chosenXAxis]}`);
//     });
//   circlesGroup.call(toolTip);
//   circlesGroup.on("mouseover", function(data) {
//     toolTip.show(data);
//   })
//     // onmouseout event
//     .on("mouseout", function(data, index) {
//       toolTip.hide(data);
//     });
//   return circlesGroup;
// }
// Retrieve data from the CSV file and execute everything below


function getData(file_name="2016-17") {
  file_name = "/data/advanced_stats_" + file_name + ".csv";
  d3.select("#chart").html("");

let svgWidth = 1000;
let svgHeight = 700;
let margin = {
  top: 50,
  right: 10,
  bottom: 250,
  left: 100
};

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;
// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
let svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
// Append an SVG group
let chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
// Initial Params
let chosenXAxis = "Age";
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
  if (chosenXAxis === "Age") {
    label = "Age:";
  }
  else if (chosenXAxis === "G") {
    label = "Games Played:";
  }

  else if (chosenXAxis === "BLK%") {
    label = "Block Percentage:";
  }

  else if (chosenXAxis === "STL%") {
    label = "Steal Percentage:";
  }

  else if (chosenXAxis === "AST%") {
    label = "Assist Percentage:";
  }

  else if (chosenXAxis === "PER"){
    label = "Player Efficiency Rating"
  }

  let toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`Player Name: ${d.Player} <br>Team: ${d.Tm} <br>Minutes Played: ${d.MP}<br>${label} ${d[chosenXAxis]}`);
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
  console.log(file_name);
  d3.csv(file_name).then(function(playerData, err) {

    console.log(playerData);
    playerData.forEach(d => console.log(d["Player"]));

    if (err) throw err;
    // parse data
    playerData.forEach(function(data) {
      data.MP = +data.MP;
      data.G = +data.G;
      data.Age = +data.Age;
      data.PER = +data.PER
      data["BLK%"] = +data["BLK%"]
      data["STL%"] = +data["STL%"]
      data["AST%"] = +data["AST%"]
    });
    // xLinearScale function above csv import
    let xLinearScale = xScale(playerData, chosenXAxis);
    // Create y scale function
    let yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(playerData, d => d.MP)])
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
      .attr("cy", d => yLinearScale(d.MP))
      .attr("r", 5)
      .attr("fill", "blue")
      .attr("opacity", ".5");
    // Create group for  2 x- axis labels
    let labelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 30})`);
    let ageLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 10)
      .attr("value", "Age") // value to grab for event listener
      .classed("active", true)
      .text("Age");
    let gpLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 35)
      .attr("value", "G") // value to grab for event listener
      .classed("inactive", true)
      .text("Games Played");
    let stlLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "STL%") // value to grab for event listener
      .classed("inactive", true)
      .text("Steal Percentage");
    let astLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 85)
      .attr("value", "AST%") // value to grab for event listener
      .classed("inactive", true)
      .text("Assist Percentage");
    let blkLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 110)
      .attr("value", "BLK%") // value to grab for event listener
      .classed("inactive", true)
      .text("Block Percentage");
    let perLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 135)
      .attr("value", "PER") // value to grab for event listener
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
          if (chosenXAxis === "PER") {
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            gLabel
              .classed("active", false)
              .classed("inactive", true);
            blkLabel
              .classed("active", false)
              .classed("inactive", true);
            stlLabel
              .classed("active", false)
              .classed("inactive", true);
            astLabel
              .classed("active", false)
              .classed("inactive", true);
            perLabel
              .classed("active", true)
              .classed("inactive", false);
          }
          else if (chosenXAxis === "G") {
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            gLabel
              .classed("active", true)
              .classed("inactive", false);
            blkLabel
              .classed("active", false)
              .classed("inactive", true);
            stlLabel
              .classed("active", false)
              .classed("inactive", true);
            astLabel
              .classed("active", false)
              .classed("inactive", true);
            perLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenXAxis === "BLK%") {
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            gLabel
              .classed("active", false)
              .classed("inactive", true);
            blkLabel
              .classed("active", true)
              .classed("inactive", false);
            stlLabel
              .classed("active", false)
              .classed("inactive", true);
            astLabel
              .classed("active", false)
              .classed("inactive", true);
            perLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenXAxis === "STL%") {
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            gLabel
              .classed("active", false)
              .classed("inactive", true);
            blkLabel
              .classed("active", false)
              .classed("inactive", true);
            stlLabel
              .classed("active", true)
              .classed("inactive", false);
            astLabel
              .classed("active", false)
              .classed("inactive", true);
            perLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenXAxis === "AST%") {
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            gLabel
              .classed("active", false)
              .classed("inactive", true);
            blkLabel
              .classed("active", false)
              .classed("inactive", true);
            stlLabel
              .classed("active", false)
              .classed("inactive", true);
            astLabel
              .classed("active", true)
              .classed("inactive", false);
            perLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else {
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
            gLabel
              .classed("active", false)
              .classed("inactive", true);
            blkLabel
              .classed("active", false)
              .classed("inactive", true);
            stlLabel
              .classed("active", false)
              .classed("inactive", true);
            astLabel
              .classed("active", false)
              .classed("inactive", true);
            perLabel
              .classed("active", false)
              .classed("inactive", true);
          }
      }
  
        });
        
  }).catch(function(error) {
    console.log(error);
  });
//   if(document.getElementById('season').value =="2016-17") {
    
//     // d3.csv("advanced_stats_2016-17.csv").then(function(playerData, err) {
//     d3.csv(file_name).then(function(playerData, err) {

//     console.log(playerData)
//     if (err) throw err;
//     // parse data
//     playerData.forEach(function(data) {
//       data.MP = +data.MP;
//       data.G = +data.G;
//       data.Age = +data.Age;
//       data.PER = +data.PER
//     });
//     // xLinearScale function above csv import
//     let xLinearScale = xScale(playerData, chosenXAxis);
//     // Create y scale function
//     let yLinearScale = d3.scaleLinear()
//       .domain([0, d3.max(playerData, d => d.MP)])
//       .range([height, 0]);
//     // Create initial axis functions
//     let bottomAxis = d3.axisBottom(xLinearScale);
//     let leftAxis = d3.axisLeft(yLinearScale);
//     // append x axis
//     let xAxis = chartGroup.append("g")
//       .classed("x-axis", true)
//       .attr("transform", `translate(0, ${height})`)
//       .call(bottomAxis);
//     // append y axis
//     chartGroup.append("g")
//       .call(leftAxis);
//     // append initial circles
//     let circlesGroup = chartGroup.selectAll("circle")
//       .data(playerData)
//       .enter()
//       .append("circle")
//       .attr("cx", d => xLinearScale(d[chosenXAxis]))
//       .attr("cy", d => yLinearScale(d.MP))
//       .attr("r", 5)
//       .attr("fill", "blue")
//       .attr("opacity", ".5");
//     // Create group for  2 x- axis labels
//     let labelsGroup = chartGroup.append("g")
//       .attr("transform", `translate(${width / 2}, ${height + 20})`);
//     let gpLabel = labelsGroup.append("text")
//       .attr("x", 0)
//       .attr("y", 20)
//       .attr("value", "G") // value to grab for event listener
//       .classed("active", true)
//       .text("Games Played");
//     let ageLabel = labelsGroup.append("text")
//       .attr("x", 0)
//       .attr("y", 40)
//       .attr("value", "Age") // value to grab for event listener
//       .classed("inactive", true)
//       .text("Age");
//     let perLabel = labelsGroup.append("text")
//       .attr("x", 0)
//       .attr("y", 60)
//       .attr("value", "PER") // value to grab for event listener
//       .classed("inactive", true)
//       .text("Player Efficiency Rating");
//     // append y axis
//     chartGroup.append("text")
//       .attr("transform", "rotate(-90)")
//       .attr("y", 0 - margin.left)
//       .attr("x", 0 - (height / 2))
//       .attr("dy", "1em")
//       .classed("axis-text", true)
//       .text("Minutes Played");
//     // updateToolTip function above csv import
//     circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
//     // x axis labels event listener
//     labelsGroup.selectAll("text")
//       .on("click", function() {
//         // get value of selection
//         let value = d3.select(this).attr("value");
//         if (value !== chosenXAxis) {
//           // replaces chosenXAxis with value
//           chosenXAxis = value;
//           console.log(chosenXAxis)
//           // functions here found above csv import
//           // updates x scale for new data
//           xLinearScale = xScale(playerData, chosenXAxis);
//           // updates x axis with transition
//           xAxis = renderAxes(xLinearScale, xAxis);
//           // updates circles with new x values
//           circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
//           // updates tooltips with new info
//           circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
//           // changes classes to change bold text
//           if (chosenXAxis === "G") {
//             gpLabel
//               .classed("active", true)
//               .classed("inactive", false);
//             ageLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             perLabel
//               .classed("active", false)
//               .classed("inactive", true);
//           }
//           else if (chosenXAxis === "Age"){
//             gpLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             ageLabel
//               .classed("active", true)
//               .classed("inactive", false);
//             perLabel
//               .classed("active", false)
//               .classed("inactive", true);
//           }
//           else {
//             gpLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             ageLabel
//               .classed("active", false)
//               .classed("inactive", true);
//             perLabel
//               .classed("active", true)
//               .classed("inactive", false);
//         }
//       }
  
//         });
        
//   }).catch(function(error) {
//     console.log(error);
//   });
// }
// else if(document.getElementById('season').value =="2017-18") {
    
//   d3.csv("advanced_stats_2017-18.csv").then(function(playerData, err) {
//   console.log(playerData)
//   if (err) throw err;
//   // parse data
//   chartGroup.html("")

//   playerData.forEach(function(data) {
//     data.MP = +data.MP;
//     data.G = +data.G;
//     data.Age = +data.Age;
//     data.PER = +data.PER
//   });
//   // xLinearScale function above csv import
//   let xLinearScale = xScale(playerData, chosenXAxis);
//   // Create y scale function
//   let yLinearScale = d3.scaleLinear()
//     .domain([0, d3.max(playerData, d => d.MP)])
//     .range([height, 0]);
//   // Create initial axis functions
//   let bottomAxis = d3.axisBottom(xLinearScale);
//   let leftAxis = d3.axisLeft(yLinearScale);
//   // append x axis
//   let xAxis = chartGroup.append("g")
//     .classed("x-axis", true)
//     .attr("transform", `translate(0, ${height})`)
//     .call(bottomAxis);
//   // append y axis
//   chartGroup.append("g")
//     .call(leftAxis);
//   // append initial circles
//   let circlesGroup = chartGroup.selectAll("circle")
//     .data(playerData)
//     .enter()
//     .append("circle")
//     .attr("cx", d => xLinearScale(d[chosenXAxis]))
//     .attr("cy", d => yLinearScale(d.MP))
//     .attr("r", 5)
//     .attr("fill", "blue")
//     .attr("opacity", ".5");
//   // Create group for  2 x- axis labels
//   let labelsGroup = chartGroup.append("g")
//     .attr("transform", `translate(${width / 2}, ${height + 20})`);
//   let gpLabel = labelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 20)
//     .attr("value", "G") // value to grab for event listener
//     .classed("active", true)
//     .text("Games Played");
//   let ageLabel = labelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 40)
//     .attr("value", "Age") // value to grab for event listener
//     .classed("inactive", true)
//     .text("Age");
//   let perLabel = labelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 60)
//     .attr("value", "PER") // value to grab for event listener
//     .classed("inactive", true)
//     .text("Player Efficiency Rating");
//   // append y axis
//   chartGroup.append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("y", 0 - margin.left)
//     .attr("x", 0 - (height / 2))
//     .attr("dy", "1em")
//     .classed("axis-text", true)
//     .text("Minutes Played");
//   // updateToolTip function above csv import
//   circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
//   // x axis labels event listener
//   labelsGroup.selectAll("text")
//     .on("click", function() {
//       // get value of selection
//       let value = d3.select(this).attr("value");
//       if (value !== chosenXAxis) {
//         // replaces chosenXAxis with value
//         chosenXAxis = value;
//         console.log(chosenXAxis)
//         // functions here found above csv import
//         // updates x scale for new data
//         xLinearScale = xScale(playerData, chosenXAxis);
//         // updates x axis with transition
//         xAxis = renderAxes(xLinearScale, xAxis);
//         // updates circles with new x values
//         circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
//         // updates tooltips with new info
//         circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
//         // changes classes to change bold text
//         if (chosenXAxis === "G") {
//           gpLabel
//             .classed("active", true)
//             .classed("inactive", false);
//           ageLabel
//             .classed("active", false)
//             .classed("inactive", true);
//           perLabel
//             .classed("active", false)
//             .classed("inactive", true);
//         }
//         else if (chosenXAxis === "Age"){
//           gpLabel
//             .classed("active", false)
//             .classed("inactive", true);
//           ageLabel
//             .classed("active", true)
//             .classed("inactive", false);
//           perLabel
//             .classed("active", false)
//             .classed("inactive", true);
//         }
//         else {
//           gpLabel
//             .classed("active", false)
//             .classed("inactive", true);
//           ageLabel
//             .classed("active", false)
//             .classed("inactive", true);
//           perLabel
//             .classed("active", true)
//             .classed("inactive", false);
      
//       }
//     }
//       });
      
// }).catch(function(error) {
//   console.log(error);
// });
// }
// else {
    
//   d3.csv("advanced_stats_2018-19.csv").then(function(playerData, err) {
//   console.log(playerData)
//   if (err) throw err;
//   // parse data
//   chartGroup.html("")

//   playerData.forEach(function(data) {
//     data.MP = +data.MP;
//     data.G = +data.G;
//     data.Age = +data.Age;
//     data.PER = +data.PER
//   });
//   // xLinearScale function above csv import
//   let xLinearScale = xScale(playerData, chosenXAxis);
//   // Create y scale function
//   let yLinearScale = d3.scaleLinear()
//     .domain([0, d3.max(playerData, d => d.MP)])
//     .range([height, 0]);
//   // Create initial axis functions
//   let bottomAxis = d3.axisBottom(xLinearScale);
//   let leftAxis = d3.axisLeft(yLinearScale);
//   // append x axis
//   let xAxis = chartGroup.append("g")
//     .classed("x-axis", true)
//     .attr("transform", `translate(0, ${height})`)
//     .call(bottomAxis);
//   // append y axis
//   chartGroup.append("g")
//     .call(leftAxis);
//   // append initial circles
//   let circlesGroup = chartGroup.selectAll("circle")
//     .data(playerData)
//     .enter()
//     .append("circle")
//     .attr("cx", d => xLinearScale(d[chosenXAxis]))
//     .attr("cy", d => yLinearScale(d.MP))
//     .attr("r", 5)
//     .attr("fill", "blue")
//     .attr("opacity", ".5");
//   // Create group for  2 x- axis labels
//   let labelsGroup = chartGroup.append("g")
//     .attr("transform", `translate(${width / 2}, ${height + 20})`);
//   let gpLabel = labelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 20)
//     .attr("value", "G") // value to grab for event listener
//     .classed("active", true)
//     .text("Games Played");
//   let ageLabel = labelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 40)
//     .attr("value", "Age") // value to grab for event listener
//     .classed("inactive", true)
//     .text("Age");
//   let perLabel = labelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 60)
//     .attr("value", "PER") // value to grab for event listener
//     .classed("inactive", true)
//     .text("Player Efficiency Rating");
//   // append y axis
//   chartGroup.append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("y", 0 - margin.left)
//     .attr("x", 0 - (height / 2))
//     .attr("dy", "1em")
//     .classed("axis-text", true)
//     .text("Minutes Played");
//   // updateToolTip function above csv import
//   circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
//   // x axis labels event listener
//   labelsGroup.selectAll("text")
//     .on("click", function() {
//       // get value of selection
//       let value = d3.select(this).attr("value");
//       if (value !== chosenXAxis) {
//         // replaces chosenXAxis with value
//         chosenXAxis = value;
//         console.log(chosenXAxis)
//         // functions here found above csv import
//         // updates x scale for new data
//         xLinearScale = xScale(playerData, chosenXAxis);
//         // updates x axis with transition
//         xAxis = renderAxes(xLinearScale, xAxis);
//         // updates circles with new x values
//         circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
//         // updates tooltips with new info
//         circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
//         // changes classes to change bold text
//         if (chosenXAxis === "G") {
//           gpLabel
//             .classed("active", true)
//             .classed("inactive", false);
//           ageLabel
//             .classed("active", false)
//             .classed("inactive", true);
//           perLabel
//             .classed("active", false)
//             .classed("inactive", true);
//         }
//         else if (chosenXAxis === "Age"){
//           gpLabel
//             .classed("active", false)
//             .classed("inactive", true);
//           ageLabel
//             .classed("active", true)
//             .classed("inactive", false);
//           perLabel
//             .classed("active", false)
//             .classed("inactive", true);
//         }
//         else {
//           gpLabel
//             .classed("active", false)
//             .classed("inactive", true);
//           ageLabel
//             .classed("active", false)
//             .classed("inactive", true);
//           perLabel
//             .classed("active", true)
//             .classed("inactive", false);
      
//       }
//     }
//       });
      
// }).catch(function(error) {
//   console.log(error);
// });
// }
};
function dropdownOption(season) {
  getData(season)
  }
getData();