/**
 * Created by JMartinez on 5/21/2015.
 */

$('a.toggle').click(function(){
    $('a.toggle i').toggleClass('icon-chevron-left icon-chevron-right');
    $('#mapCanvas').toggleClass('col-sm-9 col-lg-9 col-sm-12 col-lg-12');
    $('#sidebar').toggle();
    map.invalidateSize();
    return false;
});




var app = angular.module("app", []);
app.controller('block-groups-ctrl', function($scope, $http){

    //scope variables

    $scope.dataTable = ['Demographics', 'Income'];
    $scope.selectedDataTable = $scope.dataTable[0];
    $scope.checked = false;
    $scope.routeChecked = false;
    $scope.stopsChecked = false;
    $scope.storesChecked = false;
    var mapById = d3.map();
    var percent = d3.format(",.1%");


    //get input control data

    $scope.$watch('selectedDataTable', function(nv,ov){
        if($scope.selectedDataTable == 'Demographics'){
            //request demographic input control data
            $http.get('php/races.php')
                .success(function(response){
                    var out = [];
                    response.forEach(function(cv, index, arr){
                        out.push(cv.race);
                    });
                    $scope.categories = out;
                });
            $http.get('php/age-sex-grp.php')
                .success(function(response){
                    var out = [];
                    response.forEach(function(cv, index, arr){
                        out.push(cv.age_sex_grp);
                    });
                    $scope.ageGrp = out;
                });

        }
        else{
            //request income input control data
            $http.get('php/income-grp.php')
                .success(function(response){
                    var out = [];
                    response.forEach(function(cv, index, arr){
                        out.push(cv.income_grp);
                    });
                    $scope.categories = out;
                });
            $http.get('php/age-grp.php')
                .success(function(response){
                    var out = [];
                    response.forEach(function(cv, index, arr){
                        out.push(cv.age_grp);
                    });
                    $scope.ageGrp = out;
                });
        }

    });

    $scope.$watch('checked', function(nv, ov){
        if(nv !== ov){
            if(nv === true){
                addChurches();
            }
            else{
                g.selectAll(".church")
                    .remove();
            }

        }
    });

    $scope.$watch('routeChecked', function(nv, ov){
        if(nv !== ov){
            if(nv === true){
                addRoutes();
            }
            else{
                g.selectAll(".routes")
                    .remove();
            }

        }
    });

    $scope.$watch('stopsChecked', function(nv, ov){
        if(nv !== ov){
            if(nv === true){
                addStops();
            }
            else{
                g.selectAll(".stops")
                    .remove();
            }

        }
    });

    $scope.$watch('storesChecked', function(nv, ov){
        if(nv !== ov){
            if(nv === true){
                addSupermarkets();
            }
            else{
                g.selectAll(".superMarkets")
                    .remove();
            }

        }
    });


    $scope.query = function(){

        if($scope.selectedDataTable === 'Demographics'){
           var dataToSend = {race: $scope.selectedCategory, ageGrp: $scope.selectedAgeGrp};

           $http.post('php/query-demographics.php', dataToSend)
               .success(function(response){
                   setMap(response);

                   //console.log(response)
               })

       }
        else{
           var dataToSend = {race: $scope.selectedCategory, ageGrp: $scope.selectedAgeGrp};

           $http.post('php/query-income.php', dataToSend)
               .success(function(response){
                   setMap(response); //call d3 function that will color map

                   //console.log(response);
               })
       }

    }

    //Added to force a hard reset by button. Feature requested by CAM. Added by Shawn Matthews 12/1/2015
    $scope.reload = function(){
        location.reload();
    };


    //build map
    var MapBoxOutdoors = L.tileLayer('http://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Imagery from <a href="http://mapbox.com/about/maps/">MapBox</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: 'abcd',
        id: 'mapbox.outdoors',
        accessToken: 'pk.eyJ1IjoiZHJjMGciLCJhIjoiY2lvbG44bXR6MDFxbHY0amJ1bTB3bGNqdiJ9.yVn2tfcPeU-adm015g_8xg'
    });

    map = L.map("mapCanvas", {
        zoom: 10,
        center: new L.LatLng(39.79, -105),
        layers: [MapBoxOutdoors]
    });

    //L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    //draw controls

    //var drawnItems = new L.FeatureGroup();
    //map.addLayer(drawnItems);
    //
    //var drawControl = new L.Control.Draw({
    //    draw: {
    //        position: 'topleft',
    //        polygon: {
    //            title: 'Draw a sexy polygon!',
    //            allowIntersection: false,
    //            drawError: {
    //                color: '#b00b00',
    //                timeout: 1000
    //            },
    //            shapeOptions: {
    //                color: '#bada55'
    //            },
    //            showArea: true
    //        },
    //        polyline: {
    //            metric: false
    //        },
    //        circle: {
    //            shapeOptions: {
    //                color: '#662d91'
    //            }
    //        }
    //    },
    //    edit: {
    //        featureGroup: drawnItems
    //    }
    //});
    //map.addControl(drawControl);
    //
    //map.on('draw:created', function (e) {
    //    var type = e.layerType,
    //        layer = e.layer;
    //
    //    if (type === 'marker') {
    //        layer.bindPopup('A popup!');
    //    }
    //
    //    drawnItems.addLayer(layer);
    //});

    //load data


    var svg = d3.select(map.getPanes().overlayPane).append("svg");
    var g = svg.append("g").attr("class", "leaflet-zoom-hide");

    function loadShapes(error, blockGrp){
        //console.log(blockGrp);
        var shape = topojson.feature(blockGrp, blockGrp.objects.drcog_bg);

        var transform = d3.geo.transform({point: projectPoint}),
            path = d3.geo.path().projection(transform);

        var feature = g.selectAll("path")
            .data(shape.features)
            .enter()
            .append("path")
            .attr("class", "base zones");

        var title= feature.append("svg:title")
            .attr("class", "pathTitle");


        map.on("viewreset", reset);
        reset();

        function reset() {
            var bounds = path.bounds(shape), topLeft = bounds[0],
                bottomRight = bounds[1];

            svg .attr("width", bottomRight[0] - topLeft[0])
                .attr("height", bottomRight[1] - topLeft[1])
                .style("left", topLeft[0] + "px")
                .style("top", topLeft[1] + "px");

            g   .attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

            feature.attr("d", path);

            try{
                g.selectAll("circle").attr("cx", function(d){
                    var x = d.lon;
                    var y = d.lat;
                    var coord = map.latLngToLayerPoint(new L.LatLng(y,x));
                    return coord.x;
                }).attr("cy", function(d){
                    var x = d.lon;
                    var y = d.lat;
                    var coord = map.latLngToLayerPoint(new L.LatLng(y,x));
                    return coord.y;
                });
                g.selectAll(".routes")
                    .attr("d", path.pointRadius(function(d){return 2;}));
                g.selectAll(".stops")
                    .attr("d", path);


            }
            catch(e)
            {
                console.log(e);
            }


        }

        function projectPoint(x, y) {
            var point = map.latLngToLayerPoint(new L.LatLng(y, x));
            this.stream.point(point.x, point.y);
        }

    }

    function setMap(data){
        var pctArr = [];
        data.forEach(function(cv, index, arr){
           mapById.set(cv.GEOid2, {
               "county":cv.county,
               "grp_tot":cv.grp_tot,
               "tot_dem":cv.tot_dem,
               "tot_inc":cv.tot_inc,
               "pct":cv.pct
           });
           pctArr.push(cv.pct)
        });
        var max = Math.max.apply(null, pctArr);
        console.log(max);
        quantize.domain([0,max]);

        d3.json('data/drcog_bg14.json', function(error, blkGrp){
            var shape = topojson.feature(blkGrp, blkGrp.objects.drcog_bg);
            var feature = g.selectAll("path")
                //.attr("class", "")

            feature
                .data(shape.features)
                .attr("class", function(d){
                    try{
                        return quantize(mapById.get(d.properties.GEOID).pct) + " zones";
                    }
                    catch(e){
                        return "empty";
                    }
                });

            d3.selectAll(".pathTitle")
                .data(shape.features)
                .text(function(d){
                    try{
                        return "Total Pop: " + mapById.get(d.properties.GEOID).tot_dem + "\n" +
                                "Total HH: "  + mapById.get(d.properties.GEOID).tot_inc + "\n" +
                                "Query Pop: " + mapById.get(d.properties.GEOID).grp_tot + "\n" +
                                "Pct: " + percent(mapById.get(d.properties.GEOID).pct) + "\n" +
                                "County: " + mapById.get(d.properties.GEOID).county;
                    }
                    catch(e){
                        return "N/A";
                    }

                });
        });
    }
    function addChurches(){
        d3.csv('data/churches.csv', function(error, churches){
            var churches = g.selectAll("circle")
                .data(churches)
                .enter()
                .append("circle")
                .attr("class", "church")
                .attr("r", 3)
                .attr("cx", function(d){
                    var x = d.lon;
                    var y = d.lat;
                    var coord = map.latLngToLayerPoint(new L.LatLng(y,x));
                    return coord.x;
                })
                .attr("cy", function(d){
                    var x = d.lon;
                    var y = d.lat;
                    var coord = map.latLngToLayerPoint(new L.LatLng(y,x));
                    return coord.y;
                })

            churches.append("svg:title")
                .text(function(d){return d.name;});

        });
    }

    function addSupermarkets(){
        d3.csv('data/supermarkets.csv', function(error, stores){
            var stores = g.selectAll("circle")
                .data(stores)
                .enter()
                .append("circle")
                .attr("class", "superMarkets")
                .attr("r", 3)
                .attr("cx", function(d){
                    var x = d.lon;
                    var y = d.lat;
                    var coord = map.latLngToLayerPoint(new L.LatLng(y,x));
                    return coord.x;
                })
                .attr("cy", function(d){
                    var x = d.lon;
                    var y = d.lat;
                    var coord = map.latLngToLayerPoint(new L.LatLng(y,x));
                    return coord.y;
                });

            stores.append("svg:title")
                .text(function(d){return d.name;});

        });
    }

    function addRoutes(){
        d3.json('data/routes.json', function(error, routes){

            var shape = topojson.feature(routes, routes.objects.routes2);
            var transform = d3.geo.transform({point: projectPoint}),
                path = d3.geo.path().projection(transform);

            var routes = g.selectAll(".routes")
                .data(shape.features)
                .enter()
                .append("path")
                .attr("class", "routes")
                .attr("d", path);



            function projectPoint(x, y) {
                var point = map.latLngToLayerPoint(new L.LatLng(y, x));
                this.stream.point(point.x, point.y);
            }

        });


    }

    function addStops(){
        d3.json('data/stops.json', function(error, stops){

            var shape = topojson.feature(stops, stops.objects.stops2);
            var transform = d3.geo.transform({point: projectPoint}),
                path = d3.geo.path().projection(transform).pointRadius(function(d){return 2;});

            var stops = g.selectAll(".stops")
                .data(shape.features)
                .enter()
                .append("path")
                .attr("class", "stops")
                .attr("d", path);



            function projectPoint(x, y) {
                var point = map.latLngToLayerPoint(new L.LatLng(y, x));
                this.stream.point(point.x, point.y);
            }

        });


    }


//variables for map classification
    var quantize = d3.scale.quantize()
        .range(d3.range(7).map(function(i){return "q" + i + "-7";}));

    //initial map load
    queue().defer(d3.json, 'data/drcog_bg14.json').await(loadShapes);

    $('#zoomToFullExtent').click(function(){
        map.setView([39.75, -104.95], 10);
    });

});