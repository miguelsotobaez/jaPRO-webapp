/**
 * JK - Responsive Admin Theme
 *
 */

$(document).ready(function () {
	dashboard(page);

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

var dashboardData;
function dashboard(page) {
    $(document).ready(function() {
        var data = null;
        $.ajax({
            type: "POST",
            url: "ajax/getJSON.php",
            dataType: "JSON",
            async: false, //We need this for other stuff so i guess keep this not async ?
            data: { option: "dashboard"},
            success: function(res) {
                data = res;
                dashboardData = data;
               	var time = parseInt(Date.now()/1000);
	            if (page=="duel") {
	            	UpdateButton("update_duels", time - data[5][1]);
	        	}
	        	else if (page=="race") {
	            	UpdateButton("update_races", time - data[4][1]);
	        	}
				else if (page=="player") {
	            	UpdateButton("update_player", time - data[3][1]);
	        	}
            }
        });

    });
}

function UpdateButton(button, since) {
	if (since < 61) { //60+ seconds
		document.getElementById(button).innerHTML = 'Up to date'; //Gray out the button too?
		document.getElementById(button).setAttribute('disabled','disabled');
	}
	else if (since > 60*60*24) {//older than 24 hours, auto update
		document.getElementById(button).click();
		document.getElementById(button).innerHTML = 'Up to date'; //Gray out the button too?
		document.getElementById(button).setAttribute('disabled','disabled');
	}
	else {
		document.getElementById(button).innerHTML = 'Updated '+timeSince(since)+ ' ago';
	}
}

function home(){
    var p1 = '<h1>Welcome to jaPRO Mod!</h1><p>It is a mod started by loda based on OpenJK.</p>';
    var p2 = '<h4>What does jaPRO do for me?</h4><p><ul><li>Player accounts and stat database</li><li>Improved netcode with lag compensation</li><li>Multiple duel types</li><li>Full featured race-mode</li><li>Highscores and Elo</li><li>Improved weapon balancing and new weapon abilities</li><li>Improved full force balancing and features</li><li>Skill based grapple hook</li><li>New style of jetpack</li><li>Physics based flag-throw</li><li>Advanced bot AI</li><li>Instant update server settings (no longer requiring a map restart)</li><li>Lots of JK2 gameplay options</li><li>Improved vote system</li><li>Simple admin system with low potential for abuse</li><li>Ability to configure every setting back to basejk gameplay</li></ul></p>';
    var p3 = '<p><a class="btn btn-default btn-lg" href="https://github.com/videoP/jaPRO/raw/master/japro3.pk3" role="button">Download jaPRO Client</a> </p>';
    $("#main-content").html('<div class="container">'+p1+' <br> '+p2+' '+p3+'</div>');
    $('.jk-nav li').removeClass("active");
    $('#menu_home').addClass("active");
}

//////////////////////////////////////////////////////////////////////////
/////////////////////////////////DUELS////////////////////////////////////
/////////////////////////////////DUELS////////////////////////////////////
/////////////////////////////////DUELS////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

function duel_title(){
    var HTML = '';
    HTML+='<div class="row">';
    HTML+='            <div class="col-lg-12">';
    HTML+='                <div class="view-header">';
    HTML+='                    <div class="pull-right text-right" style="line-height: 14px">';
    HTML+='                        <small>Stats<br><span class="c-white">Duels</span></small>';
    HTML+='                    </div>';
    HTML+='                    <div class="header-icon">';
    HTML+='                        <i class="pe page-header-icon pe-7s-shield"></i>';
    HTML+='                    </div>';
    HTML+='                    <div class="header-title">';
    HTML+='                        <h3>Duels <button class="btn btn-warning" id="update_duels">Update</button></h3>';
    HTML+='                    </div>';
    HTML+='                </div>';
    HTML+='                <hr>';
    HTML+='            </div>';
    HTML+='        </div>';
    $("#main-content").append(HTML);

    $("#update_duels").click(function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "ajax/updateDB.php",
            data: { option: "duels" },
            success: function(result) {
            	location.reload();  //this is bad! it should just redraw the table..
                //alert('ok');
            },
            error: function(result) {
                //alert('error');
            }
        });
    });

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
        $.ajax({
            type: "POST",
            url: "ajax/getJSON.php",
            dataType: "JSON",
            async: true,
            data: { option: "duel_count"},
            success: function(res) {
                DuelCountChart(res);
            }
        });

    	//Loda fixme, this can use the json from datatable_duel_rank maybe and avoid a query?
    	function DuelCountChart (data) {
	        var chart = new Highcharts.Chart({
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
	                data: [Number(data[0][1])]
	            }, {
	                name: DuelToString(data[1][0]),
	                data: [Number(data[1][1])]
	            }, {
	                name: DuelToString(data[2][0]),
	                data: [Number(data[2][1])]
	            }, {
	                name: DuelToString(data[3][0]),
	                data: [Number(data[3][1])]
	            }, {
	                name: DuelToString(data[4][0]),
	                data: [Number(data[4][1])]
	            }]
	        });

    	}


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
    panel += '              Ranks';
    panel += '          </div>';
    panel += '          <div class="panel-body">';
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
        var data = null;
        var last_update = dashboardData[5][1];
        if(last_update > localStorage.getItem("duelUpdateTime") || !localStorage.getItem("duelRankCache")) { //Out of date
            $.ajax({
                type: "POST",
                url: "ajax/getJSON.php",
                dataType: "JSON",
                async: true,
                data: { option: "duel_rank" },
                success: function(res) {//JSON
                    DuelRankTable(res);
                    localStorage.setItem("duelRankCache", JSON.stringify(res));
                    localStorage.setItem("duelUpdateTime", last_update);
                }
            });
        }
        else {
        	data = JSON.parse(localStorage.getItem("duelRankCache"));
        	DuelRankTable(data);
        }

        function DuelRankTable(data) {
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
	                        return (type == 'filter') ? DuelToString(data) : ('<button type="button" class="btn btn-warning btn-xs" data-hook="duel_rank_filter_type" value="'+data+'">' + DuelToString(data) + '</button>') }},  //id should be unique 
	                { "data": 2 },
	                { "data": 3 },
	                { "data": 4 }
	            ],
	            "aoColumnDefs": [
	                { "bSortable": false, "aTargets": [ 0 ] }
	            ],
	            "oLanguage": {
	                        "sInfo": '',
	                        "sInfoFiltered": ''
	            },
	            "aaSorting": [[ 1, 'asc' ]], // ?

	            initComplete: function () {
					$('#datatable_duel_rank').on('click', 'button[data-hook="duel_rank_filter_type"]', function () {
						if (document.getElementById("duel_rank_typedropdown").value) {
							$("select[id='duel_rank_typedropdown']").val("").change()
						}
						else {
							$("select[id='duel_rank_typedropdown']").val($(this).val()).change()
						}
					});
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
	                    var select = $('<select id="duel_rank_typedropdown" class="filter form-control input-sm"><option value="">Show all</option></select>')
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
	            },
				"drawCallback": function( settings ) { //Pagination button active fixes
					$(document).ready(function () {
						if (document.getElementById("duel_rank_typedropdown").value) {
							var buttons = document.querySelectorAll("[data-hook=duel_rank_filter_type]");
						    for (var i = 0; i < buttons.length; i++){
						        buttons[i].className = "btn btn-warning btn-xs active"; //Use addclass / removeclass ?
						    }
						}
						else {
							var buttons = document.querySelectorAll("[data-hook=duel_rank_filter_type]");
						    for (var i = 0; i < buttons.length; i++){
						       	buttons[i].className = "btn btn-warning btn-xs";
							}
						}
					});
			    }
	        });
		}
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
    panel += '              Duels';
    panel += '          </div>';
    panel += '          <div class="panel-body">';
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
        var last_update = dashboardData[5][1];
        if(last_update > localStorage.getItem("duelUpdateTime") || !localStorage.getItem("duelListCache")) { //Out of date
            $.ajax({
                type: "POST",
                url: "ajax/getJSON.php",
                dataType: "JSON",
                async: true,
                data: { option: "duel_list" },
                success: function(res) {//JSON
                    DuelListTable(res);
                    localStorage.setItem("duelListCache", JSON.stringify(res));
                    localStorage.setItem("duelUpdateTime", last_update);
                }
            });
        }
        else {
        	data = JSON.parse(localStorage.getItem("duelListCache"));
        	DuelListTable(data);
        }

        function DuelListTable(data) {
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
	                        return (type == 'filter') ? DuelToString(data) : ('<button type="button" class="btn btn-warning btn-xs" data-hook="duel_list_filter_type" value="'+data+'">' + DuelToString(data) + '</button>') }},                       
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
	                        return (date.getYear()-100) + '-' + ('0'+(date.getMonth()+1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) + ' ' 
	                            + ('0'+(date.getHours()+1)).slice(-2) + ':' + ('0'+(date.getMinutes()+1)).slice(-2) + '<a>' }},
	                { "data": 6, "sType": "num-dur", "className": "duration_ms", "render": //should be uni-time
	                    function ( data, type, row, meta ) { 
	                        return DuelTimeToString(data) }}
	            ],
	            initComplete: function () {         
					$('#datatable_duel_list').on('click', 'button[data-hook="duel_list_filter_type"]', function () {
						if (document.getElementById("duel_list_typedropdown").value) {
							$("select[id='duel_list_typedropdown']").val("").change()
						}
						else {
							$("select[id='duel_list_typedropdown']").val($(this).val()).change()
						}
					});
	                this.api().columns([0, 1]).every( function () {
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
	                    var select = $('<select id="duel_list_typedropdown" class="filter form-control input-sm"><option value="">Show all</option></select>')
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
	            },
				"drawCallback": function( settings ) { //Pagination button active fixes
					$(document).ready(function () {
						if (document.getElementById("duel_list_typedropdown").value) {
							var buttons = document.querySelectorAll("[data-hook=duel_list_filter_type]");
						    for (var i = 0; i < buttons.length; i++){
						        buttons[i].className = "btn btn-warning btn-xs active"; //Use addclass / removeclass ?
						    }
						}
						else {
							var buttons = document.querySelectorAll("[data-hook=duel_list_filter_type]");
						    for (var i = 0; i < buttons.length; i++){
						       	buttons[i].className = "btn btn-warning btn-xs";
							}
						}
					});
			    }
	        });
		}
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
    var HTML = '';
    HTML+= '<div class="row">';
    HTML+='            <div class="col-lg-12">';
    HTML+='                <div class="view-header">';
    HTML+='                    <div class="pull-right text-right" style="line-height: 14px">';
    HTML+='                        <small>Stats<br><span class="c-white">Race</span></small>';
    HTML+='                    </div>';
    HTML+='                    <div class="header-icon">';
    HTML+='                        <i class="pe page-header-icon pe-7s-shield"></i>';
    HTML+='                    </div>';
    HTML+='                    <div class="header-title">';
    HTML+='                        <h3>Race <button class="btn btn-warning" id="update_races">Update</button></h3>';
    HTML+='                    </div>';
    HTML+='                </div>';
    HTML+='                <hr>';
    HTML+='            </div>';
    HTML+='        </div>';
    $("#main-content").append(HTML);

    //Update button
    $("#update_races").click(function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "ajax/updateDB.php",
            data: { option: "races" },
            success: function(result) {
            	location.reload();  //this is bad! it should just redraw the table..
                //alert('ok');
            },
            error: function(result) {
                //alert('error');
            }
        });
    });

}

function race_count(){
    var panel;
    panel = '<div id="first_row" class="row">';
    panel += '  <div class="col-md-12">';
    panel += '      <div id="chart_race_count">';
    panel += '      </div>';
    panel += '                </div>';
    panel += '                </div>';
    $("#main-content").append(panel);

    $(document).ready(function() {
        var data = null;
        $.ajax({
            type: "POST",
            url: "ajax/getJSON.php",
            dataType: "JSON",
            async: true,
            data: { option: "race_count"},
            success: function(res) {
                RaceCountChart(res);
            }
        });

        function RaceCountChart(data) {
        //Loda fixme, this can use the json from datatable_duel_rank maybe and avoid a query?
	        var chart = new Highcharts.Chart({
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
	                data: [Number(data[0][1])]
	            }, {
	                name: RaceToString(data[1][0]),
	                data: [Number(data[1][1])]
	            }, {
	                name: RaceToString(data[2][0]),
	                data: [Number(data[2][1])]
	            }, {
	                name: RaceToString(data[3][0]),
	                data: [Number(data[3][1])]
	            }, {
	                name: RaceToString(data[4][0]),
	                data: [Number(data[4][1])]
	            }]
	        });
	    }
    });

    $('.jk-nav li').removeClass("active");
    $('#menu_race').addClass("active");
}

var rank_table = "";
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

    panel += '						<select id="race_rank_seasondropdown" class="filter form-control input-sm"><option value="0">Show all</option></select>'; //Make this get populated by season numbers.  Make it send POST to getJSON to requery with season number

/*
    panel += '						<div class="btn-group" data-toggle="buttons">';
    panel += '                      	<label class="btn btn-warning active" id="race_rank_all"><input type="radio" checked>All</input></label>';
    panel += ' 						 	<label class="btn btn-warning" id="race_rank_365"><input type="radio">Last year</input></label>';
    panel += ' 						 	<label class="btn btn-warning" id="race_rank_90"><input type="radio">Last 3 months</input></label>';
    panel += '							<label class="btn btn-warning" id="race_rank_7"><input type="radio">Last week</input></label>'; //Get dashboard getJSON info to show last update time 
	panel += '          			</div>';
*/


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
		var last_update = dashboardData[4][1];
    	var seasonSelect = document.getElementById('race_rank_seasondropdown');

    	for (var i = 1; i <= dashboardData[6][1]; i++) { //Seasons start at 1 and are consecutive.  //dashboardData[6][1]
	    	seasonSelect.options.add( new Option("Season " + i, i));
	    }

		$('#race_rank_seasondropdown').change(function(e){
	        e.preventDefault(); //idk why
	        var season = $(this).val();

            var cacheName = "raceRankCache" + (season > 0 ? season : "All");
            var updateTimeName = "raceRankCacheTime" + (season > 0 ? season : "All");

            //localStorage.removeItem(cacheName);
            //localStorage.removeItem(updateTimeName);


	        if(last_update > localStorage.getItem(updateTimeName) || !localStorage.getItem(cacheName)) { //Out of date
	        	//alert("Querying " + updateTimeName + " " + cacheName);
				GetRaceRank(season);
	        }
	        else 
	        {
	        	//alert("From Cache " + updateTimeName + " " + cacheName);
	        	data = JSON.parse(localStorage.getItem(cacheName));
	        	RaceRankTable(data);
	        }

	    });

	    $("#race_rank_seasondropdown").val(0).change(); //Need to trigger so onchange function is called on pageload

		function GetRaceRank(season) {
	        $.ajax({
	            type: "POST",
	            url: "ajax/getJSON.php",
	            dataType: "JSON",
	            async: true,
	            data: { option: "race_rank", season: season},
	            success: function(res) {
					RaceRankTable(res);

					var cacheName = "raceRankCache" + (season > 0 ? season : "All");
            		var updateTimeName = "raceRankCacheTime" + (season > 0 ? season : "All");
            		localStorage.setItem(cacheName, JSON.stringify(res));
                    localStorage.setItem(updateTimeName, last_update);
	            }
	        });
	    }

        function RaceRankTable(data) {
	        rank_table = $('#datatable_race_rank').DataTable( {
	        	 destroy: true,
	            "order": [[ 3, "desc" ]],
	            "bLengthChange": false,
	            "deferRender": true,
	            "dom": 'lrtp', //Hide search box
	            "data": data,
	            "columns": [                
	                { "data": null,  "render":
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
		}

/*
	    $("#race_rank_all").click(function(e) { //idk
	        var start_time = "0"; //-90 for last 3 months. -7 for last week(?) //0 for all. If set positive it specifies start filter. //TODO come up with good preset ranges (1 week, 3month?)
	        var end_time = "0"; //0 for all. If set it specifies end filter.
	        e.preventDefault();
	        $.ajax({
	            type: "POST",
	            url: "ajax/getJSON.php",
	            dataType: "JSON",
	            async: true,
	            data: { option: "race_rank", start_time: start_time, end_time: end_time },
	            success: function(res) {
	            	RaceRankTable(res);
	            }
	        });
	    });

	    $("#race_rank_365").click(function(e) {
	        var start_time = "-365"; //-90 for last 3 months. -7 for last week(?) //0 for all. If set positive it specifies start filter. //TODO come up with good preset ranges (1 week, 3month?)
	        var end_time = "0"; //0 for all. If set it specifies end filter.
	        e.preventDefault();
	        $.ajax({
	            type: "POST",
	            url: "ajax/getJSON.php",
	            dataType: "JSON",
	            async: true,
	            data: { option: "race_rank", start_time: start_time, end_time: end_time },
	            success: function(res) {
	            	RaceRankTable(res);
	            }
	        });
	    });

	    $("#race_rank_90").click(function(e) {
	        var start_time = "-90"; //-90 for last 3 months. -7 for last week(?) //0 for all. If set positive it specifies start filter. //TODO come up with good preset ranges (1 week, 3month?)
	        var end_time = "0"; //0 for all. If set it specifies end filter.
	        e.preventDefault();
	        $.ajax({
	            type: "POST",
	            url: "ajax/getJSON.php",
	            dataType: "JSON",
	            async: true,
	            data: { option: "race_rank", start_time: start_time, end_time: end_time },
	            success: function(res) {
	            	RaceRankTable(res);
	            }
	        });
	    });

	    $("#race_rank_7").click(function(e) {
	        var start_time = "-7"; //-90 for last 3 months. -7 for last week(?) //0 for all. If set positive it specifies start filter. //TODO come up with good preset ranges (1 week, 3month?)
	        var end_time = "0"; //0 for all. If set it specifies end filter.
	        e.preventDefault();
	        $.ajax({
	            type: "POST",
	            url: "ajax/getJSON.php",
	            dataType: "JSON",
	            async: true,
	            data: { option: "race_rank", start_time: start_time, end_time: end_time },
	            success: function(res) {
	            	RaceRankTable(res);
	            }
	        });
	    });
*/




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

    panel += '						<select id="race_list_seasondropdown" class="filter form-control input-sm"><option value="0">Show all</option></select>'; //Make this get populated by season numbers.  Make it send POST to getJSON to requery with season number

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
    	/*
		var last_update = dashboardData[4][1];
    	var seasonSelect = document.getElementById('race_list_seasondropdown');

    	for (var i = 1; i <= dashboardData[6][1]; i++) { //Seasons start at 1 and are consecutive.  //dashboardData[6][1]
	    	seasonSelect.options.add( new Option("Season " + i, i));
	    }

		$('#race_list_seasondropdown').change(function(e){
	        e.preventDefault(); //idk why
	        var season = $(this).val();

            var cacheName = "raceListCache" + (season > 0 ? season : "All");
            var updateTimeName = "raceListCacheTime" + (season > 0 ? season : "All");


	        if(last_update > localStorage.getItem(updateTimeName) || !localStorage.getItem(cacheName)) { //Out of date
	        	//alert("Querying " + updateTimeName + " " + cacheName);
				GetRaceList(season);
	        }
	        else 
	        {
	        	//alert("From Cache " + updateTimeName + " " + cacheName);
	        	data = JSON.parse(localStorage.getItem(cacheName));
	        	RaceListTable(data);
	        }

	    });

	    $("#race_list_seasondropdown").val(0).change(); //Need to trigger so onchange function is called on pageload

		function GetRaceList(season) {
	        $.ajax({
	            type: "POST",
	            url: "ajax/getJSON.php",
	            dataType: "JSON",
	            async: true,
	            data: { option: "race_list", season: season},
	            success: function(res) {
					RaceListTable(res);

					var cacheName = "raceListCache" + (season > 0 ? season : "All");
            		var updateTimeName = "raceListCacheTime" + (season > 0 ? season : "All");
            		localStorage.setItem(cacheName, JSON.stringify(res));
                    localStorage.setItem(updateTimeName, last_update);
	            }
	        });
	    }
	    */


	    var last_update = dashboardData[4][1];
    	var seasonSelect = document.getElementById('race_list_seasondropdown');

    	for (var i = 1; i <= dashboardData[6][1]; i++) { //Seasons start at 1 and are consecutive.  //dashboardData[6][1]
	    	seasonSelect.options.add( new Option("Season " + i, i));
	    }

		$('#race_list_seasondropdown').change(function(e){
	        e.preventDefault(); //idk why
	        var season = $(this).val();

            var cacheName = "raceListCache" + (season > 0 ? season : "All");
            var updateTimeName = "raceListCacheTime" + (season > 0 ? season : "All");

            //localStorage.removeItem(cacheName);
            //localStorage.removeItem(updateTimeName);


	        if(last_update > localStorage.getItem(updateTimeName) || !localStorage.getItem(cacheName)) { //Out of date
	        	//alert("Querying " + updateTimeName + " " + cacheName);
				GetRaceList(season);
	        }
	        else 
	        {
	        	//alert("From Cache " + updateTimeName + " " + cacheName);
	        	data = JSON.parse(localStorage.getItem(cacheName));
	        	RaceListTable(data);
	        }

	    });

		//AT END?s
	    $("#race_list_seasondropdown").val(0).change(); //Need to trigger so onchange function is called on pageload

		function GetRaceList(season) {
	        $.ajax({
	            type: "POST",
	            url: "ajax/getJSON.php",
	            dataType: "JSON",
	            async: true,
	            data: { option: "race_list", season: season},
	            success: function(res) {
					RaceListTable(res);

					var cacheName = "raceListCache" + (season > 0 ? season : "All");
            		var updateTimeName = "raceListCacheTime" + (season > 0 ? season : "All");
            		localStorage.setItem(cacheName, JSON.stringify(res));
                    localStorage.setItem(updateTimeName, last_update);
	            }
	        });
	    }

        function RaceListTable(data) {
        	//if (!data)
        		//return; //Why does data being null fuck up the entire race table formatting???

	        $('#datatable_race_list').DataTable( {
	        	destroy: true,
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
	                        return (type == 'filter') ? data : ('<a href=?page=player&name='+encodeURIComponent(data)+'>'+data+'</a>'); }},
	                { "data": 2, "render": 
	                    function ( data, type, row, meta ) { 
	                        return (type == 'filter') ? data : ('<button type="button" class="btn btn-warning btn-xs" data-hook="race_list_filter_course" value="'+data+'">' + data + '</button>') }},  
	                { "data": 3, "render": 
	                    function ( data, type, row, meta ) { 
	                        return (type == 'filter') ? RaceToString(data) : ('<button type="button" class="btn btn-warning btn-xs" data-hook="race_list_filter_style" value="'+data+'">' + RaceToString(data) + '</button>') }},  
	                { "data": 4 },
	                { "data": 5 },
	                { "data": 6, "render": 
	                    function ( data, type, row, meta ) { 
	                        var date = new Date(data*1000); //fixme the IP should be a global variable defined somewhere?
	                        return '<a href="http://162.248.89.208/races/'+encodeURIComponent(row[1])+'/'+encodeURIComponent(row[1])+'-'+encodeURIComponent(row[2].replace(" ", ""))+'-'
	                            +RaceToString(row[3]).toLowerCase()+'.dm_26">'+(date.getYear()-100) + '-' + ('0'+(date.getMonth()+1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) + ' ' 
	                            + ('0'+(date.getHours()+1)).slice(-2) + ':' + ('0'+(date.getMinutes()+1)).slice(-2) + '<a>' }},
	                { "data": 7, "sType": "num-durhtml", "className": "duration_ms", "render":
	                    function ( data, type, row, meta ) { 
	                        return '<td style="text-align: right;">'+RaceTimeToString(data)+'</td>' }} //Why doesnt this work..
	            ],  
	            initComplete: function () {     
					$('#datatable_race_list').on('click', 'button[data-hook="race_list_filter_style"]', function () {
						if (document.getElementById("race_list_styledropdown").value) {
							$("select[id='race_list_styledropdown']").val("").change()
						}
						else {
							$("select[id='race_list_styledropdown']").val($(this).val()).change()
						}
					});
					$('#datatable_race_list').on('click', 'button[data-hook="race_list_filter_course"]', function () {
						if (document.getElementById("race_list_coursedropdown").value) {
							$("select[id='race_list_coursedropdown']").val("").change()
						}
						else {
							$("select[id='race_list_coursedropdown']").val($(this).val()).change()
						}
					});
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
	                    var select = $('<select id="race_list_coursedropdown" class="filter form-control input-sm"><option value="">Show all</option></select>')
	                        .appendTo( $(column.footer()).empty() )
	                        .on( 'change', function () {
	                            var val = $.fn.dataTable.util.escapeRegex(
	                                $(this).val()
	                            );	                            
	                            if ($(this).val() == "") { //Update background image
	                            	document.getElementById("content-background").style.backgroundImage = null;
	                            }
	                            else {
		                           	var mapname = encodeURIComponent($(this).val());
		                           	mapname = mapname.replace(/%2F/gi, "/"); //Hmm
		                            document.getElementById("content-background").style.backgroundImage = 'linear-gradient(rgba(51, 53, 62, 0.7),rgba(51, 53, 62, 0.7)),url("../images/levelshots/'+mapname+'.jpg")';
	                        	}
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
	                    var select = $('<select id="race_list_styledropdown" class="filter form-control input-sm"><option value="">Show all</option></select>')
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
	            },
				"drawCallback": function( settings ) { //Pagination button active fixes - This causes a problem ?
					$(document).ready(function () {

/*
						$("#race_list_seasondropdown").val(0).change();

						if (document.getElementById("race_list_styledropdown").value) {
							var buttons = document.querySelectorAll("[data-hook=race_list_filter_style]");
						    for (var i = 0; i < buttons.length; i++){
						        buttons[i].className = "btn btn-warning btn-xs active"; //Use addclass / removeclass ?
						    }
						}
						else {
							var buttons = document.querySelectorAll("[data-hook=race_list_filter_style]");
						    for (var i = 0; i < buttons.length; i++){
						       	buttons[i].className = "btn btn-warning btn-xs";
							}
						}

						if (document.getElementById("race_list_coursedropdown").value) {
							var buttons = document.querySelectorAll("[data-hook=race_list_filter_course]");
						    for (var i = 0; i < buttons.length; i++){
						        buttons[i].className = "btn btn-warning btn-xs active"; //Use addclass / removeclass ?
						    }
						}
						else {
							var buttons = document.querySelectorAll("[data-hook=race_list_filter_course]");
						    for (var i = 0; i < buttons.length; i++){
						       	buttons[i].className = "btn btn-warning btn-xs";
							}
						}
						*/
					});
			    }
	        });
		}

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
    var HTML = '';
    HTML+='<div class="row">';
    HTML+='            <div class="col-lg-12">';
    HTML+='                <div class="view-header">';
    HTML+='                    <div class="pull-right text-right" style="line-height: 14px">';
    HTML+='                        <small>Stats<br><span class="c-white">Players</span></small>';
    HTML+='                    </div>';
    HTML+='                    <div class="header-icon">';
    HTML+='                        <i class="pe page-header-icon pe-7s-shield"></i>';
    HTML+='                    </div>';
    HTML+='                    <div class="header-title">';
    HTML+='                        <h3>'+ (player ? player : "Players") + ' (WIP) <button class="btn btn-warning" id="update_player">Update</button></h3>';
    HTML+='                        <select id="dropdown"></select>'; //Should be live-searchable 
    HTML+='                    </div>';
    HTML+='                </div>';
    HTML+='                <hr>';
    HTML+='            </div>';
    HTML+='        </div>';
    $("#main-content").append(HTML);

    var helpers = { 
        buildDropdown: function(result, dropdown, emptyMessage) { // Remove current options 
            dropdown.html(''); // Add the empty option with the empty message 
            dropdown.append('<option value="">' + emptyMessage + '</option>'); // Check result isnt empty 
            if(result != '') { // Loop through each of the results and append the option to the dropdown 
                $.each(result, function(k, v) { 
                    dropdown.append('<option value="' + v[0] + '">' + htmlEntities(v[0]) + '</option>'); //loda fixme does value need to be htmlentities too?
                }); 
            } 
        } 
    }

    var data = null;
    $.ajax({
        type: "POST",
        url: "ajax/getJSON.php",
        dataType: "JSON",
        async: false,
        data: { option: "player_accounts" },
        success: function(res) {
            data = res;
            helpers.buildDropdown( data, $('#dropdown'), 'Select a player' ); 
        }
    });

    //Update button
    $("#update_player").click(function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "ajax/updateDB.php",
            data: { option: "accounts" },
            success: function(result) {
            	location.reload();  //this is bad! it should just redraw the table..
                //alert('ok');
            },
            error: function(result) {
                //alert('error');
            }
        });
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
    $.ajax({
        type: "POST",
        url: "ajax/getJSON.php",
        dataType: "JSON",
        async: false,
        data: { option: "player_map_charts" },
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
                text: 'Most popular maps'
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
                      [data[5][0], Number(data[5][2])],
                      [data[6][0], Number(data[6][2])],
                      [data[7][0], Number(data[7][2])],
                      [data[8][0], Number(data[8][2])],
                      [data[9][0], Number(data[9][2])]
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
                text: 'Most exclusive map-styles'
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
                        [data[0][0]+" "+RaceToString(data[0][1]), Number(data[0][2])],
                        [data[1][0]+" "+RaceToString(data[1][1]), Number(data[1][2])],
                        [data[2][0]+" "+RaceToString(data[2][1]), Number(data[2][2])],
                        [data[3][0]+" "+RaceToString(data[3][1]), Number(data[3][2])],
                        [data[4][0]+" "+RaceToString(data[4][1]), Number(data[4][2])]
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
                      [RaceToString(data[10][1]), data[10][2]/1000], //Who knows why this doesnt need to be Number() formatted
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

//const arrayColumn = (arr, n) => arr.map(x => x[n]);
function player_duel_charts(){//
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
    $.ajax({
        type: "POST",
        url: "ajax/getJSON.php",
        dataType: "JSON",
        async: false,
        data: { option: "player_duel_charts" },
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

                //data: [arrayColumn(data, 0), arrayColumn(data, 1) ]



                data: [
                      [DuelToString(data[0][0]), Number(data[0][1])],
                      [DuelToString(data[1][0]), Number(data[1][1])],
                      [DuelToString(data[2][0]), Number(data[2][1])],
                      [DuelToString(data[3][0]), Number(data[3][1])],
                      [DuelToString(data[4][0]), Number(data[4][1])],
                      [DuelToString(data[5][0]), Number(data[5][1])],
                      [DuelToString(data[6][0]), Number(data[6][1])],
                      [DuelToString(data[7][0]), Number(data[7][1])],
                      [DuelToString(data[8][0]), Number(data[8][1])],
                      [DuelToString(data[9][0]), Number(data[9][1])],
                      [DuelToString(data[10][0]), Number(data[10][1])],
                      [DuelToString(data[11][0]), Number(data[11][1])],
                      [DuelToString(data[12][0]), Number(data[12][1])],
                      [DuelToString(data[13][0]), Number(data[13][1])],
                      [DuelToString(data[14][0]), Number(data[14][1])],
                ]


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

    var data = null;
    $.ajax({
        type: "POST",
        url: "ajax/getJSON.php",
        dataType: "JSON",
        async: true,
        data: { option: "player_race_stats", player: player},
        success: function(res) {
        	var data=res.map(Number); // ????
            PlayerRaceChart(data);
        }
    });

    function PlayerRaceChart(data) {
        var chart = new Highcharts.Chart({
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
    }

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
    panel += '                            <div id="player_duel_stats">';
    panel += '                            </div>';
    panel += '                            <div id="player_duel_graph">';
    panel += '                            </div>';
    panel += '                        </div>';
    panel += '                    </div>';
    panel += '                </div>';
    panel += '            </div>';
    $("#main-content").append(panel);

    $.ajax({
        type: "POST",
        url: "ajax/getJSON.php",
        dataType: "JSON",
        async: true,
        data: { option: "player_duel_stats", player: player},
        success: function(res) {
            PlayerDuelChart(res);
        }
    });

    function PlayerDuelChart(data) {
    	var chart = new Highcharts.Chart({
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
	}

    $.ajax({
        type: "POST",
        url: "ajax/getJSON.php",
        dataType: "JSON",
        async: true,
        data: { option: "player_duel_graph", player: player},
        success: function(res) {
        	PlayerDuelGraph(res);
        }
    });

	function PlayerDuelGraph(data) {
 		var dataSub = null;
	    for (i=0; i<15; i++) {
	        if (data[i] != undefined) {
	            dataSub.push(data[i][0]);

	        }
	    }

        var chart = new Highcharts.Chart({
            chart: {
                renderTo: 'player_duel_graph',
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
                type: 'line',
                name: 'Strength',
                data: dataSub
            }]
        });
    }

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

    var data = null;
    $.ajax({
        type: "POST",
        url: "ajax/getJSON.php",
        dataType: "JSON",
        async: false,
        data: { option: "player_race_chart", player: player},
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

    var data = null;
    $.ajax({
        type: "POST",
        url: "ajax/getJSON.php",
        dataType: "JSON",
        async: false,
        data: { option: "player_duel_graph", player: player},
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
		var HTML='';
        HTML+='<div class="row">';
        HTML+='<div class="col-md-4">';
        HTML+='  <h2>Trick Arena</h2>';
        HTML+='  <p>Map for race</p>';
        HTML+='  <p><a id="trickarena" class="btn btn-default" href="https://www.dropbox.com/s/z780uk203zma9h7/mapTrickArena.pk3?dl=1" role="button">Download</a></p>';
        HTML+='</div>';
        HTML+='<div class="col-md-4">';
        HTML+='  <h2>Race Arena</h2>';
        HTML+='  <p>Map for race</p>';
        HTML+='  <p><a id="racearena" class="btn btn-default" href="https://www.dropbox.com/s/fu6pbb8jvfvu2hm/mapRaceArena.pk3?dl=1" role="button">Download</a></p>';
        HTML+='</div>';
        HTML+='<div class="col-md-4">';
        HTML+='  <h2>Race Pack 1</h2>';
        HTML+='  <p>Map for race</p>';
        HTML+='  <p><a id="racepack1" class="btn btn-default" href="https://www.dropbox.com/s/84if2dkpuhr6572/mapRacepack1.pk3?dl=1" role="button">Download</a></p>';
        HTML+='</div>';
        HTML+='<div class="col-md-4">';
        HTML+='  <h2>Race Pack 2</h2>';
        HTML+='  <p>Map for race</p>';
        HTML+='  <p><a id="racepack2" class="btn btn-default" href="https://www.dropbox.com/s/4crbnrgqr248f81/mapRacepack2.pk3?dl=1" role="button">Download</a></p>';
        HTML+='</div>';
        HTML+='<div class="col-md-4">';
        HTML+='  <h2>Race Pack 3</h2>';
        HTML+='  <p>Map for race</p>';
        HTML+='  <p><a id="racepack3" class="btn btn-default" href="https://www.dropbox.com/s/kggwqzdxnzoekqz/mapRacepack3.pk3?dl=1" role="button">Download</a></p>';
        HTML+='</div>';
        HTML+='<div class="col-md-4">';
        HTML+='  <h2>Race Pack 4</h2>';
        HTML+='  <p>Map for race</p>';
        HTML+='  <p><a id="racepack4" class="btn btn-default" href="https://www.dropbox.com/s/at3n9gz4tvo6jia/mapRacePack4.pk3?dl=1" role="button">Download</a></p>';
        HTML+='</div>';
        HTML+='<div class="col-md-4">';
        HTML+='  <h2>Race Pack 5 Beta</h2>';
        HTML+='  <p>Map for race</p>';
        HTML+='  <p><a id="racepack5" class="btn btn-default" href="https://www.dropbox.com/s/esblp84azv4vwh0/mapRacepack5_beta.pk3?dl=1" role="button">Download</a></p>';
        HTML+='</div>';
        HTML+='<div class="col-md-4">';
        HTML+='  <h2>Race Pack 6 Beta</h2>';
        HTML+='  <p>Map for race</p>';
        HTML+='  <p><a id="racepack6" class="btn btn-default" href="https://www.dropbox.com/s/fdsb3sd8jbo3cpd/mapRacepack6_beta.pk3?dl=1" role="button">Download</a></p>';
        HTML+='</div>';
        HTML+='<div class="col-md-4">';
        HTML+='  <h2>Tritoch Pack</h2>';
        HTML+='  <p>CTF map pack</p>';
        HTML+='  <p><a id="tritoch" class="btn btn-default" href="https://www.dropbox.com/s/bwescubuoh4u53l/mapTritoch_pack.pk3?dl=1" role="button">Download</a></p>';
        HTML+='</div>';
        HTML+='<div class="col-md-4">';
        HTML+='  <h2>JK2 MP Maps</h2>';
        HTML+='  <p>JK Multiplayer map pack</p>';
        HTML+='  <p><a id="jk2" class="btn btn-default" href="https://www.dropbox.com/s/x4vl8siviy0d57t/mapJK2MultiplayerMaps.pk3?dl=1" role="button">Download</a></p>';
        HTML+='</div>';
        HTML+='</div>';
        $("#main-content").html(HTML);

        $('.jk-nav li').removeClass("active");
        $('#menu_maps').addClass("active");

        $(document).ready(function () {
			$( "#trickarena" ).mouseover(function() {
        		document.getElementById("content-background").style.backgroundImage = 'linear-gradient(rgba(51, 53, 62, 0.7),rgba(51, 53, 62, 0.7)),url("../images/levelshots/trickarena.jpg")';
			});
			$( "#racearena" ).mouseover(function() {
        		document.getElementById("content-background").style.backgroundImage = 'linear-gradient(rgba(51, 53, 62, 0.7),rgba(51, 53, 62, 0.7)),url("../images/levelshots/racearena.jpg")';
			});
			$( "#racepack1" ).mouseover(function() {
        		document.getElementById("content-background").style.backgroundImage = 'linear-gradient(rgba(51, 53, 62, 0.7),rgba(51, 53, 62, 0.7)),url("../images/levelshots/racepack1.jpg")';
			});
			$( "#racepack2" ).mouseover(function() {
        		document.getElementById("content-background").style.backgroundImage = 'linear-gradient(rgba(51, 53, 62, 0.7),rgba(51, 53, 62, 0.7)),url("../images/levelshots/racepack2.jpg")';
			});
			$( "#racepack3" ).mouseover(function() {
        		document.getElementById("content-background").style.backgroundImage = 'linear-gradient(rgba(51, 53, 62, 0.7),rgba(51, 53, 62, 0.7)),url("../images/levelshots/racepack3.jpg")';
			});
			$( "#racepack4" ).mouseover(function() {
        		document.getElementById("content-background").style.backgroundImage = 'linear-gradient(rgba(51, 53, 62, 0.7),rgba(51, 53, 62, 0.7)),url("../images/levelshots/racepack4.jpg")';
			});
			$( "#racepack5" ).mouseover(function() {
        		document.getElementById("content-background").style.backgroundImage = 'linear-gradient(rgba(51, 53, 62, 0.7),rgba(51, 53, 62, 0.7)),url("../images/levelshots/racepack5.jpg")';
			});
			$( "#racepack6" ).mouseover(function() {
        		document.getElementById("content-background").style.backgroundImage = 'linear-gradient(rgba(51, 53, 62, 0.7),rgba(51, 53, 62, 0.7)),url("../images/levelshots/racepack6.jpg")';
			});
		});
	}

function servers(){
	var HTML = '';
   		HTML+='<div class="row">';
        HTML+='<div class="col-md-4">';
        HTML+='  <h2>.ups playja.pro</h2>';
        HTML+='  <p>/connect s.playja.pro</p>';
        HTML+='</div>';
        HTML+='</div>';
        $("#main-content").html(HTML);

        $('.jk-nav li').removeClass("active");
        $('#menu_maps').addClass("active");
}

var duelnames = [
    "Saber",
    "Force",
    "Unknown",
    "Unknown",
    "Melee",
    "Unknown",
    "Pistol",
    "Blaster",
    "Sniper",
    "Bowcaster",
    "Repeater",
    "Demp2",
    "Flechette",
    "Rocket",
    "Thermal",
    "Trip mine",
    "Det pack",
    "Concussion",
    "Bryar pistol",
    "Stun baton",
    "All weapons"
];

function DuelToString(type) {
	var number = Number(type);

	if (number >= 0 && number < duelnames.length)
		return duelnames[number];
	else return "Unknown";
}

racenames = [
	"Siege",
	"JKA",
	"QW",
	"CPM",
	"Q3",
	"PJK",
	"WSW",
	"RJQ3",
	"RJCPM",
	"Swoop",
	"Jetpack",
	"Speed",
	"SP"
];

function RaceToString(type) {
	var number = Number(type);

	if (number >= 0 && number < racenames.length)
		return racenames[number];
	else if (number == 99)
		return "All";
	else return "Unknown";
}

function DuelToString2(type) {
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

function RaceToString2(val){
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

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function timeSince(seconds) {

  var interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + " years";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}