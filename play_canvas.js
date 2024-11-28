(function () {

    // const canvas = document.querySelector('#canvas');
    // const c = canvas.getContext('2d');
    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;
    // canvas.style.backgroundColor = 'black';

    'use strict';
    const c = document.getElementById('hit-layer');
    // var t = document.getElementById('t');
    const ctx = c.getContext('2d');
    // Set width of canvas:
    const w = c.width = 400;  // window.innerWidth;
    const h = c.height = 400;  // window.innerHeight;
    // c.style.backgroundColor = 'black';
    // Fixed values ensure equal height and width of points.

    const target_wd = 20;  // width of targets.

// current dots
    var balls = [];
    // var total = js_vars.n_dots;  // number of balls.
    // var noise = js_vars.dot_noise * total; // number of noise balls (t gives the fraction!)
    let total = 1;
    const noise = 0;
    const dot_right = true;
    // console.log("current noise: " + noise);
    var bounce = -1;
    // Add balls to the list and give them their direction:
    for (var i = 0; i < total; i++) {

        balls.push({
            // Initiate random positions:
            x: Math.random() * w,
            y: 0, // Math.random() * h,

            vx: 0,
            // subtract the squared angle, to obtain a speed of 1:
            // subtract Math.sin(dot_angle)**2 (then adjust dir!)!
            vy: 2, // Math.sin(Math.random() * Math.PI/4),
            // Set latter to 0 to have no degree error.
            // Increase speed through multiplication!
            col: "rgb(255,255,255)",

        })


    }

// draw all balls each frame
    function draw() {
        ctx.clearRect(0, 0, w, h);
        var j, dot;
        for (j = 0; j < balls.length; j++) {
            dot = balls[j];  // get the ball.
            ctx.beginPath();
            // Sizes are in pixels!
            // Dot:
            // ctx.arc(dot.x, dot.y, target_wd, 0, Math.PI * 2, false);  // third parameter controls size (radius).
            // Rectangle:
            ctx.rect(dot.x, dot.y, target_wd, target_wd);  // third parameter controls size.
            // ctx.fillStyle = (j > noise) ? "rgb(0,0,0)" : "#fff";  // different dots (good for testing)
            // noise dots unfilled.
            // ctx.fillStyle = "rgb(0,0,0)";
            ctx.fillStyle = dot.col;
            ctx.fill();
            // ctx.strokeStyle = 'black';  // stroke for those with noise.
            // (j < noise) ? ctx.stroke() : '';
        }

    }


// movement function
    function update() {
        var i, dot;
        for (i = 0; i < total; i++) {
            dot = balls[i];
            // Stop updating
            // TODO: Make sensitive to still visible elements!
            // Get all dots on the corresponding x position and obtain the largest y-position among them!

            if (dot.y < h - target_wd) {
                dot.y += dot.vy;
                // TODO: Set inactive; maybe on second canvas?
            }
            // }
        }
    }


    // loop the animation
    requestAnimationFrame(function loop() {
        requestAnimationFrame(loop);
        update();
        draw();
    });

    // Add mouse stuff:
    let click = false;  // TODO: Needed?
    let boundingBox = c.getBoundingClientRect();
    const mouse = {
        x: c.width / 2,
        y: c.height / 2
    };

    document.addEventListener("mousedown", (e) => {
        console.log(boundingBox);
        mouse.x = e.clientX - boundingBox.left;
        mouse.y = e.clientY - boundingBox.top;

        console.log(mouse);
        console.log(balls);

        // Add a bit of padding:
        const pad_hitzone = 5;  // Padding of the hitzone.

        // TODO: Ensure that the current ball is targeted!
        console.log(`Current difference: ${Math.abs(mouse.x - balls[0].x)}; Tolerance: ${pad_hitzone + target_wd / 2}`);

        if (Math.abs(mouse.x - balls[0].x) <= (pad_hitzone + target_wd / 2) &&
            Math.abs(mouse.y - balls[0].y) <= (pad_hitzone + target_wd / 2)) {
            console.log("Change ball!");
            balls[0].col = "rgb(155,55,255)";  // Define a new color for the ball!
            draw();  // DO the updating!
        } else {
            // Add a ball (currently for demonstration only):
            let dot_angle = (i < noise) ? Math.random() * Math.PI * 2 : (Math.random() - 0.5) * Math.PI / 2;

            balls.push({
                // Initiate random positions:
                x: mouse.x,
                y: mouse.y,

                vx: ((i < noise) ? Math.cos(dot_angle) : (dot_right * (1 - Math.sin(dot_angle) ** 2))) * 1,
                // subtract the squared angle, to obtain a speed of 1:
                // subtract Math.sin(dot_angle)**2 (then adjust dir!)!
                vy: Math.sin(dot_angle) * 1, // Math.sin(Math.random() * Math.PI/4),
                // Set latter to 0 to have no degree error.
                // Increase speed through multiplication!
                col: "rgb(255,255,255)",

            })

            draw();
        }

        click = true;
    });
    document.addEventListener("mouseup", (e) => {
        click = false;
    });


})();