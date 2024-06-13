import pool from "../models/database.js";
import { getLados, getPrestaciones, toRegisterPrestacion, logicDeletePrestacion, getPrestacionById, updatePrestacion, eliminarRelacionPrestacionLado, agregarRelacionPrestacionLado, getLadosByPrestacion, insertPrestacion } from "../models/prestaciones.js";

const registroPrestacionGet = async (req, res) => {
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
            const lados = await getLados();
            console.log(lados);
            res.render("registrarPrestacion", {lados})
        }else{
            res.render("404", {sinPermiso:true})
        }
    }else{
        res.redirect("/login")
    }
}

const obtenerPrestaciones = async (req, res) => {
    try {
        const resultado = await getPrestaciones();
        res.json(resultado[0]);
    } catch (error) {
        res.json(error);
    }
}

const darDeAltaPrestacion = async(req, res) => {
    const {idPrestacion} = req.body;
    try {
        const resultado = await toRegisterPrestacion(idPrestacion);
        res.json({ok:true});
    } catch (error) {
        
    }
}

const borradoLogicoPrestacion = async(req, res) => {
    const {idPrestacion} = req.body;
    try {
        const resultado = await logicDeletePrestacion(idPrestacion);
        res.json({ok:true})
    } catch (error) {
        res.json(error);
    }
}
const obtenerPrestacionById = async(req, res) => {
    const idPrestacion = req.params.idPrestacion;
    try {
        const resultado = await getPrestacionById(idPrestacion);
        res.json(resultado[0]);
    } catch (error) {
        res.json(error);
    }
}

const registroPrestacionPut = async (req, res) => {
    const {nombrePrestacion, idLado1, idLado2, idLado3, indicacion, justificacion, idPrestacion} = req.body;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const idsUpdate = [];
        if(idLado1)idsUpdate.push(parseInt(idLado1));
        if(idLado2)idsUpdate.push(parseInt(idLado2));
        if(idLado3)idsUpdate.push(parseInt(idLado3));
        let idsBD = await getLadosByPrestacion(idPrestacion);
        idsBD = idsBD.map(e => e.idLado);
        let idsAEliminar = idsBD.filter(e => !idsUpdate.includes(e));
        let idsAAgregar = idsUpdate.filter(e => !idsBD.includes(e));
        for(let iae of idsAEliminar){
            await eliminarRelacionPrestacionLado(iae, idPrestacion);
        }
        for(let iaa of idsAAgregar){
            await agregarRelacionPrestacionLado(iaa, idPrestacion);
        }
        const resultado = await updatePrestacion(nombrePrestacion, indicacion, justificacion, idPrestacion);
        await connection.commit();
        res.json({ok:true});
    } catch (error) {
        await connection.rollback();
        res.json(error);
    }finally {
        connection.release();
    }
} 
const registroPrestacionPost = async (req, res) => {
    const {nombrePrestacion, idLado1, idLado2, idLado3, indicacion, justificacion} = req.body;
    const connection =  await pool.getConnection(); 
    try {
        await connection.beginTransaction();
        const idsUpdate = [];
        if(idLado1)idsUpdate.push(idLado1);
        if(idLado2)idsUpdate.push(idLado2);
        if(idLado3)idsUpdate.push(idLado3);
        const idPrestacion = await insertPrestacion(nombrePrestacion, indicacion, justificacion);
        for(let iu of idsUpdate){
            await agregarRelacionPrestacionLado(iu, idPrestacion);
        }
        await connection.commit();
        return res.json({ok:true});
    } catch (error) {
        await connection.rollback();
        res.json(error);
    }finally{
        connection.release();
    }
}

export {registroPrestacionGet, obtenerPrestaciones, darDeAltaPrestacion, borradoLogicoPrestacion, obtenerPrestacionById,  registroPrestacionPut, registroPrestacionPost};