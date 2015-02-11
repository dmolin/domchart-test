describe('HomeController', function() {
    var ctrl,
        scope,
        mockedService;

    //beforeEach(module("mm.home"));

    //let's mock the businessService
    beforeEach(function() {
        mockedService = {};

        module('mm.home', function($provide){
            $provide.value('businessService', mockedService);
        });

        inject(function($q){
            mockedService.data = [
            {
                sector: { name: "Automobile" },
                revenue: "1.00",
                valuation: "1.00",
                incorporationYear: "1900"
            },
            {
                sector: { name: "Automobile" },
                revenue: "100.00",
                valuation: "200.00",
                incorporationYear: "2000"
            }];

            mockedService.fetch = function() {
                var defer = $q.defer();

                defer.resolve(this.data);
                return defer.promise;
            };
            mockedService.create = mockedService.fetch;
            mockedService.merge = mockedService.fetch;
        });

        spyOn(mockedService, 'fetch').and.callThrough();
    });

    beforeEach(inject(function($controller, $rootScope, businessService) {
        scope = $rootScope.$new();

        ctrl = $controller('HomeController', _.extend({
                $scope: scope,
                businessService: businessService
            }));

        scope.$digest();
    }));

    it('should define 2 methods for adding/merging companies', function() {
        expect(scope.addCompany).toBeDefined();
        expect(_.isFunction(scope.addCompany)).toBe(true);

        expect(scope.mergeCompanies).toBeDefined();
        expect(_.isFunction(scope.mergeCompanies)).toBe(true);
    });

    it('should expose a compound object on the scope', function() {
        expect(mockedService.fetch).toHaveBeenCalled();

        expect(scope.businesses).toBeDefined();
        expect(scope.businesses.sectors).toBeDefined();
        expect(scope.businesses.items).toBeDefined();
        expect(_.isArray(scope.businesses.sectors)).toBe(true);
        expect(_.isArray(scope.businesses.items)).toBe(true);
    });

    it('should avoid duplicates when exposing the sectors array on the scope', function() {
        expect(scope.businesses.sectors.length).toBe(1);
    });

    it('should proxy to the businessService when adding or merging companies', function() {
        spyOn(mockedService, 'create').and.callThrough();
        spyOn(mockedService, 'merge').and.callThrough();

        scope.addCompany();
        expect(mockedService.create).toHaveBeenCalled();

        scope.mergeCompanies();
        expect(mockedService.merge).toHaveBeenCalled();

    })

});
