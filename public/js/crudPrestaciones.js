//VERIFICACIÓN DE NO AGREGAR BOTÓN SI NO ESTÁ LLENO EL PRIMER INPUT
let botonAgregarLado = document.querySelector("#botonAgregarLado");
let labelLado2 = document.querySelector(".labelLado2");
let labelLado3 = document.querySelector(".labelLado3");
botonAgregarLado.addEventListener("click", () => {
    if(inputHiddenLados1.value && inputHiddenLados1.getAttribute("data-value") >= 0){
        if(labelLado2.style.display === "none"){
            labelLado2.style.display = "flex"; 
        }else{
            if((inputHiddenLados1.value && inputHiddenLados1.getAttribute("data-value")>=0) && (inputHiddenLados2.value && inputHiddenLados2.getAttribute("data-value")>=0)){
                if(labelLado3.style.display === "none"){
                    labelLado3.style.display = "flex";
                }
            }
        }
    }        
})

//VERIFICACIONES EN INPUTS
let inputHiddenLados1 = document.querySelector("#inputHiddenLado1");
let inputHiddenLados2 = document.querySelector("#inputHiddenLado2");
let inputHiddenLados3 = document.querySelector("#inputHiddenLado3");
let inputs = document.querySelector("#registroMedicamento");
inputs.addEventListener("input", (evento) => { //validamos los inputs con data lists
    if(evento.target.closest("input")){
        let input = evento.target.closest("input");
        let nombreInput = input.id;
        switch(nombreInput){
            case "lado1": validarEventoInput("lados1", evento.target.value, input, inputHiddenLados1);break;
            case "lado2": validarEventoInput("lados2", evento.target.value, input, inputHiddenLados2);break;
            case "lado3": validarEventoInput("lados3", evento.target.value, input, inputHiddenLados3);break;
            case "nombrePrestacion": validarInputTexto(input, false);break;
        }
    }else if(evento.target.closest("textArea")){
        let input = evento.target.closest("textArea");
        let nombreInput = input.id;
        switch(nombreInput){
            case "inputIndicacion": validarInputTexto(input, true);break;
            case "inputJustificacion": validarInputTexto(input, true);break;
        }
    }
})

const validarEventoInput = (nombreDataList, palabra, input, hidden) => {
    let dataList = document.querySelectorAll(`#${nombreDataList} option`);
    let idInput = -1;
    dataList.forEach(e => {
        if(palabra === e.value){ // si matchea, seteamos el id del elemento 
            idInput = e.getAttribute("data-value");
        }
    })
    if(idInput >= 0 || palabra === ""){
        input.style.border = "1px solid #9a9a9a";
        if(idInput >=0 && palabra !== ""){ //si hay un elemento del datalist y no esta vacio llenamos el input hidden
            hidden.setAttribute("data-value", idInput);
            hidden.value = palabra;
        }else if(palabra === "" && (nombreDataList==="lados1" || nombreDataList==="lados2" || nombreDataList === "lados3")){
            //validamos que si borra todo el contenido y si es el lado2 y el lado3 esta escondido, escondemos el lado2
            if(nombreDataList==="lados1" && labelLado2.style.display === "none"){
                hidden.removeAttribute("data-value"); //borramos el atributo del input hidden
                hidden.value = "";
            } 
            if(nombreDataList==="lados2" && labelLado3.style.display ==="none"){
                labelLado2.style.display = "none";
                hidden.removeAttribute("data-value"); //borramos el atributo del input hidden
                hidden.value = "";
            }
            // si es el lado 3 y borra el contenido lo escondemos...
            if(nombreDataList === "lados3"){
                labelLado3.style.display = "none";
                hidden.removeAttribute("data-value"); //borramos el atributo del input hidden
                hidden.value = "";
            }
        }
    }else{
        hidden.removeAttribute("data-value"); //borramos el atributo del input hidden
        hidden.value = ""; //borramos el cotenido del input hidden
        input.style.border = "2px solid red";
    }
    return idInput;
}

const validarInputTexto = (input, textArea) => {
    if(input.value === ""){
        input.style.border = "2px solid red";
    }else{
        input.style.border = "1px solid #9a9a9a";
    }
    if(!textArea){
        if(input.value.length > 55){
            input.value = input.value.slice(0, 55);
            input.style.border = "2px solid red";
        }
    }else{
        if(input.value.length > 190){
            input.value = input.value.slice(0, 190);
            input.style.border = "2px solid red";
        }
    }
    
}

const validacionAlRegistrar = () => {
    let sePuede = validarInputsVacios();
    const prestacion = {};
    if(sePuede){
        //ARMAMOS EL MEDICAMENTO CON EL ID DE LOS ELEMENTOS O SI NO CON EL NOMBRE PARA CREAR UNO NUEVO...
        prestacion.nombrePrestacion = inputNombrePrestacion.value;
        prestacion.idLado1 = inputHiddenLados1.getAttribute("data-value");
        prestacion.idLado2 = inputHiddenLados2.getAttribute("data-value");
        prestacion.idLado3 = inputHiddenLados3.getAttribute("data-value");
        prestacion.justificacion = inputJustificacion.value;
        prestacion.indicacion = inputIndicacion.value;
        prestacion.idPrestacion = botonGuardarEdicion.getAttribute("data-value");
        return prestacion;
    }else{
        return false;
    }
}

//LLENADO DE BUSQUEDA DE PRESTACIONES
let inputBuscarPorPrestacion = document.querySelector("#inputBuscarPorPrestacion");
axios("http://localhost:3000/registrar/prestacion/prestaciones")
.then(res => {
    let listado = res.data.sort((a, b) => b.estado - a.estado); //ordenamos los activos primero...
    llenarListaPrestaciones(listado);
    inputBuscarPorPrestacion.addEventListener("input", (evento) => {
        let palabra = evento.target.value;
        let prestaciones = res.data;
        prestaciones = prestaciones.filter(p => { //filtramos segun el input buscar prestaciones
            let pFormateado = p.nombrePrestacion;
            pFormateado = pFormateado.replace(/\s+/g, "");
            palabra = palabra.replace(/\s+/g, "");
            return pFormateado.toLowerCase().startsWith(palabra.toLowerCase());
        });
        prestaciones = prestaciones.sort((a, b) => b.estado - a.estado); //ordenamos los activos primero...
        llenarListaPrestaciones(prestaciones);
    });
})
.catch(error => console.log(error));

let listaPrestaciones = document.querySelector(".listaPrestaciones");
const llenarListaPrestaciones = (prestaciones) => {
    listaPrestaciones.innerHTML = '';
    // console.log(medicamentos);
    if (prestaciones.length > 0) {
        for (let pres of prestaciones) {
            let li = document.createElement("li");
            let p = document.createElement("p");
            p.innerHTML = `<li>${pres.nombrePrestacion}</li> <li>Indicacion: ${pres.indicacion}</li> <li>Justificación: ${pres.justificacion}</li>`;
            if(pres.nombresLados){
                let lados = pres.nombresLados.split(",");
                console.log(lados);
                for(let l of lados){
                    p.innerHTML += `<li>lado: ${l}</li>`;
                }
            }
            if(pres.estado === 0){ //boton para los que estan desactivadas
                p.className = "medicamentoBorrado";
                let botonDarDeAlta = document.createElement("button");
                botonDarDeAlta.type = "button";
                botonDarDeAlta.className = "tooltip";
                botonDarDeAlta.id = pres.idPrestacion;
                botonDarDeAlta.dataset.action = "darDeAlta";
                botonDarDeAlta.dataset.idPrestacion = pres.idPrestacion;
                let darDeAlta = `<i class="fa-solid fa-circle-arrow-up" style="color: #00db25;"></i>
                <p class="tooltiptext">Dar de alta</p>`;
                botonDarDeAlta.innerHTML = darDeAlta;
                li.appendChild(p);
                li.appendChild(botonDarDeAlta);
            }else{ // botones para los que estan activados
                p.className = "medicamentoVigente";
                let botonEditar = document.createElement("button");
                botonEditar.type = "button";
                botonEditar.className = "tooltip";
                botonEditar.id = pres.idPrestacion;
                botonEditar.dataset.action = "editar";
                botonEditar.dataset.idPrestacion = pres.idPrestacion;
                let botonBorrar = document.createElement("button");
                botonBorrar.type = "button";
                botonBorrar.className = "tooltip";
                botonBorrar.id = pres.id;
                botonBorrar.dataset.action = "borrar";
                botonBorrar.dataset.idPrestacion = pres.idPrestacion;
                let editar = `<i class="fa-solid fa-pen-to-square"></i>
                            <p class="tooltiptext">Editar</p>`;
                let borrar = `<i class="fa-solid fa-trash-can" style="color: #f50000"></i>
                            <p class="tooltiptext">Borrar</p>`;
                botonEditar.innerHTML = editar;
                botonBorrar.innerHTML = borrar;
                li.appendChild(p);
                li.appendChild(botonEditar);
                li.appendChild(botonBorrar);
                }
            listaPrestaciones.appendChild(li);
        }
    } else {
        let li = document.createElement("li");
        li.innerHTML = "NO EXISTEN PRESTACIONES CON ESAS CARACTERÍSTICAS";
        listaPrestaciones.appendChild(li);
    }
}

//SECCIÓN ESCUCHADORES DE EVENTOS BOTONES EDITAR, BORRAR, ACTIVAR
listaPrestaciones.addEventListener("click", (evento) => {
    if(evento.target.closest("button")){
        let boton = evento.target.closest("button");
        let action = boton.dataset.action;
        let idPrestacion = boton.dataset.idPrestacion;
        if(action === "darDeAlta"){
            darDeAltaPrestacion(idPrestacion);
        }else if(action === "borrar"){
            borrarPrestacion(idPrestacion);
        }else if(action === "editar"){
            editarPrestacion(idPrestacion);
        }
    }
})

//FUNCIONES EDITAR, BORRAR Y DAR DE ALTA MEDICAMENTO
const darDeAltaPrestacion = (idPrestacion) => {
    if(idPrestacion){
        axios.put("http://localhost:3000/registrar/prestacion/darDeAltaPrestacion",{idPrestacion})
        .then(() => {
            mostrarMensaje("success", "PRESTACIÓN DADA DE ALTA CORRECTAMENTE", 1500, "/registrar/prestacion");
        })
        .catch(error => {
            mostrarMensaje("error", "ERROR AL DAR DE ALTA LA PRESTACIÓN", 1500, "/registrar/prestacion");
        })
    }
}

const borrarPrestacion = (idPrestacion) => {
    if(idPrestacion){
        axios.put("http://localhost:3000/registrar/prestacion/borrarPrestacion",{idPrestacion})
        .then(() => {
            mostrarMensaje("success", "PRESTACIÓN BORRADA CORRECTAMENTE", 1500, "/registrar/prestacion");
        })
        .catch(error => {
            mostrarMensaje("error", "ERROR AL BORRAR LA PRESTACIÓN", 1500, "/registrar/prestacion");
        })
    }
}


const editarPrestacion = (idPrestacion) => {
    if(idPrestacion){
        axios(`http://localhost:3000/registrar/prestacion/prestaciones/${idPrestacion}`)
        .then(res => {
            let prestaciones = res.data[0];
            //llenamos los campos
            llenarCampos(prestaciones);
            habilitarBotonesEdicion();
        })
        .catch(error => {
            mostrarMensaje("error", "ERROR AL EDITAR LA PRESTACIÓN", 1500, "/registrar/prestacion")
        })
    }
}

let inputNombrePrestacion = document.querySelector("#nombrePrestacion");
let inputLado1 = document.querySelector("#lado1");
let inputLado2 = document.querySelector("#lado2");
let inputLado3 = document.querySelector("#lado3");
let inputIndicacion = document.querySelector("#inputIndicacion");
let inputJustificacion = document.querySelector("#inputJustificacion");
//FUNCION LLENAR CAMPOS E INPUTS HIDDENS Y VACIAR CAMPOS E INPUTS HIDDENS
const llenarCampos = (p) => {
    vaciarCampos();
    let idsLados;
    let nombresLados;
    if(p.idsLados){
        idsLados = p.idsLados.split(","); 
        nombresLados = p.nombresLados.split(","); 
        for(let i = 0; i < nombresLados.length; i++){
            if(i===0){
                inputLado1.value = nombresLados[i];
                inputHiddenLados1.value = nombresLados[i];
                inputHiddenLados1.setAttribute("data-value", idsLados[i]);
            }else if(i===1){
                if(labelLado2.style.display === "none"){
                    labelLado2.style.display = "flex";
                }
                inputLado2.value = nombresLados[i];
                inputHiddenLados2.value = nombresLados[i];
                inputHiddenLados2.setAttribute("data-value", idsLados[i]);
            }else if(i===2){
                if(labelLado3.style.display === "none"){
                    labelLado3.style.display = "flex";
                }
                inputLado3.value = nombresLados[i];
                inputHiddenLados3.value = nombresLados[i];
                inputHiddenLados3.setAttribute("data-value", idsLados[i]);
            }
        }
    }

    inputNombrePrestacion.value = p.nombrePrestacion;    
    inputIndicacion.value = p.indicacion;
    inputJustificacion.value = p.justificacion;

    //le ponemos el idPrestacion al botonguardar
    botonGuardarEdicion.setAttribute("data-value", p.idPrestacion);
}

const vaciarCampos = () => {
    inputNombrePrestacion.value = "";

    inputLado1.value = "";
    inputHiddenLados1.value = "";
    inputHiddenLados1.removeAttribute("data-value");
    
    inputLado2.value = "";
    inputHiddenLados2.value = "";
    inputHiddenLados2.removeAttribute("data-value");
    labelLado2.style.display = "none";
    
    inputLado3.value = "";
    inputHiddenLados3.value = "";
    inputHiddenLados3.removeAttribute("data-value");
    labelLado3.style.display = "none";
    
    inputIndicacion.value = "";
    inputJustificacion.value = "";

    // sacamos el idPrestacion al botonguardar
    botonGuardarEdicion.removeAttribute("data-value");
}

//FUNCIONES HABILITAR Y DESHABILITAR BOTONES EN EDICION
let botonGuardarEdicion = document.querySelector("#botonGuardarUpdate"); 
let botonCancelarEdicion = document.querySelector("#botonCancelarUpdate");
let botonRegistrar = document.querySelector("#botonRegistrarPrestacion");
const habilitarBotonesEdicion = () => {
    botonGuardarEdicion.style.display = "inline-block";
    botonCancelarEdicion.style.display = "inline-block";
    botonRegistrar.style.display = "none";
}

const deshabilitarBotonesEdicion = () => {  
    botonGuardarEdicion.style.display = "none";
    botonCancelarEdicion.style.display = "none";
    botonRegistrar.style.display = "inline-block";
}

//FUNCIONES CANCELAR EDICION, REGISTRAR PRESTACION Y GUARDAR EDICION
const guardarEdicion = () => {
    let prestacion = validacionAlRegistrar();
    if(prestacion){
        axios.put("http://localhost:3000/registrar/prestacion", prestacion)
        .then(res => {
            console.log(res.data);
            if(res.data.ok){
                mostrarMensaje("success", "Prestación editada con éxito", 1500, "/registrar/prestacion");
            }else{
                mostrarMensaje("warning", "Entrada duplicada de datos", 1500, "/registrar/prestacion");
            }
        })
        .catch(error => console.log(error));
    }
    console.log(prestacion);
}
botonGuardarEdicion.addEventListener("click", guardarEdicion);

const cancelarEdicion = () => {
    deshabilitarBotonesEdicion();
    vaciarCampos();
}
botonCancelarEdicion.addEventListener("click", cancelarEdicion);
    
const registrarMedicamento = () => {
    let prestacion = validacionAlRegistrar();
    if(prestacion){
        axios.post("http://localhost:3000/registrar/prestacion", prestacion)
        .then(res => {
            if(res.data.ok){
                mostrarMensaje("success", "Prestación registrada con éxito", 2000, "/registrar/prestacion");
            }else{
                mostrarMensaje("error", "Campos duplicados, verificar...", 2000, "/registrar/prestacion");
            }
        }).catch(error => mostrarMensaje("error", error, 3000))
    }
}
botonRegistrar.addEventListener("click", registrarMedicamento);

const validarInputsVacios = () => {
    let todoCorrecto = true;
    const checkeo = (inputHidden, inputVisible) => {
        if(!inputHidden.getAttribute("data-value")){
            marcarConRojo(inputVisible);
            todoCorrecto = false;
        }
    }
    if(inputNombrePrestacion.value === ""){
        marcarConRojo(inputNombrePrestacion);
        todoCorrecto = false;
    }
    if(inputIndicacion.value === ""){
        marcarConRojo(inputIndicacion)
        todoCorrecto = false;
    }
    if(inputJustificacion.value === ""){
        marcarConRojo(inputJustificacion)
        todoCorrecto = false;
    }
    //CHEQUEAMOS DE QUE ESTEN TODOS LOS INPUT HIDDEN LLENOS SI NO MARCAMOS CON ROJO
    if(inputLado1.value !== ""){
        checkeo(inputHiddenLados1, inputLado1);
    }
    if(labelLado2.style.display !== "none"){
        checkeo(inputHiddenLados2, inputLado2);
    }
    if(labelLado3.style.display !== "none"){
        checkeo(inputHiddenLados3, inputLado3);
    }
    return todoCorrecto;
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

const marcarConRojo = (elemento) => {
    elemento.style.border = "2px solid red";
    setTimeout(() => {
        elemento.style.border = "1px solid #9a9a9a";
    }, 1800);
}