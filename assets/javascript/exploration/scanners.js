import {paintCellMapped} from '../functional/canvashelpers.js';

export function scan_top(cell, grid, limit, delay) {
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

export function scan_bot(cell, grid, limit, delay) {
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

export function scan_rig(cell, grid, limit, delay) {
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

export function scan_lef(cell, grid, limit, delay) {
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

