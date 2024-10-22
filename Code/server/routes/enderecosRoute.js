// enderecosController.js
import express from "express";
import connection from "../controllers/index.js";

const router = express.Router();

// Ler todos os endereços
router.get('/', async (req, res) => {
    try {
        const result = await connection.query('SELECT * FROM enderecos');
        res.json(result.rows);
    } catch (error) {
        res.status(500).send('Error');
    }
});

// Criar um novo endereço
router.post('/', async (req, res) => {
    const { alunoId, rua, numero, bairro, cep, complemento } = req.body;
    try {
        const result = await connection.query(
            'INSERT INTO enderecos (alunoId, rua, numero, bairro, cep, complemento) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [alunoId, rua, numero, bairro, cep, complemento]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ler um endereço pelo ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await connection.query('SELECT * FROM enderecos WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Endereço não encontrado' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Atualizar um endereço pelo ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { rua, numero, bairro, cep, complemento } = req.body;
    try {
        const result = await connection.query(
            'UPDATE enderecos SET rua = $1, numero = $2, bairro = $3, cep = $4, complemento = $5 WHERE id = $6 RETURNING *',
            [rua, numero, bairro, cep, complemento, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Endereço não encontrado' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Deletar um endereço pelo ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await connection.query('DELETE FROM enderecos WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Endereço não encontrado' });
        }
        res.status(200).json({ message: 'Endereço excluído com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
