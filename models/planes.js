import pool from "./database.js";

const getPlanByIdObraSocial = async (idObraSocial) => {
    const query = `SELECT * 
                   FROM obra_social_plan 
                    JOIN plan AS p USING(idPlan)
                    JOIN obra_social AS os USING(idObraSocial)
                   WHERE os.idObraSocial = ${idObraSocial}`;

    try {
        const resultado = await pool.query(query);
        return resultado[0];
    } catch (error) {
        throw error;
    }
}

export { getPlanByIdObraSocial }