import Catch from "./Catch.js";
import Cell from "./Cell.js";
import Winner from "./Winner.js";

class Test {
    test1() {
        let c = new Catch(8, 8);
        c.move(new Cell(2, 1));
        c.move(new Cell(4, 2));
        c.move(new Cell(3, 5));
        c.move(new Cell(2, 4));
        c.move(new Cell(6, 5));
        c.move(new Cell(1, 0));
        c.move(new Cell(0, 2));
        c.move(new Cell(4, 0));
        c.move(new Cell(2, 3));
        c.move(new Cell(5, 4));
        c.move(new Cell(1, 6));
        c.move(new Cell(6, 6));
        c.move(new Cell(2, 7));
        c.move(new Cell(4, 6));
        c.move(new Cell(0, 5));
        c.move(new Cell(0, 3));
        c.move(new Cell(5, 2));
        c.move(new Cell(6, 3));
        c.move(new Cell(6, 1));
        let x = c.move(new Cell(5, 0));
        console.assert(x.winner === Winner.PLAYER2);
    }
}
let t = new Test();
t.test1();