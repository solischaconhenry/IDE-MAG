<?php
class UserInfo{

    function getUserInfo($userId){
        include '../../main.module/acceso.php';
        $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

        $query = "select email, telefono, direccion, ciudad, nombre, apellidos from usuarios where usuario = $userId";
        $result =pg_query($conn, $query) or die("Error al ejecutar la consulta");
        $row =  pg_fetch_row($result);
        return $row;
    }
}

$userInfo = new UserInfo();

if($_REQUEST['action']=='getUserInfo') {
    print_r(json_encode($userInfo->getUserInfo($_REQUEST['userId'])));
}