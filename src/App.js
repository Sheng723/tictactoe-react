import { useState } from 'react';

function Square({ value, onSquareClick, squareClass }) {
  return (
    <button className={`square ${squareClass}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  
  let status;
  let b = [];
  if (winner) {
    status = 'Winner: ' + winner[0];
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }
  for(let i = 0; i < 3;i++) {
    let d =[];
    
    for(let c = 0; c< 3;c++) {
      const isWinningSquare = winner && winner[1].includes(c+ (3*i));

      const squareClassName = isWinningSquare ? 'winning-square' : 'normal-square';
      d.push(<Square key={c+ (3*i)} value={squares[c+ (3*i)]} onSquareClick={() => handleClick(c + (3*i))} squareClass={squareClassName} />);
      
      // d.push(<Square key={c} value={squares[c+ (3*i)]} onSquareClick={() => handleClick(c + (3*i))} />);
    }
    b.push(<div key={i}>{d}</div>);
  }
  return (
    <>
      <div className="status">{status}</div>
       {b}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function onSortButtonClick() {
    // console.log(history.reverse());
    setHistory(history.reverse());
  }

  const moves = history.map((squares, move) => {
    let description;
    let a;

    if (move > 0) {
      let b = history[move-1].reduce((indices, el, i) => (el !== squares[i] ? [...indices, i] : indices), []);
      let row = Math.floor(b / 3);
      let column = b % 3;
      description = 'Go to move #' + move + ' - (' + (row+1) + ', ' + (column+1) + ')';
    } else {
      description = 'Go to game start';
    }
    if(move === currentMove) {
       a = <div>{description}</div>
    } else {
      a = <button onClick={() => jumpTo(move)}>{description}</button>
    }
    return (
      <li key={move}>
        {a}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
        <button onClick={onSortButtonClick}>Sort</button>
      </div>
      
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return null;
}
