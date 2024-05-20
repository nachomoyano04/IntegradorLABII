import { getAllDoctors } from "../models/medicos.js";
import { getAllPatients } from "../models/pacientes.js";
import { getMedicamento } from "../models/medicamentos.js";
import { getPrestaciones } from "../models/prestaciones.js";

const prescribirGet = async(req, res) => { //funcion que renderiza el form prescribir obteniendo los medicos y pacientes 
    let queryMedicamento = req.query.query;
    // console.log(req.originalUrl)
    // console.log(`Query Medicamento: ${queryMedicamento}`)
    if(queryMedicamento === "medicamentos"){
        let medicamentos = await getMedicamento();
        let prestaciones = await getPrestaciones();
        if(medicamentos[0].length > 0){
            return res.status(200).send({medicamentos: medicamentos[0], prestaciones: prestaciones[0]})
        }
        return res.status(200).send("");
    }else{
        let medicos = await getAllDoctors();
        let pacientes = await getAllPatients();
        medicos = medicos[0];
        pacientes = pacientes[0];
        res.render("prescribir", {medicos, pacientes});
    }
}   


export {prescribirGet};