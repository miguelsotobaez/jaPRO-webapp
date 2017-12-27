<?php
require_once('inc/config.inc.php');
require_once('inc/page.inc.php');

?>
<!DOCTYPE html>
<html>
<?php include('layouts/head.php'); ?>
<body>

<!-- Wrapper-->
<div class="wrapper">

    <?php include('layouts/header.php'); ?>

    <!-- Navigation-->
    <aside class="navigation">
        <nav>
            <ul class="nav jk-nav">
                <li class="nav-category">
                    Main
                </li>
                <li id="menu_home">
                    <a href="?page=home">Home</a>
                </li>
                <li id="menu_maps">
                    <a href="?page=maps">Maps</a>
                </li>
                <li id="menu_servers">
                    <a href="?page=servers">Servers</a>
                </li>
                
                <li class="nav-category">
                    Stats
                </li>

                <li id="menu_player">
                    <a href="?page=player"> Player</a>
                </li>        
                <li id="menu_duel">
                    <a href="?page=duel"> Duel</a>
                </li>
                <li id="menu_race">
                    <a href="?page=race"> Race</a>
                </li>
                

                <li class="nav-info">
                    <i class="pe pe-7s-shield text-accent"></i>
                    <div class="m-t-xs">
                        <span class="c-white">JK</span> stats theme with Dark UI style for monitoring stats from japro servers.
                    </div>
                </li>
            </ul>
        </nav>
    </aside>
    <!-- End navigation-->


    <!-- Main content-->
    <section class="content" id="content-background">      
            <div id="main-content" class="container-fluid">

               

            </div>
    </section>
    <!-- End main content-->

</div>
<!-- End wrapper-->

<script type="text/javascript">
    var page = "<?php Print($page); ?>";
    var player = "<?php Print($player); ?>";
    var race = "<?php Print($race); ?>";
</script>

<!-- Vendor scripts -->
<script src="vendor/jquery/dist/jquery.min.js"></script>
<script src="vendor/bootstrap/js/bootstrap.min.js"></script>
<script src="vendor/datatables/datatables.min.js"></script>
<script src="vendor/datatables/plugins.js"></script>
<script src="vendor/highcharts/js/highcharts.js"></script>
<script src="scripts/highcharts.jk.theme.js"></script>

<!-- App scripts -->
<script src="scripts/jk.js"></script>


</body>

</html>