import pool from "./database.js";

const insertPrescripcionMedicamentoDetalle = async(prescripcion_medicamentodetalle) => {
    const query = "INSERT INTO prescripcion_medicamentodetalle (idPrescripcion, idMedicamentoDetalle, dosis, duracion, intervalo) VALUES (?,?,?,?,?)";
    const {idPrescripcion, idMedicamentoDetalle, dosis, duracion, intervalo} = prescripcion_medicamentodetalle;
    try {
        const resultado = await pool.query(query, [idPrescripcion, idMedicamentoDetalle, dosis, duracion, intervalo]);
        return resultado[0].insertId;
    } catch (error) {
        throw error;
    }
}

export {insertPrescripcionMedicamentoDetalle};