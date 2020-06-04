
window.onload = function() {
    var canvas = document.getElementById('board');
    var logger = document.getElementById('logger');
    var ctx = canvas.getContext('2d');

	ctx.translate(0.5,0.5);

    
    var p_source = {x: 80, y: 360};
    var p_on = {x: 220, y: 300};
    var xc = 300, yc = 300, sz = 160;
    //  B
    // A C

    var A = {x: xc - sz, y: yc + sz};
    var B = {x: xc, y: yc - sz};
    var C = {x: xc + sz, y: yc + sz};

    var light_width = 8;

    var r_index = 1.4;
    var g_index = 1.42;
    var b_index = 1.44;


    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
    }
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp);
    function onMouseUp() {
        canvas.removeEventListener('mousemove', onMouseMove);
    }   
    function onMouseMove(evt) {
        var mousePos = getMousePos(canvas, evt);
        p_source.y = mousePos.y;
        if (p_source.y > 450) {
            p_source.y = 450;
        } else if (p_source.y < 300) {
            p_source.y = 300;
        }
        draw();
    }
    function onMouseDown(evt) {
        var mousePos = getMousePos(canvas, evt);
        p_source.y = mousePos.y;
        if (p_source.y > 450) {
            p_source.y = 450;
        } else if (p_source.y < 300) {
            p_source.y = 300;
        }
        draw();
        canvas.addEventListener('mousemove', onMouseMove);
    }


    function refract(r, n, index_i, index_r) {
    	var theta1 = Math.acos(-(r.x * n.x + r.y * n.y));
    	var theta2 = Math.asin(Math.sin(theta1) * index_i / index_r);
    	// -n
    	var v = normalizeVectorToLength(-n.y, n.x, Math.tan(theta2));
    	if (index_i > index_r) {
    		v.x = -v.x; v.y = -v.y;
    	}
    	return normalizeVectorToLength(-n.x + v.x, -n.y + v.y, 1);
    }


    // y = kx + b
    function intersect(line1, line2) {
    	return {x: (line2.b - line1.b) / (line1.k - line2.k),
    		y: (line2.b*line1.k - line1.b*line2.k) / (line1.k - line2.k)};
    }
    function line(p1, p2) {
    	var k = (p2.y-p1.y)/(p2.x-p1.x);
    	return {k: k, b: p1.y - k*p1.x};
    }
    function ray(p1, dir) {
    	var k = dir.y / dir.x;
    	return {k: k, b: p1.y - k*p1.x};
    }


    function draw() {
        ctx.clearRect(0,0,canvas.width, canvas.height);
    	ctx.globalCompositeOperation = 'lighter';

		ctx.fillStyle = 'black';
		ctx.strokeStyle= 'red';
        ctx.fillRect(0,0,canvas.width, canvas.height);
        
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(B.x, B.y);
        ctx.lineTo(C.x, C.y);
        ctx.lineTo(A.x, A.y);
        ctx.stroke();

        var shoot_dir = normalizeVectorToLength(p_on.x-p_source.x, p_on.y-p_source.y, 1);

        //ctx.filter = 'blur(1px)';
        var p = {x:p_source.x};
        for (var i = 0 ; i < 5000; ++i) {
        	p.y = p_source.y + (i / 5000)*light_width;
        	shoot_light(p, shoot_dir, 'rgb(1, 0, 0)', r_index);
        	shoot_light(p, shoot_dir, 'rgb(0, 1, 0)', g_index);
        	shoot_light(p, shoot_dir, 'rgb(0, 0, 1)', b_index);
        }
    }
    draw();

    function draw_ray(p, v, length) {
		ctx.beginPath();
		ctx.moveTo(p.x, p.y);
		ctx.lineTo(p.x+length*v.x, p.y+length*v.y);
		ctx.stroke();
    }

    function shoot_light(p0, dir, color, index) {
    	ctx.strokeStyle = color;
    	var intersect_AB = intersect(ray(p0, dir), line(A, B));
    	var i_AB = normalizeVectorToLength(dir.x, dir.y, 1);
    	var n_AB = normalizeVectorToLength(B.y-A.y, A.x-B.x, 1);
    	var r_AB = refract(i_AB, n_AB, 1, index);

    	var px = {x: intersect_AB.x + r_AB.x,  y: intersect_AB.y + r_AB.y};
    	var intersect_BC = intersect(line(intersect_AB, px), line(B, C));

        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(intersect_AB.x, intersect_AB.y);
        ctx.lineTo(intersect_BC.x, intersect_BC.y);
        ctx.stroke();

        var i_BC = r_AB;
        var n_BC = normalizeVectorToLength(B.y-C.y, C.x-B.x, 1);
        
    	var r_BC = refract(i_BC, n_BC, index, 1);
    	draw_ray(intersect_BC, r_BC, 200);
    }


    function normalizeVectorToLength(x, y, len) {
        var inv = (len || 1) / Math.sqrt(x * x + y * y);
        return {x: x*inv, y: y*inv};
    }

};