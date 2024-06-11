import { getCategorias, getConcentraciones, getFamilias, getFormasFarmaceuticas, getMedicamento, getNombresGenericos, getPresentaciones, insertMedicamento, logicDeleteMedicamento, updateMedicamento, updateStatusMedicamento } from "../models/medicamentos.js";

const registroMedicamentoGet = async (req, res) => {
    //logica para verificar tema sessiones
    const nombresGenericos = await getNombresGenericos();
    const familias = await getFamilias();
    const categorias = await getCategorias();
    const concentraciones = await getConcentraciones();
    const formasFarmaceuticas = await getFormasFarmaceuticas();
    const presentaciones = await getPresentaciones();
    res.render("registrarMedicamento", {nombresGenericos, familias, categorias, concentraciones, formasFarmaceuticas, presentaciones});
}

const obtenerMedicamentos = async (req, res) => {
    try {
        const medicamentos = await getMedicamento();
        res.json(medicamentos[0]);
    } catch (error) {
        res.status(400).json({error});
    }
}

const darDeAltaMedicamento = async(req, res) => {
    const {idMedicamentoDetalle} = req.body;
    try {
        const resultado = await updateStatusMedicamento(idMedicamentoDetalle);
        res.json({resultado});
    } catch (error) {
        res.status(400).json({error});
    }
}

const borradoLogicoMedicamento = async(req, res) => {
    const {idMedicamentoDetalle} = req.body;
    try {
        const resultado = await logicDeleteMedicamento(idMedicamentoDetalle);
        res.json({resultado});
    } catch (error) {
        res.status(400).json({error});
    }
}

const editarMedicamento = async(req, res) => {
    const {idMedicamento, idConcentracion, idFormaFarmaceutica, idPresentacion, idMedicamentoDetalle} = req.body;
    try {
        const resultado = await updateMedicamento(idMedicamentoDetalle, idMedicamento, idConcentracion, idFormaFarmaceutica, idPresentacion);
        res.json({resultado});
    } catch (error) {
        res.status(400).json({error});
    }

}

const insertarMedicamento = async(req, res) => {
    const {idMedicamento, idConcentracion, idFormaFarmaceutica, idPresentacion} = req.body;
    try {
        const resultado = await insertMedicamento(idMedicamento, idConcentracion, idFormaFarmaceutica, idPresentacion);
        res.json({resultado});
    } catch (error) {
        res.status(400).json({error});
    }
}

export {registroMedicamentoGet, obtenerMedicamentos, darDeAltaMedicamento, borradoLogicoMedicamento, editarMedicamento, insertarMedicamento}