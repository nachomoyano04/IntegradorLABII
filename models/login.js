import pool from "./database.js";

const buscarUsersByUsuarioYPassword = async (usuario, password) => {
    const query = "SELECT * FROM usuario WHERE nombreUsuario = ? AND password = ?";
    try {
        const resultado = await pool.query(query, [usuario, password]);
        return resultado;
    } catch (error) {
        throw error;
    }
}

const buscarUsersByUsuario = async (usuario) => {
    const query = "SELECT * FROM usuario WHERE nombreUsuario = ?";
    try {
        const resultado = await pool.query(query, [usuario]);
        return resultado[0];
    } catch (error) {
        throw error;
    }
}
 
const insertarUsuario = async (usuario, password, rol) => {
    const query = "INSERT INTO usuario (nombreUsuario, password) VALUES (?,?,?)";
    try {
        const resultado = await pool.query(query, [usuario, password, rol]);
        return resultado;
    } catch (error) {
        throw error;
    }
}

const insertarUsuarioRol = async(idUsuario, idRol) => {
    const query = "INSERT INTO usuario_rol (idUsuario, idRol) VALUES (?,?)";
    try{
        const resultado = await pool.query(query, [idUsuario, idRol]);
        return resultado;
    }catch(error){
        throw error;
    }
}

const getRoles = async() => {
    const query = "SELECT * FROM rol";
    try {
        const resultado = await pool.query(query);
        return resultado[0];
    } catch (error) {
        throw error;
    }
}

const buscarRolesByUsuario = async(idUsuario) => {
    const query = "SELECT idRol FROM usuario_rol WHERE idUsuario = ?";
    try {
        const resultado = await pool.query(query, [idUsuario]);
        return resultado[0];
    } catch (error) {
        throw error;
    }
}

export {buscarUsersByUsuarioYPassword, buscarUsersByUsuario, insertarUsuario, insertarUsuarioRol, getRoles, buscarRolesByUsuario};