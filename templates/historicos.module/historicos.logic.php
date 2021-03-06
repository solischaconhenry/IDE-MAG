<?php

class historico
{
    function getFincas($idUsuario){
        include '../main.module/acceso.php';
        $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

        $query = "select gid from fincas where iduser = $idUsuario"; 
        $result =pg_query($conn, $query) or die("Error al ejecutar la consulta");
        $row =  pg_fetch_all($result);
        return $row;
    }

    function getFincasTodo($idUsuario){
            include '../main.module/acceso.php';
            $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

            $query = "select * from fincas where iduser = $idUsuario";
            $result =pg_query($conn, $query) or die("Error al ejecutar la consulta");
            $row =  pg_fetch_all($result);
            return $row;
        }
    function getPreview($gidFinca){
        include '../main.module/acceso.php';
        $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");


        $query = "SELECT max(st_xmax(geom))-min(st_xmin(geom)) xinicial, max(st_ymax(geom))-min(st_ymin(geom)) yinicial FROM apartos where gidfinca = $gidFinca";
        $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");
        $row =  pg_fetch_row($result);

        if($row[0] < $row[1]){
            $query = "
                SELECT 	gid, 
                    ((geometria.x - medidas.xinicial)/medidas.factor) x, 
                    (430 - ((geometria.y - medidas.yinicial)/medidas.factor)) y
                FROM
                   (SELECT
                    gid,
                    st_x((ST_DumpPoints(geom)).geom) x,
                    st_y((ST_DumpPoints(geom)).geom) y
                    FROM
                       (SELECT gid, geom  FROM apartos tab where gidfinca = $gidFinca and estado = 0) s
                   ) geometria,
                   (SELECT
                       min(st_xmin(geom)) xinicial,
                       (max(st_ymax(geom))-min(st_ymin(geom)))/430 factor,
                       min(st_ymin(geom)) yinicial
                    FROM
                       apartos
                    where gidfinca = $gidFinca and estado = 0
                   ) medidas;";
        }
        else{
            $query = "
                SELECT 	gid,
                    ((geometria.x - medidas.xinicial)/medidas.factor) x,
                    (430 - ((geometria.y - medidas.yinicial)/medidas.factor)) y
                FROM
                   (SELECT
                    gid,
                    st_x((ST_DumpPoints(geom)).geom) x,
                    st_y((ST_DumpPoints(geom)).geom) y
                    FROM
                       (SELECT gid, geom  FROM apartos tab where gidfinca = $gidFinca and estado = 0) s
                   ) geometria,
                   (SELECT
                       min(st_xmin(geom)) xinicial,
                       (max(st_xmax(geom))-min(st_xmin(geom)))/430 factor,
                       min(st_ymin(geom)) yinicial
                    FROM
                       apartos
                    where gidfinca = $gidFinca and estado = 0
                   ) medidas;";
        }

        $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");

        $gid = '';
        $pointPolygonArray = array();

        while ($row =  pg_fetch_row($result))
        {
            if($gid == '')
            {
                $gid = $row[0];
                $pointPolygonArray[] = array("x" => $row[1], "y" => $row[2]);
            }
            else if($gid == $row[0])
            {
                $pointPolygonArray[] = array("x" => $row[1], "y" => $row[2]);
            }
            else
            {
                $geojson[] = array("gid" => $gid, "puntos" => $pointPolygonArray);

                $pointPolygonArray = array();
                $gid = $row[0];
                $pointPolygonArray[] = array("x" => $row[1], "y" => $row[2]);
            }
        }

        $geojson[] = array("gid" => $gid, "puntos" => $pointPolygonArray);


        $query = "SELECT  coalesce(MAX(numeroHistorico),0) AS max_id FROM historicos where gidFinca = $gidFinca";
        $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");
        $rowMaxi =  pg_fetch_row($result);
        $numHistorico = $rowMaxi[0];

        //return($geojson);
        return(array("finca"=>$geojson, "max"=>$numHistorico));

        ///return($geojson);
    }

    function getPreviewValidar($gidFinca){
                include '../main.module/acceso.php';
                $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");


                $query = "SELECT max(st_xmax(geom))-min(st_xmin(geom)) xinicial, max(st_ymax(geom))-min(st_ymin(geom)) yinicial FROM apartos where gidfinca = $gidFinca";
                $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");
                $row =  pg_fetch_row($result);

                if($row[0] < $row[1]){
                    $query = "
                        SELECT 	gid,
                            ((geometria.x - medidas.xinicial)/medidas.factor) x,
                            (430 - ((geometria.y - medidas.yinicial)/medidas.factor)) y
                        FROM
                           (SELECT
                            gid,
                            st_x((ST_DumpPoints(geom)).geom) x,
                            st_y((ST_DumpPoints(geom)).geom) y
                            FROM
                               (SELECT gid, geom  FROM apartos tab where gidfinca = $gidFinca and (estado = 0 or estado = 2)) s
                           ) geometria,
                           (SELECT
                               min(st_xmin(geom)) xinicial,
                               (max(st_ymax(geom))-min(st_ymin(geom)))/430 factor,
                               min(st_ymin(geom)) yinicial
                            FROM
                               apartos
                            where gidfinca = $gidFinca and (estado = 0 or estado = 2)
                           ) medidas;";
                }
                else{
                    $query = "
                        SELECT 	gid,
                            ((geometria.x - medidas.xinicial)/medidas.factor) x,
                            (430 - ((geometria.y - medidas.yinicial)/medidas.factor)) y
                        FROM
                           (SELECT
                            gid,
                            st_x((ST_DumpPoints(geom)).geom) x,
                            st_y((ST_DumpPoints(geom)).geom) y
                            FROM
                               (SELECT gid, geom  FROM apartos tab where gidfinca = $gidFinca and (estado = 0 or estado = 2)) s
                           ) geometria,
                           (SELECT
                               min(st_xmin(geom)) xinicial,
                               (max(st_xmax(geom))-min(st_xmin(geom)))/430 factor,
                               min(st_ymin(geom)) yinicial
                            FROM
                               apartos
                            where gidfinca = $gidFinca and (estado = 0 or estado = 2)
                           ) medidas;";
                }

                $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");

                $gid = '';
                $pointPolygonArray = array();

                while ($row =  pg_fetch_row($result))
                {
                    if($gid == '')
                    {
                        $gid = $row[0];
                        $pointPolygonArray[] = array("x" => $row[1], "y" => $row[2]);
                    }
                    else if($gid == $row[0])
                    {
                        $pointPolygonArray[] = array("x" => $row[1], "y" => $row[2]);
                    }
                    else
                    {
                        $geojson[] = array("gid" => $gid, "puntos" => $pointPolygonArray);

                        $pointPolygonArray = array();
                        $gid = $row[0];
                        $pointPolygonArray[] = array("x" => $row[1], "y" => $row[2]);
                    }
                }

                $geojson[] = array("gid" => $gid, "puntos" => $pointPolygonArray);


                $query = "SELECT  coalesce(MAX(numeroHistorico),0) AS max_id FROM historicos where gidFinca = $gidFinca";
                $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");
                $rowMaxi =  pg_fetch_row($result);
                $numHistorico = $rowMaxi[0];

                //return($geojson);
                return(array("finca"=>$geojson, "max"=>$numHistorico));

                ///return($geojson);
            }


    function historicos($gidFinca,$numHistorico)
    {
        include '../main.module/acceso.php';
        $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

        $query = "SELECT max(st_xmax(geom))-min(st_xmin(geom)) xinicial, max(st_ymax(geom))-min(st_ymin(geom)) yinicial FROM apartos where gidfinca = $gidFinca";
        $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");
        $row =  pg_fetch_row($result);

        if($row[0] < $row[1]){
            $query = "
                    SELECT 	gid,
                        ((geometria.x - medidas.xinicial)/medidas.factor) x,
                        (430 - ((geometria.y - medidas.yinicial)/medidas.factor)) y
                    FROM
                       (SELECT
                        gid,
                        st_x((ST_DumpPoints(geom)).geom) x,
                        st_y((ST_DumpPoints(geom)).geom) y
                        FROM
                           (select a.gid, a.geom from historicos h
                            inner join aparto_historico ah
                            on ah. idhistorico = h.idhistorico
                            inner join apartos a
                            on a.gid = ah.gidaparto
                            where h.numerohistorico=$numHistorico and h.gidfinca=$gidFinca) s
                       ) geometria,
                       (SELECT
                           min(st_xmin(geom)) xinicial,
                           (max(st_ymax(geom))-min(st_ymin(geom)))/430 factor,
                           min(st_ymin(geom)) yinicial
                        FROM
                           fincas where gid = $gidFinca
                       ) medidas; ";
        }
        else
        {
            $query = "
                    SELECT 	gid,
                        ((geometria.x - medidas.xinicial)/medidas.factor) x,
                        (430 - ((geometria.y - medidas.yinicial)/medidas.factor)) y
                    FROM
                       (SELECT
                        gid,
                        st_x((ST_DumpPoints(geom)).geom) x,
                        st_y((ST_DumpPoints(geom)).geom) y
                        FROM
                           (select a.gid, a.geom from historicos h
                            inner join aparto_historico ah
                            on ah. idhistorico = h.idhistorico
                            inner join apartos a
                            on a.gid = ah.gidaparto
                            where h.numerohistorico=$numHistorico and h.gidfinca=$gidFinca) s
                       ) geometria,
                       (SELECT
                           min(st_xmin(geom)) xinicial,
                           (max(st_xmax(geom))-min(st_xmin(geom)))/430 factor,
                           min(st_ymin(geom)) yinicial
                        FROM
                           fincas where gid = $gidFinca
                       ) medidas; ";

        }
        $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");

        $gid = '';
        $pointPolygonArray = array();

        while ($row =  pg_fetch_row($result))
        {
            if($gid == '')
            {
                $gid = $row[0];
                $pointPolygonArray[] = array("x" => $row[1], "y" => $row[2]);
            }
            else if($gid == $row[0])
            {
                $pointPolygonArray[] = array("x" => $row[1], "y" => $row[2]);
            }
            else
            {
                $geojson[] = array("gid" => $gid, "puntos" => $pointPolygonArray);

                $pointPolygonArray = array();
                $gid = $row[0];
                $pointPolygonArray[] = array("x" => $row[1], "y" => $row[2]);
            }
        }

        $geojson[] = array("gid" => $gid, "puntos" => $pointPolygonArray);

        return($geojson);
    }

     function historicosAparto($gidFinca,$gidAparto,$anterior)
    {
        include '../main.module/acceso.php';
        $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

        $query = "SELECT max(st_xmax(geom))-min(st_xmin(geom)) xinicial, max(st_ymax(geom))-min(st_ymin(geom)) yinicial FROM apartos where gid = $gidAparto and gidfinca = $gidFinca";
        $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");
        $row =  pg_fetch_row($result);
         $consulta="";
         if($anterior==1)
         {
             $consulta="select gid,geom from aparto_aparto inner join apartos on apartos.gid=aparto_aparto.gidAnterior where gidActual=$gidAparto";
         }
         else
         {
             $consulta="select gid,geom from aparto_aparto inner join apartos on apartos.gid=aparto_aparto.gidactual where gidanterior=$gidAparto";
         }


        if($row[0] < $row[1]){
            $query = "
                    SELECT 	gid,
                        ((geometria.x - medidas.xinicial)/medidas.factor) x,
                        (430 - ((geometria.y - medidas.yinicial)/medidas.factor)) y
                    FROM
                       (SELECT
                        gid,
                        st_x((ST_DumpPoints(geom)).geom) x,
                        st_y((ST_DumpPoints(geom)).geom) y
                        FROM
                           ($consulta)s) geometria,
                       (SELECT
                           min(st_xmin(geom)) xinicial,
                           (max(st_ymax(geom))-min(st_ymin(geom)))/430 factor,
                           min(st_ymin(geom)) yinicial
                        FROM
                           fincas where gid = $gidFinca
                       ) medidas ";
        }
        else
        {
            $query = "
                    SELECT 	gid,
                        ((geometria.x - medidas.xinicial)/medidas.factor) x,
                        (430 - ((geometria.y - medidas.yinicial)/medidas.factor)) y
                    FROM
                       (SELECT
                        gid,
                        st_x((ST_DumpPoints(geom)).geom) x,
                        st_y((ST_DumpPoints(geom)).geom) y
                        FROM
                           ($consulta)s) geometria,
                       (SELECT
                           min(st_xmin(geom)) xinicial,
                           (max(st_xmax(geom))-min(st_xmin(geom)))/430 factor,
                           min(st_ymin(geom)) yinicial 
                        FROM 
                           fincas where gid = $gidFinca
                       ) medidas ";

        }
        $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");

        $gid = '';
        $pointPolygonArray = array();

        while ($row =  pg_fetch_row($result))
        {
            if($gid == '')
            {
                $gid = $row[0];
                $pointPolygonArray[] = array("x" => $row[1], "y" => $row[2]);                        
            }
            else if($gid == $row[0])
            {
                $pointPolygonArray[] = array("x" => $row[1], "y" => $row[2]);  
            }
            else
            {   
                $geojson[] = array("gid" => $gid, "puntos" => $pointPolygonArray);

                $pointPolygonArray = array();
                $gid = $row[0];
                $pointPolygonArray[] = array("x" => $row[1], "y" => $row[2]);  
            }
        }

        $geojson[] = array("gid" => $gid, "puntos" => $pointPolygonArray);

        return($geojson);
    }
    
    
    
    
}

$historicoI = new historico();

if($_REQUEST['action']=='getFincas') {
    print_r(json_encode($historicoI->getFincas($_REQUEST['idUser'])));
    }
else if($_REQUEST['action']=='getFincasTodo') {
    print_r(json_encode($historicoI->getFincasTodo($_REQUEST['idUser'])));
}
else if($_REQUEST['action']=='previewValidar') {
    print_r(json_encode($historicoI->getPreviewValidar($_REQUEST['gidFinca'])));
}
else if($_REQUEST['action']=='preview') {
    print_r(json_encode($historicoI->getPreview($_REQUEST['gidFinca'])));
}
else if($_REQUEST['action']=='history') {
    print_r(json_encode($historicoI->historicos($_REQUEST['gidFinca'],$_REQUEST['numHistorico'])));
}

else if($_REQUEST['action']=='nextAparto') {
    print_r(json_encode($historicoI->historicos($_REQUEST['gidFinca'],$_REQUEST['numHistorico'])));
}

else if($_REQUEST['action']=='prevAparto') {
    print_r(json_encode($historicoI->historicos($_REQUEST['gidFinca'],$_REQUEST['anterior'])));
}
else if($_REQUEST['action']=='histAparto') {
    print_r(json_encode($historicoI->historicosAparto($_REQUEST['gidFinca'],$_REQUEST['gidAparto'],$_REQUEST['anterior'])));
}

