import pool from "./database.js";

const insertPrescripcion = async (prescripcion) => {
    let fecha = new Date().toLocaleString('sv-SE');
    const fechaDeHoy = new Date();
    fechaDeHoy.setDate((fechaDeHoy.getDate()+parseInt(prescripcion.vigencia)));
    const vigenciaActualizada = fechaDeHoy.toLocaleDateString("sv-SE");
    prescripcion.vigencia = vigenciaActualizada;
    let {diagnostico, vigencia, idMedico, idPaciente} = prescripcion;
    let prescripcionConFecha = {diagnostico, fecha, vigencia, idMedico, idPaciente};
    const query = "INSERT INTO prescripcion SET ?";
    try{
        const resultado = await pool.query(query, prescripcionConFecha);
        return resultado[0].insertId; //devolvemos el id de la prescripcion creada
    }catch(error){
        throw error;
    }
}

const getPrescripcionByIdPaciente = async(idPaciente) => {
    const queryMedicamentos = ` SELECT *
                                FROM prescripcion 
                                    JOIN prescripcion_medicamentodetalle pmd ON(prescripcion.idPrescripcion = pmd.idPrescripcion)
                                    JOIN medicamentodetalle md ON (md.id = pmd.idMedicamentoDetalle)
                                    JOIN medicamento m ON (md.idMedicamento = m.idMedicamento)
                                    JOIN concentracion c ON (md.idConcentracion = c.idConcentracion)
                                    JOIN formafarmaceutica ff ON (md.idFormaFarmaceutica = ff.idFormaFarmaceutica)
                                    JOIN presentacion pre ON (md.idPresentacion = pre.idPresentacion)
                                WHERE idPaciente = ?`;
    const queryPrestaciones = `SELECT *
                                FROM prescripcion
                                    JOIN prescripcion_prestacion pp ON (prescripcion.idPrescripcion = pp.idPrescripcion)
                                    JOIN prestacion pre ON (pp.idPrestacion = pre.idPrestacion)
                                WHERE idPaciente = ?;`;
    try {
        const medicamentos = await pool.query(queryMedicamentos, [idPaciente]);
        const prestaciones = await pool.query(queryPrestaciones, [idPaciente]);
        return [medicamentos[0], prestaciones[0]];
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export {insertPrescripcion, getPrescripcionByIdPaciente}