import { insertDoctor } from "../models/medicos.js";

const registroMedicoGet = (req, res) => {
    res.render("registrarMedico",{})
}

const insertarDoctorPost = async (req, res) => {
    const {nombre, apellido, documento, profesion, especialidad, domicilio, matricula, idRefeps} = req.body;
    try{
        const resultado = await insertDoctor(nombre, apellido, documento, profesion, especialidad, domicilio, matricula, idRefeps);
        if(resultado instanceof Error){
            throw error;
        }
        res.redirect("/");
    }catch(error){
            res.status(500).send("Error interno en el servidor")
    }
}

export {registroMedicoGet, insertarDoctorPost};