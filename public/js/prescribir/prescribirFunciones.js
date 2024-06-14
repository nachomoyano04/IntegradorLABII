//-------------------------------FUNCIONES GENÉRICAS-------------------------------//

const borrarAutocompletadoAnterior = (elemento) => {
    while(elemento.hasChildNodes()){
        elemento.removeChild(elemento.firstChild);
    }
}
const mensajeLlenarEspacioMedicamentoYPrestaciones = (elemento, mensajeError, color) => {
    elemento.style.border = `3px solid ${color||"red"}`;
    let placeholder = elemento.placeholder;
    elemento.placeholder = mensajeError || placeholder;
    setTimeout(() => {
        elemento.style.border = "1px solid black";
        elemento.style.color = "black";
        elemento.placeholder = placeholder;
    },1000)
}
const borrarAutocompletadoClickEverywhere = () => {
    let bodyInicio = document.querySelector(".bodyInicio");
    let autocompletadoMedicamentos = document.querySelectorAll(".autocompletadoMedicamentos");
    let autocompletadoPrestaciones = document.querySelectorAll(".autocompletadoPrestaciones");
    autocompletadoMedicamentos.forEach(elemento => {
        bodyInicio.addEventListener("click", () => {
            borrarAutocompletadoAnterior(elemento);
        })
    })
    autocompletadoPrestaciones.forEach(elemento => {
        bodyInicio.addEventListener("click", () => {
            borrarAutocompletadoAnterior(elemento);
        })
    })
}

//-------------------------------SECCIÓN CREAR PRESTACIONES-------------------------------//
const crearPrestacionParaAutocompletado = (prestacion) => {
    let ul = document.createElement("ul");
    let liNombre = document.createElement("li");
    liNombre.innerHTML = `${prestacion.nombrePrestacion}`;
    ul.appendChild(liNombre)
    return ul;
}

//-------------------------------SECCIÓN LISTAR PRESCRIPCIONES ANTERIORES-------------------------------//
const listadoDePrescripcionesAnteriores = (prescripcionesAnteriores, idPaciente) => {
    let div = document.createElement("div");
    let presAnt = prescripcionesAnteriores;
    prescripcionesAnteriores = acomodarPrescripciontesAnteriores(prescripcionesAnteriores);
    for(let pa of prescripcionesAnteriores){
        console.log(pa)
        let ul = document.createElement("ul"); 
        let liDiagnostico = document.createElement("li"); //ITEM DIAGNOSTICO
        liDiagnostico.innerHTML = `Diagnóstico: ${pa.diagnostico}`;
        let liFecha = document.createElement("li"); //ITEM FECHA
        liFecha.innerHTML = `Fecha: ${new Date(pa.fecha).toLocaleDateString()}`;
        let liVigencia = document.createElement("li"); //ITEM VIGENCIA
        liVigencia.innerHTML = `Vigencia: ${new Date(pa.vigencia).toLocaleDateString()}`;
        ul.appendChild(liDiagnostico);
        ul.appendChild(liFecha);
        ul.appendChild(liVigencia);
        if(pa.medicamentos.nombreGenerico.length > 0){
            for(let i = 0; i < pa.medicamentos.nombreGenerico.length; i++){
                let liMedicamento = document.createElement("li"); // ITEM MEDICAMENTO
                let medicamento = `Medicamento ${i+1}: ${pa.medicamentos.nombreGenerico[i]} ${pa.medicamentos.cantidadConcentracion[i]} ${pa.medicamentos.unidadMedidaCon[i]} ${pa.medicamentos.forma[i]} x${pa.medicamentos.cantidadPresentacion[i]} ${pa.medicamentos.unidadMedidaPres[i]}`;
                liMedicamento.innerHTML = medicamento;
                ul.appendChild(liMedicamento);
            }
        }
        if(pa.prestaciones.nombrePrestacion.length > 0){
            for(let i = 0; i < pa.prestaciones.nombrePrestacion.length; i++){
                let liPrestacion = document.createElement("li"); // ITEM PRESTACION
                    let nombresLados = presAnt[1][i].nombresLados.split(",");
                    console.log(presAnt[1][i]);
                    let lados = "";
                    for(let n of nombresLados){
                        lados += `, lado ${n}`;
                    }   
                    liPrestacion.innerHTML = `Prestacion ${i+1}: ${pa.prestaciones.nombrePrestacion[i]} ${lados}, indicacion: ${pa.prestaciones.indicacion[i]}, justificacion: ${pa.prestaciones.justificacion[i]}`;
                    ul.appendChild(liPrestacion);
                    let divResultadoPrestacion = document.createElement("div");divResultadoPrestacion.className ="divResultadoPrestacion";
                    if(pa.prestaciones.resultadoPrestacion[i] === null){
                        let divAniadirResultado = document.createElement("div"); //DIV QUE TENDRA BOTON Y TEXT AREA RESULTADO/OBSERVACION
                        divAniadirResultado.className = "divAniadirResultado";
                        crearDivAniadirResultado(divAniadirResultado, pa.idPrescripcion, pa.prestaciones.idPrestacion[i], divResultadoPrestacion); //Funcion que crea boton añadir y guardar resultado. Y textArea 
                        divResultadoPrestacion.appendChild(divAniadirResultado);
                    }else{
                        let liResultado = document.createElement("li");
                        liResultado.innerHTML = `Resultado/Observación: ${pa.prestaciones.resultadoPrestacion[i]}`;
                        divResultadoPrestacion.appendChild(liResultado)
                    }
                    ul.appendChild(divResultadoPrestacion);
                    }
            }
                    // let idPrescripciones = new Set();
                    // prescripcionesAnteriores[0].forEach(e => idPrescripciones.add(e.idPrescripcion));
                    let botonImprimirPrescripcion = document.createElement("button");
                    botonImprimirPrescripcion.innerHTML = "IMPRIMIR PRESCRIPCION";
                    botonImprimirPrescripcion.dataset.action = "imprimir";
                    let idPrescripcion = pa.idPrescripcion;
                    botonImprimirPrescripcion.setAttribute("data-value", idPrescripcion);
                    ul.appendChild(botonImprimirPrescripcion)
                div.appendChild(ul);    
                    }
        return div;
    }
    
    // for (let pa of prescripcionesAnteriores[0]) {
    //     if (idPrescripciones.has(pa.idPrescripcion)) {
    //         let ul = document.createElement("ul"); 
    //         let liDiagnostico = document.createElement("li");
    //         liDiagnostico.innerHTML = `Diagnóstico: ${pa.diagnostico}`;
    //         let liFecha = document.createElement("li");
    //         liFecha.innerHTML = `Fecha: ${new Date(pa.fecha).toLocaleDateString("en-GB")}`;
    //         let liVigencia = document.createElement("li");
    //         liVigencia.innerHTML = `Vigencia: ${new Date(pa.vigencia).toLocaleDateString("en-GB")}`;
    //         ul.appendChild(liDiagnostico);
    //         ul.appendChild(liFecha);
    //         ul.appendChild(liVigencia);
    
    //         let liMedicamento = document.createElement("li");
    //         let medicamento = `Medicamento: ${pa.nombreGenerico} ${pa.cantidadConcentracion} ${pa.unidadMedidaCon} ${pa.forma} x${pa.cantidadPresentacion} ${pa.unidadMedidaPres}`;
    //         liMedicamento.innerHTML = medicamento;
    //         ul.appendChild(liMedicamento);
    
    //         prescripcionesAnteriores[1].forEach(e => {
    //             if (e.idPrescripcion === pa.idPrescripcion) {
    //                 let liPrestacion = document.createElement("li");
    //                 let nombresLados = e.nombresLados.split(",");
    //                 let lados = nombresLados.map(n => `lado ${n}`).join(", ");
    //                 liPrestacion.innerHTML = `Prestacion: ${e.nombrePrestacion} ${lados}, indicacion: ${e.indicacion}, justificacion: ${e.justificacion}`;
    //                 ul.appendChild(liPrestacion);
    
    //                 let divResultadoPrestacion = document.createElement("div");
    //                 divResultadoPrestacion.className = "divResultadoPrestacion";
    //                 if (e.resultadoPrestacion === null) {
    //                     let divAniadirResultado = document.createElement("div");
    //                     divAniadirResultado.className = "divAniadirResultado";
    //                     crearDivAniadirResultado(divAniadirResultado, e.idPrescripcion, e.idPrestacion, divResultadoPrestacion);
    //                     divResultadoPrestacion.appendChild(divAniadirResultado);
    //                 } else {
    //                     let liResultado = document.createElement("li");
    //                     liResultado.innerHTML = `Resultado/Observación: ${e.resultadoPrestacion}`;
    //                     divResultadoPrestacion.appendChild(liResultado);
    //                 }
    //                 ul.appendChild(divResultadoPrestacion);
    
    //                 let botonImprimirPrescripcion = document.createElement("button");
    //                 botonImprimirPrescripcion.innerHTML = "IMPRIMIR PRESCRIPCION";
    //                 botonImprimirPrescripcion.dataset.action = "imprimir";
    //                 botonImprimirPrescripcion.setAttribute("data-value", e.idPrescripcion);
    //                 ul.appendChild(botonImprimirPrescripcion);
    //             }
    //         });
    //         idPrescripciones.delete(pa.idPrescripcion);
    //         div.appendChild(ul);
    //     }
    // }
    
    // for (let pa of prescripcionesAnteriores[1]) {
    //     if (idPrescripciones.has(pa.idPrescripcion)) {
    //         let ul = document.createElement("ul");
    //         let liPrestacion = document.createElement("li");
    //         let nombresLados = pa.nombresLados.split(",");
    //         let lados = nombresLados.map(n => `lado ${n}`).join(", ");
    //         liPrestacion.innerHTML = `Prestacion: ${pa.nombrePrestacion} ${lados}, indicacion: ${pa.indicacion}, justificacion: ${pa.justificacion}`;
    //         ul.appendChild(liPrestacion);
    
    //         let divResultadoPrestacion = document.createElement("div");
    //         divResultadoPrestacion.className = "divResultadoPrestacion";
    //         if (pa.resultadoPrestacion === null) {
    //             let divAniadirResultado = document.createElement("div");
    //             divAniadirResultado.className = "divAniadirResultado";
    //             crearDivAniadirResultado(divAniadirResultado, pa.idPrescripcion, pa.idPrestacion, divResultadoPrestacion);
    //             divResultadoPrestacion.appendChild(divAniadirResultado);
    //         } else {
    //             let liResultado = document.createElement("li");
    //             liResultado.innerHTML = `Resultado/Observación: ${pa.resultadoPrestacion}`;
    //             divResultadoPrestacion.appendChild(liResultado);
    //         }
    //         ul.appendChild(divResultadoPrestacion);
    
    //         let botonImprimirPrescripcion = document.createElement("button");
    //         botonImprimirPrescripcion.innerHTML = "IMPRIMIR PRESCRIPCION";
    //         botonImprimirPrescripcion.dataset.action = "imprimir";
    //         botonImprimirPrescripcion.setAttribute("data-value", pa.idPrescripcion);
    //         ul.appendChild(botonImprimirPrescripcion);
    
    //         idPrescripciones.delete(pa.idPrescripcion);
    //         div.appendChild(ul);
    //     }
    // }

let divPrescripcionesAnterioresPaciente = document.querySelector("#prescripcionesAnterioresPaciente");
divPrescripcionesAnterioresPaciente.addEventListener("click", (evento) => {
    if(evento.target.closest("button")){
        let btn = evento.target.closest("button");
        let action = btn.dataset.action;
        if(action === "imprimir"){
            let idPrescripcion = btn.getAttribute("data-value");
            axios.post(`http://localhost:3000/prescribir/prescripcionesByIdPrescripcion`,{idPrescripcion})
            .then(res => {
                let medicamentos = [];
                for(let m of res.data[0]){
                    let medicamento = `${m.nombreGenerico} ${m.cantidadConcentracion} ${m.unidadMedidaCon} ${m.forma} x${m.cantidadPresentacion} ${m.unidadMedidaPres}`;
                    medicamentos.push(medicamento);
                }
                let prestaciones = [];
                for(let p of res.data[1]){
                    let nombrePrestacion = `${p.nombrePrestacion}`;
                    let indicacion = `${p.indicacion}`;
                    let justificacion = `${p.justificacion}`;
                    let nombresLados = p.nombresLados.split(",");
                    let prestacion = {nombrePrestacion, indicacion, justificacion, nombresLados}; 
                    prestaciones.push(prestacion);
                }
                let demasDatos = res.data[1][0];
                let diagnostico = demasDatos.diagnostico;
                let fecha = new Date(demasDatos.fecha);
                fecha = fecha.toLocaleDateString("en-GB");
                let vigencia = new Date(demasDatos.vigencia);
                vigencia = vigencia.toLocaleDateString("en-GB");
                let nombreMedico = demasDatos.nombreMedico; 
                let apellidoMedico = demasDatos.apellidoMedico;
                let refepsMedico = demasDatos.idRefeps;
                let medico = {nombreMedico, apellidoMedico, refepsMedico};
                let nombrePaciente = demasDatos.nombrePaciente;
                let apellidoPaciente = demasDatos.apellidoPaciente;
                let documentoPaciente = demasDatos.documentoPaciente;
                let paciente = {nombrePaciente,apellidoPaciente,documentoPaciente};
                let prescripcion = {diagnostico, fecha, vigencia, medico, paciente, medicamentos, prestaciones};
                imprimir(prescripcion);
            })
        }
    }
})

const imprimir = (prescripcion) => {
    const { jsPDF } = window.jspdf;
    let pdf = new jsPDF();

    const pageHeight = pdf.internal.pageSize.height; //Altura de la página
    let y = 20; 

    const addText = (text, x, y) => {
        if (y + 10 > pageHeight) {
            pdf.addPage();
            y = 20;
        }
        pdf.text(text, x, y);
        return y + 10;
    };

    //Título
    pdf.setFontSize(16);
    y = addText("Prescripción Médica", 20, y);

    //Datos de la prescripción
    pdf.setFontSize(12);
    y = addText(`Fecha: ${prescripcion.fecha}`, 20, y);
    y = addText(`Vigencia: ${prescripcion.vigencia}`, 20, y);

    // Datos del médico
    y = addText("Médico:", 20, y);
    y = addText(`Nombre: ${prescripcion.medico.nombreMedico}`, 30, y);
    y = addText(`Apellido: ${prescripcion.medico.apellidoMedico}`, 30, y);
    y = addText(`RefEPS: ${prescripcion.medico.refepsMedico}`, 30, y);

    // Datos del paciente
    y = addText("Paciente:", 20, y);
    y = addText(`Nombre: ${prescripcion.paciente.nombrePaciente}`, 30, y);
    y = addText(`Apellido: ${prescripcion.paciente.apellidoPaciente}`, 30, y);
    y = addText(`Documento: ${prescripcion.paciente.documentoPaciente}`, 30, y);

    // Medicamentos
    pdf.setFontSize(14);
    y = addText("Medicamentos:", 20, y);
    pdf.setFontSize(12);
    prescripcion.medicamentos.forEach(med => {
        y = addText(med, 30, y);
    });

    // Prestaciones
    pdf.setFontSize(14);
    y = addText("Prestaciones:", 20, y);
    pdf.setFontSize(12);
    prescripcion.prestaciones.forEach(pres => {
        y = addText(pres.nombrePrestacion, 30, y);
        y = addText(`Indicación: ${pres.indicacion}`, 30, y);
        y = addText(`Justificación: ${pres.justificacion}`, 30, y);
        pres.nombresLados.forEach(lado => {
            y = addText(`lado: ${lado}`, 30, y);
        });
        y += 10;
    });

    // Guardar documento
    pdf.save("prescripcion.pdf");
}

let acomodarPrescripciontesAnteriores = (prescripcionesAnteriores) => {
    let medicamentos = prescripcionesAnteriores[0];
    let prestaciones = prescripcionesAnteriores[1];
    const prescripciones = [];
    if(medicamentos){
        for(let m of medicamentos){
            let yaExiste = prescripciones.some(e => e.idPrescripcion === m.idPrescripcion);
            if(yaExiste){
                let prescripcion = prescripciones.find(e => e.idPrescripcion === m.idPrescripcion);
                prescripcion.medicamentos.nombreGenerico.push(m.nombreGenerico);
                prescripcion.medicamentos.nombreComercial.push(m.nombreComercial);
                prescripcion.medicamentos.cantidadConcentracion.push(m.cantidadConcentracion);
                prescripcion.medicamentos.unidadMedidaCon.push(m.unidadMedidaCon);
                prescripcion.medicamentos.forma.push(m.forma);
                prescripcion.medicamentos.cantidadPresentacion.push(m.cantidadPresentacion);
                prescripcion.medicamentos.unidadMedidaPres.push(m.unidadMedidaPres);
            }else{
                let objeto = {
                    idPrescripcion:m.idPrescripcion,
                    diagnostico: m.diagnostico,
                    fecha:m.fecha,
                    vigencia:m.vigencia,
                    medicamentos:{nombreGenerico: [m.nombreGenerico],
                                  nombreComercial: [m.nombreComercial], 
                                  cantidadConcentracion: [m.cantidadConcentracion],
                                  unidadMedidaCon: [m.unidadMedidaCon],
                                  forma: [m.forma],
                                  cantidadPresentacion: [m.cantidadConcentracion],
                                  unidadMedidaPres: [m.unidadMedidaPres]},
                    prestaciones:{nombrePrestacion: [],
                                   lado:[],
                                   indicacion:[],
                                   justificacion:[],
                                   resultadoPrestacion:[],
                                   idPrestacion:[]}
                }
                prescripciones.push(objeto);
            }
        }
    }
    if(prestaciones){
        for(let p of prestaciones){
            let yaExiste = prescripciones.some(e => e.idPrescripcion === p.idPrescripcion);
            if(yaExiste){
                let prescripcion = prescripciones.find(e => e.idPrescripcion === p.idPrescripcion);
                prescripcion.prestaciones.nombrePrestacion.push(p.nombrePrestacion);
                prescripcion.prestaciones.lado.push(p.lado);
                prescripcion.prestaciones.indicacion.push(p.indicacion);
                prescripcion.prestaciones.justificacion.push(p.justificacion);
                prescripcion.prestaciones.resultadoPrestacion.push(p.resultadoPrestacion);
                prescripcion.prestaciones.idPrestacion.push(p.idPrestacion);
            }else{
                let objeto = {
                    idPrescripcion:p.idPrescripcion,
                    diagnostico: p.diagnostico,
                    fecha:p.fecha,
                    vigencia:p.vigencia,
                    medicamentos:{nombreGenerico: [],
                        nombreComercial: [], 
                        cantidadConcentracion: [],
                        unidadMedidaCon: [],
                        forma: [],
                        cantidadPresentacion: [],
                        unidadMedidaPres: []},
                        prestaciones:{nombrePrestacion: [p.nombrePrestacion],
                            lado:[p.lado],
                            indicacion:[p.indicacion],
                            justificacion:[p.justificacion],
                            resultadoPrestacion: [p.resultadoPrestacion],
                            idPrestacion: [p.idPrestacion]}
                        }
                        prescripciones.push(objeto);
                    }
        }
    }
    return prescripciones;   
}

const crearDivAniadirResultado = (divAniadirResultado, idPrescripcion, idPrestacion, divResultadoPrestacion) => {
    let botonAniadirResultado = document.createElement("button"); //BOTON AÑADIR RESULTADO/OBSERVACIÓN
    botonAniadirResultado.className = "botonAniadirResultado"; 
    botonAniadirResultado.innerHTML = "Añadir resultado";
    //Escuchador de eventos para el boton añadir resultado/observación
    botonAniadirResultado.addEventListener("click", () => {
        //Escondemos el boton añadir resultado y creamos el boton guardar resultado y cancelar
        botonAniadirResultado.style.display = "none"; 
        let botonGuardarResultado = document.createElement("button"); botonGuardarResultado.type= "button";
        botonGuardarResultado.innerHTML = "Guardar resultado";
        botonGuardarResultado.className = "botonGuardarResultado";
        let botonCancelar = document.createElement("button");botonCancelar.type = "button";
        botonCancelar.innerHTML = "Cancelar";
        botonCancelar.className = "cancelarGuardarResultado";
        let textArea = document.createElement("textarea");
        textArea.className = "textAreaResultadoObservacion";
        textArea.placeholder = "Resultado/observación de la prescripción..."
        textArea.cols = 53;
        textArea.rows = 3;
        divAniadirResultado.appendChild(textArea);
        divAniadirResultado.appendChild(botonGuardarResultado);
        divAniadirResultado.appendChild(botonCancelar);
        botonGuardarResultado.addEventListener("click", () => {
            if(textArea.value !== ""){            
                axios.put("http://localhost:3000/prescribir/guardarResultado", {idPrestacion, resultado: textArea.value, idPrescripcion})
                .then(res => {
                    // Si se ha añadido correctamente eliminamos los botones, mostramos un mensaje en el text area
                    //  y al segundo llamamos a la funcion para crear el item del resultado...
                    if(res.data.aniadido){ 
                        botonGuardarResultado.remove();
                        botonCancelar.remove();
                        textArea.style.backgroundColor = "lightblue";
                        textArea.value= "RESULTADO AÑADIDO CORRECTAMENTE";
                        setTimeout(() => {
                            borrarDivResultadoEInsertarLiResultado(divAniadirResultado, divResultadoPrestacion, res.data.resultado);
                        }, 1000)
                    }else{ //si no mostramos un mensaje de error en el text area y reiniciamos el boton añadir resultado
                        textArea.value = "ERROR AL GUARDAR EL RESULTADO, INTENTELO DE NUEVO...";
                        textArea.style.backgroundColor = "lightcoral";
                        textArea.setTimeout(() => {
                            textArea.innerHTML = "";
                            eliminarBotonesGuardarResultado(botonGuardarResultado, botonCancelar, textArea, botonAniadirResultado);
                        }, 1000);
                    }
                })
                .catch(error => console.log(error))
            }else{
                textArea.style.border = "2px solid red";
                setTimeout(() => {
                    textArea.style.border = "1px solid rgb(118, 118, 118)";   
                }, 1000)
            }
        });
        botonCancelar.addEventListener("click", () => {//Eliminamos los elementos creados y le cambiamos el display al botonAñadir
            eliminarBotonesGuardarResultado(botonGuardarResultado, botonCancelar, textArea, botonAniadirResultado);
        })
    })
    divAniadirResultado.appendChild(botonAniadirResultado);
}

const eliminarBotonesGuardarResultado = (boton1, boton2, textArea, botonAMostrar) => {
    boton1.remove();
    textArea.remove();
    boton2.remove();
    botonAMostrar.style.display = "inline-block";
}

const borrarDivResultadoEInsertarLiResultado = (divAniadirResultado, divResultadoPrestacion, resultado) => {
    //removemos el divAniadirResultado y creamos el li con el resultado cargado...
    divAniadirResultado.remove();
    let liResultado = document.createElement("li");
    liResultado.innerHTML = `Resultado/Observación: ${resultado}`;
    divResultadoPrestacion.appendChild(liResultado);
}

//-------------------------------SECCIÓN FUNCIONES DEL AUTOCOMPLETADO MEDICAMENTO-------------------------------//

// let contMedicamentos = 1;
const configurarBotonCrearMedicamento = (medicamentos) => {
    let botonAgregarMedicamento = document.querySelector("#botonAgregarMedicamento");
    let inputMedicamentoPrescripcion = document.querySelector("#inputMedicamentoPrescripcion");
    botonAgregarMedicamento.addEventListener("click", () => {
        let idMedicamentoDetalle = document.querySelector("#idMedicamentoDetalle");
        if(idMedicamentoDetalle.value !== ""){ // CHEQUEAMOS DE QUE HAYA UN MEDICAMENTO SELECCIONADO ANTES DE AÑADIR OTRO...
            agregarNuevoMedicamento(medicamentos/*, contMedicamentos*/);
            // contMedicamentos++;
            borrarAutocompletadoClickEverywhere();
        }else{
            mensajeLlenarEspacioMedicamentoYPrestaciones(inputMedicamentoPrescripcion, "SELECCIONE UN MEDICAMENTO ANTES DE AÑADIR OTRO", "red");
        }
    })
}

const agregarNuevoMedicamento = (medicamentos/*, contMedicamentos*/) => {
    let inputsMedicamentos = document.querySelectorAll(".inputMedicamentoPrescribir");
    if(inputsMedicamentos.length < 5){
        let numerosDisponibles = consultarQueNumerosQuedanDisponiblesDeMedicamentos();
        let contador = numerosDisponibles[0];
        let divMedicamentos = document.querySelector("#divMedicamentos");
        const label = document.createElement("label"); label.innerHTML = `Medicamento ${contador+1}`;
        const divInput = document.createElement("div");divInput.className = "inputMedicamentoPrescribir";
        divInput.id=`m${contador}`; //le ponemos un id para poder identificar el medicamento a eliminar 
        const medicamento = `
                                <div class="divAutocompletadoMedicamento">
                                    <div class="inputYBotonEliminarMedicamento">
                                        <input class="classEnComunCSS" id="inputMedicamentoPrescripcion${contador}" type="text" placeholder="opcional" autocomplete = "off", required>
                                        <button class="tooltip eliminarMedicamento" type="button">
                                            <i class="fa-solid fa-trash-can" style="color: #f50000;"></i>
                                            <p class="tooltiptext">Eliminar medicamento</p>
                                        </button> 
                                    </div>
                                    <input class="idMedicamentoDetalleHidden" type="hidden" name="idMedicamentoDetalle" id="idMedicamentoDetalle${contador}">
                                    <div class="autocompletadoMedicamentos"></div>
                                </div>`;
        divInput.innerHTML = medicamento;
        divMedicamentos.appendChild(label);    
        divMedicamentos.appendChild(divInput);
        let elemento = document.querySelector(`#inputMedicamentoPrescripcion${contador}`);
        let autocompletadoMedicamentos = document.querySelectorAll(".autocompletadoMedicamentos");
        let autocompletado = [];
        for(let am of autocompletadoMedicamentos){
            if(parseInt(am.parentElement.parentElement.id.slice(1)) === contador){
                autocompletado = am;
                break;
            }
        }
        // Evento que borra el medicamento
        (function(contador) {
            let botonEliminarMedicamento = divInput.querySelector(".eliminarMedicamento");
            botonEliminarMedicamento.addEventListener("click", () => { 
                //borramos el id del medicamento de nuestro arreglo de ids ya seleccionados
                let idMedicamentoDetalle = document.querySelector(`#idMedicamentoDetalle${contador}`);
                let indice = idsDeMedicamentos.indexOf(idsDeMedicamentos.find(e => e.id === parseInt(idMedicamentoDetalle.value)));
                if(indice > -1){
                    idsDeMedicamentos.splice(indice, 1);
                }
                //eliminamos el medicamento
                let divAEliminar = document.querySelector(`#m${contador}`);
                let label = divAEliminar.previousElementSibling; // Recuperamos el label que anuncia el numero de Medicamento
                divAEliminar.remove();
                label.remove();
            });
        })(contador);
        agregarEscuchadoresDeEventosAMedicamentos(medicamentos, autocompletado, elemento, contador)
    }else{
        Swal.fire({
            icon:"warning",
            title:"Máximo 5 medicamentos",
            timer: 2000
        })
    }
}

const consultarQueNumerosQuedanDisponiblesDeMedicamentos = () => {
    let medicamentos = document.querySelectorAll(".inputMedicamentoPrescribir");
    let numerosOcupados = [];
    let numeros = [1,2,3,4]; 
    for(let m of medicamentos){
        let n = parseInt(m.id.slice(1));
        if(n){
            numerosOcupados.push(n);
        }
    }
    numeros = numeros.filter((n) => !numerosOcupados.includes(n));
    return numeros;
}



const agregarEscuchadoresDeEventosAMedicamentos = (medicamentos, autocompletadoMedicamento, elemento, contador) => {
    elemento.addEventListener("input", (event) => {
        let palabra = event.target.value;        
        agregarAutocompletadoMedicamento(palabra, medicamentos, autocompletadoMedicamento, elemento, contador);
    })
}
let idsDeMedicamentos = [];
const agregarAutocompletadoMedicamento = (palabra, medicamentos, autocompletadoMedicamento, inputMedicamentos, contador) => {
    if(palabra !== ""){
        let idMedicamentoDetalle = document.querySelector("#idMedicamentoDetalle");
        if(contador){
            idMedicamentoDetalle = document.querySelector(`#idMedicamentoDetalle${contador}`);
        }
        //nos fijamos de que si el contenido del input no coincide con algun medicamento eliminamos el id del medicamento
        if(!idsDeMedicamentos.find(e => e.nombre === palabra) && idMedicamentoDetalle.value){
            idMedicamentoDetalle.value = "";
        }

        borrarAutocompletadoAnterior(autocompletadoMedicamento);
        let medicamentoRecomendado = medicamentos.filter(e => {
            const medicamentoString = e.nombreGenerico.concat(" ", e.cantidadConcentracion, " ",e.unidadMedidaCon, " ", e.forma, " x", e.cantidadPresentacion , " ", e.unidadMedidaPres);
            const comparacion = medicamentoString.toLowerCase().includes(palabra.toLowerCase())
            return comparacion && !idsDeMedicamentos.some(i => i.id === e.id); // mostramos los recomendados y que no hayan sido elegidos antes...
        });
        for(let mr of medicamentoRecomendado){
            let div = document.createElement("div");
            let contenido = mr.nombreGenerico.concat(" ", mr.cantidadConcentracion, " ",mr.unidadMedidaCon, " ", mr.forma, " x", mr.cantidadPresentacion , " ", mr.unidadMedidaPres);
            div.innerHTML = contenido;
            autocompletadoMedicamento.appendChild(div);
            div.addEventListener("click", () => {
                inputMedicamentos.value = contenido;
                inputMedicamentos.readOnly = true; //Limitamos a que no se pueda editar el input una vez seleccionado el medicamento...
                idsDeMedicamentos.push({id:mr.id, nombre:contenido});
                borrarAutocompletadoAnterior(autocompletadoMedicamento);
                idMedicamentoDetalle.value = mr.id; //AÑADIMOS EL ID AL INPUT HIDDEN QUE MANDA LA INFO EN EL POST
                // botonPrescribir.disabled = false; //deshabilitamos el boton prescribir

                agregarCamposAMedicamentoSeleccionado(contador); //IMPLEMENTARRRRRRRR............................
                
                //AGREGAMOS EL BOTON EDITAR INPUT MEDICAMENTO
                let divParaAgregarBoton = document.querySelectorAll(".inputYBotonEliminarMedicamento")
                if(contador){
                    agregarBotonEditarInput(inputMedicamentos, divParaAgregarBoton[contador-1], "Editar medicamento", "editarMedicamento", contador);
                }else{
                    divParaAgregarBoton = document.querySelector(".divLabelYBtnAgregarMedicamento");
                    agregarBotonEditarInput(inputMedicamentos, divParaAgregarBoton, "Editar medicamento", "editarMedicamento");
                }
            })
        }
    }else if(palabra === ""){
        //borramos el boton editar creado en la posicion que va el contador...
        if(contador){
            let botonEditarInput = document.querySelector(`#botonEditarInput${contador}`);
            if(botonEditarInput)botonEditarInput.remove();
        }else{ //si es el primer input
            let botonEditarInput = document.querySelector(`#botonEditarInput`);
            if(botonEditarInput)botonEditarInput.remove();
        }

        borrarAutocompletadoAnterior(autocompletadoMedicamento);

        let idMedicamentoDetalle = document.querySelector("#idMedicamentoDetalle");
        let divJustificacion = document.querySelector("#divJustificacion");
        if(contador){ 
            idMedicamentoDetalle = document.querySelector(`#idMedicamentoDetalle${contador}`);
            let divJustificacionContador = document.querySelector(`#divJustificacion${contador}`)
            if(divJustificacionContador){
                divJustificacionContador.remove();
            }
        }else{
            borrarAutocompletadoAnterior(divJustificacion);
        }

        //borramos el id del medicamento de nuestro arreglo de ids ya seleccionados
        let indice = idsDeMedicamentos.indexOf(idsDeMedicamentos.find(e => e.id === parseInt(idMedicamentoDetalle.value)));
        if(indice > -1){
            idsDeMedicamentos.splice(indice, 1);
        }
        //seteamos el valor del idMedicamentoDetalle a vacío nuevamente...
        idMedicamentoDetalle.value = "";
    }
}

//Función que permite editar un input de medicamento una vez que es seleccionado uno de estos...
const agregarBotonEditarInput = (inputMedicamentos, divParaAgregarBoton, mensaje, nombreDeClase, contador) => {
    let contenidoDeDivParaAgregarBoton = divParaAgregarBoton.children;
    let tieneBotonEditar = false;
    for(let i = 0; i < contenidoDeDivParaAgregarBoton.length; i++){
        if(contenidoDeDivParaAgregarBoton[i].className.includes(nombreDeClase)){
            tieneBotonEditar = true;
            break;
        } 
    }
    //nos aseguramos que no haya un boton editar ya
    if(!tieneBotonEditar){
        let button = document.createElement("button"); button.type="button"; button.className = `tooltip ${nombreDeClase}`;
        if(contador){
            button.id = `botonEditarInput${contador}`
        }else{
            button.id = "botonEditarInput";
        }
        let icono = document.createElement("i"); icono.className="fa-solid fa-pen-to-square"; icono.style.color= "#2c3e50";
        let p = document.createElement("p"); p.className="tooltiptext"; p.innerHTML = mensaje;
        button.appendChild(icono);button.appendChild(p); //agregamos el icono de fontawesome y el texto de informacion al boton
        divParaAgregarBoton.appendChild(button); //agregamos el boton al divDeBotones
        button.addEventListener("click", () => {
            mensajeLlenarEspacioMedicamentoYPrestaciones(inputMedicamentos, "Puede editar el elemento", "green");
            inputMedicamentos.readOnly = false;
        })
    }
}

const agregarCamposAMedicamentoSeleccionado = (contador) => {
//AGREGAMOS CAMPOS DOS, INTERVALO Y DURACIÓN CUANDO SELECCIONAN UN MEDICAMENTO
    let divJustificacion = document.querySelector("#divJustificacion");
    if(!(divJustificacion.hasChildNodes())){
        let inputs = `
                <div class="divDosis">
                    <label for="dosis">Dósis</label> 
                    <input class="dosis" type="text" id="dosis" name="dosis" placeholder="Ej. Una cápsula, 2 pastillas" required>
                </div>
                <div class="divIntervalo">
                    <label for="intervalo">Intervalo</label> 
                    <input class="intervalo" type="number" id="intervalo" name="intervalo" placeholder="Intervalo de tiempo" required>
                </div>
                <div class="divDuracion">
                    <label for="duracion">Duración</label>  
                    <input class="duracion" type="text" id="duracion" name="duracion" placeholder="Ej. 7 días" required>
                </div>`;
        divJustificacion.innerHTML = inputs;
    }else if(contador){
        let divJustificacion = document.createElement("div");
        let inputMedicamentoPrescribir = document.querySelectorAll(".inputMedicamentoPrescribir");
        let input = []
        for(let imp of inputMedicamentoPrescribir){
            if(parseInt(imp.id.slice(1)) === contador){
                input = imp;
                break;
            }
        }
        divJustificacion.className="divJustificacion";divJustificacion.id=`divJustificacion${contador}`;
        let inputs = `
                <div class="divDosis">
                    <label for="dosis${contador}">Dósis ${contador+1}</label> 
                    <input class="dosis" type="text" id="dosis${contador}" name="dosis" placeholder="Ej. Una cápsula, 2 pastillas" required>
                </div>
                <div class="divIntervalo">
                    <label for="intervalo${contador}">Intervalo ${contador+1}</label> 
                    <input class="intervalo" type="number" id="intervalo${contador}" name="intervalo" placeholder="Intervalo de tiempo" required>
                </div>
                <div class="divDuracion">
                    <label for="duracion${contador}">Duración ${contador+1}</label>  
                    <input class="duracion" type="text" id="duracion${contador}" name="duracion" placeholder="Ej. 7 días" required>
                </div>`;
        divJustificacion.innerHTML = inputs;
        let tieneDivJustificacion = false;
        for(let ic of input.children){
            if(ic.id === `divJustificacion${contador}`){    
                tieneDivJustificacion = true;
                break;
            }
        }
        if(!tieneDivJustificacion){ // chequeamos de que no haya un divJustificacion ya creado...
            input.appendChild(divJustificacion);
        }
    }
}

//-------------------------------SECCIÓN FUNCIONES DEL AUTOCOMPLETADO PRESTACIÓN-------------------------------//

// let contPrestaciones = 1;
const configurarBotonCrearPrestacion = (prestaciones) => {
    let botonAgregarPrestacion = document.querySelector("#botonAgregarPrestacion");
    botonAgregarPrestacion.addEventListener("click", () => {
        let idPrestacion = document.querySelector("#idPrestacion");
        if(idPrestacion.value !== ""){ // CHEQUEAMOS DE QUE HAYAN SELECCIONADO UNA PRESTACIÓN PRIMERO 
            agregarNuevaPrestacion(prestaciones/*, contPrestaciones*/);
            // contPrestaciones++;
            borrarAutocompletadoClickEverywhere();
        }else{
            mensajeLlenarEspacioMedicamentoYPrestaciones(inputPrestacionPrescripcion, "SELECCIONE UNA PRESTACIÓN ANTES DE AÑADIR OTRA", "red");
        }
    })
}

const agregarNuevaPrestacion = (prestaciones/*, contPrestaciones*/) => {
    let inputsPrestaciones = document.querySelectorAll(".inputPrestacionPrescribir");
    if(inputsPrestaciones.length < 5){
        let divPrestaciones = document.querySelector("#divPrestaciones");
        let numerosDisponibles = getNumerosDisponiblesPrestaciones();
        let contador = numerosDisponibles[0];
        const label = document.createElement("label"); label.innerHTML = `Prestación ${contador+1}`;
        const divInput = document.createElement("div"); divInput.className = "inputPrestacionPrescribir";
        divInput.id = `p${contador}`; 
        const prestacion = `<div class="divAutocompletadoPrestacion">
                                <div class="inputYBotonEliminarPrestacion">
                                    <input class="classEnComunCSS" id="inputPrestacionPrescripcion${contador}" type="text" placeholder="opcional" autocomplete="off", required>
                                    <button class="tooltip eliminarPrestacion" type="button">
                                        <i class="fa-solid fa-trash-can" style="color: #f50000;"></i>
                                        <p class="tooltiptext">Eliminar prestación</p>
                                    </button>
                                </div>
                                <input class="idPrestacionHidden" type="hidden" name="idPrestacion" id="idPrestacion${contador}">
                                <div class="autocompletadoPrestaciones"></div>
                            </div>
                            <div id="divJustificacionPrestacion${contador}" class="divJustificacion"></div>`;
        divInput.innerHTML = prestacion;
        divPrestaciones.appendChild(label);
        divPrestaciones.appendChild(divInput);
        let elemento = document.querySelector(`#inputPrestacionPrescripcion${contador}`);
        let autocompletadoPrestaciones = document.querySelectorAll(".autocompletadoPrestaciones");
        //Le agregamos el evento eliminar prestacion al boton
        ((contador) => {
            let botonEliminarPrestacion = divInput.querySelector(".eliminarPrestacion");
            botonEliminarPrestacion.addEventListener("click", () => {
                //sacamos el id de la prestacion del arreglo
                let idPrestacion = document.querySelector(`#idPrestacion${contador}`); 
                let indice = idsDePrestaciones.indexOf(idsDePrestaciones.find(e => e.id === parseInt(idPrestacion.value)));
                if(indice > -1){
                    idsDePrestaciones.splice(indice, 1);
                }
                let input = document.querySelector(`#p${contador}`);
                let label = input.previousElementSibling;
                input.remove();
                label.remove();
            })
        })(contador);
        let autocompletadoPrestacion = [];
        for(let ap of autocompletadoPrestaciones){ 
            if(parseInt(ap.parentElement.parentElement.id.slice(1)) === contador){
                autocompletadoPrestacion = ap;
                break;
            }
        }
        agregarEscuchadoresDeEventosAPrestaciones(prestaciones, autocompletadoPrestacion, elemento, contador);
    }else{
        Swal.fire({
            icon:"warning",
            title:"Máximo 5 prestaciones",
            timer: 2000
        })
    }
}

const getNumerosDisponiblesPrestaciones = () => {
    let inputsPrescribir = document.querySelectorAll(".inputPrestacionPrescribir");
    let numerosOcupados = [];
    let numeros = [1,2,3,4];
    for(let ip of inputsPrescribir){
        let n = parseInt(ip.id.slice(1));
        if(n){
            numerosOcupados.push(n);
        }
    }
    numeros = numeros.filter(n => !numerosOcupados.includes(n));
    return numeros;
}

const agregarEscuchadoresDeEventosAPrestaciones = (prestaciones, autocompletadoPrestaciones, elemento, contador) => {
    elemento.addEventListener("input", (event) => {
        let palabra = event.target.value;
        agregarAutocompletadoPrestacion(palabra, prestaciones, autocompletadoPrestaciones, elemento, contador);
    })
}
const idsDePrestaciones = [];
const agregarAutocompletadoPrestacion = (palabra, prestaciones, autocompletadoPrestacion, inputPrestaciones, contador) => {
    let prestacionesEnString = prestaciones.map(e => JSON.stringify(e));
        borrarAutocompletadoAnterior(autocompletadoPrestacion);
        if(palabra !== ""){
            let idPrestacion = document.getElementById("idPrestacion");
            if(contador){
                idPrestacion = document.getElementById(`idPrestacion${contador}`)
            }
            // Nos aseguramos de que si borra un caracter nuevo o elimina uno y ya hay un elemento seleccionado, se elimine el value del input hidden
            if(!idsDePrestaciones.find(e => e.nombre === palabra) && idPrestacion.value){
                //sacamos el id de la prestacion del arreglo
                let indice = idsDePrestaciones.indexOf(idsDePrestaciones.find(e => e.id === parseInt(idPrestacion.value)));
                if(indice > -1){
                    idsDePrestaciones.splice(indice, 1);
                }
                idPrestacion.value = "";
            }

            let presta = prestacionesEnString.filter(e => {
                let idPrestacion = JSON.parse(e).idPrestacion;
                //nos aseguramos de que ademas que coincida que no esté en otro medicamento ya
                return e.toLowerCase().includes(palabra.toLowerCase()) && !idsDePrestaciones.some(i => i.id === idPrestacion);
            });
            for(let p of presta){
                let div = document.createElement("div");
                let pre = JSON.parse(p);
                div.appendChild(crearPrestacionParaAutocompletado(pre));
                autocompletadoPrestacion.appendChild(div);
                div.addEventListener("click", () => {
                    let divJustificacionPrestacion;
                    if(contador >= 0){
                        divJustificacionPrestacion = document.querySelector(`#divJustificacionPrestacion${contador}`)
                    }else{
                        divJustificacionPrestacion = document.querySelector(`#divJustificacionPrestacion`)
                    }
                    agregarCamposJustificacionPrestacion(pre, divJustificacionPrestacion);
                    // let contenido = `${pre.nombrePrestacion} ${pre.lado} ${pre.indicacion} ${pre.justificacion}`;
                    let contenido = pre.nombrePrestacion;
                    inputPrestaciones.value = contenido;
                    idsDePrestaciones.push({id:pre.idPrestacion, nombre: contenido}); //agregamos al arreglo de ya seleccionados
                    inputPrestaciones.readOnly = true; //configuramos de que si selecciono una prestación no pueda editar el input...
                    borrarAutocompletadoAnterior(autocompletadoPrestacion)
                    idPrestacion.value = pre.idPrestacion;

                    //Agregamos el boton editar prestación dependiendo si es la primera prestación o las demás...
                    let divParaAgregarBoton = document.querySelectorAll(".inputYBotonEliminarPrestacion");
                    if(contador){
                        agregarBotonEditarInput(inputPrestaciones, divParaAgregarBoton[contador-1], "Editar prestación", "editarPrestacion", contador)
                    }else{
                        divParaAgregarBoton = document.querySelector(".divLabelYBtnAgregarPrestacion"); 
                        agregarBotonEditarInput(inputPrestaciones, divParaAgregarBoton, "Editar prestación", "editarPrestacion")
                    }
                })
            }
        }else{
            //borramos el boton editar creado en la posicion que va el contador...
            if(contador){
                let botonEditar = document.querySelector(`#botonEditarInput${contador}`);
                if(botonEditar)botonEditar.remove();
                let divJustificacion = document.querySelector(`#divJustificacionPrestacion${contador}`);
                if(divJustificacion){
                    divJustificacion.innerHTML = "";
                }
            }else{
                let botonEditar = document.querySelector(`#botonEditarInput`);
                if(botonEditar)botonEditar.remove();
                let divJustificacion = document.querySelector(`#divJustificacionPrestacion`);
                if(divJustificacion){
                    divJustificacion.innerHTML = "";
                }
            }

            borrarAutocompletadoAnterior(autocompletadoPrestacion);
            let idPrestacion = document.getElementById("idPrestacion");
            if(contador){
                idPrestacion = document.getElementById(`idPrestacion${contador}`);
            }
            //sacamos el id de la prestacion del arreglo
            let indice = idsDePrestaciones.indexOf(idsDePrestaciones.find(e => e.id === parseInt(idPrestacion.value)));
            if(indice > -1){
                idsDePrestaciones.splice(indice, 1);
            }
            idPrestacion.value = "";
        }
}

const getNumerosDisponiblesPrestacionSinJustificacion = () => {
    let inputsPrestacionPrescribir = document.querySelectorAll(".inputPrestacionPrescribir");
    let numerosDisponiblesPrestacion = [];
    inputsPrestacionPrescribir.forEach(e => {
        let id = e.id.slice(1);
        if(!document.querySelector(`#divJustificacionPrestacion${id}`).hasChildNodes()){
            numerosDisponiblesPrestacion.push(parseInt(id));
        }
    })
    return numerosDisponiblesPrestacion;
} 

const getLados = () => {
    return axios("http://localhost:3000/registrar/prestacion/getLados")
        .then(res => res.data)
        .catch(error => [])
}

const agregarSeccionJustificacion = (prestacion, sides, contador) => {
    let idsLados = prestacion.idsLados.split(",");
    idsLados = idsLados.map(e => parseInt(e));
    const getId = (idBase) => contador ? `${idBase}${contador}` : idBase; // si hay contador se lo agregamos al final de los id´s
    let inputJustificacion = `<div>
                                <label for="${getId('justificacion')}">Justificación</label>
                                <textarea class="justificacionPrestacion" id="${getId('justificacion')}" style="height: 60px; resize:none">${prestacion.justificacion}</textarea>
                            </div>`;
    let inputIndicacion = `<div>
        <label for="${getId('indicacion')}">Indicación</label>
        <textarea class="indicacionPrestacion" id="${getId('indicacion')}" style="height: 60px; resize:none">${prestacion.indicacion}</textarea>
    </div>`;
    let lados = `
    <div class="secionEspecialidad">
        <label>Lados</label>
        <div class="selectEspecialidad" id="${getId('selectLadosPrestacion')}">
            <select class="selectEsp" name="${getId('especialidad')}"  style="font-style: italic;">
                <option disabled hidden selected>Opcional...</option>
            </select>
            <div class="overSelect"></div>
        </div>
        <div class="checkBoxEspecialidad" id="${getId('checkBoxPrestacion')}">
            ${sides && sides.length > 0 ? 
                sides.map(e => `
                    <label>${e.nombreLado}
                    <input id="${getId('inputLadoPrestacion')}" class="especialidades" type="checkbox" value="${e.nombreLado}" data-value="${e.idLado}" name="especialidades"
                    ${idsLados.includes(e.idLado) ? 'checked' : ''}>
                    </label>
                `).join('') : 
                ''
            }
        </div>
    </div>`;
    return lados + inputJustificacion + inputIndicacion;
}

const agregarEventoExpandirSelectLados = (contador) => {
    let checkBoxEspecialidad;
    let selectEspecialidad;
    let inputLadoPrestacion;
    if(contador){
        selectEspecialidad = document.querySelector(`#selectLadosPrestacion${contador}`) 
        checkBoxEspecialidad = document.querySelector(`#checkBoxPrestacion${contador}`);
        inputLadoPrestacion = document.querySelector(`#inputLadoPrestacion${contador}`);
    }else{
        selectEspecialidad = document.querySelector(`#selectLadosPrestacion`);
        checkBoxEspecialidad = document.querySelector("#checkBoxPrestacion");
        inputLadoPrestacion = document.querySelector(`#inputLadoPrestacion`);
    }
    let estaExpandida = false;
    selectEspecialidad.addEventListener("click", () => {
        let losOtrosSelects = document.querySelectorAll(".selectEspecialidad");
        if(!estaExpandida){
            checkBoxEspecialidad.style.display = "block";
            checkBoxEspecialidad.style.position = "absolute";
            checkBoxEspecialidad.style.width = "230px";
            estaExpandida = true;
            losOtrosSelects.forEach(e => {
                if ((e !== selectEspecialidad)) {
                    e.style.display = "none";
                }
            });
        }else{
            checkBoxEspecialidad.style.display = "none";
            estaExpandida = false;
            losOtrosSelects.forEach(e => {
                if (e !== selectEspecialidad) {
                    e.style.display = "block";
                }
            });
        }
    })
    checkBoxEspecialidad.addEventListener('change', () => {
        let checkedCount = checkBoxEspecialidad.querySelectorAll('.especialidades:checked').length;
        if (checkedCount >= 3) {
            checkBoxEspecialidad.querySelectorAll('.especialidades:not(:checked)').forEach(e => {
                e.disabled = true;
            });
        } else {
            checkBoxEspecialidad.querySelectorAll('.especialidades').forEach(e => {
                e.disabled = false;
            });
        }
    });
}

const agregarCamposJustificacionPrestacion = async(p, divJustificacionPrestacion) => {
    let numerosDisponiblesPrestacion = getNumerosDisponiblesPrestacionSinJustificacion();
    let sides = await getLados(); 
    let inputsPrestacionPrescribir = document.querySelectorAll(".inputPrestacionPrescribir");
    if(inputsPrestacionPrescribir.length === 1){
        divJustificacionPrestacion.innerHTML = agregarSeccionJustificacion(p, sides);
        agregarEventoExpandirSelectLados();
    }else{
        divJustificacionPrestacion.innerHTML = agregarSeccionJustificacion(p, sides, numerosDisponiblesPrestacion[0]);
        agregarEventoExpandirSelectLados(numerosDisponiblesPrestacion[0]);
    }
}


export {borrarAutocompletadoAnterior, listadoDePrescripcionesAnteriores, configurarBotonCrearMedicamento, agregarAutocompletadoMedicamento, agregarAutocompletadoPrestacion, configurarBotonCrearPrestacion, borrarAutocompletadoClickEverywhere,mensajeLlenarEspacioMedicamentoYPrestaciones};