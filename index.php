<?php
require_once('inc/config.inc.php');
require_once('inc/option.inc.php');

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
                    <a href="?option=home">Home</a>
                </li>
                <li id="menu_maps">
                    <a href="?option=maps">Maps</a>
                </li>
                <li id="menu_servers">
                    <a href="?option=servers">Servers</a>
                </li>
                
                <li class="nav-category">
                    Stats
                </li>

                <li id="menu_player">
                    <a href="?option=ladder_player"> Player</a>
                </li>        
                <li id="menu_duel">
                    <a href="?option=ladder_duel"> Duel</a>
                </li>
                <li id="menu_race">
                    <a href="?option=ladder_race"> Race</a>
                </li>
                

                <li class="nav-info">
                    <i class="pe pe-7s-shield text-accent"></i>
                    <div class="m-t-xs">
                        <span class="c-white">JK</span> stats theme with Dark UI style for monitoring stats from japro servers. Thanks to Loda and his team to work on this awesome mod.
                    </div>
                </li>
            </ul>
        </nav>
    </aside>
    <!-- End navigation-->


    <!-- Main content-->
    <section class="content">
            <div id="main-content" class="container-fluid">

               

            </div>
    </section>
    <!-- End main content-->

</div>
<!-- End wrapper-->

<script type="text/javascript">
    var option = "<?php Print($option); ?>";
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