import pool from "./database.js";

const insertPrescripcionPrestacion = async (idPrescripcion, idPrestacion) => {
    const query = "INSERT INTO prescripcion_prestacion (idPrescripcion, idPrestacion) VALUES (?,?)";
    try {
        const resultado = await pool.query(query, [idPrescripcion, idPrestacion]);
        return resultado;
    } catch (error) {
        throw error;
    }
}

const updateResultadoPrestacion = async(resultado, idPrestacion, idPrescripcion) => {
    const query = "UPDATE prescripcion_prestacion SET resultadoPrestacion = ? WHERE idPrestacion = ? and idPrescripcion = ?";
    try {
        const result = await pool.query(query, [resultado, idPrestacion, idPrescripcion])
        return result;
    } catch (error) {
        throw error;
    }
}

export { insertPrescripcionPrestacion, updateResultadoPrestacion };