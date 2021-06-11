//document.getElementsByClassName('test')
//document.getElementById('main').getElementsByClassName('test')
//var el = document.querySelector("div.user-panel:not(.main) input[name='login']");

function onPageLoad(callback) { 
    if (
        document.readyState === "complete" ||
        (document.readyState !== "loading" && !document.documentElement.doScroll)
    ) {
        callback();
    } else {
        document.addEventListener("DOMContentLoaded", callback);
    }

}

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

onPageLoad(function(){
    var app = new App();
    var page = new Page();
    var startTime = (new Date()).getTime();

    page.collectTemplates();

    app.setCourse("A1")
    var updateLoop = setInterval(function(){
        navigator.geolocation.getCurrentPosition(function(position){
            var now = (new Date()).getTime();
            app.addPoint(position.coords, now)

            _.mapObject(app.currentData(), function(value, key) {
                $("#" + key).html(roundDecimals(value, 2))
            });

            page.renderTemplate({app: app})
        });

        //if( (new Date()).getTime() - startTime > 10000){
        //    clearInterval(updateLoop);
        //}
    }, 1000)


    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the button that opens the modal
    var btn = document.getElementById("actions");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on the button, open the modal
    if(btn) {
        btn.onclick = function() {
            modal.style.display = "block";
        }

        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
            modal.style.display = "none";
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            console.log(event.target)
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

        $("form").submit(function(e, data){
            e.preventDefault();
            //console.log($(this).serializeArray());
            app.setCourse(document.getElementById("chooseCourse_course").value)
            modal.style.display = "none";
            //app.submitEvent($(this).attr('id'), e);
        });
    }
});
