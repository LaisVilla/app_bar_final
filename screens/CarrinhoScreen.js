import React, { useContext, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, Image, Alert, TextInput } from 'react-native';
import { CarrinhoContext } from '../context/CarrinhoContext';
import axios from 'axios';

export default function CarrinhoScreen({ navigation }) {
  const { carrinho, adicionarAoCarrinho, removerDoCarrinho, limparCarrinho } = useContext(CarrinhoContext);

  // Estado para dados de pagamento
  const [formaPagamento, setFormaPagamento] = useState(''); // Por exemplo, 'Cartão', 'Pix', etc.
  const [dataCompra, setDataCompra] = useState(new Date().toISOString()); // Data atual

  const total = carrinho.reduce((sum, item) => sum + (parseFloat(item.preco.replace('R$', '')) * item.quantidade), 0);

  const confirmarRemocao = (id) => {
    Alert.alert(
      'Remover item',
      'Você quer remover este item do carrinho?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sim, remover', onPress: () => removerDoCarrinho(id) }
      ]
    );
  };

  const confirmarLimpezaCarrinho = () => {
    Alert.alert(
      'Limpar Carrinho',
      'Você tem certeza que deseja limpar o carrinho?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sim, limpar', onPress: limparCarrinho }
      ]
    );
  };

  const handleDecrement = (item) => {
    if (item.quantidade > 1) {
      adicionarAoCarrinho({ ...item, quantidade: -1 });
    } else {
      confirmarRemocao(item._id);
    }
  };

  const handleIncrement = (item) => {
    adicionarAoCarrinho({ ...item, quantidade: 1 });
  };

  const finalizarCompra = async () => {
    try {
      const dadosCompra = {
        produtos: carrinho.map(item => ({
          id: item._id,
          nome: item.nome,
          preco: item.preco,
          quantidade: item.quantidade,
        })),
        total: total,
        dataCompra: dataCompra, // Incluindo data da compra
      };

      const response = await axios.post('http://192.168.15.29:8000/compras', dadosCompra);

      if (response.status === 201) {
        Alert.alert(
          'Compra Confirmada',
          'Para finalizar sua compra, siga para o pagamento.',
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Continuar',
              onPress: () => {
                // Navega para a tela de pagamento e limpa o carrinho após confirmação
                navigation.navigate('Pagamento', {
                  carrinho: carrinho,
                  total: total,
                });
                limparCarrinho(); // Limpa o carrinho após o pagamento
              },
            },
          ]
        );
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Erro ao finalizar a compra.';
      Alert.alert('Erro', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carrinho de Compras</Text>
      <FlatList
        data={carrinho}
        keyExtractor={(item) => item._id ? item._id.toString() : Math.random().toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.imgUrl }} style={styles.itemImage} />
            <Text style={styles.itemText}>{item.nome}</Text>
            <Text style={styles.itemText}>Preço: {item.preco}</Text>
            <Text style={styles.itemText}>
              Subtotal: R${(parseFloat(item.preco.replace('R$', '').replace(',', '.')) * item.quantidade).toFixed(2)}
            </Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => handleDecrement(item)} style={styles.quantityButton}>
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantidade}</Text>
              <TouchableOpacity onPress={() => handleIncrement(item)} style={styles.quantityButton}>
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <Text style={styles.total}>Total: R${total.toFixed(2)}</Text>
      <TouchableOpacity onPress={finalizarCompra} style={styles.finalizarButton}>
        <Text style={styles.finalizarButtonText}>Finalizar Compra</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={confirmarLimpezaCarrinho} style={styles.clearButton}>
        <Text style={styles.clearButtonText}>Limpar Carrinho</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: 'white', // Texto em branco
  },
  clearButton: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'red', // Fundo vermelho
    borderRadius: 25, // Bordas arredondadas
    marginBottom: 15,
    width: '70%',
    borderWidth: 2, // Contorno preto
    borderColor: 'white',
    alignSelf: 'center',
  },
  clearButtonText: {
    color: 'white', // Texto em branco
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10, // Bordas mais arredondadas
    borderWidth: 2, // Adiciona uma borda fina
    borderColor: '#FF8000',
  },
  itemImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
    borderRadius: 10, // Imagens com bordas levemente arredondadas
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5,
    color: 'black', // Texto em preto
    fontWeight: 'bold', // Negrito
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityButton: {
    padding: 8,
    backgroundColor: '#FF8000', // Fundo laranja
    borderRadius: 10, // Bordas arredondadas
    borderWidth: 1, // Contorno preto
    borderColor: 'black',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black', // Texto em preto
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold', // Negrito
    color: 'black', // Texto em preto
  },
  total: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
    color: 'white', // Texto em preto
  },
  finalizarButton: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FF8000', // Fundo laranja
    borderRadius: 25, // Bordas arredondadas
    marginBottom: 15,
    borderWidth: 2, // Contorno preto
    borderColor: 'black',
  },
  finalizarButtonText: {
    color: 'black', // Texto em preto
    fontSize: 16,
    fontWeight: 'bold',
  },
});

