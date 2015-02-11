$(document).ready(function(){

var sectors = {
    automobile: {name: 'Automobile', color: '#8bd3c6'},
    agricolture: {name: 'Agriculture', color: '#bfb9dc'},
    agrifood: {name: 'Agrifood', color: '#cbecc5'},
    commodities: {name: 'Commodities', color: '#7fb0d5'}
};

/*-----------------------------
 * Widget
 *-----------------------------*/


var BusViz = (function() {
    var templates = {
        main: [
             '<section class="busviz">',
                '<div class="busviz-visual" data-id="nodes">',
                    '<span class="axis-label label-vert">revenue</span>',
                    '<span class="axis-label label-horz">incorporation date</span>',

                '</div>',
                '',
                '<section class="busviz-controls">',
                    '<ul class="flatlist cf" data-id="sectors">',
                    '</ul>',
                '</section>',
            '</section>'
        ].join('\n'),
        node: [
            '<div ',
                'class="busviz-node"',
                'style="{{style}}"',
                'data-id="{{id}}"',
                'data-revenue="{{revenue}}"',
                'data-valuation="{{valuation}}"',
                'data-incorporation-date="{{incorporationYear}}"></div>'
        ].join('\n'),
        sector: [
            '<li class="flatlist-item" >',
                '<i class="cat" style="background-color: {{color}}" />',
                '<span>{{name}}</span>',
            '</li>'
        ].join('\n')
    };

    function O(options) {
        this.options = options || { el:'<div></div>' };
        this.$el = $(this.options.el);
        if(this.options.model) {
            this.model = this.options.model;
        }
    }

    O.prototype.render = function() {
        var self = this;

        this._resetWindowEvents();

        //render the template with the model
        this.$el.html('').append(tash.util.template(templates.main, {}))

        //work on the charting area
        this._bindView();

        this._renderCompanies(this.model);
        this._renderSectors(this._extractSectors(this.model));

        this._listenForWindowEvents();

        this._bindControls();
        return this;
    }

    O.prototype.setModel = function(model) {
        this.model = model;
        return this.render();
    }

    O.prototype._bindView = function() {
        this.$visual = $('[data-id=nodes]', this.$el);
        this.$sectors = $('[data-id=sectors]', this.$el);
    }

    O.prototype._bindControls = function() {

    }

    O.prototype._renderCompanies = function(companies) {
        var items = this._convertCompaniesIntoChartData(companies);
        _.each(items, this._renderCompany.bind(this));
        return this;
    }

    O.prototype._renderCompany = function(comp) {
        this.$visual.append(tash.util.template(templates.node, comp));
        return this;
    }

    O.prototype._renderSectors = function(sectors) {
        var self = this;
        _.each(sectors, function(sector) {
            self.$sectors.append(tash.util.template(templates.sector, sector));
        });
        return this;
    }

    O.prototype._convertCompaniesIntoChartData = function(companies) {
        var now = (new Date()).getYear() + 1900,
            //smaller axis, used to determine ratio for determining element sizes responsively
            elementSize = _.min([this.$visual.width(), this.$visual.height()]),
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

            return _.extend({
                    style: _convertObjectIntoStyles({
                        bottom: (revenuePerc * magicNumbers.revenue) + '%',
                        left: (incorporationYearPerc * magicNumbers.incorporation) + '%',
                        width: (size) + 'px',
                        height: (size) + 'px',
                        'background-color': company.sector.color,
                        'border-width': parseFloat(company.valuation) > valuation ? '3px' : '1px',
                        //if we want to set the center of each company in the dead center of the circle (instead of the lower left corner as it is now):
                        'margin-left': -1 * size/2,
                        'margin-bottom': -1 * size/2
                    })
                }, company);
        });

        //return a sorted list (desc by valuation), in order to avoid hiding elements by overlapping bigger ones onto them
        return items.sort(function(a,b){ return b.valuation - a.valuation; });
    }

    O.prototype._extractSectors = function(companies) {
        var getName = _.property('name');
        return _.sortBy(_.uniq(_.pluck(companies, 'sector'), getName), getName);
    }

    O.prototype._listenForWindowEvents = function() {
        $(window).on('resize', this.render.bind(this));
    }

    O.prototype._resetWindowEvents = function() {
        $(window).off('resize');
    }

    return O;

    /*-------------------------------------
     * Private Utility functions
     *-------------------------------------*/


    function _convertObjectIntoStyles(obj) {
        var styles = [];
        _.each(_.keys(obj), function(key) {
            styles.push(key + ":" + obj[key]);
        });
        return styles.join(';');
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
}())

var businessService = (function(){
    var businesses = [];

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
        businesses.push(_createCompany(businesses.length+1));
        return businesses;
    }

    function _fetch() {
        return businesses;
    }

    /**
     * Merge 2 companies from the same sector (the 2 first companies from that sector are picked up)
     */
    function _merge() {
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

}())

var view = new BusViz({
    el:'[data-id=view]',
    model: businessService.fetch(),
    sectors: sectors
});
view.render();

//bind controls
var $add = $('[data-id=add]'),
    $merge = $('[data-id=merge]');

$add.click(addCompany);
$merge.click(mergeCompanies);

function addCompany(evt) {
    evt.preventDefault();
    view.setModel(businessService.create());
}

function mergeCompanies(evt) {
    evt.preventDefault();
    view.setModel(businessService.merge());
}

});
