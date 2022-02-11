import './style.css';
import 'regenerator-runtime/runtime';

let myBoats = [];
let myBoard = [];
const pcBoats = [];
let pcBoard = [];
const playerBoard = document.querySelector('.userBoard');
const aiBoard = document.querySelector('.pcBoard');
const positioningBoard = document.querySelector('.positioningBoard');
const form = document.querySelector('.form');
const rotate = document.querySelector('.rotate');
const subtitle = document.querySelector('.sub');
const sunkMsg = document.querySelector('.sunkConfirmation');
const winMsg = document.querySelector('.winMsg');
const msg = document.querySelector('.msg');
const newGame = document.querySelector('#newGame');
let userShipsAlive = 5;
let pcShipsAlive = 5;
let numberOfShips = 0;
let turn = 0;
const shipsType = [];
shipsType[0] = { name: 'Carrier', long: 5 };
shipsType[1] = { name: 'Battleship', long: 4 };
shipsType[2] = { name: 'Destroyer', long: 3 };
shipsType[3] = { name: 'Submarine', long: 3 };
shipsType[4] = { name: 'Patrol Boat', long: 2 };

let rotation = 'horizontal';
rotate.addEventListener('click', () => {
  if (rotation === 'horizontal') {
    rotation = 'vertical';
  } else { rotation = 'horizontal'; }
});

export function isPositionValid(numCordinates, charCordinates, direction, long) {
  if (direction === 'vertical' && numCordinates + long - 1 > 10) {
    return false;
  } if (direction === 'horizontal' && charCordinates + long - 1 > 106) {
    return false;
  }
  return true;
}

function isShipOverOtherShips(ref, cordinates) {
  for (let i = 0; i < ref.length; i += 1) {
    for (let a = 0; a < ref[i].cordinates.length; a += 1) {
      for (let b = 0; b < cordinates.length; b += 1) {
        if (ref[i].cordinates[a] === cordinates[b]) {
          console.log('cordinates already in');
          return false;
        }
      }
    }
  }
  return true;
}

export function shipCordinates(start, xCode, direction, long) {
  const cordinates = [];
  let index = 0;
  if (direction === 'horizontal') {
    for (let i = start; i < long + start; i += 1) {
      cordinates[index] = start + String.fromCharCode(xCode + index);
      index += 1;
    }
  } else {
    for (let i = start; i < long + start; i += 1) {
      cordinates[index] = i + String.fromCharCode(xCode);
      index += 1;
    }
  }
  return cordinates;
}

class Ships {
  constructor(long, cordinates, name) {
    this.long = long;
    this.cordinates = cordinates;
    this.state = 'alive';
    this.name = name;
    this.numberOfHit = 0;
  }
}

export function youMissed(cordinates, board) {
  for (let i = 0; i < board.length; i += 1) {
    if (board[i].value === cordinates) {
      board[i].style.cssText = ' background-color:lightblue;';
    }
  }
}

export function isSunk(index, ref) {
  if (ref[index].numberOfHit === ref[index].long) {
    ref[index].state = 'sunk';
    if (turn === 0) {
      sunkMsg.innerHTML = `You just destroyed the AI ${ref[index].name}`;
      pcShipsAlive -= 1;
    } else if (turn === 1) {
      sunkMsg.innerHTML = `The AI just destroyed your ${ref[index].name}`;
      userShipsAlive -= 1;
    }
    return true;
  }
  return false;
}

function isHit(selectedCordinates, ref, board) {
  let index = 0;
  let hit = false;
  for (let i = 0; i < ref.length; i += 1) {
    for (let a = 0; a < ref[i].cordinates.length; a += 1) {
      if (ref[i].cordinates[a] === selectedCordinates && hit === false) {
        hit = true;
        ref[i].numberOfHit += 1;
        index = i;
        for (let c = 0; c < board.length; c += 1) {
          if (board[c].value === selectedCordinates) {
            board[c].style.cssText = ' background-color:lightsalmon;';
          }
        }
      }
    }
  } if (hit === true) {
    isSunk(index, ref);
  }
  return hit;
}

function isCordinateNotSelected(selectedCordinates, ref, dataBoard) {
  for (let b = 0; b < dataBoard.length; b += 1) {
    if (selectedCordinates === dataBoard[b]) {
      console.log('already selected');
      return false;
    }
  }
  dataBoard[dataBoard.length] = selectedCordinates;
  const board = document.querySelectorAll(`.${dataBoard[0]}`);
  const hit = isHit(selectedCordinates, ref, board);
  if (hit === false) {
    youMissed(selectedCordinates, board);
  }
  return true;
}

function showShips(ref, div) {
  const thisBoard = document.querySelectorAll(`.${div}`);
  for (let i = 0; i < thisBoard.length; i += 1) {
    for (let a = 0; a < ref.length; a += 1) {
      for (let b = 0; b < ref[a].cordinates.length; b += 1) {
        if (thisBoard[i].value === ref[a].cordinates[b]) {
          thisBoard[i].style.cssText = ' background-color:rgb(41, 37, 37);';
          thisBoard[i].name = 'selected';
        }
      }
    }
  }
}

function pcTurn() {
  const num = Math.floor(Math.random() * (11 - 1) + 1);
  const char = Math.floor(Math.random() * (107 - 97) + 97);
  const correct = isCordinateNotSelected(num + String.fromCharCode(char), myBoats, myBoard);
  if (correct === true) {
    endGame();
    turn = 0;
  } else {
    pcTurn();
  }
}

function playerTurn(cordinates) {
  const correct = isCordinateNotSelected(cordinates, pcBoats, pcBoard);
  console.log(correct);
  if (correct === true) {
    const theBoard = document.querySelectorAll('.pcBoards');
    for (let i = 0; i < theBoard.length; i += 1) {
      if (cordinates === theBoard[i].value) {
        theBoard[i].className = 'selected';
      }
    }
    endGame();
    turn = 1;
  } else {
    playerTurn();
  }
}

function startGame(cordinates) {
  if (turn === 1) {
    pcTurn();
  } else if (turn === 0) {
    playerTurn(cordinates);
    startGame();
  }
}

function boatPositioning(cordinates) {
  if (numberOfShips < 5) {
    const n = shipsType[numberOfShips].name;
    const ship = buildShips(shipsType[numberOfShips].long, cordinates, rotation, myBoats, n);
    if (ship !== undefined) {
      myBoats[numberOfShips] = ship;
      showShips(myBoats, 'positioningBoards');
      numberOfShips += 1;
    } if (numberOfShips === 5) {
      form.style.cssText = 'display:none;';
      buildPage();
    } else {
      subtitle.innerHTML = `Place your ${shipsType[numberOfShips].name}`;
    }
  }
}

function boatHover(cordinates) {
  if (numberOfShips < 5) {
    let x = '';
    let start = 0;
    if (cordinates.length === 3) {
      x = cordinates.charCodeAt(2);
      start = 10;
    } else {
      x = cordinates.charCodeAt(1);
      start = +cordinates.charAt(0);
    }
    const num = shipsType[numberOfShips].long;
    const tempCordinates = shipCordinates(start, x, rotation, num);
    const table = document.querySelectorAll('.positioningBoards');
    for (let i = 0; i < table.length; i += 1) {
      for (let a = 0; a < tempCordinates.length; a += 1) {
        if (table[i].value === tempCordinates[a]) {
          if (table[i].name !== 'selected') {
            table[i].style.cssText = 'background-color:rgb(97, 93, 93);';
          }
        }
      }
    }
  }
}

function pointerRemoved() {
  const table = document.querySelectorAll('.positioningBoards');
  for (let i = 0; i < table.length; i += 1) {
    if (table[i].name !== 'selected') {
      table[i].style.cssText = 'background-color:none;';
    }
  }
}

function buildBoard(ref) {
  myBoard[0] = 'userBoards';
  pcBoard[0] = 'pcBoards';
  for (let i = 1; i <= 10; i += 1) {
    const tableRow = document.createElement('div');
    tableRow.classList.add('tableRow');
    for (let a = 97; a <= 106; a += 1) {
      const table = document.createElement('div');
      table.classList.add(`${ref.className}s`);
      table.value = i + String.fromCharCode(a);
      if (ref === aiBoard) {
        table.addEventListener('click', function start() {
          startGame(table.value);
          table.removeEventListener('click', start);
        });
      } else if (ref === positioningBoard) {
        table.addEventListener('click', () => { boatPositioning(table.value); });
        table.addEventListener('mouseenter', () => { boatHover(table.value); });
        table.addEventListener('mouseleave', () => { pointerRemoved(); });
      }
      tableRow.appendChild(table);
    }
    ref.appendChild(tableRow);
    if (ref === positioningBoard) {
      subtitle.innerHTML = `Place your ${shipsType[numberOfShips].name}`;
    }
  }
}

function buildShips(long, positionStart, direction, ref, name) {
  let x = '';
  let start = 0;
  if (positionStart.length === 3) {
    x = positionStart.charAt(2);
    start = 10;
  } else {
    x = positionStart.charAt(1);
    start = +positionStart.charAt(0);
  }
  const xCode = x.charCodeAt();
  let cordinates = [];
  const isValid = isPositionValid(start, xCode, direction, long);
  if (isValid === true) {
    cordinates = shipCordinates(start, xCode, direction, long);
    const notOver = isShipOverOtherShips(ref, cordinates);
    if (notOver === true) {
      const ship = new Ships(long, cordinates, name);
      return ship;
    }
    return undefined;
  }
  return undefined;
}

function randomShipCreation() {
  const options = ['horizontal', 'vertical'];
  for (let i = 0; i < shipsType.length; i += 1) {
    const num = Math.floor(Math.random() * (11 - 1) + 1);
    const char = Math.floor(Math.random() * (107 - 97) + 97);
    const dir = options[Math.floor(Math.random() * options.length)];
    const x = String.fromCharCode(char);
    const ship = buildShips(shipsType[i].long, num + x, dir, pcBoats, shipsType[i].name);
    if (ship === undefined) {
      i -= 1;
    } else {
      pcBoats[i] = ship;
    }
  }
}

newGame.addEventListener('click', () => {
  if (pcShipsAlive === 0 || userShipsAlive === 0) {
    while (playerBoard.firstChild) {
      playerBoard.removeChild(playerBoard.firstChild);
    } while (aiBoard.firstChild) {
      aiBoard.removeChild(aiBoard.firstChild);
    }
    userShipsAlive = 5;
    pcShipsAlive = 5;
    numberOfShips = 0;
    pcBoard = [];
    myBoard = [];
    myBoats = [];
    while (positioningBoard.firstChild) {
      positioningBoard.removeChild(positioningBoard.firstChild);
    }
    buildBoard(positioningBoard);
    buildBoard(playerBoard);
    buildBoard(aiBoard);
    winMsg.style.cssText = 'display:none;';
    form.style.cssText = 'display:flex;';
  }
});

function endGame() {
  if (pcShipsAlive === 0) {
    msg.innerHTML = 'Congratulations! You won!';
    winMsg.style.cssText = 'display:flex;';
  } else if (userShipsAlive === 0) {
    msg.innerHTML = 'The AI won!';
    winMsg.style.cssText = 'display:flex;';
  }
}

buildBoard(positioningBoard);
buildBoard(playerBoard);
buildBoard(aiBoard);

function buildPage() {
  while (playerBoard.firstChild) {
    playerBoard.removeChild(playerBoard.firstChild);
  }
  buildBoard(playerBoard);
  randomShipCreation();
  showShips(myBoats, 'userBoards');
}
