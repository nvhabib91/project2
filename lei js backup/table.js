d3.json("datasets/players.json").then(function(playerData) {
  console.log(playerData);
  
  let table = $('#data-table').DataTable({
      // scrollX: true // if this is on, the dropdown menu disappears
      data: playerData,
      // "pageResize": true,
      // responsive:true,
      "paging": "false",
      "columns": [
        {data: 'Player'},
        {data: 'Pos'},
        {data: 'Age'},
        {data: 'Tm'},
        {data: 'G'},
        {data: 'GS'},
        {data: 'MP'},
        {data: 'FG'},
        {data: 'FGA'},
        {data: 'FG%'},
        {data: '3P'},
        {data: '3PA'},
        {data: '3P%'},
        {data: '2P'},
        {data: '2PA'},
        {data: '2P%'},
        // {data: 'eFG%'},
        {data: 'FT'},
        {data: 'FTA'},
        {data: 'FT%'},
        {data: 'ORB'},        
        {data: 'DRB'},
        {data: 'TRB'},
        {data: 'AST'},
        {data: 'STL'},
        {data: 'BLK'},
        {data: 'TOV'},
        {data: 'PF'},
        {data: 'PTS'},
        {data: 'Season'},
        {data: 'Type'}


      ]
      

    });
  // }) 
  $("#foot tr").each(function(i) {
    var select = $('<select id=""><option value=""></option></select>')
        .appendTo($(this).empty())
        .on('change', function() {
            table.column(-2)
                .search($(this).val())
                .draw();
        });

    table.column(-2).data().unique().sort().each(function (d,j) {
        select.append('<option value="'+d+'">'+d+'</option>')

  });
});


  // $(document).ready(function() {
  //   });
  })
