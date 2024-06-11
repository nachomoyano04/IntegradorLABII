//------------------------------- SECCIÓN MEDICOS REGISTRADOS -------------------------------//   
let profesionales = document.querySelector(".profesionales");
let inputBuscarProfesionalesByDNI = document.querySelector("#inputBuscarProfesionalesByDNI");
let inputBuscarProfesionalesByREFEPS = document.querySelector("#inputBuscarProfesionalesByREFEPS");
let listaMedicos = document.querySelector(".listaMedicos");
axios("http://localhost:3000/registrar/medico/profesionales")
.then(res => {
    console.log(res.data)
    let medicos = res.data;
    if(medicos.length > 0){
        medicos.forEach(med => {
            let li = document.createElement("li");
            let p = document.createElement("p");
            p.innerHTML = `${med.nombre} ${med.apellido}, DNI: ${med.documento}, Matricula: ${med.matricula}, REFEPS: ${med.idRefeps}`;
            li.appendChild(p);
            agregarBotonesEditarYBorrar(li, med.documento, medicos, med.idMedico);
            listaMedicos.appendChild(li);
        })
        inputBuscarProfesionalesByDNI.addEventListener("input", buscarPorElemento(medicos, "documento"));
        inputBuscarProfesionalesByREFEPS.addEventListener("input", buscarPorElemento(medicos, "idRefeps"));
    }else{
        let li = document.createElement("li");
        li.innerHTML = "No existen médicos";
        listaMedicos.appendChild(li);
    }
})
.catch(error => console.log(error));

const buscarPorElemento = (medicos, contenido) => {
    return (evento) => {
        let contenidoInput = evento.target.value; // ingreso en el input
        //filtramos en la lista de medicos los que empiezan con ese contenidoInput
        let listado = [];
        if(contenido === "documento"){
            listado = medicos.filter(e => e.documento.toString().startsWith(contenidoInput));  
        }else{
            listado = medicos.filter(e => e.idRefeps.toString().startsWith(contenidoInput));  
        }
        //chequeamos de que haya alguno...
        if(listado.length > 0){
            borrarListaAnterior(listaMedicos);
            listado.forEach(med => { //recorremos y llenamos lista
                let li = document.createElement("li");
                let p = document.createElement("p");
                p.innerHTML = `${med.nombre} ${med.apellido}, DNI: ${med.documento}, Matricula: ${med.matricula}, REFEPS: ${med.idRefeps}`;
                li.appendChild(p);
                agregarBotonesEditarYBorrar(li, med.documento, medicos, med.idMedico);
                listaMedicos.appendChild(li);
            })
        }else{ // si no hay ninguno mostramos mensaje
            let li = document.createElement("li");
            borrarListaAnterior(listaMedicos);
            li.innerHTML = "No existen medicos con esos datos...";
            listaMedicos.appendChild(li);
        }
    }
}

const borrarListaAnterior = (elemento) => { // borra todos los hijos de x elemento, en nuestro caso la lista de médicos
    while(elemento.hasChildNodes()){
        elemento.removeChild(elemento.firstChild);
    }
}

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


//------------------------------- SECCION BOTON REGISTRAR MEDICO -------------------------------//
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
                Swal.fire({
                    icon: "success",
                    title: "Médico Registrado Correctamente",
                    timer: 1500
                }).then(() => window.location.href = "/registrar/medico");
            }else{
                Swal.fire({
                    icon: "error",
                    title: "Ocurrión un error al registrar al profesional"
                }).then(() => limpiarInputs());
            }
        })
        .catch(error => console.log(error));
    }
})

const bordeRojo = (elemento) => {
    elemento.style.border = "2px solid red";
    setTimeout(() => {
        elemento.style.border = "1px solid #9a9a9a";
    }, 1500);
}

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


//------------------------------- SECCION BOTONES EDITAR Y BORRAR -------------------------------//
const agregarBotonesEditarYBorrar = (li, documento, medicos, idMedico) => {
    const editar = document.createElement("button");
    editar.type="button";
    editar.className="tooltip";
    editar.id = documento;
    editar.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>
                        <p class="tooltiptext">Editar</p>`;                         
    const borrar = document.createElement("button");
    borrar.type="button";
    borrar.className="tooltip";
    borrar.id = documento;
    borrar.innerHTML = `<i class="fa-solid fa-trash-can" style="color: #f50000;"></i>
                        <p class="tooltiptext">Borrar</p>`;
    editar.addEventListener("click", () => {
        limpiarInputs();
        llenarInputsConProfesional(editar.id, medicos);
    })
    borrar.addEventListener("click", () => {
        axios.put("http://localhost:3000/registrar/medico/borrado", {idMedico})
        .then(res => {
            if(res.data.ok){
                Swal.fire({
                    icon: "success",
                    title: "Médico borrado correctamente",
                    timer: 1000
                }).then(()=>{
                    window.location.href = "/registrar/medico";
                })
            }else{
                Swal.fire({
                    icon: "error",
                    title: "Ocurrión un error al borrar al profesional"
                });
            }
        })
        .catch(error => {
            console.log(error);
        })
    })
    li.appendChild(editar);
    li.appendChild(borrar);
}


let btnGuardar = document.querySelector("#botonGuardarCambiosUpdateMedico");
let btnCancelar = document.querySelector("#botonCancelarUpdateMedico");
const llenarInputsConProfesional = (documento, medicos) => {
    const medico = medicos.find(e => e.documento == documento);
    let idMedico = medico.idMedico;
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
        })
        .catch(error => console.log(error))
    }else{
        alert("OCURRIO UN ERROR AL ENCONTRAR AL MÉDICO CON EL ID "+documento);
    }
    //mostrar boton guardarCambios y cancelar
    btnGuardar.addEventListener("click", updateMedico(idMedico));
    btnCancelar.addEventListener("click", cancelarUpdate);
    btnGuardar.style.display = "inline-block";
    btnCancelar.style.display = "inline-block";
    //esconder boton registrar médico
    botonRegistrarMedico.style.display ="none";   
}

const updateMedico = (idMedico) => {
    return () => {
        let especialidadesSeleccionadas = [];
        for(let i = 0; i < especialidades.length; i++){
            if(especialidades[i].checked){
                especialidadesSeleccionadas.push(especialidades[i].value);
            }
        }
        const medico = {
            idMedico,
            nombre: inputNombre.value, 
            apellido: inputApellido.value,
            domicilio: inputDomicilio.value,
            profesion: profesion.value,
            especialidad: especialidadesSeleccionadas,
            documento: inputDocumento.value,
            matricula: inputMatricula.value,
            refeps: inputRefeps.value
        }
        axios.put("http://localhost:3000/registrar/medico/update", medico)
        .then(res => {
            if(res.data.ok){
                Swal.fire({
                    icon: "success",
                    title: "Cambios guardados correctamente",
                    timer: 1500
                }).then(()=>{
                    // limpiarInputs();
                    window.location.href = "/registrar/medico";
                })
            }else{
                Swal.fire({
                    icon: "error",
                    title: "Ocurrión un error al editar al profesional"
                });
            }
        })
        .catch(error => console.log(error));
    }
}

const cancelarUpdate = () => {
    botonRegistrarMedico.style.display = "inline-block";
    btnGuardar.style.display = "none";
    btnCancelar.style.display = "none";
    limpiarInputs();
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
}