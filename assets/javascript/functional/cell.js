export class Cell {
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


// Takes a distortion value and applies it to the cell.
export function cellApply(cell, distortionCell) {
    let currentLevel = cell.level;
    
    // To ensure there's no overlap-application of a hill
    // to a valley or otherwise
    if (currentLevel > 8 && distortionCell < 0)
        return;
    if (currentLevel < 8 && distortionCell > 0)
        return;

    let newLevel = currentLevel + distortionCell;

    // Clipping the new level of the cell
    newLevel = newLevel > 16? 16: newLevel;
    newLevel = newLevel < 1? 1 : newLevel;
    cell.level = newLevel;
}


// Comparison function for cell objects, checks against 
// the 'score' property
export function compareCells(a, b) {
    if (a.score < b.score) return -1;
    if (a.score > b.score) return 1;
    return 0;
}

