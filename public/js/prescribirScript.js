let inputMedicamentos  = document.querySelector("#inputMedicamentoPrescripcion");
let inputPrestaciones = document.querySelector("#inputPrestacionPrescripcion");
let autocompletadoPrestacion = document.querySelector(".autocompletadoPrestaciones");
let autocompletadoMedicamento = document.querySelector(".autocompletadoMedicamentos");
let bodyInicio = document.querySelector(".bodyInicio");
axios('http://localhost:3000/prescribir?query=medicamentos')
.then(res => {
    inputMedicamentos.addEventListener("input", (evento) => {
        let palabra = evento.target.value;
        let medicamentos = res.data.medicamentos;
        let medicamentosEnString = medicamentos.map(e => e.nombreGenerico.concat(" ", e.cantidadConcentracion, " ",e.unidadMedidaCon, " ", e.forma, " x", e.cantidadPresentacion , " ", e.unidadMedidaPres));
        if(palabra !== ""){
            borrarAutocompletadoAnterior(autocompletadoMedicamento);
            let medicamentoRecomendado = medicamentosEnString.filter(e => e.toLowerCase().includes(palabra.toLowerCase()));
            for(let mr of medicamentoRecomendado){
                let div = document.createElement("div");
                div.innerHTML = mr;
                autocompletadoMedicamento.appendChild(div);
                div.addEventListener("click", () => {
                    inputMedicamentos.value = mr;
                    borrarAutocompletadoAnterior(autocompletadoMedicamento)
                })
            }
        }else if(palabra === ""){
            borrarAutocompletadoAnterior(autocompletadoMedicamento)
        }
    })
    inputPrestaciones.addEventListener("input", (evento) => {
        let palabra = evento.target.value;
        let arregloDePrestaciones = res.data.prestaciones;
        // console.log(arregloDePrestaciones);
        let prestacionesEnString = arregloDePrestaciones.map(e => JSON.stringify(e));
        borrarAutocompletadoAnterior(autocompletadoPrestacion);
        if(palabra !== ""){
            let prestaciones = prestacionesEnString.filter(e => e.toLowerCase().includes(palabra.toLowerCase()));
            // console.log(prestaciones);
            for(let p of prestaciones){
                let div = document.createElement("div");
                let pre = JSON.parse(p);
                div.appendChild(crearPrestacion(pre));
                autocompletadoPrestacion.appendChild(div);
                div.addEventListener("click", (evento) => {
                    inputPrestaciones.value = `${pre.nombre};${pre.lado};${pre.indicacion};${pre.justificacion};${pre.resultado}`;
                    borrarAutocompletadoAnterior(autocompletadoPrestacion)
                    let idPrestacion = document.getElementById("idPrestacion");
                    idPrestacion.value = pre.idPrestacion;
                })
            }
        }else{
            borrarAutocompletadoAnterior(autocompletadoPrestacion);
        }
    })
    bodyInicio.addEventListener("click", () => { //para borrar los autocompletados cuando toquen cualquier parte del body
        borrarAutocompletadoAnterior(autocompletadoMedicamento);
        borrarAutocompletadoAnterior(autocompletadoPrestacion);
    })
})
const borrarAutocompletadoAnterior = (autocompletador) => {
    while(autocompletador.hasChildNodes()){
        autocompletador.removeChild(autocompletador.firstChild);
    }
}

const crearPrestacion = (prestacion) => {
    let ul = document.createElement("ul");
    let liNombre = document.createElement("li");
    let liLado = document.createElement("li");
    let liIndicacion = document.createElement("li");
    let liJustificacion = document.createElement("li");
    let liResultado = document.createElement("li");
    liNombre.innerHTML = `${prestacion.nombre}`;
    liLado.innerHTML = `lado: ${prestacion.lado}`;
    liIndicacion.innerHTML = `indicación: ${prestacion.indicacion}`;
    liJustificacion.innerHTML = `justificación: ${prestacion.justificacion}`;
    liResultado.innerHTML = `resultado: ${prestacion.resultado}`;
    ul.appendChild(liNombre)
    ul.appendChild(liLado)
    ul.appendChild(liIndicacion)
    ul.appendChild(liJustificacion)
    ul.appendChild(liResultado)
    return ul;
}
        // axios(`http://localhost:3000/prescribir?query=${input}`)
        // .then(res => {
        //     let medicamento = res.data;
        //     if(medicamento !== ""){
        //         console.log(autocompletadoMedicamento.hasChildNodes())                       //Opcion 1 consultando cada 3 letras a la BD
        //         while(autocompletadoMedicamento.hasChildNodes()){
        //             autocompletadoMedicamento.removeChild(autocompletadoMedicamento.firstChild);
        //         }
        //         for(let m of medicamento){
        //             const {nombreGenerico, cantidad, unidad, forma, unidadMedida} = m;
        //             let div = document.createElement("div");
        //             div.innerHTML = `${nombreGenerico} ${cantidad} ${unidad} ${forma} ${unidadMedida}`;
        //             autocompletadoMedicamento.appendChild(div)
        //         }
        //     }
        // })
        // .catch(error => console.log(error));
