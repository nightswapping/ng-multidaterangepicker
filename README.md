# Daterangepicker

[ ![Daterangepicker Master](https://codeship.com/projects/a45b3400-b38b-0132-4b36-1257de61718a/status?branch=master)](https://codeship.com/projects/70220)

A simple and fluid inline date range picker for AngularJS with lodash/underscore only as a dependency.
It works both as a simple date picker or as a date range picker and provides a lot of flexibility.

### Quick Find:

- [Installation] (#installation)
- [Daterangepicker options] (#daterangepicker-options)
- [Changing the templates] (#changing-the-templates)
- [Translating the date names] (#translating-the-date-names)
- [Examples] (#examples)

### Installation

1) Add the `daterangepicker` module to your dependencies

```javascript
angular.module('myApp', ['daterangepicker']);
```

2) Use the `daterangepicker` directive in any element

```html
<div daterangepicker></div>
```

Daterangepicker is fluid, so it will take the width of the parent container.

### Daterangepicker options

#### date-ranges

Flag some dates/ranges on the calendar. Simply pass an array of dates or ranges with the classes you need. To disable dates/ranges add them to your date-ranges array with the ```daterangepicker-disabled``` class.

```html
<div daterangepicker date-ranges="dateRanges"></div>
```

DateRange is a list of range with the following format

```javascript
var dateRange = [
  { start_date: '2014-12-01', end_date: '2014-12-10', css_classes: 'blocked' }
];
```
If a class is provided, it will be added to the date on the calendar. Multiple classes separated by a space ('blocked disabled').

By default the calendar uses the following classes, which can be easily overwritten:

```html
daterangepicker-enabled
daterangepicker-today
daterangepicker-active
daterangepicker-disabled
```

#### min-date, max-date

```html
<div daterangepicker date-ranges="dateRanges" min-date="minDate" max-date="maxDate"></div>
```

```javascript
function MyAppController($scope) {
  $scope.minDate = '2013-11-10';
  $scope.maxDate = '2013-12-31';
}
```

`min-date` and `max-date` take angular expressions, so if you want to specify the values inline, don't forget the quotes!

```html
<div daterangepicker min-date="'2013-11-10'" max-date="'2013-12-31'"></div>
```

#### default-date

Allows you to preset the calendar to a particular month without setting the chosen date.

```html
<div daterangepicker default-date="presetDate"></div>
```

```javascript
function MyAppController($scope) {
    $scope.presetDate = '2013-12-01';
}
```

#### start-today

Sets the first day of the calendar as today's date. If set to true, minDate will be today and the default-date will be overwritten.


#### week-starts-on

Sets the first day of the week. The default is 0 for Sunday.

```html
<div daterangepicker week-starts-on="1"></div>
```

#### no-extra-rows

The calendar will have between 4 and 6 rows if this attribute is present. By default it will always have 6 rows.

```html
<div daterangepicker no-extra-rows></div>
```

#### onDateClick

The calendar will call the provided function everytime a date is clicked. It will receive a factory object ```activeRange``` which enables you to update the calendar based on the users' actions.

activeRange has 4 fields on interest:

**activeRange.first_date:**
It is set to the date clicked on by the user

**activeRange.isPendingClick:**
If set to ```true``` on response to the first click, activeRange stores the first_date value and waits for the user to make a second click

**activeRange.second_date:**
If ```isPendingClick``` has been set to true, second_date receives the second date the user has click on. Its main purpose is to use the directive as a "date range ppicker" rather than a simple "date picker"

**activeRange.isLocked:**
If set to true, the directive ignores any mouse event on the calendar

### Changing the templates:

the calendar template is stored in the ```$templateCache``` under the route ```'calendar/daterange_picker.html'```. To overwrite it, simply add a new template during your ```run``` phase:

```javascript
angular.module('myApp', [])
  .run(function($templateCache) {
    $templateCache.put('calendar/daterange_picker.html',
      '<my-awesome-template></my-awesome-template>'
    )
  })
```

Here is the initial template:
```html
     <div class="daterangepicker">
        <div class="daterangepicker-header">
          <div class="daterangepicker-controls">
            <div class="daterangepicker-month">
              <a href="" ng-click="changeMonth(-1)" ng-show="allowPrevMonth" translate="translate"
                 lass="daterangepicker-prevmonth">
                <i class="icon-chevron-left"></i>
              </a>
              <span>{{getI18nMonth(currentDate)}}</span>
              <a href="" ng-click="changeMonth(1)" ng-show="allowNextMonth" translate="translate"
                 lass="daterangepicker-nextmonth">
                <i class="icon-chevron-right"></i>
              </a>
            </div>
            <div class="daterangepicker-year">
              <a href="" ng-click="changeMonth(-12)" ng-show="allowPrevMonth"
                 lass="daterangepicker-prevmonth">
                <i class="icon-chevron-left"></i>
              </a>
              <span>{{currentDate | date:"yyyy"}}</span>
              <a href="" ng-click="changeMonth(12)" ng-show="allowNextMonth" class="daterangepicker-nextyear">
                <i class="icon-chevron-right"></i>
              </a>
            </div>
          </div>
        </div>
        <div class="daterangepicker-body">
          <div class="daterangepicker-main">
            <ul class="daterangepicker-cell">
              <li ng-repeat="dayName in dayNames" class="daterangepicker-head">{{dayName}}</li>
            </ul>
            <ul class="daterangepicker-cell">
              <li ng-class="getClass(date)" ng-repeat="date in dates" ng-click="setDate(date)"
                  g-mouseenter="mouseEnter(date)" ng-mouseleave="mouseLeave(date)"
                  tartToday="true">
                {{date | date:"d"}}
              </li>
            </ul>
          </div>
        </div>
      </div>
```

### Translating the date names:

By default the date names are in english. However a provider is exposed to simply change the date names during the ```config``` phase:

```javascript
myApp.config(["calendarData", function(calendarData) {
  var frenchDays = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche"
  ];

  calendarData.setDays(frenchDays)
}]);
```

### Examples

#### Date Picker:
When used as a date picker, users can only select a single date. To achieve this behavior, pass a function looking like the following one:

```javascript
  $scope.onDateClick = function (activeRange) {
      activeRange.isLocked = true;

      // activeRange.first_date contains a Date Object which you can save, pass to your server or do whatever you want
  };
```

#### Date Range Picker:
When used as a date range picker, users can only select a date range in 2 clicks. To achieve this behavior, pass a function looking like the following one:

```javascript
  $scope.onDateClick = function (activeRange) {
    if (activeRange.isPendingClick === true) {
      // Mark the active range as being under treatment so that we can ignore mouse events:
      activeRange.isLocked = true;
      // It is the second click:
      // The range is now defined by [activeRange.first_date, activeRange.second_date
    } else {
      // If pending is false, the user has clicked only once
      // so start date should be frozen by setting pending to true.
      activeRange.isPendingClick = true;
    }
  };
```


## License

Copyright (c) 2015 Nightswapping

MIT License

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
