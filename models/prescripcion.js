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
    const query = `SELECT
        *
    FROM
    prescripcion
LEFT JOIN prescripcion_medicamentodetalle USING(idPrescripcion)
LEFT JOIN medicamentodetalle ON(prescripcion_medicamentodetalle.idMedicamentoDetalle = medicamentodetalle.id)
LEFT JOIN medicamento ON (medicamentodetalle.idMedicamento = medicamento.idMedicamento)
LEFT JOIN concentracion ON (medicamentodetalle.idConcentracion = concentracion.idConcentracion)
LEFT JOIN formafarmaceutica ON (medicamentodetalle.idFormaFarmaceutica = formafarmaceutica.idFormaFarmaceutica)
LEFT JOIN presentacion ON (medicamentodetalle.idPresentacion = presentacion.idPresentacion)
LEFT JOIN prescripcion_prestacion USING(idPrescripcion)
LEFT JOIN prestacion ON(prescripcion_prestacion.idPrestacion = prestacion.idPrestacion)
WHERE
    prescripcion.idPaciente = ? AND(prescripcion_medicamentodetalle.id IS NOT NULL OR prescripcion_prestacion.id IS NOT NULL);`;
    try {
        const resultado = await pool.query(query, [idPaciente])
        return resultado[0];
    } catch (error) {
        throw error;
    }
}

export {insertPrescripcion, getPrescripcionByIdPaciente}