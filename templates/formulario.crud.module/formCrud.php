<?php
class formCrud{

    function getAllForms(){
        include '../main.module/acceso.php';
        $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

        $query = "select nombreForm, descripcion, fecha, idform from formulario";
        $result =pg_query($conn, $query) or die("Error al ejecutar la consulta");
        $row =  pg_fetch_all($result);
        return $row;
    }
}

$formCrudO = new formCrud();

if($_REQUEST['action']=='getAllForms') {
    print_r(json_encode($formCrudO->getAllForms()));
}