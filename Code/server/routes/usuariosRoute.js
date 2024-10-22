import express from "express";
import bodyParser from 'body-parser';
import connection from "../controllers/index.js";

const router = express.Router();

router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Ler todos os usuários
router.get('/', async (req, res) => {
    try {
        const result = await connection.query('SELECT * FROM usuarios');
        res.json(result.rows);
    } catch (error) {
        res.status(500).send('Error');
    }
});

// Criar um novo usuário
router.post('/', async (req, res) => {
    const { login, senha, tipo } = req.body;
    try {
        const result = await connection.query(
            'INSERT INTO usuarios (login, senha, tipo) VALUES ($1, $2, $3) RETURNING *',
            [login, senha, tipo]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ler um usuário pelo ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await connection.query('SELECT * FROM usuarios WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Atualizar um usuário pelo ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { login, senha, tipo } = req.body;
    try {
        const result = await connection.query(
            'UPDATE usuarios SET login = $1, senha = $2, tipo = $3 WHERE id = $4 RETURNING *',
            [login, senha, tipo, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Deletar um usuário pelo ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await connection.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.status(200).json({ message: 'Usuário excluído com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
