var marks = [
    {"name": "S", "latitude": 41.784166667, "longitude": -81.2515 },
    {"name": "A", "latitude": 41.798166667, "longitude": -81.2495 },
    {"name": "B", "latitude": 41.793,       "longitude": -81.236666667 },
    {"name": "C", "latitude": 41.7825,      "longitude": -81.232666667 },
    {"name": "D", "latitude": 41.773,       "longitude": -81.239666667 },
    {"name": "E", "latitude": 41.77,        "longitude": -81.253666667 },
    {"name": "F", "latitude": 41.775333333, "longitude": -81.2665},
    {"name": "G", "latitude": 41.785666667, "longitude": -81.2705 },
    {"name": "H", "latitude": 41.795166667, "longitude": -81.263333333 },
    {"name": "X", "latitude": 41.768,       "longitude": -81.278833333 },
    {"name": "W", "latitude": 41.07,        "longitude": -81.254 },
]

var courses = [
    {"name": "S1",  "marks" : ['S', 'A', 'S', 'A', 'S' ] }
]

function findMark(name){
    var t = _.find(marks, function(m) { return m.name == name; });
    return t;
}

class App {
    course = {"name": "Na",  "marks" : [] } ;
    markIndex = -1;
    points = null;
    isRecording = false;

    constructor() {
        this.points = [];
        this.markIndex = -1;
    }

    get nextMark() {
        return findMark(this.course.marks[this.markIndex])

    }

    currentData() {
        var targetMark = this.nextMark;
        var lastItem = this.points[this.points.length -1]
        var secondToLastItem = this.points[this.points.length -2]

        if( !lastItem || ! secondToLastItem){
            return { };
        }
        var timeDelta = lastItem.time - secondToLastItem.time;

        var tempVmg = vmg(secondToLastItem.position, lastItem.position, targetMark, timeDelta);
        var tempDistance = distance(lastItem.position, targetMark);


        return {
            "heading": bearing(secondToLastItem.position, lastItem.position),
            "bearing": bearing(lastItem.position, targetMark),
            "distance": tempDistance,
            "speed": speed(secondToLastItem.position, lastItem.position, timeDelta),
            "vmg": "NA",
            "eta": "NA", 
        };
    }

    setCourse(name) {
        this.course = _.find(courses, function(c) { return c.name == name; });
        this.markIndex = 0;
    }

    addPoint(point, time){
        this.points.push({"position":point, "time": time})
    }
}


function roundDecimals(number, decimals){
    roundingPlaces = 10 * decimals
    return Math.round(number * roundingPlaces) / roundingPlaces
}

function radians(x) {
    return x / 180 * Math.PI;
}

function findCourse(name){
    return courses[0]
}

function distance(position1, position2){
       var  lat1 = radians(position1.latitude),
            lon1 = radians(position1.longitude),
            lat2 = radians(position2.latitude),
            lon2 = radians(position2.longitude);
       var R = 3440.1
       //var R = 6372.8;

       var dLat = lat2 - lat1;
       var dLon = lon2 - lon1;
       var a = Math.sin(dLat / 2) * Math.sin(dLat /2) + Math.sin(dLon / 2) * Math.sin(dLon /2) * Math.cos(lat1) * Math.cos(lat2);
       var c = 2 * Math.asin(Math.sqrt(a));
       return R * c;

}

function toDegrees(radians) {
  return radians * 180 / Math.PI;
}


function bearing(position1, position2){
  startLat = radians(position1.latitude);
  startLng = radians(position1.longitude);
  destLat = radians(position2.latitude);
  destLng = radians(position2.longitude);

  y = Math.sin(destLng - startLng) * Math.cos(destLat);
  x = Math.cos(startLat) * Math.sin(destLat) -
        Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
  brng = Math.atan2(y, x);
  brng = toDegrees(brng);
  return (brng + 360) % 360;
}


function speed(position1, position2, timeDelta){
    var milisecondsInAnHour = 60 * 60 * 1000
    var d = distance(position1, position2)
    var hours = (timeDelta /  milisecondsInAnHour)

    return d / hours
}

function vmg(position1, currentPosition, targetPosition , timeDelta){
    s = speed(position1, currentPosition, timeDelta)
    b = bearing(position1, currentPosition)
    b_to_mark = bearing(currentPosition, targetPosition)

    bearing_differene = b - b_to_mark;

    return Math.cos(bearing_differene) * s
}

function eta(distance, vmg){
    return distance / vmg
}
