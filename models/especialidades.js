import pool from "./database.js";

const getEspecialidades =  async () => {
    const query = "SELECT * FROM especialidad";
    try {
        const resultado = await pool.query(query);
        return resultado[0];
    } catch (error) {
        throw error;
    }
}

const insertMedicoEspecialidad = async (idMedico, idEspecialidad) => {
    const query = "INSERT INTO medico_especialidad (idMedico, idEspecialidad) VALUES (?,?)";
    try {
        const resultado = await pool.query(query, [idMedico, idEspecialidad]);
        return resultado;
    } catch (error) {
        throw error;
    }
}

// const getEspecialidadById

export {getEspecialidades, insertMedicoEspecialidad}