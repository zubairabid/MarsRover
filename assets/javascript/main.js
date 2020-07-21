// When the webpage is loaded for the first time, the board will be initialised
// The board is a rows x columns grid (we get the row and column count from
// the webpage itself) of nodes. Nodes have position, and level. The default
// level is 8. Colour-coding of the levels will be defined in the CSS, and 
// representation in HTML is as classes.


// Variables that help define actions when the mouse moves over the nodes in
// the grid
let level = 8;
let pressed = false;

// Random variables atm
let levels = [];
for (let i = 1; i <=16; i++) {
    levels.push("l"+i);
}

// Event listeners for all nodes. When the cell style is updated, so is
// the node in the JavaScript representation

for (let i = 1; i <= 40; i++) {
    for (let j = 1; j <= 50; j++) {
        let mouseTarget = document.getElementById(i+'-'+j);
        mouseTarget.addEventListener('mousedown', e => {
            pressed = true;
            console.log('mousedown! pressed = ', pressed);
        });

        mouseTarget.addEventListener('mouseup', e => {
            pressed = false;
            console.log('mouseup! pressed = ', pressed);
        });

        mouseTarget.addEventListener('click', e => {
            defineLevel(mouseTarget);
        })

        mouseTarget.addEventListener('mouseenter', e => {
            if (pressed) {
                console.log("Mouse entered ", mouseTarget.id, 'while clicked');
                defineLevel(mouseTarget);
            }
        });
    }
}

function defineLevel(elem) {
    console.log(elem.classList);
    if (elem.classList.contains("l"+level)) {
        elem.classList.remove("l"+level);
    }
    else {
        elem.classList.remove(...levels);
        elem.classList.add("l"+level);
    }
    console.log(elem.classList);
}
