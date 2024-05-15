import pool from "./database.js";

const getAllPatients = () => { //funcion que obtiene todos los pacientes para el select
    const query = "SELECT * FROM paciente";
    try{
        const patients = pool.query(query);
        return patients;
    }catch(error){
        console.log(`Error: ${error}`);
        return error;
    }
}

export {getAllPatients};