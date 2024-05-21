import pool from "./database.js";

const getObrasSocialPlanByIDs = async (idObraSocial, idPlan) => {
    const query = "SELECT * FROM obra_social_plan WHERE idObraSocial = ? AND idPlan = ?"
    try {
        const resultado = await pool.query(query, [idObraSocial, idPlan]);
        return resultado[0];
    } catch (error) {
        throw error;
    }
}

export {getObrasSocialPlanByIDs};