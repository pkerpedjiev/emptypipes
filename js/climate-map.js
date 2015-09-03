function ClimateMapViewer() {
    var self = this;

    self.weatherTypeIndeces = {
        'sun': 0,
        'high C': 1,
        'low C': 2,
        'precipitation mm': 3,
        'snow cm': 4
    };    // the indeces into the weather type in the input consolidated weather array

    self.colorScales =  {
    sun: d3.scale.linear()
    .domain([0,400])
    .range(['#252525', '#FFFF42']),

    'rain mm':  d3.scale.linear()
    .domain([0,149, 242, 330])
    .range(['#FFFFFF', '#18FF18', '#008800', '#006600']),

    'precipitation mm':  d3.scale.linear()
    .domain([0,149, 242, 330])
    .range(['#FFFFFF', '#18FF18', '#008800', '#006600']),

    'mean C':  d3.scale.linear()
    .domain([-88.3, -42, 4.5, 48])
    .range(['#000009', '#0202FF', '#FFFFFF', '#A50000']),

    'low C':  d3.scale.linear()
    .domain([-88.3, -42, 4.5, 48])
    .range(['#000009', '#0202FF', '#FFFFFF', '#A50000']),

    'high C':  d3.scale.linear()
    .domain([-88.3, -42, 4.5, 48])
    .range(['#000009', '#0202FF', '#FFFFFF', '#A50000']),

    'snow cm':  d3.scale.linear()
    .domain([0,17.8,86.4])
    .range(['#FFFFFF', '#0000F4', '#000030'])
    };

    self.currentColorScale = self.colorScales['sun'];
    self.currentWeatherType = 'sun';

    var ClimateDataTypeModel = Backbone.Model.extend( {
        defaults: {
            "months": ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                       // the months for which to display the weather data
                       // can be changed by the ciruclar brush
            "data": "sun",
                    // The type of data to display (e.g. sun, precipitation, etc..)
                    // can be changed using a series of selection boxes
            "compareTo": null
                    // if we click on a city, we should be able to see how its
                    // weather compares to that of every other city on the globe
        }
    });

    var WeatherMapTypeView = Backbone.View.extend( {
        el: ".weather-type",
        events: {
           'change input[type=radio]': 'changedRadio' 
        },

        changedRadio: function(d) {
            self.currentWeatherType = $('input[type=radio]:checked').val();
            self.currentColorScale = self.colorScales[self.currentWeatherType];
            self.updateMonthFilter(myMonthSelectorChart.monthFilterPrev());
        }
    });


    $(function() {
        var weatherMapTypeView = new WeatherMapTypeView();
    });


    self.monthFilteredText = function(monthFilter) {
        console.log('getting monthFilter');

        return function(point) {
            console.log('point:', point);

            if (typeof(point) == 'undefined')
                return '';

            var total = 0;

            for (var i = 0; i < monthFilter.length; i++)
            total += point.cclim[monthFilter[i]-1][self.weatherTypeIndeces[self.currentWeatherType]];

            if (monthFilter.length === 0)
                monthFilter.length = 1; //avoid division by zero in the next step

            if (self.currentWeatherType == 'high C' || self.currentWeatherType == 'low C')
                return "Average " + self.currentWeatherType + ": " + Math.floor(total / monthFilter.length);
            else
                return "Total " + self.currentWeatherType + ": " + Math.floor(total);
        };
    };


    self.updateMonthFilter = function(monthFilter) {
        var monthFilteredFill = function(point) {
            var total = 0;

            if (typeof(point) == 'undefined')
                return;

            var point = point.point;
            for (var i = 0; i < monthFilter.length; i++) {
                total += point.cclim[monthFilter[i]-1][self.weatherTypeIndeces[self.currentWeatherType]];
            }

            if (monthFilter.length === 0)
                return self.currentColorScale(0);
            else {
                return self.currentColorScale(total / monthFilter.length);
            }
        };


        d3.selectAll('.voronoi-border-path')
        .attr('fill',  monthFilteredFill);

        /*
        d3.selectAll('.label-text-climate')
        .text(monthFilteredText);
        */
    };

    self.monthSelectorChart = function(selection) {
        var innerWidth = 20;
        var outerWidth = 35;
        var monthFilterPrev = [1,2,3,4,5,6,7,8,9,10,11,12];
        var monthFilterChanged = self.updateMonthFilter;

        function render(selection) {
            piebrush = d3.svg.circularbrush();
            var months = [[1,'J', 'Jan'],[2,'F', 'Feb'],[3,'M', 'Mar'],[4,'A','Apr'],
                [5,'M','Mar'],[6,'J', 'Jun'], [7,'J', 'Jul'],[8,'A', 'Aug'],
                [9,'S','Sep'], [10,'O','Oct'],[11,'N','Nov'],[12,'D','Dec']];
                piebrush
                .range([0, months.length])
                .innerRadius(innerWidth)
                .outerRadius(outerWidth)
                .on("brushstart", pieBrushStart)
                .on("brushend", pieBrushEnd)
                .on("brush", pieBrush)
                .extent([0.3,0.22]);

                var startBrushData = [{class: "extent",
                    endAngle: 6.3538161040516234,
                    startAngle: 0.132537999873459,},
                    {
                        class: "resize e",
                        endAngle: 0.132537999873459,
                        startAngle: -0.06746200012654102
                    },
                    {
                        class: "resize w",
                        endAngle: 6.553816104051624,
                        startAngle: 6.3538161040516234,
                    }];



                    var pie = d3.layout.pie().value(function(d) {return 1}).sort(function(a,b) { return a[0] - b[0]; });

                    var pieArc = d3.svg.arc().innerRadius(innerWidth).outerRadius(outerWidth);

                    var gCircularSelector = selection.append("g")
                    .attr("class", "piebrush");

                    gCircularSelector.selectAll("path")
                    .data(pie(months))
                    .enter()
                    .append("path")
                    .attr("class", "piemonths")
                    .classed('selected', true)
                    .attr("d", pieArc)
                    .attr('id', function(d) { return 'arc' + d.data; })
                    .on("click", function(d) {console.log(d)});

                    gCircularSelector.selectAll('text')
                    .data(months)
                    .enter()
                    .append('text')
                    .attr('x', 4)
                    .attr('dy', 12)
                    .append("textPath")
                    .attr('xlink:href', function(d) { return '#arc' + d; })
                    .text(function(d) { return d[1]; })
                    .classed('month-label', true);

                    selection
                    .append("g")
                    .call(piebrush);

                    gCircularSelector.selectAll('path.circularbrush')
                    .each(function(d) { console.log('x', d); })
                    .data(startBrushData);

                    function pieBrush() {
                        d3.event.stopPropagation();

                        d3.selectAll("path.piemonths")
                        //.style("fill", piebrushIntersect);
                        .classed('selected', piebrushIntersect);

                        var _m = d3.mouse(d3.select("g.piebrush").node());

                        d3.selectAll(".brushhandle")
                        .attr("cx", _m[0])
                        .attr("cy", _m[1])
                        .attr("x2", _m[0])
                        .attr("y2", _m[1]);

                        var monthFilter = d3.selectAll("path.piemonths.selected")
                        .data()
                        .map(function(d) { return d.data[0]; });

                        monthFilterChanged(monthFilter);

                        monthFilterChanged(monthFilter);
                        monthFilterPrev = monthFilter;
                        /*
                        monthFilter.sort()
                        if (monthFilter.length != monthFilterPrev.length) {
                            monthFilterChanged(monthFilter);
                            monthFilterPrev = monthFilter;
                        } else {
                            for (var i = 0; i < monthFilter.length; i++) {
                                if (monthFilter[i] != monthFilterPrev[i]) {
                                    monthFilterChanged(monthFilter);
                                    monthFilterPrev = monthFilter;
                                }
                            }
                        }
                        */

                    }

                    function piebrushIntersect(d,i) {
                        var _e = piebrush.extent();

                        if (_e[0] < _e[1]) {
                            var intersect = (d.data[0] >= _e[0] && d.data[0] <= _e[1]);
                        }
                        else {
                            var intersect = (d.data[0] >= _e[0]) || (d.data[0] <= _e[1]);      
                        }

                        return intersect; // ? "rgb(241,90,64)" : "rgb(231,231,231)";
                    }


                    function pieBrushStart() {
                        d3.event.stopPropagation();

                        d3.select("g.piebrush")
                        .append("line")
                        .attr("class", "brushhandle")
                        .style("stroke", "brown")
                        .style("stroke-width", "2px");

                        d3.select("g.piebrush").append("circle")
                        .attr("class", "brushhandle")
                        .style("fill", "brown")
                        .attr("r", 5);

                    }

                    function pieBrushEnd() {

                        d3.selectAll(".brushhandle").remove();
                    }
        }

        render.innerWidth = function(_) {
            if (!arguments.length) return innerWidth;
            innerWidth = _;
            return chart;
        };

        render.outerWidth = function(_) {
            if (!arguments.length) return outerWidth;
            outerWidth = _;
            return chart;
        };

        render.monthFilterChanged = function(_) {
            if (!arguments.length) return monthFilterChanged;
            monthFilterChanged = _;
            return chart;
        };

        render.monthFilterPrev = function(_) {
            if (!arguments.length) return monthFilterPrev;
            monthFilterPrev = _;
            return chart;
        };

        return render;
    }

    self.weatherTypeControl = L.control({
        position: 'topright',
    });

    self.weatherTypeControl.onAdd = function( map ) {

        var div = L.DomUtil.create('div', 'weather-type');

        var a = L.DomUtil.create('a', 'leaflet-control-layers-toggle', div);
        var form = L.DomUtil.create('form', 'leaflet-control-layers-list', div);
        var group = L.DomUtil.create('div', 'form-group', form);

        //var weatherTypes = ['sun', 'precipitation mm', 'high C', 'mean C', 'low C', 'rain mm', 'snow cm'];
        var weatherTypes = ['sun', 'precipitation mm', 'high C', 'low C', 'snow cm'];
        radioHtml = '';
        for (var i = 0; i < weatherTypes.length; i++) {
            radioHtml += '<label style="display: block;"><input type="radio" style="position: relative" name="weatherTypeRadio" value="' + weatherTypes[i] + '"><span class="weather-type-option">' + weatherTypes[i] + '</span></label>';
        }

        group.innerHTML += radioHtml;

        return div;
    };

    self.weatherTypeControl._initLayout = function() {
        var form = this._form = L.DomUtil.create('form', className + '-list');
    };

    var myMonthSelectorChart = self.monthSelectorChart();

    self.drawClimateMap = function(divName) {
        //var map = L.map('isochroneMap').setView([48.2858, 6.7868], 4);
        var initialLat = 39.74;
        var initialLon = 0.99;

        var southWest = L.latLng(-90, -180),
            northEast = L.latLng(90, 180),
                bounds = L.latLngBounds(southWest, northEast);

        var map = new L.Map(divName, {
            center: new L.LatLng(initialLat, initialLon),
            maxBounds: bounds,
            minZoom: 1,
            zoom: 1 
        });

        //var layer = new L.StamenTileLayer("toner");
        //map.addLayer(layer);
        cartoDbBaseLayer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',{
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
        }).addTo(map);

        var topPane = map._createPane('leaflet-top-pane', map.getPanes().mapPane);
        //var topLayerLines = new L.StamenTileLayer('toner-lines', {'opacity': 0.8});

        self.weatherTypeControl.addTo(map);
        d3.select('.layer-image')
        .attr('src', '/img/layers.svg');
        //map.addLayer(topLayerLines);
        //topPane.appendChild(topLayerLines.getContainer());
        //topLayerLines.setZIndex(7);

        var topLayerLabels = new L.tileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
            maxZoom: 17
        }).addTo(map);
        topPane.appendChild(topLayerLabels.getContainer());
        topLayerLabels.setZIndex(7);

        var width=550, height=400;
        //var defaultContourColor = 'transparent';
        var defaultContourColor = 'black';
        var defaultContourWidth = 1;

        // Initialize the SVG layer
        map._initPathRoot();
        map.fitBounds(bounds);

        // We pick up the SVG from the map object
        var svg = d3.select("#" + divName).select("svg");
        var gMain = svg.append("g").attr("class", "leaflet-zoom-hide").attr('opacity', 1.0);

        var otherSvg = d3.select("#" + divName).append('svg').attr('width', width).attr('height', height).style('position', 'relative').style('z-index', 7).attr('pointer-events', 'none');


        otherSvg.append('g')
        .attr('transform', 'translate(508,340)')
        .attr('pointer-events', 'all')
        .call(myMonthSelectorChart);

        var gVoronoi = gMain.append('g');
        var gMapLines = gMain.append('g');
        var gCityPoints = gMain.append('g');
        var gLayerControl = otherSvg.append('g');

        var divWeatherType = d3.select('#' + divName)
        .select('.weather-type')
        .on('mouseleave', function(d1) {
            var thisNode = d3.select(this);

            d3.event.stopPropagation();
            thisNode.classed('leaflet-control-layers-expanded', false);
        });

        divWeatherType
        .classed('leaflet-control-layers', true)
        .classed('leaflet-control', true)
        .attr('aria-haspopup', 'true');


        d3.select('.leaflet-control-layers-toggle')
        .on('mouseenter', function(d) {
            var thisParent = d3.select(this.parentNode);

            d3.event.stopPropagation();
            thisParent.classed('leaflet-control-layers-expanded', true);
        });

        /*
        var divLayerControl = d3.select('#' + divName)
        .select('.leaflet-control-container')
        .selectAll('.leaflet-top')
        .filter('.leaflet-right')
        .append('div')
        .on('mouseover', function(d) {
            console.log('hey');
        })
        .classed('weather-toggle', true)
        .classed('leaflet-control', true)
        .append('img')
        .classed('layer-image', true)
        .attr('src', '/img/layers.svg')
        .attr('pointer-events', 'all')
        */

        queue()
        .defer(d3.json, "/jsons/sunshine_map/countries.geo.json")
        .defer(d3.json, "/jsons/sunshine_map/climate_consolidated.json")
        .await(ready);

        var fill = d3.scale.category10();

        var voronoi = d3.geom.voronoi()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; });
        //.clipExtent([[0, 0], [width, height]]);

        function ready(error, us, climate) {
            console.log(us,  climate);

            climate.forEach(function(d) {
                var latlng = new L.LatLng(d.lat, d.lon);
                var point = map.latLngToLayerPoint(new L.LatLng(+d.lat, +d.lon));
               
                d.x = point.x;
                d.y = point.y;
            });


            var cityPointsGs = gCityPoints.selectAll('.city-point')
            .data(climate)
            .enter()
            .append('g')
            .attr('class', function(d) { return 'd' + d.lat.toString().replace('.','_') + d.lon.toString().replace('.','_'); })
            .classed('city-point', true);

            cityPointsGs.append('circle')
            .attr('r', 3)
            .classed('city-circle', true);

            var labelText = cityPointsGs.append('text')
            .attr('dy', 4)
            .attr('text-anchor', function(d) {
                if (d.lon < 0)
                    return 'start';
                else
                    return 'end';
            })
            .classed('label-text', true);

            function labelPositionX(d) {
                if (d.lon < 0)
                    return 6;
                else
                    return -6;
            }


            labelText
            .append('tspan')
            .attr('x', labelPositionX)
            .attr('y', -10)
            .classed('label-text-name', true)
            .text(function(d) { return d.name; });

            labelText
            .append('tspan')
            .attr('x', labelPositionX)
            .attr('y', 10)
            .classed('label-text-climate', true);

            //.text(function(d) { return d.name; });

            var buildPathFromPoint = function(point) {
                if (typeof(point) != 'undefined')
                    return "M" + point.join("L") + "Z";
                else
                    return "";
            };


            var cellPathFill = function(point) {
                return self.currentColorScale(point.climate.Jan.sun);
            };

            var transform = d3.geo.transform({point: projectPoint}),
                path = d3.geo.path().projection(transform);

            function projectPoint(x, y) {
                  var point = map.latLngToLayerPoint(new L.LatLng(y, x));
                    this.stream.point(point.x, point.y);
            }

            var feature = gMapLines.selectAll(".map-lines")
            .data(us.features)
            .enter().append("path")
            .classed('map-lines', true);

            function resetView() {
                climate.forEach(function(d) {
                    var latlng = new L.LatLng(d.lat, d.lon);
                    var point = map.latLngToLayerPoint(new L.LatLng(+d.lat, +d.lon));

                    d.x = point.x;
                    d.y = point.y;
                });

                var counter = 0;
                var voronoiPoints = voronoi(climate);
                voronoiPoints.forEach(function(d) {  
                    d.point.cell = d; 
                    counter += 1;
                });


                var voronoiData = gVoronoi.selectAll('.voronoi-border')
                .data(voronoiPoints);

                var voronoiG = voronoiData
                .enter()
                .append('g')
                .attr('class', 'voronoi-border');

                var voronoiBorder = voronoiG
                .append('path')
                .classed('voronoi-border-path', true);
                
                voronoiData.exit()
                .remove();
                
                //g.selectAll('.voronoi-border')
                gVoronoi.selectAll('.voronoi-border').select('path')
                .attr("d", buildPathFromPoint)
                .on('mouseover', function(d) {
                    d3.select(this).classed('selected', true);
                    var labelSelect = d3.select('.d' + d.point.lat.toString().replace('.', '_') + d.point.lon.toString().replace('.','_'));
                    labelSelect.selectAll('.label-text-climate').text(self.monthFilteredText(myMonthSelectorChart.monthFilterPrev()));

                    labelSelect.classed('selected', true);
                })
                .on('mouseout', function(d) {
                    d3.select(this).classed('selected', false);
                    d3.select('.d' + d.point.lat.toString().replace('.', '_') + d.point.lon.toString().replace('.', '_')).classed('selected', false);
                })
                .on('click', function(d) { console.log('d', d.point); }); 
                //.attr('fill',  cellPathFill)
                //
                self.updateMonthFilter(myMonthSelectorChart.monthFilterPrev());

                gCityPoints.selectAll('.city-point')
                .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')';});

                feature.attr("d", path);
            }

            map.on("viewreset", resetView);
            resetView();
        }
    }
}
