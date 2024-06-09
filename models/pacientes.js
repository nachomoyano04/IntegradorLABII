import pool from "./database.js";

const getAllPatients = async() => { //funcion que obtiene todos los pacientes para el select
    const query = "SELECT * FROM paciente WHERE estado = 1";
    try{
        const patients = await pool.query(query);
        return patients[0];
    }catch(error){
        console.log(`Error: ${error}`);
        throw error;
    }
}

const insertPatient = async (nombre, apellido, documento, fechaNacimiento, sexo) => {
    const query = "INSERT INTO paciente (nombre, apellido, documento, fechaNacimiento, sexo, estado) VALUES (?,?,?,?,?,?)";
    try {
        const resultado = await pool.query(query, [nombre, apellido, documento, fechaNacimiento, sexo, 1]);
        return resultado[0].insertId;
    } catch (error) {
        throw error;
    }
}

export {getAllPatients, insertPatient};