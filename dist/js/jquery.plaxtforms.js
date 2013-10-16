$.fn.logToConsole = function(comment) {
    if (comment != undefined)
        app.log(comment);
    app.log(this);
    return this;
}
$.fn.myWindow = function() {
    return $(this).closest('.window_panel');
}
$.fn.myWindowH = function() {
    return $.window.getWindow($(this).closest('.window_panel'))
}
/*
 * Для tr,
 * Делает эьлй строке единственное выделение
 * @returns {$.fn}
 */
$.fn.setSelected = function() {
    $(this)
            .closest('tbody')
            .find('tr.selected_row')
            .removeClass('selected_row')

    $(this).addClass('selected_row')

    return this;
}
/*
 * 
 * @param {type} param1
 * @param {type} param2
 * @returns {$.fn|@exp;@call;$@pro;find@call;@call;render}
 * Render a template
 */
$.fn.render = function(param1, param2, param3) {
    templateName = null
    options = null

    if (typeof param1 == 'string') {
        templateName = param1
        if (typeof param2 == 'string') {
            /*
             * Загрузка шаблона в контейнер другого шаблона
             */
            templateName2 = param2
            options = param3
            return $(this)
                    .find('[template="' + templateName + '"]')
                    .html(app.templates.render(templateName2, options))
        } else {
            options = param2
            return $(this)
                    .find('[template="' + templateName + '"]')
                    .render(options)
        }


    } else {
        options = param1
        templateName = $(this).attr('template')
        if (templateName != null) {
            $(this).html(
                    app.templates.render(templateName, options)
                    )
        }
    }




    return this;
}