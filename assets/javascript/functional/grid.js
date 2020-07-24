import {Cell} from './cell.js'
import {cellApply} from './cell.js'

import {paintCell} from './canvashelpers.js'
import {paintCellPath} from './canvashelpers.js'

export class Grid {
    constructor(rows, columns, starti, startj, endi, endj, level, mapped) {
        this.rows = rows;
        this.columns = columns;
        this.grid = [];
        this.createGrid(starti, startj, endi, endj, level, mapped);
    }

    // Initialises a new grid, sets the start/end cells as well
    createGrid(starti, startj, endi, endj, level, mapped) {
        for (let i = 0; i < this.rows; i++) {

            let rowgrid = [];
            for (let j = 0; j < this.columns; j++) {
                let cell = new Cell(
                    i, 
                    j, 
                    (i==starti && j==startj), 
                    (i==endi && j==endj), 
                    level, 
                    mapped
                );
                paintCell(cell);
                rowgrid.push(cell);
            }
            this.grid.push(rowgrid);
        }
    }
}

export function gridToggle(grid, visible) {
    let rows = grid.length, columns = grid[0].length;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            let cell = grid[i][j];
            cell.mapped = visible;
        }
    }
}

export function gridApply(grid, i, j, distortion) {
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

            //console.log("distorting ", gridi, gridj, " by ", distortionCell);
            gridj += 1;
        }
        gridj -= (j);
        gridi += 1;
    }
}

// Resets the grid to BASE_LEVEL 
export function resetGrid(grid) {
    resetSearch(grid);
    let rows = grid.length, columns = grid[0].length;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            let cell = grid[i][j];
            cell.level = 8;
        }
    }
}

export function resetSearch(grid) {
    let rows = grid.length, columns = grid[0].length;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            let cell = grid[i][j];
            cell.visited = false;
            cell.path = false;
            cell.closed = false;

            paintCellPath(cell);
        }
    }
}

export function resetExplore(grid) {
    let rows = grid.length, columns = grid[0].length;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            let cell = grid[i][j];
            cell.visited = false;
            cell.mapped = false;
        }
    }
}

export function getNeighbours(grid, cell) {
    let neighbours = [];
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
