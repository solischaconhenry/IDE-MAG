<?php

class Validar
{
    function getApartosValidar($finca){
        include '../main.module/acceso.php';
        $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

        $query = "select * from (select
                  	apartos.idactividad,
                  	apartos.geom,
                  	apartos.fecha,
                  	actividades.descripcion,
                  	apartos.gid

                   from actividades LEFT OUTER JOIN apartos on
                  (apartos.gidfinca = $finca  and apartos.estado = 2 and actividades.idaparto = apartos.gid)) as validar
                  inner join tipoactividad on (idtipoactividad = validar.idactividad);";
        $result =pg_query($conn, $query) or die("Error al ejecutar la consulta");
        $row =  pg_fetch_all($result);

        return $row;
    }

    function aceptarAparto($idAparto){
        include '../main.module/acceso.php';
        $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

        $query = "UPDATE apartos SET estado = 0 WHERE gid = $idAparto;";
        $result =pg_query($conn, $query) or die("Error al ejecutar la consulta");
        $row =  pg_fetch_all($result);

        return $row;
    }

    function rechazarAparto($idAparto){
        include '../main.module/acceso.php';
        $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

        $query = "UPDATE apartos SET estado = 1 WHERE gid = $idAparto;";
        $result =pg_query($conn, $query) or die("Error al ejecutar la consulta");
        $row =  pg_fetch_all($result);

        return $row;
    }

}

$validarA = new Validar();

//print_r(json_encode($mostrar->getFormularios()))

if($_REQUEST['action']=='apartoValidar') {
    print_r(json_encode($validarA->getApartosValidar($_REQUEST['finca'])));
}
if($_REQUEST['action']=='aceptarAparto') {
    print_r($validarA->aceptarAparto($_REQUEST['idAparto']));
}
if($_REQUEST['action']=='rechazarAparto') {
    print_r($validarA->rechazarAparto($_REQUEST['idAparto']));
}



?>