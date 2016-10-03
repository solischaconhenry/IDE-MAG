<?php

Class CargarPregunta {

      public function loadOpciones($id){

        //include '../BD/acceso.php';

        $user = "postgres";
        $password = "12345";
        $dbname = "AGROMAG";
        $port = "5432";
        $host = "localhost";

        $strconn = "host=$host port=$port dbname=$dbname user=$user password=$password";

        $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");



        $query = "SELECT
                  idopc,
                  orden,
                  opcion,
                  idPreg
                  FROM opciones where idPreg = $id";


        $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");


        $row = pg_fetch_all($result);

        //return(json_encode($row));
        return($row);
    }

   public function loadPreguntas(){

        //include '../BD/acceso.php';

        $user = "postgres";
        $password = "12345";
        $dbname = "AGROMAG";
        $port = "5432";
        $host = "localhost";

        $strconn = "host=$host port=$port dbname=$dbname user=$user password=$password";

        $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");



        $query = "SELECT
                        idpreg,
                        titulo as name,
                        enunciadoPreg ,
                        categoria as type,
                        tipo ,
                        fijo,
                        requerido,
                        mascara as hel
                      FROM pregunta";


        $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");

         $resulFin = [];

        //Recorrer las preguntas
        while ($reg = pg_fetch_array($result, null, PGSQL_ASSOC)) {

           $queryOp = "SELECT opcion FROM opciones where idPreg = $reg[idpreg]";

             $resultOp = pg_query($conn, $queryOp) or die("Error al ejecutar la consulta");
             $rowsOp = pg_fetch_all($resultOp);

             if( pg_num_rows($resultOp)> 0)
             {
                //Agrega las opciones a las que sean de tipo checkbox
                $reg["options"] = $rowsOp;

              }
            //Va agregando las preguntas a un arreglo
            $resulFin[] =  $reg;

        }





        //$row = pg_fetch_all($result);

        //return(json_encode($row));
        return (json_encode($resulFin));
    }



}

$nuevoCargar = new CargarPregunta();


if($_REQUEST['action']=='loadPreguntas') {
    print_r($nuevoCargar->loadPreguntas());
}


if($_REQUEST['action']=='loadOpciones') {
    print_r($nuevoCargar->loadOpciones($_REQUEST['idPreg']));
}
