class Page{
    templateMap = {}

    onLoad(callback) { 
        if (
            document.readyState === "complete" ||
            (document.readyState !== "loading" && !document.documentElement.doScroll)
        ) {
            console.log('calling callback');
            callback();
        } else {
            document.addEventListener("DOMContentLoaded", callback);
        }

    }

    collectTemplates(){

        $('.template').each(function(){
            var id = _.uniqueId("template_");
            var templateContent = $(this).html();

            this.templateMap[id] = templateContent;
            $(this).replaceWith('<div id="' + id + '"></div>')
        })

    }

    renderTemplate(data) {
        _.mapObject(this.templateMap, function(value, key){
            var compiled = _.template(value);
            var element = $("#" + key)


            element.html(compiled(data));
        });
    }
}
