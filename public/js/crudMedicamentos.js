let inputBuscarMedicamentos = document.querySelector("#inputBuscarMedicamentos");
let inputNombreGenerico = document.querySelector("#nombreGenerico");
let inputNombreComercial = document.querySelector("#nombreComercial");
let inputConcentracion = document.querySelector("#concentracion");
let inputFormaFarmaceutica = document.querySelector("#formaFarmaceutica");
let inputPresentacion = document.querySelector("#presentacion");
let inputCategoria = document.querySelector("#categoria");
let inputFamilia = document.querySelector("#familia");

axios("http://localhost:3000/registrar/medicamento/medicamentos")
.then(res => {
    let listado = res.data.sort((a, b) => b.estado - a.estado); //ordenamos los activos primero...
    llenarListaMedicamentos(listado);
    inputBuscarMedicamentos.addEventListener("input", (evento) => {
        let palabra = evento.target.value;
        let medicamentos = res.data;
        medicamentos = medicamentos.filter(m => { //filtramos segun el input buscar medicamentos
            let mFormateado = `${m.nombreGenerico} ${m.cantidadConcentracion} ${m.unidadMedidaCon} ${m.forma} x${m.cantidadPresentacion} ${m.unidadMedidaPres}`;
            mFormateado = mFormateado.replace(/\s+/g, "");
            palabra = palabra.replace(/\s+/g, "");
            return mFormateado.toLowerCase().startsWith(palabra.toLowerCase());
        });
        medicamentos = medicamentos.sort((a, b) => b.estado - a.estado); //ordenamos los activos primero...
        llenarListaMedicamentos(medicamentos);
    });
})
.catch(error => {
    Swal.fire({
        icon: "error",
        title: error,
        timer: 1500
    })
});


let listaMedicamentos = document.querySelector(".listaMedicamentos");
const llenarListaMedicamentos = (medicamentos) => {
    listaMedicamentos.innerHTML = '';
    // console.log(medicamentos);
    if (medicamentos.length > 0) {
        for (let m of medicamentos) {
            let li = document.createElement("li");
            let p = document.createElement("p");
            p.innerHTML = `${m.nombreGenerico} ${m.cantidadConcentracion} ${m.unidadMedidaCon} ${m.forma} x${m.cantidadPresentacion} ${m.unidadMedidaPres}`;
            if(m.estado === 0){ //boton para los que estan desactivadas
                p.className = "medicamentoBorrado";
                let botonDarDeAlta = document.createElement("button");
                botonDarDeAlta.type = "button";
                botonDarDeAlta.className = "tooltip";
                botonDarDeAlta.id = m.id;
                botonDarDeAlta.dataset.action = "darDeAlta";
                botonDarDeAlta.dataset.idMedicamentoDetalle = m.id;
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
                botonEditar.id = m.id;
                botonEditar.dataset.action = "editar";
                botonEditar.dataset.idMedicamentoDetalle = m.id;
                let botonBorrar = document.createElement("button");
                botonBorrar.type = "button";
                botonBorrar.className = "tooltip";
                botonBorrar.id = m.id;
                botonBorrar.dataset.action = "borrar";
                botonBorrar.dataset.idMedicamentoDetalle = m.id;
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
            listaMedicamentos.appendChild(li);
        }
    } else {
        let li = document.createElement("li");
        li.innerHTML = "NO EXISTEN MEDICAMENTOS CON ESAS CARACTERÍSTICAS";
        listaMedicamentos.appendChild(li);
    }
}

//SECCIÓN ESCUCHADORES DE EVENTOS BOTONES EDITAR, BORRAR, ACTIVAR
listaMedicamentos.addEventListener("click", (evento) => {
    if(evento.target.closest("button")){
        let boton = evento.target.closest("button");
        let action = boton.dataset.action;
        let idMedicamentoDetalle = boton.dataset.idMedicamentoDetalle;
        if(action === "darDeAlta"){
            darDeAltaMedicamento(idMedicamentoDetalle);
        }else if(action === "borrar"){
            borrarMedicamento(idMedicamentoDetalle);
        }else if(action === "editar"){
            editarMedicamento(idMedicamentoDetalle);
        }
    }
})

//FUNCIONES EDITAR, BORRAR Y DAR DE ALTA MEDICAMENTO
const darDeAltaMedicamento = (idMedicamentoDetalle) => {
    if(idMedicamentoDetalle){
        axios.put("http://localhost:3000/registrar/medicamento/darDeAltaMedicamento",{idMedicamentoDetalle})
        .then(() => {
            mostrarMensaje("success", "MEDICAMENTO DADO DE ALTA CORRECTAMENTE", 1500, "/registrar/medicamento");
        })
        .catch(error => {
            mostrarMensaje("error", "ERROR AL DAR DE ALTA AL MEDICAMENTO", 1500, "/registrar/medicamento");
        })
    }
}

const borrarMedicamento = (idMedicamentoDetalle) => {
    if(idMedicamentoDetalle){
        axios.put("http://localhost:3000/registrar/medicamento/borrarMedicamento",{idMedicamentoDetalle})
        .then(() => {
            mostrarMensaje("success", "MEDICAMENTO BORRADO CORRECTAMENTE", 1500, "/registrar/medicamento");
        })
        .catch(error => {
            mostrarMensaje("error", "ERROR AL BORRAR EL MEDICAMENTO", 1500, "/registrar/medicamento");
        })
    }
}


const editarMedicamento = (idMedicamentoDetalle) => {
    if(idMedicamentoDetalle){
        axios(`http://localhost:3000/registrar/medicamento/medicamentos/${idMedicamentoDetalle}`)
        .then(res => {
            let medicamento = res.data[0];
            console.log(medicamento);
            //llenamos los campos
            llenarCampos(medicamento);
            habilitarBotonesEdicion();
        })
        .catch(error => {
            mostrarMensaje("error", "ERROR AL EDITAR EL MEDICAMENTO", 1500, "/registrar/medicamento")
        })
    }
}


//FUNCION LLENAR CAMPOS E INPUTS HIDDENS Y VACIAR CAMPOS E INPUTS HIDDENS
const llenarCampos = (m) => {
    inputNombreGenerico.value = m.nombreGenerico;
    inputHiddenNombreGenerico.value = m.nombreGenerico;
    inputHiddenNombreGenerico.setAttribute("data-value", m.idMedicamento);

    inputNombreComercial.value = m.nombreComercial || "";
    
    inputConcentracion.value = `${m.cantidadConcentracion} ${m.unidadMedidaCon}`;
    inputHiddenConcentracion.value = `${m.cantidadConcentracion} ${m.unidadMedidaCon}`;
    inputHiddenConcentracion.setAttribute("data-value", m.idConcentracion);
    
    inputFormaFarmaceutica.value = m.forma;
    inputHiddenFormaFarmaceutica.value = m.forma;
    inputHiddenFormaFarmaceutica.setAttribute("data-value", m.idFormaFarmaceutica);
    
    inputPresentacion.value = `${m.cantidadPresentacion} ${m.unidadMedidaPres}`;
    inputHiddenPresentacion.value = `${m.cantidadPresentacion} ${m.unidadMedidaPres}`;
    inputHiddenPresentacion.setAttribute("data-value", m.idPresentacion);
    
    inputCategoria.value = m.nombreCategoria;
    inputHiddenCategoria.value = m.nombreCategoria;
    inputHiddenCategoria.setAttribute("data-value", m.idCategoria);
    
    inputFamilia.value = m.nombreFamilia;
    inputHiddenFamilia.value = m.nombreFamilia;
    inputHiddenFamilia.setAttribute("data-value", m.idFamilia);

    //le ponemos el idMedicamentoDetalle al botonguardar
    botonGuardarEdicion.setAttribute("data-value", m.id);
}
const vaciarCampos = () => {
    inputNombreGenerico.value = ""
    inputHiddenNombreGenerico.value = "";
    inputHiddenNombreGenerico.removeAttribute("data-value");

    inputNombreComercial.value = "";

    inputConcentracion.value = "";
    inputHiddenConcentracion.value = "";
    inputHiddenConcentracion.removeAttribute("data-value");
    
    inputFormaFarmaceutica.value = "";
    inputHiddenFormaFarmaceutica.value = "";
    inputHiddenFormaFarmaceutica.removeAttribute("data-value");
    
    inputPresentacion.value = "";
    inputHiddenPresentacion.value = "";
    inputHiddenPresentacion.removeAttribute("data-value");
    
    inputCategoria.value = "";
    inputHiddenCategoria.value = "";
    inputHiddenCategoria.removeAttribute("data-value");
    
    inputFamilia.value = "";
    inputHiddenFamilia.value = "";
    inputHiddenFamilia.removeAttribute("data-value");

    //sacamos el idMedicamentoDetalle al botonguardar
    botonGuardarEdicion.removeAttribute("data-value");
}


//FUNCIONES HABILITAR Y DESHABILITAR BOTONES EN EDICION
let botonGuardarEdicion = document.querySelector("#botonGuardarUpdate"); 
let botonCancelarEdicion = document.querySelector("#botonCancelarUpdate");
let botonRegistrar = document.querySelector("#botonRegistrarMedicamento");
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

//FUNCIONES CANCELAR EDICION, REGISTRAR MEDICAMENTO Y GUARDAR EDICION
const guardarEdicion = () => {
    let medicamento = validacionAlRegistrar();
    axios.put("http://localhost:3000/registrar/medicamento", medicamento)
    .then(res => {
        if(res.data.ok){
            mostrarMensaje("success", "Medicamento editado con éxito", 1500, "/registrar/medicamento");
        }else{
            mostrarMensaje("warning", "Entrada duplicada de datos", 1500, "/registrar/medicamento");
        }
    })
    .catch(error => console.log(error));
    console.log(medicamento);
}
botonGuardarEdicion.addEventListener("click", guardarEdicion);

const cancelarEdicion = () => {
    deshabilitarBotonesEdicion();
    vaciarCampos();
}
botonCancelarEdicion.addEventListener("click", cancelarEdicion);
    
const registrarMedicamento = () => {
    let medicamento = validacionAlRegistrar();
    if(medicamento){
        axios.post("http://localhost:3000/registrar/medicamento", medicamento)
        .then(res => {
            if(res.data.ok){
                mostrarMensaje("success", "Medicamento registrado con éxito", 2000, "/registrar/medicamento");
            }else{
                mostrarMensaje("error", "Campos duplicados, verificar...", 2000, "/registrar/medicamento");
            }
        }).catch(error => mostrarMensaje("error", error, 3000))
    }
}
botonRegistrar.addEventListener("click", registrarMedicamento);
    
//FUNCIONES AGREGAR NOMBRE, AGREGAR CONCENTRACION, AGREGAR FORMA, AGREGAR PRESENTACION, AGREGAR CATEGORIA, AGREGAR FAMILIA
let botonAgregarNombreGenerico = document.querySelector("#botonAgregarNombreGenerico");
botonAgregarNombreGenerico.addEventListener("click", () => {
    mensajeDeConfirmacionTexto("Nuevo nombre genérico", inputNombreGenerico, document.querySelector("#nombresGenericos"));
})
let botonAgregarConcentracion = document.querySelector("#botonAgregarConcentracion");
botonAgregarConcentracion.addEventListener("click", () => {
    mensajeDeConfirmacionCantidadYUnidad("Nueva concentración", inputConcentracion, document.querySelector("#concentraciones"));
})
let botonAgregarFormaFarmaceutica = document.querySelector("#botonAgregarFormaFarmaceutica");
botonAgregarFormaFarmaceutica.addEventListener("click", () => {
    mensajeDeConfirmacionTexto("Nueva forma farmacéutica", inputFormaFarmaceutica, document.querySelector("#formasFarmaceuticas"));
})
let botonAgregarPresentacion = document.querySelector("#botonAgregarPresentacion");
botonAgregarPresentacion.addEventListener("click", () => {
    mensajeDeConfirmacionCantidadYUnidad("Nueva presentación", inputPresentacion, document.querySelector("#presentaciones"));
})
let botonAgregarCategoria = document.querySelector("#botonAgregarCategoria");
botonAgregarCategoria.addEventListener("click", () => {
    mensajeDeConfirmacionTexto("Nueva categoría", inputCategoria, document.querySelector("#categorias"));
})
let botonAgregarFamilia = document.querySelector("#botonAgregarFamilia");
botonAgregarFamilia.addEventListener("click", () => {
    mensajeDeConfirmacionTexto("Nueva familia", inputFamilia, document.querySelector("#familias"));
})


// MENSAJE DE CONFIRMACION INPUT CANTIDAD Y UNIDAD SWEET ALERT Y MENSAJE DE CONFIRMACION INPUT TEXTO SWEET ALERT
const mensajeDeConfirmacionCantidadYUnidad = (titulo, input, dataList) => {
    Swal.fire({
        title: titulo,
        html: `
            <label for="cantidad">Cantidad: </label>
            <input type="number" id="cantidad" class="swal2-input">
            <label for="unidad">Unidad: </label>
            <input type="text" id="unidad" class="swal2-input">
        `,
        showCancelButton:true,
        preConfirm: () => {
            const cantidad = document.getElementById('cantidad').value;
            const unidad = document.getElementById('unidad').value;
            if (!cantidad || !unidad) {
                Swal.showValidationMessage('Por favor ingrese ambos valores');
            }
            return { cantidad: cantidad, unidad: unidad };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            let esta = false;
            for(let dl of dataList.options){ //nos fijamos si esta antes de agregarlo
                if(dl.value === `${result.value.cantidad} ${result.value.unidad}`){
                    esta = true;
                }
                if(dl.getAttribute("data-value") == 0){ // eliminamos el elemento nuevo si ya habian creado uno (como es la ultima posicion no hay problema al eliminar)
                    dl.remove();
                }
            }
            if(!esta){
                input.value = "";
                let option = document.createElement("option");
                option.value = `${result.value.cantidad} ${result.value.unidad}`;
                option.setAttribute("data-value", 0);
                dataList.appendChild(option);
                mostrarMensaje("success", `${result.value.cantidad} ${result.value.unidad} agregado correctamente`, 2000);
            }else{
                mostrarMensaje("warning", `${result.value.cantidad} ${result.value.unidad} ya se encuentra cargado`, 2000);
            }
        }
    });
}

const mensajeDeConfirmacionTexto = (titulo, input, dataList) => {
    Swal.fire({
        title: titulo,
        html: `
            <input type="text" id="texto" class="swal2-input">
        `,
        showCancelButton:true,
        preConfirm: () => {
            const texto = document.getElementById('texto').value;
            if (!texto) {
                Swal.showValidationMessage('Por favor ingrese un valor');
            }
            return texto;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            let esta = false;
            for(let dl of dataList.options){ //nos fijamos si esta antes de agregarlo
                if(dl.value === result.value){
                    esta = true;
                }
                if(dl.getAttribute("data-value") == 0){// eliminamos el elemento nuevo si ya habian creado uno (como es la ultima posicion no hay problema al eliminar)
                    dl.remove()
                }
            } 
            if(!esta){
                input.value = "";
                let option = document.createElement("option");
                option.value = result.value;
                option.setAttribute("data-value", 0);
                dataList.appendChild(option);
                mostrarMensaje("success", `${result.value} agregado correctamente`, 2000);
            }else{
                mostrarMensaje("warning", `${result.value} ya se encuentra cargado`, 2000)
            }
        }
    });
}

//ESCUCHADOR DE ENVENTOS CHANGE PARA AGREGAR EL ID AL INPUT HIDDEN CADA VEZ QUE SELECCIONAN UNO NUEVO...
let inputs = document.querySelector(".formularioRegistrarMedicamento");
inputs.addEventListener("change", (evento) => {
    if(evento.target.closest("input")){
        const input = evento.target.closest("input");
        console.log(input.id);
    }
})

// VALIDACIONES DE INPUT MIENTRAS ESCRIBE QUE ESTE EL ELEMENTO Y VALIDACIONES AL REGISTRAR Y EDITAR
let inputHiddenNombreGenerico = document.querySelector("#hiddenNombreGenerico");
let inputHiddenConcentracion = document.querySelector("#hiddenConcentracion");
let inputHiddenFormaFarmaceutica = document.querySelector("#hiddenFormaFarmaceutica");
let inputHiddenPresentacion = document.querySelector("#hiddenPresentacion");
let inputHiddenCategoria = document.querySelector("#hiddenCategoria");
let inputHiddenFamilia = document.querySelector("#hiddenFamilia");

inputs.addEventListener("input", (evento) => {
    if(evento.target.closest("input")){
        const input = evento.target.closest('input');
        const nombreInput = input.id;
        let palabra = evento.target.value;
        switch(nombreInput){
            case "nombreGenerico": validarEventoInput("nombresGenericos", palabra, input, inputHiddenNombreGenerico); break;
            case "concentracion": validarEventoInput("concentraciones", palabra, input, inputHiddenConcentracion); break;
            case "formaFarmaceutica": validarEventoInput("formasFarmaceuticas", palabra, input, inputHiddenFormaFarmaceutica);break;
            case "presentacion": validarEventoInput("presentaciones", palabra, input, inputHiddenPresentacion);break;
            case "categoria": validarEventoInput("categorias", palabra, input, inputHiddenCategoria);break;
            case "familia": validarEventoInput("familias", palabra, input, inputHiddenFamilia);break;
        }
    }
})

const validacionAlRegistrar = () => {
    let sePuede = validarInputsVacios();
    const medicamento = {};
    if(sePuede){
        //ARMAMOS EL MEDICAMENTO CON EL ID DE LOS ELEMENTOS O SI NO CON EL NOMBRE PARA CREAR UNO NUEVO...
        inputHiddenNombreGenerico.getAttribute("data-value") > 0? medicamento.nombreGenerico = inputHiddenNombreGenerico.getAttribute("data-value"):medicamento.nombreGenerico = inputHiddenNombreGenerico.value;
        medicamento.nombreComercial = inputNombreComercial.value;
        inputHiddenConcentracion.getAttribute("data-value") > 0? medicamento.concentracion = inputHiddenConcentracion.getAttribute("data-value"):medicamento.concentracion = inputHiddenConcentracion.value;
        inputHiddenFormaFarmaceutica.getAttribute("data-value") > 0? medicamento.formaFarmaceutica = inputHiddenFormaFarmaceutica.getAttribute("data-value"):medicamento.formaFarmaceutica = inputHiddenFormaFarmaceutica.value;
        inputHiddenPresentacion.getAttribute("data-value") > 0? medicamento.presentacion = inputHiddenPresentacion.getAttribute("data-value"):medicamento.presentacion = inputHiddenPresentacion.value;
        inputHiddenCategoria.getAttribute("data-value") > 0? medicamento.categoria = inputHiddenCategoria.getAttribute("data-value"):medicamento.categoria = inputHiddenCategoria.value;
        inputHiddenFamilia.getAttribute("data-value") > 0? medicamento.familia = inputHiddenFamilia.getAttribute("data-value"):medicamento.familia = inputHiddenFamilia.value;
        medicamento.idMedicamentoDetalle = botonGuardarEdicion.getAttribute("data-value");
        return medicamento;
    }else{
        return false;
    }
}

// funcion que valida si lo que ingresa es igual a algun elemento del data list. Si no, borde rojo...
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
        }
    }else{
        hidden.removeAttribute("data-value"); //borramos el atributo del input hidden
        hidden.value = ""; //borramos el cotenido del input hidden
        input.style.border = "2px solid red";
    }
    return idInput;
}

const validarInputsVacios = () => {
    const checkeo = (inputHidden, inputVisible) => {
        if(!inputHidden.getAttribute("data-value")){
            marcarConRojo(inputVisible);
            todoCorrecto = false;
        }
    }
    let todoCorrecto = true;
    //CHEQUEAMOS DE QUE ESTEN TODOS LOS INPUT HIDDEN LLENOS SI NO MARCAMOS CON ROJO Y QUE EL NOMBRE COMERCIAL TENGA CONTENIDO
    checkeo(inputHiddenNombreGenerico, inputNombreGenerico);
    checkeo(inputHiddenConcentracion, inputConcentracion);
    checkeo(inputHiddenFormaFarmaceutica, inputFormaFarmaceutica);
    checkeo(inputHiddenPresentacion, inputPresentacion);
    checkeo(inputHiddenCategoria, inputCategoria);
    checkeo(inputHiddenFamilia, inputFamilia);
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