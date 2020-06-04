
window.onload = function() {
    var canvas = document.getElementById('board');
    var ctx = canvas.getContext('2d');
    var graph = document.getElementById('graph').getContext('2d');

    var x_pivot = 200, y_pivot = 50;
    var rod_length = 200;
    var x_ball, y_ball;
    var max_angle = 5;
    var vx_ball, vy_ball;
    var ax0, ay0;
    var max_a0;

    var g = 9.8 * 10;

    var E0;


    var angle_slider = document.getElementById('angle_slider');
    var angle_text= document.getElementById('angle_text');

    angle_slider.value = max_angle;
    angle_text.innerText = max_angle;

    angle_slider.oninput=function() {
        angle_text.innerText = angle_slider.value;
        max_angle = parseInt(angle_slider.value);
        reset();
    }

    var graph_point_x, graph_point_y;
    function reset() {
        theta = max_angle * Math.PI / 180;
        x_ball = x_pivot + rod_length * Math.sin(theta);
        y_ball = y_pivot + rod_length * Math.cos(theta);
        vx_ball = 0;
        vy_ball = 0;
        E0 = g*(y_ball - y_pivot);

        var a = g * Math.sin(theta);
        ax0 = a * Math.cos(theta);
        ay0 = a * Math.sin(theta);
        max_a0 = a / rod_length;


        graph.clearRect(0, 0, canvas.width, canvas.height);
        graph_point_x = undefined;
        graph_point_y = undefined;
    }

    reset();


    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = 'blue';
        ctx.beginPath();
        ctx.moveTo(x_pivot, y_pivot);
        ctx.lineTo(x_ball, y_ball);
        ctx.stroke();

        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(x_pivot, y_pivot, 4, 0, Math.PI * 2, true);
        ctx.arc(x_ball, y_ball, 6, 0, Math.PI * 2, true);
        ctx.fill();
    }

    function plotGraph(x, y, xmax, ymax) {
        if (x < -xmax || x > xmax || y < -ymax || y > ymax) {
            return;
        }
        x = 50 + (x+xmax)/(xmax+xmax) * 300;
        y = 50 + (y+ymax)/(ymax+ymax) * 300;

        graph.strokeStyle = 'blue';
        if (graph_point_x == undefined) {
            graph.beginPath();
            graph.moveTo(x, y);
        } else {
            graph.lineTo(x, y);
            graph.stroke();
            graph.beginPath();
            graph.moveTo(x, y);
        }
        graph_point_x = x;
        graph_point_y = y;
    }

    var dt = 0.1;
    var dir = -1;

    var angle_a = 0;
    function updateFrame() {
        var steps = 100;
        var ddt = dt/steps;
        var angle_a;
        for (var i = 0; i < steps; ++i) {
        	var old_theta = theta;
        	var old_vx = vx_ball, old_vy = vy_ball;
        	//var old_angle_a = angle_a;
	        
        	var v2 = 2 * (g*(y_ball - y_pivot) - E0);
        	if (v2 <= 0) {
        		vy_ball = ay0 * ddt;
        		vx_ball = dir * ax0 * ddt;
        		dir = -dir;
        	} else {
	            var v = Math.sqrt(v2);
	        	vx_ball = -dir *v*Math.cos(theta);
	        	vy_ball = dir * Math.sign(theta) * v * Math.abs(Math.sin(theta));
	        }

            x_ball += ddt* vx_ball;
            y_ball += ddt* vy_ball;
            theta = Math.atan2(x_ball - x_pivot, y_ball - y_pivot);

            var w_old = Math.sqrt(old_vx*old_vx + old_vy*old_vy)/rod_length;
            var w = Math.sqrt(vx_ball*vx_ball + vy_ball*vy_ball)/rod_length;
            angle_a = Math.sign(theta-old_theta) * (w - w_old) / ddt;
        }
        plotGraph(theta, angle_a, max_angle * Math.PI /180, max_a0);
        
        draw();
    }

    function doAnim() {
        updateFrame();
        setTimeout(doAnim, 50);
    }
    doAnim();
};