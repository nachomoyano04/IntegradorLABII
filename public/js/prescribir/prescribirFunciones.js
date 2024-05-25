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
    console.log(prescripcionesAnteriores)
    for(let pa of prescripcionesAnteriores){
        let ul = document.createElement("ul"); 
        let liDiagnostico = document.createElement("li"); //ITEM DIAGNOSTICO
        liDiagnostico.innerHTML = `Diagnóstico: ${pa.diagnostico}`;
        let liFecha = document.createElement("li"); //ITEM FECHA
        liFecha.innerHTML = `Fecha: ${new Date(pa.fecha).toLocaleDateString()}`;
        let liVigencia = document.createElement("li"); //ITEM VIGENCIA
        liVigencia.innerHTML = `Vigencia: ${new Date(pa.vigencia).toLocaleDateString()}`;
        let liMedicamento = document.createElement("li"); // ITEM MEDICAMENTO
        let liPrestacion = document.createElement("li"); // ITEM PRESTACION
        let medicamento = `Medicamento: ${pa.nombreGenerico} ${pa.cantidadConcentracion} ${pa.unidadMedidaCon} ${pa.forma} x${pa.cantidadPresentacion} ${pa.unidadMedidaPres}`
        liMedicamento.innerHTML = medicamento;
        liPrestacion.innerHTML = `Prestacion: ${pa.nombrePrestacion} ${pa.lado} ${pa.indicacion} ${pa.justificacion} ${pa.resultado}`;
        ul.appendChild(liDiagnostico);
        ul.appendChild(liFecha);
        ul.appendChild(liVigencia);
        if(pa.idMedicamentoDetalle !== null && pa.idPrestacion === null){
            ul.appendChild(liMedicamento);
        }else if(pa.idPrestacion !== null && pa.idMedicamentoDetalle === null){
            ul.appendChild(liPrestacion);
        }else{
            ul.appendChild(liMedicamento);
            ul.appendChild(liPrestacion);
        }
        if(pa.idPrestacion && !pa.resultado){ //nos fijamos si la prescripcion tiene prestacion y si es asi agregamos boton añadir resultado...
            let divAniadirResultado = document.createElement("div"); //DIV QUE TENDRA BOTON Y TEXT AREA RESULTADO/OBSERVACION
            divAniadirResultado.className = "divAniadirResultado";
            crearDivAniadirResultado(divAniadirResultado, pa); //Funcion que crea boton añadir y guardar resultado. Y textArea 
            ul.appendChild(divAniadirResultado);
        }else if(pa.idPrestacion && pa.resultado){
            let liResultado = document.createElement("li");
            liResultado.innerHTML = `Resultado/Observación: ${pa.resultado}`;
            ul.appendChild(liResultado)
        }
        div.appendChild(ul);
    }
    return div;
}

const crearDivAniadirResultado = (divAniadirResultado, pa) => {
    let botonAniadirResultado = document.createElement("button"); //BOTON AÑADIR RESULTADO/OBSERVACIÓN
    botonAniadirResultado.className = "botonAniadirResultado"; 
    botonAniadirResultado.innerHTML = "Añadir resultado";
    //Escuchador de eventos para el boton añadir resultado/observación
    botonAniadirResultado.addEventListener("click", () => {
        //Escondemos el boton hasta que escriban la observacion en el textArea
        botonAniadirResultado.style.display = "none"; 
        let botonGuardarResultado = document.createElement("button");
        botonGuardarResultado.innerHTML = "Guardar resultado";
        botonGuardarResultado.className = "botonGuardarResultado";
        botonGuardarResultado.addEventListener("click", () => {
            if(textArea.value !== ""){            
                axios.put("http://localhost:3000/prescribir/guardarResultado", {idPrestacion: pa.idPrestacion, resultado: textArea.value})
                .then(res => console.log(res.data))
                .catch(error => console.log(error))
            }else{
                textArea.style.border = "2px solid red";
                setTimeout(() => {
                    textArea.style.border = "1px solid rgb(118, 118, 118)";   
                }, 1000)
            }
        })
        let textArea = document.createElement("textarea");
        textArea.className = "textAreaResultadoObservacion";
        textArea.placeholder = "Resultado/observación de la prescripción..."
        textArea.cols = 55;
        textArea.rows = 3;
        divAniadirResultado.appendChild(botonGuardarResultado);
        divAniadirResultado.appendChild(textArea);
    })
    divAniadirResultado.appendChild(botonAniadirResultado);
}

//-------------------------------SECCIÓN FUNCIONES DEL AUTOCOMPLETADO MEDICAMENTO-------------------------------//

let contMedicamentos = 1;
const configurarBotonCrearMedicamento = (medicamentos) => {
    let botonAgregarMedicamento = document.querySelector("#botonAgregarMedicamento");
    botonAgregarMedicamento.addEventListener("click", () => {
        agregarNuevoMedicamento(medicamentos, contMedicamentos);
        contMedicamentos++;
    })
}
const agregarNuevoMedicamento = (medicamentos, contador) => {
    let divMedicamentos = document.querySelector("#divMedicamentos");
    const label = document.createElement("label"); label.innerHTML = "Medicamento";
    const divInput = document.createElement("div");divInput.className = "inputMedicamentoPrescribir"; 
    const medicamento = `
                             <div class="divAutocompletadoMedicamento">
                                 <input class="classEnComunCSS" id="inputMedicamentoPrescripcion${contador}" type="text" placeholder="opcional" autocomplete = "off">
                                 <input type="hidden" name="idMedicamentoDetalle" id="idMedicamentoDetalle${contador}">
                                 <div class="autocompletadoMedicamentos"></div>
                             </div>`;
    divInput.innerHTML = medicamento;
    divMedicamentos.appendChild(label);    
    divMedicamentos.appendChild(divInput);
    let elemento = document.querySelector(`#inputMedicamentoPrescripcion${contador}`);
    let autocompletadoMedicamentos = document.querySelectorAll(".autocompletadoMedicamentos");
    agregarEscuchadoresDeEventosAMedicamentos(medicamentos, autocompletadoMedicamentos[contador], elemento, contador)
}

const agregarEscuchadoresDeEventosAMedicamentos = (medicamentos, autocompletadoMedicamento, elemento, contador) => {
    elemento.addEventListener("input", (event) => {
        let palabra = event.target.value;
        let inputMedicamentos = document.querySelector(`#inputMedicamentoPrescripcion${contador}`);        
        agregarAutocompletadoMedicamento(palabra, medicamentos, autocompletadoMedicamento, inputMedicamentos, contador);
    })
}

const agregarAutocompletadoMedicamento = (palabra, medicamentos, autocompletadoMedicamento, inputMedicamentos, contador) => {
    if(palabra !== ""){
        borrarAutocompletadoAnterior(autocompletadoMedicamento);
        let medicamentoRecomendado = medicamentos.filter(e => {
            const medicamentoString = e.nombreGenerico.concat(" ", e.cantidadConcentracion, " ",e.unidadMedidaCon, " ", e.forma, " x", e.cantidadPresentacion , " ", e.unidadMedidaPres);
            const comparacion = medicamentoString.toLowerCase().includes(palabra.toLowerCase())
            return comparacion;
        });
        for(let mr of medicamentoRecomendado){
            let div = document.createElement("div");
            let contenido = mr.nombreGenerico.concat(" ", mr.cantidadConcentracion, " ",mr.unidadMedidaCon, " ", mr.forma, " x", mr.cantidadPresentacion , " ", mr.unidadMedidaPres);
            div.innerHTML = contenido;
            autocompletadoMedicamento.appendChild(div);
            div.addEventListener("click", () => {
                inputMedicamentos.value = contenido;
                borrarAutocompletadoAnterior(autocompletadoMedicamento);
                let idMedicamentoDetalle = document.querySelector("#idMedicamentoDetalle");
                if(contador){
                    idMedicamentoDetalle = document.querySelector(`#idMedicamentoDetalle${contador}`);
                }
                idMedicamentoDetalle.value = mr.id;
                botonPrescribir.disabled = false;
            })
        }
    }else if(palabra === ""){
        borrarAutocompletadoAnterior(autocompletadoMedicamento);
        let idMedicamentoDetalle = document.querySelector("#idMedicamentoDetalle");
        if(contador){
            idMedicamentoDetalle = document.querySelector(`#idMedicamentoDetalle${contador}`);
        }
        idMedicamentoDetalle.value = "";
        // let inputPrestaciones = document.querySelector("#inputPrestacionPrescripcion");
        let inputMedicamentos = document.querySelectorAll(".classEnComunCSS");
        let inputMedicamentosYPrestacionesVacio = true;         //LOGICA QUE CONTROLA Q TODOS LOS INPUT DE MEDICAMENTO ESTEN VACIOS
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
    })
}

const agregarNuevaPrestacion = (prestaciones, contador) => {
    let divPrestaciones = document.querySelector("#divPrestaciones");
    const label = document.createElement("label"); label.innerHTML = "Prestacion";
    const divInput = document.createElement("div"); divInput.className = "inputPrestacionPrescribir";
    const prestacion = `<div class="divAutocompletadoPrestacion">
                            <input class="classEnComunCSS" id="inputPrestacionPrescripcion${contador}" type="text" placeholder="opcional" autocomplete="off">
                            <input type="hidden" name="idPrestacion" id="idPrestacion${contador}">
                            <div class="autocompletadoPrestaciones"></div>
                        </div>`;
    divInput.innerHTML = prestacion;
    divPrestaciones.appendChild(label);
    divPrestaciones.appendChild(divInput);
    let elemento = document.querySelector(`#inputPrestacionPrescripcion${contador}`);
    let autocompletadoPrestaciones = document.querySelectorAll(".autocompletadoPrestaciones");
    console.log(elemento);
    console.log(autocompletadoPrestaciones);
    agregarEscuchadoresDeEventosAPrestaciones(prestaciones, autocompletadoPrestaciones[contador], elemento, contador);
}

const agregarEscuchadoresDeEventosAPrestaciones = (prestaciones, autocompletadoPrestaciones, elemento, contador) => {
    elemento.addEventListener("input", (event) => {
        let palabra = event.target.value;
        // let inputPrestaciones = document.querySelector(`#inputPrestacionPrescripcion${contador}`);        
        agregarAutocompletadoPrestacion(palabra, prestaciones, autocompletadoPrestaciones, elemento, contador);
    })
}
const agregarAutocompletadoPrestacion = (palabra, prestaciones, autocompletadoPrestacion, inputPrestaciones, contador) => {
    let prestacionesEnString = prestaciones.map(e => JSON.stringify(e));
        borrarAutocompletadoAnterior(autocompletadoPrestacion);
        if(palabra !== ""){
            let prestaciones = prestacionesEnString.filter(e => e.toLowerCase().includes(palabra.toLowerCase()));
            for(let p of prestaciones){
                let div = document.createElement("div");
                let pre = JSON.parse(p);
                div.appendChild(crearPrestacionParaAutocompletado(pre));
                autocompletadoPrestacion.appendChild(div);
                div.addEventListener("click", () => {
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
            idPrestacion.value = "";
            let inputMedicamentosYPrestaciones = document.querySelectorAll(".classEnComunCSS");
            let inputMedicamentosYPrestacionesVacios = true;
            inputMedicamentosYPrestaciones.forEach(elemento => {
                console.log(elemento.value)
                if(elemento.value !== ""){
                    inputMedicamentosYPrestacionesVacios = false;
                }
            })
            if(inputMedicamentosYPrestacionesVacios){
                botonPrescribir.disabled = true;
            }
        }
}


export {borrarAutocompletadoAnterior, listadoDePrescripcionesAnteriores, configurarBotonCrearMedicamento, agregarAutocompletadoMedicamento, agregarAutocompletadoPrestacion, configurarBotonCrearPrestacion};