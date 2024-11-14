import { StyleSheet } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CarrinhoProvider } from '../context/CarrinhoContext';
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from '../screens/HomeScreen';
import CardapioScreen from '../screens/CardapioScreen';
import CarrinhoScreen from '../screens/CarrinhoScreen';
import ReservasScreen from '../screens/ReservasScreen';
import PagamentoScreen from '../screens/PagamentoScreen';
import CadastroProdutoScreen from '../screens/CadastroProdutoScreen'; // Importa a nova tela

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <CarrinhoProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Login"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#000', // Cor de fundo do cabeçalho
            },
            headerTintColor: '#fff', // Cor do texto do cabeçalho
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name='Home' 
            component={HomeScreen} 
            options={{ title: 'Bar Mediterrâneo' }} 
          />
          <Stack.Screen 
            name='Login' 
            component={LoginScreen} 
            options={{ title: 'Login', headerBackTitle: 'Voltar' }} 
          />
          <Stack.Screen 
            name='Register' 
            component={RegisterScreen} 
            options={{ title: 'Cadastro', headerBackTitle: 'Voltar' }} 
          />
          <Stack.Screen 
            name='Cardapio' 
            component={CardapioScreen} 
            options={{ title: 'Cardápio', headerBackTitle: 'Voltar' }} 
          />
          <Stack.Screen 
            name='Carrinho' 
            component={CarrinhoScreen} 
            options={{ title: 'Carrinho', headerBackTitle: 'Voltar' }} 
          />
          <Stack.Screen 
            name='Reservas' 
            component={ReservasScreen} 
            options={{ title: 'Reservas', headerBackTitle: 'Voltar' }} 
          />
          <Stack.Screen 
            name='Pagamento' 
            component={PagamentoScreen} 
            options={{ title: 'Pagamento', headerBackTitle: 'Voltar' }}
          />
          <Stack.Screen 
            name='Produto' // Nome da nova rota
            component={CadastroProdutoScreen} // Componente do cadastro de produtos
            options={{ title: 'Cadastrar Produto', headerBackTitle: 'Voltar' }}  
          />
        </Stack.Navigator>
      </NavigationContainer>
    </CarrinhoProvider>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
