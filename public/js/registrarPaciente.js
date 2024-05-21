let selectObraSocial = document.querySelector("#selectObraSocial");
let selectPlan = document.querySelector("#selectPlan");

const borrarOpcionesAnteriores = (select) => {
    while(select.hasChildNodes()){
        select.removeChild(select.firstChild);
    }
}

if(selectObraSocial.childNodes.length > 1){
    selectPlan.disabled = false;
    selectObraSocial.addEventListener("change", (event) => {
        const idObraSocial = event.target.value;
        borrarOpcionesAnteriores(selectPlan);
        axios(`http://localhost:3000/registrar/paciente/${idObraSocial}`)
        .then(res => {
            const planes = res.data;
            for(let p of planes){
                let option = document.createElement("option");
                option.innerHTML = p.tipo;
                option.value = p.idPlan;
                selectPlan.appendChild(option);
            }
        });
    })
}

