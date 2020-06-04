window.onload = function() {
    var canvas = document.getElementById('board');
    var logger = document.getElementById('logger');
    var ctx = canvas.getContext('2d');

    var mass_moon = 7.34767309e22; // kg
    var mass_earth = 81.277 * mass_moon;
    var mass_sun = 2.7e7 * mass_moon;
    var dist_sun_earth = 1.496e11; // m
    var dist_moon_earth = 3.844e8; // m
    var G = 6.674e-11; // m*m*m/kg/s/s

    var SCALE_EARTH_ORBIT = 1;
    var SCALE_MOON_ORBIT = 1;


    var dt =  60*24*3600*5 * 0.05/12/4; 

    var earth_orbit, moon_orbit;
    var travelled_angle = 0;

    var sun = {m: mass_sun, dist_to_earth: dist_sun_earth, x: 0, y: 0};
    var earth = {m: mass_earth, dist_to_earth: 0, x: 0, y: 0, vx: 0, vy: 0};
    var moon = {m: mass_moon, dist_to_earth: dist_moon_earth, x: 0, y: 0, vx: 0, vy: 0};

    var show_orbit = false;

    var show_orbit_checkbox = document.getElementById('show_orbit');
    show_orbit_checkbox.onchange=function() {
        show_orbit = show_orbit_checkbox.checked;
        reset();
    }

    function reset() {
        travelled_angle = 0;
        earth_orbit = [];
        moon_orbit = [];

        sun.x = 200;
        sun.y = 200;
        earth.x = 350;
        earth.y = 200;
        moon.x = 10;
        moon.y = 0;

        SCALE_EARTH_ORBIT = (earth.x - sun.x) / dist_sun_earth;
        SCALE_MOON_ORBIT = moon.x / dist_moon_earth;

        earth.vx = 0;
        earth.vy = Math.sqrt(G * sun.m / sun.dist_to_earth); // mv*v/r = G*m*M/(r*r) => v = sqrt(G*M/r)
        moon.vx = 0;
        moon.vy = Math.sqrt(G * earth.m / moon.dist_to_earth);

        earth_orbit.push({x: earth.x, y: earth.y});
        moon_orbit.push({x: earth.x + moon.x, y: earth.y + moon.y});


        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawSun();
    }

    reset();

    function normalizeVectorToLength(x, y, len) {
        var inv = (len || 1) / Math.sqrt(x * x + y * y);
        return {x: x*inv, y: y*inv};
    }

    // G*m*M/(r*r), direction: from obj2 to obj1
    function gForce(obj1, obj2, r) {
        var magnitude = G * obj1.m / (r*r);
        return normalizeVectorToLength(obj1.x - obj2.x, obj1.y - obj2.y, magnitude);
    }

    function drawSun() {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(sun.x, sun.y, 10, 0, Math.PI * 2, true);
        ctx.fill();
    }
    function drawEarth() {
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(earth.x, earth.y, 6, 0, Math.PI * 2, true);
        ctx.fill();
    }
    function drawMoon() {
        ctx.fillStyle = "orange";
        ctx.beginPath();
        ctx.arc(earth.x + moon.x, earth.y + moon.y, 3, 0, Math.PI * 2, true);
        ctx.fill();
    }

    function drawOrbit(orbit) {
        ctx.beginPath();
        ctx.moveTo(orbit[0].x, orbit[0].y);
        for (var i = 1; i < orbit.length; i++) {
            ctx.lineTo(orbit[i].x, orbit[i].y);
        }
        ctx.stroke();
    }
    
    drawSun();
    function updateFrame() {

        var old_moon_x = moon.x + earth.x, old_moon_y = moon.y + earth.y;
        var old_earth_x = earth.x, old_earth_y = earth.y;

        var steps = 1000;
        var ddt = dt /steps;
        for (var i = 0; i < steps; i++) {
            var a_earth = gForce(sun, earth, sun.dist_to_earth);
            var a_moon = gForce(earth, {x: earth.x + moon.x, y: earth.y + moon.y}, moon.dist_to_earth);

            earth.x += SCALE_EARTH_ORBIT*ddt*earth.vx;
            earth.y += SCALE_EARTH_ORBIT*ddt*earth.vy;
            travelled_angle += ddt* Math.sqrt(earth.vx*earth.vx + earth.vy*earth.vy) / dist_sun_earth;
            earth.vx += ddt* a_earth.x;
            earth.vy += ddt* a_earth.y;

            moon.x += SCALE_MOON_ORBIT*ddt*moon.vx;
            moon.y += SCALE_MOON_ORBIT*ddt*moon.vy;
            moon.vx += ddt* a_moon.x;
            moon.vy += ddt* a_moon.y;
        }

        var days = Math.round(travelled_angle / Math.PI /2 * 365);
        
        if (show_orbit) {
            if (days % 365 == 0) {
                ctx.fillStyle = "black";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                drawSun();
            }

            ctx.lineWidth = 4.5;
            ctx.strokeStyle= 'blue';
            ctx.beginPath();
            ctx.moveTo(old_earth_x, old_earth_y);
            ctx.lineTo(earth.x, earth.y);
            ctx.stroke();

            ctx.lineWidth = 2.5;
            ctx.strokeStyle= 'orange';
            ctx.beginPath();
            ctx.moveTo(old_moon_x, old_moon_y);
            ctx.lineTo(earth.x + moon.x, earth.y + moon.y);
            ctx.stroke();
        } else {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            drawSun();
            drawMoon();
            drawEarth();
        }

        logger.innerText = days + ' days';
    }

    function doAnim() {
        updateFrame();
        setTimeout(doAnim, 50);
    }
    doAnim();
};