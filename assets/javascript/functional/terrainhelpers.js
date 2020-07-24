import {resetGrid} from './grid.js'
import {gridApply} from './grid.js'

export function randomSurface(grid) {
    resetGrid(grid);
    let rows = grid.length, columns = grid[0].length;

    for (let counter = 0; counter < 100; counter++) {
        let i = getRandomNumber(rows);
        let j = getRandomNumber(columns);

        let distortion = getRandomProperty(uphills);
        gridApply(grid, i, j, distortion);
    }
}

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

function getRandomNumber(uppercap) {
    return Math.floor(Math.random() * uppercap);
}

// Function to get a random property of the object
// Source: https://stackoverflow.com/a/15106541
function getRandomProperty(object) {
    let keys = Object.keys(object);
    return object[keys[ keys.length * Math.random() << 0 ]];
}


