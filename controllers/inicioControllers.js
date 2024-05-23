const inicioGet = async(req, res) => {
    const inicio = true;
    res.render("inicio", {inicio})
}

const notFound404 = async(req, res) => {
    res.render("404");
}

export {inicioGet, notFound404}