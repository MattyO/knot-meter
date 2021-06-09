describe("radians", function(){
    it("works", function(){
        expect(radians(1)).toBe(1 / 180.0 * Math.PI);
    });
});

describe("findCourse", function() {
    it("works", function(){ 
        expect(findCourse("A1")).toBe(courses[0]);
    })
})

describe("roundDecimals", function(){
    it('rounds to 2 decimals', function(){
        expect(roundDecimals(.851, 2)).toBe(.85)
    });
})


describe("bearing", function() {
    it("works", function(){
        var point1 = { "latitude": 36.12, "longitude": -86.67 }
        var point2= { "latitude": 33.94, "longitude": -118.40 }
        expect(bearing(point1, point2)).toBe(274.59357410546284);
    });
})

describe("distance", function() {
    it("works", function(){
        var point1 = { "latitude": 36.12, "longitude": -86.67 }
        var point2= { "latitude": 33.94, "longitude": -118.40 }

        expect(Math.floor((distance(point1, point2)))).toBe(1558);
    });
});

describe("speed", function(){
    it("works", function(){
        var point1 = { "latitude": 1, "longitude": 0 }
        var point2 = { "latitude": 1, "longitude": 1}
        var milisecondsInAnHour = 60 * 60 * 1000

        expect(Math.floor(speed(point1, point2, milisecondsInAnHour))).toBe(60);
    });
});

describe("vmg", function(){
    it("works", function(){
        var milisecondsInAnHour = 60 * 60 * 1000
        var position1 = { "latitude": 1, "longitude": 0 }
        var currentPosition = { "latitude": 1, "longitude": 1}
        var targetPosition = { "latitude": 2, "longitude": 2}

        expect(Math.floor(vmg(position1 , currentPosition, targetPosition, milisecondsInAnHour))).toBe(30);
    });
})

describe("eta", function(){
    it("works", function(){
        expect(eta(2, 4)).toBe(.5)
    });
});

describe("findMark", function(){
    it("finds B", function(){
        var t = findMark("B");

        expect(t.name).toBe("B");
        expect(t.latitude).toBe(41.793);
    })
    it("finds F", function(){
        var foundMark = findMark("F");
        expect(foundMark.name).toBe("F");
        expect(foundMark.longitude).toBe(-81.2665);
    })
})

describe("App", function(){
    var app = null;

    beforeEach(function(){
        app = new App()
    });

    describe("constructor", function(){
        it('has no points', function(){
            expect(app.points).toEqual([])
            console.log(app)
        })

    });
    
    describe('getCourses', function(){
        it("return the courses", function() {
            expect(app.courses).toEqual(courses)

        })
    });

    describe(".setCourse", function(){
        it("sets in an internal course property", function(){
            app.setCourse("A1")
            expect(app.course.name).toBe("A1")
            expect(app.course.marks).toEqual(['S', 'A', 'S', 'A', 'S' ])
        });

        it("sets the next mark to be the first one", function(){
            app.setCourse("A1")
            expect(app.markIndex).toBe(0)
        })
    });

    describe(".addPoint", function(){
        it("adds the point and time to the points array", function(){
            var now = (new Date()).getTime();
            var d = findMark(marks, "D");

            app.addPoint(d, now)

            expect(app.points.length, 1)
            expect(app.points[0].position).toEqual(d)
            expect(app.points[0].time).toEqual(now)
        });
    });

    describe("nextMark", function(){
        it("returns the first mark after you set the course", function(){
            app.setCourse("A1")
            s = findMark("S")

            expect(app.nextMark).toEqual(s)
        });

        it("returns the make based on the course and index", function(){
            app.setCourse("A1");
            a = findMark("A");

            app.markIndex = 1;

            expect(app.nextMark).toEqual(a);
        })

        it('starts as -1 to designate undefined', function(){
            expect(app.markIndex).toBe(-1)
        })
    })

    describe(".currrentData", function() {
        describe("default", function() {
            it('returns an empty hash', function() {
                expect(app.currentData()).toEqual({})
            })
        });

        describe("with two points", function() {
            beforeEach(function(){
                var milisecondsInAnHour = 60 * 60 * 1000


                var now = (new Date()).getTime();
                var d = findMark("D");
                var a = findMark("A");
                var s = findMark("S");
                var twoHoursgo = now - (2.0 * milisecondsInAnHour)

                app.addPoint(d, twoHoursgo)
                app.addPoint(s, now)
                app.setCourse("A1")
                app.markIndex = 1
            });

            it("heading", function(){
                expect(Math.floor(app.currentData().heading)).toEqual(321)
            });

            it("bearing", function(){
                expect(Math.floor(app.currentData().bearing)).toEqual(6)
            });

            it('distance', function(){
                expect(roundDecimals(app.currentData().distance, 2)).toEqual(.85)
            });

            it('speed', function(){ 
                expect(roundDecimals(app.currentData().speed, 2)).toEqual(.45)
            })

            it('vmg', function(){ 
                //console.log('testing current data vmg')
                //expect(roundDecimals(app.currentData().vmg, 2)).toEqual(.23)
            });

            it('eta', function(){
            });
        });

    });

});

describe('Page', function(){
    beforeEach(function(){
        page = new Page()
    });


    describe('getById', function() {
        it('delegates to the getElementById function', function() {
            element = jasmine.createSpy('element');
            spyOn(document, "getElementById").and.returnValue(element);

            expect(page.getById('testid')).toBe(element);
        });
    });


    describe('onPageLoad', function(){
        beforeEach(function(){
            callbackCalled = false
        });

        it('calls callback when readyState is complete', function(done){
            spyOnProperty(document, "readyState", "get").and.returnValue('complete');

            page.onLoad(function(){
                callbackCalled  = true;
                done();
            });

            expect(callbackCalled).toEqual(true);
        });

        it('calls callback when readyState is not loading and is not doScroll', function(done){
            spyOnProperty(document, "readyState", "get").and.returnValue('notloading');
            spyOnProperty(document, "documentElement", "get").and.returnValue({'doScroll': false});

            page.onLoad(function(){
                callbackCalled  = true;
                done();
            });

            expect(callbackCalled).toEqual(true);
        });
        it('regesters callback to the DOMContentLoaded event', function(){
            spyOnProperty(document, "readyState", "get").and.returnValue('loading');
            addEventListenerSpy = spyOn(document, "addEventListener");
            function callback(){
                callbackCalled  = true;
                done();
            }

            page.onLoad(callback)

            expect(callbackCalled).toEqual(false);
            expect(addEventListenerSpy).toHaveBeenCalledWith("DOMContentLoaded", callback);
        });
    });

    describe('collectTemplates', function(){
        it('replaces the element with a div with a unique id', function(){
            elementMock = jasmine.createSpy('element')
            elementMock.innerHTML = function() {
                return "innerHtmlContent"
            }

            spyOn(page, "elements").and.returnValue([elementMock])
            replaceElementSpy = spyOn(page, "replaceElement")

            page.collectTemplates();

            tempateMapKeys = _.keys(page.templateMap);
            expect(replaceElementSpy).toHaveBeenCalledWith(elementMock, '<div id="#' + tempateMapKeys[0] + '"></div>')
        });

        it('saves a the template content in an array', function(){
            elementMock = jasmine.createSpy('element')
            elementMock.innerHTML = "innerHtmlContent" 

            spyOn(page, "elements").and.returnValue([elementMock])
            spyOn(page, "replaceElement")

            page.collectTemplates();

            tempateMapKeys = _.keys(page.templateMap);
            expect(tempateMapKeys.length).toEqual(1)
            expect(page.templateMap[tempateMapKeys]).toEqual("innerHtmlContent")
        });

    });

    describe('renderTemplate', function(){
        it('sets the elememnt it finds', function(){
            page.templateMap = {'template_1': 'innerHtmlContent'}
            elementMock = jasmine.createSpy('element')
            getByIdSpy = spyOn(page, 'getById').and.returnValue(elementMock)

            page.renderTemplate()

            expect(getByIdSpy).toHaveBeenCalledWith("#template_1")
            expect(elementMock.innerHTML).toEqual("innerHtmlContent")
        })

    });
});
