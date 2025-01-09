/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  AppState,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



function App(): React.JSX.Element {

  const [count, setCount] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [message, setMessage] = useState('');
  const timeIdRef = useRef<NodeJS.Timeout | null>(null)
  const [stateVisible, setStateVisible] = useState(AppState.currentState)


  const onStart = useCallback(() => {
    handleCount(inputValue)
  }, [inputValue])

  const handleCount = useCallback((_inputValue: string) => {
    const number = parseInt(_inputValue, 10)
    if (isNaN(number) || number <= 0) return

    setMessage('')
    setCount(number)

    if (timeIdRef.current !== null) {
      clearInterval(timeIdRef.current)
    }

    timeIdRef.current = setInterval(() => {
      setCount((pre) => {
        const newCount = pre! - 1

        if (newCount <= 0) {
          setMessage('Done')
          clearInterval(timeIdRef.current!)
        }

        return newCount
      });
    }, 1000);
  }, [])



  const storeCount = useCallback(async (_count: number | null) => {

    try {
      if (_count === null) return

      await AsyncStorage.setItem('count', _count.toString())

    } catch (error) {
      console.log("🚀 ~ storeCount ~ error:", error)

    }

  }, [])

  useEffect(() => {
    storeCount(count)
  }, [count])


  useEffect(() => {
    const a = AppState.addEventListener('change', async (nextState) => {
      try {
        if (nextState == 'background') {
          const time = Date.now()
          await AsyncStorage.setItem('timeExit', time.toString())
        }
      }
      catch (error) {
        console.error("Error!", error)
      }
    })

    return a.remove
  }, [])



  useEffect(() => {
    const getTimeCount = async () => {
      try {
        const timeExit = await AsyncStorage.getItem('timeExit')

        const _count = await AsyncStorage.getItem('count')


        if (timeExit !== null && _count !== null) {
          const timeOpenApp = Date.now()

          const countNumber = Math.round((timeOpenApp - Number(timeExit)) / 1000)

          const newCount = Number(_count) - countNumber


          if (newCount > 0) {
            handleCount(newCount.toString())
          }
        }

      }
      catch (error) {
        console.error('getItem error', error)
      }
    }

    getTimeCount()

  }, [])



  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TextInput style={styles.input}
        onChangeText={setInputValue}
        value={inputValue}
        keyboardType='numeric'
        placeholder="Enter a number"
        onEndEditing={onStart}
      />

      <Button title='Start' onPress={onStart} />

      <Text >AppState:{stateVisible} </Text>

      {count !== null && <Text style={styles.countdown}>{count}</Text>}
      {message !== '' && <Text style={styles.message}>{message}</Text>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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

export default App;



// const handleStart = () => {
//   const number = parseInt(inputValue, 10);
//   if (!isNaN(number) && number > 0) {

//     setCount(number)

//     const goal = number - 10


//     const timeId = setInterval(() => {
//       setCount((pre) => {

//         const newCount = pre! - 1;

//         if (newCount <= goal) {
//           setMessage('Done!');
//           clearInterval(timeId);
//         }

//         return newCount;

//       });
//     }, 1000);
//   }
// }