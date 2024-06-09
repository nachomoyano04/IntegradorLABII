import pool from "./database.js";

const insertPacientePlan = async (idPaciente, idPlan) => {
    const query = "INSERT INTO paciente_plan (idPaciente, idPlan) VALUES (?,?)";
    try {
        const resultado = await pool.query(query, [idPaciente, idPlan]);
        return resultado[0];
    } catch (error) {
        throw error;
    }
}

const borrarPlanPaciente = async (idPaciente, idPlan) => {
    const query = "DELETE FROM paciente_plan WHERE idPaciente = ? AND idPlan = ?";
    try {
        const resultado = await pool.query(query, [idPaciente, idPlan]);
        return resultado[0].affectedRows;
    } catch (error) {
        throw error;
    }
}

export {insertPacientePlan, borrarPlanPaciente};