import { getAllDoctors } from "../models/medicos.js";
import { getAllPatients } from "../models/pacientes.js";

const inicioGet = async(req, res) => { //funcion que renderiza el form prescribir obteniendo los medicos y pacientes 
let medicos = await getAllDoctors();
    let pacientes = await getAllPatients();
    medicos = medicos[0];
    pacientes = pacientes[0];
    res.render("prescribir", {medicos, pacientes});
}

export {inicioGet}