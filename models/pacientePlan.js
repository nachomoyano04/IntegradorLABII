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

export {insertPacientePlan};