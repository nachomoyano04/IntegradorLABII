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
                    console.log(idsDeMedicamentos);
                    idsDeMedicamentos = idsDeMedicamentos.filter(e => e.id !== nroMedicamento);
                    console.log(idsDeMedicamentos);
                }
            }break;
            case "eliminarPrestacion": {
                const nro = (e.target.closest("button").id).slice(2);
                let nroPrestacion = document.querySelector(`#idPrestacion${nro}`).value;
                let divPrestacion = document.querySelector(`#p${nro}`);
                divPrestacion.previousElementSibling.remove();
                divPrestacion.remove();
                if(nroPrestacion){
                    idsDePrestaciones = idsDePrestaciones.filter(e => e.id !== nroPrestacion);
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
                    agregarNuevoMedicamento(medicamentos);
                    agregarNewMedicamento();
                }else{
                    mensajeLlenarEspacioMedicamentoYPrestaciones(inputMedicamentoPrescripcion, "SELECCIONE UN MEDICAMENTO ANTES DE AÑADIR OTRO", "red");
                }
            }break;
            case "agregarPrestacion": {
                let idPrestacion = document.querySelector("#idPrestacion");
                if(idPrestacion.value !== ""){ // CHEQUEAMOS DE QUE HAYAN SELECCIONADO UNA PRESTACIÓN PRIMERO 
                    agregarNuevaPrestacion(prestaciones);
                }else{
                    mensajeLlenarEspacioMedicamentoYPrestaciones(inputPrestacionPrescripcion, "SELECCIONE UNA PRESTACIÓN ANTES DE AÑADIR OTRA", "red");
                }
                console.log("rawP")
            }break;
        }
    }
});

const agregarNewMedicamento = ()=>{
    axios('http://localhost:3000/prescribir?query=medicamentos')
    .then(res => {
        //implementar que a partir de los medicamentos de la bd, hacer la funcion para cuando tocan el boton
        //agregar un nuevo medicamento...
    })
    .catch(error => console.log(error));
}

/*Listener que manipula las selecciones de medicamentos de los autocompletados */
let divMedicamentos = document.querySelector("#divMedicamentos");
divMedicamentos.addEventListener("click", (e) => {
        let objetivo = e.target.closest(".medicamentoAutocomplete");
        if(objetivo){
            let numeroDeAutocompletado = parseInt(objetivo.parentElement.id.slice(1,2)) || 0;
            let inputMedicamento = document.querySelector("#inputMedicamentoPrescripcion");
            let idMedicamentoDetalle = document.querySelector("#idMedicamentoDetalle");
            if(numeroDeAutocompletado > 0){
                inputMedicamento = document.querySelector(`#inputMedicamentoPrescripcion${numeroDeAutocompletado}`);
                idMedicamentoDetalle = document.querySelector(`#idMedicamentoDetalle${numeroDeAutocompletado}`);
            }
            let idMedicamento = objetivo.getAttribute("data-value");
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
})

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

const configurarBotonCrearMedicamento = (medicamentos) => {
    // let botonAgregarMedicamento = document.querySelector("#botonAgregarMedicamento");
    // let inputMedicamentoPrescripcion = document.querySelector("#inputMedicamentoPrescripcion");
    // botonAgregarMedicamento.addEventListener("click", () => {
    //     let idMedicamentoDetalle = document.querySelector("#idMedicamentoDetalle");
    //     // if(idMedicamentoDetalle.value !== ""){ // CHEQUEAMOS DE QUE HAYA UN MEDICAMENTO SELECCIONADO ANTES DE AÑADIR OTRO...
    //     //     agregarNuevoMedicamento(medicamentos);
    //     // }else{
    //     //     mensajeLlenarEspacioMedicamentoYPrestaciones(inputMedicamentoPrescripcion, "SELECCIONE UN MEDICAMENTO ANTES DE AÑADIR OTRO", "red");
    //     // }
    // })
}

const agregarNuevoMedicamento = (medicamentos) => {
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
        let elemento = document.querySelector(`#inputMedicamentoPrescripcion${contador}`);
        let autocompletadoMedicamentos = document.querySelectorAll(".autocompletadoMedicamentos");
        let autocompletado = [];
        for(let am of autocompletadoMedicamentos){
            if(parseInt(am.parentElement.parentElement.id.slice(1)) === contador){
                autocompletado = am;
                break;
            }
        }
        elemento.addEventListener("input", (event) => {
            let palabra = event.target.value;
            agregarAutocompletadoMedicamento(palabra, medicamentos, autocompletado, elemento, contador);
        })
        // agregarEscuchadoresDeEventosAMedicamentos(medicamentos, autocompletado, elemento, contador)
    }else{
        Swal.fire({icon:"warning", title:"Máximo 5 medicamentos", timer: 2000});
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
        autocompletadoMedicamento.innerHTML="";
        let medicamentoRecomendado = medicamentos.filter(e => {
            const medicamentoString = e.nombreGenerico.concat(" ", e.cantidadConcentracion, " ",e.unidadMedidaCon, " ", e.forma, " x", e.cantidadPresentacion , " ", e.unidadMedidaPres);
            const comparacion = medicamentoString.toLowerCase().includes(palabra.toLowerCase())
            return comparacion && !idsDeMedicamentos.some(i => i.id == e.id); // mostramos los recomendados y que no hayan sido elegidos antes...
        });
        for(let mr of medicamentoRecomendado){
            let div = document.createElement("div");
            let contenido = mr.nombreGenerico.concat(" ", mr.cantidadConcentracion, " ",mr.unidadMedidaCon, " ", mr.forma, " x", mr.cantidadPresentacion , " ", mr.unidadMedidaPres);
            div.innerHTML = contenido;
            div.className = "medicamentoAutocomplete";
            div.setAttribute("data-value", mr.id);
            autocompletadoMedicamento.appendChild(div);
        }
    }else if(palabra === ""){
        //borramos el boton editar creado en la posicion que va el contador...
        if(contador){
            let botonEditarInput = document.querySelector(`#em${contador}`);
            if(botonEditarInput)botonEditarInput.remove();
        }else{ //si es el primer input
            let botonEditarInput = document.querySelector(`#em`);
            if(botonEditarInput)botonEditarInput.remove();
        }
        autocompletadoMedicamento.innerHTML = "";

        let idMedicamentoDetalle = document.querySelector("#idMedicamentoDetalle");
        let divJustificacion = document.querySelector("#divJustificacion");
        if(contador){ 
            idMedicamentoDetalle = document.querySelector(`#idMedicamentoDetalle${contador}`);
            let divJustificacionContador = document.querySelector(`#divJustificacion${contador}`)
            if(divJustificacionContador){
                divJustificacionContador.remove();
            }
        }else{
            divJustificacion.innerHTML = "";
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
        let inputMedicamentoPrescribir = document.querySelector(`.inputMedicamentoPrescribir#m${contador}`);
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
        for(let ic of inputMedicamentoPrescribir.children){
            if(ic.id === `divJustificacion${contador}`){    
                tieneDivJustificacion = true;
                break;
            }
        }
        if(!tieneDivJustificacion){ // chequeamos de que no haya un divJustificacion ya creado...
            inputMedicamentoPrescribir.appendChild(divJustificacion);
        }
    }
}

//-------------------------------SECCIÓN FUNCIONES DEL AUTOCOMPLETADO PRESTACIÓN-------------------------------//

const configurarBotonCrearPrestacion = (prestaciones) => {
    let botonAgregarPrestacion = document.querySelector("#botonAgregarPrestacion");
    botonAgregarPrestacion.addEventListener("click", () => {
        let idPrestacion = document.querySelector("#idPrestacion");
        if(idPrestacion.value !== ""){ // CHEQUEAMOS DE QUE HAYAN SELECCIONADO UNA PRESTACIÓN PRIMERO 
            agregarNuevaPrestacion(prestaciones);
        }else{
            mensajeLlenarEspacioMedicamentoYPrestaciones(inputPrestacionPrescripcion, "SELECCIONE UNA PRESTACIÓN ANTES DE AÑADIR OTRA", "red");
        }
    })
}

const agregarNuevaPrestacion = (prestaciones) => {
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
        let elemento = document.querySelector(`#inputPrestacionPrescripcion${contador}`);
        let autocompletadoPrestaciones = document.querySelectorAll(".autocompletadoPrestaciones");
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
let idsDePrestaciones = [];
const agregarAutocompletadoPrestacion = (palabra, prestaciones, autocompletadoPrestacion, inputPrestaciones, contador) => {
    let prestacionesEnString = prestaciones.map(e => JSON.stringify(e));
        autocompletadoPrestacion.innerHTML = "";
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
                return e.toLowerCase().includes(palabra.toLowerCase()) && !idsDePrestaciones.some(i => i.id == idPrestacion);
            });
            for(let p of presta){
                let div = document.createElement("div");
                let pre = JSON.parse(p);
                div.className = "prestacionAutocomplete";
                div.innerHTML = pre.nombrePrestacion;
                div.setAttribute("data-value", pre.idPrestacion);
                autocompletadoPrestacion.appendChild(div);
            }
        }else{
            //borramos el boton editar creado en la posicion que va el contador...
            if(contador){
                let botonEditar = document.querySelector(`#em${contador}`);
                if(botonEditar)botonEditar.remove();
                let divJustificacion = document.querySelector(`#divJustificacionPrestacion${contador}`);
                if(divJustificacion){
                    divJustificacion.innerHTML = "";
                }
            }else{
                let botonEditar = document.querySelector(`#em`);
                if(botonEditar)botonEditar.remove();
                let divJustificacion = document.querySelector(`#divJustificacionPrestacion`);
                if(divJustificacion){
                    divJustificacion.innerHTML = "";
                }
            }

            autocompletadoPrestacion.innerHTML = "";
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

const divPrestaciones = document.querySelector("#divPrestaciones");
divPrestaciones.addEventListener("click", (evento) => {
    let objetivo = evento.target.closest(".prestacionAutocomplete");
    if(objetivo){
        let numeroDePrestacion = (objetivo.parentElement.id).slice(1,2) || 0;
        let ipp = document.querySelector("#inputPrestacionPrescripcion");
        let ip = document.querySelector("#idPrestacion");
        let divJustificacionPrestacion = document.querySelector("#divJustificacionPrestacion");
        let idPrestacion = objetivo.getAttribute("data-value"); 
        if(numeroDePrestacion){
            ip = document.querySelector(`#idPrestacion${numeroDePrestacion}`);
            ipp = document.querySelector(`#inputPrestacionPrescripcion${numeroDePrestacion}`);
            divJustificacionPrestacion = document.querySelector(`#divJustificacionPrestacion${numeroDePrestacion}`);
        } 
        ipp.value = objetivo.textContent;
        ipp.readOnly = true;
        ip.value = idPrestacion;
        idsDePrestaciones.push({id: idPrestacion, nombre: objetivo.textContent});
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
})

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
export {listadoDePrescripcionesAnteriores, configurarBotonCrearMedicamento, agregarAutocompletadoMedicamento, agregarAutocompletadoPrestacion, configurarBotonCrearPrestacion, mensajeLlenarEspacioMedicamentoYPrestaciones};