let inputBuscarMedicamentos = document.querySelector("#inputBuscarMedicamentos");
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
    let boton = evento.target.closest("button");
    let action = boton.dataset.action;
    let idMedicamentoDetalle = boton.dataset.idMedicamentoDetalle;
    if(action === "darDeAlta"){
        darDeAltaMedicamento(idMedicamentoDetalle);
        console.log("DANDO DE ALTA EL medicamento con id: "+idMedicamentoDetalle);
    }else if(action === "borrar"){
        borrarMedicamento(idMedicamentoDetalle);
        console.log("BORRANDO EL medicamento con id: "+idMedicamentoDetalle);
    }else if(action === "editar"){
        editarMedicamento(idMedicamentoDetalle);
        console.log("EDITANDO EL medicamento con id: "+idMedicamentoDetalle);
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


const editarMedicamento = () => {

}


//MOSTRAR MENSAJE ESTILO SWEET ALERT
const mostrarMensaje = (icono, mensaje, timer, url) => {
    Swal.fire({
        icon: icono,
        title: mensaje,
        timer: timer || 0
    }).then(() => {
        window.location.href = url;
    })
}