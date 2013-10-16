app_tables = {
    fixAll: function(){
        tables = $.fn.dataTable.fnTables(true)
        $(tables).each(function(ix,tbl){
            wrapper = $(tbl).closest('.dataTables_wrapper')
            head1 = $(wrapper).find('.dataTables_scrollHeadInner table thead')
            head2 = $(tbl).find('thead')
            //Если одна строка
            if ($(head1).find('tr').length == 1) {
                
                columns1 = $(head1).find('tr th')
                columns2 = $(head2).find('tr th')
                columns_count = $(columns1).length
                app.log(columns1)
                app.log(columns2)
                for (i=0;i<columns_count;i++){
                    th1 = columns1[i]
                    th2 = columns2[i]
                    app.log( $(th1).outerWidth() + ' --==--' +  $(th2).outerWidth())
                    $(th1).outerWidth($(th2).outerWidth())
                }
            }
        })
    }
}

app.tables = app_tables