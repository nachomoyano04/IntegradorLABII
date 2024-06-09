import pool from "./database.js";
import { getPlanById } from "./planes.js";

const getObrasSociales = async () => {
    const query = "SELECT * FROM obra_social";
    try {
        const resultado = await pool.query(query);
        return resultado[0];
    } catch (error) {
        throw error;
    }
}

const getObraSocialByIdPlan = async (idPlan) => {
    const connection = await pool.getConnection();
    const query = "SELECT * FROM obra_social WHERE idObraSocial = ?";
    try {
        await connection.beginTransaction()
        const {idObraSocial} = await getPlanById(idPlan);
        const resultado = await pool.query(query, [idObraSocial]);
        await connection.commit();
        return resultado[0][0];
    } catch (error) {
        await connection.rollback();
        throw error;
    }finally{
        connection.release();
    }

}

export { getObrasSociales, getObraSocialByIdPlan }