let inputMedicamentos  = document.querySelector("#inputMedicamentoPrescripcion");
let inputPrestaciones = document.querySelector("#inputPrestacionPrescripcion");
let autocompletadoPrestacion = document.querySelector(".autocompletadoPrestaciones");
let autocompletadoMedicamento = document.querySelector(".autocompletadoMedicamentos");
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
        let prestacionesEnString = arregloDePrestaciones.map(e => e.nombre.concat(" lado: ",e.lado," indicación: ", e.indicacion, " justificacion: ", e.justificacion))
        borrarAutocompletadoAnterior(autocompletadoPrestacion);
        if(palabra !== ""){
            let prestaciones = prestacionesEnString.filter(e => e.toLowerCase().includes(palabra.toLowerCase()));
            for(let p of prestaciones){
                let div = document.createElement("div");
                div.innerHTML = p;
                autocompletadoPrestacion.appendChild(div);
            }
        }else{
            borrarAutocompletadoAnterior(autocompletadoPrestacion);
        }
    })
})
const borrarAutocompletadoAnterior = (autocompletador) => {
    while(autocompletador.hasChildNodes()){
        autocompletador.removeChild(autocompletador.firstChild);
    }
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
