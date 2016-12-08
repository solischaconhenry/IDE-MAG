<?php

Class InsertarDatos {

    public function insertarPregunta($titulo,$enunciadopreg,$categoria,$tipo,$fijo,$requerido,$mascara)
    {
          $user = "postgres";
          $password = "12345";
          $dbname = "MAG";
          $port = "5432";
          $host = "localhost";

          $strconn = "host=$host port=$port dbname=$dbname user=$user password=$password";
          $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

          $query = "insert into pregunta (titulo,enunciadopreg,categoria,tipo,fijo,requerido,mascara)

           values ('$titulo','$enunciadopreg','$categoria','$tipo','$fijo','$requerido','$mascara')";

          $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");
          return($result);

    }

    public function insertarOpcion($orden,$opcion)
        {
              $user = "postgres";
              $password = "12345";
              $dbname = "MAG";
              $port = "5432";
              $host = "localhost";

              $strconn = "host=$host port=$port dbname=$dbname user=$user password=$password";
              $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");


              $queryIdPreg = "select idpreg from pregunta order by idpreg desc limit 1";
              $resultIdPreg =  pg_query($conn, $queryIdPreg) or die("Error al ejecutar la consulta");
              $rowPreg = pg_fetch_row($resultIdPreg);


              $query = "insert into opciones (orden,idpreg,opcion) values ($orden,$rowPreg[0],'$opcion');";
              $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");
              return($result);

        }

     public function editarPregunta($idpreg,$titulo,$enunciadopreg,$categoria,$tipo,$fijo,$requerido,$mascara)
         {
               $user = "postgres";
               $password = "12345";
               $dbname = "MAG";
               $port = "5432";
               $host = "localhost";

               $strconn = "host=$host port=$port dbname=$dbname user=$user password=$password";
               $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

               $query = "UPDATE pregunta SET (titulo,enunciadopreg,categoria,tipo,fijo,requerido,mascara) =
               ('$titulo','$enunciadopreg','$categoria','$tipo','$fijo','$requerido','$mascara') WHERE idpreg = $idpreg";

               $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");
               return($result);

         }


     public function editarOpcionById($idopc,$opcion,$orden)
           {
                $user = "postgres";
                $password = "12345";
                $dbname = "MAG";
                $port = "5432";
                $host = "localhost";

                $strconn = "host=$host port=$port dbname=$dbname user=$user password=$password";
                $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

                $query = "UPDATE opciones SET (opcion,orden) = ('$opcion',$orden) WHERE idopc = $idopc";

                $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");
                return($result);

           }
      public function insertarOpcionByIdPreg($idpreg,$orden,$opcion)
          {
                $user = "postgres";
                $password = "12345";
                $dbname = "MAG";
                $port = "5432";
                $host = "localhost";

                $strconn = "host=$host port=$port dbname=$dbname user=$user password=$password";
                $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

                $query = "insert into opciones (orden,idpreg,opcion) values ($orden,$idpreg,'$opcion');";
                $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");
                return($result);

          }

   public function eliminarOpcionById($idopc)
        {
              $user = "postgres";
              $password = "12345";
              $dbname = "MAG";
              $port = "5432";
              $host = "localhost";

              $strconn = "host=$host port=$port dbname=$dbname user=$user password=$password";
              $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

              $query = "DELETE FROM opciones WHERE idopc = $idopc;";
              $result = pg_query($conn, $query) or die("Error al ejecutar la consulta");
              return($result);

        }



  }


Class CargarDatos {

    public function getPreguntaById($idpreg)
        {
             $user = "postgres";
             $password = "12345";
             $dbname = "MAG";
             $port = "5432";
             $host = "localhost";

             $strconn = "host=$host port=$port dbname=$dbname user=$user password=$password";
             $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

             $query = "select * from pregunta where idpreg = $idpreg";
             $result = pg_query($conn,$query) or die("Error al ejecutar la consulta");

             $row = pg_fetch_all($result);
             return (json_encode($row));

        }
      public function getOpcionesById($idpreg)
            {
                 $user = "postgres";
                 $password = "12345";
                 $dbname = "MAG";
                 $port = "5432";
                 $host = "localhost";

                 $strconn = "host=$host port=$port dbname=$dbname user=$user password=$password";
                 $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

                 $query = "select idopc,opcion,orden from opciones where idpreg = $idpreg order by orden";
                 $result = pg_query($conn,$query) or die("Error al ejecutar la consulta");

                 $row = pg_fetch_all($result);
                 return (json_encode($row));

            }
}


$nuevoInsertar = new InsertarDatos();
$nuevoCargarDatos = new CargarDatos();

//$nuevoInsertar->insertarPregunta('Estatura','dsfces','Datos generales','input','True','True','');
$nuevoInsertar->editarPregunta(6,'Suavidad X','sdfe','Datos generales','text','True','True','');
//print_r($nuevoCargarDatos->getPreguntaById(2));

if($_REQUEST['action']=='insertarPregunta') {
$nuevoInsertar->insertarPregunta($_REQUEST['titulo'],$_REQUEST['enunciadopreg'],$_REQUEST['categoria'],$_REQUEST['tipo'],$_REQUEST['fijo'],$_REQUEST['requerido'],$_REQUEST['mascara']);
}


//DE OPCIONES
//***********************************************************
else if($_REQUEST['action']=='insertarOpcion') {
   $nuevoInsertar->insertarOpcion($_REQUEST['orden'],$_REQUEST['opcion']);
}

else if($_REQUEST['action']=='editarOpcionById') {
   $nuevoInsertar->editarOpcionById($_REQUEST['idopc'],$_REQUEST['opcion'],$_REQUEST['orden']);
}

else if($_REQUEST['action']=='insertarOpcionByIdPreg') {
   $nuevoInsertar->insertarOpcionByIdPreg($_REQUEST[idpreg],$_REQUEST[orden],$_REQUEST[opcion]);
}

else if($_REQUEST['action']=='eliminarOpcionById') {
   $nuevoInsertar->eliminarOpcionById($_REQUEST['idopc']);
}
//***********************************************************


else if($_REQUEST['action']=='editarPregunta') {
   $nuevoInsertar->editarPregunta($_REQUEST['idpreg'],$_REQUEST['titulo'],$_REQUEST['enunciadopreg'],$_REQUEST['categoria'],$_REQUEST['tipo'],$_REQUEST['fijo'],$_REQUEST['requerido'],$_REQUEST['mascara']);
}

else if($_REQUEST['action']=='getPreguntaById') {
    print_r($nuevoCargarDatos->getPreguntaById($_REQUEST['idpreg']));
}

else if($_REQUEST['action']=='getOpcionesById') {
    print_r($nuevoCargarDatos->getOpcionesById($_REQUEST['idpreg']));
}

?>