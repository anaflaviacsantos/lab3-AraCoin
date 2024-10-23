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

router.post('/', async (req, res) => {
    const { professorId, aluno_cpf, quantidade, motivo } = req.body;

    try {
        // 1. Verificar se o professor e o aluno existem
        const professorResult = await connection.query('SELECT * FROM professores WHERE id = $1', [professorId]);
        const alunoResult = await connection.query('SELECT * FROM alunos WHERE cpf = $1', [aluno_cpf]);

        if (professorResult.rows.length === 0) {
            return res.status(404).json({ message: 'Professor não encontrado' });
        }
        if (alunoResult.rows.length === 0) {
            return res.status(404).json({ message: 'Aluno não encontrado' });
        }

        const professor = professorResult.rows[0];
        const aluno = alunoResult.rows[0];

        // 2. Verificar se o professor tem moedas suficientes
        if (parseFloat(professor.moedas) < parseFloat(quantidade)) {
            return res.status(400).json({ message: 'Moedas insuficientes para a transação' });
        }

        // 3. Subtrair a quantidade de moedas do professor
        const novaMoedaProfessor = parseFloat(professor.moedas) - parseFloat(quantidade);
        await connection.query(
            'UPDATE professores SET moedas = $1 WHERE id = $2',
            [novaMoedaProfessor, professorId]
        );

        // 4. Adicionar a quantidade de moedas ao aluno
        const novaMoedaAluno = parseFloat(aluno.moedas) + parseFloat(quantidade);
        await connection.query(
            'UPDATE alunos SET moedas = $1 WHERE cpf = $2',
            [novaMoedaAluno, aluno_cpf]
        );

        // 5. Criar a transação
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

// Consultar todas as transações de um professor pelo professorId
router.get('/professor/:professorId', async (req, res) => {
    const { professorId } = req.params;

    try {
        const result = await connection.query(
            'SELECT * FROM transacoes WHERE professorId = $1',
            [professorId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Nenhuma transação encontrada para este professor' });
        }

        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


export default router;
