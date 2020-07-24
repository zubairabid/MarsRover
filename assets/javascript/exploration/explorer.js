import {scan_top} from './scanners.js';
import {scan_bot} from './scanners.js';
import {scan_rig} from './scanners.js';
import {scan_lef} from './scanners.js';

import {paintCell} from '../functional/canvashelpers.js'

function tempF(cell, delay) {
    setTimeout(()=>{paintCell(cell);}, delay);
}

export function explore(grid, start, moveFunction, delay) {

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


