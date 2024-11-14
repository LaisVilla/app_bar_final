import { StyleSheet, Text, View, TextInput, Image, Alert, TouchableOpacity, ImageBackground } from 'react-native';
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage"


const LoginScreen = () => {


  const navigation = useNavigation();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {
    const user = {
      email: email,
      password: password
    };

    try {
      const response = await axios.post("http://192.168.15.29:8000/login", user)
      console.log(response);

      const token = response.data.token;

      // Armazenar o token no AsyncStorage
      await AsyncStorage.setItem('authToken', token);
      console.log("Token salvo:", token); // Log para verificar se o token foi salvo

      // Adicione um alerta de sucesso
      Alert.alert("Sucesso", "Login realizado com sucesso!", [
        { text: "OK", onPress: () => navigation.replace("Home") }
      ]);

    } catch (error) {
      // Verifique se o erro é devido a email ou senha inválidos
      if (error.response) {
        // O servidor retornou um código de status fora do intervalo de 2xx
        Alert.alert("Erro de Login", error.response.data.message || "Email ou senha inválidos.");
      } else if (error.request) {
        // A requisição foi feita, mas não houve resposta
        Alert.alert("Erro de Login", "Erro ao se conectar ao servidor.");
      } else {
        // Alguma coisa aconteceu ao configurar a requisição
        Alert.alert("Erro de Login", "Erro inesperado.");
      }
      console.log(error);
    }
  };


  return (
    <ImageBackground
      source={require('../assets/fundo_MobileBar.jpg')} 
      style={styles.container}
      resizeMode="cover"
    >

      <View style={styles.overlay}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.textLabel}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholder="Digite seu email"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#555"
        />
        <Text style={styles.textLabel}>Senha</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={true}
          placeholder="Digite sua senha"
          placeholderTextColor="#555"
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderWidth: 5, // Borda do logo
    borderColor: 'black', // Cor da borda
    borderRadius: 75, // Borda arredondada
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  textLabel: {
    fontSize: 16,
    alignSelf: 'flex-start',
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 5,
    marginLeft: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    width: 300,
    marginBottom: 15,
    padding: 10,
    color: 'black',
  },
  button: {
    backgroundColor: '#FF8000', // Fundo laranja
    borderRadius: 25, // Bordas arredondadas
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderWidth: 2, // Contorno preto
    borderColor: 'black',
    width: 200,
  },
  buttonText: {
    color: 'black', // Texto em preto
    fontWeight: 'bold', // Texto em negrito
    textAlign: 'center',
  },
});
