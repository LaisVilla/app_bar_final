import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRoute } from '@react-navigation/native';

export default function PagamentoScreen({ navigation }) {
    const route = useRoute();
    const { selectedDate, guests, observations } = route.params || {};

    const [loading, setLoading] = useState(false);
    const [metodoPagamento, setMetodoPagamento] = useState('');
    const [cartao, setCartao] = useState('');
    const [validade, setValidade] = useState('');
    const [cvv, setCvv] = useState('');
    const [pixChave, setPixChave] = useState('');

    const isValidCartao = (numero) => /^\d{13,19}$/.test(numero); 
    const isValidValidade = (data) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(data); 
    const isValidCvv = (codigo) => /^\d{3,4}$/.test(codigo);
    const isValidPix = (chave) => /^[0-9]{11,14}$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$|^\+?[0-9]{10,15}$/.test(chave);

    const processarPagamento = (metodo) => {
      if (metodo === 'Cartão de Crédito' || metodo === 'Cartão de Débito') {
        if (!cartao || !validade || !cvv || !isValidCartao(cartao) || !isValidValidade(validade) || !isValidCvv(cvv)) {
          Alert.alert('Erro', 'Por favor, preencha todos os campos do cartão corretamente.');
          return;
        }
      } else if (metodo === 'Pix') {
        if (!pixChave || !isValidPix(pixChave)) {
          Alert.alert('Erro', 'Por favor, preencha a chave Pix corretamente.');
          return;
        }
      }

      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        Alert.alert('Sucesso', `Pagamento via ${metodo} realizado com sucesso!`);
        navigation.navigate('Home');
      }, 2000);
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.titulo}>Escolha a forma de pagamento:</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={metodoPagamento}
                        style={styles.input}
                        onValueChange={(itemValue) => setMetodoPagamento(itemValue)}
                    >
                        <Picker.Item label="Selecione o método" value="" />
                        <Picker.Item label="Cartão de Crédito" value="Cartão de Crédito" />
                        <Picker.Item label="Cartão de Débito" value="Cartão de Débito" />
                        <Picker.Item label="Pix" value="Pix" />
                    </Picker>
                </View>

                {(metodoPagamento === 'Cartão de Crédito' || metodoPagamento === 'Cartão de Débito') && (
                    <View style={styles.campos}>
                        <Text style={styles.label}>Digite os dados do seu cartão</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Número do Cartão"
                            value={cartao}
                            onChangeText={setCartao}
                            keyboardType="numeric"
                            maxLength={19}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Validade (MM/AA)"
                            value={validade}
                            onChangeText={setValidade}
                            maxLength={5}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="CVV"
                            value={cvv}
                            onChangeText={setCvv}
                            secureTextEntry
                            keyboardType="numeric"
                            maxLength={4}
                        />
                    </View>
                )}

                {metodoPagamento === 'Pix' && (
                    <View style={styles.campos}>
                        <Text style={styles.label}>Digite a chave Pix</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Chave Pix"
                            value={pixChave}
                            onChangeText={setPixChave}
                        />
                    </View>
                )}
            </ScrollView>

            <View style={styles.botoes}>
                <TouchableOpacity style={styles.button} onPress={() => processarPagamento(metodoPagamento)} disabled={loading}>
                    <Text style={styles.buttonText}>Confirmar Pagamento</Text>
                </TouchableOpacity>
                {loading && (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loading}>Processando pagamento...</Text>
                    </View>
                )}
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#000',
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
        justifyContent: 'flex-start',
    },
    pickerContainer: {
        marginBottom: 20,
        width: '70%',  // Reduzindo a largura do container do Picker
        alignSelf: 'center',  // Centraliza o Picker na tela
    },
    titulo: {
        fontSize: 18,
        marginBottom: 16,
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
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
        width: '100%',
        marginBottom: 15,
        padding: 10,
        color: 'black',
    },
    campos: {
        marginTop: 20,
        marginBottom: 16,
    },
    botoes: {
        padding: 16,
        justifyContent: 'flex-end',
    },
    button: {
        backgroundColor: '#FF8000',
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 2,
        borderColor: 'black',
        width: '100%',
        alignSelf: 'center',
    },
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    loading: {
        textAlign: 'center',
        marginTop: 10,
        color: 'white',
    },
});
