import pool from "./database.js";

const getObrasSociales = async () => {
    const query = "SELECT * FROM obra_social";
    try {
        const resultado = await pool.query(query);
        return resultado[0];
    } catch (error) {
        throw error;
    }
}

export { getObrasSociales }