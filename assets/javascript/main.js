class Cell {
    constructor(i, j, start, end) {
        this.i = i;
        this.j = j;
        this.level = 8;
        this.start = start;
        this.end = end;
        this.visited = false;
        this.closed = false;
        this.parent = null;
        this.path = false;

        this.distance = 0;
        this.heuristic = 0;
        this.score = 0;
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
        for (let i = 0; i < this.rows; i++) {
            let rowgrid = [];
            for (let j = 0; j < this.columns; j++) {
                rowgrid.push(new Cell(i, j, (i==starti && j==startj), (i==endi && j==endj)));
            }
            this.grid.push(rowgrid);
        }
    }
}

const INF = 1000

function updateState(cell) {
    options = ['visited', 'closed', 'path'];
    elem = uiFromCell(cell);
    elem.classList.remove(...options);
    if (cell.path)
        elem.classList.add('path');
    else if (cell.closed)
        elem.classList.add('closed');
    else if (cell.visited)
        elem.classList.add('visited');
}

function getCost(currentCell, neighbour, costFunction) {
    cost = costFunction(currentCell, neighbour);
    return cost;
}

function tempcost(currentCell, neighbour) {
    let diff = currentCell.level - neighbour.level;
    diff = Math.abs(diff);
    diff += 1;
    return diff>5?INF:diff;
}

function getHeuristic(cell, end) {
    let d1 = Math.abs(cell.i - end.i);
    let d2 = Math.abs(cell.j - end.j);
    return d1+d2;
}

function getNeighbours(grid, cell) {
    neighbours = [];
    let i = 0, j = 0;
    let rows = grid.length, columns = grid[0].length;

    i = cell.i + 1;
    if (i < rows)
        neighbours.push(grid[i][cell.j]);
    i = cell.i - 1;
    if (i >= 0)
        neighbours.push(grid[i][cell.j]);
    j = cell.j-1;
    if (j >= 0)
        neighbours.push(grid[cell.i][j])
    j = cell.j+1;
    if (j < columns)
        neighbours.push(grid[cell.i][j])

    return neighbours;
}

function astar(grid, start, end, costFunction) {
    openList = [];
    openList.push(start);
    let counter = 0;
    while (openList.length > 0) {
        counter += 1;

        currentCell = openList[0];
        currentCell.closed = true;
        setTimeout(()=>{updateState(currentCell);}, 20*counter);
        //updateState(currentCell);
        console.log("examining ", currentCell.i, currentCell.j, " at score ", currentCell.score);

        // If currentCell is final, return the successful path
        if (currentCell == end) {
            path = [];
            let curr = currentCell;
            while (curr.parent != null) {
                curr.path = true;
                setTimeout(()=>{updateState(currentCell);}, 20*counter);
                path.push(curr);
                curr = curr.parent;
            }   
            return path.reverse();
        }

        // push currentCell to closedList and remove from openList
        openList = openList.slice(1);

        // TODO improve getNeighbours
        let neighbours = getNeighbours(grid, currentCell);
        // foreach neighbour of currentCell
        console.log("neighbours: ", neighbours);
        for (let i = 0; i < neighbours.length; i++) {
            let neighbour = neighbours[i];
            //console.log("with neighbour: ", neighbour);

            // Compute costs and distances
            // TODO improve getCost
            let cost = getCost(currentCell, neighbour, costFunction);
            if (neighbour.closed || cost >= INF) {
                continue;
            }

            let dist = currentCell.distance + cost;
            let bestDist = false;

            // If the neighbour hasn't been visited, whichever distance it
            // gets is the "best" distance
            if (!neighbour.visited) {
                bestDist = true;
                // TODO improve getHeuristic
                neighbour.heuristic = getHeuristic(neighbour, end);
                neighbour.visited = true;
                setTimeout(()=>{updateState(neighbour)}, 20*counter);
                //updateState(neighbour);
                // replace above with TODO updateVisited(neighbour, end)
                openList.push(neighbour);
            }
            else if (dist < neighbour.dist) {
                bestDist = true;
            }

            // If it is the best, update the neighbour's distance/score/parent
            if (bestDist) {
                neighbour.distance = dist;
                neighbour.parent = currentCell;
                neighbour.score = neighbour.distance + neighbour.heuristic;
            }
        }
        
        // Update openList
        // TODO write the sort
        openList.sort(compareCells);


    }

    return [];
}


function compareCells(a, b) {
    if (a.score < b.score) return -1;
    if (a.score > b.score) return 1;
    return 0;
}



// When the webpage is loaded for the first time, the board will be initialised
// The board is a rows x columns grid (we get the row and column count from
// the webpage itself) of nodes. Nodes have position, and level. The default
// level is 8. Colour-coding of the levels will be defined in the CSS, and 
// representation in HTML is as classes.

let rows = 50, columns = 40;
let gridObject = null;

// hardcoded for quick prototyping, refactor
let starti = 34, startj = 4, endi = 4, endj = 44;

window.onload = () => {
    let grid = document.getElementsByClassName('gridrow')[0];
    let classes = grid.classList;
    rows = parseInt(classes[2]);
    columns = parseInt(classes[3]);

    gridObject = new Grid(rows, columns, starti, startj, endi, endj);
}

// Adding the start/stop to the HTML board. It already exists on representation
let temp = document.getElementById(starti+'-'+startj);
temp.classList.add('start')
temp = document.getElementById(endi+'-'+endj);
temp.classList.add('end')



// Variables that help define actions when the mouse moves over the nodes in
// the grid
let level = 14;
let painting = false;

// Random variables atm
let levels = [];
for (let i = 1; i <=16; i++) {
    levels.push("l"+i);
}
// Event listeners for all nodes. When the cell style is updated, so is
// the node in the JavaScript representation
window.addEventListener('mousedown', e => {
    painting = true;
    console.log('mousedown! pressed = ', painting);
});

window.addEventListener('mouseup', e => {
    painting = false;
    console.log('mouseup! pressed = ', painting);
});


for (let i = 0; i < 40; i++) {
    for (let j = 0; j < 50; j++) {
        let mouseTarget = document.getElementById(i+'-'+j);
        mouseTarget.addEventListener('click', e => {
            defineLevel(mouseTarget);
        })

        mouseTarget.addEventListener('mouseenter', e => {
            if (painting) {
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
    return gridObject.grid[row][col];
}

function uiFromCell(cell) {
    let name = (cell.i)+'-'+(cell.j);
    let elem = document.getElementById(name);
    return elem;
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
