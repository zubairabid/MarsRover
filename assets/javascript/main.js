let pressed = false;
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

        mouseTarget.addEventListener('mouseenter', e => {
            if (pressed) {
                console.log("Mouse entered ", mouseTarget.id, 'while clicked');
                if (mouseTarget.classList.contains('wall')) {
                    mouseTarget.classList.remove('wall');
                }
                else {
                    mouseTarget.classList.add('wall');
                }
                console.log(mouseTarget.classList);
            }
        });
    }
}

