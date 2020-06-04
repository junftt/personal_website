// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API

window.onload = function() {
    var canvas = document.getElementById('board');
    var ctx = canvas.getContext('2d');

    var f1 = 363;
    var f2 = 317;

    var y_scale = 30;
    var x_scale = 0.0001;
    var offset = 0;
    var scale = 10;

    function wave(f, x, x_offset, y_offset) {
        return y_offset + y_scale * Math.sin(scale*x_scale*f*(x+x_offset));
    }

    var audio_context = new AudioContext();
    var osc_f1 = audio_context.createOscillator();
    osc_f1.type = "sine";
    osc_f1.frequency.value = f1;
    var gain_f1 = audio_context.createGain();
    gain_f1.gain.value = 0;
    osc_f1.connect(gain_f1);
    gain_f1.connect(audio_context.destination);
    osc_f1.start();


    var osc_f2 = audio_context.createOscillator();
    osc_f2.type = "sine";
    osc_f2.frequency.value = f2;
    var gain_f2 = audio_context.createGain();
    gain_f2.gain.value = 0;
    osc_f2.connect(gain_f2);
    gain_f2.connect(audio_context.destination);
    osc_f2.start();



    var f1_slider= document.getElementById('f1_slider');
    var f1_text= document.getElementById('f1_text');
    var f1_audio= document.getElementById('f1_audio');
    var f2_slider= document.getElementById('f2_slider');
    var f2_text= document.getElementById('f2_text');
    var f2_audio= document.getElementById('f2_audio');
    var fbeat_text= document.getElementById('f_beat');
    var offset_slider= document.getElementById('offset_slider');
    var scale_slider= document.getElementById('scale_slider');

    f1_slider.value = f1;
    f2_slider.value = f2;
    fbeat_text.innerText = Math.abs(f1-f2);
    offset_slider.value = offset;
    scale_slider.value = scale;
    f1_text.innerText = f1;
    f2_text.innerText = f2;

    f1_slider.oninput=function() {
        f1_text.innerText = f1_slider.value;
        f1 = parseInt(f1_slider.value);
        update();
    }
    f2_slider.oninput=function() {
        f2_text.innerText = f2_slider.value;
        f2 = parseInt(f2_slider.value);
        update();
    }
    offset_slider.oninput=function() {
        offset = parseFloat(offset_slider.value);
        update();
    }
    scale_slider.oninput=function() {
        scale = parseInt(scale_slider.value);
        update();
    }
    f1_audio.onchange=function() {
        if (f1_audio.checked) {
            gain_f1.gain.value = 1;
        } else {
            gain_f1.gain.value = 0;
        }
    }
    f2_audio.onchange=function() {
        if (f2_audio.checked) {
            gain_f2.gain.value = 1;
        } else {
            gain_f2.gain.value = 0;
        }
    }

    function update() {
        osc_f1.frequency.value = f1;
        osc_f2.frequency.value = f2;
        fbeat_text.innerText = Math.abs(f1-f2);
        draw();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = 'blue';
        ctx.beginPath();
        ctx.moveTo(0, wave(f1, 0, 0, 100));
        for (var x = 1; x < canvas.width; ++ x) {
            ctx.lineTo(x, wave(f1, x, 0, 100));
        }
        ctx.stroke();

        var x_offset = - 1.5 * offset * Math.PI * 2 / x_scale / scale / f1;

        ctx.strokeStyle = 'red';
        ctx.beginPath();
        ctx.moveTo(0, wave(f2, 0, x_offset, 100));
        for (var x = 1; x < canvas.width; ++ x) {
            ctx.lineTo(x, wave(f2, x, x_offset, 100));
        }
        ctx.stroke();

        ctx.strokeStyle = 'green';
        ctx.beginPath();
        ctx.moveTo(0, wave(f2, 0, x_offset, 0) + wave(f1, 0, 0, 0) + 275);
        for (var x = 1; x < canvas.width; ++ x) {
            ctx.lineTo(x, wave(f2, x, x_offset, 0) + wave(f1, x, 0, 0) + 275);
        }
        ctx.stroke();
    }

    draw();

};