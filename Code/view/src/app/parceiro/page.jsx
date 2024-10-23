'use client';
import React, { useState, useEffect } from 'react';
import { Container, Button, Group, Box, TextInput, Notification, Radio, Select } from '@mantine/core';
import axios from 'axios';

const Cadastro = () => {
  const [tipoUsuario, setTipoUsuario] = useState('parceiro');
  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [notification, setNotification] = useState({ message: '', color: '' });

  const handleCadastro = async () => {
    try {
      // 1. Cadastrar o usuário geral
      const novoUsuarioResponse = await axios.post('http://localhost:8080/api/add_usuario', { login, senha });
      const usuarioId = novoUsuarioResponse.data.idUsuario;
  
      let dadosCadastro = {
        nome,
        Usuario_idUsuario: usuarioId
      };
  
      // 2. Cadastrar o Parceiro
      await axios.post('http://localhost:8080/api/add_parceiro', dadosCadastro);
  
      // Limpar os campos após o cadastro bem-sucedido
      setNome('');
      setCnpj('');
      setLogin('');
      setSenha('');
  
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      let mensagemErro = 'Erro ao cadastrar. Verifique os dados.';
      if (error.response && error.response.data && error.response.data.error) {
        mensagemErro = error.response.data.error;
      }
      setNotification({ message: mensagemErro, color: 'red' });
    }
  };
  

  return (
    <Container style={{ marginTop: '30px', maxWidth: '400px' }}>
      <Box sx={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
        <h2>Cadastro</h2>

        <Radio.Group
          label="Tipo de Usuário"
          value={tipoUsuario}
          onChange={setTipoUsuario}
          mb="sm"
        >
          <Radio value="aluno" label="Aluno" />
          <Radio value="professor" label="Professor" />
          <Radio value="parceiro" label="Parceiro" />
        </Radio.Group>

        <TextInput
          label="Login"
          placeholder="Digite o login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          mb="sm"
        />

        <TextInput
          label="Nome"
          placeholder="Digite o nome" 
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          mb="sm"
        />

        <TextInput 
          label="Senha"
          placeholder="Digite a senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          type="password" 
          mb="sm"
        />

        <Group position="right" mt="md">
          <Button onClick={handleCadastro} color="green">Cadastrar</Button>
        </Group>

        {notification.message && (
          <Notification color={notification.color} mt="md">
            {notification.message}
          </Notification>
        )}
      </Box>
    </Container>
  );
};

export default Cadastro;


