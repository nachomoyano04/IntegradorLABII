import pool from "./database.js";

const getAllDoctors = async() => { //funcion que obtiene todos los medicos para el select
    try{
        const doctors = await pool.query("SELECT * FROM medico");
        return doctors;
    }catch(error){
        throw error;
    }
}

const insertDoctor = async(medico) => {
    const query = "INSERT INTO medico SET ?";
    try {
        const resultado = await pool.query(query, medico); 
        return resultado;
    }catch(error){
        console.log(`Error: ${error.message}`);
        throw error;
    }
}

const getDoctorById = async (id) => {
    try{
        const doctor = await pool.query("SELECT * FROM medico WHERE idMedico = ?", id);
        return doctor;
    }catch(error){ 
        throw error;
    }
}

export {getAllDoctors, insertDoctor, getDoctorById}