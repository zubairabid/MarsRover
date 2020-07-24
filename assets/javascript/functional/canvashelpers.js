let levels = [];
for (let i = 1; i <=16; i++) {
    levels.push("l"+i);
}

let stateOptions = ['visited', 'closed'];

// Takes an HTML div with id of format num-num and returns the corresponding
// `cell` on the functional `grid`
export function cellFromUI(elem, grid) {
    let elemName = elem.id;
    let rc = elemName.split('-');
    let row = parseInt(rc[0]);
    let col = parseInt(rc[1]);
    return grid[row][col];
}

// Takes a `cell` from the functional `grid` and returns the corresponding 
// HTML div
function uiFromCell(cell) {
    let name = (cell.i)+'-'+(cell.j);
    let elem = document.getElementById(name);
    return elem;
}

// Takes a functional `cell` and sets the level
export function setLevel(cell, level) {
    if (cell.level == level)
        cell.level = cell.baseLevel;
    else
        cell.level = level;
}

// Takes a cell and updates the UI paint accordingly
export function paintCell(cell) {
    paintCellStart(cell);
    paintCellEnd(cell);
    paintCellLevel(cell);
    paintCellState(cell);
    paintCellMapped(cell);
}

export function paintCellMapped(cell) {
    let elem = uiFromCell(cell);
    if (cell.mapped)
        elem.classList.remove('unmapped');
    else
        elem.classList.add('unmapped');
}

export function paintCellStart(cell) {
    let elem = uiFromCell(cell);
    if (cell.start)
        elem.classList.add('start');
    else
        elem.classList.remove('start');
}

export function paintCellEnd(cell) {
    let elem = uiFromCell(cell);
    if (cell.end)
        elem.classList.add('end');
    else
        elem.classList.remove('end');
}

export function paintCellLevel(cell) {
    let elem = uiFromCell(cell);

    elem.classList.remove(...levels);
    elem.classList.add("l"+cell.level);
    //console.log(cell);
}

export function paintCellState(cell) {
    let elem = uiFromCell(cell);

    elem.classList.remove(...stateOptions);
    if (cell.closed)
        elem.classList.add('closed');
    else if (cell.visited)
        elem.classList.add('visited');
}

export function paintCellPath(cell) {
    let elem = uiFromCell(cell);

    if (cell.path)
        elem.classList.add('path');
    else
        elem.classList.remove('path');
}

// Paints out the final path
export function paintPath(path) {
    if (path.length == 0) {
        console.log("No path :(");
        return false;
    }
    for (let i = 0; i < path.length; i++) {
        let cell = path[i];
        let elem = uiFromCell(cell);
        elem.classList.add('path');
    }
    return true;
}


export function paintGrid(grid) {
    let rows = grid.length, columns = grid[0].length;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            paintCell(grid[i][j]);
        }
    }
}
