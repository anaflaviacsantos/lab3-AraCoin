'use client';
import React, { useState } from 'react';
import { Container, Button, Group, Box, TextInput, Card, Notification } from '@mantine/core';
import axios from 'axios';

const CadastrarAluno = () => {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [instituicao, setInstituicao] = useState('');
  const [email, setEmail] = useState('');
  const [curso, setCurso] = useState('');
  const [moedas, setMoedas] = useState('');
  const [notification, setNotification] = useState(null);

  const handleCadastro = async () => {
    try {
      const novoAluno = {
        nome,
        cpf,
        instituicao,
        email,
        curso,
        moedas: parseInt(moedas, 10),
      };
      await axios.post('http://localhost:3001/alunos', novoAluno);
      setNotification({ message: 'Aluno cadastrado com sucesso!', color: 'green' });
      clearForm();
    } catch (error) {
      console.error('Erro ao cadastrar aluno:', error);
      setNotification({ message: 'Erro ao cadastrar aluno.', color: 'red' });
    }
  };

  const clearForm = () => {
    setNome('');
    setCpf('');
    setInstituicao('');
    setEmail('');
    setCurso('');
    setMoedas('');
  };

  return (
    <Container style={{ marginTop: '30px', maxWidth: '800px' }}>
      <Box sx={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
        <h2>Cadastrar Aluno</h2>

        <TextInput
          label="Nome"
          placeholder="Digite o nome"
          mb="sm"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <TextInput
          label="CPF"
          placeholder="Digite o CPF"
          mb="sm"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
        />

        <TextInput
          label="Instituição"
          placeholder="Digite a instituição"
          mb="sm"
          value={instituicao}
          onChange={(e) => setInstituicao(e.target.value)}
        />

        <TextInput
          label="Email"
          placeholder="Digite o email"
          mb="sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextInput
          label="Curso"
          placeholder="Digite o curso"
          mb="sm"
          value={curso}
          onChange={(e) => setCurso(e.target.value)}
        />

        <TextInput
          label="Moedas"
          placeholder="Digite a quantidade de moedas"
          mb="sm"
          type="number"
          value={moedas}
          onChange={(e) => setMoedas(e.target.value)}
        />

        <Group position="right" mt="md">
          <Button onClick={handleCadastro} color="blue">Cadastrar</Button>
          <Button onClick={clearForm} color="gray">Limpar</Button>
        </Group>
      </Box>

      {notification && (
        <Notification color={notification.color} onClose={() => setNotification(null)} style={{ marginTop: '20px' }}>
          {notification.message}
        </Notification>
      )}
    </Container>
  );
};

export default CadastrarAluno;
