document.addEventListener('DOMContentLoaded', () => {
    const boardSize = 10;
    const totalMines = 15;

    let board = [];
    let minesCount = 0;
    let gameover = false;
    let gamewon = false;

    function initializeBoard() {
        for (let i = 0; i < boardSize; i++) {
            board[i] = [];
            for (let j = 0; j < boardSize; j++) {
                board[i][j] = { mine: false, revealed: false, flagged: false, count: 0 };
            }
        }
    }

    function plantMines(startRow, startCol) {
        while (minesCount < totalMines) {
            const row = Math.floor(Math.random() * boardSize);
            const col = Math.floor(Math.random() * boardSize);

            // Place mines only if the cell is not in the initial zone
            if (!board[row][col].mine && !(Math.abs(row - startRow) <= 1 && Math.abs(col - startCol) <= 1)) {
                board[row][col].mine = true;
                incrementAdjacentCells(row, col);
                minesCount++;
            }
        }
    }

    function incrementAdjacentCells(row, col) {
        for (let i = Math.max(0, row - 1); i <= Math.min(row + 1, boardSize - 1); i++) {
            for (let j = Math.max(0, col - 1); j <= Math.min(col + 1, boardSize - 1); j++) {
                if (!(i === row && j === col)) {
                    board[i][j].count++;
                }
            }
        }
    }

    function renderBoard() {
        const minesweeper = document.getElementById('minesweeper');

        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell hidden';
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener('click', handleCellClick);
                cell.addEventListener('contextmenu', handleCellRightClick);

                minesweeper.appendChild(cell);
            }
        }
    }

    function handleCellClick(event) {
        if (gameover || gamewon) {
            return; // Exit early if the game is over or won
        }

        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);

        // Plant mines only on the first click
        if (minesCount === 0) {
            plantMines(row, col);
        }

        if (board[row][col].flagged) {
            return; // Do nothing if the cell is flagged
        }

        if (board[row][col].mine) {
            revealMines();
            alert('Game Over! You hit a mine.');
            gameover = true;
            showResetButton();
        } else {
            revealCell(row, col);
            if (checkWin()) {
                alert('Congratulations! You won!');
                gamewon = true;
                showResetButton();
            }
        }
    }

    function handleCellRightClick(event) {
        if (gameover || gamewon) {
            return; // Exit early if the game is over or won
        }

        event.preventDefault();
        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);

        if (!board[row][col].revealed) {
            board[row][col].flagged = !board[row][col].flagged;
            event.target.classList.toggle('flagged', board[row][col].flagged);
        }
    }

    function revealCell(row, col) {
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);

        if (!board[row][col].revealed && !board[row][col].flagged) {
            board[row][col].revealed = true;
            cell.classList.remove('hidden');
            cell.textContent = board[row][col].count === 0 ? '' : board[row][col].count;

            if (board[row][col].count === 0) {
                revealEmptyCells(row, col);
            }
        }
    }

    function revealEmptyCells(row, col) {
        for (let i = Math.max(0, row - 1); i <= Math.min(row + 1, boardSize - 1); i++) {
            for (let j = Math.max(0, col - 1); j <= Math.min(col + 1, boardSize - 1); j++) {
                if (!(i === row && j === col)) {
                    revealCell(i, j);
                }
            }
        }
    }

    function revealMines() {
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (board[i][j].mine) {
                    const cell = document.querySelector(`.cell[data-row="${i}"][data-col="${j}"]`);
                    cell.classList.remove('hidden');
                    cell.classList.add('mine');
                }
            }
        }
    }

    function checkWin() {
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (!board[i][j].mine && !board[i][j].revealed) {
                    return false;
                }
            }
        }
        return true;
    }

    function showResetButton() {
        const resetButton = document.createElement('button');
        resetButton.className = 'reset';
        resetButton.addEventListener('click', resetGame);

        document.getElementById('minesweeper').appendChild(resetButton);
    }

    function resetGame() {
        if (gameover || gamewon) {
            // Remove the reset button
            const resetButton = document.querySelector('.reset');
            resetButton.parentNode.removeChild(resetButton);
            
            // Reset game state
            board = [];
            minesCount = 0;
            gameover = false;
            gamewon = false;
            document.getElementById('minesweeper').innerHTML = '';
            initializeBoard();
            renderBoard();
        }
    }

    initializeBoard();
    renderBoard();
});
