import Catch from "./Catch.js";
import Cell from "./Cell.js";
import CellState from "./CellState.js";
import Player from "./Player.js";

export default class GUI {
    constructor() {
        this.game = null;
        this.points1 = 0;
        this.points2 = 0;
    }
    coordinates(cell) {
        return new Cell(cell.parentNode.rowIndex, cell.cellIndex);
    }
    printBoard(board) {
        let tbody = document.querySelector("#board tbody");
        tbody.innerHTML = "";
        for (let i = 0; i < board.length; i++) {
            let tr = document.createElement("tr");
            tbody.appendChild(tr);
            for (let j = 0; j < board[i].length; j++) {
                let td = document.createElement("td");
                tr.appendChild(td);
                td.className = board[i][j];
                td.onclick = this.play.bind(this);
            }
        }
    }
    changeMessage(m) {
        let objs = { DRAW: "Draw!", PLAYER2: "Red's win!", PLAYER1: "Blue's win!" };
        if (objs[m]) {
            this.setMessage(`Game Over! ${objs[m]}`);
            document.querySelectorAll("#board td").forEach(td => td.onclick = undefined);
        } else {
            let msgs = { PLAYER1: "Blue's turn.", PLAYER2: "Red's turn." };
            this.setMessage(msgs[this.game.getTurn()]);
        }
    }
    setMessage(message) {
        let msg = document.getElementById("message");
        msg.textContent = message;
    }
    init() {
        let iSize = document.getElementById("size");
        let iStart = document.getElementById("start");
        iSize.onchange = this.init.bind(this);
        iStart.onclick = this.init.bind(this);
        let size = iSize.valueAsNumber;
        this.game = new Catch(size, size);
        let board = this.game.getBoard();
        this.printBoard(board);
        this.changeMessage();
        this.points1 = this.points2 = 0;
        this.updateScore();
    }
    updateScore() {
        let score1 = document.querySelector("#score tbody td:nth-child(1)");
        score1.textContent = this.points1;
        let score2 = document.querySelector("#score tbody td:nth-child(2)");
        score2.textContent = this.points2;
    }
    play(evt) {
        let td = evt.currentTarget;
        try {
            let s = this.game.getTurn();
            let mr = this.game.move(this.coordinates(td));
            let table = document.querySelector("#board");
            mr.playerCells.forEach(({ x, y }) => {
                table.rows[x].cells[y].className = s;
            });
            mr.playerPoints.forEach(({ x, y }) => {
                let tableData = table.rows[x].cells[y];
                if(s === Player.PLAYER1) {
                    tableData.className = CellState.X_PLAYER1;
                    this.points1++;
                } else {
                    tableData.className = CellState.X_PLAYER2;
                    this.points2++;
                }
                tableData.textContent = "X";
            });
            this.updateScore();
            this.changeMessage(mr.winner);
        } catch (ex) {
            this.setMessage(ex.message);
        }
    }
}
let gui = new GUI();
gui.init();