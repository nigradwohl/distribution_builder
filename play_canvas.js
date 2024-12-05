(function () {

    // const canvas = document.querySelector('#canvas');
    // const c = canvas.getContext('2d');
    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;
    // canvas.style.backgroundColor = 'black';

    'use strict';
    const hit_canvas = document.getElementById('hit-layer');
    const def_canvas = document.getElementById('defense-layer');
    const stat_canvas = document.getElementById('static-layer');
    // var t = document.getElementById('t');
    const ctx_hit = hit_canvas.getContext('2d');
    const ctx_def = def_canvas.getContext('2d');
    const ctx_fin = stat_canvas.getContext('2d');
    // Set width of canvas:
    const w = hit_canvas.width = def_canvas.width = stat_canvas.width = 800;  // window.innerWidth;
    const h = hit_canvas.height = def_canvas.height = stat_canvas.height = 600;  // window.innerHeight;
    // c.style.backgroundColor = 'black';
    // Fixed values ensure equal height and width of points.

    const target_ht = 20;  // height of targets.
    const target_wd = target_ht * h/w;

    const bins_w = Array.from({length: w / target_wd}, (_, i) => target_wd + target_wd * i);  // w / target_ht;  // TODO: Move up.
    const bins_v = Array.from({length: h / target_ht}, (_, i) => target_ht + target_ht * i);  // w / target_ht;  // TODO: Move up.

// current dots
    let balls = [];
    let active_balls = [];
    let finished_balls = [];
    let def_balls = [];

    let finished_x = new Array(bins_w.length).fill(h - target_ht);

    // var total = js_vars.n_dots;  // number of balls.
    // var noise = js_vars.dot_noise * total; // number of noise balls (t gives the fraction!)
    let total = 100;
    const noise = 0;
    const dot_right = true;
    // console.log("current noise: " + noise);
    const bounce = -1;
    // Add balls to the list and give them their direction:
    for (let i = 0; i < total; i++) {

        balls.push({
            // Initiate random positions:
            // x: Math.random() * w,
            x: bins_w[Math.floor(Math.random()*bins_w.length)],
            y: 0, // Math.random() * h,
            vx: 0,  // x velocity.
            // subtract the squared angle, to obtain a speed of 1:
            // subtract Math.sin(dot_angle)**2 (then adjust dir!)!
            // y-velocity (falling speed):
            vy: 20, // Math.sin(Math.random() * Math.PI/4),
            // Speed is not necessarily the problem but how well it maps onto the pixels!
            // 10 works, 4 works, 2 works...
            // 380/8, for instance does not work
            // Set latter to 0 to have no degree error.
            // Increase speed through multiplication!
            col: "rgb(180,180,180)",
            triggered_new: false,
            dnum: i.toString(),  // dot number for debugging.

        })

    }

    // Define an array of active balls:
    console.log("Balls");
    console.log(balls);
    let firstball = balls.shift();
    active_balls.push(firstball);
    console.log(active_balls);

// draw all balls each frame
    function draw(ctx, target_arr) {
        // console.log("Drawing!");
        ctx.clearRect(0, 0, w, h);
        let j, dot;
        for (j = 0; j < target_arr.length; j++) {
            dot = target_arr[j];  // get the ball.
            ctx.beginPath();
            // Sizes are in pixels!
            // Dot:
            // ctx.arc(dot.x, dot.y, target_ht, 0, Math.PI * 2, false);  // third parameter controls size (radius).
            // Rectangle:
            ctx.rect(dot.x, dot.y, target_wd, target_ht);  // third parameter controls size.
            // ctx.fillStyle = (j > noise) ? "rgb(0,0,0)" : "#fff";  // different dots (good for testing)
            // noise dots unfilled.
            // ctx.fillStyle = "rgb(0,0,0)";
            ctx.fillStyle = dot.col;
            ctx.fill();
            // ctx.strokeStyle = 'black';  // stroke for those with noise.
            // (j < noise) ? ctx.stroke() : '';

            // Add text (for debugging):
            ctx.font = "14px Arial";
            ctx.fillStyle = "black";
            ctx.textBaseline = "middle";  // vertical
            ctx.textAlign = "center";  // horizontal
            ctx.fillText(dot.dnum,dot.x + target_wd/2, dot.y + target_ht/2);
        }

    }


// movement function
    function update() {
        var i, dot;
        // TODO: active_balls appears to be a moving target which causes problems!
        for (i = 0; i < active_balls.length; i++) {
            dot = active_balls[i];
            // Stop updating
            // TODO: Make sensitive to still visible elements!
            // Get all dots on the corresponding x position and obtain the largest y-position among them!

            // Check among finished balls for
            const n_xbin = finished_x[bins_w.indexOf(dot.x)];  // Deterine up to which position targets are filled.
            // console.log(`Bin of current dots already has targets until ${n_xbin}`);

            // if (dot.y < h - target_ht && dot.y < finished_x[bins_w.indexOf(dot.x)]) {
            if (dot.y < n_xbin) {
                // If dot has not finsihed, add its velocity
                dot.y += dot.vy;
            } else {
                // For final dot:
                // Remove dot from active:
                const landed = active_balls.splice(i, 1);
                console.log(landed);
                // Set inactive on second canvas:
                finished_balls = finished_balls.concat(landed);  // Add ball to finished balls.
                draw(ctx_fin, finished_balls);
                // Update location count:
                // TODO: Only do so if targets are persistent!
                finished_x[bins_w.indexOf(landed[0].x)] -= target_ht;
                console.log("Finished balls:");
                console.log(finished_balls);
                console.log(finished_x);  // Show finish locations.
            }

            // Add a new ball after the half:
            // if (dot.y === h / 2) {
            // if (dot.y === h - 2 * target_ht - n_xbin) {  // or later.
            if (dot.y >= n_xbin - 2 * target_ht && !dot.triggered_new) {  // or later.
                if (balls.length > 0) {  // If enough balls are left.
                    // Check if balls are left:
                    console.log(balls);
                    const newball = balls.shift();  // Get first of remaining balls.
                    console.log("New ball!");
                    console.log(newball);
                    // active_balls.push(balls[i + 1]);  // Add the next ball -- does not work this way, because the index stays the same..
                    active_balls.push(newball);  // Add the next ball.
                    dot.triggered_new = true;

                    console.log(active_balls);
                }

            }
            // }
        }
    }


    // loop the animation
    requestAnimationFrame(function loop() {
        // As long as there are active balls:
        if (active_balls.length > 0) {
            requestAnimationFrame(loop);
            update();
            // Draw the active balls:
            draw(ctx_hit, active_balls);
        }

    });

    // Add mouse stuff:
    let click = false;  // TODO: Needed?
    let boundingBox = hit_canvas.getBoundingClientRect();
    const mouse = {
        x: hit_canvas.width / 2,
        y: hit_canvas.height / 2
    };

    document.addEventListener("mousedown", (e) => {
        console.log(boundingBox);
        mouse.x = e.clientX - boundingBox.left;
        mouse.y = e.clientY - boundingBox.top;

        console.log(mouse);
        console.log(active_balls);

        // Add a bit of padding:
        const pad_hitzone = 5;  // Padding of the hitzone.

        // TODO: Ensure that the current ball is targeted!
        // console.log(`Current difference: ${Math.abs(mouse.x - balls[0].x)}; Tolerance: ${pad_hitzone + target_ht / 2}`);

        // Check all active balls:
        let ixb;
        let ball_updated = false;
        const tol = (pad_hitzone + target_ht / 2);  // tolerance.
        for (ixb = 0; ixb < active_balls.length; ixb++) {
            if (Math.abs(mouse.x - active_balls[ixb].x) <= tol &&
                Math.abs(mouse.y - active_balls[ixb].y) <= tol) {
                console.log("Change ball!");
                active_balls[ixb].col = "rgb(155,55,255)";  // Define a new color for the ball!
                draw(ctx_hit, active_balls);  // DO the updating!
                ball_updated = true;
            }
        }

        // If no ball was updated:
        if (!ball_updated) {
            console.log("No balls updated -- will create one");
            // Add a ball (currently for demonstration only):
            // let dot_angle = (i < noise) ? Math.random() * Math.PI * 2 : (Math.random() - 0.5) * Math.PI / 2;

            // Ensure bins:
            console.log(bins_w);
            const xpos = bins_w.reduce(function (prev, curr) {
                return (Math.abs(curr - mouse.x) < Math.abs(prev - mouse.x) ? curr : prev);
            });
            const ypos = bins_v.reduce(function (prev, curr) {
                return (Math.abs(curr - mouse.y) < Math.abs(prev - mouse.y) ? curr : prev);
            });

            def_balls.push({
                // Initiate at mouse position:
                // x: mouse.x,
                // y: mouse.y,
                x: xpos,
                y: ypos,

                // vx: ((i < noise) ? Math.cos(dot_angle) : (dot_right * (1 - Math.sin(dot_angle) ** 2))) * 1,
                // subtract the squared angle, to obtain a speed of 1:
                // subtract Math.sin(dot_angle)**2 (then adjust dir!)!
                // vy: Math.sin(dot_angle) * 1, // Math.sin(Math.random() * Math.PI/4),
                // Set latter to 0 to have no degree error.
                // Increase speed through multiplication!
                col: "rgb(255,155,55)",

            });

            console.log(def_balls);

            draw(ctx_def, def_balls);
        }

        click = true;
    });
    document.addEventListener("mouseup", (e) => {
        click = false;
    });


})();