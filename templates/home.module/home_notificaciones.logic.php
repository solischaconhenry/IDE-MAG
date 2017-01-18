<?php

Class CrudCargarNotificaciones {

    function getNotificaciones(){

        include '../main.module/acceso.php';
        $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

        $query = "select * from notificaciones;";
        $result =pg_query($conn, $query) or die("Error al ejecutar la consulta");
        $row = pg_fetch_all($result);

        return ($row);
    }

    function deleteNotifications($id){
        include '../main.module/acceso.php';
        $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

        $query = "delete from notificaciones where idNotificacion = $id;";
        $result =pg_query($conn, $query) or die("Error al ejecutar la consulta");
        $row = pg_fetch_all($result);

        return ($row);
    }
}
$nuevoCargarN = new CrudCargarNotificaciones();


if($_REQUEST['action']=='loadNotifications') {
    print_r(json_encode($nuevoCargarN->getNotificaciones()));
}
if($_REQUEST['action']=='deleteNotificacion') {
    print_r($nuevoCargarN->deleteNotifications($_REQUEST['idN']));
}

