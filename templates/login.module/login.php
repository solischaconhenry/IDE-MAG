<?php
class login{

    function getUser($userM){
        include '../main.module/acceso.php';
        $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

        $query = "select contrasena, tipo from usuarios where usuario = $userM";
        $result =pg_query($conn, $query) or die("Error al ejecutar la consulta");
        $row =  pg_fetch_all($result);
        return $row;
    }
}

$loginM = new login();

if($_REQUEST['action']=='getPass') {
    print_r(json_encode($loginM->getUser($_REQUEST['username'])));
}
