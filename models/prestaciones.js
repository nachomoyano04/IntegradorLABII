import pool from "./database.js";

const getPrestaciones = async () => {
    const query = `SELECT p.idPrestacion, p.nombrePrestacion, p.indicacion, p.justificacion, p.estado, 
                    GROUP_CONCAT(l.nombreLado) AS nombresLados, GROUP_CONCAT(l.idLado) AS idsLados FROM prestacion p 
                    LEFT JOIN prestacion_lado pl ON p.idPrestacion = pl.idPrestacion 
                    LEFT JOIN lado l ON pl.idLado = l.idLado 
                    GROUP BY p.idPrestacion;`
    try{
        const resultado = await pool.query(query);
        return resultado;
    }catch(error){
        throw error;
    }
}

// const insertPrestacion = async (prestacion) => {
//     const query = "INSERT INTO prestacion SET ?";
//     try{
//         const resultado = await pool.query(query, prestacion);
//         return resultado;
//     }catch(error){
//         throw error;
//     }
// }

const getLados = async () => {
    const query = "SELECT * FROM lado";
    try {
        const resultado = await pool.query(query);
        return resultado[0];
    } catch (error) {
        throw error;
    }
}

const toRegisterPrestacion = async(idPrestacion) => {
    const query = "UPDATE prestacion SET estado = 1 WHERE idPrestacion = ?";
    try {
        const resultado = await pool.query(query, [idPrestacion]);
        return resultado;
    } catch (error) {
        throw error;
    }
}
const logicDeletePrestacion = async(idPrestacion) => {
    const query = "UPDATE prestacion SET estado = 0 WHERE idPrestacion = ?";
    try {
        const resultado = await pool.query(query, [idPrestacion]);
        return resultado;
    } catch (error) {
        throw error;
    }
}
const getPrestacionById = async(idPrestacion) => {
    console.log("idPrestacion");
    console.log(idPrestacion);
    const query = `SELECT p.idPrestacion, p.nombrePrestacion, p.indicacion, p.justificacion, p.estado, 
                    GROUP_CONCAT(l.nombreLado) AS nombresLados, GROUP_CONCAT(l.idLado) AS idsLados FROM prestacion p 
                    LEFT JOIN prestacion_lado pl ON p.idPrestacion = pl.idPrestacion 
                    LEFT JOIN lado l ON pl.idLado = l.idLado 
                    WHERE p.idPrestacion = ? 
                    GROUP BY p.idPrestacion;`;
    try {
        const resultado = await pool.query(query, [idPrestacion]);
        return resultado;
    } catch (error) {
        throw error;
    }
}

const updatePrestacion = async (nombrePrestacion, indicacion, justificacion, idPrestacion) => {
    const query = "UPDATE prestacion SET nombrePrestacion=?, indicacion=?, justificacion=? WHERE idPrestacion=?";
    try {
        const resultado = await pool.query(query, [nombrePrestacion, indicacion, justificacion, idPrestacion]);
        return resultado[0].affectedRows;
    } catch (error) {
        throw error;
    }

}

const insertPrestacion = async (nombrePrestacion, indicacion, justificacion) => {
    const query = "INSERT INTO prestacion (nombrePrestacion, indicacion, justificacion, estado) VALUES (?,?,?,?)";
    try {
        const resultado = await pool.query(query, [nombrePrestacion, indicacion, justificacion, 1]);
        return resultado[0].insertId;
    } catch (error) {
        throw error;
    }
}

const getLadosByPrestacion = async (idPrestacion) => {
    try {
        const resultado = await pool.query("SELECT l.idLado FROM prestacion p JOIN prestacion_lado pl ON p.idPrestacion = pl.idPrestacion JOIN lado l ON pl.idLado = l.idLado WHERE p.idPrestacion = ?", [idPrestacion]);
        return resultado[0];
    } catch (error) {
        throw error;
    }
}

const eliminarRelacionPrestacionLado = async(idLado, idPrestacion) => {
    try {
        const r = await pool.query("DELETE FROM prestacion_lado WHERE idLado = ? AND idPrestacion = ?", [idLado, idPrestacion]);
        return r[0].affectedRows;
    } catch (error) {
        throw error;
    }
}

const agregarRelacionPrestacionLado = async(idLado, idPrestacion) => {
    try {
        const r = await pool.query("INSERT INTO prestacion_lado(idLado, idPrestacion) VALUES (?,?)", [idLado, idPrestacion]);
        return r[0].affectedRows;
    } catch (error) {
        throw error;
    }
}


export {toRegisterPrestacion, logicDeletePrestacion, getPrestacionById, getPrestaciones, insertPrestacion, getLados, updatePrestacion, getLadosByPrestacion, eliminarRelacionPrestacionLado, agregarRelacionPrestacionLado};