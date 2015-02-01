angular.module('daterangepicker.providers', [])
  .provider('calendarData', function() {
    var data = {
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
    }

    return {
      setDays : function(days) {
        data.days = days;
      },
      setDaysShort : function(daysShort) {
        data.daysShort = daysShort;
      },
      setDaysMin : function(daysMin) {
        data.daysMin = daysMin;
      },
      setMonths : function(months) {
        data.months = months;
      },
      setMonthsShort : function(monthsShort) {
        data.monthsShort = monthsShort;
      },
      $get : function() {
        if (!data) {
          throw new Error('You must set dates headers');
        }

        return data
      }
    }
  })
