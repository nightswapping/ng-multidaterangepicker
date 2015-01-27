describe('daterangepicker', function () {
  'use strict';

  var element,
      $scope,
      $compile,
      utils = null,
      doc = null,
      html = '<div daterangepicker date-ranges="dateRanges" default-date="defaultDate" min-date="minDate"' +
             'max-date="maxDate" week-starts-on="weekStartsOn" on-date-click="onNewRange"' +
             'start-today="false" no-extra-rows template="template/calendar.tpl.html"></div>';

  beforeEach(module("daterangepicker"));

  beforeEach(inject(function($templateCache) {
    var directiveTemplate =
      '<div class="daterangepicker">' +
        '<div class="daterangepicker-header">' +
          '<div class="daterangepicker-controls">' +
            '<div class="daterangepicker-month">' +
              '<a href="" ng-click="changeMonth(-1)" ng-show="allowPrevMonth" translate="translate"' +
                 'class="daterangepicker-prevmonth">' +
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
                  'ng-mouseenter="mouseEnter(date)" ng-mouseleave="mouseLeave(date)"' +
                  'startToday="true">' +
                '{{date | date:"d"}}' +
              '</li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
      '</div>'
    $templateCache.put('template/calendar.tpl.html', directiveTemplate);
  }));

  beforeEach(function() {
    inject(function($document, $rootScope, _$compile_, _daterangepickerUtils_){
      $scope   = $rootScope.$new();
      $compile = _$compile_;
      utils    = _daterangepickerUtils_;
      angular.element($document[0].querySelectorAll('body')).append(html);
      doc      = $document[0];
    });
  });

  function compile() {
    element = angular.element(doc);
    $compile(element)($scope);
    $scope.$digest();
  }

  describe('Model binding', function() {

    beforeEach(function() {
      $scope.minDate = '2014-05-17';
      //$scope.maxDate = '2014-06-01';
      $scope.defaultDate = '2014-05-19';
      $scope.date = [ { start: '2014-05-17', class: 'available' } ];
      //$scope.onNewRange = function() {
        //return [ { start: '2014-05-17', class: 'available' } ]; }
      compile();
    });

    describe('Disabled dates', function() {
      it("sets past dates as disabled", function() {
        // first displayed day in April, 27th - all dates should be disabled
        // until May, 17th which gives 20 days
        expect($('li.daterangepicker-disabled').length).to.equal(20);
      });

      it("disables the date from dateRanges", function() {
        $scope.dateRanges = [{ start_date: '2014-05-30', end_date: '2014-05-31', disabled: 'true' }];
        compile()
        expect($('li.daterangepicker-disabled:contains(31)').length).to.equal(2);
      });
    })

    describe('Class addition', function() {

      beforeEach(function() {
        $scope.dateRanges = [{ start_date: '2014-05-30', end_date: '2014-05-31', css_classes: 'foobar'}];
        compile();
      })

      it("sets 2014-05-17 as active", function() {
        expect($('li.daterangepicker-enabled').first().text()).to.equal('17')
      });

      it("adds the 'foobar' class 2014-05-17", function() {
        expect($('li.foobar').first().text()).to.equal('30')
      });
    });
  });
});
