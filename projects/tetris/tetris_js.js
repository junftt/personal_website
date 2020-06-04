window.onload = function () {

    var canvas = document.getElementById('blackborad');
    var ctx = canvas.getContext('2d');

    var block_size = 30;
    var which_shape = Math.floor(Math.random() * 6.99);
    var which_direc = 0;
    var x_direc = 0;
    var y_direc = 10;
    var x_offset = 0;
    var y_offset = 0;
    var key_dec = 0;
    var move_dec = 0;
    var down_dec = 0;
    var break_persec = 2;

    var accumulation = 0;

    var board = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];

    var blocks = [
        [
            [-27, -26, -25, -24],
            [-35, -25, -15, -5],
            [-17, -16, -15, -14],
            [-36, -26, -16, -6]
        ],
        [
            [-37, -27, -26, -25],
            [-26, -36, -35, -16],
            [-25, -27, -26, -15],
            [-36, -26, -16, -17]
        ],
        [
            [-35, -25, -26, -27],
            [-36, -26, -16, -15],
            [-27, -26, -25, -17],
            [-26, -36, -37, -16]
        ],
        [
            [-36, -35, -26, -25],
            [-36, -35, -26, -25],
            [-36, -35, -26, -25],
            [-36, -35, -26, -25]
        ],
        [
            [-36, -35, -26, -27],
            [-36, -25, -26, -15],
            [-26, -25, -16, -17],
            [-37, -26, -27, -16]
        ],
        [
            [-36, -27, -26, -25],
            [-36, -26, -25, -16],
            [-26, -27, -25, -16],
            [-36, -26, -27, -16]
        ],
        [
            [-36, -37, -26, -25],
            [-35, -26, -25, -16],
            [-26, -27, -16, -15],
            [-36, -27, -26, -17]
        ],
    ]

    var block_0 = blocks[which_shape][which_direc][0];
    var block_1 = blocks[which_shape][which_direc][1];
    var block_2 = blocks[which_shape][which_direc][2];
    var block_3 = blocks[which_shape][which_direc][3];

    var block_0_backup = block_0;
    var block_1_backup = block_1;
    var block_2_backup = block_2;
    var block_3_backup = block_3;

    var x_direc_lv2 = 0;
    var y_direc_lv2 = 10;

    var x_offset_lv2 = 0;
    var y_offset_lv2 = 0;

    function creatBlocks(a, b, c, d) {
        board[a] = 1;
        board[b] = 1;
        board[c] = 1;
        board[d] = 1;
    }

    function clearBlocks(a, b, c, d) {
        board[a] = 0;
        board[b] = 0;
        board[c] = 0;
        board[d] = 0;

        var block_x = (a - Math.floor(a / 10) * 10) * block_size;
        var block_y = Math.floor(a / 10) * block_size;
        ctx.clearRect(block_x, block_y, block_size, block_size);

        block_x = (b - Math.floor(b / 10) * 10) * block_size;
        block_y = Math.floor(b / 10) * block_size;
        ctx.clearRect(block_x, block_y, block_size, block_size);

        block_x = (c - Math.floor(c / 10) * 10) * block_size;
        block_y = Math.floor(c / 10) * block_size;
        ctx.clearRect(block_x, block_y, block_size, block_size);

        block_x = (d - Math.floor(d / 10) * 10) * block_size;
        block_y = Math.floor(d / 10) * block_size;
        ctx.clearRect(block_x, block_y, block_size, block_size);

    }
    
    var block_x_1;
    var block_y_1;
    var block_x_2;
    var block_y_2;
    var block_x_3;
    var block_y_3;
    var block_x_4;
    var block_y_4;    
    function drawBlocks(a, b, c, d) {
        ctx.fillStyle = 'rgb(0,0,225)';
        block_x_1 = (a - Math.floor(a / 10) * 10) * block_size;
        block_y_1 = Math.floor(a / 10) * block_size;
        ctx.fillRect(block_x_1, block_y_1, block_size, block_size);

        block_x_2 = (b - Math.floor(b / 10) * 10) * block_size;
        block_y_2 = Math.floor(b / 10) * block_size;
        ctx.fillRect(block_x_2, block_y_2, block_size, block_size);

        block_x_3 = (c - Math.floor(c / 10) * 10) * block_size;
        block_y_3 = Math.floor(c / 10) * block_size;
        ctx.fillRect(block_x_3, block_y_3, block_size, block_size);

        block_x_4 = (d - Math.floor(d / 10) * 10) * block_size;
        block_y_4 = Math.floor(d / 10) * block_size;
        ctx.fillRect(block_x_4, block_y_4, block_size, block_size);
    }

    function reset() {
        which_shape = Math.floor(Math.random() * 6.99);
        which_direc = 0;
        x_direc = 0;
        y_direc = 10;
        x_offset = 0;
        y_offset = 0;
        key_dec = 0;
        move_dec = 0;
        down_dec = 0;
        block_0 = blocks[which_shape][which_direc][0];
        block_1 = blocks[which_shape][which_direc][1];
        block_2 = blocks[which_shape][which_direc][2];
        block_3 = blocks[which_shape][which_direc][3];
        accumulation = 0;

        block_0_backup = block_0;
        block_1_backup = block_1;
        block_2_backup = block_2;
        block_3_backup = block_3;

        x_direc_lv2 = 0;
        y_direc_lv2 = 10;

        x_offset_lv2 = 0;
        y_offset_lv2 = 0;
    }

    function movedeDetection() {
        move_dec = 0;

        if ((which_shape == 0 && which_direc == 1) || (which_shape == 0 && which_direc == 3)) {
            if ((block_3 + x_offset + y_offset == 170) || (block_3 + x_offset + y_offset == 171) || (block_3 + x_offset + y_offset == 172) || (block_3 + x_offset + y_offset == 173) || (block_3 + x_offset + y_offset == 174) || (block_3 + x_offset + y_offset == 175) || (block_3 + x_offset + y_offset == 176) || (block_3 + x_offset + y_offset == 177) || (block_3 + x_offset + y_offset == 178) || (block_3 + x_offset + y_offset == 179)) {
                move_dec = 1;
                reset();
            }
            if (board[block_3 + x_offset + y_offset + 10] == 1) {
                move_dec = 1;
                reset();
            }
        }

        if ((which_shape == 0 && which_direc == 0) || (which_shape == 0 && which_direc == 2)) {
            if ((block_3 + x_offset + y_offset == 170) || (block_3 + x_offset + y_offset == 171) || (block_3 + x_offset + y_offset == 172) || (block_3 + x_offset + y_offset == 173) || (block_3 + x_offset + y_offset == 174) || (block_3 + x_offset + y_offset == 175) || (block_3 + x_offset + y_offset == 176) || (block_3 + x_offset + y_offset == 177) || (block_3 + x_offset + y_offset == 178) || (block_3 + x_offset + y_offset == 179)) {
                move_dec = 1;
                reset();
            }
            if ((board[block_0 + x_offset + y_offset + 10] == 1) || (board[block_1 + x_offset + y_offset + 10] == 1) || (board[block_2 + x_offset + y_offset + 10] == 1) || (board[block_3 + x_offset + y_offset + 10] == 1)) {
                move_dec = 1;
                reset();
            }
        }

        if ((which_shape == 1 && which_direc == 1) || (which_shape == 1 && which_direc == 3) || (which_shape == 2 && which_direc == 1) || (which_shape == 2 && which_direc == 3) || (which_shape == 3 && which_direc == 0) || (which_shape == 3 && which_direc == 1) || (which_shape == 3 && which_direc == 2) || (which_shape == 3 && which_direc == 3) || (which_shape == 4 && which_direc == 1) || (which_shape == 4 && which_direc == 3) || (which_shape == 5 && which_direc == 1) || (which_shape == 5 && which_direc == 3) || (which_shape == 6 && which_direc == 1) || (which_shape == 6 && which_direc == 3)) {
            if ((block_3 + x_offset + y_offset == 170) || (block_3 + x_offset + y_offset == 171) || (block_3 + x_offset + y_offset == 172) || (block_3 + x_offset + y_offset == 173) || (block_3 + x_offset + y_offset == 174) || (block_3 + x_offset + y_offset == 175) || (block_3 + x_offset + y_offset == 176) || (block_3 + x_offset + y_offset == 177) || (block_3 + x_offset + y_offset == 178) || (block_3 + x_offset + y_offset == 179)) {
                move_dec = 1;
                reset();
            }
            if ((board[block_2 + x_offset + y_offset + 10] == 1) || (board[block_3 + x_offset + y_offset + 10] == 1)) {
                move_dec = 1;
                reset();
            }
        }

        if ((which_shape == 1 && which_direc == 0) || (which_shape == 1 && which_direc == 2) || (which_shape == 2 && which_direc == 0) || (which_shape == 2 && which_direc == 2) || (which_shape == 4 && which_direc == 0) || (which_shape == 4 && which_direc == 2) || (which_shape == 5 && which_direc == 0) || (which_shape == 5 && which_direc == 2) || (which_shape == 6 && which_direc == 0) || (which_shape == 6 && which_direc == 2)) {
            if ((block_3 + x_offset + y_offset == 170) || (block_3 + x_offset + y_offset == 171) || (block_3 + x_offset + y_offset == 172) || (block_3 + x_offset + y_offset == 173) || (block_3 + x_offset + y_offset == 174) || (block_3 + x_offset + y_offset == 175) || (block_3 + x_offset + y_offset == 176) || (block_3 + x_offset + y_offset == 177) || (block_3 + x_offset + y_offset == 178) || (block_3 + x_offset + y_offset == 179)) {
                move_dec = 1;
                reset();
            }
            if ((board[block_1 + x_offset + y_offset + 10] == 1) || (board[block_2 + x_offset + y_offset + 10] == 1) || (board[block_3 + x_offset + y_offset + 10] == 1)) {
                move_dec = 1;
                reset();
            }
        }

    }

    function blocksDown() {
        down_dec = 0;
        for (var i = 0; i < 18; i++) {
            if ((board[0 + i * 10] == 1) && (board[1 + i * 10] == 1) && (board[2 + i * 10] == 1) && (board[3 + i * 10] == 1) && (board[4 + i * 10] == 1) && (board[5 + i * 10] == 1) && (board[6 + i * 10] == 1) && (board[7 + i * 10] == 1) && (board[8 + i * 10] == 1) && (board[9 + i * 10] == 1)) {
                down_dec = 1;
                for(j = 0; j<10; ++j){
                    board[j + i * 10] = 0;
                    var block_x = ((j + i * 10) - Math.floor((j + i * 10) / 10) * 10) * block_size;
                    var block_y = Math.floor((j + i * 10) / 10) * block_size;
                    ctx.clearRect(block_x, block_y, block_size, block_size);
                }
                for (var n = 0; n < i; n++) {
                    board[0 + (i + accumulation) * 10] = board[0 + (i + accumulation - 1) * 10];
                    if (board[0 + (i + accumulation) * 10] == 1) {
                        ctx.fillStyle = 'rgb(0,0,225)';
                    } else {
                        ctx.fillStyle = 'rgb(0,0,0)';
                    }
                    var block_xx = ((0 + (i + accumulation) * 10) - Math.floor((0 + (i + accumulation) * 10) / 10) * 10) * block_size;
                    var block_yy = Math.floor((0 + (i + accumulation) * 10) / 10) * block_size;
                    ctx.fillRect(block_xx, block_yy, block_size, block_size);

                    board[1 + (i + accumulation) * 10] = board[1 + (i + accumulation - 1) * 10];
                    if (board[1 + (i + accumulation) * 10] == 1) {
                        ctx.fillStyle = 'rgb(0,0,225)';
                    } else {
                        ctx.fillStyle = 'rgb(0,0,0)';
                    }
                    block_xx = ((1 + (i + accumulation) * 10) - Math.floor((1 + (i + accumulation) * 10) / 10) * 10) * block_size;
                    block_yy = Math.floor((1 + (i + accumulation) * 10) / 10) * block_size;
                    ctx.fillRect(block_xx, block_yy, block_size, block_size);

                    board[2 + (i + accumulation) * 10] = board[2 + (i + accumulation - 1) * 10];
                    if (board[2 + (i + accumulation) * 10] == 1) {
                        ctx.fillStyle = 'rgb(0,0,225)';
                    } else {
                        ctx.fillStyle = 'rgb(0,0,0)';
                    }
                    block_xx = ((2 + (i + accumulation) * 10) - Math.floor((2 + (i + accumulation) * 10) / 10) * 10) * block_size;
                    block_yy = Math.floor((2 + (i + accumulation) * 10) / 10) * block_size;
                    ctx.fillRect(block_xx, block_yy, block_size, block_size);

                    board[3 + (i + accumulation) * 10] = board[3 + (i + accumulation - 1) * 10];
                    if (board[3 + (i + accumulation) * 10] == 1) {
                        ctx.fillStyle = 'rgb(0,0,225)';
                    } else {
                        ctx.fillStyle = 'rgb(0,0,0)';
                    }
                    block_xx = ((3 + (i + accumulation) * 10) - Math.floor((3 + (i + accumulation) * 10) / 10) * 10) * block_size;
                    block_yy = Math.floor((3 + (i + accumulation) * 10) / 10) * block_size;
                    ctx.fillRect(block_xx, block_yy, block_size, block_size);

                    board[4 + (i + accumulation) * 10] = board[4 + (i + accumulation - 1) * 10];
                    if (board[4 + (i + accumulation) * 10] == 1) {
                        ctx.fillStyle = 'rgb(0,0,225)';
                    } else {
                        ctx.fillStyle = 'rgb(0,0,0)';
                    }
                    block_xx = ((4 + (i + accumulation) * 10) - Math.floor((4 + (i + accumulation) * 10) / 10) * 10) * block_size;
                    block_yy = Math.floor((4 + (i + accumulation) * 10) / 10) * block_size;
                    ctx.fillRect(block_xx, block_yy, block_size, block_size);

                    board[5 + (i + accumulation) * 10] = board[5 + (i + accumulation - 1) * 10];
                    if (board[5 + (i + accumulation) * 10] == 1) {
                        ctx.fillStyle = 'rgb(0,0,225)';
                    } else {
                        ctx.fillStyle = 'rgb(0,0,0)';
                    }
                    block_xx = ((5 + (i + accumulation) * 10) - Math.floor((5 + (i + accumulation) * 10) / 10) * 10) * block_size;
                    block_yy = Math.floor((5 + (i + accumulation) * 10) / 10) * block_size;
                    ctx.fillRect(block_xx, block_yy, block_size, block_size);

                    board[6 + (i + accumulation) * 10] = board[6 + (i + accumulation - 1) * 10];
                    if (board[6 + (i + accumulation) * 10] == 1) {
                        ctx.fillStyle = 'rgb(0,0,225)';
                    } else {
                        ctx.fillStyle = 'rgb(0,0,0)';
                    }
                    block_xx = ((6 + (i + accumulation) * 10) - Math.floor((6 + (i + accumulation) * 10) / 10) * 10) * block_size;
                    block_yy = Math.floor((6 + (i + accumulation) * 10) / 10) * block_size;
                    ctx.fillRect(block_xx, block_yy, block_size, block_size);

                    board[7 + (i + accumulation) * 10] = board[7 + (i + accumulation - 1) * 10];
                    if (board[7 + (i + accumulation) * 10] == 1) {
                        ctx.fillStyle = 'rgb(0,0,225)';
                    } else {
                        ctx.fillStyle = 'rgb(0,0,0)';
                    }
                    block_xx = ((7 + (i + accumulation) * 10) - Math.floor((7 + (i + accumulation) * 10) / 10) * 10) * block_size;
                    block_yy = Math.floor((7 + (i + accumulation) * 10) / 10) * block_size;
                    ctx.fillRect(block_xx, block_yy, block_size, block_size);

                    board[8 + (i + accumulation) * 10] = board[8 + (i + accumulation - 1) * 10];
                    if (board[8 + (i + accumulation) * 10] == 1) {
                        ctx.fillStyle = 'rgb(0,0,225)';
                    } else {
                        ctx.fillStyle = 'rgb(0,0,0)';
                    }
                    block_xx = ((8 + (i + accumulation) * 10) - Math.floor((8 + (i + accumulation) * 10) / 10) * 10) * block_size;
                    block_yy = Math.floor((8 + (i + accumulation) * 10) / 10) * block_size;
                    ctx.fillRect(block_xx, block_yy, block_size, block_size);

                    board[9 + (i + accumulation) * 10] = board[9 + (i + accumulation - 1) * 10];
                    if (board[9 + (i + accumulation) * 10] == 1) {
                        ctx.fillStyle = 'rgb(0,0,225)';
                    } else {
                        ctx.fillStyle = 'rgb(0,0,0)';
                    }
                    block_xx = ((9 + (i + accumulation) * 10) - Math.floor((9 + (i + accumulation) * 10) / 10) * 10) * block_size;
                    block_yy = Math.floor((9 + (i + accumulation) * 10) / 10) * block_size;
                    ctx.fillRect(block_xx, block_yy, block_size, block_size);

                    accumulation -= 1;
                }
                reset();
            }
        }
    }

    function blocksMove() {
        setTimeout(blocksMove, 1000 / break_persec);
        blocksDown();
        if (down_dec == 1)
            return;
        clearBlocks(block_0_backup + x_offset_lv2 + y_offset_lv2 - x_direc_lv2 - y_direc_lv2, block_1_backup + x_offset_lv2 + y_offset_lv2 - x_direc_lv2 - y_direc_lv2, block_2_backup + x_offset_lv2 + y_offset_lv2 - x_direc_lv2 - y_direc_lv2, block_3_backup + x_offset_lv2 + y_offset_lv2 - x_direc_lv2 - y_direc_lv2);
        creatBlocks(block_0 + x_offset + y_offset, block_1 + x_offset + y_offset, block_2 + x_offset + y_offset, block_3 + x_offset + y_offset);
        drawBlocks(block_0 + x_offset + y_offset, block_1 + x_offset + y_offset, block_2 + x_offset + y_offset, block_3 + x_offset + y_offset);
        movedeDetection();
        if (move_dec == 1)
            return;
        x_offset += x_direc;
        y_offset += y_direc;
        x_offset_lv2 = x_offset;
        y_offset_lv2 = y_offset;
        x_direc_lv2 = x_direc;
        y_direc_lv2 = y_direc;
        block_0_backup = block_0;
        block_1_backup = block_1;
        block_2_backup = block_2;
        block_3_backup = block_3;
    }
    blocksMove();

    document.body.onkeydown = function (op) {
        switch (op.key) {
            case "w":
                key_dec += 1;
                which_direc = key_dec - Math.floor(key_dec / 4) * 4;
                block_0 = blocks[which_shape][which_direc][0];
                block_1 = blocks[which_shape][which_direc][1];
                block_2 = blocks[which_shape][which_direc][2];
                block_3 = blocks[which_shape][which_direc][3];
                break;
            case "s":
                break_persec = 5;
                break;
            case "a":
                if(block_x_1 != 0 && block_x_2 != 0 && block_x_3 != 0 && block_x_4 != 0){
                x_offset -= x_direc;
                x_direc = -1;
                x_offset += x_direc;
                }
                break;
            case "d":
                if(block_x_1 != 270 && block_x_2 != 270 && block_x_3 != 270 && block_x_4 != 270){                
                x_offset -= x_direc;
                x_direc = 1;
                x_offset += x_direc;
                }
                break;
        }
    }

    document.body.onkeyup = function (op) {
        switch (op.key) {
            case"s":
                break_persec = 2;
                break;
            case"a":
                x_direc = 0;
            case"d":
                x_direc = 0;
        }
    }
}