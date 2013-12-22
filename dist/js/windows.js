app.windows =
        {
            hWnd: undefined,
            init: function() {
                $.window.prepare({
                    dock: 'bottom', // change the dock direction: 'left', 'right', 'top', 'bottom'
                    animationSpeed: 200, // set animation speed
                    minWinLong: 180,       // set minimized window long dimension width in pixel
                    dockArea: $('.desktop-pane'),
                });
            },
            create: function(options) {
                if (options == undefined)
                    options = {};
                //checkBoundary: true,
              //  if (options.checkBoundary == undefined)
               //     options.checkBoundary = true
                if (options.showFooter == undefined)
                    options.showFooter = false
                if (options.content == undefined)
                    options.content = "<img src=" + app.baseUrl + "/img/load.gif> Загрузка данных...";
                if (options.icon == undefined)
                    options.icon = app.baseUrl + '/img/empty.gif';
                if (options.width == undefined)
                    options.width = 800;
                if (options.height == undefined)
                    options.height = 600;
                if (options.resizable == undefined)
                    options.resizable = false;
                if (options.maximizable == undefined)
                    options.maximizable = false;
                if (options.minimizable == undefined)
                    options.minimizable = false;
                //if (options.showRoundCorner == undefined) options.showRoundCorner = false;
                if (options.dock == undefined)
                    options.dock = 'bottom';
                if (options.onSelect == undefined)
                    options.onSelect = app.windows.onSelect
                //if (options.editMenu != undefined)                    
                
                  //  options.onSelect = app.windows.onSelect
                  
                options.afterCascade = function(wnd){
                    var table = $.fn.dataTable.fnTables(true);
                // app.log(table);
                    if (table.length > 0) {
                        $(table).each(function(ix, o) {
                            $(o).dataTable().fnAdjustColumnSizing();
                        })
                    }
                }
                options.afterMaximize = function(wnd){
                    
                    $('#' + wnd.getWindowId(wnd)).css('margin-top', 25)
                    var table = $.fn.dataTable.fnTables(true);
                // app.log(table);
                    if (table.length > 0) {
                        $(table).each(function(ix, o) {
                            $(o).dataTable().fnAdjustColumnSizing();
                        })
                    }
                }
                hWnd = $.window(options);
                app.windows.hWnd = hWnd
                //app.windows.id = '#' + hWnd.getWindowId()

                app.windows.prepareWindow(hWnd);
                return hWnd;

            },
            /*
             * Return a id of Top(current, selected) window
             * @returns {String}
             */
            id: function() {
                if ($.window.getSelectedWindow() == undefined) return undefined;
                return $('#' + $.window.getSelectedWindow().getWindowId())
            },
            onUnselect: function() {

            },
            onSelect: function(wnd) {
                app.windows.hWnd = $.window.getSelectedWindow()

            },
            getId: function(_w) {
                if (_w.getWindowId != undefined)
                    return '#' + _w.getWindowId();
                else
                    return null
            },
            findByAttr: function(query)        {
                q_str = ''
                for (key in query){
                    q_str += '[' +  key + '="' + query[key] + '"]';
                }
                return $('.window_panel' + q_str)
            },
            isOpen: function(attr){
                return app.windows.findByAttr(attr).length > 0
            },
                    
            isOpenThenShow: function(attr){
                _w = app.windows.findByAttr(attr)
                if (_w.length > 0) {
                    app.windows.show('#' + $(_w).attr('id'))
                    return true
                }
                return false
            },
                    
            setWindowIcon: function(hWnd, iconClass) {
                $('#' + hWnd.getWindowId() + ' .window_header .window_title_icon').
                        replaceWith('<i class="' + iconClass + '"> </i> <img  src="' + app.baseUrl + '/img/empty.gif" class=window_title_icon width=22 onload="javascript:$.Window._iconOnLoad(this);">')
            },
            show: function(id) {
                $('.window_panel').css('z-index', 2000);
                win = $.window.getWindow($(id + '.window_panel.ui-state-disabled').attr('id'))

                if (win != undefined)
                    win.restore();

                $(id + '.window_panel').css('z-index', 2002);
            },
            getMyWindow: function() {
                return $(this).closest('.window_panel')
            },
            getMyWindowH: function() {
                return $.window.getWindow($(this).closest('.window_panel'))
            },
            openedCalculations: function() {
                calculations = new Array()
                $('.window_panel[formclass=Calculation]')
                        .each(function(ix, win) {
                    calculations.push({
                        formclass: 'Calculation',
                        window_id: $(win).attr('id'),
                        calculation_id: $(win).attr('calculation_id'),
                        caption: $(win).find('.window_title_text').text()
                    })
                })
                return calculations;
            },
            openedOrders: function() {
                calculations = new Array()
                $('.window_panel[formclass=Order]')
                        .each(function(ix, win) {
                    calculations.push({
                        formclass: 'Order',
                        window_id: $(win).attr('id'),
                        order_id: $(win).attr('order_id'),
                        caption: $(win).find('.window_title_text').text()
                    })
                })
                return calculations;
            },
            /*
             * Назначение класса выделения строки в таблице
             * остальные строки снимаются с выделения
             */
            reselectedTableRow: function(tr) {
                $(tr)
                        .closest('tbody')
                        .find('tr.selected_row')
                        .removeClass('selected_row')

                $(tr).addClass('selected_row')
            },
            top: function() {
                win = undefined
                $('.window_panel').each(function() {
                    if ($(this).css('z-index') == 2002)
                        win = this
                })
                return win
            },
            update_list: function() {
                $('.windows-list ul').html('');
                $('.window_title_text').each(function(ix, t) {
                    win_id = $(t).closest('.window_panel')
                    icon = $(win_id).find(' .window_header img.window_title_icon')

                    caption = $(t).text()
                    $('.windows-list ul').append(
                            $('<li>').append(
                            $('<a>')
                            .text(caption)
                            .attr('win_id', $(win_id).attr('id'))
                            .attr('href', '#')
                            .click(function() {
                        app.windows.show('#' + $(this).attr('win_id'))
                    })
                            )
                            )
                })
            },
            initializeMenu: function() {
                app.log('initializeMenu');

                $('#ClientsNodesPoint').contextMenu('ClientsNodes_menu', {
                    menuStyle: {
                        width: 'auto'
                    },
                    bindings: {
                        'addClient': function(t) {

                            name = prompt('Введите имя клиента')

                            app.log('name: ' + name + ' l= ' + name.length)

                            if (name != undefined && name.length > 2) {
                                if (confirm('Добавить нового клиента?')) {
                                    alert('Заявка на добавление отправлена в систему')
                                }
                            }
                            //alert('Trigger was '+t.id+'\nAction was Open');
                        }

                    }
                })


                $('#jqContextMenu').css('z-index', 3000);
                $('#jqContextMenu').css('width', 250);
            },
            setWindowIcon: function(hWnd, iconClass) {
                $('#' + hWnd.getWindowId() + ' .window_header .window_title_icon').
                        replaceWith('<i class="' + iconClass + '"> </i> <img  src="' + app.baseUrl + '/img/empty.gif" class=window_title_icon width=22 onload="javascript:$.Window._iconOnLoad(this);">')
            },
            prepareWindow: function(hWnd) {
                window_id = hWnd.getWindowId();
                
                $("#" + window_id + ' .window_header').removeClass('ui-widget-header').addClass('window_header_gradient');
                $('#' + window_id + ' .window_footer').css('background-color', 'white');
                $('#' + window_id + ' .ui-widget-content').removeClass('ui-widget-content');

                return hWnd
            },
            logWindow: undefined,
        }

app.windows.init();