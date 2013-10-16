/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

app.dictionaries = {
        add: function(dictionaryName, flatten_items){
            app.log('load dictionry: ' + dictionaryName)
            app.dictionaries[dictionaryName] = flatten_items;
        },
        booleans: {
            true : 'true',
            false: 'false',
        },
        loadDistributors: function(){
            if (app.dictionaries['distributors'] == undefined)
                app.dictionaries.add('distributors', app.find('Distributor', {}, 'list').data);
        },
        loadBysoftClients: function(){
            if (app.dictionaries['bysoft_clients'] == undefined)
                app.dictionaries.add('bysoft_clients', app.find('BysoftKStammEintrag', {order: 'BysoftKStammEintrag.Code'}, 'list').data);
        },
        loadBysoftMaterials: function(){
            if (app.dictionaries['bysoft_materials'] == undefined)
                app.dictionaries.add('bysoft_materials', app.find('BysoftWStammEintrag', {order: 'BysoftWStammEintrag.Code'}, 'list').data);
        },
        loadMaterials: function(){
            if (app.dictionaries['materials'] == undefined)
                app.dictionaries.add('materials', app.find('Material', {order: 'Material.name'}, 'list').data);
        },
        loadMachines: function(){
            if (app.dictionaries['machines'] == undefined)
                app.dictionaries.add('machines', app.find('Machine', {order: 'Machine.name'}, 'list').data);
        },
        loadMachinesLaserCutting: function(){
            if (app.dictionaries['machines_laser_cutting'] == undefined)
                app.dictionaries.add('machines_laser_cutting', app.find('Machine', {order: 'Machine.name', conditions: {'Machine.laser_cutting': 1}}, 'list').data);
        },
        loadCostCutting: function(){
            if (app.dictionaries['cost_cut_minute'] == undefined){
                app.dictionaries.cost_cut_minute = app.find('CalculationDatum', {
                    fields: 'CalculationDatum.cost_cut_minute',
                    recursive: -1,
                    group: 'CalculationDatum.cost_cut_minute'
                }).data;
            }
        },
        loadPlanStatuses: function(){
            if (app.dictionaries['plan_statuses'] == undefined){
                app.dictionaries.plan_statuses = app.find('PlanStatus', {
                    fields: 'PlanStatus.name',
                    recursive: -1
                }, 'list').data;
            }
        },
        loadCostBending: function(){
            if (app.dictionaries['cost_bending_minute'] == undefined){
                app.dictionaries.cost_bending_minute = app.find('CalculationDatum', {
                    fields: 'CalculationDatum.cost_bending_minute',
                    recursive: -1,
                    group: 'CalculationDatum.cost_bending_minute'
                }).data;
            }
        },
        loadThickness: function(){
            if (app.dictionaries['thickness'] == undefined)
                {
                    app.dictionaries.thickness = app.find('BysoftJob', {
                        recursive: -1,
                        fields: 'format(Dicke, 2) as Thickness',
                        group: 'Dicke',
                        order: 'Dicke'
                    }).data;
                
                }
        },
        toSelect: function(dictionaryName){
           if (app.dictionaries[dictionaryName] != undefined){
                sel = $('<select>')
                    .attr('data-dictionary', dictionaryName)
                    .append(
                        $('<option>')
                    )

                for (index in app.dictionaries[dictionaryName]){
                    
                    key = null;
                    value = null;
                    
                    switch (dictionaryName){
                        case 'thickness':
                                key = app.dictionaries[dictionaryName][index][0]['Thickness']
                                value = key
                            break;
                        case 'cost_cut_minute'    :
                                key = app.dictionaries[dictionaryName][index].CalculationDatum.cost_cut_minute
                                value = key
                            break;
                        case 'cost_bending_minute'    :
                                key = app.dictionaries[dictionaryName][index].CalculationDatum.cost_bending_minute
                                value = key
                            break;
                        default:
                                key = index
                                value = app.dictionaries[dictionaryName][index]
                            break;
                    }

                    
                    
                    
                    o = $('<option>')
                            .val(key)
                            .text(value);
                    
                   // if (selectedValue == index)
                        //$(o).attr('selected', true)
                    //app.log(index)
                    $(sel).append( o )
                }
                return $(sel)
          }
        },
        getSelect: function(dictionaryName, selectName, selectedValue, selectClass, id){
            if (app.dictionaries[dictionaryName] != undefined){
                sel = $('<select>')
                    .attr('name', selectName)
                    .attr('id', id)
                    .attr('class', selectClass)
                    .append(
                        $('<option>')
                    )

                for (index in app.dictionaries[dictionaryName]){
                    
                    key = null;
                    value = null;
                    
                    switch (dictionaryName){
                        case 'thickness':
                                key = app.dictionaries[dictionaryName][index][0]['Thickness']
                                value = key
                            break;
                        case 'cost_cut_minute'    :
                                key = app.dictionaries[dictionaryName][index].CalculationDatum.cost_cut_minute
                                value = key
                            break;
                        case 'cost_bending_minute'    :
                                key = app.dictionaries[dictionaryName][index].CalculationDatum.cost_bending_minute
                                value = key
                            break;
                        default:
                                key = index
                                value = app.dictionaries[dictionaryName][index]
                            break;
                    }

                    
                    
                    
                    o = $('<option>')
                            .val(key)
                            .text(value);
                    
                    if (selectedValue == index)
                        $(o).attr('selected', true)
                    //app.log(index)
                    $(sel).append( o )
                }
     
                
                return $('<div>').append(sel).html();
            }
            
        }
    }
