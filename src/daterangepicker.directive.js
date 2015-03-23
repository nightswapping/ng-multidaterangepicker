angular.module('daterangepicker.directives', ['lodash'])

.factory('activeRange', function (_) {

  var range = {};

  range.start_date = function () {
    if (range.first_date && range.second_date) {
      return _.min([range.first_date, range.second_date]);
    }
    return range.first_date;
  };

  range.end_date = function () {
    if (range.first_date && range.second_date) {
      return _.max([range.first_date, range.second_date]);
    }
    return range.first_date;
  };

  range.reset = function () {
    range.isPendingClick = false;
    range.first_date = null;
    range.second_date = null;
    range.isLocked = false;
  };

  range.setDate = function (date) {
    date = _.clone(date);
    if (range.isPendingClick === true) {
      range.second_date = date;
    } else {
      range.first_date = date;
    }
  };

  range.reset();
  return range;

})

.directive('daterangepicker', function ($locale, daterangepickerUtils, dateFilter, _, activeRange, calendarData) {
  return {
    restrict: 'AE',
    scope: {
      dateRanges: '=?',
      onDateClick: '=',
      defaultDate: '=',
      minDate: '=',
      maxDate: '=',
      weekStartsOn: '@',
      monthOnly: '@',
      startToday: '@',
    },

    templateUrl: function(tElement, tAttrs) {
      return tAttrs['template'];
    },

    link: function (scope, element, attrs)  {
      scope.dateRanges = scope.dateRanges || [];
      scope.activeRange = activeRange;

      // Check if onNewRange is a function
      if (scope.onNewRange && !(scope.onNewRange instanceof Function)) {
        throw new Error('onNewRange is not a function');
      }
      var minDate       = scope.minDate,
          maxDate       = scope.maxDate,
          weekStartsOn  = scope.weekStartsOn || 0,
          noExtraRows   = attrs.hasOwnProperty('noExtraRows'),
          currentMonth;

      if (!!scope.startToday && scope.startToday !== 'false') {
        minDate = new Date();
      }

      if (!!minDate) {
        if (!_.isDate(minDate)) {
          minDate = daterangepickerUtils.stringToDate(minDate);
        }
        // We want to compare dates, not date times
        minDate.setHours(0,0,0,0);
      }

      if (!!maxDate) {
        if (!_.isDate(maxDate)) {
          maxDate = daterangepickerUtils.stringToDate(maxDate);
        }
        // We want to compare dates, not date times
        maxDate.setHours(0,0,0,0);
      }

      if (!angular.isNumber(weekStartsOn) || weekStartsOn < 0 || weekStartsOn > 6) {
        weekStartsOn = 0;
      }

      var today = dateFilter(new Date(), 'yyyy-MM-dd'),
          currentDate = scope.defaultDate || new Date();

      if (!!currentDate && !_.isDate(currentDate)) {
        currentDate = daterangepickerUtils.stringToDate(currentDate);
      }

      // Overwrites default-date if startToday is set to true
      if (!!scope.startToday && scope.startToday !== 'false') {
        currentDate = new Date();
      }

      // We want to compare dates, not date times
      currentDate.setHours(0,0,0,0);

      scope.dayNames    = daterangepickerUtils.buildDayNames(weekStartsOn);
      scope.currentDate = currentDate;
      scope.monthOnly = scope.monthOnly || false;

      scope.render = function (initialDate) {
        initialDate = new Date(initialDate.getFullYear(), initialDate.getMonth(), 1);
        initialDate.setHours(0,0,0,0);

        scope.dates = daterangepickerUtils.buildDates(
          initialDate,
          { weekStartsOn: weekStartsOn, noExtraRows: noExtraRows }
        );

        var nextMonthInitialDate = new Date(initialDate);
        nextMonthInitialDate.setMonth(initialDate.getMonth() + 1);

        scope.allowPrevMonth = !minDate || initialDate > minDate;
        scope.allowNextMonth = !maxDate || nextMonthInitialDate <= maxDate;
      };

      scope.render(currentDate);

      scope.mouseEnter = function (date) {
        if (activeRange.isLocked === true) {
          return;
        } else {
          activeRange.setDate(date);
        }
      };

      scope.mouseLeave = function (date) {
        if (activeRange.isLocked === true) {
          return;
        } else {
          activeRange.setDate(null);
        }
      };

      scope.setDate = function (date) {
        if (isDateDisabled(date)) { return; }

        // The active range is passed to the callback on each click
        // Update it one last time just before sending it
        activeRange.setDate(date);
        scope.onDateClick(activeRange);
      };

      scope.getClass = function (date) {
        var overlappingRanges = daterangepickerUtils.findRangesForDate(scope.dateRanges, date);
        var classes = [];

        // Check if d should be set as selected
        var isInsideRange = (activeRange.start_date() <= date) && (date <= activeRange.end_date());

        var isFirstClick = !activeRange.isPendingClick &&
          (activeRange.start_date() && (date === activeRange.start_date()));

        if (isFirstClick || isInsideRange) {
          classes.push('daterangepicker-selected');
        }

        if (isDateDisabled(date)) {
          classes.push('daterangepicker-disabled');
        } else if (overlappingRanges.length > 0) {
          classes.push('daterangepicker-active');
        } else {
          // If no range, the date is just enabled for click
          classes.push('daterangepicker-enabled');
        }

        if (overlappingRanges) {
          _.forEach(overlappingRanges, function (dr) {
            if (dr.css_classes) {
              // Add the custom css classes specified in the range
              classes = _.union(classes, dr.css_classes.split(' '));
            }
          });
        }

        if (daterangepickerUtils.areDatesEqual(date, today)) {
          classes.push('daterangepicker-today');
        }

        return classes.join(' ');

      };

      scope.changeMonth = function (offset) {
        // If the current date is January 31th, setting the month to date.getMonth() + 1
        // Sets the date to March the 3rd, since the date object adds 30 days to the current
        // Date. Settings the date to the 2nd day of the month is a workaround to prevent this
        // Behaviour
        currentDate.setDate(1);
        currentDate.setMonth(currentDate.getMonth() + offset);
        scope.render(currentDate);
      };

      function isDateDisabled (date) {
        var overlappingRanges = daterangepickerUtils.findRangesForDate(scope.dateRanges, date);
        var is_disabled = _.any(overlappingRanges, function (dr) {
          return dr.disabled;
        });
        var belowMaxDate = (maxDate) ? maxDate && date > maxDate : false;
        return is_disabled || (minDate && date < minDate) || belowMaxDate ||
          (scope.monthOnly && dateFilter(date, 'M') !== currentMonth.toString());
      }

      // Resets the activeRange field when the directive is destroyed
      scope.$on('$destroy', function() {
        activeRange.reset()
      })
    }
  };
});
