import pool from "./database.js";

const getMedicamento = async() => {
    // const query = `SELECT * FROM medicamento m JOIN medicamentoconcentracion mc ON(m.idMedicamento = mc.idMedicamento)JOIN concentracion c ON(mc.idConcentracion = c.id)JOIN medicamentoforma mf ON(m.idMedicamento = mf.idMedicamento)JOIN formaFarmaceutica f ON(mf.idFormaFarmaceutica = f.id)JOIN medicamentopresentacion mp ON(m.idMedicamento = mp.idMedicamento)JOIN presentacion p ON(mp.idPresentacion = p.id)`
    const query =  `SELECT *
                    FROM
                        medicamentodetalle md
                    JOIN medicamento m ON md.idMedicamento = m.idMedicamento
                    JOIN concentracion c ON md.idConcentracion = c.idConcentracion
                    JOIN formafarmaceutica f ON md.idFormaFarmaceutica = f.idFormaFarmaceutica
                    JOIN presentacion p ON md.idPresentacion = p.idPresentacion`
    try{
        const resultado = await pool.query(query)
        return resultado;
    }catch{
        throw error;
    }
}

const searchIdMedicamento = async(medicamento) => {
    const query = `SELECT idMedicamento from medicamento WHERE `
}

export {/*searchIdMedicamento, */getMedicamento};