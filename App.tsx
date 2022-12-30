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

  const getCol = (colIndex: number): string[] => [
    table[0][colIndex],
    table[1][colIndex],
    table[2][colIndex]
  ];

  const getLeftDiagonal = (): string[] => [
    table[0][0],
    table[1][1],
    table[2][2]
  ]

  const getRightDiagonal = (): string[] => [
    table[0][2],
    table[1][1],
    table[2][0]
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

  const checkIfArrayHasBlankCell = (arr: string[]) => {
    const filteredArray = arr.filter(x => x === '');

    return filteredArray.length > 0 ? true : false; 
  }

  const checkWinner = () => {
    let winner = '';
    table.map((row, rIndex) => {
      // Check row
      if (row[rIndex] !== '' && allEqual(row)) {
        console.debug('Win on horizontal!');
        setTable(emptyTable);
        winner = turn === 'x' ? 'o' : 'x';
      }

      // Check col
      if (row[rIndex] !== '' && allEqual(getCol(rIndex))) {
        console.debug('Win on vertical!');
        setTable(emptyTable);
        winner = turn === 'x' ? 'o' : 'x';
      }

      // Check left diagonal
      if (!checkIfArrayHasBlankCell(getLeftDiagonal()) && allEqual(getLeftDiagonal())) {
        console.debug('Win on left diagonal!');
        setTable(emptyTable);
        winner = turn === 'x' ? 'o' : 'x';
      }

      // Check right diagonal
      if (!checkIfArrayHasBlankCell(getRightDiagonal()) && allEqual(getRightDiagonal())) {
        console.debug('Win on right diagonal!');
        setTable(emptyTable);
        winner = turn === 'x' ? 'o' : 'x';
      }
    });

    return winner;
  }

  useEffect(() => {
    const x = checkWinner();
    console.log(x);
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
