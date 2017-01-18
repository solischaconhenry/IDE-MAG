<?php

Class CargarDatos {
      public function conexion(){
       //include '../BD/acceso.php';

          $user = "postgres";
          $password = "12345";
          $dbname = "MAG";
          $port = "5432";
          $host = "localhost";

          $strconn = "host=$host port=$port dbname=$dbname user=$user password=$password";

          $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");


      }

      public function loadOpciones($id){

        //include '../BD/acceso.php';

        $user = "postgres";
        $password = "12345";
        $dbname = "MAG";
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
        $dbname = "MAG";
        $port = "5432";
        $host = "localhost";

        $strconn = "host=$host port=$port dbname=$dbname user=$user password=$password";

        $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");



        $query = "SELECT idpreg,titulo as name,enunciadoPreg,categoria,tipo  as hel ,fijo,requerido,mascara FROM pregunta";


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
          $dbname = "MAG";
          $port = "5432";
          $host = "localhost";

          $strconn = "host=$host port=$port dbname=$dbname user=$user password=$password";
          $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

          $query = "select categoria from pregunta group by categoria;";
          $result = pg_query($conn,$query) or die("Error al ejecutar la consulta");

          $row = pg_fetch_all_columns($result);
          return (json_encode($row));

    }
    public function getFormularios(){
          $user = "postgres";
          $password = "12345";
          $dbname = "MAG";
          $port = "5432";
          $host = "localhost";

          $strconn = "host=$host port=$port dbname=$dbname user=$user password=$password";
          $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

          $query = "select nombreform,idform,descripcion,fecha from formulario  group by nombreform,idform,descripcion,fecha;";
          $result = pg_query($conn,$query) or die("Error al ejecutar la consulta");

          $row = pg_fetch_all($result);
          return (json_encode($row));
        }


    public function getFormulariosNoFinca($codigoFinca){
              $user = "postgres";
              $password = "12345";
              $dbname = "MAG";
              $port = "5432";
              $host = "localhost";
              $tipo = "finca";

              $strconn = "host=$host port=$port dbname=$dbname user=$user password=$password";
              $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

              $query = "select f.nombreform,f.idform,f.descripcion,f.fecha from formulario as f EXCEPT
                         (select  f.nombreform,f.idform,f.descripcion,f.fecha from formulario as f inner join finca_aparto_formulario as p on (f.idform = p.idform) where p.codigofincaaparto = $codigoFinca and p.tipo = '$tipo');";
              $result = pg_query($conn,$query) or die("Error al ejecutar la consulta");

              $row = pg_fetch_all($result);
              return (json_encode($row));
            }

   public function getFormulariosFinca($codigoFinca){
        $user = "postgres";
        $password = "12345";
        $dbname = "MAG";
        $port = "5432";
        $host = "localhost";
        $tipo = "finca";

        $strconn = "host=$host port=$port dbname=$dbname user=$user password=$password";
        $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

        $query = "select form.nombreform,form.idform,form.descripcion,form.fecha from formulario as form inner join
                  (select * from finca_aparto_formulario where codigofincaaparto = $codigoFinca and tipo = '$tipo')as o on form.idform = o.idform ";
        $result = pg_query($conn,$query) or die("Error al ejecutar la consulta");
        $resulFin = [];

       while ($reg = pg_fetch_array($result, null, PGSQL_ASSOC))
       {
           //Se recorren las respuestas
            $queryResp = "select resp.idrespuesta,resp.fecha_hora from respuesta as resp inner join finca_aparto_formulario as faf on faf.id_finca_aparto_form = resp.id_finca_aparto_form where faf.codigofincaaparto = $codigoFinca and resp.idform = $reg[idform]";

            $resultResp  = pg_query($conn, $queryResp ) or die("Error al ejecutar la consulta");

            $rowsResp  = pg_fetch_all($resultResp );
            if( pg_num_rows($resultResp) > 0)
             {
                $reg["respuestas"] = $rowsResp;
             }

             $resulFin[] =  $reg;

        }
        return (json_encode($resulFin));
      }

      public function getFormulariosAparto($codigoAparto){
              $user = "postgres";
              $password = "12345";
              $dbname = "MAG";
              $port = "5432";
              $host = "localhost";
              $tipo = "aparto";

              $strconn = "host=$host port=$port dbname=$dbname user=$user password=$password";
              $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

              $query = "select form.nombreform,form.idform,form.descripcion,form.fecha from formulario as form inner join
                        (select * from finca_aparto_formulario where codigofincaaparto = $codigoAparto and tipo = '$tipo')as o on form.idform = o.idform ";
              $result = pg_query($conn,$query) or die("Error al ejecutar la consulta");
              $resulFin = [];

             while ($reg = pg_fetch_array($result, null, PGSQL_ASSOC))
             {
                 //Se recorren las respuestas
                  $queryResp = "select resp.idrespuesta,resp.fecha_hora from respuesta as resp where codigofincaaparto = $codigoAparto and idform = $reg[idform]";

                  $resultResp  = pg_query($conn, $queryResp ) or die("Error al ejecutar la consulta");

                  $rowsResp  = pg_fetch_all($resultResp );
                  if( pg_num_rows($resultResp) > 0)
                   {
                      $reg["respuestas"] = $rowsResp;
                   }

                   $resulFin[] =  $reg;

              }
              return (json_encode($resulFin));
            }











}


Class Insertar {
    public function insertarForm($nombre,$descripcionl,$fechal)
    {
          $user = "postgres";
          $password = "12345";
          $dbname = "MAG";
          $port = "5432";
          $host = "localhost";

          $strconn = "host=$host port=$port dbname=$dbname user=$user password=$password";
          $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

          $query = "insert into formulario (nombreform,descripcion,fecha,editable) values ('$nombre','$descripcionl','$fechal',true)";
          $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");

    }

    public function insertarPag($descripcion,$orden)
    {
          $user = "postgres";
          $password = "12345";
          $dbname = "MAG";
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
          $dbname = "MAG";
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
    public function insertarFormFinca($idform,$codigofinca){
        $user = "postgres";
        $password = "12345";
        $dbname = "MAG";
        $port = "5432";
        $host = "localhost";
        $tipo = "finca";

        $strconn = "host=$host port=$port dbname=$dbname user=$user password=$password";
        $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

        $query = "insert into finca_aparto_formulario (idform,codigofincaaparto,tipo) values ($idform,$codigofinca,'$tipo')";
        $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");
    }
  }



$nuevoCargar = new CargarDatos();
$nuevoInsertar = new Insertar();

//$nuevoInsertar->insertarPreguntasForm(9,1);
//$nuevoInsertar->insertarPag("sdgfe",2);
//$nuevoInsertar->insertarForm("lala","lala","07-07-2016",1);

//print_r($nuevoCargar->getFormulariosFinca(2));
//print_r("_______________");
//print_r($nuevoCargar->getFormulariosNoFinca(6));


if($_REQUEST['action']=='loadPreguntas') {
    print_r($nuevoCargar->loadPreguntas());
}

if($_REQUEST['action']=='loadOpciones') {
    print_r($nuevoCargar->loadOpciones($_REQUEST['idPreg']));
}

else if($_REQUEST['action']=='loadCategorias') {
    print_r($nuevoCargar->obtenerCategorias());
}

else if($_REQUEST['action']=='getFormulariosNoFinca') {
   print_r($nuevoCargar->getFormulariosNoFinca($_REQUEST['codigofinca']));
}

else if($_REQUEST['action']=='getFormulariosFinca') {
   print_r($nuevoCargar->getFormulariosFinca($_REQUEST['codigofinca']));
}

else if($_REQUEST['action']=='getFormulariosAparto') {
   print_r($nuevoCargar->getFormulariosAparto($_REQUEST['codigoaparto']));
}

else if($_REQUEST['action']=='getRespuestaForbyIdFom') {
   print_r($nuevoCargar->getRespuestaForbyIdFom($_REQUEST['idform']));
}



else if($_REQUEST['action']=='insertarForm') {
   $nuevoInsertar->insertarForm($_REQUEST['nombre'],$_REQUEST['descripcion'],$_REQUEST['fecha']);
}

else if($_REQUEST['action']=='insertarPag') {
   $nuevoInsertar->insertarPag($_REQUEST['descripcion'],$_REQUEST['orden']);
}

else if($_REQUEST['action']=='insertarPreguntasForm') {
   $nuevoInsertar->insertarPreguntasForm($_REQUEST['idpreg'],$_REQUEST['orden']);
}

else if($_REQUEST['action']=='insertarFormFinca') {
   $nuevoInsertar->insertarFormFinca($_REQUEST['idform'],$_REQUEST['codigofinca']);
}

?>