export function basic_move(cell, grid, prevMove) {
    let nextCell = null;
    let rows = grid.length, columns = grid[0].length;
    let move = prevMove;
    
    let counter = 0;
    let ret = {
        cell: null,
        move: null,
        counter: counter,
    }
    while (counter < 4) {
        counter++;
        //console.log(counter);
        let di = 0, dj = 0;

        if (move == 'u')
            di = -1;
        else if (move == 'd')
            di = 1;
        else if (move == 'r')
            dj = 1;
        else if (move == 'l')
            dj = -1;

        ret.move = move;
        ret.counter = counter;

        let row = cell.i + di;
        let col = cell.j + dj;

        if (row >= 0 && row < rows && col >= 0 && col < columns) {
            nextCell = grid[row][col];
            //console.log("Next cell? ", nextCell);
            if (!nextCell.visited) {
                ret.cell = nextCell;
                return ret;
            }
        }

        if (move == 'u')
            move = 'r';
        else if (move == 'r')
            move = 'd';
        else if (move == 'd')
            move = 'l';
        else if (move == 'l')
            move = 'u'
    }

    ret.counter = 4;
    return ret;
}

