---
---
    
$("#converter").submit(function () {
    return false;
});

var converterMsg = $("#converter-msg");
var pDistance = $("input[name=distance]");
var pAngle = $("input[name=angle]");
var cXComp = $("input[name=x-comp]");
var cYComp = $("input[name=y-comp]");

$("#pToC").click(function () {
    converterMsg.text("");

    var polarR = pDistance.val();
    var polarAngle = pAngle.val();

    if (polarR === "" || polarAngle === "") {
        converterMsg.text("The fields cannot be empty");
        return false;
    }

    cXComp.val(math.eval(polarR + "* cos(" + polarAngle + ")"));
    cYComp.val(math.eval(polarR + "* sin(" + polarAngle + ")"));
});

$("#cToP").click(function () {
    converterMsg.text("");

    var xVal = cXComp.val();
    var yVal = cYComp.val();

    if (xVal === "" || yVal === "") {
        converterMsg.text("The fields cannot be empty");
        return false;
    }

    pDistance.val(math.eval("sqrt(" + xVal + "^2 + " + yVal + "^2)"));
    pAngle.val(math.eval("atan2(" + yVal + "," + xVal + ")"));
});

$("#conv-clear").click(function () {
    //Cartesian
    cXComp.val("");
    cYComp.val("");

    //Polar
    pDistance.val("");
    pAngle.val("");

    converterMsg.text("");
});

// EXAMPLES
$("#conv-ex1").click(function () {
    $("#conv-clear").trigger('click');

    pDistance.val("3");
    pAngle.val("3*pi/2");

    $("#pToC").trigger('click');
});

$("#conv-ex2").click(function () {
    $("#conv-clear").trigger('click');

    cXComp.val("-5");
    cYComp.val("10");

    $("#cToP").trigger('click');
});

$("#conv-ex3").click(function () {
    $("#conv-clear").trigger('click');

    pDistance.val("20");
    pAngle.val("-pi");

    $("#pToC").trigger('click');
});

var canvas = document.getElementById('plot-area');
var ctx = canvas.getContext('2d');
var cWidth = $(canvas).width();
var cHeight = $(canvas).height();
var plotMsg = $("#plot-msg");

$("#plot-btn").click(function () {
    plotMsg.text("");

    ctx.clearRect(0, 0, cWidth, cHeight);

    var variables = $("#plot-var").val();
    var scope = {};
    if (variables !== "") {
        variables.split("\n").forEach(function (element, index, array) {
            var parts = element.split("=");
            scope[parts[0].trim()] = parts[1].trim();
        });
    }

    var xMin = math.eval($("input[name=xMin]").val());
    var xMax = math.eval($("input[name=xMax]").val());
    var yMin = math.eval($("input[name=yMin]").val());
    var yMax = math.eval($("input[name=yMax]").val());
    var tMin = math.eval($("input[name=tMin]").val());
    var tMax = math.eval($("input[name=tMax]").val());
    var tDelta = math.eval($("input[name=tDelta]").val());

    var xRange = xMax - xMin;
    var yRange = yMax - yMin;
    var tRange = tMax - tMin;

    if (xRange < 0 || yRange < 0 || tRange < 0) {
        plotMsg.text("x range, y range and t range cannot be < 0");
        return false;
    }

    if (tDelta < 0.001) {
        plotMsg.text("t delta too small");
        return false;
    }

    ctx.strokeStyle = 'blue';
    var plotted = false;
    $("#plot-eqn").val().split("\n").forEach(function (eqn, index, array) {
        if (!eqn.startsWith("r = ") && !eqn.startsWith("r =") && !eqn.startsWith("r= ") && !eqn.startsWith("r=")) {
            return;
        }
        eqn = eqn.split("=")[1].trim();

        plotted = true;
        ctx.beginPath();

        scope["t"] = tMin;
        var r = math.eval(eqn, scope);
        var x = r * math.cos(tMin);
        var y = r * math.sin(tMin);

        var xConv = ((x - xMin) / xRange) * cWidth;
        var yConv = ((yMax - y) / yRange) * cHeight;

        ctx.moveTo(xConv, yConv);

        for (var i = tMin; i < tMax; i += tDelta) {
            scope.t = i;
            var r = math.eval(eqn, scope);
            var x = r * math.cos(i);
            var y = r * math.sin(i);

            var xConv = ((x - xMin) / xRange) * cWidth;
            var yConv = ((yMax - y) / yRange) * cHeight;

            ctx.lineTo(xConv, yConv);
        }

        ctx.stroke();
    });

    if (plotted) {
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        var xCenter = ((0 - xMin) / xRange) * cWidth;
        var yCenter = (yMax / yRange) * cHeight;
        ctx.moveTo(0, yCenter);
        ctx.lineTo(cWidth, yCenter);
        ctx.moveTo(xCenter, 0);
        ctx.lineTo(xCenter, cHeight);
        ctx.stroke();
    }
});

$("#plot-clear").click(function () {
    ctx.clearRect(0, 0, cWidth, cHeight);
    plotMsg.text("");
});

// EXAMPLES
$("#plot-ex1").click(function () {
    $("#plot-clear").trigger('click');

    $("#plot-eqn").val("r = 10cos(t)");
    $("#plot-var").val("");

    $("#plot-btn").trigger('click');
});

$("#plot-ex2").click(function () {
    $("#plot-clear").trigger('click');

    $("#plot-eqn").val("r = A*e^t*sin(t)");
    $("#plot-var").val("A = 3");

    $("#plot-btn").trigger('click');
});

$("#plot-ex3").click(function () {
    $("#plot-clear").trigger('click');

    $("#plot-eqn").val("r = e^(-cos(t/A))-B");
    $("#plot-var").val("A = 2\nB = 10");

    $("#plot-btn").trigger('click');
});

$("#plot-ex4").click(function () {
    $("#plot-clear").trigger('click');

    $("#plot-eqn").val("r = t + cos(t)\nr = sin(t)^t");
    $("#plot-var").val("");

    $("#plot-btn").trigger('click');
});