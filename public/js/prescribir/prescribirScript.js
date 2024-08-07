import {listadoDePrescripcionesAnteriores, mensajeLlenarEspacioMedicamentoYPrestaciones } from "./prescribirFunciones.js";

//SECCION AUTOCOMPLETADOS DE MEDICAMENTOS Y PRESTACIONES
let inputMedicamentos  = document.querySelector("#inputMedicamentoPrescripcion");

let inputPrestaciones = document.querySelector("#inputPrestacionPrescripcion");

let botonPrescribir = document.querySelector("#botonPrescribir"); //Boton cargar prescripción

axios('http://localhost:3000/prescribir?query=medicamentos')
.then(res => {
    if(res.data.medicamentos.length > 0){
        let medicamentos = res.data.medicamentos;
        medicamentos = medicamentos.map(e => {
                        const id = e.id;
                        const nombre = `${e.nombreGenerico} ${e.cantidadConcentracion}${e.unidadMedidaCon} ${e.forma} x${e.cantidadPresentacion}${e.unidadMedidaPres}`;
                        return {id, nombre};
                    });
    }else{
        inputMedicamentos.placeholder = "No existen medicamentos";
    }
    if(res.data.prestaciones.length > 0){
        let prestaciones = res.data.prestaciones;
        prestaciones = prestaciones.map(e => {
            const id = e.idPrestacion;
            const nombre = e.nombrePrestacion;
            return {id, nombre};
        })
    }else{
        inputPrestaciones.placeholder = "No existen prestaciones";
    }
})
.catch(error => console.log(error));

    //SECCION LLENADO DE PRESCRIPCIONES ANTERIORES DE X PACIENTE
let areaPrescripcionesAnteriores = document.querySelector("#prescripcionesAnterioresPaciente");
let selectPacientes = document.querySelector("#selectPacientes");
//Lógica para que cuando cambien de paciente aparezcan las prescripciones anteriores de dicho paciente
let inputHiddenPacientes = document.querySelector("#inputHiddenPacientes");
let opcionesDataListPacientes = document.querySelectorAll("#dataListPacientes option")
selectPacientes.addEventListener("input", (evento) => {
    let palabra = evento.target.value;
    let esta = false;
    for(let odlp of opcionesDataListPacientes){
        if(odlp.value == palabra){
            selectPacientes.style.border = "1px solid #9a9a9a";
            inputHiddenPacientes.value = odlp.value;
            inputHiddenPacientes.setAttribute("data-value", odlp.getAttribute("data-value"));
            esta = true;
            let idPaciente = odlp.getAttribute("data-value");
            let nombrePaciente = odlp.value;
            llenarPrespripcionesAnteriores(idPaciente, nombrePaciente);
            break;
        }
    }
    if(!esta){
        selectPacientes.style.border = "1px solid red";
        inputHiddenPacientes.value = "";
        inputHiddenPacientes.removeAttribute("data-value");
        areaPrescripcionesAnteriores.innerHTML = "";
        // borrarAutocompletadoAnterior(areaPrescripcionesAnteriores);
    }
})
const llenarPrespripcionesAnteriores = (idPaciente , nombrePaciente) => {
    axios(`http://localhost:3000/prescribir/${idPaciente}`)
    .then(res => {
        console.log(res.data);
        areaPrescripcionesAnteriores.innerHTML = "";
        let pTitulo = document.createElement("p");
        const prescripcionesAnteriores = res.data;
        pTitulo.className = "tituloPrescripcionesAnteriores";
        let pPresAnte = document.createElement("p");
        pTitulo.innerHTML ="Prescripciones anteriores "+nombrePaciente;
        if(prescripcionesAnteriores[0].length === 0 && prescripcionesAnteriores[1].length === 0){
            pPresAnte.innerHTML = "No existen prescripciones anteriores.";
        }else{
            pPresAnte.className = "pPrescripcionesAnteriores";
            pPresAnte.appendChild(listadoDePrescripcionesAnteriores(prescripcionesAnteriores, idPaciente));
        }
        areaPrescripcionesAnteriores.appendChild(pTitulo);
        areaPrescripcionesAnteriores.appendChild(pPresAnte);
    })
    .catch(error => console.log(`Error al buscar prescripciones anteriores: ${error}`));
}

//VALIDAMOS EL BOTON PRESCRIBIR
botonPrescribir.addEventListener("click", (event) => {
    event.preventDefault();
    let diagnostico = document.querySelector(".textAreaDiagnostico");
    let diagnosticoOK = diagnostico.value && diagnostico.value.length < 100;
    let vigencia = document.querySelector(".radioDivVigencia:checked").value;
    // let idMedico = document.querySelector("#selectMedicos").value;
    let idPaciente = document.querySelector("#selectPacientes").value;
    let idPacienteHidden = document.querySelector("#inputHiddenPacientes").value;
    let idPacienteOk = idPaciente == idPacienteHidden;
    let medicamentos = document.querySelectorAll(".idMedicamentoDetalleHidden");
    let medicamentosOk = false;
    let dosisIntervaloDuracion = true;
    let prestaciones = document.querySelectorAll(".idPrestacionHidden");
    let justificaciones = document.querySelectorAll(".justificacionPrestacion");
    let indicaciones = document.querySelectorAll(".indicacionPrestacion");
    let checkbox = document.querySelectorAll(".checkBoxEspecialidad");
    let sides = []; 
    checkbox.forEach(e => {
        let lado = e.querySelectorAll(".especialidades");
        let side = [];
        lado.forEach(l => {
            if(l.checked){
                side.push(l.getAttribute("data-value"));
            }
        })
        sides.push(side);
    })
    let prestacionesOK = false;
    let indicacionesOk;
    let justificacionesOk;

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
    }else{
        dosisIntervaloDuracion=false;
    }
    // validamos las prestaciones
    for(let i = 0; i < prestaciones.length; i++){
        if(!prestaciones[i].value){
            prestacionesOK = false;
        }else{
            prestacionesOK = true;
        }
    }
    if(prestacionesOK){
        let todosOkJustificaciones = true;
        for(let i = 0; i < justificaciones.length;  i++){
            if(justificaciones[i].value === ""){
                todosOkJustificaciones = false;
                mensajeLlenarEspacioMedicamentoYPrestaciones(justificaciones[i], "Campo necesario", "red");
            }
        }
        justificacionesOk = todosOkJustificaciones;
        let todosOkIndicaciones = true;
        for(let i = 0; i < indicaciones.length;  i++){
            if(indicaciones[i].value === ""){
                todosOkIndicaciones = false;
                mensajeLlenarEspacioMedicamentoYPrestaciones(indicaciones[i], "Campo necesario", "red");
            }
        }
        indicacionesOk = todosOkIndicaciones;
    }else{
        justificacionesOk = false;
        indicacionesOk = false;
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
    if(!idPacienteOk)mensajeLlenarEspacioMedicamentoYPrestaciones(document.querySelector("#selectPacientes"));
    let sePuedePrescribir = diagnosticoOK && vigencia && idPacienteOk && ((medicamentosOk && dosisIntervaloDuracion && prestacionesOK && justificacionesOk && indicacionesOk) || (medicamentosOk && dosisIntervaloDuracion && !(prestacionesOK || justificacionesOk || indicacionesOk) || (!(medicamentosOk || dosisIntervaloDuracion) && (prestacionesOK && justificacionesOk && indicacionesOk)))); 
    //si esta todo correcto para una prescripcion la creamos y lo mandamos al servidor mediante un POST
    for(let i = 0; i < medicamentos.length; i++){
        if(i === 0){
            if(!medicamentos[i].value && medicamentos[i].previousElementSibling.value !== ""){
                mensajeLlenarEspacioMedicamentoYPrestaciones(medicamentos[i].previousElementSibling);
                sePuedePrescribir = false;
            }
        }else{
            if(!medicamentos[i].value && medicamentos[i].previousElementSibling.firstElementChild.value !== ""){
                mensajeLlenarEspacioMedicamentoYPrestaciones(medicamentos[i].previousElementSibling.firstElementChild);
                sePuedePrescribir = false;
            }
        }
    }
    for(let i = 0; i < prestaciones.length; i++){
        if(i === 0){
            if(!prestaciones[i].value && prestaciones[i].previousElementSibling.value !== ""){
                mensajeLlenarEspacioMedicamentoYPrestaciones(prestaciones[i].previousElementSibling);
                sePuedePrescribir = false;
            }
        }else{
            if(!prestaciones[i].value && prestaciones[i].previousElementSibling.firstElementChild.value !== ""){
                mensajeLlenarEspacioMedicamentoYPrestaciones(prestaciones[i].previousElementSibling.firstElementChild);
                sePuedePrescribir = false;
            }
        }
    }
    if(sePuedePrescribir){  
        let idMedicamentoDetalle = [];
        let dosis = [];
        let intervalo = [];
        let duracion = [];
        let idPrestacion = [];
        let indicacion = [];
        let justificacion = [];
        let lados = [];
        if(medicamentosOk){
            medicamentos.forEach(e => idMedicamentoDetalle.push(e.value));
            dosisM.forEach(e => dosis.push(e.value));
            intervalos.forEach(e => intervalo.push(e.value));
            duraciones.forEach(e => duracion.push(e.value));
        }
        if(prestacionesOK){
            prestaciones.forEach(e => idPrestacion.push(e.value));
            justificaciones.forEach(e => justificacion.push(e.value));
            indicaciones.forEach(e => indicacion.push(e.value));
            lados = sides;
        }
        idPaciente = document.querySelector("#inputHiddenPacientes").getAttribute("data-value");
        const prescripcion = {
            diagnostico:diagnostico.value, vigencia,idPaciente, idMedicamentoDetalle, dosis, intervalo, duracion, idPrestacion, indicacion, justificacion, lados 
        }
        axios.post("http://localhost:3000/prescribir",prescripcion)
        .then((res) => {
            if(res.data.ok){
                Swal.fire({
                    icon: "success",
                    title: "Prescripcion realizada correctamente",
                    timer: 1500
                }).then(() => window.location.href = "/prescribir");
            }
        })
        .catch(error => console.log(error));
    }
})
