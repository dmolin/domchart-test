angular.module('mm.busviz')
.factory('businessService', ['$q','$timeout', function($q, $timeout){
    var businesses = [];
    var sectors = {
        automobile: {name: 'Automobile', color: '#8bd3c6'},
        agricolture: {name: 'Agriculture', color: '#bfb9dc'},
        agrifood: {name: 'Agrifood', color: '#cbecc5'},
        commodities: {name: 'Commodities', color: '#7fb0d5'}
    };

    //initialize a preset mocked data for our businesses
    _initBusinesses();

    return {
        fetch: _fetch,
        create: _create,
        merge: _merge,

        //I'm exposing _initBusinesses here in order to
        //help in Unit testing. In a real scenario it
        //would not even exist or be exposed in the service...
        _reset: _initBusinesses
    };

    //private functions

    function _initBusinesses(data) {
        if(data) {
            businesses = data;
            return;
        }

        //...else, randomize 5 companies
        var comps = [];
        for(var i = 0; i < 5; i++) {
            comps.push(_createCompany(i+1))
        }
        businesses = comps;
    }

    /**
     * Create a new company.
     */
    function _create() {
        return _makeAsynch(function() {
            businesses.push(_createCompany(businesses.length+1));
            return businesses;
        });
    }

    function _fetch() {
        return _makeAsynch(businesses);
    }

    /**
     * Merge 2 companies from the same sector (the 2 first companies from that sector are picked up)
     */
    function _merge() {

        return _makeAsynch(function() {
            //organize the businesses by sector
            var compsBySector = _.groupBy(businesses, function(node){ return node.sector.name; });
            var picks = [];

            //goes through the list and pick the first with at least 2 companies in it
            picks = _.find(compsBySector, function(bizs) {
                return bizs.length > 1;
            });

            if(picks && picks.length) {
                //consider only the first 2 entries
                picks = picks.slice(0,2);

                //remove them from the business list
                _.each(picks, function(pick) {
                    businesses.splice(businesses.indexOf(pick),1);
                });

                //merge the 2 companies and create a new one to be added to the list
                businesses.push(_mergeCompanies(picks));
            }
            return businesses;
        });

    }

    function _createCompany(id) {
        //create a new random company
        return {
            id: id || 0,
            sector: _randomizeSector(),
            revenue: _randomize(70,450).toFixed(2),
            valuation: _randomize(50,500).toFixed(2),
            incorporationYear: parseInt( _randomize(1920, new Date().getYear() + 1920), 10 )
        };
    }

    /**
     * Merge 2 companies.
     * the resulting company must have:
     * - the incorporation date of the oldest business
     * - combined valuation
     * - revenue of the oldest business
     */
    function _mergeCompanies(comps) {
        //pick the oldest company (for revenue and incorporation date)
        var comp = _.min(comps, function(comp) { return comp.incorporationYear; });

        //combine valuations
        comp.valuation = _.reduce(comps, function(memo, comp){ return memo + parseFloat(comp.valuation); }, 0).toFixed(2);
        return comp;
    }

    //return a random number between min and max
    function _randomize(max, min) {
        min = min || 0;
        return Math.random() * (max - min) + min;
    }

    function _randomizeSector() {
        var sectorsList = _.map(sectors);
        return sectorsList[parseInt( _randomize(sectorsList.length), 10 )];
    }

    /*---------------------------------------
     * Helper functions created only for
     * Simulating async requests
     *--------------------------------------*/

    function _makeAsynch(cb) {
        var deferred = $q.defer();

        $timeout(function() {
            var outcome = _.isFunction(cb) ? cb() : cb;
            deferred.resolve(outcome);
        },200);

        return deferred.promise;

    }
}]);
