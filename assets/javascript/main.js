//////////////////////////
//  functional/cell.js  //
//////////////////////////

class Cell {
    constructor(i, j, start, end, level, mapped) {
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
        this.mapped = mapped;

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
    constructor(rows, columns, starti, startj, endi, endj, level, mapped) {
        this.rows = rows;
        this.columns = columns;
        this.grid = [];
        this.createGrid(starti, startj, endi, endj, level, mapped);
    }

    createGrid(starti, startj, endi, endj, level, mapped) {
        for (let i = 0; i < this.rows; i++) {
            let rowgrid = [];
            for (let j = 0; j < this.columns; j++) {
                let cell = new Cell(i, j, (i==starti && j==startj), (i==endi && j==endj), level, mapped);
                paintCell(cell);
                rowgrid.push(cell);
            }
            this.grid.push(rowgrid);
        }
    }
}

function gridHide(grid) {
    let rows = grid.length, columns = grid[0].length;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            let cell = grid[i][j];
            cell.mapped = false;
            paintCell(cell);
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
    paintCellMapped(cell);
}

function paintCellMapped(cell) {
    let elem = uiFromCell(cell);
    if (cell.mapped)
        elem.classList.remove('unmapped');
    else
        elem.classList.add('unmapped');
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
        let temp = {
            path: [],
            time: counter
        }
        resolve(temp);
        return;
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
let traditionalButtons = [
    'resetsearch', 
    'resetboard',
    'genrandom',
    'search',
    'energy',
    'time',
    'assel',
    'djsel',
];
for (let i = 1; i <= 16; i++) {
    traditionalButtons.push('level'+i);
}

let universalButtons = [
    'tickbut',
]

let explorationButtons = [
]

let BASE_LEVEL = 8;
let rows = 0, columns = 0;
let starti = 0, startj = 0, endi = 0, endj = 0;

let gridObject = null;

// Flag variables to track activity
let painting = false;
let moveStart = false;
let moveEnd = false;
let execution = false;

// Configuration variables
let level = 14;
let explorationMode = false;
let tick = 100;

// Counting number of rows and columns
let rowsandcolumns = document.getElementsByClassName('gridrow')[0].classList;
rows = parseInt(rowsandcolumns[2]);
columns = parseInt(rowsandcolumns[3]);


// hardcoded for quick prototyping, refactor
starti = 34;
startj = 4;
endi = 4;
endj = 44;

// Creating the grid
gridObject = new Grid(rows, columns, starti, startj, endi, endj, BASE_LEVEL, true);
randomSurface(gridObject.grid);




///////////////////////////////////
//  eventListeners for the grid  //
///////////////////////////////////

// If the mouse goes up, nothing can be set.
window.addEventListener('mouseup', e => {
    painting = false;
    moveStart = false;
    moveEnd = false;
});

// Adding EventListeners to the grid so painting/moving can be done
//
// For each cell in the grid...
for (let i = 0; i < 40; i++) {
    for (let j = 0; j < 50; j++) {
        let mouseTarget = document.getElementById(i+'-'+j);
        let cell = cellFromUI(mouseTarget, gridObject.grid);


        // If the person presses down, it could be for either painting or 
        // moving the start/end. Set the flags up accordingly
        mouseTarget.addEventListener('mousedown', e => {
            // disable if executing or in explorationMode
            if (execution || explorationMode)
                return;

            if (cell.start) {
                moveStart = true;
            }
            else if (cell.end) {
                moveEnd = true;
            }
            else {
                // otherwise, we're trying to paint something.
                painting = true;
            }
        });


        // If the person clicks, it's only to paint. Set the flags accordingly
        mouseTarget.addEventListener('click', e => {
            // disable if executing or in explorationMode
            if (execution || explorationMode)
                return;

            setLevel(cell, level);
            paintCell(cell);
        })


        // If the mouse leaves a cell, it will operate like:
        //      - If the initial mousedown was on start/end, remove that prop 
        //      from this cell.
        //      - Else, set the level of the cell
        mouseTarget.addEventListener('mouseleave', e => {
            // disable if executing or in explorationMode
            if (execution || explorationMode)
                return;

            if (moveStart) {
                cell.start = false;
                paintCell(cell);
            }
            else if (moveEnd) {
                cell.end = false;
                paintCell(cell);
            }
            else if (painting) {
                setLevel(cell, level);
                paintCell;
            }
        });


        // If the mouse enters a cell, it will operate like:
        //      - If the initial mousedown was on start/end, move that to this
        //      cell
        //      - Else, paint this cell
        mouseTarget.addEventListener('mouseenter', e => {
            // disable if executing or in explorationMode
            if (execution || explorationMode)
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
                setLevel(cell, level);
                paintCell(cell);
            }
        });
    }
}





//////////////////////////////////////////////////
//  eventListeners for the Traditional Buttons  //
//////////////////////////////////////////////////

let optimOptions = ['energy', 'time']
let algoOptions = ['assel', 'djsel']

// Function pointers
// this variable points to the currently active optimiser function
let optimFunction = energyCost
// this variable contains the name of the currently active algorithm function
let algoFunction = 'astar';

let currentLevelElem = null;
let currentOptimElem = document.getElementById('cropt');
let currentAlgoElem = document.getElementById('cralgo');
let currentTickElem = document.getElementById('crtck');
let searchStatusElem = document.getElementById('crsearch');

let tickValueListener = document.getElementById('tick');
let tickButListener = document.getElementById('tickbut');


// If any of the "level" buttons are selected, set the level flag = the 
// level of the button clicked
for (let i = 1; i <= 16; i++) {
    let levelElemID = "level"+i;
    let levelElemListener = document.getElementById(levelElemID);

    levelElemListener.addEventListener('click', e => {
        // disable if executing or in explorationMode
        if (execution || explorationMode)
            return;

        // This is the global "level" flag
        level = i;

        // Display the level on the page
        currentLevelElem = document.getElementById('crlvl');
        currentLevelElem.innerText = level;
    });
}

// Event Listeners to deal with selection of the energy/time optimisers
optimOptions.forEach(name => {
    let optimListener = document.getElementById(name);

    optimListener.addEventListener('click', e => {
        // disable if executing or in explorationMode
        if (execution || explorationMode)
            return;

        // change the global pointer to the optimiser according to the 
        // currently executing listener
        if (name == 'energy')
            optimFunction = energyCost;
        else if (name == 'time')
            optimFunction = timeCost;

        // Display the current optimiser on the page
        currentOptimElem.innerText = name;
    });
});

// Event Listeners to deal with the selection of the astar/djikstra algos
algoOptions.forEach(name => {
    let algoListener = document.getElementById(name);

    algoListener.addEventListener('click', e=> {
        // disable if executing or in explorationMode
        if (execution || explorationMode)
            return;

        // Change the global function name-pointer to the correct algorithm
        // name based on the currently executing listener
        if (name == 'assel') 
            algoFunction = 'astar';
        else if (name == 'djsel')
            algoFunction = 'djikstra';

        currentAlgoElem.innerText = algoFunction;
    });
});

// Listener so that when the "set tick speed" button is clicked, the 
// global tick variable will be updated from value
tickButListener.addEventListener('click', e => {
    // Stop the page from refreshing as it's a button press on a form
    e.preventDefault();
    // disable if executing 
    if (execution)
        return;

    tick = tickValueListener.value;
    currentTickElem.innerText = tick;
});

// If "reset search" is clicked, remove search indicators: closed, visited, path
let resetSearchElem = document.getElementById('resetsearch');
resetSearchElem.addEventListener('click', e => {
    // disable if executing or in explorationMode
    if (execution || explorationMode)
        return;

    resetSearch(gridObject.grid);
});

// If "reset board" is clicked, reset the grid to all cells @ level 8
resetGridElem = document.getElementById('resetboard')
resetGridElem.addEventListener('click', e => {
    // disable if executing or in explorationMode
    if (execution || explorationMode)
        return;

    resetGrid(gridObject.grid);
});

// If "generate random terrain" is clicked, apply random distortions to the
// surface of the grid
randomSurfaceElem = document.getElementById('genrandom')
randomSurfaceElem.addEventListener('click', e => {
    // disable if executing or in explorationMode
    if (execution || explorationMode)
        return;

    randomSurface(gridObject.grid);
});

// If the "search" button is clicked, calculate the delay from tick speed
// and search for the optimal path with config flags set
tempElem = document.getElementById('search');
tempElem.addEventListener('click', e => {
    // disable if executing or in explorationMode
    if (execution || explorationMode)
        return;

    let delay = 1000/tick;
    run(delay);
});


// EventListeners to switch modes and, disable/enable UIs
let switchModeListener = document.getElementById('switchmodes');

switchModeListener.addEventListener('click', e => {
    if (explorationMode) {
        explorationMode = false;
        toggleUIVisual(false, traditionalButtons);
        toggleUIVisual(true, explorationButtons);
    }
    else {
        explorationMode = true;
        toggleUIVisual(true, traditionalButtons);
        toggleUIVisual(false, explorationButtons);
    }
});





/////////////////////////
//  Main.js functions  //
/////////////////////////

async function run (delay) {
    // Set the execution flag so UI elements can grey out
    execution = true;

    // Visually disable the traditional exec + universal buttons.
    toggleUIVisual(true, traditionalButtons);
    toggleUIVisual(true, universalButtons);

    // Get the cell representations of the start and end cells
    let start = gridObject.grid[starti][startj];
    let end = gridObject.grid[endi][endj];

    // pathdel will get the return value of the search. It contains the 
    // path and the delay
    let pathdel = null;
    // Calling the function also paints the cell search operation, but not the
    // final path
    if (algoFunction == 'astar') {
        pathdel = await astar(
            gridObject.grid,
            start,
            end,
            optimFunction,
            manhattanDist,
            delay
        );
    }
    else {
        pathdel = await djikstra(
            gridObject.grid,
            start,
            end,
            optimFunction,
            delay
        );
    }

    // Give a visual update on the search status
    searchStatusElem.innerText = 'Searching';

    // Paint the final path, if it exists. 
    let pathfound = false;
    setTimeout(()=>{
        pathfound = paintPath(pathdel.path);
    }, pathdel.time*delay);

    // Whether you find it or not, update the search status accordingly
    // Also unset the global execution flag and visually re-enable the 
    // traditional and universal buttons
    setTimeout(()=>{
        execution = false;

        toggleUIVisual(false, traditionalButtons);
        toggleUIVisual(false, universalButtons);

        if (!pathfound) {
            searchStatusElem.innerText = 'There was no viable path found';
        }
        else {
            searchStatusElem.innerText = 'Optimal path found';
        }
    }, pathdel.time*delay);
}


function toggleUIVisual(disable, elems) {
    elems.forEach(elemname => {
        let elem = document.getElementById(elemname);
        if (disable)
            elem.classList.add('disabled');
        else
            elem.classList.remove('disabled');
    });
}
