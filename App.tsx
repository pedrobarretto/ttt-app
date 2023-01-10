import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, View, ImageBackground, Image, Pressable, Button } from 'react-native';
import board from './assets/bg.png';
import xImg from './assets/x.png';
import oImg from './assets/o.png';

enum Gamemode {
  ia,
  human
};

interface Scores {
  [key: string]: number
}

export default function App() {
  const [gamemode, setGamemode] = useState<Gamemode>(Gamemode.human);
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

  const scores: Scores = {
    'x': 1,
    'o': -1,
    'tie': 0
  };

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

  const changeGameMode = (gm: Gamemode) => {
    setTable(emptyTable);
    setGamemode(gm);
    if (gm === Gamemode.ia) {
      iaMove();
    }
  };

  function allEqual(arr: string[]) {
    return new Set(arr).size == 1;
  }

  const checkIfArrayHasBlankCell = (arr: string[]) => {
    const filteredArray = arr.filter(x => x === '');

    return filteredArray.length > 0 ? true : false; 
  }

  const makeMove = (row: number, cell: number) => {
    const pos = table[row][cell];

    if (pos !== '') return;

    let newTable = [...table];
    newTable[row][cell] = gamemode === Gamemode.ia ? 'o' : turn;

    setTable(newTable);

    if (gamemode === Gamemode.human) {
      setTurn((state) => {
        return state === 'x' ? 'o' : 'x'
      });
    } else {
      console.debug('CALLING IA MOVE FUNC!');
      iaMove();
    }
  }

  const minimax = (table: string[][], depth: number, isMaximizing: boolean): number => {
    const { isWinner, winner } = checkWinner();
    console.log(isWinner, winner, scores[winner]);
    if (isWinner === true) {
      console.log('isWinner === true');
      return scores[winner];
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      let newTable = [...table];
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (newTable[i][j] === '') {
            console.log('i, j: ', i, j);
            newTable[i][j] = 'x';
            const score = minimax(newTable, depth + 1, false);
            newTable[i][j] = '';
            bestScore = Math.max(score, bestScore);
          }
        }
      }
      return bestScore;
    } else {
      let bestScore = -Infinity;
      let newTable = [...table];
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (newTable[i][j] === '') {
            console.log('i, j: ', i, j);
            newTable[i][j] = 'o';
            const score = minimax(newTable, depth + 1, true);
            newTable[i][j] = '';
            bestScore = Math.min(score, bestScore);
          }
        }
      }
      return bestScore;
    }
  };

  const iaMove = () => {
    console.log('turn: ', turn)
    let bestScore = -Infinity;
    let bestMove = { i: 0, j: 0 };
    let newTable = [...table];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (newTable[i][j] === '') {
          console.log('i, j: ', i, j);
          newTable[i][j] = 'x';
          const score = minimax(newTable, 0, false);
          newTable[i][j] = '';
          if (score > bestScore) {
            bestScore = score;
            bestMove = { i, j };
          }
        }
      }
    }
    newTable[bestMove.i][bestMove.j] = 'x';
    console.log('newTable: ', newTable)
    setTable(() => {
      return [...newTable];
    });
    console.log('turn ao final: ', turn);
  };

  const checkWinner = () => {
    let winner = '';
    let isWinner = false;
    table.map((row, rIndex) => {
      // Check row
      if (row[rIndex] !== '' && allEqual(row)) {
        console.debug('Win on horizontal!');
        winner = turn === 'x' ? 'o' : 'x';
        isWinner = true;
      }

      // Check col
      if (row[rIndex] !== '' && allEqual(getCol(rIndex))) {
        console.debug('Win on vertical!');
        winner = turn === 'x' ? 'o' : 'x';
        isWinner = true;
      }

      // Check left diagonal
      if (!checkIfArrayHasBlankCell(getLeftDiagonal()) && allEqual(getLeftDiagonal())) {
        console.debug('Win on left diagonal!');
        winner = turn === 'x' ? 'o' : 'x';
        isWinner = true;
      }

      // Check right diagonal
      if (!checkIfArrayHasBlankCell(getRightDiagonal()) && allEqual(getRightDiagonal())) {
        console.debug('Win on right diagonal!');
        winner = turn === 'x' ? 'o' : 'x';
        isWinner = true;
      }

      if (
        row[rIndex] !== '' &&
        !allEqual(row) &&
        !allEqual(getCol(rIndex)) &&
        !checkIfArrayHasBlankCell(getLeftDiagonal()) &&
        !allEqual(getLeftDiagonal()) &&
        !checkIfArrayHasBlankCell(getRightDiagonal()) && 
        !allEqual(getRightDiagonal())
      ) {
        console.log('Its a tie!');
        winner = 'tie';
        isWinner = false;
      }
    });

    return { isWinner, winner };
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

      <View style={styles.buttonsView}>
        <Button title='1x1' onPress={() => changeGameMode(Gamemode.human)} />
        <Button title='Contra bot' onPress={() => changeGameMode(Gamemode.ia)} />
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
  },
  buttonsView: {
    bottom: 60,
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    gap: 5
  }
});
