let svgWidth = 960;

let svgHeight = 500;

let margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

let width = svgWidth - margin.left - margin.right;

let height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
let svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
let chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("player_advanced_2018_cleaned.csv").then(function(pa2018) {
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    pa2018.forEach(data => {
      data.age = +data.age;
      data.games_played = +data.games_played;
      data.minutes_played = +data.minutes_played;
      data.player_efficiency_rating = +data.player_efficiency_rating;
      data.true_shooting_percentage = +data.true_shooting_percentage;
      data.three_point_attempt_rate = +data.three_point_attempt_rate;
      data.free_throw_attempt_rate = +data.free_throw_attempt_rate;
      data.offensive_rebound_percentage = +data.offensive_rebound_percentage;
      data.defensive_rebound_percentage = +data.defensive_rebound_percentage;
      data.total_rebound_percentage = +data.total_rebound_percentage;
      data.assist_percentage = +data.assist_percentage;
      data.steal_percentage = +data.steal_percentage;
      data.block_percentage = +data.block_percentage;
      data.turnover_percentage = +data.turnover_percentage;
      data.usage_percentage = +data.usage_percentage;
      data.offensive_win_shares = +data.offensive_win_shares;
      data.defensive_win_shares = +data.defensive_win_shares;
      data.win_shares = +data.win_shares;
      data.win_shares_per_48_minutes = +data.win_shares_per_48_minutes;
      data.offensive_box_plus_minus = +data.offensive_box_plus_minus;
      data.defensive_box_plus_minus = +data.defensive_box_plus_minus;
      data.box_plus_minus = +data.box_plus_minus;
      data.value_over_replacement_player = +data.value_over_replacement_player;
    });

    // Step 2: Create scale functions
    // ==============================
    let xScale = d3.scaleBand()
      .domain(pa2018.map(data => data.name))
      .range([0, width]);
    let yScale = d3.scaleLinear()
      .domain([0, d3.max(pa2018, data => data.minutes_played)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    let xAxis = d3.axisBottom(xScale);
    let yAxis = d3.axisLeft(yScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);
    chartGroup.append('g')
      .call(yAxis);

    // Step 5: Create Circles
    // ==============================
    chartGroup.selectAll('.bar')
    .data(pa2018)
    .enter()
    .append('rect')
    .classed('bar', true)
    .attr('x', data => xScale(data.name))
    .attr('y', data => yScale(data.minutes_played))
    .attr('width', xScale.bandwidth())
    .attr('height', data => height - yScale(data.minutes_played));
}).catch(error => console.log(error)); 

    // Step 6: Initialize tool tip
    // ==============================
    let toolTip = d3.tip()
      .attr('class', 'tooltip')
      .offset([80, -60])
      .html(function(data){
        return `${data.name}<br />Minutes Played: ${data.minutes_played}`;
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    chartGroup.on('click', function(data){
      toolTip.show(data, this);
    })
      .on('mouseout', function(data){
        toolTip.hide(data);
      });
    // Create axes labels

