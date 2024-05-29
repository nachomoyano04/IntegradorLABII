const borrarAutocompletadoAnterior = (elemento) => {
    while(elemento.hasChildNodes()){
        elemento.removeChild(elemento.firstChild);
    }
}

//-------------------------------SECCIÓN CREAR PRESTACIONES-------------------------------//
const crearPrestacionParaAutocompletado = (prestacion) => {
    let ul = document.createElement("ul");
    let liNombre = document.createElement("li");
    let liLado = document.createElement("li");
    let liIndicacion = document.createElement("li");
    let liJustificacion = document.createElement("li");
    let liResultado = document.createElement("li");
    liNombre.innerHTML = `${prestacion.nombrePrestacion}`;
    liLado.innerHTML = `lado: ${prestacion.lado}`;
    liIndicacion.innerHTML = `indicación: ${prestacion.indicacion}`;
    liJustificacion.innerHTML = `justificación: ${prestacion.justificacion}`;
    liResultado.innerHTML = `resultado: ${prestacion.resultado}`;
    ul.appendChild(liNombre)
    ul.appendChild(liLado)
    ul.appendChild(liIndicacion)
    ul.appendChild(liJustificacion)
    ul.appendChild(liResultado)
    return ul;
}

//-------------------------------SECCIÓN LISTAR PRESCRIPCIONES ANTERIORES-------------------------------//
const listadoDePrescripcionesAnteriores = (prescripcionesAnteriores) => {
    let div = document.createElement("div");
    prescripcionesAnteriores = acomodarPrescripciontesAnteriores(prescripcionesAnteriores);
    for(let pa of prescripcionesAnteriores){
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
        if(pa.idMedicamentoDetalle){
            if(typeof pa.nombreGenerico === "object"){
                for(let i = 0; i < pa.nombreGenerico.length; i++){ //recorremos los medicamentos
                    let liMedicamento = document.createElement("li"); // ITEM MEDICAMENTO
                    let medicamento = `Medicamento ${i+1}: ${pa.nombreGenerico[i]} ${pa.cantidadConcentracion[i]} ${pa.unidadMedidaCon[i]} ${pa.forma[i]} x${pa.cantidadPresentacion[i]} ${pa.unidadMedidaPres[i]}`;
                    liMedicamento.innerHTML = medicamento;
                    ul.appendChild(liMedicamento);
                }
            }else{
                let liMedicamento = document.createElement("li"); // ITEM MEDICAMENTO
                let medicamento = `Medicamento: ${pa.nombreGenerico} ${pa.cantidadConcentracion} ${pa.unidadMedidaCon} ${pa.forma} x${pa.cantidadPresentacion} ${pa.unidadMedidaPres}`;
                liMedicamento.innerHTML = medicamento;
                ul.appendChild(liMedicamento);
            }
        }
        if(pa.idPrestacion){
            if(typeof pa.nombrePrestacion === "object"){
                for(let i = 0; i < pa.nombrePrestacion.length; i++){
                    let liPrestacion = document.createElement("li"); // ITEM PRESTACION
                    liPrestacion.innerHTML = `Prestacion ${i+1}: ${pa.nombrePrestacion[i]} ${pa.lado[i]} ${pa.indicacion[i]} ${pa.justificacion[i]}`;
                    ul.appendChild(liPrestacion);
                    if(pa.resultadoPrestacion[i] === null){
                        let divAniadirResultado = document.createElement("div"); //DIV QUE TENDRA BOTON Y TEXT AREA RESULTADO/OBSERVACION
                        divAniadirResultado.className = "divAniadirResultado";
                        crearDivAniadirResultado(divAniadirResultado, pa.idPrescripcion, pa.idPrestacion[i]); //Funcion que crea boton añadir y guardar resultado. Y textArea 
                        ul.appendChild(divAniadirResultado);
                    }else{
                        let liResultado = document.createElement("li");
                        liResultado.innerHTML = `Resultado/Observación: ${pa.resultadoPrestacion[i]}`;
                        ul.appendChild(liResultado)
                    }
                }
            }else{
                let liPrestacion = document.createElement("li"); // ITEM PRESTACION
                liPrestacion.innerHTML = `Prestacion: ${pa.nombrePrestacion} ${pa.lado} ${pa.indicacion} ${pa.justificacion}`;
                ul.appendChild(liPrestacion);
                if(pa.resultadoPrestacion === null){
                    let divAniadirResultado = document.createElement("div"); //DIV QUE TENDRA BOTON Y TEXT AREA RESULTADO/OBSERVACION
                    divAniadirResultado.className = "divAniadirResultado";
                    crearDivAniadirResultado(divAniadirResultado, pa.idPrescripcion, pa.idPrestacion); //Funcion que crea boton añadir y guardar resultado. Y textArea 
                    ul.appendChild(divAniadirResultado);    
                }else{
                    let liResultado = document.createElement("li");
                    liResultado.innerHTML = `Resultado/Observación: ${pa.resultadoPrestacion}`;
                    ul.appendChild(liResultado);
                }
            }
        }
        div.appendChild(ul);
    }
    return div;
}

let acomodarPrescripciontesAnteriores = (prescripcionesAnteriores) => {
    let idPrescripciones = [];
    for(let p of prescripcionesAnteriores){
        if(!(idPrescripciones.includes(p.idPrescripcion))){
            idPrescripciones.push(p.idPrescripcion);
        }
    }
    const prescripcionesActualizado = prescripcionesAnteriores.reduce((acc,el) => {
        let e = acc.find(obj => obj.idPrescripcion === el.idPrescripcion);
        if(!e){
            acc.push(el);
        }else{
            if(el.idPrestacion){
                e.idPrestacion = Array.isArray(e.idPrestacion)?e.idPrestacion:[e.idPrestacion];e.idPrestacion.push(el.idPrestacion);
                e.nombrePrestacion = Array.isArray(e.nombrePrestacion)?e.nombrePrestacion:[e.nombrePrestacion];e.nombrePrestacion.push(el.nombrePrestacion);
                e.lado = Array.isArray(e.lado)?e.lado:[e.lado];e.lado.push(el.lado);
                e.indicacion = Array.isArray(e.indicacion)?e.indicacion:[e.indicacion];e.indicacion.push(el.indicacion);
                e.justificacion = Array.isArray(e.justificacion)?e.justificacion:[e.justificacion];e.justificacion.push(el.justificacion);
                e.resultadoPrestacion = Array.isArray(e.resultadoPrestacion)?e.resultadoPrestacion:[e.resultadoPrestacion];e.resultadoPrestacion.push(el.resultadoPrestacion);
            }
            if(el.idMedicamentoDetalle){
                e.idMedicamentoDetalle = Array.isArray(e.idMedicamentoDetalle)?e.idMedicamentoDetalle:[e.idMedicamentoDetalle];e.idMedicamentoDetalle.push(el.idMedicamentoDetalle);
                e.dosis = Array.isArray(e.dosis)?e.dosis:[e.dosis];e.dosis.push(el.dosis);
                e.duracion = Array.isArray(e.duracion)?e.duracion:[e.duracion];e.duracion.push(el.duracion);
                e.intervalo = Array.isArray(e.intervalo)?e.intervalo:[e.intervalo];e.intervalo.push(el.intervalo);
                e.nombreGenerico = Array.isArray(e.nombreGenerico)?e.nombreGenerico:[e.nombreGenerico];e.nombreGenerico.push(el.nombreGenerico);
                e.nombreComercial = Array.isArray(e.nombreComercial)?e.nombreComercial:[e.nombreComercial];e.nombreComercial.push(el.nombreComercial);
                e.cantidadConcentracion = Array.isArray(e.cantidadConcentracion)?e.cantidadConcentracion:[e.cantidadConcentracion];e.cantidadConcentracion.push(el.cantidadConcentracion);
                e.unidadMedidaCon = Array.isArray(e.unidadMedidaCon)?e.unidadMedidaCon:[e.unidadMedidaCon];e.unidadMedidaCon.push(el.unidadMedidaCon);
                e.forma = Array.isArray(e.forma)?e.forma:[e.forma];e.forma.push(el.forma);
                e.cantidadPresentacion = Array.isArray(e.cantidadPresentacion)?e.cantidadPresentacion:[e.cantidadPresentacion];e.cantidadPresentacion.push(el.cantidadPresentacion);
                e.unidadMedidaPres = Array.isArray(e.unidadMedidaPres)?e.unidadMedidaPres:[e.unidadMedidaPres];e.unidadMedidaPres.push(el.unidadMedidaPres);
            }
        }
        return acc;
    }, []);
    return prescripcionesActualizado;   
}

const crearDivAniadirResultado = (divAniadirResultado, idPrescripcion, idPrestacion) => {
    let botonAniadirResultado = document.createElement("button"); //BOTON AÑADIR RESULTADO/OBSERVACIÓN
    botonAniadirResultado.className = "botonAniadirResultado"; 
    botonAniadirResultado.innerHTML = "Añadir resultado";
    //Escuchador de eventos para el boton añadir resultado/observación
    botonAniadirResultado.addEventListener("click", () => {
        //Escondemos el boton añadir resultado y creamos el boton guardar resultado
        botonAniadirResultado.style.display = "none"; 
        let botonGuardarResultado = document.createElement("button");
        botonGuardarResultado.innerHTML = "Guardar resultado";
        botonGuardarResultado.className = "botonGuardarResultado";
        let textArea = document.createElement("textarea");
        textArea.className = "textAreaResultadoObservacion";
        textArea.placeholder = "Resultado/observación de la prescripción..."
        textArea.cols = 55;
        textArea.rows = 3;
        divAniadirResultado.appendChild(botonGuardarResultado);
        divAniadirResultado.appendChild(textArea);
        botonGuardarResultado.addEventListener("click", () => {
            if(textArea.value !== ""){            
                axios.put("http://localhost:3000/prescribir/guardarResultado", {idPrestacion, resultado: textArea.value, idPrescripcion})
                .then(res => console.log(res.data))
                .catch(error => console.log(error))
            }else{
                textArea.style.border = "2px solid red";
                setTimeout(() => {
                    textArea.style.border = "1px solid rgb(118, 118, 118)";   
                }, 1000)
            }
        })
    })
    divAniadirResultado.appendChild(botonAniadirResultado);
}

//-------------------------------SECCIÓN FUNCIONES DEL AUTOCOMPLETADO MEDICAMENTO-------------------------------//

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


// let contMedicamentos = 1;
const configurarBotonCrearMedicamento = (medicamentos) => {
    let botonAgregarMedicamento = document.querySelector("#botonAgregarMedicamento");
    let inputMedicamentoPrescripcion = document.querySelector("#inputMedicamentoPrescripcion");
    let idMedicamentoDetalle = document.querySelector("#idMedicamentoDetalle");
    botonAgregarMedicamento.addEventListener("click", () => {
        if(idMedicamentoDetalle.value !== ""){ //nos fijamos antes de crear otro medicamento, que el primero este lleno
            agregarNuevoMedicamento(medicamentos/*, contMedicamentos*/);
            // contMedicamentos++;
            borrarAutocompletadoClickEverywhere();
        }else{
            inputMedicamentoPrescripcion.style.border = "2px solid red";
            inputMedicamentoPrescripcion.placeholder = "Seleccione un medicamento";
            setTimeout(() => {
                inputMedicamentoPrescripcion.style.border = "1px solid black";
                inputMedicamentoPrescripcion.placeholder = "opcional";
            }, 1000)
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
                                    <input type="hidden" name="idMedicamentoDetalle" id="idMedicamentoDetalle${contador}">
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
                let divAEliminar = document.querySelector(`#m${contador}`);
                let label = divAEliminar.previousElementSibling; // Recuperamos el label que anuncia el numero de Medicamento
                divAEliminar.remove();
                label.remove();
                // //borramos el id del medicamento de nuestro arreglo de ids ya seleccionados
                // console.log(contador);
                // let idMedicamentoDetalle = document.querySelector(`#idMedicamentoDetalle${contador}`);
                // console.log(idMedicamentoDetalle);
                // let indice = idsDeMedicamentos.indexOf(parseInt(idMedicamentoDetalle.value));
                // if(indice > -1){
                //     idsDeMedicamentos.splice(indice, 1);
                // }
            });
        })(contador);
        agregarEscuchadoresDeEventosAMedicamentos(medicamentos, autocompletado, elemento, contador)
    }else{
        alert("No pueden haber más de 5 medicamentos")
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
        borrarAutocompletadoAnterior(autocompletadoMedicamento);
        let medicamentoRecomendado = medicamentos.filter(e => {
            const medicamentoString = e.nombreGenerico.concat(" ", e.cantidadConcentracion, " ",e.unidadMedidaCon, " ", e.forma, " x", e.cantidadPresentacion , " ", e.unidadMedidaPres);
            const comparacion = medicamentoString.toLowerCase().includes(palabra.toLowerCase())
            return comparacion && !idsDeMedicamentos.includes(e.id); // mostramos los recomendados y que no hayan sido elegidos antes...
        });
        for(let mr of medicamentoRecomendado){
            let div = document.createElement("div");
            let contenido = mr.nombreGenerico.concat(" ", mr.cantidadConcentracion, " ",mr.unidadMedidaCon, " ", mr.forma, " x", mr.cantidadPresentacion , " ", mr.unidadMedidaPres);
            div.innerHTML = contenido;
            autocompletadoMedicamento.appendChild(div);
            div.addEventListener("click", () => {
                inputMedicamentos.value = contenido;
                idsDeMedicamentos.push(mr.id);
                console.log(idsDeMedicamentos);
                borrarAutocompletadoAnterior(autocompletadoMedicamento);
                let idMedicamentoDetalle = document.querySelector("#idMedicamentoDetalle");
                if(contador){
                    idMedicamentoDetalle = document.querySelector(`#idMedicamentoDetalle${contador}`);
                }
                idMedicamentoDetalle.value = mr.id;
                botonPrescribir.disabled = false;
                let divMedicamentos = document.querySelector("#divMedicamentos");
                if(!(divJustificacion.hasChildNodes())){
                    let divJustificacion = document.querySelector("#divJustificacion");
                    let inputs = `
                            <div class="divDosis">
                                <label for="dosis">Dósis</label> 
                                <input type="text" id="dosis" name="dosis" placeholder="Ej. Una cápsula, 2 pastillas" required>
                            </div>
                            <div class="divIntervalo">
                                <label for="intervalo">Intervalo</label> 
                                <input type="number" id="intervalo" name="intervalo" placeholder="Intervalo de tiempo" required>
                            </div>
                            <div class="divDuracion">
                                <label for="duracion">Duración</label>  
                                <input type="text" id="duracion" name="duracion" placeholder="Ej. 7 días" required>
                            </div>`;
                    divJustificacion.innerHTML = inputs;
                    divMedicamentos.appendChild(divJustificacion);
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
                                <label for="dosis${contador}">Dósis</label> 
                                <input type="text" id="dosis${contador}" name="dosis${contador}" placeholder="Ej. Una cápsula, 2 pastillas" required>
                            </div>
                            <div class="divIntervalo">
                                <label for="intervalo${contador}">Intervalo</label> 
                                <input type="number" id="intervalo${contador}" name="intervalo${contador}" placeholder="Intervalo de tiempo" required>
                            </div>
                            <div class="divDuracion">
                                <label for="duracion${contador}">Duración</label>  
                                <input type="text" id="duracion${contador}" name="duracion${contador}" placeholder="Ej. 7 días" required>
                            </div>`;
                    divJustificacion.innerHTML = inputs;
                    input.appendChild(divJustificacion);
                }
            })
        }
    }else if(palabra === ""){
        borrarAutocompletadoAnterior(autocompletadoMedicamento);
        let idMedicamentoDetalle = document.querySelector("#idMedicamentoDetalle");
        let divJustificacion = document.querySelector("#divJustificacion");
        if(contador){ //////// chequear esto porque hay un error cuando borramos todo en el principal habiendo hijos y queremos seleccionar uno del autocompletado...
            idMedicamentoDetalle = document.querySelector(`#idMedicamentoDetalle${contador}`);
            let divJustificacionContador = document.querySelector(`#divJustificacion${contador}`)
            if(divJustificacionContador){
                divJustificacionContador.remove();
            }
        }
        //borramos el id del medicamento de nuestro arreglo de ids ya seleccionados
        let indice = idsDeMedicamentos.indexOf(parseInt(idMedicamentoDetalle.value));
        if(indice > -1){
            idsDeMedicamentos.splice(indice, 1);
        }

        borrarAutocompletadoAnterior(divJustificacion);
        idMedicamentoDetalle.value = "";
        let inputMedicamentos = document.querySelectorAll(".classEnComunCSS");
        let inputMedicamentosYPrestacionesVacio = true; //LOGICA QUE CONTROLA Q TODOS LOS INPUT DE MEDICAMENTO ESTEN VACIOS
        inputMedicamentos.forEach(e => {
            if(e.value !== ""){
                inputMedicamentosYPrestacionesVacio = false;
            }
        })
        if(inputMedicamentosYPrestacionesVacio){
            botonPrescribir.disabled = true;
        }
    }
}

//-------------------------------SECCIÓN FUNCIONES DEL AUTOCOMPLETADO PRESTACIÓN-------------------------------//

let contPrestaciones = 1;
const configurarBotonCrearPrestacion = (prestaciones) => {
    let botonAgregarPrestacion = document.querySelector("#botonAgregarPrestacion");
    botonAgregarPrestacion.addEventListener("click", () => {
        agregarNuevaPrestacion(prestaciones, contPrestaciones);
        contPrestaciones++;
        borrarAutocompletadoClickEverywhere();
    })
}

const agregarNuevaPrestacion = (prestaciones, contPrestaciones) => {
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
                                <input type="hidden" name="idPrestacion" id="idPrestacion${contador}">
                                <div class="autocompletadoPrestaciones"></div>
                            </div>`;
        divInput.innerHTML = prestacion;
        divPrestaciones.appendChild(label);
        divPrestaciones.appendChild(divInput);
        let elemento = document.querySelector(`#inputPrestacionPrescripcion${contador}`);
        let autocompletadoPrestaciones = document.querySelectorAll(".autocompletadoPrestaciones");
        //Le agregamos el evento eliminar prestacion al boton
        ((contador) => {
            let botonEliminarPrestacion = divInput.querySelector(".eliminarPrestacion");
            botonEliminarPrestacion.addEventListener("click", () => {
                let input = document.querySelector(`#p${contador}`);
                let label = input.previousElementSibling;
                input.remove();
                label.remove();
                // //sacamos el id de la prestacion del arreglo
                // let idPrestacion = document.querySelector(`#idPrestacion${contador}`); 
                // console.log(idPrestacion)
                // let indice = idsDePrestaciones.indexOf(parseInt(idPrestacion.value));
                // if(indice > -1){
                //     idsDePrestaciones.splice(indice, 1);
                // }
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
        alert("No pueden haber más de 5 prestaciones")
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
            let prestaciones = prestacionesEnString.filter(e => {
                let idPrestacion = JSON.parse(e).idPrestacion;
                //nos aseguramos de que ademas que coincida que no esté en otro medicamento ya
                return e.toLowerCase().includes(palabra.toLowerCase()) && !idsDePrestaciones.includes(idPrestacion);
            });
            for(let p of prestaciones){
                let div = document.createElement("div");
                let pre = JSON.parse(p);
                div.appendChild(crearPrestacionParaAutocompletado(pre));
                autocompletadoPrestacion.appendChild(div);
                div.addEventListener("click", () => {
                    idsDePrestaciones.push(pre.idPrestacion); //agregamos al arreglo de ya seleccionados
                    inputPrestaciones.value = `${pre.nombrePrestacion} ${pre.lado} ${pre.indicacion} ${pre.justificacion} ${pre.resultado}`;
                    borrarAutocompletadoAnterior(autocompletadoPrestacion)
                    let idPrestacion = document.getElementById("idPrestacion");
                    if(contador){
                        idPrestacion = document.getElementById(`idPrestacion${contador}`)
                    }
                    idPrestacion.value = pre.idPrestacion;
                    botonPrescribir.disabled = false;
                })
            }
        }else{
            borrarAutocompletadoAnterior(autocompletadoPrestacion);
            let idPrestacion = document.getElementById("idPrestacion");
            if(contador){
                idPrestacion = document.getElementById(`idPrestacion${contador}`);
            }
            //sacamos el id de la prestacion del arreglo
            let indice = idsDePrestaciones.indexOf(parseInt(idPrestacion.value));
            if(indice > -1){
                idsDePrestaciones.splice(indice, 1);
            }

            idPrestacion.value = "";
            let inputMedicamentosYPrestaciones = document.querySelectorAll(".classEnComunCSS");
            let inputMedicamentosYPrestacionesVacios = true;
            inputMedicamentosYPrestaciones.forEach(elemento => {
                if(elemento.value !== ""){
                    inputMedicamentosYPrestacionesVacios = false;
                }
            })
            if(inputMedicamentosYPrestacionesVacios){
                botonPrescribir.disabled = true;
            }
        }
}


export {borrarAutocompletadoAnterior, listadoDePrescripcionesAnteriores, configurarBotonCrearMedicamento, agregarAutocompletadoMedicamento, agregarAutocompletadoPrestacion, configurarBotonCrearPrestacion, borrarAutocompletadoClickEverywhere};