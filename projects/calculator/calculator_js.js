window.onload = function () {
    //JS_var
    var monitor = document.getElementById('monitor');

    var bplu = document.getElementById('bplu');
    var bmi = document.getElementById('bmi');
    var bmul = document.getElementById('bmul');
    var bex = document.getElementById('bex');
    var bclr = document.getElementById('bclr');
    var beql = document.getElementById('beql');

    var operand1 = 0;
    var operand2 = null;
    var cur_op = null;
    var eq_operand2 = null;
    var eq_op = null;

    function updateDisplay(x) {
        monitor.innerText = x;
    }

    //reset
    bclr.onclick = function () {
        operand1 = 0;
        operand2 = null;
        cur_op = null;
        eq_operand2 = null;
        eq_op = null;
        updateDisplay("0");
    }

    function onDigit(d) {
        if (cur_op != null) {
            if (operand2 == null)
                operand2 = 0;
            operand2 = operand2 * 10 + d;
            updateDisplay(operand2);
        } else {
            // save to operand1
            if (eq_operand2 != null) {
                operand1 = d;
            } else {
                operand1 = operand1 * 10 + d;
            }
            updateDisplay(operand1);
        }
        eq_operand2 = null;
        eq_op = null;
    }

    //BUTTON_INPUT

    function onClick(){
       onDigit(parseInt(this.getAttribute("value")));
    }

    for(i = 0; i<10; i++){
        document.getElementById("b" + i).onclick = onClick;
    }

    //BUTTON_CULCULATE
    function calc(x, y, op) {
        var res;
        switch (op) {
            case '+': // if (op=='+')
                res = x + y;
                break;
            case '-':
                res = x - y;
                break;
            case '*':
                res = x * y;
                break;
            case '/':
                res = x / y;
                break;
        }
        return res;
    }

    function onOp(op) {
        if (cur_op != null && operand2 != null) {
            var res = calc(operand1, operand2, cur_op);
            updateDisplay(res);
            operand1 = res;
        }
        cur_op = op;
        operand2 = null;
        eq_operand2 = null;
        eq_op = null;
    }

    bplu.onclick = function () {
        onOp("+");
    }
    bmi.onclick = function () {
        onOp("-");
    }
    bmul.onclick = function () {
        onOp("*");
    }
    bex.onclick = function () {
        onOp("/");
    }

    beql.onclick = function () {
        if (cur_op != null) {
            eq_op = cur_op;
        }

        if (eq_operand2 == null) {
            if (operand2 == null) {
                eq_operand2 = operand1;
            } else {
                eq_operand2 = operand2;
            }
        }

        if (eq_op != null) {
            var res = calc(operand1, eq_operand2, eq_op);
            updateDisplay(res);
            operand1 = res;
        }
        cur_op = null;
        operand2 = null;
    }
}