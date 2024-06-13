//------------------------------- SECCIÓN MEDICOS REGISTRADOS -------------------------------//   
let profesionales = document.querySelector(".profesionales");
let inputBuscarProfesionalesByDNI = document.querySelector("#inputBuscarProfesionalesByDNI");
let inputBuscarProfesionalesByREFEPS = document.querySelector("#inputBuscarProfesionalesByREFEPS");
axios("http://localhost:3000/registrar/medico/profesionales")
.then(res => {
    let medicosOrdenadosPorEstado = res.data.sort((a, b) => b.estado - a.estado); //ordenamos los activos primero...
    llenarListaMedicos(medicosOrdenadosPorEstado);
    inputBuscarProfesionalesByDNI.addEventListener("input", (evento) => {
            let palabra = evento.target.value;
            let medicos = res.data;
            medicos = medicos.filter(e => e.documento.toString().startsWith(palabra));  
            medicos = medicos.sort((a, b) => b.estado - a.estado); //ordenamos los activos primero...
            llenarListaMedicos(medicos);
    })
    inputBuscarProfesionalesByREFEPS.addEventListener("input", (evento) => {
        let palabra = evento.target.value;
        let medicos = res.data;
        medicos = medicos.filter(e => e.idRefeps.toString().startsWith(palabra));
        medicos = medicos.sort((a, b) => b.estado - a.estado);
        llenarListaMedicos(medicos);
    });
})
.catch(error => console.log(error));

//------------------------------- SECCION VERIFICACION CAMPOS ------------------------------//
let inputNombre = document.querySelector("#nombre");
let inputApellido = document.querySelector("#apellido");
let inputDocumento = document.querySelector("#documento");
let inputDomicilio = document.querySelector("#domicilio");
let inputMatricula = document.querySelector("#matricula");
let inputRefeps = document.querySelector("#idRefeps");

const verificarSoloString = (evento) => {
    let letrasValidas = evento.target.value.replace(/[^a-zA-Z\s]+/g, ''); // Limitamos a sólo letras y espacios
    letrasValidas = letrasValidas.replace(/\s{2,}/g, ' '); // Eliminamos si hay dos espacios seguidos o más    
    if(evento.target.value !== letrasValidas){
        evento.target.value = letrasValidas;
    }
    if(evento.target.value.length > 40){ //Limitamos la longitud del input...
        evento.target.value = evento.target.value.slice(0, 50);
    }
}

const verificarSoloNumero = (evento) => { 
    const numerosValidos = evento.target.value.replace(/[^0-9]/g, "");
    if(evento.target.value !== numerosValidos){ //verificamos que sólo ingresen numeros en los campos dni e idRefeps
        evento.target.value = numerosValidos;
    }
    if(evento.target.value.length > 8){ //verificamos que sólo ingresen 8 numeros
        evento.target.value = evento.target.value.slice(0,8);
    }   
}

const verificarSoloLetrasYNumeros = (evento) => { 
    const letrasValidas = evento.target.value.replace(/[^0-9a-zA-Z\s]/g, "");
    if(evento.target.value !== letrasValidas){
        evento.target.value = letrasValidas;
    }
}

inputNombre.addEventListener("input", verificarSoloString);
inputApellido.addEventListener("input", verificarSoloString);
inputRefeps.addEventListener("input", verificarSoloNumero);
inputDocumento.addEventListener("input", verificarSoloNumero);
inputDomicilio.addEventListener("input", verificarSoloLetrasYNumeros);

inputMatricula.addEventListener("input", (evento) => {
    const letrasValidas = evento.target.value.replace(/[^0-9a-zA-Z]/g, "");//vericamos que en matricula solo haya letras y numeros
    if(evento.target.value !== letrasValidas){
        evento.target.value = letrasValidas;
    }
    if(evento.target.value.length > 10){ //verificamos longitud matricula
        evento.target.value = evento.target.value.slice(0,10);
    }
})


//------------------------------- SECCION USUARIO Y PASSWORD -------------------------------//
let inputUsuario = document.querySelector("#usuario");
let inputPassword = document.querySelector("#password");
inputDocumento.addEventListener("input", (evento) => { //mientras ingresa su documento llenamos los campos usuario y password...
    inputUsuario.value = evento.target.value;
    inputPassword.value = evento.target.value;
})


//------------------------------- SECCION SELECT ESPECIALIDADES -------------------------------//
let checkBoxEspecialidad = document.querySelector(".checkBoxEspecialidad");
let selectEspecialidad = document.querySelector(".selectEspecialidad");
let estaExpandida = false;
selectEspecialidad.addEventListener("click", () => {
    if(!estaExpandida){
        checkBoxEspecialidad.style.display = "block";
        checkBoxEspecialidad.style.position = "absolute";
        checkBoxEspecialidad.style.width = "230px";
        estaExpandida = true;
    }else{
        checkBoxEspecialidad.style.display = "none";
        estaExpandida = false;
    }
})


//------------------------------- SECCION BOTONES EDITAR, BORRAR Y DAR DE ALTA MEDICO -------------------------------//
let listaMedicos = document.querySelector(".listaMedicos");
const llenarListaMedicos = (medicos) => {
    listaMedicos.innerHTML = "";
    if(medicos.length > 0){
        for(let med of medicos){
            let li = document.createElement("li");
            let p = document.createElement("p");
            p.innerHTML = `${med.nombre} ${med.apellido}, DNI: ${med.documento}, Matricula: ${med.matricula}, REFEPS: ${med.idRefeps}`;
            li.appendChild(p);
            const botonDarDeAlta = document.createElement("button");
            const borrar = document.createElement("button");
            const editar = document.createElement("button");
            console.log(medicos);
            if(med.estado === 0){
                p.className = "medicamentoBorrado";
                botonDarDeAlta.type = "button";
                botonDarDeAlta.className = "tooltip";
                botonDarDeAlta.id = med.documento;
                botonDarDeAlta.dataset.action = "darDeAlta";
                botonDarDeAlta.dataset.idMedico = med.idMedico;
                let darDeAlta = `<i class="fa-solid fa-circle-arrow-up" style="color: #00db25;"></i>
                <p class="tooltiptext">Dar de alta</p>`;
                botonDarDeAlta.innerHTML = darDeAlta;
                li.appendChild(botonDarDeAlta);
            }else{
                p.className = "medicamentoVigente";
                editar.type="button";
                editar.className="tooltip";
                editar.id = med.documento;
                editar.dataset.action = "editar";
                editar.dataset.idMedico = med.idMedico;
                editar.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>
                                    <p class="tooltiptext">Editar</p>`;                         
                borrar.type="button";
                borrar.className="tooltip";
                borrar.id = med.documento;
                borrar.dataset.action = "borrar";
                borrar.dataset.idMedico = med.idMedico;
                borrar.innerHTML = `<i class="fa-solid fa-trash-can" style="color: #f50000;"></i>
                                    <p class="tooltiptext">Borrar</p>`;
                li.appendChild(editar);
                li.appendChild(borrar);
            }
            listaMedicos.appendChild(li);
        }
    }else{
        let li = document.createElement("li");
        li.innerHTML = "NO EXISTEN MÉDICOS CON ESAS CARACTERÍSTICAS";
        listaMedicos.appendChild(li);
    }
}

//SECCIÓN ESCUCHADORES DE EVENTOS BOTONES EDITAR, BORRAR, ACTIVAR
listaMedicos.addEventListener("click", (evento) => {
    if(evento.target.closest("button")){
        let boton = evento.target.closest("button");
        let action = boton.dataset.action;
        let idMedico = boton.dataset.idMedico;
        if(action === "darDeAlta"){
            darDeAltaMedico(idMedico);
        }else if(action === "borrar"){
            borrarMedico(idMedico);
        }else if(action === "editar"){
            editarMedico(idMedico);
        }
    }
})

const darDeAltaMedico = (idMedico) => {
    if(idMedico){
        axios.put("http://localhost:3000/registrar/medico/darDeAltaMedico",{idMedico})
        .then(() => {
            mostrarMensaje("success", "MEDICAMENTO DADO DE ALTA CORRECTAMENTE", 1500, "/registrar/medico");
        })
        .catch(error => {
            mostrarMensaje("error", "ERROR AL DAR DE ALTA AL MEDICAMENTO", 1500, "/registrar/medico");
        })
    }
}
const borrarMedico = (idMedico) => {
    axios.put("http://localhost:3000/registrar/medico/borrado", {idMedico})
    .then(res => {
        if(res.data.ok){
            mostrarMensaje("success", "Médico borrado correctamente", 1000, "/registrar/medico");
        }else{
            mostrarMensaje("error", "Ocurrió un error al borrar al profesional");
        }
    })
    .catch(error => console.log(error));
}
const editarMedico = (idMedico) => {
    limpiarInputs();
    llenarInputsConProfesional(idMedico);
    habilitarBotonesEdicion();
}

//FUNCIONES HABILITAR Y DESHABILITAR BOTONES EN EDICION
let botonGuardarEdicion = document.querySelector("#botonGuardarUpdate"); 
let botonCancelarEdicion = document.querySelector("#botonCancelarUpdate");
const habilitarBotonesEdicion = () => {
    botonGuardarEdicion.style.display = "inline-block";
    botonCancelarEdicion.style.display = "inline-block";
    botonRegistrarMedico.style.display = "none";
}

const deshabilitarBotonesEdicion = () => {  
    botonGuardarEdicion.style.display = "none";
    botonCancelarEdicion.style.display = "none";
    botonRegistrarMedico.style.display = "inline-block";
}

//FUNCIONES CANCELAR EDICION, REGISTRAR MEDICAMENTO Y GUARDAR EDICION
const guardarEdicion = () => {
    const medico = validacionAlRegistrar();
    axios.put("http://localhost:3000/registrar/medico/update", medico)
    .then(res => {
        if(res.data.ok){
            mostrarMensaje("success", "Cambios guardados correctamente", 1500, "/registrar/medico");
        }else{
            mostrarMensaje("error", "Ocurrión un error al editar al profesional");
        }
    })
    .catch(error => console.log(error));
}
botonGuardarEdicion.addEventListener("click", guardarEdicion);

const cancelarEdicion = () => {
    deshabilitarBotonesEdicion();
    limpiarInputs();
}
botonCancelarEdicion.addEventListener("click", cancelarEdicion);
    
let botonRegistrarMedico = document.querySelector("#botonRegistrarMedico");
let profesion = document.querySelector("#idProfesion");
let especialidades = document.querySelectorAll(".especialidades"); 
let idEspecialidad = []; //donde guardaremos todas las especialidades seleccioanadas...
botonRegistrarMedico.addEventListener("click", () => {
    let hayEspecialidades = false;
    especialidades.forEach(e => {
        if(e.checked){
            hayEspecialidades = true;
            idEspecialidad.push(e.value);
        }
    });
    let sePuedeRegistrar = true;
    if(!hayEspecialidades){ bordeRojo(document.querySelector(".selectEsp")); sePuedeRegistrar = false}
    if(!inputNombre.value){ bordeRojo(inputNombre);sePuedeRegistrar = false;};
    if(!inputApellido.value){bordeRojo(inputApellido); sePuedeRegistrar = false};
    if(!inputDocumento.value){bordeRojo(inputDocumento); sePuedeRegistrar = false};
    if(!profesion.value){bordeRojo(profesion); sePuedeRegistrar = false};
    if(!inputDomicilio.value){bordeRojo(inputDomicilio); sePuedeRegistrar = false};
    if(!inputMatricula.value){bordeRojo(inputMatricula); sePuedeRegistrar = false};
    if(!inputRefeps.value){bordeRojo(inputRefeps); sePuedeRegistrar = false};
    if(sePuedeRegistrar){
        let registro = {nombre:inputNombre.value, apellido:inputApellido.value, documento:inputDocumento.value, profesion: profesion.value, especialidad:idEspecialidad,domicilio:inputDomicilio.value,matricula:inputMatricula.value,refeps:inputRefeps.value};
        axios.post("/registrar/medico", registro)
        .then(res => {
            if(res.data.ok){
                mostrarMensaje("success", "Médico Registrado Correctamente", 1500, "/registrar/medico");
            }else{
                mostrarMensaje("error", "Ocurrió un error al registrar al profesional");
                limpiarInputs();
            }
        })
        .catch(error => console.log(error));
    }
})

const llenarInputsConProfesional = (idMedico) => {
    axios(`http://localhost:3000/registrar/medico/medicos/${idMedico}`)
    .then(respuesta => {
        const medico = respuesta.data;
        if(idMedico){
            axios(`http://localhost:3000/registrar/medico/${idMedico}`)
            .then(res => {
                let espes = []
                for(let e of res.data){
                    espes.push(e.idEspecialidad);
                }
                for(let i = 0; i < espes.length; i++){ // nos fijamos que especialidades tiene el medico a editar
                    for(let j = 0; j < especialidades.length; j++){
                        if(especialidades[j].value == espes[i]){
                            especialidades[j].checked = true;
                        }
                    }
                }
                for(let i = 0; i < profesion.options.length; i++){ //nos fijamos que profesiones tiene el medico a editar
                    if(profesion.options[i].value == medico.idProfesion){
                        profesion.options[i].selected = true;
                        break;
                    }
                }
                inputNombre.value = medico.nombre;
                inputApellido.value = medico.apellido;
                inputDocumento.value = medico.documento;
                inputDomicilio.value = medico.domicilio;
                inputMatricula.value = medico.matricula;
                inputRefeps.value = medico.idRefeps;
                inputUsuario.value = medico.documento;
                inputPassword.value = medico.documento;
                //le ponemos el idMedico al botonguardar
                botonGuardarEdicion.setAttribute("data-value", medico.idMedico);
            })
            .catch(error => console.log(error))
        }else{
            mostrarMensaje("warning", "OCURRIO UN ERROR AL ENCONTRAR AL MÉDICO CON EL ID "+idMedico, 2000)
        }
    })
}

const validacionAlRegistrar = () => {
        let especialidadesSeleccionadas = [];
        for(let i = 0; i < especialidades.length; i++){
            if(especialidades[i].checked){
                especialidadesSeleccionadas.push(especialidades[i].value);
            }
        }
        const medico = {
            idMedico: botonGuardarEdicion.getAttribute("data-value"),
            nombre: inputNombre.value, 
            apellido: inputApellido.value,
            domicilio: inputDomicilio.value,
            profesion: profesion.value,
            especialidad: especialidadesSeleccionadas,
            documento: inputDocumento.value,
            matricula: inputMatricula.value,
            refeps: inputRefeps.value
        }
        return medico;
}

const limpiarInputs = () => {
    inputNombre.value = "";
    inputApellido.value = "";
    inputDocumento.value = "";
    inputDomicilio.value = "";
    inputMatricula.value = "";
    inputRefeps.value = "";
    inputUsuario.value = "";
    inputPassword.value = "";
    for(let i = 0; i < especialidades.length; i++){
        especialidades[i].checked = false;
    }
    if(profesion.options.length > 0){
        profesion.options[0].selected = true;
    }
    //sacamos el idMedicamentoDetalle al botonguardar
    botonGuardarEdicion.removeAttribute("data-value");
}

//MOSTRAR MENSAJE ESTILO SWEET ALERT Y MARCAR CON ROJO BORDES
const mostrarMensaje = (icono, mensaje, timer, url) => {
    Swal.fire({
        icon: icono,
        title: mensaje,
        timer: timer || 0
    }).then(() => {
        if(url){
            window.location.href = url;
        }
    })
}
const bordeRojo = (elemento) => {
    elemento.style.border = "2px solid red";
    setTimeout(() => {
        elemento.style.border = "1px solid #9a9a9a";
    }, 1500);
}
