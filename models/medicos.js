import pool from "./database.js";
import bcrypt from "bcrypt";
import { getEspecialidadesByIdMedico, insertMedicoEspecialidad } from "./especialidades.js";

const getAllDoctors = async() => { //funcion que obtiene todos los medicos para el select
    try{
        const doctors = await pool.query("SELECT * FROM medico WHERE estado = 1");
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
        // const passwordHasheada = await bcrypt.hash(documento, 8);
        try {
            const resultado = await pool.query(query, [nombre, apellido, documento, idProfesion, domicilio, matricula, idRefeps, idMedico]);
        // let idUsuario = await connection.query("SELECT idUsuario FROM medico WHERE idMedico = ?", [idMedico]);
        // idUsuario = idUsuario[0][0].idUsuario;
        // const usuario = await connection.query("SELECT * FROM usuario WHERE idUsuario = ?", [idUsuario]);
        // let nombreUsuario = usuario[0][0].nombreUsuario; 
        // let password = usuario[0][0].password;
        // if(!(nombreUsuario === documento && await bcrypt.compare(documento, password))){
        //     const resultadoUU = await connection.query("UPDATE usuario SET nombreUsuario=?, password=? WHERE idUsuario = ?",[documento, passwordHasheada, idUsuario]);          
        // }
        // if(especialidad.length > 0){
        //     const especialidadesYaCargadas = await getEspecialidadesByIdMedico(idMedico)[0];
        //     let especialidadesEnBD = especialidadesYaCargadas[0].map(e => e.idEspecialidad);
        //     //chequeamos de que si no esta la especialidad cargada para ese médico, se la agregamos
        //     for(let especial of especialidad){ 
        //         if(!(especialidadesEnBD.includes(especial))){
        //             await insertMedicoEspecialidad(idMedico, especial);
        //             }
        //             }
        // }
            return resultado;
        } catch (error){
            throw error;
        }
}

const borrarMedico = async() => {
    try {
        const resultado = await pool.query("UPDATE medico estado=0");
        return resultado;
    } catch (error) {
        throw error;        
    }
}

export {getAllDoctors, insertDoctor, getDoctorById, actualizarMedico, borrarMedico, getIdUsuarioByIdMedico}