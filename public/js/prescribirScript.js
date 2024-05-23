//SECCION AUTOCOMPLETADOS DE MEDICAMENTOS Y PRESTACIONES
let inputMedicamentos  = document.querySelector("#inputMedicamentoPrescripcion");
let inputPrestaciones = document.querySelector("#inputPrestacionPrescripcion");
let autocompletadoPrestacion = document.querySelector(".autocompletadoPrestaciones");
let autocompletadoMedicamento = document.querySelector(".autocompletadoMedicamentos");
let bodyInicio = document.querySelector(".bodyInicio");
axios('http://localhost:3000/prescribir?query=medicamentos')
.then(res => {
    inputMedicamentos.addEventListener("input", (evento) => {
        let palabra = evento.target.value;
        let medicamentos = res.data.medicamentos;
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
                    idMedicamentoDetalle.value = mr.id;
                })
            }
        }else if(palabra === ""){
            borrarAutocompletadoAnterior(autocompletadoMedicamento)
        }
    })
    inputPrestaciones.addEventListener("input", (evento) => {
        let palabra = evento.target.value;
        let arregloDePrestaciones = res.data.prestaciones;
        let prestacionesEnString = arregloDePrestaciones.map(e => JSON.stringify(e));
        borrarAutocompletadoAnterior(autocompletadoPrestacion);
        if(palabra !== ""){
            let prestaciones = prestacionesEnString.filter(e => e.toLowerCase().includes(palabra.toLowerCase()));
            for(let p of prestaciones){
                let div = document.createElement("div");
                let pre = JSON.parse(p);
                div.appendChild(crearPrestacion(pre));
                autocompletadoPrestacion.appendChild(div);
                div.addEventListener("click", (evento) => {
                    inputPrestaciones.value = `${pre.nombre} ${pre.lado} ${pre.indicacion} ${pre.justificacion} ${pre.resultado}`;
                    borrarAutocompletadoAnterior(autocompletadoPrestacion)
                    let idPrestacion = document.getElementById("idPrestacion");
                    idPrestacion.value = pre.idPrestacion;
                })
            }
        }else{
            borrarAutocompletadoAnterior(autocompletadoPrestacion);
        }
    })
    bodyInicio.addEventListener("click", () => { //para borrar los autocompletados cuando toquen cualquier parte del body
        borrarAutocompletadoAnterior(autocompletadoMedicamento);
        borrarAutocompletadoAnterior(autocompletadoPrestacion);
    })
})
.catch(error => console.log(error));

const borrarAutocompletadoAnterior = (elemento) => {
    while(elemento.hasChildNodes()){
        elemento.removeChild(elemento.firstChild);
    }
}

const crearPrestacion = (prestacion) => {
    let ul = document.createElement("ul");
    let liNombre = document.createElement("li");
    let liLado = document.createElement("li");
    let liIndicacion = document.createElement("li");
    let liJustificacion = document.createElement("li");
    let liResultado = document.createElement("li");
    liNombre.innerHTML = `${prestacion.nombre}`;
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

    //SECCION LLENADO DE PRESCRIPCIONES ANTERIORES DE X PACIENTE
let areaPrescripcionesAnteriores = document.querySelector("#prescripcionesAnterioresPaciente");
let selectPacientes = document.querySelector("#selectPacientes");
    //Lógica para que cuando cambien de paciente aparezcan las prescripciones anteriores de dicho paciente
selectPacientes.addEventListener("change", (event) => {
    let idPaciente = event.target.value;
    axios(`http://localhost:3000/prescribir/${idPaciente}`)
    .then(res => {
        borrarAutocompletadoAnterior(areaPrescripcionesAnteriores);
        let pTitulo = document.createElement("p");
        const prescripcionesAnteriores = res.data;
        pTitulo.className = "tituloPrescripcionesAnteriores";
        let pPresAnte = document.createElement("p");
        pPresAnte.className = "pPrescripcionesAnteriores";
        if(prescripcionesAnteriores.length === 0){
            pPresAnte.innerHTML = "- No existen prescripciones anteriores.";
        }else{
            pPresAnte.appendChild(listadoDePrescripcionesAnteriores(prescripcionesAnteriores));
            pTitulo.innerHTML = `Prescripciones anteriores paciente ${prescripcionesAnteriores[0].nombre}`;
            areaPrescripcionesAnteriores.appendChild(pTitulo);
        }
        areaPrescripcionesAnteriores.appendChild(pPresAnte);
    })
    .catch(error => console.log(`Error al buscar prescripciones anteriores: ${error}`));
})

const listadoDePrescripcionesAnteriores = (prescripcionesAnteriores) => {
    let div = document.createElement("div");
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
        liPrestacion.innerHTML = `Prestacion: ${pa.nombre} ${pa.lado} ${pa.indicacion} ${pa.justificacion} ${pa.resultado}`;
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
        div.appendChild(ul);
    }
    return div;
}