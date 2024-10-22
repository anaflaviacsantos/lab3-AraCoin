// transacoesController.js
import express from "express";
import connection from "../controllers/index.js";

const router = express.Router();

// Ler todas as transações
router.get('/', async (req, res) => {
    try {
        const result = await connection.query('SELECT * FROM transacoes');
        res.json(result.rows);
    } catch (error) {
        res.status(500).send('Error');
    }
});

// Criar uma nova transação
router.post('/', async (req, res) => {
    const { professorId, aluno_cpf, quantidade, motivo } = req.body;
    try {
        const result = await connection.query(
            'INSERT INTO transacoes (professorId, aluno_cpf, quantidade, motivo) VALUES ($1, $2, $3, $4) RETURNING *',
            [professorId, aluno_cpf, quantidade, motivo]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ler uma transação pelo ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await connection.query('SELECT * FROM transacoes WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Transação não encontrada' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Atualizar uma transação pelo ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { professorId, aluno_cpf, quantidade, motivo } = req.body;
    try {
        const result = await connection.query(
            'UPDATE transacoes SET professorId = $1, aluno_cpf = $2, quantidade = $3, motivo = $4 WHERE id = $5 RETURNING *',
            [professorId, aluno_cpf, quantidade, motivo, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Transação não encontrada' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Deletar uma transação pelo ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await connection.query('DELETE FROM transacoes WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Transação não encontrada' });
        }
        res.status(200).json({ message: 'Transação excluída com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
