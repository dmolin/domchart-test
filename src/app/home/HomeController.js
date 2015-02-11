angular.module('mm.home')
.controller('HomeController', [
    "$scope",
    "businessService",
    function($scope, businessService) {
        $scope.businesses = { items:[], sectors:[] };

        $scope.addCompany = _addCompany;
        $scope.mergeCompanies = _mergeCompanies;

        //load all data from the Business service
        businessService.fetch().then(_parseBusinessesResponse);

        function _addCompany() {
            //add a new random copany to the 'businesses' list
            businessService.create().then(_parseBusinessesResponse);
        }

        function _mergeCompanies() {
            businessService.merge().then(_parseBusinessesResponse);
        }

        function _parseBusinessesResponse(response) {
            var getName = _.property('name');
            $scope.businesses = {
                items: response,
                sectors: _.sortBy(_.uniq(_.pluck(response, 'sector'), getName), getName)
            };
        }
    }
]);
