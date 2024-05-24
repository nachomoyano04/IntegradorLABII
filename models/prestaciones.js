import pool from "./database.js";

// const searchIdPrestacion = async (prestacion) => {
//     const query = `SELECT idPrestacion FROM prestacion AS p WHERE p.nombre = ? AND p.lado = ? AND p.indicacion = ? AND p.justificacion = ? AND p.resultado = ?`;
//     prestacion = prestacion.split(";");
//     const nombre = prestacion[0]
//     const lado = prestacion[1]
//     const indicacion = prestacion[2]
//     const justificacion = prestacion[3]
//     const resultado = prestacion[4]
//     try{
//         const result = await pool.query(query, [nombre, lado, indicacion, justificacion, resultado]);
//         return result[0][0].idPrestacion;
//     }catch(error){
//         console.log(error)
//     }
// }

const getPrestaciones = async () => {
    const query = `SELECT * FROM prestacion`
    try{
        const resultado = await pool.query(query);
        return resultado;
    }catch(error){
        throw error;
    }
}

const insertPrestacion = async (prestacion) => {
    // const {nombre, lado, indicacion, justificacion, resultado} = prestacion;
    const query = "INSERT INTO prestacion SET ?";
    try{
        const resultado = await pool.query(query, prestacion);
        return resultado;
    }catch(error){
        throw error;
    }
}

const insertResultadoEnPrestacionConId = async(resultado, idPrestacion) => {
    const query = "UPDATE prestacion SET resultado = ? WHERE idPrestacion = ?";
    try {
        const result = await pool.query(query, [resultado, idPrestacion])
        return result;
    } catch (error) {
        throw error;
    }
}



export {/*searchIdPrestacion, */getPrestaciones, insertPrestacion, insertResultadoEnPrestacionConId};