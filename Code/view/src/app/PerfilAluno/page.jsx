'use client';
import React, { useState, useEffect } from 'react';
import { Container, Button, Group, Box, Card, Text, Select } from '@mantine/core';
import axios from 'axios';

const Usuario = () => {
  const [alunos, setAlunos] = useState([]);
  const [selectedAluno, setSelectedAluno] = useState(null);
  const [selectedAlunoNome, setSelectedAlunoNome] = useState(null);

  useEffect(() => {
    fetchAlunos();
  }, []);

  const fetchAlunos = async () => {
    try {
      const response = await axios.get('http://localhost:3001/alunos');
      setAlunos(response.data);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
    }
  };

  const handleAlunoSelect = async (alunoNome) => {
    try {
      const aluno = alunos.find((aluno) => aluno.nome === alunoNome);
      if (aluno) {
        const response = await axios.get(`http://localhost:3001/alunos/${aluno.id}`);
        setSelectedAluno(response.data);
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes do aluno:', error);
    }
  };

  const handleSelectChange = (alunoNome) => {
    setSelectedAlunoNome(alunoNome);
    handleAlunoSelect(alunoNome);
  };

  return (
    <Container style={{ marginTop: '30px', maxWidth: '800px' }}>
      <Box sx={{ marginTop: '20px' }}>
        <h2>Selecione um Aluno</h2>
        <Select
          label="Alunos"
          placeholder="Selecione um aluno"
          value={selectedAlunoNome}
          onChange={handleSelectChange}
          data={alunos.map((aluno) => ({
            value: aluno.nome,
            label: aluno.nome,
          }))}
        />
      </Box>

      {selectedAluno && (
        <Card shadow="sm" padding="lg" radius="md" withBorder style={{ marginTop: '20px' }}>
          <h3>Detalhes do Aluno</h3>
          <Text><strong>Nome:</strong> {selectedAluno.nome}</Text>
          <Text><strong>CPF:</strong> {selectedAluno.cpf}</Text>
          <Text><strong>Instituição:</strong> {selectedAluno.instituicao}</Text>
          <Text><strong>Email:</strong> {selectedAluno.email}</Text>
          <Text><strong>Curso:</strong> {selectedAluno.curso}</Text>
          <Text><strong>Moedas:</strong> {selectedAluno.moedas}</Text>
          <Group position="right" mt="md">
            <Button color="gray" onClick={() => setSelectedAluno(null)}>Fechar</Button>
          </Group>
        </Card>
      )}
    </Container>
  );
};

export default Usuario;
