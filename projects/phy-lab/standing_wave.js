
window.onload = function() {
    var canvas = document.getElementById('board');
    var ctx = canvas.getContext('2d');

    var T = 2000;
    var harmonic_number = 5;
    var wave_length, wave_speed;
    var total_time = 0;

    var harmonic_number_input = document.getElementById('harmonic_number');
    harmonic_number_input.onchange=function() {
        var n =parseInt(harmonic_number_input.value);
        if (n >= harmonic_number_input.max) {
            n = harmonic_number_input.max;
            harmonic_number_input.value = n;
        } else if (n <= harmonic_number_input.min) {
            n = harmonic_number_input.min;
            harmonic_number_input.value = n;
        }
        harmonic_number = n;
        reset();
    }
    harmonic_number_input.value = harmonic_number;

    function reset() {
        wave_length = 2*canvas.width / harmonic_number;
        wave_speed = wave_length / T;
        total_time = 0;
    }
    reset();

    function travel_wave(x, t) {
    	if (x > wave_speed*t) {
    		return 0;
    	}
    	return Math.sin(2*Math.PI/wave_length*x-t*2*Math.PI/T);
    }

    function reflected_wave(x, t) {
    	x = canvas.width + (canvas.width - x);
    	if (x > wave_speed*t) {
    		return 0;
    	}
    	return travel_wave(x, t + T/2);
    }

    function result_wave(x, t) {
    	if (canvas.width + (canvas.width - x) > wave_speed*t) {
    		return 0;
    	}
    	return travel_wave(x,t)+reflected_wave(x,t);
    }


    function drawWave(wave_function, y_scale, y_offset) {
    	ctx.beginPath();
        ctx.moveTo(0, y_offset+y_scale*wave_function(0, total_time));
        for (var x = 1; x < canvas.width; ++ x) {
            ctx.lineTo(x, y_offset+y_scale*wave_function(x, total_time));
        }
        ctx.stroke();
        
        for (var x = 0; x <= canvas.width; x+=16) {
        	ctx.beginPath();
        	ctx.arc(x, y_offset+y_scale*wave_function(x, total_time), 4, 0, Math.PI * 2, true);
        	ctx.stroke();
            ctx.fill();
        }
    }

    
    function updateFrame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'red';
        drawWave(reflected_wave, -50, 100);

        ctx.strokeStyle = 'blue';
        drawWave(travel_wave, -50, 100);

        ctx.strokeStyle = 'green';
        drawWave(result_wave, -50, 275);
    }


    function doAnim() {
        updateFrame();
        total_time += 50;
        setTimeout(doAnim, 50);
    }
    doAnim();

};