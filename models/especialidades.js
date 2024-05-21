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

export {getEspecialidades}