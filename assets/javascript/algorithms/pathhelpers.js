export const INF = 10000000

export function getCost(currentCell, neighbour, costFunction) {
    let cost = costFunction(currentCell, neighbour);
    return cost;
}

export function timeCost(currentCell, neighbour) {
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

export function energyCost(currentCell, neighbour) {
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

export function manhattanDist(cell, end) {
    let d1 = Math.abs(cell.i - end.i);
    let d2 = Math.abs(cell.j - end.j);
    return 100*(d1+d2);
}


