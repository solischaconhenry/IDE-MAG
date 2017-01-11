<?php
class InsertarDtos{

}
class CargarDatos{

    function getIdFormWIdResp($idrespuesta){
        include '../main.module/acceso.php';
        $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

        $query = "select idform from respuesta where idrespuesta = $idrespuesta";
        $result =pg_query($conn, $query) or die("Error al ejecutar la consulta");
        $row = pg_fetch_all($result);
        return (json_encode($row));


    }
}

$CargarDatos = new CargarDatos();

if($_REQUEST['action']=='getIdFormWIdResp') {
    print_r($CargarDatos->getIdFormWIdResp($_REQUEST['idrespuesta']));
}
