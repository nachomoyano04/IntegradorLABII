import { insertDoctor } from "../models/medicos.js";

const registroMedicoGet = (req, res) => {
    res.render("registrarMedico",{})
}

const insertarDoctorPost = (req, res) => {
    const {nombre, apellido, documento, profesion, especialidad, domicilio, matricula, idRefeps} = req.body;
    try{
        insertDoctor(nombre, apellido, documento, profesion, especialidad, domicilio, matricula, idRefeps);
        res.redirect("/");
    }catch(error){
        console.log(`ERROR: error.message()`);
    }
}

export {registroMedicoGet, insertarDoctorPost};