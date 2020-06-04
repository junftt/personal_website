
window.onload = function() {
    var canvas = document.getElementById('board');
    var ctx = canvas.getContext('2d');
    var x_source = 50, y_source = 250;
    var x_target = 350, y_target = 150;
    var v0 = 70;
    var ball = {}, target = {};
    var g = 9.8;
    var ball_path = [];

    var height_slider = document.getElementById('height_slider');
    var height_text= document.getElementById('height_text');
    var velocity_slider = document.getElementById('velocity_slider');
    var velocity_text= document.getElementById('velocity_text');
    height_slider.value = 400-y_source;
    height_text.innerText = height_slider.value;
    velocity_slider.value = v0;
    velocity_text.innerText = velocity_slider.value;

    height_slider.oninput=function() {
        height_text.innerText = height_slider.value;
        y_source = 400-parseInt(height_slider.value);
        reset();
    }
    velocity_slider.oninput=function() {
        velocity_text.innerText = velocity_slider.value;
        v0 = parseInt(velocity_slider.value);
        reset();
    }

    function reset() {
        ball.x = x_source;
        ball.y = y_source;
        var distance = Math.sqrt(
            (x_source-x_target)*(x_source-x_target) +
            (y_source-y_target)*(y_source-y_target));
        ball.vx = v0 * (x_target - x_source) / distance;
        ball.vy = v0 * (y_target - y_source) / distance;
        target.x = x_target;
        target.y = y_target;
        target.vx = 0;
        target.vy = 0;

        ball_path = [];
        ball_path.push({x: ball.x, y: ball.y});



    }

    reset();

    

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'blue';
        ctx.beginPath();
        ctx.setLineDash([5, 15]);
        ctx.moveTo(x_source, y_source);
        ctx.lineTo(x_target, y_target);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.strokeStyle = 'orange';
        ctx.beginPath();
        ctx.moveTo(x_source, y_source);
        for (var i = 1; i < ball_path.length; ++i) {
            ctx.lineTo(ball_path[i].x, ball_path[i].y);
        }
        ctx.stroke();


        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, 4, 0, Math.PI * 2, true);
        ctx.fill();

        ctx.strokeStyle = 'red';
        ctx.strokeRect(target.x -8, target.y -8, 16, 16);
        //ctx.arc(target.x, target.y, 8, 0, Math.PI * 2, true);
        //ctx.stroke();
    }



    var dt = 0.1;
 
    function updateFrame() {
        var steps = 100;
        var ddt = dt/steps;
        if (ball.x < target.x) {
            for (var i = 0; i < steps; ++i) {
                ball.x += ddt * ball.vx;
                ball.y += ddt * ball.vy;
                target.x += ddt * target.vx;
                target.y += ddt * target.vy;

                ball.vy += g * ddt;
                target.vy += g * ddt;
            }

            ball_path.push({x: ball.x, y: ball.y});
        }
        
        draw();
    }

    function doAnim() {
        updateFrame();
        setTimeout(doAnim, 50);
    }
    doAnim();
};