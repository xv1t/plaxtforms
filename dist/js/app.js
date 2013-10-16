

String.prototype.h = function() {
    return this
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
}


/*
 * HTML Special chars equivalent
 * @param {type} text
 * 
 */
function h(text) {
    if (text == null)
        return null;
    if (text == undefined)
        return null;
    return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
}

var app = {
    baseUrl: '/ldb',
    version: '2013-09-24',
    roles: [],
    testProperties: 'abc',
    moduleRoles: [],
    wait: function() {
        $('.app-wait-indicator').removeClass('hide')
    },
    //debug: false,
    debug: true,
    resume: function() {
        
        $('.app-wait-indicator').addClass('hide')
    },
    log: function(obj) {
        if (app.debug)
            console.log(obj)
    },

    openBwdPlanVectorInNewWindow: function(bwd_plan_id) {
        window.open(jobshopWebRoot + '/BwdPlans/svg/' + bwd_plan_id + '?options%5Bw%5D=1730&options%5Bh%5D=900')
    },
    stopAllForms: function() {
        $('form').attr('busy', undefined)
    },
    paginator: function(rowsPerPage, totalRows, currentPage) {
        pagesCount = Math.ceil(totalRows / rowsPerPage);
        s = $('<select>')
                .attr('data-rows-per-page', rowsPerPage)
                .attr('data-total-rows', totalRows)

        for (i = 0; i < pagesCount; i++) {
            o = $('<option>')
                    .val(i)
                    .text((i * rowsPerPage + 1) + '-' + (i + 1) * rowsPerPage)
            if (currentPage == i)
                $(o).attr('selected', true)
            $(s).append(o)
        }
        return s;

    },
    _data: {},
    _ajaxStartTime: undefined,
    _ajaxEndTime: undefined,
    _ajaxTime: undefined,
    _ajaxLength: undefined,

    assocTableItems: function(tbl_obj, items) {
        $(tbl_obj)
                .find('tbody tr')
                .each(function(ix, tr) {
            if ($(tr).attr('data-key') != undefined)
                if (items[$(tr).attr('data-key')] != undefined)
                    $(tr).data(items[$(tr).attr('data-key')])
        })
    },
    loadRoles: function() {
      
        $.ajax({
            type: 'POST',
            async: false,
            cache: false,
            timeout: 30000,
            url: app.baseUrl + '/Roles/get',
            success: function(data) {
                app.roles = data
            }
        })
    },
    accessIsDenied: function(s) {
        if (s == undefined)
            s = 'Access is denied'
        alert('Нет доступа: ' + s)
        return false;
    },
    accessIsDeniedStatus: function(s) {
        if (s == undefined)
            s = 'Access is denied'
        app.menu.statusError(s)
        return false;
    },
    checkRoles: function(options) {

        roles = []
        if (typeof options == 'object')
            roles = options
        else
            roles = [options]

        if (app.roles == undefined)
            return false;
        if (app.roles.length == 0)
            return false;
        if (roles == undefined)
            return false
        if (roles.length == 0)
            return false

        for (ii = 0; ii < roles.length; ii++)
            for (jj = 0; jj < app.roles.length; jj++)
                if (roles[ii] == app.roles[jj] || app.roles[ii] == JOBSHOP_ROLE_ADMIN)
                    return true

        return false;
    },
    iAdmin: function() {
        return app.checkRoles([JOBSHOP_ROLE_ADMIN]);
    },
    toDataTable: function(selector, parameters) {

        if (parameters == undefined)
            parameters = {};
        if (parameters.sScrollY == undefined)
            parameters.sScrollY = '400px';
        if (parameters.bInfo == undefined)
            parameters.bInfo = false;
        if (parameters.bAutoWidth == undefined)
            parameters.bAutoWidth = true;
        if (parameters.bFilter == undefined)
            parameters.bFilter = false;
        if (parameters.bLengthChange == undefined)
            parameters.bLengthChange = false;
        if (parameters.bPaginate == undefined)
            parameters.bPaginate = false;
        

        

        if (parameters.dbTable = !undefined && parameters.dbRoles != undefined) {
            /*
             */
            $(selector).find('tbody input[type="number"]').numeric()
            /*
             * Если таблица для редактирования таблицы базы данных
             * <table model='CalculationDatum' primary-key='id'>
             *   <tr data-id='<%=item.CalculationDatum.id%>'>
             */
            if (app.checkRoles(parameters.dbRoles))
                //Ищем элементы форм ввода
                $(selector)
                        .find('tbody input')
                        .on('focus', function() {
                            $(this).attr('oldvalue', $(this).val())
                            $(this).closest('tr').setSelected();
                        }
                        )
                 .on('blur', function() {
                    input = this
                    if ($(input).val() != $(input).attr('oldvalue')) {
                        modelName = $(input).closest('table').attr('model')
                        primaryKey = $(input).closest('table').attr('primary-key')
                        field = $(input).attr('data-field')
                        id = $(input).closest('tr').attr('data-id')
                        
                        app[modelName].id = id
                        app[modelName].saveField(field, $(input).val(),function(data) {
                            $(input).removeClass('post')
                            if (data.status == 'saved') {
                                $(input).css({backgroundColor: "#62c462"})
                                app.menu.statusSuccess('Saved')
                            } else {
                                $(input).css({backgroundColor: "red"})
                                $(input).val( $(input).attr('oldvalue') )
                                app.menu.statusError(data.msg)
                            }
                            $(input).animate({backgroundColor: "transparent"}, 3000);
                        })

                    }
                })
                .end()
            .find('tbody select')
                .change(function(){
                        select = this
                        modelName = $(select).closest('table').attr('model')
                        primaryKey = $(select).closest('table').attr('primary-key')
                        field = $(select).attr('data-field')
                        id = $(select).closest('tr').attr('data-id')
                        
                        app[modelName].id = id
                        app[modelName].saveField(field, $(select).val(),function(data) {
                            $(select).removeClass('post')
                            if (data.status == 'saved') {
                                $(select).css({backgroundColor: "#62c462"})
                                app.menu.statusSuccess('Saved')
                            } else {
                                $(select).css({backgroundColor: "red"})
                                app.menu.statusError(data.msg)
                            }
                            $(select).animate({backgroundColor: "transparent"}, 3000);
                        })
                })
            else {
                $(selector)
                        .find('tbody input').attr('disabled')
            }
        }
        parameters.oLanguage = {}
        parameters.oLanguage["sEmptyTable"] = 'Нет данных для отображения'
        
        if (parameters.onRightClick != undefined)
            {
                
                tr_filter = ''
            if (parameters.rowSelectFilter != undefined)
                tr_filter = parameters.rowSelectFilter
            
                $(selector).find('tbody tr' + tr_filter + ' td:first-child').each(function(iix, itr){
                    $(itr).bind('contextmenu', function(e){
                    parameters.onRightClick.call($(itr).closest('tr'))
                                e.preventDefault();
                                //code
                                return false;
                            });
                })
                        
                        
            }


        if (parameters.onRowDblClick != undefined)
        {
            tr_filter = ''
            if (parameters.rowSelectFilter != undefined)
                tr_filter = parameters.rowSelectFilter
            $(selector).find('tbody tr' + tr_filter).dblclick(parameters.onRowDblClick)
        }
        if (parameters.onRowSelect != undefined)
        {
            tr_filter = ''
            if (parameters.rowSelectFilter != undefined)
                tr_filter = parameters.rowSelectFilter
            $(selector).find('tbody tr' + tr_filter).click(function() {
                tr = this
                if (!$(tr).hasClass('selected_row')) {
                    $(tr).setSelected()
                    parameters.onRowSelect.call(tr)
                }
            })
            if (parameters.selectFirstRow != undefined)
                $(selector).find('tbody tr' + tr_filter + ':first').click()

            if (parameters.selectedRowById != undefined && parameters.primaryKeyAttr != undefined)
                $(selector).find('tbody tr[' + parameters.primaryKeyAttr + '=' + parameters.selectedRowById + ']').click()
        }

        tbl = $(selector).dataTable(parameters);

        /* Check if table in the bootstrap tab-pane*/
        _dataTablesWrapper = '#' + $(tbl).closest('.dataTables_wrapper').attr('id')
        _tab_pane = $(_dataTablesWrapper).closest('.tab-pane')
        if ($(_tab_pane).length == 1) {
            _tabbable = $(_tab_pane).closest('.tabbable');
            tab_pane_id = $(_tab_pane).attr('id')

            //Find nav link for id
            $(_tabbable)
                    .find(' .nav.nav-tabs a[href="#' + tab_pane_id + '"]')
                    .on('shown', function() {
                // app.log('shown')
                var table = $.fn.dataTable.fnTables(true);
                // app.log(table);
                if (table.length > 0) {
                    $(table).each(function(ix, o) {
                        $(o).dataTable().fnAdjustColumnSizing();
                    })
                }
            })
        }
        var table = $.fn.dataTable.fnTables(true);
        if (table.length > 0) {
            $(table).each(function(ix, o) {
                $(o).dataTable().fnAdjustColumnSizing();
            })
        }
        return tbl;
    },
    unloadTemplates: function() {

    },
    loadTemplate: function(templateName, templateId) {
        if ($('#' + templateId).length == 0)
        {
            if (app.debug)
                app.log('Load template: ' + templateName + ' (#' + templateId + ')')
            // $('#' + templateId).remove();

            $.ajax({
                type: 'POST',
                async: false,
                cache: false,
                timeout: 30000,
                data: {
                    template: templateName
                },
                url: app.baseUrl + '/Tools/template',
                success: function(templateHtml) {
                    //app.log(templateHtml);
                    $('head').append(
                            $('<script>')
                            .attr('id', templateId)
                            .attr('template', templateName)
                            .attr('type', 'text/html')
                            .html('<!--' + templateName + ' START-->' + "\n" + templateHtml + "\n" + '<!--' + templateName + ' END-->')
                            ) /**/
                }
            });
        } else {
            if (app.debug)
                app.log('Template ' + templateId + ' allready loaded')
        }
        return $('#' + templateId).html();
    },
    applyTemplate: function(obj, template_id, parameters) {
        $(obj).html(_.template($('#' + template_id).html(), parameters))
    },
    loadAndApplyTemplate: function(obj, templateUrl, template_id, parameters) {
        app.loadTemplate(templateUrl, template_id);
        app.applyTemplate(obj, template_id, parameters);
    },
    renderTemplate: function(templateUrl, template_id, parameters) {
        app.loadTemplate(templateUrl, template_id);
        return _.template($('#' + template_id).html(), parameters)
    },
    ajaxLoaderTemplate: function() {
        return app.renderTemplate('ajax-loader', 'template-ajax-loader', {})
    },
    findAndCount: function(modelname, options, findType) {
        if (app.moduleDeny())
            return app.accessIsDenied('Нет доступа к модулю')
        if (app.debug)
        {
            app.log('findAndCount.AJAX::start');
            app.log('modelName: ' + modelname)
            app.log(options)
            app.log('findType: ' + findType)
        }
        app._data = {}
        app._ajaxStartTime = new Date().getTime();
        app._ajaxLength = 0;
        app.wait();
        $.ajax({
            type: 'POST',
            async: false,
            cache: false,
            timeout: 30000,
            url: this.baseUrl + '/Tools/findAndCount',
            data: {
                data: {
                    modelName: modelname,
                    findType: findType,
                    options: options
                }
            },
            error: function() {
                app.log('AJAX::error');
            },
            success: function(data) {
                app._ajaxEndTime = new Date().getTime();
                app._ajaxLength = data.length;
                app.log('AJAX::success');
                app._data = data;
                app.log(app._data)
            }
        });
        app._ajaxTime = app._ajaxEndTime - app._ajaxStartTime
        app.log('AJAX::time ' + (app._ajaxTime / 1000) + 's');
        rows = 0;
        if (app._data.data != undefined) {
            // if ($.isArray(app._data.data))
            if (Object.prototype.toString.call(app._data.data) === '[object Array]')
                rows = app._data.data.length;
            else
            {
                rows = 1;
            }

        }

        app.log('DATA::rows ' + rows);
        app.log('DATA::size ' + (app._ajaxLength / 1024).toFixed(2) + ' KB');
        app.resume();
        return app._data;

    },
    saveAll: function(modelname, saveData) {
        if (app.moduleDeny())
            return app.accessIsDenied('Нет доступа к модулю')
        if (saveData.length == 0)
            return false;

        app.log('saveAll[' + modelname + ']. Data')
        app.log(saveData);
        app.wait()
        $.ajax({
            type: "POST",
            url: app.baseUrl + '/Tools/saveAll',
            data: {savedata: saveData, modelName: modelname},
            success: function(data) {
                adata = data
                app.log(adata);
                if (adata.status == 'saved') {
                    app.log('Saved')
                }
                if (adata.status == 'error') {
                    alert('Error save record')
                }

                app.resume();
            }
        })
    },
    now: function() {
        result = null;
        $.ajax({
            type: 'POST',
            async: false,
            cache: false,
            timeout: 30000,
            url: this.baseUrl + '/Tools/now',
            success: function(data) {
                result = data.data
            }
        })
        return result;
    },
    Now: function(mask) {
        _s = new Date()
        _mask = 'isoDate'
        if (mask != undefined)
            _mask = mask;

        return _s.format(_mask)
    },
    save: function(modelname, saveData, callback) {
        if (app.moduleDeny())
            return app.accessIsDenied('Нет доступа к модулю')
        app.log('save[' + modelname + ']. Data')
        app.log(saveData);
        app.wait()

        if (saveData.data[modelname]['id'] == undefined)
            saveData.data[modelname]['id'] = -1

        $.ajax({
            type: "POST",
            url: app.baseUrl + '/Tools/save',
            data: {data: saveData, modelName: modelname},
            success: function(data) {
                adata = data
                app.log(adata);
                if (adata.status == 'saved') {
                    app.log('Saved')
                }
                if (adata.status == 'error') {
                    alert('Error save record')
                }

                if (callback != undefined)
                    callback(adata)

                app.resume();
            }
        })
    },
    del: function(modelname, id, callback) {
        adata = null;
        data4del = {}
        data4del[modelname] = {}
        data4del[modelname]['id'] = id

        controller = null;

        if (modelname.indexOf('Datum') > 0) {
            controller = modelname.replace('Datum', 'Data')
        } else
            controller = modelname + 's'

        app.log('ajaxDelete')
        app.log(data4del)
        $.ajax({
            type: 'POST',
            async: callback != undefined,
            cache: false,
            timeout: 30000,
            url: app.baseUrl + '/' + controller + '/ajaxDelete',
            data: data4del,
            success: function(data) {
                if (callback != undefined)
                    callback(data)
                else
                    adata = data
            }
        })
        return adata;
    },
    find: function(modelname, options, findType, callback) {
        if (app.moduleDeny())
            return app.accessIsDenied('Нет доступа к модулю')
        if (app.debug)
        {
            app.log('find.AJAX::start');
            app.log('modelName: ' + modelname)
            app.log(options)
            app.log('findType: ' + findType)
        }
        app._data = {}
        app._ajaxStartTime = new Date().getTime();
        app._ajaxLength = 0;
        findComment = null
        if (options.comment != undefined)
            findComment = options.comment
        app.wait();
        $.ajax({
            type: 'POST',
            async: callback != undefined,
            cache: false,
            timeout: 30000,
            url: this.baseUrl + '/Tools/find/find:' + findComment,
            data: {
                data: {
                    modelName: modelname,
                    findType: findType,
                    options: options
                }
            },
            error: function() {
                app.log('AJAX::error');
            },
            success: function(data) {
                app._ajaxEndTime = new Date().getTime();
                app._ajaxLength = data.toString().length;
                if (app.debug)
                    app.log('AJAX::success');

                app._data = data;

                if (callback != undefined)
                {

                    callback(data)
                    app._ajaxTime = app._ajaxEndTime - app._ajaxStartTime
                    if (app.debug)
                        app.log('AJAX::time ' + (app._ajaxTime / 1000) + 's');

                    rows = 0;
                    if (app._data.data != undefined) {
                        // if ($.isArray(app._data.data))
                        if (Object.prototype.toString.call(app._data.data) === '[object Array]')
                            rows = app._data.data.length;
                        else
                        {
                            rows = 1;
                        }

                    }
                    if (app.debug) {
                        app.log('DATA::size ' + (app._ajaxLength / 1024).toFixed(2) + ' KB');
                    }
                    app.resume();
                }

                if (app.debug)
                    app.log(data)

            }
        });
        if (app._data.data == undefined) {
            app.resume()
            return {data: undefined}
        }
        ;
        app._ajaxTime = app._ajaxEndTime - app._ajaxStartTime
        if (app.debug)
            app.log('AJAX::time ' + (app._ajaxTime / 1000) + 's');

        rows = 0;
        if (app._data.data != undefined) {
            // if ($.isArray(app._data.data))
            if (Object.prototype.toString.call(app._data.data) === '[object Array]')
                rows = app._data.data.length;
            else
            {
                rows = 1;
            }

        }
        if (app.debug) {
            app.log('DATA::size ' + (app._ajaxLength / 1024).toFixed(2) + ' KB');
        }
        app.resume();
        return app._data;

    },
    findFlatten: function(modelname, options, findType, callback) {
        if (app.moduleDeny())
            return app.accessIsDenied('Нет доступа к модулю')
        app.log('AJAX::start');
        app._data = {}
        app._ajaxStartTime = new Date().getTime();
        app._ajaxLength = 0;
        app.wait();
        $.ajax({
            type: 'POST',
            async: callback != undefined,
            cache: false,
            timeout: 30000,
            url: this.baseUrl + '/Tools/findFlatten',
            data: {
                data: {
                    modelName: modelname,
                    findType: findType,
                    options: options
                }
            },
            error: function() {
                app.log('AJAX::error');
            },
            success: function(data) {
                app._ajaxEndTime = new Date().getTime();
                app._ajaxLength = data.length;
                app.log('AJAX::success');
                app._data = data;
                if (callback != undefined)
                {
                    callback(data)
                    app._ajaxTime = app._ajaxEndTime - app._ajaxStartTime
                    app.log('AJAX::time ' + (app._ajaxTime / 1000) + 's');
                    rows = 0;
                    if (app._data.data != undefined) {
                        // if ($.isArray(app._data.data))
                        if (Object.prototype.toString.call(app._data.data) === '[object Array]')
                            rows = app._data.data.length;
                        else
                        {
                            rows = 1;
                        }

                    }

                    app.log('DATA::rows ' + rows);
                    app.log('DATA::size ' + (app._ajaxLength / 1024).toFixed(2) + ' KB');
                    app.resume();

                }

            }
        });
        if (app._data.data != undefined)
            return;
        app._ajaxTime = app._ajaxEndTime - app._ajaxStartTime
        app.log('AJAX::time ' + (app._ajaxTime / 1000) + 's');
        rows = 0;
        if (app._data.data != undefined) {
            // if ($.isArray(app._data.data))
            if (Object.prototype.toString.call(app._data.data) === '[object Array]')
                rows = app._data.data.length;
            else
            {
                rows = 1;
            }

        }

        app.log('DATA::rows ' + rows);
        app.log('DATA::size ' + (app._ajaxLength / 1024).toFixed(2) + ' KB');
        app.resume();
        return app._data;

    },
    reloadScript: function() {
        var fileref = document.createElement('script');
        fileref.setAttribute("type", "text/javascript");
        fileref.setAttribute("src", this.baseUrl + '/js/jobshop.app.js');
        document.getElementsByTagName("head")[0].appendChild(fileref);
    },
    makeid: function()
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 9; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    },
    moduleDeny: function() {
        return !app.checkRoles(app.moduleRoles)
    },
    moduleAccess: function() {
        return app.checkRoles(app.moduleRoles)
    },
    init: function() {
        jobshopWebRoot = app.baseUrl;
        initializeAjaxAnimation = "<img src=" + app.baseUrl + "/img/load.gif>";
        workAjaxAnimation = "<img src=" + app.baseUrl + "/img/ajax-work.gif>";
        initializeAjaxElement = initializeAjaxAnimation + " Загрузка данных...";
        workAjaxElement = workAjaxAnimation + " Обработка полученных данных...";
        app.log('app Version: ' + app.version);
        app.loadRoles()

        /* */  if (app.moduleDeny()) {

            app.accessIsDenied('Нет доступа к модулю')
            app = {}
            //alert('Access is denied')
            return
        }

        app.menu.build()
    }

};



