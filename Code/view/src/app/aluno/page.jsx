'use client';
import React, { useState, useEffect } from 'react';
import { Container, Button, Group, Box, TextInput, Select, Table, Modal } from '@mantine/core';
import axios from 'axios';

const aluno = () => {
  const [login, setLogin] = useState('');
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [instituicao, setInstituicao] = useState('');
  const [email, setEmail] = useState('');
  const [curso, setCurso] = useState('');
  const [moedas, setMoedas] = useState(0);
  const [alunos, setAlunos] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedAluno, setSelectedAluno] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchAlunos();
  }, []);

  const fetchAlunos = async () => {
    try {
      const response = await axios.get('http://localhost:3001/aluno');
      setAlunos(response.data);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const alunoData = {
        userId: login, 
        cpf,
        nome,
        instituicao,
        email,
        curso,
        moedas,
      };

      if (editMode && selectedAluno) {
        // Atualiza um aluno existente
        await axios.put(`http://localhost:3001/aluno/${selectedAluno.id}`, alunoData);
        setEditMode(false);
        setSelectedAluno(null);
      } else {
        // Cria um novo aluno
        await axios.post('http://localhost:3001/aluno', alunoData);
      }

      fetchAlunos();
      clearForm();
    } catch (error) {
      console.error('Erro ao salvar aluno:', error);
    }
  };

  const handleEdit = (aluno) => {
    setLogin(aluno.userId);
    setCpf(aluno.cpf);
    setNome(aluno.nome);
    setInstituicao(aluno.instituicao);
    setEmail(aluno.email);
    setCurso(aluno.curso);
    setMoedas(aluno.moedas);
    setSelectedAluno(aluno);
    setEditMode(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/aluno/${id}`);
      fetchAlunos();
    } catch (error) {
      console.error('Erro ao deletar aluno:', error);
    }
  };

  const clearForm = () => {
    setLogin('');
    setCpf('');
    setNome('');
    setInstituicao('');
    setEmail('');
    setCurso('');
    setMoedas(0);
    setEditMode(false);
  };

  return (
    <Container style={{ marginTop: '30px', maxWidth: '800px' }}>
      <Box sx={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
        <h2>{editMode ? 'Editar Aluno' : 'Cadastro de Aluno'}</h2>
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Login"
            placeholder="Digite o login"
            mb="sm"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />

          <TextInput
            label="CPF"
            placeholder="Digite o CPF"
            mb="sm"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />

          <TextInput
            label="Nome"
            placeholder="Digite o nome"
            mb="sm"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <TextInput
            label="Instituição"
            placeholder="Digite a Instituição"
            mb="sm"
            value={instituicao}
            onChange={(e) => setInstituicao(e.target.value)}
          />

          <TextInput
            label="Email"
            placeholder="Digite o Email"
            mb="sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Select
            label="Curso"
            placeholder="Selecione um curso"
            mb="sm"
            value={curso}
            onChange={(value) => setCurso(value)}
            data={[
              { value: 'Engenharia', label: 'Engenharia' },
              { value: 'Medicina', label: 'Medicina' },
              { value: 'Direito', label: 'Direito' },
            ]}
          />

          <TextInput
            label="Moedas"
            placeholder="Digite a quantidade de moedas"
            type="number"
            mb="sm"
            value={moedas}
            onChange={(e) => setMoedas(e.target.value)}
          />

          <Group position="right" mt="md">
            <Button type="submit" color={editMode ? 'blue' : 'green'}>
              {editMode ? 'Salvar' : 'Cadastrar'}
            </Button>
            {editMode && (
              <Button color="gray" onClick={clearForm}>
                Cancelar
              </Button>
            )}
          </Group>
        </form>
      </Box>

      <Box sx={{ marginTop: '20px' }}>
        <h2>Lista de Alunos</h2>
        <Table striped highlightOnHover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Curso</th>
              <th>Moedas</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {alunos.map((aluno) => (
              <tr key={aluno.id}>
                <td>{aluno.id}</td>
                <td>{aluno.nome}</td>
                <td>{aluno.curso}</td>
                <td>{aluno.moedas}</td>
                <td>
                  <Button size="xs" color="blue" onClick={() => handleEdit(aluno)}>Editar</Button>
                  <Button size="xs" color="red" ml="sm" onClick={() => handleDelete(aluno.id)}>Excluir</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Box>

      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Detalhes do Aluno">
        {/* Detalhes do aluno podem ser exibidos aqui */}
      </Modal>
    </Container>
  );
};

export default aluno;
