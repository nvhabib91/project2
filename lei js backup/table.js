function dropdown() {
  if (document.getElementById("dropdown").value == "2016-2017") {
    $('#data-table').dataTable().fnDestroy();
    $('#data-table tbody').empty();
    d3.csv("Output_csvs/2016-17.csv").then(function(playerData) {
      console.log(playerData);
      columnGenerate(playerData);
    })

  } else if (document.getElementById("dropdown").value == "2017-2018") {
    $('#data-table').dataTable().fnDestroy(); // used this one to destroy the table
    $('#data-table tbody').empty();
    d3.csv("Output_csvs/2017-18.csv").then(function(playerData) {
      console.log(playerData);
      columnGenerate(playerData);
    })

  } else {
    if (document.getElementById("dropdown").value == "2018-2019") {
      $('#data-table').dataTable().fnDestroy();
      $('#data-table tbody').empty();
      d3.csv("Output_csvs/2018-19.csv").then(function(playerData) {
        console.log(playerData);
        columnGenerate(playerData);
      })
    }}

    // Inner function to generate the columns 
  function columnGenerate(playerData) {
    $('#data-table').DataTable({
      // scrollX: true // if this is on, the dropdown menu disappears
      data: playerData,
      "columns": [
        { data: 'Player' },
        { data: 'Pos' },
        { data: 'Age' },
        { data: 'Tm' },
        { data: 'G' },
        { data: 'GS' },
        { data: 'MP' },
        { data: 'FG' },
        { data: 'FGA' },
        { data: 'FG%' },
        { data: '3P' },
        { data: '3PA' },
        { data: '3P%' },
        { data: '2P' },
        { data: '2PA' },
        { data: '2P%' },
        // {data: 'eFG%'},
        { data: 'FT' },
        { data: 'FTA' },
        { data: 'FT%' },
        { data: 'ORB' },
        { data: 'DRB' },
        { data: 'TRB' },
        { data: 'AST' },
        { data: 'STL' },
        { data: 'BLK' },
        { data: 'TOV' },
        { data: 'PF' },
        { data: 'PTS' },
      ],
      "dom": 'Bfrtip',
      // "buttons": [
      //   "colvis"
      // ],
      buttons: [ {
        extend: 'colvis',
        // columnText: function ( dt, idx, title ) {
        //     return (idx+1)+': '+title;
        // }
        text: "Extend Columns"
    }],
      "columnDefs": [
        { "targets": [4, 5, 7, 8, 10, 11, 13, 14, 16, 17, 18, 19, 20, 21, 25, 26], "visible": false }
      ]
    });
  }
}
  // this was the old way to generate the dropdown, ended up rewriting the entire thing
// }

  // }) // Do not enable this or else the drop down will be affected
  // $("#foot tr").each(function(i) {
  //   var select = $('<select id=""><option value=""></option></select>')
  //       .appendTo($(this).empty())
  //       .on('change', function() {
  //           table.column(-2)
  //               .search($(this).val())
  //               .draw();
  //       });

  //   table.column(-2).data().unique().sort().each(function (d,j) {
  //       select.append('<option value="'+d+'">'+d+'</option>')

  // });
// });


  // $(document).ready(function() {
  //   });
function x(season) {
  dropdown(season)
}

dropdown();