import pool from "../models/database.js";
import { getCategorias, getConcentraciones, getFamilias, getFormasFarmaceuticas, getMedicamento, getMedicamentoByIdMedicamentoDetalle, getNombresGenericos, getPresentaciones, insertCategoria, insertConcentracion, insertFamilia, insertFormaFarmaceutica, insertMedicamento, insertMedicamentoNuevo, insertPresentacion, logicDeleteMedicamento, updateMedicamento, updateMedicamentoNuevo, updateStatusMedicamento } from "../models/medicamentos.js";

const registroMedicamentoGet = async (req, res) => {
    //logica para verificar tema sessiones
        //logica para verificar las sessiones
        if(req.session.loggedin){
            let roles = req.session.rol;
            let tienePermiso = false;
            for(let i = 0; i < roles.length; i++){
                if(roles[i].idRol === 1){
                    tienePermiso = true;
                    break;
                }
            }
            if(tienePermiso){
                const nombresGenericos = await getNombresGenericos();
                const familias = await getFamilias();
                const categorias = await getCategorias();
                const concentraciones = await getConcentraciones();
                const formasFarmaceuticas = await getFormasFarmaceuticas();
                const presentaciones = await getPresentaciones();
                res.render("registrarMedicamento", {nombresGenericos, familias, categorias, concentraciones, formasFarmaceuticas, presentaciones});
            }else{
                res.render("404", {sinPermiso:true})
            }
        }else{
            res.redirect("/login")
        }
}

const obtenerMedicamentos = async (req, res) => {
    try {
        const medicamentos = await getMedicamento();
        res.json(medicamentos[0]);
    } catch (error) {
        res.status(400).json({error});
    }
}

const obtenerMedicamentoPorIdMedicamentoDetalle = async(req, res) => {
    const idMedicamentoDetalle = req.params.idMedicamentoDetalle;
    try {
        const medicamento = await getMedicamentoByIdMedicamentoDetalle(idMedicamentoDetalle);
        res.json(medicamento[0]);
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
    let {nombreGenerico, nombreComercial, concentracion, formaFarmaceutica, presentacion, categoria, familia, idMedicamentoDetalle} = req.body;
    let idMedicamento, idConcentracion, idFormaFarmaceutica, idPresentacion, idCategoria, idFamilia;
    const connection = await pool.getConnection();
    try {
        console.log(req.body)
        connection.commit();
        const contieneSoloNumeros = (cadena) => {
            return /^[0-9]+$/.test(cadena);
            }
        
        if(contieneSoloNumeros(categoria)){
            idCategoria = categoria;
        }else{
            idCategoria = await insertCategoria(categoria);
        }
        console.log("idCategoria:", idCategoria);
        if(contieneSoloNumeros(familia)){
            idFamilia = familia;
        }else{
            idFamilia = await insertFamilia(familia);
        }
        console.log("idFamilia:", idFamilia);
        if(contieneSoloNumeros(nombreGenerico)){
            idMedicamento = nombreGenerico;
            await updateMedicamentoNuevo(nombreComercial || null, idFamilia, idCategoria, idMedicamento);
        }else{
            idMedicamento = await insertMedicamentoNuevo(nombreGenerico, nombreComercial || null, idFamilia, idCategoria);
        }
        console.log("idMedicamento:", idMedicamento);
        if(contieneSoloNumeros(concentracion)){
            idConcentracion = concentracion;
        }else{
            let c = concentracion.split(" ");
            let cantidadConcentracion = c[0];
            let unidadMedidaCon = c[1];
            console.log(c)
            idConcentracion = await insertConcentracion(cantidadConcentracion, unidadMedidaCon);
        }
        console.log("idConcentracion:", idConcentracion);
        if(contieneSoloNumeros(formaFarmaceutica)){
            idFormaFarmaceutica = formaFarmaceutica;
        }else{
            idFormaFarmaceutica = await insertFormaFarmaceutica(formaFarmaceutica);
        }
        console.log("idFormaFarmaceutica:", idFormaFarmaceutica);
        if(contieneSoloNumeros(presentacion)){
            idPresentacion = presentacion;
        }else{
            presentacion = presentacion.split(" ");
            let cantidadPresentacion = presentacion[0];
            let unidadMedidaPres = presentacion[1];
            idPresentacion = await insertPresentacion(cantidadPresentacion, unidadMedidaPres);
        }
        console.log("idPresentacion:", idPresentacion);
        let bod = req.body;
        console.log(bod);
        // AHORA INSERTAMOS EL UPDATE MEDICAMENTO DETALLE
        console.log(`Actualizando el medicamentoDetalle ${idMedicamentoDetalle} con medicamento ${idMedicamento} concentracion ${idConcentracion} forma ${idFormaFarmaceutica} presentacion ${idFormaFarmaceutica}`)
        const resultado = await updateMedicamento(idMedicamentoDetalle, idMedicamento, idConcentracion, idFormaFarmaceutica, idPresentacion);
        await connection.commit();
        res.json({ok:true});
    } catch (error) {
        await connection.rollback();
        res.json({error});
    } finally{
        connection.release();
    }
}

const insertarMedicamento = async(req, res) => {
    let {nombreGenerico, nombreComercial, concentracion, formaFarmaceutica, presentacion, categoria, familia} = req.body;
    const connection = await pool.getConnection();
    let idMedicamento, idConcentracion, idFormaFarmaceutica, idPresentacion, idFamilia, idCategoria;
    try {
        await connection.beginTransaction();
        const contieneSoloNumeros = (cadena) => {
            return /^[0-9]+$/.test(cadena);
        }
        if(contieneSoloNumeros(familia)){
            idFamilia = familia;
        }else{
            idFamilia = await insertFamilia(familia); //insertamos la familia nueva para obtener el id
        } 
        if(contieneSoloNumeros(categoria)){ //insertamos la familia nueva para obtener el id
            idCategoria = categoria
        }else{
            idCategoria = await insertCategoria(categoria)
        } 
        if(contieneSoloNumeros(nombreGenerico)){
            idMedicamento = nombreGenerico;
            await updateMedicamentoNuevo(nombreComercial||null, idFamilia, idCategoria, idMedicamento);
        }else{
            idMedicamento = await insertMedicamentoNuevo(nombreGenerico, nombreComercial||null, idFamilia, idCategoria);
        }
        if(contieneSoloNumeros(concentracion)){ 
            idConcentracion = concentracion
        }else{
            concentracion = concentracion.split(" "); //la dividimos
            let cantidadConcentracion = concentracion[0];
            let unidadMedidaCon = concentracion[1];
            idConcentracion = await insertConcentracion(cantidadConcentracion, unidadMedidaCon);
        }
        if(contieneSoloNumeros(formaFarmaceutica)){
            idFormaFarmaceutica = formaFarmaceutica;
        }else{
            idFormaFarmaceutica = await insertFormaFarmaceutica(formaFarmaceutica);
        }
        if(contieneSoloNumeros(presentacion)){
            idPresentacion = presentacion;
        }else{
            presentacion = presentacion.split(" ");
            let cantidadPresentacion = presentacion[0];
            let unidadMedidaPres = presentacion[1];
            idPresentacion = await insertPresentacion(cantidadPresentacion, unidadMedidaPres);
        }
        // INSERTAMOS EL MEDICAMENTO DETALLE
        const resultado = await insertMedicamento(idMedicamento, idConcentracion, idFormaFarmaceutica, idPresentacion);
        await connection.commit();
        res.json({ok:true});
    } catch (error) {
        await connection.rollback();
        res.json({ok:false});
    } finally{
        connection.release();
    }
}

export {registroMedicamentoGet, obtenerMedicamentos, darDeAltaMedicamento, borradoLogicoMedicamento, editarMedicamento, insertarMedicamento, obtenerMedicamentoPorIdMedicamentoDetalle}