
var app = angular.module('rkApp', []);

app.controller('TodoListController', ['$scope', function($scope) {

    $scope.points = [[-3, 70],[1, 21],[-7, 110],[5, -35]];

    $scope.arrayA = [];
    $scope.arrayB = [[$scope.points[0][1]],[$scope.points[1][1]],[$scope.points[2][1]],[$scope.points[3][1]]];
    
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

            $scope.defineCoeMatrix($scope.points, cont);

            let matrixA = math.matrix($scope.arrayA);
            let matrixB = math.matrix($scope.arrayB);

            let matrixAt = math.transpose(matrixA);
            let leftResult = math.multiply(matrixAt, matrixA);
            let rightResult = math.multiply(matrixAt, matrixB);
            let solveA = math.lusolve(leftResult, rightResult);

            let stringEquation = "";

            if(cont === 1)
                stringEquation = "y = " + solveA._data[0]+ "x + " + solveA._data[1];
            else if(cont === 2)
                stringEquation = "y = (" + solveA._data[0]+ "x)^2 + " + solveA._data[1] + "x + "+ solveA._data[2];
            else if(cont === 3)
                stringEquation = "y = (" + solveA._data[0]+ "x)^3 + " + "(" + solveA._data[1]+ "x)^2 + " + solveA._data[2] + "x + "+ solveA._data[3];

            $scope.plot(cont, stringEquation);

            //error

            let errors = math.subtract($scope.arrayB, math.multiply($scope.arrayA, solveA));
            let error = 0;

            for (let index = 0; index < errors._size[0]; index++)
                error += math.pow(errors._data[index][0], 2);

            error = math.sqrt(error);

            $scope.resultString.push(stringEquation);
            $scope.resultError.push(error);

        }

        $scope.finished = true;
    };

    $scope.defineCoeMatrix = function(points, functionType){

        $scope.arrayA = [];

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

  }]);