import React, { useState } from 'react';
import { Text, TouchableOpacity, TextInput, Alert, StyleSheet, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';



export default function ReservasScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [guests, setGuests] = useState('');
  const [observations, setObservations] = useState('');

  const confirmarReserva = async () => {
    if (!selectedDate || !guests || isNaN(guests)) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos corretamente.');
      return;
    }

    try {
      const response = await axios.post('http://192.168.15.29:8000/reservas/create', {
        data: selectedDate,
        numeroDeConvidados: Number(guests),
        observacoes: observations,
      });

      if (response.status === 201) {
        // Reserva criada com sucesso
        Alert.alert(
          'Reserva Confirmada',
          'Para finalizar sua reserva, siga para o pagamento.',
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Continuar',
              onPress: () => navigation.navigate('Pagamento', { selectedDate, guests, observations }),
            },
          ]
        );
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Exibe a mensagem de erro retornada pelo servidor (ex.: capacidade máxima excedida)
        Alert.alert('Erro', error.response.data.error || 'Erro ao criar reserva.');
      } else {
        // Para outros erros (ex.: falha de comunicação ou erro desconhecido)
        Alert.alert('Erro', 'Falha ao comunicar com o servidor. Tente novamente.');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Escolha a data do evento:</Text>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{ [selectedDate]: { selected: true, selectedDotColor: 'orange' } }}
        style={styles.calendar}
      />
      <Text style={styles.label}>Número de convidados:</Text>
      <TextInput
        style={styles.input}
        placeholder="Número de convidados"
        value={guests}
        onChangeText={setGuests}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Observações:</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Observações"
        value={observations}
        onChangeText={setObservations}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={confirmarReserva}>
        <Text style={styles.buttonText}>Confirmar Reserva</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#000', // Cor de fundo clara
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',
  },
  label: {
    fontSize: 16,
    marginVertical: 5,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',
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
    alignSelf: 'center',
  },
  calendar: {
    width: '100%',
    marginBottom: 20,
    borderRadius: 10, // Bordas arredondadas
    overflow: 'hidden',
    borderWidth: 3, // Contorno preto
    borderColor: '#FF8000', // Cor da borda
  },
  button: {
    backgroundColor: '#FF8000', // Fundo laranja
    borderRadius: 25, // Bordas redondas
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 2, // Contorno preto
    borderColor: 'black',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'black', // Texto em preto
    fontWeight: 'bold', // Texto em negrito
    textAlign: 'center',
    fontSize: 16,
  },
});
