import { borrarAutocompletadoAnterior, listadoDePrescripcionesAnteriores, configurarBotonCrearMedicamento, agregarAutocompletadoMedicamento, configurarBotonCrearPrestacion, agregarAutocompletadoPrestacion, borrarAutocompletadoClickEverywhere, mensajeLlenarEspacioMedicamentoYPrestaciones } from "./prescribirFunciones.js";

//SECCION AUTOCOMPLETADOS DE MEDICAMENTOS Y PRESTACIONES
let inputMedicamentos  = document.querySelector("#inputMedicamentoPrescripcion");
let autocompletadoMedicamento = document.querySelector(".autocompletadoMedicamentos");

let inputPrestaciones = document.querySelector("#inputPrestacionPrescripcion");
let autocompletadoPrestacion = document.querySelector(".autocompletadoPrestaciones");

let botonPrescribir = document.querySelector("#botonPrescribir"); //Boton cargar prescripción

axios('http://localhost:3000/prescribir?query=medicamentos')
.then(res => {
    if(res.data.medicamentos.length > 0){
        inputMedicamentos.addEventListener("input", (evento) => {
            let palabra = evento.target.value;
            let medicamentos = res.data.medicamentos;
            console.log(medicamentos)
            if(medicamentos){
                agregarAutocompletadoMedicamento(palabra, medicamentos, autocompletadoMedicamento, inputMedicamentos);
            }
        })
    }else{
        inputMedicamentos.placeholder = "No existen medicamentos";
    }
    borrarAutocompletadoClickEverywhere();
    configurarBotonCrearMedicamento(res.data.medicamentos);
    if(res.data.prestaciones.length > 0){
        inputPrestaciones.addEventListener("input", (evento) => {
            let palabra = evento.target.value;
            let prestaciones = res.data.prestaciones;
            console.log(prestaciones)
            if(prestaciones){
                agregarAutocompletadoPrestacion(palabra, prestaciones, autocompletadoPrestacion, inputPrestaciones)
            }
        })
    }else{
        inputPrestaciones.placeholder = "No existen prestaciones";
    }
    configurarBotonCrearPrestacion(res.data.prestaciones);
})
.catch(error => console.log(error));

    //SECCION LLENADO DE PRESCRIPCIONES ANTERIORES DE X PACIENTE
let areaPrescripcionesAnteriores = document.querySelector("#prescripcionesAnterioresPaciente");
let selectPacientes = document.querySelector("#selectPacientes");
//Lógica para que cuando cambien de paciente aparezcan las prescripciones anteriores de dicho paciente
selectPacientes.addEventListener("change", (event) => {
    let idPaciente = event.target.value;
    let nombrePaciente = document.getElementById("selectPacientes");
    nombrePaciente = nombrePaciente.options[nombrePaciente.options.selectedIndex].textContent.split(",")[0];
    axios(`http://localhost:3000/prescribir/${idPaciente}`)
    .then(res => {
        borrarAutocompletadoAnterior(areaPrescripcionesAnteriores);
        let pTitulo = document.createElement("p");
        const prescripcionesAnteriores = res.data;
        pTitulo.className = "tituloPrescripcionesAnteriores";
        let pPresAnte = document.createElement("p");
        pTitulo.innerHTML ="Prescripciones anteriores "+nombrePaciente;
        if(prescripcionesAnteriores[0].length === 0 && prescripcionesAnteriores[1].length === 0){
            pPresAnte.innerHTML = "No existen prescripciones anteriores.";
        }else{
            pPresAnte.className = "pPrescripcionesAnteriores";
            pPresAnte.appendChild(listadoDePrescripcionesAnteriores(prescripcionesAnteriores));
        }
        areaPrescripcionesAnteriores.appendChild(pTitulo);
        areaPrescripcionesAnteriores.appendChild(pPresAnte);
    })
    .catch(error => console.log(`Error al buscar prescripciones anteriores: ${error}`));
})

//VALIDAMOS EL BOTON PRESCRIBIR
botonPrescribir.addEventListener("click", (event) => {
    event.preventDefault();
    let diagnostico = document.querySelector(".textAreaDiagnostico");
    let diagnosticoOK = diagnostico.value && diagnostico.value.length > 10;
    let vigencia = document.querySelector(".radioDivVigencia:checked").value;
    // let idMedico = document.querySelector("#selectMedicos").value;
    let idPaciente = document.querySelector("#selectPacientes").value;
    let medicamentos = document.querySelectorAll(".idMedicamentoDetalleHidden");
    let medicamentosOk = false;
    let dosisIntervaloDuracion = true;
    let prestaciones = document.querySelectorAll(".idPrestacionHidden");
    let prestacionesOK = false;

    //validamos que los medicamentos esten llenos
    for(let i = 0; i < medicamentos.length; i++){
        if(!medicamentos[i].value){
            medicamentosOk = false;
            break;
        }else{
            medicamentosOk = true;
        }
    }

    let dosisM;
    let intervalos;
    let duraciones;
    if(medicamentosOk){ // si hay medicamentos entonces validamos que los campos dosis, intervalo y duracion esten llenos...
        dosisM = document.querySelectorAll(".dosis");
        intervalos = document.querySelectorAll(".intervalo");
        duraciones = document.querySelectorAll(".duracion");
        for(let i = 0; i < dosisM.length; i++){
            if(!dosisM[i].value)mensajeLlenarEspacioMedicamentoYPrestaciones(dosisM[i],"Campos necesarios"),dosisIntervaloDuracion=false;
            if(!intervalos[i].value)mensajeLlenarEspacioMedicamentoYPrestaciones(intervalos[i], "Campos necesarios"),dosisIntervaloDuracion=false;
            if(!duraciones[i].value)mensajeLlenarEspacioMedicamentoYPrestaciones(duraciones[i], "Campos necesarios"),dosisIntervaloDuracion=false;
        }
    }
    // validamos las prestaciones
    for(let i = 0; i < prestaciones.length; i++){
        if(!prestaciones[i].value){
            prestacionesOK = false;
        }else{
            prestacionesOK = true;
        }
    }

    //si no hay al menos un medicamento o al menos una prestacion pintamos de rojo los inputs
    if(!prestacionesOK && !medicamentosOk){
        for(let i = 0; i < medicamentos.length; i++){
            if(i === 0){
                mensajeLlenarEspacioMedicamentoYPrestaciones(medicamentos[i].previousElementSibling);
            }else{
                mensajeLlenarEspacioMedicamentoYPrestaciones(medicamentos[i].previousElementSibling.firstElementChild);
            }
        }
        for(let i = 0; i < prestaciones.length; i++){
            if(i === 0){
                mensajeLlenarEspacioMedicamentoYPrestaciones(prestaciones[i].previousElementSibling);
            }else{
                mensajeLlenarEspacioMedicamentoYPrestaciones(prestaciones[i].previousElementSibling.firstElementChild);
            }
        }
    }
    
    //si no estan llenos los campos diagnosticos, el select de medico y el select de paciente los pintamos de rojo
    if(!diagnosticoOK)mensajeLlenarEspacioMedicamentoYPrestaciones(diagnostico);
    // if(!idMedico)mensajeLlenarEspacioMedicamentoYPrestaciones(document.querySelector("#selectMedicos"));
    if(!idPaciente)mensajeLlenarEspacioMedicamentoYPrestaciones(document.querySelector("#selectPacientes"));

    //si esta todo correcto para una prescripcion la creamos y lo mandamos al servidor mediante un POST
    if(diagnosticoOK && vigencia/* && idMedico */&& idPaciente && ((medicamentosOk && dosisIntervaloDuracion) || prestacionesOK)){  
        let idMedicamentoDetalle = [];
        let dosis = [];
        let intervalo = [];
        let duracion = [];
        let idPrestacion = [];
        if(medicamentosOk){
            medicamentos.forEach(e => idMedicamentoDetalle.push(e.value));
            dosisM.forEach(e => dosis.push(e.value));
            intervalos.forEach(e => intervalo.push(e.value));
            duraciones.forEach(e => duracion.push(e.value));
        }
        if(prestacionesOK){
            prestaciones.forEach(e => idPrestacion.push(e.value));
        }
        const prescripcion = {
            diagnostico:diagnostico.value, vigencia,/* idMedico, */idPaciente, idMedicamentoDetalle, dosis, intervalo, duracion, idPrestacion 
        }
        axios.post("http://localhost:3000/prescribir",prescripcion)
        .then((res) => {
            Swal.fire({
                icon: "success",
                title: "Prescripcion realizada correctamente",
                timer: 1500
            }).then(() => window.location.href = "/prescribir");
        })
        .catch(error => console.log(error));
    }
})
