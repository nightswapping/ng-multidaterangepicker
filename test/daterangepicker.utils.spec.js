describe('daterangepickerUtils', function () {
  'use strict';
  var utils = null;

  beforeEach(module('daterangepicker'));

  beforeEach(inject(function (_daterangepickerUtils_) {
    utils = _daterangepickerUtils_;
  }));

  describe('stringToDate', function() {
    it("parses the string and return a date object", function() {
      var dateString = "2014-02-04",
          date = utils.stringToDate(dateString);

      expect(date.getDate()).to.equal(4);
      expect(date.getMonth()).to.equal(1);
      expect(date.getFullYear()).to.equal(2014);
      expect(date.getHours()).to.equal(3);
    });
  });

  describe('dateToString', function() {
    it("parses a date object and return a string", function() {
      var dateObj = new Date('Sun Nov 09 2014 21:21:10 GMT+0100 (CET)'),
          dateString = utils.dateToString(dateObj),
          date = utils.stringToDate(dateString);

      expect(date.getDate()).to.equal(9);
      expect(date.getMonth()).to.equal(10);
      expect(date.getFullYear()).to.equal(2014);
    });
  });

  describe('areDatesEqual', function() {
    it('checks the dates are equal', function() {
      expect(utils.areDatesEqual(new Date('2014-12-01'), '2014-12-01')).to.equal(true);
      expect(utils.areDatesEqual(new Date('2014-12-01'), '2014-12-11')).to.equal(false);
    });
  });

  describe('isRangeValid', function() {
    it('checks the dates are correct', function() {
      var validRange = [
        { start_date: '2014-12-01', end_date: '2014-12-05' },
        { start_date: '2014-12-11', end_date: '2014-12-15' },
        { start_date: '2014-12-21', end_date: '2014-12-25' }
      ];
      expect(utils.isRangeValid(validRange)).to.equal(true);
    });
  });

  describe('buildDayNames', function() {
    it('builds the days', function() {
      var expectedResult = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      expect(utils.buildDayNames()).to.deep.equal(expectedResult);
    });

    it('rotates the days', function() {
      var expectedResult = ['Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue'];
      expect(utils.buildDayNames(3)).to.deep.equal(expectedResult);

      expectedResult = ['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'];
      expect(utils.buildDayNames(5)).to.deep.equal(expectedResult);
    });
  });

  describe('buildDates', function() {
    var date,
        weekStartsOn,
        d = function(date) {
          return utils.stringToDate(date);
        };

    beforeEach(function() {
      date = d('2015-01-01');
      weekStartsOn = 0;
    });

    it('returns the correct dates', function() {
      var dates = utils.buildDates(date, { weekStartsOn: weekStartsOn });

      expect(dates[0]).to.deep.equal(d('2014-12-28'));
      expect(dates[3]).to.deep.equal(d('2014-12-31'));
      expect(dates[4]).to.deep.equal(d('2015-01-01'));
      expect(dates[34]).to.deep.equal(d('2015-01-31'));
      expect(dates[35]).to.deep.equal(d('2015-02-01'));
      expect(dates.slice(-1)[0]).to.deep.equal(d('2015-02-07'));
    });

    it('has 6 rows of dates by default', function() {
      var rowCount = utils.buildDates(date, { weekStartsOn: weekStartsOn }).length;
      expect(rowCount).to.equal(6 * 7);
    });

    it('should not add empty rows when told not to', function() {
      expect(utils.buildDates(date, { weekStartsOn: weekStartsOn, noExtraRows: true }).length).to.equal(5 * 7);
    });

    it('adds 2 extra rows when required', function() {
      var date = d('2015-02-01');

      expect(utils.buildDates(date, { weekStartsOn: weekStartsOn, noExtraRows: false }).length).to.equal(6 * 7);
      expect(utils.buildDates(date, { weekStartsOn: weekStartsOn, noExtraRows: true }).length).to.equal(4 * 7);
      expect(utils.buildDates(date, { weekStartsOn: 1, noExtraRows: true }).length).to.equal(5 * 7);
    });

    it('works when the week starts on monday', function() {
      var dates = utils.buildDates(date, { weekStartsOn: 1 });

      expect(dates[0]).to.deep.equal(d('2014-12-29'));
      expect(dates[3]).to.deep.equal(d('2015-01-01'));
      expect(dates[33]).to.deep.equal(d('2015-01-31'));
      expect(dates.slice(-1)[0]).to.deep.equal(d('2015-02-08'));
    });

    it('works when the week starts on saturday', function() {
      var dates = utils.buildDates(date, { weekStartsOn: 6 });

      expect(dates[0]).to.deep.equal(d('2014-12-27'));
      expect(dates[5]).to.deep.equal(d('2015-01-01'));
      expect(dates[35]).to.deep.equal(d('2015-01-31'));
      expect(dates.slice(-1)[0]).to.deep.equal(d('2015-02-06'));
    });

  });

  describe('findRangesForDate', function() {
    it('returns an empty range for dateRanges=[]', function() {
      var dateRanges = [];

      expect(utils.findRangesForDate(dateRanges, new Date('2015-01-10')).length).to.equal(0);
    });

    it('returns doesnt return the range if the date isnt contained in it', function() {
      var dateRanges = [{ start_date: '2015-01-01', end_date: '2015-01-31' }];

      expect(utils.findRangesForDate(dateRanges, new Date('2014-12-31')).length).to.equal(0);
      expect(utils.findRangesForDate(dateRanges, new Date('2015-02-01')).length).to.equal(0);
    });

    it('returns a range if the date is contained in it', function() {
      var dateRanges = [{ start_date: '2015-01-01', end_date: '2015-01-31' }];

      expect(utils.findRangesForDate(dateRanges, new Date('2015-01-15'))).to.deep.equal(dateRanges);
      expect(utils.findRangesForDate(dateRanges, new Date('2015-01-31'))).to.deep.equal(dateRanges);
      expect(utils.findRangesForDate(dateRanges, new Date('2015-01-01'))).to.deep.equal(dateRanges);
    });
  });

  describe('findRangesForRange', function() {
    it('returns an empty range for dateRanges=[]', function() {
      var dateRanges = [];

      expect(utils.findRangesForRange(dateRanges, []).length).to.equal(0);
    });

    it('returns doesnt return the range if the date isnt contained in it', function() {
      var dateRanges = [{ start_date: '2015-01-01', end_date: '2015-01-31' }];

      expect(utils.findRangesForRange(dateRanges, [{ start_date: '2014-12-29', end_date: '2014-12-31' }]).length).to.equal(0);
      expect(utils.findRangesForRange(dateRanges, [{ start_date: '2015-02-01', end_date: '2015-02-02' }]).length).to.equal(0);
    });

    it('returns a range if the date is contained in it', function() {
      var dateRanges = [{ start_date: '2015-01-01', end_date: '2015-01-31' }];

      expect(utils.findRangesForRange(dateRanges, '2014-12-15', '2015-01-01')).to.deep.equal(dateRanges);
      expect(utils.findRangesForRange(dateRanges, '2014-12-15', '2015-01-15')).to.deep.equal(dateRanges);
      expect(utils.findRangesForRange(dateRanges, '2014-12-15', '2015-01-31')).to.deep.equal(dateRanges);
      expect(utils.findRangesForRange(dateRanges, '2014-12-15', '2015-02-15')).to.deep.equal(dateRanges);

      expect(utils.findRangesForRange(dateRanges, '2015-01-01', '2015-01-15')).to.deep.equal(dateRanges);
      expect(utils.findRangesForRange(dateRanges, '2015-01-01', '2015-01-31')).to.deep.equal(dateRanges);
      expect(utils.findRangesForRange(dateRanges, '2014-12-15', '2015-02-15')).to.deep.equal(dateRanges);

      expect(utils.findRangesForRange(dateRanges, '2015-01-15', '2015-01-31')).to.deep.equal(dateRanges);
      expect(utils.findRangesForRange(dateRanges, '2014-01-15', '2015-02-15')).to.deep.equal(dateRanges);

      expect(utils.findRangesForRange(dateRanges, '2014-01-31', '2015-02-15')).to.deep.equal(dateRanges);

    });

  });
});
