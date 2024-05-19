let a  = document.querySelector("#inputMedicamentoPrescripcion");
let autocompletado = document.querySelector(".autocompletadoMedicamentos");
a.addEventListener("input", (evento) => {
    let input = evento.target.value;
    console.log(input);
    if(input.length === 3){
        axios(`http://localhost:3000/prescribir?query=${input}`)
        .then(res => {
            let medicamento = res.data;
            if(medicamento !== ""){
                console.log(autocompletado.hasChildNodes())
                if(autocompletado.hasChildNodes()){
                    while(autocompletado.hasChildNodes()){
                        console.log(autocompletado.firstChild)
                        autocompletado.removeChild(autocompletado.firstChild);
                    }
                }
                for(let m of medicamento){
                    const {nombreGenerico, cantidad, unidad, forma, unidadMedida} = m;
                    let div = document.createElement("div");
                    div.innerHTML = `${nombreGenerico} ${cantidad} ${unidad} ${forma} ${unidadMedida}`;
                    autocompletado.appendChild(div)
                }
            }
        })
        .catch(error => console.log(error));
    }
})