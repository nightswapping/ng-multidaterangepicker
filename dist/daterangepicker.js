if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports){
  module.exports = 'clustered.map';
}

(function (window, angular, undefined) {
angular.module('daterangepicker.constants', [])
  .constant("calendarData", {
    days: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ],
    daysShort: [
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun"
    ],
    daysMin: [
      "Su",
      "Mo",
      "Tu",
      "We",
      "Th",
      "Fr",
      "Sa",
      "Su"
    ],
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ],
    monthsShort: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ],
    today: "Today"
  })
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

      if (minDate && !_.isDate(minDate)) {
        minDate = daterangepickerUtils.stringToDate(minDate);
      }

      if (maxDate && !_.isDate(maxDate)) {
        maxDate = daterangepickerUtils.stringToDate(maxDate);
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

      scope.dayNames    = daterangepickerUtils.buildDayNames(weekStartsOn);
      scope.currentDate = currentDate;
      scope.monthOnly = scope.monthOnly || false;

      scope.render = function (initialDate) {
        initialDate = new Date(initialDate.getFullYear(), initialDate.getMonth(), 1, 3);
        currentMonth = currentDate.getMonth() + 1;

        scope.dates = daterangepickerUtils.buildDates(
          initialDate,
          { weekStartsOn: weekStartsOn, noExtraRows: noExtraRows }
        );

        var nextMonthInitialDate = new Date(initialDate);
        nextMonthInitialDate.setMonth(currentMonth);

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
    }
  };
});
angular.module('daterangepicker.factories', [])

.factory('daterangepickerUtils', function ($locale, calendarData, _) {
  return {
    /**
     * Finds and returns all date ranges in a list of date ranges which
     * overlap with a given date range.
     * start_date and end_date arguments may be string dates or date objects
     **/
    findRangesForRange: function (dateRanges, start_date, end_date) {
      var start_date = _.clone(start_date),
          end_date = _.clone(end_date);

      if (!_.isDate(start_date)) {
        start_date = new Date(start_date);
      }
      if (!_.isDate(end_date)) {
        end_date = new Date(end_date);
      }

      dateRanges = dateRanges || [];
      var overlappingRanges = [];
      for (var l = 0; l < dateRanges.length; l++) {
        if ((start_date <= this.stringToDate(dateRanges[l].end_date) &&
            end_date >= this.stringToDate(dateRanges[l].start_date)) ||
            (end_date >= this.stringToDate(dateRanges[l].start_date) &&
            start_date <= this.stringToDate(dateRanges[l].end_date))) {
          overlappingRanges.push(dateRanges[l]);
        }
      }
      return overlappingRanges;
    },

    /**
     * Finds and returns all date ranges in a list of date ranges which
     * include a given date.
     **/
    findRangesForDate: function (dateRanges, date) {
      dateRanges = dateRanges || [];
      var overlappingRanges = [];
      for (var l = 0; l < dateRanges.length; l++) {
        if (date >= this.stringToDate(dateRanges[l].start_date) &&
            date <= this.stringToDate(dateRanges[l].end_date)) {
          overlappingRanges.push(dateRanges[l]);
        }
      }
      return overlappingRanges;
    },

    stringToDate: function (dateString) {
      if (!dateString) {
        return;
      }
      // Takes a date as a string with this format '2014-11-23'
      // and returns it as a date object
      var dateParts = dateString.split('-'),
        year  = dateParts[0],
        month = dateParts[1],
        day   = dateParts[2];

      // Set hour to 3am to easily avoid DST change
      return new Date(year, month - 1, day, 3);
    },

    dateToString: function (date) {
      if (!date) {
        return;
      }
      // Takes a date object as parameter and return it as a string
      // with the following '2014-11-23'
      var year = date.getFullYear(),
          month = (date.getMonth() < 9) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1,
          day = (date.getDate() < 10) ? '0' + date.getDate() : date.getDate();

      return year + '-' + month + '-' + day;
    },

    areDatesEqual: function (first, second) {
      // Checks if 2 dates relates to the same day
      if (_.isDate(first)) {
        first = this.dateToString(first);
      }
      if (_.isDate(second)) {
        second = this.dateToString(second);
      }
      return first === second;
    },

    buildDates: function (date, options) {
      // Builds the dates displayed in the calendar using
      // the provided date as a start date
      var dates = [],
          lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0, 3);

      options = options || {};
      date = new Date(date);

      while (date.getDay() !== options.weekStartsOn) {
        date.setDate(date.getDate() - 1);
      }

      for (var i = 0; i < 42; i++) {  // 42 == 6 rows of dates
        if (options.noExtraRows && date.getDay() === options.weekStartsOn && date > lastDate) { break; }

        dates.push(new Date(date));
        date.setDate(date.getDate() + 1);
      }

      return dates;
    },

    buildDayNames: function (weekStartsOn) {
      // Builds the day names displayed in the calendar
      var dayNames = _.map(calendarData.daysShort.slice(0, -1), function (d) { return d; });

      if (weekStartsOn) {
        dayNames = dayNames.slice(0);
        for (var i = 0; i < weekStartsOn; i++) {
          dayNames.push(dayNames.shift());
        }
      }
      return dayNames;
    },

    isRangeValid: function (ranges) {
      if (!ranges || !ranges.length) {
        return true;
      }

      var self = this;
      // Checks that the ranges provided by
      // the server have the correct args
      _.map(ranges, function (d) {
        if ((self.dateToString(new Date(d.start_date)) !== d.start_date) ||
        (self.dateToString(new Date(d.end_date)) !== d.end_date)) {
          throw new Error('Invalid date passed');
        }
      });

      return true;
    }
  };
});
angular.module('daterangepicker', [
  'daterangepicker.constants',
  'daterangepicker.factories',
  'daterangepicker.directives',
]);
})(window, window.angular);
