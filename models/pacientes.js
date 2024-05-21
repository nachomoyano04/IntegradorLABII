import pool from "./database.js";

const getAllPatients = async() => { //funcion que obtiene todos los pacientes para el select
    const query = "SELECT * FROM paciente";
    try{
        const patients = await pool.query(query);
        return patients;
    }catch(error){
        console.log(`Error: ${error}`);
        throw error;
    }
}

const insertPatient = async (paciente) => {
    const query = "INSERT INTO paciente SET ?";
    try {
        const resultado = await pool.query(query, paciente);
        return resultado;
    } catch (error) {
        throw error;
    }
}

export {getAllPatients, insertPatient};