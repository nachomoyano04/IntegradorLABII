import pool from "./database.js";

const insertPrescripcion = (prescripcion) => {
    let fecha = new Date().toLocaleString('sv-SE');
    const {diagnostico, vigencia, idMedicamentoDetalle, idPrestacion, idMedico, idPaciente} = prescripcion;
    let prescripcionConFecha = {};
    if(idPrestacion === ""){
        prescripcionConFecha = {diagnostico, fecha, vigencia, idMedicamentoDetalle, idPrestacion: null, idMedico, idPaciente};
    }else if(idMedicamentoDetalle = ""){
        prescripcionConFecha = {diagnostico, fecha, vigencia, idMedicamentoDetalle: null, idPrestacion, idMedico, idPaciente};
    }else{
        prescripcionConFecha = {diagnostico, fecha, vigencia, idMedicamentoDetalle, idPrestacion, idMedico, idPaciente};
    }
    const query = "INSERT INTO prescripcion SET ?";
    try{
        const resultado = pool.query(query, prescripcionConFecha);
        return resultado;
    }catch(error){
        throw error;
    }
}

const getPrescripcionByIdPaciente = async(idPaciente) => {
    const query = ` SELECT
                    *
                    FROM
                        prescripcion AS p
                        LEFT JOIN medicamentodetalle AS md
                        ON (p.idMedicamentoDetalle = md.id)
                        LEFT JOIN prestacion AS pre
                        ON (p.idPrestacion = pre.idPrestacion)
                        LEFT JOIN concentracion AS c
                        ON (md.idConcentracion = c.idConcentracion)
                        LEFT JOIN formafarmaceutica AS ff
                        ON (md.idFormaFarmaceutica = ff.idFormaFarmaceutica)
                        LEFT JOIN presentacion AS pr
                        ON (md.idPresentacion = pr.idPresentacion)
                        LEFT JOIN medicamento AS m
                        ON (md.idMedicamento = m.idMedicamento)
                        LEFT JOIN paciente AS pac
                        ON (p.idPaciente = pac.idPaciente)
                    WHERE
                        p.idPaciente = ?
                        AND (md.id IS NOT NULL OR pre.idPrestacion IS NOT NULL)`;
    try {
        const resultado = await pool.query(query, [idPaciente])
        return resultado[0];
    } catch (error) {
        throw error;
    }
}

export {insertPrescripcion, getPrescripcionByIdPaciente}