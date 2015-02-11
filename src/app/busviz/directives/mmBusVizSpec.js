describe("mmBusViz", function() {
    beforeEach(module("mm")); //this loads the template cache
    beforeEach(module("mm.busviz"));

    var compile, rootScope, scope, cache,
        sectors = {
            commodities: { name:'Commodities', color:'#AAA'}
        };

    beforeEach(inject(function($compile, $rootScope, $templateCache) {
        compile = $compile;
        rootScope = $rootScope;
        scope = rootScope.$new();
        cache = $templateCache;
    }));

    it('should render a visual area and a legend area', function() {
        var element = _plot(scope, {
                items:[],
                sectors:[]
            });
        expect(angular.element('.busviz-visual',element).length).toEqual(1);
        expect(angular.element('.busviz-controls',element).length).toEqual(1);
    });

    it('should render the labels for the chart axis', function() {
        var element = _plot(scope, {
                items:[],
                sectors:[]
            });
        expect(angular.element('.axis-label.label-horz', element).length).toBe(1);
        expect(angular.element('.axis-label.label-vert', element).length).toBe(1);
    });

    it('should reflect the incorporation date on the X axis', function() {
        var element = _plot(scope, {
            items:[{
                id: 1,
                sector: sectors.commodities,
                incorporationYear: "1920",
                revenue: "0.00",
                valuation: "20.00"
            },{
                id: 2,
                sector: sectors.commodities,
                incorporationYear: "2014",
                revenue: "0.00",
                valuation: "20.00"
            }],
            sectors:[sectors.commodities]
        });

        var company1 = angular.element('.busviz-node[data-id=1]',element),
            company2 = angular.element('.busviz-node[data-id=2]',element);

        expect(_getPos(company2).x > _getPos(company1).x).toBe(true);

    });

    it('should reflect the revenue on the Y axis', function() {
        var element = _plot(scope, {
            items:[{
                id: 1,
                sector: sectors.commodities,
                incorporationYear: "1920",
                revenue: "0.00",
                valuation: "20.00"
            },{
                id: 2,
                sector: sectors.commodities,
                incorporationYear: "1920",
                revenue: "100.00",
                valuation: "20.00"
            }],
            sectors:[sectors.commodities]
        });

        var company1 = angular.element('.busviz-node[data-id=1]',element),
            company2 = angular.element('.busviz-node[data-id=2]',element);

        expect(_getPos(company2).y > _getPos(company1).y).toBe(true);
    });

    function _plot(scope, businesses) {
        scope.businesses = businesses;
        var element = compile('<section mm-busviz bizs="businesses"></section>')(scope);
        scope.$digest(); //this triggers the update on the markup
        return element;
    }

    function _getStyle(el, name) {
        var trim = function(val) { return val ? val.replace(/^\s+|\s+$/gm,'') : val; }

        var styles = _.map(el.attr('style').split(';'), function(style) {
            return { key: trim(style.split(':')[0]), value: trim(style.split(':')[1]) };
        });
        var stylesByKey = _.groupBy(styles, function(st) { return st.key; });
        var val = stylesByKey[name][0].value;

        if(!val) return 0;

        var tail = val.indexOf('px') >= 0 ? val.indexOf('px') : val.indexOf('%');
        return parseFloat(val.substring(0, tail));
    }

    function _getPos(el) {
        var bottom = _getStyle(el, 'bottom'),
            left = _getStyle(el, 'left');

        return {
            x: parseInt(left),
            y: parseInt(bottom)
        };

    }
});
