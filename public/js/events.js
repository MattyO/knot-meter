function collectTemplates(){
    var templateMap = {};

    $('.template').each(function(){
        var id = _.uniqueId("template_");
        var templateContent = $(this).html();

        templateMap[id] = templateContent;
        $(this).replaceWith('<div id="' + id + '"></div>')
    })

    return templateMap;
}

function renderTemplate(templateMap, data) {
    _.mapObject(templateMap, function(value, key){
        var compiled = _.template(value);
        var element = $("#" + key)


        element.html(compiled(data));
    });
}

$(document).ready(function(){
    var app = new App()
    var startTime = (new Date()).getTime();
    var templateMap = collectTemplates();

    app.setCourse("S1")
    var updateLoop = setInterval(function(){
        navigator.geolocation.getCurrentPosition(function(position){
            var now = (new Date()).getTime();
            app.addPoint(position.coords, now)

            _.mapObject(app.currentData(), function(value, key) {
                $("#" + key).html(value)
            });

            renderTemplate(templateMap, {app: app })
        });

        if( (new Date()).getTime() - startTime > 10000){
            clearInterval(updateLoop);
        }
    }, 1000)
});

