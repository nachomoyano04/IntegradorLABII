import pool from "./database.js";

const getPlanByIdPaciente = async (idPaciente) => {
    const query = `SELECT * FROM paciente_plan WHERE idPaciente = ?`;
    try {
        const resultado = await pool.query(query, [idPaciente]);
        return resultado[0];
    } catch (error) {
        throw error;
    }
}

const getPlanById = async (idPlan) => {
    try {
        const plan = await pool.query("SELECT * FROM  plan WHERE idPlan = ?", [idPlan]);
        return plan[0][0];
    } catch (error) {
        
    }
}


const getPlanes = async () => {
    const query = "SELECT * FROM plan";
    try {
        const planes = await pool.query(query);
        return planes[0];
    } catch (error) {
        throw error;
    }
}


export { getPlanById, getPlanes, getPlanByIdPaciente }