import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, View, ImageBackground, Image } from 'react-native';
import board from './assets/bg.png';
import xImg from './assets/x.png';
import oImg from './assets/o.png';

export default function App() {
  const [table, setTable] = useState([
    ['o', '', 'o'],
    ['x', '', 'x'],
    ['', '', 'o']
  ]);

  return (
    <View style={styles.container}>
      <ImageBackground source={board} style={styles.bg} resizeMode='contain' />

      <View style={styles.grid}>
        {
          table.map((row) => {
            return (
              <View style={styles.row}>
                {
                  row.map((cell) => {
                    return (
                      <View style={styles.cell}>
                        {cell === 'o' && <Image source={oImg} style={[styles.img, styles.oImg]} />}
                        {cell === 'x' && <Image source={xImg} style={[styles.img, styles.xImg]} />}
                      </View>
                    )
                  })
                }
              </View>
            )
          })
        }
      </View>
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
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    position: 'absolute',
  },
  xImg: {
    marginTop: 15,
    marginLeft: 15
  },
  oImg: {
    marginTop: 15,
    marginLeft: 15
  },
  grid: {
    borderWidth: 1,
    borderColor: 'red',
    width: '80%',
    aspectRatio: 1,
    position: 'absolute'
  },
  row: {
    flex: 1,
    flexDirection: "row",
  },
  cell: {
    width: 100,
    height: 100,
    flex: 1,
  }
});
