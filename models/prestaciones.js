import pool from "./database.js";

const getPrestaciones = async () => {
    const query = `SELECT * FROM prestacion`
    try{
        const resultado = await pool.query(query);
        return resultado;
    }catch(error){
        return error;
    }
}
export {getPrestaciones};