import pool from "./database.js";

const getProfesiones = async () => {
    const query = "SELECT * FROM profesion";
    try {
        const resultado = await pool.query(query);
        return resultado[0];
    } catch(error) {
        throw error;
    }
}

export {getProfesiones}