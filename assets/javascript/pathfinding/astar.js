import {paintCellState} from '../functional/canvashelpers.js'

import {compareCells} from '../functional/cell.js'

import {getNeighbours} from '../functional/grid.js'

import {INF} from './pathhelpers.js'
import {getCost} from './pathhelpers.js'

export function astar(grid, start, end, costFunction, heuristicFunction, delay) {
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
