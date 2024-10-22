import express from 'express';
import alunosRoute from "./routes/alunosRoute.js";

const app = express();
const PORT = process.env.PORT || 3001;  
app.use('/aluno', alunosRoute);

app.listen(PORT, () => {
    console.log(`Listening to ${PORT}`);
  });