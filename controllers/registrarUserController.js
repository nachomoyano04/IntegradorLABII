import bcrypt from "bcrypt";
import { buscarUsersByUsuario, insertarUsuario, insertarUsuarioRol, getRoles } from "../models/login.js";
import pool from "../models/database.js";
const getRegistrarUser = async(req, res) => {
    try {
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
                const roles = await getRoles();
                res.render("registrarUser",{roles});
            }
        }else{
            res.send("Debe iniciar sesión");
        }
    } catch (error) {
        res.render("404", {error500: true, mensajeDeError500: error});
    }
}

const postRegistrarUser = async (req, res) => {
    console.log(req.body);
    const usuario = req.body.usuario;
    const password = req.body.password;
    const passwordHasheada = await bcrypt.hash(password, 8);
    let roles = req.body.idRol;
    roles = Array.isArray(roles)?roles:[roles];
    console.log(roles);
    const connection = await pool.getConnection();
    if(roles[0]!== undefined){
        try {
            const existeElUsuario = await buscarUsersByUsuario(usuario);
            if(existeElUsuario.length === 0){
                //Insertamos el usuario y el rol en modo transacción
                connection.beginTransaction();
                const resultado = await insertarUsuario(usuario, passwordHasheada);
                console.log(resultado);
                const idUsuario = resultado[0].insertId;
                for(let i = 0; i < roles.length; i++){ //insertamos un usuario_rol por cada rol que va a tener el usuario
                    await insertarUsuarioRol(idUsuario, roles[i]);
                    console.log(`insertando usuario: ${idUsuario} y rol: ${roles[i]} en la tabla usuario_rol`);
                }
                await connection.commit();
                if(resultado[0].affectedRows > 0){
                    res.send(`USUARIO: ${usuario} insertado correctamente con el idUsuario: ${resultado[0].insertId}`)
                }
            }else{
                res.send("¡el usuario ya existe!");
            }
        } catch (error) {
            await connection.rollback();
            res.render("404", {error500:true, mensajeDeError500: error});
        }finally{
            connection.release();
        }
    }else{
        res.send("debe elegir un rol para el usuario....")
    }
}

export {getRegistrarUser, postRegistrarUser};