angular.module('AppPrueba')
    .controller('MostrarUserController', function ($scope,MostrarUserService,mapService,$state,UserService, FormularioResolver,$uibModal, Pagination,ResponderService,$timeout,$log, $document, $http,$rootScope) {
        $scope.fincas = [];
        $scope.gidFinca = "";
        $scope.formActual = 0;
        $scope.apartoGid ="";
        $scope.apartoAtual = "";
        $scope.formularios = [];
        $scope.formulariosFincaAcual = [];
        $scope.formulariosFincaAparto = [];
        $scope.idFinca = 0;

        $scope.apartoClickStack = [];



        /*****PRINCIPALES VARIABLES DE LOS FORMS - ACA ESTAN LOS DE CARGA-RESPUESTA*/
        $scope.seccionActiva = 0;
        $scope.preguntas = [];
        $scope.categorias = [];
        $scope.peopleEdit = [];
        $scope.respaldoEdicion = [];
        $scope.respaldoPreguntas = [];
        $scope.DataForm =[]; //muestra el nombre del formulario
        $scope.list2 = [];
        $scope.list2.respuestas = [];
        $scope.ID_Aparto_Finca_Form = "";
        /************************************************************************/


        $scope.heightpanel = screen.height - ((screen.height/3)+ (screen.height/9));



        // Se debe de obtener el id del usuario
        $scope.idUser = UserService.username;
        MostrarUserService.getFincas($scope.idUser).then(function (data) {
            $scope.fincas = data;
        });

        $scope.change = function(){
            /**************************FUNCIONES DEL MAPA *************************************************/
            mapService.clearListeners();
            mapService.removeTool("info");
            mapService.removeTool("union");
            mapService.removeTool("divide");
            mapService.removeTool("search");
            mapService.createInfoApartoTool("select",unir); // crea la herramienta para seleccionar aparto y ver informacion
            mapService.removeSearchControl();
            mapService.setMapTools(["drag","info"]);
            mapService.setTool("drag");
            $scope.actualizarlistaForm();


        };

        $scope.json = [];
        function reconvertJsonPolygon(puntos,aparto) {
            var json = [];
            var points = '';

            for(var i = 0; i < puntos.length; i++) {
                for (var j = 0; j < puntos[i].puntos.length; j++) {
                    points += puntos[i].puntos[j].x + ',' + puntos[i].puntos[j].y + ' ';
                }
                json.push({gid:puntos[i].gid,puntos: points.slice(0, points.length-1)});
                points = '';
            }
            if(!aparto)
                $scope.json = json;
            else
                $scope.jsonSeleccionado=json;
        }
        
        function changeColorsToSelectedAparto(overlay) {
            for(var i in $scope.apartoClickStack){
                if($scope.apartoClickStack[i] == overlay){
                    $scope.apartoClickStack[i].setStyle( {lineColor: "#FFFFFF", weight: 3, fillColor: "#00e600", fillOpacity: 0.3});
                }else {
                    $scope.apartoClickStack[i].setStyle( {lineColor: "#FFFFFF", weight: 3, fillColor: "#EB0812", fillOpacity: 0.3});
                }
            }
        };


        $scope.gidAparto = "";
        $scope.jsonSeleccionado=[];
        function unir(event){
            $scope.apartoClickStack.push(event.data);
            changeColorsToSelectedAparto(event.data);
            $scope.apartoGid = event.data.getMetaData().gidAparto;
            cargarformApartos();
            //mapService.closeInfoWindow();
        };

        $scope.gotoForm = function(){

            $state.go("dashboard.formularioGanaderia");
        };

        /**
         * Trae los formularios relacionados a una finca y usuario
         */
        $scope.actualizarlistaForm = function () {
            MostrarUserService.getFormulariosFinca(FormularioResolver.idFincaAResponder).then(function (data) {
                console.log(data);
                if(data != "false") {
                    $scope.formulariosFincaAcual = data;
                }
                else {
                    $scope.formulariosFincaAcual = [];
                }
            });
        };
        //trae la lista de forms de un aparto específico, para que el use decida cual responder.
        function cargarformApartos() {
            console.log($scope.apartoGid);
            MostrarUserService.getFormulariosAparto($scope.apartoGid).then(function (data) {
                console.log(data);
                if(data != "false") {
                    $scope.formulariosFincaAparto = data;
                }
                else {
                    $scope.formulariosFincaAparto = [];
                }
            })
        }


        //control de modal para responder un form
        var $ctrl = this;
        $ctrl.animationsEnabled = true;
        $ctrl.openForm = function (size, parentSelector) {
            var parentElem = parentSelector ?
                angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
            var modalInstance = $uibModal.open({
                animation: $ctrl.animationsEnabled,
                ariaLabelledBy: 'modal-titleForm',
                ariaDescribedBy: 'modal-bodyForm',
                templateUrl: 'myModalContentForm.html',
                controller: 'ModalInstanceCtrlForm',
                controllerAs: '$ctrl',
                size: size,
                appendTo: parentElem
            });

            modalInstance.result.then(function (infoForm) {
                $scope.infoForm = infoForm;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        //CAMBIA EL ESTADO AL FORMULARIO SELECCIONADO PARA RESPONDERLO
        $scope.chooseForm = function(idform){
            console.info(idform);
            FormularioResolver.idFormularioResolver = idform;
            //$state.go("dashboardUser.responderForm")
            //$ctrl.openForm();
            $scope.responderFormulario();
            $('#modalResponder').modal('show');

        };

        $scope.responderFormulario = function () {
            console.info("ENTRO");
            console.log("IDForm: " + FormularioResolver.idFormularioResolver + "IDFinca: " + FormularioResolver.idFincaAResponder);


            ResponderService.getID_Aparto_Finca_Form(FormularioResolver.idFormularioResolver, FormularioResolver.idFincaAResponder).then(function (data) {
                console.log(data);
                $scope.ID_Aparto_Finca_Form = data[0].id_finca_aparto_form;
                console.info($scope.ID_Aparto_Finca_Form);
            });

            //ALERTAS DE EXITO Y FRACASO
            $scope.alertRespuesta = [
                //{ type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
                // { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
            ];

            $scope.closeAlertRespuesta = function (index) {
                $scope.alertRespuesta.splice(index, 1);
            };


            //trae los sigueintes datos: nombreform,idform,descripcion,fecha
            ResponderService.obtenerFormulario(FormularioResolver.idFormularioResolver).then(function (data) {
                //console.log(data);
                var item = {
                    nombre: data[0]["nombreform"],
                    descripcion: data[0]["descripcion"],
                    fecha: data[0]["fecha"],
                    nombreFinca:FormularioResolver.idFincaAResponder
                };
                $scope.DataForm = item;
                //console.log($scope.DataForm);
            });

            /****************************************CARGADO Y EDICIÓN DE FORMULARIOS*********************************************/

            var tempArray = [];
            var pregUsadas = [];
            $scope.edicion = function (callback) {
                var idForm = FormularioResolver.idFormularioResolver;
                //console.log("form: " + idForm);
                ResponderService.obtenerPaginasByID(idForm).then(function (pagina) {
                    //console.log(pagina);
                    ResponderService.obtenerAllPreguntas(idForm).then(function (pregunta) {
                        //console.log(pregunta);
                        for (var pag = 0; pag < pagina.length; pag++) {
                            var item = {
                                pagina: pagina[pag].descripcion,
                                orden: pagina[pag].orden,
                                idpag: pagina[pag].idpag,
                                preguntas: []
                            };
                            for (var preg = 0; preg < pregunta.length; preg++) {
                                if (pregunta[preg].descripcion === pagina[pag].descripcion) {

                                    if (pregunta[preg].options != undefined && pregunta[preg].options != null && pregunta[preg].options != "") {
                                        //console.log(pregunta[preg].options);

                                        var itemP = {
                                            idpreg: pregunta[preg].idpreg,
                                            name: pregunta[preg].titulo,
                                            enunciadopreg: pregunta[preg].enunciadopreg,
                                            categoria: pregunta[preg].categoria,
                                            hel: pregunta[preg].tipo,
                                            fijo: pregunta[preg].fijo,
                                            requerido: (pregunta[preg].requerido === "t"),
                                            mascara: pregunta[preg].mascara,
                                            options: pregunta[preg].options,
                                            answer: []


                                        };
                                    }
                                    else {
                                        var itemP = {
                                            idpreg: pregunta[preg].idpreg,
                                            name: pregunta[preg].titulo,
                                            enunciadopreg: pregunta[preg].enunciadopreg,
                                            categoria: pregunta[preg].categoria,
                                            hel: pregunta[preg].tipo,
                                            fijo: pregunta[preg].fijo,
                                            requerido: (pregunta[preg].requerido === "t"),
                                            mascara: pregunta[preg].mascara,
                                            answer: ""
                                        };
                                    }
                                    item.preguntas.push(itemP);

                                    pregUsadas.push(pregunta[preg].titulo);
                                    console.warn(item);
                                }

                            }

                            tempArray.push(item);
                            console.info(tempArray);
                        }
                        // $scope.peopleEdit = tempArray;
                        $scope.respaldoEdicion = angular.copy(tempArray);
                        $scope.pagination.numPages = pagina.length;
                        $scope.change(1);

                    });
                });


                callback(tempArray);
            };

            //carga el formulario a las seccion ya arrastrada y borra las preguntas usadas de las categ
            $scope.edicion(function (data) {
                $scope.peopleEdit = data;


                $scope.list2 = [
                    {
                        label: "Formulario",
                        people: $scope.peopleEdit
                    }

                ];

                $scope.list2.respuestas = $scope.list2;


            });


            /****************************************FIN CARGADO Y EDICIÓN DE FORMULARIOS*********************************************/




            // Model to JSON for demo purpose
            $scope.$watch('list2', function (list2) {
                $scope.modelAsJson = angular.toJson(list2, true);
            }, true);

            //for control expandable panel
            $scope.status = {
                isCustomHeaderOpen: false,
                isFirstOpen: true,
                isFirstDisabled: false
            };
            $scope.oneAtATime = true;

            //for control of pagination
            $scope.pagination = Pagination.getNew();
            //$scope.pagination = Pagination.getNew(2);
            //console.log($scope.list2[0].people.length);
            //$scope.pagination.numPages = Math.ceil($scope.list2[0].people.length/$scope.pagination.perPage);
            $scope.pagination.numPages = 0;


            /*    $scope.$watch('list2[0].people', function () {
             console.log("prove");
             $scope.pagination.numPages = Math.ceil($scope.list2[0].people.length/$scope.pagination.perPage);
             }, true);*/


            //*************************** PAGINAS *******************************************************

            $scope.$watch('nombrePagina', function () {
                if ($scope.nombrePagina != undefined) {
                    $scope.pagination.numPages += 1;
                    var item = {
                        pagina: $scope.nombrePagina,
                        orden: $scope.pagination.numPages,
                        preguntas: []

                    };
                    console.log($scope.nombrePagina);
                    $scope.nombrePagina = undefined;
                    $scope.list2[0].people.push(item);
                }
            });



            //cuando se presiona una pagina actualiza la varible con el #
            $scope.change = function (page) {

                $scope.seccionActiva = page;
                if ($scope.nombrePag = $scope.list2[0].people.length == 0) {
                    $scope.nombrePag = "Vacío"
                }
                else {

                    $scope.nombrePag = $scope.list2[0].people[$scope.seccionActiva - 1].pagina;
                }

            };


            $scope.myFilter = function (person) {
                return person.orden == $scope.seccionActiva;
            };


            //*************************** GUARDAR FORMULARIO *******************************************************



            //Guarda la respuestas del usuario
            $scope.guardarRespuestas = function (data) {
                var idRespuesta = "";
                //calcula la fecha y hora actual en milisegundos
                var currentdate = new Date().getTime();
                //inserta la respuesta del form
                var descripcion = "Respuesta al formulario " + $scope.DataForm.nombre +" en la finca: "+FormularioResolver.idFincaAResponder;
                ResponderService.insertarRespuesta(FormularioResolver.idFormularioResolver, $scope.ID_Aparto_Finca_Form,currentdate, descripcion).then(function (NA) {
                    //recupera la respuesta del form para insertar las preguntas ahora
                    console.log(NA);

                    ResponderService.getRespuestaform(FormularioResolver.idFormularioResolver, $scope.ID_Aparto_Finca_Form,currentdate).then(function (idresp) {

                        for(var pag = 0; pag < data.length; pag++) {
                            for (var preg = 0; preg < data[pag]["preguntas"].length; preg++) {
                                if (data[pag]["preguntas"][preg].hel != "checkbox") {
                                    ResponderService.insertResp_Preg(idresp[0]["idrespuesta"], data[pag]["preguntas"][preg].idpreg, data[pag]["preguntas"][preg].answer);
                                }
                                else{
                                    //esta parte es exclusiva para los checkbox porque tiene varias opciones
                                    //inserto la respuesta
                                    //luego la resp_preg
                                    ResponderService.insertResp_Preg(idresp[0]["idrespuesta"], data[pag]["preguntas"][preg].idpreg, "");

                                    for(var opc = 0; opc < data[pag]["preguntas"][preg]["answer"].length; opc++){
                                        //console.log(data[pag]["preguntas"][preg]["answer"][opc].opcion);
                                        ResponderService.insertRespOpcionesMulti(idresp[0]["idrespuesta"], data[pag]["preguntas"][preg].idpreg, data[pag]["preguntas"][preg]["answer"][opc].opcion).then(function () {
                                            console.info("guardado con éxito")
                                        }).catch(function (err) {

                                        });
                                    }

                                }
                            }
                        }
                    });
                });

                $('#modalResponder').modal('hide');
                $scope.alertRespuesta.push({type: 'success', msg: 'Respuesta enviada con éxito!'});
               //$state.go("dashboardUser.mostrarUser"); TODO: replantear donde envar ahora
            };


            $scope.validar =function (lista) {
                var bandera = false;
                var data = lista[0].people;
                console.log(data);
                for(var pag = 0; pag < data.length; pag++) {
                    if(bandera){
                        break;
                    }
                    for (var preg = 0; preg < data[pag]["preguntas"].length; preg++) {

                        if(data[pag]["preguntas"][preg].requerido){

                            if(data[pag]["preguntas"][preg].answer == "" || data[pag]["preguntas"][preg].answer == null || data[pag]["preguntas"][preg].answer == undefined){

                                console.log(data[pag]["preguntas"][preg].name +": " + data[pag]["preguntas"][preg].answer);
                                alert("Hay datos incompletos: " + data[pag]["preguntas"][preg].name);
                                bandera=true;
                                break;
                            }
                        }
                    }
                }
                if(bandera == false){
                    $scope.alertRespuesta.push({ type: 'success', msg: 'Guardado'});
                    //$("#basicModal").modal("show");
                    $scope.guardarRespuestas(data);
                }

            };

            $scope.back =  function(){
                $scope.guardarRespuestas(data);
            };

            $scope.toggle = function (item, list) {
                console.log(item);
                var idx = list.map(function(d) { return d["opcion"]; }).indexOf(item.opcion);
                if (idx > -1) {
                    list.splice(idx, 1);
                }
                else {
                    list.push(item);
                }
            };
        };

    });

angular.module('AppPrueba').controller('ModalInstanceCtrl', function ($scope, $uibModalInstance) {
    var $ctrl = this;
    $ctrl.ok = function () {
        //$uibModalInstance.close($scope.nombrePagina);
    };

    $ctrl.cancel = function () {
        $uibModalInstance.close(undefined);
    };
});
