import { StyleSheet, Text, View, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker'; // Importando o Picker

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("user"); // Valor padrão é "user"

  const handleRegister = () => {
    const user = {
      name: name,
      email: email,
      password: password,
      role,  // Enviando o papel (role) ao backend
    };

    axios.post("http://192.168.15.29:8000/register", user).then((response) => {
      console.log(response);
      Alert.alert("Registrado com sucesso","registro funcionou");
     

      setName("");
      setPassword("");
      setEmail("");
      setRole("user"); // Reseta o role para "user"
    }).catch((error) => {
      Alert.alert("registro falhou", "um erro ocorreu");
      console.log("registro falhou", error)
    })

  }
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome</Text>
      <TextInput
        value={name}
        onChangeText={(text) => setName(text)}
        style={styles.input}
        placeholder="Digite seu nome"
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
        placeholder="Digite seu email"
      />
      <Text style={styles.label}>Senha</Text>
      <TextInput
        value={password}
        onChangeText={(text) => setPassword(text)}
        style={styles.input}
        secureTextEntry={true}
        placeholder="Digite sua senha"
      />

      {/* Adicionando Picker para seleção de role */}
      <Text style={styles.label}>Selecione o Papel</Text>
      <Picker
        selectedValue={role}
        style={styles.input}
        onValueChange={(itemValue) => setRole(itemValue)}
      >
        <Picker.Item label="Usuário" value="user" />
        <Picker.Item label="Administrador" value="admin" />
      </Picker>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // Fundo claro
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
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
  button: {
    backgroundColor: '#FF8000', // Fundo laranja
    borderRadius: 25, // Bordas arredondadas
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderWidth: 2, // Contorno preto
    borderColor: 'black',
    width: '70%',
    alignSelf: 'center',
  },
  buttonText: {
    color: 'black', // Texto em preto
    fontWeight: 'bold', // Texto em negrito
    textAlign: 'center',
  },
});