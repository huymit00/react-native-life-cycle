import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {ActivityIndicator, Button, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import axios from 'axios';
import {TextInput} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SecondScreen = () => {
  const navigation = useNavigation();

  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [agentCode, setAgentCode] = useState('');

  // const API_KEY = '566950e462b2eed8f51968c91cb8bf60';

  // const fetchWeather = async () => {
  //   try {
  //     setLoading(true);
  //     setWeather(null);
  //     if (!city.trim()) {
  //       setError('Bạn chưa nhập tên thành phố!');
  //       return;
  //     }
  //     setError('');
  //     const response = await axios.get(
  //       `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`,
  //     );
  //     setWeather(response.data);
  //   } catch (err) {
  //     setError('Không tìm thấy thành phố này!');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const dtc = async () => {
    try {
      const response = await axios.post(
        'https://data1.datacom.vn/api/UserAccount/UserAccountLogin',
        {
          RequestInfo: {
            PrivateKey: 'M8jAubN75AXas2dfoOpx293Hg567sdLpB56iqc2CtTXgjVX8AQ',
          },
          Username: user,
          Password: password,
          AgentCode: agentCode,
        },
      );
      if (response.data.Success) {
        // console.log(response.data);
        await AsyncStorage.setItem('TokenLogin', response.data.TokenLogin);
        const tokenLogin = await AsyncStorage.getItem('TokenLogin');
        console.log(tokenLogin);
      }
      console.log('first');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SafeAreaView>
      <Text style={styles.title}>Weather</Text>

      {/* <TextInput
        style={styles.input}
        placeholder="Nhập tên thành phố..."
        value={city}
        onChangeText={text => setCity(text)}
      /> */}

      <TextInput
        style={styles.input}
        placeholder="Nhập Username..."
        value={user}
        onChangeText={setUser}
      />

      <TextInput
        style={styles.input}
        placeholder="Nhập Password..."
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Nhập AgentCode..."
        value={agentCode}
        onChangeText={setAgentCode}
      />

      <Button title="Lấy thông tin" onPress={dtc} />

      <Text style={styles.text}>{}</Text>

      {loading && (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* {weather && (
        <View style={styles.weatherContainer}>
          <Text style={styles.weatherText}>Thành phố: {weather.name}</Text>
          <Text style={styles.weatherText}>
            Nhiệt độ: {weather.main.temp}°C
          </Text>
          <Text style={styles.weatherText}>
            Thời tiết: {weather.weather[0].description}
          </Text>
          <Text style={styles.weatherText}>
            Tốc độ gió: {weather.wind.speed} m/s
          </Text>
        </View>
      )} */}

      <Button
        title="Go to HomeScreen"
        onPress={() => navigation.navigate('Home')}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  text: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  loader: {
    marginVertical: 10,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  weatherContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#e6f7ff',
    borderRadius: 5,
  },
  weatherText: {
    fontSize: 18,
    marginBottom: 5,
  },
});
