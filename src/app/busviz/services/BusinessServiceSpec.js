describe('businessService', function() {
    var svc, q, timeout;

    beforeEach(module('mm.busviz'));
    beforeEach(inject(function(_businessService_, $q, $timeout) {
        svc = _businessService_;
        q = $q;
        timeout = $timeout;

        svc._reset([{
                sector: {},
                revenue: "1",
                valuation: "1",
                incorporationYear: "1900"
            }]);
    }));

    afterEach(function() {
    });

    it('defines business endpoints', function() {
        expect(svc.fetch).toBeDefined();
        expect(_.isFunction(svc.fetch)).toBe(true);
        expect(svc.create).toBeDefined();
        expect(_.isFunction(svc.create)).toBe(true);
        expect(svc.merge).toBeDefined();
        expect(_.isFunction(svc.merge)).toBe(true);
    });

    //I would normally test the endpoints, mocking the http requests with $httpBackend.
    //Since in this implementation we've no backend, testing the endpoints does not make
    //much sense, since the only way to test them would be to mock their entire behaviouor...
    it('returns the list of all the businesses', function() {
        var recs = [];
        svc.fetch().then(function(data) {
            recs = data;
        });
        timeout.flush();
        expect(recs.length).toEqual(1);
    });

    it('returns the updated list upon creation of a new company', function() {
        var recs = [];
        svc.create().then(function(data) {
            recs = data;
        });
        timeout.flush();

        expect(recs.length).toEqual(2);
    });

    it('returns the updated list upon merge of 2 companies', function() {
        var recs = [];

        svc._reset([
            {
                sector: {name: "Automobile"},
                revenue: "100.00",
                valuation: "100.00",
                incorporationYear: "1900"
            },
            {
                sector: {name: "Automobile"},
                revenue: "150.00",
                valuation: "200.00",
                incorporationYear: "2000"
            }
        ]);

        svc.merge().then(function(data) {
            recs = data;
        });
        timeout.flush();

        //expectations.
        //we should find one company, with:
        //- incorporation date of the oldest business
        //- revenue of the oldest business
        //- combined valuation
        expect(recs.length).toEqual(1);
        expect(recs[0].incorporationYear).toEqual('1900');
        expect(recs[0].revenue).toEqual('100.00');
        expect(recs[0].valuation).toEqual('300.00');
    });


});
