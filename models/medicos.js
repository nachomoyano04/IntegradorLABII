import pool from "./database.js";

const getAllDoctors = async() => { //funcion que obtiene todos los medicos para el select
    try{
        const doctors = await pool.query("SELECT * FROM medico");
        return doctors;
    }catch(error){
        throw error;
    }
}

const insertDoctor = async(nombre,apellido,documento,idProfesion,domicilio,matricula,idRefeps,idUsuario) => {
    const query = "INSERT INTO medico (nombre,apellido,documento,idProfesion,domicilio,matricula,idRefeps,idUsuario,estado) VALUES (?,?,?,?,?,?,?,?,?)";
    try {
        const resultado = await pool.query(query, [nombre,apellido,documento,idProfesion,domicilio,matricula,idRefeps,idUsuario,1]); 
        console.log(resultado)
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

const getIdUsuarioByIdMedico = async (idMedico) => {
    try {
        let idUsuario = await pool.query("SELECT idUsuario FROM medico WHERE idMedico = ?", [idMedico]);
        return idUsuario[0][0].idUsuario;
    } catch (error) {
        throw error;
    }
}
    
    
const actualizarMedico = async(nombre, apellido, documento, idProfesion, domicilio, matricula, idRefeps, idMedico) => {
    const query = "UPDATE medico SET nombre=?,apellido=?,documento=?,idProfesion=?,domicilio=?,matricula=?,idRefeps=? WHERE idMedico = ?";
    try {
        const resultado = await pool.query(query, [nombre, apellido, documento, idProfesion, domicilio, matricula, idRefeps, idMedico]);
        return resultado;
    } catch (error){
        throw error;
    }
}

const getMedicoByIdUsuario = async (idUsuario) => {
    try {
        const resultado = await pool.query("SELECT * FROM medico WHERE idUsuario = ?", [idUsuario]);
        return resultado[0];
    } catch (error) {
        throw error;
    }
}

const borrarMedico = async(idMedico) => {
    const query = "UPDATE medico SET estado = 0 WHERE idMedico = ?";
    try {
        const resultado = await pool.query(query, [idMedico]);
        return resultado;
    } catch (error) {
        throw error;        
    }
}

const toRegisterMedico = async(idMedico) => {
    try {
        const res = await pool.query("UPDATE medico SET estado = 1 WHERE idMedico = ?", [idMedico]);
        return res[0].affectedRows;
    } catch (error) {
        throw error;
    }
}

export {getAllDoctors, insertDoctor, getDoctorById, actualizarMedico, borrarMedico, getIdUsuarioByIdMedico, getMedicoByIdUsuario, toRegisterMedico}