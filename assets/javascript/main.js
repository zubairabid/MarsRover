//////////////////////////
//  functional/cell.js  //
//////////////////////////

import {compareCells} from './functional/cell.js'

//////////////////////////
//  functional/grid.js  //
//////////////////////////

import {Grid} from './functional/grid.js'
import {gridToggle} from './functional/grid.js'
import {gridApply} from './functional/grid.js'
import {resetGrid} from './functional/grid.js'
import {resetSearch} from './functional/grid.js'
import {resetExplore} from './functional/grid.js'
import {getNeighbours} from './functional/grid.js'

// functional/grid.js
///////////////////////
//  canvasHelper.js  //
///////////////////////
import {cellFromUI} from './functional/canvashelpers.js'
import {setLevel} from './functional/canvashelpers.js'
import {paintCell} from './functional/canvashelpers.js'
import {paintCellState} from './functional/canvashelpers.js'
import {paintCellMapped} from './functional/canvashelpers.js'
import {paintPath} from './functional/canvashelpers.js'

/////////////////////////////////
//  algorithms/pathHelpers.js  //
/////////////////////////////////

import {INF} from './algorithms/pathhelpers.js'
import {getCost} from './algorithms/pathhelpers.js'
import {timeCost} from './algorithms/pathhelpers.js'
import {energyCost} from './algorithms/pathhelpers.js'
import {manhattanDist} from './algorithms/pathhelpers.js'

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
            let currentCell = openList[0];
            currentCell.closed = true;

            // paint the cell 
            setTimeout(()=>{paintCellState(currentCell);}, delay*counter);

            // If currentCell is final, return the successful path
            if (currentCell == end) {
                let path = [];
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
            let currentCell = openList[0];
            currentCell.closed = true;

            // paint the cell 
            setTimeout(()=>{paintCellState(currentCell);}, delay*counter);

            // If currentCell is final, return the successful path
            if (currentCell == end) {
                let path = [];
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






//////////////////////////////
//  Terrain Exploration.js  //
//////////////////////////////


function scan_top(cell, grid, limit, delay) {
    let rows = grid.length, columns = grid[0].length;
    let minscan = 0;
    let new_minscan = 0;
    for (let row = cell.i-1; row >= cell.i-limit; row--) {
        if (row < 0)
            break;
        for (let col = cell.j-(cell.i-row); col <= cell.j+(cell.i-row); col++) {
            if (col < 0)
                continue;
            else if (col >= columns) 
                break;

            let tempCell = grid[row][col];
            if (tempCell.level > new_minscan)
                new_minscan = tempCell.level;
            if (!tempCell.mapped) {
                if (tempCell.level >= minscan) {
                    tempCell.mapped = true;
                    setTimeout(()=>{paintCellMapped(tempCell);}, delay);
                }
            }
        }
        minscan = new_minscan;
    }
}

function scan_bot(cell, grid, limit, delay) {
    let rows = grid.length, columns = grid[0].length;
    let minscan = 0;
    let new_minscan = 0;
    for (let row = cell.i+1; row <= cell.i+limit; row++) {
        if (row >= rows)
            break;
        for (let col = cell.j-(row-cell.i); col <= cell.j+(row-cell.i); col++) {
            if (col < 0)
                continue;
            else if (col >= columns) 
                break;

            let tempCell = grid[row][col];
            if (tempCell.level > new_minscan)
                new_minscan = tempCell.level;
            if (!tempCell.mapped) {
                if (tempCell.level >= minscan) {
                    tempCell.mapped = true;
                    setTimeout(()=>{paintCellMapped(tempCell);}, delay);
                }
            }
        }
        minscan = new_minscan;
    }
}

function scan_rig(cell, grid, limit, delay) {
    let rows = grid.length, columns = grid[0].length;
    let minscan = 0;
    let new_minscan = 0;
    for (let col = cell.j+1; col <= cell.j+limit; col++) {
        if (col >= columns)
            break;
        for (let row = cell.i-(col-cell.j-1); row <= cell.i+(col-cell.j-1); row++) {
            if (row < 0)
                continue;
            else if (row >= rows)
                break;

            let tempCell = grid[row][col];
            if (tempCell.level > new_minscan)
                new_minscan = tempCell.level;
            if (!tempCell.mapped) {
                if (tempCell.level >= minscan) {
                    tempCell.mapped = true;
                    setTimeout(()=>{paintCellMapped(tempCell);}, delay);
                }
            }
        }
        minscan = new_minscan;
    }
}

function scan_lef(cell, grid, limit, delay) {
    let rows = grid.length, columns = grid[0].length;
    let minscan = 0;
    let new_minscan = 0;
    for (let col = cell.j-1; col >= cell.j-limit; col--) {
        if (col < 0)
            break;
        for (let row = cell.i-(cell.j-col-1); row <= cell.i+(cell.j-col-1); row++) {
            if (row < 0)
                continue;
            else if (row >= rows)
                break;

            let tempCell = grid[row][col];
            if (tempCell.level > new_minscan)
                new_minscan = tempCell.level;
            if (!tempCell.mapped) {
                if (tempCell.level >= minscan) {
                    tempCell.mapped = true;
                    setTimeout(()=>{paintCellMapped(tempCell);}, delay);
                }
            }
        }
        minscan = new_minscan;
    }
}

function basic_move(cell, grid, prevMove) {
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

function tempF(cell, delay) {
    setTimeout(()=>{paintCell(cell);}, delay);
}

function explore(grid, start, moveFunction, delay) {

    let limit = 10;
    let cell = start;
    let move = 'u';
    let obj = null

    let time = 0;
    while (true) {
        time += delay;
        //console.log("at ", cell.i, cell.j);
        cell.visited = true;
        cell.mapped = true;
        //setTimeout((cell)=>{console.log('painting og');paintCell(cell);}, time)
        tempF(cell, time);

        // scan
        time += delay;
        scan_top(cell, grid, limit, time);
        time += delay;
        scan_bot(cell, grid, limit, time);
        time += delay;
        scan_rig(cell, grid, limit, time);
        time += delay;
        scan_lef(cell, grid, limit, time);

        // move
        obj = moveFunction(cell, grid, move);
        move = obj.move;
        //console.log(obj);
        if (obj.counter >= 4)
            break;
        cell = obj.cell;
    }
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
    'explore',
    'basic',
    'newterrain',
    'resetexplore',
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

toggleUIVisual(false, explorationButtons);


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
let tempElem = document.getElementById('search');
let resetGridElem = document.getElementById('resetboard')
let resetSearchElem = document.getElementById('resetsearch');
let randomSurfaceElem = document.getElementById('genrandom')

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
resetSearchElem.addEventListener('click', e => {
    // disable if executing or in explorationMode
    if (execution || explorationMode)
        return;

    resetSearch(gridObject.grid);
});

// If "reset board" is clicked, reset the grid to all cells @ level 8
resetGridElem.addEventListener('click', e => {
    // disable if executing or in explorationMode
    if (execution || explorationMode)
        return;

    resetGrid(gridObject.grid);
});

// If "generate random terrain" is clicked, apply random distortions to the
// surface of the grid
randomSurfaceElem.addEventListener('click', e => {
    // disable if executing or in explorationMode
    if (execution || explorationMode)
        return;

    randomSurface(gridObject.grid);
});

// If the "search" button is clicked, calculate the delay from tick speed
// and search for the optimal path with config flags set
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
    // if we were in exploration mode, we need to leave it
    if (explorationMode) {
        // Clear/create flag-based/visual UI blocks
        explorationMode = false;
        toggleUIVisual(true, traditionalButtons);
        toggleUIVisual(false, explorationButtons);

        // Reset start/end
        gridObject.grid[starti][startj].start = true;
        gridObject.grid[endi][endj].end = true;

        // reset the grid and unhide it
        // resetSearch(gridObject.grid);
        randomSurface(gridObject.grid);
        gridToggle(gridObject.grid, true);
    }
    // if we want to move to exploration mode in the first place,
    else {
        // Clear/create flag-based/visual UI blocks
        explorationMode = true;
        toggleUIVisual(false, traditionalButtons);
        toggleUIVisual(true, explorationButtons);

        // Remove end, and set start to top left
        gridObject.grid[starti][startj].start = false;
        starti = 0;
        startj = 0;
        gridObject.grid[starti][startj].start = true;
        gridObject.grid[endi][endj].end = false;

        // reset any existing searches, change the grid, and hide it
        resetSearch(gridObject.grid);
        randomSurface(gridObject.grid);
        gridToggle(gridObject.grid, false);
    }
});

//////////////////////////////////////
//  EventListeners for exploration  //
//////////////////////////////////////

let exploreFunc = basic_move;

let exploreListener = document.getElementById('explore');
let resetexploreListener = document.getElementById('resetexplore');
let newterrainListener = document.getElementById('newterrain');
let basicListener = document.getElementById('basic');

basicListener.addEventListener('click', e => {
    if (execution || !explorationMode) 
        return;

    exploreFunc = basic_move;
});

resetexploreListener.addEventListener('click', e => {
    if (execution || !explorationMode) 
        return;

    resetExplore(gridObject.grid);
    // command to remove visited and add unmapped to grid
});

newterrainListener.addEventListener('click', e => {
    if (execution || !explorationMode)
        return;

    // reset command
    resetExplore(gridObject.grid);
    randomSurface(gridObject.grid);
});

exploreListener.addEventListener('click', e => {
    if (execution || !explorationMode)
        return;
    
    let delay = 200/tick;
    runExplore(delay);
});


/////////////////////////
//  Main.js functions  //
/////////////////////////

async function runExplore(delay) {
    let start = gridObject.grid[starti][startj];

    explore(gridObject.grid, start, exploreFunc, delay);
}

async function run (delay) {
    // Set the execution flag so UI elements can grey out
    execution = true;

    // Visually disable the traditional exec + universal buttons.
    toggleUIVisual(false, traditionalButtons);
    toggleUIVisual(false, universalButtons);

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

        toggleUIVisual(true, traditionalButtons);
        toggleUIVisual(true, universalButtons);

        if (!pathfound) {
            searchStatusElem.innerText = 'There was no viable path found';
        }
        else {
            searchStatusElem.innerText = 'Optimal path found';
        }
    }, pathdel.time*delay);
}


function toggleUIVisual(enable, elems) {
    elems.forEach(elemname => {
        let elem = document.getElementById(elemname);
        if (enable)
            elem.classList.remove('disabled');
        else
            elem.classList.add('disabled');
    });
}
