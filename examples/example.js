angular.module('example.calendar', ['daterangepicker'])

  .controller('calendarCtrl', function($scope) {
    $scope.dateRanges = []
    $scope.newDateRange = function(range) {
      console.log(range);
    }
    $scope.test = 'test'
  })
