import { borrarAutocompletadoAnterior, listadoDePrescripcionesAnteriores, configurarBotonCrearMedicamento, agregarAutocompletadoMedicamento, configurarBotonCrearPrestacion, agregarAutocompletadoPrestacion, borrarAutocompletadoClickEverywhere } from "./prescribirFunciones.js";


//SECCION AUTOCOMPLETADOS DE MEDICAMENTOS Y PRESTACIONES
let inputMedicamentos  = document.querySelector("#inputMedicamentoPrescripcion");
let autocompletadoMedicamento = document.querySelector(".autocompletadoMedicamentos");

let inputPrestaciones = document.querySelector("#inputPrestacionPrescripcion");
let autocompletadoPrestacion = document.querySelector(".autocompletadoPrestaciones");

let botonPrescribir = document.querySelector("#botonPrescribir"); //Boton cargar prescripción
botonPrescribir.disabled = true;

axios('http://localhost:3000/prescribir?query=medicamentos')
.then(res => {
    inputMedicamentos.addEventListener("input", (evento) => {
        let palabra = evento.target.value;
        let medicamentos = res.data.medicamentos;
        agregarAutocompletadoMedicamento(palabra, medicamentos, autocompletadoMedicamento, inputMedicamentos);
    })
    borrarAutocompletadoClickEverywhere();
    configurarBotonCrearMedicamento(res.data.medicamentos);

    inputPrestaciones.addEventListener("input", (evento) => {
        let palabra = evento.target.value;
        let prestaciones = res.data.prestaciones;
        agregarAutocompletadoPrestacion(palabra, prestaciones, autocompletadoPrestacion, inputPrestaciones)
    })
    configurarBotonCrearPrestacion(res.data.prestaciones);
})
.catch(error => console.log(error));

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
        if(prescripcionesAnteriores.length === 0){
            pPresAnte.innerHTML = "- No existen prescripciones anteriores.";
        }else{
            pPresAnte.className = "pPrescripcionesAnteriores";
            pPresAnte.appendChild(listadoDePrescripcionesAnteriores(prescripcionesAnteriores));
            pTitulo.innerHTML = `Prescripciones anteriores paciente ${prescripcionesAnteriores[0].nombre}`;
            areaPrescripcionesAnteriores.appendChild(pTitulo);
        }
        areaPrescripcionesAnteriores.appendChild(pPresAnte);
    })
    .catch(error => console.log(`Error al buscar prescripciones anteriores: ${error}`));
})