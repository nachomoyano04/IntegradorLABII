import express from "express";

const route = express.Router();

route.get("/", (req, res) => {
    if(req.session.loggedin){
        try {
            req.session.destroy(error => {
                if(error){
                    throw error;
                }else{
                    res.redirect("/login");
                }
            })
        } catch (error) {
            res.render("404", {error500: true, mensajeDeError500: error});
        }
    }else{
        res.redirect("/login");
    }
})

export default route;