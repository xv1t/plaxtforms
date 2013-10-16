app_templates = {
    cache: true,
    nocache: {
        'template/nocache': true
    },
    get: function(templateName) {
        if (!app.templates.cache || app.templates.nocache[templateName] != undefined)
            $('script[template="' + templateName + '"]').remove();


        if ($('script[template="' + templateName + '"]').length == 0)
        {
            if (app.debug)
                app.log('Load template: ' + templateName)
            // $('#' + templateId).remove();

            $.ajax({
                type: 'POST',
                async: false,
                cache: false,
                timeout: 30000,
                data: {
                    template: templateName
                },
                url: app.baseUrl + '/Tools/template/template(' + templateName.replace('/', '_') + ')',
                success: function(templateHtml) {
                    //app.log(templateHtml);
                    $('head').append(
                            $('<script>')
                            .attr('template', templateName)
                            .attr('type', 'text/html')
                            .html('<!--' + templateName + ' START-->' + "\n<null/>" + templateHtml + "\n" + '<!--' + templateName + ' END-->')
                            ) /*
                             * tag <null/> added for correct result jQuery html()
                             * else result be was with '&lt;'
                             */

                }
            });
        } else {
            //if (app.debug)
            //    app.log('Template ' + templateName + ' allready loaded')
        }
        return $('script[template="' + templateName + '"]').html();
    },
    render: function(template, parameters) {
        return _.template(app.templates.get(template), parameters)
    },
    all: function() {
        return $('script[template]')
    },
    removeAll: function() {
        $('script[template]').remove()
    },
    apply: function(obj, template, parameters) {
        $(obj).html(app.templates.render(template, parameters))
    },
    select: function(selectTemplateName, options) {
        _tmp = $('<div>')
        $(_tmp)
                .append(app.templates.get(selectTemplateName))

        if (options == undefined)
            return $(_tmp).html()

        if (options.val != undefined)
            $(_tmp).find('select [value=' + options.val + ']').attr('selected', 'selected')

        if (options.style != undefined)
            $(_tmp).find('select').attr('style', options.style)

        if (options.class != undefined)
            $(_tmp).find('select').addClass(options.class)

        if (options.id != undefined)
            $(_tmp).find('select').attr('id', options.id)

        if (options.name != undefined)
            $(_tmp).find('select').attr('name', options.name)

        if (options.required != undefined)
            $(_tmp).find('select').attr('required', 'required')



        return $(_tmp).html()

    }
}

app.templates = app_templates