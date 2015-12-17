L.GeometryUtil = L.extend(L.GeometryUtil || {}, {
	// Ported from the OpenLayers implementation. See https://github.com/openlayers/openlayers/blob/master/lib/OpenLayers/Geometry/LinearRing.js#L270
	geodesicArea: function (latLngs) {
		var pointsCount = latLngs.length,
			area = 0.0,
			d2r = L.LatLng.DEG_TO_RAD,
			p1, p2;

		if (pointsCount > 2) {
			for (var i = 0; i < pointsCount; i++) {
				p1 = latLngs[i];
				p2 = latLngs[(i + 1) % pointsCount];
				area += ((p2.lng - p1.lng) * d2r) *
						(2 + Math.sin(p1.lat * d2r) + Math.sin(p2.lat * d2r));
			}
			area = area * 6378137.0 * 6378137.0 / 2.0;
		}

		return Math.abs(area);
	},

	readableArea: function (area, isMetric) {
		var areaStr;

		if (isMetric) {
			if (area >= 10000) {
				areaStr = (area * 0.0001).toFixed(2) + ' ha';
			} else {
				areaStr = area.toFixed(2) + ' m&sup2;';
			}
		} else {
			area /= 0.836127; // Square yards in 1 meter

			if (area >= 3097600) { //3097600 square yards in 1 square mile
				areaStr = (area / 3097600).toFixed(2) + ' mi&sup2;';
			} else if (area >= 4840) {//48040 square yards in 1 acre
				areaStr = (area / 4840).toFixed(2) + ' acres';
			} else {
				areaStr = Math.ceil(area) + ' yd&sup2;';
			}
		}

		return areaStr;
	},

	readableDistance: function (distance,bearing, isMetric) {
		var distanceStr,bearingStr;
		bearingStr='';
		if (bearing >= 0)
		{ 
			bearingStr = ' at '+bearing.toFixed(0)+'°';
		}
		if (isMetric) {
		
			// show metres when distance is < 1km, then show km
			if (distance > 1000) {
				distanceStr = (distance  / 1000).toFixed(2) + ' km' + bearingStr;
			} else {
				distanceStr = Math.ceil(distance) + ' m' + bearingStr;
			}
		} else {
			var nm = distance/1852;

			if (nm > 10.0) distanceStr = nm.toFixed(1) + ' NM' + bearingStr;
			else if (nm > 1.0) distanceStr = nm.toFixed(2) + ' NM' + bearingStr;
			else distanceStr = nm.toFixed(2) + ' NM' + bearingStr;
			
		}
		

		return distanceStr;
	},
	
	 /**
     * Calculate the bearing between two positions as a value from 0-360
     *
     * @param lat1 - The latitude of the first position
     * @param lng1 - The longitude of the first position
     * @param lat2 - The latitude of the second position
     * @param lng2 - The longitude of the second position
     *
     * @return int - The bearing between 0 and 360
     */
    bearing : function (alat1,alng1,alat2,alng2) {
    	var lat1,lng1,lat2,lng2;
    	lat1 = this._toRad(alat1);
    	lng1 = this._toRad(alng1);
    	lat2 = this._toRad(alat2);
    	lng2 = this._toRad(alng2);
        var dLon = (lng2-lng1);
        var y = Math.sin(dLon) * Math.cos(lat2);
        var x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
        var brng = this._toDeg(Math.atan2(y, x));
        return ((brng + 360) % 360);
    },

   /**
     * Since not all browsers implement this we have our own utility that will
     * convert from degrees into radians
     *
     * @param deg - The degrees to be converted into radians
     * @return radians
     */
    _toRad : function(deg) {
         return deg * Math.PI / 180;
    },

    /**
     * Since not all browsers implement this we have our own utility that will
     * convert from radians into degrees
     *
     * @param rad - The radians to be converted into degrees
     * @return degrees
     */
    _toDeg : function(rad) {
        return rad * 180 / Math.PI;
    }
});