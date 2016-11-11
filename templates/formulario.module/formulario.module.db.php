<?php

Class CargarPregunta {
      public function conexion(){
       //include '../BD/acceso.php';

          $user = "postgres";
          $password = "12345";
          $dbname = "AGROMAG";
          $port = "5432";
          $host = "localhost";

          $strconn = "host=$host port=$port dbname=$dbname user=$user password=$password";

          $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");


      }

      public function loadOpciones($id){

        //include '../BD/acceso.php';

        $user = "postgres";
        $password = "12345";
        $dbname = "AGROMAG";
        $port = "5432";
        $host = "localhost";

        $strconn = "host=$host port=$port dbname=$dbname user=$user password=$password";

        $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

        $query = "SELECT idopc,orden,opcion,idPreg FROM opciones where idPreg = $id";
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



        $query = "SELECT idpreg,titulo as name,enunciadoPreg ,categoria as type,tipo ,fijo,requerido,mascara as hel FROM pregunta";


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
        return (json_encode($resulFin));
    }

    public function obtenerCategorias()
        {
              $user = "postgres";
              $password = "12345";
              $dbname = "AGROMAG";
              $port = "5432";
              $host = "localhost";

              $strconn = "host=$host port=$port dbname=$dbname user=$user password=$password";
              $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

              $query = "select categoria from pregunta group by categoria;";
              $result = pg_query($conn,$query) or die("Error al ejecutar la consulta");

              $row = pg_fetch_all_columns($result);
              return (json_encode($row));

        }



}


Class Insertar {
    public function insertarForm($nombre,$descripcionl,$fechal)
    {
          $user = "postgres";
          $password = "12345";
          $dbname = "AGROMAG";
          $port = "5432";
          $host = "localhost";

          $strconn = "host=$host port=$port dbname=$dbname user=$user password=$password";
          $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

          $query = "insert into formulario (nombreform,descripcion,fecha) values ('$nombre','$descripcionl','$fechal')";
          $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");

    }

    public function insertarPag($descripcion,$orden)
    {
          $user = "postgres";
          $password = "12345";
          $dbname = "AGROMAG";
          $port = "5432";
          $host = "localhost";

          $strconn = "host=$host port=$port dbname=$dbname user=$user password=$password";
          $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

          $query = "insert into pagina (descripcion,orden) values ('$descripcion',$orden)";
          $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");


    }
    public function insertarPreguntasForm($idPreg,$orden)
    {
          echo ($orden);
          $user = "postgres";
          $password = "12345";
          $dbname = "AGROMAG";
          $port = "5432";
          $host = "localhost";

          $strconn = "host=$host port=$port dbname=$dbname user=$user password=$password";
          $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

          $queryIdForm = "select idform from formulario order by idform desc limit 1";
          $resultIdForm =  pg_query($conn, $queryIdForm) or die("Error al ejecutar la consulta");
          $rowForm = pg_fetch_row($resultIdForm);

          $queryIdPagina = "select idpag from pagina order by idpag desc limit 1";
          $resultIdPagina =   pg_query($conn, $queryIdPagina) or die("Error al ejecutar la consulta");
          $rowPagina = pg_fetch_row($resultIdPagina);
          echo ($rowPagina[0]);

          $query = "insert into form_preg (idform,idpreg,orden,pagina) values ($rowForm[0],$idPreg,$orden,$rowPagina[0])";
          $result = pg_query($conn,$query) or die("Error al ejecutar la consulta");

    }

}



$nuevoCargar = new CargarPregunta();
$nuevoInsertar = new Insertar();

//$nuevoInsertar->insertarPreguntasForm(9,1);
//$nuevoInsertar->insertarPag("sdgfe",2);



if($_REQUEST['action']=='loadPreguntas') {
    print_r($nuevoCargar->loadPreguntas());
}

if($_REQUEST['action']=='loadOpciones') {
    print_r($nuevoCargar->loadOpciones($_REQUEST['idPreg']));
}

if($_REQUEST['action']=='loadCategorias') {
    print_r($nuevoCargar->obtenerCategorias());
}

if($_REQUEST['action']=='insertarForm') {
   $nuevoInsertar->insertarForm($_REQUEST['nombre'],$_REQUEST['descripcion'],$_REQUEST['fecha']);
}

if($_REQUEST['action']=='insertarPag') {
   $nuevoInsertar->insertarPag($_REQUEST['descripcion'],$_REQUEST['orden']);
}

if($_REQUEST['action']=='insertarPreguntasForm') {
   $nuevoInsertar->insertarPreguntasForm($_REQUEST['idpreg'],$_REQUEST['orden']);
}