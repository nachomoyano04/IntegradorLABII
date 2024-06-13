import pool from "./database.js";

const getAllPatients = async() => { //funcion que obtiene todos los pacientes para el select
    const query = "SELECT * FROM paciente";
    try{
        const patients = await pool.query(query);
        return patients[0];
    }catch(error){
        console.log(`Error: ${error}`);
        throw error;
    }
}

const getPatientByDocumento = async(documento) => {
    try {
        const paciente = await pool.query("SELECT * FROM paciente WHERE documento = ?", [documento]);
        return paciente[0][0];
    } catch (error) {
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

const updatePatient = async (nombre, apellido, documento, fechaNacimiento, sexo, idPaciente) => {
    const query = "UPDATE paciente SET nombre=?, apellido=?, documento=?, fechaNacimiento=?, sexo=? WHERE idPaciente = ?";
    try {
        const resultado = await pool.query(query, [nombre, apellido, documento, fechaNacimiento, sexo, idPaciente]);
        return resultado[0].affectedRows;
    } catch (error) {
        throw error;
    }
}

const deletePatient = async (idPaciente) => {
    try {
        const resultado = await pool.query("UPDATE paciente SET estado = 0 WHERE idPaciente = ?", [idPaciente]);
        return resultado[0].affectedRows;
    } catch (error) {
        throw error;
    }
}

const toRegisterPatient = async(idPaciente) => {
    try {
        const resultado = await pool.query("UPDATE paciente SET estado = 1 WHERE idPaciente = ?", [idPaciente]);
        return resultado[0].affectedRows
    } catch (error) {
        throw error;
    }
}


export {getAllPatients, insertPatient, updatePatient, deletePatient, getPatientByDocumento, toRegisterPatient};