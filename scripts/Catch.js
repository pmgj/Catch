import Player from "./Player.js";
import Cell from "./Cell.js";
import CellState from "./CellState.js";
import Winner from "./Winner.js";
import MoveResult from "./MoveResult.js";

export default class Catch {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.board = Array(this.rows).fill().map(() => Array(this.cols).fill(CellState.EMPTY));
        this.turn = Player.PLAYER1;
    }
    getBoard() {
        return this.board;
    }
    getTurn() {
        return this.turn;
    }
    onBoard({ x, y }) {
        let inLimit = (value, limit) => value >= 0 && value < limit;
        return inLimit(x, this.rows) && inLimit(y, this.cols);
    }
    move(endCell) {
        let { x, y } = endCell;
        if (!endCell) {
            throw new Error("The cell does not exist.");
        }
        if (!this.onBoard(endCell)) {
            throw new Error("The cell is not on the board.");
        }
        if (this.board[x][y] !== CellState.EMPTY) {
            throw new Error("The cell is not empty.");
        }
        let nextCell = this.turn === Player.PLAYER1 ? new Cell(x + 1, y) : new Cell(x, y + 1);
        if (!this.onBoard(nextCell)) {
            throw new Error("The next cell is not on the board.");
        }
        let { x: a, y: b } = nextCell;
        if (this.board[a][b] !== CellState.EMPTY) {
            throw new Error("The next cell is not empty.");
        }
        this.board[x][y] = this.turn === Player.PLAYER1 ? CellState.PLAYER1 : CellState.PLAYER2;
        this.board[a][b] = this.turn === Player.PLAYER1 ? CellState.PLAYER1 : CellState.PLAYER2;
        let points = this.markPoints();
        this.turn = this.turn === Player.PLAYER1 ? Player.PLAYER2 : Player.PLAYER1;
        let end = this.endOfGame();
        return new MoveResult(end, [endCell, nextCell], points);
    }
    endOfGame() {
        if (this.board.flat().some(c => c === CellState.EMPTY)) {
            return Winner.NONE;
        }
        let p1 = this.board.flat().filter(c => c === CellState.X_PLAYER1).length;
        let p2 = this.board.flat().filter(c => c === CellState.X_PLAYER2).length;
        if (p1 > p2) {
            return Winner.PLAYER1;
        } else if (p1 < p2) {
            return Winner.PLAYER2;
        } else if (p1 === p2) {
            return Winner.DRAW;
        }
        return Winner.NONE;
    }
    markPoints() {
        let playerPoints = [];
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.board[i][j] !== CellState.EMPTY) continue;
                let oneSpace = [new Cell(i - 1, j), new Cell(i, j - 1), new Cell(i, j + 1), new Cell(i + 1, j)];
                if (oneSpace.every(c => !this.onBoard(c) || (this.board[c.x][c.y] === CellState.PLAYER1 || this.board[c.x][c.y] === CellState.PLAYER2))) {
                    this.board[i][j] = this.turn === Player.PLAYER1 ? CellState.X_PLAYER1 : CellState.X_PLAYER2;
                    playerPoints.push(new Cell(i, j));
                }
                let twoSpacesH = [new Cell(i - 1, j), new Cell(i - 1, j + 1), new Cell(i, j - 1), new Cell(i, j + 2), new Cell(i + 1, j), new Cell(i + 1, j + 1)];
                if (twoSpacesH.every(c => !this.onBoard(c) || (this.board[c.x][c.y] === CellState.PLAYER1 || this.board[c.x][c.y] === CellState.PLAYER2))) {
                    let nextCell = new Cell(i, j + 1);
                    if (this.onBoard(nextCell) && this.board[nextCell.x][nextCell.y] === CellState.EMPTY) {
                        this.board[i][j] = this.turn === Player.PLAYER1 ? CellState.X_PLAYER1 : CellState.X_PLAYER2;
                        this.board[nextCell.x][nextCell.y] = this.turn === Player.PLAYER1 ? CellState.X_PLAYER1 : CellState.X_PLAYER2;
                        playerPoints.push(new Cell(i, j));
                        playerPoints.push(nextCell);
                    }
                }
                let twoSpacesV = [new Cell(i - 1, j), new Cell(i, j - 1), new Cell(i, j + 1), new Cell(i + 1, j - 1), new Cell(i + 1, j + 1), new Cell(i + 2, j)];
                if (twoSpacesV.every(c => !this.onBoard(c) || (this.board[c.x][c.y] === CellState.PLAYER1 || this.board[c.x][c.y] === CellState.PLAYER2))) {
                    let nextCell = new Cell(i + 1, j);
                    if (this.onBoard(nextCell) && this.board[nextCell.x][nextCell.y] === CellState.EMPTY) {
                        this.board[i][j] = this.turn === Player.PLAYER1 ? CellState.X_PLAYER1 : CellState.X_PLAYER2;
                        this.board[nextCell.x][nextCell.y] = this.turn === Player.PLAYER1 ? CellState.X_PLAYER1 : CellState.X_PLAYER2;
                        playerPoints.push(new Cell(i, j));
                        playerPoints.push(nextCell);
                    }
                }
                let threeSpaces1 = [new Cell(i - 1, j), new Cell(i - 1, j + 1), new Cell(i, j - 1), new Cell(i, j + 2), new Cell(i + 1, j - 1), new Cell(i + 1, j + 1), new Cell(i + 2, j)];
                if (threeSpaces1.every(c => !this.onBoard(c) || (this.board[c.x][c.y] === CellState.PLAYER1 || this.board[c.x][c.y] === CellState.PLAYER2))) {
                    let nextCell1 = new Cell(i, j + 1);
                    let nextCell2 = new Cell(i + 1, j);
                    if (this.onBoard(nextCell1) && this.board[nextCell1.x][nextCell1.y] === CellState.EMPTY && this.onBoard(nextCell2) && this.board[nextCell2.x][nextCell2.y] === CellState.EMPTY) {
                        this.board[i][j] = this.turn === Player.PLAYER1 ? CellState.X_PLAYER1 : CellState.X_PLAYER2;
                        this.board[nextCell1.x][nextCell1.y] = this.turn === Player.PLAYER1 ? CellState.X_PLAYER1 : CellState.X_PLAYER2;
                        this.board[nextCell2.x][nextCell2.y] = this.turn === Player.PLAYER1 ? CellState.X_PLAYER1 : CellState.X_PLAYER2;
                        playerPoints.push(new Cell(i, j));
                        playerPoints.push(nextCell1);
                        playerPoints.push(nextCell2);
                    }
                }
                let threeSpaces2 = [new Cell(i - 1, j), new Cell(i - 1, j + 1), new Cell(i, j - 1), new Cell(i, j + 2), new Cell(i + 1, j), new Cell(i + 1, j + 2), new Cell(i + 2, j + 1)];
                if (threeSpaces2.every(c => !this.onBoard(c) || (this.board[c.x][c.y] === CellState.PLAYER1 || this.board[c.x][c.y] === CellState.PLAYER2))) {
                    let nextCell1 = new Cell(i, j + 1);
                    let nextCell2 = new Cell(i + 1, j + 1);
                    if (this.onBoard(nextCell1) && this.board[nextCell1.x][nextCell1.y] === CellState.EMPTY && this.onBoard(nextCell2) && this.board[nextCell2.x][nextCell2.y] === CellState.EMPTY) {
                        this.board[i][j] = this.turn === Player.PLAYER1 ? CellState.X_PLAYER1 : CellState.X_PLAYER2;
                        this.board[nextCell1.x][nextCell1.y] = this.turn === Player.PLAYER1 ? CellState.X_PLAYER1 : CellState.X_PLAYER2;
                        this.board[nextCell2.x][nextCell2.y] = this.turn === Player.PLAYER1 ? CellState.X_PLAYER1 : CellState.X_PLAYER2;
                        playerPoints.push(new Cell(i, j));
                        playerPoints.push(nextCell1);
                        playerPoints.push(nextCell2);
                    }
                }
                let threeSpaces3 = [new Cell(i - 1, j), new Cell(i - 1, j + 1), new Cell(i - 1, j + 2), new Cell(i, j - 1), new Cell(i, j + 3), new Cell(i + 1, j), new Cell(i + 1, j + 1), new Cell(i + 1, j + 2)];
                if (threeSpaces3.every(c => !this.onBoard(c) || (this.board[c.x][c.y] === CellState.PLAYER1 || this.board[c.x][c.y] === CellState.PLAYER2))) {
                    let nextCell1 = new Cell(i, j + 1);
                    let nextCell2 = new Cell(i, j + 2);
                    if (this.onBoard(nextCell1) && this.board[nextCell1.x][nextCell1.y] === CellState.EMPTY && this.onBoard(nextCell2) && this.board[nextCell2.x][nextCell2.y] === CellState.EMPTY) {
                        this.board[i][j] = this.turn === Player.PLAYER1 ? CellState.X_PLAYER1 : CellState.X_PLAYER2;
                        this.board[nextCell1.x][nextCell1.y] = this.turn === Player.PLAYER1 ? CellState.X_PLAYER1 : CellState.X_PLAYER2;
                        this.board[nextCell2.x][nextCell2.y] = this.turn === Player.PLAYER1 ? CellState.X_PLAYER1 : CellState.X_PLAYER2;
                        playerPoints.push(new Cell(i, j));
                        playerPoints.push(nextCell1);
                        playerPoints.push(nextCell2);
                    }
                }
                let threeSpaces4 = [new Cell(i - 1, j), new Cell(i, j - 1), new Cell(i, j + 1), new Cell(i + 1, j - 1), new Cell(i + 1, j + 1), new Cell(i + 2, j - 1), new Cell(i + 2, j + 1), new Cell(i + 3, j)];
                if (threeSpaces4.every(c => !this.onBoard(c) || (this.board[c.x][c.y] === CellState.PLAYER1 || this.board[c.x][c.y] === CellState.PLAYER2))) {
                    let nextCell1 = new Cell(i + 1, j);
                    let nextCell2 = new Cell(i + 2, j);
                    if (this.onBoard(nextCell1) && this.board[nextCell1.x][nextCell1.y] === CellState.EMPTY && this.onBoard(nextCell2) && this.board[nextCell2.x][nextCell2.y] === CellState.EMPTY) {
                        this.board[i][j] = this.turn === Player.PLAYER1 ? CellState.X_PLAYER1 : CellState.X_PLAYER2;
                        this.board[nextCell1.x][nextCell1.y] = this.turn === Player.PLAYER1 ? CellState.X_PLAYER1 : CellState.X_PLAYER2;
                        this.board[nextCell2.x][nextCell2.y] = this.turn === Player.PLAYER1 ? CellState.X_PLAYER1 : CellState.X_PLAYER2;
                        playerPoints.push(new Cell(i, j));
                        playerPoints.push(nextCell1);
                        playerPoints.push(nextCell2);
                    }
                }
                let threeSpaces5 = [new Cell(i - 1, j), new Cell(i, j - 1), new Cell(i, j + 1), new Cell(i + 1, j - 1), new Cell(i + 1, j + 2), new Cell(i + 2, j), new Cell(i + 2, j + 1)];
                if (threeSpaces5.every(c => !this.onBoard(c) || (this.board[c.x][c.y] === CellState.PLAYER1 || this.board[c.x][c.y] === CellState.PLAYER2))) {
                    let nextCell1 = new Cell(i + 1, j);
                    let nextCell2 = new Cell(i + 1, j + 1);
                    if (this.onBoard(nextCell1) && this.board[nextCell1.x][nextCell1.y] === CellState.EMPTY && this.onBoard(nextCell2) && this.board[nextCell2.x][nextCell2.y] === CellState.EMPTY) {
                        this.board[i][j] = this.turn === Player.PLAYER1 ? CellState.X_PLAYER1 : CellState.X_PLAYER2;
                        this.board[nextCell1.x][nextCell1.y] = this.turn === Player.PLAYER1 ? CellState.X_PLAYER1 : CellState.X_PLAYER2;
                        this.board[nextCell2.x][nextCell2.y] = this.turn === Player.PLAYER1 ? CellState.X_PLAYER1 : CellState.X_PLAYER2;
                        playerPoints.push(new Cell(i, j));
                        playerPoints.push(nextCell1);
                        playerPoints.push(nextCell2);
                    }
                }
                let threeSpaces6 = [new Cell(i - 1, j), new Cell(i, j - 1), new Cell(i, j + 1), new Cell(i + 1, j - 2), new Cell(i + 1, j + 1), new Cell(i + 2, j - 1), new Cell(i + 2, j)];
                if (threeSpaces6.every(c => !this.onBoard(c) || (this.board[c.x][c.y] === CellState.PLAYER1 || this.board[c.x][c.y] === CellState.PLAYER2))) {
                    let nextCell1 = new Cell(i + 1, j - 1);
                    let nextCell2 = new Cell(i + 1, j);
                    if (this.onBoard(nextCell1) && this.board[nextCell1.x][nextCell1.y] === CellState.EMPTY && this.onBoard(nextCell2) && this.board[nextCell2.x][nextCell2.y] === CellState.EMPTY) {
                        this.board[i][j] = this.turn === Player.PLAYER1 ? CellState.X_PLAYER1 : CellState.X_PLAYER2;
                        this.board[nextCell1.x][nextCell1.y] = this.turn === Player.PLAYER1 ? CellState.X_PLAYER1 : CellState.X_PLAYER2;
                        this.board[nextCell2.x][nextCell2.y] = this.turn === Player.PLAYER1 ? CellState.X_PLAYER1 : CellState.X_PLAYER2;
                        playerPoints.push(new Cell(i, j));
                        playerPoints.push(nextCell1);
                        playerPoints.push(nextCell2);
                    }
                }
           }
        }
        return playerPoints;
    }
}