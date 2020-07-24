//////////////////////////
//  functional/cell.js  //
//////////////////////////

//////////////////////////
//  functional/grid.js  //
//////////////////////////

import {Grid} from './functional/grid.js'
import {gridToggle} from './functional/grid.js'
import {resetGrid} from './functional/grid.js'
import {resetSearch} from './functional/grid.js'
import {resetExplore} from './functional/grid.js'

// functional/grid.js
///////////////////////
//  canvasHelper.js  //
///////////////////////
import {cellFromUI} from './functional/canvashelpers.js'
import {setLevel} from './functional/canvashelpers.js'
import {paintCell} from './functional/canvashelpers.js'
import {paintPath} from './functional/canvashelpers.js'
import {paintGrid} from './functional/canvashelpers.js'

/////////////////////////////////
//  algorithms/pathHelpers.js  //
/////////////////////////////////

import {timeCost} from './pathfinding/pathhelpers.js'
import {energyCost} from './pathfinding/pathhelpers.js'
import {manhattanDist} from './pathfinding/pathhelpers.js'

///////////////////////////
//  algorithms/djikstra.js  //
///////////////////////////

import {djikstra} from './pathfinding/djikstra.js'

///////////////////////////
//  algorithms/astar.js  //
///////////////////////////

import {astar} from './pathfinding/astar.js'

//////////////////////////
//  Terrain generation  //
//////////////////////////

import {randomSurface} from './functional/terrainhelpers.js';

//////////////////////////////
//  Terrain Exploration.js  //
//////////////////////////////

import {explore} from './exploration/explorer.js';

import {basic_move} from './exploration/basicmove.js';

///////////////
//  main.js  //
///////////////


window.addEventListener('load', e => {
    //let conceptModal = document.getElementById('concept');
    $('conceptModal').modal('show');
});

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
    'switchmodes',
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
paintGrid(gridObject.grid);

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

let searchBarElem = document.getElementById('searchbar');
let exploreBarElem = document.getElementById('explorebar');

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
    paintGrid(gridObject.grid);
});

// If "reset board" is clicked, reset the grid to all cells @ level 8
resetGridElem.addEventListener('click', e => {
    // disable if executing or in explorationMode
    if (execution || explorationMode)
        return;

    resetGrid(gridObject.grid);
    paintGrid(gridObject.grid);
});

// If "generate random terrain" is clicked, apply random distortions to the
// surface of the grid
randomSurfaceElem.addEventListener('click', e => {
    // disable if executing or in explorationMode
    if (execution || explorationMode)
        return;

    randomSurface(gridObject.grid);
    paintGrid(gridObject.grid);
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
    // disable if execution is on
    if (execution)
        return;
    // if we were in exploration mode, we need to leave it
    if (explorationMode) {
        // Clear/create flag-based/visual UI blocks
        explorationMode = false;
        toggleUIVisual(true, traditionalButtons);
        toggleUIVisual(false, explorationButtons);
        exploreBarElem.style.display = "none";
        searchBarElem.style.display = "block";

        // Reset start/end
        gridObject.grid[0][0].start = false;
        gridObject.grid[starti][startj].start = true;
        gridObject.grid[endi][endj].end = true;

        // reset the grid and unhide it
        randomSurface(gridObject.grid);
        gridToggle(gridObject.grid, true);
        paintGrid(gridObject.grid);
    }
    // if we want to move to exploration mode in the first place,
    else {
        // Clear/create flag-based/visual UI blocks
        explorationMode = true;
        toggleUIVisual(false, traditionalButtons);
        toggleUIVisual(true, explorationButtons);
        exploreBarElem.style.display = "block";
        searchBarElem.style.display = "none";

        // Remove end, and set start to top left
        gridObject.grid[starti][startj].start = false;
        gridObject.grid[0][0].start = true;
        gridObject.grid[endi][endj].end = false;

        // reset any existing searches, change the grid, and hide it
        resetSearch(gridObject.grid);
        randomSurface(gridObject.grid);
        gridToggle(gridObject.grid, false);
        paintGrid(gridObject.grid);
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
    paintGrid(gridObject.grid);
    // command to remove visited and add unmapped to grid
});

newterrainListener.addEventListener('click', e => {
    if (execution || !explorationMode)
        return;

    // reset command
    resetExplore(gridObject.grid);
    randomSurface(gridObject.grid);
    paintGrid(gridObject.grid);
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
    let start = gridObject.grid[0][0];
    execution = true;

    // Visually disable the traditional exec + universal buttons.
    toggleUIVisual(false, explorationButtons);
    toggleUIVisual(false, universalButtons);

    let explDel = await explore(gridObject.grid, start, exploreFunc, delay);

    setTimeout(() => {
        toggleUIVisual(true, explorationButtons);
        toggleUIVisual(true, universalButtons);

        execution = false;
    }, explDel);
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
