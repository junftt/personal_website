// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes

window.onload = function() {
    var canvas = document.getElementById('board');
    var logger = document.getElementById('logger');
    var ctx = canvas.getContext('2d');

    var x_point = 250, y_point = 200;
    var x_sphere = 150, y_sphere = 200, r_sphere = 50;
    var q_point = 1, q_sphere = -0.5;
    //var q_point = 3.4, q_sphere = -1.4;

    var show_image_charges = false;
    var show_image_charges_checkbox = document.getElementById('show_image_charges');
    show_image_charges_checkbox.onchange=function() {
        show_image_charges = show_image_charges_checkbox.checked;
        reDraw();
    }
    var image_charges_text = document.getElementById('image_charges');
    var more_lines = false;
    var more_lines_checkbox = document.getElementById('more_lines');
    more_lines_checkbox.onchange=function() {
        more_lines = more_lines_checkbox.checked;
        reDraw();
    }

    var qpoint_slider = document.getElementById('qpoint_slider');
    var qsphere_slider = document.getElementById('qsphere_slider');

    var qpoint_text= document.getElementById('qpoint_text');
    var qsphere_text= document.getElementById('qsphere_text');

    qpoint_slider.value = q_point;
    qsphere_slider.value = q_sphere;
    qpoint_text.innerText = q_point;
    qsphere_text.innerText = q_sphere;

    qpoint_slider.oninput=function() {
        qpoint_text.innerText = qpoint_slider.value;
        q_point = parseFloat(qpoint_slider.value);
        reDraw();
    }
    qsphere_slider.oninput=function() {
        qsphere_text.innerText = qsphere_slider.value;
        q_sphere = parseFloat(qsphere_slider.value);
        reDraw();
    }


    function calcQImageZeroPotential() {
        var d = Math.sqrt( (x_point - x_sphere) * (x_point - x_sphere) + (y_point - y_sphere) * (y_point - y_sphere) );
        var offset_from_center = r_sphere * r_sphere / d;
        var v = normalizeVectorToLength(x_point - x_sphere, y_point - y_sphere, offset_from_center);
        if (d < r_sphere) {
            return {
                x: x_sphere + v.x,
                y: y_sphere + v.y,
                q: - offset_from_center * q_point / r_sphere
            }
        } else {
            return {
                x: x_sphere + v.x,
                y: y_sphere + v.y,
                q: - r_sphere / d * q_point
            }
        }
    }

    function originateFromPoint(point_charges, x, y, OFFSET, q0q) {
        var SECTORS = 48;
        for (var i = 0; i < SECTORS; ++i) {
            var alpha = i / SECTORS * Math.PI * 2;
            generateElectricFieldLine(point_charges, x + OFFSET * Math.cos(alpha), y + OFFSET * Math.sin(alpha), q0q);
        }
    }

    function coulombForce(q_from, q_applyon) {
        var K = 1;
        var dx = q_applyon.x - q_from.x, dy = q_applyon.y - q_from.y;
        var inv_d2, inv_d;
        if (dx != 0 || dy != 0) {
            inv_d2 = 1 / (dx * dx + dy * dy);
            inv_d = Math.sqrt(inv_d2);
        } else {
            inv_d2 = inv_d = 0;
        }
        var f = K * q_from.q * q_applyon.q * inv_d2;
        return {fx: dx * f * inv_d, fy: dy * f * inv_d};
    }

    function normalizeVectorToLength(x, y, len) {
        var inv = (len || 1) / Math.sqrt(x * x + y * y);
        return {x: x*inv, y: y*inv};
    }

    function isInSphere(x, y) {
        var dx = x - x_sphere, dy = y - y_sphere;
        return dx*dx+dy*dy<r_sphere*r_sphere;
    }

    function isOutsideField(x, y) {
        return isInSphere(x, y) != isInSphere(x_point, y_point);
    }

    function generateElectricFieldLine(point_charges, x, y, q0q) {
        var STEP = 1;

        var q0 = {x: x, y: y, q: q0q};
        if (q0.q == 0) {
            q0.q = 1;
        }
        var i=0;
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(x, y);
        while (++i<1000) {
            if (isOutsideField(q0.x, q0.y)) break;

            var f = {x: 0, y: 0};
            for (var iq = 0; iq < point_charges.length; ++iq) {
                var f_q_q0 = coulombForce(point_charges[iq], q0);
                f.x += f_q_q0.fx;
                f.y += f_q_q0.fy;
            }
            f = normalizeVectorToLength(f.x, f.y, STEP);
            q0.x +=f.x;
            q0.y +=f.y;
            ctx.lineTo(q0.x, q0.y);
        }
        ctx.stroke();
    }


    function drawCharges(point_charges) {
        if (show_image_charges) {
            if (q_sphere != 0) {
                ctx.setLineDash([2, 5]);
                if (q_sphere > 0) {
                    ctx.strokeStyle = 'red';
                } else  {
                    ctx.strokeStyle = 'blue';
                }
                ctx.beginPath();
                ctx.arc(x_sphere, y_sphere, r_sphere, 0, Math.PI * 2, true);
                ctx.stroke();
                ctx.setLineDash([]);
            }
       
            for (var i = 0; i<point_charges.length; ++i) {
                if (point_charges[i].q > 0) {
                    ctx.fillStyle = 'red';
                } else  if (point_charges[i].q < 0) {
                    ctx.fillStyle = 'blue';
                } else {
                    continue;
                }
                ctx.beginPath();
                ctx.arc(point_charges[i].x, point_charges[i].y, 4, 0, Math.PI * 2, true);
                ctx.fill();
            }

            var text = "";
            for (var i = 1; i<point_charges.length; ++i) {
                if (point_charges[i].q != 0) {
                    text += formatNumber(point_charges[i].q) + "C   ";
                }
            }
            image_charges_text.innerText = "Magnitude of the image charge(s): " + text;    
        } else {
            image_charges_text.innerText ="";

            if (q_sphere != 0) {
                if (q_sphere > 0) {
                    ctx.strokeStyle = 'red';
                } else  {
                    ctx.strokeStyle = 'blue';
                }
                ctx.beginPath();
                ctx.arc(x_sphere, y_sphere, r_sphere, 0, Math.PI * 2, true);
                ctx.stroke();
            }

            if (q_point > 0) {
                if (q_point > 0) {
                    ctx.fillStyle = 'red';
                } else {
                    ctx.fillStyle = 'blue';
                }
                ctx.beginPath();
                ctx.arc(x_point, y_point, 4, 0, Math.PI * 2, true);
                ctx.fill();
            }
            
        }
    }
    

    function formatNumber(num) {
        return parseFloat(Math.round(num * 10) / 10).toFixed(1);
    }
    function reDraw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var qPoint = {x: x_point, y: y_point, q: q_point};
        var qImage = calcQImageZeroPotential();
        var point_charges = [qPoint, qImage];
        if (!isInSphere(x_point, y_point)) {
            if (q_sphere != qImage.q) {
                point_charges.push({x: x_sphere, y: y_sphere, q: q_sphere - qImage.q});
            }
            document.getElementById('message').innerText = '';
        } else {
            document.getElementById('message').innerText = '(Only showing electric field inside the sphere.)';
        }

        if (q_point != 0) {
            originateFromPoint(point_charges, x_point, y_point, 1, Math.sign(q_point));
        }
        if (more_lines) {
            originateFromPoint(point_charges, x_sphere, y_sphere, r_sphere+1,  Math.sign(q_sphere - qImage.q));
        }

        drawCharges(point_charges);
    }

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
        x_point = mousePos.x;
        y_point = mousePos.y;
        reDraw();
    }
    function onMouseDown(evt) {
        var mousePos = getMousePos(canvas, evt);
        x_point = mousePos.x;
        y_point = mousePos.y;
        reDraw();

        canvas.addEventListener('mousemove', onMouseMove);
    }

    reDraw();


};