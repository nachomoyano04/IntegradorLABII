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


//------------------------------- SECCION USUARIO Y PASSWORD -------------------------------//
let inputDocumento = document.querySelector("#documento");
let inputUsuario = document.querySelector("#usuario");
let inputPassword = document.querySelector("#password");
inputDocumento.addEventListener("input", (evento) => { //mientras ingresa su documento llenamos los campos usuario y password...
    if(evento.target.value.length > 8){
        inputDocumento.value = inputDocumento.value.slice(0, 8);
    }
    inputUsuario.value = evento.target.value;
    inputPassword.value = evento.target.value;
})


//------------------------------- SECCION BOTON REGISTRAR MEDICO -------------------------------//
let botonRegistrarMedico = document.querySelector("#botonRegistrarMedico");
let nombre = document.querySelector("#nombre");
let apellido = document.querySelector("#apellido");
let documento = document.querySelector("#documento");
let profesion = document.querySelector("#idProfesion");
let especialidad = document.querySelector("#idEspecialidad");
let domicilio = document.querySelector("#domicilio");
let matricula = document.querySelector("#matricula");
let refeps = document.querySelector("#idRefeps");
// let usuario = document.querySelector("#usuario");
// let password = document.querySelector("#password");
botonRegistrarMedico.addEventListener("click", () => {
    let sePuedeRegistrar = true;
    if(!nombre.value || nombre.value.includes){ // verificar cada campo que no ingresen boludeces
        bordeRojo(nombre); 
        sePuedeRegistrar = false;
    };
    if(!apellido.value){bordeRojo(apellido), sePuedeRegistrar = false};
    if(!documento.value){bordeRojo(documento), sePuedeRegistrar = false};
    if(!profesion.value){bordeRojo(profesion), sePuedeRegistrar = false};
    if(!especialidad.value){bordeRojo(especialidad), sePuedeRegistrar = false};
    if(!domicilio.value){bordeRojo(domicilio), sePuedeRegistrar = false};
    if(!matricula.value){bordeRojo(matricula), sePuedeRegistrar = false};
    if(!refeps.value){bordeRojo(refeps), sePuedeRegistrar = false};
    if(sePuedeRegistrar){
        console.log("se puede registrar!!!!");
    }
    console.log(nombre.value,apellido.value,documento.value,profesion.value,especialidad.value,domicilio.value,matricula.value,refeps.value,usuario.value,password.value);
})

const bordeRojo = (elemento) => {
    elemento.style.border = "2px solid red";
    setTimeout(() => {
        elemento.style.border = "1px solid #9a9a9a";
    }, 1500);
}
// axios.post("/registrar/medico", {
    
// });
