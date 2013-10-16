app_menu = {
    items: [],
    status: undefined,
    build: function() {

        ul = $('ul#app_menu');
        
        //User menu
        
        //Edit menu

        for (i = 0; i < app.menu.items.length; i++) {
            item0 = app.menu.items[i]

            //app.log(item0)

            li0 = $('<li>').addClass('dropdown')

            icon0 = ''

            if (item0.icon != undefined)
                icon0 = "<i class=" + item0.icon + "></i> "

            a0 = $('<a>')
                    .addClass('dropdown-toggle')
                    .attr('data-toggle', 'dropdown')
                    .html(icon0 + item0.title)
                    .append($('<b>').addClass('caret'))

            if (item0.href == undefined)
                $(a0).attr('href', '#')
            else
                $(a0).attr('href', item0.href)

            $(li0).append(a0)
            if (item0.items != undefined) {
                ul1 = $('<ul>').addClass('dropdown-menu')

                for (j = 0; j < item0.items.length; j++) {

                    item1 = item0.items[j]

                    li1 = $('<li>');

                    icon1 = ''

                    if (item1.icon != undefined)
                        icon1 = "<i class=" + item1.icon + "></i> "

                    a1 = $('<a>').html(icon1 + item1.title);

                    if (item1.href == undefined)
                        $(a1).attr('href', '#')
                    else
                        $(a1).attr('href', item1.href);

                    if (item1['click'] != undefined)
                        $(a1).click(item1['click']);

                    $(li1).append(a1);

                    if (item1.roles == undefined)
                        $(ul1).append(li1)
                    else
                    if (app.checkRoles(item1.roles))
                        $(ul1).append(li1)

                }
                $(li0).append(ul1)
            }
            if (item0.roles == undefined)
                $(ul).append(li0)
            else
            if (app.checkRoles(item0.roles))
                $(ul).append(li0)
        }
        
        
        
        $(ul).append(
                $('<li>')
                    .addClass('dropdown windows-list')
                    .append(
                        $('<a>')
                            .addClass('dropdown-toggle')
                            .attr({'data-toggle': 'dropdown', href: '#'})
                            .text('Окна')
                            .append($('<b>').addClass('caret'))
                            .click(app.windows.update_list),
                        $('<ul>')
                            .addClass('dropdown-menu')
                ),
                $('<li>')
                    .append( $('<i>').addClass('ajax-loader hide app-wait-indicator') ),
                $('<li><a>')
                    .append( $('<div>').attr('id', 'menu-status') )
               )
        app.menu.status = $(ul).find('#menu-status')   
        $('.desktop-navbar .navbar-inner ul a').css('padding', '3px 10px')
    },
    statusText: function(text, type){
        if (type == undefined)
            type='info'
        
        $(app.menu.status)
                .html('')
                .append(
                    $('<span>')
                        .text(text)
                        .addClass('label label-' + type)
                        
                )
         app.menu.statusFadeOut()
    },
    statusError: function(text){
        $(app.menu.status)
                .html('')
                .append(
                    $('<span>')
                        .text(text)
                        .addClass('label label-important')
                        
                )
         app.menu.statusFadeOut(8000)
    },
    statusFadeOut: function(time){
        if (time == undefined)
            time = 4000
        __s = $(app.menu.status)
                .find('span')
        
                .animate({opacity: 0}, time)
    },
    statusSuccess: function(text){
        $(app.menu.status)
                .html('')
                .append(
                    $('<span>')
                        .text(text)
                        .addClass('label label-success')                
                )
                    app.menu.statusFadeOut()
    },
    statusInfo: function(text){
        $(app.menu.status)
                .html('')
                .append(
                    $('<span>')
                        .text(text)
                        .addClass('label label-info')                
                )
                    app.menu.statusFadeOut()
    },
    statusWarning: function(text){
        $(app.menu.status)
                .html('')
                .append(
                    $('<span>')
                        .text(text)
                        .addClass('label label-warning')                
                )
                    app.menu.statusFadeOut()
    },
    statusClear: function(text){
        $(app.menu.status)
                .html('')
    },
    
}

app.menu = app_menu
