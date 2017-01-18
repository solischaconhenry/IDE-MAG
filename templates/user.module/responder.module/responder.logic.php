<?php

Class CrudCargarPregunta {
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
    public function getFormularios($idformulario){
          $user = "postgres";
          $password = "12345";
          $dbname = "MAG";
          $port = "5432";
          $host = "localhost";

          $strconn = "host=$host port=$port dbname=$dbname user=$user password=$password";
          $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

          $query = "select nombreform,idform,descripcion,fecha from formulario where idform = $idformulario;";
          $result = pg_query($conn,$query) or die("Error al ejecutar la consulta");

          $row = pg_fetch_all($result);
          return (json_encode($row));
        }

}


class editarformulario{

    function getPaginasByID($idformulario){

        include '../../main.module/acceso.php';
        $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

        $query = "select fp.pagina, pg.idpag, pg.descripcion, pg.orden from form_preg as fp
                  inner join pagina as pg on (pg.idpag = fp.pagina and fp.idform = $idformulario) group by fp.pagina, pg.idpag, pg.descripcion, pg.orden order by pg.orden;";
        $result =pg_query($conn, $query) or die("Error al ejecutar la consulta");
        $row = pg_fetch_all($result);

        return ($row);
    }

    function getAllPreguntas($idformulario2){
            include '../../main.module/acceso.php';
            $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

            $query = "select * from pregunta as pr inner join(select pg.descripcion, pg.orden, fp.idpreg from form_preg as fp
            inner join pagina as pg on (pg.idpag = fp.pagina and fp.idform = $idformulario2))as pag
            on (pr.idpreg = pag.idpreg)";

            $result =pg_query($conn, $query) or die("Error al ejecutar la consulta");

            $resulFin = [];

           //Recorrer las preguntas
           while ($reg = pg_fetch_array($result, null, PGSQL_ASSOC)) {

              $queryOp = "SELECT idopc, opcion FROM opciones where idPreg = $reg[idpreg]";

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

      function getAllPreguntasWRespuestas($idformulario2,$idrespuesta){

             include '../../main.module/acceso.php';
             $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

             $query = "select * from pregunta as pr inner join(select pg.descripcion, pg.orden, fp.idpreg from form_preg as fp
             inner join pagina as pg on (pg.idpag = fp.pagina and fp.idform = $idformulario2))as pag
             on (pr.idpreg = pag.idpreg)";

             $result =pg_query($conn, $query) or die("Error al ejecutar la consulta");

             $resulFin = [];

            //Recorrer las preguntas
            while ($reg = pg_fetch_array($result, null, PGSQL_ASSOC)) {

                $queryOp = "SELECT opcion FROM opciones where idPreg = $reg[idpreg]";
                $resultOp = pg_query($conn, $queryOp) or die("Error al ejecutar la consulta");
                $rowsOp = pg_fetch_all_columns($resultOp);

                $queryAnswer = "select idresp_preg,valor from resp_preg where idrespuesta = $idrespuesta and idpreg = $reg[idpreg]";
                $resultAnswer = pg_query($conn, $queryAnswer) or die("Error al ejecutar la consulta");
                $rowAnswer = pg_fetch_object($resultAnswer);

                 if( pg_num_rows($resultOp)> 0)
                 {
                    $reg["options"] = $rowsOp;

                  }
                  //Si es es tipo checlbox se cargar las respuestas en un arreglo
                  if($reg['tipo'] == "checkbox"){
                        //print_r($rowAnswer->idresp_preg);
                        $queryAnswerMul = "select valor from opcion_multiple where idresp_preg = $rowAnswer->idresp_preg";
                        $resultAnswerMul = pg_query($conn, $queryAnswerMul) or die("Error al ejecutar la consulta");
                        $rowAnswerMul = pg_fetch_all_columns($resultAnswerMul);
                        $reg["answer"] =  array( "id" => $rowAnswer->idresp_preg,"items" => $rowAnswerMul);

                  }
                  //Si no se cargar normal
                  else
                  {
                    $reg["answer"]   = $rowAnswer;
                  }

                //Va agregando las preguntas a un arreglo
                $resulFin[] =  $reg;

            }
            return (json_encode($resulFin));
          }


}

Class Respuestas{
        //guarda la respuesta a un form en la tabla respuesta, pero no las preguntas por ahora
        function guardarRespuesta($idform, $codigofinca, $fecha_hora){

            include '../../main.module/acceso.php';
            $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

            $query = "insert into respuesta (idform, codigofincaaparto, fecha_hora) values ($idform, $codigofinca, $fecha_hora);";
            $result =pg_query($conn, $query) or die("Error al ejecutar la consulta");

            $query2 = "update formulario set editable = false where idform = $idform";
            $result2 =pg_query($conn, $query2) or die("Error al ejecutar la consulta");
        }

        //busca el id de la respuesta insertada a partir de los dato insertados y de la fecha y hora que estan en milisegundos
        function getRespuestaForm($idform, $codigofinca, $fecha_hora){

            include '../../main.module/acceso.php';
            $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

            $query = "select idrespuesta from respuesta where codigofincaaparto = $codigofinca and idform = $idform and fecha_hora =$fecha_hora;";
            $result =pg_query($conn, $query) or die("Error al ejecutar la consulta");
            $rows = pg_fetch_all($result);
            return ($rows);
        }

        //busca el id de la respuesta insertada a partir de los dato insertados y de la fecha y hora que estan en milisegundos

        function insertResp_Preg($idResp, $idPreg, $valor){

            include '../../main.module/acceso.php';
            $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

            $query = "insert into resp_preg (idrespuesta, idpreg, valor) values ($idResp, $idPreg, '$valor');";
            $result =pg_query($conn, $query) or die("Error al ejecutar la consulta");

        }


        function editarResp_Preg($idresp_preg, $valor){

            include '../../main.module/acceso.php';
            $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

            $query = "UPDATE resp_preg SET valor = '$valor' where idresp_preg = $idresp_preg;";
            $result =pg_query($conn, $query) or die("Error al ejecutar la consulta");

        }

        //inserta las opciones escogidas por un usuario en un multiple select
        function insertRespuestasMultiplesOpciones($idResp, $idPreg, $valor){

            include '../../main.module/acceso.php';
            $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");

            $query1 = "select idresp_preg from resp_preg where idrespuesta = $idResp and idpreg = $idPreg;"; //*********************** HENRY
            $result1 =pg_query($conn, $query1) or die("Error al ejecutar la consulta");
            $row = pg_fetch_all($result1);

            $idresp_preg = $row[0]['idresp_preg'];
            print_r($idresp_preg);

            $query = "insert into opcion_multiple (idresp_preg,valor) values ($idresp_preg, '$valor');";
            $result =pg_query($conn, $query) or die("Error al ejecutar la consulta");

        }


        //inserta las opciones escogidas por un usuario en un multiple select(EDITAR DE ADMINISTRADOR)
        function insertWIdRespOpcionesMulti($idresp_preg, $valor){
            print_r($idresp_preg);
            print_r($valor);
            include '../../main.module/acceso.php';
            $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");
            $query = "insert into opcion_multiple (idresp_preg,valor) values ($idresp_preg, '$valor');";
            $result =pg_query($conn, $query) or die("Error al ejecutar la consulta");

        }

         function eliminarRespOpcionesMulti($idresp_preg, $valor){
            print_r($idresp_preg);
             print_r($idresp_preg);
            include '../../main.module/acceso.php';
            $conn = pg_connect($strconn) or die("Error de Conexion con la base de datos");
            $query = "DELETE FROM opcion_multiple
                        WHERE valor = '$valor' AND idresp_preg = $idresp_preg";
            $result =pg_query($conn, $query) or die("Error al ejecutar la consulta");

        }


}


$nuevoCargarC = new CrudCargarPregunta();
$editarFormC = new editarformulario();
$respuestaC = new Respuestas();

//$nuevoInsertar->insertarPreguntasForm(9,1);
//$nuevoInsertar->insertarPag("sdgfe",2);



if($_REQUEST['action']=='loadPreguntas') {
    print_r($nuevoCargarC->loadPreguntas());
}

else if($_REQUEST['action']=='getFormulario') {
    print_r($nuevoCargarC->getFormularios($_REQUEST['idformulario']));
}

else if($_REQUEST['action']=='loadOpciones') {
    print_r($nuevoCargarC->loadOpciones($_REQUEST['idPreg']));
}

else if($_REQUEST['action']=='getPaginas') {
   print_r(json_encode($editarFormC->getPaginasByID($_REQUEST['idform'])));
}

else if($_REQUEST['action']=='getPreguntas') {
   print_r($editarFormC->getAllPreguntas($_REQUEST['idform']));
}
else if($_REQUEST['action']=='getPreguntas') {
   print_r($editarFormC->getAllPreguntas($_REQUEST['idform']));
}

else if($_REQUEST['action']=='getPreguntasWRespuestas') {
   print_r($editarFormC->getAllPreguntasWRespuestas($_REQUEST['idform'],$_REQUEST['idrespuesta']));
}


else if($_REQUEST['action']=='insertRespuesta') {
    print_r($respuestaC->guardarRespuesta($_REQUEST['idform'], $_REQUEST['codigo'], $_REQUEST['fecha']));
}

else if($_REQUEST['action']=='getRespuestaForm') {
    print_r(json_encode($respuestaC->getRespuestaForm($_REQUEST['idform'], $_REQUEST['codigo'], $_REQUEST['fecha'])));
}

else if($_REQUEST['action']=='insertResp_Preg') {
    print_r($respuestaC->insertResp_Preg($_REQUEST['idresp'], $_REQUEST['idpreg'], $_REQUEST['valor']));
}


else if($_REQUEST['action']=='editarResp_Preg') {
    print_r($respuestaC->editarResp_Preg($_REQUEST['idresp_preg'], $_REQUEST['valor']));
    }

else if($_REQUEST['action']=='insertRespMultipleOpc') {
    print_r($respuestaC->insertRespuestasMultiplesOpciones($_REQUEST['idresp'], $_REQUEST['idpreg'], $_REQUEST['valor']));

}

else if($_REQUEST['action']=='insertWIdRespOpcionesMulti') {

    print_r($respuestaC->insertWIdRespOpcionesMulti($_REQUEST['idresp_preg'],$_REQUEST['valor']));

}
else if($_REQUEST['action']=='eliminarRespOpcionesMulti') {
    print_r($respuestaC->eliminarRespOpcionesMulti($_REQUEST['idresp_preg'],$_REQUEST['valor']));

}
?>