
var app = angular.module('rkApp', []);

app.controller('TodoListController', ['$scope', function($scope) {

    $scope.points = [[-3, 70],[1, 21],[-7, 110],[5, -35]];

    $scope.arrayA = [];
    $scope.arrayB = [];
    
    $scope.resultString = [];
    $scope.resultError = [];

    $scope.finished = false;

    //  evaluate the input equation

    $scope.runEquation = function(x, y){
        let varScope = {
            x: parseFloat(x),
            y: parseFloat(y),
        } 

        let eqTotal = math.eval($scope.equation, varScope);
        return eqTotal;
    }
    // principal function with the main loop

    $scope.start = function(){

        $scope.finished = false;
        $scope.resultString = [];
        $scope.resultError = [];

        for (let cont = 1; cont < 4; cont++) {

            for (let i = $scope.points.length - 1; i >= 0; i--) {
                for (let j = $scope.points[i].length - 1; j >= 0; j--) {
                    $scope.points[i][j] = parseFloat($scope.points[i][j]);
                }
            }

            $scope.defineCoeMatrix($scope.points, cont);

            console.log("$scope.arrayA");
            console.log($scope.arrayA);
            console.log("$scope.arrayB");
            console.log($scope.arrayB);

            let matrixA = math.matrix($scope.arrayA);
            let matrixB = math.matrix($scope.arrayB);

            let matrixAt = math.transpose(matrixA);
            let leftResult = math.multiply(matrixAt, matrixA);
            let rightResult = math.multiply(matrixAt, matrixB);
            let solveA = math.lusolve(leftResult, rightResult);

            console.log("matrixA");
            console.log(matrixA);
            console.log("matrixB");
            console.log(matrixB);
            console.log("leftResult");
            console.log(leftResult);
            console.log("rightResult");
            console.log(rightResult);
            console.log("solveA");
            console.log(solveA);

            let stringEquation = "";

            if(cont === 1)
                stringEquation = "y = " + Math.round10(solveA._data[0], -6)+ "x + " + Math.round10(solveA._data[1], -6);
            else if(cont === 2)
                stringEquation = "y = (" + Math.round10(solveA._data[0], -6)+ ")x^2 + " + Math.round10(solveA._data[1], -6) + "x + "+ Math.round10(solveA._data[2], -6);
            else if(cont === 3)
                stringEquation = "y = (" + Math.round10(solveA._data[0], -6)+ ")x^3 + " + "(" + Math.round10(solveA._data[1], -6)+ ")x^2 + " + Math.round10(solveA._data[2], -6) + "x + "+ Math.round10(solveA._data[3], -6);

            $scope.plot(cont, stringEquation);

            //error

            let errors = math.subtract($scope.arrayB, math.multiply($scope.arrayA, solveA));
            let error = 0;

            for (let index = 0; index < errors._size[0]; index++)
                error += math.pow(errors._data[index][0], 2);

            error = math.sqrt(error);

            $scope.resultString.push(stringEquation);
            $scope.resultError.push(Math.round10(error, -6));

        }

        $scope.finished = true;
    };

    $scope.defineCoeMatrix = function(points, functionType){

        $scope.arrayA = [];
        $scope.arrayB = [];

        if(functionType === 1){
            for (let i = 0; i < points.length; i++) {
                $scope.arrayA.push( [points[i][0], 1] );
            }
        }else if(functionType === 2){
            for (let i = 0; i < points.length; i++) {
                $scope.arrayA.push( [math.pow(points[i][0], 2), points[i][0], 1] );
            }
        }else if(functionType === 3){
            for (let i = 0; i < points.length; i++) {
                $scope.arrayA.push([math.pow(points[i][0], 3), math.pow(points[i][0], 2), points[i][0], 1]);
            }
        }

        for (let i = 0; i < points.length; i++) {
            $scope.arrayB.push([$scope.points[i][1]]);
        }
    }

    $scope.plot = function(functionType, resultString){ 

        var pointsDataA = {
            points: $scope.points,
            fnType: 'points',
            graphType: 'scatter'
          };

        var functionData = {
            fn: resultString
          };

        functionPlot({
          target: "#plotType"+functionType,
          data: [pointsDataA, functionData],
          grid: true
        });
    }



    $scope.addPoint = function(x, y){
        $scope.points.push([0,0]);
    }

  }]);


/**
     * Decimal adjustment of a number.
     *
     * @param   {String}    type    The type of adjustment.
     * @param   {Number}    value   The number.
     * @param   {Integer}   exp     The exponent (the 10 logarithm of the adjustment base).
     * @returns {Number}            The adjusted value.
     */
    function decimalAdjust(type, value, exp) {
        // If the exp is undefined or zero...
        if (typeof exp === 'undefined' || +exp === 0) {
            return Math[type](value);
        }
        value = +value;
        exp = +exp;
        // If the value is not a number or the exp is not an integer...
        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return NaN;
        }
        // Shift
        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
        // Shift back
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }

    // Decimal round
    if (!Math.round10) {
        Math.round10 = function(value, exp) {
            return decimalAdjust('round', value, exp);
        };
    }
    // Decimal floor
    if (!Math.floor10) {
        Math.floor10 = function(value, exp) {
            return decimalAdjust('floor', value, exp);
        };
    }
    // Decimal ceil
    if (!Math.ceil10) {
        Math.ceil10 = function(value, exp) {
            return decimalAdjust('ceil', value, exp);
        };
    }