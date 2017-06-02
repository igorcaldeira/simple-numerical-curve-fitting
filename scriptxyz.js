
var app = angular.module('rkApp', []);

app.controller('TodoListController', ['$scope', function($scope) {

    $scope.points = [[0,0],[0.785391, 0.707107],[1.570796, 1],2.356194, 0.707107],[3.141593,0]];

    $scope.arrayA = [];
    $scope.arrayB = [];

    $scope.n = 5;

    $scope.finished = false;

    //  evaluate the input equation

    $scope.runEquation = function(x, y){
        let eqTotal = math.eval($scope.equation, varScope);
        return eqTotal;
    }
    // principal function with the main loop

    $scope.start = function(){

        $scope.finished = false;

        // define c. matrix (4 x 4)

        $scope.arrayA = [];

        for (let i = 0; i < points.length; i++) {
            $scope.arrayA.push( [ math.pow(points[i][0], 3), math.pow(points[i][0], 2), points[i][0]], 1 );
        }

        // define results array ( 4 x 1)

        $scope.arrayB = [];

        for (let i = 0; i < points.length; i++) {
            $scope.arrayB[i][1];
        }

        // find H and it's points

        let h = undefined;
        let xarray = [];

        for (let cont=0; cont < $scope.n - 1; cont++) {

            h = (($scope.arrayA[cont+1][0] - $scope.arrayA[i][0]) / 5);

            xarray.push((h*1) + $scope.arrayA[i][0]);
            xarray.push((h*2) + $scope.arrayA[i][0]);
            xarray.push((h*3) + $scope.arrayA[i][0]);
            xarray.push((h*4) + $scope.arrayA[i][0]);
        }











        $scope.resultString = [];
        $scope.resultError = [];
        let varScope = {
            x: parseFloat(x),
            y: parseFloat(y),
        } 

        $scope.defineCoeMatrix($scope.points, cont);

        let matrixA = math.matrix($scope.arrayA);
        let matrixB = math.matrix($scope.arrayB);

        let matrixAt = math.transpose(matrixA);


        let leftResult = math.multiply(matrixAt, matrixA);
        let rightResult = math.multiply(matrixAt, matrixB);
        let solveA = math.lusolve(leftResult, rightResult);

        let stringEquation = "";

        stringEquation = "y = (" + solveA._data[0]+ "x)^3 + " + "(" + solveA._data[1]+ "x)^2 + " + solveA._data[2] + "x + "+ solveA._data[3];

        console.log(solveA);            

        $scope.finished = true;
    };

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
