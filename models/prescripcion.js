import pool from "./database.js";

const getMedicamento = async(letras) => {
    const query = "SELECT...";
    try{
        const resultado = await pool.query(query, {letras})
    }catch{
        return error;
    }
}