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

const getNombresGenericos = async() => {
    try {
        const resultado = await pool.query("SELECT * FROM medicamento");
        return resultado[0];
    } catch (error) {
        throw error;
    }
}
const getFamilias = async() => {
    try {
        const resultado = await pool.query("SELECT * FROM familia");
        return resultado[0];
    } catch (error) {
        throw error;
    }
}
const getCategorias = async() => {
    try {
        const resultado = await pool.query("SELECT * FROM categoria");
        return resultado[0];
    } catch (error) {
        throw error;
    }
}
const getConcentraciones = async() => {
    try {
        const resultado = await pool.query("SELECT * FROM concentracion");
        return resultado[0];
    } catch (error) {
        throw error;
    }
}
const getFormasFarmaceuticas = async() => {
    try {
        const resultado = await pool.query("SELECT * FROM formaFarmaceutica");
        return resultado[0];
    } catch (error) {
        throw error;
    }
}
const getPresentaciones = async() => {
    try {
        const resultado = await pool.query("SELECT * FROM presentacion");
        return resultado[0];
    } catch (error) {
        throw error;
    }
}


const updateStatusMedicamento = async(idMedicamentoDetalle) => {
    const query = "UPDATE medicamentodetalle SET estado = 1 WHERE id = ?";
    try {
        const resultado = await pool.query(query, [idMedicamentoDetalle]);
        return resultado[0].affectedRows;
    } catch (error) {
        throw error;
    }
}

const logicDeleteMedicamento = async(idMedicamentoDetalle) => {
    const query = "UPDATE medicamentodetalle SET estado = 0 WHERE id = ?";
    try {
        const resultado = await pool.query(query, [idMedicamentoDetalle]);
        return resultado[0].affectedRows;
    } catch (error) {
        throw error;
    }
}

const updateMedicamento = async(idMedicamentoDetalle, idMedicamento, idConcentracion, idFormaFarmaceutica, idPresentacion) => {
    const query = "UPDATE medicamentodetalle SET idMedicamento = ?, idConcentracion = ?, idFormaFarmaceutica = ?, idPresentacion = ? WHERE id = ?";
    try {
        const resultado = await pool.query(query, [idMedicamento, idConcentracion, idFormaFarmaceutica, idPresentacion, idMedicamentoDetalle]);
        return resultado[0].affectedRows;
    } catch (error) {
        throw error;
    }
}

const insertMedicamento = async (idMedicamento, idConcentracion, idFormaFarmaceutica, idPresentacion) => {
    const query = "INSERT INTO medicamentodetalle (idMedicamento,idConcentracion,idFormaFarmaceutica,idPresentacion,estado) VALUES (?,?,?,?,?)";
    try {
        const resultado = await pool.query(query, [idMedicamento, idConcentracion, idFormaFarmaceutica, idPresentacion, 1]);
        return resultado[0].affectedRows;
    } catch (error) {
        throw error;
    }
}

export {getMedicamento, updateStatusMedicamento, logicDeleteMedicamento, updateMedicamento, insertMedicamento, getNombresGenericos, getFamilias, getCategorias, getConcentraciones, getFormasFarmaceuticas, getPresentaciones};