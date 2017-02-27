<?php

class CrudFinca
{
    function createFinca($iduser,$fecha, $provincia, $canton,$distrito,$direccionexacta,$codigofinca,$telefono,$nombrefinca,$geom){
        include '../main.module/acceso.php';
        $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

        $query = "insert into fincas (iduser,fecha,provincia,canton,distrito,direccionexacta,codigofinca,telefono,nombrefinca,geom)
        VALUES
                  (
                      $iduser,'$fecha','$provincia','$canton','$distrito','$direccionexacta',$codigofinca,$telefono,'$nombrefinca',
                      ST_Multi(ST_Transform(ST_SetSRID(ST_GeomFromGeoJSON($geom),4326),5367))
                  )";

        $result = pg_query($conn, $query);
        if(!$result){
            return "error";
        }else{
            $row =  pg_fetch_all($result);
            return $row;
        }

    }
}

$crudFinca = new CrudFinca();

if($_REQUEST['action']=='crearFinca') {
    print_r(json_encode($crudFinca->createFinca($_REQUEST['iduser'],$_REQUEST['fecha'],$_REQUEST['provincia'],$_REQUEST['canton'],$_REQUEST['distrito'],$_REQUEST['direccionexacta'],
    $_REQUEST['codigofinca'],$_REQUEST['telefono'],$_REQUEST['nombrefinca'],$_REQUEST['geom'])));
}