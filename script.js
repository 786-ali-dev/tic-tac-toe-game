const statusDisplay = document.querySelector('.status');
const gameCells = document.querySelectorAll('.cell');
const resetButton = document.querySelector('.reset-button');

let gameActive = true;
let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', '']; // Represents the game board state

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const messages = {
    playerXTurn: () => `Player ${currentPlayer}'s Turn`,
    playerOTurn: () => `Player ${currentPlayer}'s Turn`,
    playerXWins: () => `Player X has won!`,
    playerOWins: () => `Player O has won!`,
    draw: () => `Game ended in a draw!`
};

// Initial status display
statusDisplay.innerHTML = messages.playerXTurn();

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
    clickedCell.classList.add(currentPlayer); // Add class for styling
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.innerHTML = messages.playerXTurn(); // Re-use for generic turn message
}

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            // Add 'win' class to winning cells for animation
            winCondition.forEach(index => {
                gameCells[index].classList.add('win');
            });
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = currentPlayer === 'X' ? messages.playerXWins() : messages.playerOWins();
        gameActive = false;
        return;
    }

    let roundDraw = !gameState.includes('');
    if (roundDraw) {
        statusDisplay.innerHTML = messages.draw();
        gameActive = false;
        return;
    }

    handlePlayerChange();
}

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.dataset.cellIndex);

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

function handleResetGame() {
    gameActive = true;
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    statusDisplay.innerHTML = messages.playerXTurn();
    gameCells.forEach(cell => {
        cell.innerHTML = '';
        cell.classList.remove('X', 'O', 'win'); // Remove all player and win classes
    });
}

gameCells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', handleResetGame);