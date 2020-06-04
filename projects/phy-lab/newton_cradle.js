
window.onload = function() {
    var canvas = document.getElementById('board');
    var ctx = canvas.getContext('2d');

    var x_pivot = 200, y_pivot = 50;
    var rod_length = 200;
    
    var ax0, ay0;

    var balls = [];
    var ball_radius = 10;
    var num_balls = 5;
    var num_lifted = 2;
    var release_angle = 25;

    var g = 9.8 * 10;

    var E0;

    var total_slider = document.getElementById('total_slider');
    var total_text= document.getElementById('total_text');
    var lifted_slider = document.getElementById('lifted_slider');
    var lifted_text= document.getElementById('lifted_text');
    var angle_slider = document.getElementById('angle_slider');
    var angle_text= document.getElementById('angle_text');

    total_slider.oninput=function() {
        total_text.innerText = total_slider.value;
    }
    total_slider.onchange=function() {
        num_balls = parseInt(total_slider.value);

        lifted_slider.max = num_balls - 1;
        if (num_lifted > num_balls - 1) {
            lifted_text.innerText = num_lifted = lifted_slider.value = num_balls - 1;
        }
        reset();
    }
    lifted_slider.oninput=function() {
        lifted_text.innerText = lifted_slider.value;
    }
    lifted_slider.onchange=function() {
        num_lifted = parseInt(lifted_slider.value);
        reset();
    }
    angle_slider.oninput=function() {
        angle_text.innerText = angle_slider.value;
    }
    angle_slider.onchange=function() {
        release_angle = parseInt(angle_slider.value);
        reset();
    }

    total_text.innerText = total_slider.value = num_balls;
    lifted_slider.max = num_balls - 1;
    lifted_text.innerText = lifted_slider.value = num_lifted;
    angle_text.innerText = angle_slider.value = release_angle;




    function reset() {
        balls = [];
        var theta = release_angle * Math.PI / 180;

        var left = 200 - (num_balls * ball_radius) + ball_radius;

        for (var i = 0; i < num_balls; ++i) {
            var ball = {};
            ball.x_pivot = left + i * ball_radius * 2;
            ball.y_pivot = 50;
            ball.x = ball.x_pivot;
            ball.y = rod_length + ball.y_pivot;
            ball.vx = 0;
            ball.vy = 0;
            balls.push(ball);
        }

        for (var i = 0; i < num_lifted; ++i) {
            balls[num_balls - 1 - i].x = balls[num_balls - 1 - i].x_pivot + rod_length * Math.sin(theta);
            balls[num_balls - 1 - i].y = balls[num_balls - 1 - i].y_pivot + rod_length * Math.cos(theta);

            E0 = g*(balls[num_balls - 1 - i].y - balls[num_balls - 1 - i].y_pivot);
        }

        var a = g * Math.sin(theta);
        ax0 = a * Math.cos(theta);
        ay0 = a * Math.sin(theta);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    reset();

    function drawBall(ball) {
        ctx.strokeStyle = 'blue';
        ctx.beginPath();
        ctx.moveTo(ball.x_pivot, ball.y_pivot);
        ctx.lineTo(ball.x, ball.y);
        ctx.stroke();

        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball_radius, 0, Math.PI * 2, true);
        ctx.fill();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < balls.length; ++i) {
            drawBall(balls[i]);
        }
    }


    var dt = 0.1;
    var dir = 1;

    function updateBall(i, ddt) {
        var need_to_change_direction = false;
        var ball = balls[i];
        var v2 = 2 * (g*(ball.y - ball.y_pivot) - E0);
        if (v2 <= 0) {
            ball.vy = ay0 * ddt;
            ball.vx = dir * ax0 * ddt;
            need_to_change_direction = true;
        } else {
            var theta = Math.atan2(ball.x - ball.x_pivot, ball.y - ball.y_pivot);
            var v = Math.sqrt(v2);
            ball.vx = dir *v*Math.cos(theta);
            ball.vy = -dir * Math.sign(theta) * v * Math.abs(Math.sin(theta));
        }

        var old_dx = ball.x - ball.x_pivot;

        ball.x += ddt* ball.vx;
        ball.y += ddt* ball.vy;

        var new_dx = ball.x - ball.x_pivot;
        if (new_dx == 0 || new_dx * old_dx < 0) {
            ball.x = ball.x_pivot;
            ball.y = ball.y_pivot + rod_length;
            ball.vx = ball.vy = 0;
        }

        return need_to_change_direction;
    }

    function updateFrame() {
        var steps = 100;
        var ddt = dt/steps;
        for (var i = 0; i < steps; ++i) {
            var need_to_change_direction = false;
            if (dir == -1) {
                if (balls[balls.length - 1].x > balls[balls.length - 1].x_pivot) {
                    for (var j = 0; j < num_lifted; ++j) {
                        if (updateBall(balls.length - 1 - j, ddt)) {
                            need_to_change_direction = true;
                        }
                    }

                } else {
                    for (var j = 0; j < num_lifted; ++j) {
                        if (updateBall(j, ddt)) {
                            need_to_change_direction = true;
                        }
                    }

                }
            } else {
                if (balls[0].x < balls[0].x_pivot) {
                    for (var j = 0; j < num_lifted; ++j) {
                        if (updateBall(j, ddt)) {
                            need_to_change_direction = true;
                        }
                    }

                } else {
                    for (var j = 0; j < num_lifted; ++j) {
                        if (updateBall(balls.length - 1 - j, ddt)) {
                            need_to_change_direction = true;
                        }
                    }

                }
            }
            if (need_to_change_direction) {
                dir = -dir;
            }
        }
        
        draw();
    }

    function doAnim() {
        updateFrame();
        setTimeout(doAnim, 50);
    }
    doAnim();
};