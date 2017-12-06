/**
 * JK - Responsive Admin Theme
 *
 */


$(document).ready(function () {
    if(page=="home"){
        home();
    }else if(page=="player"){
        player_title();//Show total number of players, get each playername for dropdown select
        if (player) { //Player selected, show specific stats
            player_header(); //Shows avatar and has buttons to switch between race and duel
            player_overall_stats(); //Combined stats for all duel types, all race styles, etc.

            if (race) {//==1
                if (0)//(player_race_style) //Ditch this maybe?
                    player_race_style_stats();//Ditch this maybe?
                else
                    player_race_stats();//Do we have to get literally everything for this since we have to compare it to other players to get percentile?
            }
            else {
                if (0)//(player_duel_type)//Ditch this maybe?
                    player_duel_type_stats();//Ditch this maybe?
                else
                    player_duel_stats();
            }

        }
        else { //No one selected, show global stats
            //This should be stuff that isnt viewable in other places, and relevant to the players page...
            //Total # of races is viewable on race page
            //Most popular styles is viewable on race page
            //I guess it could be course based?

            player_map_charts(); //Most popular courses, most exclusive course-styles
            player_duel_charts(); // ?? what should this display
        }
        
        //Global info for players, or should this be in a header shown on every page?
            //Number of accounts
            //number of total races
            //number of total duels
            //number of courses/maps

        //Select player dropdown?

        //Avatar of player

        //Some type of pie or horizontal bar graph (like github language stat graph) that shows a breakdown of their race styles https://jsfiddle.net/fyww2t4n/
        //do we want this to be their most dueled types or their highest score types ? And should it be relative to playerbase average? we already have the race/duels page for absolute stats..

        //This is their relative strenght of each style..? Normalize it?  Or... Change MAX to AVG maybe..?
        //SELECT x.style, x.score/y.max_score FROM (SELECT style, score from RaceRanks WHERE username="source") as x, (SELECT style, MAX(score) AS max_score FROM RaceRanks GROUP BY style) as y WHERE x.style = y.style
        //Do this, then divide each diff by max(diff) in js.  For duels, it will be a lot simpler since average is always 1k ?
        //SELECT x.style, x.score/y.avg_score AS diff FROM (SELECT style, score from RaceRanks WHERE username="source") as x, (SELECT style, AVG(score) AS avg_score FROM RaceRanks GROUP BY style) as y WHERE x.style = y.style

        //or SELECT style, percentilesum FROM RaceRanks WHERE username = "source"
        
            //SELECT style, count FROM RaceRanks WHERE username = ? ORDER BY count DESC
        //Same type of graph but for a breakdown of their duel styles.. 
            //SELECT type, count FROM DuelRanks WHERE username = ? ORDER BY count DESC
        //Recent duels/races?

        //Show achivements


        //Show stats? 
            //Show last login, date created
            //Race score (nth place)?
            //Golds (nth place)?
            //Silvers (nth place)?
            //Bronzes (nth place)?
            //average rank (nth place)?
            //sprr ?
            //spr ?
            //avg percentile?
            //avg rank?
            //races / courses completed?

            //How to decide which duel type? -- Or pick best type .. ? or just show saber or force?
            //duel winrate?
            //duel avg HP?
            //duel avg TS?
            //duel elo (nth place)?

        //If we want to have a graph of their win/losses for each type with time as x axis, https://www.highcharts.com/demo/line-ajax ?
        /* //if win value++ if loss value-- and graph value
        select * from ( 
        SELECT "win", type, end_time FROM LocalDuel WHERE winner = 'source'
        UNION
        SELECT "loss", type, end_time FROM LocalDuel WHERE loser = 'source')
        ORDER BY end_time
        */

        //Show top/most active "recent" players?
            //where end time > (now - 1 month) etc

        
    }
    else if(page=="duel"){
        duel_title();
        duel_count();
        duel_rank();
        duel_list();
    }else if(page=="race"){
        race_title();
        race_count();
        race_rank();
        race_list();
    }else if(page=="maps"){
        maps();
    }else if(page=="servers"){
        servers();
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
    var p4 = '<p><a class="btn btn-default btn-lg" href="https://github.com/videoP/jaPRO/raw/master/japro3.pk3" role="button">Download jaPRO Client</a> </p>';
    var webmtest = '<p><video width="800" height="800" loop autoplay><source src="output.webm" type="video/mp4">Your browser does not support the video tag.</video></p>';
    var webmtest2 = '<p><video width="800" height="800" loop autoplay><source src="output2.webm" type="video/mp4">Your browser does not support the video tag.</video></p>';
    $("#main-content").html('<div class="container">'+p1+' <br> '+p2+' '+p3+' '+p4+' '+webmtest+' '+webmtest2+'</div>');
    $('.jk-nav li').removeClass("active");
    $('#menu_home').addClass("active");
}

//////////////////////////////////////////////////////////////////////////
/////////////////////////////////DUELS////////////////////////////////////
/////////////////////////////////DUELS////////////////////////////////////
/////////////////////////////////DUELS////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

function duel_title(){
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

function duel_count(){
    var panel = "";
    panel += '  <div class="col-md-12">';
    panel += '      <div id="chart_duel_count">';
    panel += '      </div>';
    panel += '                </div>';
    $("#main-content").append(panel);

    $(document).ready(function() {
        var data = null;
        var item = "duel_count";
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

        //Loda fixme, this can use the json from datatable_duel_rank maybe and avoid a query?
    var chart
        chart = new Highcharts.Chart({
            chart: {
                type: 'bar',
                renderTo: 'chart_duel_count',
                margin: 0,
                height: 50 //Not ideal, should be controlled by css. Also the width isnt the full page, I think cuz of highcharts branding?
            },
            title: null,
            credits: false,
            xAxis: {
                labels: {
                   enabled: false
                },
                lineColor: 'transparent',
                minorTickLength: 0,
                tickLength: 0,
            },
            yAxis: {
                labels: {
                    enabled: false
                },
                minorTickLength: 0,
                tickLength: 0,
                reversedStacks: false,
                gridLineColor: 'transparent',
                title: {
                    enabled: false,
                }
            },
            legend: {
                enabled: false
            },
                labels: {
                    enabled: false
                },
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },         
            tooltip: {
              formatter: function() {
                return this.series.name + ' ('+ this.y +' duels)';
              }
            },   
            series: [{ //This should be more dynamic.. if theres less than 5 results it shouldnt bother trying to make 5 series?  Also should skip if the item is less than like 5percent?
                name: DuelToString(data[0][0]),
                data: [data[0][1]] //[0][1]
            }, {
                name: DuelToString(data[1][0]),
                data: [data[1][1]]
            }, {
                name: DuelToString(data[2][0]),
                data: [data[2][1]]
            }, {
                name: DuelToString(data[3][0]),
                data: [data[3][1]]
            }, {
                name: DuelToString(data[4][0]),
                data: [data[4][1]]
            }]
        });
    });

    $('.jk-nav li').removeClass("active");
    $('#menu_duel').addClass("active");
}

function duel_rank(){
    var panel;
    panel = '<div id="second_row" class="row">';
    panel += '  <div class="col-md-12">';
    panel += '      <div class="panel panel-filled">';
    panel += '          <div class="panel-heading">';
    panel += '              Saber Rank List';
    panel += '          </div>';
    panel += '          <div class="panel-body">';
    panel += '              <p>This is the saber rank list, ordered by ELO.</p>';
    panel += '              <div class="table-responsive">';
    panel += '                  <table id="datatable_duel_rank" width="100%" class="table table-striped table-hover">';
    panel += '                      <thead><tr><th><label title="Elo rank compared to every other elo regardless of type.">Rank</label></th><th>Player</th><th>Type</th><th>Elo</th><th data-hide="phone,table"><label title="Average strength of opponent. A lower value means this player faces easier opponents.">TS</label></th><th>Count</th></tr></thead>';
    panel += '                      <tfoot><tr><th></th><th>Player</th><th>Type</th><th></th><th data-hide="phone,table"></th><th></th></tr></tfoot>';
    panel += '              </div>';
    panel += '          </div>';
    panel += '      </div>';
    panel += '  </div>';
    panel += '</div>';

    $("#main-content").append(panel);

    $(document).ready(function() {
        var item = "duel_rank";
        var url = "ajax/getJSON.php";
        $.ajax({
            type: "POST",
            url: url,
            dataType: "JSON",
            async: false,
            data: { option: item },
            success: function(res) {
                data = res;
            }
        });

        $('#datatable_duel_rank').DataTable( {
            "order": [[ 3, "desc" ]],
            "bLengthChange": false,
            "deferRender": true,
            "dom": 'lrtp', //Hide search box
            "data": data,
            "columns": [
                { "data": null,  "render": 
                    function ( data, type, row, meta ) { 
                     return meta.row+1 }}, //Well.. this is not quite what we want, but I guess it will be ok (shows rank of their elo compared to every other elo regardless of type)
                { "data": 0, "render": 
                    function ( data, type, row, meta ) { 
                        return (type == 'filter') ? (data) : ('<a href=?page=player&name='+encodeURIComponent(data)+'>'+data+'</a>'); }},
                { "data": 1, "render": 
                    function ( data, type, row, meta ) { 
                        return DuelToString(data) }},
                { "data": 2 },
                { "data": 3 },
                { "data": 4 }
            ],
            /*
            "columns": [
                { "data": null, defaultContent: "N/A" }, //How get position for this
                { "data": "username", "render": 
                    function ( data, type, row, meta ) { 
                        return (type == 'filter') ? (data) : ('<a href=?page=player&name='+encodeURIComponent(data)+'>'+data+'</a>'); }},
                { "data": "type", "render": 
                    function ( data, type, row, meta ) { 
                        return DuelToString(data) }},
                { "data": "elo" },
                { "data": "TS" },
                { "data": "count" }
            ],
            */
            /*
            "fnDrawCallback": function ( oSettings ) {
            //Need to redo the counters if filtered or sorted
                if ( oSettings.bSorted || oSettings.bFiltered )
                {
                    for ( var i=0, iLen=oSettings.aiDisplay.length ; i<iLen ; i++ )
                    {
                        $('td:eq(0)', oSettings.aoData[ oSettings.aiDisplay[i] ].nTr ).html( i+1 );
                    }
                }
            },
            */
/*
            "columnDefs": [
              { "sType": "html", "aTargets": [ 1 ] } //numbers-html plugin
              //{ "sType": "numeric", "aTargets": [ 7 ] } //time-uni sort plugin
            ],
            */
            "aoColumnDefs": [
                { "bSortable": false, "aTargets": [ 0 ] }
            ],
            "oLanguage": {
                        "sInfo": '',
                        "sInfoFiltered": ''
            },
            "aaSorting": [[ 1, 'asc' ]], // ?

            initComplete: function () {
                this.api().columns([1]).every( function () {
                    var column = this;
                    var select = $('<select class="filter form-control input-sm"><option value="">Show all</option></select>')
                        .appendTo( $(column.footer()).empty() )
                        .on( 'change', function () {
                            var val = $.fn.dataTable.util.escapeRegex(
                                $(this).val()
                            );
                            column
                                .search( val ? '^'+val+'$' : '', true, false ) //IDK
                                .draw();
                        } );
                    column.data().unique().sort().each( function ( d, j ) {
                        select.append( '<option value="'+d+'">'+d+'</option>' )
                    } );
                } );
                this.api().columns([2]).every( function () {
                    var column = this;
                    var select = $('<select class="filter form-control input-sm"><option value="">Show all</option></select>')
                        .appendTo( $(column.footer()).empty() )
                        .on( 'change', function () {
                            var val = $.fn.dataTable.util.escapeRegex(
                                $(this).val()
                            );
                            column
                                .search( val ? '^'+DuelToString(val)+'$' : '', true, false )
                                .draw();
                        } );
                    column.data().unique().sort(sortFunction).each( function ( d, j ) {
                        select.append( '<option value="'+(d)+'">'+DuelToString(d)+'</option>' )
                    } );
                } );
            }
        });
    });

    $('.jk-nav li').removeClass("active");
    $('#menu_duel').addClass("active");
}

function duel_list(){  
    var panel;
    panel = '<div id="third_row" class="row">';
    panel += '  <div class="col-md-12">';
    panel += '      <div class="panel panel-filled">';
    panel += '          <div class="panel-heading">';
    panel += '              Recent duels';
    panel += '          </div>';
    panel += '          <div class="panel-body">';
    panel += '              <p>Here you can see the registri of all saber duels in japro server.</p>';
    panel += '              <div class="table-responsive">';
    panel += '                  <table id="datatable_duel_list" width="100%" class="table table-striped table-hover">';
    panel += '                      <thead><tr><th>Winner</th><th>Loser</th><th>Type</th><th data-hide="phone,table">Winner Health</th><th>Odds</th><th>Date</th><th data-hide="phone,table">Duration</th></tr></thead>';
    panel += '                      <tfoot><tr><th>Winner</th><th>Loser</th><th>Type</th><th data-hide="phone,table"></th><th></th><th></th><th data-hide="phone,table"></th></tr></tfoot>';
    panel += '              </div>';
    panel += '          </div>';
    panel += '      </div>';
    panel += '  </div>';
    panel += '</div>';

    $("#main-content").append(panel);

    $(document).ready(function() {
        var data = null;
        var item = "duel_list";
        var url = "ajax/getJSON.php";
        $.ajax({
            type: "POST",
            url: url,
            dataType: "JSON",
            async: false,
            data: { option: item },
            success: function(res) {
                data = res;
            }
        });

        $('#datatable_duel_list').DataTable( {
            "order": [[ 5, "desc" ]],
            "deferRender": true,
            "bLengthChange": false,
            "data": data,
            "dom": 'lrtp', //Hide search box
            "columns": [
                { "data": 0, "render": 
                    function ( data, type, row, meta ) { 
                        return (type == 'filter') ? (data) : ('<a href=?page=player&name='+encodeURIComponent(data)+'>'+data+'</a>'); }},
                { "data": 1, "render": 
                    function ( data, type, row, meta ) { 
                        return (type == 'filter') ? (data) : ('<a href=?page=player&name='+encodeURIComponent(data)+'>'+data+'</a>'); }},
                { "data": 2, "render": 
                    function ( data, type, row, meta ) { 
                        return DuelToString(data) }},
                { "data": 3 , sType: "num-duelhp" }, //This does not sort properly - x/y  format, sort by sum(x+y)
                { "data": 4, "render": 
                    function ( data, type, row, meta ) {
                    if (data <= 15) 
                        return '<b><font color="#bc5700">'+data+'%</font></b>'; 
                    else 
                        return data+'%'; }},
                { "data": 5, "render": 
                    function ( data, type, row, meta ) { 
                        var date = new Date(data*1000);
                        //+RaceToString(row[3]).toLowerCase()+'.dm_26">'+date.toISOString().substring(0, 10)+'<a>' }},
                        return (date.getYear()-100) + '-' + ('0'+(date.getMonth()+1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) + ' ' 
                            + ('0'+(date.getHours()+1)).slice(-2) + ':' + ('0'+(date.getMinutes()+1)).slice(-2) + '<a>' }},
                { "data": 6, "sType": "num-dur", "className": "duration_ms", "render": //should be uni-time
                    function ( data, type, row, meta ) { 
                        return DuelTimeToString(data) }}
            ],
            initComplete: function () {            
                this.api().columns([0, 1]).every( function () { //This doesn't activate?
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
                this.api().columns([2]).every( function () { //This doesn't activate?
                    var column = this;
                    var select = $('<select class="filter form-control input-sm"><option value="">Show all</option></select>')
                        .appendTo( $(column.footer()).empty() )
                        .on( 'change', function () {
                            var val = $.fn.dataTable.util.escapeRegex(
                                $(this).val()
                            );
                            column
                                .search( val ? '^'+DuelToString(val)+'$' : '', true, false )
                                .draw();
                        } );
                    column.data().unique().sort(sortFunction).each( function ( d, j ) {
                        select.append( '<option value="'+d+'">'+DuelToString(d)+'</option>' )
                    } );
                } );
            }
        });
    });

    $('.jk-nav li').removeClass("active");
    $('#menu_duel').addClass("active");

}

/////////////////////////////////////////////////////////////////////
///////////////////////////////RACE//////////////////////////////////
///////////////////////////////RACE//////////////////////////////////
///////////////////////////////RACE//////////////////////////////////
/////////////////////////////////////////////////////////////////////


function race_title(){
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

function race_count(){
    var panel = "";
    panel = '<div id="first_row" class="row">';
    panel += '  <div class="col-md-12">';
    panel += '      <div id="chart_race_count">';
    panel += '      </div>';
    panel += '                </div>';
     panel += '                </div>';
    $("#main-content").append(panel);

    //$(document).ready(function() {
        var data = null;
        var item = "race_count";
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

        //Loda fixme, this can use the json from datatable_duel_rank maybe and avoid a query?
    var chart
        chart = new Highcharts.Chart({
            chart: {
                type: 'bar',
                renderTo: 'chart_race_count',
                margin: 0,
                height: 50 //Not ideal, should be controlled by css. Also the width isnt the full page, I think cuz of highcharts branding?
            },
            title: null,
            credits: false,
            xAxis: {
                labels: {
                   enabled: false
                },
                lineColor: 'transparent',
                minorTickLength: 0,
                tickLength: 0,
            },
            yAxis: {
                labels: {
                    enabled: false
                },
                minorTickLength: 0,
                tickLength: 0,
                reversedStacks: false,
                gridLineColor: 'transparent',
                title: {
                    enabled: false,
                }
            },
            legend: {
                enabled: false
            },
                labels: {
                    enabled: false
                },
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },         
            tooltip: {
              formatter: function() {
                return this.series.name + ' ('+ this.y +' races)';
              }
            },      
            series: [{ //This should be more dynamic.. if theres less than 5 results it shouldnt bother trying to make 5 series?
                name: RaceToString(data[0][0]),
                data: [data[0][1]] //[0][1]
            }, {
                name: RaceToString(data[1][0]),
                data: [data[1][1]]
            }, {
                name: RaceToString(data[2][0]),
                data: [data[2][1]]
            }, {
                name: RaceToString(data[3][0]),
                data: [data[3][1]]
            }, {
                name: RaceToString(data[4][0]),
                data: [data[4][1]]
            }]
        });
    //});

    $('.jk-nav li').removeClass("active");
    $('#menu_race').addClass("active");
}

//var RaceRankData;
function race_rank(){
    var panel;
    panel = '<div id="second_row" class="row">';
    panel += '  <div class="col-md-12">';
    panel += '      <div class="panel panel-filled">';
    panel += '          <div class="panel-heading">';
    panel += '              Scores';
    panel += '          </div>';
    panel += '          <div class="panel-body">';
    panel += '              <div class="table-responsive">';
    panel += '                  <table id="datatable_race_rank" width="100%" class="table table-striped table-hover">';
    panel += '                      <thead><tr><th><label title="Score rank compared to every other score regardless of style.">Rank</label></th><th>Username</th><th>Style</th><th>Score</th><th data-hide="phone,table">Average Score</th><th data-hide="phone,table">Average Percentile</th><th data-hide="phone,table">Average Rank</th><th data-hide="phone,table">Golds</th><th data-hide="phone,table">Silvers</th><th data-hide="phone,table">Bronzes</th><th>Count</th></tr></thead>';
    panel += '                      <tfoot><tr><th></th><th>Username</th><th>Style</th><th></th><th data-hide="phone,table"></th><th data-hide="phone,table"></th><th data-hide="phone,table"></th><th data-hide="phone,table"></th><th data-hide="phone,table"></th><th data-hide="phone,table"></th><th></th></tr></tfoot>';
    panel += '              </div>';
    panel += '          </div>';
    panel += '      </div>';
    panel += '  </div>';
    panel += '</div>';
    $("#main-content").append(panel);

    $(document).ready(function() {
        var data = null;
        var item = "race_rank";
        var url = "ajax/getJSON.php";
        $.ajax({
            type: "POST",
            url: url,
            dataType: "JSON",
            async: false,
            data: { option: item },
            success: function(res) {
                data = res;
                //RaceRankData = data
            }
        });

        $('#datatable_race_rank').DataTable( {
            "order": [[ 3, "desc" ]],
            "bLengthChange": false,
            "deferRender": true,
            "dom": 'lrtp', //Hide search box
            "data": data,
            "columns": [                
                { "data": null,  "render":                 //{ "data": null, defaultContent: "N/A" }, //How get position for this
                    function ( data, type, row, meta ) { 
                     return meta.row+1 }}, //This is not what we want since it counts combined styles as a style.          
                { "data": 0, "render": 
                    function ( data, type, row, meta ) { 
                        return (type == 'filter') ? (data) : ('<a href=?page=player&name='+encodeURIComponent(data)+'>'+data+'</a>'); }},   
                { "data": 1, "sType": "numeric", "render": 
                    function ( data, type, row, meta ) { 
                        return RaceToString(data) }},
                { "data": 2 },
                { "data": 3 },
                { "data": 4 },
                { "data": 5 },
                { "data": 6 },
                { "data": 7 },
                { "data": 8 },
                { "data": 9 }
            ],
            /*
             "fnDrawCallback": function ( oSettings ) { //fixme
            // Need to redo the counters if filtered or sorted
                if ( oSettings.bSorted || oSettings.bFiltered )
                {
                    for ( var i=0, iLen=oSettings.aiDisplay.length ; i<iLen ; i++ )
                    {
                        $('td:eq(0)', oSettings.aoData[ oSettings.aiDisplay[i] ].nTr ).html( i+1 );
                    }
                }
            },
            */
            "aoColumnDefs": [
                { "bSortable": false, "aTargets": [ 0,2 ] }
            ],
             "oLanguage": {
                        "sInfo": '',
                        "sInfoFiltered": ''
            },  
            "aaSorting": [[ 1, 'asc' ]],
            initComplete: function () {
                this.api().columns([1]).every( function () {
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
                this.api().columns([2]).every( function () {
                    var column = this;
                    var select = $('<select class="filter form-control input-sm"></select>') //Why does jetpack and swoop show up in middle - because it sorts by string not numeric? Why does it not filter by all on pageload even though its selected
                        .appendTo( $(column.footer()).empty() )
                        .on( 'change', function () {
                            var val = $.fn.dataTable.util.escapeRegex(
                                $(this).val()
                            );
                            column
                                .search( val ? '^'+RaceToString(val)+'$' : '', true, false )
                                .draw();
                        } );
                    column.data().unique().sort(sortFunction).each( function ( d, j ) {
                        if (d == 99) //Style for "ALL"
                            select.append( '<option selected="selected" value="'+d+'">'+RaceToString(d)+'</option>' )
                        else
                            select.append( '<option value="'+d+'">'+RaceToString(d)+'</option>' )
                    } );
                } );
                this.api().columns(2).search('All')
                this.api().draw();
            }
        });
    });

    $('.jk-nav li').removeClass("active");
    $('#menu_race').addClass("active");
   
}

function race_list(){
    var panel;
    panel = '<div id="third_row" class="row">';
    panel += '  <div class="col-md-12">';
    panel += '      <div class="panel panel-filled">';
    panel += '          <div class="panel-heading">';
    panel += '              Records';
    panel += '          </div>';
    panel += '          <div class="panel-body">';
    panel += '              <div class="table-responsive">';
    panel += '                  <table id="datatable_race_list" width="100%" class="table table-striped table-hover">';
    panel += '                      <thead><tr><th>Rank</th><th>Username</th><th>Coursename</th><th>Style</th><th data-hide="phone,table">Topspeed</th><th data-hide="phone,table">Average</th><th>Date</th><th>Time</th></tr></thead>';
    panel += '                      <tfoot><tr><th></th><th>Username</th><th>Coursename</th><th>Style</th><th data-hide="phone,table"></th><th data-hide="phone,table"></th><th></th><th></th></tr></tfoot></table>';
    panel += '              </div>';
    panel += '          </div>';
    panel += '      </div>';
    panel += '  </div>';
    panel += '</div>';
    $("#main-content").append(panel);

    $(document).ready(function() {
        var data = null;
        var item = "race_list";
        var url = "ajax/getJSON.php";

        /*if(localStorage.getItem("dataCache")) { //We also have to check if its up to date? hmm.
            data = JSON.parse(localStorage.getItem("dataCache"));
        } else*/ {
            $.ajax({
                type: "POST",
                url: url,
                dataType: "JSON",
                async: false,
                data: { option: item },
                success: function(res) {//JSON
                    data = res;
                    //localStorage.setItem("dataCache", JSON.stringify(res));
                }
            });
        }

        $('#datatable_race_list').DataTable( {
            "order": [[ 6, "desc" ]],
            "deferRender": true,
            "bLengthChange": false,
            "dom": 'lrtp', //Hide search box
            "data": data,
            "columns": [
                { "data": 0, "sType": "num-html", "render": 
                    function ( data, type, row, meta ) {
                    if (data == 1) 
                        return '<b><font color="#bc5700">1</font></b>'; //Muted orange
                    else 
                        return data; }},
                { "data": 1, "render": 
                    function ( data, type, row, meta ) { 
                        return (type == 'filter') ? (data) : ('<a href=?page=player&name='+encodeURIComponent(data)+'>'+data+'</a>'); }},
                { "data": 2 }, 
                { "data": 3, "render": 
                    function ( data, type, row, meta ) { 
                        return RaceToString(data) }},
                { "data": 4 },
                { "data": 5 },
                { "data": 6, "render": 
                    function ( data, type, row, meta ) { 
                        var date = new Date(data*1000);
                        return '<a href="../races/'+encodeURIComponent(row[1])+'/'+encodeURIComponent(row[1])+'-'+encodeURIComponent(row[2].replace(" ", ""))+'-'
                            +RaceToString(row[3]).toLowerCase()+'.dm_26">'+(date.getYear()-100) + '-' + ('0'+(date.getMonth()+1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) + ' ' 
                            + ('0'+(date.getHours()+1)).slice(-2) + ':' + ('0'+(date.getMinutes()+1)).slice(-2) + '<a>' }},
                { "data": 7, "sType": "num-durhtml", "className": "duration_ms", "render":
                    function ( data, type, row, meta ) { 
                        return '<td style="text-align: right;">'+RaceTimeToString(data)+'</td>' }} //Why doesnt this work..
            ],  
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
                this.api().columns([3]).every( function () {
                    var column = this;
                    var select = $('<select class="filter form-control input-sm"><option value="">Show all</option></select>')
                        .appendTo( $(column.footer()).empty() )
                        .on( 'change', function () {
                            var val = $.fn.dataTable.util.escapeRegex(
                                $(this).val()
                            );
                            column
                                .search( val ? '^'+RaceToString(val)+'$' : '', true, false )
                                .draw();
                        } );
                    column.data().unique().sort(sortFunction).each( function ( d, j ) {
                        select.append( '<option value="'+d+'">'+RaceToString(d)+'</option>' )
                    } );
                } );
            }
        });
    });

    $('.jk-nav li').removeClass("active");
    $('#menu_race').addClass("active");
   
}

/////////////////////////////////////////////////////////////////////
///////////////////////////////PLAYER////////////////////////////////
///////////////////////////////PLAYER////////////////////////////////
///////////////////////////////PLAYER////////////////////////////////
/////////////////////////////////////////////////////////////////////

function player_title(){ //Show total number of players, get each playername for dropdown select
    var HTML;
    HTML='<div class="row">';
    HTML+='            <div class="col-lg-12">';
    HTML+='                <div class="view-header">';
    HTML+='                    <div class="pull-right text-right" style="line-height: 14px">';
    HTML+='                        <small>Stats<br><span class="c-white">Players</span></small>';
    HTML+='                    </div>';
    HTML+='                    <div class="header-icon">';
    HTML+='                        <i class="pe page-header-icon pe-7s-shield"></i>';
    HTML+='                    </div>';
    HTML+='                    <div class="header-title">';
    HTML+='                        <h3>Players</h3>';
    HTML+='                        <small>';
    HTML+='                            '+player ? player : 'Select the player you want to see.';
    HTML+='                        </small>';
    HTML+='                    </div>';
    HTML+='                </div>';
    HTML+='                <hr>';
    HTML+='            </div>';
    HTML+='        </div>';
    $("#main-content").append(HTML);

    var data = null;
    var item = "player_accounts";
    var url = "ajax/getJSON.php";
    $.ajax({
        type: "POST",
        url: url,
        dataType: "JSON",
        async: false,
        data: { option: item },
        success: function(res) {
            data = res;
        }
    });
}

function player_map_charts(){//Most popular maps, most popular styles, most exclusive map-styles, total races
    var panel = "";
    panel += '<div id="third_row" class="row">';
    panel += '  <div class="col-md-6">';
    panel += '                    <div class="panel panel-filled">';
    panel += '                      <div class="panel-heading">';
    panel += '                          Map stats';
    panel += '                      </div>';
    panel += '                        <div class="panel-body">';
    panel += '                            <div id="player_map_charts_most">';
    panel += '                            </div>';
    panel += '                            <div id="player_map_charts_least">';
    panel += '                            </div>';
    panel += '                            <div id="player_map_charts_time">';
    panel += '                            </div>';
    panel += '                        </div>';
    panel += '                    </div>';
    panel += '                </div>';
    panel += '            </div>';
    $("#main-content").append(panel);

    var data = null;
    var item = "player_map_charts";
    var url = "ajax/getJSON.php";
    $.ajax({
        type: "POST",
        url: url,
        dataType: "JSON",
        async: false,
        data: { option: item },
        success: function(res) {
            data = res;
        }
    });

    var chart;
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'player_map_charts_most',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            credits: false,
            title: {
                text: 'Most exclusive maps'
            },
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
                name: 'Count',
                data: [
                      [data[5][0], data[5][2]],
                      [data[6][0], data[6][2]],
                      [data[7][0], data[7][2]],
                      [data[8][0], data[8][2]],
                      [data[9][0], data[9][2]]
                ]
            }]
        });


    var chart2;
        chart2 = new Highcharts.Chart({
            chart: {
                renderTo: 'player_map_charts_least',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            credits: false,
            title: {
                text: 'Most popular map-styles'
            },
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
                name: 'Count',
                data:   [
                        [data[0][0]+" "+RaceToString(data[0][1]), data[0][2]],
                        [data[1][0]+" "+RaceToString(data[1][1]), data[1][2]],
                        [data[2][0]+" "+RaceToString(data[2][1]), data[2][2]],
                        [data[3][0]+" "+RaceToString(data[3][1]), data[3][2]],
                        [data[4][0]+" "+RaceToString(data[4][1]), data[4][2]]
                ]
            }]
        });

    var chart3;
        chart3 = new Highcharts.Chart({
            chart: {
                renderTo: 'player_map_charts_time',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            credits: false,
            title: {
                text: 'Average time'
            },
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
                type: 'bar',
                name: 'Seconds',
                data: [
                      [RaceToString(data[10][1]), data[10][2]/1000],
                      [RaceToString(data[11][1]), data[11][2]/1000],
                      [RaceToString(data[12][1]), data[12][2]/1000],
                      [RaceToString(data[13][1]), data[13][2]/1000],
                      [RaceToString(data[14][1]), data[14][2]/1000],
                      [RaceToString(data[15][1]), data[15][2]/1000],
                      [RaceToString(data[16][1]), data[16][2]/1000],
                      [RaceToString(data[17][1]), data[17][2]/1000],
                      [RaceToString(data[18][1]), data[18][2]/1000],
                      [RaceToString(data[19][1]), data[19][2]/1000],
                      [RaceToString(data[20][1]), data[20][2]/1000],
                      [RaceToString(data[21][1]), data[21][2]/1000],
                      [RaceToString(data[22][1]), data[22][2]/1000],
                ]
            }]
        });

    $('.jk-nav li').removeClass("active");
    $('#menu_player').addClass("active");
}

function player_duel_charts(){//Most popular maps, most popular styles, most exclusive map-styles, total races
    var panel = "";
    panel += '<div id="third_row" class="row">';
    panel += '  <div class="col-md-6">';
    panel += '                    <div class="panel panel-filled">';
    panel += '                      <div class="panel-heading">';
    panel += '                          Average duel length';
    panel += '                      </div>';
    panel += '                        <div class="panel-body">';
    panel += '                            <div id="player_duel_charts">';
    panel += '                            </div>';
    panel += '                        </div>';
    panel += '                    </div>';
    panel += '                </div>';
    panel += '            </div>';
    $("#main-content").append(panel);

    var data = null;
    var item = "player_duel_charts";
    var url = "ajax/getJSON.php";
    $.ajax({
        type: "POST",
        url: url,
        dataType: "JSON",
        async: false,
        data: { option: item },
        success: function(res) {
            data = res;
        }
    });

    var chart;
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'player_duel_charts',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            credits: false,
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
                type: 'bar',
                name: 'Time',
                data: data
            }]
        });

    $('.jk-nav li').removeClass("active");
    $('#menu_player').addClass("active");
}

function player_header() {//Shows avatar and has buttons to switch between race and duel

}

function player_overall_stats() {//Combined stats for all duel types, all race styles, etc

}

function player_race_stats(){//Most popular duels, total number of duels
    var panel = "";
    panel += '<div id="third_row" class="row">';
    panel += '  <div class="col-md-6">';
    panel += '                    <div class="panel panel-filled">';
    panel += '                      <div class="panel-heading">';
    panel += '                          Race Types';
    panel += '                      </div>';
    panel += '                        <div class="panel-body">';
    panel += '                            <p>Favorite race types.</p>';
    panel += '                            <div id="player_race_stats">';
    panel += '                            </div>';
    panel += '                        </div>';
    panel += '                    </div>';
    panel += '                </div>';
    panel += '            </div>';
    $("#main-content").append(panel);

    var username = player;
    var data = null;
    var item = "player_race_stats";
    var url = "ajax/getJSON.php";
    $.ajax({
        type: "POST",
        url: url,
        dataType: "JSON",
        async: false,
        data: { option: item, player: username},
        success: function(res) {
            data = res;
        }
    });

    var chart;
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'player_race_stats',
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
                name: 'Strength',
                data: data
            }]
        });

    $('.jk-nav li').removeClass("active");
    $('#menu_player').addClass("active");
}

function player_duel_stats(){//Most popular duels, total number of duels
    var panel = "";
    panel += '<div id="third_row" class="row">';
    panel += '  <div class="col-md-6">';
    panel += '                    <div class="panel panel-filled">';
    panel += '                      <div class="panel-heading">';
    panel += '                          Duel Types';
    panel += '                      </div>';
    panel += '                        <div class="panel-body">';
    panel += '                            <p>Favorite duel types.</p>';
    panel += '                            <div id="player_duel_stats">';
    panel += '                            </div>';
    panel += '                        </div>';
    panel += '                    </div>';
    panel += '                </div>';
    panel += '            </div>';
    $("#main-content").append(panel);

    var username = player;
    var data = null;
    var item = "player_duel_stats";
    var url = "ajax/getJSON.php";
    $.ajax({
        type: "POST",
        url: url,
        dataType: "JSON",
        async: false,
        data: { option: item, player: username},
        success: function(res) {
            data = res;
        }
    });

    var chart;
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'player_duel_stats',
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
                name: 'Strength',
                data: data
            }]
        });

    $('.jk-nav li').removeClass("active");
    $('#menu_player').addClass("active");
}

function player_race_chart(){ //This should be a stacked horizontal bar graph like githubs code breakdwon
    var panel = "";
    panel += '<div id="third_row" class="row">';
    panel += '  <div class="col-md-6">';
    panel += '                    <div class="panel panel-filled">';
    panel += '                      <div class="panel-heading">';
    panel += '                          Race Types';
    panel += '                      </div>';
    panel += '                        <div class="panel-body">';
    panel += '                            <p>Favorite race styles.</p>';
    panel += '                            <div id="player_race_count_chart">';
    panel += '                            </div>';
    panel += '                        </div>';
    panel += '                    </div>';
    panel += '                </div>';
    panel += '            </div>';
    $("#main-content").append(panel);

    var username = player;
    var data = null;
    var item = "player_race_chart";
    var url = "ajax/getJSON.php";
    $.ajax({
        type: "POST",
        url: url,
        dataType: "JSON",
        async: false,
        data: { option: item, player: username},
        success: function(res) {
            data = res;
        }
    });

    var chart;
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'player_race_count_chart',
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
                name: 'Strength',
                data: data
            }]
        });

    $('.jk-nav li').removeClass("active");
    $('#menu_player').addClass("active");
}

function player_duel_graph(){
    var panel = "";
    panel += '<div id="third_row" class="row">';
    panel += '  <div class="col-md-6">';
    panel += '                    <div class="panel panel-filled">';
    panel += '                      <div class="panel-heading">';
    panel += '                          Duel Elo Trend';
    panel += '                      </div>';
    panel += '                        <div class="panel-body">';
    panel += '                            <p>Elo graph.</p>';
    panel += '                            <div id="player_duel_graph">';
    panel += '                            </div>';
    panel += '                        </div>';
    panel += '                    </div>';
    panel += '                </div>';
    panel += '            </div>';
    $("#main-content").append(panel);

    var username = player;
    var data = null;
    var item = "player_duel_graph";
    var url = "ajax/getJSON.php";
    $.ajax({
        type: "POST",
        url: url,
        dataType: "JSON",
        async: false,
        data: { option: item, player: username},
        success: function(res) {
            data = res;
        }
    });

    var chart;
        chart = new Highcharts.Chart({
            data: {
                data: data
            },

            chart: {
                renderTo: 'player_duel_graph',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: null,
            plotOptions: {
            },
            series: [{
                name: 's1',
                }, {
                name: 's2'
            }]
        });

    $('.jk-nav li').removeClass("active");
    $('#menu_player').addClass("active");
}





/////////////////////////////////////////////////////////////////////
///////////////////////////////RACE//////////////////////////////////
///////////////////////////////RACE//////////////////////////////////
///////////////////////////////RACE//////////////////////////////////
/////////////////////////////////////////////////////////////////////

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

function servers(){
        HTML='<div class="row">';
        HTML+='<div class="col-md-4">';
        HTML+='  <h2>..a</h2>';
        HTML+='  <p>..b</p>';
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
    if (val==99)
        style="All";
    else if (val==0)
        style="Siege";
    else if(val==1)
        style="JKA";
    else if(val==2)
        style="QW";
    else if(val==3)
        style="CPM";
    else if(val==4)
        style="Q3";
    else if(val==5)
        style="PJK";
    else if(val==6)
        style="WSW";
    else if(val==7)
        style="RJQ3";
    else if(val==8)
        style="RJCPM";
    else if(val==9)
        style="Swoop";
    else if(val==10)
        style="Jetpack";
    else if(val==11)
        style="Speed";
    else if(val==12)
        style="SP";
    return style;
}

function RaceTimeToString(duration_ms) {
    var seconds = (Math.floor((duration_ms / 1000) % 60) + ((duration_ms % 1000) / 1000)).toFixed(3);
    var minutes = Math.floor((duration_ms / (60 * 1000)) % 60);
    var hours = Math.floor(duration_ms / (60 * 60 * 1000));
          
    if (hours)
            return hours+":"+((minutes<10) ? ("0"+minutes) : (minutes))+":"+seconds;
    if (minutes)
            return minutes+":"+((seconds<10) ? ("0"+seconds) : (seconds));
    return seconds;
}

function DuelTimeToString(duration_ms) {
    var seconds = Math.floor((duration_ms / 1000) % 60);
    var minutes = Math.floor((duration_ms / (60 * 1000)) % 60);
    var hours = Math.floor(duration_ms / (60 * 60 * 1000));
          
    if (hours)
            return hours+":"+((minutes<10) ? ("0"+minutes) : (minutes))+":"+seconds;
    if (minutes)
            return minutes+":"+((seconds<10) ? ("0"+seconds) : (seconds));
    return seconds;
}

var sortFunction = function(a, b) {
    if(a < b) return -1;
    if(a > b) return 1;
    return 0;
};