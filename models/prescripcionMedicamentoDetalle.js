import pool from "./database.js";

const insertPrescripcionMedicamentoDetalle = async(idPrescripcion, idMedicamentoDetalle, dosis, duracion, intervalo) => {
    const query = "INSERT INTO prescripcion_medicamentodetalle (idPrescripcion, idMedicamentoDetalle, dosis, duracion, intervalo) VALUES (?,?,?,?,?)";
    try {
        const resultado = await pool.query(query, [idPrescripcion, idMedicamentoDetalle, dosis, duracion, intervalo]);
        return resultado[0].insertId;
    } catch (error) {
        throw error;
    }
}

export {insertPrescripcionMedicamentoDetalle};