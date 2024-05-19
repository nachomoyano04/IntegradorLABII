import pool from "./database.js";

const getMedicamento = async(letras) => {
    const query = `
        SELECT m.nombreGenerico, c.cantidad, c.unidad, f.forma, p.cantidad, p.unidadMedida  
        FROM medicamento m 
            JOIN medicamentoconcentracion mc ON(m.idMedicamento = mc.idMedicamento)
            JOIN concentracion c ON(mc.idConcentracion = c.id)
            JOIN medicamentoforma mf ON(m.idMedicamento = mf.idMedicamento)
            JOIN formaFarmaceutica f ON(mf.idFormaFarmaceutica = f.id)
            JOIN medicamentopresentacion mp ON(m.idMedicamento = mp.idMedicamento)
            JOIN presentacion p ON(mp.idPresentacion = p.id)
        WHERE
            m.nombreGenerico LIKE "%${letras}%"
        `
    try{
        const resultado = await pool.query(query)
        return resultado;
    }catch{
        return error;
    }
}

export {getMedicamento};