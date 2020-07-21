class Cell {
    constructor(i, j, start, end) {
        this.i = i;
        this.j = j;
        this.level = 8;
        this.start = start;
        this.end = end;
    }
}

class Grid {
    constructor(rows, columns, starti, startj, endi, endj) {
        this.rows = rows;
        this.columns = columns;
        this.grid = [];
        this.createGrid(starti, startj, endi, endj);
    }

    createGrid(starti, startj, endi, endj) {
        for (let i = 1; i <= this.rows; i++) {
            let rowgrid = [];
            for (let j = 1; j <= this.columns; j++) {
                rowgrid.push(new Cell(i, j, (i==starti && j==startj), (i==endi && j==endj)));
            }
            this.grid.push(rowgrid);
        }
    }
}

function djikstra(grid, start, end) {
}



// When the webpage is loaded for the first time, the board will be initialised
// The board is a rows x columns grid (we get the row and column count from
// the webpage itself) of nodes. Nodes have position, and level. The default
// level is 8. Colour-coding of the levels will be defined in the CSS, and 
// representation in HTML is as classes.

let rows = 50, columns = 40;
let gridObject = null;

let starti = 35, startj = 5, endi = 5, endj = 45;

window.onload = () => {
    let grid = document.getElementsByClassName('gridrow')[0];
    let classes = grid.classList;
    rows = parseInt(classes[2]);
    columns = parseInt(classes[3]);

    gridObject = new Grid(rows, columns);
}

let temp = document.getElementById(starti+'-'+startj);
temp.classList.add('start')
temp = document.getElementById(endi+'-'+endj);
temp.classList.add('end')



// Variables that help define actions when the mouse moves over the nodes in
// the grid
let level = 12;
let pressed = false;

// Random variables atm
let levels = [];
for (let i = 1; i <=16; i++) {
    levels.push("l"+i);
}
// Event listeners for all nodes. When the cell style is updated, so is
// the node in the JavaScript representation

for (let i = 1; i <= 40; i++) {
    for (let j = 1; j <= 50; j++) {
        let mouseTarget = document.getElementById(i+'-'+j);
        mouseTarget.addEventListener('mousedown', e => {
            pressed = true;
            console.log('mousedown! pressed = ', pressed);
        });

        mouseTarget.addEventListener('mouseup', e => {
            pressed = false;
            console.log('mouseup! pressed = ', pressed);
        });

        mouseTarget.addEventListener('click', e => {
            defineLevel(mouseTarget);
        })

        mouseTarget.addEventListener('mouseenter', e => {
            if (pressed) {
                console.log("Mouse entered ", mouseTarget.id, 'while clicked');
                defineLevel(mouseTarget);
            }
        });
    }
}

function cellFromUI(elem) {
    let elemName = elem.id;
    let rc = elemName.split('-');
    let row = parseInt(rc[0]);
    let col = parseInt(rc[1]);
    return gridObject.grid[row-1][col-1];
}

function defineLevel(elem) {
    let cell = cellFromUI(elem);

    if (elem.classList.contains("l"+level)) {
        elem.classList.remove("l"+level);
        elem.classList.add("l8");
        cell.level = 8;
    }
    else {
        elem.classList.remove(...levels);
        elem.classList.add("l"+level);
        cell.level = level;
    }
    console.log(cell);
}
