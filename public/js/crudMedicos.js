let inputProfesionales = document.querySelector("#profesionales");

axios("http://localhost:3000/registrar/medico/profesionales")
.then(res => {
    let profesionales = res.data;
    if(profesionales.length > 0){
        profesionales.forEach(e => {
            let op = document.createElement("option");
            op.value = e;
            inputProfesionales.appendChild(op);
        })
    }else{

    }
})
.catch(error => console.log(error));
