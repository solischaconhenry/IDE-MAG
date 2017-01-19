<?php

class CrudFinca
{
    function getFincas($idUsuario){
        include '../../main.module/acceso.php';
        $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

        $query = "select canton,
                      codigofinca,
                      direccionexacta,
                      distrito,
                      fecha,
                      gid,
                      nombrefinca,
                      provincia,
                      telefono,
                      ST_AsGeoJSON(ST_FlipCoordinates(ST_Transform(ST_CollectionHomogenize(geom),4326))) as geom
                  from fincas where iduser = $idUsuario";

        $result = pg_query($conn, $query);
        if(!$result){
            return "error bitch";
        }else{
            $row =  pg_fetch_all($result);
            return $row;
        }

    }

    function getTipoActividad(){
        include '../../main.module/acceso.php';
        $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

        $query = "select idtipoactividad, nombre from tipoactividad";

        $result =pg_query($conn, $query) or die("Error al ejecutar la consulta");
        $row =  pg_fetch_all($result);
        return $row;
    }

    function getApartosValidosFinca($idFinca){
        include '../../main.module/acceso.php';
        $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

        $query = "select
                  	ap.gid,ap.gidfinca,ap.estado,
                  	ST_AsGeoJSON(ST_FlipCoordinates(ST_Transform(ST_CollectionHomogenize(ap.geom),4326))) as geom,
                  	ap.fecha,
                  	(select nombre from tipoactividad where idtipoactividad = ap.idactividad) nombreactividad,ap.idactividad,
                  	(select a.descripcion from actividades a where a.idactividad = ap.idactividad and a.idaparto = ap.gid order by ids desc limit 1) descripcion
                  from apartos ap where gidfinca = $idFinca and (estado = 0 or estado = 2)";

        $result =pg_query($conn, $query) or die("Error al ejecutar la consulta");
        $row =  pg_fetch_all($result);
        return $row;
    }

    function insertarApartoPendiente($gidFinca,$geom,$fecha,$idActividad,$descripcion){
        include '../../main.module/acceso.php';
        $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

        $query = "insert into apartos (gidfinca,estado,geom,fecha,idactividad) values
                  (
                  	$gidFinca,2,ST_Multi(
                  	ST_Transform(ST_SetSRID(ST_GeomFromGeoJSON('$geom'),4326),5367)),$fecha,$idActividad
                  )";

        $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");
        $row =  pg_fetch_all($result);
        $query2 = "insert into actividades (idaparto,descripcion,idactividad,fecha) values ((select max(gid) from apartos),'$descripcion',$idActividad,$fecha);";
        $result2 = pg_query($conn, $query2) or die("Error al ejecutar la consulta");
        $row2 =  pg_fetch_all($result2);
        return $row2;
    }

    function actualizarApartosPendientes($gidAparto,$geom,$fecha,$idActividad,$descripcion){
            include '../../main.module/acceso.php';
            $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");
            $query = "update apartos set (geom,fecha,idactividad) =
                      	(ST_Multi(ST_Transform(ST_SetSRID(ST_GeomFromGeoJSON('$geom'),4326),5367)),$fecha,$idActividad)
                      	where gid = '$gidAparto'";
            $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");
            $row =  pg_fetch_all($result);
            $query2 = "insert into actividades (idaparto,descripcion,idactividad,fecha) values ($gidAparto,'$descripcion',$idActividad,$fecha);";
            $result2 = pg_query($conn, $query2) or die("Error al ejecutar la consulta");
            $row2 =  pg_fetch_all($result2);
            return $row2;
    }


    function insertarHistoricoAparto($gidFinca,$geom,$fecha,$idActividad,$descripcion){
            include '../../main.module/acceso.php';
            $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");
            // inserta en apartos con estado pendiente
            $query = "insert into apartos (gidfinca,estado,geom,fecha,idactividad) values
                      (
                      	$gidFinca,2,ST_Multi(
                      	ST_Transform(ST_SetSRID(ST_GeomFromGeoJSON('$geom'),4326),5367)),$fecha,$idActividad
                      )";

            $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");
            $row =  pg_fetch_all($result);

            // inserta en actividades para control de formularios
            $query = "insert into actividades (idaparto,descripcion,idactividad,fecha) values ((select max(gid) from apartos),'$descripcion',$idActividad,$fecha);";
            $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");
            $row =  pg_fetch_all($result);

            // insertar en tabla historicos
            $query = "insert into historicos (gidfinca,numerohistorico)values($gidFinca,(select
                          case
                              when (select (max(numerohistorico)) from historicos where gidfinca = $gidFinca limit 1) is null then 1
                              else (select (max(numerohistorico))+1 from historicos where gidfinca = $gidFinca)
                          end))";
             $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");
             $row =  pg_fetch_all($result);





            return $row2;
    }

    
    
    function getPreview($gidFinca){
        include '../../main.module/acceso.php';
        $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");


        $query = "SELECT max(st_xmax(geom))-min(st_xmin(geom)) xinicial, max(st_ymax(geom))-min(st_ymin(geom)) yinicial FROM apartos where gidfinca = $gidFinca";
        $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");
        $row =  pg_fetch_row($result);

        if($row[0] < $row[1]){
            $query = "
                SELECT 	gid, 
                    ((geometria.x - medidas.xinicial)/medidas.factor) x, 
                    (480 - ((geometria.y - medidas.yinicial)/medidas.factor)) y 
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
                       (max(st_ymax(geom))-min(st_ymin(geom)))/480 factor,
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
                    (480 - ((geometria.y - medidas.yinicial)/medidas.factor)) y 
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
                       (max(st_xmax(geom))-min(st_xmin(geom)))/480 factor,
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

        return($geojson);
    }
    
    
    function separar($gidAparto, $gidFinca){
        include '../../main.module/acceso.php';
        $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

        
        $arr_apartos_id = [];

        $query = "select geom from temp_table"; 
        $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");

        while ($row =  pg_fetch_row($result))
        {
            $geom = $row[0];
            $query = "INSERT INTO apartos(gidfinca, estado, geom) VALUES ($gidFinca, 0,'$geom');";
            pg_query($conn, $query) or die("Error al ejecutar la consulta");


            $query1 = "select max(gid) from apartos"; 
            $rowA = pg_query($conn, $query1) or die("Error al ejecutar la consulta");
            $max_aparto =  pg_fetch_row($rowA);
            $arr_apartos_id[] = $max_aparto[0];

        }
        
        
        $query = "Update apartos set estado = 1 where gid = $gidAparto"; 
        $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");
        
        foreach ($arr_apartos_id as $id) {    
            $query = "INSERT INTO aparto_aparto(gidanterior, gidactual) VALUES($gidAparto, $id);"; 
            $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");
        }


        $query = "SELECT  coalesce(MAX(numeroHistorico),0) AS max_id FROM historicos where gidFinca = $gidFinca"; 
        $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");
        $row =  pg_fetch_row($result);
        $numHistorico = $row[0]+1;

        $query = "INSERT INTO historicos(numeroHistorico, gidFinca) VALUES($numHistorico, $gidFinca);"; 
        $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");
        
        
        
        
        
        $arr_apartos_activos = [];

        $query = "SELECT * from apartos where gidFinca = $gidFinca and estado = 0"; 
        $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");

        while ($row =  pg_fetch_row($result))
        {
            $arr_apartos_activos[] = $row[0];
        }
        
        foreach ($arr_apartos_activos as $id) {    
            $query = "INSERT INTO aparto_historico(idhistorico, gidAparto) VALUES( (SELECT MAX(idhistorico) FROM historicos), $id);"; 
            $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");
        }

        return(1);
    }
        
}

$crudFinca = new CrudFinca();

if($_REQUEST['action']=='getFincas') {
    print_r(json_encode($crudFinca->getFincas($_REQUEST['idUser'])));
}
else if($_REQUEST['action']=='preview') {
    print_r(json_encode($crudFinca->getPreview($_REQUEST['gidFinca'])));
}
else if($_REQUEST['action']=='divide') {
    print_r(json_encode($crudFinca->separar($_REQUEST['gidAparto'], $_REQUEST['gidFinca'])));
}
else if($_REQUEST['action']=='getTipoActividad') {
    print_r(json_encode($crudFinca->getTipoActividad()));
}
else if($_REQUEST['action']=='getApartosValidosFinca') {
    print_r(json_encode($crudFinca->getApartosValidosFinca($_REQUEST['idFinca'])));
}
else if($_REQUEST['action']=='insertarApartoPendiente') {
    print_r(json_encode($crudFinca->insertarApartoPendiente($_REQUEST['gidFinca'],$_REQUEST['geom'],$_REQUEST['fecha'],$_REQUEST['idactividad'],$_REQUEST['descripcion'])));
}
else if($_REQUEST['action']=='actualizarApartosPendientes') {
    print_r(json_encode($crudFinca->actualizarApartosPendientes($_REQUEST['gidAparto'],$_REQUEST['geom'],$_REQUEST['fecha'],$_REQUEST['idactividad'],$_REQUEST['descripcion'])));
}


