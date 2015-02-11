angular.module('mm.busviz')
.directive('mmBusviz', function($window) {
    var $w,
        el;

    return {
        restrict: 'AE',
        scope: {
            bizs: "="
        },
        templateUrl: 'busviz/directives/mm-busviz.html',

        link: function(scope, elements, attrs) {
            scope.companies = { items:[] };
            $w = angular.element($window);
            el = $('.busviz-visual',elements);

            //let's put a watch to recompute when something changes in the data
            //it's normally not needed (the directive is already watching on bizs)
            //but we need to transform the data into a new array and put it on the scope
            //when something changes, hence we need this hook to perform the computation
            scope.$watch('bizs', function(newv, oldv){
                //this is the data we'll iterate over within the directive
                scope.companies.items = _convertIntoChartData(scope.bizs.items, el);
            });

            //We also want to redraw the chart when the window size changes
            scope.getWindowDimensions = function () {
                return {
                    'h': $w.height(),
                    'w': $w.width()
                };
            };
            scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
                scope.companies.items = _convertIntoChartData(scope.bizs.items, el);
            }, true);

            $w.bind('resize', function () {
                scope.$apply();
            });
        }
    };

    /**
     * Convert each business into charteable data.
     * each revenue/incorporationYear/valuation are translated into a percentage value
     * valuation and revenue are capped at 500 Billion $
     * incorporationYear can only be in the range 1900 - present year
     *
     * Take into account z-order. order business by valuation, from biggest to smallest;
     * this way, overlapping companies will always be visible
     */
    function _convertIntoChartData(companies, element) {
        var now = (new Date()).getYear() + 1900,
            //smaller axis, used to determine ratio for determining element sizes responsively
            elementSize = _.min([element.width(), element.height()]),
            //these are the multiplication factors for the percentage values on size/position for the elements according
            //to relative value dynamics (valuation/revenue/incorporation) PLUS screen size (responsive)
            magicNumbers = {
                size: _sizeRatio(elementSize),
                revenue: 0.76,
                incorporation: 0.8
            };


        var items = _.map(companies, function(company) {
            var valuation = _checkBoundaries(0,500, parseFloat(company.valuation)),
                revenue = _checkBoundaries(0,500, parseFloat(company.revenue)),
                revenuePerc = _perc(0,500, revenue),
                incorporationYear = _checkBoundaries(1900,now, parseInt(company.incorporationYear,10)),
                incorporationYearPerc = _perc(1900, now, incorporationYear),
                sizePerc = _perc(0, 500, valuation),
                size = sizePerc * magicNumbers.size;

            return {
                company: company, //original data (useful for possible info-tooltip)
                style: {
                    bottom: (revenuePerc * magicNumbers.revenue) + '%',
                    left: (incorporationYearPerc * magicNumbers.incorporation) + '%',
                    width: (size) + 'px',
                    height: (size) + 'px',
                    'background-color': company.sector.color,
                    'border-width': parseFloat(company.valuation) > valuation ? '3px' : '1px',
                    //if we want to set the center of each company in the dead center of the circle (instead of the lower left corner as it is now):
                    'margin-left': -1 * size/2,
                    'margin-bottom': -1 * size/2
                }
            };
        });

        //return a sorted list (desc by valuation), in order to avoid hiding elements by overlapping bigger ones onto them
        return items.sort(function(a,b){ return b.company.valuation - a.company.valuation; });
    }

    /*
     * Check that a domain value doesn't go outside its boundaries (min and max)
     * and adjust accordingly
     */
    function _checkBoundaries(min,max, value) {
        return (value < min ? min : value > max ? max : value);
    }

    /*
     * translate a domain value (in a range from low to high) into a percentage value (0-100)
     */
    function _perc(low,high, currValue) {
        //var computed = 100/(high - low) *  (currValue - low);
        var computed = 100/(high - low) *  (currValue-low);
        computer = computed > 100 ? 100 : computed;
        return parseFloat(computed.toFixed(2));
    }

    /**
     * magic function that find the number to multiply the size of the circles for.
     * this magic number helps maintaining the size of the circles in proportion to the screen size
     */
    function _sizeRatio(frameSize) {
        //we constrain the size of the container in the range 200 <-> 1900
        var boundedValue = frameSize > 1900 ? 1900 : frameSize < 200 ? 200 : frameSize;
        return 0.0023 * boundedValue;
    }

});
