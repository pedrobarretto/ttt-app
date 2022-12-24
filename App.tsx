import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, View, ImageBackground, Image, Pressable } from 'react-native';
import board from './assets/bg.png';
import xImg from './assets/x.png';
import oImg from './assets/o.png';

export default function App() {
  const [turn, setTurn] = useState<'x' | 'o'>('x');
  const [table, setTable] = useState([
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ]);

  const emptyTable = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];

  const makeMove = (row: number, cell: number) => {
    const pos = table[row][cell];

    if (pos !== '') return;

    let newTable = [];
    table[row][cell] = turn;
    newTable = table;

    setTable(newTable);
    setTurn(turn === 'x' ? 'o' : 'x');
  }

  function allEqual(arr: string[]) {
    return new Set(arr).size == 1;
  }

  const checkWinner = () => {
    // Check if winner is on a row
    console.debug('Checking winner...');
    table.map((row, rIndex) => {
      // Check strait row
      if (row[rIndex] !== '' && allEqual(row)) {
        console.debug('Win on horizontal!');
        setTable(emptyTable);
        return;
      }
    });

    // FIXME: Not working :(
    if (table[0][0] === '' && table[0][1] === '' && table[0][2] === '') return;

    if (
      table[0][0] === table[0][1] &&
      table[0][0] === table[0][2] &&
      table[0][1] === table[0][2]
      ) {
        console.debug('Win on first vertical!');
        setTable(emptyTable);
        return;
      }
  }

  useEffect(() => {
    checkWinner();
  }, [table, turn]);

  return (
    <View style={styles.container}>
      <ImageBackground source={board} style={styles.bg} resizeMode='contain' />

      <View style={styles.grid}>
        {
          table.map((row, rIndex) => {
            return (
              <View key={rIndex} style={styles.row}>
                {
                  row.map((cell, cIndex) => {
                    return (
                      <Pressable key={cIndex} style={styles.cell} onPress={() => makeMove(rIndex, cIndex)}>
                        {cell === 'o' && <Image source={oImg} style={[styles.img, styles.oImg]} />}
                        {cell === 'x' && <Image source={xImg} style={[styles.img, styles.xImg]} />}
                      </Pressable>
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
    marginLeft: 25
  },
  oImg: {
    marginTop: 13,
    marginLeft: 12
  },
  grid: {
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
