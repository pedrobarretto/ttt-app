import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, View, ImageBackground, Image } from 'react-native';
import board from './assets/bg.png';
import xImg from './assets/x.png';
import oImg from './assets/o.png';

export default function App() {
  const [table, setTable] = useState([
    ['', 'o', 'o'],
    ['', '', ''],
    ['', '', '']
  ]);

  return (
    <View style={styles.container}>
      <ImageBackground source={board} style={styles.bg} resizeMode='contain' />
      {
        table.map((row, i) => {
          return row.map((innerRow, innerIndex) => {
            console.log(row)
            if (row[i] === 'x') {
              console.log('X', row[i])
              return (
                <Image key={i + 'x'} source={xImg} style={styles.img} />
              )
            } else if (row[i] === 'o') {
              console.log('O', row[i])
              return (
                <Image key={i + 'o'} source={oImg} style={styles.img} />
              )
            } else {
              console.log('blank')
              return <View key={i + 'blank'} />
            }
          })
        })
      }
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DBFFFD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bg: {
    width: '100%',
    height: '100%'
  },
  img: {
    position: 'absolute'
  }
});
