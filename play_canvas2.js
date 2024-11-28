    const canvas = document.querySelector('#canvas');
    const c = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.backgroundColor = 'black';

    let fish = new Image();
    fish.src = 'eD3Ho.png';
    fish.style.transform = 'scale(2)';

    class Fish {
        constructor() {
            this.x = canvas.width / 2;
            this.y = canvas.height / 2;
            this.radius = 35;
            this.color = "silver";
            this.sheetW = 1992;
            this.sheetH = 981;
            this.cols = 4;
            this.rows = 3;
            this.frameW = this.sheetW / this.cols;
            this.frameH = this.sheetH / this.rows;
            this.frameX = 0;
            this.frameY = 0;
            this.scale = 5;
            this.frame = 0;
            this.left = false;
            this.right = false;
        }

        draw() {
            c.drawImage(fish,
                this.frameX * this.frameW, this.frameY * this.frameH, this.frameW, this.frameH,
                this.x - 45, this.y - 30, this.frameW / this.scale, this.frameH / this.scale);
        }

        update() {
//     ANIMATE
            this.frame++;
            if (this.frame > 5) {
                this.frameX++;
                this.frame = 0;
            }
            if (this.frameX > 3) {
                this.frameX = 0;
                this.frameY++;
            }
            if (this.frameY > 2) {
                this.frameY = 0;
            }

//     MOVEMENT ON CLICK
            let dx = this.x - mouse.x;
            let dy = this.y - mouse.y;
            this.x -= dx / 30;
            this.y -= dy / 30;

//     LINE ON CLICK
            if (click) {
                c.lineWidth = 0.5;
                c.beginPath();
                c.moveTo(this.x, this.y);
                c.lineTo(mouse.x, mouse.y);
                c.strokeStyle = "rgba(255,255,255,1)";
                c.stroke();
            }
        }
    }

    let player = new Fish();


    let click = false;
    let boundingBox = canvas.getBoundingClientRect();
    const mouse = {
        x: canvas.width / 2,
        y: canvas.height / 2
    };

    document.addEventListener("mousedown", (e) => {
        mouse.x = e.clientX - boundingBox.left;
        mouse.y = e.clientY - boundingBox.top;
        click = true;
    });
    document.addEventListener("mouseup", (e) => {
        click = false;
    });

    function animate() {
        c.clearRect(0, 0, canvas.width, canvas.height);

        player.draw();
        player.update();

        // if (player.x < canvas.height / 4) {
        //   player.right = true;
        // }
        // if (player.right) {
        //     fish.style.transform = 'scaleX(-1)';
        //   } else {
        //     fish.style.transform = 'scaleX(1)';
        //   }
        console.log(player.right)
        requestAnimationFrame(animate)
    }

    animate()