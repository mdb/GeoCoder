if (typeof GC === 'undefined' || !GC) {
    var GC = {};
}

GC = (function ($, options) { 
    var _self,
        geocoder = new google.maps.Geocoder(),
        infoWindow = new google.maps.InfoWindow(),
        map,
        markers = [],
        config = {
            latlng: new google.maps.LatLng(39.958, -75.163),
            zoom: 14,
        };

    if (options) {
        $.extend(config, options);
    }

    // helpers
    function deleteMarkers(array) {
        var i;

        if (array) {
            for (i=0; i<= array; i++) {
                array[i].setMap(null);
            }
        }
    }

    // public methods
    _self = {

        // set things up with a map
        init: function(mapId) {
            _self.setUpMap(mapId);
            _self.setUpClickHandlers();
        },

        setUpMap: function (mapId) {
            var options = {
                zoom: config.zoom,
                center: config.latlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            },
            mapElem = document.getElementById(mapId);
            map = new google.maps.Map(mapElem, options);
            google.maps.event.addListener(map, 'dragstart', function() {
                infoWindow.close();
            });
        },

        setUpClickHandlers: function () {
            var submitButton = $('input.submit'),
                addrs;

           submitButton.click(function () {
               addrs = $('input.addr').val();

               _self.sendGeoCodeRequests(addrs)
               return false;
            });
        },

        resetApp: function () {
            deleteMarkers(markers);
        },

        sendGeoCodeRequests: function (addrs) {
            var addrs = addrs.split(/\r\n|\r|\n/),
                length = addrs.length;

            $.each(addrs, function (index, value) {
                console.log('VALUE', value);
                geocoder.geocode({
                    'address': value,
                }, function (results, status) {
                    _self.buildMap(results, status)
					_self.reportGeoCodes(results[0].formatted_address + ',' + results[0].geometry.location.toUrlValue());
                });
            });
        },

        buildMap: function (results, status) {

            if (status == google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);

                _self.addMarker({
                    title: results[0].formatted_address,
                    position: results[0].geometry.location
                });

            } else {
                alert('There was an error');
            }
        },

        addMarker: function (options) {
            var settings = {
                    map: map,
                    animation: google.maps.Animation.DROP,
                    title: options.title,
                    position: options.position
                },
                marker = new google.maps.Marker(settings);

            markers.push(marker);
            _self.addInfoListener(marker);
        },

        addInfoListener: function (marker) {
            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.close();
                infoWindow.setContent(marker.title);
                infoWindow.open(map, marker);
            });
        },

        reportGeoCodes: function (geocodedAddr) {
			$('ul.geocodes').append('<li>' + geocodedAddr + '</li>');
        }
    };

    return _self;
})(jQuery);
