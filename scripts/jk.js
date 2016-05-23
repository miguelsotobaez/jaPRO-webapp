/**
 * JK - Responsive Admin Theme
 *
 */

$(document).ready(function () {
    //home
    //ladder_saber
    //ladder_fullforce
    //ladder_guns
    //ladder_run
    //download

    if(option=="home"){
        home();
    }else if(option=="ladder_saber"){
        ladder_saber_title();
        ladder_saber_top_rank();
        ladder_saber_duel_count();
        ladder_saber_duel_list();
    }else if(option=="ladder_fullforce"){
        ladder_fullforce_title();
        ladder_fullforce_top_rank();
        ladder_fullforce_duel_count();
        ladder_fullforce_duel_list();
    }else if(option=="ladder_guns"){
        ladder_guns_title();
        ladder_guns_top_rank();
        ladder_guns_duel_count();
        ladder_guns_duel_list();
    }else if(option=="ladder_run"){
        ladder_race_title();
        ladder_race_top_rank();
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
    $("#main-content").html('<div class="container"><h1>!Bienvenidos a JKLATAM!</h1><p>JKLATAM es una comunidad Jedi Knight Latina que tiene como proposito juntar a los mejores players para competir en un sistema de ranking, este sistema de ranking solo es posibles gracias al mod JAPRO. Agradecimientos a Loda y su equipo por sus contribuciones a este magnifico mod.</p><p><a class="btn btn-warning btn-lg" href="mod/japro3.pk3" role="button">Descargar JAPRO</a></p></div>');
    $('.jk-nav li').removeClass("active");
    $('#menu_home').addClass("active");
}

//////////////////////////////////////////////////////////////////////////
/////////////////////////////////SABER////////////////////////////////////
/////////////////////////////////SABER////////////////////////////////////
/////////////////////////////////SABER////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

function ladder_saber_title(){
    var HTML;
    HTML='<div class="row">';
    HTML+='            <div class="col-lg-12">';
    HTML+='                <div class="view-header">';
    HTML+='                    <div class="pull-right text-right" style="line-height: 14px">';
    HTML+='                        <small>Stats<br><span class="c-white">Saber</span></small>';
    HTML+='                    </div>';
    HTML+='                    <div class="header-icon">';
    HTML+='                        <i class="pe page-header-icon pe-7s-shield"></i>';
    HTML+='                    </div>';
    HTML+='                    <div class="header-title">';
    HTML+='                        <h3>Saber</h3>';
    HTML+='                        <small>';
    HTML+='                            Now you can see your saber duel stats.';
    HTML+='                        </small>';
    HTML+='                    </div>';
    HTML+='                </div>';
    HTML+='                <hr>';
    HTML+='            </div>';
    HTML+='        </div>';
    $("#main-content").append(HTML);
}

function ladder_saber_top_rank(){

    var panel;
    panel = '<div id="second_row" class="row">';
    panel += '  <div class="col-md-8">';
    panel += '      <div class="panel panel-filled">';
    panel += '          <div class="panel-heading">';
    panel += '              Saber Rank List';
    panel += '          </div>';
    panel += '          <div class="panel-body">';
    panel += '              <p>This is the saber rank list, ordered by ELO.</p>';
    panel += '              <div class="table-responsive">';
    panel += '                  <table id="datatable_ladder_saber_top_rank" class="table table-striped table-hover"></table>';
    panel += '              </div>';
    panel += '          </div>';
    panel += '      </div>';
    panel += '  </div>';
    panel += '</div>';

    $("#main-content").append(panel);

    var item = "ladder_saber_top_rank";
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
                header += "<th>Elo</th>";
                header += "<th data-hide='phone,tablet'>TS</th>";
            header += "</tr>";
            header += "</thead>";
            content = "<tbody>";
            if(res){
                $.each( res, function( key, value ) {
                    content += "<tr class='table' id='"+value.id+"'>";
                        content += "<td>"+value.position+"</td>";
                        content += "<td>"+value.username+"</td>";
                        content += "<td>"+value.rank+"</td>";
                        content += "<td>"+value.TSSUM+"</td>";
                    content += "</tr>";
                });
            }
            content += "</tbody>";
            $("#datatable_ladder_saber_top_rank").html(header+content);
        }
    });

    $('#datatable_ladder_saber_top_rank').DataTable({
        "dom": "<'row'<'col-sm-6'l><'col-sm-6'f>>t<'row'<'col-sm-6'i><'col-sm-6'p>>",
        "responsive": true,
        "order": [[ 0, "asc" ]]
    });
}

function ladder_saber_duel_count(){
    var panel = "";
    panel += '  <div class="col-md-4">';
    panel += '                    <div class="panel panel-filled">';
    panel += '                      <div class="panel-heading">';
    panel += '                          Saber Duel Count';
    panel += '                      </div>';
    panel += '                        <div class="panel-body">';
    panel += '                            <p>This is the saber rank list, ordered by ELO.</p>';
    panel += '                            <div id="chart_saber_duel_count">';
    panel += '                            </div>';
    panel += '                        </div>';
    panel += '                    </div>';
    panel += '                </div>';
    $("#main-content #second_row").append(panel);

    var data = null;
    var item = "ladder_saber_duel_count";
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


    var chart;
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'chart_saber_duel_count',
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

function ladder_saber_duel_list(){
    
    var panel;
    panel = '<div id="second_row" class="row">';
    panel += '  <div class="col-md-12">';
    panel += '      <div class="panel panel-filled">';
    panel += '          <div class="panel-heading">';
    panel += '              Saber Last Duel List';
    panel += '          </div>';
    panel += '          <div class="panel-body">';
    panel += '              <p>Here you can see the registri of all saber duels in japro server.</p>';
    panel += '              <div class="table-responsive">';
    panel += '                  <table id="datatable_ladder_saber_last_duels" class="table table-striped table-hover"></table>';
    panel += '              </div>';
    panel += '          </div>';
    panel += '      </div>';
    panel += '  </div>';
    panel += '</div>';

    $("#main-content").append(panel);

    var item = "ladder_saber_last_duels";
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
                header += "<th data-hide='phone,tablet'>Winner HP</th>";
                header += "<th data-hide='phone,tablet'>Winner Shield</th>";
                header += "<th data-hide='phone,tablet'>Duration</th>";
                header += "<th data-hide='phone,tablet'>End Time</th>";
            header += "</tr>";
            header += "</thead>";
            content = "<tbody>";
            $.each( res, function( key, value ) {
                content += "<tr class='table' id='"+value.id+"'>";
                    content += "<td>"+value.winner+"</td>";
                    content += "<td>"+value.loser+"</td>";
                    content += "<td>"+value.winner_hp+"</td>";
                    content += "<td>"+value.winner_shield+"</td>";
                    content += "<td>"+value.duration+"</td>";
                    content += "<td>"+value.end_time+"</td>";
                content += "</tr>";
            });
            content += "</tbody>";
            $("#datatable_ladder_saber_last_duels").html(header+content);
        }
    });

    $('#datatable_ladder_saber_last_duels').DataTable({
        "responsive": true,
        "order": [[ 5, "desc" ]]
    });
}

//////////////////////////////////////////////////////////////////////////
///////////////////////////////FULLFORCE//////////////////////////////////
///////////////////////////////FULLFORCE//////////////////////////////////
///////////////////////////////FULLFORCE//////////////////////////////////
//////////////////////////////////////////////////////////////////////////


function ladder_fullforce_title(){
    var HTML;
    HTML='<div class="row">';
    HTML+='            <div class="col-lg-12">';
    HTML+='                <div class="view-header">';
    HTML+='                    <div class="pull-right text-right" style="line-height: 14px">';
    HTML+='                        <small>Stats<br><span class="c-white">Full Force</span></small>';
    HTML+='                    </div>';
    HTML+='                    <div class="header-icon">';
    HTML+='                        <i class="pe page-header-icon pe-7s-shield"></i>';
    HTML+='                    </div>';
    HTML+='                    <div class="header-title">';
    HTML+='                        <h3>Full Force</h3>';
    HTML+='                        <small>';
    HTML+='                            Now you can see your fullforce duel stats.';
    HTML+='                        </small>';
    HTML+='                    </div>';
    HTML+='                </div>';
    HTML+='                <hr>';
    HTML+='            </div>';
    HTML+='        </div>';
    $("#main-content").append(HTML);
}

function ladder_fullforce_top_rank(){

    var panel;
    panel = '<div id="second_row" class="row">';
    panel += '  <div class="col-md-8">';
    panel += '      <div class="panel panel-filled">';
    panel += '          <div class="panel-heading">';
    panel += '              Full Force Rank List';
    panel += '          </div>';
    panel += '          <div class="panel-body">';
    panel += '              <p>This is the full force rank list, ordered by ELO.</p>';
    panel += '              <div class="table-responsive">';
    panel += '                  <table id="datatable_ladder_fullforce_top_rank" class="table table-striped table-hover"></table>';
    panel += '              </div>';
    panel += '          </div>';
    panel += '      </div>';
    panel += '  </div>';
    panel += '</div>';

    $("#main-content").append(panel);

    var item = "ladder_fullforce_top_rank";
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
                header += "<th>Elo</th>";
                header += "<th data-hide='phone,tablet'>TS</th>";
            header += "</tr>";
            header += "</thead>";
            content = "<tbody>";
            if(res){
                $.each( res, function( key, value ) {
                    content += "<tr class='table' id='"+value.id+"'>";
                        content += "<td>"+value.position+"</td>";
                        content += "<td>"+value.username+"</td>";
                        content += "<td>"+value.rank+"</td>";
                        content += "<td>"+value.TSSUM+"</td>";
                    content += "</tr>";
                });
            }
            content += "</tbody>";
            $("#datatable_ladder_fullforce_top_rank").html(header+content);
        }
    });

    $('#datatable_ladder_fullforce_top_rank').DataTable({
        "dom": "<'row'<'col-sm-6'l><'col-sm-6'f>>t<'row'<'col-sm-6'i><'col-sm-6'p>>",
        "responsive": true,
        "order": [[ 0, "asc" ]]
    });
}

function ladder_fullforce_duel_count(){

    var panel = "";
    panel += '  <div class="col-md-4">';
    panel += '                    <div class="panel panel-filled">';
    panel += '                      <div class="panel-heading">';
    panel += '                          Full Force Duel Count';
    panel += '                      </div>';
    panel += '                        <div class="panel-body">';
    panel += '                            <p>This is the full force rank list, ordered by ELO.</p>';
    panel += '                            <div id="chart_fullforce_duel_count">';
    panel += '                            </div>';
    panel += '                        </div>';
    panel += '                    </div>';
    panel += '                </div>';
    $("#main-content #second_row").append(panel);

    var data = null;
    var item = "ladder_fullforce_duel_count";
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

    var chart;
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'chart_fullforce_duel_count',
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
    $('#menu_fullforce').addClass("active");
}

function ladder_fullforce_duel_list(){
    
    var panel;
    panel = '<div id="second_row" class="row">';
    panel += '  <div class="col-md-12">';
    panel += '      <div class="panel panel-filled">';
    panel += '          <div class="panel-heading">';
    panel += '              Full Force Last Duel List';
    panel += '          </div>';
    panel += '          <div class="panel-body">';
    panel += '              <p>Here you can see the registri of all saber duels in japro server.</p>';
    panel += '              <div class="table-responsive">';
    panel += '                  <table id="datatable_ladder_fullforce_last_duels" class="table table-striped table-hover"></table>';
    panel += '              </div>';
    panel += '          </div>';
    panel += '      </div>';
    panel += '  </div>';
    panel += '</div>';

    $("#main-content").append(panel);

    var item = "ladder_fullforce_last_duels";
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
                header += "<th data-hide='phone,tablet'>Winner HP</th>";
                header += "<th data-hide='phone,tablet'>Winner Shield</th>";
                header += "<th data-hide='phone,tablet'>Duration</th>";
                header += "<th data-hide='phone,tablet'>End Time</th>";
            header += "</tr>";
            header += "</thead>";
            content = "<tbody>";
            $.each( res, function( key, value ) {
                content += "<tr class='table' id='"+value.id+"'>";
                    content += "<td>"+value.winner+"</td>";
                    content += "<td>"+value.loser+"</td>";
                    content += "<td>"+value.winner_hp+"</td>";
                    content += "<td>"+value.winner_shield+"</td>";
                    content += "<td>"+value.duration+"</td>";
                    content += "<td>"+value.end_time+"</td>";
                content += "</tr>";
            });
            content += "</tbody>";
            $("#datatable_ladder_fullforce_last_duels").html(header+content);
        }
    });

    $('#datatable_ladder_fullforce_last_duels').DataTable({
        "responsive": true,
        "order": [[ 5, "desc" ]]
    });
}

//////////////////////////////////////////////////////////////////////////
//////////////////////////////////GUNS////////////////////////////////////
//////////////////////////////////GUNS////////////////////////////////////
//////////////////////////////////GUNS////////////////////////////////////
//////////////////////////////////////////////////////////////////////////


function ladder_guns_title(){

    var HTML;
    HTML='<div class="row">';
    HTML+='            <div class="col-lg-12">';
    HTML+='                <div class="view-header">';
    HTML+='                    <div class="pull-right text-right" style="line-height: 14px">';
    HTML+='                        <small>Stats<br><span class="c-white">Guns</span></small>';
    HTML+='                    </div>';
    HTML+='                    <div class="header-icon">';
    HTML+='                        <i class="pe page-header-icon pe-7s-shield"></i>';
    HTML+='                    </div>';
    HTML+='                    <div class="header-title">';
    HTML+='                        <h3>Guns</h3>';
    HTML+='                        <small>';
    HTML+='                            Now you can see your guns duel stats.';
    HTML+='                        </small>';
    HTML+='                    </div>';
    HTML+='                </div>';
    HTML+='                <hr>';
    HTML+='            </div>';
    HTML+='        </div>';
    $("#main-content").append(HTML);
}

function ladder_guns_top_rank(){

    var panel;
    panel = '<div id="second_row" class="row">';
    panel += '  <div class="col-md-8">';
    panel += '      <div class="panel panel-filled">';
    panel += '          <div class="panel-heading">';
    panel += '              Guns Rank List';
    panel += '          </div>';
    panel += '          <div class="panel-body">';
    panel += '              <p>This is the guns rank list, ordered by ELO.</p>';
    panel += '              <div class="table-responsive">';
    panel += '                  <div class="col-sm-6 dataTables_filter" id="selectTriggerType"><label>Type:</label></div>';
    panel += '                  <table id="datatable_ladder_guns_top_rank" class="table table-striped table-hover"></table>';
    panel += '              </div>';
    panel += '          </div>';
    panel += '      </div>';
    panel += '  </div>';
    panel += '</div>';
    $("#main-content").append(panel);

    var item = "ladder_guns_top_rank";
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
                header += "<th>Rank</th>";
                header += "<th data-hide='phone,tablet'>TS</th>";
            header += "</tr>";
            header += "</thead>";
            content = "<tbody>";
            if(res){
                $.each( res, function( key, value ) {
                    content += "<tr class='table' id='"+value.id+"'>";
                        content += "<td></td>";
                        content += "<td>"+value.username+"</td>";
                        content += "<td>"+value.type+"</td>";
                        content += "<td>"+value.rank+"</td>";
                        content += "<td>"+value.TSSUM+"</td>";
                    content += "</tr>";
                });
            }
            content += "</tbody>";
            $("#datatable_ladder_guns_top_rank").html(header+content);
        }
    });

    $('#datatable_ladder_guns_top_rank').DataTable({
            "responsive": true,
            "bInfo" : false,
            "bPaginate": false,
            "bLengthChange": false,
            "bFilter": true,
            "order": [[ 3, "desc" ]],
            "columnDefs": [
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
            "aaSorting": [[ 3, 'desc' ]],
            initComplete: function () {
                var columnType = this.api().column(2);

                var selectType = $('<select class="filter form-control"></select>').appendTo('#selectTriggerType').on('change', function () {
                    var valType = $(this).val();
                    columnType.search(valType, false, false).draw();
                });

                columnType.data().unique().sort().each(function (d, j) {
                    selectType.append('<option value="' + d + '">' + d + '</option>');
                });

            }
    });

    $('#selectTriggerType').find('select').trigger('change');
}

function ladder_guns_duel_count(){

    var panel = "";
    panel += '  <div class="col-md-4">';
    panel += '                    <div class="panel panel-filled">';
    panel += '                      <div class="panel-heading">';
    panel += '                          Guns Duel Count';
    panel += '                      </div>';
    panel += '                        <div class="panel-body">';
    panel += '                            <p>This is the guns rank list, ordered by ELO.</p>';
    panel += '                            <div id="chart_guns_duel_count">';
    panel += '                            </div>';
    panel += '                        </div>';
    panel += '                    </div>';
    panel += '                </div>';
    $("#main-content #second_row").append(panel);

    var data = null;
    var item = "ladder_guns_duel_count";
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

    if(data){
        var chart;
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'chart_guns_duel_count',
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
    }
    $('.jk-nav li').removeClass("active");
    $('#menu_guns').addClass("active");
    
}

function ladder_guns_duel_list(){
    
    var panel;
    panel = '<div id="second_row" class="row">';
    panel += '  <div class="col-md-12">';
    panel += '      <div class="panel panel-filled">';
    panel += '          <div class="panel-heading">';
    panel += '              Guns Last Duel List';
    panel += '          </div>';
    panel += '          <div class="panel-body">';
    panel += '              <p>Here you can see the registri of all guns duels in japro server.</p>';
    panel += '              <div class="table-responsive">';
    panel += '                  <table id="datatable_ladder_guns_last_duels" class="table table-striped table-hover"></table>';
    panel += '              </div>';
    panel += '          </div>';
    panel += '      </div>';
    panel += '  </div>';
    panel += '</div>';

    $("#main-content").append(panel);

    var item = "ladder_guns_last_duels";
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
                header += "<th data-hide='phone,tablet'>Winner HP</th>";
                header += "<th data-hide='phone,tablet'>Winner Shield</th>";
                header += "<th data-hide='phone,tablet'>Duration</th>";
                header += "<th data-hide='phone,tablet'>End Time</th>";
            header += "</tr>";
            header += "</thead>";
            content = "<tbody>";
            $.each( res, function( key, value ) {
                content += "<tr class='table' id='"+value.id+"'>";
                    content += "<td>"+value.winner+"</td>";
                    content += "<td>"+value.loser+"</td>";
                    content += "<td>"+value.winner_hp+"</td>";
                    content += "<td>"+value.winner_shield+"</td>";
                    content += "<td>"+value.duration+"</td>";
                    content += "<td>"+value.end_time+"</td>";
                content += "</tr>";
            });
            content += "</tbody>";
            $("#datatable_ladder_guns_last_duels").html(header+content);
        }
    });

    $('#datatable_ladder_guns_last_duels').DataTable({
        "responsive": true,
        "order": [[ 5, "desc" ]]
    });
}

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

function ladder_race_top_rank(){

    var panel;
    panel = '<div id="second_row" class="row">';
    panel += '  <div class="col-md-12">';
    panel += '      <div class="panel panel-filled">';
    panel += '          <div class="panel-heading">';
    panel += '              Guns Rank List';
    panel += '          </div>';
    panel += '          <div class="panel-body">';
    panel += '              <p>This is the guns rank list, ordered by ELO.</p>';
    panel += '              <div class="table-responsive">';
    panel += '                  <div class="col-sm-6" id="selectTriggerMap"><label>Map:</label></div>';
    panel += '                  <div class="col-sm-6" id="selectTriggerStyle"><label>Style:</label></div>';
    panel += '                  <table id="datatable_ladder_race_top_rank" class="table table-striped table-hover"></table>';
    panel += '              </div>';
    panel += '          </div>';
    panel += '      </div>';
    panel += '  </div>';
    panel += '</div>';
    $("#main-content").append(panel);

    var item = "ladder_race_top_rank";
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
                header += "<th>position</th>";
                header += "<th>username</th>";
                header += "<th>coursename</th>";
                header += "<th>style</th>";
                header += "<th>duration</th>";
                header += "<th data-hide='phone,tablet'>topspeed</th>";
                header += "<th data-hide='phone,tablet'>average</th>";
                header += "<th data-hide='phone,tablet'>end time</th>";
            header += "</tr>";
            header += "</thead>";
            content = "<tbody>";
            if(res){
                $.each( res, function( key, value ) {
                    content += "<tr class='table' id='"+value.id+"'>";
                        content += "<td></td>";
                        content += "<td>"+value.username+"</td>";
                        content += "<td>"+value.coursename+"</td>";
                        content += "<td>"+value.style+"</td>";
                        content += "<td>"+value.duration_ms+"</td>";
                        content += "<td>"+value.topspeed+"</td>";
                        content += "<td>"+value.average+"</td>";
                        content += "<td>"+value.end_time+"</td>";
                    content += "</tr>";
                });
            }
            content += "</tbody>";
            $("#datatable_ladder_race_top_rank").html(header+content);
        }
    });

   

    $('#datatable_ladder_race_top_rank').DataTable({
            "responsive": true,
            "bInfo" : false,
            "bPaginate": false,
            "bLengthChange": false,
            "bFilter": true,
            "order": [[ 4, "asc" ]],
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
                var columnMap = this.api().column(2);
                var columnStyle = this.api().column(3);

                var selectMap = $('<select class="filter form-control"></select>').appendTo('#selectTriggerMap').on('change', function () {
                    var valMap = $(this).val();
                    columnMap.search(valMap, false, false).draw();
                });

                var selectStyle = $('<select class="filter form-control"></select>').appendTo('#selectTriggerStyle').on('change', function () {
                    var valStyle = $(this).val();
                    columnStyle.search(valStyle, false, false).draw();
                });

                columnMap.data().unique().sort().each(function (d, j) {
                    selectMap.append('<option value="' + d + '">' + d + '</option>');
                });

                columnStyle.data().unique().sort().each(function (d, j) {
                    selectStyle.append('<option value="' + d + '">' + d + '</option>');
                });
            }

        });

    $('#selectTriggerMap').find('select').trigger('change');
    $('#selectTriggerStyle').find('select').trigger('change');

    $('.jk-nav li').removeClass("active");
    $('#menu_race').addClass("active");
   
}


function maps(){
    

        HTML='<div class="row">';
        HTML+='<div class="col-md-4">';
        HTML+='  <h2>The Academy v2</h2>';
        HTML+='  <p>Muy usado por la comunidad  </p>';
        HTML+='  <p><a class="btn btn-default" href="maps/the_academy_v2.pk3" role="button">Descargar</a></p>';
        HTML+='</div>';
        HTML+='<div class="col-md-4">';
        HTML+='  <h2>Race Pack 1</h2>';
        HTML+='  <p>Mapa de carreras usado por UPS Gaming </p>';
        HTML+='  <p><a class="btn btn-default" href="maps/mapRacepack1.pk3" role="button">Descargar</a></p>';
        HTML+='</div>';
        HTML+='<div class="col-md-4">';
        HTML+='  <h2>Race Pack 2</h2>';
        HTML+='  <p>Mapa de carreras usado por UPS Gaming </p>';
        HTML+='  <p><a class="btn btn-default" href="maps/mapRacepack2.pk3" role="button">Descargar</a></p>';
        HTML+='</div>';
        HTML+='<div class="col-md-4">';
        HTML+='  <h2>Race Pack 3</h2>';
        HTML+='  <p>Mapa de carreras usado por UPS Gaming </p>';
        HTML+='  <p><a class="btn btn-default" href="maps/mapRacepack3.pk3" role="button">Descargar</a></p>';
        HTML+='</div>';
        HTML+='<div class="col-md-4">';
        HTML+='  <h2>Race Pack 4</h2>';
        HTML+='  <p>Mapa de carreras usado por UPS Gaming </p>';
        HTML+='  <p><a class="btn btn-default" href="maps/mapRacepack4.pk3" role="button">Descargar</a></p>';
        HTML+='</div>';
        HTML+='<div class="col-md-4">';
        HTML+='  <h2>Race Arena</h2>';
        HTML+='  <p>Mapa de carreras usado por UPS Gaming </p>';
        HTML+='  <p><a class="btn btn-default" href="maps/mapRaceArena.pk3" role="button">Descargar</a></p>';
        HTML+='</div>';
        HTML+='<div class="col-md-4">';
        HTML+='  <h2>Tritoch Pack</h2>';
        HTML+='  <p>Mapa de carreras usado por UPS Gaming </p>';
        HTML+='  <p><a class="btn btn-default" href="maps/mapTritoch_pack.pk3" role="button">Descargar</a></p>';
        HTML+='</div>';
        HTML+='<div class="col-md-4">';
        HTML+='  <h2>JK2 MP Maps</h2>';
        HTML+='  <p>Un mapa para nostalgicos </p>';
        HTML+='  <p><a class="btn btn-default" href="maps/mapJK2MultiplayerMaps.pk3" role="button">Descargar</a></p>';
        HTML+='</div>';
        HTML+='</div>';
        $("#main-content").html(HTML);

        $('.jk-nav li').removeClass("active");
        $('#menu_maps').addClass("active");
}
        



