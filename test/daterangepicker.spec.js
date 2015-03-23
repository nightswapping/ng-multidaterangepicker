describe('daterangepicker', function () {
  'use strict';

  var element,
      $scope,
      $compile,
      utils = null,
      doc = null,
      activeRange = null,
      spy = 0,
      html = '<div daterangepicker date-ranges="dateRanges" default-date="defaultDate" min-date="minDate"' +
             'max-date="maxDate" week-starts-on="weekStartsOn" on-date-click="onDateClick"' +
             'start-today="false" no-extra-rows template="template/calendar.tpl.html"></div>';

  beforeEach(module("daterangepicker"));

  beforeEach(inject(function($templateCache) {
    var directiveTemplate =
      '<div class="daterangepicker">' +
        '<div class="daterangepicker-header">' +
          '<div class="daterangepicker-controls">' +
            '<div class="daterangepicker-month">' +
              '<a href="" ng-click="changeMonth(-1)" ng-show="allowPrevMonth" translate="translate"' +
                 ' class="daterangepicker-prevmonth">' +
                '<i class="icon-chevron-left"></i>' +
              '</a>' +
              '<span>{{getI18nMonth(currentDate)}}</span>' +
              '<a href="" ng-click="changeMonth(1)" ng-show="allowNextMonth" translate="translate"' +
                 ' class="daterangepicker-nextmonth">' +
                '<i class="icon-chevron-right"></i>' +
              '</a>' +
            '</div>' +
            '<div class="daterangepicker-year">' +
              '<a href="" ng-click="changeMonth(-12)" ng-show="allowPrevYear"' +
                 ' class="daterangepicker-prevyear">' +
                '<i class="icon-chevron-left"></i>' +
              '</a>' +
              '<span>{{currentDate | date:"yyyy"}}</span>' +
              '<a href="" ng-click="changeMonth(12)" ng-show="allowNextYear"' +
                ' class="daterangepicker-nextyear">' +
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
    inject(function($document, $rootScope, _$compile_, _daterangepickerUtils_, _activeRange_){
      $scope      = $rootScope.$new();
      $compile    = _$compile_;
      utils       = _daterangepickerUtils_;
      activeRange = _activeRange_;
      angular.element($document[0].querySelectorAll('body')).append(html);
      doc         = $document[0];
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
      $scope.maxDate = '2015-05-17';
      $scope.defaultDate = '2014-05-19';
      $scope.date = [ { start: '2014-05-17', class: 'available' } ];
      $scope.onDateClick = function() {
        spy++
        return [ { start: '2014-05-17', class: 'available' } ]; }
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

      it("disables previous month/year, allows next month/year links", function() {
        expect($('.daterangepicker-prevmonth').hasClass('ng-hide')).to.equal(true);
        expect($('.daterangepicker-nextmonth').hasClass('ng-hide')).to.equal(false);
        expect($('.daterangepicker-prevyear').hasClass('ng-hide')).to.equal(true);
        expect($('.daterangepicker-nextyear').hasClass('ng-hide')).to.equal(false);
      });

      it("disables previous/next month/year links", function() {
        $scope.minDate = '2014-05-01';
        $scope.maxDate = '2014-05-30';
        compile();
        expect($('.daterangepicker-prevmonth').hasClass('ng-hide')).to.equal(true);
        expect($('.daterangepicker-nextmonth').hasClass('ng-hide')).to.equal(true);
        expect($('.daterangepicker-prevyear').hasClass('ng-hide')).to.equal(true);
        expect($('.daterangepicker-nextyear').hasClass('ng-hide')).to.equal(true);
      });

      it("allows previous/next month, disables previous/next year links lowest point", function() {
        $scope.minDate = '2014-04-30';
        $scope.maxDate = '2014-06-01';
        compile();
        expect($('.daterangepicker-prevmonth').hasClass('ng-hide')).to.equal(false);
        expect($('.daterangepicker-nextmonth').hasClass('ng-hide')).to.equal(false);
        expect($('.daterangepicker-prevyear').hasClass('ng-hide')).to.equal(true);
        expect($('.daterangepicker-nextyear').hasClass('ng-hide')).to.equal(true);
      });

      it("allows previous/next month, disables previous/next year links highest point", function() {
        $scope.minDate = '2013-06-01';
        $scope.maxDate = '2015-04-30';
        compile();
        expect($('.daterangepicker-prevmonth').hasClass('ng-hide')).to.equal(false);
        expect($('.daterangepicker-nextmonth').hasClass('ng-hide')).to.equal(false);
        expect($('.daterangepicker-prevyear').hasClass('ng-hide')).to.equal(true);
        expect($('.daterangepicker-nextyear').hasClass('ng-hide')).to.equal(true);
      });

      it("allows previous/next month and previous/next year links", function() {
        $scope.minDate = '2013-05-31';
        $scope.maxDate = '2015-05-01';
        compile();
        expect($('.daterangepicker-prevmonth').hasClass('ng-hide')).to.equal(false);
        expect($('.daterangepicker-nextmonth').hasClass('ng-hide')).to.equal(false);
        expect($('.daterangepicker-prevyear').hasClass('ng-hide')).to.equal(false);
        expect($('.daterangepicker-nextyear').hasClass('ng-hide')).to.equal(false);
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

    describe('calls onDateClick on clicks', function() {
      beforeEach(function() {
        spy = 0;
        compile();
      })

      it("should call onDateClick when an enabled date is clicked", function() {
        browserTrigger($('li.daterangepicker-enabled').first(), 'click');
        expect(spy).to.equal(1)
      });

      it("should call onDateClick at every click", function() {
        browserTrigger($('li.daterangepicker-enabled').first(), 'click');
        browserTrigger($('li.daterangepicker-enabled').first(), 'click');
        browserTrigger($('li.daterangepicker-enabled').first(), 'click');
        browserTrigger($('li.daterangepicker-enabled').first(), 'click');
        browserTrigger($('li.daterangepicker-enabled').first(), 'click');
        expect(spy).to.equal(5)
      });

      it("shouldn't call onDateClick when a disabled date is clicked", function() {
        browserTrigger($('li.daterangepicker-disabled').first(), 'click');
        expect(spy).to.equal(0)
      });
    });

    describe('onDateClick', function() {
      var firstDate,
        secondDate;
      beforeEach(function() {
        spy = 0;
        $scope.onDateClick = function(activeRange) {
          spy++
          $scope.dateRanges.push({ start_date: '2014-05-30', end_date: '2014-05-31'})
          firstDate = activeRange.first_date

          // sets isPendingClick to true on first click
          if (spy === 1) {
            activeRange.isPendingClick = true
          } else {
            activeRange.isPendingClick = false
          }

          secondDate = activeRange.second_date

        }
        compile();
      })

      it("updates the dateRanges on click", function() {
        browserTrigger($('li.daterangepicker-enabled').first(), 'click');
        expect(spy).to.equal(1)
        expect($scope.dateRanges.length).to.equal(1)
      });

      it("sets the clicked date as active", function() {
        var expectedDate = new Date('Sat May 17 2014 03:00:00 GMT+0200 (CEST)')
        browserTrigger($('li.daterangepicker-enabled').first(), 'click');
        expect(spy).to.equal(1)
        expect(firstDate.getDay()).to.equal(expectedDate.getDay())
        expect(firstDate.getMonth()).to.equal(expectedDate.getMonth())
        expect(firstDate.getYear()).to.equal(expectedDate.getYear())
      });

      it("return a second date if isPendingClick is set to true", function() {
        var expectedDate = new Date('Sat May 18 2014 03:00:00 GMT+0200 (CEST)')
        browserTrigger($('li.daterangepicker-enabled').first(), 'click');
        browserTrigger($('li.daterangepicker-enabled:contains(18)'), 'click');
        expect(spy).to.equal(2)
        expect(secondDate.getDay()).to.equal(expectedDate.getDay())
        expect(secondDate.getMonth()).to.equal(expectedDate.getMonth())
        expect(secondDate.getYear()).to.equal(expectedDate.getYear())
      });
    });

    describe('$destroy', function() {
      beforeEach(function() {
        spy = 0;
        activeRange.first_date = new Date()
        compile();
      })

      it('resets the activeRange when the directive is destroyed', function() {
        expect(activeRange.first_date).not.to.equal(null)
        $scope.$destroy();
        expect(activeRange.first_date).to.equal(null)
      })
    });
  });
});
