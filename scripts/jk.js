/**
 * JK - Responsive Admin Theme
 *
 */

$(document).ready(function () {
    //home
    //ladder_duels
    //ladder_race
    //download

    if(option=="home"){
        home();
    }else if(option=="ladder_player"){
        
    }
    else if(option=="ladder_duel"){
        ladder_duel_title();
        ladder_duel_rank();
        ladder_duel_list();
        ladder_duel_count();
    }else if(option=="ladder_race"){
        ladder_race_title();
        ladder_race_rank();
        ladder_race_list();
        ladder_race_count();
    }else if(option=="maps"){
        maps();
    }else{

    }


    // Handle minimalize left menu
    $('.left-nav-toggle a').on('click', function(event){
        event.preventDefault();
        $("body").toggleClass("nav-toggle");
    });




    // Hide all open sub nav menu list
    $('.nav-second').on('show.bs.collapse', function () {
        $('.nav-second.in').collapse('hide');
    })

    // Handle panel toggle
    $('.panel-toggle').on('click', function(event){
        event.preventDefault();
        var hpanel = $(event.target).closest('div.panel');
        var icon = $(event.target).closest('i');
        var body = hpanel.find('div.panel-body');
        var footer = hpanel.find('div.panel-footer');
        body.slideToggle(300);
        footer.slideToggle(200);

        // Toggle icon from up to down
        icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
        hpanel.toggleClass('').toggleClass('panel-collapse');
        setTimeout(function () {
            hpanel.resize();
            hpanel.find('[id^=map-]').resize();
        }, 50);
    });

    // Handle panel close
    $('.panel-close').on('click', function(event){
        event.preventDefault();
        var hpanel = $(event.target).closest('div.panel');
        hpanel.remove();
    });

});

//////////////////////////////////////////////////////////////////////////
//////////////////////////////////HOME////////////////////////////////////
//////////////////////////////////HOME////////////////////////////////////
//////////////////////////////////HOME////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

function home(){
    var p1 = '<h1>Welcome to jaPRO Mod!</h1><p>It is a mod started by loda from modbase put together by raz0r and other jacoders with the security fixes. There are alot of features and new ideas taken from popular mods.</p>';
    var p2 = '<h4>What does jaPRO do for me?</h4><p>A better sabering environment from base, ranking system, lag compensation either using guns or force, tweaking current weapons for different effects, non abusive admin commands from JA+, voting system, 2 admin levels fullAdmin or junior. From FFA, TFFA and CTF gamemodes there are lots of things to toggle to get the server with no force or with force how you want to run it. Better client smoothing when you have the client installed in the japro directory.</p>';
    var p3 = '<h4>Why should I even bother using jaPRO?</h4><p>Those who maybe looking for another option other than running JA+ or any other mod which is old and can be crashed, DoS attacked or exploited.</p>';
    var p4 = '<p><a class="btn btn-default btn-lg" href="https://github.com/videoP/jaPRO/raw/master/japro3.pk3" role="button">Download jaPRO Client</a></p>';
    $("#main-content").html('<div class="container">'+p1+' <br> '+p2+' '+p3+' '+p4+'</div>');
    $('.jk-nav li').removeClass("active");
    $('#menu_home').addClass("active");
}

//////////////////////////////////////////////////////////////////////////
/////////////////////////////////DUELS////////////////////////////////////
/////////////////////////////////DUELS////////////////////////////////////
/////////////////////////////////DUELS////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

function ladder_duel_title(){
    var HTML;
    HTML='<div class="row">';
    HTML+='            <div class="col-lg-12">';
    HTML+='                <div class="view-header">';
    HTML+='                    <div class="pull-right text-right" style="line-height: 14px">';
    HTML+='                        <small>Stats<br><span class="c-white">Duels</span></small>';
    HTML+='                    </div>';
    HTML+='                    <div class="header-icon">';
    HTML+='                        <i class="pe page-header-icon pe-7s-shield"></i>';
    HTML+='                    </div>';
    HTML+='                    <div class="header-title">';
    HTML+='                        <h3>Duels</h3>';
    HTML+='                        <small>';
    HTML+='                            Select the types of duels you want to see.';
    HTML+='                        </small>';
    HTML+='                    </div>';
    HTML+='                </div>';
    HTML+='                <hr>';
    HTML+='            </div>';
    HTML+='        </div>';
    $("#main-content").append(HTML);
}

function ladder_duel_rank(){

    var panel;
    panel = '<div id="first_row" class="row">';
    panel += '  <div class="col-md-12">';
    panel += '      <div class="panel panel-filled">';
    panel += '          <div class="panel-heading">';
    panel += '              Saber Rank List';
    panel += '          </div>';
    panel += '          <div class="panel-body">';
    panel += '              <p>This is the saber rank list, ordered by ELO.</p>';
    panel += '              <div class="table-responsive">';
    panel += '                  <table id="datatable_ladder_duel_rank" class="table table-striped table-hover"></table>';
    panel += '              </div>';
    panel += '          </div>';
    panel += '      </div>';
    panel += '  </div>';
    panel += '</div>';

    $("#main-content").append(panel);

    var item = "ladder_duel_rank";
    var content = "";
    var header = "";
    var url = "ajax/getJSON.php";
    $.ajax({
        type: "POST",
        url: url,
        dataType: "JSON",
        async: false,
        data: { option: item},
        success: function(res) {
            header = "<thead>";
            header += "<tr>";
                header += "<th>Position</th>";
                header += "<th>Player</th>";
                header += "<th>Type</th>";
                header += "<th>Elo</th>";
                header += "<th data-hide='phone,tablet' title='Relative strength of opponent.  A lower value means this person is dueling relatively weak opponents'>TS</th>";
                header += "<th>Count</th>";
            header += "</tr>";
            header += "</thead>";

            header += "<tfoot>";
            header += "<tr>";
                header += "<th>Position</th>";
                header += "<th>Player</th>";
                header += "<th>Type</th>";
                header += "<th>Elo</th>";
                header += "<th data-hide='phone,tablet' title='Relative strength of opponent.  A lower value means this person is dueling relatively weak opponents'>TS</th>";
                header += "<th>Count</th>";
            header += "</tr>";
            header += "</tfoot>";

            content = "<tbody>";
            if(res){
                $.each( res, function( key, value ) {
                    content += "<tr class='table'>";
                        content += "<td>"+value.position+"</td>";
                        content += "<td>"+value.username+"</td>";
                        content += "<td>"+value.type+"</td>"; //loda fixme - td id=value.type   ? Then sort on that in the dropdown?
                        content += "<td>"+value.rank+"</td>";
                        content += "<td>"+value.TS+"</td>";
                        content += "<td>"+value.count+"</td>";
                    content += "</tr>";
                });
            }
            content += "</tbody>";
            $("#datatable_ladder_duel_rank").html(header+content);
        }
    });

    $('#datatable_ladder_duel_rank').DataTable({

        "responsive": true,
        "bInfo" : false,
        "bPaginate": true,
        "bLengthChange": false,
        "bFilter": true, //This breaks the dropdown if we change it to remove searchbox? or use "searching"
        "order": [[ 3, "desc" ]],
        "columnDefs": [
            {
                "targets": [ 1 ],
                "visible": false,
                "searchable": true
            },
            {
                "targets": [ 2 ],
                "visible": false,
                "searchable": true
            }
        ],
        "fnDrawCallback": function ( oSettings ) {
        /* Need to redo the counters if filtered or sorted */
            if ( oSettings.bSorted || oSettings.bFiltered )
            {
                for ( var i=0, iLen=oSettings.aiDisplay.length ; i<iLen ; i++ )
                {
                    $('td:eq(0)', oSettings.aoData[ oSettings.aiDisplay[i] ].nTr ).html( i+1 );
                }
            }
        },
        "aoColumnDefs": [
            { "bSortable": false, "aTargets": [ 0 ] }
        ],
        "aaSorting": [[ 1, 'asc' ]],

        initComplete: function () {

            this.api().columns([1, 2]).every( function () {
                var column = this;
                var select = $('<select class="filter form-control input-sm"><option value="">Show all</option></select>')
                    .appendTo( $(column.footer()).empty() )
                    .on( 'change', function () {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );
 
                        column
                            .search( val ? '^'+val+'$' : '', true, false )
                            .draw();
                    } );
 
                column.data().unique().sort().each( function ( d, j ) {
                    select.append( '<option value="'+d+'">'+d+'</option>' )
                } );
            } );
        }
    });
}

function ladder_duel_list(){
    
    var panel;
    panel = '<div id="second_row" class="row">';
    panel += '  <div class="col-md-12">';
    panel += '      <div class="panel panel-filled">';
    panel += '          <div class="panel-heading">';
    panel += '              Recent duels';
    panel += '          </div>';
    panel += '          <div class="panel-body">';
    panel += '              <p>Here you can see the registri of all saber duels in japro server.</p>';
    panel += '              <div class="table-responsive">';
    panel += '                  <table id="datatable_ladder_duel_list" class="table table-striped table-hover"></table>';
    panel += '              </div>';
    panel += '          </div>';
    panel += '      </div>';
    panel += '  </div>';
    panel += '</div>';

    $("#main-content").append(panel);

    var item = "ladder_duel_list";
    var content = "";
    var header = "";
    var url = "ajax/getJSON.php";
    $.ajax({
        type: "POST",
        url: url,
        dataType: "JSON",
        async: false,
        data: { option: item},
        success: function(res) {
            header = "<thead>";
            header += "<tr>";
                header += "<th>Winner</th>";
                header += "<th>Loser</th>";
                header += "<th>Type</th>";
                header += "<th data-hide='phone,tablet'>Winner HP</th>";
                header += "<th data-hide='phone,tablet'>Winner Shield</th>";
                header += "<th data-hide='phone,tablet'>Duration</th>";
                header += "<th>Date</th>";
            header += "</tr>";
            header += "</thead>";
            header += "<tfoot>";
            header += "<tr>";
                header += "<th>Winner</th>";
                header += "<th>Loser</th>";
                header += "<th>Type</th>";
                header += "<th data-hide='phone,tablet'>Winner HP</th>";
                header += "<th data-hide='phone,tablet'>Winner Shield</th>";
                header += "<th data-hide='phone,tablet'>Duration</th>";
                header += "<th>Date</th>";
            header += "</tr>";
            header += "</tfoot>";
            content = "<tbody>";
            $.each( res, function( key, value ) {
                content += "<tr class='table'>";
                    content += "<td>"+value.winner+"</td>";
                    content += "<td>"+value.loser+"</td>";
                    content += "<td>"+value.type+"</td>";
                    content += "<td>"+value.winner_hp+"</td>";
                    content += "<td>"+value.winner_shield+"</td>";
                    content += "<td>"+value.duration+"</td>";
                    content += "<td>"+value.end_time+"</td>";
                content += "</tr>";
            });
            content += "</tbody>";
            $("#datatable_ladder_duel_list").html(header+content);
        }
    });

    $('#datatable_ladder_duel_list').DataTable({
        "responsive": true,
        "order": [[ 6, "desc" ]],

 //This functionality should be on the player page i guess
        initComplete: function () {

            this.api().columns([0, 1, 2]).every( function () {
                var column = this;
                var select = $('<select class="filter form-control input-sm"><option value="">Show all</option></select>')
                    .appendTo( $(column.footer()).empty() )
                    .on( 'change', function () {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );
 
                        column
                            .search( val ? '^'+val+'$' : '', true, false )
                            .draw();
                    } );
 
                column.data().unique().sort().each( function ( d, j ) {
                    select.append( '<option value="'+d+'">'+d+'</option>' )
                } );
            } );
        }
    });
}

function ladder_duel_count(){
    var panel = "";
    panel += '<div id="third_row" class="row">';
    panel += '  <div class="col-md-6">';
    panel += '                    <div class="panel panel-filled">';
    panel += '                      <div class="panel-heading">';
    panel += '                          Saber Duel Count';
    panel += '                      </div>';
    panel += '                        <div class="panel-body">';
    panel += '                            <p>Most active duelers.</p>';
    panel += '                            <div id="chart_duel_count">';
    panel += '                            </div>';
    panel += '                        </div>';
    panel += '                    </div>';
    panel += '                </div>';
    panel += '            </div>';
    $("#main-content").append(panel);

    var data = null;
    var item = "ladder_duel_count";
    var url = "ajax/getJSON.php";
    $.ajax({
        type: "POST",
        url: url,
        dataType: "JSON",
        async: false,
        data: { option: item},
        success: function(res) {
            data = res;
        }
    });

    //Loda fixme, this can use the json from datatable_ladder_duel_rank maybe and avoid a query?

    var chart;
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'chart_duel_count',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: null,
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        color: '#000000',
                        connectorColor: '#000000'
                    }
                }
            },
            series: [{
                type: 'pie',
                name: 'Duel count',
                data: data
            }]
        });

    $('.jk-nav li').removeClass("active");
    $('#menu_saber').addClass("active");
}

/////////////////////////////////////////////////////////////////////
///////////////////////////////RACE//////////////////////////////////
///////////////////////////////RACE//////////////////////////////////
///////////////////////////////RACE//////////////////////////////////
/////////////////////////////////////////////////////////////////////


function ladder_race_title(){
    var HTML;
    HTML='<div class="row">';
    HTML+='            <div class="col-lg-12">';
    HTML+='                <div class="view-header">';
    HTML+='                    <div class="pull-right text-right" style="line-height: 14px">';
    HTML+='                        <small>Stats<br><span class="c-white">Race</span></small>';
    HTML+='                    </div>';
    HTML+='                    <div class="header-icon">';
    HTML+='                        <i class="pe page-header-icon pe-7s-shield"></i>';
    HTML+='                    </div>';
    HTML+='                    <div class="header-title">';
    HTML+='                        <h3>Race</h3>';
    HTML+='                        <small>';
    HTML+='                            Now you can see your race stats.';
    HTML+='                        </small>';
    HTML+='                    </div>';
    HTML+='                </div>';
    HTML+='                <hr>';
    HTML+='            </div>';
    HTML+='        </div>';
    $("#main-content").append(HTML);
}

function ladder_race_rank(){

    var panel;
    panel = '<div id="first_row" class="row">';
    panel += '  <div class="col-md-12">';
    panel += '      <div class="panel panel-filled">';
    panel += '          <div class="panel-heading">';
    panel += '              Race Rank List';
    panel += '          </div>';
    panel += '          <div class="panel-body">';
    panel += '              <p>This is the race rank list, ordered by score.</p>';
    panel += '              <div class="table-responsive">';
    panel += '                  <table id="datatable_ladder_race_rank" class="table table-striped table-hover"></table>';
    panel += '              </div>';
    panel += '          </div>';
    panel += '      </div>';
    panel += '  </div>';
    panel += '</div>';

    $("#main-content").append(panel);

    var item = "ladder_race_rank";
    var content = "";
    var header = "";
    var url = "ajax/getJSON.php";
    $.ajax({
        type: "POST",
        url: url,
        dataType: "JSON",
        async: false,
        data: { option: item},
        success: function(res) {
            header = "<thead>";
            header += "<tr>";
                header += "<th>Position</th>";
                header += "<th>Player</th>";
                
                header += "<th>Style</th>";
                header += "<th>Score</th>";
                header += "<th>Average Score</th>";
                
                header += "<th>Average Percentile</th>";
                
                header += "<th>Average Rank</th>";
                header += "<th>Golds</th>";

                header += "<th>Silvers</th>";
                header += "<th>Bronzes</th>";
                header += "<th>Count</th>";
                
            header += "</tr>";
            header += "</thead>";

            header += "<tfoot>";
            header += "<tr>";
                header += "<th>Position</th>";
                header += "<th>Player</th>";
                
                header += "<th>Style</th>";
                header += "<th>Score</th>";
                header += "<th>Average Score</th>";
                
                header += "<th>Average Percentile</th>";
                
                header += "<th>Average Rank</th>";
                header += "<th>Golds</th>";

                header += "<th>Silvers</th>";
                header += "<th>Bronzes</th>";
                header += "<th>Count</th>";
                
            header += "</tr>";
            header += "</tfoot>";

            content = "<tbody>";
            if(res){
                $.each( res, function( key, value ) {
                    content += "<tr class='table'>";
                        content += "<td></td>"; //Whats this?
                        content += "<td>"+value.username+"</td>";
                        
                        content += "<td>"+value.style+"</td>"; //We dont want this to show up in the table but we need to access it for the dropdown filter..
                        content += "<td>"+value.score+"</td>";
                        
                        content += "<td>"+value.avg_score+"</td>";
                        content += "<td>"+value.avg_percentile+"</td>";
                        
                        content += "<td>"+value.avg_rank+"</td>";
                        content += "<td>"+value.golds+"</td>";
                        
                        content += "<td>"+value.silvers+"</td>";
                        content += "<td>"+value.bronzes+"</td>";
                        content += "<td>"+value.count+"</td>";
                        
                    content += "</tr>";
                });
            }
            content += "</tbody>";
            $("#datatable_ladder_race_rank").html(header+content);
        }
    });

    $('#datatable_ladder_race_rank').DataTable({

        "responsive": true,
        "bInfo" : false,
        "bPaginate": true,
        "bLengthChange": false,
        "bFilter": true, //This breaks the dropdown if we change it to remove searchbox? or use "searching"
        "order": [[ 3, "desc" ]],
        "columnDefs": [
            {
                "targets": [ 1 ],
                "visible": false,
                "searchable": true
            },
            {
                "targets": [ 2 ],
                "visible": false,
                "searchable": true
            }
        ],
        "fnDrawCallback": function ( oSettings ) {
        /* Need to redo the counters if filtered or sorted */
            if ( oSettings.bSorted || oSettings.bFiltered )
            {
                for ( var i=0, iLen=oSettings.aiDisplay.length ; i<iLen ; i++ )
                {
                    $('td:eq(0)', oSettings.aoData[ oSettings.aiDisplay[i] ].nTr ).html( i+1 );
                }
            }
        },
        "aoColumnDefs": [
            { "bSortable": false, "aTargets": [ 0 ] }
        ],
        "aaSorting": [[ 1, 'asc' ]],

            initComplete: function () {
                this.api().columns([1, 2]).every( function () {
                    var column = this;
                    var select = $('<select class="filter form-control input-sm"><option value="">Show all</option></select>')
                        .appendTo( $(column.footer()).empty() )
                        .on( 'change', function () {
                            var val = $.fn.dataTable.util.escapeRegex(
                                $(this).val()
                            );
     
                            column
                                .search( val ? '^'+val+'$' : '', true, false )
                                .draw();
                        } );
     
                    column.data().unique().sort().each( function ( d, j ) {
                        select.append( '<option value="'+d+'">'+d+'</option>' )
                    } );
                } );
            }


    });
}

function ladder_race_list(){

    var panel;
    panel = '<div id="second_row" class="row">';
    panel += '  <div class="col-md-12">';
    panel += '      <div class="panel panel-filled">';
    panel += '          <div class="panel-heading">';
    panel += '              Race List';
    panel += '          </div>';
    panel += '          <div class="panel-body">';
    panel += '              <p>This is the race list, ordered by date.</p>';
    panel += '              <div class="table-responsive">';
    panel += '                  <table id="datatable_ladder_race_list" class="table table-striped table-hover"></table>';
    panel += '              </div>';
    panel += '          </div>';
    panel += '      </div>';
    panel += '  </div>';
    panel += '</div>';
    $("#main-content").append(panel);

    var item = "ladder_race_list";
    var content = "";
    var header = "";
    var url = "ajax/getJSON.php";
    $.ajax({
        type: "POST",
        url: url,
        dataType: "JSON",
        async: false,
        data: { option: item},

    success: function(res) {
            header = "<thead>";
            header += "<tr>";
                header += "<th>Rank</th>";
                header += "<th>Username</th>";
                header += "<th>Coursename</th>";
                header += "<th>Style</th>";
                header += "<th data-hide='phone,tablet'>Topspeed</th>";
                header += "<th data-hide='phone,tablet'>Average</th>";
                header += "<th>Date</th>";
                header += "<th>Time</th>";
            header += "</tr>";
            header += "</thead>";

            header += "<tfoot>";
            header += "<tr>";
                header += "<th>Rank</th>";
                header += "<th>Username</th>";
                header += "<th>Coursename</th>";
                header += "<th>Style</th>";
                header += "<th data-hide='phone,tablet'>Topspeed</th>";
                header += "<th data-hide='phone,tablet'>Average</th>";
                header += "<th>Date</th>";
                header += "<th>Time</th>";
            header += "</tr>";
            header += "</tfoot>";

            content = "<tbody>";
            if(res){
                $.each( res, function( key, value ) { //This is what takes forever


                    content += "<tr class='table'>";
                        content += "<td>"+value.position+"</td>";
                        content += "<td>"+value.username+"</td>";
                        content += "<td>"+value.coursename+"</td>";
                        content += "<td>"+value.style+"</td>";
                        content += "<td>"+value.topspeed+"</td>";
                        content += "<td>"+value.average+"</td>";
                        content += "<td>"+value.end_time+"</td>";
                        content += "<td align='right'>"+value.duration_ms+"</td>"; //Align right
                    content += "</tr>";


                });
            }
            content += "</tbody>";
            $("#datatable_ladder_race_list").html(header+content);
        }

    });

    $('#datatable_ladder_race_list').DataTable({
        "dom": "<'row'<'col-sm-6'l><'col-sm-6'f>>t<'row'<'col-sm-6'i><'col-sm-6'p>>",
        "responsive": true,
        "order": [[ 6, "desc" ]], //Order by end_time on first load to show recent times
        //"searching": false, //Or bfilter=false ?, why does this break the dropdown functionality

        initComplete: function () {
            
            this.api().columns([1, 2, 3]).every( function () {
                var column = this;
                var select = $('<select class="filter form-control input-sm"><option value="">Show all</option></select>')
                    .appendTo( $(column.footer()).empty() )
                    .on( 'change', function () {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );
 
                        column
                            .search( val ? '^'+val+'$' : '', true, false )
                            .draw();
                    } );
 
                column.data().unique().sort().each( function ( d, j ) {
                    select.append( '<option value="'+d+'">'+d+'</option>' )
                } );
            } );

        }


    });


    $('#selectTriggerMap').find('select').trigger('change');
    $('#selectTriggerStyle').find('select').trigger('change');

    $('.jk-nav li').removeClass("active");
    $('#menu_race').addClass("active");
   
}

function ladder_race_count(){
    var panel = "";
    panel += '<div id="third_row" class="row">';
    panel += '  <div class="col-md-6">';
    panel += '                    <div class="panel panel-filled">';
    panel += '                      <div class="panel-heading">';
    panel += '                          Race Count';
    panel += '                      </div>';
    panel += '                        <div class="panel-body">';
    panel += '                            <p>Most active racers.</p>';
    panel += '                            <div id="chart_race_count">';
    panel += '                            </div>';
    panel += '                        </div>';
    panel += '                    </div>';
    panel += '                </div>';
    panel += '            </div>';
    $("#main-content #second_row").append(panel);

    var data = null;
    var item = "ladder_race_count";
    var url = "ajax/getJSON.php";
    $.ajax({
        type: "POST",
        url: url,
        dataType: "JSON",
        async: false,
        data: { option: item},
        success: function(res) {
            data = res;
        }
    });

    //Loda fixme, this can use the json from datatable_ladder_duel_rank maybe and avoid a query?
    var chart;
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'chart_race_count',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: null,
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        color: '#000000',
                        connectorColor: '#000000'
                    }
                }
            },
            series: [{
                type: 'pie',
                name: 'Race count',
                data: data
            }]
        });

    $('.jk-nav li').removeClass("active");
    $('#menu_race').addClass("active");
}

function maps(){
        HTML='<div class="row">';
        HTML+='<div class="col-md-4">';
        HTML+='  <h2>The Academy v2</h2>';
        HTML+='  <p>A map recomended for duels</p>';
        HTML+='  <p><a class="btn btn-default" href="maps/the_academy_v2.pk3" role="button">Download</a></p>';
        HTML+='</div>';
        HTML+='<div class="col-md-4">';
        HTML+='  <h2>Race Pack 1</h2>';
        HTML+='  <p>Map for race </p>';
        HTML+='  <p><a class="btn btn-default" href="maps/mapRacepack1.pk3" role="button">Download</a></p>';
        HTML+='</div>';
        HTML+='<div class="col-md-4">';
        HTML+='  <h2>Race Pack 2</h2>';
        HTML+='  <p>Map for race </p>';
        HTML+='  <p><a class="btn btn-default" href="maps/mapRacepack2.pk3" role="button">Download</a></p>';
        HTML+='</div>';
        HTML+='<div class="col-md-4">';
        HTML+='  <h2>Race Pack 3</h2>';
        HTML+='  <p>Map for race </p>';
        HTML+='  <p><a class="btn btn-default" href="maps/mapRacepack3.pk3" role="button">Download</a></p>';
        HTML+='</div>';
        HTML+='<div class="col-md-4">';
        HTML+='  <h2>Race Pack 4</h2>';
        HTML+='  <p>Map for race </p>';
        HTML+='  <p><a class="btn btn-default" href="maps/mapRacepack4.pk3" role="button">Download</a></p>';
        HTML+='</div>';
        HTML+='<div class="col-md-4">';
        HTML+='  <h2>Race Arena</h2>';
        HTML+='  <p>Map for race </p>';
        HTML+='  <p><a class="btn btn-default" href="maps/mapRaceArena.pk3" role="button">Download</a></p>';
        HTML+='</div>';
        HTML+='<div class="col-md-4">';
        HTML+='  <h2>Tritoch Pack</h2>';
        HTML+='  <p>Map for race </p>';
        HTML+='  <p><a class="btn btn-default" href="maps/mapTritoch_pack.pk3" role="button">Download</a></p>';
        HTML+='</div>';
        HTML+='<div class="col-md-4">';
        HTML+='  <h2>JK2 MP Maps</h2>';
        HTML+='  <p>JK Multiplayer map pack </p>';
        HTML+='  <p><a class="btn btn-default" href="maps/mapJK2MultiplayerMaps.pk3" role="button">Download</a></p>';
        HTML+='</div>';
        HTML+='</div>';
        $("#main-content").html(HTML);

        $('.jk-nav li').removeClass("active");
        $('#menu_maps').addClass("active");
}

function DuelToString(type) {
  typeStr = "Unknown";
  if (type == 0)
    typeStr = "Saber";
  else if (type == 1)
    typeStr =  "Force";
  else if (type == 4)
    typeStr =  "Melee";
  else if (type == 6)
    typeStr =  "Pistol";
  else if (type == 7)
    typeStr =  "Blaster";
  else if (type == 8)
    typeStr =  "Sniper";
  else if (type == 9)
    typeStr =  "Bowcaster";
  else if (type == 10)
    typeStr =  "Repeater";
  else if (type == 11)
    typeStr =  "Demp2";
  else if (type == 12)
    typeStr =  "Flechette";
  else if (type == 13)
    typeStr =  "Rocket";
  else if (type == 14)
    typeStr =  "Thermal";
  else if (type == 15)
    typeStr =  "Trip mine";
  else if (type == 16)
    typeStr =  "Det pack";
  else if (type == 17)
    typeStr =  "Concussion";
  else if (type == 18)
    typeStr =  "Bryar pistol";
  else if (type == 19)
    typeStr =  "Stun baton";
  else if (type == 20)
    typeStr =  "All weapons";
  return typeStr;
}

function RaceToString(val){
    style="Unknown";
    if (val==0)
        style="0-SIEGE";
    else if(val==1)
        style="1-JKA";
    else if(val==2)
        style="2-QW";
    else if(val==3)
        style="3-CPM";
    else if(val==4)
        style="4-Q3";
    else if(val==5)
        style="5-PJK";
    else if(val==6)
        style="6-WSW";
    else if(val==7)
        style="7-RJQ3";
    else if(val==8)
        style="8-RJCPM";
    else if(val==9)
        style="9-SWOOP";
    else if(val==10)
        style="10-JETPACK";
    else if(val==11)
        style="11-SPEED";
    else if(val==12)
        style="12-SP";
    return style;
}