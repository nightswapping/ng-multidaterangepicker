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
