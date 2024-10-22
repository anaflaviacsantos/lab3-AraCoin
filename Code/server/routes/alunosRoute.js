import express from "express";
import cors from "cors";
import bodyParser from 'body-parser';
import connection from "../controllers/index.js";


const router = express.Router();    

const corsOptions = {
    origin: 'https://schedule-seven.vercel.app', // Substitua pela URL do seu aplicativo cliente
    optionsSuccessStatus: 200
};

  
router.use(cors(corsOptions));
// router.use(cors());
router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));


// Ler todos os alunos
router.get('/', async (req, res) => {
    try {
        const result = await connection.query('SELECT * FROM aluno');
        res.json(result.rows);
    } catch (error) {
        res.status(500).send('Error');
    }
});

// Criar um novo aluno
router.post('/', async (req, res) => {
    const { cpf, login, nome, instituicao, email, curso, moedas } = req.body;
    try {
        const result = await connection.query(
            'INSERT INTO aluno (cpf, login, nome, instituicao, email, curso, moedas) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [cpf, login, nome, instituicao, email, curso, moedas]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar aluno' });
    }
});


// Atualizar um aluno
router.put('/alunos/:cpf', async (req, res) => {
    const { cpf } = req.params;
    const { login, nome, instituicao, email, curso, moedas } = req.body;
    try {
        const result = await connection.query(
            'UPDATE alunos SET login = $1, nome = $2, instituicao = $3, email = $4, curso = $5, moedas = $6 WHERE cpf = $7',
            [login, nome, instituicao, email, curso, moedas, cpf]
        );
        res.status(200).json({ message: 'Aluno atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar aluno' });
    }
});

// Deletar um aluno
router.delete('/alunos/:cpf', async (req, res) => {
    const { cpf } = req.params;
    try {
        const result = await connection.query('DELETE FROM alunos WHERE cpf = $1', [cpf]);
        res.status(200).json({ message: 'Aluno deletado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar aluno' });
    }
});

export default router;
