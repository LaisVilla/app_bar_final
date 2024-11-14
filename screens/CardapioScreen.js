import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Image, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { CarrinhoContext } from '../context/CarrinhoContext'; 

export default function CardapioScreen({ navigation }) {
  const { adicionarAoCarrinho } = useContext(CarrinhoContext);
  const [produtos, setProdutos] = useState([]);
  const [quantidades, setQuantidades] = useState({});
  const [loading, setLoading] = useState(true);

  // Função para buscar produtos da API
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await fetch("http://192.168.15.29:8000/produtos"); // Substitua pelo URL correto
        if (!response.ok) throw new Error("Erro ao buscar produtos");

        const data = await response.json();
        setProdutos(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, []);

  const handleQuantidadeChange = (id, change) => {
    setQuantidades((prevQuantidades) => {
      const newQuantity = (prevQuantidades[id] || 1) + change;
      return {
        ...prevQuantidades,
        [id]: Math.max(newQuantity, 1),
      };
    });
  };

  const handleAdicionar = (item) => {
    const quantidade = quantidades[item._id] || 1;
    if (quantidade > 0) {
      adicionarAoCarrinho({ ...item, quantidade });
      Alert.alert(`Adicionado ao carrinho: ${item.nome}, Quantidade: ${quantidade}`);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.imgUrl }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text>
        {item.nome} - R$ {parseFloat(item.preco).toFixed(2).replace('.', ',')}
        </Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => handleQuantidadeChange(item._id, -1)} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantidades[item._id] || 1}</Text>
          <TouchableOpacity onPress={() => handleQuantidadeChange(item._id, 1)} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Button title="Adicionar" onPress={() => handleAdicionar(item)} style={styles.addButton} />
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={produtos}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
      />
      <TouchableOpacity onPress={() => navigation.navigate('Carrinho')} style={styles.viewCartButton}>
        <Text style={styles.viewCartButtonText}>Ver Carrinho</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#000',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#FF8000',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#000',
  },
  itemDetails: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#FF8000',
    borderRadius: 5,
    padding: 5,
    borderWidth: 1,
    borderColor: 'black',
  },
  quantityButtonText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
    color: 'black',
    width: 40,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#FF8000',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'black',
  },
  addButtonText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  viewCartButton: {
    backgroundColor: '#FF8000',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 15,
    borderWidth: 1,
    borderColor: 'black',
  },
  viewCartButtonText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
