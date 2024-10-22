import express from "express";
import cors from "cors";
import bodyParser from 'body-parser';
import connection from "../controllers/index.js";


const router = express.Router();    


  

// router.use(cors());
router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));


// Ler todos os alunos
router.get('/', async (req, res) => {
    try {
        const result = await connection.query('SELECT * FROM alunos');
        res.json(result.rows);
    } catch (error) {
        res.status(500).send('Error');
    }
});

// Criar um novo aluno
router.post('/', async (req, res) => {
    const { userId, cpf, nome, instituicao, email, curso, moedas } = req.body;
  try {
    const result = await connection.query(
      'INSERT INTO alunos (userId, cpf, nome, instituicao, email, curso, moedas) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [userId, cpf, nome, instituicao, email, curso, moedas]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/:id', async (req, res) => {
const { id } = req.params;
  try {
    const result = await connection.query('SELECT * FROM alunos WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar um aluno
router.put('/:cpf', async (req, res) => {
    const { id } = req.params;
  const { nome, instituicao, email, curso, moedas } = req.body;
  try {
    const result = await connection.query(
      'UPDATE alunos SET nome = $1, instituicao = $2, email = $3, curso = $4, moedas = $5 WHERE id = $6 RETURNING *',
      [nome, instituicao, email, curso, moedas, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deletar um aluno
router.delete('/:cpf', async (req, res) => {
    const { id } = req.params;
  try {
    const result = await connection.query('DELETE FROM alunos WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }
    res.status(200).json({ message: 'Aluno excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
