"use client";
import React, { useEffect, useState } from 'react';
import { Select, MantineProvider, Card, Text, Table, Button, Modal, TextInput, Textarea, Group, Container, Box } from '@mantine/core';
import axios from 'axios';

const ProfessoresApp = () => {
    const [professores, setProfessores] = useState([]);
    const [selectedProfessor, setSelectedProfessor] = useState('');
    const [professorDetails, setProfessorDetails] = useState(null);
    const [alunos, setAlunos] = useState([]);
    const [transacoes, setTransacoes] = useState([]);
    const [modalOpened, setModalOpened] = useState(false);
    const [selectedAluno, setSelectedAluno] = useState(null);
    const [valorPresente, setValorPresente] = useState('');
    const [descricaoPresente, setDescricaoPresente] = useState('');

    useEffect(() => {
        const fetchProfessores = async () => {
            try {
                const response = await axios.get('http://localhost:3001/professores');
                setProfessores(response.data);
            } catch (error) {
                console.error('Erro ao buscar os professores:', error);
            }
        };

        fetchProfessores();
    }, []);

    useEffect(() => {
        const fetchProfessorDetails = async (id) => {
            try {
                const response = await axios.get(`http://localhost:3001/professores/${id}`);
                setProfessorDetails(response.data);
            } catch (error) {
                console.error('Erro ao buscar detalhes do professor:', error);
            }
        };

        const fetchTransacoes = async (id) => {
            try {
                const response = await axios.get(`http://localhost:3001/transacoes/professor/${id}`);
                setTransacoes(response.data);
            } catch (error) {
                console.error('Erro ao buscar as transações:', error);
            }
        };

        if (selectedProfessor) {
            fetchProfessorDetails(selectedProfessor);
            fetchTransacoes(selectedProfessor);
        }
    }, [selectedProfessor]);

    useEffect(() => {
        const fetchAlunos = async () => {
            try {
                const response = await axios.get('http://localhost:3001/alunos');
                setAlunos(response.data);
            } catch (error) {
                console.error('Erro ao buscar os alunos:', error);
            }
        };

        fetchAlunos();
    }, []);

    const handlePresentear = (aluno) => {
        setSelectedAluno(aluno);
        setModalOpened(true);
    };

    const handleConfirmarPresente = async () => {
        if (!professorDetails || !selectedAluno || !valorPresente || !descricaoPresente) {
            console.error('Por favor, preencha todos os campos.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/transacoes', {
                professorId: professorDetails.id,
                aluno_cpf: selectedAluno.cpf,
                quantidade: parseFloat(valorPresente),
                motivo: descricaoPresente,
            });

            console.log('Transação realizada com sucesso:', response.data);

            setProfessorDetails((prev) => ({
                ...prev,
                moedas: (parseFloat(prev.moedas) - parseFloat(valorPresente)).toFixed(2),
            }));

            setAlunos((prevAlunos) =>
                prevAlunos.map((aluno) =>
                    aluno.id === selectedAluno.id
                        ? { ...aluno, moedas: (parseFloat(aluno.moedas) + parseFloat(valorPresente)).toFixed(2) }
                        : aluno
                )
            );

            setTransacoes((prevTransacoes) => [response.data, ...prevTransacoes]);

            setValorPresente('');
            setDescricaoPresente('');
            setModalOpened(false);
        } catch (error) {
            console.error('Erro ao realizar a transação:', error);
        }
    };

    const handleSimularNovoSemestre = async () => {
        try {
            const response = await axios.post('http://localhost:3001/professores/incrementar-moedas');
            console.log('Moedas aumentadas com sucesso para todos os professores:', response.data);
            setProfessores(response.data.professores);

            if (selectedProfessor) {
                const updatedProfessor = response.data.professores.find(
                    (professor) => professor.id.toString() === selectedProfessor
                );
                if (updatedProfessor) {
                    setProfessorDetails(updatedProfessor);
                }
            }
        } catch (error) {
            console.error('Erro ao aumentar as moedas dos professores:', error);
        }
    };

    return (
        <MantineProvider withGlobalStyles withNormalizeCSS>
            <Container style={{ marginTop: '30px', maxWidth: '800px', backgroundColor: '#f0f4f8', padding: '20px', borderRadius: '8px' }}>
                <Box sx={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
                    <h1 style={{ textAlign: 'center', color: '#003399', marginBottom: '20px' }}>Professores</h1>
                    <Select
                        label="Selecione um professor"
                        placeholder="Escolha um professor"
                        data={professores.map((professor) => ({
                            value: professor.id.toString(),
                            label: professor.nome,
                        }))}
                        value={selectedProfessor}
                        onChange={setSelectedProfessor}
                        searchable
                        nothingFound="Nenhum professor encontrado"
                        style={{ marginBottom: '20px' }}
                    />

                    {professorDetails && (
                        <Card shadow="sm" padding="lg" style={{ marginBottom: '20px' }}>
                            <Text size="lg" weight={500} style={{ textAlign: 'center' }}>
                                Nome: {professorDetails.nome}
                            </Text>
                            <Text size="sm" color="dimmed" style={{ textAlign: 'center' }}>
                                Instituição: {professorDetails.instituicao}
                            </Text>
                            <Text size="sm" color="dimmed" style={{ textAlign: 'center' }}>
                                Departamento: {professorDetails.departamento}
                            </Text>
                            <Text size="sm" color="dimmed" style={{ textAlign: 'center' }}>
                                CPF: {professorDetails.cpf}
                            </Text>
                            <Text size="sm" color="dimmed" style={{ textAlign: 'center' }}>
                                Moedas: {professorDetails.moedas}
                            </Text>
                        </Card>
                    )}

                    <h2 style={{ textAlign: 'center', color: '#003399', marginTop: '20px' }}>Alunos</h2>
                    <Table striped highlightOnHover withBorder withColumnBorders>
                        <thead style={{ backgroundColor: '#003399', color: '#fff' }}>
                            <tr>
                                <th style={{ textAlign: 'center' }}>Nome</th>
                                <th style={{ textAlign: 'center' }}>Moedas</th>
                                <th style={{ textAlign: 'center' }}>Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alunos.map((aluno) => (
                                <tr key={aluno.id}>
                                    <td style={{ textAlign: 'center' }}>{aluno.nome}</td>
                                    <td style={{ textAlign: 'center' }}>{aluno.moedas}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <Button onClick={() => handlePresentear(aluno)} variant="light" color="blue">
                                            Presentear
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <h2 style={{ textAlign: 'center', color: '#003399', marginTop: '20px' }}>Transações</h2>
                    <Table striped highlightOnHover withBorder withColumnBorders>
                        <thead style={{ backgroundColor: '#003399', color: '#fff' }}>
                            <tr>
                                <th style={{ textAlign: 'center' }}>ID</th>
                                <th style={{ textAlign: 'center' }}>Aluno CPF</th>
                                <th style={{ textAlign: 'center' }}>Quantidade</th>
                                <th style={{ textAlign: 'center' }}>Motivo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transacoes.map((transacao) => (
                                <tr key={transacao.id}>
                                    <td style={{ textAlign: 'center' }}>{transacao.id}</td>
                                    <td style={{ textAlign: 'center' }}>{transacao.aluno_cpf}</td>
                                    <td style={{ textAlign: 'center' }}>{transacao.quantidade}</td>
                                    <td style={{ textAlign: 'center' }}>{transacao.motivo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <Group position="center" mt="lg">
                        <Button onClick={handleSimularNovoSemestre} color="green">
                            Simular Novo Semestre
                        </Button>
                    </Group>
                </Box>

                <Modal
                    opened={modalOpened}
                    onClose={() => setModalOpened(false)}
                    title={`Presentear ${selectedAluno?.nome}`}
                    centered
                >
                    <TextInput
                        label="Valor do Presente"
                        placeholder="Digite o valor"
                        value={valorPresente}
                        onChange={(e) => setValorPresente(e.target.value)}
                        mb="sm"
                    />
                    <Textarea
                        label="Descrição do Presente"
                        placeholder="Digite a descrição"
                        value={descricaoPresente}
                        onChange={(e) => setDescricaoPresente(e.target.value)}
                        minRows={3}
                        mb="sm"
                    />
                    <Button onClick={handleConfirmarPresente} color="green" fullWidth>
                        Confirmar Presente
                    </Button>
                </Modal>
            </Container>
        </MantineProvider>
    );
};

export default ProfessoresApp;
