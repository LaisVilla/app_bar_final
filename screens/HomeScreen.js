import { View, Text, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Verificar se o token está no AsyncStorage para determinar se o usuário está logado
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          setIsLoggedIn(true); // Usuário está logado
        }
      } catch (error) {
        console.error("Erro ao verificar login:", error);
      }
    };

    checkLoginStatus();
  }, []);

  // Função de logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken"); // Remove o token
      setIsLoggedIn(false); // Atualiza o estado de login
      Alert.alert("Logout realizado", "Você saiu com sucesso!");
      navigation.replace('Login'); // Redireciona para a tela de Login
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <ImageBackground 
      source={{ uri: 'https://static.vecteezy.com/system/resources/previews/001/259/184/large_2x/old-wood-wall-texture-background-free-photo.jpg' }} 
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>Horário de Funcionamento: Seg a Dom: 17h - 02h</Text>
          <Text style={styles.text}>Aberto até as 2h da manhã, venha aproveitar!</Text>
          <Text style={styles.text}>Promoção de Happy Hour: 17h - 19h: 2 por 1 em todas as cervejas!</Text>
          <Text style={styles.text}>Toda sexta-feira: Música ao vivo a partir das 20h!</Text>
          <Text style={styles.text}>Reserve sua mesa para grupos e eventos especiais!</Text>
        </View>
        {/* Botões de navegação */}
        {!isLoggedIn && (
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate('Login')}
            accessibilityLabel="Botão para visualizar o login ou cadastro"
          >
            <Text style={styles.buttonText}>Login/Cadastro</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('Cardapio')}
          accessibilityLabel="Botão para visualizar o cardápio"
        >
          <Text style={styles.buttonText}>Cardápio</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('Reservas')}
          accessibilityLabel="Botão para fazer reservas"
        >
          <Text style={styles.buttonText}>Reservas</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('Produto')}
          accessibilityLabel="Botão para cadastrar produtos"
        >
          <Text style={styles.buttonText}>Cadastrar Produtos</Text>
        </TouchableOpacity>

        {/* Exibe o botão de logout se o usuário estiver logado */}
        {isLoggedIn && (
          <View style={styles.logoutContainer}>
            <TouchableOpacity 
              style={styles.logoutbutton} 
              onPress={handleLogout}
              accessibilityLabel="Botão para realizar logout"
            >
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        
        )}</View>
    </ImageBackground>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
  },
  textContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fundo branco do balão
    borderColor: 'black', // Contorno preto
    borderWidth: 2, // Largura do contorno
    borderRadius: 10, // Bordas arredondadas para parecer um balão
    padding: 10, // Espaçamento interno para dar espaço ao texto
    marginBottom: 20, // Espaçamento entre o balão e outros elementos
    alignSelf: 'center', // Centraliza o balão no eixo horizontal
  },  
  text: {
    fontSize: 16,
    marginBottom: 20,
    color: 'black', // Texto em preto
    fontWeight: 'bold', // Texto em negrito
    alignSelf: 'center',
    
  },
  button: {
    backgroundColor: '#FF8000', // Fundo laranja
    borderRadius: 25, // Bordas arredondadas
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderWidth: 2, // Contorno preto
    borderColor: 'black',
    width: '50%',
    alignSelf: 'center',
  },
  buttonText: {
    color: 'black', // Texto em preto
    fontWeight: 'bold', // Texto em negrito
    textAlign: 'center',
  },
  logoutContainer: {
    position: 'absolute',
    top: 40,
    right: 20, // Ajuste a posição do botão conforme necessário
    zIndex: 1, // Garante que o botão fique acima de outros elementos
  },
  logoutbutton: {
    backgroundColor: '#FF8000', // Fundo laranja
    borderRadius: 25, // Bordas arredondadas
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderWidth: 2, // Contorno preto
    borderColor: 'black',
    width: '100%',
  },
});
