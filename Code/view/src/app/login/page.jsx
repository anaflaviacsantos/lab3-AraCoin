'use client';
import React, { useState } from 'react';
import { Container, Button, Group, Box, TextInput, Select } from '@mantine/core';
import axios from 'axios';

const Usuario = () => {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [tipo, setTipo] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:3001/usuarios', {
        login,
        senha,
        tipo,
      });
      console.log('Usuário cadastrado com sucesso:', response.data);
      clearForm();
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
    }
  };

  const clearForm = () => {
    setLogin('');
    setSenha('');
    setTipo('');
  };

  return (
    <Container style={{ marginTop: '30px', maxWidth: '400px' }}>
      <Box sx={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
        <h2>Cadastro de Usuário</h2>
        <TextInput
          label="Login"
          placeholder="Digite o login"
          mb="sm"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />

        <TextInput
          label="Senha"
          placeholder="Digite a senha"
          type="password"
          mb="sm"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <Select
          label="Tipo de Usuário"
          placeholder="Selecione o tipo"
          mb="sm"
          value={tipo}
          onChange={(value) => setTipo(value)}
          data={[
            { value: 'aluno', label: 'Aluno' },
            { value: 'professor', label: 'Professor' },
            { value: 'parceiro', label: 'Parceiro' },
          ]}
        />

        <Group position="right" mt="md">
          <Button onClick={handleSubmit} color="green">Cadastrar</Button>
        </Group>
      </Box>
    </Container>
  );
};

export default Usuario;
