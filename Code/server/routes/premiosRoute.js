// premiosController.js
import express from "express";
import connection from "../controllers/index.js";

const router = express.Router();

// Ler todos os prêmios
router.get('/', async (req, res) => {
    try {
        const result = await connection.query('SELECT * FROM premios');
        res.json(result.rows);
    } catch (error) {
        res.status(500).send('Error');
    }
});

// Criar um novo prêmio
router.post('/', async (req, res) => {
    const { parceiro_cnpj } = req.body;
    try {
        const result = await connection.query(
            'INSERT INTO premios (parceiro_cnpj) VALUES ($1) RETURNING *',
            [parceiro_cnpj]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ler um prêmio pelo ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await connection.query('SELECT * FROM premios WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Prêmio não encontrado' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Atualizar um prêmio pelo ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { parceiro_cnpj } = req.body;
    try {
        const result = await connection.query(
            'UPDATE premios SET parceiro_cnpj = $1 WHERE id = $2 RETURNING *',
            [parceiro_cnpj, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Prêmio não encontrado' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Deletar um prêmio pelo ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await connection.query('DELETE FROM premios WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Prêmio não encontrado' });
        }
        res.status(200).json({ message: 'Prêmio excluído com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
