import React from 'react';
import './App.css';
import { useState } from 'react';

//how I learned about the useState() Hook : https://reactjs.org/docs/hooks-state.html, everything else was taught to me by a friend who is a professional Web Developer however he only gave me guidance, the code is all my own

const generateDefaultBoard = () => [ // function that initializes an array
  [0, 0, 0, 0, 0 ,0 ,0],
  [0, 0, 0, 0, 0 ,0 ,0],
  [0, 0, 0, 0, 0 ,0 ,0],
  [0, 0, 0, 0, 0 ,0 ,0],
  [0, 0, 0, 0, 0 ,0 ,0],
  [0, 0, 0, 0, 0 ,0 ,0]
];

function resetBoard(setRows, setVictory, setPlayer) //resets the board
{
  setRows(generateDefaultBoard);
  setVictory(0);
  setPlayer(1);
}

function renderRow(row, clickColumn){ //function that creates each cell of the table
  return row.map((cell, cellIndex) => ( //maps the cellindex to each cell on board, then changes the cell to be either puck-0, puck-1 or puck-2 using string interpolation
    <td key={cellIndex} onClick={() => clickColumn(cellIndex)}> 
      <div className={`puck-${cell}`}/>
    </td>
   ));
}

function renderRows(rows, clickColumn){ //function that creates each row of the table
  return rows.map((row, rowindex) => ( //maps the rowindex to each row created in renderRow
  <tr key={rowindex}> 
    {renderRow(row, clickColumn)} 
  </tr>
  ));
}

function dropPuck(rows, setRows, columnIndex, player, setPlayer, setVictory){
  rows = [...rows]; //duplicates the array so the App re-renders
  let i = rows.length - 1;
  let fullRows = 0;
  while(i >= 0 && rows[i][columnIndex] !== 0) //finds top of stack
  {
    i--;
  }
  if(i >= 0)
  {
    if(player === 1)
    {
      rows[i][columnIndex] = 1; //sets cell to player 1
      connect4(setVictory, i, columnIndex, rows, player); //checks if connect 4
      setPlayer(2); //sets to second player
    }
    else
    {
      rows[i][columnIndex] = 2;
      connect4(setVictory, i, columnIndex, rows, player);
      setPlayer(1);
    }
  }
  for(let j = 0; j < rows.length; j++) //checks to see if all rows or full, in which case game is a draw
  {
    if(rows[0][j] !== 0 )
    {
      fullRows++;
    }
    if(fullRows === rows.length)
    {
      setVictory(3);
    }
  } 
  setRows(rows); //tells rows to change, thus causing a re-render
}

function checkDown(rowIndex, columnIndex, rows, player)
{
  let i = 1;
  let counter = 0;
  while(rowIndex + i < rows.length && rows[rowIndex + i][columnIndex] === player)
  {
    counter ++;
    i++;
    console.log("down: " + counter);
  }
  return counter;
}

function checkLeft(rowIndex, columnIndex, rows, player)
{
  let i = 1;
  let counter = 0;
  while( columnIndex - i > -1 && rows[rowIndex][columnIndex - i] === player)
  {
    counter ++;
    i++;
    console.log("left: " + counter);
  }
  return counter;
}

function checkRight(rowIndex, columnIndex, rows, player)
{
  let i = 1;
  let counter = 0;
  while( columnIndex + i <= rows.length && rows[rowIndex][columnIndex + i] === player)
  {
    counter ++;
    i++;
    console.log("right: " + counter);
  }
  return counter;
}

function checkDownLeft(rowIndex, columnIndex, rows, player)
{
  let i = 1;
  let counter = 0;
  while( columnIndex - i >= -1 && rowIndex + i < rows.length && rows[rowIndex + i][columnIndex - i] === player)
  {
    counter++;
    i++;
    console.log("DownLeft: " + counter);
  }
  return counter;
}

function checkUpRight(rowIndex, columnIndex, rows, player)
{
  let i = 1;
  let counter = 0;
  while(rowIndex - i > -1 && columnIndex + i <= rows.length && rows[rowIndex - i][columnIndex + i] === player)
  {
    counter++;
    i++;
    console.log("UpRight: " + counter);
  }
  return counter;
}

function checkUpLeft(rowIndex, columnIndex, rows, player)
{
  let i = 1;
  let counter = 0;
  while(rowIndex - i > -1 && columnIndex - i > -1 && rows[rowIndex - i][columnIndex - i] === player)
  {
    counter++;
    i++;
    console.log("UpLeft: " + counter);
  }
  return counter;
}

function checkDownRight(rowIndex, columnIndex, rows, player)
{
  let i = 1;
  let counter = 0;
  while(rowIndex + i < rows.length && columnIndex + i <= rows.length && rows[rowIndex +i][columnIndex + i] === player)
  {
    counter++;
    i++;
    console.log("DownRight: " + counter);
  }
  return counter;
}


function connect4(setVictory, rowIndex, columnIndex, rows, player){ //checker function
  if(checkLeft(rowIndex, columnIndex, rows, player) + checkRight(rowIndex, columnIndex, rows, player) >= 3)
  {
    setVictory(player);
  }
  else if(checkDown(rowIndex, columnIndex, rows, player) >= 3)
  {
    setVictory(player);
  }
  else if(checkUpRight(rowIndex,columnIndex, rows, player) + checkDownLeft(rowIndex,columnIndex, rows, player) >= 3)
  {
    setVictory(player);
  }
  else if(checkDownRight(rowIndex, columnIndex, rows, player) + checkUpLeft(rowIndex, columnIndex, rows, player) >= 3)
  {
    setVictory(player);
  }
}

function renderVictory(victory, player)
{
  if(victory !== 0)
  {
    if(victory === 3)
    {
      return <p> it's a draw! </p>
    }
    else
    {
      return <p> player {victory} wins </p>
    }
  }
  else
  {
    return <p> Current Player: <div className={`puck-${player}`}/></p>
  }
}

function App() {
  const [rows, setRows] = useState(generateDefaultBoard()); //calls function board() to set rows = to empty board array
  const [player, setPlayer] = useState(1); //sets variable player to player 1
  const [victory, setVictory] = useState(0); //sets variable victory to 0
  function clickColumn(columnIndex){ //converts the column clicked into the correct place on the stack
    if(victory === 0)
    {
      dropPuck(rows, setRows, columnIndex, player, setPlayer, setVictory);
    }
  }
  return (
    <div id="container">
      <header>
        <h1><a href="https://en.wikipedia.org/wiki/Connect_Four" target="_"> Connect 4 </a></h1>
        {renderVictory(victory, player)}
      </header>
      <div id="game">
        <table> 
          <tbody>
            {renderRows(rows, clickColumn)}
          </tbody>
        </table>
      </div>
      <button onClick={() => resetBoard(setRows, setVictory, setPlayer)}> Reset </button>
    </div>
  );
}

export default App;
