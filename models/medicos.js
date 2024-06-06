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
    const query = "INSERT INTO medico (nombre,apellido,documento,idProfesion,domicilio,matricula,idRefeps,idUsuario) VALUES (?,?,?,?,?,?,?,?)";
    try {
        const resultado = await pool.query(query, [nombre,apellido,documento,idProfesion,domicilio,matricula,idRefeps,idUsuario]); 
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

export {getAllDoctors, insertDoctor, getDoctorById}