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
    'x': 10,
    'o': -10,
    'tie': 0
  };

  useEffect(() => {
    checkWinner(table, turn);
  }, [table, turn]);

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
      iaMove(emptyTable);
    }
  };

  const restartGame = () => {
    setTable(emptyTable);
    setTurn('x');
  }

  function allEqualNoBlank(arr: string[]) {
    if (checkIfArrayHasBlankCell(arr)) return false;

    return allEqual(arr);
  }

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

    if (gamemode === Gamemode.ia) {
      console.log('CALLING IAMOVE() FUNC!');
      setTurn('o');
      iaMove(newTable);
    } else {
      setTurn((state) => {
        return state === 'x' ? 'o' : 'x'
      });
    }
  }

  function minimax(table: string[][], depth: number, isMaximizing: boolean, player: string) {
    let board = [...table];
    const { isWinner, winner } = checkWinner(board, player);

    if (isWinner === true || depth === 0) {
      console.debug('[minimax] isWinner is equal to ', isWinner);
      console.debug('[minimax] scores[winner] is equal to ', scores[winner]);
      console.log('winner: ', winner);
      return scores[winner] || 0;
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] == '') {
            board[i][j] = 'x';
            let score = minimax(board, depth + 1, false, 'x');
            board[i][j] = '';
            bestScore = Math.max(score, bestScore);
          }
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] == '') {
            board[i][j] = 'o';
            let score = minimax(board, depth + 1, true, 'o');
            board[i][j] = '';
            bestScore = Math.min(score, bestScore);
          }
        }
      }
      return bestScore;
    }

    // let bestScore = isMaximizing ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
    // let currentScore;
    // for (let row = 0; row < board.length; row++) {
    //     for (let col = 0; col < board[row].length; col++) {
    //         if (board[row][col] === '') {
    //             board[row][col] = isMaximizing ? 'x' : 'o';
    //             currentScore = minimax(board, depth - 1, !isMaximizing);
    //             console.debug('[minimax] currentScore is equals to ', currentScore)
    //             board[row][col] = '';
    //             if (isMaximizing) {
    //                 bestScore = Math.max(bestScore, currentScore);
    //             } else {
    //                 bestScore = Math.min(bestScore, currentScore);
    //             }
    //         }
    //     }
    // }
    // return bestScore;
  }

  function iaMove(board: string[][]) {
    let bestScore = -Infinity;
    let move = { i: 0, j: 0 };
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == '') {
          board[i][j] = 'x';
          let score = minimax(board, 0, false, 'x');
          console.debug('[iaMove] score: ', score);
          board[i][j] = '';
          if (score > bestScore) {
            bestScore = score;
            move = { i, j };
          }
        }
      }
    }
    board[move.i][move.j] = 'x';
    setTable(board);
    // currentPlayer = human;
  }

  const checkWinner = (table: string[][], player: string) => {
    let winner = '';
    let isWinner = false;

    console.log('[checkWinner] player is ', player);

    if (allEqualNoBlank(table[0]) || allEqualNoBlank(table[1]) ||allEqualNoBlank(table[2])) {
      winner = player === 'x' ? 'o' : 'x';
      isWinner = true;
      console.debug(`Win on horizontal! Winner is ${winner}`);
    }
    if (allEqualNoBlank(getCol(0)) || allEqualNoBlank(getCol(1)) || allEqualNoBlank(getCol(2))) {
      winner = player === 'x' ? 'o' : 'x';
      isWinner = true;
      console.debug(`Win on vertical! Winner is ${winner}`);
    }
    if (allEqualNoBlank(getLeftDiagonal())) {
      winner = player === 'x' ? 'o' : 'x';
      isWinner = true;
      console.debug(`Win on left diagonal! Winner is ${winner}`);
    }
    if (allEqualNoBlank(getRightDiagonal())) {
      winner = player === 'x' ? 'o' : 'x';
      isWinner = true;
      console.debug(`Win on right diagonal! Winner is ${winner}`);
    }
    if (
      !checkIfArrayHasBlankCell(table[0]) &&
      !checkIfArrayHasBlankCell(table[1]) &&
      !checkIfArrayHasBlankCell(table[2]) &&
      !allEqual(table[0]) &&
      !allEqual(table[1]) &&
      !allEqual(table[2]) &&
      !allEqual(getCol(0)) &&
      !allEqual(getCol(1)) &&
      !allEqual(getCol(2)) &&
      !allEqual(getLeftDiagonal()) &&
      !allEqual(getRightDiagonal())
      ) {
      console.debug('Its a tie!');
      winner = 'tie';
      isWinner = false;
    }

    return { isWinner, winner };
  }

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
        <Button title='Restart' onPress={restartGame} />
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
