
angular.module('AppPrueba')

    .controller('AdministrarFormulario',function ($scope, Pagination,AdministrarFormService,$uibModal, $log, $document, InsertarFormularioFincaxForm) {
        $scope.accion = {action:"Crear", icon:"floppy-saved" };//editar
        $scope.tiposPregunta = [];
        $scope.preguntas = [];
        $scope.categorias = [];
        $scope.opciones = [];
        $scope.opcionesRespaldo = [];
        $scope.idpregEditar="";
        $scope.heightListaPreg = screen.height - (screen.height/3) - 12;
        //Nombre de categoría en caso de ser una nueva
        $scope.nombreCategoriaPregunta ="";
        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };
        $scope.alerts = [

        ];

        $scope.actualizarPreguntasCargadas = function () {
            //Inicializar campos
            $scope.opciones = [];
            $scope.tituloPregunta = undefined;
            $scope.enunciadoPregunta = undefined;
            $scope.categoriaElegidaPregunta = undefined;
            $scope.fijoPregunta = undefined;
            $scope.requeridoPregunta = undefined;
            $scope.tipoPregunta =undefined;
            $scope.nombreCategoriaPregunta = undefined;

            $scope.tiposPregunta =[ {name:"Texto",value:"text"},
            {name:"Área de texto",value:"textarea"},
            {name:"Lista",value:"select"},
            {name:"Selección única",value:"radio"},
            {name:"Selección multiple",value:"checkbox"}];
            //obtiene la lista de categorías para filtrar los datos en el typesTAG5
            AdministrarFormService.obtenerCategorias().then(function (data) {
                $scope.categorias = data;
                console.log($scope.categorias);
            });

            AdministrarFormService.getPreguntas().then(function (data) {
                $scope.preguntas = data;

                $scope.lists = [
                    {
                        label: "Tipos de preguntas",
                        people: $scope.preguntas
                    }

                ];
                console.log( $scope.preguntas)
            });
        }

        $scope.agregarOpcion = function(){
            if($scope.opcionNueva == undefined || $scope.opcionNueva == ""  )
            {
                $scope.alerts.push({type: 'warning',msg: 'Añada una opción valida!'});
            }
            else if($scope.buscarElemArr($scope.opcionNueva) == true)
            {
                $scope.alerts.push({type: 'warning',msg: 'Opción repetida!'});
            }
            else {
                $scope.opciones.push({idopc:"",opcion:$scope.opcionNueva});
                $scope.opcionNueva = "";
            }
        }

        $scope.buscarElemArr = function (elem) {
            for (var i = 0; i < $scope.opciones.length; i++) {
                if($scope.opciones[i] == elem)
                {
                    return true;
                }
                else {
                    return false;
                }
            };

        }


        $scope.eliminarPregForm = function (id) {
            if($scope.opciones == null){
                $scope.opciones =[];
            }
            var index = $scope.opciones.map(function(d) { return d["idopc"]; }).indexOf(id);
            $scope.opciones.splice(index,1);

        };
        var agregarBD = function(mascara)
        {
            if ($scope.categoriaElegidaPregunta == 'otro') {
                $scope.categoriaElegidaPregunta = $scope.nombreCategoriaPregunta;
            }

            AdministrarFormService.insertarPreguntas($scope.tituloPregunta,$scope.enunciadoPregunta,$scope.categoriaElegidaPregunta, $scope.tipoPregunta, $scope.fijoPregunta, $scope.requeridoPregunta, mascara).then(function (data) {
            });

            for (var i = 0; i < $scope.opciones.length; i++) {
                console.log($scope.opciones[i])
                AdministrarFormService.insertarOpciones(i, $scope.opciones[i].opcion).then(function (data) {
                });
            }
            $scope.actualizarPreguntasCargadas();
            $scope.alerts.push({type: 'warning',msg: 'Se ha insertado con éxito!'});
        }





        var editarBD = function(mascara)
        {
            if ($scope.categoriaElegidaPregunta == 'otro') {
                $scope.categoriaElegidaPregunta = $scope.nombreCategoriaPregunta;
            }

            AdministrarFormService.editarPregunta( $scope.idpregEditar,$scope.tituloPregunta,$scope.enunciadoPregunta,$scope.categoriaElegidaPregunta, $scope.tipoPregunta, $scope.fijoPregunta, $scope.requeridoPregunta, mascara).then(function (data) {
            });
            console.log("quququq")
            if($scope.tipoPregunta == "text" || $scope.tipoPregunta== "textarea")
            {
                console.log("lalala")
                for (var i = 0; i < $scope.opciones.length; i++) {
                    AdministrarFormService.eliminarOpcionById($scope.opciones[i].idopc).then(function (data) {
                    });

                }
            }
            else
            {

                for (var i = 0; i < $scope.opciones.length; i++) {

                    if($scope.opciones[i].idopc == "")
                    {
                        console.log("a")
                        AdministrarFormService.insertarOpcionByIdPreg($scope.idpregEditar,i,$scope.opciones[i].opcion).then(function (data) {
                        });
                    }
                    else
                    {   console.log("ab")
                        AdministrarFormService.editarOpcionById($scope.opciones[i].idopc,$scope.opciones[i].opcion,i).then(function (data) {
                        });
                    }

                }

                for (var i = 0; i < $scope.opcionesRespaldo.length; i++) {
                   var existe =  $scope.opciones.map(function(d) { return d["idopc"]; }).indexOf($scope.opcionesRespaldo[i].idopc);
                    if(existe == -1)
                    {
                        AdministrarFormService.eliminarOpcionById($scope.opcionesRespaldo[i].idopc).then(function (data) {
                        });
                    }
                }

            }

            /*
            for (var i = 0; i < $scope.opciones.length; i++) {
                console.log($scope.opciones[i])
                AdministrarFormService.insertarOpciones(i, $scope.opciones[i]).then(function (data) {
                });
            */
            $scope.actualizarPreguntasCargadas();
            $scope.alerts.push({type: 'warning',msg: 'Se ha editado con éxito!'});
        }


        var agregarEditarBD = function (mascara) {
            if ($scope.accion.action == "Crear")
            {
                agregarBD(mascara);
            }
            else
            {
                editarBD(mascara);
            }

        }



        $scope.agregarEditarPregunta = function() {
            mascara = "";
            if($scope.tituloPregunta == undefined || $scope.enunciadoPregunta == undefined ||  $scope.categoriaElegidaPregunta == undefined ||
                $scope.tipoPregunta == undefined ||  $scope.fijoPregunta == undefined || $scope.requeridoPregunta == undefined || ($scope.categoriaElegidaPregunta == "otro" && $scope.nombreCategoriaPregunta == undefined)){
                console.log("No se puede");
                $scope.alerts.push({type: 'danger',msg: 'Rellene todos los campos!'});
            }

            else if($scope.tipoPregunta != "text" && $scope.tipoPregunta!= "textarea")
            {
                if($scope.opciones.length == 0)
                {
                    $scope.alerts.push({type: 'warning',msg: 'Debe tener al menos una opción!'});
                }
                else
                {
                    agregarEditarBD(mascara);
                }
            }

            else {
                agregarEditarBD(mascara);
            }


        }
        $scope.limpiarCampos = function () {
            $scope.opciones = [];
            $scope.tituloPregunta = undefined;
            $scope.enunciadoPregunta = undefined;
            $scope.categoriaElegidaPregunta = undefined;
            $scope.fijoPregunta = undefined;
            $scope.requeridoPregunta = undefined;
            $scope.tipoPregunta =undefined;
            $scope.nombreCategoriaPregunta = undefined;

            if ($scope.accion.action == "Editar")
            {
                $scope.accion = {action:"Crear", icon:"floppy-saved" }
            }
        }

        var traduccionBoolean = function (elem) {
            if(elem == "t")
            {
                return "True";
            }
            else
                return "False";
        }
        


        $scope.cargarPregunta = function(idpreg)
        {   $scope.idpregEditar = idpreg;
            $scope.actraduccionBooleancion = {action:"Editar", icon:"pencil"}
            pregActual = {};
            AdministrarFormService.getPreguntaById(idpreg).then(function (data) {
                pregActual = data[0];

                AdministrarFormService.getOpcionesById(idpreg).then(function (data) {
                    console.log(data);
                    if(data != "false") {
                        $scope.opciones = data;
                        $scope.opcionesRespaldo = angular.copy($scope.opciones);
                        console.log($scope.opcionesRespaldo);
                    }
                    else
                    {
                        $scope.opciones = [];
                    }
                });

                $scope.tituloPregunta = pregActual.titulo;
                $scope.enunciadoPregunta = pregActual.enunciadopreg;
                $scope.categoriaElegidaPregunta = pregActual.categoria;
                $scope.fijoPregunta = traduccionBoolean(pregActual.fijo);
                $scope.requeridoPregunta = traduccionBoolean(pregActual.requerido);
                $scope.tipoPregunta = pregActual.tipo;



            });
        }

        //Primera llamada
        $scope.actualizarPreguntasCargadas();







    });






