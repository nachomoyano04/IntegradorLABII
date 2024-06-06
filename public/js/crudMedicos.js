//------------------------------- SECCIÓN MEDICOS REGISTRADOS -------------------------------//   
let profesionales = document.querySelector(".profesionales");
let inputDNI = document.querySelector("#inputBuscarProfesionalesByDNI");
let inputREFEPS = document.querySelector("#inputBuscarProfesionalesByREFEPS");
let listaMedicos = document.querySelector(".listaMedicos");
axios("http://localhost:3000/registrar/medico/profesionales")
.then(res => {
    let medicos = res.data;
    console.log(res.data)
    if(medicos.length > 0){
        medicos.forEach(e => {
            let li = document.createElement("li");
            li.innerHTML = e;
            listaMedicos.appendChild(li);
        })
        inputDNI.addEventListener("input", buscarPorElemento);
        inputREFEPS.addEventListener("input", buscarPorElemento);
    }else{
        let li = document.createElement("li");
        li.innerHTML = "No existen médicos";
        listaMedicos.appendChild(li);
    }
})
.catch(error => console.log(error));

const buscarPorElemento = (evento, elemento) => {
        let contenidoInput = evento.target.value; // ingreso en el input
        //filtramos en la lista de medicos los que empiezan con ese contenidoInput
        const listado = medicos.filter(e => e.elemento.startsWith(contenidoInput));  
        //chequeamos de que haya alguno...
        if(listado.length > 0){
            borrarListaAnterior(listaMedicos);
            listado.forEach(med => { //recorremos y llenamos lista
                let li = document.createElement("li");
                li.innerHTML = `${med.nombre} ${med.apellido}, DNI: ${med.documento}, Matricula: ${med.matricula}, REFEPS: ${med.idREFEPS}`;
            })
        }else{ // si no hay ninguno mostramos mensaje
            let li = document.createElement("li");
            borrarListaAnterior(listaMedicos);
            li.innerHTML = "No existen medicos con esos datos...";
            listaMedicos.appendChild(li);
        }
}

const borrarListaAnterior = (elemento) => { // borra todos los hijos de x elemento, en nuestro caso la lista de médicos
    while(elemento.hasChildNodes()){
        elemento.remove(elemento.firstChild);
    }
}

//------------------------------- SECCION VERIFICACION CAMPOS ------------------------------//
let inputNombre = document.querySelector("#nombre");
let inputApellido = document.querySelector("#apellido");
let inputRefeps = document.querySelector("#idRefeps");
let inputDni = document.querySelector("#documento");
let inputMatricula = document.querySelector("#matricula");
let inputDomicilio = document.querySelector("#domicilio");

const verificarSoloString = (evento) => { //verificamos que solo ingresen letras para nombre y apellido...
    const letrasValidas = evento.target.value.replace(/[^a-zA-Z\s]/g, "");
    if(evento.target.value !== letrasValidas){
        evento.target.value = letrasValidas;
    }
    if(evento.target.value.length > 40){
        evento.target.value = evento.target.value.slice(0,40);
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
inputDni.addEventListener("input", verificarSoloNumero);
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
inputDni.addEventListener("input", (evento) => { //mientras ingresa su documento llenamos los campos usuario y password...
    inputUsuario.value = evento.target.value;
    inputPassword.value = evento.target.value;
})


//------------------------------- SECCION BOTON REGISTRAR MEDICO -------------------------------//
let botonRegistrarMedico = document.querySelector("#botonRegistrarMedico");
let nombre = document.querySelector("#nombre");
let apellido = document.querySelector("#apellido");
let documento = document.querySelector("#documento");
let profesion = document.querySelector("#idProfesion");
let especialidades = document.querySelectorAll(".especialidades"); 
let idEspecialidad = []; //donde guardaremos todas las especialidades seleccioanadas...
let domicilio = document.querySelector("#domicilio");
let matricula = document.querySelector("#matricula");
let refeps = document.querySelector("#idRefeps");
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
    if(!nombre.value){ bordeRojo(nombre);sePuedeRegistrar = false;};
    if(!apellido.value){bordeRojo(apellido); sePuedeRegistrar = false};
    if(!documento.value){bordeRojo(documento); sePuedeRegistrar = false};
    if(!profesion.value){bordeRojo(profesion); sePuedeRegistrar = false};
    if(!domicilio.value){bordeRojo(domicilio); sePuedeRegistrar = false};
    if(!matricula.value){bordeRojo(matricula); sePuedeRegistrar = false};
    if(!refeps.value){bordeRojo(refeps); sePuedeRegistrar = false};
    if(sePuedeRegistrar){
        let registro = {nombre:nombre.value, apellido:apellido.value, documento:documento.value, profesion: profesion.value, especialidad:idEspecialidad,domicilio:domicilio.value,matricula:matricula.value,refeps:refeps.value};
        axios.post("/registrar/medico", registro)
        .then(res => {
            if(res.data.ok){
                Swal.fire({
                    icon: "success",
                    title: "Médico Registrado Correctamente",
                    timer: 1500
                }).then(()=>{
                    window.location.href = "/";
                })
            }else{
                Swal.fire({
                    icon: "error",
                    title: "Ocurrión un error al registrar al profesional"
                });
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
