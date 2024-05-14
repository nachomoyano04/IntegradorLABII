import express from "express";

const app = express();
const PORT = dot.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server listen in port ${PORT} http://localhost:${PORT}`)
})