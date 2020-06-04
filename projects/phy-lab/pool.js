
window.onload = function() {
    var canvas = document.getElementById('board');
    var logger = document.getElementById('logger');
    var ctx = canvas.getContext('2d');

    
    var left = 100, right = 700;
    var top = 100, bottom = 500;

    var balls = [];
    var ball_radius = 10;
    var damp = 15;
    var easymode = true;
    var all_stopped = true;
    var dt=0.1;

    var easy_mode_checkbox = document.getElementById('easy_mode');
    easy_mode_checkbox.onchange=function() {
        easymode = easy_mode_checkbox.checked;
        reset();
    }


    var x_mouse = canvas.width, y_mouse = canvas.height;
    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
    }



    canvas.addEventListener('mousemove', onMouseMove);
    function onMouseMove(evt) {
        var mousePos = getMousePos(canvas, evt);
        x_mouse = mousePos.x;
        y_mouse = mousePos.y;
    }
    canvas.addEventListener('mouseup', onMouseUp);
    function onMouseUp(evt) {
        if (all_stopped && !balls[0].hidden) {
            var mousePos = getMousePos(canvas, evt);
            balls[0].vx = balls[0].x - mousePos.x;
            balls[0].vy = balls[0].y - mousePos.y;

            var v = Math.sqrt(balls[0].vx*balls[0].vx+balls[0].vy*balls[0].vy);
            if (v > 300) {
                var vmax = normalizeVectorToLength(balls[0].vx, balls[0].vy, 300);
                balls[0].vx = vmax.x;
                balls[0].vy = vmax.y;
            }

            if (easymode) {
                balls[0].vx=-balls[0].vx;
                balls[0].vy=-balls[0].vy;
            }
            
            all_stopped = false;
        }
    }

    function reset() {
        for (var i = 0; i < 7; ++i) {
            balls[i] = {};
            balls[i].vx = 0;
            balls[i].vy = 0;
            balls[i].hidden = false;
        }

        // 4
        //  2
        // 5 1       O
        //  3
        // 6
        balls[0].x = 600;
        balls[0].y = 300;
        balls[0].color = "white";
        balls[1].x = 250;
        balls[1].y = 300;
        balls[1].color = "red";
        balls[2].x = balls[1].x - Math.sqrt(3) *ball_radius * 1.1;
        balls[2].y = balls[1].y - ball_radius * 1.1;
        balls[2].color = "blue";
        balls[3].x = balls[2].x;
        balls[3].y = balls[1].y + ball_radius * 1.1;
        balls[3].color = "yellow";
        balls[4].x = balls[2].x - Math.sqrt(3) *ball_radius * 1.1;
        balls[4].y = balls[1].y - 2 * ball_radius * 1.1;
        balls[4].color = "orange";
        balls[5].x = balls[4].x;
        balls[5].y = balls[1].y;
        balls[5].color = "black";
        balls[6].x = balls[4].x;
        balls[6].y = balls[1].y + 2 *ball_radius * 1.1;
        balls[6].color = "purple";

        all_stopped = true;
    }
    reset();

    function drawBall(ball) {
        ctx.fillStyle = ball.color;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball_radius, 0, Math.PI * 2, true);
        ctx.fill();
    }

    function collide(ball1, ball2) {
        var dist = Math.sqrt((ball1.x-ball2.x)*(ball1.x-ball2.x)
                + (ball1.y-ball2.y)*(ball1.y-ball2.y));
        if (dist < 2*ball_radius) {
            var r12 = normalizeVectorToLength(ball2.x-ball1.x, ball2.y-ball1.y, 1);
            var r21 = {x: -r12.x, y: -r12.y};

            var v12 = ball1.vx * r12.x + ball1.vy * r12.y;
            var v21 = ball2.vx * r21.x + ball2.vy * r21.y;

            ball1.vx = ball1.vx - v12 * r12.x + v21 * r21.x;
            ball1.vy = ball1.vy - v12 * r12.y + v21 * r21.y;

            ball2.vx = ball2.vx - v21 * r21.x + v12 * r12.x;
            ball2.vy = ball2.vy - v21 * r21.y + v12 * r12.y;

            var offset = normalizeVectorToLength(ball1.vx, ball1.vy, (2*ball_radius - dist) *1.01);
            ball1.x+=offset.x;
            ball1.y+=offset.y;
            return true;
        }
        return false;
    }
    

    function draw_table() {
        ctx.fillStyle = 'green';
        ctx.fillRect(left, top, right-left, bottom-top);

        ctx.strokeStyle = 'orange';
        ctx.fillStyle = 'white';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(left, top, 1.6* ball_radius, 0, Math.PI / 2, true);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(left, top, 1.6* ball_radius, 0, Math.PI * 2, true);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(right, top, 1.6* ball_radius,  Math.PI / 2, Math.PI , true);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(right, top, 1.6* ball_radius,  0, 2* Math.PI , true);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(right, bottom, 1.6* ball_radius,  Math.PI, Math.PI *3/2, true);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(right, bottom, 1.6* ball_radius,  0, 2* Math.PI, true);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(left, bottom, 1.6* ball_radius,  Math.PI *3/2, 0, true);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(left, bottom, 1.6* ball_radius,  0, 2* Math.PI, true);
        ctx.fill();


        ctx.beginPath();
        ctx.arc((left+right)/2, top, 1.6* ball_radius, 0,  Math.PI, true);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc((left+right)/2, top, 1.6* ball_radius,  0, 2* Math.PI, true);
        ctx.fill();

        ctx.beginPath();
        ctx.arc((left+right)/2, bottom, 1.6* ball_radius, Math.PI, 0, true);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc((left+right)/2, bottom, 1.6* ball_radius,  0, 2* Math.PI, true);
        ctx.fill();
    }


    function updateFrame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw_table();

        if (all_stopped) {
            if (!balls[0].hidden) {
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(balls[0].x, balls[0].y);
                ctx.lineTo(x_mouse, y_mouse);
                ctx.stroke();
            }
        } else {
            simulate();
        }

        for (var i = 0; i < balls.length; ++i) {
            if (!balls[i].hidden) {
                drawBall(balls[i]);
            }
        }
    }

    function distance(a, b) {
        return Math.sqrt((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y));
    }

    function isPot(ball) {
        var pots = [
            {x: left, y: top},
            {x: left, y: bottom},
            {x: right, y: bottom},
            {x: right, y: top},
            {x: (left+right)/2, y: top},
            {x: (left+right)/2, y: bottom},
        ];
        for (var i = 0; i< 6;++i) {
            if (distance(ball, pots[i]) < 2*ball_radius) {
                return true;
            }
        }
        return false;
    }

    function simulate() {
        var steps = 100;
        var ddt = dt/steps;
        for (var k = 0; k < steps; ++k) {
            for (var i = 0; i < balls.length; ++i) {
                var balli = balls[i];
                if (balli.hidden) continue;
                
                balli.x += ddt*balli.vx;
                balli.y += ddt*balli.vy;

                for (var j = i + 1; j < balls.length; ++j) {
                    if (balls[j].hidden) continue;
                    if (collide(balli, balls[j])) {
                        break;
                    }
                }


                if (isPot(balli)) {
                    if (i == 0) {
                        reset();
                        return;
                    }
                    balli.hidden = true;
                    balli.vx = balli.vy = 0;
                    continue;
                } else if (balli.x - ball_radius <= left) {
                    balli.x = left + ball_radius;
                    balli.vx = -balli.vx * (1-damp*3*ddt);
                } else if (balli.x + ball_radius >= right) {
                    balli.x = right - ball_radius;
                    balli.vx = -balli.vx* (1-damp*3*ddt);
                } else if (balli.y - ball_radius <= top) {
                    balli.y = top + ball_radius;
                    balli.vy = -balli.vy* (1-damp*3*ddt);
                } else if (balli.y + ball_radius >= bottom) {
                    balli.y = bottom - ball_radius;
                    balli.vy = -balli.vy* (1-damp*3*ddt);
                } else {
                    var v = Math.sqrt(balli.vx*balli.vx+balli.vy*balli.vy);
                    v = v-damp*ddt;
                    if (v > 0) {
                        var newv = normalizeVectorToLength(balli.vx, balli.vy, v);
                        balli.vx = newv.x;
                        balli.vy = newv.y;
                    } else {
                        balli.vx = balli.vy = 0;
                    }
                }

            }


            var is_stop = true;
            for (var i = 0; i < balls.length; ++i) {
                if (balls[i].vx !=0 || balls[i].vy != 0) {
                    is_stop = false;
                    break;
                }
            }
            if (is_stop) {
                all_stopped = true;
                break;
            }
        }
    }

    function doAnim() {
        updateFrame();
        setTimeout(doAnim, 50);
    }
    doAnim();

    function normalizeVectorToLength(x, y, len) {
        var inv = (len || 1) / Math.sqrt(x * x + y * y);
        return {x: x*inv, y: y*inv};
    }
    

};