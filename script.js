document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const gameStatus = document.getElementById('game-status');
    const resetButton = document.getElementById('reset-button');
    const resetScoreButton = document.getElementById('reset-score-button');
    const playerXScoreDisplay = document.getElementById('playerX-score');
    const playerOScoreDisplay = document.getElementById('playerO-score');

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    let gameActive = true;
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', '']; // Represents the game board state
    let playerXScore = 0;
    let playerOScore = 0;

    // Initialize scores from localStorage if available
    if (localStorage.getItem('playerXScore')) {
        playerXScore = parseInt(localStorage.getItem('playerXScore'));
        playerXScoreDisplay.innerText = playerXScore;
    }
    if (localStorage.getItem('playerOScore')) {
        playerOScore = parseInt(localStorage.getItem('playerOScore'));
        playerOScoreDisplay.innerText = playerOScore;
    }

    // Function to handle a player's move
    const handleCellClick = (e) => {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

        if (gameState[clickedCellIndex] !== '' || !gameActive) {
            return;
        }

        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.innerHTML = currentPlayer;
        clickedCell.classList.add(`player${currentPlayer}`);

        checkResult();
    };

    // Function to check for win/draw
    const checkResult = () => {
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
                break;
            }
        }

        if (roundWon) {
            gameStatus.innerHTML = `Player ${currentPlayer} Wins! 🎉`;
            gameActive = false;
            updateScore(currentPlayer);
            return;
        }

        let roundDraw = !gameState.includes('');
        if (roundDraw) {
            gameStatus.innerHTML = 'Game Draw! 🤝';
            gameActive = false;
            return;
        }

        // If no win or draw, switch player
        handlePlayerChange();
    };

    // Function to update scores
    const updateScore = (winner) => {
        if (winner === 'X') {
            playerXScore++;
            playerXScoreDisplay.innerText = playerXScore;
            localStorage.setItem('playerXScore', playerXScore);
        } else if (winner === 'O') {
            playerOScore++;
            playerOScoreDisplay.innerText = playerOScore;
            localStorage.setItem('playerOScore', playerOScore);
        }
    };

    // Function to switch player
    const handlePlayerChange = () => {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        gameStatus.innerHTML = `Player ${currentPlayer}'s Turn`;
    };

    // Function to reset the game board
    const resetGame = () => {
        gameActive = true;
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        gameStatus.innerHTML = `Player ${currentPlayer}'s Turn`;
        cells.forEach(cell => {
            cell.innerHTML = '';
            cell.classList.remove('playerX', 'playerO');
        });
    };

    // Function to reset scores
    const resetScores = () => {
        playerXScore = 0;
        playerOScore = 0;
        playerXScoreDisplay.innerText = playerXScore;
        playerOScoreDisplay.innerText = playerOScore;
        localStorage.setItem('playerXScore', 0);
        localStorage.setItem('playerOScore', 0);
        resetGame(); // Also reset the game board when scores are reset
    };

    // Event Listeners
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetButton.addEventListener('click', resetGame);
    resetScoreButton.addEventListener('click', resetScores);
});