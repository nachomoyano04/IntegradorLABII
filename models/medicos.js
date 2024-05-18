import pool from "./database.js";

const getAllDoctors = () => { //funcion que obtiene todos los medicos para el select
    try{
        const doctors = pool.query("SELECT * FROM medico");
        return doctors;
    }catch(error){
        console.log(`Error: ${error}`);
        return error;
    }
}

const insertDoctor = async(nombre, apellido, documento, profesion, especialidad, domicilio, matricula, idRefeps) => {
    const query = "INSERT INTO medico SET ?";
    try {
        await pool.query(query, {nombre, apellido, documento, profesion, especialidad, domicilio, matricula, idRefeps}); 
    }catch(error){
        console.log(`Error: ${error.message}`);
        return error;
    }
}

const getDoctorById = async (id) => {
    try{
        const doctor = await pool.query("SELECT * FROM medico WHERE idMedico = ?", id);
        return doctor;
    }catch(error){
        return error;
    }
}

export {getAllDoctors, insertDoctor, getDoctorById}