app_model = {
    findUrl: 'Tools/find',
    saveUrl: 'Tools/save',
    deleteUrl: 'ajaxDelete',
    add: function(prm1, prm2) {


        models = []

        if (typeof prm1 == 'string')
            models.push([prm1, prm2])
        else 
            models = prm1
        
        for (mi = 0; mi < models.length; mi++) {
            modelName = undefined
            addOptions = undefined
            
            if (typeof models[mi] == 'string'){
                modelAlias = models[mi]
            } else {
                modelAlias = models[mi][0]
                if (models[mi][1] != undefined)
                    addOptions = models[mi][1]
            }
                

            __options = []
            if (addOptions != undefined)
                __options = addOptions

            if (__options.primaryKey == undefined)                
                __options['primaryKey'] = 'id'
            
            if (__options.grants == undefined)
                __options.grants = {select: undefined, delete: undefined, update: undefined}
              
            
            if (__options.modelName == undefined)                
                modelName = modelAlias
            else
                modelName = __options.modelName
            
            app[modelAlias] = {
                primaryKey: __options.primaryKey,
                data: undefined,
                conditions: __options.conditions,
                grants: __options.grants,
                modelName: modelName,
                data: undefined,
                id: undefined,
                setId: function(id){
                    this.id = id;
                    return this;
                },
                delete: function(callback){
                    if (this.grants.delete != undefined)
                       if (!app.checkRoles(this.grants.delete))
                           return app.accessIsDeniedStatus('Not grants for delete')
            
                    if (
                            this.id == undefined || 
                            this.primaryKey == undefined
                    ) return false;
                    app.model.delete(this.modelName, this.id, callback)
                },
                find: function(options, findType, ___callback) {
                   
                   if (this.grants.select != undefined)
                       if (!app.checkRoles(this.grants.select))
                           return app.accessIsDeniedStatus('Not grants for select')
                   
                   
                   if (this.conditions != undefined){
                           if (options == undefined)
                               options = {}
                           
                           if (options.conditions == undefined)
                               options.conditions = this.conditions
                           else
                               options.conditions = _.union(this.conditions, options.conditions)
                       }
                      // app.log(options)
                    find_data = app.model.find(this.modelName, options, findType, ___callback)

                    if (find_data != undefined)
                        if (find_data.data != undefined) {
                            this.data = find_data.data
                            return this.data
                        }
                },
                save: function(__prm1, __prm2) {
             if (this.grants.update != undefined)
                       if (!app.checkRoles(this.grants.update))
                           return app.accessIsDeniedStatus('Not grants for select')
            
            
                    _data = undefined
                    _callback = undefined
                    if (typeof __prm1 == 'object')
                        _data = __prm1

                    if (typeof __prm2 == 'function')
                        _callback = __prm2
                    if (_data != undefined)
                        if (_data[this.modelName] != undefined)
                            if (_data[this.modelName].id == undefined)
                                _data[this.modelName].id  = -1
                    return app.model.save(this.modelName, {data: _data}, _callback)

                    // if (prm2)
                },
                field: function(field, callback){
                    if (this.grants.select != undefined)
                       if (!app.checkRoles(this.grants.select))
                           return app.accessIsDeniedStatus('Not grants for select')
                   
                   if (this.id == undefined) return
                   
                   d = app.model.find(this.modelName, {
                       recursive: -1,
                       conditions: this.modelName + '.' + this.primaryKey + '=' + this.id,
                       fields: ['id', field]
                           },
                       'first',
                       
                       callback
                    )
                   if (callback == undefined) {
                       if (d['data'][this.modelName][field] != undefined)
                           return d['data'][this.modelName][field]
                   }
                },
                saveField: function(field, value, callback){
            if (this.grants.update != undefined)
                       if (!app.checkRoles(this.grants.update))
                           return app.accessIsDeniedStatus('Not grants for select')
            
                      if (this.id == undefined) return false;
                      data = {}
                      data[this.modelName] = {}
                      data[this.modelName][this.primaryKey] = this.id
                      data[this.modelName][field] = value
                      app.log(data)
                      return app.model.save(this.modelName, {
                          data: data
                      }, callback)
                },
                
                /*
                 * id, callback
                 * id = 123
                 * read()
                 * read(12)
                 * read(func)
                 * read(14, func)
                 */
                read: function(read_prm1, read_prm2) {
                    id = this.id
                    callback = undefined
                    
                    
                    if (typeof read_prm1 == 'string' || typeof read_prm1 == 'number')                       
                           id = read_prm1
                           
                    if (typeof read_prm2 == 'string' || typeof read_prm2 == 'number')                       
                           id = read_prm2
                           
                    if (typeof read_prm2 == 'function')
                        callback = read_prm2
                    
                    if (typeof read_prm1 == 'function')
                        callback = read_prm1
  
                    
                    if (id != undefined) {
                        
                        conditions = []
                        conditions.push( this.modelName + '.' + this.primaryKey + '=' + id )
                        find_data = app.model.find(this.modelName, {conditions: conditions, recursive: -2}, 'first', callback)

                        if (find_data != undefined)
                            if (find_data.data != undefined) {
                                this.data = find_data.data
                                return this.data
                            }
                    }
                },
                
                create: function() {
                    this.id = undefined;
                    return this;
                }
            }
        }




    },
    find: function(modelName, prm2, prm3, prm4) {
        options_ = undefined
        findType = 'all'
        callback = undefined

        if (prm2 == undefined && prm3 == undefined && prm4 == undefined) {

        }


        if (typeof prm2 == 'object')
            options_ = prm2
        if (typeof prm3 == 'object')
            options_ = prm3
        if (typeof prm4 == 'object')
            options_ = prm4

        if (typeof prm2 == 'string')
            findType = prm2
        if (typeof prm3 == 'string')
            findType = prm3
        if (typeof prm4 == 'string')
            findType = prm4

        if (typeof prm2 == 'function')
            callback = prm2

        if (typeof prm3 == 'function')
            callback = prm3

        if (typeof prm4 == 'function')
            callback = prm4


        app.wait()
        result_data = null;

        postData = {
            data: {
                findType: findType,
                modelName: modelName,
                options: options_
            }
        }

        if (callback == undefined) {
            $.ajax({
                type: 'POST',
                async: false,
                cache: false,
                timeout: 30000,
                url: app.baseUrl + '/' + app.model.findUrl,
                data: postData,
                success: function(data) {
                    app.resume()
                    result_data = data
                }
            })
            return result_data
        } else {
            $.post(
                    app.baseUrl + '/' + app.model.findUrl,
                    postData,
                    function(data) {
                        app.resume()
                        callback(data)
                    }
            )
        }
    },
    
   
    delete: function(modelName, idKey, callback){
        app.wait();
        data4del = {};
        data4del[modelName] = {};
        data4del[modelName]['id'] = idKey;
        
       controller = (modelName.indexOf('Datum') > 0) ? modelName.replace('Datum', 'Data') : modelName + 's';
        
        $.post(
            app.baseUrl + '/' + controller + '/' + app.model.deleteUrl,
            data4del,
            function(responce){
                app.resume();
                if (responce.status == undefined)
                    app.menu.statusError(responce.msg);
                
                if (responce.status == 1)
                    app.menu.statusSuccess(responce.msg);
                
                
                if (callback != undefined)
                    callback(responce);
            }
        );
    },
    save: function(modelname, saveData, callback) {
        app.wait()
        $.post(
                app.baseUrl + '/' + app.model.saveUrl,
                {
                    data: saveData,
                    modelName: modelname
                },
        function(data) {
            app.resume()
            if (callback != undefined)
                callback(data)
        }
        )
    },
}
app.model = app_model