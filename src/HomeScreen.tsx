import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {AppState, Button, StyleSheet, Text} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';

export const HomeScreen = () => {
  const [count, setCount] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [message, setMessage] = useState('');
  const timeIdRef = useRef<NodeJS.Timeout | null>(null);
  const [stateVisible, setStateVisible] = useState(AppState.currentState);

  const handleCount = useCallback((_inputValue: string) => {
    const number = parseInt(_inputValue, 10);
    if (isNaN(number) || number <= 0) return;

    setMessage('');
    setCount(number);

    if (timeIdRef.current !== null) {
      clearInterval(timeIdRef.current);
    }

    timeIdRef.current = setInterval(() => {
      setCount(pre => {
        const newCount = pre! - 1;

        if (newCount <= 0) {
          setMessage('Done');
          clearInterval(timeIdRef.current!);
        }

        return newCount;
      });
    }, 1000);
  }, []);

  const onStart = useCallback(() => {
    handleCount(inputValue);
  }, [handleCount, inputValue]);

  const storeCount = useCallback(async (_count: number | null) => {
    try {
      if (_count === null) return;

      await AsyncStorage.setItem('count', _count.toString());
    } catch (error) {
      console.log('🚀 ~ storeCount ~ error:', error);
    }
  }, []);

  useEffect(() => {
    storeCount(count);
  }, [count, storeCount]);

  useEffect(() => {
    const a = AppState.addEventListener('change', async nextState => {
      try {
        if (nextState == 'background') {
          const time = Date.now();
          await AsyncStorage.setItem('timeExit', time.toString());
        }
      } catch (error) {
        console.error('Error!', error);
      }
    });

    return a.remove;
  }, []);

  useEffect(() => {
    const getTimeCount = async () => {
      try {
        const timeExit = await AsyncStorage.getItem('timeExit');

        const _count = await AsyncStorage.getItem('count');

        if (timeExit !== null && _count !== null) {
          const timeOpenApp = Date.now();

          const countNumber = Math.round(
            (timeOpenApp - Number(timeExit)) / 1000,
          );

          const newCount = Number(_count) - countNumber;

          if (newCount > 0) {
            handleCount(newCount.toString());
          }
        }
      } catch (error) {
        console.error('getItem error', error);
      }
    };

    getTimeCount();
  }, []);

  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeview}>
      <TextInput
        style={styles.input}
        onChangeText={setInputValue}
        value={inputValue}
        keyboardType="numeric"
        placeholder="Enter a number"
        onEndEditing={onStart}
      />

      <Button title="Start" onPress={onStart} />

      <Text>AppState:{stateVisible} </Text>

      {count !== null && <Text style={styles.countdown}>{count}</Text>}
      {message !== '' && <Text style={styles.message}>{message}</Text>}

      <Button
        title="Go to SecondScreen"
        onPress={() => navigation.navigate('Second')}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeview: {
    flex: 1,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  countdown: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 20,
  },

  message: {
    fontSize: 24,
    marginVertical: 20,
    color: 'green',
  },

  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});
