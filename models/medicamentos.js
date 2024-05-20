import pool from "./database.js";

// const getMedicamento = async(letras) => {           //Con opcion 1 de consulta cada 3 letras
const getMedicamento = async() => {
    const query = `
        SELECT *
        FROM medicamento m 
            JOIN medicamentoconcentracion mc ON(m.idMedicamento = mc.idMedicamento)
            JOIN concentracion c ON(mc.idConcentracion = c.id)
            JOIN medicamentoforma mf ON(m.idMedicamento = mf.idMedicamento)
            JOIN formaFarmaceutica f ON(mf.idFormaFarmaceutica = f.id)
            JOIN medicamentopresentacion mp ON(m.idMedicamento = mp.idMedicamento)
            JOIN presentacion p ON(mp.idPresentacion = p.id)
            `
        // WHERE
        // m.nombreGenerico LIKE "%${letras}%"    // Con opcion 1 de consulta cada 3 letras
    try{
        const resultado = await pool.query(query)
        return resultado;
    }catch{
        return error;
    }
}

const searchIdMedicamento = async(medicamento) => {
    const query = `SELECT idMedicamento from medicamento WHERE `
}

export {/*searchIdMedicamento, */getMedicamento};