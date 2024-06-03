import pool from "./database.js";

const buscarUsersByUsuarioYPassword = async (usuario, password) => {
    const query = "SELECT * FROM usuario WHERE nombreUsuario = ? AND password = ?";
    try {
        const resultado = await pool.query(query, [usuario, password]);
        return resultado;
    } catch (error) {
        throw error;
    }
}
 
export {buscarUsersByUsuarioYPassword};