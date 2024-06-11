let listaPacientes = document.querySelector(".listaPacientes");
let inputBuscarPacientesByDNI = document.querySelector("#inputBuscarPacientesByDNI");
axios("http://localhost:3000/registrar/paciente/pacientes")
.then(res => {
    if(res.data.length > 0){
        llenarListaPacientes(res.data, listaPacientes);
    }else{
        listaPacientes.innerHTML = `<li>No existen pacientes</li>`;
    }
    inputBuscarPacientesByDNI.addEventListener("input", (event) => {
        borrarListaAnterior(listaPacientes);
        let dni = event.target.value;
        let pacientes = res.data.filter(e => e.documento.toString().startsWith(dni));
        llenarListaPacientes(pacientes, listaPacientes);
    })
})
.catch(error => console.log(error))

//borrarListaAnterior
const borrarListaAnterior = (elemento) => {
    while(elemento.hasChildNodes()){
        elemento.removeChild(elemento.firstChild);
    }
}


//funcion que llena la listaPacientes
const llenarListaPacientes = (pacientes, listaPacientes) => {
    if(pacientes.length > 0){
        for(let paciente of pacientes){
            let p = document.createElement("p");
            p.innerHTML = `${paciente.nombre} ${paciente.apellido} DNI: ${paciente.documento}`;
            let botonEditar = document.createElement("button");
            botonEditar.type = "button";
            botonEditar.className = "tooltip";
            botonEditar.id = paciente.documento;
            botonEditar.dataset.action = "editar";
            botonEditar.dataset.documento = paciente.documento;
            let botonBorrar = document.createElement("button");
            botonBorrar.type = "button";
            botonBorrar.className = "tooltip";
            botonBorrar.id = paciente.documento;
            botonBorrar.dataset.action = "borrar";
            botonBorrar.dataset.documento = paciente.documento;
            let editar = `<i class="fa-solid fa-pen-to-square"></i>
                          <p class="tooltiptext">Editar</p>`;
            let borrar = `<i class="fa-solid fa-trash-can" style="color: #f50000"></i>
                          <p class="tooltiptext">Borrar</p>`;
            botonEditar.innerHTML = editar;
            botonBorrar.innerHTML = borrar;
            // botonEditar.addEventListener("click", editarPaciente(paciente)); //probaremos de usar event delegation
            // botonBorrar.addEventListener("click", borrarPaciente(paciente.idPaciente)); 
            let li = document.createElement("li");
            li.appendChild(p);
            li.appendChild(botonEditar);
            li.appendChild(botonBorrar);
            listaPacientes.appendChild(li);
        }
    }else{
        listaPacientes.innerHTML = `<li>No existen pacientes</li>`;
    }
}

listaPacientes.addEventListener("click", (evento) => { //Un solo listener para todos los botones editar y borrar
    if(evento.target.closest("button")){
        const button = evento.target.closest('button');
        const action = button.dataset.action;
        const documento = button.dataset.documento;
        axios(`http://localhost:3000/registrar/paciente/pacientes/${documento}`)
        .then(res => {
            if(action === "editar"){
                editarPaciente(res.data);
            }else if(action === "borrar"){
                borrarPaciente(res.data.idPaciente);
            }
        })
        .catch(err => console.log(err));
    }
})

let inputNombre = document.querySelector("#nombre");
let inputApellido = document.querySelector("#apellido");
let inputDocumento = document.querySelector("#documento");
let inputFechaNacimiento = document.querySelector("#fechaNacimiento");
let selectSexo = document.querySelector("#selectSexo");

let botonCancelarUpdate = document.querySelector("#botonCancelarUpdate");
let botonGuardarUpdate = document.querySelector("#botonGuardarUpdate");
const editarPaciente = (paciente) => {
    // return () => {
        axios(`http://localhost:3000/registrar/paciente/${paciente.idPaciente}`)
        .then(res => {
            limpiarCampos();
            inputNombre.value = paciente.nombre; //insertamos el nombre
            inputApellido.value = paciente.apellido; //insertamos el apellido
            inputDocumento.value = paciente.documento; //insertamos el documento
            inputDocumento.dataset.documento = paciente.documento;
            const fechaNacimiento = new Date(paciente.fechaNacimiento);
            inputFechaNacimiento.value = fechaNacimiento.toLocaleDateString("sv-SE"); //insertamos la fecha
            for(let i = 0; i < selectSexo.options.length; i++){ 
                if(selectSexo.options[i].value === paciente.sexo){
                    selectSexo.options[i].selected = true; //insertamos el sexo
                    break;
                }
            }
            let plans = res.data.map(e => e.idPlan); //insertamos los planes
            for(let i = 0; i < planes.length; i++){
                if(plans.includes(parseInt(planes[i].value))){ //si el plan esta incluido en los planes del paciente, lo checkeamos 
                    planes[i].checked = true;
                    let idPlan = planes[i].value;
                    // buscamos las obras sociales relacionadas para mostrarlas en el campo Obra Social
                    axios.post(`http://localhost:3000/registrar/paciente/obrasSociales`, {idPlan})
                    .then(res => {
                        mostrarObrasSocialesDependiendoElPlan(res.data)
                    }).catch(error => console.log(error));  
                }
            }
            habilitarBotonesEdicion();
            // botonGuardarUpdate.addEventListener("click", updatePaciente(paciente.idPaciente)); //si toca update guardamos el update
            // botonCancelarUpdate.addEventListener("click", cancelarUpdate); //si toca cancelar limpiamos los campos
            deshabilitarBotonRegistrar();
        })
        .catch(error => console.log(error));
    // }
}

let botones = document.querySelector(".divBotones");
botones.addEventListener("click", (evento) => { // un solo listener para los botones guardar y cancelar editar
    let documento = inputDocumento.dataset.documento;
    let valor = evento.target.value;
    if(valor === "Guardar Cambios" || valor === "Cancelar"){
        axios(`http://localhost:3000/registrar/paciente/pacientes/${documento}`)
        .then(res => {
            if(valor === "Guardar Cambios"){
                updatePaciente(res.data.idPaciente);
            }else if(valor === "Cancelar"){
                cancelarUpdate();
            }
        })
    }
})

const cancelarUpdate = () => {
    habilitarBotonRegistrar();
    deshabilitarBotonesEdicion();
    limpiarCampos();
}
const updatePaciente = (idPaciente) => {
        planesElegidos = [];
        let todoCorrecto = verificarCampos();
        if(todoCorrecto){
            let paciente = {idPaciente, nombre:inputNombre.value, apellido: inputApellido.value, documento: inputDocumento.value,
                fechaNacimiento:inputFechaNacimiento.value, sexo: selectSexo.value, planes: planesElegidos
            }
            axios.put("http://localhost:3000/registrar/paciente", paciente)
            .then(res => {
                if(res.data.ok){
                    Swal.fire({
                        icon: "success",
                        title: "Paciente editado correctamente",
                        timer: 1500
                    }).then(() => {
                        window.location.href = "/registrar/paciente";
                    })
                }else{
                    Swal.fire({
                        icon: "warning",
                        title: "No hay campos para modificar...",
                        timer: 1500
                    });
                }
            })
            .catch(error => {
                console.log(error);
                if (error.response.status == 400 && error.response.data.duplicado) {
                    Swal.fire({
                        icon: "error",
                        title: "Ese documento ya existe",
                        timer: 1500
                    });
                }else {
                    Swal.fire({
                        icon: "error",
                        title: "Ocurrió un error al editar el paciente.",
                        timer: 1500
                    }).then(() => window.location.href = "/registrar/paciente");
                }
            });
        }else{
            Swal.fire({
                icon: "warning",
                title: "LOS CAMPOS NO PUEDEN ESTAR VACÍOS",
                timer: 1500
            });
        }
}

const habilitarBotonesEdicion = () => {
    botonCancelarUpdate.style.display = "inline-block";
    botonGuardarUpdate.style.display = "inline-block";
}
const deshabilitarBotonesEdicion = () => {
    botonCancelarUpdate.style.display = "none";
    botonGuardarUpdate.style.display = "none";
}
const deshabilitarBotonRegistrar = () => {
    botonRegistrarPaciente.style.display = "none";
}
const habilitarBotonRegistrar = () => {
    botonRegistrarPaciente.style.display = "inline-block";
}
const borrarPaciente = (idPaciente) => {
    // return () => {
        axios.put("http://localhost:3000/registrar/paciente/pacientes", {idPaciente})
        .then(res => {
            if(res.data.ok){
                Swal.fire({
                    icon: "success",
                    title: "PACIENTE ELIMINADO CORRECTAMENTE",
                    timer: 1500
                }).then(() => window.location.href = "/registrar/paciente");
            }else{
                Swal.fire({
                    icon: "success",
                    title: "ERROR AL ELIMINAR EL PACIENTE",
                    timer: 1500
                }).then(() => window.location.href = "/registrar/paciente");
            }
        })
        .catch(error => console.log(error));
    // }
}
    
const limpiarCampos = () => {
    inputNombre.value = "";
    inputApellido.value = "";
    inputDocumento.value = "";
    inputFechaNacimiento.value = "";
    selectSexo.childNodes[0].selected = true;
    planes.forEach(e => e.cheked?e.checked = false:e.checked=false);
    while(ulObraSocial.hasChildNodes()){
        ulObraSocial.removeChild(ulObraSocial.firstChild);
    }
    idOS = [];
}

//------------------------------- SECCION SELECT ESPECIALIDADES -------------------------------//
let checkboxPlan = document.querySelector(".checkboxPlan");
let selectPlan = document.querySelector(".selectPlan");
let estaExpandida = false;
let ulObraSocial = document.querySelector("#obraSocial");
selectPlan.addEventListener("click", () => {
    if(!estaExpandida){
        checkboxPlan.style.display = "block";
        checkboxPlan.style.position = "absolute";
        checkboxPlan.style.width = "230px";
        estaExpandida = true;
    }else{
        checkboxPlan.style.display = "none";
        estaExpandida = false;
    }
})

// Lógica para mosrtar las obras sociales dependiendo el plan seleccionado
const mostrarObrasSocialesDependiendoElPlan = (obraSocial) => {
    if(!idOS.includes(obraSocial.idObraSocial)){ // antes de crear un li, nos aseguramos de que no haya uno
        let li = document.createElement("li");
        li.innerHTML = obraSocial.nombre;
        li.id = `os${obraSocial.idObraSocial}`;
        ulObraSocial.appendChild(li);
    }
    idOS.push(obraSocial.idObraSocial); //agregamos el id al arreglo de ids
}
const sacarObraSocialDelPlan = (obraSocial) => {
    let elemento = idOS.indexOf(obraSocial.idObraSocial);
    idOS.splice(elemento, 1); //lo eliminamos del arreglo de ids
    if(!idOS.includes(obraSocial.idObraSocial)){ //verificamos. Si no existe en el arreglo, eliminamos el li
        let liAEliminar = document.querySelector(`#os${obraSocial.idObraSocial}`);
        liAEliminar.remove();
    }
}
let planes = document.querySelectorAll(".planes");
let idOS = [];
checkboxPlan.addEventListener("change", (event) => {
    let idPlan = event.target.id;
    axios.post(`http://localhost:3000/registrar/paciente/obrasSociales`, {idPlan})
    .then(res => {
        if(event.target.checked){
            mostrarObrasSocialesDependiendoElPlan(res.data);
        }else{
            sacarObraSocialDelPlan(res.data);
        }
    }).catch(error => console.log(error));
    checkboxPlan.style.display = "none";
    estaExpandida = false;
})

//------------------------------- SECCION BOTON REGISTRAR PACIENTE -------------------------------//
let botonRegistrarPaciente = document.querySelector("#botonRegistrarPaciente");
botonRegistrarPaciente.addEventListener("click", () => {
    let todoCorrecto = verificarCampos();
    if(todoCorrecto){
        let paciente = {nombre:inputNombre.value, apellido: inputApellido.value, documento: inputDocumento.value,
            fechaNacimiento:inputFechaNacimiento.value, sexo: selectSexo.value, planes: planesElegidos
        }
        axios.post("http://localhost:3000/registrar/paciente", paciente)
        .then(res => {
            if(res.data.ok){
                Swal.fire({
                    icon: "success",
                    title: "Paciente Registrado Correctamente",
                    timer: 1500
                }).then(() => window.location.href = "/registrar/paciente");
            }else{
                Swal.fire({
                    icon: "error",
                    title: "Error al registrar al paciente",
                    timer: 1500
                }).then(() => window.location.href = "/registrar/paciente");
            }
        })
        .catch(error => console.log(error));
    }else{
        Swal.fire({
            icon: "error",
            title: "DEBE LLENAR TODOS LOS CAMPOS",
            timer: 1500
        });
    }
})

let planesElegidos = [];
const verificarCampos = () => {
    let todoCorrecto = true;
    planes.forEach(e => {
        if(e.checked){
            planesElegidos.push(e.value);
        }
    })
    // VERIFICACIONESSSS
    if(!inputNombre.value || inputNombre.value === " "){marcarConRojo(inputNombre);todoCorrecto=false}
    if(!inputApellido.value || inputApellido.value === " "){marcarConRojo(inputApellido);todoCorrecto=false}
    if(!inputDocumento.value){marcarConRojo(inputDocumento);todoCorrecto=false}
    if(!inputFechaNacimiento.value){marcarConRojo(inputFechaNacimiento);todoCorrecto=false}
    if(!selectSexo.value){marcarConRojo(selectSexo);todoCorrecto=false}
    if(planesElegidos.length < 1){marcarConRojo(document.querySelector("#selectPlan"));todoCorrecto=false}
    return todoCorrecto;
}
const marcarConRojo = (elemento) => {
    elemento.style.border = "3px solid red";
    setTimeout(() => {
        elemento.style.border = "1px solid #9a9a9a";
    }, 2000);
}

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
    if(evento.target.value !== numerosValidos){ //verificamos que sólo ingresen numeros en el campo dni
        evento.target.value = numerosValidos;
    }
    if(evento.target.value.length > 8){ //verificamos que sólo ingresen 8 numeros
        evento.target.value = evento.target.value.slice(0,8);
    }   
}
inputNombre.addEventListener("input", verificarSoloString);
inputApellido.addEventListener("input", verificarSoloString);
inputDocumento.addEventListener("input", verificarSoloNumero);
