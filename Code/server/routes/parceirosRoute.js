// parceirosController.js
import express from "express";
import connection from "../controllers/index.js";

const router = express.Router();

// Ler todos os parceiros
router.get('/', async (req, res) => {
    try {
        const result = await connection.query('SELECT * FROM parceiros');
        res.json(result.rows);
    } catch (error) {
        res.status(500).send('Error');
    }
});

// Criar um novo parceiro
router.post('/', async (req, res) => {
    const { cnpj, userId, nome } = req.body;
    try {
        const result = await connection.query(
            'INSERT INTO parceiros (cnpj, userId, nome) VALUES ($1, $2, $3) RETURNING *',
            [cnpj, userId, nome]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ler um parceiro pelo ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await connection.query('SELECT * FROM parceiros WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Parceiro não encontrado' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Atualizar um parceiro pelo ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;
    try {
        const result = await connection.query(
            'UPDATE parceiros SET nome = $1 WHERE id = $2 RETURNING *',
            [nome, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Parceiro não encontrado' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Deletar um parceiro pelo ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await connection.query('DELETE FROM parceiros WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Parceiro não encontrado' });
        }
        res.status(200).json({ message: 'Parceiro excluído com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
