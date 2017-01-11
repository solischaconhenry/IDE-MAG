<?php
class formCrud{

    function getAllForms(){
        include '../main.module/acceso.php';
        $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

        $query = "select nombreForm, descripcion, fecha, editable, idform from formulario";
        $result =pg_query($conn, $query) or die("Error al ejecutar la consulta");
        $row =  pg_fetch_all($result);
        return $row;
    }

    function deleteForm($idForm){
        include '../main.module/acceso.php';
        $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

        $query = "delete from formulario where idform = $idForm";
        $result =pg_query($conn, $query) or die("Error al ejecutar la consulta");
        $row =  pg_fetch_all($result);
        return $row;
    }
}

$formCrudO = new formCrud();

if($_REQUEST['action']=='getAllForms') {
    print_r(json_encode($formCrudO->getAllForms()));
}

if($_REQUEST['action']=='deleteForm') {
    $formCrudO->deleteForm($_REQUEST['idform']);
}
