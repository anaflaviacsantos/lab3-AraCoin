import express from 'express';
import alunosRoute from "./routes/alunosRoute.js";
import usuarioRoute from "./routes/usuariosRoute.js";
import premiosRoute from "./routes/premiosRoute.js";
import professoresRoute from "./routes/professoresRoute.js";
import transacoesRoute from "./routes/transacoesRoute.js";
import parceirosRoute from "./routes/parceirosRoute.js";
import enderecosRoute from "./routes/enderecosRoute.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware para parsear JSON
app.use(express.json());

// Registrar as rotas
app.use('/alunos', alunosRoute);
app.use('/usuarios', usuarioRoute);
app.use('/premios', premiosRoute);
app.use('/professores', professoresRoute);
app.use('/transacoes', transacoesRoute);
app.use('/parceiros', parceirosRoute);
app.use('/enderecos', enderecosRoute);

app.listen(PORT, () => {
    console.log(`Listening to ${PORT}`);
  });