import express from "express";
import cors from "cors";
import connection from "../controllers/index.js";

const router = express.Router();

// Ler todos os professores
router.get('/', async (req, res) => {
    try {
        const result = await connection.query('SELECT * FROM professores');
        res.json(result.rows);
    } catch (error) {
        res.status(500).send('Error');
    }
});

// Criar um novo professor
router.post('/', async (req, res) => {
    const { cpf, userId, nome, instituicao, departamento, moedas } = req.body;
    try {
        const result = await connection.query(
            'INSERT INTO professores (cpf, userId, nome, instituicao, departamento, moedas) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [cpf, userId, nome, instituicao, departamento, moedas]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ler um professor pelo ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await connection.query('SELECT * FROM professores WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Professor não encontrado' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Atualizar um professor pelo ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, instituicao, departamento, moedas } = req.body;
    try {
        const result = await connection.query(
            'UPDATE professores SET nome = $1, instituicao = $2, departamento = $3, moedas = $4 WHERE id = $5 RETURNING *',
            [nome, instituicao, departamento, moedas, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Professor não encontrado' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Deletar um professor pelo ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await connection.query('DELETE FROM professores WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Professor não encontrado' });
        }
        res.status(200).json({ message: 'Professor excluído com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota para aumentar em 1000 créditos as moedas de todos os professores
router.post('/incrementar-moedas', async (req, res) => {
    try {
        const result = await connection.query(
            'UPDATE professores SET moedas = moedas + 1000 RETURNING *'
        );
        res.status(200).json({
            message: 'Moedas aumentadas em 1000 para todos os professores',
            professores: result.rows,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
