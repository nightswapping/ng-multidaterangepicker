angular.module('example.calendar', ['daterangepicker'])
  .run(function($templateCache) {
    $templateCache.put('calendar/daterange_picker.html',
      '<div class="daterangepicker">' +
        '<div class="daterangepicker-header">' +
          '<div class="daterangepicker-controls">' +
            '<div class="daterangepicker-month">' +
              '<a href="" ng-click="changeMonth(-1)" ng-show="allowPrevMonth" translate="translate"' +
                 'lass="daterangepicker-prevmonth">' +
                '<i class="icon-chevron-left"></i>' +
              '</a>' +
              '<span>{{getI18nMonth(currentDate)}}</span>' +
              '<a href="" ng-click="changeMonth(1)" ng-show="allowNextMonth" translate="translate"' +
                 'lass="daterangepicker-nextmonth">' +
                '<i class="icon-chevron-right"></i>' +
              '</a>' +
            '</div>' +
            '<div class="daterangepicker-year">' +
              '<a href="" ng-click="changeMonth(-12)" ng-show="allowPrevMonth"' +
                 'lass="daterangepicker-prevmonth">' +
                '<i class="icon-chevron-left"></i>' +
              '</a>' +
              '<span>{{currentDate | date:"yyyy"}}</span>' +
              '<a href="" ng-click="changeMonth(12)" ng-show="allowNextMonth" class="daterangepicker-nextyear">' +
                '<i class="icon-chevron-right"></i>' +
              '</a>' +
            '</div>' +
'' +
          '</div>' +
        '</div>' +
        '<div class="daterangepicker-body">' +
          '<div class="daterangepicker-main">' +
            '<ul class="daterangepicker-cell">' +
              '<li ng-repeat="dayName in dayNames" class="daterangepicker-head">{{dayName}}</li>' +
            '</ul>' +
            '<ul class="daterangepicker-cell">' +
              '<li ng-class="getClass(date)" ng-repeat="date in dates" ng-click="setDate(date)"' +
                  'g-mouseenter="mouseEnter(date)" ng-mouseleave="mouseLeave(date)"' +
                  'tartToday="true">' +
                '{{date | date:"d"}}' +
              '</li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
      '</div>'
    )
  })
  .controller('calendarCtrl', function($scope) {
    $scope.dateRanges = []
    $scope.newDateRange = function(range) {
      console.log(range);
    }
    $scope.test = 'test'
  })
