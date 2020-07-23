//////////////////////////
//  functional/cell.js  //
//////////////////////////

class Cell {
    constructor(i, j, start, end, level) {
        this.i = i;
        this.j = j;
        this.level = level;
        this.baseLevel = level;
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

function cellApply(cell, distortionCell) {
    let currentLevel = cell.level;
    
    if (currentLevel > 8 && distortionCell < 0)
        return;
    if (currentLevel < 8 && distortionCell > 0)
        return;


    let newLevel = currentLevel + distortionCell;

    //console.log("old, new, distortion: ", currentLevel, newLevel, distortionCell);
    newLevel = newLevel > 16? 16: newLevel;
    newLevel = newLevel < 1? 1 : newLevel;
    //console.log("level: ", newLevel);
    cell.level = newLevel;
}

function compareCells(a, b) {
    if (a.score < b.score) return -1;
    if (a.score > b.score) return 1;
    return 0;
}

//////////////////////////
//  functional/grid.js  //
//////////////////////////

// functional/grid.js
class Grid {
    constructor(rows, columns, starti, startj, endi, endj, level) {
        this.rows = rows;
        this.columns = columns;
        this.grid = [];
        this.createGrid(starti, startj, endi, endj, level);
    }

    createGrid(starti, startj, endi, endj, level) {
        for (let i = 0; i < this.rows; i++) {
            let rowgrid = [];
            for (let j = 0; j < this.columns; j++) {
                let cell = new Cell(i, j, (i==starti && j==startj), (i==endi && j==endj), level);
                paintCell(cell);
                rowgrid.push(cell);
            }
            this.grid.push(rowgrid);
        }
    }
}

function gridApply(grid, i, j, distortion) {
    let rows = grid.length, columns = grid[0].length;

    let gridi = i;
    let gridj = j;

    for (i = 0; i < distortion.length; i++) {
        if (gridi >= rows)
            break;
        for (j = 0; j < distortion[0].length; j++) {
            if (gridj >= columns)
                break;

            let cell = grid[gridi][gridj];
            let distortionCell = distortion[i][j];
            
            if (Math.random() < 0.5)
                distortionCell = -1 * distortionCell;

            cellApply(cell, distortionCell);
            paintCell(cell);

            //console.log("distorting ", gridi, gridj, " by ", distortionCell);
            gridj += 1;
        }
        gridj -= (j);
        gridi += 1;
    }
}

function resetGrid(grid) {
    resetSearch(grid);
    let rows = grid.length, columns = grid[0].length;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            let cell = grid[i][j];
            cell.level = 8;
            paintCell(cell);
        }
    }
}

function resetSearch(grid) {
    let rows = grid.length, columns = grid[0].length;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            let cell = grid[i][j];
            cell.visited = false;
            cell.path = false;
            cell.closed = false;

            paintCell(cell);
            paintCellPath(cell);
        }
    }
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

///////////////////////
//  canvasHelper.js  //
///////////////////////


let levels = [];
for (let i = 1; i <=16; i++) {
    levels.push("l"+i);
}

let stateOptions = ['visited', 'closed'];

// Takes an HTML div with id of format num-num and returns the corresponding
// `cell` on the functional `grid`
function cellFromUI(elem, grid) {
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
function setLevel(cell, level) {
    if (cell.level == level)
        cell.level = cell.baseLevel;
    else
        cell.level = level;
}

// Takes a cell and updates the UI paint accordingly
function paintCell(cell) {
    paintCellStart(cell);
    paintCellEnd(cell);
    paintCellLevel(cell);
    paintCellState(cell);
}

function paintCellStart(cell) {
    let elem = uiFromCell(cell);
    if (cell.start)
        elem.classList.add('start');
    else
        elem.classList.remove('start');
}

function paintCellEnd(cell) {
    let elem = uiFromCell(cell);
    if (cell.end)
        elem.classList.add('end');
    else
        elem.classList.remove('end');
}

function paintCellLevel(cell) {
    let elem = uiFromCell(cell);

    elem.classList.remove(...levels);
    elem.classList.add("l"+cell.level);
    //console.log(cell);
}

function paintCellState(cell) {
    let elem = uiFromCell(cell);

    elem.classList.remove(...stateOptions);
    if (cell.closed)
        elem.classList.add('closed');
    else if (cell.visited)
        elem.classList.add('visited');
}

function paintCellPath(cell) {
    let elem = uiFromCell(cell);

    if (cell.path)
        elem.classList.add('path');
    else
        elem.classList.remove('path');
}

// Paints out the final path
function paintPath(path) {
    if (path == null) {
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

////////////////////////
//  end of that file  //
////////////////////////

/////////////////////////////////
//  algorithms/pathHelpers.js  //
/////////////////////////////////

const INF = 10000000

function getCost(currentCell, neighbour, costFunction) {
    cost = costFunction(currentCell, neighbour);
    return cost;
}

function timeCost(currentCell, neighbour) {
    let diff = currentCell.level - neighbour.level;

    let cost = 100;
    if (diff > 0) {
        cost = cost + 10*diff;
    }
    else if (diff < 0) {
        diff = -1*diff;
        cost = cost - Math.pow(diff, 2);
    }
    if (diff > 4)
        cost = INF;

    return cost;
}

function energyCost(currentCell, neighbour) {
    let diff = currentCell.level - neighbour.level;

    let cost = 1;
    if (diff > 0) {
        cost = Math.pow(diff, 4);
    }
    else if (diff < 0){
        diff = -1*diff;
        cost = Math.pow(diff, 3)
    }

    if (diff > 4)
        cost = INF;

    return cost*100;
}

function manhattanDist(cell, end) {
    let d1 = Math.abs(cell.i - end.i);
    let d2 = Math.abs(cell.j - end.j);
    return 100*(d1+d2);
}

///////////////////////////
//  algorithms/djikstra.js  //
///////////////////////////

function djikstra(grid, start, end, costFunction, delay) {
    return new Promise(resolve => {
        // Initialise the blank "open list"
        let openList = [];
        openList.push(start);

        // counter is used to delay the timer
        let counter = 0;
        while (openList.length > 0) {
            currentCell = openList[0];
            currentCell.closed = true;

            // paint the cell 
            setTimeout(()=>{paintCellState(currentCell);}, delay*counter);

            // If currentCell is final, return the successful path
            if (currentCell == end) {
                path = [];
                let curr = currentCell;
                while (curr!= null) {
                    curr.path = true;
                    path.push(curr);
                    curr = curr.parent;
                }   
                //return path.reverse(), counter;
                let temp = {
                    path: path.reverse(),
                    time: counter
                }
                resolve(temp);
                return;
            }

            // push currentCell to closedList and remove from openList
            openList = openList.slice(1);

            let neighbours = getNeighbours(grid, currentCell);

            // foreach neighbour of currentCell
            for (let i = 0; i < neighbours.length; i++) {
                let neighbour = neighbours[i];

                // Compute costs and distances
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
                    neighbour.visited = true;

                    // paint the cell
                    setTimeout(()=>{paintCellState(neighbour)}, delay*counter);

                    openList.push(neighbour);
                }
                else if (dist < neighbour.dist) {
                    bestDist = true;
                }

                // If it is the best, update the neighbour's distance/score/parent
                if (bestDist) {
                    neighbour.distance = dist;
                    neighbour.parent = currentCell;
                    neighbour.score = neighbour.distance;
                }
            }

            // Update openList
            // TODO write the sort
            openList.sort(compareCells);
            counter += 1;
        }

        //return [], counter;
        resolve([]);
    });
}


///////////////////////////
//  algorithms/astar.js  //
///////////////////////////

function astar(grid, start, end, costFunction, heuristicFunction, delay) {
    return new Promise(resolve => {
        // Initialise the blank "open list"
        let openList = [];
        openList.push(start);

        // counter is used to delay the timer
        let counter = 0;
        while (openList.length > 0) {
            currentCell = openList[0];
            currentCell.closed = true;

            // paint the cell 
            setTimeout(()=>{paintCellState(currentCell);}, delay*counter);

            // If currentCell is final, return the successful path
            if (currentCell == end) {
                path = [];
                let curr = currentCell;
                while (curr!= null) {
                    curr.path = true;
                    path.push(curr);
                    curr = curr.parent;
                }   
                //return path.reverse(), counter;
                let temp = {
                    path: path.reverse(),
                    time: counter
                }
                resolve(temp);
                return;
            }

            // push currentCell to closedList and remove from openList
            openList = openList.slice(1);

            let neighbours = getNeighbours(grid, currentCell);

            // foreach neighbour of currentCell
            for (let i = 0; i < neighbours.length; i++) {
                let neighbour = neighbours[i];

                // Compute costs and distances
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
                    neighbour.heuristic = heuristicFunction(neighbour, end);
                    neighbour.visited = true;

                    // paint the cell
                    setTimeout(()=>{paintCellState(neighbour)}, delay*counter);

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
            counter += 1;
        }

        //return [], counter;
        resolve([]);
    });
}

//////////////////////////
//  Terrain generation  //
//////////////////////////
let uphills = {
    fullSmall: [
        [0, 1, 2, 1, 0],
        [1, 2, 3, 2, 0],
        [1, 3, 4, 2, 1],
        [1, 2, 3, 3, 1],
        [0, 2, 1, 0, 0]
    ],
    full: [
        [1, 0, 1, 1, 0, 0, 0],
        [0, 1, 1, 2, 1, 1, 1],
        [0, 1, 2, 3, 2, 1, 1],
        [0, 2, 3, 4, 3, 2, 1],
        [1, 1, 2, 3, 2, 1, 0],
        [1, 0, 1, 2, 1, 0, 0],
        [0, 0, 0, 1, 1, 0, 0]
    ],
    halfFullTop: [
        [0, 0, 1, 1, 0, 1, 0],
        [0, 1, 2, 2, 2, 1, 1],
        [2, 3, 2, 3, 3, 3, 2],
        [4, 4, 4, 4, 4, 4, 4]
    ],
    halfFullBottom: [
        [4, 4, 4, 4, 4, 4, 4],
        [2, 3, 2, 3, 3, 3, 2],
        [1, 1, 2, 2, 1, 1, 0],
        [0, 0, 1, 1, 0, 0, 0]
    ],
    halfFullRight: [
        [4, 2, 1, 0],
        [4, 3, 1, 0],
        [4, 2, 2, 1],
        [4, 3, 2, 1],
        [4, 3, 2, 1],
        [4, 3, 1, 0],
        [4, 1, 1, 0]
    ],
    halfFullLeft: [
        [0, 1, 2, 4],
        [0, 1, 3, 4],
        [1, 2, 2, 4],
        [1, 2, 3, 4],
        [1, 2, 3, 4],
        [0, 1, 3, 4],
        [4, 1, 1, 4]
    ],
};

function randomSurface(grid) {
    resetGrid(grid);
    let rows = grid.length, columns = grid[0].length;

    for (let counter = 0; counter < 100; counter++) {
        let i = getRandomNumber(rows);
        let j = getRandomNumber(columns);

        let distortion = getRandomProperty(uphills);
        gridApply(grid, i, j, distortion);
    }
}

function getRandomNumber(uppercap) {
    return Math.floor(Math.random() * uppercap);
}

// Function to get a random property of the object
// Source: https://stackoverflow.com/a/15106541
function getRandomProperty(object) {
    let keys = Object.keys(object);
    return object[keys[ keys.length * Math.random() << 0 ]];
}


///////////////
//  main.js  //
///////////////


// When the webpage is loaded for the first time, the board will be initialised
// The board is a rows x columns grid (we get the row and column count from
// the webpage itself) of nodes. Nodes have position, and level. The default
// level is 8. Colour-coding of the levels will be defined in the CSS, and 
// representation in HTML is as classes.

let BASE_LEVEL = 8;
let rows = 0, columns = 0;
let gridObject = null;

// Variables that help define actions when the mouse moves over the nodes in
// the grid
let level = 14;
let painting = false;
let moveStart = false;
let moveEnd = false;
let execution = false;
let func = 'astar';

let tick = 100;

let starti = 0, startj = 0, endi = 0, endj = 0;

window.addEventListener('load', () => {
    //console.log("load");
    let grid = document.getElementsByClassName('gridrow')[0];
    let classes = grid.classList;

    // Get the number of rows
    rows = parseInt(classes[2]);
    columns = parseInt(classes[3]);

    // hardcoded for quick prototyping, refactor
    starti = 34;
    startj = 4;
    endi = 4;
    endj = 44;

    //console.log("initing grid");
    gridObject = new Grid(rows, columns, starti, startj, endi, endj, BASE_LEVEL);

    // Event listeners for all nodes. When the cell style is updated, so is
    // the node in the JavaScript representation
    window.addEventListener('mouseup', e => {
        painting = false;
        moveStart = false;
        moveEnd = false;
        //console.log('mouseup! pressed = ', painting);
    });

    // Adding EventListeners to the grid so painting/moving can be done
    for (let i = 0; i < 40; i++) {
        for (let j = 0; j < 50; j++) {
            let mouseTarget = document.getElementById(i+'-'+j);
            let cell = cellFromUI(mouseTarget, gridObject.grid);

            mouseTarget.addEventListener('mousedown', e => {
                if (execution)
                    return;
                if (i == starti && j == startj) {
                    moveStart = true;
                }
                else if (i == endi && j == endj) {
                    moveEnd = true;
                }
                else {
                    painting = true;
                    //console.log('mousedown! pressed = ', painting);
                }
            });

            mouseTarget.addEventListener('click', e => {
                if (execution)
                    return;
                let cell = cellFromUI(mouseTarget, gridObject.grid);
                setLevel(cell, level);
                paintCell(cell);
            })

            mouseTarget.addEventListener('mouseleave', e => {
                if (execution)
                    return;
                if (moveStart) {
                    cell.start = false;
                    paintCell(cell);
                }
                else if (moveEnd) {
                    cell.end = false;
                    paintCell(cell);
                }
            });

            mouseTarget.addEventListener('mouseenter', e => {
                if (execution)
                    return;
                if (moveStart) {
                    starti = i;
                    startj = j;
                    cell.start = true;
                    paintCell(cell);
                }
                else if (moveEnd) {
                    endi = i;
                    endj = j;
                    cell.end = true;
                    paintCell(cell);
                }
                else if (painting) {
                    //console.log("Mouse entered ", mouseTarget.id, 'while clicked');
                    let cell = cellFromUI(mouseTarget, gridObject.grid);
                    setLevel(cell, level);
                    paintCell(cell);
                }
            });
        }
    }

    // Adding EventListeners to the UI Elements
    let tempElem = document.getElementById('resetsearch')
    tempElem.addEventListener('click', e => {
        if (execution)
            return;
        resetSearch(gridObject.grid);
    });

    tempElem = document.getElementById('resetboard')
    tempElem.addEventListener('click', e => {
        if (execution)
            return;
        resetGrid(gridObject.grid);
    });

    tempElem = document.getElementById('genrandom')
    tempElem.addEventListener('click', e => {
        if (execution)
            return;
        randomSurface(gridObject.grid);
    });

    tempElem = document.getElementById('search');
    tempElem.addEventListener('click', e => {
        if (execution)
            return;
        let speed = 1000/tick;
        run(speed);
    });


    async function run (delay) {
        execution = true;
        toggleUIVisual(true);
        let start = gridObject.grid[starti][startj];
        let end = gridObject.grid[endi][endj];
        let pathdel = null;
        if (func == 'astar') {
            pathdel = await astar(gridObject.grid, start, end, optimFunction, manhattanDist, delay);
        }
        else {
            pathdel = await djikstra(gridObject.grid, start, end, optimFunction, delay);
        }
        let temp = document.getElementById('crsearch');
        temp.innerText = 'Searching';
        //console.log("happens after", pathdel);
        let pathfound = false;
        setTimeout(()=>{
            pathfound = paintPath(pathdel.path);
        }, pathdel.time*delay);
        //setTimeout(()=>{console.log("complete")}, timedelay*delay);
        setTimeout(()=>{
            execution = false;
            toggleUIVisual(false);
            if (!pathfound) {
                temp.innerText = 'There was no viable path found';
            }
            else {
                temp.innerText = 'Optimal path found';
            }
        }, pathdel.time*delay);
    }

});

function toggleUIVisual(disable) {
    let elems = [
        'resetsearch', 
        'resetboard',
        'genrandom',
        'search',
        'energy',
        'time',
        'assel',
        'djsel',
    ];
    elems.forEach(elemname => {
        let elem = document.getElementById(elemname);
        if (disable)
            elem.classList.add('disabled');
        else
            elem.classList.remove('disabled');
    });

}

for (let i = 1; i <= 16; i++) {
    let id = "level"+i;
    let elem = document.getElementById(id);

    elem.addEventListener('click', e => {
        level = i;
        let resetCounter = document.getElementById('crlvl');
        resetCounter.innerText = level;
    });
}

let optimFunction = energyCost

let optimisationOptions = ['energy', 'time']
optimisationOptions.forEach(name => {
    let optElem = document.getElementById(name);
    optElem.addEventListener('click', e => {
        if (name == 'energy')
            optimFunction = energyCost;
        else if (name == 'time')
            optimFunction = timeCost;

        let cropt = document.getElementById('cropt');
        cropt.innerText = name;
    });
});

let algoListener = null;
let algoWriter = document.getElementById('cralgo');
algoListener = document.getElementById('assel');
algoListener.addEventListener('click', e => {
    func = 'astar';
    algoWriter.innerText = 'A-Star';
});

algoListener = document.getElementById('djsel');
algoListener.addEventListener('click', e => {
    func = 'djikstra';
    algoWriter.innerText = 'Djikstra';
});

let tickButListener = document.getElementById('tickbut');
tickButListener.addEventListener('click', e => {
    let tickListener = document.getElementById('tick');
    tick = tickListener.value;
    let tickWriter = document.getElementById('crtck');
    tickWriter.innerText = tick;
});
