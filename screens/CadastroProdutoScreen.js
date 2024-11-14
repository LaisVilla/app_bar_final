import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function CadastroProdutoScreen() {
  // Estados para armazenar as informações do formulário e dos produtos
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [imgUrl, setImgUrl] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [isAdmin, setIsAdmin] = useState(null); // Estado para verificar se o usuário é admin
  const [produtoId, setProdutoId] = useState(null); // Estado para armazenar o ID do produto em edição

  const navigation = useNavigation(); // Hook para navegação entre telas

  // Hook que verifica o status de admin do usuário ao montar o componente
  useEffect(() => {
    const checkAdmin = async () => {
      const token = await AsyncStorage.getItem('authToken'); // Obtém o token do armazenamento assíncrono
      if (token) {
        try {
          const decoded = jwtDecode(token); // Decodifica o token para verificar o papel do usuário
          setIsAdmin(decoded.role === 'admin'); // Define como admin se o papel for 'admin'
          
          // Redireciona se o usuário não for admin
          if (decoded.role !== 'admin') {
            Alert.alert("Acesso negado", "Você não tem permissão para acessar esta tela.");
            navigation.navigate('Home'); // Substitua pelo nome da tela desejada para usuários comuns
          } else {
            fetchProdutos(); // Se for admin, busca a lista de produtos
          }

        } catch (error) {
          console.error("Erro ao decodificar token:", error);
          setIsAdmin(false); // Se houver erro, define como não admin
          Alert.alert("Erro de autenticação", "Por favor, faça login novamente.");
          navigation.navigate('Login'); // Redireciona para a tela de login
        }
      } else {
        setIsAdmin(false); // Se não houver token, define como não admin
        Alert.alert("Acesso negado", "Você não está logado.");
        navigation.navigate('Login'); // Redireciona para a tela de login
      }
    };

    checkAdmin();
  }, [navigation]);

  // Função para buscar produtos da API
  const fetchProdutos = async () => {
    try {
      const response = await axios.get('http://192.168.15.29:8000/produtos');
      setProdutos(response.data); // Atualiza o estado com os produtos recebidos
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  // Função para cadastrar ou atualizar um produto
  const handleCadastroOuAtualizacao = async () => {
    if (!isAdmin) {
      Alert.alert("Acesso negado", "Você não tem permissão para cadastrar produtos.");
      return;
    }

    const token = await AsyncStorage.getItem('authToken'); // Obtém o token de autenticação
    try {
      const produtoData = { nome, preco, quantidade, imgUrl }; // Dados do produto
      if (produtoId) {
        // Atualiza um produto existente se produtoId estiver definido
        await axios.put(`http://192.168.15.29:8000/produtos/${produtoId}`, produtoData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Alert.alert("Produto atualizado com sucesso!");
      } else {
        // Cadastra um novo produto se produtoId for nulo
        await axios.post('http://192.168.15.29:8000/produtos', produtoData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Alert.alert("Produto cadastrado com sucesso!");
      }
      // Reseta o formulário após o cadastro/atualização
      setNome('');
      setPreco('');
      setQuantidade(1);
      setImgUrl('');
      setProdutoId(null);
      fetchProdutos(); // Atualiza a lista de produtos
    } catch (error) {
      console.error("Erro ao cadastrar/atualizar produto:", error);
      Alert.alert("Erro:", error.response?.data.message || "Erro desconhecido");
    }
  };

  // Função para excluir um produto
  const handleExcluir = async (id) => {
    const token = await AsyncStorage.getItem('authToken'); // Obtém o token de autenticação
    try {
      await axios.delete(`http://192.168.15.29:8000/produtos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert("Produto excluído com sucesso!");
      fetchProdutos(); // Atualiza a lista de produtos após exclusão
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      Alert.alert("Erro ao excluir produto.");
    }
  };

  // Função para iniciar a edição de um produto
  const iniciarEdicao = (produto) => {
    setProdutoId(produto._id); // Define o ID do produto a ser editado
    setNome(produto.nome);
    setPreco(produto.preco);
    setQuantidade(produto.quantidade);
    setImgUrl(produto.imgUrl);
  };

  // Exibe uma mensagem de verificação de acesso enquanto o status de admin é carregado
  if (isAdmin === null) {
    return (
      <View style={styles.container}>
        <Text>Verificando acesso...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Formulário de cadastro/edição de produto */}
      <Text style={styles.label}>{produtoId ? "Editar Produto" : "Cadastrar Produto"}</Text>
      <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Preço" value={preco} onChangeText={setPreco} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Quantidade" value={String(quantidade)} onChangeText={(text) => setQuantidade(Number(text))} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="URL da Imagem" value={imgUrl} onChangeText={setImgUrl} />
      <TouchableOpacity style={styles.cadastrarButton} onPress={handleCadastroOuAtualizacao}>
        <Text style={styles.cadastrarButtonText}>{produtoId ? "Atualizar Produto" : "Cadastrar Produto"}</Text>
      </TouchableOpacity>

      {/* Lista de produtos */}
      <FlatList
        data={produtos}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.produtoContainer}>
            <Text>{item.nome}</Text>
            <Text>Preço: {item.preco}</Text>
            <Text>Quantidade: {item.quantidade}</Text>
            <TouchableOpacity onPress={() => iniciarEdicao(item)}>
              <Text style={styles.editarTexto}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleExcluir(item._id)}>
              <Text style={styles.excluirTexto}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#000', // Fundo suave para um visual moderno
    alignItems: 'center',
  },
  label: {
    marginBottom: 8,
    fontWeight: 'bold',
    fontSize: 18, // Tamanho de fonte maior para destaque
    color: 'white',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
    borderRadius: 10,
    width: '80%',
    marginBottom: 15,
    padding: 10,
    color: 'black',
  },
  produtoContainer: {
    borderWidth: 2,
    borderColor: '#FF8000', // Borda mais destacada
    padding: 12,
    marginBottom: 8,
    borderRadius: 10, // Bordas arredondadas para estilo moderno
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cadastrarButton: {
    backgroundColor: '#FF8000', // Fundo laranja moderno
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25, // Bordas arredondadas
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2, // Contorno preto para destaque
    borderColor: 'black',
  },
  cadastrarButtonText: {
    color: 'black', // Texto preto
    fontSize: 16,
    fontWeight: 'bold',
  },
  editarTexto: {
    color: 'blue',
    fontWeight: 'bold', // Negrito para maior visibilidade
    marginTop: 5,
  },
  excluirTexto: {
    color: 'red',
    fontWeight: 'bold', // Negrito para alertar sobre a ação
    marginTop: 5,
  },
});
