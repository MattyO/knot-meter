class Page{
    templateMap = {}

    elements(selector) {
        return document.querySelectorAll(selector);
    }

    getById(id){
        return document.getElementById(id);
    }

    newElement(elementText){
        return document.createElement(elementText);
    }

    replace(selector, newNode){
    }

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

    replaceElement(element, withString){
        $(element).replaceWith(withString)
    }

    collectTemplates(){
        var that = this;

        _.each(this.elements('.template'), function(element){
            var id = _.uniqueId("template_");
            var templateContent = element.innerHTML();

            that.templateMap[id] = templateContent;
            that.replaceElement(element, '<div id="' + id + '"></div>')
        })

    }
    

    renderTemplate(data) {
        _.mapObject(this.templateMap, function(value, key){
            var compiled = _.template(value);
            var element = this.getById("#" + key)


            element.innerHTML = compiled(data);
        });
    }
}
