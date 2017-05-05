
var app = angular.module('rkApp', []);

app.controller('TodoListController', ['$scope', function($scope) {

    $scope.matrixA = math.matrix([[-3, 1],[1, 1],[-7, 1],[5, 1]]);
    $scope.matrixB = math.matrix([[70],[21],[110],[-35]]);
    $scope.resultString = "???";

    //  evaluate the input equation

    $scope.runEquation = function(x, y){
        var varScope = {
            x: parseFloat(x),
            y: parseFloat(y),
        }

        var eqTotal = math.eval($scope.equation, varScope);
        return eqTotal;
    }
    // principal function with the main loop

    $scope.start = function(){

        // A * At * [m, b] = A * B

        console.log($scope.matrixA);

        var matrixAt = math.transpose($scope.matrixA);

        console.log(matrixAt);

        var leftResult = math.multiply(matrixAt, $scope.matrixA);

        console.log(leftResult);

        var rightResult = math.multiply(matrixAt, $scope.matrixB);

        console.log(rightResult);

        var solveA = math.lusolve(leftResult, rightResult);

        $scope.resultString = "y = " + solveA._data[0]+ "x + " + solveA._data[1];

    };

  }]);
