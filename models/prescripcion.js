import pool from "./database.js";

const insertPrescripcion = async (prescripcion) => {
    let fecha = new Date().toLocaleString('sv-SE');
    const fechaDeHoy = new Date();
    fechaDeHoy.setDate((fechaDeHoy.getDate()+parseInt(prescripcion.vigencia)));
    const vigenciaActualizada = fechaDeHoy.toLocaleDateString("sv-SE");
    prescripcion.vigencia = vigenciaActualizada;
    let {diagnostico, vigencia, idMedico, idPaciente} = prescripcion;
    // let prescripcionConFecha = {diagnostico, fecha, vigencia, idMedico, idPaciente};
    const query = "INSERT INTO prescripcion (diagnostico, fecha, vigencia, idMedico, idPaciente) VALUES(?,?,?,?,?)";
    try{
        const resultado = await pool.query(query, [diagnostico, fecha, vigencia, idMedico, idPaciente]);
        return resultado[0].insertId; //devolvemos el id de la prescripcion creada
    }catch(error){
        throw error;
    }
}

const getPrescripcionByIdPrescripcion = async (idPrescripcion) => {
    const queryMedicamentos = ` SELECT *
                                FROM prescripcion 
                                    JOIN prescripcion_medicamentodetalle pmd ON(prescripcion.idPrescripcion = pmd.idPrescripcion)
                                    JOIN medicamentodetalle md ON (md.id = pmd.idMedicamentoDetalle)
                                    JOIN medicamento m ON (md.idMedicamento = m.idMedicamento)
                                    JOIN concentracion c ON (md.idConcentracion = c.idConcentracion)
                                    JOIN formafarmaceutica ff ON (md.idFormaFarmaceutica = ff.idFormaFarmaceutica)
                                    JOIN presentacion pre ON (md.idPresentacion = pre.idPresentacion)
                                WHERE prescripcion.idPrescripcion = ?`;
    const queryPrestaciones = `SELECT 
                                    p.*, 
                                    pp.*, 
                                    pre.*, 
                                    m.nombre AS nombreMedico, 
                                    m.apellido AS apellidoMedico, 
                                    m.matricula, 
                                    m.idRefeps, 
                                    pc.nombre AS nombrePaciente, 
                                    pc.apellido AS apellidoPaciente, 
                                    pc.documento AS documentoPaciente, 
                                    GROUP_CONCAT(DISTINCT l.nombreLado SEPARATOR ', ') AS nombresLados,
                                    GROUP_CONCAT(DISTINCT l.idLado SEPARATOR ', ') AS idsLados 
                                FROM 
                                    prescripcion p 
                                    JOIN prescripcion_prestacion pp ON p.idPrescripcion = pp.idPrescripcion
                                    JOIN prestacion pre ON pp.idPrestacion = pre.idPrestacion
                                    LEFT JOIN prestacion_lado pl ON pre.idPrestacion = pl.idPrestacion
                                    LEFT JOIN lado l ON pl.idLado = l.idLado
                                    JOIN medico m ON p.idMedico = m.idMedico
                                    JOIN paciente pc ON p.idPaciente = pc.idPaciente 
                                WHERE 
                                    p.idPrescripcion = ?
                                GROUP BY 
                                    p.idPrescripcion, pp.id, pre.idPrestacion, m.idMedico, pc.idPaciente;`;
    try {
        const medicamentos = await pool.query(queryMedicamentos, [idPrescripcion]);
        const prestaciones = await pool.query(queryPrestaciones, [idPrescripcion]);
        return [medicamentos[0], prestaciones[0]];
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const getPrescripcionByIdPaciente = async(idPaciente, idMedico) => {
    const queryMedicamentos = ` SELECT *
                                FROM prescripcion 
                                    JOIN prescripcion_medicamentodetalle pmd ON(prescripcion.idPrescripcion = pmd.idPrescripcion)
                                    JOIN medicamentodetalle md ON (md.id = pmd.idMedicamentoDetalle)
                                    JOIN medicamento m ON (md.idMedicamento = m.idMedicamento)
                                    JOIN concentracion c ON (md.idConcentracion = c.idConcentracion)
                                    JOIN formafarmaceutica ff ON (md.idFormaFarmaceutica = ff.idFormaFarmaceutica)
                                    JOIN presentacion pre ON (md.idPresentacion = pre.idPresentacion)
                                WHERE idPaciente = ? AND idMedico = ?`;
    const queryPrestaciones = `SELECT 
                                    p.*, 
                                    pp.*, 
                                    pre.*, 
                                    m.nombre AS nombreMedico, 
                                    m.apellido AS apellidoMedico, 
                                    m.matricula, 
                                    m.idRefeps, 
                                    pc.nombre AS nombrePaciente, 
                                    pc.apellido AS apellidoPaciente, 
                                    pc.documento AS documentoPaciente, 
                                    GROUP_CONCAT(DISTINCT l.nombreLado SEPARATOR ', ') AS nombresLados,
                                    GROUP_CONCAT(DISTINCT l.idLado SEPARATOR ', ') AS idsLados 
                                FROM 
                                    prescripcion p 
                                    JOIN prescripcion_prestacion pp ON p.idPrescripcion = pp.idPrescripcion
                                    JOIN prestacion pre ON pp.idPrestacion = pre.idPrestacion
                                    LEFT JOIN prestacion_lado pl ON pre.idPrestacion = pl.idPrestacion
                                    LEFT JOIN lado l ON pl.idLado = l.idLado
                                    JOIN medico m ON p.idMedico = m.idMedico
                                    JOIN paciente pc ON p.idPaciente = pc.idPaciente 
                                WHERE 
                                    p.idMedico = ? AND p.idPaciente = ?
                                GROUP BY 
                                    p.idPrescripcion, pp.id, pre.idPrestacion, m.idMedico, pc.idPaciente;`;
    try {
        const medicamentos = await pool.query(queryMedicamentos, [idPaciente, idMedico]);
        const prestaciones = await pool.query(queryPrestaciones, [idMedico, idPaciente]);
        return [medicamentos[0], prestaciones[0]];
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export {insertPrescripcion, getPrescripcionByIdPaciente, getPrescripcionByIdPrescripcion}