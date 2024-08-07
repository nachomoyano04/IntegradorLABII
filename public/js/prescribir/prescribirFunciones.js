//-------------------------------FUNCIONES GENÉRICAS-------------------------------//
/*FUNCION QUE MUESTRA BORDE ROJO Y MUESTRA MENSAJE <-- Hacer una sola funcion y generica  */
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
//---------------------------------------------------------------------------------//
/*Listener para cerrar autocompletados si toca cualquier lugar de la pantalla*/
const formulariosPrescribir = document.querySelector("#formulariosPrescribir");
formulariosPrescribir.addEventListener("click", () => {
    const autocompletadoMedicamentos = document.querySelectorAll(".autocompletadoMedicamentos");
    const autocompletadoPrestaciones = document.querySelectorAll(".autocompletadoPrestaciones");
    autocompletadoMedicamentos.forEach(e => e.innerHTML = "");
    autocompletadoPrestaciones.forEach(e => e.innerHTML = "");
})

/*Listener para los botones de ELIMINAR Y EDITAR MEDICAMENTO Y PRESTACIONES*/
const formularioPrescripcion = document.querySelector(".formularioPrescripcion");
formularioPrescripcion.addEventListener("click", (e) => {
    if(e.target.closest("button")){
        let action = e.target.closest("button").getAttribute("data-action");
        switch(action){
            case "eliminarMedicamento": {
                const nro = (e.target.closest("button").id).slice(2);
                let nroMedicamento = document.querySelector(`#idMedicamentoDetalle${nro}`).value;
                let divMedicamento = document.querySelector(`#m${nro}`);
                divMedicamento.previousElementSibling.remove();
                divMedicamento.remove();
                if(nroMedicamento){
                    idsDeMedicamentos = idsDeMedicamentos.filter(e => e.id != nroMedicamento);
                }
            }break;
            case "eliminarPrestacion": {
                const nro = (e.target.closest("button").id).slice(2);
                let nroPrestacion = document.querySelector(`#idPrestacion${nro}`).value;
                let divPrestacion = document.querySelector(`#p${nro}`);
                divPrestacion.previousElementSibling.remove();
                divPrestacion.remove();
                if(nroPrestacion){
                    idsDePrestaciones = idsDePrestaciones.filter(e => e.id != nroPrestacion);
                }
            }break;
            case "editarMedicamento": {
                const nro = (e.target.closest("button").id).slice(2);
                let input = document.querySelector(`#inputMedicamentoPrescripcion${nro}`);
                mensajeLlenarEspacioMedicamentoYPrestaciones(input, "", "green");
                input.readOnly = false;
            }break;
            case "editarPrestacion": {
                const nro = (e.target.closest("button").id).slice(2);
                let input = document.querySelector(`#inputPrestacionPrescripcion${nro}`);
                mensajeLlenarEspacioMedicamentoYPrestaciones(input, "", "green");
                input.readOnly = false;
            }break;
            case "agregarMedicamento": {
                let idMedicamentoDetalle = document.querySelector("#idMedicamentoDetalle");
                if(idMedicamentoDetalle.value !== ""){ // CHEQUEAMOS DE QUE HAYA UN MEDICAMENTO SELECCIONADO ANTES DE AÑADIR OTRO...
                    agregarNuevo("medicamento");
                }else{
                    mensajeLlenarEspacioMedicamentoYPrestaciones(inputMedicamentoPrescripcion, "SELECCIONE UN MEDICAMENTO ANTES DE AÑADIR OTRO", "red");
                }
            }break;
            case "agregarPrestacion": {
                let idPrestacion = document.querySelector("#idPrestacion");
                if(idPrestacion.value !== ""){ // CHEQUEAMOS DE QUE HAYAN SELECCIONADO UNA PRESTACIÓN PRIMERO 
                    agregarNuevo("prestacion");
                }else{
                    mensajeLlenarEspacioMedicamentoYPrestaciones(inputPrestacionPrescripcion, "SELECCIONE UNA PRESTACIÓN ANTES DE AÑADIR OTRA", "red");
                }
            }break;
        }
    }
});

const agregarNuevo = (elemento)=>{
    axios('http://localhost:3000/prescribir?query=medicamentos')
    .then(res => {
        if(elemento === "medicamento"){
            let medicamentos = res.data.medicamentos;
            medicamentos = medicamentos.filter(e => {
                return !idsDeMedicamentos.find(i => i.id == e.id);
            });
            medicamentos = medicamentos.map(e => {
                const id = e.id;
                const nombre = `${e.nombreGenerico} ${e.cantidadConcentracion}${e.unidadMedidaCon} ${e.forma} x${e.cantidadPresentacion}${e.unidadMedidaPres}`
                return {id, nombre};
            });
            // medicamentos = medicamentos.filter(e => idsDeMedicamentos.find(i => e.id !== i.id));
            let inputsDeMedicamentos = document.querySelectorAll(".inputMedicamentoPrescribir");
            if(inputsDeMedicamentos.length < 5){
                let contador = consultarQueNumerosQuedanDisponiblesDeMedicamentos()[0];
                let divMedicamentos = document.querySelector("#divMedicamentos");
                const label = document.createElement("label"); label.innerHTML = `Medicamento ${contador+1}`;
                const divInput = document.createElement("div");divInput.className = "inputMedicamentoPrescribir";
                divInput.id=`m${contador}`; //le ponemos un id para poder identificar el medicamento a eliminar 
                const medicamento = `
                                        <div class="divAutocompletadoMedicamento" id="${contador}">
                                            <div class="inputYBotonEliminarMedicamento" id="m${contador}inputYBotonEliminarMedicamento">
                                                <input class="classEnComunCSS" id="inputMedicamentoPrescripcion${contador}" type="text" placeholder="opcional" autocomplete = "off", required>
                                                <button class="tooltip eliminarMedicamento" type="button" data-action="eliminarMedicamento" id="mb${contador}">
                                                    <i class="fa-solid fa-trash-can" style="color: #f50000;"></i>
                                                    <p class="tooltiptext">Eliminar medicamento</p>
                                                </button> 
                                            </div>
                                            <input class="idMedicamentoDetalleHidden" type="hidden" name="idMedicamentoDetalle" id="idMedicamentoDetalle${contador}">
                                            <div class="autocompletadoMedicamentos" id="m${contador}autoMed"></div>
                                        </div>`;
                divInput.innerHTML = medicamento;
                divMedicamentos.appendChild(label);    
                divMedicamentos.appendChild(divInput);
                let input = document.querySelector(`#inputMedicamentoPrescripcion${contador}`);
                let autocompletadoMedicamento = document.querySelector(`#m${contador}autoMed`);
                let inputHidden = document.querySelector(`#idMedicamentoDetalle${contador}`);
                autocompleteFunction(medicamentos, input, autocompletadoMedicamento, inputHidden, input.offsetWidth, "medicamentoLista", "medicamentoListaFocus");
            }else{
                mensajeAlerta("warning", "Máximo 5 medicamentos");
            }
        }else{
            let prestaciones = res.data.prestaciones;
            prestaciones = prestaciones.map(e => {
                const id = e.idPrestacion;
                const nombre = e.nombrePrestacion;
                return {id, nombre};
            })
            let inputsPrestaciones = document.querySelectorAll(".inputPrestacionPrescribir");
            if(inputsPrestaciones.length < 5){
                // let divPrestaciones = document.querySelector("#divPrestaciones");
                let numerosDisponibles = getNumerosDisponiblesPrestaciones();
                let contador = numerosDisponibles[0];
                const label = document.createElement("label"); label.innerHTML = `Prestación ${contador+1}`;
                const divInput = document.createElement("div"); divInput.className = "inputPrestacionPrescribir";
                divInput.id = `p${contador}`; 
                const prestacion = `<div class="divAutocompletadoPrestacion">
                                        <div class="inputYBotonEliminarPrestacion" id="m${contador}inputYBotonEliminarPrestacion">
                                            <input class="classEnComunCSS" id="inputPrestacionPrescripcion${contador}" type="text" placeholder="opcional" autocomplete="off", required>
                                            <button class="tooltip eliminarPrestacion" type="button" data-action="eliminarPrestacion" id="pb${contador}">
                                                <i class="fa-solid fa-trash-can" style="color: #f50000;"></i>
                                                <p class="tooltiptext">Eliminar prestación</p>
                                            </button>
                                        </div>
                                        <input class="idPrestacionHidden" type="hidden" name="idPrestacion" id="idPrestacion${contador}">
                                        <div class="autocompletadoPrestaciones" id="p${contador}autoPres"></div>
                                    </div>
                                    <div id="divJustificacionPrestacion${contador}" class="divJustificacion"></div>`;
                divInput.innerHTML = prestacion;
                divPrestaciones.appendChild(label);
                divPrestaciones.appendChild(divInput);
                let input = document.querySelector(`#inputPrestacionPrescripcion${contador}`);
                let autocompletado = document.querySelector(`#p${contador}autoPres`);
                let inputHidden = document.querySelector(`#idPrestacion${contador}`);
                autocompleteFunction(prestaciones, input, autocompletado, inputHidden, input.offsetWidth, "prestacionLista", "prestacionListaFocus");
            }else{
                mensajeAlerta("warning", "Máximo 5 prestaciones");
            }
        }
    })
    .catch(error => console.log(error));
}

/*Listener que manipula las selecciones de medicamentos de los autocompletados */
let divMedicamentos = document.querySelector("#divMedicamentos");
divMedicamentos.addEventListener("click", async(e) => {
    let objetivo = e.target.closest(".medicamentoLista");
    if(objetivo){
        alSeleccionarMedicamento(objetivo);
    }
    let objetivo2 = e.target.closest(".classEnComunCSS");
    if(objetivo2){
        let divAutocompletadoMedicamento = objetivo2.closest(".divAutocompletadoMedicamento");
        let divAutocompletado = divAutocompletadoMedicamento.querySelector(".autocompletadoMedicamentos");
        if(divAutocompletado.innerHTML === "" && !objetivo2.readOnly){
            let medicamentos = await getListado("medicamentos");
            medicamentos = medicamentos.map(e => {
                const id = e.id;
                const nombre = `${e.nombreGenerico} ${e.cantidadConcentracion}${e.unidadMedidaCon} ${e.forma} x${e.cantidadPresentacion}${e.unidadMedidaPres}`;
                return {id, nombre};
            });
            divAutocompletado.style.width = objetivo2.offsetWidth;
            divAutocompletado.innerHTML = "";
            for(let m of medicamentos){
                divAutocompletado.innerHTML += `<li class="medicamentoLista" data-value="${m.id}">${m.nombre}</li>`; 
            }
        }else{
            divAutocompletado.innerHTML = "";
        }
    }
})

const getListado = async (tipo) => {
    try {
        const res = await axios("http://localhost:3000/prescribir?query=medicamentos")
        if(tipo === "medicamentos"){
            return res.data.medicamentos;
        }else if(tipo === "prestaciones"){
            return res.data.prestaciones;
        }else{
            return {};
        }
    } catch (error) {
        console.log(error);
    }
}

/*Listener que maneja los autocompletados en los inputs de medicamentos*/
divMedicamentos.addEventListener("input", async(e) => {
    let objetivo = e.target.closest(".divAutocompletadoMedicamento");
    if(objetivo){
        let medicamentos = await getListado("medicamentos");
        medicamentos = medicamentos.map(e => {
            const id = e.id;
            const nombre = `${e.nombreGenerico} ${e.cantidadConcentracion}${e.unidadMedidaCon} ${e.forma} x${e.cantidadPresentacion}${e.unidadMedidaPres}`;
            return {id, nombre};
        });
        let arreglo = medicamentos.filter(e => !idsDeMedicamentos.some(i => i.id == e.id));
        let lista = objetivo.querySelector(".autocompletadoMedicamentos");
        let inputHidden = objetivo.querySelector(".idMedicamentoDetalleHidden");
        let palabra = e.target.value.toLowerCase();
        lista.style.width = `${objetivo.querySelector("input").offsetWidth}px`;
        lista.innerHTML = "";
        if(palabra !== ""){
            for(let a of arreglo){
                if(a.nombre.toLowerCase().startsWith(palabra)){
                    lista.innerHTML += `<li class="medicamentoLista" data-value="${a.id}">${a.nombre}</li>`; 
                }
            }
        }
        if(palabra === ""){
            for(let a of arreglo){
                lista.innerHTML += `<li class="medicamentoLista" data-value="${a.id}">${a.nombre}</li>`; 
            }
        }
        if(inputHidden.value){
            idsDeMedicamentos = idsDeMedicamentos.filter(e => e.id != inputHidden.value);
            inputHidden.value = "";
        }
    }
});

/*Listener que maneja las selecciones de flechita para abajo y para arriba de autocompletados en los inputs de medicamentos*/
let contadorTeclas = 0;
divMedicamentos.addEventListener("keydown", (e) => {
    let objetivo = e.target.closest(".divAutocompletadoMedicamento");
    if(objetivo){
        let lista = objetivo.querySelector(".autocompletadoMedicamentos");
            if(e.code === "ArrowUp" || e.code === "ArrowDown"){
                if(lista.hasChildNodes()){
                    if(e.code === "ArrowUp" && contadorTeclas > 0){
                        contadorTeclas--;
                    }
                    if(e.code === "ArrowDown" && contadorTeclas < lista.childNodes.length){
                        contadorTeclas++;
                    }
                    for(let i = 0; i < lista.children.length; i++){
                        if(contadorTeclas-1 === i){
                            lista.children[i].classList.add("medicamentoListaFocus");
                            lista.children[i].scrollIntoView({ behavior: 'smooth'});
                        }else{
                            lista.children[i].classList.remove("medicamentoListaFocus");    
                        }
                    }
                }
            }else if(e.code == "Enter"){
                e.preventDefault();
                let elemento = document.getElementsByClassName("medicamentoListaFocus")[0];
                alSeleccionarMedicamento(elemento);
                lista.innerHTML = "";
            }else{
                contadorTeclas = 0;
            }
    }
})



const alSeleccionarMedicamento = (objetivo) => {
    let numeroDeAutocompletado = parseInt(objetivo.parentElement.id.slice(1,2)) || 0;
    let inputMedicamento = document.querySelector("#inputMedicamentoPrescripcion");
    let idMedicamentoDetalle = document.querySelector("#idMedicamentoDetalle");
    if(numeroDeAutocompletado > 0){
        inputMedicamento = document.querySelector(`#inputMedicamentoPrescripcion${numeroDeAutocompletado}`);
        idMedicamentoDetalle = document.querySelector(`#idMedicamentoDetalle${numeroDeAutocompletado}`);
    }
    let idMedicamento = parseInt(objetivo.getAttribute("data-value"));
    inputMedicamento.value = objetivo.textContent;
    inputMedicamento.readOnly = true; //Limitamos a que no se pueda editar el input una vez seleccionado el medicamento...
    idsDeMedicamentos.push({id:idMedicamento, nombre:objetivo.textContent});
    idMedicamentoDetalle.value = idMedicamento; //AÑADIMOS EL ID AL INPUT HIDDEN QUE MANDA LA INFO EN EL POST
    agregarCamposAMedicamentoSeleccionado(numeroDeAutocompletado);
    // AGREGAMOS EL BOTON EDITAR INPUT MEDICAMENTO
    let divParaAgregarBoton = document.querySelector(`#m${numeroDeAutocompletado}inputYBotonEliminarMedicamento`)
    if(numeroDeAutocompletado>0){
            agregarBotonEditarInput(divParaAgregarBoton, "editarMedicamento", "editarMedicamento", `em${numeroDeAutocompletado}`);
    }else{
        divParaAgregarBoton = document.querySelector(".divLabelYBtnAgregarMedicamento");
        agregarBotonEditarInput(divParaAgregarBoton, "editarMedicamento", "editarMedicamento", `em`);
    }
}



//-------------------------------SECCIÓN LISTAR PRESCRIPCIONES ANTERIORES-------------------------------//
const listadoDePrescripcionesAnteriores = (prescripcionesAnteriores, idPaciente) => {
    let div = document.createElement("div");
    let presAnt = prescripcionesAnteriores;
    console.log(prescripcionesAnteriores);
    const idsDePrescripciones = new Set(); // añadimos a un set todos los ids de prescripciones
    for(let i = 0; i < prescripcionesAnteriores.length; i++){
        for(let j = 0; j < prescripcionesAnteriores[i].length; j++){
            idsDePrescripciones.add(prescripcionesAnteriores[i][j].idPrescripcion);
        }
    }
    /*Recorremos el set de ids de prescripciones para ir armando la caja de prescripciones anteriores por prescripcion... */
    idsDePrescripciones.forEach(e => {
        let medicamentoOfPrescripcion = "";
        let diagFechVigen = "";
        for(let m of prescripcionesAnteriores[0]){
            if(m.idPrescripcion == e){
                diagFechVigen = `<p>Diagnóstico:    ${m.diagnostico}</p> 
                                 <p>Fecha:  ${new Date(m.fecha).toLocaleDateString()}</p>
                                 <p>Vigencia:   ${new Date(m.vigencia).toLocaleDateString()}</p>`
                medicamentoOfPrescripcion += `
                    <li><p>Medicamento:</p>${m.nombreGenerico} ${m.cantidadConcentracion} ${m.unidadMedidaCon} ${m.forma} x${m.cantidadPresentacion} ${m.unidadMedidaPres}</li>`
            }
        }
        let prestacionOfPrescripcion = "";
        for(let p of prescripcionesAnteriores[1]){
            if(p.idPrescripcion == e){ 
                prestacionOfPrescripcion += `
                    <li><p>Prestación:</p>${p.nombrePrestacion}</li>
                    <li><p>Indicación:</p>${p.indicacion}</li>
                    <li><p>Justificación:</p>${p.justificacion}</li>`;
                prestacionOfPrescripcion +=`<li><p>Lados:</p></li>`;
                for(let l of p.nombresLados.split(",")){
                    prestacionOfPrescripcion +=`<li style="list-style-type=none">${l}</li>`;
                }
                if(!p.resultadoPrestacion){
                    prestacionOfPrescripcion += `
                    <div class="divResultadoPrestacion">
                        <div class="divAniadirResultado" id="p${e}restacionAnterior">
                            <button class="botonAniadirResultado" id="a${e}niadirRes" action="aniadirResultado" data-value="${e}" data-idPrestacion="${p.idPrestacion}">Añadir resultado</button>
                        </div>
                    </div>`                    
                }else{
                    prestacionOfPrescripcion += `
                        <li><p>Resultado:</p>${p.resultadoPrestacion}</li>
                    `;
                }
            }
        }
        let botonImprimirPrescripcion = `<button action="imprimir" data-value="${e}">IMPRIMIR PRESCRIPCION</button>`
        let ul = document.createElement("ul");
        ul.innerHTML = diagFechVigen;
        ul.innerHTML += medicamentoOfPrescripcion;
        ul.innerHTML += prestacionOfPrescripcion;
        ul.innerHTML += botonImprimirPrescripcion;
        div.appendChild(ul);
    })
    console.log(idsDePrescripciones)
    return div;
}

/*Listener que manipula los botones de las prescripciones anteriores */
const prescripcionesAnterioresPaciente = document.querySelector("#prescripcionesAnterioresPaciente");
prescripcionesAnterioresPaciente.addEventListener("click", (evento) => {
    let objetivo = evento.target.closest("button");
    if(objetivo){
        console.log(objetivo)
        switch(objetivo.getAttribute("action")){
            case "aniadirResultado":{
                let idPrescripcion = objetivo.getAttribute("data-value");
                objetivo.style.display = "none";
                let botonGuardarResultado = `
                <button type="button" action="guardarResultado" class="botonGuardarResultado" id="g${idPrescripcion}uardarRes">Guardar resultado</button>`
                let botonCancelar = `
                <button type="button" action="cancelarResultado" class="cancelarGuardarResultado" id="c${idPrescripcion}ancelarRes">Cancelar</button>`
                let textArea = `<textArea class="textAreaResultadoObservacion" id="t${idPrescripcion}extArea" cols="53" rows="3" placeholder="Resultado/observación de la prescripción..."></textArea>`;
                let divAniadirResultado = document.querySelector(`#p${idPrescripcion}restacionAnterior`);
                divAniadirResultado.innerHTML += textArea;
                divAniadirResultado.innerHTML += botonGuardarResultado;
                divAniadirResultado.innerHTML += botonCancelar;
                break;}
            case "guardarResultado":{
                let idPrescripcion = (objetivo.id).slice(1,2);
                let btnAniadirRes = document.querySelector(`#a${idPrescripcion}niadirRes`);
                let idPrestacion = btnAniadirRes.getAttribute("data-idPrestacion");
                let textArea = document.querySelector(`#t${idPrescripcion}extArea`);
                let botonCancelar = document.querySelector(`#c${idPrescripcion}ancelarRes`);
                if(textArea.value !== ""){            
                    axios.put("http://localhost:3000/prescribir/guardarResultado", {idPrestacion, resultado: textArea.value, idPrescripcion})
                    .then(res => {
                        // Si se ha añadido correctamente eliminamos los botones, mostramos un mensaje en el text area
                        //  y al segundo llamamos a la funcion para crear el item del resultado...
                        if(res.data.aniadido){ 
                            objetivo.remove();
                            botonCancelar.remove();
                            textArea.style.backgroundColor = "lightblue";
                            textArea.value= "RESULTADO AÑADIDO CORRECTAMENTE";
                            setTimeout(() => {
                                //removemos el divAniadirResultado y creamos el li con el resultado cargado...
                                let divAniadirResultado = document.querySelector(`#p${idPrescripcion}restacionAnterior`);
                                let liResultado = document.createElement("li");
                                liResultado.innerHTML = `Resultado: ${res.data.resultado}`;
                                divAniadirResultado.parentElement.appendChild(liResultado);
                                divAniadirResultado.remove();
                            }, 1000)
                        }else{ //si no mostramos un mensaje de error en el text area y reiniciamos el boton añadir resultado
                            textArea.value = "ERROR AL GUARDAR EL RESULTADO, INTENTELO DE NUEVO...";
                            textArea.style.backgroundColor = "lightcoral";
                            textArea.setTimeout(() => {
                                textArea.innerHTML = "";
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
                break;}
            case "cancelarResultado":{
                let num = (objetivo.id).slice(1,2);
                let btnAniadirRes = document.querySelector(`#a${num}niadirRes`);
                let btnGuardar = document.querySelector(`#g${num}uardarRes`);
                let txtArea = document.querySelector(`#t${num}extArea`);
                btnGuardar.remove();
                txtArea.remove();
                objetivo.remove();
                btnAniadirRes.style.display = "inline-block";
                break;}
            case "imprimir": {
                let idPrescripcion = objetivo.getAttribute("data-value");
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
                break;}
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

//-------------------------------SECCIÓN FUNCIONES DEL AUTOCOMPLETADO MEDICAMENTO-------------------------------//

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

let idsDeMedicamentos = [];

//Función que permite editar un input de medicamento una vez que es seleccionado uno de estos...
const agregarBotonEditarInput = (divParaAgregarBoton, nombreDeClase, action, idButton) => {
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
        button.setAttribute("data-action", action);
        button.id = idButton;
        let icono = document.createElement("i"); icono.className="fa-solid fa-pen-to-square"; icono.style.color= "#2c3e50";
        let p = document.createElement("p"); p.className="tooltiptext"; p.innerHTML = "Editar";
        button.appendChild(icono);button.appendChild(p); //agregamos el icono de fontawesome y el texto de informacion al boton
        divParaAgregarBoton.appendChild(button); //agregamos el boton al divDeBotones
    }
}

const agregarCamposAMedicamentoSeleccionado = (contador) => {
//AGREGAMOS CAMPOS DOS, INTERVALO Y DURACIÓN CUANDO SELECCIONAN UN MEDICAMENTO
    if(contador === 0){
        let divJustificacion = document.querySelector("#divJustificacion");
        if(!divJustificacion.hasChildNodes()){
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
        }
    }else if(contador > 0){
        let divJustificacion = document.createElement("div");
        let inputMedicamento = document.querySelector(`.inputMedicamentoPrescribir#m${contador}`);
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
        for(let ic of inputMedicamento.children){
            if(ic.id === `divJustificacion${contador}`){    
                tieneDivJustificacion = true;
                break;
            }
        }
        if(!tieneDivJustificacion){ // chequeamos de que no haya un divJustificacion ya creado...
            inputMedicamento.appendChild(divJustificacion);
        }
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

let idsDePrestaciones = [];

const divPrestaciones = document.querySelector("#divPrestaciones");
divPrestaciones.addEventListener("click", async(evento) => {
    let objetivo = evento.target.closest(".prestacionLista");
    if(objetivo){
        alSeleccionarPrestacion(objetivo);  
    }
    let objetivo2 = evento.target.closest(".classEnComunCSS");
    if(objetivo2){
        let divAutocompletadoPrestacion = objetivo2.closest(".divAutocompletadoPrestacion");
        let autocompletadoPrestaciones = divAutocompletadoPrestacion.querySelector(".autocompletadoPrestaciones");
        if(autocompletadoPrestaciones.innerHTML === "" && !objetivo2.readOnly){
            let prestaciones = await getListado("prestaciones");
            autocompletadoPrestaciones.style.width = objetivo2.offsetWidth;
            prestaciones = prestaciones.map(e => {
                const id = e.idPrestacion;
                const nombre = e.nombrePrestacion;
                return {id, nombre};
            })
            for(let p of prestaciones){
                autocompletadoPrestaciones.innerHTML += `<li class="prestacionLista" data-value="${p.id}">${p.nombre}</li>`; 
            }
        }
    }
})

divPrestaciones.addEventListener("input", async (evento) => {
    let objetivo = evento.target.closest(".classEnComunCSS");
    if(objetivo){
        let prestaciones = await getListado("prestaciones");
        let divAutocompletadoPrestacion = objetivo.closest(".divAutocompletadoPrestacion");
        let autocompletadoPrestaciones = divAutocompletadoPrestacion.querySelector(".autocompletadoPrestaciones");
        autocompletadoPrestaciones.style.width = objetivo.offsetWidth; 
        let inputHidden = divAutocompletadoPrestacion.querySelector("#idPrestacion");
        let palabra = evento.target.value;
        if(palabra){
            autocompletadoPrestaciones.innerHTML = "";
            for(let p of prestaciones){
                if(p.nombrePrestacion.toLowerCase().startsWith(palabra.toLowerCase())){
                    autocompletadoPrestaciones.innerHTML += `<li class="prestacionLista" data-value="${p.idPrestacion}">${p.nombrePrestacion}</li>`;
                }
            }
        }else if(palabra === ""){
            for(let p of prestaciones){
                autocompletadoPrestaciones.innerHTML += `<li class="prestacionLista" data-value="${p.idPrestacion}">${p.nombrePrestacion}</li>`;
            }
        }
        if(inputHidden.value){
            idsDePrestaciones = idsDeMedicamentos.filter(e => e.id != inputHidden.value);
            inputHidden.value = "";
        }
    }
})

let contadorTeclas2 = 0;
divPrestaciones.addEventListener("keydown", (evento) => {
    let objetivo = evento.target.closest(".divAutocompletadoPrestacion");
    if(objetivo){
        let lista = objetivo.querySelector(".autocompletadoPrestaciones");
        if(evento.code === "ArrowDown" || evento.code === "ArrowUp"){
                if(lista.hasChildNodes()){
                    if(evento.code === "ArrowUp" && contadorTeclas2 > 0){
                        contadorTeclas2--;
                    }
                    if(evento.code === "ArrowDown" && contadorTeclas2 < lista.childNodes.length){
                        contadorTeclas2++;
                    }
                    for(let i = 0; i < lista.children.length; i++){
                        if(contadorTeclas2-1 === i){
                            lista.children[i].classList.add("prestacionListaFocus");
                            lista.children[i].scrollIntoView({ behavior: 'smooth'});
                        }else{
                            lista.children[i].classList.remove("prestacionListaFocus");    
                        }
                    }
                }
        }else if(evento.code == "Enter"){
            evento.preventDefault();
            let elemento = document.getElementsByClassName("prestacionListaFocus")[0];
            alSeleccionarPrestacion(elemento);
            lista.innerHTML = "";
        }else{
            contadorTeclas2 = 0;
        }
    }
})

const alSeleccionarPrestacion = (elemento) => {
    let numeroDePrestacion = (elemento.parentElement.id).slice(1,2) || 0;
    let ipp = document.querySelector("#inputPrestacionPrescripcion");
    let ip = document.querySelector("#idPrestacion");
    let divJustificacionPrestacion = document.querySelector("#divJustificacionPrestacion");
    let idPrestacion = elemento.getAttribute("data-value"); 
    if(numeroDePrestacion){
        ip = document.querySelector(`#idPrestacion${numeroDePrestacion}`);
        ipp = document.querySelector(`#inputPrestacionPrescripcion${numeroDePrestacion}`);
        divJustificacionPrestacion = document.querySelector(`#divJustificacionPrestacion${numeroDePrestacion}`);
    } 
    ipp.value = elemento.textContent;
    ipp.readOnly = true;
    ip.value = idPrestacion;
    idsDePrestaciones.push({id: idPrestacion, nombre: elemento.textContent});
    agregarCamposJustificacionPrestacion(idPrestacion, divJustificacionPrestacion);
    //Agregamos el boton editar prestación dependiendo si es la primera prestación o las demás...
    let divParaAgregarBoton = document.querySelector(".divLabelYBtnAgregarPrestacion");
    if(numeroDePrestacion){
        divParaAgregarBoton = document.querySelector(`#m${numeroDePrestacion}inputYBotonEliminarPrestacion`);
        agregarBotonEditarInput(divParaAgregarBoton, "editarPrestacion", "editarPrestacion", `ep${numeroDePrestacion}`)
    }else{
        agregarBotonEditarInput(divParaAgregarBoton, "editarPrestacion", "editarPrestacion", "ep");
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
    console.log(prestacion);
    let idsLados = [];
    if(prestacion.idsLados){
        idsLados = prestacion.idsLados.split(","); 
    }
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
    let selectEspecialidad = document.querySelector(`#selectLadosPrestacion`);
    let checkBoxEspecialidad = document.querySelector("#checkBoxPrestacion");
    let inputLadoPrestacion = document.querySelector(`#inputLadoPrestacion`);
    if(contador){
        selectEspecialidad = document.querySelector(`#selectLadosPrestacion${contador}`) 
        checkBoxEspecialidad = document.querySelector(`#checkBoxPrestacion${contador}`);
        inputLadoPrestacion = document.querySelector(`#inputLadoPrestacion${contador}`);
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

const agregarCamposJustificacionPrestacion = (idPrestacion, divJustificacionPrestacion) => {
    axios(`http://localhost:3000/registrar/prestacion/prestaciones/${idPrestacion}`)
    .then(async res => {
        let prestacion = res.data[0];
        let numerosDisponiblesPrestacion = getNumerosDisponiblesPrestacionSinJustificacion();
        let sides = await getLados(); 
        console.log(sides);
        let inputsPrestacionPrescribir = document.querySelectorAll(".inputPrestacionPrescribir");
        if(inputsPrestacionPrescribir.length === 1){
            divJustificacionPrestacion.innerHTML = agregarSeccionJustificacion(prestacion, sides);
            agregarEventoExpandirSelectLados();
        }else{
            divJustificacionPrestacion.innerHTML = agregarSeccionJustificacion(prestacion, sides, numerosDisponiblesPrestacion[0]);
            agregarEventoExpandirSelectLados(numerosDisponiblesPrestacion[0]);
        }
    })
}

const mensajeAlerta = (icon, title, timer) => {
    Swal.fire({icon, title, timer});
}

export {listadoDePrescripcionesAnteriores, mensajeLlenarEspacioMedicamentoYPrestaciones};